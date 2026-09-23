package com.enterprisepet.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@EnableConfigurationProperties(RateLimitProperties.class)
public class RateLimitConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    RateLimitBackend inMemoryRateLimitBackend() {
        return new InMemoryRateLimitBackend();
    }

    /**
     * One Lettuce client for rate limits, the jti deny-list, nonces, download
     * JWTs, and grants. AUTH and transit TLS live on this URI (ADR 0075).
     * Jedis is not on the classpath — a second client would split the settings.
     */
    @Bean(destroyMethod = "shutdown")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RedisClient rateLimitRedisClient(RateLimitProperties properties) {
        return RedisClient.create(redisUri(properties.getRedis()));
    }

    /**
     * redis-auth ADR 0075. Blank password and {@code ssl=false} match local
     * Redis. {@code auth-required} refuses a missing password or cleartext AUTH.
     * TLS is direct ({@code rediss}), peer-verified, not STARTTLS.
     */
    static RedisURI redisUri(RateLimitProperties.Redis redis) {
        if (redis.isAuthRequired() && !redis.hasPassword()) {
            throw new IllegalStateException(
                "rate-limit.redis.auth-required is true but REDIS_PASSWORD is blank. "
                    + "Refusing to start — an AUTH-required Redis with no password is fail-open. "
                    + "Set REDIS_PASSWORD or REDIS_PASSWORD_FILE, or unset REDIS_AUTH_REQUIRED "
                    + "for local Redis without AUTH (ADR 0075).");
        }
        if (redis.isAuthRequired() && !redis.isSsl()) {
            throw new IllegalStateException(
                "rate-limit.redis.auth-required is true but REDIS_SSL is false. "
                    + "Refusing cleartext AUTH. Set REDIS_SSL=true (ADR 0075).");
        }
        RedisURI.Builder builder = RedisURI.builder()
            .withHost(redis.getHost())
            .withPort(redis.getPort())
            .withTimeout(redis.getTimeout());
        if (redis.isSsl()) {
            builder.withSsl(true);
            builder.withVerifyPeer(true);
        }
        char[] password = redis.passwordChars();
        try {
            if (password.length > 0) {
                builder.withPassword(password);
            }
            return builder.build();
        } finally {
            Arrays.fill(password, '\0');
        }
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RateLimitBackend redisRateLimitBackend(RedisClient rateLimitRedisClient) {
        return new RedisRateLimitBackend(rateLimitRedisClient);
    }
}
