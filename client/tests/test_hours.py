"""House hours match web/src/lib/pets/hours.ts — no invented rest or day parts."""

from computerpets_client.hours import (
    CALL_LINE,
    CHECK_HOUR,
    HIDE_LINE,
    REST,
    SNACK_LINE,
    call_line,
    day_part,
    day_part_label,
    hide_line,
    is_resting_hour,
    remember_visit,
    return_line,
    snack_line,
)
from computerpets_client.species import CATALOG_KEYS


def test_civil_hour_maps_to_house_day_parts():
    assert day_part(4) == "night"
    assert day_part(5) == "dawn"
    assert day_part(7) == "dawn"
    assert day_part(8) == "day"
    assert day_part(16) == "day"
    assert day_part(17) == "dusk"
    assert day_part(20) == "dusk"
    assert day_part(21) == "night"
    assert day_part(0) == "night"
    assert [day_part_label(p) for p in ("dawn", "day", "dusk", "night")] == [
        "Dawn",
        "Day",
        "Dusk",
        "Night",
    ]


def test_every_rest_window_including_overnight_and_the_cats_nap():
    assert set(REST) == set(CATALOG_KEYS)
    assert len(REST) == len(CATALOG_KEYS)
    for key, (start, end) in REST.items():
        if start < end:
            assert is_resting_hour(key, start)
            assert is_resting_hour(key, end - 1)
            assert not is_resting_hour(key, end)
            if start > 0:
                assert not is_resting_hour(key, start - 1)
        else:
            assert is_resting_hour(key, start)
            assert is_resting_hour(key, 23)
            assert is_resting_hour(key, 0)
            assert is_resting_hour(key, end - 1)
            assert not is_resting_hour(key, end)
            if start > 0:
                assert not is_resting_hour(key, start - 1)


def test_unknown_key_uses_overnight_fallback():
    assert is_resting_hour("not_a_pet", 22)
    assert is_resting_hour("not_a_pet", 3)
    assert not is_resting_hour("not_a_pet", 10)


def test_fixture_clock_is_the_house_day():
    assert CHECK_HOUR == 14
    assert day_part(14) == "day"
    assert day_part_label("day") == "Day"
    assert is_resting_hour("cat", 14)
    assert not is_resting_hour("cat", 12)
    assert not is_resting_hour("cat", 16)
    assert is_resting_hour("hamster", 10)
    assert is_resting_hour("ball_python", 12)
    assert not is_resting_hour("red_panda", 14)
    assert is_resting_hour("red_panda", 23)
    assert is_resting_hour("red_panda", 6)
    assert not is_resting_hour("red_panda", 7)


def test_return_line_thresholds():
    hour_ms = 3_600_000
    assert return_line(0.3 * hour_ms) is None
    assert return_line(0.39 * hour_ms) is None
    assert return_line(0.4 * hour_ms) == "Back. I noticed."
    assert return_line(0.9 * hour_ms) == "Back. I noticed."
    assert return_line(1 * hour_ms) == "You were elsewhere. I practiced waiting."
    assert return_line(5.9 * hour_ms) == "You were elsewhere. I practiced waiting."
    assert return_line(6 * hour_ms) == "Hours. I sat in most of them."
    assert return_line(19.9 * hour_ms) == "Hours. I sat in most of them."
    assert return_line(20 * hour_ms, 6) == "You were gone a night. I kept the blotter."
    assert return_line(20 * hour_ms, 10) == "You were gone a night. I kept the blotter."
    assert return_line(20 * hour_ms, 11) == "A long absence. I counted the dust."
    assert return_line(20 * hour_ms, 4) == "A long absence. I counted the dust."


def test_remember_visit_persists_in_user_data_dir(tmp_path):
    first = remember_visit("red_panda", user_data_dir=tmp_path, now_ms=1_000)
    assert first == 0
    later = remember_visit("red_panda", user_data_dir=tmp_path, now_ms=1_000 + 2 * 3_600_000)
    assert later == 2 * 3_600_000
    assert return_line(later) == "You were elsewhere. I practiced waiting."
    other = remember_visit("cat", user_data_dir=tmp_path, now_ms=1_000 + 3_600_000)
    assert other == 0
    seen = (tmp_path / "seen.json").read_text(encoding="utf-8")
    assert "red_panda" in seen
    assert "cat" in seen


def test_hide_and_snack_lines_are_the_house_copy():
    assert hide_line("cat") == "The ledge is closed."
    assert hide_line("cat", "Already gone.") == "Already gone."
    assert hide_line("not_a_pet") == "I went where the ribbon goes."
    assert snack_line("dog") == "For me? I have prepared a sit."
    assert snack_line("dog", "A biscuit.") == "A biscuit."
    assert snack_line("not_a_pet") == "A small treaty."
    assert set(HIDE_LINE) == set(CATALOG_KEYS)
    assert set(SNACK_LINE) == set(CATALOG_KEYS)


def test_call_lines_are_the_house_copy_and_chirp_is_not_pip():
    assert call_line("dog") == "You called. I was already coming."
    assert call_line("field_cricket") == "I sang. Hello."
    assert call_line("brain_coral") == "I sat the rock. Hello."
    assert call_line("fiddler_crab") == "I waved. Hello."
    assert call_line("field_cricket") != "You called. I brought the whole tail."
    assert call_line("dog", "Already here.") == "Already here."
    assert call_line("not_a_pet") == "You called."
    assert set(CALL_LINE) == set(CATALOG_KEYS)
    assert len(CALL_LINE) == len(CATALOG_KEYS)
