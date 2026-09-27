package com.enterprisepet.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * admin.allowed-origins (ADMIN_ALLOWED_ORIGINS) narrows which web sites may call /api/admin/**
 * from a browser. Default "*" keeps the old behavior. Every admin call is still HMAC-signed.
 */
class AdminCorsOriginsTest {

    private static CorsConfiguration adminCors(String allowed) {
        CorsConfigurationSource source = new SecurityConfig(null).corsConfigurationSource(allowed);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/admin/licenses");
        return source.getCorsConfiguration(request);
    }

    private static CorsConfiguration corsFor(String allowed, String path) {
        CorsConfigurationSource source = new SecurityConfig(null).corsConfigurationSource(allowed);
        return source.getCorsConfiguration(new MockHttpServletRequest("GET", path));
    }

    @Test
    void parsesCommaSeparatedOriginsAndDropsBlanksAndTrailingSlashes() {
        assertThat(SecurityConfig.adminOriginPatterns(" https://pets.example.test/ , ,https://admin.example.test"))
                .containsExactly("https://pets.example.test", "https://admin.example.test");
        assertThat(SecurityConfig.adminOriginPatterns("")).containsExactly("*");
        assertThat(SecurityConfig.adminOriginPatterns("  ,  ")).containsExactly("*");
        assertThat(SecurityConfig.adminOriginPatterns(null)).containsExactly("*");
    }

    @Test
    void defaultAllowsAnyOriginLikeBefore() {
        CorsConfiguration cors = adminCors("*");
        assertThat(cors).isNotNull();
        assertThat(cors.getAllowedOriginPatterns()).isEqualTo(List.of("*"));
        assertThat(cors.checkOrigin("https://anything.example.test")).isNotNull();
    }

    @Test
    void configuredOriginsAllowTheWebSiteAndRefuseOthers() {
        CorsConfiguration cors = adminCors("https://pets.example.test");
        assertThat(cors.checkOrigin("https://pets.example.test")).isEqualTo("https://pets.example.test");
        assertThat(cors.checkOrigin("https://elsewhere.example.test")).isNull();
        assertThat(cors.getAllowedHeaders()).contains(
                "X-ComputerPets-Timestamp", "X-ComputerPets-Nonce", "X-ComputerPets-Signature");
    }

    @Test
    void otherDoorsStayOpenToAnyOrigin() {
        CorsConfiguration heartbeat = corsFor("https://pets.example.test", "/api/public/heartbeat");
        assertThat(heartbeat).isNotNull();
        assertThat(heartbeat.getAllowedOriginPatterns()).isEqualTo(List.of("*"));
        CorsConfiguration care = corsFor("https://pets.example.test", "/pet/feed");
        assertThat(care.getAllowedOriginPatterns()).isEqualTo(List.of("*"));
    }
}
