package com.enterprisepet.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class VerifyEnvelopeTest {

    @Test
    @DisplayName("from(null) yields null petType and hwid")
    void from_nullMap_allNull() {
        VerifyEnvelope envelope = VerifyEnvelope.from(null);
        assertThat(envelope.petType()).isNull();
        assertThat(envelope.hwid()).isNull();
    }

    @Test
    @DisplayName("blank petType becomes null; hwid stays raw")
    void from_blankPetType_null_hwidRaw() {
        VerifyEnvelope envelope = VerifyEnvelope.from(Map.of(
                "petType", "   ",
                "hwid", "  device-abc-123  "
        ));
        assertThat(envelope.petType()).isNull();
        assertThat(envelope.hwid()).isEqualTo("  device-abc-123  ");
    }

    @Test
    @DisplayName("documented shared keys round-trip")
    void from_documentedKeys_roundTrip() {
        VerifyEnvelope envelope = VerifyEnvelope.from(Map.of(
                "petType", "  red_panda  ",
                "hwid", "device-abc-123"
        ));
        assertThat(envelope.petType()).isEqualTo("red_panda");
        assertThat(envelope.hwid()).isEqualTo("device-abc-123");
    }
}
