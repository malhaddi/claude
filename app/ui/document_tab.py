"""A single open document: thumbnail panel + page view, side by side.

The tab widget owns the PDFDocument and exposes the small surface the main
window needs (zoom, search, tool selection, save). One DocumentTab lives per
open PDF inside the window's QTabWidget.
"""
from __future__ import annotations

import os

from PySide6.QtCore import Signal
from PySide6.QtWidgets import QFileDialog, QHBoxLayout, QMessageBox, QWidget

from app.core.document import PDFDocument
from app.ui.page_view import PageView
from app.ui.thumbnail_panel import ThumbnailPanel
from app.ui.tools import Tool


class DocumentTab(QWidget):
    page_changed = Signal(int)
    annotated = Signal()

    def __init__(self, doc: PDFDocument):
        super().__init__()
        self.doc = doc

        self.view = PageView()
        self.thumbs = ThumbnailPanel()

        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        layout.addWidget(self.thumbs)
        layout.addWidget(self.view, stretch=1)

        self.view.set_document(doc)
        self.thumbs.set_document(doc)
        self.thumbs.page_selected.connect(self.view.scroll_to_page)
        self.thumbs.page_action.connect(self._on_page_action)
        self.view.page_changed.connect(self.page_changed)
        self.view.annotated.connect(self.annotated)

    # ----- convenience for the main window --------------------------------
    @property
    def title(self) -> str:
        base = os.path.basename(self.doc.path) if self.doc.path else "Untitled"
        return ("*" + base) if self.doc.is_dirty else base

    def set_tool(self, tool: Tool) -> None:
        self.view.set_tool(tool)

    def set_color(self, rgb) -> None:
        self.view.set_color(rgb)

    def set_signature_path(self, path: str) -> None:
        self.view.set_signature_path(path)

    def refresh_thumbnails(self) -> None:
        self.thumbs.set_document(self.doc)

    def insert_blank_after_current(self) -> None:
        """Used by the toolbar 'Insert Page' button."""
        target = self.view.current_page() + 1
        self.doc.insert_blank_page(target)
        self._reload(target)

    # ----- page operations (Phase 3) --------------------------------------
    def _on_page_action(self, action: str, index: int) -> None:
        doc = self.doc
        target = index
        try:
            if action == "rotate_cw":
                doc.rotate_page(index, 90)
            elif action == "rotate_ccw":
                doc.rotate_page(index, -90)
            elif action == "insert_blank_before":
                doc.insert_blank_page(index)
                target = index
            elif action == "insert_blank_after":
                doc.insert_blank_page(index + 1)
                target = index + 1
            elif action == "insert_pdf_after":
                path, _ = QFileDialog.getOpenFileName(
                    self, "Insert pages from PDF", "", "PDF files (*.pdf)"
                )
                if not path:
                    return
                doc.insert_pdf_pages(index + 1, path)
                target = index + 1
            elif action == "move_up":
                if index == 0:
                    return
                doc.move_page(index, index - 1)
                target = index - 1
            elif action == "move_down":
                if index >= doc.page_count - 1:
                    return
                doc.move_page(index, index + 1)
                target = index + 1
            elif action == "delete":
                doc.delete_page(index)
                target = min(index, doc.page_count - 1)
            else:
                return
        except Exception as exc:  # noqa: BLE001 — surface page-op errors
            QMessageBox.warning(self, "Page operation failed", str(exc))
            return
        self._reload(target)

    def _reload(self, scroll_to: int) -> None:
        self.view.reload(scroll_to=scroll_to)
        self.thumbs.set_document(self.doc)
        self.annotated.emit()  # refresh tab title / dirty marker
