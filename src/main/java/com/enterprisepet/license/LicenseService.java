package com.enterprisepet.license;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.GCMBlockCipher;
import org.bouncycastle.crypto.modes.GCMModeCipher;
import org.bouncycastle.crypto.params.AEADParameters;
import org.bouncycastle.crypto.params.KeyParameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class LicenseService {

    /**
     * Extra Redis TTL beyond {@code expiresAt} so clock skew cannot drop a
     * deny-list key while the encrypted payload is still inside {@code validUntil}.
     */
    static final Duration DENY_TTL_SKEW = Duration.ofHours(1);

    private final LicenseRepository licenseRepository;
    private final RevocationIndex revocationIndex;
    private final LicenseAuditor auditService;

    @Autowired
    public LicenseService(LicenseRepository licenseRepository,
                          RevocationIndex revocationIndex,
                          LicenseAuditor auditService) {
        this.licenseRepository = licenseRepository;
        this.revocationIndex = Objects.requireNonNull(revocationIndex, "revocationIndex");
        this.auditService = Objects.requireNonNull(auditService, "auditService");
    }

    /** Test constructor — skips key initialization and @PostConstruct validation. */
    LicenseService(LicenseRepository licenseRepository, boolean forTest) {
        this(licenseRepository, new InMemoryRevocationIndex(), NoOpLicenseAuditor.INSTANCE);
    }

    /** Test constructor with an explicit deny-list (shared Redis or a test double). */
    LicenseService(LicenseRepository licenseRepository, RevocationIndex revocationIndex, boolean forTest) {
        this(licenseRepository, revocationIndex, NoOpLicenseAuditor.INSTANCE);
    }

    /** Test constructor with deny-list + audit double. */
    LicenseService(LicenseRepository licenseRepository,
                   RevocationIndex revocationIndex,
                   LicenseAuditor auditService,
                   boolean forTest) {
        this(licenseRepository, revocationIndex, auditService);
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
    private static final String COMMITTED_DEFAULT_KEY = "REMOVED_LICENSE_DEV_KEY";

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final int AES_KEY_LENGTH_BYTES = 32; // AES-256

    @Value("${license.secret-key}")
    private String masterKeyBase64;

    /**
     * Optional previous AES-256 key kept during a rotation window so licenses
     * issued under the old key still decrypt on download. Issue always uses
     * {@link #masterKeyBase64}. Blank = no dual-key. See ADR 0065.
     */
    @Value("${license.secret-key-previous:}")
    private String previousMasterKeyBase64;

    private byte[] masterKey;
    private byte[] previousMasterKey;

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
        this.masterKey = decodeAesKey(masterKeyBase64, "license.secret-key");
        this.previousMasterKey = decodeOptionalPrevious(previousMasterKeyBase64);

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
        if (previousMasterKey != null) {
            log.info("LicenseService ready with dual-key decrypt (previous LICENSE_SECRET_KEY present).");
        }
    }

    private byte[] decodeOptionalPrevious(String previousB64) {
        if (previousB64 == null || previousB64.isBlank()) {
            return null;
        }
        if (previousB64.equals(masterKeyBase64)) {
            throw new IllegalStateException(
                    "license.secret-key-previous must differ from license.secret-key. "
                            + "A no-op rotation leaves only one key mid-flight (ADR 0065).");
        }
        if (COMMITTED_DEFAULT_KEY.equals(previousB64)) {
            throw new IllegalStateException(
                    "license.secret-key-previous must not be the committed default key (ADR 0065).");
        }
        return decodeAesKey(previousB64, "license.secret-key-previous");
    }

    private static byte[] decodeAesKey(String base64, String label) {
        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                    label + " is not valid base64. Generate one with "
                            + "`openssl rand -base64 32`.", e);
        }
        if (decoded.length != AES_KEY_LENGTH_BYTES) {
            throw new IllegalStateException(
                    label + " must decode to " + AES_KEY_LENGTH_BYTES
                            + " bytes (AES-256). Got " + decoded.length + " bytes.");
        }
        return decoded;
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

            boolean hwidBound = hwid != null && !hwid.isBlank();
            String payload = json.writeValueAsString(new LicensePayload(
                jti, ownerId, petType,
                validUntil.toString(), issuedAt.toString(),
                hwidBound ? hwid : null
            ));

            byte[] plaintext = payload.getBytes(StandardCharsets.UTF_8);
            byte[] ciphertext = encrypt(plaintext, masterKey, iv);

            IssuedLicense issued = new IssuedLicense(ownerId, petType, provider, issuedAt, validUntil);
            issued.setJti(jti);
            if (hwidBound) {
                issued.setHwid(hwid);
            }
            licenseRepository.save(issued);
            auditService.recordIssued(issued, hwidBound);

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
     *
     * <p>Revocation check order (after decrypt + expiry):
     * <ol>
     *   <li>Shared {@link RevocationIndex} (Redis) — deny immediately if the
     *       {@code jti} is listed. A replica that has not seen the Postgres
     *       {@code revokedAt} row still rejects.</li>
     *   <li>Postgres ledger — missing {@code jti}, {@code revokedAt} set, or
     *       soft-deleted ({@code deletedAt}) denies. Always consulted when the
     *       index misses or is down, so Redis cannot silently resurrect a
     *       revoked license.</li>
     * </ol>
     * If Redis is unreachable, this method does <em>not</em> fail the download:
     * it falls back to the ledger. (HTTP {@code /api/download} may still 503
     * from the rate-limit filter when {@code rate-limit.backend=redis}.)
     */
    public Optional<LicensePayload> validate(String ciphertextB64, String ivB64) {
        if (ciphertextB64 == null || ivB64 == null) return Optional.empty();
        try {
            byte[] ciphertext = Base64.getDecoder().decode(ciphertextB64);
            byte[] iv         = Base64.getDecoder().decode(ivB64);

            byte[] plaintext = decryptWithRotation(ciphertext, iv);
            LicensePayload payload = json.readValue(plaintext, LicensePayload.class);

            Instant validUntil = Instant.parse(payload.validUntil());
            if (validUntil.isBefore(Instant.now())) return Optional.empty();

            if (deniedByIndex(payload.jti())) {
                return Optional.empty();
            }

            // Postgres is the ledger (Phase 1.2). Unknown / revoked / soft-deleted jti denies.
            if (licenseRepository.findByJti(payload.jti())
                    .map(lic -> !lic.isActive())
                    .orElse(true)) {
                return Optional.empty();
            }

            return Optional.of(payload);
        } catch (Exception e) {
            // Tampered ciphertext, bad base64, expired/malformed timestamp, etc.
            return Optional.empty();
        }
    }

    /**
     * Revokes a previously issued license by its jti (soft-delete; no hard wipe).
     * Returns true if the license existed and was newly revoked.
     * Idempotent: calling twice returns false on the second call.
     *
     * <p>Order: persist {@code revokedAt} + {@code deletedAt} in Postgres (ledger),
     * append an audit event, then write the {@code jti} to the shared deny-list
     * with TTL ≥ remaining license life. A Redis write failure is logged; revoke
     * still succeeds.
     */
    public boolean revoke(String jti) {
        return revoke(jti, LicenseAuditService.ACTOR_SYSTEM);
    }

    /**
     * Same as {@link #revoke(String)} with an explicit actor for the audit ledger
     * (e.g. {@code admin}).
     */
    public boolean revoke(String jti, String actor) {
        if (jti == null || jti.isBlank()) return false;
        return licenseRepository.findByJti(jti)
            .map(lic -> {
                boolean newlyRevoked = !lic.isRevoked();
                if (newlyRevoked) {
                    Instant now = Instant.now();
                    lic.setRevokedAt(now);
                    lic.setDeletedAt(now);
                    licenseRepository.save(lic);
                    auditService.recordRevoked(lic, actor);
                    log.info("License revoked (soft-deleted) jti={}", jti);
                } else {
                    // Heal soft-delete stamp if an older row only had revokedAt.
                    if (lic.getDeletedAt() == null) {
                        lic.setDeletedAt(lic.getRevokedAt() != null ? lic.getRevokedAt() : Instant.now());
                        licenseRepository.save(lic);
                    }
                    log.info("License already revoked jti={}", jti);
                }
                // Heal the deny-list even on a repeat revoke (Redis was down the first time).
                publishDenial(lic);
                return newlyRevoked;
            })
            .orElse(false);
    }

    private boolean deniedByIndex(String jti) {
        try {
            return revocationIndex.isDenied(jti);
        } catch (RevocationIndexUnavailableException e) {
            log.warn("Revocation index unavailable; falling back to Postgres ledger for jti={}", jti);
            return false;
        }
    }

    private void publishDenial(IssuedLicense lic) {
        try {
            revocationIndex.deny(lic.getJti(), denyTtl(lic));
        } catch (RevocationIndexUnavailableException e) {
            log.warn("Revocation index write failed after Postgres revoke jti={}; replicas will deny via the ledger",
                lic.getJti());
        }
    }

    static Duration denyTtl(IssuedLicense lic) {
        Instant expires = lic.getExpiresAt();
        Instant now = Instant.now();
        Duration remaining = (expires != null && expires.isAfter(now))
            ? Duration.between(now, expires)
            : Duration.ZERO;
        return remaining.plus(DENY_TTL_SKEW);
    }

    /**
     * Looks up a persisted license by jti for admin audit. Includes soft-deleted
     * rows so operators can still see revoked licenses with honest copy.
     */
    public Optional<IssuedLicense> findIssued(String jti) {
        if (jti == null || jti.isBlank()) return Optional.empty();
        return licenseRepository.findByJti(jti.trim());
    }

    /**
     * Recent licenses for one owner including soft-deleted (admin ledger).
     */
    public List<IssuedLicense> findByOwner(String owner) {
        if (owner == null || owner.isBlank()) return List.of();
        return licenseRepository.findTop50ByOwnerOrderByIssuedAtDesc(owner.trim());
    }

    /**
     * Newest issued licenses across all owners including soft-deleted (admin).
     */
    public List<IssuedLicense> listRecent() {
        return licenseRepository.findTop50ByOrderByIssuedAtDesc();
    }

    /**
     * Active-only list for one owner (default queries exclude soft-deleted).
     */
    public List<IssuedLicense> findActiveByOwner(String owner) {
        if (owner == null || owner.isBlank()) return List.of();
        return licenseRepository.findTop50ByDeletedAtIsNullAndOwnerOrderByIssuedAtDesc(owner.trim());
    }

    /**
     * Newest active licenses (default queries exclude soft-deleted).
     */
    public List<IssuedLicense> listActiveRecent() {
        return licenseRepository.findTop50ByDeletedAtIsNullOrderByIssuedAtDesc();
    }

    /**
     * Records that a download occurred for the given license (updates lastUsedAt)
     * and appends a DOWNLOAD audit event. Soft-deleted rows are left untouched.
     */
    public void recordDownload(String jti) {
        if (jti == null || jti.isBlank()) return;
        licenseRepository.findByJtiAndDeletedAtIsNull(jti).ifPresent(lic -> {
            lic.setLastUsedAt(Instant.now());
            licenseRepository.save(lic);
            auditService.recordDownload(lic);
        });
    }

    private byte[] encrypt(byte[] plaintext, byte[] key, byte[] iv) throws Exception {
        GCMModeCipher cipher = GCMBlockCipher.newInstance(AESEngine.newInstance());
        AEADParameters params = new AEADParameters(new KeyParameter(key), GCM_TAG_LENGTH * 8, iv);
        cipher.init(true, params);

        byte[] output = new byte[cipher.getOutputSize(plaintext.length)];
        int len = cipher.processBytes(plaintext, 0, plaintext.length, output, 0);
        cipher.doFinal(output, len);
        return output;
    }

    /**
     * Decrypt with the current master key; on GCM auth failure try the previous
     * key when a rotation window is open. Fail closed when neither key authenticates.
     */
    private byte[] decryptWithRotation(byte[] ciphertext, byte[] iv) throws Exception {
        try {
            return decrypt(ciphertext, masterKey, iv);
        } catch (Exception currentFailed) {
            if (previousMasterKey == null) {
                throw currentFailed;
            }
            return decrypt(ciphertext, previousMasterKey, iv);
        }
    }

    private byte[] decrypt(byte[] ciphertext, byte[] key, byte[] iv) throws Exception {
        GCMModeCipher cipher = GCMBlockCipher.newInstance(AESEngine.newInstance());
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
