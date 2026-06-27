"""Application bootstrap: create the QApplication and show the main window."""
from __future__ import annotations

import sys

from PySide6.QtWidgets import QApplication

from app.ui.main_window import MainWindow


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv if argv is None else argv)
    qt_app = QApplication(argv)
    qt_app.setApplicationName("PDF Editor")

    window = MainWindow()
    window.show()

    # Open any files passed on the command line.
    for path in argv[1:]:
        window.load_path(path)

    return qt_app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
