package com.enterprisepet.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * Routes {@code @Transactional(readOnly=true)} work (including Spring Data JPA
 * reads) to the optional replica pool. Everything else — writes, non-transactional
 * JDBC (Flyway), and read-write transactions — stays on the primary.
 */
public class ReadWriteRoutingDataSource extends AbstractRoutingDataSource {

    private final boolean replicaConfigured;

    public ReadWriteRoutingDataSource(boolean replicaConfigured) {
        this.replicaConfigured = replicaConfigured;
    }

    @Override
    protected Object determineCurrentLookupKey() {
        boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
        return ReplicaRoutingSupport.lookupKey(readOnly, replicaConfigured);
    }
}
