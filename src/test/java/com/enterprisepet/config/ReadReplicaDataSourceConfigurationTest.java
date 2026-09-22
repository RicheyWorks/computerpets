package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;

class ReadReplicaDataSourceConfigurationTest {

    private final ApplicationContextRunner runner = new ApplicationContextRunner()
        .withConfiguration(AutoConfigurations.of(
            DataSourceAutoConfiguration.class,
            DataSourceTransactionManagerAutoConfiguration.class))
        .withUserConfiguration(ReadReplicaDataSourceConfiguration.class)
        .withPropertyValues(
            "spring.datasource.url=jdbc:h2:mem:primary;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
            "spring.datasource.username=sa",
            "spring.datasource.password=",
            "spring.datasource.driver-class-name=org.h2.Driver",
            "spring.datasource.hikari.maximum-pool-size=2",
            "spring.datasource.hikari.minimum-idle=0");

    @Test
    @DisplayName("blank replica URL keeps a single Boot-managed DataSource")
    void blankReplica_singleDataSource() {
        runner.withPropertyValues("spring.datasource.replica.url=")
            .run(context -> {
                assertThat(context).hasNotFailed();
                assertThat(context).hasSingleBean(DataSource.class);
                assertThat(context).doesNotHaveBean("replicaHikariDataSource");
                assertThat(context.getBean(DataSource.class))
                    .isNotInstanceOf(ReadWriteRoutingDataSource.class);
            });
    }

    @Test
    @DisplayName("identical replica URL fails clear at startup")
    void sameReplicaUrl_failsStartup() {
        runner.withPropertyValues(
                "spring.datasource.url=jdbc:h2:mem:same;DB_CLOSE_DELAY=-1",
                "spring.datasource.replica.url=jdbc:h2:mem:same;DB_CLOSE_DELAY=-1")
            .run(context -> assertThat(context).hasFailed());
    }

    @Test
    @DisplayName("H2 replica URL fails clear even when distinct from primary")
    void h2Replica_failsStartup() {
        runner.withPropertyValues(
                "spring.datasource.replica.url=jdbc:h2:mem:replica;DB_CLOSE_DELAY=-1")
            .run(context -> {
                assertThat(context).hasFailed();
                assertThat(context.getStartupFailure())
                    .hasStackTraceContaining("must not be H2");
            });
    }
}
