from computerpets_client.life import CareState, apply_call, apply_feed, apply_hide, apply_play, apply_treat
from computerpets_client.species import NORI, RUI, species_by_key


def test_feed_raises_hunger_and_plays_eat():
    result = apply_feed(CareState(hunger=40), RUI)
    assert result.state.hunger > 40
    assert result.anim == "eat"
    assert result.cmd == "eat"
    assert result.line


def test_play_uses_the_house_deltas():
    before = CareState(hunger=50, mood=50, energy=50, bond=10)
    result = apply_play(before, RUI)
    assert result.state.hunger == 42
    assert result.state.mood == 76
    assert result.state.energy == 36
    assert result.state.bond == 13
    assert result.cmd == "play"
    assert result.line


def test_play_clamps_like_the_other_care_verbs():
    result = apply_play(CareState(hunger=5, mood=90, energy=10, bond=99), RUI)
    assert result.state.hunger == 0
    assert result.state.mood == 100
    assert result.state.energy == 0
    assert result.state.bond == 100


def test_play_while_hidden_does_not_play():
    hidden = apply_hide(CareState(hunger=50, mood=50, energy=50, bond=10), RUI).state
    result = apply_play(hidden, RUI)
    assert result.state.hunger == 50
    assert result.state.hidden is True
    assert result.cmd == "idle"


def test_treat_is_a_smaller_snack():
    before = CareState(hunger=40, mood=50)
    fed = apply_feed(before, RUI).state
    treated = apply_treat(before, RUI)
    assert treated.state.hunger > before.hunger
    assert treated.state.hunger < fed.hunger
    assert treated.cmd == "seek"


def test_hide_then_call_back():
    hidden = apply_hide(CareState(), RUI)
    assert hidden.state.hidden is True
    assert hidden.cmd == "hide"
    back = apply_call(hidden.state, RUI)
    assert back.state.hidden is False
    assert back.cmd == "enter"


def test_feed_while_hidden_does_not_feed():
    hidden = apply_hide(CareState(hunger=40), RUI).state
    result = apply_feed(hidden, RUI)
    assert result.state.hunger == 40
    assert result.state.hidden is True


def test_snake_treat_uses_house_line():
    nori = species_by_key("ball_python")
    assert nori is NORI
    result = apply_treat(CareState(), nori)
    assert result.cmd == "seek"
    assert result.line
    assert nori.treat == "Mouse"
