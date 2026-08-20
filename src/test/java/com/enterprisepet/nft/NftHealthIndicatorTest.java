package com.enterprisepet.nft;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Status;

import static org.assertj.core.api.Assertions.assertThat;

class NftHealthIndicatorTest {

    @Test
    void health_up_whenPlaceholderRpc() {
        EthereumProperties props = new EthereumProperties();
        props.setRpcUrl("https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY");
        NftHealthIndicator indicator = new NftHealthIndicator(props);

        assertThat(indicator.health().getStatus()).isEqualTo(Status.UP);
        assertThat(indicator.health().getDetails().get("reason")).isEqualTo("Ethereum door is not hung yet");
    }

    @Test
    void health_up_whenRealRpcConfigured() {
        EthereumProperties props = new EthereumProperties();
        props.setRpcUrl("https://eth-mainnet.g.alchemy.com/v2/live-key");
        NftHealthIndicator indicator = new NftHealthIndicator(props);

        assertThat(indicator.health().getStatus()).isEqualTo(Status.UP);
        assertThat(indicator.health().getDetails().get("collections")).isEqualTo(0);
    }
}
