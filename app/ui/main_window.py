"""Main application window: menu, toolbar, thumbnails + page view, search bar.

Phase 1 wires up open/save/zoom/search/navigation. The toolbar already has
placeholder slots for the editing tools (annotate, signature, page ops, edit
text) so later phases plug in without restructuring the window.
"""
from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QKeySequence
from PySide6.QtWidgets import (
    QFileDialog,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QStatusBar,
    QToolBar,
    QWidget,
)

from app.core.document import PDFDocument
from app.ui.page_view import PageView
from app.ui.thumbnail_panel import ThumbnailPanel

_NOT_IMPLEMENTED = "Coming in a later phase."


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PDF Editor")
        self.resize(1200, 850)

        self._doc: PDFDocument | None = None

        self._view = PageView()
        self._thumbs = ThumbnailPanel()
        self._thumbs.page_selected.connect(self._view.scroll_to_page)
        self._view.page_changed.connect(self._on_page_changed)

        central = QWidget()
        layout = QHBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        layout.addWidget(self._thumbs)
        layout.addWidget(self._view, stretch=1)
        self.setCentralWidget(central)

        self._build_menu()
        self._build_toolbar()
        self.setStatusBar(QStatusBar())
        self._update_title()

    # ----- chrome ----------------------------------------------------------
    def _build_menu(self) -> None:
        file_menu = self.menuBar().addMenu("&File")
        file_menu.addAction(self._act("&Open…", QKeySequence.StandardKey.Open, self.open_file))
        file_menu.addAction(self._act("&Save", QKeySequence.StandardKey.Save, self.save_file))
        file_menu.addAction(self._act("Save &As…", QKeySequence.StandardKey.SaveAs, self.save_file_as))
        file_menu.addSeparator()
        file_menu.addAction(self._act("&Quit", QKeySequence.StandardKey.Quit, self.close))

        view_menu = self.menuBar().addMenu("&View")
        view_menu.addAction(self._act("Zoom &In", QKeySequence.StandardKey.ZoomIn, self._view.zoom_in))
        view_menu.addAction(self._act("Zoom &Out", QKeySequence.StandardKey.ZoomOut, self._view.zoom_out))

    def _build_toolbar(self) -> None:
        bar = QToolBar("Main")
        bar.setMovable(False)
        self.addToolBar(bar)

        bar.addAction(self._act("Open", None, self.open_file))
        bar.addAction(self._act("Save", None, self.save_file))
        bar.addSeparator()
        bar.addAction(self._act("Zoom +", None, self._view.zoom_in))
        bar.addAction(self._act("Zoom −", None, self._view.zoom_out))
        bar.addSeparator()

        # Placeholders for upcoming phases — visible so the roadmap is obvious.
        for name in ("Highlight", "Text Box", "Signature", "Insert Page", "Edit Text"):
            bar.addAction(self._act(name, None, lambda _=False, n=name: self._todo(n)))

        bar.addSeparator()
        self._search_box = QLineEdit()
        self._search_box.setPlaceholderText("Search…")
        self._search_box.setFixedWidth(220)
        self._search_box.returnPressed.connect(self._run_search)
        bar.addWidget(self._search_box)
        find_btn = QPushButton("Find")
        find_btn.clicked.connect(self._run_search)
        bar.addWidget(find_btn)

        self._page_label = QLabel("  —  ")
        bar.addWidget(self._page_label)

    def _act(self, text: str, shortcut, slot) -> QAction:
        action = QAction(text, self)
        if shortcut is not None:
            action.setShortcut(shortcut)
        action.triggered.connect(slot)
        return action

    # ----- file ops --------------------------------------------------------
    def open_file(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "Open PDF", "", "PDF files (*.pdf)")
        if not path:
            return
        try:
            self._load(PDFDocument.open(path))
        except Exception as exc:  # noqa: BLE001 — surface any open error to the user
            QMessageBox.critical(self, "Open failed", str(exc))

    def _load(self, doc: PDFDocument) -> None:
        if self._doc is not None:
            self._doc.close()
        self._doc = doc
        self._view.set_document(doc)
        self._thumbs.set_document(doc)
        self._update_title()
        self.statusBar().showMessage(f"{doc.page_count} page(s)", 4000)

    def save_file(self) -> None:
        if self._doc is None:
            return
        if self._doc.path is None:
            self.save_file_as()
            return
        try:
            self._doc.save()
            self.statusBar().showMessage("Saved", 3000)
            self._update_title()
        except Exception as exc:  # noqa: BLE001
            QMessageBox.critical(self, "Save failed", str(exc))

    def save_file_as(self) -> None:
        if self._doc is None:
            return
        path, _ = QFileDialog.getSaveFileName(self, "Save PDF As", "", "PDF files (*.pdf)")
        if not path:
            return
        try:
            self._doc.save(path)
            self.statusBar().showMessage("Saved", 3000)
            self._update_title()
        except Exception as exc:  # noqa: BLE001
            QMessageBox.critical(self, "Save failed", str(exc))

    # ----- search / nav ----------------------------------------------------
    def _run_search(self) -> None:
        if self._doc is None:
            return
        query = self._search_box.text().strip()
        count = self._view.show_search_hits(query)
        self.statusBar().showMessage(f"{count} match(es) for '{query}'" if query else "Cleared", 4000)

    def _on_page_changed(self, index: int) -> None:
        if self._doc is not None:
            self._page_label.setText(f"  Page {index + 1} / {self._doc.page_count}  ")

    # ----- misc ------------------------------------------------------------
    def _todo(self, feature: str) -> None:
        QMessageBox.information(self, feature, f"{feature}: {_NOT_IMPLEMENTED}")

    def _update_title(self) -> None:
        if self._doc is None:
            self.setWindowTitle("PDF Editor")
            return
        name = self._doc.path or "Untitled"
        dirty = "*" if self._doc.is_dirty else ""
        self.setWindowTitle(f"{dirty}{name} — PDF Editor")

    def closeEvent(self, event):  # noqa: N802
        if self._doc is not None and self._doc.is_dirty:
            choice = QMessageBox.question(
                self,
                "Unsaved changes",
                "You have unsaved changes. Save before closing?",
                QMessageBox.StandardButton.Save
                | QMessageBox.StandardButton.Discard
                | QMessageBox.StandardButton.Cancel,
            )
            if choice == QMessageBox.StandardButton.Save:
                self.save_file()
            elif choice == QMessageBox.StandardButton.Cancel:
                event.ignore()
                return
        event.accept()
