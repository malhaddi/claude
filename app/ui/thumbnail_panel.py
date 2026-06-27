"""Left-hand thumbnail strip for quick page navigation."""
from __future__ import annotations

from PySide6.QtCore import QSize, Qt, Signal
from PySide6.QtWidgets import QListWidget, QListWidgetItem

from app.core.document import PDFDocument
from app.ui.render_bridge import page_image_to_pixmap

_THUMB_ZOOM = 0.18


class ThumbnailPanel(QListWidget):
    """Renders a small pixmap per page; clicking one navigates the view."""

    page_selected = Signal(int)

    def __init__(self):
        super().__init__()
        self.setFixedWidth(170)
        self.setIconSize(QSize(140, 200))
        self.setSpacing(6)
        self.setStyleSheet("background: #3a3d40; color: #ddd; border: none;")
        self.itemClicked.connect(self._on_click)

    def set_document(self, doc: PDFDocument) -> None:
        self.clear()
        for i in range(doc.page_count):
            img = doc.render_page(i, zoom=_THUMB_ZOOM)
            item = QListWidgetItem(f"  {i + 1}")
            item.setIcon(page_image_to_pixmap(img))
            item.setData(Qt.ItemDataRole.UserRole, i)
            item.setTextAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignBottom)
            self.addItem(item)

    def _on_click(self, item: QListWidgetItem) -> None:
        self.page_selected.emit(item.data(Qt.ItemDataRole.UserRole))
