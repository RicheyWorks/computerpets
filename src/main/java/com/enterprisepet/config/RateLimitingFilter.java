package com.enterprisepet.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Per-IP token-bucket rate limiter for sensitive endpoints. Each protected route has
 * its own (capacity, refill period) tuple; an IP exceeding the bucket gets
 * {@code 429 Too Many Requests} with a {@code Retry-After} header and a
 * {@code application/problem+json} body.
 *
 * <p>Buckets live in an in-memory {@link ConcurrentHashMap}. For multi-instance
 * deploys, swap the storage layer for {@code bucket4j-redis} so the limit is shared
 * across replicas.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    /**
     * Buckets are namespaced by {@code remoteAddr + "|" + rule.bucketKey}.
     * Capacity is generous — these limits are abuse-prevention, not metering.
     */
    private static final List<Rule> RULES = List.of(
        new Rule("/api/verify/",   "verify",   10, Duration.ofMinutes(1)),
        new Rule("/api/download/", "download", 30, Duration.ofMinutes(1))
    );

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        Rule rule = ruleFor(req.getRequestURI());
        if (rule == null) {
            chain.doFilter(req, res);
            return;
        }

        String bucketKey = clientId(req) + "|" + rule.bucketKey;
        Bucket bucket = buckets.computeIfAbsent(bucketKey, k -> buildBucket(rule));

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            res.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
            chain.doFilter(req, res);
            return;
        }

        long retryAfterSeconds = TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()) + 1;
        log.info("Rate limit exceeded clientId={} rule={} retryAfter={}s",
            clientId(req), rule.bucketKey, retryAfterSeconds);

        res.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
        res.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSeconds));
        res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        res.getWriter().write(String.format(
            "{\"type\":\"about:blank\",\"title\":\"Too Many Requests\",\"status\":429,"
            + "\"detail\":\"Rate limit exceeded for %s. Retry after %d seconds.\","
            + "\"retryAfterSeconds\":%d}",
            rule.bucketKey, retryAfterSeconds, retryAfterSeconds));
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
    private static String clientId(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) {
            int comma = fwd.indexOf(',');
            return (comma > 0 ? fwd.substring(0, comma) : fwd).trim();
        }
        return req.getRemoteAddr();
    }

    private static Bucket buildBucket(Rule rule) {
        Bandwidth bandwidth = Bandwidth.classic(rule.capacity,
            Refill.intervally(rule.capacity, rule.period));
        return Bucket.builder().addLimit(bandwidth).build();
    }

    /** Path prefix → (capacity, refill window). */
    private record Rule(String pathPrefix, String bucketKey, long capacity, Duration period) {}
}
