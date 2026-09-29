package com.enterprisepet.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;

class MetricsScrapeTokenFilterTest {

    static final String TOKEN = "plan-fixture-scrape-token-0123456789abcdefghijkl";

    @AfterEach
    void clear() {
        SecurityContextHolder.clearContext();
    }

    private Authentication run(MetricsScrapeTokenFilter filter, String path, String authorization) throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", path);
        if (authorization != null) {
            req.addHeader("Authorization", authorization);
        }
        filter.doFilter(req, new MockHttpServletResponse(), new MockFilterChain());
        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Test
    @DisplayName("matching bearer on prometheus earns ROLE_METRICS")
    void matchingBearer_grantsMetricsRole() throws Exception {
        Authentication auth = run(new MetricsScrapeTokenFilter(TOKEN), "/actuator/prometheus", "Bearer " + TOKEN);
        assertThat(auth).isNotNull();
        assertThat(auth.getAuthorities()).extracting(Object::toString).containsExactly("ROLE_METRICS");
    }

    @Test
    @DisplayName("scheme is case-insensitive and surrounding space is trimmed")
    void schemeCaseInsensitive() throws Exception {
        assertThat(run(new MetricsScrapeTokenFilter(" " + TOKEN + "\n"), "/actuator/info", "bearer  " + TOKEN))
            .isNotNull();
    }

    @Test
    @DisplayName("wrong, prefixed, or missing bearer earns nothing")
    void wrongBearer_grantsNothing() throws Exception {
        MetricsScrapeTokenFilter f = new MetricsScrapeTokenFilter(TOKEN);
        assertThat(run(f, "/actuator/prometheus", "Bearer " + TOKEN + "x")).isNull();
        assertThat(run(f, "/actuator/prometheus", "Basic " + TOKEN)).isNull();
        assertThat(run(f, "/actuator/prometheus", "Bearer ")).isNull();
        assertThat(run(f, "/actuator/prometheus", null)).isNull();
    }

    @Test
    @DisplayName("the token only works on the scrape paths")
    void otherPaths_areIgnored() throws Exception {
        MetricsScrapeTokenFilter f = new MetricsScrapeTokenFilter(TOKEN);
        assertThat(run(f, "/api/download/red_panda", "Bearer " + TOKEN)).isNull();
        assertThat(run(f, "/actuator/env", "Bearer " + TOKEN)).isNull();
        assertThat(run(f, "/actuator", "Bearer " + TOKEN)).isNull();
    }

    @Test
    @DisplayName("unset or short token keeps the door closed (deny-safe)")
    void unsetOrShortToken_isClosed() throws Exception {
        assertThat(new MetricsScrapeTokenFilter("").enabled()).isFalse();
        assertThat(new MetricsScrapeTokenFilter(null).enabled()).isFalse();
        MetricsScrapeTokenFilter shortOne = new MetricsScrapeTokenFilter("short-fixture");
        assertThat(shortOne.enabled()).isFalse();
        assertThat(run(shortOne, "/actuator/prometheus", "Bearer short-fixture")).isNull();
        assertThat(run(new MetricsScrapeTokenFilter(""), "/actuator/prometheus", "Bearer ")).isNull();
    }

    @Test
    @DisplayName("context path is stripped before matching")
    void contextPath_isStripped() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/app/actuator/prometheus");
        req.setContextPath("/app");
        assertThat(MetricsScrapeTokenFilter.pathWithinApplication(req)).isEqualTo("/actuator/prometheus");
    }
}
