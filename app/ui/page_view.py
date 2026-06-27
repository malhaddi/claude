"""Scrollable, continuous page view + interactive annotation tools.

Each page is a PageLabel that:
  * renders its page pixmap at the current zoom,
  * draws search highlights, and
  * captures mouse input for the active editing Tool (rubber-band rect for
    highlight/underline/text-box/signature, freehand polyline for ink).

Screen→PDF mapping is trivial because each label is sized exactly to its
pixmap (no centering offset): pdf_coord = widget_coord / zoom.
"""
from __future__ import annotations

from PySide6.QtCore import QPoint, QRect, Qt, Signal
from PySide6.QtGui import QColor, QPainter, QPen, QPixmap
from PySide6.QtWidgets import (
    QInputDialog,
    QLabel,
    QScrollArea,
    QVBoxLayout,
    QWidget,
)

from app.core.document import PDFDocument
from app.ui.render_bridge import page_image_to_pixmap
from app.ui.tools import Tool


class PageLabel(QLabel):
    """One rendered page; owns its interaction state for the active tool."""

    def __init__(self, index: int, view: "PageView"):
        super().__init__()
        self.index = index
        self._view = view
        self._highlights: list[tuple[float, float, float, float]] = []
        self._zoom = 1.0
        # In-progress interaction (widget coords).
        self._drag_start: QPoint | None = None
        self._drag_cur: QPoint | None = None
        self._ink_points: list[QPoint] = []
        self.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setStyleSheet("background: white; border: 1px solid #c8c8c8;")
        self.setMouseTracking(True)

    def set_highlights(self, rects, zoom: float) -> None:
        self._highlights = rects
        self._zoom = zoom
        self.update()

    def set_zoom(self, zoom: float) -> None:
        self._zoom = zoom

    # ----- mouse interaction ----------------------------------------------
    def mousePressEvent(self, event):  # noqa: N802
        if event.button() != Qt.MouseButton.LeftButton:
            return
        tool = self._view.tool
        pos = event.position().toPoint()
        if tool == Tool.INK:
            self._ink_points = [pos]
        elif tool.is_rect_drag:
            self._drag_start = pos
            self._drag_cur = pos
        self.update()

    def mouseMoveEvent(self, event):  # noqa: N802
        tool = self._view.tool
        pos = event.position().toPoint()
        if tool == Tool.INK and self._ink_points:
            self._ink_points.append(pos)
            self.update()
        elif tool.is_rect_drag and self._drag_start is not None:
            self._drag_cur = pos
            self.update()

    def mouseReleaseEvent(self, event):  # noqa: N802
        if event.button() != Qt.MouseButton.LeftButton:
            return
        tool = self._view.tool
        if tool == Tool.INK and len(self._ink_points) > 1:
            pts = [(p.x() / self._zoom, p.y() / self._zoom) for p in self._ink_points]
            self._view.commit_ink(self.index, [pts])
        elif tool.is_rect_drag and self._drag_start and self._drag_cur:
            rect = self._pdf_rect(self._drag_start, self._drag_cur)
            if rect is not None:
                self._view.commit_rect(self.index, rect)
        self._drag_start = self._drag_cur = None
        self._ink_points = []

    def _pdf_rect(self, a: QPoint, b: QPoint):
        x0, x1 = sorted((a.x(), b.x()))
        y0, y1 = sorted((a.y(), b.y()))
        if (x1 - x0) < 3 or (y1 - y0) < 3:  # ignore stray clicks
            return None
        z = self._zoom
        return (x0 / z, y0 / z, x1 / z, y1 / z)

    # ----- painting --------------------------------------------------------
    def paintEvent(self, event):  # noqa: N802
        super().paintEvent(event)
        painter = QPainter(self)

        # Search highlights.
        if self._highlights:
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(255, 215, 0, 90))
            for x0, y0, x1, y1 in self._highlights:
                painter.drawRect(
                    int(x0 * self._zoom), int(y0 * self._zoom),
                    int((x1 - x0) * self._zoom), int((y1 - y0) * self._zoom),
                )

        # In-progress rubber-band rectangle.
        if self._drag_start is not None and self._drag_cur is not None:
            painter.setBrush(QColor(80, 140, 255, 50))
            painter.setPen(QPen(QColor(40, 100, 220), 1, Qt.PenStyle.DashLine))
            painter.drawRect(QRect(self._drag_start, self._drag_cur).normalized())

        # In-progress ink stroke.
        if len(self._ink_points) > 1:
            painter.setPen(QPen(QColor(220, 25, 25), 2))
            painter.drawPolyline(self._ink_points)

        painter.end()


class PageView(QScrollArea):
    """Vertically stacked, zoomable, annotatable view of one document."""

    page_changed = Signal(int)
    annotated = Signal()  # emitted after any annotation is committed

    def __init__(self):
        super().__init__()
        self.setWidgetResizable(True)
        self.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        self.setStyleSheet("QScrollArea { background: #525659; }")

        self._container = QWidget()
        self._layout = QVBoxLayout(self._container)
        self._layout.setSpacing(12)
        self._layout.setContentsMargins(16, 16, 16, 16)
        self._layout.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        self.setWidget(self._container)

        self._doc: PDFDocument | None = None
        self._labels: list[PageLabel] = []
        self._zoom = 1.0

        # Editing state.
        self._tool = Tool.SELECT
        self._color = (0.85, 0.1, 0.1)  # default annotation color (RGB 0..1)
        self._signature_path: str | None = None

        self.verticalScrollBar().valueChanged.connect(self._emit_visible_page)

    # ----- document --------------------------------------------------------
    def set_document(self, doc: PDFDocument) -> None:
        self._doc = doc
        self._zoom = 1.0
        self._rebuild()

    @property
    def document(self) -> PDFDocument | None:
        return self._doc

    def reload(self, scroll_to: int | None = None) -> None:
        """Rebuild the page set (after structural changes) at current zoom."""
        self._rebuild()
        if scroll_to is not None:
            self.scroll_to_page(scroll_to)

    def current_page(self) -> int:
        """Index of the top-most visible page (0 if empty)."""
        if not self._labels:
            return 0
        viewport_top = self.verticalScrollBar().value()
        for label in self._labels:
            if label.y() + label.height() >= viewport_top:
                return label.index
        return 0

    # ----- tool / color state ---------------------------------------------
    @property
    def tool(self) -> Tool:
        return self._tool

    def set_tool(self, tool: Tool) -> None:
        self._tool = tool
        cursor = Qt.CursorShape.CrossCursor if tool != Tool.SELECT else Qt.CursorShape.ArrowCursor
        for label in self._labels:
            label.setCursor(cursor)

    def set_color(self, rgb: tuple[float, float, float]) -> None:
        self._color = rgb

    def set_signature_path(self, path: str) -> None:
        self._signature_path = path

    # ----- zoom ------------------------------------------------------------
    @property
    def zoom(self) -> float:
        return self._zoom

    def set_zoom(self, zoom: float) -> None:
        self._zoom = max(0.1, min(zoom, 8.0))
        self._render_all()

    def zoom_in(self) -> None:
        self.set_zoom(self._zoom * 1.25)

    def zoom_out(self) -> None:
        self.set_zoom(self._zoom / 1.25)

    def scroll_to_page(self, index: int) -> None:
        if 0 <= index < len(self._labels):
            self.ensureWidgetVisible(self._labels[index])

    # ----- search ----------------------------------------------------------
    def show_search_hits(self, query: str) -> int:
        if self._doc is None:
            return 0
        total = 0
        for label in self._labels:
            hits = self._doc.search_page(label.index, query)
            label.set_highlights(hits, self._zoom)
            total += len(hits)
        return total

    # ----- annotation commits (called by PageLabel) -----------------------
    def commit_rect(self, index: int, rect) -> None:
        if self._doc is None:
            return
        tool = self._tool
        if tool == Tool.HIGHLIGHT:
            self._doc.add_highlight(index, rect, self._color)
        elif tool == Tool.UNDERLINE:
            self._doc.add_underline(index, rect, self._color)
        elif tool == Tool.TEXTBOX:
            text, ok = QInputDialog.getMultiLineText(self, "Text Box", "Enter text:")
            if not ok or not text.strip():
                return
            self._doc.add_text_box(index, rect, text, color=self._color)
        elif tool == Tool.SIGNATURE:
            if not self._signature_path:
                return
            self._doc.add_image(index, rect, self._signature_path)
        else:
            return
        self._after_change(index)

    def commit_ink(self, index: int, strokes) -> None:
        if self._doc is None:
            return
        self._doc.add_ink(index, strokes, self._color)
        self._after_change(index)

    def undo(self) -> bool:
        if self._doc is None or not self._doc.undo_last_annot():
            return False
        # We don't know which page changed; cheapest correct option is re-render.
        self._render_all()
        self.annotated.emit()
        return True

    # ----- internals -------------------------------------------------------
    def _after_change(self, index: int) -> None:
        self._render_page(index)
        self.annotated.emit()

    def _rebuild(self) -> None:
        while self._layout.count():
            item = self._layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        self._labels = []
        if self._doc is None:
            return
        for i in range(self._doc.page_count):
            self._labels.append(PageLabel(i, self))
        for label in self._labels:
            self._layout.addWidget(label)
        self._render_all()
        self.set_tool(self._tool)

    def _render_page(self, index: int) -> None:
        if self._doc is None or not (0 <= index < len(self._labels)):
            return
        label = self._labels[index]
        img = self._doc.render_page(index, zoom=self._zoom)
        pixmap: QPixmap = page_image_to_pixmap(img)
        label.setPixmap(pixmap)
        label.setFixedSize(pixmap.size())
        label.set_zoom(self._zoom)

    def _render_all(self) -> None:
        if self._doc is None:
            return
        for label in self._labels:
            self._render_page(label.index)
            label.set_highlights([], self._zoom)

    def _emit_visible_page(self) -> None:
        if not self._labels:
            return
        viewport_top = self.verticalScrollBar().value()
        for label in self._labels:
            if label.y() + label.height() >= viewport_top:
                self.page_changed.emit(label.index)
                return
