package com.enterprisepet.nft;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(EthereumProperties.class)
public class EthereumConfig {
}
