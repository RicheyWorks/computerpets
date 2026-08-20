"""The hive keeps a line. Wax is the place. Comb, Keep, and Hum sit on it.

Brood and stores ride the same living line the blotter already writes.
Neglect can go quiet. Comb stays Comb. It is not a shop.

Same map as web ``hive.ts`` and Electron ``hive.js``.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Literal

HIVE_PLACE = "honeycomb"
HIVE_SITTERS = ("honeybee", "honey_queen", "honey_drone")
HIVE_WORKER = "honeybee"
HIVE_BROOD_CELLS = 8

HiveSeat = Literal["comb", "keep", "hum", "worker"]


@dataclass(frozen=True)
class HiveColony:
    brood: int
    stores: int
    quiet: bool


@dataclass(frozen=True)
class CombSeat:
    key: str
    seat: HiveSeat
    x: int
    lift: int


def is_hive_place(key: str | None) -> bool:
    return key == HIVE_PLACE


def sits_on_wax(key: str | None) -> bool:
    return key in ("honeybee", "honey_queen", "honey_drone")


def clamp_brood(n: float) -> int:
    return max(0, min(HIVE_BROOD_CELLS, round(n)))


def cells_from_health(health: float) -> int:
    """Eight cells from a hundred of health. A spent comb is an empty brood."""
    if health != health:  # NaN
        return 0
    return clamp_brood(health / 12.5)


def colony_of(
    stats: object,
    departed: bool = False,
) -> HiveColony:
    brood_raw = getattr(stats, "brood", None)
    if brood_raw is None and isinstance(stats, dict):
        brood_raw = stats.get("brood")
    stores_raw = getattr(stats, "stores", None)
    if stores_raw is None and isinstance(stats, dict):
        stores_raw = stats.get("stores")
    health = getattr(stats, "health", None)
    if health is None and isinstance(stats, dict):
        health = stats.get("health", 0)
    hunger = getattr(stats, "hunger", None)
    if hunger is None and isinstance(stats, dict):
        hunger = stats.get("hunger", 0)
    brood = clamp_brood(brood_raw) if isinstance(brood_raw, (int, float)) else cells_from_health(float(health or 0))
    stores = (
        max(0, min(100, round(stores_raw)))
        if isinstance(stores_raw, (int, float))
        else max(0, min(100, round(float(hunger or 0))))
    )
    return HiveColony(
        brood=brood,
        stores=stores,
        quiet=bool(departed or float(health or 0) <= 0 or brood <= 0),
    )


def stamp_colony(stats: object) -> dict[str, int]:
    """Name the colony on the living line. Hunger is stores. Health is brood."""
    health = getattr(stats, "health", None)
    if health is None and isinstance(stats, dict):
        health = stats.get("health", 0)
    hunger = getattr(stats, "hunger", None)
    if hunger is None and isinstance(stats, dict):
        hunger = stats.get("hunger", 0)
    return {
        "brood": cells_from_health(float(health or 0)),
        "stores": max(0, min(100, round(float(hunger or 0)))),
    }


def comb_seats() -> tuple[CombSeat, ...]:
    return (
        CombSeat(key="honey_queen", seat="keep", x=286, lift=54),
        CombSeat(key="honeybee", seat="comb", x=214, lift=46),
        CombSeat(key="honeybee", seat="worker", x=348, lift=42),
        CombSeat(key="honey_drone", seat="hum", x=392, lift=36),
    )


def colony_word(colony: HiveColony) -> str:
    if colony.quiet:
        return "The line went quieter."
    if colony.stores < 22:
        return "A nest should not be this empty."
    if colony.brood <= 1:
        return "The brood is thin."
    return "Brood in some cells. Stores in others."


def hive_walkers(keys: Iterable[str]) -> list[str]:
    """Walkers stay on the wood. Wax is the place. Sitters keep the comb."""
    return [key for key in keys if key != HIVE_PLACE and not sits_on_wax(key)]
