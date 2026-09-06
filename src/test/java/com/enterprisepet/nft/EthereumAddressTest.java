package com.enterprisepet.nft;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EthereumAddressTest {

    private static final String MIXED = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    @Test
    void normalize_lowercasesValidAddress() {
        assertThat(EthereumAddress.normalize(MIXED))
                .contains("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    }

    @Test
    void normalize_acceptsUppercasePrefix() {
        assertThat(EthereumAddress.normalize("0X" + MIXED.substring(2)))
                .contains("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    }

    @Test
    void normalize_trimsWhitespace() {
        assertThat(EthereumAddress.normalize("  " + MIXED + "\n"))
                .contains("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    }

    @Test
    void normalize_rejectsShortOrBareHex() {
        assertThat(EthereumAddress.normalize("0x")).isEmpty();
        assertThat(EthereumAddress.normalize("0xabc")).isEmpty();
        assertThat(EthereumAddress.normalize("A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")).isEmpty();
        assertThat(EthereumAddress.normalize(null)).isEmpty();
        assertThat(EthereumAddress.normalize("")).isEmpty();
    }

    @Test
    void equalsNormalized_ignoresChecksum() {
        assertThat(EthereumAddress.equalsNormalized(MIXED, MIXED.toLowerCase())).isTrue();
        assertThat(EthereumAddress.equalsNormalized(MIXED, "0x1111111111111111111111111111111111111111")).isFalse();
        assertThat(EthereumAddress.equalsNormalized("0x", MIXED)).isFalse();
    }
}
