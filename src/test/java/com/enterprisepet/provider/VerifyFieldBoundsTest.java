package com.enterprisepet.provider;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class VerifyFieldBoundsTest {

    @Test
    @DisplayName("null values are skipped (required-field checks belong to the caller)")
    void reject_null_isEmpty() {
        assertThat(VerifyFieldBounds.reject(
                "steamId", null, VerifyFieldBounds.STEAM_ID_MAX,
                VerifyFieldBounds.STEAM_ID, "bad")).isEmpty();
    }

    @Test
    @DisplayName("too-long values fail closed with an honest too-long reason (no truncation)")
    void reject_tooLong_reportsTooLong() {
        String oversized = "1".repeat(VerifyFieldBounds.STEAM_ID_MAX + 1);
        assertThat(VerifyFieldBounds.reject(
                "steamId", oversized, VerifyFieldBounds.STEAM_ID_MAX,
                VerifyFieldBounds.STEAM_ID, "steamId must be numeric"))
                .contains("steamId too long");
    }

    @Test
    @DisplayName("charset failures keep the caller hint")
    void reject_badCharset_keepsHint() {
        assertThat(VerifyFieldBounds.reject(
                "steamId", "not-digits", VerifyFieldBounds.STEAM_ID_MAX,
                VerifyFieldBounds.STEAM_ID, "steamId must be a numeric SteamID64"))
                .contains("steamId must be a numeric SteamID64");
    }

    @Test
    @DisplayName("injection-shaped itch download keys are rejected before any outbound call")
    void itchDownloadKey_rejectsPathJunk() {
        assertThat(VerifyFieldBounds.reject(
                "downloadKey", "../etc/passwd", VerifyFieldBounds.ITCH_DOWNLOAD_KEY_MAX,
                VerifyFieldBounds.ITCH_DOWNLOAD_KEY, "bad downloadKey"))
                .isPresent();
        assertThat(VerifyFieldBounds.reject(
                "downloadKey", "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z",
                VerifyFieldBounds.ITCH_DOWNLOAD_KEY_MAX,
                VerifyFieldBounds.ITCH_DOWNLOAD_KEY, "bad downloadKey"))
                .isEmpty();
    }

    @Test
    @DisplayName("epic account ids must be exactly 32 hex characters")
    void epicAccountId_requires32Hex() {
        assertThat(VerifyFieldBounds.reject(
                "accountId", "9626f441055349ce8cb7d7d5a483eaa2",
                VerifyFieldBounds.EPIC_ACCOUNT_ID_MAX,
                VerifyFieldBounds.EPIC_ACCOUNT_ID, "bad account"))
                .isEmpty();
        assertThat(VerifyFieldBounds.reject(
                "accountId", "too-short",
                VerifyFieldBounds.EPIC_ACCOUNT_ID_MAX,
                VerifyFieldBounds.EPIC_ACCOUNT_ID, "bad account"))
                .isPresent();
    }
}
