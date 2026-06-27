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

from PySide6.QtCore import QEvent, QPoint, QRect, Qt, Signal
from PySide6.QtGui import QColor, QFont, QPainter, QPen, QPixmap
from PySide6.QtWidgets import (
    QApplication,
    QInputDialog,
    QLabel,
    QPlainTextEdit,
    QScrollArea,
    QVBoxLayout,
    QWidget,
)

from app.core.document import PDFDocument, TextBlock
from app.ui.render_bridge import page_image_to_pixmap
from app.ui.tools import Tool


class SignatureItem(QLabel):
    """A placed signature image that can be dragged before it is committed.

    Drag to reposition; Enter / double-click commits it into the PDF; Esc
    cancels. It lives as a child of a PageLabel so its coordinates are in that
    page's pixel space.
    """

    commit = Signal()
    cancel = Signal()

    def __init__(self, parent: QWidget, pixmap: QPixmap):
        super().__init__(parent)
        self.setPixmap(pixmap)
        self.setScaledContents(True)
        self.setStyleSheet("border: 1px dashed #2864dc; background: transparent;")
        self.setCursor(Qt.CursorShape.SizeAllCursor)
        self.setFocusPolicy(Qt.FocusPolicy.StrongFocus)
        self.setToolTip("Drag to move • double-click or Enter to place • Esc to cancel")
        self._press: QPoint | None = None

    def mousePressEvent(self, event):  # noqa: N802
        if event.button() == Qt.MouseButton.LeftButton:
            self._press = event.position().toPoint()

    def mouseMoveEvent(self, event):  # noqa: N802
        if self._press is None:
            return
        delta = event.position().toPoint() - self._press
        new_pos = self.pos() + delta
        parent = self.parentWidget()
        if parent is not None:  # keep the item within the page
            max_x = max(0, parent.width() - self.width())
            max_y = max(0, parent.height() - self.height())
            new_pos.setX(max(0, min(new_pos.x(), max_x)))
            new_pos.setY(max(0, min(new_pos.y(), max_y)))
        self.move(new_pos)

    def mouseReleaseEvent(self, event):  # noqa: N802
        self._press = None

    def mouseDoubleClickEvent(self, event):  # noqa: N802
        self.commit.emit()

    def keyPressEvent(self, event):  # noqa: N802
        if event.key() in (Qt.Key.Key_Return, Qt.Key.Key_Enter):
            self.commit.emit()
        elif event.key() == Qt.Key.Key_Escape:
            self.cancel.emit()
        else:
            super().keyPressEvent(event)


class InlineTextEditor(QPlainTextEdit):
    """Editable overlay placed over a paragraph for in-place text editing.

    Ctrl+Enter (or losing focus) commits; Escape cancels.
    """

    commit = Signal()
    cancel = Signal()

    def __init__(self, parent: QWidget):
        super().__init__(parent)
        self.setStyleSheet(
            "QPlainTextEdit { background: #fffbe6; border: 1px solid #2864dc; padding: 0; }"
        )
        self.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)

    def keyPressEvent(self, event):  # noqa: N802
        key = event.key()
        ctrl = event.modifiers() & Qt.KeyboardModifier.ControlModifier
        if key in (Qt.Key.Key_Return, Qt.Key.Key_Enter) and ctrl:
            self.commit.emit()
            return
        if key == Qt.Key.Key_Escape:
            self.cancel.emit()
            return
        super().keyPressEvent(event)

    def focusOutEvent(self, event):  # noqa: N802
        super().focusOutEvent(event)
        self.commit.emit()


class PageLabel(QLabel):
    """One rendered page; owns its interaction state for the active tool."""

    def __init__(self, index: int, view: "PageView"):
        super().__init__()
        self.index = index
        self._view = view
        self._highlights: list[tuple[float, float, float, float]] = []
        self._selection: tuple[float, float, float, float] | None = None
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

    def set_selection(self, rects, zoom: float) -> None:
        self._selection = rects  # list of word rects, or None
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
        if tool == Tool.EDIT_TEXT:
            self._view.begin_text_edit(self, pos.x() / self._zoom, pos.y() / self._zoom)
            return
        z = self._zoom
        if tool == Tool.INK:
            self._ink_points = [pos]
        elif tool.is_text_select:
            self._drag_start = pos
            self._drag_cur = pos
            self._view.begin_text_drag(self.index, (pos.x() / z, pos.y() / z))
        elif tool.is_rect_drag:
            self._drag_start = pos
            self._drag_cur = pos
        self.update()

    def mouseMoveEvent(self, event):  # noqa: N802
        tool = self._view.tool
        pos = event.position().toPoint()
        z = self._zoom
        if tool == Tool.INK and self._ink_points:
            self._ink_points.append(pos)
            self.update()
        elif tool.is_text_select and self._drag_start is not None:
            self._drag_cur = pos
            p0 = (self._drag_start.x() / z, self._drag_start.y() / z)
            p1 = (pos.x() / z, pos.y() / z)
            self._view.update_text_drag(self.index, p0, p1)  # live highlight
        elif tool.is_rect_drag and self._drag_start is not None:
            self._drag_cur = pos
            self.update()

    def mouseReleaseEvent(self, event):  # noqa: N802
        if event.button() != Qt.MouseButton.LeftButton:
            return
        tool = self._view.tool
        z = self._zoom
        if tool == Tool.INK and len(self._ink_points) > 1:
            pts = [(p.x() / z, p.y() / z) for p in self._ink_points]
            self._view.commit_ink(self.index, [pts])
        elif tool.is_text_select and self._drag_start and self._drag_cur:
            p0 = (self._drag_start.x() / z, self._drag_start.y() / z)
            p1 = (self._drag_cur.x() / z, self._drag_cur.y() / z)
            self._view.commit_text_drag(self.index, p0, p1)
        elif tool.is_rect_drag and self._drag_start and self._drag_cur:
            rect = self._pdf_rect(self._drag_start, self._drag_cur)
            if rect is not None:
                self._view.commit_rect(self.index, rect)
        self._drag_start = self._drag_cur = None
        self._ink_points = []

    def wheelEvent(self, event):  # noqa: N802
        # The page label is the direct target of the wheel; handle Ctrl+wheel
        # zoom here so it works regardless of scroll-area event routing.
        if event.modifiers() & Qt.KeyboardModifier.ControlModifier:
            self._view.zoom_by_wheel(event.angleDelta().y())
            event.accept()
        else:
            event.ignore()  # let the scroll area scroll normally

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

        # Committed text selection (per-word rects, kept until the next click).
        if self._selection:
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(60, 120, 230, 70))
            for x0, y0, x1, y1 in self._selection:
                painter.drawRect(
                    int(x0 * self._zoom), int(y0 * self._zoom),
                    int((x1 - x0) * self._zoom), int((y1 - y0) * self._zoom),
                )

        # In-progress rubber-band rectangle (rectangle tools only; text
        # selection shows live word highlights instead, not a box).
        if (self._view.tool.is_rect_drag
                and self._drag_start is not None and self._drag_cur is not None):
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
    text_selected = Signal(str)  # emitted with copied text after a selection

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

        # Inline text-edit state.
        self._editor: InlineTextEditor | None = None
        self._editor_block: TextBlock | None = None
        self._editor_label: PageLabel | None = None

        # Pending (uncommitted, draggable) signature placement.
        self._sig_item: SignatureItem | None = None
        self._sig_label: PageLabel | None = None

        # Cached words for the active text-selection drag.
        self._drag_words = None

        self.verticalScrollBar().valueChanged.connect(self._emit_visible_page)
        # Catch wheel events on the viewport so Ctrl+wheel zooms (a wheelEvent
        # override on a QScrollArea is consumed by the viewport for scrolling).
        self.viewport().installEventFilter(self)

    # ----- zoom on Ctrl+wheel ---------------------------------------------
    def zoom_by_wheel(self, delta: int) -> None:
        if delta > 0:
            self.zoom_in()
        elif delta < 0:
            self.zoom_out()

    def eventFilter(self, obj, event):  # noqa: N802
        if obj is self.viewport() and event.type() == QEvent.Type.Wheel:
            if event.modifiers() & Qt.KeyboardModifier.ControlModifier:
                self.zoom_by_wheel(event.angleDelta().y())
                return True  # consume: don't also scroll
        return super().eventFilter(obj, event)

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
        if tool != Tool.EDIT_TEXT:
            self._finish_text_edit(commit=True)
        self._commit_signature()  # bake any pending signature when switching tools
        self._tool = tool
        if tool.is_text_select or tool == Tool.EDIT_TEXT:
            cursor = Qt.CursorShape.IBeamCursor
        else:
            cursor = Qt.CursorShape.CrossCursor
        self.viewport().setCursor(cursor)
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
        if tool == Tool.TEXTBOX:
            text, ok = QInputDialog.getMultiLineText(self, "Text Box", "Enter text:")
            if not ok or not text.strip():
                return
            self._doc.add_text_box(index, rect, text, color=self._color)
        elif tool == Tool.SIGNATURE:
            self._place_signature(index, rect)
            return
        else:
            return
        self._after_change(index)

    def commit_ink(self, index: int, strokes) -> None:
        if self._doc is None:
            return
        self._doc.add_ink(index, strokes, self._color)
        self._after_change(index)

    # ----- text selection: select / highlight / underline -----------------
    def clear_selections(self) -> None:
        for label in self._labels:
            label.set_selection(None, self._zoom)

    def begin_text_drag(self, index: int, p0) -> None:
        """Start a text-selection drag; cache the page's words for the drag."""
        if self._doc is None:
            return
        self._drag_words = self._doc.get_words(index)
        self.clear_selections()

    def update_text_drag(self, index: int, p0, p1) -> None:
        """Live-highlight the words currently selected during the drag."""
        if self._doc is None:
            return
        rects, _ = self._doc.select_text(index, p0, p1, self._drag_words)
        self.clear_selections()
        self._labels[index].set_selection(rects, self._zoom)

    def commit_text_drag(self, index: int, p0, p1) -> None:
        """Finalize the selection: copy, or annotate, per the active tool."""
        if self._doc is None:
            return
        rects, text = self._doc.select_text(index, p0, p1, self._drag_words)
        self._drag_words = None
        if not rects:
            return
        tool = self._tool
        if tool == Tool.HIGHLIGHT:
            self.clear_selections()
            self._doc.add_highlight(index, rects, self._color)
            self._after_change(index)
        elif tool == Tool.UNDERLINE:
            self.clear_selections()
            self._doc.add_underline(index, rects, self._color)
            self._after_change(index)
        else:  # SELECT — keep selection visible and copy to clipboard
            self.clear_selections()
            self._labels[index].set_selection(rects, self._zoom)
            if text:
                QApplication.clipboard().setText(text)
            self.text_selected.emit(text)

    # ----- signature placement (draggable before commit) ------------------
    def _place_signature(self, index: int, rect) -> None:
        if not self._signature_path:
            return
        self._commit_signature()  # bake any previous pending signature first
        label = self._labels[index]
        pixmap = QPixmap(self._signature_path)
        if pixmap.isNull():
            return
        z = self._zoom
        x0, y0, x1, y1 = rect
        item = SignatureItem(label, pixmap)
        item.setGeometry(
            int(x0 * z), int(y0 * z),
            max(24, int((x1 - x0) * z)), max(12, int((y1 - y0) * z)),
        )
        item.commit.connect(self._commit_signature)
        item.cancel.connect(self._cancel_signature)
        self._sig_item = item
        self._sig_label = label
        item.show()
        item.setFocus()

    def _commit_signature(self) -> None:
        if self._sig_item is None:
            return
        item, label = self._sig_item, self._sig_label
        self._sig_item = self._sig_label = None
        geo = item.geometry()
        z = self._zoom
        rect = (geo.x() / z, geo.y() / z, (geo.x() + geo.width()) / z,
                (geo.y() + geo.height()) / z)
        item.deleteLater()
        if label is not None and self._signature_path:
            self._doc.add_image(label.index, rect, self._signature_path)
            self._render_page(label.index)
            self.annotated.emit()

    def _cancel_signature(self) -> None:
        if self._sig_item is None:
            return
        self._sig_item.deleteLater()
        self._sig_item = self._sig_label = None

    def flush_pending(self) -> None:
        """Commit any open editor / pending signature (e.g. before saving)."""
        self._finish_text_edit(commit=True)
        self._commit_signature()

    # ----- inline text editing (Phase 4) ----------------------------------
    def begin_text_edit(self, label: "PageLabel", x: float, y: float) -> None:
        if self._doc is None:
            return
        # Commit any currently-open editor before starting a new one.
        if self._editor is not None:
            self._finish_text_edit(commit=True)
        block = self._doc.text_block_at(label.index, x, y)
        if block is None:
            return

        editor = InlineTextEditor(label)
        z = self._zoom
        x0, y0, x1, y1 = block.bbox
        editor.setGeometry(
            int(x0 * z), int(y0 * z),
            max(48, int((x1 - x0) * z)), max(24, int((y1 - y0) * z) + 8),
        )
        font = QFont()
        font.setPixelSize(max(6, int(block.fontsize * z)))
        editor.setFont(font)
        editor.setPlainText(block.text)
        editor.commit.connect(lambda: self._finish_text_edit(commit=True))
        editor.cancel.connect(lambda: self._finish_text_edit(commit=False))

        self._editor = editor
        self._editor_block = block
        self._editor_label = label
        editor.show()
        editor.setFocus()
        editor.selectAll()

    def _finish_text_edit(self, commit: bool) -> None:
        if self._editor is None:
            return
        editor, block, label = self._editor, self._editor_block, self._editor_label
        # Clear state first so the focus-out triggered by deletion is a no-op.
        self._editor = self._editor_block = self._editor_label = None

        new_text = editor.toPlainText()
        editor.deleteLater()
        if commit and block is not None and label is not None and new_text != block.text:
            self._doc.replace_text_block(
                label.index, block.bbox, new_text,
                block.fontsize, block.color, block.fontname, block.first_baseline,
            )
            self._render_page(label.index)
            self.annotated.emit()

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
        self._finish_text_edit(commit=False)  # drop any editor on a stale label
        self._cancel_signature()              # drop any pending signature too
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
