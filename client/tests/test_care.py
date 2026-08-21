from computerpets_client.life import (
    BATH_LINE,
    CARE_NAME,
    CareState,
    MessPile,
    PRAISE_LINE,
    apply_bath,
    apply_call,
    apply_clean,
    apply_feed,
    apply_hide,
    apply_medicine,
    apply_play,
    apply_praise,
    apply_rest,
    apply_talk,
    apply_treat,
    care_filename,
    decay,
    load_care,
    pack_care,
    pick_mess,
    save_care,
    unpack_care,
)
from computerpets_client.species import NORI, RUI, species_by_key


def test_feed_raises_hunger_and_plays_eat():
    before = CareState(hunger=40, energy=50, bond=10)
    result = apply_feed(before, RUI)
    assert result.state.hunger == 68
    assert result.state.energy == 44
    assert result.state.bond == 12
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
    before = CareState(hunger=40, mood=50, bond=10)
    fed = apply_feed(before, RUI).state
    treated = apply_treat(before, RUI)
    assert treated.state.hunger == 52
    assert treated.state.mood == 55
    assert treated.state.bond == 11
    assert treated.state.hunger < fed.hunger
    assert treated.cmd == "seek"


def test_hide_then_call_back():
    hidden = apply_hide(CareState(), RUI)
    assert hidden.state.hidden is True
    assert hidden.cmd == "hide"
    back = apply_call(hidden.state, RUI)
    assert back.state.hidden is False
    assert back.cmd == "enter"
    assert back.state.mood == hidden.state.mood + 4
    assert back.state.bond == hidden.state.bond + 1
    assert back.line == "You called. I brought the whole tail."
    chirp = apply_call(hidden.state, species_by_key("field_cricket"))
    assert chirp.line == "I sang. Hello."
    assert chirp.line != "You called. I brought the whole tail."


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


def test_rest_bath_praise_match_the_desk():
    rested = apply_rest(CareState(hunger=50, mood=50, energy=40, bond=10), RUI)
    assert rested.state.hunger == 47
    assert rested.state.mood == 54
    assert rested.state.energy == 74
    assert rested.state.bond == 11
    assert rested.cmd == "sleep"
    assert rested.anim == "sleep"
    bathed = apply_bath(CareState(hygiene=40, mood=50, energy=50, bond=10), RUI)
    assert bathed.state.hygiene == 88
    assert bathed.state.mood == 56
    assert bathed.state.energy == 44
    assert bathed.state.bond == 12
    assert bathed.line == BATH_LINE
    praised = apply_praise(CareState(mood=50, bond=10), RUI)
    assert praised.state.mood == 62
    assert praised.state.bond == 12
    assert praised.line == PRAISE_LINE


def test_night_slows_hunger_and_hidden_still_ages():
    day = 1_700_000_000_000
    three = 3 * 3_600_000
    awake = decay(CareState(hunger=78, energy=40, last_tick=day), three, now=day, resting=False)
    assert awake.hunger == 28
    asleep = decay(CareState(hunger=78, energy=40, last_tick=day), three, now=day, resting=True)
    assert asleep.hunger == 56
    assert asleep.energy > 40
    hidden = decay(
        CareState(hunger=78, hidden=True, last_tick=day),
        three,
        now=day,
        resting=True,
    )
    assert hidden.hunger == 28
    assert hidden.hidden is True


def test_talk_uses_a_house_line_and_the_overlay_bond():
    before = CareState(mood=50, bond=10, hunger=60)
    result = apply_talk(before, RUI)
    assert result.cmd == "talk"
    assert result.state.bond == 11
    assert result.state.mood == 50
    assert result.line
    hidden = apply_hide(before, RUI).state
    quiet = apply_talk(hidden, RUI)
    assert quiet.state.hidden is True
    assert quiet.state.bond == hidden.bond + 1
    assert quiet.line


def test_each_guest_keeps_their_own_care_line(tmp_path):
    now = 1_700_000_000_000
    rui = CareState(hunger=40, mood=50, bond=22, last_tick=now)
    chirp = CareState(hunger=12, mood=80, bond=8, last_tick=now)
    save_care(rui, user_data_dir=tmp_path, now=now, key="red_panda")
    save_care(chirp, user_data_dir=tmp_path, now=now, key="field_cricket")
    assert (tmp_path / care_filename("red_panda")).is_file()
    assert (tmp_path / care_filename("field_cricket")).is_file()
    assert not (tmp_path / CARE_NAME).is_file()
    later_rui = load_care(user_data_dir=tmp_path, now=now, key="red_panda")
    later_chirp = load_care(user_data_dir=tmp_path, now=now, key="field_cricket")
    assert later_rui.hunger == 40
    assert later_rui.bond == 22
    assert later_chirp.hunger == 12
    assert later_chirp.bond == 8
    ridge = load_care(user_data_dir=tmp_path, now=now, key="brain_coral")
    assert ridge.hunger == 78
    assert ridge.bond == 18


def test_old_shared_care_file_stays_rui(tmp_path):
    now = 1_700_000_000_000
    save_care(CareState(hunger=33, last_tick=now), user_data_dir=tmp_path, now=now)
    assert (tmp_path / CARE_NAME).is_file()
    rui = load_care(user_data_dir=tmp_path, now=now, key="red_panda")
    other = load_care(user_data_dir=tmp_path, now=now, key="field_cricket")
    assert rui.hunger == 33
    assert other.hunger == 78


def test_unpack_care_rejects_a_foreign_line():
    assert unpack_care(None) is None
    assert unpack_care({"v": 2, "hunger": 10}) is None
    assert unpack_care({"v": 1, "hunger": "full"}) is None
    packed = pack_care(CareState(hunger=33, last_tick=9))
    restored = unpack_care(packed)
    assert restored is not None
    assert restored.hunger == 33
    assert restored.last_tick == 9
