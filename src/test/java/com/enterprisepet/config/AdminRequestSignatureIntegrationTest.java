package com.enterprisepet.config;

import com.enterprisepet.security.AdminRequestSignature;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Raw HTTP does not use the test RestTemplate signer, so a static admin key
 * and a bad MAC stay visible. TestRestTemplate is what the other admin
 * suites use; it must get past this gate.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdminRequestSignatureIntegrationTest {

    private static final String ADMIN_KEY = java.util.Base64.getEncoder().encodeToString(new byte[] {
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    });
    private static final String PREVIOUS_KEY = java.util.Base64.getEncoder().encodeToString(new byte[] {
            32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17,
            16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    });

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void secrets(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key",
                () -> java.util.Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key",
                () -> java.util.Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key",
                () -> java.util.Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> ADMIN_KEY);
        registry.add("admin.api-key-previous", () -> PREVIOUS_KEY);
        registry.add("ownership.providers.steam.enabled", () -> "true");
        registry.add("steam.api-key", () -> "TEST_KEY");
        registry.add("steam.api-base-url", () -> "http://localhost:0");
    }

    @Test
    @DisplayName("a static X-Admin-Key without a MAC is 401 problem+json")
    void staticKeyIsNotEnough() throws Exception {
        HttpResponse<String> res = call("POST", "/api/admin/revoke", "",
                "{\"jti\":\"anything\"}".getBytes(StandardCharsets.UTF_8),
                null, null, ADMIN_KEY);
        assertThat(res.statusCode()).isEqualTo(401);
        assertThat(res.body()).contains("\"status\":401");
        assertThat(res.body()).contains("Admin signature required.");
        assertThat(res.headers().firstValue("content-type").orElse(""))
                .contains("application/problem+json");
    }

    @Test
    @DisplayName("a bad MAC and a stale timestamp are 401")
    void badMacAndSkewAre401() throws Exception {
        byte[] body = "{\"jti\":\"anything\"}".getBytes(StandardCharsets.UTF_8);
        HttpResponse<String> bad = call("POST", "/api/admin/revoke", "", body,
                Long.toString(Instant.now().getEpochSecond()), "not-a-signature", null);
        assertThat(bad.statusCode()).isEqualTo(401);
        assertThat(bad.body()).contains("Admin signature invalid.");

        String stale = Long.toString(Instant.now().getEpochSecond() - 301);
        String sig = AdminRequestSignature.sign(ADMIN_KEY, "POST", "/api/admin/revoke", "", stale, body);
        HttpResponse<String> skew = call("POST", "/api/admin/revoke", "", body, stale, sig, null);
        assertThat(skew.statusCode()).isEqualTo(401);
        assertThat(skew.body()).contains("300 second window");
    }

    @Test
    @DisplayName("current and previous admin keys reach the controller (404, not a signature 401)")
    void currentAndPreviousKeysReachController() throws Exception {
        byte[] body = "{\"jti\":\"does-not-exist-uuid\"}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String current = AdminRequestSignature.sign(ADMIN_KEY, "POST", "/api/admin/revoke", "", ts, body);
        HttpResponse<String> now = call("POST", "/api/admin/revoke", "", body, ts, current, null);
        assertThat(now.statusCode()).isEqualTo(404);
        assertThat(now.body()).doesNotContain("Admin signature");

        String previous = AdminRequestSignature.sign(PREVIOUS_KEY, "POST", "/api/admin/revoke", "", ts, body);
        HttpResponse<String> old = call("POST", "/api/admin/revoke", "", body, ts, previous, null);
        assertThat(old.statusCode()).isEqualTo(404);
        assertThat(old.body()).contains("not found or already revoked");
    }

    @Test
    @DisplayName("GET audit without a MAC is 401; a signed GET is 200")
    void signedGetReachesList() throws Exception {
        HttpResponse<String> denied = call("GET", "/api/admin/licenses", "", new byte[0], null, null, null);
        assertThat(denied.statusCode()).isEqualTo(401);

        String ts = Long.toString(Instant.now().getEpochSecond());
        String sig = AdminRequestSignature.sign(ADMIN_KEY, "GET", "/api/admin/licenses", "", ts, new byte[0]);
        HttpResponse<String> ok = call("GET", "/api/admin/licenses", "", new byte[0], ts, sig, null);
        assertThat(ok.statusCode()).isEqualTo(200);
        assertThat(ok.body()).startsWith("[");
    }

    @Test
    @DisplayName("TestRestTemplate admin calls are signed so existing ledger tests still pass the gate")
    void restTemplateSignerPassesTheGate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Admin-Key", "this-static-key-is-not-the-gate");
        ResponseEntity<Map> res = restTemplate.postForEntity(
                "/api/admin/revoke", new HttpEntity<>(Map.of(), headers), Map.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(String.valueOf(res.getBody())).doesNotContain("Admin signature");
        assertThat(String.valueOf(res.getBody().get("error"))).contains("jti is required");
    }

    private HttpResponse<String> call(String method, String path, String query, byte[] body,
                                      String timestamp, String signature, String staticKey) throws Exception {
        String uri = "http://127.0.0.1:" + port + path + (query == null || query.isEmpty() ? "" : "?" + query);
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(uri));
        if ("POST".equals(method)) {
            builder.header("Content-Type", "application/json");
            builder.POST(HttpRequest.BodyPublishers.ofByteArray(body));
        } else {
            builder.GET();
        }
        if (timestamp != null) {
            builder.header(AdminRequestSignature.TIMESTAMP_HEADER, timestamp);
        }
        if (signature != null) {
            builder.header(AdminRequestSignature.SIGNATURE_HEADER, signature);
        }
        if (staticKey != null) {
            builder.header("X-Admin-Key", staticKey);
        }
        return HttpClient.newHttpClient().send(builder.build(), HttpResponse.BodyHandlers.ofString());
    }
}
