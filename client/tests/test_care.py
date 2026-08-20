from computerpets_client.life import (
    CARE_NAME,
    CareState,
    MessPile,
    apply_call,
    apply_clean,
    apply_feed,
    apply_hide,
    apply_medicine,
    apply_play,
    apply_treat,
    decay,
    load_care,
    pack_care,
    pick_mess,
    save_care,
    unpack_care,
)
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


def test_clean_clears_mess_and_raises_hygiene():
    before = CareState(
        hygiene=40,
        mood=50,
        bond=10,
        mess=[MessPile(id=1, x=20), MessPile(id=2, x=40)],
    )
    result = apply_clean(before, RUI)
    assert result.state.mess == []
    assert result.state.hygiene == 78
    assert result.state.mood == 58
    assert result.state.bond == 12
    assert result.line == "The blotter is honest again."
    assert result.cmd == "sit"


def test_medicine_clears_sick_and_raises_health():
    before = CareState(sick=True, health=40, mood=50, bond=10)
    result = apply_medicine(before, RUI)
    assert result.state.sick is False
    assert result.state.health == 68
    assert result.state.mood == 48
    assert result.state.bond == 13
    assert result.line == "Bitter. I will invoice you in kindness."
    assert result.cmd == "sit"


def test_pick_mess_removes_one_pile():
    before = CareState(
        hygiene=40,
        mood=50,
        mess=[MessPile(id=1, x=20), MessPile(id=2, x=40)],
    )
    result = pick_mess(before, 1)
    assert [pile.id for pile in result.state.mess] == [2]
    assert result.state.hygiene == 48
    assert result.state.mood == 53


def test_decay_low_hygiene_adds_a_mess():
    class Sure:
        def random(self):
            return 0.0

    before = CareState(hygiene=20, hunger=50, mess=[])
    next_state = decay(before, 120_000, rng=Sure(), now=1_700)
    assert len(next_state.mess) == 1
    pile = next_state.mess[0]
    assert pile.kind == "mess"
    assert pile.id == 1_700
    assert 12 <= pile.x <= 88


def test_decay_low_health_sets_sick():
    next_state = decay(CareState(health=30, hunger=50, hygiene=50), 0)
    assert next_state.sick is True


def test_decay_clears_sick_when_health_and_hygiene_recover():
    next_state = decay(CareState(sick=True, health=70, hygiene=50, hunger=50), 0)
    assert next_state.sick is False


def test_vitals_name_unwell_and_unkempt():
    assert CareState(sick=True).vitals() == "Unwell"
    assert CareState(hygiene=20).vitals() == "Unkempt"
    assert CareState(sick=True).vitals(blue=True) == "Blue"
    assert CareState(hidden=True, sick=True).vitals() == "Hidden"


def test_care_survives_a_relaunch(tmp_path):
    now = 1_700_000_000_000
    before = CareState(hunger=40, mood=50, bond=22, last_tick=now)
    save_care(before, user_data_dir=tmp_path, now=now)
    assert (tmp_path / CARE_NAME).is_file()
    later = load_care(user_data_dir=tmp_path, now=now)
    assert later.hunger == 40
    assert later.mood == 50
    assert later.bond == 22


def test_care_ticks_hunger_while_the_blotter_is_away(tmp_path):
    now = 1_700_000_000_000
    save_care(CareState(hunger=78, last_tick=now), user_data_dir=tmp_path, now=now)
    later = now + 6 * 3_600_000
    aged = load_care(user_data_dir=tmp_path, now=later)
    assert aged.hunger < 78
    assert aged.last_tick == later


def test_rotten_care_file_fails_closed(tmp_path):
    (tmp_path / CARE_NAME).write_text("{not json", encoding="utf-8")
    state = load_care(user_data_dir=tmp_path, now=1_700)
    assert state.hunger == 78
    assert state.mood == 74


def test_unpack_care_rejects_a_foreign_line():
    assert unpack_care(None) is None
    assert unpack_care({"v": 2, "hunger": 10}) is None
    assert unpack_care({"v": 1, "hunger": "full"}) is None
    packed = pack_care(CareState(hunger=33, last_tick=9))
    restored = unpack_care(packed)
    assert restored is not None
    assert restored.hunger == 33
    assert restored.last_tick == 9
