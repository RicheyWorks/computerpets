package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class InMemoryRateLimitBackendTest {

    @Test
    @DisplayName("verify bucket allows 10 then denies")
    void verifyBucket_allowThenDeny() {
        InMemoryRateLimitBackend backend = new InMemoryRateLimitBackend();
        Duration period = Duration.ofMinutes(1);

        for (int i = 0; i < 10; i++) {
            RateLimitBackend.Probe probe = backend.tryConsume("127.0.0.1|verify", 10, period);
            assertThat(probe.consumed()).isTrue();
            assertThat(probe.remainingTokens()).isEqualTo(9 - i);
        }

        RateLimitBackend.Probe denied = backend.tryConsume("127.0.0.1|verify", 10, period);
        assertThat(denied.consumed()).isFalse();
        assertThat(denied.nanosToWaitForRefill()).isPositive();
    }

    @Test
    @DisplayName("verify and download buckets are independent")
    void differentRules_doNotShareTokens() {
        InMemoryRateLimitBackend backend = new InMemoryRateLimitBackend();
        Duration period = Duration.ofMinutes(1);

        for (int i = 0; i < 10; i++) {
            assertThat(backend.tryConsume("10.0.0.1|verify", 10, period).consumed()).isTrue();
        }
        assertThat(backend.tryConsume("10.0.0.1|verify", 10, period).consumed()).isFalse();
        assertThat(backend.tryConsume("10.0.0.1|download", 30, period).consumed()).isTrue();
    }
}
