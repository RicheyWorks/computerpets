package com.enterprisepet.config;

import com.enterprisepet.license.InMemoryRevocationIndex;
import com.enterprisepet.license.RedisRevocationIndex;
import com.enterprisepet.license.RevocationIndex;
import io.lettuce.core.RedisClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Shared jti deny-list. Uses the same Redis as the rate limiter when
 * {@code rate-limit.backend=redis}; in-memory only for tests / a single local process.
 */
@Configuration
public class RevocationIndexConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    RevocationIndex inMemoryRevocationIndex() {
        return new InMemoryRevocationIndex();
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RevocationIndex redisRevocationIndex(RedisClient rateLimitRedisClient) {
        return new RedisRevocationIndex(rateLimitRedisClient);
    }
}
