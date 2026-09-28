"""The Minds words on the blotter, and which boxes a Minds screen shows.

The same sentences sit in web/src/lib/ai/mind-words.ts (the web desk ``/mind``) and
desktop/renderer/settings.html (the overlay Settings window); a test holds all three together.

The blotter has no AI of its own. Its pets always use House lines, so it shows the Minds intro
and the House lines note, and never a model, address, or key box.
"""

from __future__ import annotations

from .listener import PRESETS

MINDS_INTRO = "Pets talk without an AI. Adding one is optional."
HOUSE_NOTE = "House lines need nothing else. Your pets answer with their own words."
ADDRESS_LABEL = "AI website address"
ADDRESS_HELP = "Where that AI answers. Picking an AI fills this in, so most people leave it alone."
KEY_LABEL = "Your key for that AI website"
KEY_HELP = "A secret code from that AI website's own page. Keep it secret, like a password."

_BY_ID = {row["id"]: row for row in PRESETS}


def is_house_lines(preset_id: str | None) -> bool:
    """True for House lines, and for anything unknown (which talks with House lines too)."""
    row = _BY_ID.get(preset_id or "")
    return row is None or row["kind"] == "local"


def mind_fields(preset_id: str | None) -> list[dict]:
    """The boxes a Minds screen shows for this choice. House lines shows none."""
    if is_house_lines(preset_id):
        return []
    return [
        {"id": "model", "label": "Model", "help": ""},
        {"id": "base", "label": ADDRESS_LABEL, "help": ADDRESS_HELP},
        {"id": "key", "label": KEY_LABEL, "help": KEY_HELP},
    ]


def blotter_minds_text() -> str:
    """What the blotter says about minds: its pets use House lines, so there is nothing to set up."""
    return f"{MINDS_INTRO} {HOUSE_NOTE}"
