package com.enterprisepet.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Fail-hard checks that only run when {@code spring.profiles.active} includes
 * {@code prod}. Environment variables outrank {@code application-prod.yml}, so
 * this guard exists to catch {@code MICROSOFT_DEV_MODE=true},
 * {@code RATE_LIMIT_BACKEND=memory}, or an H2 {@code SPRING_DATASOURCE_URL}.
 */
@Component
@Profile("prod")
public class ProductionProfileGuard {

    private static final Logger log = LoggerFactory.getLogger(ProductionProfileGuard.class);

    private final boolean microsoftDevMode;
    private final String rateLimitBackend;
    private final String datasourceUrl;

    public ProductionProfileGuard(
            @Value("${microsoft.dev-mode:false}") boolean microsoftDevMode,
            @Value("${rate-limit.backend:redis}") String rateLimitBackend,
            @Value("${spring.datasource.url}") String datasourceUrl) {
        this.microsoftDevMode = microsoftDevMode;
        this.rateLimitBackend = rateLimitBackend;
        this.datasourceUrl = datasourceUrl;
    }

    @PostConstruct
    void rejectUnsafeProductionSettings() {
        if (microsoftDevMode) {
            throw new IllegalStateException(
                "microsoft.dev-mode is true while spring.profiles.active=prod. "
                + "Microsoft Store ownership would be granted without verification. "
                + "Unset MICROSOFT_DEV_MODE.");
        }
        if (!RateLimitProperties.BACKEND_REDIS.equalsIgnoreCase(rateLimitBackend)) {
            throw new IllegalStateException(
                "rate-limit.backend must be redis when spring.profiles.active=prod "
                + "(got '" + rateLimitBackend + "'). memory is not shared across replicas.");
        }
        if (datasourceUrl == null || datasourceUrl.isBlank()
                || datasourceUrl.toLowerCase(Locale.ROOT).contains("jdbc:h2:")) {
            throw new IllegalStateException(
                "spring.datasource.url must be PostgreSQL when spring.profiles.active=prod. "
                + "Set SPRING_DATASOURCE_URL (jdbc:postgresql://...). H2 is not allowed.");
        }
        log.info("Production profile guard passed (Postgres, Redis, microsoft.dev-mode=false).");
    }
}
