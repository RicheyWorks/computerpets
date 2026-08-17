"""Care verbs that already exist on the Electron desk: feed, treat, hide, shed."""

from __future__ import annotations

import random
from dataclasses import dataclass, field, replace
from typing import TYPE_CHECKING

from .species import Species, species_by_key

if TYPE_CHECKING:
    from .shed import Coat


def clamp(n: float, lo: float = 0, hi: float = 100) -> int:
    return int(max(lo, min(hi, round(n))))


def pick_line(lines: tuple[str, ...]) -> str:
    return random.choice(lines) if lines else ""


@dataclass
class CareState:
    hunger: int = 78
    mood: int = 74
    energy: int = 80
    hygiene: int = 86
    health: int = 92
    bond: int = 18
    hidden: bool = False
    last_line: str = ""
    anim: str = "idle"
    shed_at: int = 0
    gifts: list[Coat] = field(default_factory=list)

    def vitals(self, *, blue: bool = False) -> str:
        if self.hidden:
            return "Hidden"
        if blue:
            return "Blue"
        if self.hunger < 28:
            return "Hungry"
        if self.energy < 28:
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
        return CareResult(state, pick_line(kind.hide), "idle", "idle")
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
        return CareResult(state, pick_line(kind.hide), "idle", "idle")
    next_state = replace(
        state,
        hunger=clamp(state.hunger + 12),
        mood=clamp(state.mood + 5),
        last_line=pick_line(kind.treat_lines),
        anim="eat",
    )
    return CareResult(next_state, next_state.last_line, "eat", "seek")


def apply_hide(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, pick_line(kind.hide), "idle", "idle")
    next_state = replace(state, hidden=True, last_line=pick_line(kind.hide), anim="walk")
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


def decay(state: CareState, dt_ms: float) -> CareState:
    if state.hidden:
        return state
    hours = max(0.0, dt_ms) / (60 * 60 * 1000)
    return replace(
        state,
        hunger=clamp(state.hunger - hours * (100 / 6)),
        mood=clamp(state.mood - hours * (100 / 12)),
        energy=clamp(state.energy - hours * (100 / 9)),
    )


def ambient_line(state: CareState, species: Species) -> str:
    if state.hidden:
        return pick_line(species.hide)
    if state.hunger < 28:
        return pick_line(species.hungry)
    return pick_line(species.ambient)
