package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TrustedProxyPropertiesTest {

    @Test
    @DisplayName("blank cidrs parse to empty list")
    void blank_empty() {
        TrustedProxyProperties props = new TrustedProxyProperties();
        props.setCidrs("  ");
        assertThat(props.cidrList()).isEmpty();
    }

    @Test
    @DisplayName("comma and whitespace separated CIDRs parse")
    void commaAndWhitespace_parse() {
        TrustedProxyProperties props = TrustedProxyProperties.of("10.0.0.0/8", "127.0.0.1/32");
        assertThat(props.cidrList()).containsExactly("10.0.0.0/8", "127.0.0.1/32");

        props.setCidrs("10.0.0.0/8  172.16.0.0/12,::1/128");
        assertThat(props.cidrList()).containsExactly("10.0.0.0/8", "172.16.0.0/12", "::1/128");
    }
}
