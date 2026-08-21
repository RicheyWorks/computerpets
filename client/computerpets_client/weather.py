"""Daily weather the house already uses.

Port of ``web/src/lib/pets/weather.ts``. Same civil-day clock, same four
skies (clear / rain / wind / heat), same sit-or-swim idle. Do not invent
new weather types here.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

Weather = Literal["clear", "rain", "wind", "heat"]

_SWIMMERS = frozenset({"goldfish", "axolotl", "penguin", "mallard", "canada_goose"})
_RAIN_LINE_KEYS = frozenset({"goldfish", "axolotl", "turtle", "penguin", "mallard", "canada_goose"})
_WIND_KEYS = frozenset(
    {
        "budgie",
        "parrot",
        "toucan",
        "phoenix",
        "crow",
        "raven",
        "red_tail",
        "chickadee",
        "hummingbird",
        "pileated",
        "robin",
    }
)
_HEAT_SIT = frozenset(
    {
        "iguana",
        "turtle",
        "cat",
        "dragon",
        "hognose",
        "garter",
    }
)
_HEAT_SNAKE_MARKERS = ("snake", "boa", "python")
_HEAT_RESERVED = frozenset({"iguana", "turtle", "dragon", "cat"})
_HEAT_CLAUSE = frozenset(
    {
        "ball_python",
        "corn_snake",
        "kingsnake",
        "green_tree_python",
        "hognose",
        "garter",
        "boa",
        "milk_snake",
        "rosy_boa",
        "carpet_python",
    }
)


def civil_day_number(now: datetime | None = None) -> int:
    """UTC day count of the civil Y-M-D — same as weather.ts / visitor.ts."""
    stamp = now or datetime.now()
    start = datetime(stamp.year, stamp.month, stamp.day, tzinfo=timezone.utc)
    return int(start.timestamp() // 86400)


def weather_of(now: datetime | None = None) -> Weather:
    day = civil_day_number(now)
    n = ((day * 9301 + 49297) % 233280) / 233280
    if n < 0.4:
        return "clear"
    if n < 0.62:
        return "rain"
    if n < 0.82:
        return "wind"
    return "heat"


def weather_label(w: Weather) -> str:
    if w == "rain":
        return "Rain"
    if w == "wind":
        return "Wind"
    if w == "heat":
        return "Heat"
    return "Clear"


def weather_line(key: str, w: Weather) -> str | None:
    if w == "rain":
        if key in _RAIN_LINE_KEYS:
            return "Proper weather. At last."
        return "The blotter is honest about rain."
    if w == "wind":
        if key in _WIND_KEYS:
            return "The air has opinions."
        return "Something moved that was not me."
    if w == "heat":
        if key in _HEAT_RESERVED:
            return "This patch of warmth is reserved."
        if key in _HEAT_CLAUSE:
            return "Heat. I was waiting for this clause."
        return "The lamp is working overtime."
    return None


def weather_idle(key: str, w: Weather) -> Literal["wander", "sit", "sleep"] | None:
    if w == "rain":
        if key in _SWIMMERS:
            return "wander"
        return "sit"
    if w == "heat" and (
        key in _HEAT_SIT or any(mark in key for mark in _HEAT_SNAKE_MARKERS)
    ):
        return "sit"
    if w == "wind" and key in _WIND_KEYS:
        return "wander"
    return None
