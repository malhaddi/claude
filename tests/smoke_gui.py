"""Offscreen GUI smoke test — exercises the real widgets without a display.

Run with the Qt offscreen platform so it works on a headless box / CI:

    QT_QPA_PLATFORM=offscreen python tests/smoke_gui.py

It builds a sample PDF, loads it into MainWindow, renders pages, runs a search,
and saves — verifying the whole UI stack wires together. Exits non-zero on any
failure.
"""
from __future__ import annotations

import os
import sys
import tempfile

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import fitz  # noqa: E402
from PySide6.QtWidgets import QApplication  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.document import PDFDocument  # noqa: E402
from app.ui.main_window import MainWindow  # noqa: E402


def _make_sample(path: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello PDF Editor", fontsize=18)
    page.insert_text((72, 120), "A second searchable line here", fontsize=12)
    doc.new_page()
    doc.save(path)
    doc.close()


def main() -> int:
    app = QApplication([])
    tmp = tempfile.mkdtemp()
    sample = os.path.join(tmp, "sample.pdf")
    _make_sample(sample)

    win = MainWindow()
    win.show()

    # Load document through the real UI path.
    win._load(PDFDocument.open(sample))
    assert win._doc.page_count == 2, "expected 2 pages"
    assert win._thumbs.count() == 2, "expected 2 thumbnails"

    # Render at a couple of zoom levels.
    win._view.set_zoom(1.5)
    win._view.set_zoom(0.75)

    # Search should find the seeded text.
    hits = win._view.show_search_hits("searchable")
    assert hits == 1, f"expected 1 search hit, got {hits}"

    # Save As to a new path.
    out = os.path.join(tmp, "out.pdf")
    win._doc.save(out)
    assert os.path.exists(out), "save failed"

    app.processEvents()
    print("GUI smoke test passed: load, thumbnails, zoom, search, save all OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
