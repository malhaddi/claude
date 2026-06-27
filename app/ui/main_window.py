"""Main window: tabbed multi-document shell with reader + annotation tools.

Holds a QTabWidget of DocumentTabs (one open PDF each). The toolbar's tool
buttons form an exclusive group that drives the active editing Tool on the
current tab; the same tool/color selection is re-applied whenever you switch
tabs so behaviour is consistent across documents.
"""
from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QActionGroup, QColor, QKeySequence
from PySide6.QtWidgets import (
    QColorDialog,
    QFileDialog,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QStatusBar,
    QTabWidget,
    QToolBar,
)

from app.core.document import PDFDocument
from app.ui.document_tab import DocumentTab
from app.ui.tools import Tool

_TOOL_BUTTONS = [
    ("Select", Tool.SELECT),
    ("Highlight", Tool.HIGHLIGHT),
    ("Underline", Tool.UNDERLINE),
    ("Text Box", Tool.TEXTBOX),
    ("Draw", Tool.INK),
    ("Signature", Tool.SIGNATURE),
    ("Edit Text", Tool.EDIT_TEXT),
]


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PDF Editor")
        self.resize(1280, 880)

        self._active_tool = Tool.SELECT
        self._active_color = (0.85, 0.1, 0.1)
        self._signature_path: str | None = None
        self._tool_actions: dict[Tool, QAction] = {}

        self._tabs = QTabWidget()
        self._tabs.setTabsClosable(True)
        self._tabs.setMovable(True)
        self._tabs.setDocumentMode(True)
        self._tabs.tabCloseRequested.connect(self._close_tab)
        self._tabs.currentChanged.connect(self._on_tab_changed)
        self.setCentralWidget(self._tabs)

        self._build_menu()
        self._build_toolbar()
        self.setStatusBar(QStatusBar())
        self._update_title()

    # ----- current tab helpers --------------------------------------------
    def _current(self) -> DocumentTab | None:
        w = self._tabs.currentWidget()
        return w if isinstance(w, DocumentTab) else None

    # ----- chrome ----------------------------------------------------------
    def _build_menu(self) -> None:
        file_menu = self.menuBar().addMenu("&File")
        file_menu.addAction(self._act("&Open…", QKeySequence.StandardKey.Open, self.open_file))
        file_menu.addAction(self._act("&Save", QKeySequence.StandardKey.Save, self.save_file))
        file_menu.addAction(self._act("Save &As…", QKeySequence.StandardKey.SaveAs, self.save_file_as))
        file_menu.addSeparator()
        file_menu.addAction(self._act("&Close Tab", QKeySequence.StandardKey.Close, self._close_current))
        file_menu.addAction(self._act("&Quit", QKeySequence.StandardKey.Quit, self.close))

        edit_menu = self.menuBar().addMenu("&Edit")
        edit_menu.addAction(self._act("&Undo", QKeySequence.StandardKey.Undo, self.undo))

        view_menu = self.menuBar().addMenu("&View")
        view_menu.addAction(self._act("Zoom &In", QKeySequence.StandardKey.ZoomIn, self._zoom_in))
        view_menu.addAction(self._act("Zoom &Out", QKeySequence.StandardKey.ZoomOut, self._zoom_out))

    def _build_toolbar(self) -> None:
        bar = QToolBar("Main")
        bar.setMovable(False)
        self.addToolBar(bar)

        bar.addAction(self._act("Open", None, self.open_file))
        bar.addAction(self._act("Save", None, self.save_file))
        bar.addSeparator()
        bar.addAction(self._act("Zoom +", None, self._zoom_in))
        bar.addAction(self._act("Zoom −", None, self._zoom_out))
        bar.addSeparator()

        # Exclusive group of editing tools.
        group = QActionGroup(self)
        group.setExclusive(True)
        for label, tool in _TOOL_BUTTONS:
            action = QAction(label, self)
            action.setCheckable(True)
            action.triggered.connect(lambda _=False, t=tool: self._select_tool(t))
            group.addAction(action)
            bar.addAction(action)
            self._tool_actions[tool] = action
        self._tool_actions[Tool.SELECT].setChecked(True)

        bar.addAction(self._act("Color…", None, self._pick_color))
        self._color_swatch = QLabel("  ■  ")
        self._refresh_swatch()
        bar.addWidget(self._color_swatch)
        bar.addSeparator()

        # Editing actions that aren't persistent tools.
        bar.addAction(self._act("Insert Page", None, self._insert_blank_page))
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
        paths, _ = QFileDialog.getOpenFileNames(self, "Open PDF(s)", "", "PDF files (*.pdf)")
        for path in paths:
            self._open_path(path)

    def _open_path(self, path: str) -> None:
        try:
            self._add_tab(PDFDocument.open(path))
        except Exception as exc:  # noqa: BLE001
            QMessageBox.critical(self, "Open failed", str(exc))

    def _add_tab(self, doc: PDFDocument) -> None:
        tab = DocumentTab(doc)
        tab.page_changed.connect(self._on_page_changed)
        tab.annotated.connect(self._on_annotated)
        tab.text_selected.connect(self._on_text_selected)
        index = self._tabs.addTab(tab, tab.title)
        self._tabs.setCurrentIndex(index)
        # Apply current tool/color to the freshly opened document.
        tab.set_color(self._active_color)
        tab.set_signature_path(self._signature_path or "")
        tab.set_tool(self._active_tool)
        self.statusBar().showMessage(f"{doc.page_count} page(s)", 4000)

    def save_file(self) -> None:
        tab = self._current()
        if tab is None:
            return
        if tab.doc.path is None:
            self.save_file_as()
            return
        tab.view.flush_pending()
        try:
            tab.doc.save()
            self._refresh_tab_title(tab)
            self.statusBar().showMessage("Saved", 3000)
        except Exception as exc:  # noqa: BLE001
            QMessageBox.critical(self, "Save failed", str(exc))

    def save_file_as(self) -> None:
        tab = self._current()
        if tab is None:
            return
        path, _ = QFileDialog.getSaveFileName(self, "Save PDF As", "", "PDF files (*.pdf)")
        if not path:
            return
        tab.view.flush_pending()
        try:
            tab.doc.save(path)
            self._refresh_tab_title(tab)
            self.statusBar().showMessage("Saved", 3000)
        except Exception as exc:  # noqa: BLE001
            QMessageBox.critical(self, "Save failed", str(exc))

    def _close_current(self) -> None:
        if self._tabs.currentIndex() >= 0:
            self._close_tab(self._tabs.currentIndex())

    def _close_tab(self, index: int) -> None:
        tab = self._tabs.widget(index)
        if isinstance(tab, DocumentTab):
            if tab.doc.is_dirty and not self._confirm_discard(tab):
                return
            tab.doc.close()
        self._tabs.removeTab(index)
        self._update_title()

    def _confirm_discard(self, tab: DocumentTab) -> bool:
        choice = QMessageBox.question(
            self,
            "Unsaved changes",
            f"Save changes to {tab.title.lstrip('*')} before closing?",
            QMessageBox.StandardButton.Save
            | QMessageBox.StandardButton.Discard
            | QMessageBox.StandardButton.Cancel,
        )
        if choice == QMessageBox.StandardButton.Cancel:
            return False
        if choice == QMessageBox.StandardButton.Save:
            self._tabs.setCurrentWidget(tab)
            self.save_file()
        return True

    # ----- tools / color ---------------------------------------------------
    def _select_tool(self, tool: Tool) -> None:
        self._active_tool = tool
        if tool == Tool.SIGNATURE and not self._signature_path:
            if not self._choose_signature():
                # No image chosen; revert to Select.
                self._active_tool = Tool.SELECT
                self._tool_actions[Tool.SELECT].setChecked(True)
                return
        tab = self._current()
        if tab is not None:
            tab.set_tool(tool)

    def _choose_signature(self) -> bool:
        path, _ = QFileDialog.getOpenFileName(
            self, "Choose signature image", "", "Images (*.png *.jpg *.jpeg)"
        )
        if not path:
            return False
        self._signature_path = path
        tab = self._current()
        if tab is not None:
            tab.set_signature_path(path)
        return True

    def _pick_color(self) -> None:
        r, g, b = (int(c * 255) for c in self._active_color)
        chosen = QColorDialog.getColor(QColor(r, g, b), self, "Annotation color")
        if not chosen.isValid():
            return
        self._active_color = (chosen.redF(), chosen.greenF(), chosen.blueF())
        self._refresh_swatch()
        tab = self._current()
        if tab is not None:
            tab.set_color(self._active_color)

    def _refresh_swatch(self) -> None:
        r, g, b = (int(c * 255) for c in self._active_color)
        self._color_swatch.setStyleSheet(f"color: rgb({r},{g},{b}); font-size: 18px;")

    def _insert_blank_page(self) -> None:
        tab = self._current()
        if tab is None:
            return
        tab.insert_blank_after_current()
        self.statusBar().showMessage("Inserted blank page", 2500)

    def undo(self) -> None:
        tab = self._current()
        if tab is None:
            return
        if tab.view.undo():
            self.statusBar().showMessage("Undid last annotation", 2500)
        else:
            self.statusBar().showMessage("Nothing to undo", 2500)

    # ----- zoom / search / nav --------------------------------------------
    def _zoom_in(self) -> None:
        tab = self._current()
        if tab:
            tab.view.zoom_in()

    def _zoom_out(self) -> None:
        tab = self._current()
        if tab:
            tab.view.zoom_out()

    def _run_search(self) -> None:
        tab = self._current()
        if tab is None:
            return
        query = self._search_box.text().strip()
        count = tab.view.show_search_hits(query)
        self.statusBar().showMessage(
            f"{count} match(es) for '{query}'" if query else "Cleared", 4000
        )

    # ----- signals ---------------------------------------------------------
    def _on_tab_changed(self, _index: int) -> None:
        tab = self._current()
        if tab is not None:
            tab.set_color(self._active_color)
            tab.set_signature_path(self._signature_path or "")
            tab.set_tool(self._active_tool)
        self._update_title()

    def _on_page_changed(self, index: int) -> None:
        tab = self._current()
        if tab is not None:
            self._page_label.setText(f"  Page {index + 1} / {tab.doc.page_count}  ")

    def _on_annotated(self) -> None:
        tab = self._current()
        if tab is not None:
            self._refresh_tab_title(tab)

    def _on_text_selected(self, text: str) -> None:
        n = len(text)
        self.statusBar().showMessage(
            f"Copied {n} character(s) to clipboard" if n else "No text in selection", 3000
        )

    def _refresh_tab_title(self, tab: DocumentTab) -> None:
        index = self._tabs.indexOf(tab)
        if index >= 0:
            self._tabs.setTabText(index, tab.title)
        self._update_title()

    # ----- misc ------------------------------------------------------------
    def _update_title(self) -> None:
        tab = self._current()
        if tab is None:
            self.setWindowTitle("PDF Editor")
            return
        name = tab.doc.path or "Untitled"
        dirty = "*" if tab.doc.is_dirty else ""
        self.setWindowTitle(f"{dirty}{name} — PDF Editor")

    def load_path(self, path: str) -> None:
        """Public entry used by the bootstrap to open a CLI-supplied file."""
        self._open_path(path)

    def closeEvent(self, event):  # noqa: N802
        for i in range(self._tabs.count()):
            tab = self._tabs.widget(i)
            if isinstance(tab, DocumentTab) and tab.doc.is_dirty:
                self._tabs.setCurrentWidget(tab)
                if not self._confirm_discard(tab):
                    event.ignore()
                    return
        event.accept()
