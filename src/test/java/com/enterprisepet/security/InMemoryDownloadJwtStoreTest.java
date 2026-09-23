package com.enterprisepet.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InMemoryDownloadJwtStoreTest {

    @Test
    @DisplayName("the same jti is single-use until the TTL elapses")
    void singleUseUntilTtl() {
        Instant start = Instant.parse("2026-09-23T00:00:00Z");
        MutableClock clock = new MutableClock(start);
        InMemoryDownloadJwtStore store = new InMemoryDownloadJwtStore(clock);
        String jti = UUID.randomUUID().toString();

        assertThat(store.claim(jti, 1800)).isEqualTo(DownloadJwtStore.Claim.FRESH);
        clock.now = start.plusSeconds(1799);
        assertThat(store.claim(jti, 1800)).isEqualTo(DownloadJwtStore.Claim.REPLAY);
        clock.now = start.plusSeconds(1800);
        assertThat(store.claim(jti, 1800)).isEqualTo(DownloadJwtStore.Claim.FRESH);
    }

    @Test
    @DisplayName("a second jti is a different claim")
    void distinctJti() {
        InMemoryDownloadJwtStore store = new InMemoryDownloadJwtStore();
        assertThat(store.claim(UUID.randomUUID().toString(), 60)).isEqualTo(DownloadJwtStore.Claim.FRESH);
        assertThat(store.claim(UUID.randomUUID().toString(), 60)).isEqualTo(DownloadJwtStore.Claim.FRESH);
    }

    @Test
    @DisplayName("a blank or non-UUID jti is not a key")
    void refusesBadKeys() {
        InMemoryDownloadJwtStore store = new InMemoryDownloadJwtStore();
        assertThat(DownloadJwtStore.isJti(null)).isFalse();
        assertThat(DownloadJwtStore.isJti("not-a-uuid")).isFalse();
        assertThatThrownBy(() -> store.claim("not-a-uuid", 60))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> store.claim(UUID.randomUUID().toString(), 0))
                .isInstanceOf(IllegalArgumentException.class);
    }

    private static final class MutableClock extends Clock {
        private Instant now;

        MutableClock(Instant now) {
            this.now = now;
        }

        @Override
        public ZoneOffset getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(java.time.ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
