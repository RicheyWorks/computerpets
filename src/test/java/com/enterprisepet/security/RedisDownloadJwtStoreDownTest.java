package com.enterprisepet.security;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RedisDownloadJwtStoreDownTest {

    @Test
    @DisplayName("unreachable Redis fails closed")
    void redisDown_throws() {
        RedisClient dead = RedisClient.create(RedisURI.builder()
                .withHost("127.0.0.1")
                .withPort(1)
                .withTimeout(Duration.ofMillis(100))
                .build());
        try (RedisDownloadJwtStore store = new RedisDownloadJwtStore(dead)) {
            assertThatThrownBy(() -> store.claim(UUID.randomUUID().toString(), 60))
                    .isInstanceOf(DownloadJwtStoreUnavailableException.class)
                    .hasMessageContaining("unavailable");
        } finally {
            dead.shutdown();
        }
    }
}
