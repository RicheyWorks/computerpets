package com.enterprisepet.nft;

import okhttp3.OkHttpClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableConfigurationProperties(EthereumProperties.class)
public class EthereumConfig {

    /**
     * Builds the JSON-RPC client after {@link EthereumProperties} is bound.
     * {@code ethereum.rpc-url} is never read from an uninitialized field.
     */
    @Bean(destroyMethod = "shutdown")
    @ConditionalOnProperty(
            name = "ownership.providers.nft.enabled",
            havingValue = "true",
            matchIfMissing = true
    )
    public Web3j web3j(EthereumProperties props) {
        return Web3j.build(httpService(props.getRpcUrl(), props.getRequestTimeoutMs()));
    }

    /**
     * @throws IllegalArgumentException if {@code rpcUrl} is null or blank — HttpService
     *         must never be constructed against a null URL
     */
    static HttpService httpService(String rpcUrl, int timeoutMs) {
        if (rpcUrl == null || rpcUrl.isBlank()) {
            throw new IllegalArgumentException("ethereum.rpc-url must not be null or blank");
        }
        int timeout = Math.max(500, timeoutMs);
        OkHttpClient http = new OkHttpClient.Builder()
                .connectTimeout(timeout, TimeUnit.MILLISECONDS)
                .readTimeout(timeout, TimeUnit.MILLISECONDS)
                .writeTimeout(timeout, TimeUnit.MILLISECONDS)
                .build();
        return new HttpService(rpcUrl, http);
    }
}
