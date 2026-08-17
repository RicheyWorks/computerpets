"""Shared living-desk numbers — same as web ``gait.ts`` and Electron ``gait.js``."""

from __future__ import annotations

ACCEL_S = 0.4
DECEL_DIST = 56.0
TURN_S = 0.23
TURN_SNAKE_S = 0.35
TURN_SLOW_S = 0.3
OVERSHOOT = 7.0
OVERSHOOT_SLOW = 4.0
SETTLE_S = 0.42
POSE_HOLD_S = 0.28
BREATHE_IDLE = 0.028
BREATHE_SLEEP = 0.04
SWAY_PX = 3.5
HIGH_WALK = 120.0


def smoothstep(t: float) -> float:
    x = max(0.0, min(1.0, t))
    return x * x * (3.0 - 2.0 * x)


def walk_speed(remaining: float, age: float, base: float) -> float:
    accel = min(1.0, age / ACCEL_S)
    decel = smoothstep(remaining / DECEL_DIST) if remaining < DECEL_DIST else 1.0
    return base * max(0.3, accel * decel)


def is_low_walk(walk: float, hop: float | None = None) -> bool:
    if hop is not None:
        return hop <= 6 or walk < 40
    return walk < 40


def is_high_walk(walk: float) -> bool:
    return walk >= HIGH_WALK


def turn_hold_s(*, crawl: bool, walk: float, hop: float | None = None) -> float:
    if crawl:
        return TURN_SNAKE_S
    if is_low_walk(walk, hop):
        return TURN_SLOW_S
    return TURN_S


def overshoot_px(*, crawl: bool, walk: float, hop: float | None = None) -> float:
    if crawl or is_low_walk(walk, hop):
        return OVERSHOOT_SLOW
    return OVERSHOOT


def facing_after(current: int, x: float, target: float, elapsed: float, hold_s: float) -> int:
    desired = 1 if target >= x else -1
    if desired == current:
        return current
    if elapsed < hold_s:
        return current
    return desired


def settle_offset(settle: float, direction: int, px: float) -> float:
    t = 1.0 - max(0.0, min(1.0, settle))
    return direction * px * 4.0 * t * (1.0 - t)


def wander_pause_s() -> float:
    import random

    return 0.2 + random.random() * 0.2
