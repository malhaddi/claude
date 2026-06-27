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
from PySide6.QtWidgets import QApplication  # noqa: E402

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

    # Switch tab and confirm tool state re-applies without error.
    win._tabs.setCurrentIndex(0)
    win._select_tool(Tool.HIGHLIGHT)
    assert win._current().view.tool == Tool.HIGHLIGHT

    # Save the annotated document.
    out = os.path.join(tmp, "out.pdf")
    tab.doc.save(out)
    assert os.path.exists(out), "save failed"
    reopened = fitz.open(out)
    assert len(list(reopened[0].annots())) >= 3, "annotations did not persist"
    reopened.close()

    app.processEvents()
    print("GUI smoke test passed: tabs, zoom, search, annotations, undo, save all OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
