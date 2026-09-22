package com.enterprisepet.bundle;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryDownloadGrantIndexTest {

    private final InMemoryDownloadGrantIndex index = new InMemoryDownloadGrantIndex();

    @Test
    @DisplayName("first redeem succeeds; second redeem is already used")
    void redeem_once_thenDeny() {
        index.issue("jti-1", 1_700_000_000L, "203.0.113.9", Duration.ofMinutes(15));

        assertThat(index.tryRedeem("jti-1", 1_700_000_000L, "203.0.113.9"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.OK);
        assertThat(index.tryRedeem("jti-1", 1_700_000_000L, "203.0.113.9"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.ALREADY_USED);
    }

    @Test
    @DisplayName("bound address mismatch denies without consuming the grant")
    void redeem_addressMismatch_doesNotConsume() {
        index.issue("jti-2", 1_700_000_001L, "203.0.113.9", Duration.ofMinutes(15));

        assertThat(index.tryRedeem("jti-2", 1_700_000_001L, "198.51.100.7"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.ADDRESS_MISMATCH);
        assertThat(index.tryRedeem("jti-2", 1_700_000_001L, "203.0.113.9"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.OK);
    }

    @Test
    @DisplayName("unknown jti+exp is unknown")
    void redeem_unknown() {
        assertThat(index.tryRedeem("missing", 1L, "203.0.113.9"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.UNKNOWN);
    }

    @Test
    @DisplayName("blank bound IP skips address check")
    void redeem_blankBoundIp_skipsMatch() {
        index.issue("jti-3", 1_700_000_002L, "", Duration.ofMinutes(15));
        assertThat(index.tryRedeem("jti-3", 1_700_000_002L, "203.0.113.9"))
            .isEqualTo(DownloadGrantIndex.RedeemResult.OK);
    }
}
