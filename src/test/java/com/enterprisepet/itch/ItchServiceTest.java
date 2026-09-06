package com.enterprisepet.itch;

import com.enterprisepet.provider.VerificationResult;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class ItchServiceTest {

    private static final String VALID_API_KEY = "TEST_ITCH_API_KEY_123";
    private static final String GAME_ID = "3";
    private static final String DOWNLOAD_KEY = "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z";

    private static final String OWNED_JSON = """
            {
              "download_key": {
                "id": 124,
                "key": "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z",
                "game_id": 3,
                "owner": {
                  "username": "fasterthanlime",
                  "id": 1994
                }
              }
            }
            """;

    private ItchService service;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        service = new ItchService(builder.build(), VALID_API_KEY);
    }

    @Test
    @DisplayName("ownsReceipt sends Bearer auth and the download_key query")
    void ownsReceipt_sendsBearerAndQuery() {
        mockServer.expect((org.springframework.test.web.client.RequestMatcher) request -> {
                    java.net.URI uri = request.getURI();
                    assertThat(uri.getPath()).isEqualTo("/games/3/download_keys");
                    assertThat(uri.getQuery()).contains("download_key=" + DOWNLOAD_KEY);
                })
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer " + VALID_API_KEY))
                .andRespond(withSuccess(OWNED_JSON, MediaType.APPLICATION_JSON));

        Optional<String> owner = service.ownsReceipt(GAME_ID, DOWNLOAD_KEY);

        assertThat(owner).contains("itch:1994");
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns the itch owner id when the receipt is valid")
    void ownsReceipt_validKey_returnsOwner() {
        expectDownloadKeys(OWNED_JSON);

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).contains("itch:1994");
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when itch reports an invalid download key")
    void ownsReceipt_invalidKey_returnsEmpty() {
        expectDownloadKeys("""
                { "errors": ["invalid download key"] }
                """);

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when no download key is found")
    void ownsReceipt_notFound_returnsEmpty() {
        expectDownloadKeys("""
                { "errors": ["no download key found"] }
                """);

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when the receipt is for a different game")
    void ownsReceipt_wrongGameId_returnsEmpty() {
        expectDownloadKeys("""
                {
                  "download_key": {
                    "id": 124,
                    "game_id": 999,
                    "owner": { "id": 1994 }
                  }
                }
                """);

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when the API key is missing and logs a warning")
    void ownsReceipt_missingApiKey_returnsEmpty_andLogsWarning() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        ItchService noKey = new ItchService(builder.build(), "");

        ListAppender<ILoggingEvent> appender = startLogCapture();
        try {
            assertThat(noKey.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
            assertThat(appender.list)
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .anyMatch(msg -> msg.contains("Itch.io API key not configured"));
        } finally {
            stopLogCapture(appender);
        }
        local.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when the API key is the placeholder value")
    void ownsReceipt_placeholderApiKey_returnsEmpty() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        ItchService placeholder = new ItchService(builder.build(), ItchService.PLACEHOLDER_API_KEY);

        assertThat(placeholder.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        local.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty on 401 Unauthorized (bad token / key)")
    void ownsReceipt_unauthorized_returnsEmpty() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/download_keys")))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"errors\":[\"invalid key\"]}"));

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty on 500 Internal Server Error")
    void ownsReceipt_serverError_returnsEmpty() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/download_keys")))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"internal\"}"));

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when the response body is empty")
    void ownsReceipt_emptyBody_returnsEmpty() {
        expectDownloadKeys("");

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt returns empty when JSON is malformed and logs a warning")
    void ownsReceipt_malformedJson_returnsEmpty_andLogsWarning() {
        ListAppender<ILoggingEvent> appender = startLogCapture();
        try {
            expectDownloadKeys("{invalid json");
            assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).isEmpty();
            assertThat(appender.list)
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .anyMatch(msg -> msg.contains("Failed to parse Itch.io API response"));
        } finally {
            stopLogCapture(appender);
        }
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsReceipt falls back to username when owner id is missing")
    void ownsReceipt_ownerUsernameFallback() {
        expectDownloadKeys("""
                {
                  "download_key": {
                    "id": 124,
                    "game_id": 3,
                    "owner": { "username": "fasterthanlime" }
                  }
                }
                """);

        assertThat(service.ownsReceipt(GAME_ID, DOWNLOAD_KEY)).contains("itch:fasterthanlime");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when required fields are missing")
    void verify_missingRequiredFields_returnsDenied() {
        VerificationResult result = service.verify(Map.of("gameId", GAME_ID));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("gameId and downloadKey are required");
    }

    @Test
    @DisplayName("verify(null) denies with the same required-field message")
    void verify_nullRequest_returnsDenied() {
        VerificationResult result = service.verify(null);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("gameId and downloadKey are required");
    }

    @Test
    @DisplayName("verify returns denied when gameId is not numeric")
    void verify_nonNumericGameId_returnsDenied() {
        VerificationResult result = service.verify(Map.of(
                "gameId", "not-a-number",
                "downloadKey", DOWNLOAD_KEY
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("numeric");
    }

    @Test
    @DisplayName("verify returns granted when the receipt is valid")
    void verify_ownsGame_returnsGranted() {
        expectDownloadKeys(OWNED_JSON);

        VerificationResult result = service.verify(Map.of(
                "gameId", GAME_ID,
                "downloadKey", DOWNLOAD_KEY
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo("itch:1994");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when the user does not own the game")
    void verify_doesNotOwnGame_returnsDenied() {
        expectDownloadKeys("""
                { "errors": ["invalid download key"] }
                """);

        VerificationResult result = service.verify(Map.of(
                "gameId", GAME_ID,
                "downloadKey", DOWNLOAD_KEY
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).isEqualTo("Itch.io ownership not found");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when gameId is not the configured official game")
    void verify_gameIdNotAllowlisted_returnsDenied() {
        ItchService allowlisted = new ItchService(
                RestClient.builder().build(), VALID_API_KEY, "3");

        VerificationResult result = allowlisted.verify(Map.of(
                "gameId", "999",
                "downloadKey", DOWNLOAD_KEY
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("official ComputerPets itch.io game");
    }

    @Test
    @DisplayName("verify returns denied when the API key is still the placeholder")
    void verify_placeholderKey_returnsDenied() {
        ItchService placeholder = new ItchService(
                RestClient.builder().build(), ItchService.PLACEHOLDER_API_KEY);

        VerificationResult result = placeholder.verify(Map.of(
                "gameId", GAME_ID,
                "downloadKey", DOWNLOAD_KEY
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).isEqualTo("Itch.io ownership not found");
    }

    private void expectDownloadKeys(String json) {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/download_keys")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));
    }

    private static ListAppender<ILoggingEvent> startLogCapture() {
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        Logger logger = (Logger) LoggerFactory.getLogger(ItchService.class);
        logger.addAppender(appender);
        appender.start();
        return appender;
    }

    private static void stopLogCapture(ListAppender<ILoggingEvent> appender) {
        Logger logger = (Logger) LoggerFactory.getLogger(ItchService.class);
        logger.detachAppender(appender);
    }
}
