package com.enterprisepet.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

/**
 * Two ProxyManagers against one Redis share the same 10/min verify bucket.
 * Uses Testcontainers when Docker is available, otherwise localhost:6379.
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RedisRateLimitBackendIT {

    private static final Duration TIMEOUT = Duration.ofMillis(400);

    private GenericContainer<?> redis;
    private String host;
    private int port;

    @BeforeAll
    void startRedis() {
        if (dockerAvailable()) {
            redis = new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);
            redis.start();
            host = redis.getHost();
            port = redis.getMappedPort(6379);
            return;
        }
        if (localRedisUp("127.0.0.1", 6379)) {
            host = "127.0.0.1";
            port = 6379;
            return;
        }
        assumeTrue(false, "Redis is required (Docker or localhost:6379)");
    }

    @AfterAll
    void stopRedis() {
        if (redis != null) {
            redis.stop();
        }
    }

    @Test
    @DisplayName("two backends share one per-IP verify bucket")
    void twoBackends_shareTheSameBucket() {
        RedisClient clientA = redisClient(host, port);
        RedisClient clientB = redisClient(host, port);
        try (RedisRateLimitBackend a = new RedisRateLimitBackend(clientA);
             RedisRateLimitBackend b = new RedisRateLimitBackend(clientB)) {
            String key = "203.0.113.50|verify";
            Duration period = Duration.ofMinutes(1);

            int consumed = 0;
            for (int i = 0; i < 5; i++) {
                assertThat(a.tryConsume(key, 10, period).consumed()).isTrue();
                consumed++;
            }
            for (int i = 0; i < 5; i++) {
                assertThat(b.tryConsume(key, 10, period).consumed()).isTrue();
                consumed++;
            }
            assertThat(consumed).isEqualTo(10);
            assertThat(a.tryConsume(key, 10, period).consumed()).isFalse();
            assertThat(b.tryConsume(key, 10, period).consumed()).isFalse();
        } finally {
            clientA.shutdown();
            clientB.shutdown();
        }
    }

    @Test
    @DisplayName("unreachable Redis is wrapped as RateLimitStoreException")
    void redisDown_throwsStoreException() {
        RedisClient dead = redisClient("127.0.0.1", 1);
        try (RedisRateLimitBackend backend = new RedisRateLimitBackend(dead)) {
            assertThatThrownBy(() -> backend.tryConsume("10.0.0.9|verify", 10, Duration.ofMinutes(1)))
                .isInstanceOf(RateLimitStoreException.class)
                .hasMessageContaining("unavailable");
        } finally {
            dead.shutdown();
        }
    }

    private static RedisClient redisClient(String host, int port) {
        return RedisClient.create(RedisURI.builder()
            .withHost(host)
            .withPort(port)
            .withTimeout(TIMEOUT)
            .build());
    }

    private static boolean dockerAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (RuntimeException e) {
            return false;
        }
    }

    private static boolean localRedisUp(String host, int port) {
        RedisClient client = redisClient(host, port);
        try (var connection = client.connect()) {
            return "PONG".equalsIgnoreCase(connection.sync().ping());
        } catch (RuntimeException e) {
            return false;
        } finally {
            client.shutdown();
        }
    }
}
