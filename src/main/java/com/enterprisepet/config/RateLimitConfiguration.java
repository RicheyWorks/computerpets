package com.enterprisepet.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(RateLimitProperties.class)
public class RateLimitConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    RateLimitBackend inMemoryRateLimitBackend() {
        return new InMemoryRateLimitBackend();
    }

    @Bean(destroyMethod = "shutdown")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RedisClient rateLimitRedisClient(RateLimitProperties properties) {
        RateLimitProperties.Redis redis = properties.getRedis();
        RedisURI uri = RedisURI.builder()
            .withHost(redis.getHost())
            .withPort(redis.getPort())
            .withTimeout(redis.getTimeout())
            .build();
        return RedisClient.create(uri);
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RateLimitBackend redisRateLimitBackend(RedisClient rateLimitRedisClient) {
        return new RedisRateLimitBackend(rateLimitRedisClient);
    }
}
