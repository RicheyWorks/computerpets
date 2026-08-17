"""Care verbs that already exist on the living desk: feed, treat, play, hide, clean, medicine, shed."""

from __future__ import annotations

import random
import time
from dataclasses import dataclass, field, replace
from typing import TYPE_CHECKING

from .hours import hide_line, snack_line
from .species import Species, species_by_key

if TYPE_CHECKING:
    from .shed import Coat

# House rates from web/src/lib/pets/care.ts — per millisecond.
HUNGER_PER_MS = 100 / (6 * 60 * 60 * 1000)
MOOD_PER_MS = 100 / (12 * 60 * 60 * 1000)
ENERGY_PER_MS = 100 / (9 * 60 * 60 * 1000)
HYGIENE_PER_MS = 100 / (14 * 60 * 60 * 1000)
HEALTH_DOWN_PER_MS = (6 / (10 * 60 * 60 * 1000)) * 100
HEALTH_UP_PER_MS = (2 / (10 * 60 * 60 * 1000)) * 100

# Same two lines the web blotter says for clean / medicine.
CLEAN_LINE = "The blotter is honest again."
MEDICINE_LINE = "Bitter. I will invoice you in kindness."


def clamp(n: float, lo: float = 0, hi: float = 100) -> int:
    return int(max(lo, min(hi, round(n))))


def pick_line(lines: tuple[str, ...]) -> str:
    return random.choice(lines) if lines else ""


@dataclass(frozen=True)
class MessPile:
    """An ink smudge on the wood. Same shape as the house MessPile / Coat."""

    id: int
    x: float
    kind: str = "mess"


@dataclass
class CareState:
    hunger: int = 78
    mood: int = 74
    energy: int = 80
    hygiene: int = 86
    health: int = 92
    bond: int = 18
    sick: bool = False
    hidden: bool = False
    last_line: str = ""
    anim: str = "idle"
    shed_at: int = 0
    gifts: list[Coat] = field(default_factory=list)
    mess: list[MessPile] = field(default_factory=list)

    def vitals(self, *, blue: bool = False) -> str:
        if self.hidden:
            return "Hidden"
        if blue:
            return "Blue"
        if self.sick:
            return "Unwell"
        if self.hunger < 22:
            return "Hungry"
        if self.hygiene < 24:
            return "Unkempt"
        if self.energy < 20:
            return "Tired"
        if self.mood < 32:
            return "Moody"
        return "Settled"


@dataclass
class CareResult:
    state: CareState
    line: str
    anim: str
    cmd: str


def apply_feed(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")
    next_state = replace(
        state,
        hunger=clamp(state.hunger + 30),
        mood=clamp(state.mood + 6),
        energy=clamp(state.energy - 5),
        last_line=pick_line(kind.feed),
        anim="eat",
    )
    return CareResult(next_state, next_state.last_line, "eat", "eat")


def apply_treat(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")
    line = snack_line(kind.key, pick_line(kind.treat_lines))
    next_state = replace(
        state,
        hunger=clamp(state.hunger + 12),
        mood=clamp(state.mood + 5),
        last_line=line,
        anim="eat",
    )
    return CareResult(next_state, next_state.last_line, "eat", "seek")


def apply_play(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")
    line = pick_line(kind.ambient) or pick_line(kind.greet)
    next_state = replace(
        state,
        hunger=clamp(state.hunger - 8),
        mood=clamp(state.mood + 26),
        energy=clamp(state.energy - 14),
        bond=clamp(state.bond + 3),
        last_line=line,
        anim="walk",
    )
    return CareResult(next_state, next_state.last_line, "walk", "play")


def apply_hide(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    line = hide_line(kind.key, pick_line(kind.hide))
    if state.hidden:
        return CareResult(state, line, "idle", "idle")
    next_state = replace(state, hidden=True, last_line=line, anim="walk")
    return CareResult(next_state, next_state.last_line, "walk", "hide")


def apply_call(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    next_state = replace(
        state,
        hidden=False,
        mood=clamp(state.mood + 4),
        last_line=pick_line(kind.call),
        anim="walk",
    )
    return CareResult(next_state, next_state.last_line, "walk", "enter")


def apply_clean(state: CareState, species: Species | None = None) -> CareResult:
    next_state = replace(
        state,
        hygiene=clamp(state.hygiene + 38),
        mood=clamp(state.mood + 8),
        bond=clamp(state.bond + 2),
        mess=[],
        last_line=CLEAN_LINE,
        anim="sit",
    )
    return CareResult(next_state, CLEAN_LINE, "sit", "sit")


def apply_medicine(state: CareState, species: Species | None = None) -> CareResult:
    next_state = replace(
        state,
        sick=False,
        health=clamp(state.health + 28),
        mood=clamp(state.mood - 2),
        bond=clamp(state.bond + 3),
        last_line=MEDICINE_LINE,
        anim="sit",
    )
    return CareResult(next_state, MEDICINE_LINE, "sit", "sit")


def pick_mess(state: CareState, pile_id: int) -> CareResult:
    next_state = replace(
        state,
        mess=[pile for pile in state.mess if pile.id != pile_id],
        hygiene=clamp(state.hygiene + 8),
        mood=clamp(state.mood + 3),
        last_line=CLEAN_LINE,
        anim="sit",
    )
    return CareResult(next_state, CLEAN_LINE, "sit", "sit")


def decay(
    state: CareState,
    dt_ms: float,
    *,
    rng: random.Random | None = None,
    now: int | None = None,
) -> CareState:
    if state.hidden:
        return state
    dt = max(0.0, dt_ms)
    mood_rate = MOOD_PER_MS * (1.3 if state.sick else 1)
    next_state = replace(
        state,
        hunger=clamp(state.hunger - dt * HUNGER_PER_MS),
        mood=clamp(state.mood - dt * mood_rate),
        energy=clamp(state.energy - dt * ENERGY_PER_MS),
        hygiene=clamp(state.hygiene - dt * HYGIENE_PER_MS),
    )
    if next_state.hunger < 18 or next_state.hygiene < 18:
        next_state = replace(next_state, health=clamp(state.health - dt * HEALTH_DOWN_PER_MS))
    else:
        next_state = replace(next_state, health=clamp(state.health + dt * HEALTH_UP_PER_MS))
    sick = next_state.sick
    if not sick and next_state.health < 32:
        sick = True
    if sick and next_state.health > 64 and next_state.hygiene > 40:
        sick = False
    piles = list(next_state.mess)
    roll = rng.random() if rng is not None else random.random()
    if next_state.hygiene < 42 and len(piles) < 5 and roll < min(0.35, dt / 120000):
        stamp = now if now is not None else int(time.time() * 1000)
        x = 12 + (rng.random() if rng is not None else random.random()) * 76
        piles.append(MessPile(id=stamp + len(piles), x=x, kind="mess"))
    return replace(next_state, sick=sick, mess=piles)


def ambient_line(state: CareState, species: Species) -> str:
    if state.hidden:
        return hide_line(species.key, pick_line(species.hide))
    if state.hunger < 28:
        return pick_line(species.hungry)
    return pick_line(species.ambient)
