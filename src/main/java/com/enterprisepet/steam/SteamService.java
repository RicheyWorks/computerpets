package com.enterprisepet.steam;

import com.enterprisepet.observability.ObservedRestClients;
import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.micrometer.observation.ObservationRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * Asks Steam whether a keeper owns a house AppID.
 *
 * <p>The client may name an {@code appId}. The house only opens when that
 * AppID is on the configured door ({@code steam.app-id} / allowlist) and
 * Steam says they own it. An empty door fails closed — owning any Steam
 * game does not sit you here. Do not invent a live ComputerPets AppID;
 * leave {@code steam.app-id} empty until one exists.
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.steam.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class SteamService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(SteamService.class);

    @Value("${steam.api-key}")
    private String steamApiKey;

    /**
     * House Steam door. Empty, or a single AppID, or a comma/whitespace
     * allowlist. Empty fails closed.
     */
    @Value("${steam.app-id:}")
    private String configuredAppId;

    private RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ObservationRegistry observationRegistry = ObservationRegistry.NOOP;

    @Value("${steam.api-base-url:https://api.steampowered.com}")
    private String steamApiBaseUrl;

    // Default constructor for Spring
    public SteamService() {}

    // Constructor for testing (allows injecting a mocked RestClient)
    SteamService(RestClient restClient) {
        this.restClient = restClient;
    }

    // Package-private constructor for testing (full control over RestClient + API key)
    SteamService(RestClient restClient, String steamApiKey) {
        this(restClient, steamApiKey, "");
    }

    SteamService(RestClient restClient, String steamApiKey, String configuredAppId) {
        this.restClient = restClient;
        this.steamApiKey = steamApiKey;
        this.configuredAppId = configuredAppId;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            this.restClient = ObservedRestClients.builder(observationRegistry)
                    .baseUrl(steamApiBaseUrl)
                    .build();
        }
        // Note: We intentionally do NOT overwrite steamApiKey here if it was set via constructor.
        // This supports testability while still allowing @Value injection in production.
    }

    @Override public String key()         { return "steam"; }
    @Override public String displayName() { return "Steam"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        SteamVerifyRequest typed = SteamVerifyRequest.from(request);
        if (typed.steamId() == null || typed.appId() == null) {
            return VerificationResult.denied("steamId and appId are required");
        }
        Set<String> houseAppIds = houseAppIds();
        if (houseAppIds.isEmpty()) {
            return VerificationResult.denied("the Steam door is not hung yet");
        }
        if (!houseAppIds.contains(typed.appId())) {
            return VerificationResult.denied("appId is not a house Steam door");
        }
        return ownsApp(typed.steamId(), typed.appId())
            ? VerificationResult.granted(typed.steamId())
            : VerificationResult.denied("Steam ownership not found");
    }

    /**
     * Asks Steam whether {@code steamId} owns {@code appId}.
     * The house door is {@link #verify}; this only hears Steam.
     * Protected by Resilience4j circuit breaker + retry (Phase 2.3).
     */
    @CircuitBreaker(name = "steam", fallbackMethod = "ownsAppFallback")
    @Retry(name = "steam")
    public boolean ownsApp(String steamId, String appId) {
        log.info("Checking Steam ownership steamId={} appId={}", steamId, appId);

        if (steamApiKey == null || steamApiKey.isBlank() || "YOUR_STEAM_WEB_API_KEY".equals(steamApiKey)) {
            log.warn("Steam API key not configured. Steam ownership verification will fail.");
            return false;
        }

        try {
            String responseBody = restClient.get()
                    .uri("/IPlayerService/GetOwnedGames/v1/?key={key}&steamid={steamid}&appids_filter[0]={appid}",
                            steamApiKey, steamId, appId)
                    .retrieve()
                    .body(String.class);

            return responseContainsApp(responseBody, appId);

        } catch (Exception e) {
            log.warn("Steam API call failed for steamId={} appId={}: {}", steamId, appId, e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("unused")
    private boolean ownsAppFallback(String steamId, String appId, Exception e) {
        log.warn("Steam circuit breaker open or max retries exceeded for steamId={} appId={}: {}",
                steamId, appId, e.getMessage());
        return false;  // Safe default: deny
    }

    private boolean responseContainsApp(String json, String appId) {
        if (json == null || json.isBlank()) {
            return false;
        }
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode games = root.path("response").path("games");

            if (!games.isArray()) {
                return false;
            }

            for (JsonNode game : games) {
                if (appId.equals(game.path("appid").asText())) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.warn("Failed to parse Steam API response: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Configured house AppIDs from {@code steam.app-id} (single or
     * comma/whitespace allowlist). Empty means the door is not hung.
     */
    Set<String> houseAppIds() {
        LinkedHashSet<String> ids = new LinkedHashSet<>();
        addAppIds(ids, configuredAppId);
        return Set.copyOf(ids);
    }

    private static void addAppIds(Set<String> dest, String raw) {
        if (raw == null || raw.isBlank()) {
            return;
        }
        for (String part : raw.split("[,\\s]+")) {
            if (!part.isBlank()) {
                dest.add(part.trim());
            }
        }
    }
}
