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
        "cyber_dragon",
        "volt_dragon",
        "trace_dragon",
        "flux_dragon",
        "spark_dragon",
        "ion_dragon",
        "gauss_dragon",
        "relay_dragon",
        "fuse_dragon",
        "ground_dragon",
        "hognose",
        "garter",
    }
)
_HEAT_SNAKE_MARKERS = ("snake", "boa", "python")
_HEAT_RESERVED = frozenset({"iguana", "turtle", "dragon", "cat"})
_HEAT_GLOW = frozenset({"cyber_dragon"})
_HEAT_COIL = frozenset({"volt_dragon"})
_HEAT_PATH = frozenset({"trace_dragon"})
_HEAT_FIELD = frozenset({"flux_dragon"})
_HEAT_CRACKLE = frozenset({"spark_dragon"})
_HEAT_HAZE = frozenset({"ion_dragon"})
_HEAT_FILING = frozenset({"gauss_dragon"})
_HEAT_CLICK = frozenset({"relay_dragon"})
_HEAT_FILAMENT = frozenset({"fuse_dragon"})
_HEAT_STRAP = frozenset({"ground_dragon"})
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
        return "It is raining outside. I will stay in, thanks."
    if w == "wind":
        if key in _WIND_KEYS:
            return "The air has opinions."
        return "Something moved that was not me."
    if w == "heat":
        if key in _HEAT_RESERVED:
            return "This patch of warmth is reserved."
        if key in _HEAT_GLOW:
            return "The glow is reserved. Heat is weather I already keep."
        if key in _HEAT_COIL:
            return "The coil is reserved. Heat is weather I already keep."
        if key in _HEAT_PATH:
            return "The path is reserved. Heat is weather I already keep."
        if key in _HEAT_FIELD:
            return "The field is reserved. Heat is weather I already keep."
        if key in _HEAT_CRACKLE:
            return "The crackle is reserved. Heat is weather I already keep."
        if key in _HEAT_HAZE:
            return "The haze is reserved. Heat is weather I already keep."
        if key in _HEAT_FILING:
            return "The filings are reserved. Heat is weather I already keep."
        if key in _HEAT_CLICK:
            return "The click is reserved. Heat is weather I already keep."
        if key in _HEAT_FILAMENT:
            return "The filament is reserved. Heat is weather I already keep."
        if key in _HEAT_STRAP:
            return "The strap is reserved. Heat is weather I already keep."
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
