package com.enterprisepet.security;

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
class RedisDownloadJwtStoreTest {

    private static final Duration TIMEOUT = Duration.ofMillis(400);
    private static final long TTL = 1800 + DownloadJwtStore.SKEW_SECONDS;

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
    @DisplayName("two stores share one claim and the key expires with the download-token TTL")
    void twoStores_shareSingleUse() {
        RedisClient clientA = redisClient(host, port);
        RedisClient clientB = redisClient(host, port);
        String jti = UUID.randomUUID().toString();
        try (RedisDownloadJwtStore a = new RedisDownloadJwtStore(clientA);
             RedisDownloadJwtStore b = new RedisDownloadJwtStore(clientB);
             var conn = clientA.connect()) {
            assertThat(a.claim(jti, TTL)).isEqualTo(DownloadJwtStore.Claim.FRESH);
            assertThat(b.claim(jti, TTL)).isEqualTo(DownloadJwtStore.Claim.REPLAY);
            Long ttl = conn.sync().ttl(DownloadJwtStore.redisKey(jti));
            assertThat(ttl).isBetween(1L, TTL);
            assertThat(conn.sync().get("replay:nonce:admin:" + jti)).isNull();
            assertThat(conn.sync().get("download:grant:" + jti + ":1")).isNull();
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
