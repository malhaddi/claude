"""Offscreen GUI smoke test — exercises the real widgets without a display.

Run with the Qt offscreen platform so it works on a headless box / CI:

    QT_QPA_PLATFORM=offscreen python tests/smoke_gui.py

Covers: opening multiple PDFs into tabs, rendering, zoom, search, the Phase 2
annotation commits (highlight / underline / text box / ink / signature image),
undo, and save. Exits non-zero on any failure.
"""
from __future__ import annotations

import os
import sys
import tempfile

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import fitz  # noqa: E402
from PySide6.QtCore import QEvent, QPointF, Qt  # noqa: E402
from PySide6.QtGui import QMouseEvent  # noqa: E402
from PySide6.QtWidgets import QApplication  # noqa: E402


def _simulate_drag(label, x0, y0, x1, y1):
    """Drive a real press→move→release through a PageLabel's event handlers."""
    lb, nb = Qt.MouseButton.LeftButton, Qt.MouseButton.NoButton
    nomod = Qt.KeyboardModifier.NoModifier
    label.mousePressEvent(
        QMouseEvent(QEvent.Type.MouseButtonPress, QPointF(x0, y0), lb, lb, nomod))
    label.mouseMoveEvent(
        QMouseEvent(QEvent.Type.MouseMove, QPointF(x1, y1), nb, lb, nomod))
    label.mouseReleaseEvent(
        QMouseEvent(QEvent.Type.MouseButtonRelease, QPointF(x1, y1), lb, lb, nomod))

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ui.main_window import MainWindow  # noqa: E402
from app.ui.tools import Tool  # noqa: E402


def _make_sample(path: str, label: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), f"Hello {label}", fontsize=18)
    page.insert_text((72, 120), "A second searchable line here", fontsize=12)
    doc.new_page()
    doc.save(path)
    doc.close()


def _center(bbox) -> tuple[float, float]:
    x0, y0, x1, y1 = bbox
    return (x0 + x1) / 2, (y0 + y1) / 2


def _make_signature(path: str) -> None:
    pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 200, 80))
    pix.clear_with(255)
    pix.save(path)


def main() -> int:
    app = QApplication([])
    tmp = tempfile.mkdtemp()
    a = os.path.join(tmp, "a.pdf")
    b = os.path.join(tmp, "b.pdf")
    sig = os.path.join(tmp, "sig.png")
    _make_sample(a, "Doc A")
    _make_sample(b, "Doc B")
    _make_signature(sig)

    win = MainWindow()
    win.show()

    # Open two documents into tabs.
    win.load_path(a)
    win.load_path(b)
    assert win._tabs.count() == 2, f"expected 2 tabs, got {win._tabs.count()}"

    tab = win._current()
    assert tab is not None and tab.doc.page_count == 2
    assert tab.thumbs.count() == 2, "expected 2 thumbnails"

    # Zoom + search on the current tab.
    tab.view.set_zoom(1.5)
    hits = tab.view.show_search_hits("searchable")
    assert hits == 1, f"expected 1 search hit, got {hits}"

    # Phase 2: commit one of each annotation type via the view's commit API.
    rect = (72, 60, 260, 90)  # PDF-point coords over the heading
    tab.view.set_color((1.0, 0.85, 0.0))

    tab.doc.add_highlight(0, rect)
    tab.doc.add_underline(0, (72, 110, 320, 132))
    tab.doc.add_text_box(0, (72, 200, 320, 260), "Annotation test")
    tab.doc.add_ink(0, [[(80, 300), (160, 320), (240, 300)]])
    tab.doc.add_image(0, (400, 60, 520, 110), sig)
    assert tab.doc.is_dirty is True

    # Undo should remove the most recent *annotation* (ink; image isn't tracked).
    n_before = len(list(tab.doc.fitz_doc[0].annots()))
    assert tab.doc.undo_last_annot() is True
    n_after = len(list(tab.doc.fitz_doc[0].annots()))
    assert n_after == n_before - 1, "undo did not remove one annotation"

    # Save the annotated document and confirm the annotations persisted.
    out = os.path.join(tmp, "out.pdf")
    tab.doc.save(out)
    assert os.path.exists(out), "save failed"
    reopened = fitz.open(out)
    total_annots = sum(len(list(reopened[i].annots())) for i in range(reopened.page_count))
    assert total_annots >= 3, "annotations did not persist"
    reopened.close()

    # Switch tab and confirm tool state re-applies without error.
    win._tabs.setCurrentIndex(0)
    win._select_tool(Tool.HIGHLIGHT)
    assert win._current().view.tool == Tool.HIGHLIGHT

    # Phase 3: page operations via the tab handler + toolbar action.
    ptab = win._current()
    start_pages = ptab.doc.page_count
    ptab._on_page_action("insert_blank_after", 0)
    assert ptab.doc.page_count == start_pages + 1, "insert blank failed"
    assert ptab.thumbs.count() == ptab.doc.page_count, "thumbnails out of sync"
    ptab._on_page_action("rotate_cw", 0)
    assert ptab.doc.fitz_doc[0].rotation == 90
    ptab._on_page_action("move_down", 0)
    ptab._on_page_action("delete", 0)
    assert ptab.doc.page_count == start_pages, "delete failed"
    win._insert_blank_page()
    assert ptab.doc.page_count == start_pages + 1, "toolbar insert failed"

    # Phase 4: inline text editing on a fresh, unrotated document.
    c = os.path.join(tmp, "c.pdf")
    _make_sample(c, "Doc C")
    win.load_path(c)
    win._select_tool(Tool.EDIT_TEXT)
    etab = win._current()
    assert etab.view.tool == Tool.EDIT_TEXT
    first = etab.doc.get_text_blocks(0)[0]
    label = etab.view._labels[0]
    etab.view.begin_text_edit(label, *_center(first.bbox))
    assert etab.view._editor is not None, "inline editor did not open"
    etab.view._editor.setPlainText("Edited heading text via inline editor")
    etab.view._finish_text_edit(commit=True)
    assert etab.view._editor is None, "editor not cleared after commit"
    # Text may wrap (narrow box), so check for the words rather than spacing.
    page_text = etab.doc.page_text(0)
    assert "Edited" in page_text and "inline" in page_text, "text edit not applied"
    assert "Hello Doc C" not in page_text, "original text not removed"

    # New: SELECT is a text cursor and drag-selecting copies the text.
    win._select_tool(Tool.SELECT)
    sel = win._current()
    assert sel.view.tool == Tool.SELECT
    assert sel.view._labels[0].cursor().shape() == Qt.CursorShape.IBeamCursor, \
        "SELECT tool should show a text (I-beam) cursor"
    line = next(b for b in sel.doc.get_text_blocks(0) if "searchable" in b.text)
    x0, y0, x1, y1 = line.bbox
    mid = (y0 + y1) / 2
    sel.view.commit_text_drag(0, (x0 + 1, mid), (x1 - 1, mid))
    assert "searchable" in QApplication.clipboard().text(), "selection not copied"

    # New: highlight/underline act on the selected text (one annot per drag).
    before = len(list(sel.doc.fitz_doc[0].annots()))
    win._select_tool(Tool.HIGHLIGHT)
    sel.view.commit_text_drag(0, (x0 + 1, mid), (x1 - 1, mid))
    after = len(list(sel.doc.fitz_doc[0].annots()))
    assert after == before + 1, "highlight on selected text did not add an annotation"

    # Critical: drive the REAL mouse-event handlers (not just commit_*), since
    # that path is what the running app uses. Simulate a drag over the line.
    win._select_tool(Tool.SELECT)
    QApplication.clipboard().setText("")  # clear
    z = sel.view.zoom
    lbl = sel.view._labels[0]
    _simulate_drag(lbl, (x0 + 1) * z, mid * z, (x1 - 1) * z, mid * z)
    assert "searchable" in QApplication.clipboard().text(), \
        "real mouse-drag selection did not copy text"

    n0 = len(list(sel.doc.fitz_doc[0].annots()))
    win._select_tool(Tool.UNDERLINE)
    _simulate_drag(lbl, (x0 + 1) * z, mid * z, (x1 - 1) * z, mid * z)
    assert len(list(sel.doc.fitz_doc[0].annots())) == n0 + 1, \
        "real mouse-drag underline did not add an annotation"

    # New: signature is placed as a draggable item, then committed on demand.
    win._signature_path = sig
    sel.set_signature_path(sig)
    win._select_tool(Tool.SIGNATURE)
    sel.view.commit_rect(0, (400, 60, 520, 110))   # drops a draggable signature
    assert sel.view._sig_item is not None, "signature item not created"
    sel.view._sig_item.move(120, 200)              # simulate dragging it
    sel.view._commit_signature()                   # bake into the PDF
    assert sel.view._sig_item is None, "signature not committed"
    assert sel.doc.is_dirty is True

    # New: Ctrl+wheel zoom path changes the zoom level.
    before = sel.view.zoom
    sel.view.zoom_in()
    assert sel.view.zoom > before, "zoom did not increase"

    app.processEvents()
    print("GUI smoke test passed: tabs, zoom, search, annotations, undo, page "
          "ops, inline text edit, text selection + highlight-on-selection "
          "(incl. real mouse-drag events), draggable signature, save all OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
