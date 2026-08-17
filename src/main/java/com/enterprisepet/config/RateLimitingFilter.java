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
 * Per-IP token-bucket rate limiter for sensitive endpoints. Each protected route has
 * its own (capacity, refill period) tuple; an IP exceeding the bucket gets
 * {@code 429 Too Many Requests} with a {@code Retry-After} header and a
 * {@code application/problem+json} body.
 *
 * <p>Default store is Redis ({@code bucket4j-redis} + Lettuce) so replicas share
 * the same 10/min verify and 30/min download budgets. If Redis is unreachable
 * the filter fail-closes with {@code 503 Service Unavailable} and {@code Retry-After}
 * — it does not fall back to a per-instance memory bucket, which would silently
 * lift the shared limit.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    /**
     * Buckets are namespaced by {@code remoteAddr + "|" + rule.bucketKey}.
     * Capacity is generous — these limits are abuse-prevention, not metering.
     */
    static final List<Rule> RULES = List.of(
        new Rule("/api/verify/",   "verify",   10, Duration.ofMinutes(1)),
        new Rule("/api/download/", "download", 30, Duration.ofMinutes(1))
    );

    private final RateLimitBackend backend;
    private final RateLimitProperties properties;

    public RateLimitingFilter(RateLimitBackend backend, RateLimitProperties properties) {
        this.backend = backend;
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        Rule rule = ruleFor(req.getRequestURI());
        if (rule == null) {
            chain.doFilter(req, res);
            return;
        }

        String client = clientId(req);
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

    /**
     * Trusts X-Forwarded-For when present (typical when behind an ALB/CloudFront). For
     * direct exposure, this should be disabled or restricted to a known proxy IP set
     * to prevent spoofing.
     */
    static String clientId(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) {
            int comma = fwd.indexOf(',');
            return (comma > 0 ? fwd.substring(0, comma) : fwd).trim();
        }
        return req.getRemoteAddr();
    }

    /** Path prefix → (capacity, refill window). */
    record Rule(String pathPrefix, String bucketKey, long capacity, Duration period) {}
}
