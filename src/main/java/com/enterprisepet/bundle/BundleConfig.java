package com.enterprisepet.bundle;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(BundleProperties.class)
public class BundleConfig {
}
