@echo off
REM ====================================================================
REM  One-click Windows build for the PDF Editor.
REM  Run this on a Windows machine that has Python 3.11+ installed.
REM  Produces: dist\PDFEditor\PDFEditor.exe
REM ====================================================================

setlocal
cd /d "%~dp0\.."

echo.
echo [1/4] Creating virtual environment...
py -3.11 -m venv .venv || python -m venv .venv

echo.
echo [2/4] Installing dependencies...
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install pyinstaller

echo.
echo [3/4] Building the executable...
pyinstaller --noconfirm --clean packaging\PDFEditor.spec

echo.
echo [4/4] Done.
if exist "dist\PDFEditor\PDFEditor.exe" (
  echo.
  echo SUCCESS: dist\PDFEditor\PDFEditor.exe
  echo Double-click that file to launch the app.
) else (
  echo.
  echo BUILD FAILED: dist\PDFEditor\PDFEditor.exe was not created.
  echo Scroll up for the PyInstaller error.
)
echo.
pause
endlocal
