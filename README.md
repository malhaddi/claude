# PDF Editor

A desktop PDF **reader and editor** for Windows, in the spirit of Foxit PDF
Editor. Built with **Python + PySide6** (Qt 6 GUI) and **PyMuPDF** (the `fitz`
rendering/editing engine).

> **Status:** Phases 1–4 complete — reader core, annotations, multi-document
> tabs, page operations, and click-to-edit existing text.

## Features

### Phase 1 — Reader core ✅ (done)
- Open and render PDFs (continuous, vertical scroll)
- **Multiple PDFs open at once in tabs** (closable, reorderable)
- Zoom in / out
- Page thumbnails with click-to-navigate
- Full-text search with on-page highlighting
- Save / Save As (incremental save in place)

### Phase 2 — Annotations ✅ (done)
- **Highlight** and **underline** text (drag a box over it)
- **Text box** — drag a box, type text (free-text annotation)
- **Draw** — freehand ink
- **Signature** — place a chosen PNG/JPG image (e.g. a scanned signature)
- Per-tool **color picker**
- **Undo** (Ctrl+Z) the last annotation
- Tools live in an exclusive toolbar group; selection persists across tabs

### Phase 3 — Page operations ✅ (done)
- **Insert blank page** (toolbar button, or before/after via thumbnail menu)
- **Insert pages from another PDF**
- **Rotate** left / right, **delete**, and **reorder** (move up/down)
- All available from the right-click menu on any page thumbnail

### Phase 4 — Edit existing text ✅ (done)
- Pick the **Edit Text** tool, then **click any paragraph** — it becomes an
  editable box in place, pre-filled with the text in a matching size.
- Add or delete text freely; **Ctrl+Enter** (or click away) commits, **Esc**
  cancels. On commit the original paragraph is redacted and the new text is
  written back, growing the box downward as needed so nothing clips.
- See the limitations note below — this is best-effort, as in every PDF editor.

#### A note on editing existing text
True text editing in PDF is genuinely hard — PDFs store positioned glyphs, not
flowing paragraphs. Our approach: use PyMuPDF's structured text
(`get_text("dict")`) to group lines into paragraphs, let you edit one in an
overlay box, then redact the original region and re-draw the new text. Known
best-effort limitations (shared by every PDF editor):

- **Font matching:** embedded subset fonts usually can't be reused, so edited
  text is re-drawn in the closest base-14 face (Helvetica / Times / Courier),
  which may look slightly different from untouched text.
- **Reflow & layout:** works well for ordinary paragraphs; justified columns,
  tables, and text wrapped around images won't always reflow perfectly.
- **Rotated pages:** in-place editing assumes an unrotated page; editing text
  on a rotated page is not yet aligned.

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
    document.py    #   PDFDocument: render/search/annotate/page-ops/text-edit
  ui/              # PySide6 layer
    main_window.py #   tabbed shell: menu, toolbar, tools, file/search/zoom
    document_tab.py#   one open PDF (thumbnails + page view + page ops)
    page_view.py   #   page surface: annotation tools + inline text editor
    thumbnail_panel.py  # thumbnails + right-click page-operations menu
    tools.py       #   editing Tool enum (select/highlight/.../edit-text)
    render_bridge.py  # PageImage -> QImage/QPixmap (only render path touching Qt)
  main.py          # QApplication bootstrap
run.py             # launcher
tests/             # headless core tests
packaging/         # Windows build instructions
```

The deliberate split — **`core` never imports Qt** — keeps the PDF logic
testable without a display and makes the editing engine reusable.
