"""Every catalog key has a plaque; the important mix-ups are actually taught.

Same spirit as web/scripts/house-guide.test.mjs and snake-guide.test.mjs.
Copy is ported from the web guides — do not invent new biology here.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

from computerpets_client.guide import (
    BEE_GUIDE,
    FIELD_GUIDE,
    FUNGI_GUIDE,
    GARDEN_GUIDE,
    HOUSE_GUIDE,
    INSECT_GUIDE,
    SEA_GUIDE,
    SNAKE_GUIDE,
    bee_guide_complete,
    bee_guide_keys,
    classroom_for,
    far_guide_complete,
    far_guide_keys,
    pond_guide_complete,
    pond_guide_keys,
    WELL_GUIDE,
    well_guide_complete,
    well_guide_keys,
    fungi_guide_complete,
    fungi_guide_keys,
    garden_guide_complete,
    garden_guide_keys,
    insect_guide_complete,
    insect_guide_keys,
    guide_complete,
    house_guide_complete,
    house_guide_keys,
    plaque_by_slug,
    plaque_for,
    sea_guide_complete,
    sea_guide_keys,
    snake_guide_complete,
    snake_guide_keys,
)
from computerpets_client.species import BEE_KEYS, CATALOG_KEYS, FAR_KEYS, FUNGI_KEYS, GARDEN_KEYS, HOUSE_KEYS, INSECT_KEYS, POND_KEYS, SEA_KEYS, SNAKE_KEYS, WELL_KEYS, SPECIES

HOUSE_EXPECTED = [
    ("red_panda", "rui", "Ailurus fulgens"),
    ("cat", "miso", "Felis catus"),
    ("dog", "pip", "Canis familiaris"),
    ("rabbit", "thimble", "Oryctolagus cuniculus"),
    ("hamster", "clip", "Mesocricetus auratus"),
    ("guinea_pig", "whee", "Cavia porcellus"),
    ("turtle", "ink", "Mauremys reevesii"),
    ("goldfish", "coin", "Carassius auratus"),
    ("budgie", "echo", "Melopsittacus undulatus"),
    ("fox", "rue", "Vulpes vulpes"),
    ("penguin", "peck", "Eudyptula minor"),
    ("parrot", "quill", "Ara macao"),
    ("ferret", "wick", "Mustela furo"),
    ("hedgehog", "burr", "Atelerix albiventris"),
    ("chinchilla", "floss", "Chinchilla lanigera"),
    ("axolotl", "bloom", "Ambystoma mexicanum"),
    ("toucan", "keel", "Ramphastos sulfuratus"),
    ("iguana", "sol", "Iguana iguana"),
    ("dragon", "vesper", "kept, not collected"),
    ("phoenix", "ember", "kept in the ash"),
]

SNAKE_EXPECTED = [
    ("ball_python", "nori", "Python regius"),
    ("corn_snake", "saffron", "Pantherophis guttatus"),
    ("kingsnake", "bandit", "Lampropeltis californiae"),
    ("green_tree_python", "jade", "Morelia viridis"),
    ("hognose", "bluff", "Heterodon nasicus"),
    ("garter", "stripe", "Thamnophis sirtalis"),
    ("boa", "lula", "Boa constrictor"),
    ("milk_snake", "coral", "Lampropeltis gentilis"),
    ("rosy_boa", "blush", "Lichanura trivirgata"),
    ("carpet_python", "atlas", "Morelia spilota cheynei"),
]

SEA_EXPECTED = [
    ("octopus", "cup", "Octopus vulgaris"),
    ("cuttlefish", "sepia", "Sepia officinalis"),
    ("nautilus", "chamber", "Nautilus pompilius"),
    ("moon_jelly", "pulse", "Aurelia aurita"),
    ("sea_star", "ochre", "Pisaster ochraceus"),
    ("hermit_crab", "tenant", "Pagurus bernhardus"),
    ("horseshoe_crab", "ledger", "Limulus polyphemus"),
    ("seahorse", "anchor", "Hippocampus erectus"),
    ("manta", "kite", "Mobula alfredi"),
    ("moray", "door", "Gymnothorax funebris"),
]

GARDEN_EXPECTED = [
    ("moss", "felt", "Hypnum cupressiforme"),
    ("maidenhair", "vein", "Adiantum capillus-veneris"),
    ("ginkgo", "fan", "Ginkgo biloba"),
    ("oak", "mast", "Quercus alba"),
    ("water_lily", "pad", "Nymphaea odorata"),
    ("orchid", "moth", "Phalaenopsis amabilis"),
    ("saguaro", "arm", "Carnegiea gigantea"),
    ("venus_flytrap", "snap", "Dionaea muscipula"),
    ("pitcher", "well", "Sarracenia purpurea"),
    ("sundew", "dew", "Drosera rotundifolia"),
]

INSECT_EXPECTED = [
    ("honeybee", "comb", "Apis mellifera"),
    ("monarch", "milk", "Danaus plexippus"),
    ("luna", "ghost", "Actias luna"),
    ("firefly", "spark", "Photinus pyralis"),
    ("darner", "dart", "Anax junius"),
    ("stick", "twig", "Diapheromera femorata"),
    ("carpenter_ant", "column", "Camponotus pennsylvanicus"),
    ("ladybird", "seven", "Coccinella septempunctata"),
    ("mantis", "fold", "Tenodera sinensis"),
    ("cicada", "brood", "Magicicada septendecim"),
]

BEE_EXPECTED = [
    ("bumblebee", "thrum", "Bombus impatiens"),
    ("carpenter_bee", "auger", "Xylocopa virginica"),
    ("mason_bee", "mortar", "Osmia lignaria"),
    ("leafcutter", "disc", "Megachile rotundata"),
    ("stingless", "pot", "Melipona beecheii"),
    ("sweat_bee", "sheen", "Agapostemon virescens"),
    ("mining_bee", "bank", "Andrena vicina"),
    ("honey_drone", "hum", "Apis mellifera"),
    ("honey_queen", "keep", "Apis mellifera"),
    ("honeycomb", "wax", "Apis mellifera nest"),
]

FUNGI_EXPECTED = [
    ("oyster", "frill", "Pleurotus ostreatus"),
    ("fly_agaric", "cap", "Amanita muscaria"),
    ("morel", "lattice", "Morchella americana"),
    ("chanterelle", "horn", "Cantharellus cibarius"),
    ("turkey_tail", "ring", "Trametes versicolor"),
    ("lions_mane", "mane", "Hericium erinaceus"),
    ("puffball", "puff", "Lycoperdon perlatum"),
    ("chicken_of_woods", "flame", "Laetiporus sulphureus"),
    ("yeast", "starter", "Saccharomyces cerevisiae"),
    ("lichen", "pact", "Cladonia rangiferina"),
]

FAR_EXPECTED = [
    ("photovore", "gleam", "Lucivora sitim"),
    ("choir", "choir", "Harmonia plexus"),
    ("nimbus", "drift", "Nimbus methanei"),
    ("silica", "shard", "Silica crescit"),
    ("terminator", "dusk", "Limitor cursor"),
    ("nexus", "knot", "Nexus colonis"),
    ("halovore", "brine", "Halovora brina"),
    ("magneton", "beacon", "Magneton natare"),
    ("umbral", "hush", "Umbralentis quietis"),
    ("cyst", "arca", "Arca vagans"),
]

POND_EXPECTED = [
    ("frog", "reed", "Lithobates clamitans"),
    ("toad", "pebble", "Anaxyrus americanus"),
    ("newt", "eft", "Notophthalmus viridescens"),
    ("salamander", "dapple", "Ambystoma maculatum"),
    ("caecilian", "slip", "Typhlonectes natans"),
    ("crayfish", "pinch", "Cambarus bartonii"),
    ("pond_snail", "whorl", "Lymnaea stagnalis"),
    ("mussel", "hinge", "Elliptio complanata"),
    ("leech", "latch", "Haemopis sanguisuga"),
    ("stickleback", "prickle", "Gasterosteus aculeatus"),
]

WELL_EXPECTED = [
    ("paramecium", "boot", "Paramecium caudatum"),
    ("amoeba", "reach", "Amoeba proteus"),
    ("euglena", "spot", "Euglena gracilis"),
    ("volvox", "orb", "Volvox aureus"),
    ("diatom", "pane", "Navicula"),
    ("kelp", "hold", "Macrocystis pyrifera"),
    ("chlamydomonas", "spin", "Chlamydomonas reinhardtii"),
    ("stentor", "bell", "Stentor coeruleus"),
    ("coli", "rod", "Escherichia coli"),
    ("haloarchaea", "rose", "Halobacterium salinarum"),
]

WEB_PETS = Path(__file__).resolve().parents[2] / "web" / "src" / "lib" / "pets"


def _taught(guide) -> str:
    return " ".join((guide.tell, guide.mixup, guide.lesson))


def test_every_catalog_key_has_a_tell_and_a_mixup():
    assert guide_complete()
    assert house_guide_complete()
    assert snake_guide_complete()
    assert sea_guide_complete()
    assert garden_guide_complete()
    assert insect_guide_complete()
    assert bee_guide_complete()
    assert fungi_guide_complete()
    assert far_guide_complete()
    assert pond_guide_complete()
    assert well_guide_complete()
    assert house_guide_keys() == HOUSE_KEYS
    assert snake_guide_keys() == SNAKE_KEYS
    assert sea_guide_keys() == SEA_KEYS
    assert garden_guide_keys() == GARDEN_KEYS
    assert insect_guide_keys() == INSECT_KEYS
    assert bee_guide_keys() == BEE_KEYS
    assert fungi_guide_keys() == FUNGI_KEYS
    assert far_guide_keys() == FAR_KEYS
    assert pond_guide_keys() == POND_KEYS
    assert well_guide_keys() == WELL_KEYS
    assert len(FIELD_GUIDE) == len(CATALOG_KEYS)
    assert len(HOUSE_GUIDE) == 20
    assert len(SNAKE_GUIDE) == 10
    assert len(SEA_GUIDE) == 10
    assert len(GARDEN_GUIDE) == 10
    assert len(INSECT_GUIDE) == 10
    assert len(BEE_GUIDE) == 10
    assert len(FUNGI_GUIDE) == 10
    assert len(WELL_GUIDE) == 10
    for key in CATALOG_KEYS:
        guide = plaque_for(key)
        assert guide is not None, key
        assert guide.key == key
        assert guide.slug == SPECIES[key].slug
        assert guide.name == SPECIES[key].name
        assert guide.species == SPECIES[key].label
        assert guide.tell.strip()
        assert guide.mixup.strip()
        assert guide.lesson.strip()
        assert guide.latin.strip()
        assert guide.habitat.strip()
        assert guide.temperament.strip()


def test_house_and_den_list_the_same_keys_as_the_roster():
    assert [g.key for g in HOUSE_GUIDE] == [key for key, _, _ in HOUSE_EXPECTED]
    assert [g.key for g in SNAKE_GUIDE] == [key for key, _, _ in SNAKE_EXPECTED]
    assert [g.key for g in SEA_GUIDE] == [key for key, _, _ in SEA_EXPECTED]
    assert [g.key for g in GARDEN_GUIDE] == [key for key, _, _ in GARDEN_EXPECTED]
    assert [g.key for g in INSECT_GUIDE] == [key for key, _, _ in INSECT_EXPECTED]
    assert [g.key for g in BEE_GUIDE] == [key for key, _, _ in BEE_EXPECTED]
    assert [g.key for g in FUNGI_GUIDE] == [key for key, _, _ in FUNGI_EXPECTED]
    for key, slug, latin in HOUSE_EXPECTED + SNAKE_EXPECTED + SEA_EXPECTED + GARDEN_EXPECTED + INSECT_EXPECTED + BEE_EXPECTED + FUNGI_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in SNAKE_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "den"
        assert classroom_for(key).verb == "crawl"
    for key in HOUSE_KEYS:
        assert classroom_for(key).room == "house"
        assert classroom_for(key).verb == "walk"
    for key in SEA_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "tide"
        assert classroom_for(key).verb == "swim"
    for key in GARDEN_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "garden"
        assert classroom_for(key).verb == "grow"
    for key in INSECT_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "hive"
        assert classroom_for(key).verb == "stay"
    for key in BEE_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "hive"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "The hive. Bees and comb."
    for key in FUNGI_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "cellar"
        assert classroom_for(key).verb == "stay"
    for key, slug, latin in FAR_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in FAR_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "far"
        assert classroom_for(key).verb == "stay"
    for key, slug, latin in POND_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in POND_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "pond"
        assert classroom_for(key).verb == "stay"
    for key, slug, latin in WELL_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in WELL_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "well"
        assert classroom_for(key).verb == "stay"


def test_the_important_house_mixups_are_actually_taught():
    panda = _taught(plaque_for("red_panda"))
    axolotl = _taught(plaque_for("axolotl"))
    chinchilla = _taught(plaque_for("chinchilla"))
    guinea = _taught(plaque_for("guinea_pig"))
    hedgehog = _taught(plaque_for("hedgehog"))
    rabbit = _taught(plaque_for("rabbit"))
    goldfish = _taught(plaque_for("goldfish"))
    fox = _taught(plaque_for("fox"))
    penguin = _taught(plaque_for("penguin"))
    dragon = _taught(plaque_for("dragon"))
    assert re.search(r"not a bear", panda, re.I)
    assert re.search(r"raccoon", panda, re.I)
    assert re.search(r"salamander", axolotl, re.I)
    assert re.search(r"gills", axolotl, re.I)
    assert re.search(r"not a fish", axolotl, re.I)
    assert re.search(r"dust", chinchilla, re.I)
    assert re.search(r"wheek", guinea, re.I)
    assert re.search(r"porcupine", hedgehog, re.I)
    assert re.search(r"quills that stay", hedgehog, re.I)
    assert re.search(r"not a rodent", rabbit, re.I)
    assert re.search(r"not a koi", goldfish, re.I)
    assert re.search(r"white tip", fox, re.I)
    assert re.search(r"puffin", penguin, re.I)
    assert re.search(r"not a Komodo", dragon, re.I)


def test_the_important_den_mixups_are_actually_taught():
    milk = _taught(plaque_for("milk_snake"))
    ball = _taught(plaque_for("ball_python"))
    king = _taught(plaque_for("kingsnake"))
    boa = _taught(plaque_for("boa"))
    assert re.search(r"coral snake", milk, re.I)
    assert re.search(r"red against yellow", milk, re.I)
    assert re.search(r"red against black", milk, re.I)
    assert re.search(r"boa", ball, re.I)
    assert re.search(r"ball python|Nori", boa, re.I)
    assert re.search(r"coral snake", king, re.I)
    assert re.search(r"no red", king, re.I)


def test_the_important_tide_mixups_are_actually_taught():
    jelly = _taught(plaque_for("moon_jelly"))
    star = _taught(plaque_for("sea_star"))
    horseshoe = _taught(plaque_for("horseshoe_crab"))
    moray = _taught(plaque_for("moray"))
    assert re.search(r"not a fish", jelly, re.I)
    assert re.search(r"not a fish", star, re.I)
    assert re.search(r"not a crab", horseshoe, re.I)
    assert re.search(r"book-gills", horseshoe, re.I)
    assert re.search(r"gape is breath", moray, re.I)


def test_the_important_garden_mixups_are_actually_taught():
    moss = _taught(plaque_for("moss"))
    fern = _taught(plaque_for("maidenhair"))
    ginkgo = _taught(plaque_for("ginkgo"))
    flytrap = _taught(plaque_for("venus_flytrap"))
    pitcher = _taught(plaque_for("pitcher"))
    sundew = _taught(plaque_for("sundew"))
    saguaro = _taught(plaque_for("saguaro"))
    assert re.search(r"no flower", moss, re.I)
    assert re.search(r"not a lichen", moss, re.I)
    assert re.search(r"not a flowering plant", fern, re.I)
    assert re.search(r"not a flowering plant", ginkgo, re.I)
    assert re.search(r"not a monster", flytrap, re.I)
    assert re.search(r"two hairs", flytrap, re.I)
    assert re.search(r"snap", flytrap, re.I)
    assert re.search(r"well", pitcher, re.I)
    assert re.search(r"drown", pitcher, re.I)
    assert re.search(r"not a flytrap", pitcher, re.I)
    assert re.search(r"glue", sundew, re.I)
    assert re.search(r"curl", sundew, re.I)
    assert re.search(r"not a flytrap", sundew, re.I)
    assert re.search(r"not a tree", saguaro, re.I)
    assert re.search(r"cactus", saguaro, re.I)


def test_the_important_hive_mixups_are_actually_taught():
    bee = _taught(plaque_for("honeybee"))
    monarch = _taught(plaque_for("monarch"))
    luna = _taught(plaque_for("luna"))
    firefly = _taught(plaque_for("firefly"))
    darner = _taught(plaque_for("darner"))
    stick = _taught(plaque_for("stick"))
    ant = _taught(plaque_for("carpenter_ant"))
    lady = _taught(plaque_for("ladybird"))
    mantis = _taught(plaque_for("mantis"))
    cicada = _taught(plaque_for("cicada"))
    assert re.search(r"dance", bee, re.I)
    assert re.search(r"map", bee, re.I)
    assert re.search(r"milkweed", monarch, re.I)
    assert re.search(r"warning", monarch, re.I)
    assert re.search(r"no mouth", luna, re.I)
    assert re.search(r"does not eat", luna, re.I)
    assert re.search(r"not a monarch", luna, re.I)
    assert re.search(r"beetle", firefly, re.I)
    assert re.search(r"not a fly", firefly, re.I)
    assert re.search(r"nymph", darner, re.I)
    assert re.search(r"water", darner, re.I)
    assert re.search(r"furniture", stick, re.I)
    assert re.search(r"walk", stick, re.I)
    assert re.search(r"does not eat the house", ant, re.I)
    assert re.search(r"nests", ant, re.I)
    assert re.search(r"seven", lady, re.I)
    assert re.search(r"aphid", lady, re.I)
    assert re.search(r"beetle", lady, re.I)
    assert re.search(r"prayer is a trap", mantis, re.I)
    assert re.search(r"not a plant", mantis, re.I)
    assert re.search(r"seventeen", cicada, re.I)
    assert re.search(r"song", cicada, re.I)


def test_the_important_bee_mixups_are_actually_taught():
    thrum = _taught(plaque_for("bumblebee"))
    auger = _taught(plaque_for("carpenter_bee"))
    hum = _taught(plaque_for("honey_drone"))
    keep = _taught(plaque_for("honey_queen"))
    wax = _taught(plaque_for("honeycomb"))
    assert re.search(r"not a honey bee", thrum, re.I)
    assert re.search(r"does not keep honey the honey-bee way", auger, re.I)
    assert re.search(r"drone is not a worker", hum, re.I)
    assert re.search(r"not a second Comb", keep, re.I)
    assert re.search(r"many bees, one", wax, re.I)
    assert re.search(r"not a shop", wax, re.I)


def test_the_important_cellar_mixups_are_actually_taught():
    oyster = _taught(plaque_for("oyster"))
    agaric = _taught(plaque_for("fly_agaric"))
    morel = _taught(plaque_for("morel"))
    chant = _taught(plaque_for("chanterelle"))
    turkey = _taught(plaque_for("turkey_tail"))
    mane = _taught(plaque_for("lions_mane"))
    puff = _taught(plaque_for("puffball"))
    chicken = _taught(plaque_for("chicken_of_woods"))
    yeast = _taught(plaque_for("yeast"))
    lichen = _taught(plaque_for("lichen"))
    assert re.search(r"dead wood", oyster, re.I)
    assert re.search(r"not a plant", oyster, re.I)
    assert re.search(r"warning", agaric, re.I)
    assert re.search(r"volva", agaric, re.I)
    assert re.search(r"not lunch", agaric, re.I)
    assert re.search(r"hollow", morel, re.I)
    assert re.search(r"false morel", morel, re.I)
    assert re.search(r"fork", chant, re.I)
    assert re.search(r"jack-o", chant, re.I)
    assert re.search(r"Omphalotus", chant)
    assert re.search(r"pores not gills", turkey, re.I)
    assert re.search(r"not a turkey", turkey, re.I)
    assert re.search(r"teeth", mane, re.I)
    assert re.search(r"not gills", mane, re.I)
    assert re.search(r"puff", puff, re.I)
    assert re.search(r"Amanita", puff)
    assert re.search(r"cut", puff, re.I)
    assert re.search(r"sulfur", chicken, re.I)
    assert re.search(r"not a chicken", chicken, re.I)
    assert re.search(r"bread", yeast, re.I)
    assert re.search(r"fungus", yeast, re.I)
    assert re.search(r"not one creature", lichen, re.I)
    assert re.search(r"partner", lichen, re.I)
    assert re.search(r"two kingdoms", lichen, re.I)


def test_the_important_far_mixups_are_actually_taught():
    gleam = _taught(plaque_for("photovore"))
    choir = _taught(plaque_for("choir"))
    drift = _taught(plaque_for("nimbus"))
    shard = _taught(plaque_for("silica"))
    dusk = _taught(plaque_for("terminator"))
    knot = _taught(plaque_for("nexus"))
    brine = _taught(plaque_for("halovore"))
    beacon = _taught(plaque_for("magneton"))
    hush = _taught(plaque_for("umbral"))
    arca = _taught(plaque_for("cyst"))
    assert re.search(r"wavelength", gleam, re.I)
    assert re.search(r"not a firefly", gleam, re.I)
    assert re.search(r"Spark", gleam)
    assert re.search(r"one animal", choir, re.I)
    assert re.search(r"not a whale", choir, re.I)
    assert re.search(r"air is the water", drift, re.I)
    assert re.search(r"not a jellyfish", drift, re.I)
    assert re.search(r"Pulse", drift)
    assert re.search(r"mineral", shard, re.I)
    assert re.search(r"not quartz", shard, re.I)
    assert re.search(r"not a plant", shard, re.I)
    assert re.search(r"rim is the country", dusk, re.I)
    assert re.search(r"not a cat", dusk, re.I)
    assert re.search(r"many animals", knot, re.I)
    assert re.search(r"one name", knot, re.I)
    assert re.search(r"siphonophore", knot, re.I)
    assert re.search(r"water is optional", brine, re.I)
    assert re.search(r"not a crab", brine, re.I)
    assert re.search(r"Ledger", brine)
    assert re.search(r"north is food", beacon, re.I)
    assert re.search(r"not a compass", beacon, re.I)
    assert re.search(r"Kite", beacon)
    assert re.search(r"cool is lunch", hush, re.I)
    assert re.search(r"not a moth", hush, re.I)
    assert re.search(r"orchid", hush, re.I)
    assert re.search(r"wait", arca, re.I)
    assert re.search(r"not Brood", arca, re.I)
    assert re.search(r"cicada", arca, re.I)


def test_the_important_pond_mixups_are_actually_taught():
    frog = _taught(plaque_for("frog"))
    toad = _taught(plaque_for("toad"))
    newt = _taught(plaque_for("newt"))
    salamander = _taught(plaque_for("salamander"))
    caecilian = _taught(plaque_for("caecilian"))
    crayfish = _taught(plaque_for("crayfish"))
    snail = _taught(plaque_for("pond_snail"))
    mussel = _taught(plaque_for("mussel"))
    leech = _taught(plaque_for("leech"))
    stickleback = _taught(plaque_for("stickleback"))
    assert re.search(r"not a toad", frog, re.I)
    assert re.search(r"Pebble", frog)
    assert re.search(r"not a frog", toad, re.I)
    assert re.search(r"Reed", toad)
    assert re.search(r"not a lizard", newt, re.I)
    assert re.search(r"Sol", newt)
    assert re.search(r"not a lizard", salamander, re.I)
    assert re.search(r"not Eft", salamander, re.I)
    assert re.search(r"not a worm", caecilian, re.I)
    assert re.search(r"Latch", caecilian)
    assert re.search(r"not an insect", crayfish, re.I)
    assert re.search(r"Comb", crayfish)
    assert re.search(r"not an insect", snail, re.I)
    assert re.search(r"Tenant", snail)
    assert re.search(r"not a sea guest", mussel, re.I)
    assert re.search(r"Ochre", mussel)
    assert re.search(r"not a worm", leech, re.I)
    assert re.search(r"Slip", leech)
    assert re.search(r"blood rumor", leech, re.I)
    assert re.search(r"not a goldfish", stickleback, re.I)
    assert re.search(r"Coin", stickleback)


def test_the_important_well_mixups_are_actually_taught():
    paramecium = _taught(plaque_for("paramecium"))
    amoeba = _taught(plaque_for("amoeba"))
    euglena = _taught(plaque_for("euglena"))
    volvox = _taught(plaque_for("volvox"))
    diatom = _taught(plaque_for("diatom"))
    kelp = _taught(plaque_for("kelp"))
    chlamydomonas = _taught(plaque_for("chlamydomonas"))
    stentor = _taught(plaque_for("stentor"))
    coli = _taught(plaque_for("coli"))
    haloarchaea = _taught(plaque_for("haloarchaea"))
    assert re.search(r"not an animal", paramecium, re.I)
    assert re.search(r"Reed", paramecium)
    assert re.search(r"not a blob", amoeba, re.I)
    assert re.search(r"not a plant", euglena, re.I)
    assert re.search(r"Felt", euglena)
    assert re.search(r"not one creature", volvox, re.I)
    assert re.search(r"Pact", volvox)
    assert re.search(r"not Gleam", diatom, re.I)
    assert re.search(r"far den", diatom, re.I)
    assert re.search(r"not Felt", kelp, re.I)
    assert re.search(r"not a garden plant", kelp, re.I)
    assert re.search(r"not a land plant", chlamydomonas, re.I)
    assert re.search(r"Mast", chlamydomonas)
    assert re.search(r"not a worm", stentor, re.I)
    assert re.search(r"Slip", stentor)
    assert re.search(r"Latch", stentor)
    assert re.search(r"not a fungus", coli, re.I)
    assert re.search(r"Starter", coli)
    assert re.search(r"not a bacterium", haloarchaea, re.I)
    assert re.search(r"Brine", haloarchaea)
    assert plaque_for("moon_jelly").name == "Pulse"
    assert plaque_for("moon_jelly").slug == "pulse"
    assert plaque_for("stentor").name == "Bell"


def _slice_entry(src: str, key: str, next_key: str | None) -> str:
    start = src.index(f'"{key}"')
    end = src.index(f'"{next_key}"') if next_key else len(src)
    return src[start:end]


def test_pyqt_guide_copy_matches_the_web_field_notes():
    house_src = (WEB_PETS / "house-guide.ts").read_text(encoding="utf-8")
    snake_src = (WEB_PETS / "snake-guide.ts").read_text(encoding="utf-8")
    sea_src = (WEB_PETS / "sea-guide.ts").read_text(encoding="utf-8")
    garden_src = (WEB_PETS / "garden-guide.ts").read_text(encoding="utf-8")
    insect_src = (WEB_PETS / "insect-guide.ts").read_text(encoding="utf-8")
    bee_src = (WEB_PETS / "bee-guide.ts").read_text(encoding="utf-8")
    fungi_src = (WEB_PETS / "fungi-guide.ts").read_text(encoding="utf-8")
    pond_src = (WEB_PETS / "pond-guide.ts").read_text(encoding="utf-8")
    well_src = (WEB_PETS / "well-guide.ts").read_text(encoding="utf-8")
    house_keys = [key for key, _, _ in HOUSE_EXPECTED]
    snake_keys = [key for key, _, _ in SNAKE_EXPECTED]
    sea_keys = [key for key, _, _ in SEA_EXPECTED]
    garden_keys = [key for key, _, _ in GARDEN_EXPECTED]
    insect_keys = [key for key, _, _ in INSECT_EXPECTED]
    bee_keys = [key for key, _, _ in BEE_EXPECTED]
    fungi_keys = [key for key, _, _ in FUNGI_EXPECTED]
    pond_keys = [key for key, _, _ in POND_EXPECTED]
    well_keys = [key for key, _, _ in WELL_EXPECTED]
    for index, (key, _slug, latin) in enumerate(HOUSE_EXPECTED):
        nxt = house_keys[index + 1] if index + 1 < len(house_keys) else None
        chunk = _slice_entry(house_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(SNAKE_EXPECTED):
        nxt = snake_keys[index + 1] if index + 1 < len(snake_keys) else None
        chunk = _slice_entry(snake_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(SEA_EXPECTED):
        nxt = sea_keys[index + 1] if index + 1 < len(sea_keys) else None
        chunk = _slice_entry(sea_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(GARDEN_EXPECTED):
        nxt = garden_keys[index + 1] if index + 1 < len(garden_keys) else None
        chunk = _slice_entry(garden_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(INSECT_EXPECTED):
        nxt = insect_keys[index + 1] if index + 1 < len(insect_keys) else None
        chunk = _slice_entry(insect_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(BEE_EXPECTED):
        nxt = bee_keys[index + 1] if index + 1 < len(bee_keys) else None
        chunk = _slice_entry(bee_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(FUNGI_EXPECTED):
        nxt = fungi_keys[index + 1] if index + 1 < len(fungi_keys) else None
        chunk = _slice_entry(fungi_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(POND_EXPECTED):
        nxt = pond_keys[index + 1] if index + 1 < len(pond_keys) else None
        chunk = _slice_entry(pond_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(WELL_EXPECTED):
        nxt = well_keys[index + 1] if index + 1 < len(well_keys) else None
        chunk = _slice_entry(well_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk


def test_plaque_widget_teaches_the_selected_species():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.plaque import SpeciesPlaque

    app = QApplication.instance() or QApplication([])
    card = SpeciesPlaque()
    card.set_key("red_panda")
    assert card.guide() is plaque_for("red_panda")
    assert "Ailurus fulgens" in card.latin.text()
    assert "not a bear" in card.mixup.text().lower()
    assert "Red panda" in card.lesson.text()
    card.set_key("milk_snake")
    assert card.guide().key == "milk_snake"
    assert "red against black" in card.mixup.text().lower()
    assert "crawl" in card.classroom.text().lower()
    card.set_key("horseshoe_crab")
    assert card.guide().key == "horseshoe_crab"
    assert "not a crab" in card.mixup.text().lower()
    assert "swim" in card.classroom.text().lower()
    card.set_key("saguaro")
    assert card.guide().key == "saguaro"
    assert "not a tree" in card.mixup.text().lower()
    assert "grow" in card.classroom.text().lower()
    card.set_key("firefly")
    assert card.guide().key == "firefly"
    assert "not a fly" in card.mixup.text().lower()
    assert "stay" in card.classroom.text().lower()
    card.set_key("lichen")
    assert card.guide().key == "lichen"
    assert "not one creature" in card.mixup.text().lower()
    assert "stay" in card.classroom.text().lower()
    card.set_key("frog")
    assert card.guide().key == "frog"
    assert "not a toad" in card.mixup.text().lower()
    assert "stay" in card.classroom.text().lower()
    card.set_key("paramecium")
    assert card.guide().key == "paramecium"
    assert "not an animal" in card.mixup.text().lower()
    assert "stay" in card.classroom.text().lower()
    del app


def test_desk_window_plaque_follows_rail_and_guest_tap():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    assert window.plaque.guide() is plaque_for("red_panda")
    window._pick_key("axolotl")
    assert window.species.key == "axolotl"
    assert window.plaque.guide().key == "axolotl"
    assert "gills" in window.plaque.tell.text().lower()
    window._tap_guest()
    assert "salamander" in window.bubble.toPlainText().lower()
    window._pick_key("kingsnake")
    assert window.plaque.guide().latin == "Lampropeltis californiae"
    assert "no red" in window.plaque.mixup.text().lower()
    window.close()
    del app
