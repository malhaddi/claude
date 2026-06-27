"""Left-hand thumbnail strip for navigation and page operations.

Clicking a thumbnail navigates the view; right-clicking opens a context menu
of Phase 3 page operations, emitted as (action, page_index) for the owning
DocumentTab to apply.
"""
from __future__ import annotations

from PySide6.QtCore import QSize, Qt, Signal
from PySide6.QtWidgets import QListWidget, QListWidgetItem, QMenu

from app.core.document import PDFDocument
from app.ui.render_bridge import page_image_to_pixmap

_THUMB_ZOOM = 0.18


class ThumbnailPanel(QListWidget):
    """Renders a small pixmap per page; supports navigation + page ops."""

    page_selected = Signal(int)
    page_action = Signal(str, int)  # (action, page_index)

    def __init__(self):
        super().__init__()
        self.setFixedWidth(170)
        self.setIconSize(QSize(140, 200))
        self.setSpacing(6)
        self.setStyleSheet("background: #3a3d40; color: #ddd; border: none;")
        self.itemClicked.connect(self._on_click)
        self.setContextMenuPolicy(Qt.ContextMenuPolicy.DefaultContextMenu)

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

    def contextMenuEvent(self, event):  # noqa: N802
        item = self.itemAt(event.pos())
        if item is None:
            return
        index = item.data(Qt.ItemDataRole.UserRole)
        menu = QMenu(self)

        def add(label: str, action: str) -> None:
            menu.addAction(label).triggered.connect(
                lambda _=False, a=action: self.page_action.emit(a, index)
            )

        add("Rotate left", "rotate_ccw")
        add("Rotate right", "rotate_cw")
        menu.addSeparator()
        add("Insert blank page before", "insert_blank_before")
        add("Insert blank page after", "insert_blank_after")
        add("Insert pages from PDF…", "insert_pdf_after")
        menu.addSeparator()
        add("Move up", "move_up")
        add("Move down", "move_down")
        menu.addSeparator()
        add("Delete page", "delete")

        menu.exec(event.globalPos())
