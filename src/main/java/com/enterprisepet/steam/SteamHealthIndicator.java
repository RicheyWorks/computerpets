package com.enterprisepet.steam;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class SteamHealthIndicator implements HealthIndicator {

    private final String steamApiKey;

    // Spring injection constructor
    public SteamHealthIndicator(@Value("${steam.api-key:}") String steamApiKey) {
        this.steamApiKey = steamApiKey;
    }

    // Test constructor
    SteamHealthIndicator() {
        this.steamApiKey = null;
    }

    @Override
    public Health health() {
        if (steamApiKey == null || steamApiKey.isBlank() || "YOUR_STEAM_WEB_API_KEY".equals(steamApiKey)) {
            return Health.up()
                    .withDetail("reason", "Steam door is not hung yet")
                    .build();
        }

        return Health.up()
                .withDetail("status", "Steam door is hung")
                .build();
    }
}