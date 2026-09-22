package com.enterprisepet.config;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolves the requesting client address the same way rate limits do.
 *
 * <p>Trusts the first {@code X-Forwarded-For} hop when present (typical behind a
 * trusted proxy or CDN edge). Direct exposure without a trusted proxy can be
 * spoofed; that is an operator concern, not geolocation.
 */
public final class ClientAddress {

    private ClientAddress() {}

    public static String from(HttpServletRequest req) {
        if (req == null) {
            return "";
        }
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) {
            int comma = fwd.indexOf(',');
            return (comma > 0 ? fwd.substring(0, comma) : fwd).trim();
        }
        String remote = req.getRemoteAddr();
        return remote == null ? "" : remote.trim();
    }
}
