package com.enterprisepet.provider;

import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

/**
 * Shared Resilience4j time limiter for store ownership probes.
 *
 * <p>RestClient (and Microsoft Collections) already own the <strong>per-HTTP</strong>
 * ten-second connect and read deadline. This tool is the <strong>outer wall clock</strong>
 * for one ownership probe: Steam / Itch / Epic / Microsoft share one instance
 * ({@link #INSTANCE}). Epic's token hop plus ownership hop share that same wall,
 * so two ten-second HTTP deadlines cannot stack open the verify path.
 *
 * <p>On exceed the probe returns the deny-safe value the caller passed
 * ({@code false} or {@link java.util.Optional#empty()}) — never an invented grant.
 * Circuit breaker and retry stay as they are; this does not add a retry budget.
 *
 * <p>When the tool is not injected (focused unit tests that construct a provider
 * with {@code new}), {@link #guard} runs the probe directly.
 */
@Component
public class OwnershipTimeLimiter {

    private static final Logger log = LoggerFactory.getLogger(OwnershipTimeLimiter.class);

    /** Shared Resilience4j instance name in {@code application.yml}. */
    public static final String INSTANCE = "ownership";

    /**
     * Outer wall clock for one ownership probe. Sits just outside the ten-second
     * RestClient hop so the HTTP deadline usually fires first on a single call,
     * while stacked hops (Epic token + ownership) still cannot hang past this wall.
     */
    public static final Duration OWNERSHIP_WALL = Duration.ofSeconds(12);

    private final TimeLimiter timeLimiter;
    private final ExecutorService workers;

    public OwnershipTimeLimiter(TimeLimiterRegistry registry) {
        this.timeLimiter = registry.timeLimiter(INSTANCE);
        AtomicInteger n = new AtomicInteger();
        ThreadFactory factory = r -> {
            Thread t = new Thread(r, "ownership-timelimiter-" + n.incrementAndGet());
            t.setDaemon(true);
            return t;
        };
        this.workers = Executors.newCachedThreadPool(factory);
    }

    /**
     * Package-visible constructor for focused tests with a custom registry.
     */
    OwnershipTimeLimiter(TimeLimiterRegistry registry, ExecutorService workers) {
        this.timeLimiter = registry.timeLimiter(INSTANCE);
        this.workers = workers;
    }

    /**
     * Run {@code probe} under the shared wall. On timeout or limiter failure,
     * return {@code onExceed} (deny-safe). Does not invent a grant.
     */
    public <T> T call(String provider, Supplier<T> probe, T onExceed) {
        try {
            return timeLimiter.executeFutureSupplier(() -> workers.submit(probe::get));
        } catch (Exception e) {
            log.warn("Ownership time limiter exceeded or failed provider={}: {}",
                    provider, e.toString());
            return onExceed;
        }
    }

    /**
     * Prefer the shared bean when present; otherwise run {@code probe} directly
     * (unit tests that construct a provider without Spring).
     */
    public static <T> T guard(OwnershipTimeLimiter limiter, String provider,
                              Supplier<T> probe, T onExceed) {
        if (limiter == null) {
            return probe.get();
        }
        return limiter.call(provider, probe, onExceed);
    }

    @PreDestroy
    void shutdown() {
        workers.shutdownNow();
    }
}
