package com.enterprisepet.license;

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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

/**
 * Two RevocationIndex instances against one Redis share the same jti deny-list.
 * Uses localhost:6379 when present, otherwise Testcontainers.
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RedisRevocationIndexTest {

    private static final Duration TIMEOUT = Duration.ofMillis(400);

    private GenericContainer<?> redis;
    private String host;
    private int port;

    @BeforeAll
    void startRedis() {
        if (localRedisUp("127.0.0.1", 6379)) {
            host = "127.0.0.1";
            port = 6379;
            return;
        }
        if (dockerAvailable()) {
            redis = new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);
            redis.start();
            host = redis.getHost();
            port = redis.getMappedPort(6379);
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
    @DisplayName("two indexes share one jti deny-list")
    void twoIndexes_shareTheSameDenial() {
        RedisClient clientA = redisClient(host, port);
        RedisClient clientB = redisClient(host, port);
        try (RedisRevocationIndex a = new RedisRevocationIndex(clientA);
             RedisRevocationIndex b = new RedisRevocationIndex(clientB)) {
            String jti = UUID.randomUUID().toString();
            assertThat(a.isDenied(jti)).isFalse();
            assertThat(b.isDenied(jti)).isFalse();

            a.deny(jti, Duration.ofHours(1));

            assertThat(a.isDenied(jti)).isTrue();
            assertThat(b.isDenied(jti)).isTrue();
        } finally {
            clientA.shutdown();
            clientB.shutdown();
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
