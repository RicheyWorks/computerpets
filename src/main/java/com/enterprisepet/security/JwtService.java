package com.enterprisepet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

/**
 * Issues and validates short-lived HMAC-signed JWTs used to authenticate the
 * client→backend channel after ownership verification. The encrypted license
 * remains the source of truth for entitlement; the JWT just proves the request is
 * from someone who recently passed {@code /api/verify/{provider}}.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    /** Custom claim name for the pet key the JWT was issued for. */
    public static final String CLAIM_PET = "pet";
    /** Custom claim name for the ownership provider (steam, nft, microsoft, …). */
    public static final String CLAIM_PROVIDER = "prv";

    @Value("${jwt.secret-key:}")
    private String secret;

    @Value("${jwt.issuer:enterprisepet-backend}")
    private String issuer;

    @Value("${jwt.ttl-minutes:30}")
    private long ttlMinutes;

    private SecretKey signingKey;
    private Duration ttl;

    @PostConstruct
    void init() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "jwt.secret-key is not configured. Set JWT_SECRET_KEY to a random "
                + "secret of at least 32 bytes (openssl rand -base64 48).");
        }
        try {
            this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        } catch (WeakKeyException e) {
            throw new IllegalStateException(
                "jwt.secret-key is too short for HS256. Must be at least 32 bytes; "
                + "use `openssl rand -base64 48`.", e);
        }
        if (ttlMinutes <= 0) {
            throw new IllegalStateException("jwt.ttl-minutes must be positive; got " + ttlMinutes);
        }
        this.ttl = Duration.ofMinutes(ttlMinutes);
        log.info("JwtService ready. issuer={} ttl={}m", issuer, ttlMinutes);
    }

    /**
     * Issues a JWT scoped to a specific (owner, pet, provider) triple. The TTL is
     * intentionally short — long enough for the client to fetch the bundle, not so
     * long that a stolen token grants weeks of access.
     */
    public IssuedToken issue(String owner, String petKey, String providerKey) {
        Instant now = Instant.now();
        Instant exp = now.plus(ttl);
        String token = Jwts.builder()
            .issuer(issuer)
            .subject(owner)
            .claim(CLAIM_PET, petKey)
            .claim(CLAIM_PROVIDER, providerKey)
            .issuedAt(Date.from(now))
            .expiration(Date.from(exp))
            .signWith(signingKey)
            .compact();
        return new IssuedToken(token, "Bearer", ttl.toSeconds(), exp.toString());
    }

    /**
     * Parses + validates a bearer token (signature + expiry). Returns the parsed
     * claims on success, empty on any failure (we never differentiate "bad
     * signature" from "expired" to the caller — both are auth failures).
     */
    public Optional<Claims> parse(String bearer) {
        if (bearer == null || bearer.isBlank()) return Optional.empty();
        String token = bearer.startsWith("Bearer ") ? bearer.substring(7).trim() : bearer.trim();
        try {
            Jws<Claims> jws = Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token);
            return Optional.of(jws.getPayload());
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /** Returned in {@code /api/verify} responses; the client sends {@code token} back as a Bearer. */
    public record IssuedToken(String token, String tokenType, long expiresInSeconds, String expiresAt) {}

    /** Convenience: pluck the custom claims back out without exposing the JJWT type. */
    public static String petOf(Claims c)      { return c.get(CLAIM_PET, String.class); }
    public static String providerOf(Claims c) { return c.get(CLAIM_PROVIDER, String.class); }

    /** Visible to filter for building a Spring Security principal. */
    public static Map<String, Object> principalFrom(Claims c) {
        return Map.of(
            "sub", c.getSubject(),
            "pet", petOf(c),
            "provider", providerOf(c)
        );
    }
}
