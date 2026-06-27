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
    EDIT_TEXT = auto()   # click a paragraph to edit its text in place

    @property
    def is_rect_drag(self) -> bool:
        """Tools that drop something into an arbitrary dragged rectangle."""
        return self in (Tool.TEXTBOX, Tool.SIGNATURE)

    @property
    def is_text_select(self) -> bool:
        """Tools driven by selecting actual text (drag from word to word)."""
        return self in (Tool.SELECT, Tool.HIGHLIGHT, Tool.UNDERLINE)
