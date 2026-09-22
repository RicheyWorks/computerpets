package com.enterprisepet.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InMemoryRequestReplayStoreTest {

    private static final String NONCE = "0123456789abcdef";

    @Test
    @DisplayName("the same nonce is single-use on one surface and fresh on the other")
    void singleUsePerSurface() {
        InMemoryRequestReplayStore store = new InMemoryRequestReplayStore();
        assertThat(store.claim(RequestReplayStore.SURFACE_ADMIN, NONCE))
                .isEqualTo(RequestReplayStore.Claim.FRESH);
        assertThat(store.claim(RequestReplayStore.SURFACE_ADMIN, NONCE))
                .isEqualTo(RequestReplayStore.Claim.REPLAY);
        assertThat(store.claim(RequestReplayStore.SURFACE_MACHINE, NONCE))
                .isEqualTo(RequestReplayStore.Claim.FRESH);
        assertThat(store.claim(RequestReplayStore.SURFACE_ADMIN, "fedcba9876543210"))
                .isEqualTo(RequestReplayStore.Claim.FRESH);
    }

    @Test
    @DisplayName("a nonce can be claimed again after the 300 second TTL")
    void expiresWithSkew() {
        Instant start = Instant.parse("2026-09-22T00:00:00Z");
        MutableClock clock = new MutableClock(start);
        InMemoryRequestReplayStore store = new InMemoryRequestReplayStore(clock);
        assertThat(store.claim(RequestReplayStore.SURFACE_MACHINE, NONCE))
                .isEqualTo(RequestReplayStore.Claim.FRESH);
        clock.now = start.plusSeconds(RequestReplayStore.TTL_SECONDS - 1);
        assertThat(store.claim(RequestReplayStore.SURFACE_MACHINE, NONCE))
                .isEqualTo(RequestReplayStore.Claim.REPLAY);
        clock.now = start.plusSeconds(RequestReplayStore.TTL_SECONDS);
        assertThat(store.claim(RequestReplayStore.SURFACE_MACHINE, NONCE))
                .isEqualTo(RequestReplayStore.Claim.FRESH);
    }

    @Test
    @DisplayName("a blank nonce or unknown surface is not a key")
    void refusesBadKeys() {
        InMemoryRequestReplayStore store = new InMemoryRequestReplayStore();
        assertThatThrownBy(() -> store.claim(RequestReplayStore.SURFACE_ADMIN, "short"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> store.claim("download", NONCE))
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
