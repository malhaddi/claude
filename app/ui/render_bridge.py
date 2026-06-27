"""Convert a headless PageImage into a Qt QImage/QPixmap.

This is the only place the rendering path touches Qt, so the core stays
import-free of PySide6 and remains testable without a display.
"""
from __future__ import annotations

from PySide6.QtGui import QImage, QPixmap

from app.core.document import PageImage


def page_image_to_qimage(img: PageImage) -> QImage:
    qimg = QImage(
        img.samples,
        img.width,
        img.height,
        img.stride,
        QImage.Format.Format_RGBA8888,
    )
    # Copy so the QImage owns its buffer (samples may be freed by fitz).
    return qimg.copy()


def page_image_to_pixmap(img: PageImage) -> QPixmap:
    return QPixmap.fromImage(page_image_to_qimage(img))
