package com.enterprisepet.nft;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class NftCatalogTest {

    private static final String CONTRACT = "0x1234567890123456789012345678901234567890";

    @Test
    void find_isCaseInsensitiveAndExposesTokenMap() {
        EthereumProperties.CollectionSpec spec = new EthereumProperties.CollectionSpec();
        spec.setAddress(CONTRACT.toUpperCase());
        spec.setName("Genesis");
        spec.setStandard(NftStandard.ERC721);
        spec.setTokens(Map.of("1", "dragon", "02", "phoenix"));

        EthereumProperties props = new EthereumProperties();
        props.setCollections(List.of(spec));
        NftCatalog catalog = new NftCatalog(props);

        assertThat(catalog.size()).isEqualTo(1);
        assertThat(catalog.find(CONTRACT)).isPresent();
        assertThat(catalog.find(CONTRACT).orElseThrow().petKeyFor("1")).contains("dragon");
        assertThat(catalog.find(CONTRACT).orElseThrow().petKeyFor("2")).contains("phoenix");
        assertThat(catalog.find(CONTRACT).orElseThrow().petKeyFor("99")).isEmpty();
        assertThat(catalog.listPublic()).hasSize(1);
        assertThat(catalog.listPublic().get(0).get("name")).isEqualTo("Genesis");
    }

    @Test
    void find_ignoresMalformedCollectionAddresses() {
        EthereumProperties.CollectionSpec spec = new EthereumProperties.CollectionSpec();
        spec.setAddress("not-an-address");
        EthereumProperties props = new EthereumProperties();
        props.setCollections(List.of(spec));

        NftCatalog catalog = new NftCatalog(props);

        assertThat(catalog.isEmpty()).isTrue();
    }
}
