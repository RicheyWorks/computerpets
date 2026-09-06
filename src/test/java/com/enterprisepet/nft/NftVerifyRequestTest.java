package com.enterprisepet.nft;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class NftVerifyRequestTest {

    @Test
    @DisplayName("from(null) yields null fields")
    void from_nullMap_allNull() {
        NftVerifyRequest request = NftVerifyRequest.from(null);
        assertThat(request.walletAddress()).isNull();
        assertThat(request.contractAddress()).isNull();
        assertThat(request.tokenId()).isNull();
        assertThat(request.message()).isNull();
        assertThat(request.signature()).isNull();
        assertThat(request.petType()).isNull();
        assertThat(request.hasSignature()).isFalse();
        assertThat(request.hasMessage()).isFalse();
    }

    @Test
    @DisplayName("blank strings become null")
    void from_blankStrings_becomeNull() {
        NftVerifyRequest request = NftVerifyRequest.from(Map.of(
                "walletAddress", " ",
                "contractAddress", "",
                "tokenId", "\t",
                "message", "  ",
                "signature", "",
                "petType", "   "
        ));
        assertThat(request.walletAddress()).isNull();
        assertThat(request.contractAddress()).isNull();
        assertThat(request.tokenId()).isNull();
        assertThat(request.message()).isNull();
        assertThat(request.signature()).isNull();
        assertThat(request.petType()).isNull();
    }

    @Test
    @DisplayName("documented keys round-trip onto getters")
    void from_documentedKeys_roundTrip() {
        NftVerifyRequest request = NftVerifyRequest.from(Map.of(
                "walletAddress", "  0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48  ",
                "contractAddress", "0x1234567890123456789012345678901234567890",
                "tokenId", "1",
                "message", "ComputerPets verify nft 1",
                "signature", "0xabc",
                "petType", "dragon"
        ));
        assertThat(request.walletAddress()).isEqualTo("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
        assertThat(request.contractAddress()).isEqualTo("0x1234567890123456789012345678901234567890");
        assertThat(request.tokenId()).isEqualTo("1");
        assertThat(request.message()).isEqualTo("ComputerPets verify nft 1");
        assertThat(request.signature()).isEqualTo("0xabc");
        assertThat(request.petType()).isEqualTo("dragon");
        assertThat(request.hasSignature()).isTrue();
        assertThat(request.hasMessage()).isTrue();
    }
}
