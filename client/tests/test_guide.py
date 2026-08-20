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
    roost_guide_complete,
    roost_guide_keys,
    CORNER_GUIDE,
    corner_guide_complete,
    corner_guide_keys,
    CREEK_GUIDE,
    creek_guide_complete,
    creek_guide_keys,
    LOG_GUIDE,
    log_guide_complete,
    log_guide_keys,
    SHORE_GUIDE,
    shore_guide_complete,
    shore_guide_keys,
    MEADOW_GUIDE,
    meadow_guide_complete,
    meadow_guide_keys,
    canopy_guide_complete,
    canopy_guide_keys,
    reef_guide_complete,
    reef_guide_keys,
    STONE_GUIDE,
    stone_guide_complete,
    stone_guide_keys,
    WOOD_GUIDE,
    wood_guide_complete,
    wood_guide_keys,
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
from computerpets_client.species import BEE_KEYS, CANOPY_KEYS, CATALOG_KEYS, CORNER_KEYS, CREEK_KEYS, FAR_KEYS, FUNGI_KEYS, GARDEN_KEYS, HOUSE_KEYS, INSECT_KEYS, LOG_KEYS, MEADOW_KEYS, POND_KEYS, REEF_KEYS, ROOST_KEYS, SEA_KEYS, SHORE_KEYS, SNAKE_KEYS, STONE_KEYS, WELL_KEYS, WOOD_KEYS, SPECIES

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
    ("garter", "sash", "Thamnophis sirtalis"),
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
    ("water_lily", "disk", "Nymphaea odorata"),
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

ROOST_EXPECTED = [
    ("crow", "soot", "Corvus brachyrhynchos"),
    ("raven", "wedge", "Corvus corax"),
    ("barn_owl", "heart", "Tyto alba"),
    ("red_tail", "hook", "Buteo jamaicensis"),
    ("chickadee", "dee", "Poecile atricapillus"),
    ("robin", "brick", "Turdus migratorius"),
    ("mallard", "drake", "Anas platyrhynchos"),
    ("canada_goose", "vee", "Branta canadensis"),
    ("pileated", "drum", "Dryocopus pileatus"),
    ("hummingbird", "sip", "Archilochus colubris"),
]

CORNER_EXPECTED = [
    ("orb_weaver", "loom", "Araneus diadematus"),
    ("jumping_spider", "leap", "Phidippus audax"),
    ("wolf_spider", "prowl", "Tigrosa helluo"),
    ("tarantula", "velvet", "Aphonopelma chalcodes"),
    ("widow", "hour", "Latrodectus mactans"),
    ("harvestman", "stem", "Phalangium opilio"),
    ("scorpion", "barb", "Centruroides vittatus"),
    ("vinegaroon", "whip", "Mastigoproctus giganteus"),
    ("tick", "clasp", "Ixodes scapularis"),
    ("solifuge", "gale", "Eremobates"),
]

WOOD_EXPECTED = [
    ("deer", "rack", "Odocoileus virginianus"),
    ("bat", "cape", "Eptesicus fuscus"),
    ("squirrel", "cache", "Sciurus carolinensis"),
    ("otter", "slick", "Lontra canadensis"),
    ("raccoon", "wash", "Procyon lotor"),
    ("skunk", "stripe", "Mephitis mephitis"),
    ("opossum", "grin", "Didelphis virginiana"),
    ("beaver", "dam", "Castor canadensis"),
    ("porcupine", "spine", "Erethizon dorsatum"),
    ("black_bear", "coal", "Ursus americanus"),
]

STONE_EXPECTED = [
    ("gecko", "pad", "Hemidactylus turcicus"),
    ("anole", "wink", "Anolis carolinensis"),
    ("skink", "dash", "Plestiodon fasciatus"),
    ("chameleon", "shift", "Chamaeleo calyptratus"),
    ("horned_lizard", "spike", "Phrynosoma cornutum"),
    ("alligator", "levee", "Alligator mississippiensis"),
    ("crocodile", "jaw", "Crocodylus acutus"),
    ("snapper", "beak", "Chelydra serpentina"),
    ("box_turtle", "lid", "Terrapene carolina"),
    ("tuatara", "peak", "Sphenodon punctatus"),
]

CREEK_EXPECTED = [
    ("bass", "lunge", "Micropterus salmoides"),
    ("brook_trout", "speck", "Salvelinus fontinalis"),
    ("catfish", "whisk", "Ictalurus punctatus"),
    ("bluegill", "penny", "Lepomis macrochirus"),
    ("perch", "bar", "Perca flavescens"),
    ("pike", "lance", "Esox lucius"),
    ("walleye", "night", "Sander vitreus"),
    ("paddlefish", "spoon", "Polyodon spathula"),
    ("lamprey", "round", "Petromyzon marinus"),
    ("american_eel", "silver", "Anguilla rostrata"),
]

LOG_EXPECTED = [
    ("house_centipede", "haste", "Scutigera coleoptrata"),
    ("millipede", "link", "Narceus americanus"),
    ("pillbug", "armor", "Armadillidium vulgare"),
    ("earthworm", "cast", "Lumbricus terrestris"),
    ("velvet_worm", "jet", "Euperipatoides rowelli"),
    ("springtail", "hop", "Orchesella cincta"),
    ("tardigrade", "tun", "Hypsibius exemplaris"),
    ("planarian", "half", "Girardia tigrina"),
    ("nematode", "thread", "Caenorhabditis elegans"),
    ("amphipod", "scud", "Gammarus minus"),
]

SHORE_EXPECTED = [
    ("fiddler_crab", "wave", "Minuca pugnax"),
    ("ghost_crab", "pale", "Ocypode quadrata"),
    ("limpet", "cone", "Patella vulgata"),
    ("barnacle", "cement", "Semibalanus balanoides"),
    ("chiton", "mail", "Tonicella lineata"),
    ("periwinkle", "spire", "Littorina littorea"),
    ("sand_dollar", "token", "Echinarachnius parma"),
    ("sea_urchin", "thorn", "Strongylocentrotus purpuratus"),
    ("knobbed_whelk", "knurl", "Busycon carica"),
    ("lugworm", "heap", "Arenicola marina"),
]

MEADOW_EXPECTED = [
    ("field_cricket", "chirp", "Gryllus pennsylvanicus"),
    ("katydid", "blade", "Pterophylla camellifolia"),
    ("grasshopper", "vault", "Melanoplus differentialis"),
    ("swallowtail", "banner", "Papilio glaucus"),
    ("jewelwing", "jewel", "Calopteryx maculata"),
    ("lacewing", "lace", "Chrysoperla carnea"),
    ("earwig", "forceps", "Forficula auricularia"),
    ("acorn_weevil", "snout", "Curculio glandium"),
    ("click_beetle", "click", "Alaus oculatus"),
    ("robber_fly", "rob", "Efferia aestuans"),
]

CANOPY_EXPECTED = [
    ("sloth", "hang", "Choloepus didactylus"),
    ("lemur", "sun", "Lemur catta"),
    ("gibbon", "swing", "Hylobates lar"),
    ("kinkajou", "wrist", "Potos flavus"),
    ("colugo", "sail", "Galeopterus variegatus"),
    ("flying_squirrel", "glide", "Glaucomys volans"),
    ("howler", "boom", "Alouatta palliata"),
    ("tarsier", "gaze", "Carlito syrichta"),
    ("potto", "still", "Perodicticus potto"),
    ("koala", "gum", "Phascolarctos cinereus"),
]

REEF_EXPECTED = [
    ("brain_coral", "ridge", "Colpophyllia natans"),
    ("anemone", "wreath", "Heteractis magnifica"),
    ("clownfish", "paint", "Amphiprion ocellaris"),
    ("parrotfish", "scrape", "Sparisoma viride"),
    ("cleaner_shrimp", "scrub", "Lysmata amboinensis"),
    ("sea_cucumber", "tube", "Thelenota ananas"),
    ("lionfish", "veil", "Pterois volitans"),
    ("giant_clam", "gate", "Tridacna gigas"),
    ("eagle_ray", "soar", "Aetobatus narinari"),
    ("grouper", "hide", "Epinephelus striatus"),
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
    assert roost_guide_complete()
    assert corner_guide_complete()
    assert wood_guide_complete()
    assert stone_guide_complete()
    assert creek_guide_complete()
    assert log_guide_complete()
    assert shore_guide_complete()
    assert meadow_guide_complete()
    assert canopy_guide_complete()
    assert reef_guide_complete()
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
    assert roost_guide_keys() == ROOST_KEYS
    assert corner_guide_keys() == CORNER_KEYS
    assert wood_guide_keys() == WOOD_KEYS
    assert stone_guide_keys() == STONE_KEYS
    assert creek_guide_keys() == CREEK_KEYS
    assert log_guide_keys() == LOG_KEYS
    assert shore_guide_keys() == SHORE_KEYS
    assert meadow_guide_keys() == MEADOW_KEYS
    assert canopy_guide_keys() == CANOPY_KEYS
    assert reef_guide_keys() == REEF_KEYS
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
    assert [g.key for g in CORNER_GUIDE] == [key for key, _, _ in CORNER_EXPECTED]
    assert [g.key for g in WOOD_GUIDE] == [key for key, _, _ in WOOD_EXPECTED]
    assert [g.key for g in STONE_GUIDE] == [key for key, _, _ in STONE_EXPECTED]
    assert [g.key for g in CREEK_GUIDE] == [key for key, _, _ in CREEK_EXPECTED]
    assert [g.key for g in LOG_GUIDE] == [key for key, _, _ in LOG_EXPECTED]
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
    for key, slug, latin in ROOST_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in ROOST_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "roost"
        assert classroom_for(key).verb == "stay"
    for key, slug, latin in CORNER_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in CORNER_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "corner"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten in the corner"
    for key, slug, latin in WOOD_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in WOOD_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "wood"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten in the wood"
    for key, slug, latin in STONE_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in STONE_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "stone"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten in the stone"
    for key, slug, latin in CREEK_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in CREEK_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "creek"
        assert classroom_for(key).verb == "swim"
        assert classroom_for(key).label == "All ten in the creek"
    for key, slug, latin in LOG_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in LOG_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "log"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten under the log"
    for key, slug, latin in SHORE_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in SHORE_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "shore"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten on the shore"
    for key, slug, latin in MEADOW_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in MEADOW_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "meadow"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten in the meadow"
    for key, slug, latin in CANOPY_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in CANOPY_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "canopy"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten in the canopy"
    for key, slug, latin in REEF_EXPECTED:
        guide = plaque_for(key)
        assert guide is not None
        assert guide.slug == slug
        assert guide.latin == latin
        assert plaque_by_slug(slug) is guide
    for key in REEF_KEYS:
        assert plaque_for(key) is not None
        assert classroom_for(key).room == "reef"
        assert classroom_for(key).verb == "stay"
        assert classroom_for(key).label == "All ten on the reef"


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


def test_the_important_roost_mixups_are_actually_taught():
    crow = _taught(plaque_for("crow"))
    raven = _taught(plaque_for("raven"))
    owl = _taught(plaque_for("barn_owl"))
    hawk = _taught(plaque_for("red_tail"))
    chickadee = _taught(plaque_for("chickadee"))
    robin = _taught(plaque_for("robin"))
    mallard = _taught(plaque_for("mallard"))
    goose = _taught(plaque_for("canada_goose"))
    pileated = _taught(plaque_for("pileated"))
    hummingbird = _taught(plaque_for("hummingbird"))
    assert re.search(r"not a raven", crow, re.I)
    assert re.search(r"Wedge", crow)
    assert re.search(r"Quill", crow)
    assert re.search(r"not a crow", raven, re.I)
    assert re.search(r"Soot", raven)
    assert re.search(r"not a hawk", owl, re.I)
    assert re.search(r"Hook", owl)
    assert re.search(r"not an owl", hawk, re.I)
    assert re.search(r"Heart", hawk)
    assert re.search(r"Felt", hawk)
    assert re.search(r"sparrow", chickadee, re.I)
    assert re.search(r"European", robin)
    assert re.search(r"not a goose", mallard, re.I)
    assert re.search(r"Vee", mallard)
    assert re.search(r"Coin", mallard)
    assert re.search(r"not a duck", goose, re.I)
    assert re.search(r"Drake", goose)
    assert re.search(r"not a flicker", pileated, re.I)
    assert re.search(r"not a bee", hummingbird, re.I)
    assert re.search(r"Thrum", hummingbird)


def test_the_important_corner_mixups_are_actually_taught():
    orb = _taught(plaque_for("orb_weaver"))
    jumper = _taught(plaque_for("jumping_spider"))
    wolf = _taught(plaque_for("wolf_spider"))
    tarantula = _taught(plaque_for("tarantula"))
    widow = _taught(plaque_for("widow"))
    harvestman = _taught(plaque_for("harvestman"))
    scorpion = _taught(plaque_for("scorpion"))
    vinegaroon = _taught(plaque_for("vinegaroon"))
    tick = _taught(plaque_for("tick"))
    solifuge = _taught(plaque_for("solifuge"))
    assert re.search(r"not an insect", orb, re.I)
    assert re.search(r"Stem", orb)
    assert re.search(r"web is a trap", orb, re.I)
    assert re.search(r"not a wolf spider", jumper, re.I)
    assert re.search(r"Prowl", jumper)
    assert re.search(r"not Leap", wolf, re.I)
    assert re.search(r"No snare", wolf)
    assert re.search(r"not a wolf spider", tarantula, re.I)
    assert re.search(r"Urticating hair", tarantula)
    assert re.search(r"not every dark spider", widow, re.I)
    assert re.search(r"hourglass", widow, re.I)
    assert re.search(r"not a spider", harvestman, re.I)
    assert re.search(r"Not Loom", harvestman)
    assert re.search(r"Two eyes", harvestman)
    assert re.search(r"not a spider", scorpion, re.I)
    assert re.search(r"Not Whip", scorpion)
    assert re.search(r"not a scorpion", vinegaroon, re.I)
    assert re.search(r"Not Barb", vinegaroon)
    assert re.search(r"no sting", vinegaroon, re.I)
    assert re.search(r"not an insect", tick, re.I)
    assert re.search(r"Comb", tick)
    assert re.search(r"mite", tick, re.I)
    assert re.search(r"not a spider", solifuge, re.I)
    assert re.search(r"not a scorpion", solifuge, re.I)
    assert re.search(r"camel spider is not a spider", solifuge, re.I)


def test_the_important_wood_mixups_are_actually_taught():
    deer = _taught(plaque_for("deer"))
    bat = _taught(plaque_for("bat"))
    squirrel = _taught(plaque_for("squirrel"))
    otter = _taught(plaque_for("otter"))
    raccoon = _taught(plaque_for("raccoon"))
    skunk = _taught(plaque_for("skunk"))
    opossum = _taught(plaque_for("opossum"))
    beaver = _taught(plaque_for("beaver"))
    porcupine = _taught(plaque_for("porcupine"))
    bear = _taught(plaque_for("black_bear"))
    assert re.search(r"not a moose", deer, re.I)
    assert re.search(r"flag", deer, re.I)
    assert re.search(r"not a bird", bat, re.I)
    assert re.search(r"Sip", bat)
    assert re.search(r"Peck", bat)
    assert re.search(r"not a chipmunk", squirrel, re.I)
    assert re.search(r"not Slip", otter, re.I)
    assert re.search(r"weasel", otter, re.I)
    assert re.search(r"Bandit", raccoon)
    assert re.search(r"Rui", raccoon)
    assert re.search(r"polecat", skunk, re.I)
    assert re.search(r"Wick", skunk)
    assert re.search(r"marsupial", opossum, re.I)
    assert re.search(r"not a cat", opossum, re.I)
    assert re.search(r"Vesper", opossum)
    assert re.search(r"muskrat", beaver, re.I)
    assert re.search(r"does not throw", porcupine, re.I)
    assert re.search(r"Burr", porcupine)
    assert re.search(r"Quill", porcupine)
    assert re.search(r"red panda", bear, re.I)
    assert re.search(r"Rui", bear)
    assert re.search(r"She is a bear", bear)


def test_the_important_stone_mixups_are_actually_taught():
    gecko = _taught(plaque_for("gecko"))
    anole = _taught(plaque_for("anole"))
    skink = _taught(plaque_for("skink"))
    chameleon = _taught(plaque_for("chameleon"))
    horned = _taught(plaque_for("horned_lizard"))
    alligator = _taught(plaque_for("alligator"))
    crocodile = _taught(plaque_for("crocodile"))
    snapper = _taught(plaque_for("snapper"))
    box = _taught(plaque_for("box_turtle"))
    tuatara = _taught(plaque_for("tuatara"))
    assert re.search(r"not a salamander", gecko, re.I)
    assert re.search(r"Dapple", gecko)
    assert re.search(r"pad", gecko, re.I)
    assert re.search(r"not a chameleon", anole, re.I)
    assert re.search(r"Shift", anole)
    assert re.search(r"dewlap", anole, re.I)
    assert re.search(r"not a snake", skink, re.I)
    assert re.search(r"Sash", skink)
    assert re.search(r"not Wink", chameleon, re.I)
    assert re.search(r"not Sol", chameleon, re.I)
    assert re.search(r"not a toad", horned, re.I)
    assert re.search(r"Pebble", horned)
    assert re.search(r"Horn", horned)
    assert re.search(r"not a crocodile", alligator, re.I)
    assert re.search(r"Jaw", alligator)
    assert re.search(r"not an alligator", crocodile, re.I)
    assert re.search(r"Levee", crocodile)
    assert re.search(r"not Ink", snapper, re.I)
    assert re.search(r"not a tortoise", snapper, re.I)
    assert re.search(r"not Ink", box, re.I)
    assert re.search(r"not Hinge", box, re.I)
    assert re.search(r"not a lizard", tuatara, re.I)
    assert re.search(r"not Sol", tuatara, re.I)
    assert re.search(r"own order", tuatara, re.I)


def test_the_important_creek_mixups_are_actually_taught():
    bass = _taught(plaque_for("bass"))
    trout = _taught(plaque_for("brook_trout"))
    catfish = _taught(plaque_for("catfish"))
    bluegill = _taught(plaque_for("bluegill"))
    perch = _taught(plaque_for("perch"))
    pike = _taught(plaque_for("pike"))
    walleye = _taught(plaque_for("walleye"))
    paddlefish = _taught(plaque_for("paddlefish"))
    lamprey = _taught(plaque_for("lamprey"))
    eel = _taught(plaque_for("american_eel"))
    assert re.search(r"not a trout", bass, re.I)
    assert re.search(r"Speck", bass)
    assert re.search(r"not a bass", trout, re.I)
    assert re.search(r"Lunge", trout)
    assert re.search(r"char", trout, re.I)
    assert re.search(r"rainbow", trout, re.I)
    assert re.search(r"not a shark", catfish, re.I)
    assert re.search(r"Spoon", catfish)
    assert re.search(r"not Coin", bluegill, re.I)
    assert re.search(r"sunfish", bluegill, re.I)
    assert re.search(r"not a walleye", perch, re.I)
    assert re.search(r"Night", perch)
    assert re.search(r"not a muskellunge", pike, re.I)
    assert re.search(r"not a perch", walleye, re.I)
    assert re.search(r"Bar", walleye)
    assert re.search(r"tapetum", walleye, re.I)
    assert re.search(r"not a shark", paddlefish, re.I)
    assert re.search(r"not Whisk", paddlefish, re.I)
    assert re.search(r"filter", paddlefish, re.I)
    assert re.search(r"not an eel", lamprey, re.I)
    assert re.search(r"Silver", lamprey)
    assert re.search(r"not a ribbon", lamprey, re.I)
    assert re.search(r"disk", lamprey, re.I)
    assert re.search(r"not a lamprey", eel, re.I)
    assert re.search(r"Round", eel)
    assert re.search(r"Sargasso", eel)
    assert re.search(r"not a moray", eel, re.I)


def test_the_important_log_mixups_are_actually_taught():
    haste = _taught(plaque_for("house_centipede"))
    millipede = _taught(plaque_for("millipede"))
    pillbug = _taught(plaque_for("pillbug"))
    earthworm = _taught(plaque_for("earthworm"))
    velvet = _taught(plaque_for("velvet_worm"))
    springtail = _taught(plaque_for("springtail"))
    tardigrade = _taught(plaque_for("tardigrade"))
    planarian = _taught(plaque_for("planarian"))
    nematode = _taught(plaque_for("nematode"))
    amphipod = _taught(plaque_for("amphipod"))
    assert re.search(r"not a millipede", haste, re.I)
    assert re.search(r"Link", haste)
    assert re.search(r"not an insect", haste, re.I)
    assert re.search(r"fifteen pairs", haste, re.I)
    assert re.search(r"not a centipede", millipede, re.I)
    assert re.search(r"Haste", millipede)
    assert re.search(r"oil", millipede, re.I)
    assert re.search(r"not an insect", pillbug, re.I)
    assert re.search(r"Comb", pillbug)
    assert re.search(r"not Pinch", pillbug, re.I)
    assert re.search(r"crustacean", pillbug, re.I)
    assert re.search(r"not a snake", earthworm, re.I)
    assert re.search(r"Sash", earthworm)
    assert re.search(r"not Slip", earthworm, re.I)
    assert re.search(r"not Latch", earthworm, re.I)
    assert re.search(r"not a millipede", velvet, re.I)
    assert re.search(r"not Link", velvet, re.I)
    assert re.search(r"onychophoran", velvet, re.I)
    assert re.search(r"not Dew", velvet, re.I)
    assert re.search(r"not an insect", springtail, re.I)
    assert re.search(r"not a flea", springtail, re.I)
    assert re.search(r"not Comb", springtail, re.I)
    assert re.search(r"furcula", springtail, re.I)
    assert re.search(r"not a bear", tardigrade, re.I)
    assert re.search(r"not Coal", tardigrade, re.I)
    assert re.search(r"tun", tardigrade, re.I)
    assert re.search(r"not a leech", planarian, re.I)
    assert re.search(r"Latch", planarian)
    assert re.search(r"split", planarian, re.I)
    assert re.search(r"not Cast", nematode, re.I)
    assert re.search(r"not an earthworm", nematode, re.I)
    assert re.search(r"not Pinch", amphipod, re.I)
    assert re.search(r"not a pillbug", amphipod, re.I)
    assert re.search(r"side", amphipod, re.I)


def test_the_important_shore_mixups_are_actually_taught():
    fiddler = _taught(plaque_for("fiddler_crab"))
    ghost = _taught(plaque_for("ghost_crab"))
    limpet = _taught(plaque_for("limpet"))
    barnacle = _taught(plaque_for("barnacle"))
    chiton = _taught(plaque_for("chiton"))
    periwinkle = _taught(plaque_for("periwinkle"))
    sand_dollar = _taught(plaque_for("sand_dollar"))
    urchin = _taught(plaque_for("sea_urchin"))
    whelk = _taught(plaque_for("knobbed_whelk"))
    lugworm = _taught(plaque_for("lugworm"))
    assert re.search(r"not a hermit", fiddler, re.I)
    assert re.search(r"Tenant", fiddler)
    assert re.search(r"not Pinch", fiddler, re.I)
    assert re.search(r"signal", fiddler, re.I)
    assert re.search(r"not Tenant", ghost, re.I)
    assert re.search(r"not Ledger", ghost, re.I)
    assert re.search(r"not Ghost", ghost, re.I)
    assert re.search(r"not a horseshoe crab", ghost, re.I)
    assert re.search(r"not Lid", limpet, re.I)
    assert re.search(r"not Cement", limpet, re.I)
    assert re.search(r"clamp", limpet, re.I)
    assert re.search(r"not a limpet", barnacle, re.I)
    assert re.search(r"not a crab", barnacle, re.I)
    assert re.search(r"Cone", barnacle)
    assert re.search(r"not a limpet", chiton, re.I)
    assert re.search(r"not Armor", chiton, re.I)
    assert re.search(r"eight", chiton, re.I)
    assert re.search(r"not Chamber", periwinkle, re.I)
    assert re.search(r"not Whorl", periwinkle, re.I)
    assert re.search(r"not Knurl", periwinkle, re.I)
    assert re.search(r"not Coin", sand_dollar, re.I)
    assert re.search(r"not Disk", sand_dollar, re.I)
    assert re.search(r"not Ochre", sand_dollar, re.I)
    assert re.search(r"not Burr", urchin, re.I)
    assert re.search(r"not Spine", urchin, re.I)
    assert re.search(r"not Token", urchin, re.I)
    assert re.search(r"not Spire", whelk, re.I)
    assert re.search(r"not Horn", whelk, re.I)
    assert re.search(r"knob", whelk, re.I)
    assert re.search(r"not Cast", lugworm, re.I)
    assert re.search(r"not Latch", lugworm, re.I)
    assert re.search(r"not an earthworm", lugworm, re.I)


def test_the_important_meadow_mixups_are_actually_taught():
    cricket = _taught(plaque_for("field_cricket"))
    katydid = _taught(plaque_for("katydid"))
    grasshopper = _taught(plaque_for("grasshopper"))
    swallowtail = _taught(plaque_for("swallowtail"))
    jewelwing = _taught(plaque_for("jewelwing"))
    lacewing = _taught(plaque_for("lacewing"))
    earwig = _taught(plaque_for("earwig"))
    weevil = _taught(plaque_for("acorn_weevil"))
    click = _taught(plaque_for("click_beetle"))
    robber = _taught(plaque_for("robber_fly"))
    assert re.search(r"not a cicada", cricket, re.I)
    assert re.search(r"Brood", cricket)
    assert re.search(r"song", cricket, re.I)
    assert re.search(r"not a grasshopper", katydid, re.I)
    assert re.search(r"not Vault", katydid, re.I)
    assert re.search(r"wings are leaves", katydid, re.I)
    assert re.search(r"not Leap", grasshopper, re.I)
    assert re.search(r"not Hop", grasshopper, re.I)
    assert re.search(r"not Blade", grasshopper, re.I)
    assert re.search(r"not Milk", swallowtail, re.I)
    assert re.search(r"not Ghost", swallowtail, re.I)
    assert re.search(r"not a monarch", swallowtail, re.I)
    assert re.search(r"not Dart", jewelwing, re.I)
    assert re.search(r"not a darner", jewelwing, re.I)
    assert re.search(r"damselfly", jewelwing, re.I)
    assert re.search(r"not a moth", lacewing, re.I)
    assert re.search(r"not Ghost", lacewing, re.I)
    assert re.search(r"lion", lacewing, re.I)
    assert re.search(r"not Fold", earwig, re.I)
    assert re.search(r"cerci", earwig, re.I)
    assert re.search(r"not a sting", earwig, re.I)
    assert re.search(r"not Auger", weevil, re.I)
    assert re.search(r"not Mast", weevil, re.I)
    assert re.search(r"not a bee", weevil, re.I)
    assert re.search(r"not Snap", click, re.I)
    assert re.search(r"not Spark", click, re.I)
    assert re.search(r"not a firefly", click, re.I)
    assert re.search(r"not a bee", robber, re.I)
    assert re.search(r"not Thrum", robber, re.I)
    assert re.search(r"not Sip", robber, re.I)


def test_the_important_canopy_mixups_are_actually_taught():
    sloth = _taught(plaque_for("sloth"))
    lemur = _taught(plaque_for("lemur"))
    gibbon = _taught(plaque_for("gibbon"))
    kinkajou = _taught(plaque_for("kinkajou"))
    colugo = _taught(plaque_for("colugo"))
    flyer = _taught(plaque_for("flying_squirrel"))
    howler = _taught(plaque_for("howler"))
    tarsier = _taught(plaque_for("tarsier"))
    potto = _taught(plaque_for("potto"))
    koala = _taught(plaque_for("koala"))
    assert re.search(r"not lazy", sloth, re.I)
    assert re.search(r"not Rui", sloth, re.I)
    assert re.search(r"not a red panda", sloth, re.I)
    assert re.search(r"not Stripe", lemur, re.I)
    assert re.search(r"not Ring", lemur, re.I)
    assert re.search(r"not a raccoon", lemur, re.I)
    assert re.search(r"not a monkey", gibbon, re.I)
    assert re.search(r"not Quill", gibbon, re.I)
    assert re.search(r"not Sip", kinkajou, re.I)
    assert re.search(r"not Comb", kinkajou, re.I)
    assert re.search(r"not Rue", kinkajou, re.I)
    assert re.search(r"not a ferret", kinkajou, re.I)
    assert re.search(r"not a lemur", colugo, re.I)
    assert re.search(r"not Glide", colugo, re.I)
    assert re.search(r"not Cape", colugo, re.I)
    assert re.search(r"not a bird", flyer, re.I)
    assert re.search(r"not Kite", flyer, re.I)
    assert re.search(r"not a wing", flyer, re.I)
    assert re.search(r"not Vee", howler, re.I)
    assert re.search(r"not Swing", howler, re.I)
    assert re.search(r"not a gibbon", howler, re.I)
    assert re.search(r"not Heart", tarsier, re.I)
    assert re.search(r"not an owl", tarsier, re.I)
    assert re.search(r"not a loris", potto, re.I)
    assert re.search(r"not Twig", potto, re.I)
    assert re.search(r"not Fold", potto, re.I)
    assert re.search(r"not Hang", potto, re.I)
    assert re.search(r"not a sloth", potto, re.I)
    assert re.search(r"not a bear", koala, re.I)
    assert re.search(r"not Coal", koala, re.I)
    assert re.search(r"not Burr", koala, re.I)
    assert re.search(r"marsupial", koala, re.I)


def test_the_important_reef_mixups_are_actually_taught():
    ridge = _taught(plaque_for("brain_coral"))
    wreath = _taught(plaque_for("anemone"))
    paint = _taught(plaque_for("clownfish"))
    scrape = _taught(plaque_for("parrotfish"))
    scrub = _taught(plaque_for("cleaner_shrimp"))
    tube = _taught(plaque_for("sea_cucumber"))
    veil = _taught(plaque_for("lionfish"))
    gate = _taught(plaque_for("giant_clam"))
    soar = _taught(plaque_for("eagle_ray"))
    hide = _taught(plaque_for("grouper"))
    assert re.search(r"not a plant", ridge, re.I)
    assert re.search(r"not Fan", ridge, re.I)
    assert re.search(r"not Bloom", ridge, re.I)
    assert re.search(r"not Hold", ridge, re.I)
    assert re.search(r"not Coral", ridge, re.I)
    assert re.search(r"not a jelly", wreath, re.I)
    assert re.search(r"not Pulse", wreath, re.I)
    assert re.search(r"not Snap", wreath, re.I)
    assert re.search(r"not a goldfish", paint, re.I)
    assert re.search(r"not Stripe", paint, re.I)
    assert re.search(r"not Coin", paint, re.I)
    assert re.search(r"not a parrot", scrape, re.I)
    assert re.search(r"not Quill", scrape, re.I)
    assert re.search(r"not Beak", scrape, re.I)
    assert re.search(r"not a hermit", scrub, re.I)
    assert re.search(r"not Tenant", scrub, re.I)
    assert re.search(r"not Pinch", scrub, re.I)
    assert re.search(r"not a lugworm", tube, re.I)
    assert re.search(r"not Heap", tube, re.I)
    assert re.search(r"not Cast", tube, re.I)
    assert re.search(r"not Mane", veil, re.I)
    assert re.search(r"not Fan", veil, re.I)
    assert re.search(r"not Spine", veil, re.I)
    assert re.search(r"not Spike", veil, re.I)
    assert re.search(r"not a nautilus", gate, re.I)
    assert re.search(r"not Chamber", gate, re.I)
    assert re.search(r"not Cone", gate, re.I)
    assert re.search(r"not a manta", soar, re.I)
    assert re.search(r"not Kite", soar, re.I)
    assert re.search(r"not a bird", soar, re.I)
    assert re.search(r"not a moray", hide, re.I)
    assert re.search(r"not Door", hide, re.I)
    assert re.search(r"not Lance", hide, re.I)


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
    roost_src = (WEB_PETS / "roost-guide.ts").read_text(encoding="utf-8")
    corner_src = (WEB_PETS / "corner-guide.ts").read_text(encoding="utf-8")
    wood_src = (WEB_PETS / "wood-guide.ts").read_text(encoding="utf-8")
    stone_src = (WEB_PETS / "stone-guide.ts").read_text(encoding="utf-8")
    creek_src = (WEB_PETS / "creek-guide.ts").read_text(encoding="utf-8")
    log_src = (WEB_PETS / "log-guide.ts").read_text(encoding="utf-8")
    shore_src = (WEB_PETS / "shore-guide.ts").read_text(encoding="utf-8")
    meadow_src = (WEB_PETS / "meadow-guide.ts").read_text(encoding="utf-8")
    canopy_src = (WEB_PETS / "canopy-guide.ts").read_text(encoding="utf-8")
    reef_src = (WEB_PETS / "reef-guide.ts").read_text(encoding="utf-8")
    house_keys = [key for key, _, _ in HOUSE_EXPECTED]
    snake_keys = [key for key, _, _ in SNAKE_EXPECTED]
    sea_keys = [key for key, _, _ in SEA_EXPECTED]
    garden_keys = [key for key, _, _ in GARDEN_EXPECTED]
    insect_keys = [key for key, _, _ in INSECT_EXPECTED]
    bee_keys = [key for key, _, _ in BEE_EXPECTED]
    fungi_keys = [key for key, _, _ in FUNGI_EXPECTED]
    pond_keys = [key for key, _, _ in POND_EXPECTED]
    well_keys = [key for key, _, _ in WELL_EXPECTED]
    roost_keys = [key for key, _, _ in ROOST_EXPECTED]
    corner_keys = [key for key, _, _ in CORNER_EXPECTED]
    wood_keys = [key for key, _, _ in WOOD_EXPECTED]
    stone_keys = [key for key, _, _ in STONE_EXPECTED]
    creek_keys = [key for key, _, _ in CREEK_EXPECTED]
    log_keys = [key for key, _, _ in LOG_EXPECTED]
    shore_keys = [key for key, _, _ in SHORE_EXPECTED]
    meadow_keys = [key for key, _, _ in MEADOW_EXPECTED]
    canopy_keys = [key for key, _, _ in CANOPY_EXPECTED]
    reef_keys = [key for key, _, _ in REEF_EXPECTED]
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
    for index, (key, _slug, latin) in enumerate(ROOST_EXPECTED):
        nxt = roost_keys[index + 1] if index + 1 < len(roost_keys) else None
        chunk = _slice_entry(roost_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(CORNER_EXPECTED):
        nxt = corner_keys[index + 1] if index + 1 < len(corner_keys) else None
        chunk = _slice_entry(corner_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(WOOD_EXPECTED):
        nxt = wood_keys[index + 1] if index + 1 < len(wood_keys) else None
        chunk = _slice_entry(wood_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(STONE_EXPECTED):
        nxt = stone_keys[index + 1] if index + 1 < len(stone_keys) else None
        chunk = _slice_entry(stone_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(CREEK_EXPECTED):
        nxt = creek_keys[index + 1] if index + 1 < len(creek_keys) else None
        chunk = _slice_entry(creek_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(LOG_EXPECTED):
        nxt = log_keys[index + 1] if index + 1 < len(log_keys) else None
        chunk = _slice_entry(log_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(SHORE_EXPECTED):
        nxt = shore_keys[index + 1] if index + 1 < len(shore_keys) else None
        chunk = _slice_entry(shore_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(MEADOW_EXPECTED):
        nxt = meadow_keys[index + 1] if index + 1 < len(meadow_keys) else None
        chunk = _slice_entry(meadow_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(CANOPY_EXPECTED):
        nxt = canopy_keys[index + 1] if index + 1 < len(canopy_keys) else None
        chunk = _slice_entry(canopy_src, key, nxt)
        guide = plaque_for(key)
        assert latin in chunk
        assert guide.tell in chunk
        assert guide.mixup in chunk
        assert guide.lesson in chunk
    for index, (key, _slug, latin) in enumerate(REEF_EXPECTED):
        nxt = reef_keys[index + 1] if index + 1 < len(reef_keys) else None
        chunk = _slice_entry(reef_src, key, nxt)
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
    card.set_key("deer")
    assert card.guide().key == "deer"
    assert "not a moose" in card.mixup.text().lower()
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
