"""Editing tool modes shared between the toolbar and the page view."""
from __future__ import annotations

from enum import Enum, auto


class Tool(Enum):
    SELECT = auto()      # no editing; normal scrolling/selection
    HIGHLIGHT = auto()   # drag over text to highlight
    UNDERLINE = auto()   # drag over text to underline
    TEXTBOX = auto()     # drag a box, then type text
    INK = auto()         # freehand drawing
    SIGNATURE = auto()   # drag a box to place a chosen image

    @property
    def is_rect_drag(self) -> bool:
        """Tools driven by dragging a rectangle (vs. freehand or none)."""
        return self in (Tool.HIGHLIGHT, Tool.UNDERLINE, Tool.TEXTBOX, Tool.SIGNATURE)
