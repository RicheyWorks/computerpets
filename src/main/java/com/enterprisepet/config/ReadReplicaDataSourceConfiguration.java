package com.enterprisepet.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * When {@code spring.datasource.replica.url} is non-blank, replace Boot's single
 * DataSource with a deny-safe primary + read-only replica router. When the URL
 * is blank (the default), this configuration is inactive and Boot keeps one
 * Hikari pool from {@code spring.datasource.*} — including the documented pool
 * defaults in {@code application.yml}.
 */
@Configuration
@EnableConfigurationProperties(ReplicaDataSourceProperties.class)
public class ReadReplicaDataSourceConfiguration {

    private static final Logger log = LoggerFactory.getLogger(ReadReplicaDataSourceConfiguration.class);

    @Bean(name = "primaryHikariDataSource")
    @ConfigurationProperties("spring.datasource.hikari")
    @Conditional(ReplicaUrlConfiguredCondition.class)
    public HikariDataSource primaryHikariDataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();
    }

    @Bean(name = "replicaHikariDataSource")
    @ConfigurationProperties("spring.datasource.replica.hikari")
    @Conditional(ReplicaUrlConfiguredCondition.class)
    public HikariDataSource replicaHikariDataSource(
            DataSourceProperties primaryProperties,
            ReplicaDataSourceProperties replicaProperties) {
        String username = StringUtils.hasText(replicaProperties.getUsername())
            ? replicaProperties.getUsername()
            : primaryProperties.getUsername();
        String password = StringUtils.hasText(replicaProperties.getPassword())
            ? replicaProperties.getPassword()
            : primaryProperties.getPassword();

        HikariDataSource replica = DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .url(replicaProperties.getUrl().trim())
            .username(username)
            .password(password)
            .driverClassName(resolveDriver(replicaProperties.getUrl(), primaryProperties))
            .build();

        // JDBC-level belt: even a routing mistake must not silently write.
        replica.setReadOnly(true);
        String url = replicaProperties.getUrl().toLowerCase(Locale.ROOT);
        if (url.contains("jdbc:postgresql:")) {
            replica.setConnectionInitSql("SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY");
        }
        return replica;
    }

    @Bean
    @Primary
    @Conditional(ReplicaUrlConfiguredCondition.class)
    public DataSource dataSource(
            DataSourceProperties primaryProperties,
            ReplicaDataSourceProperties replicaProperties,
            @Qualifier("primaryHikariDataSource") HikariDataSource primary,
            @Qualifier("replicaHikariDataSource") HikariDataSource replica) {

        ReplicaRoutingSupport.validateDenySafe(primaryProperties.getUrl(), replicaProperties.getUrl());

        // @ConfigurationProperties may bind after the factory method body on some
        // paths; force the deny-safe flag before the pool is published.
        replica.setReadOnly(true);
        if (!replica.isReadOnly()) {
            throw new IllegalStateException(
                "Replica HikariDataSource must be read-only. Refusing to start so writes "
                + "cannot silently hit a read-only URL.");
        }

        ReadWriteRoutingDataSource routing = new ReadWriteRoutingDataSource(true);
        Map<Object, Object> targets = new HashMap<>();
        targets.put(ReplicaRoutingSupport.LOOKUP_PRIMARY, primary);
        targets.put(ReplicaRoutingSupport.LOOKUP_REPLICA, replica);
        routing.setTargetDataSources(targets);
        routing.setDefaultTargetDataSource(primary);
        routing.afterPropertiesSet();

        log.info("Read-replica routing enabled (writes→primary, @Transactional(readOnly)→replica).");
        return routing;
    }

    private static String resolveDriver(String replicaUrl, DataSourceProperties primaryProperties) {
        if (StringUtils.hasText(primaryProperties.getDriverClassName())) {
            return primaryProperties.getDriverClassName();
        }
        String url = replicaUrl.toLowerCase(Locale.ROOT);
        if (url.contains("jdbc:postgresql:")) {
            return "org.postgresql.Driver";
        }
        if (url.contains("jdbc:h2:")) {
            return "org.h2.Driver";
        }
        return null;
    }
}
