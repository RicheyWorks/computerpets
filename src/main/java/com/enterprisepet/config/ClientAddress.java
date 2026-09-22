package com.enterprisepet.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Resolves the requesting client address the same way rate limits and
 * download-grant IP binding do.
 *
 * <p>Fail-closed: {@code X-Forwarded-For} and RFC 7239 {@code Forwarded}
 * are honoured only when {@code remoteAddr} matches a configured trusted
 * proxy CIDR. Otherwise the servlet remote address is used, even if a
 * client spoofs those headers.
 *
 * <p>When the peer is trusted, the first XFF hop wins; if XFF is absent,
 * the first {@code Forwarded} {@code for=} value is used. Blank or
 * unparseable forwarded values fall back to {@code remoteAddr}.
 */
@Component
public class ClientAddress {

    private static final Pattern FORWARDED_FOR = Pattern.compile(
            "(?i)(?:^|;)\\s*for=(\"?)\\[?([^\\];\",]+)\\]?\\1");

    private final List<IpAddressMatcher> trustedProxies;

    public ClientAddress(TrustedProxyProperties properties) {
        List<String> cidrs = properties == null ? List.of() : properties.cidrList();
        this.trustedProxies = cidrs.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(IpAddressMatcher::new)
                .toList();
    }

    public String from(HttpServletRequest req) {
        if (req == null) {
            return "";
        }
        String remote = remoteAddr(req);
        if (!isTrustedProxy(remote)) {
            return remote;
        }
        String fromXff = firstXForwardedFor(req.getHeader("X-Forwarded-For"));
        if (!fromXff.isEmpty()) {
            return fromXff;
        }
        String fromForwarded = firstForwardedFor(req.getHeader("Forwarded"));
        if (!fromForwarded.isEmpty()) {
            return fromForwarded;
        }
        return remote;
    }

    boolean isTrustedProxy(String remote) {
        if (remote == null || remote.isBlank() || trustedProxies.isEmpty()) {
            return false;
        }
        String candidate = stripZoneId(remote.trim());
        for (IpAddressMatcher matcher : trustedProxies) {
            try {
                if (matcher.matches(candidate)) {
                    return true;
                }
            } catch (IllegalArgumentException ignored) {
                // Malformed remoteAddr — do not trust forwarded headers.
            }
        }
        return false;
    }

    static String firstXForwardedFor(String header) {
        if (header == null || header.isBlank()) {
            return "";
        }
        int comma = header.indexOf(',');
        String hop = (comma >= 0 ? header.substring(0, comma) : header).trim();
        return normalizeForwardedIp(hop);
    }

    static String firstForwardedFor(String header) {
        if (header == null || header.isBlank()) {
            return "";
        }
        for (String part : header.split(",")) {
            Matcher m = FORWARDED_FOR.matcher(part.trim());
            if (m.find()) {
                String ip = normalizeForwardedIp(m.group(2));
                if (!ip.isEmpty()) {
                    return ip;
                }
            }
        }
        return "";
    }

    private static String remoteAddr(HttpServletRequest req) {
        String remote = req.getRemoteAddr();
        return remote == null ? "" : remote.trim();
    }

    private static String normalizeForwardedIp(String raw) {
        if (raw == null) {
            return "";
        }
        String s = raw.trim();
        if (s.isEmpty() || "unknown".equalsIgnoreCase(s)) {
            return "";
        }
        // RFC 7239 may quote and/or bracket IPv6; strip optional port on IPv4.
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1).trim();
        }
        if (s.startsWith("[") && s.contains("]")) {
            s = s.substring(1, s.indexOf(']')).trim();
        } else {
            int colon = s.indexOf(':');
            // IPv4:port — not bare IPv6 (which has multiple colons).
            if (colon > 0 && s.indexOf(':', colon + 1) < 0) {
                s = s.substring(0, colon).trim();
            }
        }
        return stripZoneId(s);
    }

    private static String stripZoneId(String ip) {
        int pct = ip.indexOf('%');
        return pct > 0 ? ip.substring(0, pct) : ip;
    }
}
