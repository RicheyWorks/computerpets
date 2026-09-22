package com.enterprisepet.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The keeper card reads this door. It stays quiet. Care routes are not
 * invented. Java is 8081; the desk keeps 8080.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HeartbeatDoorTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void houseDefaults(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("rate-limit.backend", () -> "memory");
        registry.add("server.port", () -> "8081");
    }

    @Test
    @DisplayName("public heartbeat speaks status, profile, and uptime")
    void heartbeat_tellsTheTruth() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
            "/api/public/heartbeat", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("UP");
        assertThat(response.getBody().get("profile")).isInstanceOf(String.class);
        assertThat((String) response.getBody().get("profile")).isNotBlank();
        assertThat(response.getBody().get("uptimeSeconds")).isInstanceOf(Number.class);
        assertThat(((Number) response.getBody().get("uptimeSeconds")).longValue()).isGreaterThanOrEqualTo(0);
        assertThat(response.getBody().get("port")).isInstanceOf(Number.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> care = (Map<String, Object>) response.getBody().get("care");
        assertThat(care.get("feed")).isEqualTo(false);
        assertThat(care.get("play")).isEqualTo(false);
        assertThat(care.get("rest")).isEqualTo(false);
        assertThat(care.get("door")).isEqualTo("local");
    }

    @Test
    @DisplayName("heartbeat stays a door, not a floor plan")
    void heartbeat_staysQuiet() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/api/public/heartbeat", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).doesNotContainIgnoringCase("steam");
        assertThat(response.getBody()).doesNotContainIgnoringCase("ethereum");
        assertThat(response.getBody()).doesNotContainIgnoringCase("redis");
        assertThat(response.getBody()).doesNotContainIgnoringCase("disk");
        assertThat(response.getBody()).doesNotContain("/pet/feed");
        assertThat(response.getBody()).doesNotContain("/pet/play");
        assertThat(response.getBody()).doesNotContain("/pet/rest");
        assertThat(response.getBody()).doesNotContain("components");
    }

    @Test
    @DisplayName("advertised care routes refuse locally and are not a 200 or a license wall")
    void advertisedCareRoutes_refuseLocally() {
        for (String path : new String[] {"/pet/feed", "/pet/play", "/pet/rest"}) {
            assertLocalRefusal(restTemplate.getForEntity(path, String.class), path);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> posted = new HttpEntity<>("{\"hunger\":0,\"bond\":100}", headers);
            assertLocalRefusal(
                restTemplate.exchange(path, HttpMethod.POST, posted, String.class),
                path);
        }
    }

    @Test
    @DisplayName("only the three advertised care paths answer; other /pet paths stay closed")
    void otherPetPaths_stayClosed() {
        ResponseEntity<String> bath = restTemplate.getForEntity("/pet/bath", String.class);
        assertThat(bath.getStatusCode().is2xxSuccessful()).isFalse();
        assertThat(bath.getStatusCode()).isNotEqualTo(HttpStatus.CONFLICT);
    }

    private static void assertLocalRefusal(ResponseEntity<String> response, String path) {
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getStatusCode().is2xxSuccessful()).isFalse();
        assertThat(response.getStatusCode()).isNotEqualTo(HttpStatus.UNAUTHORIZED);
        String body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body).contains("\"status\":409");
        assertThat(body).contains("\"title\":\"Care is local\"");
        assertThat(body).contains("Care is local. " + path + " is not a door.");
        assertThat(body).contains("\"door\":\"local\"");
        assertThat(body).contains("\"performed\":false");
        assertThat(body).contains("\"verb\":\"" + path.substring(path.lastIndexOf('/') + 1) + "\"");
        assertThat(body).doesNotContain("hunger");
        assertThat(body).doesNotContain("bond");
        assertThat(body).doesNotContainIgnoringCase("jwt");
        assertThat(body).doesNotContainIgnoringCase("license");
    }
}
