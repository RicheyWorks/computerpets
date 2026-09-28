"""No-recent-repeat lines on the blotter: the same seeded picks as the web desk and the overlay
(web/scripts/line-picker.test.mjs), and the blotter's care lines go through it with their words unchanged."""

from __future__ import annotations

from computerpets_client import line_picker as L
from computerpets_client.life import CareState, ambient_line, apply_play, pick_line
from computerpets_client.species import species_by_key

ROLLS = [0.9, 0.1, 0.5, 0.7, 0.3, 0.99, 0, 0.45, 0.62, 0.2, 0.8, 0.05]


def seeded(**kw):
    state = {"i": 0, "t": 0.0}

    def roll():
        v = ROLLS[state["i"] % len(ROLLS)]
        state["i"] += 1
        return v

    return L.LinePicker(random=roll, now=lambda: state["t"], **kw), state


def run(pool, speaker, steps, step_ms):
    picker, state = seeded()
    out = []
    for _ in range(steps):
        out.append(picker.pick(speaker, pool))
        state["t"] += step_ms
    return out


def test_same_seeded_picks_as_web_and_overlay():
    assert L.RECENT_LINES == 3 and L.RECENT_WITHIN_MS == 60_000
    five = run(("a", "b", "c", "d", "e"), "red_panda", 12, 4000)
    assert five == ["e", "a", "c", "d", "b", "e", "a", "c", "d", "b", "e", "a"]
    for k in range(1, len(five)):
        assert five[k] not in five[max(0, k - 3):k]
    assert run(("x", "y"), "dee", 6, 1000) == ["y", "x", "y", "x", "y", "x"]


def test_thirty_seconds_then_free_again():
    t = {"now": 0.0}
    p = L.LinePicker(recent=1, random=lambda: 0.0, now=lambda: t["now"])
    said = []
    for _ in range(3):
        said.append(p.pick("cat", ("one", "two", "three")))
        t["now"] += 5000
    assert said == ["one", "two", "three"]
    t["now"] = 61_000
    assert p.pick("cat", ("one", "two", "three")) == "one"


def test_small_pool_still_answers_and_offer_stays_quiet_for_thirty_seconds():
    p, state = seeded()
    for _ in range(3):
        assert p.pick("rui", ("The lamp is warm.",)) == "The lamp is warm."
    assert p.pick("rui", ()) == ""
    dee = "Dee-dee. I saw the red one."
    assert p.offer("chickadee", dee) == dee
    state["t"] += 7_600
    assert p.offer("chickadee", dee) == ""
    state["t"] = 90_000
    assert p.offer("chickadee", dee) == dee


def test_blotter_care_lines_pick_through_it_with_roster_words():
    picker, state = seeded()
    L.set_line_picker_for_tests(picker)
    try:
        rui = species_by_key("red_panda")
        good = CareState(hunger=90, energy=90, mood=90, bond=90)
        said = []
        for _ in range(10):
            said.append(ambient_line(good, rui))
            state["t"] += 4000
        assert all(line in rui.ambient for line in said)
        avoid = min(3, len(set(rui.ambient)) - 1)
        for k in range(1, len(said)):
            assert said[k] not in said[max(0, k - avoid):k], said
        assert pick_line(("only",), "x") == "only"
        play = [apply_play(good, rui).line for _ in range(4)]
        assert all(line in rui.ambient + rui.greet for line in play)
        assert picker.recent_for("red_panda")[-4:] == play
    finally:
        L.set_line_picker_for_tests()
