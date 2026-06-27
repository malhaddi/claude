"""Scrollable, continuous page view — the main reading surface.

Phase 1 responsibilities: render every page top-to-bottom, support zoom, and
draw search highlights. Later phases will layer interactive annotation and
text-edit overlays on top of the same per-page label widgets.
"""
from __future__ import annotations

from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QColor, QPainter, QPixmap
from PySide6.QtWidgets import (
    QLabel,
    QScrollArea,
    QVBoxLayout,
    QWidget,
)

from app.core.document import PDFDocument
from app.ui.render_bridge import page_image_to_pixmap


class PageLabel(QLabel):
    """One rendered page. Holds its page index and any highlight rects."""

    def __init__(self, index: int):
        super().__init__()
        self.index = index
        self._highlights: list[tuple[float, float, float, float]] = []
        self._zoom = 1.0
        self.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setStyleSheet("background: white; border: 1px solid #c8c8c8;")

    def set_highlights(self, rects, zoom: float) -> None:
        self._highlights = rects
        self._zoom = zoom
        self.update()

    def paintEvent(self, event):  # noqa: N802 (Qt naming)
        super().paintEvent(event)
        if not self._highlights:
            return
        painter = QPainter(self)
        color = QColor(255, 215, 0, 90)  # translucent gold
        painter.setBrush(color)
        painter.setPen(Qt.PenStyle.NoPen)
        for x0, y0, x1, y1 in self._highlights:
            painter.drawRect(
                int(x0 * self._zoom),
                int(y0 * self._zoom),
                int((x1 - x0) * self._zoom),
                int((y1 - y0) * self._zoom),
            )
        painter.end()


class PageView(QScrollArea):
    """Vertically stacked, zoomable view of all pages in a document."""

    page_changed = Signal(int)  # emitted with the top-most visible page index

    def __init__(self):
        super().__init__()
        self.setWidgetResizable(True)
        self.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        self.setBackgroundRole(self.backgroundRole())
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
        self.verticalScrollBar().valueChanged.connect(self._emit_visible_page)

    # ----- public API ------------------------------------------------------
    def set_document(self, doc: PDFDocument) -> None:
        self._doc = doc
        self._zoom = 1.0
        self._rebuild()

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

    def show_search_hits(self, query: str) -> int:
        """Highlight all matches; returns total hit count. Empty clears."""
        if self._doc is None:
            return 0
        total = 0
        for label in self._labels:
            hits = self._doc.search_page(label.index, query)
            label.set_highlights(hits, self._zoom)
            total += len(hits)
        return total

    # ----- internals -------------------------------------------------------
    def _rebuild(self) -> None:
        while self._layout.count():
            item = self._layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        self._labels = []
        if self._doc is None:
            return
        for i in range(self._doc.page_count):
            label = PageLabel(i)
            self._labels.append(label)
            self._layout.addWidget(label)
        self._render_all()

    def _render_all(self) -> None:
        if self._doc is None:
            return
        for label in self._labels:
            img = self._doc.render_page(label.index, zoom=self._zoom)
            pixmap: QPixmap = page_image_to_pixmap(img)
            label.setPixmap(pixmap)
            label.setFixedSize(pixmap.size())
            label.set_highlights([], self._zoom)

    def _emit_visible_page(self) -> None:
        if not self._labels:
            return
        viewport_top = self.verticalScrollBar().value()
        for label in self._labels:
            if label.y() + label.height() >= viewport_top:
                self.page_changed.emit(label.index)
                return
