package com.enterprisepet.pet;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Catalog of pet kinds the backend will issue licenses for.
 * The {@code key} is the wire-format string used by clients and stored in licenses.
 */
public enum PetType {
    RED_PANDA ("red_panda",  "Red Panda",   Rarity.COMMON),
    CAT       ("cat",        "Cat",         Rarity.COMMON),
    DOG       ("dog",        "Dog",         Rarity.COMMON),
    RABBIT    ("rabbit",     "Rabbit",      Rarity.COMMON),
    HAMSTER   ("hamster",    "Hamster",     Rarity.COMMON),
    GUINEA_PIG("guinea_pig", "Guinea Pig",  Rarity.COMMON),
    TURTLE    ("turtle",     "Turtle",      Rarity.COMMON),
    GOLDFISH  ("goldfish",   "Goldfish",    Rarity.COMMON),
    BUDGIE    ("budgie",     "Budgie",      Rarity.COMMON),
    FOX       ("fox",        "Fox",         Rarity.UNCOMMON),
    PENGUIN   ("penguin",    "Penguin",     Rarity.UNCOMMON),
    PARROT    ("parrot",     "Parrot",      Rarity.UNCOMMON),
    FERRET    ("ferret",     "Ferret",      Rarity.UNCOMMON),
    HEDGEHOG  ("hedgehog",   "Hedgehog",    Rarity.UNCOMMON),
    CHINCHILLA("chinchilla", "Chinchilla",  Rarity.UNCOMMON),
    AXOLOTL   ("axolotl",    "Axolotl",     Rarity.RARE),
    TOUCAN    ("toucan",     "Toucan",      Rarity.RARE),
    IGUANA    ("iguana",     "Iguana",      Rarity.RARE),
    DRAGON    ("dragon",     "Dragon",      Rarity.LEGENDARY),
    PHOENIX   ("phoenix",    "Phoenix",     Rarity.LEGENDARY),
    BALL_PYTHON      ("ball_python",       "Ball Python",          Rarity.COMMON),
    CORN_SNAKE       ("corn_snake",        "Corn Snake",           Rarity.COMMON),
    KINGSNAKE        ("kingsnake",         "California Kingsnake", Rarity.UNCOMMON),
    GREEN_TREE_PYTHON("green_tree_python", "Green Tree Python",    Rarity.RARE),
    HOGNOSE          ("hognose",           "Western Hognose",      Rarity.UNCOMMON),
    GARTER           ("garter",            "Common Garter",        Rarity.COMMON),
    BOA              ("boa",               "Boa Constrictor",      Rarity.RARE),
    MILK_SNAKE       ("milk_snake",        "Pueblo Milk Snake",    Rarity.UNCOMMON),
    ROSY_BOA         ("rosy_boa",          "Rosy Boa",             Rarity.UNCOMMON),
    CARPET_PYTHON    ("carpet_python",     "Jungle Carpet Python", Rarity.RARE),
    OCTOPUS          ("octopus",           "Common Octopus",       Rarity.UNCOMMON),
    CUTTLEFISH       ("cuttlefish",        "Common Cuttlefish",    Rarity.UNCOMMON),
    NAUTILUS         ("nautilus",          "Chambered Nautilus",   Rarity.RARE),
    MOON_JELLY       ("moon_jelly",        "Moon Jelly",           Rarity.COMMON),
    SEA_STAR         ("sea_star",          "Ochre Sea Star",       Rarity.COMMON),
    HERMIT_CRAB      ("hermit_crab",       "Common Hermit",        Rarity.COMMON),
    HORSESHOE_CRAB   ("horseshoe_crab",    "Atlantic Horseshoe Crab", Rarity.UNCOMMON),
    SEAHORSE         ("seahorse",          "Lined Seahorse",       Rarity.UNCOMMON),
    MANTA            ("manta",             "Reef Manta",           Rarity.RARE),
    MORAY            ("moray",             "Green Moray",          Rarity.RARE),
    MOSS             ("moss",              "Sheet Moss",           Rarity.COMMON),
    MAIDENHAIR       ("maidenhair",        "Maidenhair Fern",      Rarity.UNCOMMON),
    GINKGO           ("ginkgo",            "Ginkgo",               Rarity.RARE),
    OAK              ("oak",               "White Oak",            Rarity.COMMON),
    WATER_LILY       ("water_lily",        "Fragrant Water Lily",  Rarity.UNCOMMON),
    ORCHID           ("orchid",            "Moth Orchid",          Rarity.RARE),
    SAGUARO          ("saguaro",           "Saguaro",              Rarity.RARE),
    VENUS_FLYTRAP    ("venus_flytrap",     "Venus Flytrap",        Rarity.UNCOMMON),
    PITCHER          ("pitcher",           "Purple Pitcher Plant", Rarity.UNCOMMON),
    SUNDEW           ("sundew",            "Round-leaved Sundew",  Rarity.UNCOMMON),
    HONEYBEE         ("honeybee",          "Western Honey Bee",    Rarity.COMMON),
    MONARCH          ("monarch",           "Monarch",              Rarity.UNCOMMON),
    LUNA             ("luna",              "Luna Moth",            Rarity.RARE),
    FIREFLY          ("firefly",           "Common Eastern Firefly", Rarity.UNCOMMON),
    DARNER           ("darner",            "Common Green Darner",  Rarity.UNCOMMON),
    STICK            ("stick",             "Common Walkingstick",  Rarity.COMMON),
    CARPENTER_ANT    ("carpenter_ant",     "Black Carpenter Ant",  Rarity.COMMON),
    LADYBIRD         ("ladybird",          "Seven-spot Ladybird",  Rarity.COMMON),
    MANTIS           ("mantis",            "Chinese Mantis",       Rarity.UNCOMMON),
    CICADA           ("cicada",            "Periodical Cicada",    Rarity.RARE),
    BUMBLEBEE        ("bumblebee",         "Common Eastern Bumble Bee", Rarity.COMMON),
    CARPENTER_BEE    ("carpenter_bee",     "Eastern Carpenter Bee", Rarity.UNCOMMON),
    MASON_BEE        ("mason_bee",         "Blue Orchard Mason Bee", Rarity.COMMON),
    LEAFCUTTER       ("leafcutter",        "Alfalfa Leafcutter Bee", Rarity.COMMON),
    STINGLESS        ("stingless",         "Maya Stingless Bee",   Rarity.UNCOMMON),
    SWEAT_BEE        ("sweat_bee",         "Bicolored Sweat Bee",  Rarity.COMMON),
    MINING_BEE       ("mining_bee",        "Neighborly Mining Bee", Rarity.COMMON),
    HONEY_DRONE      ("honey_drone",       "Western Honey Bee (drone)", Rarity.UNCOMMON),
    HONEY_QUEEN      ("honey_queen",       "Western Honey Bee (queen)", Rarity.RARE),
    HONEYCOMB        ("honeycomb",         "Honeycomb",            Rarity.UNCOMMON),
    OYSTER           ("oyster",            "Oyster Mushroom",      Rarity.COMMON),
    FLY_AGARIC       ("fly_agaric",        "Fly Agaric",           Rarity.UNCOMMON),
    MOREL            ("morel",             "American Morel",       Rarity.RARE),
    CHANTERELLE      ("chanterelle",       "Golden Chanterelle",   Rarity.UNCOMMON),
    TURKEY_TAIL      ("turkey_tail",       "Turkey Tail",          Rarity.COMMON),
    LIONS_MANE       ("lions_mane",        "Lion's Mane",          Rarity.UNCOMMON),
    PUFFBALL         ("puffball",          "Common Puffball",      Rarity.COMMON),
    CHICKEN_OF_WOODS ("chicken_of_woods",  "Chicken of the Woods", Rarity.UNCOMMON),
    YEAST            ("yeast",             "Baker's Yeast",        Rarity.COMMON),
    LICHEN           ("lichen",            "Reindeer Lichen",      Rarity.RARE),
    PHOTOVORE        ("photovore",         "Lamp-drinker",         Rarity.COMMON),
    CHOIR            ("choir",             "Chord Body",           Rarity.UNCOMMON),
    NIMBUS           ("nimbus",            "Methane Floater",      Rarity.COMMON),
    SILICA           ("silica",            "Living Crystal",       Rarity.UNCOMMON),
    TERMINATOR       ("terminator",        "Twilight Walker",      Rarity.RARE),
    NEXUS            ("nexus",             "Walking Colony",       Rarity.RARE),
    HALOVORE         ("halovore",          "Salt-drinker",         Rarity.UNCOMMON),
    MAGNETON         ("magneton",          "Field Swimmer",        Rarity.UNCOMMON),
    UMBRAL           ("umbral",            "Heat Shadow",          Rarity.UNCOMMON),
    CYST             ("cyst",              "Traveling Cyst",       Rarity.LEGENDARY),
    FROG             ("frog",              "Green Frog",           Rarity.COMMON),
    TOAD             ("toad",              "American Toad",        Rarity.COMMON),
    NEWT             ("newt",              "Eastern Newt",         Rarity.UNCOMMON),
    SALAMANDER       ("salamander",        "Spotted Salamander",   Rarity.UNCOMMON),
    CAECILIAN        ("caecilian",         "Rio Caecilian",        Rarity.RARE),
    CRAYFISH         ("crayfish",          "Common Crayfish",      Rarity.COMMON),
    POND_SNAIL       ("pond_snail",        "Great Pond Snail",     Rarity.COMMON),
    MUSSEL           ("mussel",            "Eastern Elliptio",     Rarity.UNCOMMON),
    LEECH            ("leech",             "Horse Leech",          Rarity.UNCOMMON),
    STICKLEBACK      ("stickleback",       "Three-spined Stickleback", Rarity.COMMON),
    PARAMECIUM       ("paramecium",        "Slipper Paramecium",      Rarity.COMMON),
    AMOEBA           ("amoeba",            "Proteus Amoeba",          Rarity.COMMON),
    EUGLENA          ("euglena",           "Euglena",                 Rarity.UNCOMMON),
    VOLVOX           ("volvox",            "Golden Volvox",           Rarity.UNCOMMON),
    DIATOM           ("diatom",            "Navicula",                Rarity.COMMON),
    KELP             ("kelp",              "Giant Kelp",              Rarity.RARE),
    CHLAMYDOMONAS    ("chlamydomonas",     "Chlamydomonas",           Rarity.COMMON),
    STENTOR          ("stentor",           "Blue Stentor",            Rarity.UNCOMMON),
    COLI             ("coli",              "Escherichia coli",        Rarity.COMMON),
    HALOARCHAEA      ("haloarchaea",       "Halobacterium",           Rarity.RARE),
    CROW             ("crow",              "American Crow",        Rarity.COMMON),
    RAVEN            ("raven",             "Common Raven",         Rarity.UNCOMMON),
    BARN_OWL         ("barn_owl",          "Barn Owl",             Rarity.UNCOMMON),
    RED_TAIL         ("red_tail",          "Red-tailed Hawk",      Rarity.UNCOMMON),
    CHICKADEE        ("chickadee",         "Black-capped Chickadee", Rarity.COMMON),
    ROBIN            ("robin",             "American Robin",       Rarity.COMMON),
    MALLARD          ("mallard",           "Mallard",              Rarity.COMMON),
    CANADA_GOOSE     ("canada_goose",      "Canada Goose",         Rarity.COMMON),
    PILEATED         ("pileated",          "Pileated Woodpecker",  Rarity.RARE),
    HUMMINGBIRD      ("hummingbird",       "Ruby-throated Hummingbird", Rarity.UNCOMMON),
    ORB_WEAVER       ("orb_weaver",        "European Garden Spider", Rarity.COMMON),
    JUMPING_SPIDER   ("jumping_spider",    "Bold Jumper",            Rarity.COMMON),
    WOLF_SPIDER      ("wolf_spider",       "Wetland Wolf Spider",    Rarity.UNCOMMON),
    TARANTULA        ("tarantula",         "Desert Blonde",          Rarity.RARE),
    WIDOW            ("widow",             "Southern Black Widow",   Rarity.UNCOMMON),
    HARVESTMAN       ("harvestman",        "Common Harvestman",      Rarity.COMMON),
    SCORPION         ("scorpion",          "Striped Bark Scorpion",  Rarity.UNCOMMON),
    VINEGAROON       ("vinegaroon",        "Giant Vinegaroon",       Rarity.RARE),
    TICK             ("tick",              "Black-legged Tick",      Rarity.COMMON),
    SOLIFUGE         ("solifuge",          "Windscorpion",           Rarity.UNCOMMON),
    DEER             ("deer",              "White-tailed Deer",      Rarity.COMMON),
    BAT              ("bat",               "Big Brown Bat",          Rarity.UNCOMMON),
    SQUIRREL         ("squirrel",          "Eastern Gray Squirrel",  Rarity.COMMON),
    OTTER            ("otter",             "North American River Otter", Rarity.UNCOMMON),
    RACCOON          ("raccoon",           "Raccoon",                Rarity.COMMON),
    SKUNK            ("skunk",             "Striped Skunk",          Rarity.COMMON),
    OPOSSUM          ("opossum",           "Virginia Opossum",       Rarity.COMMON),
    BEAVER           ("beaver",            "North American Beaver",  Rarity.UNCOMMON),
    PORCUPINE        ("porcupine",         "North American Porcupine", Rarity.UNCOMMON),
    BLACK_BEAR       ("black_bear",        "American Black Bear",    Rarity.RARE),
    GECKO            ("gecko",             "Mediterranean House Gecko", Rarity.COMMON),
    ANOLE            ("anole",             "Green Anole",            Rarity.COMMON),
    SKINK            ("skink",             "Five-lined Skink",       Rarity.COMMON),
    CHAMELEON        ("chameleon",         "Veiled Chameleon",       Rarity.UNCOMMON),
    HORNED_LIZARD    ("horned_lizard",     "Texas Horned Lizard",    Rarity.UNCOMMON),
    ALLIGATOR        ("alligator",         "American Alligator",     Rarity.UNCOMMON),
    CROCODILE        ("crocodile",         "American Crocodile",     Rarity.RARE),
    SNAPPER          ("snapper",           "Common Snapping Turtle", Rarity.COMMON),
    BOX_TURTLE       ("box_turtle",        "Eastern Box Turtle",     Rarity.COMMON),
    TUATARA          ("tuatara",           "Tuatara",                Rarity.RARE),
    BASS             ("bass",              "Largemouth Bass",        Rarity.COMMON),
    BROOK_TROUT      ("brook_trout",       "Brook Trout",            Rarity.UNCOMMON),
    CATFISH          ("catfish",           "Channel Catfish",        Rarity.COMMON),
    BLUEGILL         ("bluegill",          "Bluegill",               Rarity.COMMON),
    PERCH            ("perch",             "Yellow Perch",           Rarity.COMMON),
    PIKE             ("pike",              "Northern Pike",          Rarity.UNCOMMON),
    WALLEYE          ("walleye",           "Walleye",                Rarity.UNCOMMON),
    PADDLEFISH       ("paddlefish",        "American Paddlefish",    Rarity.RARE),
    LAMPREY          ("lamprey",           "Sea Lamprey",            Rarity.UNCOMMON),
    AMERICAN_EEL     ("american_eel",      "American Eel",           Rarity.RARE);

    public enum Rarity { COMMON, UNCOMMON, RARE, LEGENDARY }

    private static final Map<String, PetType> BY_KEY = Arrays.stream(values())
        .collect(Collectors.toUnmodifiableMap(PetType::key, Function.identity()));

    private final String key;
    private final String displayName;
    private final Rarity rarity;

    PetType(String key, String displayName, Rarity rarity) {
        this.key = key;
        this.displayName = displayName;
        this.rarity = rarity;
    }

    public String key()         { return key; }
    public String displayName() { return displayName; }
    public Rarity rarity()      { return rarity; }

    /** Case-insensitive lookup by wire-format key (e.g. "red_panda"). */
    public static Optional<PetType> fromKey(String key) {
        if (key == null) return Optional.empty();
        return Optional.ofNullable(BY_KEY.get(key.toLowerCase()));
    }
}
