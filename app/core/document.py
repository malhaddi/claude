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
        # Stack of (page_index, annot_xref) for undo of the last N annotations.
        self._undo_stack: list[tuple[int, int]] = []

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

    # ----- annotations (Phase 2) ------------------------------------------
    def add_highlight(self, index: int, rect, color=(1.0, 0.85, 0.0)) -> None:
        """Highlight the text under a rectangle (PDF-point coords)."""
        page = self._doc[index]
        annot = page.add_highlight_annot(fitz.Rect(rect))
        annot.set_colors(stroke=color)
        annot.update()
        self._track(index, annot)

    def add_underline(self, index: int, rect, color=(0.85, 0.1, 0.1)) -> None:
        page = self._doc[index]
        annot = page.add_underline_annot(fitz.Rect(rect))
        annot.set_colors(stroke=color)
        annot.update()
        self._track(index, annot)

    def add_text_box(
        self, index: int, rect, text: str, fontsize: float = 12.0, color=(0.0, 0.0, 0.0)
    ) -> None:
        """Add an editable free-text box at rect (PDF-point coords)."""
        page = self._doc[index]
        annot = page.add_freetext_annot(
            fitz.Rect(rect), text, fontsize=fontsize, text_color=color
        )
        annot.update()
        self._track(index, annot)

    def add_ink(self, index: int, strokes, color=(0.85, 0.1, 0.1), width: float = 1.5) -> None:
        """Freehand ink. `strokes` is a list of polylines: [[(x, y), ...], ...]."""
        page = self._doc[index]
        annot = page.add_ink_annot(strokes)
        annot.set_colors(stroke=color)
        annot.set_border(width=width)
        annot.update()
        self._track(index, annot)

    def add_image(self, index: int, rect, image_path: str) -> None:
        """Stamp an image (e.g. a signature PNG) into a rectangle.

        Inserted as page content rather than an annotation, so it is not part
        of the annotation undo stack.
        """
        self._doc[index].insert_image(fitz.Rect(rect), filename=image_path)
        self.mark_dirty()

    def undo_last_annot(self) -> bool:
        """Remove the most recently added annotation. Returns False if none."""
        while self._undo_stack:
            index, xref = self._undo_stack.pop()
            page = self._doc[index]
            for annot in page.annots():
                if annot.xref == xref:
                    page.delete_annot(annot)
                    self.mark_dirty()
                    return True
        return False

    def _track(self, index: int, annot) -> None:
        self._undo_stack.append((index, annot.xref))
        self.mark_dirty()

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
