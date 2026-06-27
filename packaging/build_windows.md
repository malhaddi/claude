# Building the Windows `.exe`

The app is developed on Linux but ships as a standalone Windows executable.
Run these steps **on a Windows machine** (or a Windows CI runner) — PyInstaller
produces an executable for the OS it runs on; it does not cross-compile.

## 1. Set up the environment (once)

```bat
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller
```

## 2. Sanity-check it runs from source

```bat
python run.py
```

Open a PDF to confirm rendering, zoom, thumbnails, and search all work.

## 3. Build the executable

```bat
pyinstaller --noconfirm --clean --windowed --name "PDFEditor" ^
  --collect-all fitz ^
  --collect-all PySide6 ^
  run.py
```

- `--windowed` hides the console window (GUI app).
- `--collect-all fitz` bundles PyMuPDF's compiled binaries and data.
- `--collect-all PySide6` pulls in the Qt plugins (the `platforms\qwindows.dll`
  plugin is required or the app won't start).

The result is `dist\PDFEditor\PDFEditor.exe` plus its support folder.

## 4. (Optional) single-file build

```bat
pyinstaller --noconfirm --clean --windowed --onefile --name "PDFEditor" ^
  --collect-all fitz --collect-all PySide6 run.py
```

`--onefile` yields a single `PDFEditor.exe` (slower first launch — it unpacks
to a temp dir). The folder build above starts faster; pick whichever you prefer.

## Troubleshooting

- **"Could not load the Qt platform plugin 'windows'":** the PySide6 plugins
  weren't bundled — make sure `--collect-all PySide6` is present.
- **Blank/black pages:** usually a missing PyMuPDF binary — confirm
  `--collect-all fitz` and that `import fitz` works from `python run.py` first.
- **Antivirus flags the onefile exe:** common false positive for PyInstaller
  onefile builds; the folder build avoids it. Code-signing removes it for good.
