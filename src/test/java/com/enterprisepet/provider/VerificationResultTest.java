package com.enterprisepet.provider;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class VerificationResultTest {

    @Test
    @DisplayName("invalid marks clientError; denied does not")
    void invalid_setsClientError() {
        assertThat(VerificationResult.invalid("steamId too long").clientError()).isTrue();
        assertThat(VerificationResult.invalid("steamId too long").verified()).isFalse();
        assertThat(VerificationResult.denied("Steam ownership not found").clientError()).isFalse();
        assertThat(VerificationResult.granted("owner").clientError()).isFalse();
    }
}
