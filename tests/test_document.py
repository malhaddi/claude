"""Headless tests for the core PDF model (no Qt / no display required)."""
from __future__ import annotations

import fitz
import pytest

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


# ----- Phase 3: page operations -------------------------------------------
def _make_labelled(path: str, letters: str) -> None:
    doc = fitz.open()
    for ch in letters:
        doc.new_page().insert_text((72, 72), ch, fontsize=40)
    doc.save(path)
    doc.close()


def _labels(doc: PDFDocument) -> list[str]:
    return [doc.fitz_doc[i].get_text("text").strip() for i in range(doc.page_count)]


def test_insert_blank_page(tmp_path):
    p = tmp_path / "abc.pdf"
    _make_labelled(str(p), "ABC")
    doc = PDFDocument.open(str(p))
    doc.insert_blank_page(1)  # blank becomes index 1
    assert doc.page_count == 4
    assert _labels(doc) == ["A", "", "B", "C"]
    doc.close()


def test_insert_pdf_pages(tmp_path):
    a = tmp_path / "a.pdf"
    b = tmp_path / "b.pdf"
    _make_labelled(str(a), "AB")
    _make_labelled(str(b), "XY")
    doc = PDFDocument.open(str(a))
    added = doc.insert_pdf_pages(1, str(b))  # insert X,Y starting at index 1
    assert added == 2
    assert _labels(doc) == ["A", "X", "Y", "B"]
    doc.close()


def test_delete_page_and_guard(tmp_path):
    p = tmp_path / "abc.pdf"
    _make_labelled(str(p), "ABC")
    doc = PDFDocument.open(str(p))
    doc.delete_page(1)
    assert _labels(doc) == ["A", "C"]
    doc.delete_page(0)
    assert _labels(doc) == ["C"]
    with pytest.raises(ValueError):  # cannot delete the only page
        doc.delete_page(0)
    doc.close()


def test_rotate_page_is_relative(tmp_path):
    p = tmp_path / "a.pdf"
    _make_labelled(str(p), "A")
    doc = PDFDocument.open(str(p))
    doc.rotate_page(0, 90)
    assert doc.fitz_doc[0].rotation == 90
    doc.rotate_page(0, 90)
    assert doc.fitz_doc[0].rotation == 180
    doc.rotate_page(0, -270)
    assert doc.fitz_doc[0].rotation == 270
    doc.close()


def test_move_page_both_directions(tmp_path):
    p = tmp_path / "abcd.pdf"
    _make_labelled(str(p), "ABCD")
    doc = PDFDocument.open(str(p))
    doc.move_page(0, 2)  # A down to index 2
    assert _labels(doc) == ["B", "C", "A", "D"]
    doc.move_page(3, 0)  # D up to index 0
    assert _labels(doc) == ["D", "B", "C", "A"]
    doc.close()


def test_page_op_clears_undo_stack(tmp_path):
    p = tmp_path / "abc.pdf"
    _make_labelled(str(p), "ABC")
    doc = PDFDocument.open(str(p))
    doc.add_highlight(0, (60, 60, 100, 100))
    doc.insert_blank_page(0)          # structural change clears undo
    assert doc.undo_last_annot() is False
    doc.close()


# ----- Phase 4: text editing ----------------------------------------------
def _make_paragraphs(path: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 100), "The quick brown fox jumps over the lazy dog.", fontsize=14)
    page.insert_text((72, 140), "Second paragraph stays untouched.", fontsize=11)
    doc.save(path)
    doc.close()


def test_get_text_blocks(tmp_path):
    p = tmp_path / "para.pdf"
    _make_paragraphs(str(p))
    doc = PDFDocument.open(str(p))
    blocks = doc.get_text_blocks(0)
    assert len(blocks) == 2
    first = blocks[0]
    assert "quick brown fox" in first.text
    assert first.fontsize == 14.0
    assert len(first.bbox) == 4
    doc.close()


def test_text_block_at_hit_and_miss(tmp_path):
    p = tmp_path / "para.pdf"
    _make_paragraphs(str(p))
    doc = PDFDocument.open(str(p))
    hit = doc.text_block_at(0, 120, 100)
    assert hit is not None and "quick" in hit.text
    assert doc.text_block_at(0, 500, 500) is None  # empty area
    doc.close()


def test_replace_text_block(tmp_path):
    p = tmp_path / "para.pdf"
    _make_paragraphs(str(p))
    doc = PDFDocument.open(str(p))
    block = doc.get_text_blocks(0)[0]
    doc.replace_text_block(
        0, block.bbox, "Replaced with entirely different words now.",
        block.fontsize, block.color, block.fontname,
    )
    text = doc.page_text(0)
    assert "Replaced with entirely different" in text
    assert "quick brown fox" not in text          # original removed
    assert "Second paragraph stays untouched." in text  # other block intact
    assert doc.is_dirty is True
    doc.close()


def test_replace_text_block_preserves_baseline(tmp_path):
    p = tmp_path / "para.pdf"
    _make_paragraphs(str(p))
    doc = PDFDocument.open(str(p))
    block = doc.get_text_blocks(0)[0]
    original_baseline = block.first_baseline
    doc.replace_text_block(
        0, block.bbox, "New first line here.", block.fontsize,
        block.color, block.fontname, block.first_baseline,
    )
    # The replacement's first line should sit on (near) the original baseline.
    # Anchoring keeps it within a couple of points; without it, a mismatched
    # substitute font could drift by most of a line.
    new_block = next(b for b in doc.get_text_blocks(0) if b.text.startswith("New first line"))
    assert abs(new_block.first_baseline - original_baseline) < 3.0
    doc.close()


def test_get_text_in_rect(tmp_path):
    p = tmp_path / "para.pdf"
    _make_paragraphs(str(p))
    doc = PDFDocument.open(str(p))
    block = doc.get_text_blocks(0)[0]
    selected = doc.get_text_in_rect(0, block.bbox)
    assert "quick brown fox" in selected
    assert doc.get_text_in_rect(0, (500, 500, 560, 560)) == ""  # empty area
    doc.close()
