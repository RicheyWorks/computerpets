"""Snakes go blue and leave a coat — same science as web/src/lib/pets/shed.ts."""

from computerpets_client.life import CareState, apply_hide
from computerpets_client.shed import (
    DUE_MS,
    apply_shed,
    is_blue,
    shed_line,
    shed_wait_line,
)
from computerpets_client.species import NORI, RUI, SNAKE_KEYS, species_by_key


def test_ten_snakes_are_blue_until_they_shed():
    now = 1_700_000_000_000
    for key in SNAKE_KEYS:
        state = CareState()
        assert is_blue(state, key, now)
        result = apply_shed(state, species_by_key(key), now, coat_x=20)
        assert result.cmd == "sit"
        assert result.line == shed_line(key)
        assert result.state.shed_at == now
        assert not is_blue(result.state, key, now)
        coats = [g for g in result.state.gifts if g.kind == "shed"]
        assert len(coats) == 1
        assert coats[0].x == 20
        assert 18 <= coats[0].x <= 82


def test_shed_leaves_the_old_coat_on_the_blotter():
    nori = NORI
    before = CareState()
    now = 2_000_000_000_000
    result = apply_shed(before, nori, now, coat_x=10)
    assert result.line == "I left a copy. The better bun stayed."
    assert len(result.state.gifts) == 1
    coat = result.state.gifts[0]
    assert coat.kind == "shed"
    assert coat.id == now
    assert result.state.hygiene > before.hygiene
    assert result.state.mood > before.mood


def test_fresh_coat_is_not_due():
    now = 1_000_000
    state = CareState(shed_at=now)
    result = apply_shed(state, NORI, now + 1_000)
    assert result.state.gifts == []
    assert result.state.shed_at == now
    assert result.line == shed_wait_line("ball_python")
    assert not is_blue(state, "ball_python", now + 1_000)
    assert is_blue(state, "ball_python", now + DUE_MS)


def test_walker_does_not_go_blue_or_shed_a_coat():
    assert not is_blue(CareState(), RUI.key)
    result = apply_shed(CareState(), RUI, now=1_700_000_000_000)
    assert result.state.gifts == []
    assert result.state.shed_at == 0


def test_hidden_snake_does_not_shed():
    hidden = apply_hide(CareState(), NORI).state
    result = apply_shed(hidden, NORI, now=1_700_000_000_000)
    assert result.state.hidden is True
    assert result.state.gifts == []
    assert result.state.shed_at == 0
