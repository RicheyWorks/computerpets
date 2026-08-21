"""PyQt blotter roster matches the backend / web living catalog."""

from computerpets_client.life import CareState, apply_feed, apply_hide, apply_treat
from computerpets_client.species import (
    CATALOG_KEYS,
    FAR_KEYS,
    FUNGI_KEYS,
    GARDEN_KEYS,
    HOUSE_KEYS,
    BEE_KEYS,
    INSECT_KEYS,
    POND_KEYS,
    SEA_KEYS,
    SNAKE_KEYS,
    CORNER_KEYS,
    ROOST_KEYS,
    WELL_KEYS,
    CREEK_KEYS,
    LOG_KEYS,
    SHORE_KEYS,
    MEADOW_KEYS,
    CANOPY_KEYS,
    REEF_KEYS,
    STONE_KEYS,
    WOOD_KEYS,
    SPECIES,
    is_bee,
    is_corner,
    is_creek,
    is_log,
    is_meadow,
    is_canopy,
    is_reef,
    is_shore,
    is_far,
    is_fungus,
    is_garden,
    is_insect,
    is_pond,
    is_roost,
    is_sea,
    is_snake,
    is_stone,
    is_well,
    is_wood,
    next_species_key,
    prev_species_key,
    species_by_key,
)

# Same hundred wire keys as PetType / web/src/lib/pets/catalog.ts.
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
    "bumblebee",
    "carpenter_bee",
    "mason_bee",
    "leafcutter",
    "stingless",
    "sweat_bee",
    "mining_bee",
    "honey_drone",
    "honey_queen",
    "honeycomb",
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
    "frog",
    "toad",
    "newt",
    "salamander",
    "caecilian",
    "crayfish",
    "pond_snail",
    "mussel",
    "leech",
    "stickleback",
    "paramecium",
    "amoeba",
    "euglena",
    "volvox",
    "diatom",
    "kelp",
    "chlamydomonas",
    "stentor",
    "coli",
    "haloarchaea",
    "crow",
    "raven",
    "barn_owl",
    "red_tail",
    "chickadee",
    "robin",
    "mallard",
    "canada_goose",
    "pileated",
    "hummingbird",
    "orb_weaver",
    "jumping_spider",
    "wolf_spider",
    "tarantula",
    "widow",
    "harvestman",
    "scorpion",
    "vinegaroon",
    "tick",
    "solifuge",
    "deer",
    "bat",
    "squirrel",
    "otter",
    "raccoon",
    "skunk",
    "opossum",
    "beaver",
    "porcupine",
    "black_bear",
    "gecko",
    "anole",
    "skink",
    "chameleon",
    "horned_lizard",
    "alligator",
    "crocodile",
    "snapper",
    "box_turtle",
    "tuatara",
    "bass",
    "brook_trout",
    "catfish",
    "bluegill",
    "perch",
    "pike",
    "walleye",
    "paddlefish",
    "lamprey",
    "american_eel",
    "house_centipede",
    "millipede",
    "pillbug",
    "earthworm",
    "velvet_worm",
    "springtail",
    "tardigrade",
    "planarian",
    "nematode",
    "amphipod",
    "fiddler_crab",
    "ghost_crab",
    "limpet",
    "barnacle",
    "chiton",
    "periwinkle",
    "sand_dollar",
    "sea_urchin",
    "knobbed_whelk",
    "lugworm",
    "field_cricket",
    "katydid",
    "grasshopper",
    "swallowtail",
    "jewelwing",
    "lacewing",
    "earwig",
    "acorn_weevil",
    "click_beetle",
    "robber_fly",
    "sloth",
    "lemur",
    "gibbon",
    "kinkajou",
    "colugo",
    "flying_squirrel",
    "howler",
    "tarsier",
    "potto",
    "koala",
    "brain_coral",
    "anemone",
    "clownfish",
    "parrotfish",
    "cleaner_shrimp",
    "sea_cucumber",
    "lionfish",
    "giant_clam",
    "eagle_ray",
    "grouper",
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

WEB_BEES = (
    "bumblebee",
    "carpenter_bee",
    "mason_bee",
    "leafcutter",
    "stingless",
    "sweat_bee",
    "mining_bee",
    "honey_drone",
    "honey_queen",
    "honeycomb",
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

WEB_POND = (
    "frog",
    "toad",
    "newt",
    "salamander",
    "caecilian",
    "crayfish",
    "pond_snail",
    "mussel",
    "leech",
    "stickleback",
)

WEB_WELL = (
    "paramecium",
    "amoeba",
    "euglena",
    "volvox",
    "diatom",
    "kelp",
    "chlamydomonas",
    "stentor",
    "coli",
    "haloarchaea",
)

WEB_ROOST = (
    "crow",
    "raven",
    "barn_owl",
    "red_tail",
    "chickadee",
    "robin",
    "mallard",
    "canada_goose",
    "pileated",
    "hummingbird",
)

WEB_CORNER = (
    "orb_weaver",
    "jumping_spider",
    "wolf_spider",
    "tarantula",
    "widow",
    "harvestman",
    "scorpion",
    "vinegaroon",
    "tick",
    "solifuge",
)

WEB_WOOD = (
    "deer",
    "bat",
    "squirrel",
    "otter",
    "raccoon",
    "skunk",
    "opossum",
    "beaver",
    "porcupine",
    "black_bear",
)

WEB_STONE = (
    "gecko",
    "anole",
    "skink",
    "chameleon",
    "horned_lizard",
    "alligator",
    "crocodile",
    "snapper",
    "box_turtle",
    "tuatara",
)

WEB_CREEK = (
    "bass",
    "brook_trout",
    "catfish",
    "bluegill",
    "perch",
    "pike",
    "walleye",
    "paddlefish",
    "lamprey",
    "american_eel",
)

WEB_LOG = (
    "house_centipede",
    "millipede",
    "pillbug",
    "earthworm",
    "velvet_worm",
    "springtail",
    "tardigrade",
    "planarian",
    "nematode",
    "amphipod",
)

WEB_SHORE = (
    "fiddler_crab",
    "ghost_crab",
    "limpet",
    "barnacle",
    "chiton",
    "periwinkle",
    "sand_dollar",
    "sea_urchin",
    "knobbed_whelk",
    "lugworm",
)

WEB_MEADOW = (
    "field_cricket",
    "katydid",
    "grasshopper",
    "swallowtail",
    "jewelwing",
    "lacewing",
    "earwig",
    "acorn_weevil",
    "click_beetle",
    "robber_fly",
)

WEB_CANOPY = (
    "sloth",
    "lemur",
    "gibbon",
    "kinkajou",
    "colugo",
    "flying_squirrel",
    "howler",
    "tarsier",
    "potto",
    "koala",
)

WEB_REEF = (
    "brain_coral",
    "anemone",
    "clownfish",
    "parrotfish",
    "cleaner_shrimp",
    "sea_cucumber",
    "lionfish",
    "giant_clam",
    "eagle_ray",
    "grouper",
)


def test_roster_has_catalog_keys_including_the_tide_and_garden():
    assert len(CATALOG_KEYS) == len(WEB_CATALOG)
    assert len(SPECIES) == len(WEB_CATALOG)
    assert len(HOUSE_KEYS) == 20
    assert len(SNAKE_KEYS) == 10
    assert len(SEA_KEYS) == 10
    assert len(GARDEN_KEYS) == 10
    assert len(INSECT_KEYS) == 10
    assert len(BEE_KEYS) == 10
    assert len(FUNGI_KEYS) == 10
    assert len(FAR_KEYS) == 10
    assert len(POND_KEYS) == 10
    assert len(WELL_KEYS) == 10
    assert len(ROOST_KEYS) == 10
    assert len(CORNER_KEYS) == 10
    assert len(WOOD_KEYS) == 10
    assert len(STONE_KEYS) == 10
    assert len(CREEK_KEYS) == 10
    assert len(LOG_KEYS) == 10
    assert len(SHORE_KEYS) == 10
    assert len(MEADOW_KEYS) == 10
    assert len(CANOPY_KEYS) == 10
    assert len(REEF_KEYS) == 10
    assert CATALOG_KEYS == WEB_CATALOG
    assert set(SPECIES) == set(WEB_CATALOG)
    assert set(SEA_KEYS) == set(WEB_SEA)
    assert set(GARDEN_KEYS) == set(WEB_GARDEN)
    assert set(INSECT_KEYS) == set(WEB_INSECTS)
    assert set(BEE_KEYS) == set(WEB_BEES)
    assert set(FUNGI_KEYS) == set(WEB_FUNGI)
    assert set(FAR_KEYS) == set(WEB_FAR)
    assert set(POND_KEYS) == set(WEB_POND)
    assert set(WELL_KEYS) == set(WEB_WELL)
    assert set(ROOST_KEYS) == set(WEB_ROOST)
    assert set(CORNER_KEYS) == set(WEB_CORNER)
    assert set(WOOD_KEYS) == set(WEB_WOOD)
    assert set(STONE_KEYS) == set(WEB_STONE)
    assert set(CREEK_KEYS) == set(WEB_CREEK)
    assert set(LOG_KEYS) == set(WEB_LOG)
    assert set(SHORE_KEYS) == set(WEB_SHORE)
    assert set(MEADOW_KEYS) == set(WEB_MEADOW)
    assert set(CANOPY_KEYS) == set(WEB_CANOPY)
    assert set(REEF_KEYS) == set(WEB_REEF)


def test_ten_snakes_are_present_and_crawl():
    assert SNAKE_KEYS == WEB_SNAKES
    for key in SNAKE_KEYS:
        spec = SPECIES[key]
        assert is_snake(key)
        assert spec.gait == "crawl"
        assert spec.silhouette == "snake"
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
    assert SPECIES["kingsnake"].treat_shape == "egg"
    assert SPECIES["kingsnake"].treat == "Egg"
    assert SPECIES["milk_snake"].treat_shape == "egg"
    assert SPECIES["milk_snake"].treat == "Egg"


def test_walkers_walk_and_are_not_snakes():
    for key in HOUSE_KEYS:
        spec = SPECIES[key]
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert not is_fungus(key)
        assert not is_far(key)
        assert not is_pond(key)
        assert not is_well(key)
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
        assert not is_bee(key)
    assert SPECIES["honeybee"].slug == "comb"
    assert SPECIES["luna"].name == "Ghost"
    assert SPECIES["firefly"].silhouette == "firefly"
    assert SPECIES["stick"].silhouette == "stick"
    assert SPECIES["cicada"].name == "Brood"
    assert SPECIES["luna"].walk < 20
    assert SPECIES["honeybee"].walk > 100
    assert SPECIES["darner"].walk > 140


def test_ten_hive_bees_are_present_and_honest():
    assert BEE_KEYS == WEB_BEES
    for key in BEE_KEYS:
        spec = SPECIES[key]
        assert is_bee(key)
        assert not is_insect(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_fungus(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.aquatic is False
    assert SPECIES["bumblebee"].slug == "thrum"
    assert SPECIES["bumblebee"].name == "Thrum"
    assert SPECIES["carpenter_bee"].name == "Auger"
    assert SPECIES["mason_bee"].name == "Mortar"
    assert SPECIES["leafcutter"].name == "Disc"
    assert SPECIES["stingless"].name == "Pot"
    assert SPECIES["sweat_bee"].name == "Sheen"
    assert SPECIES["mining_bee"].name == "Bank"
    assert SPECIES["honey_drone"].name == "Hum"
    assert SPECIES["honey_queen"].name == "Keep"
    assert SPECIES["honeycomb"].name == "Wax"
    assert SPECIES["honeycomb"].slug == "wax"
    assert SPECIES["honeycomb"].silhouette == "comb"
    assert SPECIES["honeycomb"].walk < 10
    assert SPECIES["honey_queen"].walk < SPECIES["honeybee"].walk
    assert SPECIES["honeybee"].slug == "comb"


def test_ten_cellar_guests_are_present_and_honest():
    assert FUNGI_KEYS == WEB_FUNGI
    for key in FUNGI_KEYS:
        spec = SPECIES[key]
        assert is_fungus(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert not is_bee(key)
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
        assert not is_bee(key)
        assert not is_fungus(key)
        assert not is_pond(key)
        assert not is_well(key)
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


def test_ten_pond_guests_are_present_and_honest():
    assert POND_KEYS == WEB_POND
    for key in POND_KEYS:
        spec = SPECIES[key]
        assert is_pond(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert not is_fungus(key)
        assert not is_far(key)
        assert not is_well(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
    assert SPECIES["frog"].slug == "reed"
    assert SPECIES["frog"].name == "Reed"
    assert SPECIES["toad"].name == "Pebble"
    assert SPECIES["newt"].name == "Eft"
    assert SPECIES["salamander"].name == "Dapple"
    assert SPECIES["caecilian"].name == "Slip"
    assert SPECIES["crayfish"].name == "Pinch"
    assert SPECIES["pond_snail"].name == "Whorl"
    assert SPECIES["mussel"].name == "Hinge"
    assert SPECIES["leech"].name == "Latch"
    assert SPECIES["stickleback"].name == "Prickle"
    assert SPECIES["frog"].aquatic is False
    assert SPECIES["toad"].aquatic is False
    assert SPECIES["salamander"].aquatic is False
    for key in ("newt", "caecilian", "crayfish", "pond_snail", "mussel", "leech", "stickleback"):
        assert SPECIES[key].aquatic is True
    assert SPECIES["frog"].silhouette == "frog"
    assert SPECIES["toad"].silhouette == "toad"
    assert SPECIES["newt"].silhouette == "newt"
    assert SPECIES["salamander"].silhouette == "salamander"
    assert SPECIES["caecilian"].silhouette == "caecilian"
    assert SPECIES["crayfish"].silhouette == "crayfish"
    assert SPECIES["pond_snail"].silhouette == "snail"
    assert SPECIES["mussel"].silhouette == "mussel"
    assert SPECIES["leech"].silhouette == "leech"
    assert SPECIES["stickleback"].silhouette == "stickleback"
    assert SPECIES["mussel"].walk < 10
    assert SPECIES["pond_snail"].walk < 20
    assert SPECIES["frog"].walk > SPECIES["toad"].walk


def test_ten_well_guests_are_present_and_honest():
    assert WELL_KEYS == WEB_WELL
    for key in WELL_KEYS:
        spec = SPECIES[key]
        assert is_well(key)
        assert not is_snake(key)
        assert not is_sea(key)
        assert not is_garden(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert not is_fungus(key)
        assert not is_far(key)
        assert not is_pond(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
        assert spec.name != "Starter"
        assert spec.name != "Pact"
        assert spec.name != "Brine"
        assert spec.name != "Bloom"
    assert SPECIES["paramecium"].slug == "boot"
    assert SPECIES["paramecium"].name == "Boot"
    assert SPECIES["amoeba"].name == "Reach"
    assert SPECIES["euglena"].name == "Spot"
    assert SPECIES["volvox"].name == "Orb"
    assert SPECIES["diatom"].name == "Pane"
    assert SPECIES["kelp"].name == "Hold"
    assert SPECIES["chlamydomonas"].name == "Spin"
    assert SPECIES["stentor"].name == "Bell"
    assert SPECIES["stentor"].slug == "bell"
    assert SPECIES["coli"].name == "Rod"
    assert SPECIES["haloarchaea"].name == "Rose"
    assert SPECIES["moon_jelly"].name == "Pulse"
    assert SPECIES["moon_jelly"].slug == "pulse"
    assert SPECIES["pitcher"].name == "Well"
    assert SPECIES["yeast"].name == "Starter"
    assert SPECIES["lichen"].name == "Pact"
    assert SPECIES["halovore"].name == "Brine"
    assert SPECIES["axolotl"].name == "Bloom"
    assert SPECIES["paramecium"].aquatic is True
    assert SPECIES["amoeba"].aquatic is True
    assert SPECIES["euglena"].aquatic is True
    assert SPECIES["volvox"].aquatic is True
    assert SPECIES["diatom"].aquatic is True
    assert SPECIES["kelp"].aquatic is False
    assert SPECIES["chlamydomonas"].aquatic is True
    assert SPECIES["stentor"].aquatic is True
    assert SPECIES["coli"].aquatic is False
    assert SPECIES["haloarchaea"].aquatic is False
    assert SPECIES["paramecium"].silhouette == "paramecium"
    assert SPECIES["amoeba"].silhouette == "amoeba"
    assert SPECIES["euglena"].silhouette == "euglena"
    assert SPECIES["volvox"].silhouette == "volvox"
    assert SPECIES["diatom"].silhouette == "diatom"
    assert SPECIES["kelp"].silhouette == "kelp"
    assert SPECIES["chlamydomonas"].silhouette == "chlamydomonas"
    assert SPECIES["stentor"].silhouette == "stentor"
    assert SPECIES["coli"].silhouette == "coli"
    assert SPECIES["haloarchaea"].silhouette == "haloarchaea"
    assert SPECIES["diatom"].walk < 10
    assert SPECIES["kelp"].walk < 10
    assert SPECIES["coli"].walk > SPECIES["paramecium"].walk


def test_ten_roost_guests_are_present_and_honest():
    assert ROOST_KEYS == WEB_ROOST
    for key in WEB_ROOST:
        spec = SPECIES[key]
        assert is_roost(key)
        assert not is_well(key)
        assert not is_pond(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
        if key in ("mallard", "canada_goose"):
            assert spec.perch is False
            assert spec.gait == "walk"
        else:
            assert spec.perch is True
    assert SPECIES["crow"].slug == "soot"
    assert SPECIES["crow"].name == "Soot"
    assert SPECIES["raven"].name == "Wedge"
    assert SPECIES["barn_owl"].name == "Heart"
    assert SPECIES["red_tail"].name == "Hook"
    assert SPECIES["chickadee"].name == "Dee"
    assert SPECIES["robin"].name == "Brick"
    assert SPECIES["mallard"].name == "Drake"
    assert SPECIES["canada_goose"].name == "Vee"
    assert SPECIES["pileated"].name == "Drum"
    assert SPECIES["hummingbird"].name == "Sip"
    assert SPECIES["red_tail"].walk >= 50
    assert SPECIES["hummingbird"].walk >= 70
    assert SPECIES["moss"].walk < 20


def test_ten_corner_guests_are_present_and_honest():
    assert CORNER_KEYS == WEB_CORNER
    for key in WEB_CORNER:
        spec = SPECIES[key]
        assert is_corner(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert not is_pond(key)
        assert not is_roost(key)
        assert not is_well(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
        assert spec.silhouette != "honeybee"
        assert spec.gait == "walk"
    assert SPECIES["orb_weaver"].slug == "loom"
    assert SPECIES["orb_weaver"].name == "Loom"
    assert SPECIES["jumping_spider"].name == "Leap"
    assert SPECIES["wolf_spider"].name == "Prowl"
    assert SPECIES["tarantula"].name == "Velvet"
    assert SPECIES["widow"].name == "Hour"
    assert SPECIES["harvestman"].name == "Stem"
    assert SPECIES["harvestman"].silhouette == "harvestman"
    assert SPECIES["scorpion"].name == "Barb"
    assert SPECIES["vinegaroon"].name == "Whip"
    assert SPECIES["tick"].name == "Clasp"
    assert SPECIES["solifuge"].name == "Gale"
    assert SPECIES["orb_weaver"].perch is True
    assert SPECIES["widow"].perch is True
    assert SPECIES["jumping_spider"].walk >= 70
    assert SPECIES["solifuge"].walk >= 100
    assert SPECIES["tick"].walk < 20


def test_ten_wood_guests_are_present_and_honest():
    assert WOOD_KEYS == WEB_WOOD
    for key in WEB_WOOD:
        spec = SPECIES[key]
        assert is_wood(key)
        assert not is_corner(key)
        assert not is_pond(key)
        assert not is_roost(key)
        assert not is_well(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
        assert spec.silhouette != "honeybee"
        assert spec.gait == "walk"
    assert SPECIES["deer"].slug == "rack"
    assert SPECIES["deer"].name == "Rack"
    assert SPECIES["bat"].name == "Cape"
    assert SPECIES["bat"].silhouette == "bat"
    assert SPECIES["bat"].perch is True
    assert SPECIES["squirrel"].name == "Cache"
    assert SPECIES["otter"].name == "Slick"
    assert SPECIES["otter"].aquatic is True
    assert SPECIES["raccoon"].name == "Wash"
    assert SPECIES["skunk"].name == "Stripe"
    assert SPECIES["skunk"].slug == "stripe"
    assert SPECIES["opossum"].name == "Grin"
    assert SPECIES["beaver"].name == "Dam"
    assert SPECIES["beaver"].aquatic is True
    assert SPECIES["porcupine"].name == "Spine"
    assert SPECIES["black_bear"].name == "Coal"
    assert SPECIES["black_bear"].silhouette == "bear"
    assert SPECIES["deer"].walk >= 80
    assert SPECIES["bat"].walk >= 100
    assert SPECIES["garter"].slug == "sash"
    assert SPECIES["garter"].name == "Sash"
    assert SPECIES["red_panda"].name == "Rui"
    assert SPECIES["hedgehog"].name == "Burr"
    assert SPECIES["parrot"].name == "Quill"
    assert SPECIES["kingsnake"].name == "Bandit"
    assert SPECIES["caecilian"].name == "Slip"
    assert SPECIES["axolotl"].name == "Bloom"
    assert SPECIES["honeybee"].name == "Comb"
    assert SPECIES["crayfish"].name == "Pinch"
    assert SPECIES["horseshoe_crab"].name == "Ledger"


def test_ten_stone_guests_are_present_and_honest():
    assert STONE_KEYS == WEB_STONE
    for key in WEB_STONE:
        spec = SPECIES[key]
        assert is_stone(key)
        assert not is_wood(key)
        assert not is_pond(key)
        assert not is_roost(key)
        assert not is_well(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "axolotl"
        assert spec.silhouette != "honeybee"
        assert spec.gait == "walk"
    assert SPECIES["gecko"].slug == "pad"
    assert SPECIES["gecko"].name == "Pad"
    assert SPECIES["anole"].name == "Wink"
    assert SPECIES["skink"].name == "Dash"
    assert SPECIES["chameleon"].name == "Shift"
    assert SPECIES["chameleon"].perch is True
    assert SPECIES["horned_lizard"].name == "Spike"
    assert SPECIES["alligator"].name == "Levee"
    assert SPECIES["alligator"].aquatic is True
    assert SPECIES["crocodile"].name == "Jaw"
    assert SPECIES["crocodile"].aquatic is True
    assert SPECIES["snapper"].name == "Beak"
    assert SPECIES["snapper"].aquatic is True
    assert SPECIES["box_turtle"].name == "Lid"
    assert SPECIES["tuatara"].name == "Peak"
    assert SPECIES["gecko"].walk >= 70
    assert SPECIES["chameleon"].walk < 30
    assert SPECIES["tuatara"].walk < 20
    assert SPECIES["water_lily"].slug == "disk"
    assert SPECIES["water_lily"].name == "Disk"
    assert SPECIES["iguana"].name == "Sol"
    assert SPECIES["dragon"].name == "Vesper"
    assert SPECIES["turtle"].name == "Ink"
    assert SPECIES["mussel"].name == "Hinge"
    assert SPECIES["chanterelle"].name == "Horn"
    assert SPECIES["mining_bee"].name == "Bank"
    assert SPECIES["garter"].name == "Sash"
    assert SPECIES["skunk"].name == "Stripe"


def test_ten_log_guests_are_present_and_honest():
    assert LOG_KEYS == WEB_LOG
    for key in WEB_LOG:
        spec = SPECIES[key]
        assert is_log(key)
        assert not is_creek(key)
        assert not is_pond(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert not is_corner(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "bee"
        assert spec.silhouette != "snake"
    assert SPECIES["house_centipede"].slug == "haste"
    assert SPECIES["house_centipede"].name == "Haste"
    assert SPECIES["millipede"].name == "Link"
    assert SPECIES["pillbug"].name == "Armor"
    assert SPECIES["earthworm"].name == "Cast"
    assert SPECIES["velvet_worm"].name == "Jet"
    assert SPECIES["velvet_worm"].slug == "jet"
    assert SPECIES["springtail"].name == "Hop"
    assert SPECIES["tardigrade"].name == "Tun"
    assert SPECIES["planarian"].name == "Half"
    assert SPECIES["nematode"].name == "Thread"
    assert SPECIES["amphipod"].name == "Scud"
    assert SPECIES["house_centipede"].walk > SPECIES["millipede"].walk
    assert SPECIES["pillbug"].slug == "armor"
    assert not SPECIES["pillbug"].aquatic
    assert SPECIES["amphipod"].aquatic is True
    assert SPECIES["sundew"].name == "Dew"
    assert SPECIES["honeybee"].name == "Comb"
    assert SPECIES["orb_weaver"].name == "Loom"
    assert SPECIES["leech"].name == "Latch"
    assert SPECIES["caecilian"].name == "Slip"
    assert SPECIES["moss"].name == "Felt"
    assert SPECIES["black_bear"].name == "Coal"
    assert SPECIES["pike"].name == "Lance"
    assert SPECIES["crayfish"].name == "Pinch"


def test_ten_shore_guests_are_present_and_honest():
    assert SHORE_KEYS == WEB_SHORE
    for key in WEB_SHORE:
        spec = SPECIES[key]
        assert is_shore(key)
        assert not is_log(key)
        assert not is_creek(key)
        assert not is_pond(key)
        assert not is_sea(key)
        assert not is_insect(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "bee"
        assert spec.silhouette != "snake"
    assert SPECIES["fiddler_crab"].slug == "wave"
    assert SPECIES["fiddler_crab"].name == "Wave"
    assert SPECIES["ghost_crab"].name == "Pale"
    assert SPECIES["ghost_crab"].slug == "pale"
    assert SPECIES["limpet"].name == "Cone"
    assert SPECIES["barnacle"].name == "Cement"
    assert SPECIES["chiton"].name == "Mail"
    assert SPECIES["periwinkle"].name == "Spire"
    assert SPECIES["sand_dollar"].name == "Token"
    assert SPECIES["sea_urchin"].name == "Thorn"
    assert SPECIES["knobbed_whelk"].name == "Knurl"
    assert SPECIES["lugworm"].name == "Heap"
    assert SPECIES["ghost_crab"].walk > SPECIES["fiddler_crab"].walk
    assert SPECIES["barnacle"].aquatic is True
    assert SPECIES["sand_dollar"].aquatic is True
    assert SPECIES["luna"].name == "Ghost"
    assert SPECIES["chanterelle"].name == "Horn"
    assert SPECIES["goldfish"].name == "Coin"
    assert SPECIES["hermit_crab"].name == "Tenant"
    assert SPECIES["horseshoe_crab"].name == "Ledger"
    assert SPECIES["earthworm"].name == "Cast"
    assert SPECIES["box_turtle"].name == "Lid"
    assert SPECIES["hedgehog"].name == "Burr"
    assert SPECIES["porcupine"].name == "Spine"


def test_ten_meadow_guests_are_present_and_honest():
    assert SHORE_KEYS == WEB_SHORE
    assert MEADOW_KEYS == WEB_MEADOW
    for key in WEB_MEADOW:
        spec = SPECIES[key]
        assert is_meadow(key)
        assert not is_shore(key)
        assert not is_log(key)
        assert not is_insect(key)
        assert not is_bee(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "bee"
        assert spec.silhouette != "snake"
    assert SPECIES["field_cricket"].slug == "chirp"
    assert SPECIES["field_cricket"].name == "Chirp"
    assert SPECIES["katydid"].name == "Blade"
    assert SPECIES["katydid"].slug == "blade"
    assert SPECIES["grasshopper"].name == "Vault"
    assert SPECIES["swallowtail"].name == "Banner"
    assert SPECIES["jewelwing"].name == "Jewel"
    assert SPECIES["lacewing"].name == "Lace"
    assert SPECIES["earwig"].name == "Forceps"
    assert SPECIES["acorn_weevil"].name == "Snout"
    assert SPECIES["click_beetle"].name == "Click"
    assert SPECIES["robber_fly"].name == "Rob"
    assert SPECIES["grasshopper"].walk > SPECIES["katydid"].walk
    assert SPECIES["honeybee"].name == "Comb"
    assert SPECIES["cicada"].name == "Brood"
    assert SPECIES["monarch"].name == "Milk"
    assert SPECIES["luna"].name == "Ghost"
    assert SPECIES["darner"].name == "Dart"
    assert SPECIES["jumping_spider"].name == "Leap"
    assert SPECIES["springtail"].name == "Hop"
    assert SPECIES["bumblebee"].name == "Thrum"
    assert SPECIES["carpenter_bee"].name == "Auger"
    assert SPECIES["oak"].name == "Mast"
    assert SPECIES["venus_flytrap"].name == "Snap"
    assert SPECIES["hummingbird"].name == "Sip"


def test_ten_canopy_guests_are_present_and_honest():
    assert CANOPY_KEYS == WEB_CANOPY
    for key in WEB_CANOPY:
        spec = SPECIES[key]
        assert is_canopy(key)
        assert not is_wood(key)
        assert not is_meadow(key)
        assert not is_shore(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.silhouette != "bear"
        assert spec.silhouette != "opossum"
    assert SPECIES["sloth"].slug == "hang"
    assert SPECIES["sloth"].name == "Hang"
    assert SPECIES["lemur"].name == "Sun"
    assert SPECIES["lemur"].slug == "sun"
    assert SPECIES["gibbon"].name == "Swing"
    assert SPECIES["kinkajou"].name == "Wrist"
    assert SPECIES["colugo"].name == "Sail"
    assert SPECIES["flying_squirrel"].name == "Glide"
    assert SPECIES["howler"].name == "Boom"
    assert SPECIES["tarsier"].name == "Gaze"
    assert SPECIES["potto"].name == "Still"
    assert SPECIES["koala"].name == "Gum"
    assert SPECIES["gibbon"].walk > SPECIES["sloth"].walk
    assert SPECIES["red_panda"].name == "Rui"
    assert SPECIES["skunk"].name == "Stripe"
    assert SPECIES["turkey_tail"].name == "Ring"
    assert SPECIES["hognose"].name == "Bluff"
    assert SPECIES["opossum"].name == "Grin"
    assert SPECIES["black_bear"].name == "Coal"
    assert SPECIES["parrot"].name == "Quill"
    assert SPECIES["hummingbird"].name == "Sip"


def test_ten_reef_guests_are_present_and_honest():
    assert REEF_KEYS == WEB_REEF
    for key in WEB_REEF:
        spec = SPECIES[key]
        assert is_reef(key)
        assert not is_sea(key)
        assert not is_shore(key)
        assert not is_canopy(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.aquatic is True
        assert spec.silhouette != "manta"
        assert spec.silhouette != "moray"
        assert spec.silhouette != "jelly"
        assert spec.silhouette != "fish"
    assert SPECIES["brain_coral"].slug == "ridge"
    assert SPECIES["brain_coral"].name == "Ridge"
    assert SPECIES["anemone"].name == "Wreath"
    assert SPECIES["clownfish"].name == "Paint"
    assert SPECIES["parrotfish"].name == "Scrape"
    assert SPECIES["cleaner_shrimp"].name == "Scrub"
    assert SPECIES["sea_cucumber"].name == "Tube"
    assert SPECIES["lionfish"].name == "Veil"
    assert SPECIES["lionfish"].slug == "veil"
    assert SPECIES["giant_clam"].name == "Gate"
    assert SPECIES["eagle_ray"].name == "Soar"
    assert SPECIES["grouper"].name == "Hide"
    assert SPECIES["lions_mane"].name == "Mane"
    assert SPECIES["lions_mane"].slug == "mane"
    assert SPECIES["manta"].name == "Kite"
    assert SPECIES["moray"].name == "Door"
    assert SPECIES["goldfish"].name == "Coin"
    assert SPECIES["moon_jelly"].name == "Pulse"
    assert SPECIES["ginkgo"].name == "Fan"


def test_ten_creek_guests_are_present_and_honest():
    assert CREEK_KEYS == WEB_CREEK
    for key in WEB_CREEK:
        spec = SPECIES[key]
        assert is_creek(key)
        assert not is_stone(key)
        assert not is_pond(key)
        assert not is_sea(key)
        assert not is_well(key)
        assert spec.treat
        assert spec.treat_shape in TREAT_SHAPES
        assert spec.aquatic is True
        assert spec.silhouette != "fish"
        assert spec.silhouette != "axolotl"
    assert SPECIES["bass"].slug == "lunge"
    assert SPECIES["bass"].name == "Lunge"
    assert SPECIES["brook_trout"].name == "Speck"
    assert SPECIES["catfish"].name == "Whisk"
    assert SPECIES["bluegill"].name == "Penny"
    assert SPECIES["perch"].name == "Bar"
    assert SPECIES["pike"].name == "Lance"
    assert SPECIES["walleye"].name == "Night"
    assert SPECIES["paddlefish"].name == "Spoon"
    assert SPECIES["lamprey"].name == "Round"
    assert SPECIES["american_eel"].name == "Silver"
    assert SPECIES["paddlefish"].walk < SPECIES["bass"].walk
    assert SPECIES["lamprey"].walk < SPECIES["american_eel"].walk
    assert SPECIES["goldfish"].name == "Coin"
    assert SPECIES["goldfish"].slug == "coin"
    assert SPECIES["stickleback"].name == "Prickle"
    assert SPECIES["seahorse"].name == "Anchor"
    assert SPECIES["moon_jelly"].name == "Pulse"
    assert SPECIES["water_lily"].name == "Disk"
    assert SPECIES["water_lily"].slug == "disk"


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
    assert next_species_key("cicada") == "bumblebee"
    assert next_species_key("honeycomb") == "oyster"
    assert next_species_key("lichen") == "photovore"
    assert next_species_key("cyst") == "frog"
    assert next_species_key("stickleback") == "paramecium"
    assert next_species_key("haloarchaea") == "crow"
    assert prev_species_key("crow") == "haloarchaea"
    assert next_species_key("hummingbird") == "orb_weaver"
    assert next_species_key("solifuge") == "deer"
    assert next_species_key("black_bear") == "gecko"
    assert next_species_key("tuatara") == "bass"
    assert next_species_key("american_eel") == "house_centipede"
    assert next_species_key("amphipod") == "fiddler_crab"
    assert next_species_key("lugworm") == "field_cricket"
    assert next_species_key("robber_fly") == "sloth"
    assert next_species_key("koala") == "brain_coral"
    assert next_species_key("grouper") == "red_panda"
    assert prev_species_key("red_panda") == "grouper"
    assert prev_species_key("brain_coral") == "koala"
    assert prev_species_key("sloth") == "robber_fly"
    assert prev_species_key("field_cricket") == "lugworm"
    assert prev_species_key("house_centipede") == "american_eel"
    assert prev_species_key("fiddler_crab") == "amphipod"
    assert prev_species_key("bass") == "tuatara"
    assert prev_species_key("gecko") == "black_bear"
    assert prev_species_key("deer") == "solifuge"
    assert prev_species_key("paramecium") == "stickleback"
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
    assert treated.cmd == "eat"
    assert treated.line
    hidden = apply_hide(CareState(), nori)
    assert hidden.state.hidden is True
    assert hidden.line
