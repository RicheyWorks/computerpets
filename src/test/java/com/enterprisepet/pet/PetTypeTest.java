package com.enterprisepet.pet;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Catalog coverage: backend {@link PetType} must accept every living-desk wire key.
 */
class PetTypeTest {

    /** Keys, display names, and rarities from {@code web/src/lib/pets/catalog.ts} SPECIES. */
    private static final List<ExpectedSpecies> WEB_CATALOG = List.of(
            new ExpectedSpecies("red_panda", "Red Panda", PetType.Rarity.COMMON),
            new ExpectedSpecies("cat", "Cat", PetType.Rarity.COMMON),
            new ExpectedSpecies("dog", "Dog", PetType.Rarity.COMMON),
            new ExpectedSpecies("rabbit", "Rabbit", PetType.Rarity.COMMON),
            new ExpectedSpecies("hamster", "Hamster", PetType.Rarity.COMMON),
            new ExpectedSpecies("guinea_pig", "Guinea Pig", PetType.Rarity.COMMON),
            new ExpectedSpecies("turtle", "Turtle", PetType.Rarity.COMMON),
            new ExpectedSpecies("goldfish", "Goldfish", PetType.Rarity.COMMON),
            new ExpectedSpecies("budgie", "Budgie", PetType.Rarity.COMMON),
            new ExpectedSpecies("fox", "Fox", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("penguin", "Penguin", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("parrot", "Parrot", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("ferret", "Ferret", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("hedgehog", "Hedgehog", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("chinchilla", "Chinchilla", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("axolotl", "Axolotl", PetType.Rarity.RARE),
            new ExpectedSpecies("toucan", "Toucan", PetType.Rarity.RARE),
            new ExpectedSpecies("iguana", "Iguana", PetType.Rarity.RARE),
            new ExpectedSpecies("dragon", "Dragon", PetType.Rarity.LEGENDARY),
            new ExpectedSpecies("phoenix", "Phoenix", PetType.Rarity.LEGENDARY),
            new ExpectedSpecies("ball_python", "Ball Python", PetType.Rarity.COMMON),
            new ExpectedSpecies("corn_snake", "Corn Snake", PetType.Rarity.COMMON),
            new ExpectedSpecies("kingsnake", "California Kingsnake", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("green_tree_python", "Green Tree Python", PetType.Rarity.RARE),
            new ExpectedSpecies("hognose", "Western Hognose", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("garter", "Common Garter", PetType.Rarity.COMMON),
            new ExpectedSpecies("boa", "Boa Constrictor", PetType.Rarity.RARE),
            new ExpectedSpecies("milk_snake", "Pueblo Milk Snake", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("rosy_boa", "Rosy Boa", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("carpet_python", "Jungle Carpet Python", PetType.Rarity.RARE),
            new ExpectedSpecies("octopus", "Common Octopus", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("cuttlefish", "Common Cuttlefish", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("nautilus", "Chambered Nautilus", PetType.Rarity.RARE),
            new ExpectedSpecies("moon_jelly", "Moon Jelly", PetType.Rarity.COMMON),
            new ExpectedSpecies("sea_star", "Ochre Sea Star", PetType.Rarity.COMMON),
            new ExpectedSpecies("hermit_crab", "Common Hermit", PetType.Rarity.COMMON),
            new ExpectedSpecies("horseshoe_crab", "Atlantic Horseshoe Crab", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("seahorse", "Lined Seahorse", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("manta", "Reef Manta", PetType.Rarity.RARE),
            new ExpectedSpecies("moray", "Green Moray", PetType.Rarity.RARE),
            new ExpectedSpecies("moss", "Sheet Moss", PetType.Rarity.COMMON),
            new ExpectedSpecies("maidenhair", "Maidenhair Fern", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("ginkgo", "Ginkgo", PetType.Rarity.RARE),
            new ExpectedSpecies("oak", "White Oak", PetType.Rarity.COMMON),
            new ExpectedSpecies("water_lily", "Fragrant Water Lily", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("orchid", "Moth Orchid", PetType.Rarity.RARE),
            new ExpectedSpecies("saguaro", "Saguaro", PetType.Rarity.RARE),
            new ExpectedSpecies("venus_flytrap", "Venus Flytrap", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("pitcher", "Purple Pitcher Plant", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("sundew", "Round-leaved Sundew", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("honeybee", "Western Honey Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("monarch", "Monarch", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("luna", "Luna Moth", PetType.Rarity.RARE),
            new ExpectedSpecies("firefly", "Common Eastern Firefly", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("darner", "Common Green Darner", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("stick", "Common Walkingstick", PetType.Rarity.COMMON),
            new ExpectedSpecies("carpenter_ant", "Black Carpenter Ant", PetType.Rarity.COMMON),
            new ExpectedSpecies("ladybird", "Seven-spot Ladybird", PetType.Rarity.COMMON),
            new ExpectedSpecies("mantis", "Chinese Mantis", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("cicada", "Periodical Cicada", PetType.Rarity.RARE),
            new ExpectedSpecies("bumblebee", "Common Eastern Bumble Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("carpenter_bee", "Eastern Carpenter Bee", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("mason_bee", "Blue Orchard Mason Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("leafcutter", "Alfalfa Leafcutter Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("stingless", "Maya Stingless Bee", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("sweat_bee", "Bicolored Sweat Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("mining_bee", "Neighborly Mining Bee", PetType.Rarity.COMMON),
            new ExpectedSpecies("honey_drone", "Western Honey Bee (drone)", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("honey_queen", "Western Honey Bee (queen)", PetType.Rarity.RARE),
            new ExpectedSpecies("honeycomb", "Honeycomb", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("oyster", "Oyster Mushroom", PetType.Rarity.COMMON),
            new ExpectedSpecies("fly_agaric", "Fly Agaric", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("morel", "American Morel", PetType.Rarity.RARE),
            new ExpectedSpecies("chanterelle", "Golden Chanterelle", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("turkey_tail", "Turkey Tail", PetType.Rarity.COMMON),
            new ExpectedSpecies("lions_mane", "Lion's Mane", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("puffball", "Common Puffball", PetType.Rarity.COMMON),
            new ExpectedSpecies("chicken_of_woods", "Chicken of the Woods", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("yeast", "Baker's Yeast", PetType.Rarity.COMMON),
            new ExpectedSpecies("lichen", "Reindeer Lichen", PetType.Rarity.RARE),
            new ExpectedSpecies("photovore", "Lamp-drinker", PetType.Rarity.COMMON),
            new ExpectedSpecies("choir", "Chord Body", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("nimbus", "Methane Floater", PetType.Rarity.COMMON),
            new ExpectedSpecies("silica", "Living Crystal", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("terminator", "Twilight Walker", PetType.Rarity.RARE),
            new ExpectedSpecies("nexus", "Walking Colony", PetType.Rarity.RARE),
            new ExpectedSpecies("halovore", "Salt-drinker", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("magneton", "Field Swimmer", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("umbral", "Heat Shadow", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("cyst", "Traveling Cyst", PetType.Rarity.LEGENDARY),
            new ExpectedSpecies("frog", "Green Frog", PetType.Rarity.COMMON),
            new ExpectedSpecies("toad", "American Toad", PetType.Rarity.COMMON),
            new ExpectedSpecies("newt", "Eastern Newt", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("salamander", "Spotted Salamander", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("caecilian", "Rio Caecilian", PetType.Rarity.RARE),
            new ExpectedSpecies("crayfish", "Common Crayfish", PetType.Rarity.COMMON),
            new ExpectedSpecies("pond_snail", "Great Pond Snail", PetType.Rarity.COMMON),
            new ExpectedSpecies("mussel", "Eastern Elliptio", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("leech", "Horse Leech", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("stickleback", "Three-spined Stickleback", PetType.Rarity.COMMON),
            new ExpectedSpecies("paramecium", "Slipper Paramecium", PetType.Rarity.COMMON),
            new ExpectedSpecies("amoeba", "Proteus Amoeba", PetType.Rarity.COMMON),
            new ExpectedSpecies("euglena", "Euglena", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("volvox", "Golden Volvox", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("diatom", "Navicula", PetType.Rarity.COMMON),
            new ExpectedSpecies("kelp", "Giant Kelp", PetType.Rarity.RARE),
            new ExpectedSpecies("chlamydomonas", "Chlamydomonas", PetType.Rarity.COMMON),
            new ExpectedSpecies("stentor", "Blue Stentor", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("coli", "Escherichia coli", PetType.Rarity.COMMON),
            new ExpectedSpecies("haloarchaea", "Halobacterium", PetType.Rarity.RARE),
            new ExpectedSpecies("crow", "American Crow", PetType.Rarity.COMMON),
            new ExpectedSpecies("raven", "Common Raven", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("barn_owl", "Barn Owl", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("red_tail", "Red-tailed Hawk", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("chickadee", "Black-capped Chickadee", PetType.Rarity.COMMON),
            new ExpectedSpecies("robin", "American Robin", PetType.Rarity.COMMON),
            new ExpectedSpecies("mallard", "Mallard", PetType.Rarity.COMMON),
            new ExpectedSpecies("canada_goose", "Canada Goose", PetType.Rarity.COMMON),
            new ExpectedSpecies("pileated", "Pileated Woodpecker", PetType.Rarity.RARE),
            new ExpectedSpecies("hummingbird", "Ruby-throated Hummingbird", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("orb_weaver", "European Garden Spider", PetType.Rarity.COMMON),
            new ExpectedSpecies("jumping_spider", "Bold Jumper", PetType.Rarity.COMMON),
            new ExpectedSpecies("wolf_spider", "Wetland Wolf Spider", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("tarantula", "Desert Blonde", PetType.Rarity.RARE),
            new ExpectedSpecies("widow", "Southern Black Widow", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("harvestman", "Common Harvestman", PetType.Rarity.COMMON),
            new ExpectedSpecies("scorpion", "Striped Bark Scorpion", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("vinegaroon", "Giant Vinegaroon", PetType.Rarity.RARE),
            new ExpectedSpecies("tick", "Black-legged Tick", PetType.Rarity.COMMON),
            new ExpectedSpecies("solifuge", "Windscorpion", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("deer", "White-tailed Deer", PetType.Rarity.COMMON),
            new ExpectedSpecies("bat", "Big Brown Bat", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("squirrel", "Eastern Gray Squirrel", PetType.Rarity.COMMON),
            new ExpectedSpecies("otter", "North American River Otter", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("raccoon", "Raccoon", PetType.Rarity.COMMON),
            new ExpectedSpecies("skunk", "Striped Skunk", PetType.Rarity.COMMON),
            new ExpectedSpecies("opossum", "Virginia Opossum", PetType.Rarity.COMMON),
            new ExpectedSpecies("beaver", "North American Beaver", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("porcupine", "North American Porcupine", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("black_bear", "American Black Bear", PetType.Rarity.RARE),
            new ExpectedSpecies("gecko", "Mediterranean House Gecko", PetType.Rarity.COMMON),
            new ExpectedSpecies("anole", "Green Anole", PetType.Rarity.COMMON),
            new ExpectedSpecies("skink", "Five-lined Skink", PetType.Rarity.COMMON),
            new ExpectedSpecies("chameleon", "Veiled Chameleon", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("horned_lizard", "Texas Horned Lizard", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("alligator", "American Alligator", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("crocodile", "American Crocodile", PetType.Rarity.RARE),
            new ExpectedSpecies("snapper", "Common Snapping Turtle", PetType.Rarity.COMMON),
            new ExpectedSpecies("box_turtle", "Eastern Box Turtle", PetType.Rarity.COMMON),
            new ExpectedSpecies("tuatara", "Tuatara", PetType.Rarity.RARE),
            new ExpectedSpecies("bass", "Largemouth Bass", PetType.Rarity.COMMON),
            new ExpectedSpecies("brook_trout", "Brook Trout", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("catfish", "Channel Catfish", PetType.Rarity.COMMON),
            new ExpectedSpecies("bluegill", "Bluegill", PetType.Rarity.COMMON),
            new ExpectedSpecies("perch", "Yellow Perch", PetType.Rarity.COMMON),
            new ExpectedSpecies("pike", "Northern Pike", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("walleye", "Walleye", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("paddlefish", "American Paddlefish", PetType.Rarity.RARE),
            new ExpectedSpecies("lamprey", "Sea Lamprey", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("american_eel", "American Eel", PetType.Rarity.RARE),
            new ExpectedSpecies("house_centipede", "House Centipede", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("millipede", "American Giant Millipede", PetType.Rarity.COMMON),
            new ExpectedSpecies("pillbug", "Common Pillbug", PetType.Rarity.COMMON),
            new ExpectedSpecies("earthworm", "Common Earthworm", PetType.Rarity.COMMON),
            new ExpectedSpecies("velvet_worm", "Velvet Worm", PetType.Rarity.RARE),
            new ExpectedSpecies("springtail", "Orchesella Springtail", PetType.Rarity.COMMON),
            new ExpectedSpecies("tardigrade", "Water Bear", PetType.Rarity.RARE),
            new ExpectedSpecies("planarian", "Tiger Planarian", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("nematode", "C. elegans", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("amphipod", "Gammarus Scud", PetType.Rarity.COMMON),
            new ExpectedSpecies("fiddler_crab", "Atlantic Fiddler Crab", PetType.Rarity.COMMON),
            new ExpectedSpecies("ghost_crab", "Atlantic Ghost Crab", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("limpet", "Common Limpet", PetType.Rarity.COMMON),
            new ExpectedSpecies("barnacle", "Acorn Barnacle", PetType.Rarity.COMMON),
            new ExpectedSpecies("chiton", "Lined Chiton", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("periwinkle", "Common Periwinkle", PetType.Rarity.COMMON),
            new ExpectedSpecies("sand_dollar", "Common Sand Dollar", PetType.Rarity.COMMON),
            new ExpectedSpecies("sea_urchin", "Purple Sea Urchin", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("knobbed_whelk", "Knobbed Whelk", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("lugworm", "Lugworm", PetType.Rarity.COMMON),
            new ExpectedSpecies("field_cricket", "Fall Field Cricket", PetType.Rarity.COMMON),
            new ExpectedSpecies("katydid", "Northern True Katydid", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("grasshopper", "Differential Grasshopper", PetType.Rarity.COMMON),
            new ExpectedSpecies("swallowtail", "Eastern Tiger Swallowtail", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("jewelwing", "Ebony Jewelwing", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("lacewing", "Green Lacewing", PetType.Rarity.COMMON),
            new ExpectedSpecies("earwig", "European Earwig", PetType.Rarity.COMMON),
            new ExpectedSpecies("acorn_weevil", "Acorn Weevil", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("click_beetle", "Eyed Click Beetle", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("robber_fly", "Robber Fly", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("sloth", "Linnaeus's Two-toed Sloth", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("lemur", "Ring-tailed Lemur", PetType.Rarity.COMMON),
            new ExpectedSpecies("gibbon", "Lar Gibbon", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("kinkajou", "Kinkajou", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("colugo", "Sunda Colugo", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("flying_squirrel", "Southern Flying Squirrel", PetType.Rarity.COMMON),
            new ExpectedSpecies("howler", "Mantled Howler", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("tarsier", "Philippine Tarsier", PetType.Rarity.RARE),
            new ExpectedSpecies("potto", "Potto", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("koala", "Koala", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("brain_coral", "Boulder Brain Coral", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("anemone", "Magnificent Sea Anemone", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("clownfish", "Ocellaris Clownfish", PetType.Rarity.COMMON),
            new ExpectedSpecies("parrotfish", "Stoplight Parrotfish", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("cleaner_shrimp", "Pacific Cleaner Shrimp", PetType.Rarity.COMMON),
            new ExpectedSpecies("sea_cucumber", "Pineapple Sea Cucumber", PetType.Rarity.COMMON),
            new ExpectedSpecies("lionfish", "Red Lionfish", PetType.Rarity.UNCOMMON),
            new ExpectedSpecies("giant_clam", "Giant Clam", PetType.Rarity.RARE),
            new ExpectedSpecies("eagle_ray", "Spotted Eagle Ray", PetType.Rarity.RARE),
            new ExpectedSpecies("grouper", "Nassau Grouper", PetType.Rarity.UNCOMMON)
    );

    private static final List<String> SNAKE_KEYS = List.of(
            "ball_python", "corn_snake", "kingsnake", "green_tree_python",
            "hognose", "garter", "boa", "milk_snake", "rosy_boa", "carpet_python"
    );

    private static final List<String> SEA_KEYS = List.of(
            "octopus", "cuttlefish", "nautilus", "moon_jelly", "sea_star",
            "hermit_crab", "horseshoe_crab", "seahorse", "manta", "moray"
    );

    private static final List<String> GARDEN_KEYS = List.of(
            "moss", "maidenhair", "ginkgo", "oak", "water_lily",
            "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"
    );

    private static final List<String> INSECT_KEYS = List.of(
            "honeybee", "monarch", "luna", "firefly", "darner",
            "stick", "carpenter_ant", "ladybird", "mantis", "cicada"
    );

    private static final List<String> BEE_KEYS = List.of(
            "bumblebee", "carpenter_bee", "mason_bee", "leafcutter", "stingless",
            "sweat_bee", "mining_bee", "honey_drone", "honey_queen", "honeycomb"
    );

    private static final List<String> FUNGI_KEYS = List.of(
            "oyster", "fly_agaric", "morel", "chanterelle", "turkey_tail",
            "lions_mane", "puffball", "chicken_of_woods", "yeast", "lichen"
    );

    private static final List<String> FAR_KEYS = List.of(
            "photovore", "choir", "nimbus", "silica", "terminator",
            "nexus", "halovore", "magneton", "umbral", "cyst"
    );

    private static final List<String> POND_KEYS = List.of(
            "frog", "toad", "newt", "salamander", "caecilian",
            "crayfish", "pond_snail", "mussel", "leech", "stickleback"
    );

    private static final List<String> WELL_KEYS = List.of(
            "paramecium", "amoeba", "euglena", "volvox", "diatom",
            "kelp", "chlamydomonas", "stentor", "coli", "haloarchaea"
    );

    private static final List<String> SHORE_KEYS = List.of(
            "fiddler_crab", "ghost_crab", "limpet", "barnacle", "chiton",
            "periwinkle", "sand_dollar", "sea_urchin", "knobbed_whelk", "lugworm"
    );

    private static final List<String> MEADOW_KEYS = List.of(
            "field_cricket", "katydid", "grasshopper", "swallowtail", "jewelwing",
            "lacewing", "earwig", "acorn_weevil", "click_beetle", "robber_fly"
    );

    @Test
    @DisplayName("catalog matches the living-desk web catalog, including the tide")
    void catalog_matchesWebHouse() {
        assertThat(PetType.values()).hasSize(WEB_CATALOG.size());
        assertThat(WEB_CATALOG).hasSize(210);

        Set<String> backendKeys = Arrays.stream(PetType.values())
                .map(PetType::key)
                .collect(Collectors.toSet());
        Set<String> webKeys = WEB_CATALOG.stream()
                .map(ExpectedSpecies::key)
                .collect(Collectors.toSet());

        assertThat(backendKeys).containsExactlyInAnyOrderElementsOf(webKeys);
    }

    @Test
    @DisplayName("fromKey accepts every web catalog key, including snakes and the tide")
    void fromKey_acceptsAllWebCatalogKeys() {
        for (ExpectedSpecies species : WEB_CATALOG) {
            assertThat(PetType.fromKey(species.key()))
                    .as("fromKey(%s)", species.key())
                    .isPresent()
                    .get()
                    .satisfies(found -> {
                        assertThat(found.key()).isEqualTo(species.key());
                        assertThat(found.displayName()).isEqualTo(species.displayName());
                        assertThat(found.rarity()).isEqualTo(species.rarity());
                    });
        }
    }

    @Test
    @DisplayName("fromKey is case-insensitive and rejects unknown keys")
    void fromKey_caseInsensitiveAndClosed() {
        assertThat(PetType.fromKey("BALL_PYTHON")).contains(PetType.BALL_PYTHON);
        assertThat(PetType.fromKey("Green_Tree_Python")).contains(PetType.GREEN_TREE_PYTHON);
        assertThat(PetType.fromKey("carpet_python")).contains(PetType.CARPET_PYTHON);
        assertThat(PetType.fromKey("unicorn")).isEmpty();
        assertThat(PetType.fromKey("")).isEmpty();
        assertThat(PetType.fromKey(null)).isEmpty();
    }

    @Test
    @DisplayName("rarity counts include the ten snakes and the tide")
    void rarityCounts_includeSnakes() {
        Map<PetType.Rarity, Long> counts = Arrays.stream(PetType.values())
                .collect(Collectors.groupingBy(PetType::rarity, Collectors.counting()));

        assertThat(counts.get(PetType.Rarity.COMMON)).isEqualTo(82L);
        assertThat(counts.get(PetType.Rarity.UNCOMMON)).isEqualTo(82L);
        assertThat(counts.get(PetType.Rarity.RARE)).isEqualTo(33L);
        assertThat(counts.get(PetType.Rarity.LEGENDARY)).isEqualTo(3L);
    }

    @Test
    @DisplayName("snake enum constants follow PetType naming and wire keys")
    void snakes_enumConstantsMatchWireKeys() {
        assertThat(PetType.BALL_PYTHON.key()).isEqualTo("ball_python");
        assertThat(PetType.CORN_SNAKE.displayName()).isEqualTo("Corn Snake");
        assertThat(PetType.KINGSNAKE.displayName()).isEqualTo("California Kingsnake");
        assertThat(PetType.GREEN_TREE_PYTHON.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.HOGNOSE.displayName()).isEqualTo("Western Hognose");
        assertThat(PetType.GARTER.displayName()).isEqualTo("Common Garter");
        assertThat(PetType.BOA.displayName()).isEqualTo("Boa Constrictor");
        assertThat(PetType.MILK_SNAKE.displayName()).isEqualTo("Pueblo Milk Snake");
        assertThat(PetType.ROSY_BOA.displayName()).isEqualTo("Rosy Boa");
        assertThat(PetType.CARPET_PYTHON.displayName()).isEqualTo("Jungle Carpet Python");

        for (String key : SNAKE_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : SEA_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : GARDEN_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : INSECT_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : BEE_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : FUNGI_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : FAR_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : POND_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : WELL_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : SHORE_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        for (String key : MEADOW_KEYS) {
            assertThat(PetType.fromKey(key)).isPresent();
        }
        assertThat(PetType.FIDDLER_CRAB.displayName()).isEqualTo("Atlantic Fiddler Crab");
        assertThat(PetType.FIELD_CRICKET.displayName()).isEqualTo("Fall Field Cricket");
        assertThat(PetType.KATYDID.displayName()).isEqualTo("Northern True Katydid");
        assertThat(PetType.GRASSHOPPER.displayName()).isEqualTo("Differential Grasshopper");
        assertThat(PetType.SWALLOWTAIL.displayName()).isEqualTo("Eastern Tiger Swallowtail");
        assertThat(PetType.JEWELWING.displayName()).isEqualTo("Ebony Jewelwing");
        assertThat(PetType.LACEWING.displayName()).isEqualTo("Green Lacewing");
        assertThat(PetType.EARWIG.displayName()).isEqualTo("European Earwig");
        assertThat(PetType.ACORN_WEEVIL.displayName()).isEqualTo("Acorn Weevil");
        assertThat(PetType.CLICK_BEETLE.displayName()).isEqualTo("Eyed Click Beetle");
        assertThat(PetType.ROBBER_FLY.displayName()).isEqualTo("Robber Fly");
        assertThat(PetType.SLOTH.displayName()).isEqualTo("Linnaeus's Two-toed Sloth");
        assertThat(PetType.LEMUR.displayName()).isEqualTo("Ring-tailed Lemur");
        assertThat(PetType.GIBBON.displayName()).isEqualTo("Lar Gibbon");
        assertThat(PetType.KINKAJOU.displayName()).isEqualTo("Kinkajou");
        assertThat(PetType.COLUGO.displayName()).isEqualTo("Sunda Colugo");
        assertThat(PetType.FLYING_SQUIRREL.displayName()).isEqualTo("Southern Flying Squirrel");
        assertThat(PetType.HOWLER.displayName()).isEqualTo("Mantled Howler");
        assertThat(PetType.TARSIER.displayName()).isEqualTo("Philippine Tarsier");
        assertThat(PetType.POTTO.displayName()).isEqualTo("Potto");
        assertThat(PetType.KOALA.displayName()).isEqualTo("Koala");
        assertThat(PetType.GHOST_CRAB.displayName()).isEqualTo("Atlantic Ghost Crab");
        assertThat(PetType.LIMPET.displayName()).isEqualTo("Common Limpet");
        assertThat(PetType.BARNACLE.displayName()).isEqualTo("Acorn Barnacle");
        assertThat(PetType.CHITON.displayName()).isEqualTo("Lined Chiton");
        assertThat(PetType.PERIWINKLE.displayName()).isEqualTo("Common Periwinkle");
        assertThat(PetType.SAND_DOLLAR.displayName()).isEqualTo("Common Sand Dollar");
        assertThat(PetType.SEA_URCHIN.displayName()).isEqualTo("Purple Sea Urchin");
        assertThat(PetType.KNOBBED_WHELK.displayName()).isEqualTo("Knobbed Whelk");
        assertThat(PetType.LUGWORM.displayName()).isEqualTo("Lugworm");
        assertThat(PetType.OCTOPUS.displayName()).isEqualTo("Common Octopus");
        assertThat(PetType.HORSESHOE_CRAB.displayName()).isEqualTo("Atlantic Horseshoe Crab");
        assertThat(PetType.MANTA.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.MOON_JELLY.rarity()).isEqualTo(PetType.Rarity.COMMON);
        assertThat(PetType.MOSS.displayName()).isEqualTo("Sheet Moss");
        assertThat(PetType.VENUS_FLYTRAP.displayName()).isEqualTo("Venus Flytrap");
        assertThat(PetType.SAGUARO.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.PITCHER.displayName()).isEqualTo("Purple Pitcher Plant");
        assertThat(PetType.SUNDEW.rarity()).isEqualTo(PetType.Rarity.UNCOMMON);
        assertThat(PetType.HONEYBEE.displayName()).isEqualTo("Western Honey Bee");
        assertThat(PetType.LUNA.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.FIREFLY.displayName()).isEqualTo("Common Eastern Firefly");
        assertThat(PetType.CARPENTER_ANT.key()).isEqualTo("carpenter_ant");
        assertThat(PetType.CICADA.displayName()).isEqualTo("Periodical Cicada");
        assertThat(PetType.BUMBLEBEE.displayName()).isEqualTo("Common Eastern Bumble Bee");
        assertThat(PetType.CARPENTER_BEE.key()).isEqualTo("carpenter_bee");
        assertThat(PetType.MASON_BEE.rarity()).isEqualTo(PetType.Rarity.COMMON);
        assertThat(PetType.HONEY_DRONE.displayName()).isEqualTo("Western Honey Bee (drone)");
        assertThat(PetType.HONEY_QUEEN.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.HONEYCOMB.displayName()).isEqualTo("Honeycomb");
        assertThat(PetType.MANTIS.rarity()).isEqualTo(PetType.Rarity.UNCOMMON);
        assertThat(PetType.OYSTER.displayName()).isEqualTo("Oyster Mushroom");
        assertThat(PetType.FLY_AGARIC.key()).isEqualTo("fly_agaric");
        assertThat(PetType.MOREL.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.CHANTERELLE.displayName()).isEqualTo("Golden Chanterelle");
        assertThat(PetType.TURKEY_TAIL.displayName()).isEqualTo("Turkey Tail");
        assertThat(PetType.LIONS_MANE.key()).isEqualTo("lions_mane");
        assertThat(PetType.PUFFBALL.rarity()).isEqualTo(PetType.Rarity.COMMON);
        assertThat(PetType.CHICKEN_OF_WOODS.displayName()).isEqualTo("Chicken of the Woods");
        assertThat(PetType.YEAST.displayName()).isEqualTo("Baker's Yeast");
        assertThat(PetType.LICHEN.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.PHOTOVORE.displayName()).isEqualTo("Lamp-drinker");
        assertThat(PetType.NIMBUS.rarity()).isEqualTo(PetType.Rarity.COMMON);
        assertThat(PetType.TERMINATOR.key()).isEqualTo("terminator");
        assertThat(PetType.NEXUS.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.CYST.displayName()).isEqualTo("Traveling Cyst");
        assertThat(PetType.CYST.rarity()).isEqualTo(PetType.Rarity.LEGENDARY);
        assertThat(PetType.FROG.displayName()).isEqualTo("Green Frog");
        assertThat(PetType.TOAD.displayName()).isEqualTo("American Toad");
        assertThat(PetType.NEWT.key()).isEqualTo("newt");
        assertThat(PetType.SALAMANDER.displayName()).isEqualTo("Spotted Salamander");
        assertThat(PetType.CAECILIAN.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.CRAYFISH.displayName()).isEqualTo("Common Crayfish");
        assertThat(PetType.POND_SNAIL.key()).isEqualTo("pond_snail");
        assertThat(PetType.MUSSEL.displayName()).isEqualTo("Eastern Elliptio");
        assertThat(PetType.LEECH.rarity()).isEqualTo(PetType.Rarity.UNCOMMON);
        assertThat(PetType.STICKLEBACK.displayName()).isEqualTo("Three-spined Stickleback");
        assertThat(PetType.PARAMECIUM.displayName()).isEqualTo("Slipper Paramecium");
        assertThat(PetType.AMOEBA.displayName()).isEqualTo("Proteus Amoeba");
        assertThat(PetType.EUGLENA.key()).isEqualTo("euglena");
        assertThat(PetType.VOLVOX.displayName()).isEqualTo("Golden Volvox");
        assertThat(PetType.DIATOM.displayName()).isEqualTo("Navicula");
        assertThat(PetType.KELP.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.CHLAMYDOMONAS.displayName()).isEqualTo("Chlamydomonas");
        assertThat(PetType.STENTOR.displayName()).isEqualTo("Blue Stentor");
        assertThat(PetType.COLI.displayName()).isEqualTo("Escherichia coli");
        assertThat(PetType.HALOARCHAEA.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.CROW.displayName()).isEqualTo("American Crow");
        assertThat(PetType.RAVEN.displayName()).isEqualTo("Common Raven");
        assertThat(PetType.BARN_OWL.key()).isEqualTo("barn_owl");
        assertThat(PetType.RED_TAIL.displayName()).isEqualTo("Red-tailed Hawk");
        assertThat(PetType.CHICKADEE.displayName()).isEqualTo("Black-capped Chickadee");
        assertThat(PetType.ROBIN.displayName()).isEqualTo("American Robin");
        assertThat(PetType.MALLARD.displayName()).isEqualTo("Mallard");
        assertThat(PetType.CANADA_GOOSE.key()).isEqualTo("canada_goose");
        assertThat(PetType.PILEATED.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.HUMMINGBIRD.displayName()).isEqualTo("Ruby-throated Hummingbird");
        assertThat(PetType.ORB_WEAVER.displayName()).isEqualTo("European Garden Spider");
        assertThat(PetType.JUMPING_SPIDER.key()).isEqualTo("jumping_spider");
        assertThat(PetType.WOLF_SPIDER.displayName()).isEqualTo("Wetland Wolf Spider");
        assertThat(PetType.TARANTULA.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.WIDOW.displayName()).isEqualTo("Southern Black Widow");
        assertThat(PetType.HARVESTMAN.displayName()).isEqualTo("Common Harvestman");
        assertThat(PetType.SCORPION.displayName()).isEqualTo("Striped Bark Scorpion");
        assertThat(PetType.VINEGAROON.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.TICK.displayName()).isEqualTo("Black-legged Tick");
        assertThat(PetType.SOLIFUGE.displayName()).isEqualTo("Windscorpion");
        assertThat(PetType.DEER.displayName()).isEqualTo("White-tailed Deer");
        assertThat(PetType.BAT.key()).isEqualTo("bat");
        assertThat(PetType.SQUIRREL.displayName()).isEqualTo("Eastern Gray Squirrel");
        assertThat(PetType.OTTER.displayName()).isEqualTo("North American River Otter");
        assertThat(PetType.RACCOON.displayName()).isEqualTo("Raccoon");
        assertThat(PetType.SKUNK.displayName()).isEqualTo("Striped Skunk");
        assertThat(PetType.OPOSSUM.displayName()).isEqualTo("Virginia Opossum");
        assertThat(PetType.BEAVER.rarity()).isEqualTo(PetType.Rarity.UNCOMMON);
        assertThat(PetType.PORCUPINE.displayName()).isEqualTo("North American Porcupine");
        assertThat(PetType.BLACK_BEAR.displayName()).isEqualTo("American Black Bear");
        assertThat(PetType.BLACK_BEAR.rarity()).isEqualTo(PetType.Rarity.RARE);
    }

    private record ExpectedSpecies(String key, String displayName, PetType.Rarity rarity) {}
}
