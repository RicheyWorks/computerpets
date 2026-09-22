package com.enterprisepet.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Per-IP token-bucket rate limiter for public API surfaces. Each protected route has
 * its own (capacity, refill period) tuple; an IP exceeding the bucket gets
 * {@code 429 Too Many Requests} with a {@code Retry-After} header and a
 * {@code application/problem+json} body.
 *
 * <p>Default store is Redis ({@code bucket4j-redis} + Lettuce) so replicas share
 * the same 10/min verify, 30/min download, and 60/min discovery budgets. If Redis
 * is unreachable the filter fail-closes with {@code 503 Service Unavailable} and
 * {@code Retry-After} — it does not fall back to a per-instance memory bucket,
 * which would silently lift the shared limit.
 *
 * <p>Client identity is {@link ClientAddress} (trusted-proxy CIDRs only; ADR 0067).
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    /**
     * Buckets are namespaced by {@code clientId + "|" + rule.bucketKey}.
     * Capacity is generous — these limits are abuse-prevention, not metering.
     * Discovery uses prefix {@code /api/pets} (covers list, by-rarity, and detail).
     */
    static final List<Rule> RULES = List.of(
        new Rule("/api/verify/",   "verify",    10, Duration.ofMinutes(1)),
        new Rule("/api/download/", "download",  30, Duration.ofMinutes(1)),
        new Rule("/api/pets",      "discovery", 60, Duration.ofMinutes(1))
    );

    private final RateLimitBackend backend;
    private final RateLimitProperties properties;
    private final ClientAddress clientAddress;

    public RateLimitingFilter(RateLimitBackend backend, RateLimitProperties properties,
                              ClientAddress clientAddress) {
        this.backend = backend;
        this.properties = properties;
        this.clientAddress = clientAddress;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        Rule rule = ruleFor(req.getRequestURI());
        if (rule == null) {
            chain.doFilter(req, res);
            return;
        }

        String client = clientAddress.from(req);
        String bucketKey = client + "|" + rule.bucketKey;
        RateLimitBackend.Probe probe;
        try {
            probe = backend.tryConsume(bucketKey, rule.capacity, rule.period);
        } catch (RuntimeException e) {
            int retryAfter = Math.max(1, properties.getFailClosedRetryAfterSeconds());
            log.warn("Rate limiter unavailable clientId={} rule={} retryAfter={}s",
                client, rule.bucketKey, retryAfter, e);
            writeProblem(res, 503, "Service Unavailable",
                "Rate limiter unavailable. Retry after %d seconds.".formatted(retryAfter),
                retryAfter);
            return;
        }

        if (probe.consumed()) {
            res.setHeader("X-RateLimit-Remaining", String.valueOf(probe.remainingTokens()));
            chain.doFilter(req, res);
            return;
        }

        long retryAfterSeconds = TimeUnit.NANOSECONDS.toSeconds(probe.nanosToWaitForRefill()) + 1;
        log.info("Rate limit exceeded clientId={} rule={} retryAfter={}s",
            client, rule.bucketKey, retryAfterSeconds);

        writeProblem(res, 429, "Too Many Requests",
            "Rate limit exceeded for %s. Retry after %d seconds.".formatted(rule.bucketKey, retryAfterSeconds),
            retryAfterSeconds);
    }

    private static void writeProblem(HttpServletResponse res, int status, String title,
                                     String detail, long retryAfterSeconds) throws IOException {
        res.setStatus(status);
        res.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSeconds));
        res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        res.getWriter().write(String.format(
            "{\"type\":\"about:blank\",\"title\":\"%s\",\"status\":%d,"
                + "\"detail\":\"%s\","
                + "\"retryAfterSeconds\":%d}",
            title, status, detail, retryAfterSeconds));
    }

    private static Rule ruleFor(String path) {
        for (Rule r : RULES) {
            if (path.startsWith(r.pathPrefix)) return r;
        }
        return null;
    }

    /** Path prefix → (capacity, refill window). */
    record Rule(String pathPrefix, String bucketKey, long capacity, Duration period) {}
}
