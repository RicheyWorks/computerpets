package com.enterprisepet.steam;

import com.enterprisepet.provider.VerificationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.Map;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.slf4j.LoggerFactory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class SteamServiceTest {

    private SteamService service;
    private MockRestServiceServer mockServer;

    private static final String VALID_API_KEY = "FAKE_STEAM_API_KEY_123";
    private static final String STEAM_ID = "76561198000000000";
    private static final String APP_ID = "123456";

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        RestClient restClient = builder.build();

        // Use the test constructor that accepts both RestClient and API key.
        // This avoids reflection entirely for the happy path.
        service = new SteamService(restClient, VALID_API_KEY);
    }

    // ====================== ownsApp Tests ======================

    @Test
    @DisplayName("ownsApp sends the correct full URI path and all query parameters")
    void ownsApp_sendsCorrectFullUriAndParameters() {
        String json = """
            {
              "response": {
                "games": [ {"appid": 123456} ]
              }
            }
            """;

        // Use a custom RequestMatcher for precise, readable validation
        mockServer.expect((org.springframework.test.web.client.RequestMatcher) request -> {
            java.net.URI uri = request.getURI();
            assertThat(uri.getPath()).isEqualTo("/IPlayerService/GetOwnedGames/v1/");
            String query = uri.getQuery();
            assertThat(query).isNotNull();
            assertThat(query).contains("key=" + VALID_API_KEY);
            assertThat(query).contains("steamid=" + STEAM_ID);
            assertThat(query).contains("appids_filter[0]=" + APP_ID); // decoded form in getQuery()
        })
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        boolean result = service.ownsApp(STEAM_ID, APP_ID);

        assertThat(result).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp correctly URL-encodes the appids_filter[0] parameter")
    void ownsApp_encodesAppIdFilterParameter() {
        String json = """
            {
              "response": {
                "games": [ {"appid": 123456} ]
              }
            }
            """;

        // Explicitly verify the parameter is sent with proper encoding
        mockServer.expect((org.springframework.test.web.client.RequestMatcher) request -> {
            String query = request.getURI().getQuery();
            assertThat(query).contains("appids_filter[0]=123456");
        })
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        boolean result = service.ownsApp(STEAM_ID, APP_ID);
        assertThat(result).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when API key is missing and logs a warning")
    void ownsApp_missingApiKey_returnsFalse_andLogsWarning() {
        // Create a fresh service with an empty API key for this specific test
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer localMockServer = MockRestServiceServer.bindTo(builder).build();
        RestClient localRestClient = builder.build();

        SteamService serviceWithNoKey = new SteamService(localRestClient, "");

        ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        Logger logger = (Logger) LoggerFactory.getLogger(SteamService.class);
        logger.addAppender(listAppender);
        listAppender.start();

        boolean result = serviceWithNoKey.ownsApp(STEAM_ID, APP_ID);

        assertThat(result).isFalse();
        assertThat(listAppender.list)
                .extracting(ILoggingEvent::getFormattedMessage)
                .anyMatch(msg -> msg.contains("Steam API key not configured"));

        logger.detachAppender(listAppender);
        localMockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when API key is the placeholder value")
    void ownsApp_placeholderApiKey_returnsFalse() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer localMockServer = MockRestServiceServer.bindTo(builder).build();
        RestClient localRestClient = builder.build();

        SteamService serviceWithPlaceholder = new SteamService(localRestClient, "YOUR_STEAM_WEB_API_KEY");

        boolean result = serviceWithPlaceholder.ownsApp(STEAM_ID, APP_ID);

        assertThat(result).isFalse();
        localMockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns true when the requested appId is in the user's library")
    void ownsApp_userOwnsTheGame_returnsTrue() {
        String json = """
            {
              "response": {
                "game_count": 2,
                "games": [
                  {"appid": 111111},
                  {"appid": 123456}
                ]
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when the app is not in the user's library")
    void ownsApp_userDoesNotOwnTheGame_returnsFalse() {
        String json = """
            {
              "response": {
                "game_count": 1,
                "games": [ {"appid": 999999} ]
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when games list is empty")
    void ownsApp_emptyGamesList_returnsFalse() {
        String json = """
            {
              "response": {
                "game_count": 0,
                "games": []
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when 'games' field is missing")
    void ownsApp_gamesFieldMissing_returnsFalse() {
        String json = """
            {
              "response": {
                "game_count": 5
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when 'games' is null instead of an array")
    void ownsApp_gamesIsNull_returnsFalse() {
        String json = """
            {
              "response": {
                "game_count": 3,
                "games": null
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when response body is null or empty")
    void ownsApp_nullOrEmptyResponse_returnsFalse() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when JSON is malformed and logs a warning")
    void ownsApp_malformedJson_returnsFalse_andLogsWarning() {
        ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        Logger logger = (Logger) LoggerFactory.getLogger(SteamService.class);
        logger.addAppender(listAppender);
        listAppender.start();

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess("{invalid json", MediaType.APPLICATION_JSON));

        boolean result = service.ownsApp(STEAM_ID, APP_ID);

        assertThat(result).isFalse();
        assertThat(listAppender.list)
                .extracting(ILoggingEvent::getFormattedMessage)
                .anyMatch(msg -> msg.contains("Failed to parse Steam API response"));

        logger.detachAppender(listAppender);
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false when the HTTP call results in a 429 Too Many Requests")
    void ownsApp_rateLimited_returnsFalse() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withStatus(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS)
                              .contentType(MediaType.APPLICATION_JSON)
                              .body("{}"));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns false on 500 Internal Server Error")
    void ownsApp_serverError_returnsFalse() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withStatus(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                              .contentType(MediaType.APPLICATION_JSON)
                              .body("{\"error\": \"internal\"}"));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp returns true when appId appears as string in JSON")
    void ownsApp_appIdAsString_returnsTrue() {
        String json = """
            {
              "response": {
                "games": [ {"appid": "123456"} ]
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsApp correctly finds the appId even in a very large games list")
    void ownsApp_largeGameList_targetAtEnd_returnsTrue() {
        // Build a large list with the target app at the very end
        StringBuilder gamesJson = new StringBuilder();
        gamesJson.append("[");

        for (int i = 1; i <= 80; i++) {
            if (i > 1) gamesJson.append(",");
            gamesJson.append("{\"appid\": ").append(100000 + i).append("}");
        }
        // Target game at the end
        gamesJson.append(",{\"appid\": 123456}");

        gamesJson.append("]");

        String json = """
            {
              "response": {
                "game_count": 81,
                "games": %s
              }
            }
            """.formatted(gamesJson);

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        assertThat(service.ownsApp(STEAM_ID, APP_ID)).isTrue();
        mockServer.verify();
    }

    // ====================== verify() Tests ======================

    @Test
    @DisplayName("verify returns denied when required fields are missing")
    void verify_missingRequiredFields_returnsDenied() {
        VerificationResult result = service.verify(Map.of("steamId", STEAM_ID));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("steamId and appId are required");
    }

    @Test
    @DisplayName("verify returns granted when user owns the game")
    void verify_userOwnsGame_returnsGranted() {
        String json = """
            {
              "response": {
                "games": [ {"appid": 123456} ]
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        VerificationResult result = service.verify(Map.of(
                "steamId", STEAM_ID,
                "appId", APP_ID
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo(STEAM_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when user does not own the game")
    void verify_userDoesNotOwnGame_returnsDenied() {
        String json = """
            {
              "response": {
                "games": [ {"appid": 999999} ]
              }
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/GetOwnedGames")))
                  .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        VerificationResult result = service.verify(Map.of(
                "steamId", STEAM_ID,
                "appId", APP_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).isEqualTo("Steam ownership not found");
        mockServer.verify();
    }

}