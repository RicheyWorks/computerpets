package com.enterprisepet.microsoft;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Verifies that a Microsoft account owns a Microsoft Store product.
 *
 * <p>Real flow: client obtains an XSTS token via the Xbox Live auth chain, sends it
 * (plus its {@code userHash}) here, and we POST a collections query to
 * {@code collections.mp.microsoft.com}. We accept ownership iff the response contains
 * the requested {@code productId} with an active fulfillment state.
 *
 * <p>Authorization header format Microsoft requires:
 * <pre>Authorization: XBL3.0 x=&lt;userHash&gt;;&lt;xstsToken&gt;</pre>
 *
 * <p>For local development without a real XSTS token, set
 * {@code microsoft.dev-mode=true} to bypass the network call and grant ownership for
 * any non-blank input. A loud warning is logged so this never silently leaks into
 * production.
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.microsoft.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class MicrosoftStoreService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(MicrosoftStoreService.class);

    /** Statuses Microsoft returns for an item the user actually owns. */
    private static final List<String> ACTIVE_STATUSES = List.of("Active", "ActiveSubscription");

    @Value("${microsoft.tenant:consumers}")
    private String tenant;

    @Value("${microsoft.collections-url:https://collections.mp.microsoft.com/v6.0/collections/query}")
    private String collectionsUrl;

    @Value("${microsoft.market:US}")
    private String market;

    @Value("${microsoft.dev-mode:false}")
    private boolean devMode;

    private RestClient restClient;
    private final ObjectMapper json = new ObjectMapper();

    // Default constructor for Spring
    public MicrosoftStoreService() {}

    // Package-private constructor for testing (allows injecting mocked RestClient)
    MicrosoftStoreService(RestClient restClient) {
        this.restClient = restClient;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            this.restClient = RestClient.builder()
                .baseUrl(collectionsUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        }
        if (devMode) {
            log.warn("===================================================================");
            log.warn(" MicrosoftStoreService is in DEV MODE. All ownership checks return");
            log.warn(" true. NEVER enable microsoft.dev-mode=true outside development.");
            log.warn("===================================================================");
        } else {
            log.info("MicrosoftStoreService ready. tenant={} market={} collectionsUrl={}",
                tenant, market, collectionsUrl);
        }
    }

    @Override public String key()         { return "microsoft"; }
    @Override public String displayName() { return "Microsoft Store"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        String xstsToken = request.get("xstsToken");
        String productId = request.get("storeProductId");
        String userHash  = request.getOrDefault("userHash", "");
        String accountId = request.getOrDefault("microsoftAccountId", "");

        if (xstsToken == null || xstsToken.isBlank()
            || productId == null || productId.isBlank()) {
            return VerificationResult.denied("xstsToken and storeProductId are required");
        }

        String ownerId = !accountId.isBlank() ? accountId
                       : !userHash.isBlank()  ? "ms:" + userHash
                       : "ms:" + productId;

        return ownsProduct(xstsToken, userHash, productId)
            ? VerificationResult.granted(ownerId)
            : VerificationResult.denied("Microsoft Store entitlement not found");
    }

    /**
     * Checks whether the bearer of the XSTS token has a Microsoft Store entitlement for
     * the given product ID. In dev mode this short-circuits to {@code true}.
     *
     * <p>The response field names (camelCase {@code productId} vs PascalCase
     * {@code ProductId}) vary between Microsoft Store endpoints — we accept either.
     */
    public boolean ownsProduct(String xstsToken, String userHash, String productId) {
        if (devMode) {
            log.warn("DEV MODE: granting Microsoft Store ownership without verification for productId={}",
                productId);
            return true;
        }
        try {
            String authValue = "XBL3.0 x=" + (userHash == null || userHash.isBlank() ? "-" : userHash)
                + ";" + xstsToken;

            Map<String, Object> body = Map.of(
                "Beneficiaries", List.of(Map.of(
                    "Identitytype", "xuid",
                    "IdentityValue", userHash == null ? "" : userHash,
                    "LocalTicketReference", "ticket1"
                )),
                "Market", market,
                "ProductSkuIds", List.of(Map.of("ProductId", productId))
            );

            String responseBody = restClient.post()
                .header(HttpHeaders.AUTHORIZATION, authValue)
                .body(body)
                .retrieve()
                .body(String.class);

            return responseContainsActiveProduct(responseBody, productId);
        } catch (Exception e) {
            log.warn("Microsoft Store verification failed productId={} error={}",
                productId, e.getMessage());
            return false;
        }
    }

    /**
     * Walks the {@code items} (or {@code Items}) array, looking for an entry whose
     * product ID matches and whose status is one of {@link #ACTIVE_STATUSES}.
     * Visible for testing.
     */
    boolean responseContainsActiveProduct(String responseJson, String productId) {
        if (responseJson == null || responseJson.isBlank()) return false;
        try {
            JsonNode root = json.readTree(responseJson);
            JsonNode items = firstNonMissing(root, "items", "Items");
            if (!items.isArray()) return false;

            for (JsonNode item : items) {
                String returnedProductId = firstNonMissing(item, "productId", "ProductId").asText("");
                if (!productId.equalsIgnoreCase(returnedProductId)) continue;

                String status = firstNonMissing(item, "status", "Status").asText("Active");
                if (ACTIVE_STATUSES.stream().anyMatch(s -> s.equalsIgnoreCase(status))) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.warn("Could not parse Microsoft Store response: {}", e.getMessage());
            return false;
        }
    }

    private static JsonNode firstNonMissing(JsonNode node, String... names) {
        for (String n : names) {
            JsonNode v = node.path(n);
            if (!v.isMissingNode() && !v.isNull()) return v;
        }
        return com.fasterxml.jackson.databind.node.MissingNode.getInstance();
    }

    /** How long we'll wait for a Microsoft response before giving up. */
    @SuppressWarnings("unused")
    private static final Duration MS_TIMEOUT = Duration.ofSeconds(10);
}
