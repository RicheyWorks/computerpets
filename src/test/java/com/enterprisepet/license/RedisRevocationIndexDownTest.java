package com.enterprisepet.license;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RedisRevocationIndexDownTest {

    @Test
    @DisplayName("unreachable Redis is wrapped as RevocationIndexUnavailableException")
    void redisDown_throwsUnavailable() {
        RedisClient dead = RedisClient.create(RedisURI.builder()
            .withHost("127.0.0.1")
            .withPort(1)
            .withTimeout(Duration.ofMillis(100))
            .build());
        try (RedisRevocationIndex index = new RedisRevocationIndex(dead)) {
            assertThatThrownBy(() -> index.isDenied("any-jti"))
                .isInstanceOf(RevocationIndexUnavailableException.class)
                .hasMessageContaining("unavailable");
            assertThatThrownBy(() -> index.deny("any-jti", Duration.ofHours(1)))
                .isInstanceOf(RevocationIndexUnavailableException.class)
                .hasMessageContaining("unavailable");
        } finally {
            dead.shutdown();
        }
    }
}
