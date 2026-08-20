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
            new ExpectedSpecies("cyst", "Traveling Cyst", PetType.Rarity.LEGENDARY)
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

    @Test
    @DisplayName("catalog matches the living-desk web catalog, including the tide")
    void catalog_matchesWebHouse() {
        assertThat(PetType.values()).hasSize(WEB_CATALOG.size());
        assertThat(WEB_CATALOG).hasSize(90);

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

        assertThat(counts.get(PetType.Rarity.COMMON)).isEqualTo(32L);
        assertThat(counts.get(PetType.Rarity.UNCOMMON)).isEqualTo(36L);
        assertThat(counts.get(PetType.Rarity.RARE)).isEqualTo(19L);
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
    }

    private record ExpectedSpecies(String key, String displayName, PetType.Rarity rarity) {}
}
