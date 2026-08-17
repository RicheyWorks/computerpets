package com.enterprisepet.license;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Locks the published client contract: AES-256-GCM with no KDF, 12-byte IV,
 * 128-bit tag appended to the ciphertext, UTF-8 JSON payload field names.
 */
@ExtendWith(MockitoExtension.class)
class LicenseWireFormatTest {

    @Mock
    private LicenseRepository licenseRepository;

    private LicenseService licenseService;
    private byte[] masterKey;

    @BeforeEach
    void setUp() {
        licenseService = new LicenseService(licenseRepository, true);
        masterKey = new byte[32];
        new SecureRandom().nextBytes(masterKey);
        ReflectionTestUtils.setField(licenseService, "masterKey", masterKey);
        when(licenseRepository.save(any(IssuedLicense.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("issued ciphertext decrypts with standard JDK AES/GCM and documented JSON fields")
    void issueLicense_jdkAesGcm_readsDocumentedPayload() throws Exception {
        var enc = licenseService.issueLicense("steam:owner", "red_panda", "steam", 1, "device-abc-123");

        byte[] iv = Base64.getDecoder().decode(enc.iv());
        byte[] ciphertextAndTag = Base64.getDecoder().decode(enc.ciphertext());
        assertThat(iv).hasSize(12);
        assertThat(ciphertextAndTag.length).isGreaterThan(16);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,
                new SecretKeySpec(masterKey, "AES"),
                new GCMParameterSpec(128, iv));
        byte[] plaintext = cipher.doFinal(ciphertextAndTag);

        JsonNode json = new ObjectMapper().readTree(new String(plaintext, StandardCharsets.UTF_8));
        assertThat(json.get("jti").asText()).isNotBlank();
        assertThat(json.get("owner").asText()).isEqualTo("steam:owner");
        assertThat(json.get("pet").asText()).isEqualTo("red_panda");
        assertThat(json.get("hwid").asText()).isEqualTo("device-abc-123");
        assertThat(Instant.parse(json.get("validUntil").asText())).isAfter(Instant.now());
        assertThat(Instant.parse(json.get("issuedAt").asText())).isBeforeOrEqualTo(Instant.now().plusSeconds(2));
        assertThat(json.fieldNames()).toIterable()
                .containsExactlyInAnyOrder("jti", "owner", "pet", "validUntil", "issuedAt", "hwid");
    }

    @Test
    @DisplayName("unbound license serializes hwid as JSON null")
    void issueLicense_withoutHwid_jsonHwidIsNull() throws Exception {
        var enc = licenseService.issueLicense("owner1", "cat", "nft", 1, null);

        byte[] iv = Base64.getDecoder().decode(enc.iv());
        byte[] ciphertextAndTag = Base64.getDecoder().decode(enc.ciphertext());
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,
                new SecretKeySpec(masterKey, "AES"),
                new GCMParameterSpec(128, iv));
        JsonNode json = new ObjectMapper().readTree(cipher.doFinal(ciphertextAndTag));
        assertThat(json.get("hwid").isNull()).isTrue();
    }

    @Test
    @DisplayName("validate accepts a license after independent JDK decrypt proves authenticity")
    void validate_roundTrip_afterJdkDecrypt() throws Exception {
        var enc = licenseService.issueLicense("owner1", "dog", "steam", 1, null);
        JsonNode json = decrypt(enc);
        String jti = json.get("jti").asText();

        IssuedLicense stored = new IssuedLicense("owner1", "dog", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        stored.setJti(jti);
        when(licenseRepository.findByJti(jti)).thenReturn(Optional.of(stored));

        assertThat(licenseService.validate(enc.ciphertext(), enc.iv()))
                .isPresent()
                .get()
                .extracting(LicenseService.LicensePayload::jti, LicenseService.LicensePayload::pet)
                .containsExactly(jti, "dog");
    }

    private JsonNode decrypt(LicenseService.EncryptedLicense enc) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,
                new SecretKeySpec(masterKey, "AES"),
                new GCMParameterSpec(128, Base64.getDecoder().decode(enc.iv())));
        return new ObjectMapper().readTree(cipher.doFinal(Base64.getDecoder().decode(enc.ciphertext())));
    }
}
