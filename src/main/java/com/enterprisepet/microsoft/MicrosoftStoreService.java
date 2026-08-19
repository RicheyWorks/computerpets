package com.enterprisepet.microsoft;

import com.enterprisepet.observability.ObservedRestClients;
import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.micrometer.observation.ObservationRegistry;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Asks Microsoft whether a keeper owns a house Store product.
 *
 * <p>The client may name a {@code storeProductId}. The house only opens when
 * that id is on the configured door ({@code microsoft.product-id} / allowlist)
 * and Collections says they own it. An empty door fails closed — owning any
 * Microsoft Store product does not sit you here. Do not invent a live
 * ComputerPets Store id; leave {@code microsoft.product-id} empty until one
 * exists.
 *
 * <p>Real flow: the client obtains an XSTS token via the Xbox Live auth chain
 * (or a Bearer token for Entra / User Store ID) and POSTs it here. We call
 * Collections Query v9 {@code publisherQuery} and grant only when {@code items}
 * contains the requested {@code productId} with status {@code Active}
 * (or {@code ActiveSubscription} if it still appears).
 *
 * <p>Authorization: existing client XSTS shape
 * {@code XBL3.0 x=<userHash>;<xstsToken>}, or a Bearer token if the client
 * already sends one. When the request includes {@code signature}, it is
 * forwarded as the {@code Signature} header (required by Microsoft for
 * X-token auth).
 *
 * <p>For local development without a real XSTS token, set
 * {@code microsoft.dev-mode=true} to bypass the network call. The house
 * door still applies. A loud warning is logged so this never silently
 * leaks into production. {@code ProductionProfileGuard} refuses that
 * flag on the {@code prod} profile.
 *
 * @see <a href="https://learn.microsoft.com/en-us/gaming/gdk/docs/store/commerce/service-to-service/microsoft-store-apis/xstore-v9-query-for-products">
 * Collections v9 publisherQuery</a>
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.microsoft.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class MicrosoftStoreService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(MicrosoftStoreService.class);

    static final String DEFAULT_COLLECTIONS_URL =
            "https://collections.mp.microsoft.com/v9.0/collections/publisherQuery";

    static final String USER_AGENT = "ComputerPets/1.0";

    /** Statuses Microsoft returns for an item the user actually owns. */
    private static final List<String> ACTIVE_STATUSES = List.of("Active", "ActiveSubscription");

    /** Rejected the same way Steam/Itch/Epic reject leftover documentation values. */
    private static final Set<String> PLACEHOLDER_PRODUCT_IDS = Set.of(
            "CHANGE_ME", "PLACEHOLDER", "0000");

    @Value("${microsoft.tenant:consumers}")
    private String tenant;

    @Value("${microsoft.collections-url:" + DEFAULT_COLLECTIONS_URL + "}")
    private String collectionsUrl;

    /**
     * House Microsoft Store door. Empty, or a single product id, or a
     * comma/whitespace allowlist. Empty fails closed.
     */
    @Value("${microsoft.product-id:}")
    private String configuredProductId;

    @Value("${microsoft.dev-mode:false}")
    private boolean devMode;

    private RestClient restClient;
    private final ObjectMapper json = new ObjectMapper();

    @Autowired
    private ObservationRegistry observationRegistry = ObservationRegistry.NOOP;

    public MicrosoftStoreService() {}

    MicrosoftStoreService(RestClient restClient) {
        this(restClient, false, DEFAULT_COLLECTIONS_URL);
    }

    MicrosoftStoreService(RestClient restClient, boolean devMode) {
        this(restClient, devMode, DEFAULT_COLLECTIONS_URL);
    }

    MicrosoftStoreService(RestClient restClient, boolean devMode, String collectionsUrl) {
        this(restClient, devMode, collectionsUrl, "");
    }

    MicrosoftStoreService(RestClient restClient, boolean devMode, String collectionsUrl,
                          String configuredProductId) {
        this.restClient = restClient;
        this.devMode = devMode;
        this.collectionsUrl = collectionsUrl;
        this.configuredProductId = configuredProductId;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            // publisherQuery is a JSON POST; HTTP/1.1 avoids JDK HttpClient h2c
            // RST_STREAM against HTTP/1 stubs (and matches the Learn examples).
            HttpClient httpClient = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .connectTimeout(MS_TIMEOUT)
                    .build();
            JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
            requestFactory.setReadTimeout(MS_TIMEOUT);
            this.restClient = ObservedRestClients.builder(observationRegistry)
                .requestFactory(requestFactory)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, USER_AGENT)
                .build();
        }
        if (devMode) {
            log.warn("===================================================================");
            log.warn(" MicrosoftStoreService is in DEV MODE. Collections is not asked.");
            log.warn(" The house door still applies. NEVER enable microsoft.dev-mode=true");
            log.warn(" outside development.");
            log.warn("===================================================================");
        } else {
            log.info("MicrosoftStoreService ready. tenant={} collectionsUrl={}",
                tenant, collectionsUrl);
        }
    }

    @Override public String key()         { return "microsoft"; }
    @Override public String displayName() { return "Microsoft Store"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        MicrosoftVerifyRequest typed = MicrosoftVerifyRequest.from(request);
        if (typed.xstsToken() == null || typed.storeProductId() == null) {
            return VerificationResult.denied("xstsToken and storeProductId are required");
        }
        if (isPlaceholderProductId(typed.storeProductId())) {
            return VerificationResult.denied("storeProductId looks like a placeholder");
        }
        Set<String> houseProductIds = houseProductIds();
        if (houseProductIds.isEmpty()) {
            return VerificationResult.denied("the Microsoft Store door is not hung yet");
        }
        if (!isHouseProduct(typed.storeProductId(), houseProductIds)) {
            return VerificationResult.denied("storeProductId is not a house Microsoft Store door");
        }

        String accountId = typed.microsoftAccountId() == null ? "" : typed.microsoftAccountId();
        String userHash = typed.userHash() == null ? "" : typed.userHash();
        String ownerId = !accountId.isBlank() ? accountId
                       : !userHash.isBlank()  ? "ms:" + userHash
                       : "ms:" + typed.storeProductId();

        return ownsProduct(typed)
            ? VerificationResult.granted(ownerId)
            : VerificationResult.denied("Microsoft Store entitlement not found");
    }

    /**
     * Asks Collections whether the bearer owns {@code storeProductId}.
     * The house door is {@link #verify}; this only hears Microsoft.
     * In dev mode this short-circuits to {@code true}.
     *
     * <p>The response field names (camelCase {@code productId} vs PascalCase
     * {@code ProductId}) vary between Microsoft Store endpoints — we accept either.
     * Protected by Resilience4j circuit breaker + retry (Phase 2.3).
     */
    @CircuitBreaker(name = "microsoft", fallbackMethod = "ownsProductFallback")
    @Retry(name = "microsoft")
    public boolean ownsProduct(MicrosoftVerifyRequest request) {
        if (request == null || request.storeProductId() == null) {
            return false;
        }
        if (devMode) {
            log.warn("DEV MODE: granting Microsoft Store ownership without verification for productId={}",
                request.storeProductId());
            return true;
        }
        if (isPlaceholderProductId(request.storeProductId())) {
            log.warn("Microsoft Store product id looks like a placeholder — denying without calling Collections");
            return false;
        }
        try {
            Map<String, Object> body = publisherQueryBody(request);

            var spec = restClient.post()
                .uri(collectionsUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.USER_AGENT, USER_AGENT)
                .header(HttpHeaders.AUTHORIZATION, authorizationHeader(request));
            if (request.hasSignature()) {
                spec = spec.header("Signature", request.signature());
            }

            String responseBody = spec
                .body(body)
                .retrieve()
                .body(String.class);

            return responseContainsActiveProduct(responseBody, request.storeProductId());
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == HttpStatus.TOO_MANY_REQUESTS.value()) {
                log.warn("Microsoft Store rate-limited (429) productId={} — 100 queries / 5 min / user",
                    request.storeProductId());
            } else {
                log.warn("Microsoft Store verification failed productId={} status={} error={}",
                    request.storeProductId(), e.getStatusCode().value(), e.getMessage());
            }
            return false;
        } catch (Exception e) {
            log.warn("Microsoft Store verification failed productId={} error={}",
                request.storeProductId(), e.getMessage());
            return false;
        }
    }

    /** Convenience wrapper used by older call sites and focused unit tests. */
    public boolean ownsProduct(String xstsToken, String userHash, String productId) {
        return ownsProduct(new MicrosoftVerifyRequest(
                xstsToken, productId, userHash, null, null, null, null));
    }

    @SuppressWarnings("unused")
    private boolean ownsProductFallback(MicrosoftVerifyRequest request, Exception e) {
        String productId = request == null ? "?" : request.storeProductId();
        log.warn("Microsoft circuit breaker open or retries exhausted for productId={}: {}",
            productId, e.getMessage());
        return false;
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

                String status = firstNonMissing(item, "status", "Status").asText("");
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

    /**
     * Configured house product ids from {@code microsoft.product-id} (single
     * or comma/whitespace allowlist). Empty means the door is not hung.
     */
    Set<String> houseProductIds() {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        addProductIds(ids, configuredProductId);
        return Set.copyOf(ids);
    }

    private static void addProductIds(Set<String> dest, String raw) {
        if (raw == null || raw.isBlank()) {
            return;
        }
        for (String part : raw.split("[,\\s]+")) {
            if (!part.isBlank()) {
                dest.add(part.trim());
            }
        }
    }

    /** Collections matches product ids without regard to case. */
    private static boolean isHouseProduct(String productId, Set<String> houseProductIds) {
        for (String house : houseProductIds) {
            if (house.equalsIgnoreCase(productId)) {
                return true;
            }
        }
        return false;
    }

    static boolean isPlaceholderProductId(String productId) {
        if (productId == null || productId.isBlank()) {
            return true;
        }
        return PLACEHOLDER_PRODUCT_IDS.contains(productId.trim().toUpperCase(Locale.ROOT));
    }

    static String authorizationHeader(MicrosoftVerifyRequest request) {
        String token = request.xstsToken() == null ? "" : request.xstsToken().trim();
        if (startsWithIgnoreCase(token, "Bearer ") || startsWithIgnoreCase(token, "XBL3.0 ")) {
            return token;
        }
        String hash = request.userHash() == null || request.userHash().isBlank()
                ? "-"
                : request.userHash();
        return "XBL3.0 x=" + hash + ";" + token;
    }

    Map<String, Object> publisherQueryBody(MicrosoftVerifyRequest request) {
        Map<String, Object> sku = new LinkedHashMap<>();
        sku.put("productId", request.storeProductId());
        if (request.hasSkuId()) {
            sku.put("skuId", request.skuId());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("maxPageSize", 100);
        body.put("excludeDuplicates", true);
        body.put("validityType", "Valid");
        body.put("productSkuIds", List.of(sku));

        if (request.hasUserStoreIdentity()) {
            Map<String, Object> beneficiary = new LinkedHashMap<>();
            beneficiary.put("identityType", "b2b");
            beneficiary.put("identityValue", request.userStoreId());
            beneficiary.put("localTicketReference", "");
            List<Map<String, Object>> beneficiaries = new ArrayList<>();
            beneficiaries.add(beneficiary);
            body.put("beneficiaries", beneficiaries);
        }
        return body;
    }

    private static boolean startsWithIgnoreCase(String value, String prefix) {
        return value.regionMatches(true, 0, prefix, 0, prefix.length());
    }

    private static JsonNode firstNonMissing(JsonNode node, String... names) {
        for (String n : names) {
            JsonNode v = node.path(n);
            if (!v.isMissingNode() && !v.isNull()) return v;
        }
        return com.fasterxml.jackson.databind.node.MissingNode.getInstance();
    }

    /** How long we'll wait for a Microsoft response before giving up. */
    private static final Duration MS_TIMEOUT = Duration.ofSeconds(10);
}
