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
            new ExpectedSpecies("sundew", "Round-leaved Sundew", PetType.Rarity.UNCOMMON)
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

    @Test
    @DisplayName("catalog matches the living-desk web catalog, including the tide")
    void catalog_matchesWebHouse() {
        assertThat(PetType.values()).hasSize(WEB_CATALOG.size());
        assertThat(WEB_CATALOG).hasSize(50);

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

        assertThat(counts.get(PetType.Rarity.COMMON)).isEqualTo(17L);
        assertThat(counts.get(PetType.Rarity.UNCOMMON)).isEqualTo(19L);
        assertThat(counts.get(PetType.Rarity.RARE)).isEqualTo(12L);
        assertThat(counts.get(PetType.Rarity.LEGENDARY)).isEqualTo(2L);
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
        assertThat(PetType.OCTOPUS.displayName()).isEqualTo("Common Octopus");
        assertThat(PetType.HORSESHOE_CRAB.displayName()).isEqualTo("Atlantic Horseshoe Crab");
        assertThat(PetType.MANTA.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.MOON_JELLY.rarity()).isEqualTo(PetType.Rarity.COMMON);
        assertThat(PetType.MOSS.displayName()).isEqualTo("Sheet Moss");
        assertThat(PetType.VENUS_FLYTRAP.displayName()).isEqualTo("Venus Flytrap");
        assertThat(PetType.SAGUARO.rarity()).isEqualTo(PetType.Rarity.RARE);
        assertThat(PetType.PITCHER.displayName()).isEqualTo("Purple Pitcher Plant");
        assertThat(PetType.SUNDEW.rarity()).isEqualTo(PetType.Rarity.UNCOMMON);
    }

    private record ExpectedSpecies(String key, String displayName, PetType.Rarity rarity) {}
}
