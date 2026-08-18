"""House clock the living desk already uses.

Port of ``web/src/lib/pets/hours.ts``. Same dawn / day / dusk / night, same
sixty REST windows, same return lines. Do not invent rest hours or copy.
"""

from __future__ import annotations

import json
import time
from datetime import datetime
from pathlib import Path
from typing import Literal

from .paths import default_user_data_dir

DayPart = Literal["dawn", "day", "dusk", "night"]

# Sleep windows: [startHour, endHour). Overnight if start > end.
REST: dict[str, tuple[int, int]] = {
    "red_panda": (22, 7),
    "cat": (13, 16),
    "dog": (21, 6),
    "rabbit": (22, 6),
    "hamster": (8, 18),
    "guinea_pig": (21, 6),
    "turtle": (20, 7),
    "goldfish": (23, 5),
    "budgie": (19, 6),
    "fox": (9, 17),
    "penguin": (22, 6),
    "parrot": (20, 6),
    "ferret": (10, 17),
    "hedgehog": (8, 18),
    "chinchilla": (21, 7),
    "axolotl": (22, 8),
    "toucan": (19, 6),
    "iguana": (20, 8),
    "dragon": (1, 8),
    "phoenix": (23, 6),
    "ball_python": (8, 17),
    "corn_snake": (9, 18),
    "kingsnake": (21, 6),
    "green_tree_python": (8, 17),
    "hognose": (20, 7),
    "garter": (21, 6),
    "boa": (22, 7),
    "milk_snake": (9, 18),
    "rosy_boa": (21, 7),
    "carpet_python": (8, 17),
    "octopus": (8, 17),
    "cuttlefish": (8, 17),
    "nautilus": (8, 18),
    "moon_jelly": (23, 5),
    "sea_star": (21, 6),
    "hermit_crab": (8, 18),
    "horseshoe_crab": (8, 18),
    "seahorse": (20, 6),
    "manta": (21, 6),
    "moray": (8, 17),
    "moss": (20, 6),
    "maidenhair": (20, 7),
    "ginkgo": (19, 6),
    "oak": (20, 6),
    "water_lily": (20, 6),
    "orchid": (19, 6),
    "saguaro": (8, 17),
    "venus_flytrap": (21, 6),
    "pitcher": (21, 6),
    "sundew": (20, 6),
    "honeybee": (20, 6),
    "monarch": (20, 6),
    "luna": (8, 18),
    "firefly": (8, 18),
    "darner": (21, 6),
    "stick": (21, 6),
    "carpenter_ant": (8, 18),
    "ladybird": (20, 6),
    "mantis": (20, 6),
    "cicada": (21, 6),
}

FALLBACK_REST: tuple[int, int] = (22, 7)
SEEN_NAME = "seen.json"
CHECK_HOUR = 14

HIDE_LINE: dict[str, str] = {
    "red_panda": "I went where the ribbon goes.",
    "cat": "The ledge is closed.",
    "dog": "I will be under the desk. Call if you walk.",
    "rabbit": "Under the chair. Thump if you need me.",
    "hamster": "The pouch is a room.",
    "guinea_pig": "Hay-side. Quiet.",
    "turtle": "I am still here. You will not notice.",
    "goldfish": "Behind the glass. Loop later.",
    "budgie": "Cage-corner. Soft.",
    "fox": "The left pocket. Obviously.",
    "penguin": "A small bow, then away.",
    "parrot": "I left a note. It says 'brb'.",
    "ferret": "I took the dongle with me.",
    "hedgehog": "A polite curl, offstage.",
    "chinchilla": "Dust-side.",
    "axolotl": "I receded. Calmly.",
    "toucan": "The perch is vacant. Briefly.",
    "iguana": "I am a stone now.",
    "dragon": "The hoard is attended. From elsewhere.",
    "phoenix": "Ash-side. I will be back.",
    "ball_python": "I went inside the bun.",
    "corn_snake": "I took the pencil canyon.",
    "kingsnake": "The drawer is closed. By me.",
    "green_tree_python": "Above you. Still green.",
    "hognose": "I died backstage.",
    "garter": "Mid-route. Do not wait.",
    "boa": "Under the river of blotter.",
    "milk_snake": "Behind a rumor.",
    "rosy_boa": "The corner kept me.",
    "carpet_python": "Off the legend. Still on the shelf.",
    "octopus": "I went inside the cup.",
    "cuttlefish": "Behind a flush.",
    "nautilus": "In the older room.",
    "moon_jelly": "A lower drift.",
    "sea_star": "I am still here. You will not notice.",
    "hermit_crab": "The lid is closed. By me.",
    "horseshoe_crab": "Under the tray.",
    "seahorse": "Hitched. Do not jostle.",
    "manta": "Above the bowl. Still a kite.",
    "moray": "Inside the jamb.",
    "moss": "Under the felt.",
    "maidenhair": "Inside the coil.",
    "ginkgo": "Behind a gold.",
    "oak": "Inside the dish.",
    "water_lily": "Under the pad.",
    "orchid": "Behind a closed moth.",
    "saguaro": "Inside the store.",
    "venus_flytrap": "Inside the cup.",
    "pitcher": "Inside the well.",
    "sundew": "Behind a glitter.",
    "honeybee": "Inside the comb.",
    "monarch": "Inside the cup.",
    "luna": "Behind a dusk.",
    "firefly": "Behind a flash.",
    "darner": "Above the lamp.",
    "stick": "Among the pencils.",
    "carpenter_ant": "Inside the grain.",
    "ladybird": "Under a leaf.",
    "mantis": "Behind a fold.",
    "cicada": "Under the stone.",
}

SNACK_LINE: dict[str, str] = {
    "red_panda": "A small treaty. Bamboo-adjacent.",
    "cat": "I allow this crumb.",
    "dog": "For me? I have prepared a sit.",
    "rabbit": "A green thing. Correct.",
    "hamster": "It fits. Officially.",
    "guinea_pig": "Wheek, but smaller.",
    "turtle": "I will arrive at the crumb in due course.",
    "goldfish": "It drifted. I followed.",
    "budgie": "Seed. The only review that matters.",
    "fox": "I found it first.",
    "penguin": "A pebble of food. Accepted.",
    "parrot": "Crunch. Noted.",
    "ferret": "Mine. Also that other bit.",
    "hedgehog": "A quiet nibble.",
    "chinchilla": "That crumb was a scandal. Now it is gone.",
    "axolotl": "I grew a little more fed.",
    "toucan": "The bill approves.",
    "iguana": "I blinked at it. Then I ate.",
    "dragon": "Tribute. Modest.",
    "phoenix": "Warm. Good.",
    "ball_python": "I will sit on the thought of it.",
    "corn_snake": "Pinkie diplomacy. Accepted.",
    "kingsnake": "Tribute in bands of flavor.",
    "green_tree_python": "Warmth first. Then the treaty.",
    "hognose": "I will eat this after my scene.",
    "garter": "Worm treaty. Signed in three copies.",
    "boa": "Tribute. I will take my time.",
    "milk_snake": "An egg of a treaty.",
    "rosy_boa": "A mouse of manners.",
    "carpet_python": "A morsel for the cartographer.",
    "octopus": "A crab of a treaty.",
    "cuttlefish": "A shrimp of a treaty.",
    "nautilus": "Tribute for the older office.",
    "moon_jelly": "A drift of food. Accepted.",
    "sea_star": "I will finish this this afternoon.",
    "hermit_crab": "Scrap diplomacy. Accepted.",
    "horseshoe_crab": "A worm of a treaty.",
    "seahorse": "A brine of a treaty.",
    "manta": "A filter of a treaty.",
    "moray": "A fish of a treaty.",
    "moss": "Dew of a treaty.",
    "maidenhair": "Mist of a treaty.",
    "ginkgo": "A leaf of a treaty.",
    "oak": "Water of a treaty.",
    "water_lily": "Silt of a treaty.",
    "orchid": "Mist of a treaty.",
    "saguaro": "Rain of a treaty.",
    "venus_flytrap": "A fly of a treaty.",
    "pitcher": "A midge of a treaty.",
    "sundew": "A gnat of a treaty.",
    "honeybee": "Nectar of a treaty.",
    "monarch": "Milkweed of a treaty.",
    "luna": "Nothing of a treaty. I decline the bite.",
    "firefly": "A midge of a treaty.",
    "darner": "A mosquito of a treaty.",
    "stick": "A leaf of a treaty.",
    "carpenter_ant": "Honeydew of a treaty.",
    "ladybird": "An aphid of a treaty.",
    "mantis": "A fly of a treaty.",
    "cicada": "Sap of a treaty.",
}


def civil_hour(now: datetime | None = None) -> int:
    stamp = now or datetime.now()
    return stamp.hour


def is_resting_hour(key: str, hour: int | None = None) -> bool:
    when = civil_hour() if hour is None else hour
    start, end = REST.get(key, FALLBACK_REST)
    if start == end:
        return False
    if start < end:
        return when >= start and when < end
    return when >= start or when < end


def day_part(hour: int | None = None) -> DayPart:
    when = civil_hour() if hour is None else hour
    if when >= 5 and when < 8:
        return "dawn"
    if when >= 8 and when < 17:
        return "day"
    if when >= 17 and when < 21:
        return "dusk"
    return "night"


def day_part_label(part: DayPart) -> str:
    if part == "dawn":
        return "Dawn"
    if part == "dusk":
        return "Dusk"
    if part == "night":
        return "Night"
    return "Day"


def hide_line(key: str, existing: str | None = None) -> str:
    if existing:
        return existing
    return HIDE_LINE.get(key, "I went where the ribbon goes.")


def snack_line(key: str, existing: str | None = None) -> str:
    if existing:
        return existing
    return SNACK_LINE.get(key, "A small treaty.")


def return_line(away_ms: float, hour: int | None = None) -> str | None:
    hours = away_ms / 3_600_000
    if hours < 0.4:
        return None
    when = civil_hour() if hour is None else hour
    if hours >= 20:
        if when >= 5 and when < 11:
            return "You were gone a night. I kept the blotter."
        return "A long absence. I counted the dust."
    if hours >= 6:
        return "Hours. I sat in most of them."
    if hours >= 1:
        return "You were elsewhere. I practiced waiting."
    return "Back. I noticed."


def remember_visit(
    key: str,
    *,
    user_data_dir: Path | str | None = None,
    now_ms: int | None = None,
) -> int:
    """Away-ms since last open for this species. Writes ``seen.json`` in the user-data dir."""
    stamp = now_ms if now_ms is not None else int(time.time() * 1000)
    root = Path(user_data_dir) if user_data_dir is not None else default_user_data_dir()
    path = root / SEEN_NAME
    away = 0
    store: dict[str, object] = {}
    try:
        if path.is_file():
            parsed = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(parsed, dict):
                store = parsed
        last = int(store.get(key) or 0)
        if last > 0:
            away = stamp - last
        store[key] = stamp
        root.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(store), encoding="utf-8")
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return away
    return away
