package com.enterprisepet.pet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PetCatalogTest {

    private PetCatalog catalog;

    @BeforeEach
    void setUp() {
        catalog = new PetCatalog();
    }

    @Test
    @DisplayName("list returns all 30 house species in declaration order")
    void list_returnsFullHouse() {
        List<PetType> pets = catalog.list();
        assertThat(pets).hasSize(30);
        assertThat(pets.getFirst()).isEqualTo(PetType.RED_PANDA);
        assertThat(pets.getLast()).isEqualTo(PetType.CARPET_PYTHON);
        assertThat(pets).contains(
                PetType.BALL_PYTHON,
                PetType.GREEN_TREE_PYTHON,
                PetType.CARPET_PYTHON
        );
    }

    @Test
    @DisplayName("find resolves snake keys the same way as fromKey")
    void find_resolvesSnakeKeys() {
        assertThat(catalog.find("ball_python")).contains(PetType.BALL_PYTHON);
        assertThat(catalog.find("BOA")).contains(PetType.BOA);
        assertThat(catalog.find("carpet_python")).contains(PetType.CARPET_PYTHON);
        assertThat(catalog.find("unicorn")).isEmpty();
    }

    @Test
    @DisplayName("listByRarity includes the new snake rarities")
    void listByRarity_includesSnakes() {
        assertThat(catalog.listByRarity(PetType.Rarity.COMMON))
                .hasSize(12)
                .contains(PetType.BALL_PYTHON, PetType.CORN_SNAKE, PetType.GARTER);
        assertThat(catalog.listByRarity(PetType.Rarity.UNCOMMON))
                .hasSize(10)
                .contains(PetType.KINGSNAKE, PetType.HOGNOSE, PetType.MILK_SNAKE, PetType.ROSY_BOA);
        assertThat(catalog.listByRarity(PetType.Rarity.RARE))
                .hasSize(6)
                .contains(PetType.GREEN_TREE_PYTHON, PetType.BOA, PetType.CARPET_PYTHON);
        assertThat(catalog.listByRarity(PetType.Rarity.LEGENDARY)).hasSize(2);
    }

    @Test
    @DisplayName("groupedByRarity exposes every tier including snakes")
    void groupedByRarity_hasAllTiers() {
        Map<PetType.Rarity, List<PetType>> grouped = catalog.groupedByRarity();
        assertThat(grouped.keySet()).containsExactly(
                PetType.Rarity.COMMON,
                PetType.Rarity.UNCOMMON,
                PetType.Rarity.RARE,
                PetType.Rarity.LEGENDARY
        );
        assertThat(grouped.get(PetType.Rarity.COMMON)).hasSize(12);
        assertThat(grouped.get(PetType.Rarity.UNCOMMON)).hasSize(10);
        assertThat(grouped.get(PetType.Rarity.RARE)).hasSize(6);
        assertThat(grouped.get(PetType.Rarity.LEGENDARY)).hasSize(2);
    }

    @Test
    @DisplayName("validKeysCsv lists every wire key including the snakes")
    void validKeysCsv_includesSnakes() {
        String csv = catalog.validKeysCsv();
        assertThat(csv).startsWith("red_panda,");
        assertThat(csv).contains("ball_python");
        assertThat(csv).contains("green_tree_python");
        assertThat(csv).endsWith("carpet_python");
        assertThat(csv.split(", ")).hasSize(30);
    }
}
