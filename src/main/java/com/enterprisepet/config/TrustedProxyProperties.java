package com.enterprisepet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * CIDRs (or single addresses) whose {@code remoteAddr} may present
 * {@code X-Forwarded-For} / {@code Forwarded}. Empty means never trust
 * those headers — fail-closed against client spoofing.
 *
 * <p>Local/dev defaults to loopback so a laptop and compose edge tests can
 * still bind download grants by forwarded address. Prod stays empty until
 * the operator lists the load balancer / ingress CIDRs.
 */
@ConfigurationProperties(prefix = "trusted-proxies")
public class TrustedProxyProperties {

    /**
     * Comma or whitespace separated CIDRs (e.g. {@code 10.0.0.0/8,127.0.0.1/32}).
     * Blank = fail-closed (always use {@code remoteAddr}).
     */
    private String cidrs = "";

    public String getCidrs() {
        return cidrs;
    }

    public void setCidrs(String cidrs) {
        this.cidrs = cidrs == null ? "" : cidrs;
    }

    /** Parsed, trimmed, non-blank CIDR tokens. */
    public List<String> cidrList() {
        if (cidrs == null || cidrs.isBlank()) {
            return List.of();
        }
        List<String> out = new ArrayList<>();
        for (String part : cidrs.split("[,\\s]+")) {
            String trimmed = part.trim();
            if (!trimmed.isEmpty()) {
                out.add(trimmed);
            }
        }
        return List.copyOf(out);
    }

    /** Convenience for tests that already have a list. */
    static TrustedProxyProperties of(String... cidrs) {
        TrustedProxyProperties props = new TrustedProxyProperties();
        props.setCidrs(String.join(",", Arrays.asList(cidrs)));
        return props;
    }
}
