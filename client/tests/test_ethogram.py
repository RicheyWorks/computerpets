from computerpets_client.ethogram import (
    SCRATCH_KEYS,
    TONGUE_KEYS,
    acts_for,
    pick_act,
)
from computerpets_client.species import CATALOG_KEYS, SNAKE_KEYS


def test_every_catalog_kind_has_acts():
    for key in CATALOG_KEYS:
        assert acts_for(key), key


def test_snake_keys_never_schedule_scratch_and_can_schedule_tongue():
    assert tuple(TONGUE_KEYS) == SNAKE_KEYS
    for key in SNAKE_KEYS:
        names = [act["name"] for act in acts_for(key)]
        assert "tongue" in names, key
        assert "scratch" not in names, key
        assert "yawn" not in names, key
    tongue = 0
    for _ in range(80):
        act = pick_act("hognose")
        assert act is not None
        assert act["name"] != "scratch"
        if act["name"] == "tongue":
            tongue += 1
    assert tongue > 0


def test_only_scratching_mammals_scratch():
    assert SCRATCH_KEYS == ("dog", "cat", "red_panda")
    assert "scratch" not in [a["name"] for a in acts_for("goldfish")]
    assert "scratch" not in [a["name"] for a in acts_for("turtle")]
