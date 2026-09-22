package com.enterprisepet.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

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
