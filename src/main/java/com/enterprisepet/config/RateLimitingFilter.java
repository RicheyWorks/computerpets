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
 * the same 10/min verify, 30/min download, 60/min discovery, and 60/min bundle
 * catalog budgets. If Redis is unreachable the filter fail-closes with
 * {@code 503 Service Unavailable} and {@code Retry-After} — it does not fall
 * back to a per-instance memory bucket, which would silently lift the shared limit.
 *
 * <p>Client identity is {@link ClientAddress} (trusted-proxy CIDRs only; ADR 0067).
 * {@code GET /api/bundles/{petKey}/redeem} is not a catalog read: signed grant
 * redeem stays outside the bundles bucket (ADR 0069).
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    /**
     * Buckets are namespaced by {@code clientId + "|" + rule.bucketKey}.
     * Capacity is generous — these limits are abuse-prevention, not metering.
     * Discovery uses prefix {@code /api/pets} (covers list, by-rarity, and detail).
     * Bundle catalog uses prefix {@code /api/bundles/} (one pet segment, and any
     * other non-redeem path under that prefix). Signed redeem is excluded in
     * {@link #ruleFor(String)}.
     */
    static final List<Rule> RULES = List.of(
        new Rule("/api/verify/",   "verify",    10, Duration.ofMinutes(1)),
        new Rule("/api/download/", "download",  30, Duration.ofMinutes(1)),
        new Rule("/api/pets",      "discovery", 60, Duration.ofMinutes(1)),
        new Rule("/api/bundles/",  "bundles",   60, Duration.ofMinutes(1))
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

    static Rule ruleFor(String path) {
        if (path == null) {
            return null;
        }
        int query = path.indexOf('?');
        if (query >= 0) {
            path = path.substring(0, query);
        }
        if (isSignedBundleRedeem(path)) {
            return null;
        }
        for (Rule r : RULES) {
            if (path.startsWith(r.pathPrefix)) return r;
        }
        return null;
    }

    /**
     * {@code GET /api/bundles/{petKey}/redeem} (optional trailing slash).
     * One pet segment, then {@code redeem}. Catalog reads such as
     * {@code /api/bundles/{petKey}} are not redeem.
     */
    static boolean isSignedBundleRedeem(String path) {
        if (path == null || !path.startsWith("/api/bundles/")) {
            return false;
        }
        String rest = path.substring("/api/bundles/".length());
        int slash = rest.indexOf('/');
        if (slash <= 0) {
            return false;
        }
        String tail = rest.substring(slash + 1);
        if (tail.endsWith("/")) {
            tail = tail.substring(0, tail.length() - 1);
        }
        return "redeem".equals(tail);
    }

    /** Path prefix → (capacity, refill window). */
    record Rule(String pathPrefix, String bucketKey, long capacity, Duration period) {}
}
