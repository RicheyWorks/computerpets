package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductionProfileGuardTest {

    @Test
    @DisplayName("prod accepts Postgres + Redis + microsoft.dev-mode=false")
    void safeProductionSettings_pass() {
        ProductionProfileGuard guard = new ProductionProfileGuard(
            false, "redis", "jdbc:postgresql://computerpets-postgres:5432/computerpets");

        assertThatCode(guard::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses Microsoft Store dev-mode")
    void microsoftDevMode_failsHard() {
        ProductionProfileGuard guard = new ProductionProfileGuard(
            true, "redis", "jdbc:postgresql://db:5432/computerpets");

        assertThatThrownBy(guard::rejectUnsafeProductionSettings)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("microsoft.dev-mode");
    }

    @Test
    @DisplayName("prod refuses the in-memory rate-limit store")
    void memoryRateLimit_failsHard() {
        ProductionProfileGuard guard = new ProductionProfileGuard(
            false, "memory", "jdbc:postgresql://db:5432/computerpets");

        assertThatThrownBy(guard::rejectUnsafeProductionSettings)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("rate-limit.backend");
    }

    @Test
    @DisplayName("prod refuses an H2 datasource URL")
    void h2Datasource_failsHard() {
        ProductionProfileGuard guard = new ProductionProfileGuard(
            false, "redis", "jdbc:h2:mem:enterprisepet");

        assertThatThrownBy(guard::rejectUnsafeProductionSettings)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("PostgreSQL");
    }
}
