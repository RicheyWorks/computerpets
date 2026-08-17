package com.enterprisepet.epic;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
    name = "ownership.providers.epic.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class EpicHealthIndicator implements HealthIndicator {

    private final String clientId;
    private final String clientSecret;
    private final String deploymentId;

    public EpicHealthIndicator(
            @Value("${epic.client-id:}") String clientId,
            @Value("${epic.client-secret:}") String clientSecret,
            @Value("${epic.deployment-id:}") String deploymentId) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.deploymentId = deploymentId;
    }

    EpicHealthIndicator() {
        this.clientId = null;
        this.clientSecret = null;
        this.deploymentId = null;
    }

    @Override
    public Health health() {
        if (EpicService.isUnconfiguredClientId(clientId)
                || EpicService.isUnconfiguredClientSecret(clientSecret)
                || EpicService.isUnconfiguredDeploymentId(deploymentId)) {
            return Health.down()
                    .withDetail("reason", "Epic Games client credentials are not configured")
                    .build();
        }
        return Health.up()
                .withDetail("status", "Epic Games client credentials are configured")
                .build();
    }
}
