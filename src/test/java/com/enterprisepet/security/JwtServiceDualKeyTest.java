package com.enterprisepet.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceDualKeyTest {

    private static final String CURRENT = "current-jwt-secret-key-at-least-32-bytes-long!!";
    private static final String PREVIOUS = "previous-jwt-secret-key-at-least-32-bytes-lng!";

    private static JwtService service(String current, String previous) {
        JwtService jwt = new JwtService();
        ReflectionTestUtils.setField(jwt, "secret", current);
        ReflectionTestUtils.setField(jwt, "previousSecret", previous);
        ReflectionTestUtils.setField(jwt, "issuer", "enterprisepet-backend");
        ReflectionTestUtils.setField(jwt, "ttlMinutes", 30L);
        jwt.init();
        return jwt;
    }

    @Test
    @DisplayName("parse accepts a JWT signed with the previous key during rotation")
    void parse_acceptsPreviousKey() {
        JwtService oldIssuer = service(PREVIOUS, "");
        String token = oldIssuer.issue("steam:owner", "red_panda", "steam").token();

        JwtService rotated = service(CURRENT, PREVIOUS);
        assertThat(rotated.parse(token)).isPresent();
        assertThat(rotated.parse(token).orElseThrow().getSubject()).isEqualTo("steam:owner");
    }

    @Test
    @DisplayName("parse refuses a previous-key JWT after the dual-key window closes")
    void parse_refusesPreviousWhenUnset() {
        JwtService oldIssuer = service(PREVIOUS, "");
        String token = oldIssuer.issue("steam:owner", "red_panda", "steam").token();

        JwtService cutover = service(CURRENT, "");
        assertThat(cutover.parse(token)).isEmpty();
    }

    @Test
    @DisplayName("issue mints a unique jti and the principal carries it")
    void issue_mintsJti() {
        JwtService jwt = service(CURRENT, "");
        var first = jwt.issue("steam:owner", "red_panda", "steam");
        var second = jwt.issue("steam:owner", "red_panda", "steam");
        String firstJti = jwt.parse(first.token()).orElseThrow().getId();
        String secondJti = jwt.parse(second.token()).orElseThrow().getId();

        assertThat(firstJti).matches(DownloadJwtStore.JTI);
        assertThat(secondJti).matches(DownloadJwtStore.JTI);
        assertThat(firstJti).isNotEqualTo(secondJti);

        Map<String, Object> principal = JwtService.principalFrom(jwt.parse(first.token()).orElseThrow());
        assertThat(principal).containsEntry("jti", firstJti);
        assertThat(jwt.ttlSeconds()).isEqualTo(30 * 60);
    }

    @Test
    @DisplayName("a bearer without jti still parses and the principal omits jti")
    void parse_withoutJtiOmitsPrincipalJti() {
        JwtService jwt = service(CURRENT, "");
        Instant now = Instant.now();
        String token = Jwts.builder()
                .issuer("enterprisepet-backend")
                .subject("steam:owner")
                .claim(JwtService.CLAIM_PET, "red_panda")
                .claim(JwtService.CLAIM_PROVIDER, "steam")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(60)))
                .signWith(Keys.hmacShaKeyFor(CURRENT.getBytes(StandardCharsets.UTF_8)))
                .compact();

        var claims = jwt.parse(token).orElseThrow();
        assertThat(claims.getId()).isNull();
        assertThat(JwtService.principalFrom(claims)).doesNotContainKey("jti");
    }

    @Test
    @DisplayName("init refuses a no-op previous key equal to current")
    void init_refusesIdenticalPrevious() {
        JwtService jwt = new JwtService();
        ReflectionTestUtils.setField(jwt, "secret", CURRENT);
        ReflectionTestUtils.setField(jwt, "previousSecret", CURRENT);
        ReflectionTestUtils.setField(jwt, "issuer", "enterprisepet-backend");
        ReflectionTestUtils.setField(jwt, "ttlMinutes", 30L);

        assertThatThrownBy(jwt::init)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must differ");
    }
}
