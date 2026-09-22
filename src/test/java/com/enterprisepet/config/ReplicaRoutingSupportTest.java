package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReplicaRoutingSupportTest {

    @Test
    @DisplayName("blank replica URL means primary-only")
    void blankReplica_notConfigured() {
        assertThat(ReplicaRoutingSupport.isConfigured(null)).isFalse();
        assertThat(ReplicaRoutingSupport.isConfigured("")).isFalse();
        assertThat(ReplicaRoutingSupport.isConfigured("   ")).isFalse();
        assertThat(ReplicaRoutingSupport.isConfigured("jdbc:postgresql://replica/db")).isTrue();
    }

    @Test
    @DisplayName("writes and non-replica setups always look up primary")
    void lookup_neverRoutesWritesToReplica() {
        assertThat(ReplicaRoutingSupport.lookupKey(false, true))
            .isEqualTo(ReplicaRoutingSupport.LOOKUP_PRIMARY);
        assertThat(ReplicaRoutingSupport.lookupKey(true, false))
            .isEqualTo(ReplicaRoutingSupport.LOOKUP_PRIMARY);
        assertThat(ReplicaRoutingSupport.lookupKey(false, false))
            .isEqualTo(ReplicaRoutingSupport.LOOKUP_PRIMARY);
        assertThat(ReplicaRoutingSupport.lookupKey(true, true))
            .isEqualTo(ReplicaRoutingSupport.LOOKUP_REPLICA);
    }

    @Test
    @DisplayName("identical primary and replica URLs fail clear")
    void sameUrl_failsHard() {
        assertThatThrownBy(() -> ReplicaRoutingSupport.validateDenySafe(
                "jdbc:postgresql://db:5432/computerpets",
                "jdbc:postgresql://db:5432/computerpets"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("must not equal");
    }

    @Test
    @DisplayName("same host with different query still fails when path matches")
    void sameUrlIgnoringQuery_failsHard() {
        assertThatThrownBy(() -> ReplicaRoutingSupport.validateDenySafe(
                "jdbc:postgresql://db:5432/computerpets?ssl=true",
                "jdbc:postgresql://db:5432/computerpets?ssl=false"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("must not equal");
    }

    @Test
    @DisplayName("distinct replica URL is accepted")
    void distinctReplica_passes() {
        assertThatCode(() -> ReplicaRoutingSupport.validateDenySafe(
                "jdbc:postgresql://primary:5432/computerpets",
                "jdbc:postgresql://replica:5432/computerpets"))
            .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("H2 replica URL fails clear")
    void h2Replica_failsHard() {
        assertThatThrownBy(() -> ReplicaRoutingSupport.validateDenySafe(
                "jdbc:postgresql://primary:5432/computerpets",
                "jdbc:h2:mem:replica"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("must not be H2");
    }

    @Test
    @DisplayName("replica without primary fails clear")
    void replicaWithoutPrimary_failsHard() {
        assertThatThrownBy(() -> ReplicaRoutingSupport.validateDenySafe(
                "",
                "jdbc:postgresql://replica:5432/computerpets"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("primary");
    }

    @Test
    @DisplayName("routing datasource uses the same deny-safe lookup")
    void routingDataSource_respectsReadOnlyFlag() {
        ReadWriteRoutingDataSource routing = new ReadWriteRoutingDataSource(true);
        assertThat(routing.determineCurrentLookupKey())
            .isEqualTo(ReplicaRoutingSupport.LOOKUP_PRIMARY);

        TransactionSynchronizationManager.setCurrentTransactionReadOnly(true);
        try {
            assertThat(routing.determineCurrentLookupKey())
                .isEqualTo(ReplicaRoutingSupport.LOOKUP_REPLICA);
        } finally {
            TransactionSynchronizationManager.setCurrentTransactionReadOnly(false);
        }
    }
}
