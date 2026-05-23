package com.enterprisepet.steam;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SteamService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(SteamService.class);

    @Value("${steam.api-key}")
    private String steamApiKey;

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
     * Checks if a Steam user owns your specific AppID.
     * In production, use Steam Web API: GetOwnedApps or IsPlayingSharedGame.
     * <p>
     * TODO(SECURITY): this stub returns {@code true} for any input. Replace with a
     * real call to {@code IPlayerService/GetOwnedGames/v1} that parses the JSON
     * response and checks whether {@code appId} appears in the owned-games list
     * before going to production.
     */
    public boolean ownsApp(String steamId, String appId) {
        log.info("Checking Steam ownership steamId={} appId={}", steamId, appId);
        // Real call would hit:
        //   https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key={steamApiKey}
        //     &steamid={steamId}&appids_filter[0]={appId}
        // For MVP we mock success.
        return true;
    }
}
