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
    STONE_KEYS,
    WOOD_KEYS,
    SPECIES,
    is_bee,
    is_corner,
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
    assert next_species_key("black_bear") == "red_panda"
    assert prev_species_key("red_panda") == "black_bear"
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
    assert treated.cmd == "seek"
    assert treated.line
    hidden = apply_hide(CareState(), nori)
    assert hidden.state.hidden is True
    assert hidden.line
