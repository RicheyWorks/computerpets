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
    private final ClientAddress trustLoopback =
        new ClientAddress(TrustedProxyProperties.of("127.0.0.1/32", "::1/128"));
    private final ClientAddress trustNone = new ClientAddress(TrustedProxyProperties.of());

    @Test
    @DisplayName("unmatched paths are not limited")
    void unmatchedPath_passesThrough() throws Exception {
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> { throw new AssertionError("store should not be called"); },
            properties, trustNone);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/public/heartbeat"), res, chain);

        assertThat(res.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("discovery /api/pets consumes the discovery bucket")
    void discoveryPets_usesDiscoveryBucket() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).endsWith("|discovery");
            assertThat(cap).isEqualTo(60L);
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(59);
        }, properties, trustNone);
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/pets"), res,
            (request, response) -> {});
        filter.doFilter(new MockHttpServletRequest("GET", "/api/pets/by-rarity"), res,
            (request, response) -> {});
        filter.doFilter(new MockHttpServletRequest("GET", "/api/pets/red_panda"), res,
            (request, response) -> {});

        assertThat(seen.get()).isEqualTo(3);
        assertThat(res.getHeader("X-RateLimit-Remaining")).isEqualTo("59");
    }

    @Test
    @DisplayName("bundle catalog reads consume the bundles bucket; redeem does not")
    void bundleCatalog_usesBundlesBucket_redeemExcluded() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).endsWith("|bundles");
            assertThat(cap).isEqualTo(60L);
            assertThat(period).isEqualTo(java.time.Duration.ofMinutes(1));
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(59);
        }, properties, trustNone);

        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/red_panda"),
            new MockHttpServletResponse(), (request, response) -> {});
        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/redeem"),
            new MockHttpServletResponse(), (request, response) -> {});

        AtomicInteger redeemChain = new AtomicInteger();
        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/red_panda/redeem"),
            new MockHttpServletResponse(), (request, response) -> redeemChain.incrementAndGet());
        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/red_panda/redeem/"),
            new MockHttpServletResponse(), (request, response) -> redeemChain.incrementAndGet());
        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/red_panda/redeem?owner=a&jti=b&exp=1&sig=c"),
            new MockHttpServletResponse(), (request, response) -> redeemChain.incrementAndGet());

        assertThat(seen.get()).isEqualTo(2);
        assertThat(redeemChain.get()).isEqualTo(3);
        assertThat(RateLimitingFilter.isSignedBundleRedeem("/api/bundles/red_panda")).isFalse();
        assertThat(RateLimitingFilter.ruleFor("/api/bundles/red_panda/redeem")).isNull();
    }

    @Test
    @DisplayName("exhausted bundle catalog bucket returns 429 problem+json")
    void bundleCatalogDeny_returns429() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> {
                assertThat(key).endsWith("|bundles");
                return RateLimitBackend.Probe.denied(TimeUnit.SECONDS.toNanos(8));
            },
            properties, trustNone);
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/bundles/red_panda"), res,
            (request, response) -> chainCalls.incrementAndGet());

        assertThat(chainCalls.get()).isZero();
        assertThat(res.getStatus()).isEqualTo(429);
        assertThat(res.getHeader(HttpHeaders.RETRY_AFTER)).isEqualTo("9");
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        assertThat(res.getContentAsString())
            .contains("Rate limit exceeded for bundles")
            .contains("\"status\":429");
    }

    @Test
    @DisplayName("trusted proxy: bundle catalog bucket uses ClientAddress")
    void bundleCatalog_trustedProxy_usesClientAddress() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).isEqualTo("203.0.113.9|bundles");
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(59);
        }, properties, trustLoopback);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/bundles/red_panda");
        req.setRemoteAddr("127.0.0.1");
        req.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        filter.doFilter(req, new MockHttpServletResponse(), (request, response) -> {});

        assertThat(seen.get()).isEqualTo(1);
    }

    @Test
    @DisplayName("exhausted discovery bucket returns 429 problem+json")
    void discoveryDeny_returns429() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> RateLimitBackend.Probe.denied(TimeUnit.SECONDS.toNanos(12)),
            properties, trustNone);
        MockHttpServletResponse res = new MockHttpServletResponse();

        filter.doFilter(new MockHttpServletRequest("GET", "/api/pets"), res,
            (request, response) -> chainCalls.incrementAndGet());

        assertThat(chainCalls.get()).isZero();
        assertThat(res.getStatus()).isEqualTo(429);
        assertThat(res.getHeader(HttpHeaders.RETRY_AFTER)).isEqualTo("13");
        assertThat(res.getContentAsString())
            .contains("Rate limit exceeded for discovery")
            .contains("\"status\":429");
    }

    @Test
    @DisplayName("allowed consume sets remaining header and continues the chain")
    void allow_setsRemainingAndContinues() throws Exception {
        AtomicInteger chainCalls = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter(
            (key, cap, period) -> RateLimitBackend.Probe.allowed(9),
            properties, trustNone);
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
            properties, trustNone);
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
            properties, trustNone);
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
    @DisplayName("trusted proxy: X-Forwarded-For first hop is the bucket key")
    void trustedProxy_forwardedFor_isUsedAsClientId() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).isEqualTo("203.0.113.9|verify");
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(8);
        }, properties, trustLoopback);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/verify/providers");
        req.setRemoteAddr("127.0.0.1");
        req.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        filter.doFilter(req, new MockHttpServletResponse(), (request, response) -> {});

        assertThat(seen.get()).isEqualTo(1);
    }

    @Test
    @DisplayName("untrusted peer: X-Forwarded-For is ignored for the bucket key")
    void untrustedPeer_xffIgnored() throws Exception {
        AtomicInteger seen = new AtomicInteger();
        RateLimitingFilter filter = new RateLimitingFilter((key, cap, period) -> {
            assertThat(key).isEqualTo("198.51.100.7|verify");
            seen.incrementAndGet();
            return RateLimitBackend.Probe.allowed(8);
        }, properties, trustNone);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/verify/providers");
        req.setRemoteAddr("198.51.100.7");
        req.addHeader("X-Forwarded-For", "203.0.113.9");

        filter.doFilter(req, new MockHttpServletResponse(), (request, response) -> {});

        assertThat(seen.get()).isEqualTo(1);
    }
}
