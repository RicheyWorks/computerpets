"""Today's visitor is the same house-floor pick as web/src/lib/pets/visitor.ts."""

from datetime import datetime

from computerpets_client.species import CATALOG_KEYS, SPECIES
from computerpets_client.visitor import todays_visitor, visit_caption, visit_line
from computerpets_client.weather import civil_day_number


def test_visitor_identity_matches_house_formula():
    now = datetime(2026, 8, 17)
    assert todays_visitor("red_panda", now).key == "ginkgo"
    assert todays_visitor("ball_python", now).key == "water_lily"
    assert todays_visitor("red_panda", datetime(2026, 1, 1)).key == "honeybee"
    assert todays_visitor("red_panda", datetime(2024, 6, 9)).key == "penguin"


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
    assert visit_caption("red_panda", datetime(2026, 8, 17)) == "Fan may call"
    assert visit_line("horseshoe_crab") == "I walked the sand. I am not a crab."
    assert visit_line("not_a_pet") == "I came. I saw the lamp. I left."
