package com.enterprisepet.security;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RedisRequestReplayStoreDownTest {

    @Test
    @DisplayName("unreachable Redis fails closed")
    void redisDown_throws() {
        RedisClient dead = RedisClient.create(RedisURI.builder()
                .withHost("127.0.0.1")
                .withPort(1)
                .withTimeout(Duration.ofMillis(100))
                .build());
        try (RedisRequestReplayStore store = new RedisRequestReplayStore(dead)) {
            assertThatThrownBy(() -> store.claim(RequestReplayStore.SURFACE_ADMIN, "0123456789abcdef"))
                    .isInstanceOf(RequestReplayStoreUnavailableException.class)
                    .hasMessageContaining("unavailable");
        } finally {
            dead.shutdown();
        }
    }
}
