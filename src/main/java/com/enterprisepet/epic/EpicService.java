package com.enterprisepet.epic;

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
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Verifies Epic Games Store ownership via the documented EOS Ecom Web API.
 *
 * <p>This is the Steam analog: the server holds a Trusted Server client
 * ({@code EPIC_CLIENT_ID} / {@code EPIC_CLIENT_SECRET} / {@code EPIC_DEPLOYMENT_ID}),
 * the client sends an Epic Account ID plus {@code sandboxId:catalogItemId},
 * and we ask Epic whether that account owns that catalog item. There is no
 * "always owns" stub and no invented sandbox.
 *
 * <p>HTTP contract (public docs):
 * <ol>
 *   <li>{@code POST https://api.epicgames.dev/epic/oauth/v2/token}
 *       with {@code grant_type=client_credentials} and HTTP Basic
 *       {@code clientId:clientSecret}. Ecommerce calls require
 *       {@code deployment_id}.</li>
 *   <li>{@code GET https://api.epicgames.dev/epic/ecom/v3/platforms/{platform}/identities/{accountId}/ownership?nsCatalogItemId={sandboxId:catalogItemId}}
 *       with {@code Authorization: Bearer &lt;access_token&gt;}.</li>
 * </ol>
 *
 * <p>A placeholder or blank client id / secret / deployment id fails closed
 * (ownership denied), the same way a missing Steam Web API key does. Live
 * credentials come from the Epic Developer Portal (Trusted Server client
 * policy with the Ecom feature enabled). Do not invent a ComputerPets
 * sandbox or catalog item id; leave the optional allowlists empty until
 * a store page exists.
 *
 * @see <a href="https://dev.epicgames.com/docs/web-api-ref/authentication">EOS Auth Web APIs</a>
 * @see <a href="https://dev.epicgames.com/docs/web-api-ref/ecom-web-apis">EOS Ecom Web APIs</a>
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.epic.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class EpicService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(EpicService.class);

    /** Rejected as an obvious leftover from documentation / application.yml. */
    static final String PLACEHOLDER_CLIENT_ID = "YOUR_EPIC_CLIENT_ID";
    static final String PLACEHOLDER_CLIENT_SECRET = "YOUR_EPIC_CLIENT_SECRET";
    static final String PLACEHOLDER_DEPLOYMENT_ID = "YOUR_EPIC_DEPLOYMENT_ID";

    private static final String DEFAULT_PLATFORM = "EPIC";

    /** Epic Account IDs in the public Auth docs are 32-char hex. */
    private static final Pattern ACCOUNT_ID = Pattern.compile("[0-9a-fA-F]{32}");

    /** Sandbox / catalog item ids are hex or short product slugs; reject junk. */
    private static final Pattern CATALOG_TOKEN = Pattern.compile("[A-Za-z0-9._-]{1,64}");

    private static final Pattern PLATFORM = Pattern.compile("[A-Za-z]{2,16}");

    @Value("${epic.client-id}")
    private String clientId;

    @Value("${epic.client-secret}")
    private String clientSecret;

    @Value("${epic.deployment-id}")
    private String deploymentId;

    @Value("${epic.api-base-url:https://api.epicgames.dev}")
    private String apiBaseUrl;

    /**
     * Optional official sandbox allowlist. Empty means any sandbox the
     * Trusted Server client is allowed to query.
     */
    @Value("${epic.sandbox-id:}")
    private String configuredSandboxId;

    /**
     * Optional official catalog-item allowlist. Empty means any item the
     * Trusted Server client is allowed to query.
     */
    @Value("${epic.catalog-item-id:}")
    private String configuredCatalogItemId;

    private RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ObservationRegistry observationRegistry = ObservationRegistry.NOOP;

    public EpicService() {}

    EpicService(RestClient restClient, String clientId, String clientSecret, String deploymentId) {
        this.restClient = restClient;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.deploymentId = deploymentId;
    }

    EpicService(RestClient restClient, String clientId, String clientSecret, String deploymentId,
                String configuredSandboxId, String configuredCatalogItemId) {
        this(restClient, clientId, clientSecret, deploymentId);
        this.configuredSandboxId = configuredSandboxId;
        this.configuredCatalogItemId = configuredCatalogItemId;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            this.restClient = ObservedRestClients.builder(observationRegistry)
                    .baseUrl(apiBaseUrl)
                    .build();
        }
        if (isUnconfigured()) {
            log.warn("Epic Games credentials not configured. Epic ownership verification will fail until EPIC_CLIENT_ID, EPIC_CLIENT_SECRET, and EPIC_DEPLOYMENT_ID are set.");
        }
    }

    @Override public String key()         { return "epic"; }
    @Override public String displayName() { return "Epic Games Store"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        EpicVerifyRequest typed = EpicVerifyRequest.from(request);
        String accountId = typed.accountId();
        String sandboxId = typed.sandboxId();
        String catalogItemId = typed.catalogItemId();
        String platform = typed.platform() == null ? DEFAULT_PLATFORM : typed.platform();

        if (accountId == null || sandboxId == null || catalogItemId == null) {
            return VerificationResult.denied("accountId, sandboxId, and catalogItemId are required");
        }
        if (!ACCOUNT_ID.matcher(accountId).matches()) {
            return VerificationResult.denied("accountId must be a 32-character Epic Account ID");
        }
        if (!CATALOG_TOKEN.matcher(sandboxId).matches()) {
            return VerificationResult.denied("sandboxId is not a valid Epic sandbox id");
        }
        if (!CATALOG_TOKEN.matcher(catalogItemId).matches()) {
            return VerificationResult.denied("catalogItemId is not a valid Epic catalog item id");
        }
        if (!PLATFORM.matcher(platform).matches()) {
            return VerificationResult.denied("platform must be a letter-only Epic platform code (default EPIC)");
        }
        if (!isBlank(configuredSandboxId) && !configuredSandboxId.trim().equals(sandboxId)) {
            return VerificationResult.denied("sandboxId is not an official ComputerPets Epic sandbox");
        }
        if (!isBlank(configuredCatalogItemId) && !configuredCatalogItemId.trim().equals(catalogItemId)) {
            return VerificationResult.denied("catalogItemId is not an official ComputerPets Epic catalog item");
        }

        return ownsCatalogItem(accountId, sandboxId, catalogItemId, platform)
                .map(VerificationResult::granted)
                .orElseGet(() -> VerificationResult.denied("Epic Games Store ownership not found"));
    }

    /**
     * Asks Epic whether {@code accountId} owns {@code sandboxId:catalogItemId}.
     * Returns {@code epic:{accountId}} on success. Protected by Resilience4j.
     */
    @CircuitBreaker(name = "epic", fallbackMethod = "ownsCatalogItemFallback")
    @Retry(name = "epic")
    public Optional<String> ownsCatalogItem(String accountId, String sandboxId,
                                            String catalogItemId, String platform) {
        log.info("Checking Epic Games Store ownership accountId={} sandboxId={} catalogItemId={}",
                accountId, sandboxId, catalogItemId);

        if (isUnconfigured()) {
            log.warn("Epic Games credentials not configured. Epic ownership verification will fail.");
            return Optional.empty();
        }

        try {
            String accessToken = requestClientCredentialsToken();
            if (accessToken == null || accessToken.isBlank()) {
                return Optional.empty();
            }

            String nsCatalogItemId = sandboxId + ":" + catalogItemId;
            String responseBody = restClient.get()
                    .uri("/epic/ecom/v3/platforms/{platform}/identities/{accountId}/ownership?nsCatalogItemId={ns}",
                            platform, accountId, nsCatalogItemId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(String.class);

            return ownedFromResponse(responseBody, sandboxId, catalogItemId)
                    ? Optional.of("epic:" + accountId)
                    : Optional.empty();
        } catch (Exception e) {
            log.warn("Epic Games API call failed for accountId={}: {}", accountId, e.getMessage());
            return Optional.empty();
        }
    }

    @SuppressWarnings("unused")
    private Optional<String> ownsCatalogItemFallback(String accountId, String sandboxId,
                                                     String catalogItemId, String platform, Exception e) {
        log.warn("Epic circuit breaker open or max retries exceeded for accountId={}: {}",
                accountId, e.getMessage());
        return Optional.empty();
    }

    /**
     * {@code POST /epic/oauth/v2/token} with {@code grant_type=client_credentials}.
     * Visible for testing.
     */
    String requestClientCredentialsToken() {
        String basic = Base64.getEncoder().encodeToString(
                (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8));
        String body = "grant_type=client_credentials&deployment_id="
                + URLEncoder.encode(deploymentId, StandardCharsets.UTF_8);

        String responseBody = restClient.post()
                .uri("/epic/oauth/v2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + basic)
                .body(body)
                .retrieve()
                .body(String.class);

        return accessTokenFromResponse(responseBody);
    }

    /**
     * Reads {@code access_token} from the Auth Web API token JSON.
     * Visible for testing.
     */
    String accessTokenFromResponse(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            JsonNode root = objectMapper.readTree(json);
            String token = root.path("access_token").asText("");
            return token.isBlank() ? null : token;
        } catch (Exception e) {
            log.warn("Failed to parse Epic OAuth token response: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Walks the Ecom v3 ownership JSON. Visible for testing.
     *
     * <p>The documented request returns a list of catalog items (root array, or
     * wrapped under {@code items} / {@code ownership} / {@code data}). Grant
     * only when a matching {@code catalogItemId} (or {@code itemId} / {@code id})
     * is present and marked owned. Unknown shapes fail closed.
     */
    boolean ownedFromResponse(String json, String sandboxId, String catalogItemId) {
        if (json == null || json.isBlank()) {
            return false;
        }
        try {
            JsonNode root = objectMapper.readTree(json);
            if (root.has("errorCode") || root.has("errorMessage") || root.has("errors")) {
                return false;
            }
            JsonNode items = ownershipItems(root);
            if (items == null || !items.isArray()) {
                return false;
            }
            for (JsonNode item : items) {
                if (itemOwnsCatalogItem(item, sandboxId, catalogItemId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.warn("Failed to parse Epic Ecom ownership response: {}", e.getMessage());
            return false;
        }
    }

    private static JsonNode ownershipItems(JsonNode root) {
        if (root.isArray()) {
            return root;
        }
        if (!root.isObject()) {
            return null;
        }
        for (String field : new String[] {"items", "ownership", "data"}) {
            JsonNode candidate = root.get(field);
            if (candidate != null && candidate.isArray()) {
                return candidate;
            }
        }
        return null;
    }

    private static boolean itemOwnsCatalogItem(JsonNode item, String sandboxId, String catalogItemId) {
        if (item == null || !item.isObject()) {
            return false;
        }
        String returnedItemId = firstText(item, "catalogItemId", "itemId", "id");
        if (!catalogItemId.equals(returnedItemId)) {
            return false;
        }
        String returnedNamespace = firstText(item, "namespace", "sandboxId");
        if (!returnedNamespace.isBlank() && !sandboxId.equals(returnedNamespace)) {
            return false;
        }
        return isOwnedFlag(item);
    }

    private static boolean isOwnedFlag(JsonNode item) {
        JsonNode owned = item.get("owned");
        if (owned != null && owned.isBoolean()) {
            return owned.booleanValue();
        }
        String status = firstText(item, "ownershipStatus", "status");
        return "OWNED".equalsIgnoreCase(status)
                || "EOS_OS_Owned".equalsIgnoreCase(status);
    }

    private static String firstText(JsonNode node, String... fields) {
        for (String field : fields) {
            JsonNode value = node.get(field);
            if (value != null && value.isTextual() && !value.asText("").isBlank()) {
                return value.asText();
            }
            if (value != null && value.isNumber()) {
                return value.asText();
            }
        }
        return "";
    }

    boolean isUnconfigured() {
        return isUnconfiguredClientId(clientId)
                || isUnconfiguredClientSecret(clientSecret)
                || isUnconfiguredDeploymentId(deploymentId);
    }

    static boolean isUnconfiguredClientId(String value) {
        return isBlank(value) || PLACEHOLDER_CLIENT_ID.equals(value);
    }

    static boolean isUnconfiguredClientSecret(String value) {
        return isBlank(value) || PLACEHOLDER_CLIENT_SECRET.equals(value);
    }

    static boolean isUnconfiguredDeploymentId(String value) {
        return isBlank(value) || PLACEHOLDER_DEPLOYMENT_ID.equals(value);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
