package com.enterprisepet.nft;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.Web3jService;
import org.web3j.protocol.core.JsonRpc2_0Web3j;
import org.web3j.protocol.http.HttpService;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EthereumConfigTest {

    @Test
    @DisplayName("httpService is built with the injected RPC URL, not null")
    void httpService_usesInjectedRpcUrl() throws Exception {
        String rpcUrl = "http://127.0.0.1:8545";

        HttpService service = EthereumConfig.httpService(rpcUrl, 4000);
        try {
            assertThat(service.getUrl()).isEqualTo(rpcUrl);
            assertThat(service.getUrl()).isNotNull();
        } finally {
            service.close();
        }
    }

    @Test
    @DisplayName("httpService rejects a null RPC URL instead of constructing HttpService(null)")
    void httpService_nullRpcUrl_rejected() {
        assertThatThrownBy(() -> EthereumConfig.httpService(null, 4000))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ethereum.rpc-url");
    }

    @Test
    @DisplayName("httpService rejects a blank RPC URL")
    void httpService_blankRpcUrl_rejected() {
        assertThatThrownBy(() -> EthereumConfig.httpService("  ", 4000))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ethereum.rpc-url");
    }

    @Test
    @DisplayName("web3j bean factory uses the bound EthereumProperties RPC URL")
    void web3j_usesBoundPropertiesRpcUrl() throws Exception {
        String rpcUrl = "https://example.invalid/rpc";
        EthereumProperties props = new EthereumProperties();
        props.setRpcUrl(rpcUrl);
        props.setRequestTimeoutMs(1500);

        Web3j web3j = new EthereumConfig().web3j(props);
        try {
            assertThat(rpcUrlOf(web3j)).isEqualTo(rpcUrl);
        } finally {
            web3j.shutdown();
        }
    }

    private static String rpcUrlOf(Web3j web3j) throws Exception {
        Field field = JsonRpc2_0Web3j.class.getDeclaredField("web3jService");
        field.setAccessible(true);
        Web3jService service = (Web3jService) field.get(web3j);
        assertThat(service).isInstanceOf(HttpService.class);
        return ((HttpService) service).getUrl();
    }
}
