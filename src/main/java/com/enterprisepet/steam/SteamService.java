package com.enterprisepet.steam;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

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

    private RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String STEAM_API_BASE = "https://api.steampowered.com";

    // Default constructor for Spring
    public SteamService() {}

    // Constructor for testing (allows injecting a mocked RestClient)
    SteamService(RestClient restClient) {
        this.restClient = restClient;
    }

    // Package-private constructor for testing (full control over RestClient + API key)
    SteamService(RestClient restClient, String steamApiKey) {
        this.restClient = restClient;
        this.steamApiKey = steamApiKey;
    }

    @PostConstruct
    void init() {
        if (this.restClient == null) {
            this.restClient = RestClient.builder()
                    .baseUrl(STEAM_API_BASE)
                    .build();
        }
        // Note: We intentionally do NOT overwrite steamApiKey here if it was set via constructor.
        // This supports testability while still allowing @Value injection in production.
    }

    @Override public String key()         { return "steam"; }
    @Override public String displayName() { return "Steam"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        String steamId = request.get("steamId");
        String appId   = request.get("appId");
        if (steamId == null || steamId.isBlank() || appId == null || appId.isBlank()) {
            return VerificationResult.denied("steamId and appId are required");
        }
        return ownsApp(steamId, appId)
            ? VerificationResult.granted(steamId)
            : VerificationResult.denied("Steam ownership not found");
    }

    /**
     * Checks if a Steam user owns your specific AppID using the official Steam Web API.
     */
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
}
