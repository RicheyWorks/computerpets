"""PyQt blotter roster matches the backend / web living catalog."""

from computerpets_client.life import CareState, apply_feed, apply_hide, apply_treat
from computerpets_client.species import (
    CATALOG_KEYS,
    GARDEN_KEYS,
    HOUSE_KEYS,
    SEA_KEYS,
    SNAKE_KEYS,
    SPECIES,
    is_garden,
    is_sea,
    is_snake,
    next_species_key,
    prev_species_key,
    species_by_key,
)

# Same fifty wire keys as PetType / web/src/lib/pets/catalog.ts.
WEB_CATALOG = (
    "red_panda",
    "cat",
    "dog",
    "rabbit",
    "hamster",
    "guinea_pig",
    "turtle",
    "goldfish",
    "budgie",
    "fox",
    "penguin",
    "parrot",
    "ferret",
    "hedgehog",
    "chinchilla",
    "axolotl",
    "toucan",
    "iguana",
    "dragon",
    "phoenix",
    "ball_python",
    "corn_snake",
    "kingsnake",
    "green_tree_python",
    "hognose",
    "garter",
    "boa",
    "milk_snake",
    "rosy_boa",
    "carpet_python",
    "octopus",
    "cuttlefish",
    "nautilus",
    "moon_jelly",
    "sea_star",
    "hermit_crab",
    "horseshoe_crab",
    "seahorse",
    "manta",
    "moray",
    "moss",
    "maidenhair",
    "ginkgo",
    "oak",
    "redwood",
    "water_lily",
    "duckweed",
    "venus_flytrap",
    "orchid",
    "saguaro",
)

WEB_SNAKES = (
    "ball_python",
    "corn_snake",
    "kingsnake",
    "green_tree_python",
    "hognose",
    "garter",
    "boa",
    "milk_snake",
    "rosy_boa",
    "carpet_python",
)

TREAT_SHAPES = {"bamboo", "crumb", "seed", "leaf", "flake", "pebble", "ember", "egg"}


WEB_SEA = (
    "octopus",
    "cuttlefish",
    "nautilus",
    "moon_jelly",
    "sea_star",
    "hermit_crab",
    "horseshoe_crab",
    "seahorse",
    "manta",
    "moray",
)

WEB_GARDEN = (
    "moss",
    "maidenhair",
    "ginkgo",
    "oak",
    "redwood",
    "water_lily",
    "duckweed",
    "venus_flytrap",
    "orchid",
    "saguaro",
)


def test_roster_has_catalog_keys_including_the_tide_and_garden():
    assert len(CATALOG_KEYS) == len(WEB_CATALOG)
    assert len(SPECIES) == len(WEB_CATALOG)
    assert len(HOUSE_KEYS) == 20
    assert len(SNAKE_KEYS) == 10
    assert len(SEA_KEYS) == 10
    assert len(GARDEN_KEYS) == 10
    assert CATALOG_KEYS == WEB_CATALOG
    assert set(SPECIES) == set(WEB_CATALOG)
    assert set(SEA_KEYS) == set(WEB_SEA)
    assert set(GARDEN_KEYS) == set(WEB_GARDEN)


def test_ten_snakes_are_present_and_crawl():
    assert SNAKE_KEYS == WEB_SNAKES
    for key in SNAKE_KEYS:
        spec = SPECIES[key]
        assert is_snake(key)
        assert spec.gait == "crawl"
        assert spec.silhouette == "snake"
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES


def test_walkers_walk_and_are_not_snakes():
    for key in HOUSE_KEYS:
        spec = SPECIES[key]
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert spec.gait == "walk"
        assert spec.silhouette != "snake"


def test_ten_tide_guests_are_present_and_honest():
    assert SEA_KEYS == WEB_SEA
    for key in SEA_KEYS:
        spec = SPECIES[key]
        assert is_sea(key)
        assert not is_snake(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
    assert SPECIES["hermit_crab"].aquatic is False
    assert SPECIES["horseshoe_crab"].aquatic is False
    for key in ("octopus", "cuttlefish", "nautilus", "moon_jelly", "sea_star", "seahorse", "manta", "moray"):
        assert SPECIES[key].aquatic is True
    assert SPECIES["octopus"].slug == "cup"
    assert SPECIES["horseshoe_crab"].name == "Ledger"


def test_ten_garden_guests_are_present_and_honest():
    assert GARDEN_KEYS == WEB_GARDEN
    for key in GARDEN_KEYS:
        spec = SPECIES[key]
        assert is_garden(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.walk < 20
    assert SPECIES["water_lily"].aquatic is True
    assert SPECIES["duckweed"].aquatic is True
    for key in ("moss", "maidenhair", "ginkgo", "oak", "redwood", "venus_flytrap", "orchid", "saguaro"):
        assert SPECIES[key].aquatic is False
    assert SPECIES["moss"].slug == "felt"
    assert SPECIES["saguaro"].name == "Arm"
    assert SPECIES["venus_flytrap"].silhouette == "trap"


def test_every_kind_has_house_voice_and_care_treat():
    for key in CATALOG_KEYS:
        spec = species_by_key(key)
        assert spec.key == key
        assert spec.name
        assert spec.label
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.greet
        assert spec.ambient
        assert spec.feed
        assert spec.treat_lines
        assert spec.hide
        assert spec.call
        assert spec.hungry


def test_cycle_wraps_the_full_house():
    assert next_species_key("red_panda") == "cat"
    assert next_species_key("phoenix") == "ball_python"
    assert next_species_key("carpet_python") == "octopus"
    assert next_species_key("moray") == "moss"
    assert next_species_key("saguaro") == "red_panda"
    assert prev_species_key("red_panda") == "saguaro"
    assert prev_species_key("ball_python") == "phoenix"
    assert prev_species_key("octopus") == "carpet_python"
    assert prev_species_key("moss") == "moray"


def test_care_verbs_work_for_a_snake_and_a_walker():
    nori = species_by_key("ball_python")
    thimble = species_by_key("rabbit")
    fed = apply_feed(CareState(hunger=40), nori)
    assert fed.state.hunger > 40
    assert fed.line
    treated = apply_treat(CareState(hunger=40), thimble)
    assert treated.cmd == "seek"
    assert treated.line
    hidden = apply_hide(CareState(), nori)
    assert hidden.state.hidden is True
    assert hidden.line
