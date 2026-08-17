"""Care verbs that already exist on the Electron desk: feed, treat, hide."""

from __future__ import annotations

import random
from dataclasses import dataclass, replace

from .species import Species, species_by_key


def clamp(n: float, lo: float = 0, hi: float = 100) -> int:
    return int(max(lo, min(hi, round(n))))


@dataclass
class CareState:
    hunger: int = 78
    mood: int = 74
    energy: int = 80
    hidden: bool = False
    last_line: str = ""
    anim: str = "idle"

    def vitals(self) -> str:
        if self.hidden:
            return "Hidden"
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


def _pick(lines: tuple[str, ...]) -> str:
    return random.choice(lines) if lines else ""


def apply_feed(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, _pick(kind.hide), "idle", "idle")
    next_state = replace(
        state,
        hunger=clamp(state.hunger + 30),
        mood=clamp(state.mood + 6),
        energy=clamp(state.energy - 5),
        last_line=_pick(kind.feed),
        anim="eat",
    )
    return CareResult(next_state, next_state.last_line, "eat", "eat")


def apply_treat(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, _pick(kind.hide), "idle", "idle")
    next_state = replace(
        state,
        hunger=clamp(state.hunger + 12),
        mood=clamp(state.mood + 5),
        last_line=_pick(kind.treat_lines),
        anim="eat",
    )
    return CareResult(next_state, next_state.last_line, "eat", "seek")


def apply_hide(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, _pick(kind.hide), "idle", "idle")
    next_state = replace(state, hidden=True, last_line=_pick(kind.hide), anim="walk")
    return CareResult(next_state, next_state.last_line, "walk", "hide")


def apply_call(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    next_state = replace(
        state,
        hidden=False,
        mood=clamp(state.mood + 4),
        last_line=_pick(kind.call),
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
        return _pick(species.hide)
    if state.hunger < 28:
        return _pick(species.hungry)
    return _pick(species.ambient)
