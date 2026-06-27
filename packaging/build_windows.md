# Getting the Windows `.exe`

There are two ways to produce the Windows executable. **Option A needs no tools
on your machine** — GitHub builds it for you. Option B is for building locally
on a Windows PC.

---

## Option A — Let GitHub build it (recommended)

A GitHub Actions workflow (`.github/workflows/build-windows.yml`) builds the
`.exe` on a Windows server every time the branch is pushed, and also on demand.

1. Go to the repository on GitHub → **Actions** tab.
2. Open the latest **Build Windows EXE** run (or click **Run workflow** to start
   one manually).
3. Wait for it to finish (green check, a few minutes).
4. Scroll to **Artifacts** at the bottom of the run page and download
   **`PDFEditor-windows`** (a `.zip`).
5. Unzip it anywhere on your Windows 11 PC and double-click **`PDFEditor.exe`**.

That's it — no Python, no build tools required on your side.

---

## Option B — Build locally on Windows

Requires **Python 3.11+** installed on a Windows machine.

**Easiest:** double-click `packaging\build_windows.bat`. It creates a virtual
environment, installs everything, builds, and tells you where the `.exe` is.

**Manual equivalent:**

```bat
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller
pyinstaller --noconfirm --clean packaging\PDFEditor.spec
```

Result: `dist\PDFEditor\PDFEditor.exe` (plus its support folder). Zip the whole
`dist\PDFEditor` folder if you want to copy it to another PC.

---

## What the build produces

A **folder build** (`dist\PDFEditor\`) containing `PDFEditor.exe` and its
runtime. This starts faster and triggers fewer antivirus false positives than a
single-file build. To distribute, zip and share the whole folder; the user runs
`PDFEditor.exe` inside it.

### Want a single-file `.exe` instead?

Edit `packaging/PDFEditor.spec`: replace the `EXE(... exclude_binaries=True ...)`
+ `COLLECT(...)` pair with a single onefile `EXE` that includes `a.binaries` and
`a.datas`. Onefile is one tidy `PDFEditor.exe` but launches slower (it unpacks
to a temp folder) and is more prone to antivirus false positives.

## Troubleshooting

- **"Could not load the Qt platform plugin 'windows'":** the PySide6 plugins
  weren't bundled. The spec uses `collect_all("PySide6")`, which includes them —
  make sure you built from `packaging\PDFEditor.spec`.
- **Blank/black pages:** usually a missing PyMuPDF binary. The spec bundles it
  via `collect_all("fitz")`; confirm `python run.py` works from source first.
- **Antivirus flags the exe:** common PyInstaller false positive. The folder
  build minimizes it; code-signing removes it for good.

> The build config was validated by packaging the app and launching the bundled
> binary, so the imports, Qt plugins, and PyMuPDF binaries are all collected
> correctly. PyInstaller builds for the OS it runs on — that's why the Windows
> `.exe` comes from the Windows runner (Option A) or a Windows PC (Option B),
> not from a Linux/Mac dev box.
