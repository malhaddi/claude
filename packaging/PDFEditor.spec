# PyInstaller spec for the PDF Editor.
#
# Folder ("onedir") build: produces dist/PDFEditor/PDFEditor.exe plus a support
# folder. Faster to start and fewer antivirus false positives than --onefile.
#
# Build:  pyinstaller --noconfirm --clean packaging/PDFEditor.spec
#
# Works on Windows (the real target), and also on Linux/macOS for validation —
# PyInstaller always builds for the OS it runs on.
import os

from PyInstaller.utils.hooks import collect_all

# Resolve paths from the spec's own location (packaging/) so the build works
# no matter which directory PyInstaller is invoked from.
ROOT = os.path.dirname(SPECPATH)  # repo root (parent of packaging/)

# Bundle PyMuPDF (compiled binaries + data) and the Qt runtime we use.
datas, binaries, hiddenimports = [], [], []
for package in ("fitz", "PySide6"):
    pkg_datas, pkg_binaries, pkg_hidden = collect_all(package)
    datas += pkg_datas
    binaries += pkg_binaries
    hiddenimports += pkg_hidden

# Qt modules we never import — excluding them keeps the build much smaller.
excludes = [
    "PySide6.QtWebEngineCore",
    "PySide6.QtWebEngineWidgets",
    "PySide6.QtWebEngineQuick",
    "PySide6.Qt3DCore",
    "PySide6.Qt3DRender",
    "PySide6.QtQuick",
    "PySide6.QtQuick3D",
    "PySide6.QtQml",
    "PySide6.QtMultimedia",
    "PySide6.QtMultimediaWidgets",
    "PySide6.QtCharts",
    "PySide6.QtDataVisualization",
    "PySide6.QtPositioning",
    "PySide6.QtBluetooth",
    "PySide6.QtNfc",
    "PySide6.QtSensors",
    "tkinter",
]

a = Analysis(
    [os.path.join(ROOT, "run.py")],
    pathex=[ROOT],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    excludes=excludes,
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="PDFEditor",
    debug=False,
    strip=False,
    upx=False,
    console=False,  # GUI app — no console window
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=False,
    name="PDFEditor",
)
