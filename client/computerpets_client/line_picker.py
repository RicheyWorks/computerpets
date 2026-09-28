"""No-recent-repeat line picker for the blotter.

Same rule as web/src/lib/pets/line-picker.ts and desktop/renderer/line-picker.js (a test holds the three to the
same picks). Each speaker remembers its last lines: ``pick`` never repeats one of the last ``recent`` (fewer for a
small pool, so a pool of one still answers) and prefers a line not said in the last ``within_ms``. ``offer`` is for
one optional line: it stays quiet rather than repeat the same words inside ``within_ms``. Only the choosing changes;
every line's words stay as written.
"""

from __future__ import annotations

import math
import random as _random
import time
from typing import Callable, Iterable

RECENT_LINES = 3
RECENT_WITHIN_MS = 60_000
_KEEP = 16


def _now_ms() -> float:
    return time.monotonic() * 1000.0


class LinePicker:
    def __init__(
        self,
        *,
        recent: int = RECENT_LINES,
        within_ms: float = RECENT_WITHIN_MS,
        random: Callable[[], float] | None = None,
        now: Callable[[], float] | None = None,
    ) -> None:
        self.recent = max(0, int(recent))
        self.within_ms = max(0.0, float(within_ms))
        self._random = random or (lambda: _random.random())
        self._now = now or _now_ms
        self._log: dict[str, list[tuple[str, float]]] = {}

    def _said_within(self, hist: list[tuple[str, float]], line: str, t: float) -> bool:
        return any(said == line and t - at < self.within_ms for said, at in hist)

    def _note(self, speaker: str, line: str, t: float) -> None:
        if not line:
            return
        hist = self._log.get(speaker, []) + [(line, t)]
        self._log[speaker] = hist[-_KEEP:]

    def pick(self, speaker: str, pool: Iterable[str]) -> str:
        raw = list(pool or ())
        lines = list(dict.fromkeys(l for l in raw if isinstance(l, str) and l))
        if not lines:
            return raw[0] if raw and isinstance(raw[0], str) else ""
        hist = self._log.get(speaker, [])
        t = self._now()
        avoid = min(self.recent, len(lines) - 1)
        last = {said for said, _ in hist[-avoid:]} if avoid > 0 else set()
        open_ = [l for l in lines if l not in last and not self._said_within(hist, l, t)]
        if not open_:
            open_ = [l for l in lines if l not in last]
        if not open_:
            open_ = lines
        line = open_[min(len(open_) - 1, math.floor(self._random() * len(open_)))]
        self._note(speaker, line, t)
        return line

    def offer(self, speaker: str, line: str) -> str:
        if not line:
            return ""
        t = self._now()
        if self._said_within(self._log.get(speaker, []), line, t):
            return ""
        self._note(speaker, line, t)
        return line

    def note(self, speaker: str, line: str) -> None:
        self._note(speaker, line, self._now())

    def recent_for(self, speaker: str) -> list[str]:
        return [said for said, _ in self._log.get(speaker, [])]

    def reset(self) -> None:
        self._log.clear()


# The one picker the blotter uses; tests swap it for a seeded one.
line_picker = LinePicker()


def set_line_picker_for_tests(picker: LinePicker | None = None) -> None:
    global line_picker
    line_picker = picker or LinePicker()
