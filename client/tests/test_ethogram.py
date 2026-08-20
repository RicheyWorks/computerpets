from computerpets_client.ethogram import (
    SCRATCH_KEYS,
    TONGUE_KEYS,
    acts_for,
    pick_act,
)
from computerpets_client.species import BEE_KEYS, CATALOG_KEYS, CORNER_KEYS, CREEK_KEYS, FAR_KEYS, FUNGI_KEYS, GARDEN_KEYS, INSECT_KEYS, POND_KEYS, ROOST_KEYS, SEA_KEYS, SNAKE_KEYS, WELL_KEYS, WOOD_KEYS, STONE_KEYS


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
    for key in SEA_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    for key in GARDEN_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    for key in INSECT_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
        assert "eat" not in names, key
    for key in BEE_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
        assert "eat" not in names, key
        assert "waggle" not in names, key
    assert "hold" in [a["name"] for a in acts_for("honeycomb")]
    assert "hum" in [a["name"] for a in acts_for("honey_drone")]
    assert "lay" in [a["name"] for a in acts_for("honey_queen")]
    assert "thrum" in [a["name"] for a in acts_for("bumblebee")]
    assert "waggle" in [a["name"] for a in acts_for("honeybee")]
    assert "flash" in [a["name"] for a in acts_for("firefly")]
    assert "freeze" in [a["name"] for a in acts_for("stick")]
    assert "fold" in [a["name"] for a in acts_for("mantis")]
    assert "emerge" in [a["name"] for a in acts_for("cicada")]
    assert "still" in [a["name"] for a in acts_for("luna")]
    assert "snap" in [a["name"] for a in acts_for("venus_flytrap")]
    assert "still" in [a["name"] for a in acts_for("pitcher")]
    assert "curl" in [a["name"] for a in acts_for("sundew")]
    for key in FUNGI_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
        assert "waggle" not in names, key
        assert "yawn" not in names, key
    assert "puff" in [a["name"] for a in acts_for("puffball")]
    assert "rise" in [a["name"] for a in acts_for("yeast")]
    assert "share-still" in [a["name"] for a in acts_for("lichen")]
    assert "lean" in [a["name"] for a in acts_for("oyster")]
    assert "flush" in [a["name"] for a in acts_for("fly_agaric")]
    for key in FAR_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "drink-light" in [a["name"] for a in acts_for("photovore")]
    assert "chord-pulse" in [a["name"] for a in acts_for("choir")]
    assert "float" in [a["name"] for a in acts_for("nimbus")]
    assert "facet" in [a["name"] for a in acts_for("silica")]
    assert "edge-walk" in [a["name"] for a in acts_for("terminator")]
    assert "count-ripple" in [a["name"] for a in acts_for("nexus")]
    assert "frost" in [a["name"] for a in acts_for("halovore")]
    assert "align" in [a["name"] for a in acts_for("magneton")]
    assert "dim" in [a["name"] for a in acts_for("umbral")]
    assert "wake" in [a["name"] for a in acts_for("cyst")]
    for key in POND_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "hop" in [a["name"] for a in acts_for("frog")]
    assert "croak" in [a["name"] for a in acts_for("frog")]
    assert "puff" in [a["name"] for a in acts_for("toad")]
    assert "hide" in [a["name"] for a in acts_for("salamander")]
    assert "slip" in [a["name"] for a in acts_for("caecilian")]
    assert "pinch" in [a["name"] for a in acts_for("crayfish")]
    assert "rasp" in [a["name"] for a in acts_for("pond_snail")]
    assert "siphon" in [a["name"] for a in acts_for("mussel")]
    assert "latch" in [a["name"] for a in acts_for("leech")]
    assert "flare" in [a["name"] for a in acts_for("stickleback")]
    for key in WELL_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "cilia" in [a["name"] for a in acts_for("paramecium")]
    assert "reach" in [a["name"] for a in acts_for("amoeba")]
    assert "spot" in [a["name"] for a in acts_for("euglena")]
    assert "roll" in [a["name"] for a in acts_for("volvox")]
    assert "pane" in [a["name"] for a in acts_for("diatom")]
    assert "holdfast" in [a["name"] for a in acts_for("kelp")]
    assert "spin" in [a["name"] for a in acts_for("chlamydomonas")]
    assert "trumpet" in [a["name"] for a in acts_for("stentor")]
    assert "tumble" in [a["name"] for a in acts_for("coli")]
    assert "blush" in [a["name"] for a in acts_for("haloarchaea")]
    for key in ROOST_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "caw" in [a["name"] for a in acts_for("crow")]
    assert "kronk" in [a["name"] for a in acts_for("raven")]
    assert "hiss" in [a["name"] for a in acts_for("barn_owl")]
    assert "soar" in [a["name"] for a in acts_for("red_tail")]
    assert "dee" in [a["name"] for a in acts_for("chickadee")]
    assert "hop" in [a["name"] for a in acts_for("robin")]
    assert "dabble" in [a["name"] for a in acts_for("mallard")]
    assert "honk" in [a["name"] for a in acts_for("canada_goose")]
    assert "drum" in [a["name"] for a in acts_for("pileated")]
    assert "hover" in [a["name"] for a in acts_for("hummingbird")]
    for key in CORNER_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "sit_web" in [a["name"] for a in acts_for("orb_weaver")]
    assert "leap" in [a["name"] for a in acts_for("jumping_spider")]
    assert "prowl" in [a["name"] for a in acts_for("wolf_spider")]
    assert "flick" in [a["name"] for a in acts_for("tarantula")]
    assert "hang" in [a["name"] for a in acts_for("widow")]
    assert "walk" in [a["name"] for a in acts_for("harvestman")]
    assert "sting" in [a["name"] for a in acts_for("scorpion")]
    assert "whip" in [a["name"] for a in acts_for("vinegaroon")]
    assert "clasp" in [a["name"] for a in acts_for("tick")]
    assert "run" in [a["name"] for a in acts_for("solifuge")]
    for key in WOOD_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "flag" in [a["name"] for a in acts_for("deer")]
    assert "hang" in [a["name"] for a in acts_for("bat")]
    assert "bury" in [a["name"] for a in acts_for("squirrel")]
    assert "slide" in [a["name"] for a in acts_for("otter")]
    assert "rinse" in [a["name"] for a in acts_for("raccoon")]
    assert "stamp" in [a["name"] for a in acts_for("skunk")]
    assert "playdead" in [a["name"] for a in acts_for("opossum")]
    assert "gnaw" in [a["name"] for a in acts_for("beaver")]
    assert "bristle" in [a["name"] for a in acts_for("porcupine")]
    assert "forage" in [a["name"] for a in acts_for("black_bear")]
    for key in STONE_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "climb" in [a["name"] for a in acts_for("gecko")]
    assert "flash" in [a["name"] for a in acts_for("anole")]
    assert "dash" in [a["name"] for a in acts_for("skink")]
    assert "aim" in [a["name"] for a in acts_for("chameleon")]
    assert "crown" in [a["name"] for a in acts_for("horned_lizard")]
    assert "bask" in [a["name"] for a in acts_for("alligator")]
    assert "show" in [a["name"] for a in acts_for("crocodile")]
    assert "snap" in [a["name"] for a in acts_for("snapper")]
    assert "shut" in [a["name"] for a in acts_for("box_turtle")]
    assert "still" in [a["name"] for a in acts_for("tuatara")]
    for key in CREEK_KEYS:
        names = [a["name"] for a in acts_for(key)]
        assert "scratch" not in names, key
        assert "tongue" not in names, key
    assert "lunge" in [a["name"] for a in acts_for("bass")]
    assert "dart" in [a["name"] for a in acts_for("brook_trout")]
    assert "whisk" in [a["name"] for a in acts_for("catfish")]
    assert "flare" in [a["name"] for a in acts_for("bluegill")]
    assert "bar" in [a["name"] for a in acts_for("perch")]
    assert "lance" in [a["name"] for a in acts_for("pike")]
    assert "hunt" in [a["name"] for a in acts_for("walleye")]
    assert "filter" in [a["name"] for a in acts_for("paddlefish")]
    assert "disk" in [a["name"] for a in acts_for("lamprey")]
    assert "swim" in [a["name"] for a in acts_for("american_eel")]
