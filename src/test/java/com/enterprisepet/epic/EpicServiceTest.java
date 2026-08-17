package com.enterprisepet.epic;

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

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class EpicServiceTest {

    private static final String CLIENT_ID = "xyza7891lhxMVYGCON7LgnKZZ8HQGD5H";
    private static final String CLIENT_SECRET = "TEST_EPIC_CLIENT_SECRET";
    private static final String DEPLOYMENT_ID = "testdeploymentid0000000000000001";
    private static final String ACCOUNT_ID = "9626f441055349ce8cb7d7d5a483eaa2";
    private static final String SANDBOX_ID = "fn";
    private static final String CATALOG_ITEM_ID = "4fe75bbc5a674f4f9b356b5c90567da5";
    private static final String ACCESS_TOKEN = "eg1~test-access-token";

    private static final String TOKEN_JSON = """
            {
              "scope": "",
              "token_type": "bearer",
              "access_token": "eg1~test-access-token",
              "expires_in": 7200,
              "expires_at": "2026-08-17T12:00:00.000Z",
              "client_id": "xyza7891lhxMVYGCON7LgnKZZ8HQGD5H"
            }
            """;

    private static final String OWNED_JSON = """
            [
              {
                "namespace": "fn",
                "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                "owned": true
              }
            ]
            """;

    private EpicService service;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        service = new EpicService(builder.build(), CLIENT_ID, CLIENT_SECRET, DEPLOYMENT_ID);
    }

    @Test
    @DisplayName("ownsCatalogItem exchanges client_credentials then queries Ecom v3 ownership")
    void ownsCatalogItem_sendsTokenThenOwnership() {
        String basic = Base64.getEncoder().encodeToString(
                (CLIENT_ID + ":" + CLIENT_SECRET).getBytes(StandardCharsets.UTF_8));

        mockServer.expect(requestTo("/epic/oauth/v2/token"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Basic " + basic))
                .andExpect(content().contentType("application/x-www-form-urlencoded"))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("grant_type=client_credentials")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("deployment_id=" + DEPLOYMENT_ID)))
                .andRespond(withSuccess(TOKEN_JSON, MediaType.APPLICATION_JSON));

        mockServer.expect((org.springframework.test.web.client.RequestMatcher) request -> {
                    java.net.URI uri = request.getURI();
                    assertThat(uri.getPath()).isEqualTo(
                            "/epic/ecom/v3/platforms/EPIC/identities/" + ACCOUNT_ID + "/ownership");
                    String query = java.net.URLDecoder.decode(uri.getRawQuery(), StandardCharsets.UTF_8);
                    assertThat(query).contains("nsCatalogItemId=" + SANDBOX_ID + ":" + CATALOG_ITEM_ID);
                })
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer " + ACCESS_TOKEN))
                .andRespond(withSuccess(OWNED_JSON, MediaType.APPLICATION_JSON));

        Optional<String> owner = service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC");

        assertThat(owner).contains("epic:" + ACCOUNT_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns the epic owner id when owned is true")
    void ownsCatalogItem_owned_returnsOwner() {
        expectTokenThenOwnership(OWNED_JSON);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC"))
                .contains("epic:" + ACCOUNT_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when Epic reports not owned")
    void ownsCatalogItem_notOwned_returnsEmpty() {
        expectTokenThenOwnership("""
                [
                  {
                    "namespace": "fn",
                    "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                    "owned": false
                  }
                ]
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the catalog item is missing from the list")
    void ownsCatalogItem_wrongItem_returnsEmpty() {
        expectTokenThenOwnership("""
                [
                  {
                    "namespace": "fn",
                    "catalogItemId": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "owned": true
                  }
                ]
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the item is in a different sandbox")
    void ownsCatalogItem_wrongSandbox_returnsEmpty() {
        expectTokenThenOwnership("""
                [
                  {
                    "namespace": "other",
                    "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                    "owned": true
                  }
                ]
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem accepts ownershipStatus OWNED from the EOS enum mapping")
    void ownsCatalogItem_ownershipStatusOwned() {
        expectTokenThenOwnership("""
                [
                  {
                    "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                    "ownershipStatus": "OWNED"
                  }
                ]
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC"))
                .contains("epic:" + ACCOUNT_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem accepts a wrapped items array")
    void ownsCatalogItem_wrappedItemsArray() {
        expectTokenThenOwnership("""
                {
                  "items": [
                    {
                      "itemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                      "owned": true
                    }
                  ]
                }
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC"))
                .contains("epic:" + ACCOUNT_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when credentials are missing and logs a warning")
    void ownsCatalogItem_missingCredentials_returnsEmpty_andLogsWarning() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        EpicService noKey = new EpicService(builder.build(), "", CLIENT_SECRET, DEPLOYMENT_ID);

        ListAppender<ILoggingEvent> appender = startLogCapture();
        try {
            assertThat(noKey.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
            assertThat(appender.list)
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .anyMatch(msg -> msg.contains("Epic Games credentials not configured"));
        } finally {
            stopLogCapture(appender);
        }
        local.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the client id is the placeholder value")
    void ownsCatalogItem_placeholderClientId_returnsEmpty() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        EpicService placeholder = new EpicService(
                builder.build(), EpicService.PLACEHOLDER_CLIENT_ID, CLIENT_SECRET, DEPLOYMENT_ID);

        assertThat(placeholder.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        local.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the client secret is the placeholder value")
    void ownsCatalogItem_placeholderSecret_returnsEmpty() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        EpicService placeholder = new EpicService(
                builder.build(), CLIENT_ID, EpicService.PLACEHOLDER_CLIENT_SECRET, DEPLOYMENT_ID);

        assertThat(placeholder.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        local.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the deployment id is the placeholder value")
    void ownsCatalogItem_placeholderDeployment_returnsEmpty() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        EpicService placeholder = new EpicService(
                builder.build(), CLIENT_ID, CLIENT_SECRET, EpicService.PLACEHOLDER_DEPLOYMENT_ID);

        assertThat(placeholder.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        local.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty on 401 Unauthorized from the token endpoint")
    void ownsCatalogItem_tokenUnauthorized_returnsEmpty() {
        mockServer.expect(requestTo("/epic/oauth/v2/token"))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"errorCode\":\"errors.com.epicgames.common.oauth.invalid_client\"}"));

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty on 403 from the ownership endpoint")
    void ownsCatalogItem_ownershipForbidden_returnsEmpty() {
        expectToken();
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/ownership")))
                .andRespond(withStatus(HttpStatus.FORBIDDEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"errorCode\":\"errors.com.epicgames.forbidden\"}"));

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty on 500 Internal Server Error")
    void ownsCatalogItem_serverError_returnsEmpty() {
        expectToken();
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/ownership")))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"internal\"}"));

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when the ownership body is empty")
    void ownsCatalogItem_emptyBody_returnsEmpty() {
        expectTokenThenOwnership("");

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when JSON is malformed and logs a warning")
    void ownsCatalogItem_malformedJson_returnsEmpty_andLogsWarning() {
        ListAppender<ILoggingEvent> appender = startLogCapture();
        try {
            expectTokenThenOwnership("{invalid json");
            assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
            assertThat(appender.list)
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .anyMatch(msg -> msg.contains("Failed to parse Epic Ecom ownership response"));
        } finally {
            stopLogCapture(appender);
        }
        mockServer.verify();
    }

    @Test
    @DisplayName("ownsCatalogItem returns empty when Epic returns an error object")
    void ownsCatalogItem_errorObject_returnsEmpty() {
        expectTokenThenOwnership("""
                {
                  "errorCode": "errors.com.epicgames.forbidden",
                  "errorMessage": "Sorry, your request must NOT have an authenticated user."
                }
                """);

        assertThat(service.ownsCatalogItem(ACCOUNT_ID, SANDBOX_ID, CATALOG_ITEM_ID, "EPIC")).isEmpty();
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when required fields are missing")
    void verify_missingRequiredFields_returnsDenied() {
        VerificationResult result = service.verify(Map.of("accountId", ACCOUNT_ID));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("accountId, sandboxId, and catalogItemId are required");
    }

    @Test
    @DisplayName("verify(null) denies with the same required-field message")
    void verify_nullRequest_returnsDenied() {
        VerificationResult result = service.verify(null);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("accountId, sandboxId, and catalogItemId are required");
    }

    @Test
    @DisplayName("verify returns denied when accountId is not a 32-char hex Epic Account ID")
    void verify_invalidAccountId_returnsDenied() {
        VerificationResult result = service.verify(Map.of(
                "accountId", "not-an-epic-id",
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("32-character Epic Account ID");
    }

    @Test
    @DisplayName("verify returns granted when Epic reports the item as owned")
    void verify_ownsItem_returnsGranted() {
        expectTokenThenOwnership(OWNED_JSON);

        VerificationResult result = service.verify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo("epic:" + ACCOUNT_ID);
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when the user does not own the catalog item")
    void verify_doesNotOwnItem_returnsDenied() {
        expectTokenThenOwnership("""
                [
                  {
                    "namespace": "fn",
                    "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                    "owned": false
                  }
                ]
                """);

        VerificationResult result = service.verify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).isEqualTo("Epic Games Store ownership not found");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify returns denied when sandboxId is not the configured official sandbox")
    void verify_sandboxNotAllowlisted_returnsDenied() {
        EpicService allowlisted = new EpicService(
                RestClient.builder().build(), CLIENT_ID, CLIENT_SECRET, DEPLOYMENT_ID,
                SANDBOX_ID, CATALOG_ITEM_ID);

        VerificationResult result = allowlisted.verify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", "other",
                "catalogItemId", CATALOG_ITEM_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("official ComputerPets Epic sandbox");
    }

    @Test
    @DisplayName("verify returns denied when catalogItemId is not the configured official item")
    void verify_catalogItemNotAllowlisted_returnsDenied() {
        EpicService allowlisted = new EpicService(
                RestClient.builder().build(), CLIENT_ID, CLIENT_SECRET, DEPLOYMENT_ID,
                SANDBOX_ID, CATALOG_ITEM_ID);

        VerificationResult result = allowlisted.verify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("official ComputerPets Epic catalog item");
    }

    @Test
    @DisplayName("verify returns denied when credentials are still placeholders")
    void verify_placeholderCredentials_returnsDenied() {
        EpicService placeholder = new EpicService(
                RestClient.builder().build(),
                EpicService.PLACEHOLDER_CLIENT_ID,
                EpicService.PLACEHOLDER_CLIENT_SECRET,
                EpicService.PLACEHOLDER_DEPLOYMENT_ID);

        VerificationResult result = placeholder.verify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).isEqualTo("Epic Games Store ownership not found");
    }

    private void expectTokenThenOwnership(String ownershipJson) {
        expectToken();
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/ownership")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(ownershipJson, MediaType.APPLICATION_JSON));
    }

    private void expectToken() {
        mockServer.expect(requestTo("/epic/oauth/v2/token"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess(TOKEN_JSON, MediaType.APPLICATION_JSON));
    }

    private static ListAppender<ILoggingEvent> startLogCapture() {
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        Logger logger = (Logger) LoggerFactory.getLogger(EpicService.class);
        logger.addAppender(appender);
        appender.start();
        return appender;
    }

    private static void stopLogCapture(ListAppender<ILoggingEvent> appender) {
        Logger logger = (Logger) LoggerFactory.getLogger(EpicService.class);
        logger.detachAppender(appender);
    }
}
