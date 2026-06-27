# PDF Editor

A desktop PDF **reader and editor** for Windows, in the spirit of Foxit PDF
Editor. Built with **Python + PySide6** (Qt 6 GUI) and **PyMuPDF** (the `fitz`
rendering/editing engine).

> **Status:** Phase 1 (reader core) complete. Editing features land in later
> phases — see the roadmap below.

## Features

### Phase 1 — Reader core ✅ (done)
- Open and render PDFs (continuous, vertical scroll)
- Zoom in / out
- Page thumbnails with click-to-navigate
- Full-text search with on-page highlighting
- Save / Save As (incremental save in place)

### Roadmap
- **Phase 2 — Annotations:** highlight, underline, text box, freehand + image
  signature
- **Phase 3 — Page operations:** insert blank page, insert pages from another
  PDF, reorder / delete / rotate
- **Phase 4 — Edit existing text:** click a paragraph to turn it into an
  editable text box (extract → edit → redact-and-rewrite). This is the hardest
  feature; see the note below.

#### A note on editing existing text
True text editing in PDF is genuinely hard — PDFs store positioned glyphs, not
flowing paragraphs. Our approach: use PyMuPDF's structured text
(`get_text("rawdict")`) to group lines into paragraphs, let you edit one in an
overlay box, then redact the original region and re-draw the new text. This
works well for ordinary paragraphs; perfect font matching and complex layouts
(justified columns, tables, text around images) are best-effort, the same
limitation every PDF editor has.

## Run from source

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py                     # or: python run.py path/to/file.pdf
```

## Build a Windows executable

See [`packaging/build_windows.md`](packaging/build_windows.md). In short, on a
Windows machine: `pip install pyinstaller` then run the documented PyInstaller
command to get `dist\PDFEditor\PDFEditor.exe`.

## Tests

The core engine is UI-agnostic and tested headlessly (no display needed):

```bash
pip install pytest
python -m pytest
```

## Project layout

```
app/
  core/            # PyMuPDF wrappers — no Qt imports (headless-testable)
    document.py    #   PDFDocument: open/render/search/save
  ui/              # PySide6 layer
    main_window.py #   window, menu, toolbar, file/search/zoom wiring
    page_view.py   #   scrollable, zoomable page surface + highlights
    thumbnail_panel.py
    render_bridge.py  # PageImage -> QImage/QPixmap (only render path touching Qt)
  main.py          # QApplication bootstrap
run.py             # launcher
tests/             # headless core tests
packaging/         # Windows build instructions
```

The deliberate split — **`core` never imports Qt** — keeps the PDF logic
testable without a display and makes the editing engine reusable.
