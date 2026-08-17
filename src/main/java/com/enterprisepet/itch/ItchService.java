package com.enterprisepet.itch;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Verifies that a buyer owns an itch.io game via the official download-key
 * receipt API ({@code GET https://api.itch.io/games/{id}/download_keys}).
 *
 * <p>This is the Steam analog: the server holds a developer API key
 * ({@code ITCH_API_KEY}), the client sends a {@code gameId} plus the
 * download key from the purchase URL, and we ask itch.io whether that
 * receipt is valid for that game. There is no "always owns" stub.
 *
 * <p>A placeholder or blank API key fails closed (ownership denied), the
 * same way a missing Steam Web API key does. Do not invent a live game id;
 * leave {@code itch.game-id} empty until a ComputerPets itch.io page exists.
 *
 * @see <a href="https://itch.io/docs/api/serverside">itch.io serverside API</a>
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.itch.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class ItchService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(ItchService.class);

    /** Rejected as an obvious leftover from documentation / application.yml. */
    static final String PLACEHOLDER_API_KEY = "YOUR_ITCH_API_KEY";

    private static final Pattern NUMERIC_GAME_ID = Pattern.compile("\\d{1,18}");

    @Value("${itch.api-key}")
    private String apiKey;

    @Value("${itch.api-base-url:https://api.itch.io}")
    private String apiBaseUrl;

    /**
     * Optional official game allowlist. Empty means any game the API key can
     * query (the key itself is scoped to games the developer can edit).
     */
    @Value("${itch.game-id:}")
    private String configuredGameId;

    private RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ItchService() {}

    ItchService(RestClient restClient, String apiKey) {
        this.restClient = restClient;
        this.apiKey = apiKey;
    }

    ItchService(RestClient restClient, String apiKey, String configuredGameId) {
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.configuredGameId = configuredGameId;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            this.restClient = RestClient.builder()
                    .baseUrl(apiBaseUrl)
                    .build();
        }
        if (isUnconfiguredApiKey(apiKey)) {
            log.warn("Itch.io API key not configured. Itch ownership verification will fail until ITCH_API_KEY is set.");
        }
    }

    @Override public String key()         { return "itch"; }
    @Override public String displayName() { return "Itch.io"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        String gameId = request.get("gameId");
        String downloadKey = request.get("downloadKey");
        if (isBlank(gameId) || isBlank(downloadKey)) {
            return VerificationResult.denied("gameId and downloadKey are required");
        }
        if (!NUMERIC_GAME_ID.matcher(gameId.trim()).matches()) {
            return VerificationResult.denied("gameId must be a numeric itch.io game id");
        }
        if (!isBlank(configuredGameId) && !configuredGameId.trim().equals(gameId.trim())) {
            return VerificationResult.denied("gameId is not an official ComputerPets itch.io game");
        }

        return ownsReceipt(gameId.trim(), downloadKey.trim())
                .map(VerificationResult::granted)
                .orElseGet(() -> VerificationResult.denied("Itch.io ownership not found"));
    }

    /**
     * Asks itch.io whether {@code downloadKey} is a valid receipt for {@code gameId}.
     * Returns the stable owner id on success. Protected by Resilience4j (Phase 2.3).
     */
    @CircuitBreaker(name = "itch", fallbackMethod = "ownsReceiptFallback")
    @Retry(name = "itch")
    public Optional<String> ownsReceipt(String gameId, String downloadKey) {
        log.info("Checking Itch.io ownership gameId={}", gameId);

        if (isUnconfiguredApiKey(apiKey)) {
            log.warn("Itch.io API key not configured. Itch ownership verification will fail.");
            return Optional.empty();
        }

        try {
            String responseBody = restClient.get()
                    .uri("/games/{gameId}/download_keys?download_key={key}", gameId, downloadKey)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .retrieve()
                    .body(String.class);

            return ownerFromResponse(responseBody, gameId);
        } catch (Exception e) {
            log.warn("Itch.io API call failed for gameId={}: {}", gameId, e.getMessage());
            return Optional.empty();
        }
    }

    @SuppressWarnings("unused")
    private Optional<String> ownsReceiptFallback(String gameId, String downloadKey, Exception e) {
        log.warn("Itch circuit breaker open or max retries exceeded for gameId={}: {}",
                gameId, e.getMessage());
        return Optional.empty();
    }

    /**
     * Walks the itch.io download-key JSON. Visible for testing.
     *
     * <p>Success is a {@code download_key} object whose {@code game_id} matches
     * and that has no {@code errors} array. Invalid / revoked / other-game keys
     * come back as {@code {"errors":["invalid download key"]}}.
     */
    Optional<String> ownerFromResponse(String json, String gameId) {
        if (json == null || json.isBlank()) {
            return Optional.empty();
        }
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode errors = root.path("errors");
            if (errors.isArray() && errors.size() > 0) {
                return Optional.empty();
            }

            JsonNode receipt = root.path("download_key");
            if (!receipt.isObject()) {
                return Optional.empty();
            }

            String returnedGameId = receipt.path("game_id").asText("");
            if (!gameId.equals(returnedGameId)) {
                return Optional.empty();
            }

            return Optional.of(ownerIdFromReceipt(receipt));
        } catch (Exception e) {
            log.warn("Failed to parse Itch.io API response: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private static String ownerIdFromReceipt(JsonNode receipt) {
        JsonNode owner = receipt.path("owner");
        if (owner.isObject()) {
            String id = owner.path("id").asText("");
            if (!id.isBlank()) {
                return "itch:" + id;
            }
            String username = owner.path("username").asText("");
            if (!username.isBlank()) {
                return "itch:" + username;
            }
        }
        String receiptId = receipt.path("id").asText("");
        if (!receiptId.isBlank()) {
            return "itch:key:" + receiptId;
        }
        return "itch:unknown";
    }

    static boolean isUnconfiguredApiKey(String key) {
        return key == null || key.isBlank() || PLACEHOLDER_API_KEY.equals(key);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
