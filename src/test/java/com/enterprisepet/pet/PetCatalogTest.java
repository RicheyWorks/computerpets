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
    @DisplayName("list returns the full house catalog in declaration order")
    void list_returnsFullHouse() {
        List<PetType> pets = catalog.list();
        assertThat(pets).hasSize(PetType.values().length);
        assertThat(pets.getFirst()).isEqualTo(PetType.RED_PANDA);
        assertThat(pets.getLast()).isEqualTo(PetType.CYST);
        assertThat(pets).contains(
                PetType.BALL_PYTHON,
                PetType.GREEN_TREE_PYTHON,
                PetType.CARPET_PYTHON,
                PetType.OCTOPUS,
                PetType.HORSESHOE_CRAB,
                PetType.MANTA,
                PetType.MOSS,
                PetType.VENUS_FLYTRAP,
                PetType.PITCHER,
                PetType.SUNDEW,
                PetType.HONEYBEE,
                PetType.LUNA,
                PetType.CICADA,
                PetType.OYSTER,
                PetType.LICHEN,
                PetType.PHOTOVORE,
                PetType.CYST
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
                .hasSize(27)
                .contains(PetType.BALL_PYTHON, PetType.CORN_SNAKE, PetType.GARTER, PetType.MOON_JELLY, PetType.HERMIT_CRAB, PetType.MOSS, PetType.OAK, PetType.HONEYBEE, PetType.STICK, PetType.LADYBIRD, PetType.OYSTER, PetType.YEAST, PetType.PHOTOVORE, PetType.NIMBUS);
        assertThat(catalog.listByRarity(PetType.Rarity.UNCOMMON))
                .hasSize(32)
                .contains(PetType.KINGSNAKE, PetType.HOGNOSE, PetType.OCTOPUS, PetType.HORSESHOE_CRAB, PetType.MAIDENHAIR, PetType.WATER_LILY, PetType.VENUS_FLYTRAP, PetType.PITCHER, PetType.SUNDEW, PetType.MONARCH, PetType.FIREFLY, PetType.MANTIS, PetType.FLY_AGARIC, PetType.CHANTERELLE, PetType.CHOIR, PetType.HALOVORE);
        assertThat(catalog.listByRarity(PetType.Rarity.RARE))
                .hasSize(18)
                .contains(PetType.GREEN_TREE_PYTHON, PetType.BOA, PetType.NAUTILUS, PetType.MANTA, PetType.MORAY, PetType.GINKGO, PetType.ORCHID, PetType.SAGUARO, PetType.LUNA, PetType.CICADA, PetType.MOREL, PetType.LICHEN, PetType.TERMINATOR, PetType.NEXUS);
        assertThat(catalog.listByRarity(PetType.Rarity.LEGENDARY)).hasSize(3).contains(PetType.CYST);
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
        assertThat(grouped.get(PetType.Rarity.COMMON)).hasSize(27);
        assertThat(grouped.get(PetType.Rarity.UNCOMMON)).hasSize(32);
        assertThat(grouped.get(PetType.Rarity.RARE)).hasSize(18);
        assertThat(grouped.get(PetType.Rarity.LEGENDARY)).hasSize(3);
    }

    @Test
    @DisplayName("validKeysCsv lists every wire key including the snakes")
    void validKeysCsv_includesSnakes() {
        String csv = catalog.validKeysCsv();
        assertThat(csv).startsWith("red_panda,");
        assertThat(csv).contains("ball_python");
        assertThat(csv).contains("green_tree_python");
        assertThat(csv).contains("octopus");
        assertThat(csv).contains("horseshoe_crab");
        assertThat(csv).contains("sundew");
        assertThat(csv).contains("honeybee");
        assertThat(csv).contains("carpenter_ant");
        assertThat(csv).contains("oyster");
        assertThat(csv).contains("lichen");
        assertThat(csv).contains("photovore");
        assertThat(csv).contains("cyst");
        assertThat(csv).endsWith("cyst");
        assertThat(csv.split(", ")).hasSize(PetType.values().length);
    }
}
