"""Snakes go blue, then shed. The old coat stays on the blotter.

Port of ``web/src/lib/pets/shed.ts``. Eight-hour due clock, same ten
shedders, same coat gift. Do not invent a new shed science.
"""

from __future__ import annotations

import random
import time
from dataclasses import dataclass, replace

from .life import CareResult, CareState, clamp, pick_line
from .species import SNAKE_KEYS, Species, is_snake, species_by_key

DUE_MS = 8 * 60 * 60 * 1000

SHED_LINES: dict[str, str] = {
    "ball_python": "I left a copy. The better bun stayed.",
    "corn_snake": "An old sentence. I am the new one.",
    "kingsnake": "The bands were due for a reprint.",
    "green_tree_python": "Emerald, revised. The old loop is on the blotter.",
    "hognose": "I died out of my coat. Reviews were better.",
    "garter": "Three new lines. The old route is discarded.",
    "boa": "I kept the river. I left the bank.",
    "milk_snake": "A rumor I no longer need.",
    "rosy_boa": "The pink is new. The corner may keep the rest.",
    "carpet_python": "A legend I outgrew. Keep the map.",
}

SHED_WAIT: dict[str, str] = {
    "ball_python": "The bun is still honest. Later.",
    "corn_snake": "This coat is mid-sentence.",
    "kingsnake": "The bands are still in session.",
    "green_tree_python": "The loop is not finished being green.",
    "hognose": "I am using this death. Not the coat.",
    "garter": "The patrol is still in this uniform.",
    "boa": "This river has not reached the sea.",
    "milk_snake": "The costume still fits the rumor.",
    "rosy_boa": "The stone is not ready to change.",
    "carpet_python": "The map is current.",
}


@dataclass(frozen=True)
class Coat:
    """A shed gift on the wood. ``x`` is 18–82, same percent band as the web desk."""

    id: int
    x: float
    kind: str = "shed"


def now_ms() -> int:
    return int(time.time() * 1000)


def is_blue(stats: CareState, key: str, now: int | None = None) -> bool:
    if not is_snake(key):
        return False
    stamp = now if now is not None else now_ms()
    last = stats.shed_at or 0
    return stamp - last >= DUE_MS


def shed_line(key: str) -> str:
    return SHED_LINES.get(key, "I left a copy. I kept the better one.")


def shed_wait_line(key: str) -> str:
    return SHED_WAIT.get(key, "The coat is still good.")


def apply_shed(
    state: CareState,
    species: Species | None = None,
    now: int | None = None,
    *,
    coat_x: float | None = None,
) -> CareResult:
    kind = species or species_by_key(None)
    stamp = now if now is not None else now_ms()
    if state.hidden:
        return CareResult(state, pick_line(kind.hide), "idle", "idle")
    if not is_snake(kind.key) or not is_blue(state, kind.key, stamp):
        line = shed_wait_line(kind.key) if is_snake(kind.key) else "The coat is still good."
        next_state = replace(state, last_line=line, anim="sit")
        return CareResult(next_state, line, "sit", "sit")

    gifts = list(state.gifts)
    if len(gifts) < 3:
        x = coat_x if coat_x is not None else 18 + random.random() * 64
        gifts.append(Coat(id=stamp, x=x, kind="shed"))
    line = shed_line(kind.key)
    next_state = replace(
        state,
        hygiene=clamp(state.hygiene + 28),
        mood=clamp(state.mood + 12),
        health=clamp(state.health + 8),
        bond=clamp(state.bond + 3),
        shed_at=stamp,
        gifts=gifts,
        last_line=line,
        anim="sit",
    )
    return CareResult(next_state, line, "sit", "sit")


def shedders() -> tuple[str, ...]:
    return SNAKE_KEYS
