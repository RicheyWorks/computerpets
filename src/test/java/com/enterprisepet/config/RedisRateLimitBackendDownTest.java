package com.enterprisepet.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RedisRateLimitBackendDownTest {

    @Test
    @DisplayName("unreachable Redis is wrapped as RateLimitStoreException")
    void redisDown_throwsStoreException() {
        RedisClient dead = RedisClient.create(RedisURI.builder()
            .withHost("127.0.0.1")
            .withPort(1)
            .withTimeout(Duration.ofMillis(100))
            .build());
        try (RedisRateLimitBackend backend = new RedisRateLimitBackend(dead)) {
            assertThatThrownBy(() -> backend.tryConsume("10.0.0.9|verify", 10, Duration.ofMinutes(1)))
                .isInstanceOf(RateLimitStoreException.class)
                .hasMessageContaining("unavailable");
        } finally {
            dead.shutdown();
        }
    }
}
