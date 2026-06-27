"""A single open document: thumbnail panel + page view, side by side.

The tab widget owns the PDFDocument and exposes the small surface the main
window needs (zoom, search, tool selection, save). One DocumentTab lives per
open PDF inside the window's QTabWidget.
"""
from __future__ import annotations

import os

from PySide6.QtCore import Signal
from PySide6.QtWidgets import QHBoxLayout, QWidget

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
