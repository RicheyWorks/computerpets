package com.enterprisepet.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Readiness signal for the shared rate-limit store. DOWN means verify/download
 * will fail closed (503) until Redis is reachable again.
 */
@Component
@ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
public class RedisRateLimitHealthIndicator implements HealthIndicator {

    private final RedisClient redisClient;

    public RedisRateLimitHealthIndicator(RedisClient rateLimitRedisClient) {
        this.redisClient = rateLimitRedisClient;
    }

    @Override
    public Health health() {
        try (StatefulRedisConnection<String, String> connection = redisClient.connect()) {
            String pong = connection.sync().ping();
            return Health.up()
                .withDetail("ping", pong)
                .withDetail("store", "redis")
                .build();
        } catch (RuntimeException e) {
            return Health.down(e)
                .withDetail("reason", "Redis unreachable; rate limiter fail-closed")
                .withDetail("store", "redis")
                .build();
        }
    }
}
