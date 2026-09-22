package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

class ClientAddressTest {

    @Test
    @DisplayName("empty trusted list ignores X-Forwarded-For (fail-closed)")
    void emptyTrusted_ignoresXff() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of());
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("198.51.100.10");
        req.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        assertThat(resolver.from(req)).isEqualTo("198.51.100.10");
    }

    @Test
    @DisplayName("untrusted remoteAddr ignores X-Forwarded-For")
    void untrustedRemote_ignoresXff() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of("10.0.0.0/8"));
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("198.51.100.10");
        req.addHeader("X-Forwarded-For", "203.0.113.9");

        assertThat(resolver.from(req)).isEqualTo("198.51.100.10");
    }

    @Test
    @DisplayName("trusted remoteAddr uses first X-Forwarded-For hop")
    void trustedRemote_usesFirstXffHop() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of("10.0.0.0/8", "127.0.0.1/32"));
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("10.0.0.5");
        req.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        assertThat(resolver.from(req)).isEqualTo("203.0.113.9");
    }

    @Test
    @DisplayName("trusted remoteAddr uses Forwarded for= when XFF absent")
    void trustedRemote_usesForwardedHeader() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of("127.0.0.1/32"));
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("127.0.0.1");
        req.addHeader("Forwarded", "for=203.0.113.40;proto=https");

        assertThat(resolver.from(req)).isEqualTo("203.0.113.40");
    }

    @Test
    @DisplayName("trusted remoteAddr prefers XFF over Forwarded")
    void trustedRemote_prefersXffOverForwarded() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of("127.0.0.1/32"));
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("127.0.0.1");
        req.addHeader("X-Forwarded-For", "203.0.113.1");
        req.addHeader("Forwarded", "for=198.51.100.1");

        assertThat(resolver.from(req)).isEqualTo("203.0.113.1");
    }

    @Test
    @DisplayName("trusted remoteAddr with blank XFF falls back to remoteAddr")
    void trustedRemote_blankXff_usesRemote() {
        ClientAddress resolver = new ClientAddress(TrustedProxyProperties.of("127.0.0.1/32"));
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("127.0.0.1");
        req.addHeader("X-Forwarded-For", "   ");

        assertThat(resolver.from(req)).isEqualTo("127.0.0.1");
    }

    @Test
    @DisplayName("Forwarded IPv6 for= is unquoted and unbracketed")
    void forwardedIpv6_normalized() {
        assertThat(ClientAddress.firstForwardedFor("for=\"[2001:db8::1]\";proto=https"))
                .isEqualTo("2001:db8::1");
    }

    @Test
    @DisplayName("null request yields empty string")
    void nullRequest_empty() {
        assertThat(new ClientAddress(TrustedProxyProperties.of()).from(null)).isEmpty();
    }
}
