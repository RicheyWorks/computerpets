package com.enterprisepet.observability;

import com.enterprisepet.license.LicenseService;
import com.enterprisepet.security.JwtService;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.opentelemetry.sdk.trace.SpanProcessor;
import io.opentelemetry.sdk.trace.data.SpanData;
import io.opentelemetry.sdk.trace.export.SimpleSpanProcessor;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Boots the real application with no OTLP collector and asserts that a
 * verify call records a Micrometer timer and an OpenTelemetry span.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(ObservabilityIntegrationTest.SpanCapture.class)
class ObservabilityIntegrationTest {

    static final RecordingSpanExporter EXPORTER = new RecordingSpanExporter();

    @TestConfiguration
    static class SpanCapture {
        @Bean
        SpanProcessor immediateSpanProcessor() {
            return SimpleSpanProcessor.create(EXPORTER);
        }
    }

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MeterRegistry meterRegistry;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private JwtService jwtService;

    private static WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        wireMockServer = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wireMockServer.start();

        registry.add("steam.api-base-url", () -> "http://localhost:" + wireMockServer.port());
        registry.add("steam.api-key", () -> "TEST_STEAM_API_KEY");
        registry.add("steam.app-id", () -> "123456");
        registry.add("ownership.providers.steam.enabled", () -> "true");
        // Tests disable tracing by default; turn sampling on for this class only.
        registry.add("management.tracing.sampling.probability", () -> "1.0");

        String licenseKey = Base64.getEncoder().encodeToString(new byte[32]);
        String jwtKey = Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = Base64.getEncoder().encodeToString(new byte[32]);
        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
    }

    @BeforeEach
    void setUp() {
        EXPORTER.reset();
        wireMockServer.stubFor(get(urlPathEqualTo("/IPlayerService/GetOwnedGames/v1/"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                              "response": {
                                "game_count": 1,
                                "games": [
                                  { "appid": 123456 }
                                ]
                              }
                            }
                            """)));
    }

    @AfterEach
    void resetStubs() {
        if (wireMockServer != null) {
            wireMockServer.resetAll();
        }
    }

    @AfterAll
    static void stopWireMock() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @Test
    @DisplayName("context starts without an OTLP collector")
    void contextStartsWithoutCollector() {
        assertThat(meterRegistry).isNotNull();
        assertThat(restTemplate.getForEntity("/api/verify/providers", String.class).getStatusCode())
                .isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("POST /api/verify/steam records verify meter and an OTel span")
    void verifySteam_recordsSpanAndMeter() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of(
                "steamId", "76561198000000000",
                "appId", "123456",
                "petType", "red_panda"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/verify/steam", new HttpEntity<>(body, headers), Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");

        Timer verify = meterRegistry.find(VerificationTelemetry.VERIFY)
                .tag("provider", "steam")
                .tag("outcome", "success")
                .timer();
        assertThat(verify).isNotNull();
        assertThat(verify.count()).isGreaterThanOrEqualTo(1);

        List<SpanData> spans = EXPORTER.spans();
        assertThat(spans).isNotEmpty();
        assertThat(spans)
                .extracting(SpanData::getName)
                .anyMatch(name -> name.contains("enterprisepet.verify")
                        || name.contains("http.server.requests")
                        || name.toLowerCase().contains("verify")
                        || name.contains("http.client.requests"));
    }

    @Test
    @DisplayName("POST /api/download/{pet} records a download observation")
    void download_recordsMeter() {
        var enc = licenseService.issueLicense("steam:76561198000000000", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:76561198000000000", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/download/red_panda",
                new HttpEntity<>(Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv()), headers),
                Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Timer download = meterRegistry.find(VerificationTelemetry.DOWNLOAD)
                .tag("pet", "red_panda")
                .timer();
        assertThat(download).isNotNull();
        assertThat(download.count()).isGreaterThanOrEqualTo(1);
    }
}
