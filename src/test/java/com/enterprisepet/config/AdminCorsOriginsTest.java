package com.enterprisepet.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * admin.allowed-origins (ADMIN_ALLOWED_ORIGINS) narrows which web sites may call /api/admin/**
 * from a browser. Default is closed (no other web site; same-origin pages still work), the dev
 * profile allows loopback pages, and prod refuses "*" (ProductionProfileGuard). Every admin call
 * is still HMAC-signed.
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
        assertThat(SecurityConfig.adminOriginPatterns("")).isEmpty();
        assertThat(SecurityConfig.adminOriginPatterns("  ,  ")).isEmpty();
        assertThat(SecurityConfig.adminOriginPatterns(null)).isEmpty();
    }

    @Test
    void emptyDefaultRefusesEveryOtherOrigin() {
        CorsConfiguration cors = adminCors("");
        assertThat(cors).isNotNull();
        assertThat(cors.getAllowedOriginPatterns()).isEmpty();
        assertThat(cors.checkOrigin("https://anything.example.test")).isNull();
        assertThat(cors.checkOrigin("http://localhost:8080")).isNull();
    }

    @Test
    void explicitStarStillAllowsAnyOutsideProd() {
        CorsConfiguration cors = adminCors("*");
        assertThat(cors.getAllowedOriginPatterns()).isEqualTo(List.of("*"));
        assertThat(cors.checkOrigin("https://anything.example.test")).isNotNull();
    }

    @Test
    void baseConfigIsClosedAndDevAllowsTheLocalWebPage() {
        String base = yaml("application.yml").getProperty("admin.allowed-origins");
        assertThat(base).isEqualTo("${ADMIN_ALLOWED_ORIGINS:}");

        String dev = yaml("application-dev.yml").getProperty("admin.allowed-origins");
        assertThat(dev).startsWith("${ADMIN_ALLOWED_ORIGINS:").endsWith("}");
        String devDefault = dev.substring("${ADMIN_ALLOWED_ORIGINS:".length(), dev.length() - 1);
        CorsConfiguration cors = adminCors(devDefault);
        assertThat(cors.checkOrigin("http://localhost:8080")).isEqualTo("http://localhost:8080");
        assertThat(cors.checkOrigin("http://127.0.0.1:5173")).isEqualTo("http://127.0.0.1:5173");
        assertThat(cors.checkOrigin("https://elsewhere.example.test")).isNull();
        assertThat(cors.checkOrigin("http://192.168.1.20:8080")).isNull();

        assertThat(yaml("application-prod.yml").getProperty("admin.allowed-origins")).isNull();
        assertThat(yaml("application-staging.yml").getProperty("admin.allowed-origins")).isNull();
    }

    private static Properties yaml(String name) {
        YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
        factory.setResources(new ClassPathResource(name));
        return factory.getObject();
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
