"""PDF document model — a thin, UI-agnostic wrapper around PyMuPDF (fitz).

Everything the UI does to a PDF goes through this class. Keeping all fitz
calls here means the Qt layer never touches the raw library, and later phases
(annotations, page ops, text editing) extend this one surface.
"""
from __future__ import annotations

import fitz  # PyMuPDF


class PDFDocument:
    """Wraps a single open PDF and tracks unsaved changes."""

    def __init__(self, path: str | None = None):
        self.path: str | None = path
        self._doc: fitz.Document = fitz.open(path) if path else fitz.open()
        self._dirty: bool = False

    # ----- lifecycle -------------------------------------------------------
    @classmethod
    def open(cls, path: str) -> "PDFDocument":
        return cls(path)

    @classmethod
    def blank(cls) -> "PDFDocument":
        """A new, empty one-page document."""
        doc = cls()
        doc._doc.new_page()
        doc._dirty = True
        return doc

    def close(self) -> None:
        self._doc.close()

    @property
    def is_dirty(self) -> bool:
        return self._dirty

    @property
    def page_count(self) -> int:
        return self._doc.page_count

    @property
    def fitz_doc(self) -> fitz.Document:
        """Escape hatch for features that need the raw document."""
        return self._doc

    # ----- rendering -------------------------------------------------------
    def render_page(self, index: int, zoom: float = 1.0) -> "PageImage":
        """Render a page to RGBA bytes at the given zoom (1.0 == 72 dpi)."""
        page = self._doc[index]
        matrix = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=matrix, alpha=True)
        return PageImage(
            width=pix.width,
            height=pix.height,
            stride=pix.stride,
            samples=pix.samples,
        )

    def page_size(self, index: int) -> tuple[float, float]:
        """Unscaled page size in PDF points (width, height)."""
        rect = self._doc[index].rect
        return rect.width, rect.height

    # ----- text / search ---------------------------------------------------
    def search_page(self, index: int, query: str) -> list[tuple[float, float, float, float]]:
        """Return bounding boxes (x0, y0, x1, y1) of every hit on a page."""
        if not query:
            return []
        return [tuple(r) for r in self._doc[index].search_for(query)]

    def page_text(self, index: int) -> str:
        return self._doc[index].get_text("text")

    # ----- saving ----------------------------------------------------------
    def save(self, path: str | None = None) -> str:
        """Save in place (incremental) or to a new path."""
        target = path or self.path
        if target is None:
            raise ValueError("No path to save to; provide one explicitly.")
        if target == self.path:
            self._doc.save(target, incremental=True, encryption=fitz.PDF_ENCRYPT_KEEP)
        else:
            self._doc.save(target)
            self.path = target
        self._dirty = False
        return target

    def mark_dirty(self) -> None:
        self._dirty = True


class PageImage:
    """A rendered page as raw RGBA samples, ready to hand to a QImage.

    Kept free of any Qt import so the core stays headless-testable.
    """

    __slots__ = ("width", "height", "stride", "samples")

    def __init__(self, width: int, height: int, stride: int, samples: bytes):
        self.width = width
        self.height = height
        self.stride = stride
        self.samples = samples
