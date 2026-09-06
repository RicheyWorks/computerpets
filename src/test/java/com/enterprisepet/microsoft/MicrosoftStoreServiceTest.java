package com.enterprisepet.microsoft;

import com.enterprisepet.provider.VerificationResult;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.http.client.MockClientHttpRequest;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class MicrosoftStoreServiceTest {

    private static final String PRODUCT_ID = "9N30KZZF4BR9";
    private static final String OTHER_PRODUCT_ID = "9MXL21XPWWWK";
    private static final String XSTS = "test-xsts-token";
    private static final String USER_HASH = "123456789012345";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private MicrosoftStoreService service;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        // House door is the test product. A foreign client product must not open it.
        service = new MicrosoftStoreService(
                builder.build(), false, MicrosoftStoreService.DEFAULT_COLLECTIONS_URL, PRODUCT_ID);
    }

    @Test
    @DisplayName("v9 fixture: Active matching productId grants")
    void v9Fixture_activeMatchingProduct_grants() throws Exception {
        String fixture = readFixture();
        assertThat(service.responseContainsActiveProduct(fixture, PRODUCT_ID)).isTrue();
        assertThat(service.responseContainsActiveProduct(fixture, OTHER_PRODUCT_ID)).isTrue();
    }

    @Test
    @DisplayName("v9 fixture: wrong productId denies")
    void v9Fixture_wrongProductId_denies() throws Exception {
        assertThat(service.responseContainsActiveProduct(readFixture(), "9NNOTINTHELIST")).isFalse();
    }

    @Test
    @DisplayName("v9 items with Revoked status denies")
    void v9Items_revoked_denies() {
        String json = """
            { "items": [ { "productId": "9N30KZZF4BR9", "status": "Revoked" } ] }
            """;
        assertThat(service.responseContainsActiveProduct(json, PRODUCT_ID)).isFalse();
    }

    @Test
    @DisplayName("v9 items with Expired status denies")
    void v9Items_expired_denies() {
        String json = """
            { "items": [ { "productId": "9N30KZZF4BR9", "status": "Expired" } ] }
            """;
        assertThat(service.responseContainsActiveProduct(json, PRODUCT_ID)).isFalse();
    }

    @Test
    @DisplayName("empty items denies")
    void v9Items_empty_denies() {
        assertThat(service.responseContainsActiveProduct("{ \"items\": [] }", PRODUCT_ID)).isFalse();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns true for Active status")
    void responseContainsActiveProduct_activeStatus_returnsTrue() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "Active" }
              ]
            }
            """;

        assertThat(service.responseContainsActiveProduct(json, "9N1234567890")).isTrue();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns true for ActiveSubscription")
    void responseContainsActiveProduct_activeSubscription_returnsTrue() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "ActiveSubscription" }
              ]
            }
            """;

        assertThat(service.responseContainsActiveProduct(json, "9N1234567890")).isTrue();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns false for non-active status")
    void responseContainsActiveProduct_inactive_returnsFalse() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "Suspended" }
              ]
            }
            """;

        assertThat(service.responseContainsActiveProduct(json, "9N1234567890")).isFalse();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns false when product not present")
    void responseContainsActiveProduct_productNotFound_returnsFalse() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N9999999999", "Status": "Active" }
              ]
            }
            """;

        assertThat(service.responseContainsActiveProduct(json, "9N1234567890")).isFalse();
    }

    @Test
    @DisplayName("responseContainsActiveProduct handles camelCase and PascalCase keys")
    void responseContainsActiveProduct_mixedCase_returnsTrue() {
        String json = """
            {
              "Items": [
                { "productId": "9N1234567890", "status": "Active" }
              ]
            }
            """;

        assertThat(service.responseContainsActiveProduct(json, "9N1234567890")).isTrue();
    }

    @Test
    @DisplayName("missing status does not default to Active")
    void responseContainsActiveProduct_missingStatus_returnsFalse() {
        String json = """
            { "items": [ { "productId": "9N30KZZF4BR9" } ] }
            """;
        assertThat(service.responseContainsActiveProduct(json, PRODUCT_ID)).isFalse();
    }

    @Test
    @DisplayName("placeholder storeProductId is denied without a network call")
    void verify_placeholderProductId_deniedWithoutNetwork() {
        for (String placeholder : new String[] {"CHANGE_ME", "PLACEHOLDER", "0000", "change_me"}) {
            VerificationResult result = service.verify(Map.of(
                    "xstsToken", XSTS,
                    "storeProductId", placeholder
            ));
            assertThat(result.verified()).isFalse();
            assertThat(result.reason()).contains("placeholder");
        }
        mockServer.verify();
    }

    @Test
    @DisplayName("missing xstsToken is denied")
    void verify_missingXstsToken_denied() {
        VerificationResult result = service.verify(Map.of("storeProductId", PRODUCT_ID));
        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("xstsToken and storeProductId are required");
        mockServer.verify();
    }

    @Test
    @DisplayName("missing storeProductId is denied")
    void verify_missingStoreProductId_denied() {
        VerificationResult result = service.verify(Map.of("xstsToken", XSTS));
        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("xstsToken and storeProductId are required");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify denies a foreign product even when Collections would say they own it")
    void verify_unlistedProductId_deniedEvenWhenCollectionsWouldOwnIt() {
        VerificationResult result = service.verify(Map.of(
                "xstsToken", XSTS,
                "storeProductId", OTHER_PRODUCT_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("house Microsoft Store door");
        mockServer.verify();
    }

    @Test
    @DisplayName("verify denies when the house Microsoft Store door is empty")
    void verify_emptyAllowlist_returnsDenied() {
        MicrosoftStoreService emptyDoor = new MicrosoftStoreService(
                RestClient.builder().build(), false);

        VerificationResult result = emptyDoor.verify(Map.of(
                "xstsToken", XSTS,
                "storeProductId", PRODUCT_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("Microsoft Store door is not hung yet");
    }

    @Test
    @DisplayName("verify grants when a listed house product is owned")
    void verify_listedAllowlistProduct_collectionsOwns_grants() throws Exception {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        MicrosoftStoreService listed = new MicrosoftStoreService(
                builder.build(), false, MicrosoftStoreService.DEFAULT_COLLECTIONS_URL,
                OTHER_PRODUCT_ID + "," + PRODUCT_ID);

        local.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andRespond(withSuccess(readFixture(), MediaType.APPLICATION_JSON));

        VerificationResult result = listed.verify(Map.of(
                "xstsToken", XSTS,
                "userHash", USER_HASH,
                "storeProductId", PRODUCT_ID,
                "microsoftAccountId", "ms-account-1"
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo("ms-account-1");
        local.verify();
    }

    @Test
    @DisplayName("dev-mode still grants without calling Collections")
    void verify_devMode_grantsWithoutNetwork() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer local = MockRestServiceServer.bindTo(builder).build();
        MicrosoftStoreService dev = new MicrosoftStoreService(
                builder.build(), true, MicrosoftStoreService.DEFAULT_COLLECTIONS_URL, PRODUCT_ID);

        VerificationResult result = dev.verify(Map.of(
                "xstsToken", XSTS,
                "userHash", USER_HASH,
                "storeProductId", PRODUCT_ID
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo("ms:" + USER_HASH);
        local.verify();
    }

    @Test
    @DisplayName("X-token request body is camelCase v9 (productSkuIds, no Market, no Beneficiaries)")
    void ownsProduct_xToken_sendsCamelCaseV9Body() throws Exception {
        expectPublisherQuery(request -> {
            JsonNode body = MAPPER.readTree(((MockClientHttpRequest) request).getBodyAsString());
            assertThat(body.has("productSkuIds")).isTrue();
            assertThat(body.has("ProductSkuIds")).isFalse();
            assertThat(body.has("Market")).isFalse();
            assertThat(body.has("market")).isFalse();
            assertThat(body.has("beneficiaries")).isFalse();
            assertThat(body.has("Beneficiaries")).isFalse();
            assertThat(body.path("maxPageSize").asInt()).isEqualTo(100);
            assertThat(body.path("excludeDuplicates").asBoolean()).isTrue();
            assertThat(body.path("validityType").asText()).isEqualTo("Valid");
            assertThat(body.path("productSkuIds").get(0).path("productId").asText())
                    .isEqualTo(PRODUCT_ID);
            assertThat(body.path("productSkuIds").get(0).has("skuId")).isFalse();
        }, activeItemJson(PRODUCT_ID));

        assertThat(service.ownsProduct(XSTS, USER_HASH, PRODUCT_ID)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("XSTS Authorization uses XBL3.0 x=<userHash>;<token>")
    void ownsProduct_sendsXbl30Authorization() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "XBL3.0 x=" + USER_HASH + ";" + XSTS))
                .andExpect(header("User-Agent", MicrosoftStoreService.USER_AGENT))
                .andRespond(withSuccess(activeItemJson(PRODUCT_ID), MediaType.APPLICATION_JSON));

        assertThat(service.ownsProduct(XSTS, USER_HASH, PRODUCT_ID)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("Bearer token is forwarded as-is when the client already sends one")
    void ownsProduct_bearerToken_forwarded() {
        String bearer = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.e30.sig";
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", bearer))
                .andRespond(withSuccess(activeItemJson(PRODUCT_ID), MediaType.APPLICATION_JSON));

        MicrosoftVerifyRequest request = new MicrosoftVerifyRequest(
                bearer, PRODUCT_ID, USER_HASH, null, null, null, null);
        assertThat(service.ownsProduct(request)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("Signature is forwarded as the Signature header when supplied")
    void ownsProduct_forwardsSignatureHeader() {
        String signature = "xtoken-signature-bytes";
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Signature", signature))
                .andRespond(withSuccess(activeItemJson(PRODUCT_ID), MediaType.APPLICATION_JSON));

        MicrosoftVerifyRequest request = new MicrosoftVerifyRequest(
                XSTS, PRODUCT_ID, USER_HASH, null, signature, null, null);
        assertThat(service.ownsProduct(request)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("userStoreId adds beneficiaries (b2b) and optional skuId is forwarded")
    void ownsProduct_userStoreId_includesBeneficiariesAndSku() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(request -> {
                    JsonNode body = MAPPER.readTree(((MockClientHttpRequest) request).getBodyAsString());
                    assertThat(body.path("productSkuIds").get(0).path("skuId").asText()).isEqualTo("0010");
                    JsonNode beneficiary = body.path("beneficiaries").get(0);
                    assertThat(beneficiary.path("identityType").asText()).isEqualTo("b2b");
                    assertThat(beneficiary.path("identityValue").asText()).isEqualTo("user-store-id-jwt");
                })
                .andRespond(withSuccess(activeItemJson(PRODUCT_ID), MediaType.APPLICATION_JSON));

        MicrosoftVerifyRequest request = MicrosoftVerifyRequest.from(Map.of(
                "xstsToken", "Bearer entra-token",
                "storeProductId", PRODUCT_ID,
                "userStoreId", "user-store-id-jwt",
                "skuId", "0010"
        ));
        assertThat(service.ownsProduct(request)).isTrue();
        mockServer.verify();
    }

    @Test
    @DisplayName("verify grants when Collections says they own the house product")
    void verify_activeProduct_grants() throws Exception {
        expectPublisherQuery(request -> { }, readFixture());

        VerificationResult result = service.verify(Map.of(
                "xstsToken", XSTS,
                "userHash", USER_HASH,
                "storeProductId", PRODUCT_ID,
                "microsoftAccountId", "ms-account-1"
        ));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo("ms-account-1");
        mockServer.verify();
    }

    @Test
    @DisplayName("429 from Microsoft is denied and logged distinctly")
    void ownsProduct_rateLimited_deniesAndLogs() {
        ListAppender<ILoggingEvent> appender = startLogCapture();
        try {
            mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                    .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("{\"code\":\"RateLimit\"}"));

            assertThat(service.ownsProduct(XSTS, USER_HASH, PRODUCT_ID)).isFalse();
            assertThat(appender.list)
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .anyMatch(msg -> msg.contains("429") && msg.contains("100 queries"));
        } finally {
            stopLogCapture(appender);
        }
        mockServer.verify();
    }

    @Test
    @DisplayName("network / parse failures fail closed")
    void ownsProduct_malformedJson_denies() {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andRespond(withSuccess("{not-json", MediaType.APPLICATION_JSON));

        assertThat(service.ownsProduct(XSTS, USER_HASH, PRODUCT_ID)).isFalse();
        mockServer.verify();
    }

    @Test
    @DisplayName("MicrosoftVerifyRequest.from maps identityValue to userStoreId")
    void typedRequest_identityValueAlias() {
        MicrosoftVerifyRequest request = MicrosoftVerifyRequest.from(Map.of(
                "xstsToken", XSTS,
                "storeProductId", PRODUCT_ID,
                "identityValue", "b2b-ticket"
        ));
        assertThat(request.userStoreId()).isEqualTo("b2b-ticket");
        assertThat(request.hasUserStoreIdentity()).isTrue();
    }

    private void expectPublisherQuery(
            org.springframework.test.web.client.RequestMatcher bodyMatcher,
            String responseJson) {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/v9.0/collections/publisherQuery")))
                .andExpect(method(HttpMethod.POST))
                .andExpect(bodyMatcher)
                .andRespond(withSuccess(responseJson, MediaType.APPLICATION_JSON));
    }

    private static String activeItemJson(String productId) {
        return """
            { "items": [ { "productId": "%s", "status": "Active" } ] }
            """.formatted(productId);
    }

    private static String readFixture() throws IOException {
        try (InputStream in = MicrosoftStoreServiceTest.class.getResourceAsStream(
                "/microsoft/publisher-query-v9-sample.json")) {
            assertThat(in).isNotNull();
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static ListAppender<ILoggingEvent> startLogCapture() {
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        Logger logger = (Logger) LoggerFactory.getLogger(MicrosoftStoreService.class);
        logger.addAppender(appender);
        appender.start();
        return appender;
    }

    private static void stopLogCapture(ListAppender<ILoggingEvent> appender) {
        Logger logger = (Logger) LoggerFactory.getLogger(MicrosoftStoreService.class);
        logger.detachAppender(appender);
    }
}
