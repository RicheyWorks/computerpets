package com.enterprisepet.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Set;

/**
 * Gives {@code /actuator/prometheus} and {@code /actuator/info} their own scrape
 * credential (ADR 0133). A customer download JWT is {@code ROLE_CLIENT} and is not
 * enough to read house metrics. Only {@code Authorization: Bearer <METRICS_SCRAPE_TOKEN>}
 * earns {@code ROLE_METRICS}.
 *
 * <p>Deny-safe: an unset or short token (under {@link #MIN_TOKEN_LENGTH} chars)
 * matches nothing, so metrics stay closed. The comparison is constant-time over
 * SHA-256 digests. The token is never logged. This filter is not a Spring
 * {@code @Component}; {@link com.enterprisepet.config.SecurityConfig} builds it so
 * it only runs inside the security chain.
 */
public final class MetricsScrapeTokenFilter extends OncePerRequestFilter {

    /** Scrape tokens shorter than this are ignored (and refused on prod). */
    public static final int MIN_TOKEN_LENGTH = 32;

    /** Actuator endpoints that need the scrape credential. */
    public static final Set<String> SCRAPE_PATHS = Set.of("/actuator/prometheus", "/actuator/info");

    public static final String ROLE = "METRICS";

    private static final String BEARER = "Bearer ";

    private final byte[] tokenDigest;

    public MetricsScrapeTokenFilter(String scrapeToken) {
        this.tokenDigest = usable(scrapeToken) ? sha256(scrapeToken.trim()) : null;
    }

    /** True when {@code token} is long enough to open the scrape door. */
    public static boolean usable(String token) {
        return token != null && token.trim().length() >= MIN_TOKEN_LENGTH;
    }

    /** True when a scrape token is configured (metrics can be scraped at all). */
    public boolean enabled() {
        return tokenDigest != null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !SCRAPE_PATHS.contains(pathWithinApplication(request));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        if (tokenDigest != null && matches(req.getHeader(HttpHeaders.AUTHORIZATION))) {
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    "metrics-scraper",
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + ROLE)));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(req, res);
    }

    private boolean matches(String header) {
        if (header == null || !header.regionMatches(true, 0, BEARER, 0, BEARER.length())) {
            return false;
        }
        String presented = header.substring(BEARER.length()).trim();
        if (presented.isEmpty()) {
            return false;
        }
        return MessageDigest.isEqual(tokenDigest, sha256(presented));
    }

    static String pathWithinApplication(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String context = request.getContextPath();
        if (uri == null) {
            return "";
        }
        if (context != null && !context.isEmpty() && uri.startsWith(context)) {
            return uri.substring(context.length());
        }
        return uri;
    }

    private static byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
