package com.enterprisepet.config;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitingFilterTest {

    private final RateLimitProperties properties = new RateLimitProperties();

    @Test
    @DisplayName("unmatched paths are not limited")
    void unmatchedPath_passesThrough() throws Exception {
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> { throw new AssertionError("store should not be called"); },
            properties);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/pets"), res, chain);

        assertThat(res.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("allowed consume sets remaining header and continues the chain")
    void allow_setsRemainingAndContinues() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> RateLimitBackend.Probe.allowed(9),
            properties);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/verify/providers");
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(req, res, (request, response) -> chainCalls.incrementAndGet());

        assertThat(chainCalls.get()).isEqualTo(1);
        assertThat(res.getHeader("X-RateLimit-Remaining")).isEqualTo("9");
        assertThat(res.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("exhausted bucket returns 429, Retry-After, and problem+json")
    void deny_returns429ProblemJson() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> RateLimitBackend.Probe.denied(TimeUnit.SECONDS.toNanos(44)),
            properties);
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(new MockHttpServletRequest("POST", "/api/verify/steam"), res,
            (request, response) -> chainCalls.incrementAndGet());

        assertThat(chainCalls.get()).isZero();
        assertThat(res.getStatus()).isEqualTo(429);
        assertThat(res.getHeader(HttpHeaders.RETRY_AFTER)).isEqualTo("45");
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        assertThat(res.getContentAsString())
            .contains("\"status\":429")
            .contains("\"title\":\"Too Many Requests\"")
            .contains("Rate limit exceeded for verify")
            .contains("\"retryAfterSeconds\":45");
    }

    @Test
    @DisplayName("Redis-down fail-closes with 503 instead of lifting the limit")
    void redisDown_returns503ProblemJson() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> {
                throw new RateLimitStoreException("Redis rate limiter unavailable",
                    new IllegalStateException("connection refused"));
            },
            properties);
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/verify/providers"), res,
            (request, response) -> chainCalls.incrementAndGet());

        assertThat(chainCalls.get()).isZero();
        assertThat(res.getStatus()).isEqualTo(503);
        assertThat(res.getHeader(HttpHeaders.RETRY_AFTER)).isEqualTo("5");
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        assertThat(res.getContentAsString())
            .contains("\"status\":503")
            .contains("\"title\":\"Service Unavailable\"")
            .contains("Rate limiter unavailable")
            .contains("\"retryAfterSeconds\":5");
    }

    @Test
    @DisplayName("X-Forwarded-For first hop is the bucket key")
    void forwardedFor_isUsedAsClientId() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).isEqualTo("203.0.113.9|verify");
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(8);
        }, properties);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/verify/providers");
        req.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        filter.doFilter(req, new MockHttpServletResponse(), (request, response) -> {});

        assertThat(seen.get()).isEqualTo(1);
    }
}
