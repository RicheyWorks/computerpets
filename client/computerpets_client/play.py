"""Catching the lure and arriving at it are the same catch. One hop.

Port of ``web/src/lib/pets/play.ts`` (and ``desktop/renderer/play.js``).
The blotter already kept the play deltas. This is the chase itself.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Literal

PlayVia = Literal["catch", "arrive"]
PlayMark = Literal["lure", "treat"]
PlayAct = Literal["play", "snack", "hide", "idle", "none"]

CATCH_LINE = "You caught it first. I still win."
RIBBON_LINE = "A ribbon. Catch it."
BUG_LINE = "There. A bug."
FLEE_MS = 2200


@dataclass(frozen=True)
class PlayChase:
    taken: bool
    cmd: str
    mark: str | None


@dataclass(frozen=True)
class PlayHop:
    act: PlayAct
    next: PlayChase
    apply_play: int
    persist_play: int
    issue_play: int
    issue_eat: int


@dataclass(frozen=True)
class PlayChaseResult:
    acts: tuple[PlayAct, ...]
    apply_play: int
    persist_play: int
    issue_play: int
    issue_eat: int
    taken: bool
    mark: str | None
    cmd: str


def play_claim(via: PlayVia, chase: PlayChase) -> PlayAct:
    """Who gets the finish. A second grab of the same lure is not another hop."""
    if via == "arrive" and chase.cmd == "leave":
        return "hide"
    if via == "catch":
        if chase.taken or chase.mark != "lure":
            return "none"
        return "play"
    if chase.cmd == "seek" and chase.mark == "treat":
        return "snack"
    if chase.cmd == "seek" and chase.mark == "lure":
        return "none" if chase.taken else "play"
    if chase.cmd in ("wander", "play", "eat", "enter"):
        return "idle"
    return "none"


def play_hop(chase: PlayChase, via: PlayVia, on_care: bool = False) -> PlayHop:
    """Step one grab. Local apply or persist, not both. The pose issues once."""
    act = play_claim(via, chase)
    if act == "play":
        return PlayHop(
            act=act,
            next=PlayChase(taken=True, cmd="play", mark=None),
            apply_play=0 if on_care else 1,
            persist_play=1 if on_care else 0,
            issue_play=1,
            issue_eat=0,
        )
    if act == "snack":
        return PlayHop(
            act=act,
            next=PlayChase(taken=True, cmd="eat", mark=None),
            apply_play=0,
            persist_play=0,
            issue_play=0,
            issue_eat=1,
        )
    if act == "hide":
        return PlayHop(
            act=act,
            next=PlayChase(taken=True, cmd=chase.cmd, mark=chase.mark),
            apply_play=0,
            persist_play=0,
            issue_play=0,
            issue_eat=0,
        )
    if act == "idle":
        return PlayHop(
            act=act,
            next=PlayChase(taken=chase.taken, cmd="idle", mark=chase.mark),
            apply_play=0,
            persist_play=0,
            issue_play=0,
            issue_eat=0,
        )
    return PlayHop(
        act=act,
        next=chase,
        apply_play=0,
        persist_play=0,
        issue_play=0,
        issue_eat=0,
    )


def play_chase(vias: Iterable[PlayVia], start: PlayChase, on_care: bool = False) -> PlayChaseResult:
    """Run a chase. Catch then arrive, or arrive then catch — one hop."""
    chase = start
    acts: list[PlayAct] = []
    apply_play = 0
    persist_play = 0
    issue_play = 0
    issue_eat = 0
    for via in vias:
        hop = play_hop(chase, via, on_care)
        acts.append(hop.act)
        apply_play += hop.apply_play
        persist_play += hop.persist_play
        issue_play += hop.issue_play
        issue_eat += hop.issue_eat
        chase = hop.next
    return PlayChaseResult(
        acts=tuple(acts),
        apply_play=apply_play,
        persist_play=persist_play,
        issue_play=issue_play,
        issue_eat=issue_eat,
        taken=chase.taken,
        mark=chase.mark,
        cmd=chase.cmd,
    )
