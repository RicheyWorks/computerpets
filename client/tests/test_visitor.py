"""Today's visitor is the same house-floor pick as web/src/lib/pets/visitor.ts."""

from datetime import datetime

from computerpets_client.species import CATALOG_KEYS, SPECIES
from computerpets_client.visitor import (
    VISIT_GONE_MS,
    VISIT_LEAVE_MS,
    VISIT_TALK_MS,
    VISIT_WAIT_MS,
    VISIT_WANDER_MS,
    todays_visitor,
    visit_caption,
    visit_line,
    visit_phase,
)
from computerpets_client.weather import civil_day_number


def test_visitor_identity_matches_house_formula():
    # Civil day plus host length, walked through two hundred ten minus the host.
    # These pins move when a den lands. Update them with the web visitor test.
    now = datetime(2026, 8, 17)
    assert todays_visitor("red_panda", now).key == "cat"
    assert todays_visitor("ball_python", now).key == "dog"
    assert todays_visitor("red_panda", datetime(2026, 1, 1)).key == "lemur"
    assert todays_visitor("red_panda", datetime(2024, 6, 9)).key == "manta"


def test_visitor_is_never_the_host():
    now = datetime(2026, 8, 17)
    for key in CATALOG_KEYS:
        guest = todays_visitor(key, now)
        assert guest.key != key
        assert guest.key in SPECIES


def test_visitor_uses_catalog_order_minus_host():
    now = datetime(2026, 8, 17)
    day = civil_day_number(now)
    host = "red_panda"
    others = [key for key in CATALOG_KEYS if key != host]
    expected = others[abs(day + len(host)) % len(others)]
    assert todays_visitor(host, now).key == expected


def test_visit_line_is_the_house_copy():
    assert visit_line("axolotl") == "I grew a little more present. Then less."
    assert visit_line("ball_python") == "I came as a bun. I will leave as a bun."
    assert visit_caption("red_panda", datetime(2026, 8, 17)) == "Miso may call"
    assert visit_line("horseshoe_crab") == "I walked the sand. I am not a crab."
    assert visit_line("sloth") == "I hung. Then I left the bough."
    assert visit_line("koala") == "I chewed. Then I left the gum."
    assert visit_line("brain_coral") == "I sat the rock. Then I left the boulder."
    assert visit_line("grouper") == "I sat the hole. Then I left the dish."
    assert visit_line("chickadee") == "I deeed. Then I left the cup."
    assert visit_line("robin") == "I hopped. Then I left the rim."
    assert visit_line("canada_goose") == "I honked. Then I left the green."
    assert visit_line("pileated") == "I drummed. Then I left the post."
    assert visit_line("not_a_pet") == "I came. I saw the lamp. I left."


def test_visit_phase_is_the_house_clock():
    assert VISIT_WAIT_MS == 7500
    assert VISIT_TALK_MS == 1600
    assert VISIT_WANDER_MS == 5200
    assert VISIT_LEAVE_MS == 14000
    assert VISIT_GONE_MS == 18500
    assert visit_phase(0) == "wait"
    assert visit_phase(VISIT_WAIT_MS - 1) == "wait"
    assert visit_phase(VISIT_WAIT_MS) == "in"
    assert visit_phase(VISIT_WAIT_MS + VISIT_TALK_MS) == "talk"
    assert visit_phase(VISIT_WAIT_MS + VISIT_WANDER_MS) == "wander"
    assert visit_phase(VISIT_WAIT_MS + VISIT_LEAVE_MS) == "leave"
    assert visit_phase(VISIT_WAIT_MS + VISIT_GONE_MS) == "gone"
    assert visit_phase(VISIT_WAIT_MS + 800, host_hidden=True) == "gone"
