package com.enterprisepet.config;

import java.util.Locale;
import java.util.Objects;

/**
 * Deny-safe helpers for optional read-replica routing. Pure so unit tests can
 * prove writes never look up the replica key and misconfigured URLs fail clear.
 */
public final class ReplicaRoutingSupport {

    public static final String LOOKUP_PRIMARY = "primary";
    public static final String LOOKUP_REPLICA = "replica";

    private ReplicaRoutingSupport() {
    }

    public static boolean isConfigured(String replicaUrl) {
        return replicaUrl != null && !replicaUrl.isBlank();
    }

    /**
     * Lookup key for {@link org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource}.
     * Non-read-only work (and any work when no replica is configured) always
     * resolves to the primary — never the replica.
     */
    public static String lookupKey(boolean readOnlyTransaction, boolean replicaConfigured) {
        if (readOnlyTransaction && replicaConfigured) {
            return LOOKUP_REPLICA;
        }
        return LOOKUP_PRIMARY;
    }

    /**
     * Refuse configurations that would confuse primary with a read-only URL.
     *
     * @throws IllegalStateException when the replica URL is unusable
     */
    public static void validateDenySafe(String primaryUrl, String replicaUrl) {
        if (!isConfigured(replicaUrl)) {
            return;
        }
        if (primaryUrl == null || primaryUrl.isBlank()) {
            throw new IllegalStateException(
                "spring.datasource.replica.url is set but spring.datasource.url is blank. "
                + "A read replica cannot be the only datasource — unset SPRING_DATASOURCE_REPLICA_URL "
                + "or set the primary URL.");
        }
        String primaryNorm = normalizeJdbcUrl(primaryUrl);
        String replicaNorm = normalizeJdbcUrl(replicaUrl);
        if (Objects.equals(primaryNorm, replicaNorm)) {
            throw new IllegalStateException(
                "spring.datasource.replica.url must not equal spring.datasource.url. "
                + "Pointing both at the same JDBC URL would treat a possible read-only endpoint "
                + "as writable. Set a distinct read-replica URL or leave the replica unset.");
        }
        if (replicaNorm.contains("jdbc:h2:")) {
            throw new IllegalStateException(
                "spring.datasource.replica.url must not be H2. "
                + "Unset SPRING_DATASOURCE_REPLICA_URL or point it at a Postgres read replica.");
        }
    }

    static String normalizeJdbcUrl(String url) {
        String trimmed = url.trim();
        int query = trimmed.indexOf('?');
        if (query >= 0) {
            trimmed = trimmed.substring(0, query);
        }
        return trimmed.toLowerCase(Locale.ROOT);
    }
}
