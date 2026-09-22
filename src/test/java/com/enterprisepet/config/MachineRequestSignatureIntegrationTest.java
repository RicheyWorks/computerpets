package com.enterprisepet.config;

import com.enterprisepet.security.MachineRequestSignature;
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
 * The raw client does not use the test RestTemplate signer, so missing and
 * bad signatures stay visible. TestRestTemplate is what the other verify
 * suites use; it must get past this gate.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MachineRequestSignatureIntegrationTest {

    private static final String LICENSE_KEY = java.util.Base64.getEncoder().encodeToString(new byte[32]);

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void secrets(DynamicPropertyRegistry registry) {
        String jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        registry.add("license.secret-key", () -> LICENSE_KEY);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
    }

    @Test
    @DisplayName("unsigned POST /api/verify is 401 and does not issue a license")
    void unsignedVerifyIs401() throws Exception {
        HttpResponse<String> res = post(new byte[] {'{', '}'}, null, null, null);
        assertThat(res.statusCode()).isEqualTo(401);
        assertThat(res.body()).contains("Machine signature required.");
        assertThat(res.headers().firstValue("content-type").orElse(""))
                .contains("application/problem+json");
    }

    @Test
    @DisplayName("a bad MAC and a stale timestamp are 401")
    void badMacAndSkewAre401() throws Exception {
        byte[] body = "{\"steamId\":\"76561198000000000\",\"appId\":\"123456\"}".getBytes(StandardCharsets.UTF_8);
        HttpResponse<String> bad = post(body, Long.toString(Instant.now().getEpochSecond()), "0123456789abcdef", "not-a-signature");
        assertThat(bad.statusCode()).isEqualTo(401);
        assertThat(bad.body()).contains("Machine signature invalid.");

        String stale = Long.toString(Instant.now().getEpochSecond() - 301);
        String skewNonce = "machine-skew-nonce";
        String sig = MachineRequestSignature.sign(LICENSE_KEY, "POST", "/api/verify/steam", "", stale, skewNonce, body);
        HttpResponse<String> skew = post(body, stale, skewNonce, sig);
        assertThat(skew.statusCode()).isEqualTo(401);
        assertThat(skew.body()).contains("300 second window");
    }

    @Test
    @DisplayName("a fresh MAC reaches the Steam door (403, not a signature 401)")
    void signedVerifyReachesProvider() throws Exception {
        byte[] body = "{\"steamId\":\"76561198000000000\",\"appId\":\"123456\",\"petType\":\"red_panda\"}"
                .getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String nonce = "machine-fresh-nonce";
        String sig = MachineRequestSignature.sign(LICENSE_KEY, "POST", "/api/verify/steam", "", ts, nonce, body);
        HttpResponse<String> res = post(body, ts, nonce, sig);
        assertThat(res.statusCode()).isEqualTo(403);
        assertThat(res.body()).doesNotContain("Machine signature");
    }

    @Test
    @DisplayName("GET /api/verify/providers stays unsigned")
    void providerListStaysUnsigned() throws Exception {
        HttpRequest req = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/verify/providers"))
                .GET()
                .build();
        HttpResponse<String> res = HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(res.statusCode()).isEqualTo(200);
    }

    @Test
    @DisplayName("TestRestTemplate verify calls are signed so existing license tests still pass the gate")
    void restTemplateSignerPassesTheGate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of(
                "steamId", "76561198000000000",
                "appId", "123456",
                "petType", "red_panda");
        ResponseEntity<String> res = restTemplate.postForEntity(
                "/api/verify/steam", new HttpEntity<>(body, headers), String.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(res.getBody()).doesNotContain("Machine signature");
    }

    @Test
    @DisplayName("a captured verify is 401 on replay")
    void replayIs401() throws Exception {
        byte[] body = "{\"steamId\":\"76561198000000000\",\"appId\":\"123456\",\"petType\":\"red_panda\"}"
                .getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String nonce = "machine-replay-non1";
        String sig = MachineRequestSignature.sign(LICENSE_KEY, "POST", "/api/verify/steam", "", ts, nonce, body);
        HttpResponse<String> first = post(body, ts, nonce, sig);
        assertThat(first.statusCode()).isEqualTo(403);

        HttpResponse<String> replay = post(body, ts, nonce, sig);
        assertThat(replay.statusCode()).isEqualTo(401);
        assertThat(replay.body()).contains("Machine request replayed.");
    }

    private HttpResponse<String> post(byte[] body, String timestamp, String nonce, String signature) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder(
                        URI.create("http://127.0.0.1:" + port + "/api/verify/steam"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofByteArray(body));
        if (timestamp != null) {
            builder.header(MachineRequestSignature.TIMESTAMP_HEADER, timestamp);
        }
        if (nonce != null) {
            builder.header(MachineRequestSignature.NONCE_HEADER, nonce);
        }
        if (signature != null) {
            builder.header(MachineRequestSignature.SIGNATURE_HEADER, signature);
        }
        return HttpClient.newHttpClient().send(builder.build(), HttpResponse.BodyHandlers.ofString());
    }
}
