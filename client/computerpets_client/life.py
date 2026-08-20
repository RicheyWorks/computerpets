"""Care verbs that already exist on the living desk: feed, treat, play, hide, clean, medicine, shed."""

from __future__ import annotations

import json
import random
import time
from dataclasses import dataclass, field, replace
from pathlib import Path
from typing import TYPE_CHECKING

from .hive import colony_of, colony_word, is_hive_place, stamp_colony
from .hours import hide_line, snack_line
from .paths import default_user_data_dir
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
CARE_NAME = "care.json"
CARE_VERSION = 1


def clamp(n: float, lo: float = 0, hi: float = 100) -> int:
    return int(max(lo, min(hi, round(n))))


def pick_line(lines: tuple[str, ...]) -> str:
    return random.choice(lines) if lines else ""


def keep_hive(state: CareState, species: Species | None = None, key: str | None = None) -> CareState:
    """Hunger is stores. Health is brood. Other guests leave the cells unnamed."""
    guest = key or (species.key if species is not None else None)
    if is_hive_place(guest):
        named = stamp_colony(state)
        return replace(state, brood=named["brood"], stores=named["stores"])
    if guest is not None:
        return replace(state, brood=None, stores=None)
    if state.brood is not None or state.stores is not None:
        named = stamp_colony(state)
        return replace(state, brood=named["brood"], stores=named["stores"])
    return state


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
    last_tick: int = 0
    gifts: list[Coat] = field(default_factory=list)
    mess: list[MessPile] = field(default_factory=list)
    brood: int | None = None
    stores: int | None = None

    def vitals(self, *, blue: bool = False, key: str | None = None) -> str:
        if key and is_hive_place(key):
            hive = colony_of(self, self.hidden)
            if hive.quiet:
                return colony_word(hive)
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
    next_state = keep_hive(
        replace(
            state,
            hunger=clamp(state.hunger + 30),
            mood=clamp(state.mood + 6),
            energy=clamp(state.energy - 5),
            last_line=pick_line(kind.feed),
            anim="eat",
        ),
        kind,
    )
    return CareResult(next_state, next_state.last_line, "eat", "eat")


def apply_treat(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")
    line = snack_line(kind.key, pick_line(kind.treat_lines))
    next_state = keep_hive(
        replace(
            state,
            hunger=clamp(state.hunger + 12),
            mood=clamp(state.mood + 5),
            last_line=line,
            anim="eat",
        ),
        kind,
    )
    return CareResult(next_state, next_state.last_line, "eat", "seek")


def apply_play(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")
    line = pick_line(kind.ambient) or pick_line(kind.greet)
    next_state = keep_hive(
        replace(
            state,
            hunger=clamp(state.hunger - 8),
            mood=clamp(state.mood + 26),
            energy=clamp(state.energy - 14),
            bond=clamp(state.bond + 3),
            last_line=line,
            anim="walk",
        ),
        kind,
    )
    return CareResult(next_state, next_state.last_line, "walk", "play")


def apply_hide(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    line = hide_line(kind.key, pick_line(kind.hide))
    if state.hidden:
        return CareResult(keep_hive(state, kind), line, "idle", "idle")
    next_state = keep_hive(replace(state, hidden=True, last_line=line, anim="walk"), kind)
    return CareResult(next_state, next_state.last_line, "walk", "hide")


def apply_call(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    next_state = keep_hive(
        replace(
            state,
            hidden=False,
            mood=clamp(state.mood + 4),
            last_line=pick_line(kind.call),
            anim="walk",
        ),
        kind,
    )
    return CareResult(next_state, next_state.last_line, "walk", "enter")


def apply_clean(state: CareState, species: Species | None = None) -> CareResult:
    next_state = keep_hive(
        replace(
            state,
            hygiene=clamp(state.hygiene + 38),
            mood=clamp(state.mood + 8),
            bond=clamp(state.bond + 2),
            mess=[],
            last_line=CLEAN_LINE,
            anim="sit",
        ),
        species,
    )
    return CareResult(next_state, CLEAN_LINE, "sit", "sit")


def apply_medicine(state: CareState, species: Species | None = None) -> CareResult:
    next_state = keep_hive(
        replace(
            state,
            sick=False,
            health=clamp(state.health + 28),
            mood=clamp(state.mood - 2),
            bond=clamp(state.bond + 3),
            last_line=MEDICINE_LINE,
            anim="sit",
        ),
        species,
    )
    return CareResult(next_state, MEDICINE_LINE, "sit", "sit")


def pick_mess(state: CareState, pile_id: int) -> CareResult:
    next_state = keep_hive(
        replace(
            state,
            mess=[pile for pile in state.mess if pile.id != pile_id],
            hygiene=clamp(state.hygiene + 8),
            mood=clamp(state.mood + 3),
            last_line=CLEAN_LINE,
            anim="sit",
        )
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
    stamp = now if now is not None else int(time.time() * 1000)
    if next_state.hygiene < 42 and len(piles) < 5 and roll < min(0.35, dt / 120000):
        x = 12 + (rng.random() if rng is not None else random.random()) * 76
        piles.append(MessPile(id=stamp + len(piles), x=x, kind="mess"))
    aged = replace(next_state, sick=sick, mess=piles, last_tick=stamp)
    return keep_hive(aged)


def ambient_line(state: CareState, species: Species) -> str:
    if state.hidden:
        return hide_line(species.key, pick_line(species.hide))
    if state.hunger < 28:
        return pick_line(species.hungry)
    return pick_line(species.ambient)


def _now_ms() -> int:
    return int(time.time() * 1000)


def pack_care(state: CareState) -> dict[str, object]:
    packed: dict[str, object] = {
        "v": CARE_VERSION,
        "hunger": int(state.hunger),
        "mood": int(state.mood),
        "energy": int(state.energy),
        "hygiene": int(state.hygiene),
        "health": int(state.health),
        "bond": int(state.bond),
        "sick": bool(state.sick),
        "hidden": bool(state.hidden),
        "last_line": str(state.last_line),
        "anim": str(state.anim),
        "shed_at": int(state.shed_at),
        "last_tick": int(state.last_tick),
        "mess": [{"id": int(pile.id), "x": float(pile.x), "kind": str(pile.kind)} for pile in state.mess],
        "gifts": [
            {"id": int(gift.id), "x": float(gift.x), "kind": str(getattr(gift, "kind", "shed"))}
            for gift in state.gifts
        ],
    }
    if state.brood is not None:
        packed["brood"] = max(0, min(8, int(state.brood)))
    if state.stores is not None:
        packed["stores"] = clamp(int(state.stores))
    return packed


def unpack_care(raw: object) -> CareState | None:
    """Rebuild CareState from a packed line. Fail closed: bad shape is no line."""
    if not isinstance(raw, dict) or raw.get("v") != CARE_VERSION:
        return None
    try:
        from .shed import Coat

        mess_raw = raw.get("mess")
        mess: list[MessPile] = []
        if isinstance(mess_raw, list):
            for item in mess_raw[:6]:
                if not isinstance(item, dict):
                    continue
                mess.append(MessPile(id=int(item["id"]), x=float(item["x"]), kind=str(item.get("kind") or "mess")))
        gifts_raw = raw.get("gifts")
        gifts: list[Coat] = []
        if isinstance(gifts_raw, list):
            for item in gifts_raw[:3]:
                if not isinstance(item, dict):
                    continue
                gifts.append(Coat(id=int(item["id"]), x=float(item["x"]), kind=str(item.get("kind") or "shed")))
        brood_raw = raw.get("brood")
        stores_raw = raw.get("stores")
        return CareState(
            hunger=clamp(int(raw.get("hunger", 78))),
            mood=clamp(int(raw.get("mood", 74))),
            energy=clamp(int(raw.get("energy", 80))),
            hygiene=clamp(int(raw.get("hygiene", 86))),
            health=clamp(int(raw.get("health", 92))),
            bond=clamp(int(raw.get("bond", 18))),
            sick=bool(raw.get("sick")),
            hidden=bool(raw.get("hidden")),
            last_line=str(raw.get("last_line") or ""),
            anim=str(raw.get("anim") or "idle"),
            shed_at=int(raw.get("shed_at") or 0),
            last_tick=int(raw.get("last_tick") or 0),
            mess=mess,
            gifts=gifts,
            brood=max(0, min(8, int(brood_raw))) if isinstance(brood_raw, (int, float)) else None,
            stores=clamp(int(stores_raw)) if isinstance(stores_raw, (int, float)) else None,
        )
    except (TypeError, ValueError, KeyError, OverflowError):
        return None


def save_care(
    state: CareState,
    *,
    user_data_dir: Path | str | None = None,
    now: int | None = None,
) -> None:
    """Write the blotter line. Local. Fail closed."""
    stamp = now if now is not None else _now_ms()
    root = Path(user_data_dir) if user_data_dir is not None else default_user_data_dir()
    path = root / CARE_NAME
    try:
        packed = pack_care(replace(state, last_tick=stamp))
        root.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(packed), encoding="utf-8")
    except (OSError, TypeError, ValueError):
        return


def load_care(
    *,
    user_data_dir: Path | str | None = None,
    now: int | None = None,
) -> CareState:
    """Read the blotter line and age it. Missing or rotten file is a new sit."""
    stamp = now if now is not None else _now_ms()
    root = Path(user_data_dir) if user_data_dir is not None else default_user_data_dir()
    path = root / CARE_NAME
    try:
        if not path.is_file():
            return CareState(last_tick=stamp)
        parsed = json.loads(path.read_text(encoding="utf-8"))
        state = unpack_care(parsed)
        if state is None:
            return CareState(last_tick=stamp)
        last = state.last_tick or stamp
        elapsed = max(0, stamp - last)
        aged = decay(state, elapsed, now=stamp) if elapsed else state
        return replace(aged, last_tick=stamp)
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return CareState(last_tick=stamp)
