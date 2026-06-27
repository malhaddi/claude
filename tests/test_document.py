"""Headless tests for the core PDF model (no Qt / no display required)."""
from __future__ import annotations

import fitz

from app.core.document import PDFDocument


def _make_sample(path: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello PDF Editor", fontsize=18)
    page.insert_text((72, 120), "Second searchable line", fontsize=12)
    doc.new_page()  # a blank second page
    doc.save(path)
    doc.close()


def test_open_and_page_count(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    doc = PDFDocument.open(str(p))
    assert doc.page_count == 2
    doc.close()


def test_render_page_produces_pixels(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    doc = PDFDocument.open(str(p))
    img = doc.render_page(0, zoom=1.5)
    assert img.width > 0 and img.height > 0
    assert len(img.samples) == img.stride * img.height
    doc.close()


def test_search_finds_text(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    doc = PDFDocument.open(str(p))
    hits = doc.search_page(0, "searchable")
    assert len(hits) == 1
    assert len(hits[0]) == 4  # (x0, y0, x1, y1)
    assert doc.search_page(0, "nonexistent") == []
    doc.close()


def test_blank_document_and_save(tmp_path):
    doc = PDFDocument.blank()
    assert doc.page_count == 1
    assert doc.is_dirty is True
    out = tmp_path / "out.pdf"
    doc.save(str(out))
    assert out.exists()
    assert doc.is_dirty is False
    doc.close()


def _annot_count(doc: PDFDocument, index: int) -> int:
    return len(list(doc.fitz_doc[index].annots()))


def test_annotations_add_and_persist(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    doc = PDFDocument.open(str(p))

    doc.add_highlight(0, (72, 60, 260, 90))
    doc.add_underline(0, (72, 110, 320, 132))
    doc.add_text_box(0, (72, 200, 320, 260), "hi there")
    doc.add_ink(0, [[(80, 300), (160, 320), (240, 300)]])
    assert _annot_count(doc, 0) == 4
    assert doc.is_dirty is True

    out = tmp_path / "annotated.pdf"
    doc.save(str(out))
    doc.close()

    reopened = PDFDocument.open(str(out))
    assert _annot_count(reopened, 0) == 4
    reopened.close()


def test_undo_removes_last_annotation(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    doc = PDFDocument.open(str(p))
    doc.add_highlight(0, (72, 60, 260, 90))
    doc.add_underline(0, (72, 110, 320, 132))
    assert _annot_count(doc, 0) == 2

    assert doc.undo_last_annot() is True
    assert _annot_count(doc, 0) == 1
    assert doc.undo_last_annot() is True
    assert _annot_count(doc, 0) == 0
    assert doc.undo_last_annot() is False  # empty stack
    doc.close()


def test_add_image_marks_dirty(tmp_path):
    p = tmp_path / "sample.pdf"
    _make_sample(str(p))
    sig = tmp_path / "sig.png"
    pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 120, 50))
    pix.clear_with(200)
    pix.save(str(sig))

    doc = PDFDocument.open(str(p))
    doc.add_image(0, (400, 60, 520, 110), str(sig))
    assert doc.is_dirty is True
    doc.close()
