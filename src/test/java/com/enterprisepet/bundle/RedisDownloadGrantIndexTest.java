package com.enterprisepet.bundle;

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

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RedisDownloadGrantIndexTest {

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
    @DisplayName("two indexes share one-time redeem of the same jti+exp")
    void twoIndexes_shareOneTimeRedeem() {
        RedisClient clientA = redisClient(host, port);
        RedisClient clientB = redisClient(host, port);
        try (RedisDownloadGrantIndex a = new RedisDownloadGrantIndex(clientA);
             RedisDownloadGrantIndex b = new RedisDownloadGrantIndex(clientB)) {
            String jti = UUID.randomUUID().toString();
            long exp = 1_800_000_000L;
            a.issue(jti, exp, "203.0.113.9", Duration.ofMinutes(15));

            assertThat(b.tryRedeem(jti, exp, "203.0.113.9"))
                .isEqualTo(DownloadGrantIndex.RedeemResult.OK);
            assertThat(a.tryRedeem(jti, exp, "203.0.113.9"))
                .isEqualTo(DownloadGrantIndex.RedeemResult.ALREADY_USED);
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

    private static boolean localRedisUp(String host, int port) {
        try (RedisClient probe = redisClient(host, port);
             var conn = probe.connect()) {
            return "PONG".equalsIgnoreCase(conn.sync().ping());
        } catch (RuntimeException e) {
            return false;
        }
    }

    private static boolean dockerAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (Throwable t) {
            return false;
        }
    }
}
