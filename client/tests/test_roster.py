"""PyQt blotter roster matches the backend / web living catalog."""

from computerpets_client.life import CareState, apply_feed, apply_hide, apply_treat
from computerpets_client.species import (
    CATALOG_KEYS,
    FAR_KEYS,
    FUNGI_KEYS,
    GARDEN_KEYS,
    HOUSE_KEYS,
    INSECT_KEYS,
    SEA_KEYS,
    SNAKE_KEYS,
    SPECIES,
    is_far,
    is_fungus,
    is_garden,
    is_insect,
    is_sea,
    is_snake,
    next_species_key,
    prev_species_key,
    species_by_key,
)

# Same eighty wire keys as PetType / web/src/lib/pets/catalog.ts.
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
    "water_lily",
    "orchid",
    "saguaro",
    "venus_flytrap",
    "pitcher",
    "sundew",
    "honeybee",
    "monarch",
    "luna",
    "firefly",
    "darner",
    "stick",
    "carpenter_ant",
    "ladybird",
    "mantis",
    "cicada",
    "oyster",
    "fly_agaric",
    "morel",
    "chanterelle",
    "turkey_tail",
    "lions_mane",
    "puffball",
    "chicken_of_woods",
    "yeast",
    "lichen",
    "photovore",
    "choir",
    "nimbus",
    "silica",
    "terminator",
    "nexus",
    "halovore",
    "magneton",
    "umbral",
    "cyst",
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
    "water_lily",
    "orchid",
    "saguaro",
    "venus_flytrap",
    "pitcher",
    "sundew",
)

WEB_INSECTS = (
    "honeybee",
    "monarch",
    "luna",
    "firefly",
    "darner",
    "stick",
    "carpenter_ant",
    "ladybird",
    "mantis",
    "cicada",
)

WEB_FUNGI = (
    "oyster",
    "fly_agaric",
    "morel",
    "chanterelle",
    "turkey_tail",
    "lions_mane",
    "puffball",
    "chicken_of_woods",
    "yeast",
    "lichen",
)

WEB_FAR = (
    "photovore",
    "choir",
    "nimbus",
    "silica",
    "terminator",
    "nexus",
    "halovore",
    "magneton",
    "umbral",
    "cyst",
)


def test_roster_has_catalog_keys_including_the_tide_and_garden():
    assert len(CATALOG_KEYS) == len(WEB_CATALOG)
    assert len(SPECIES) == len(WEB_CATALOG)
    assert len(HOUSE_KEYS) == 20
    assert len(SNAKE_KEYS) == 10
    assert len(SEA_KEYS) == 10
    assert len(GARDEN_KEYS) == 10
    assert len(INSECT_KEYS) == 10
    assert len(FUNGI_KEYS) == 10
    assert len(FAR_KEYS) == 10
    assert CATALOG_KEYS == WEB_CATALOG
    assert set(SPECIES) == set(WEB_CATALOG)
    assert set(SEA_KEYS) == set(WEB_SEA)
    assert set(GARDEN_KEYS) == set(WEB_GARDEN)
    assert set(INSECT_KEYS) == set(WEB_INSECTS)
    assert set(FUNGI_KEYS) == set(WEB_FUNGI)
    assert set(FAR_KEYS) == set(WEB_FAR)


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
        assert not is_insect(key)
        assert not is_fungus(key)
        assert not is_far(key)
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
    for key in ("moss", "maidenhair", "ginkgo", "oak", "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"):
        assert SPECIES[key].aquatic is False
    assert SPECIES["moss"].slug == "felt"
    assert SPECIES["saguaro"].name == "Arm"
    assert SPECIES["venus_flytrap"].silhouette == "trap"
    assert SPECIES["pitcher"].silhouette == "pitcher"
    assert SPECIES["sundew"].silhouette == "sundew"
    assert SPECIES["pitcher"].name == "Well"
    assert SPECIES["sundew"].name == "Dew"


def test_ten_hive_guests_are_present_and_honest():
    assert INSECT_KEYS == WEB_INSECTS
    for key in INSECT_KEYS:
        spec = SPECIES[key]
        assert is_insect(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_fungus(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.aquatic is False
    assert SPECIES["honeybee"].slug == "comb"
    assert SPECIES["luna"].name == "Ghost"
    assert SPECIES["firefly"].silhouette == "firefly"
    assert SPECIES["stick"].silhouette == "stick"
    assert SPECIES["cicada"].name == "Brood"
    assert SPECIES["luna"].walk < 20
    assert SPECIES["honeybee"].walk > 100
    assert SPECIES["darner"].walk > 140


def test_ten_cellar_guests_are_present_and_honest():
    assert FUNGI_KEYS == WEB_FUNGI
    for key in FUNGI_KEYS:
        spec = SPECIES[key]
        assert is_fungus(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.aquatic is False
        assert spec.walk < 20
    assert SPECIES["oyster"].slug == "frill"
    assert SPECIES["oyster"].name == "Frill"
    assert SPECIES["fly_agaric"].name == "Cap"
    assert SPECIES["morel"].name == "Lattice"
    assert SPECIES["chanterelle"].name == "Horn"
    assert SPECIES["turkey_tail"].name == "Ring"
    assert SPECIES["lions_mane"].name == "Mane"
    assert SPECIES["puffball"].name == "Puff"
    assert SPECIES["chicken_of_woods"].name == "Flame"
    assert SPECIES["yeast"].name == "Starter"
    assert SPECIES["lichen"].name == "Pact"
    assert SPECIES["oyster"].silhouette == "shelf"
    assert SPECIES["fly_agaric"].silhouette == "amanita"
    assert SPECIES["morel"].silhouette == "morel"
    assert SPECIES["chanterelle"].silhouette == "chanterelle"
    assert SPECIES["turkey_tail"].silhouette == "bracket"
    assert SPECIES["lions_mane"].silhouette == "mane"
    assert SPECIES["puffball"].silhouette == "puffball"
    assert SPECIES["chicken_of_woods"].silhouette == "sulfur"
    assert SPECIES["yeast"].silhouette == "yeast"
    assert SPECIES["lichen"].silhouette == "lichen"
    assert SPECIES["puffball"].walk > SPECIES["yeast"].walk
    assert SPECIES["lichen"].walk <= 4


def test_ten_far_guests_are_present_and_honest():
    assert FAR_KEYS == WEB_FAR
    for key in FAR_KEYS:
        spec = SPECIES[key]
        assert is_far(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert not is_fungus(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
    assert SPECIES["photovore"].slug == "gleam"
    assert SPECIES["photovore"].name == "Gleam"
    assert SPECIES["photovore"].aquatic is True
    assert SPECIES["nimbus"].aquatic is True
    assert SPECIES["nimbus"].name == "Drift"
    assert SPECIES["silica"].name == "Shard"
    assert SPECIES["terminator"].name == "Dusk"
    assert SPECIES["nexus"].name == "Knot"
    assert SPECIES["halovore"].name == "Brine"
    assert SPECIES["magneton"].name == "Beacon"
    assert SPECIES["umbral"].name == "Hush"
    assert SPECIES["cyst"].name == "Arca"
    assert SPECIES["photovore"].silhouette == "gleam"
    assert SPECIES["choir"].silhouette == "choir"
    assert SPECIES["nimbus"].silhouette == "nimbus"
    assert SPECIES["silica"].silhouette == "shard"
    assert SPECIES["terminator"].silhouette == "dusk"
    assert SPECIES["nexus"].silhouette == "knot"
    assert SPECIES["halovore"].silhouette == "brine"
    assert SPECIES["magneton"].silhouette == "beacon"
    assert SPECIES["umbral"].silhouette == "hush"
    assert SPECIES["cyst"].silhouette == "cyst"
    assert SPECIES["silica"].walk < 10
    assert SPECIES["umbral"].walk < 10
    assert SPECIES["cyst"].walk <= 2
    assert SPECIES["magneton"].walk > 100


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
    assert next_species_key("saguaro") == "venus_flytrap"
    assert next_species_key("sundew") == "honeybee"
    assert next_species_key("cicada") == "oyster"
    assert next_species_key("lichen") == "photovore"
    assert next_species_key("cyst") == "red_panda"
    assert prev_species_key("red_panda") == "cyst"
    assert prev_species_key("honeybee") == "sundew"
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
