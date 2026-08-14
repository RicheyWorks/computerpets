package com.enterprisepet.nft;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "ownership.providers.nft.enabled", havingValue = "true", matchIfMissing = true)
public class NftHealthIndicator implements HealthIndicator {

    private final EthereumProperties props;
    private final NftCatalog catalog;

    public NftHealthIndicator(EthereumProperties props, NftCatalog catalog) {
        this.props = props;
        this.catalog = catalog;
    }

    NftHealthIndicator() {
        this.props = EthereumProperties.unrestricted();
        this.catalog = new NftCatalog(this.props);
    }

    NftHealthIndicator(EthereumProperties props) {
        this.props = props;
        this.catalog = new NftCatalog(props);
    }

    @Override
    public Health health() {
        if (props.isPlaceholderRpc()) {
            return Health.down()
                    .withDetail("reason", "Ethereum RPC URL is not configured")
                    .withDetail("collections", catalog.size())
                    .build();
        }
        return Health.up()
                .withDetail("status", "Ethereum RPC is configured")
                .withDetail("collections", catalog.size())
                .withDetail("allowlistRequired", catalog.allowlistRequired())
                .build();
    }
}
