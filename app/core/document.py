"""PDF document model — a thin, UI-agnostic wrapper around PyMuPDF (fitz).

Everything the UI does to a PDF goes through this class. Keeping all fitz
calls here means the Qt layer never touches the raw library, and later phases
(annotations, page ops, text editing) extend this one surface.
"""
from __future__ import annotations

from dataclasses import dataclass

import fitz  # PyMuPDF

# Map a font name reported by PyMuPDF to a base-14 standard font we can always
# render with. Embedded subset fonts usually aren't reusable, so edited text
# falls back to the closest standard face (a known, accepted limitation).
_BASE14 = {
    (False, False): "helv", (True, False): "hebo",
    (False, True): "heit", (True, True): "hebi",
}
_BASE14_SERIF = {
    (False, False): "tiro", (True, False): "tibo",
    (False, True): "tiit", (True, True): "tibi",
}
_BASE14_MONO = {
    (False, False): "cour", (True, False): "cobo",
    (False, True): "coit", (True, True): "cobi",
}


def _base14_for(fontname: str) -> str:
    name = (fontname or "").lower()
    bold = "bold" in name or "black" in name or "heavy" in name
    italic = "italic" in name or "oblique" in name
    if any(k in name for k in ("courier", "mono", "consol")):
        return _BASE14_MONO[(bold, italic)]
    if any(k in name for k in ("times", "serif", "georgia", "roman", "minion")):
        return _BASE14_SERIF[(bold, italic)]
    return _BASE14[(bold, italic)]


def _int_to_rgb(color: int) -> tuple[float, float, float]:
    return (((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255)


def _measure_height(text: str, fontname: str, fontsize: float, width: float) -> float:
    """Estimate the height a wrapped paragraph needs inside a given width."""
    line_h = fontsize * 1.4  # generous leading so insert_textbox won't overflow
    lines = 0
    for paragraph in text.split("\n"):
        words = paragraph.split(" ")
        cur = ""
        count = 1
        for word in words:
            trial = (cur + " " + word).strip()
            if fitz.get_text_length(trial, fontname=fontname, fontsize=fontsize) <= width:
                cur = trial
            else:
                count += 1
                cur = word
        lines += count
    return max(1, lines) * line_h


@dataclass
class TextBlock:
    """An extracted paragraph: its bbox plus dominant font/size/color."""

    page_index: int
    bbox: tuple[float, float, float, float]
    text: str
    fontsize: float
    color: tuple[float, float, float]
    fontname: str
    first_baseline: float  # y of the first line's text baseline (for re-alignment)

    def contains(self, x: float, y: float) -> bool:
        x0, y0, x1, y1 = self.bbox
        return x0 <= x <= x1 and y0 <= y <= y1


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

    # ----- text editing (Phase 4) -----------------------------------------
    def get_text_blocks(self, index: int) -> list[TextBlock]:
        """Group a page's text into paragraph blocks with dominant style."""
        page = self._doc[index]
        data = page.get_text("dict")
        blocks: list[TextBlock] = []
        for block in data.get("blocks", []):
            if block.get("type", 0) != 0:  # 0 == text block; skip images
                continue
            lines: list[str] = []
            sizes: list[float] = []
            fonts: dict[str, int] = {}
            colors: dict[int, int] = {}
            first_baseline: float | None = None
            for line in block.get("lines", []):
                spans = line.get("spans", [])
                if not spans:
                    continue
                lines.append("".join(s["text"] for s in spans))
                if first_baseline is None:
                    first_baseline = spans[0]["origin"][1]
                for s in spans:
                    sizes.append(round(s["size"], 1))
                    fonts[s["font"]] = fonts.get(s["font"], 0) + len(s["text"])
                    colors[s["color"]] = colors.get(s["color"], 0) + len(s["text"])
            text = "\n".join(lines).strip("\n")
            if not text.strip():
                continue
            size = max(set(sizes), key=sizes.count) if sizes else 11.0
            font = max(fonts, key=fonts.get) if fonts else "helv"
            color_int = max(colors, key=colors.get) if colors else 0
            bbox = tuple(block["bbox"])
            blocks.append(
                TextBlock(index, bbox, text, size, _int_to_rgb(color_int), font,
                          first_baseline if first_baseline is not None else bbox[1])
            )
        return blocks

    def get_text_in_rect(self, index: int, rect) -> str:
        """Return the text contained in a rectangle (for selection/copy)."""
        return self._doc[index].get_textbox(fitz.Rect(rect)).strip()

    def text_block_at(self, index: int, x: float, y: float) -> TextBlock | None:
        """Return the paragraph block under a point (PDF coords), if any."""
        for block in self.get_text_blocks(index):
            if block.contains(x, y):
                return block
        return None

    def replace_text_block(
        self, index: int, bbox, new_text: str, fontsize: float,
        color=(0.0, 0.0, 0.0), fontname: str | None = None,
        first_baseline: float | None = None,
    ) -> None:
        """Redact the original paragraph region and write `new_text` in place.

        The new text is rendered in the closest base-14 font. The insertion box
        top is anchored so the first line's baseline matches the original text's
        baseline (font-ascender aware), keeping the replacement in place even
        when the substitute font's metrics differ. The box grows downward and
        retries if the text would overflow.
        """
        page = self._doc[index]
        rect = fitz.Rect(bbox)

        page.add_redact_annot(rect)
        try:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        except TypeError:  # older PyMuPDF without the images kwarg
            page.apply_redactions()

        face = _base14_for(fontname or "helv")
        # Anchor the box top so the first baseline lands on the original one.
        if first_baseline is not None:
            ascender = fitz.Font(face).ascender
            top = first_baseline - ascender * fontsize
        else:
            top = rect.y0
        needed = _measure_height(new_text, face, fontsize, max(rect.width, 1.0))
        bottom = top + needed + fontsize * 1.4
        max_bottom = page.rect.height - 2
        while True:
            target = fitz.Rect(rect.x0, top, rect.x1, min(bottom, max_bottom))
            leftover = page.insert_textbox(
                target, new_text, fontname=face, fontsize=fontsize, color=color, align=0
            )
            if leftover >= 0 or bottom >= max_bottom:
                break
            bottom += -leftover + fontsize * 1.4  # extend by the shortfall + slack
        self._structural_change()

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

    # ----- page operations (Phase 3) --------------------------------------
    # These change page indices, so they invalidate the annotation undo stack
    # (which is keyed by page index). Undo of page ops themselves is not
    # supported yet.
    def insert_blank_page(self, index: int, width: float | None = None,
                          height: float | None = None) -> None:
        """Insert a blank page so it becomes page number `index`.

        Size defaults to a neighbouring page, else US Letter (612x792 pt).
        """
        if width is None or height is None:
            if self.page_count:
                ref = max(0, min(index, self.page_count - 1))
                rect = self._doc[ref].rect
                width, height = rect.width, rect.height
            else:
                width, height = 612.0, 792.0
        self._doc.new_page(pno=index, width=width, height=height)
        self._structural_change()

    def insert_pdf_pages(self, index: int, other_path: str) -> int:
        """Insert all pages of another PDF starting at `index`. Returns count."""
        src = fitz.open(other_path)
        try:
            added = src.page_count
            self._doc.insert_pdf(src, start_at=index)
        finally:
            src.close()
        self._structural_change()
        return added

    def delete_page(self, index: int) -> None:
        if self.page_count <= 1:
            raise ValueError("Cannot delete the only page.")
        self._doc.delete_page(index)
        self._structural_change()

    def rotate_page(self, index: int, degrees: int) -> None:
        """Rotate a page by a relative multiple of 90 degrees."""
        page = self._doc[index]
        page.set_rotation((page.rotation + degrees) % 360)
        self._structural_change()

    def move_page(self, from_index: int, to_index: int) -> None:
        """Move the page at from_index so it lands at to_index."""
        if from_index == to_index:
            return
        # PyMuPDF's move_page(pno, to) inserts *before* position `to`; when
        # moving downward we must account for the source page's removal.
        target = to_index if to_index < from_index else to_index + 1
        self._doc.move_page(from_index, target)
        self._structural_change()

    def _structural_change(self) -> None:
        self._undo_stack.clear()
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
