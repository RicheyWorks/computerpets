from computerpets_client.life import CareState, apply_call, apply_feed, apply_hide, apply_treat
from computerpets_client.species import NORI, RUI, species_by_key


def test_feed_raises_hunger_and_plays_eat():
    result = apply_feed(CareState(hunger=40), RUI)
    assert result.state.hunger > 40
    assert result.anim == "eat"
    assert result.cmd == "eat"
    assert result.line


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
