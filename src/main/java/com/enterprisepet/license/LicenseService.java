package com.enterprisepet.license;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.GCMBlockCipher;
import org.bouncycastle.crypto.params.AEADParameters;
import org.bouncycastle.crypto.params.KeyParameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class LicenseService {

    private final LicenseRepository licenseRepository;

    @Autowired
    public LicenseService(LicenseRepository licenseRepository) {
        this.licenseRepository = licenseRepository;
    }

    /** Test constructor — skips key initialization and @PostConstruct validation. */
    LicenseService(LicenseRepository licenseRepository, boolean forTest) {
        this.licenseRepository = licenseRepository;
    }

    private static final Logger log = LoggerFactory.getLogger(LicenseService.class);

    /**
     * The previously committed default key (still present in git history).
     * Using this key outside of tests is extremely dangerous because anyone
     * with access to the repository can decrypt all issued licenses.
     *
     * The application now refuses to start if this key is detected (except
     * when the 'test' profile is active).
     */
    private static final String COMMITTED_DEFAULT_KEY = "w4xwnrFYITMEO6LTCLqgy+r/pcgfHHDVM47OMaRs6LQ=";

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final int AES_KEY_LENGTH_BYTES = 32; // AES-256

    @Value("${license.secret-key}")
    private String masterKeyBase64;

    private byte[] masterKey;

    private final ObjectMapper json = new ObjectMapper();
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Decode the master key once on startup. Throws if the key is unparseable
     * or the wrong length — preferable to a runtime failure on the first
     * license issuance.
     */
    @PostConstruct
    void init() {
        if (masterKeyBase64 == null || masterKeyBase64.isBlank()) {
            throw new IllegalStateException(
                "license.secret-key is not configured. Set LICENSE_SECRET_KEY to a "
                + "base64-encoded 32-byte key (openssl rand -base64 32).");
        }
        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(masterKeyBase64);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                "license.secret-key is not valid base64. Generate one with "
                + "`openssl rand -base64 32`.", e);
        }
        if (decoded.length != AES_KEY_LENGTH_BYTES) {
            throw new IllegalStateException(
                "license.secret-key must decode to " + AES_KEY_LENGTH_BYTES
                + " bytes (AES-256). Got " + decoded.length + " bytes.");
        }
        this.masterKey = decoded;

        if (COMMITTED_DEFAULT_KEY.equals(masterKeyBase64)) {
            // Check if we are running under a test profile
            String profiles = System.getProperty("spring.profiles.active", "");
            boolean isTest = profiles.toLowerCase().contains("test");

            if (isTest) {
                log.warn("Using the committed default LICENSE_SECRET_KEY because 'test' profile is active. " +
                         "This should only happen in automated tests.");
            } else {
                throw new IllegalStateException(
                    "license.secret-key is using the committed default value from application.yml. " +
                    "This key is publicly known and extremely dangerous to use outside of tests. " +
                    "Set LICENSE_SECRET_KEY to a real base64-encoded 32-byte random value " +
                    "(generate with: openssl rand -base64 32).");
            }
        }
    }

    /**
     * Issues an encrypted, time-limited license bundle.
     * This is what the Python client will decrypt at runtime.
     */
    public EncryptedLicense issueLicense(String ownerId, String petType, String provider, int daysValid) {
        return issueLicense(ownerId, petType, provider, daysValid, null);
    }

    /**
     * Full version supporting optional hardware ID binding (Phase 2.2).
     */
    public EncryptedLicense issueLicense(String ownerId, String petType, String provider, int daysValid, String hwid) {
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Instant issuedAt = Instant.now();
            Instant validUntil = issuedAt.plusSeconds(daysValid * 86400L);

            String jti = UUID.randomUUID().toString();

            String payload = json.writeValueAsString(new LicensePayload(
                jti, ownerId, petType,
                validUntil.toString(), issuedAt.toString(),
                (hwid != null && !hwid.isBlank()) ? hwid : null
            ));

            byte[] plaintext = payload.getBytes(StandardCharsets.UTF_8);
            byte[] ciphertext = encrypt(plaintext, masterKey, iv);

            IssuedLicense issued = new IssuedLicense(ownerId, petType, provider, issuedAt, validUntil);
            issued.setJti(jti);
            if (hwid != null && !hwid.isBlank()) {
                issued.setHwid(hwid);
            }
            licenseRepository.save(issued);

            return new EncryptedLicense(
                Base64.getEncoder().encodeToString(ciphertext),
                Base64.getEncoder().encodeToString(iv),
                validUntil.toString()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to issue secure license", e);
        }
    }

    /**
     * Decrypts and validates a license. Returns the payload if the ciphertext is
     * authentic, parseable, and not yet expired; otherwise {@link Optional#empty()}.
     *
     * <p>AES-GCM authentication means tampering with the ciphertext, IV, or tag will
     * cause {@code doFinal} to throw — we treat that as an invalid license.
     */
    public Optional<LicensePayload> validate(String ciphertextB64, String ivB64) {
        if (ciphertextB64 == null || ivB64 == null) return Optional.empty();
        try {
            byte[] ciphertext = Base64.getDecoder().decode(ciphertextB64);
            byte[] iv         = Base64.getDecoder().decode(ivB64);

            byte[] plaintext = decrypt(ciphertext, masterKey, iv);
            LicensePayload payload = json.readValue(plaintext, LicensePayload.class);

            Instant validUntil = Instant.parse(payload.validUntil());
            if (validUntil.isBefore(Instant.now())) return Optional.empty();

            // Check revocation status from database (Phase 1.2)
            if (licenseRepository.findByJti(payload.jti())
                    .map(IssuedLicense::isRevoked)
                    .orElse(true)) {  // If not found in DB, treat as revoked/invalid
                return Optional.empty();
            }

            return Optional.of(payload);
        } catch (Exception e) {
            // Tampered ciphertext, bad base64, expired/malformed timestamp, etc.
            return Optional.empty();
        }
    }

    /**
     * Revokes a previously issued license by its jti.
     * Returns true if the license existed and was newly revoked.
     * Idempotent: calling twice returns false on the second call.
     */
    public boolean revoke(String jti) {
        if (jti == null || jti.isBlank()) return false;
        return licenseRepository.findByJti(jti)
            .map(lic -> {
                if (lic.isRevoked()) {
                    log.info("License already revoked jti={}", jti);
                    return false;
                }
                lic.setRevokedAt(Instant.now());
                licenseRepository.save(lic);
                log.info("License revoked jti={}", jti);
                return true;
            })
            .orElse(false);
    }

    /**
     * Records that a download occurred for the given license (updates lastUsedAt).
     * Used for audit / future rate-limiting of downloads per license.
     */
    public void recordDownload(String jti) {
        if (jti == null || jti.isBlank()) return;
        licenseRepository.findByJti(jti).ifPresent(lic -> {
            lic.setLastUsedAt(Instant.now());
            licenseRepository.save(lic);
        });
    }

    private byte[] encrypt(byte[] plaintext, byte[] key, byte[] iv) throws Exception {
        GCMBlockCipher cipher = new GCMBlockCipher(new AESEngine());
        AEADParameters params = new AEADParameters(new KeyParameter(key), GCM_TAG_LENGTH * 8, iv);
        cipher.init(true, params);

        byte[] output = new byte[cipher.getOutputSize(plaintext.length)];
        int len = cipher.processBytes(plaintext, 0, plaintext.length, output, 0);
        cipher.doFinal(output, len);
        return output;
    }

    private byte[] decrypt(byte[] ciphertext, byte[] key, byte[] iv) throws Exception {
        GCMBlockCipher cipher = new GCMBlockCipher(new AESEngine());
        AEADParameters params = new AEADParameters(new KeyParameter(key), GCM_TAG_LENGTH * 8, iv);
        cipher.init(false, params);

        byte[] output = new byte[cipher.getOutputSize(ciphertext.length)];
        int len = cipher.processBytes(ciphertext, 0, ciphertext.length, output, 0);
        int finalLen = cipher.doFinal(output, len);

        // GCM's getOutputSize over-estimates for decryption; trim to actual size.
        int total = len + finalLen;
        if (total == output.length) return output;
        return Arrays.copyOf(output, total);
    }

    /** Decoded license body. {@code jti} is the unique license ID for revocation/replay tracking. */
    public record LicensePayload(
        String jti,
        String owner,
        String pet,
        String validUntil,
        String issuedAt,
        String hwid   // optional hardware binding (Phase 2.2) — may be null
    ) {
        /** Convenience constructor for code paths that do not yet supply hwid (backward compat). */
        public LicensePayload(String jti, String owner, String pet, String validUntil, String issuedAt) {
            this(jti, owner, pet, validUntil, issuedAt, null);
        }
    }

    public record EncryptedLicense(String ciphertext, String iv, String expiresAt) {}
}
