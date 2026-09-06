package com.enterprisepet.itch;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class ItchVerifyRequestTest {

    @Test
    @DisplayName("from(null) yields null fields")
    void from_nullMap_allNull() {
        ItchVerifyRequest request = ItchVerifyRequest.from(null);
        assertThat(request.gameId()).isNull();
        assertThat(request.downloadKey()).isNull();
    }

    @Test
    @DisplayName("blank strings become null")
    void from_blankStrings_becomeNull() {
        ItchVerifyRequest request = ItchVerifyRequest.from(Map.of(
                "gameId", " ",
                "downloadKey", "\t"
        ));
        assertThat(request.gameId()).isNull();
        assertThat(request.downloadKey()).isNull();
    }

    @Test
    @DisplayName("documented keys round-trip onto getters")
    void from_documentedKeys_roundTrip() {
        ItchVerifyRequest request = ItchVerifyRequest.from(Map.of(
                "gameId", "  3  ",
                "downloadKey", "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z"
        ));
        assertThat(request.gameId()).isEqualTo("3");
        assertThat(request.downloadKey()).isEqualTo("YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z");
    }
}
