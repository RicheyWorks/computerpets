package com.enterprisepet.provider;

import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;

class OwnershipTimeLimiterTest {

    private ExecutorService workers;
    private OwnershipTimeLimiter limiter;

    @AfterEach
    void tearDown() {
        if (limiter != null) {
            limiter.shutdown();
        }
        if (workers != null) {
            workers.shutdownNow();
        }
    }

    @Test
    @DisplayName("shared wall is twelve seconds — outside the ten-second RestClient hop")
    void wallSitsOutsideRestClientHop() {
        assertThat(OwnershipTimeLimiter.OWNERSHIP_WALL).isEqualTo(Duration.ofSeconds(12));
        assertThat(OwnershipTimeLimiter.INSTANCE).isEqualTo("ownership");
    }

    @Test
    @DisplayName("a fast probe returns its value")
    void fastProbeReturnsValue() {
        limiter = shortLimiter(Duration.ofMillis(200));
        assertThat(limiter.call("steam", () -> true, false)).isTrue();
        assertThat(limiter.call("itch", () -> Optional.of("itch:1"), Optional.empty()))
                .contains("itch:1");
    }

    @Test
    @DisplayName("a hang returns the deny-safe value — never invents a grant")
    void hangReturnsDenySafe() throws Exception {
        limiter = shortLimiter(Duration.ofMillis(80));
        AtomicBoolean finished = new AtomicBoolean(false);

        boolean granted = limiter.call("epic", () -> {
            try {
                Thread.sleep(500);
                finished.set(true);
                return true;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return true;
            }
        }, false);

        assertThat(granted).isFalse();
        assertThat(finished.get()).isFalse();

        Optional<String> owner = limiter.call("microsoft", () -> {
            try {
                Thread.sleep(500);
                return Optional.of("ms:invented");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return Optional.of("ms:invented");
            }
        }, Optional.empty());

        assertThat(owner).isEmpty();
    }

    @Test
    @DisplayName("guard without a bean runs the probe directly")
    void guardNullPassthrough() {
        assertThat(OwnershipTimeLimiter.guard(null, "steam", () -> true, false)).isTrue();
        assertThat(OwnershipTimeLimiter.guard(null, "itch", Optional::empty, Optional.of("x")))
                .isEmpty();
    }

    private OwnershipTimeLimiter shortLimiter(Duration wall) {
        TimeLimiterConfig config = TimeLimiterConfig.custom()
                .timeoutDuration(wall)
                .cancelRunningFuture(true)
                .build();
        TimeLimiterRegistry registry = TimeLimiterRegistry.of(
                java.util.Map.of(OwnershipTimeLimiter.INSTANCE, config));
        // Ensure the named instance exists even if of(map) keys differ by impl.
        registry.timeLimiter(OwnershipTimeLimiter.INSTANCE, config);
        workers = Executors.newCachedThreadPool(r -> {
            Thread t = new Thread(r, "ownership-timelimiter-test");
            t.setDaemon(true);
            return t;
        });
        return new OwnershipTimeLimiter(registry, workers);
    }
}
