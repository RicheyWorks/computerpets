package com.enterprisepet.steam;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SteamVerifyRequestTest {

    @Test
    @DisplayName("from(null) yields null fields")
    void from_nullMap_allNull() {
        SteamVerifyRequest request = SteamVerifyRequest.from(null);
        assertThat(request.steamId()).isNull();
        assertThat(request.appId()).isNull();
    }

    @Test
    @DisplayName("blank strings become null")
    void from_blankStrings_becomeNull() {
        SteamVerifyRequest request = SteamVerifyRequest.from(Map.of(
                "steamId", "   ",
                "appId", ""
        ));
        assertThat(request.steamId()).isNull();
        assertThat(request.appId()).isNull();
    }

    @Test
    @DisplayName("documented keys round-trip onto getters")
    void from_documentedKeys_roundTrip() {
        SteamVerifyRequest request = SteamVerifyRequest.from(Map.of(
                "steamId", "  76561198000000000  ",
                "appId", "123456"
        ));
        assertThat(request.steamId()).isEqualTo("76561198000000000");
        assertThat(request.appId()).isEqualTo("123456");
    }

    @Test
    @DisplayName("unknown keys are ignored")
    void from_unknownKeys_ignored() {
        Map<String, String> body = new HashMap<>();
        body.put("steamId", "76561198000000000");
        body.put("ticket", "not-a-steam-field");
        SteamVerifyRequest request = SteamVerifyRequest.from(body);
        assertThat(request.steamId()).isEqualTo("76561198000000000");
        assertThat(request.appId()).isNull();
    }
}
