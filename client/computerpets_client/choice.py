"""A tap on the guest is a choice, not a sit. They pick. Then they do that sit.

Port of ``web/src/lib/pets/guest-choice.ts`` (and ``desktop/renderer/choice.js``).
"""

from __future__ import annotations

from typing import Iterable

GUEST_CHOICE = (
    "rest",
    "walk",
    "sit",
    "talk",
    "treat",
    "play",
    "special",
    "hide",
    "call",
    "pick",
)


def guest_tap() -> str:
    """A tap opens the choice. It does not talk, sleep, or walk them."""
    return "choice"


def pose_flip(walking: bool) -> dict[str, str]:
    """Walk if they are still. Sit if they are walking. One mark."""
    if walking:
        return {"id": "sit", "label": "Sit"}
    return {"id": "walk", "label": "Walk"}


def guest_marks(
    *,
    hidden: bool = False,
    leaving: bool = False,
    walking: bool = False,
    gifts: int = 0,
    treat_verb: str = "Treat",
    special_verb: str = "Special",
) -> list[dict[str, str]]:
    """The marks they may pick. Hidden keeps Call back. A gift on the wood keeps Pick."""
    busy = hidden or leaving
    marks: list[dict[str, str]] = []
    if not busy:
        marks.append({"id": "rest", "label": "Rest"})
        marks.append(pose_flip(walking))
    marks.append({"id": "talk", "label": "Talk"})
    if not busy:
        marks.append({"id": "treat", "label": treat_verb or "Treat"})
        marks.append({"id": "play", "label": "Play"})
    marks.append({"id": "special", "label": special_verb or "Special"})
    if hidden:
        marks.append({"id": "call", "label": "Call back"})
    elif not leaving:
        marks.append({"id": "hide", "label": "Hide"})
    if not hidden and gifts > 0:
        marks.append({"id": "pick", "label": "Pick"})
    return marks


def guest_pick(mark_id: str) -> str | None:
    """The sit they already know. A pick is not a new verb."""
    return mark_id if mark_id in GUEST_CHOICE else None


def guest_hit_pad(*, phone: bool = False, tablet: bool = False) -> int:
    """Extra wood around the guest on a finger sit. The pad is empty. It does not paint a plate."""
    if phone:
        return 12
    if tablet:
        return 16
    return 0


def walking_cmd(cmd: str | None) -> bool:
    return cmd in {"wander", "seek", "play", "enter"}


def mark_ids(marks: Iterable[dict[str, str]]) -> tuple[str, ...]:
    return tuple(m["id"] for m in marks)
