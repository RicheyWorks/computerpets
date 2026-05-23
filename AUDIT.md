# EnterprisePet Backend — Audit & Recommendations

Date: 2026-05-14. Scope: every file under `src/`, the `pom.xml`, the YAML
config, and the recent plugin/download refactor.

Items are prioritized: **P0** = fix before any public exposure, **P1** =
real bug or material risk, **P2** = code quality / maintainability,
**P3** = repo hygiene / nice-to-have.

---

## P0 — Security holes

### 1. Steam and Microsoft Store verification are stubs that return `true`
`SteamService.ownsApp` and `MicrosoftStoreService.ownsProduct` always
return `true` on the happy path. Any caller hitting `/api/verify/steam`
or `/api/verify/microsoft` with a syntactically valid body gets a
365-day license. **The only working ownership check on disk is the NFT
one.** Until the real Steam Web API and Microsoft Collections API calls
are wired up, the verify endpoints must be gated behind a feature flag
or environment guard so a stub provider can't be reached from production.

### 2. Default secrets are committed to the repo
`application.yml` ships with default values for both crypto keys:
```yaml
license.secret-key: "${LICENSE_SECRET_KEY:w4xwnrFYITMEO6LTCLqgy+r/pcgfHHDVM47OMaRs6LQ=}"
bundle.signing-key: "${BUNDLE_SIGNING_KEY:CHANGE_ME_BUNDLE_SIGNING_KEY}"
```
The fallbacks turn a forgotten env var into a silent downgrade. Fix:
fail-fast on startup if the bound key equals a known-default sentinel,
or drop the defaults entirely outside `dev` profile (use Spring
profiles: `application-dev.yml` keeps a key for local work; the base
config has no default at all).

### 3. NFT ownership check uses a substring match against the raw ABI response
```java
return owner != null && owner.toLowerCase()
    .contains(walletAddress.toLowerCase().substring(2));
```
Two problems:
- `substring(2)` throws `StringIndexOutOfBoundsException` if the caller
  passes a wallet shorter than 2 chars, and silently returns `""` if
  passed exactly `"0x"` — and an empty string is contained in every
  response, so the call returns `true`.
- Substring matching against the hex-encoded return is loose. Decode
  the response properly with `FunctionReturnDecoder.decode(...)`, pull
  the `Address` typed value out, and compare lowercased fixed-length
  hex.

### 4. All API routes are unauthenticated
`SecurityConfig` `permitAll()`s `/api/verify/**`, `/api/pets/**`, and
`/api/download/**`, then declares `anyRequest().authenticated()` — but
nothing else in the app is registered under any other path, so the
`authenticated()` rule is dead code. Effects: no rate limit, no
abuse protection, anyone on the internet can hammer the verify and
download endpoints. Add per-route rate limiting (Bucket4j is a common
choice) at minimum; consider an API key or signed-request header for
machine-to-machine callers.

### 5. Download URLs aren't bound to the requester
`PetBundleService` HMAC-signs `petKey | owner | exp`, but a download
URL leaked from a client browser/log is replayable for 15 minutes from
any IP. Bind the signature to either (a) a per-issue nonce stored
server-side, or (b) the requesting IP, or (c) a one-shot token that
the CDN/proxy invalidates on first use. Even an HMAC that includes
the license `jti` (see #8) is better than nothing.

---

## P1 — Correctness bugs

### 6. `application (1).yml` is still on disk
Both `application.yml` and `application (1).yml` exist in
`src/main/resources/`. Spring will only load `application.yml`, so the
`(1)` copy is dead weight — but anyone touching the wrong file will
silently edit a file that has zero effect. Delete
`src/main/resources/application (1).yml` and the matching stale copy
at `target/classes/application (1).yml`.

### 7. Empty `petType` in the verify body produces a confusing 400
`request.getOrDefault("petType", DEFAULT_PET_KEY)` returns `""` (not
the default) when the body contains `"petType": ""`. The result is a
400 with `"received": ""`. Either normalize blank/whitespace to the
default, or return a clearer error message.

### 8. License payload has no unique ID
`LicensePayload` is `(owner, pet, validUntil, issuedAt)`. There's no
`jti` (JWT-style ID), so revocation is impossible and the download
endpoint can't detect replays. Add a `jti` (UUID) at issuance time and
consider a small Redis set of revoked IDs that `LicenseService.validate`
consults.

### 9. README claims features that aren't in the code
The README says:
> Hardware-bound, time-limited licenses

…but there's no hardware fingerprint field in `LicensePayload` and no
code that reads one. Either implement it (add an `hwid` field that the
PyQt client computes and sends; bind it into the license at issuance
and check on every download) or remove the claim from the README.

### 10. BouncyCastle calls use deprecated APIs
`new GCMBlockCipher(new AESEngine())` is deprecated in BC 1.78+; both
calls in `LicenseService` emit warnings. Replace with
`GCMBlockCipher.newInstance(AESEngine.newInstance())`. Two-line fix.

---

## P2 — Code quality / maintainability

### 11. `Map<String, String>` request bodies have no validation
Every verify endpoint takes `@RequestBody Map<String, String>`. The
`spring-boot-starter-validation` dependency is already in the pom, but
nothing uses it. Convert to typed DTOs per provider
(`SteamVerifyRequest`, `NftVerifyRequest`, `MicrosoftVerifyRequest`)
with `@NotBlank` / `@Pattern` constraints. The generic
`/api/verify/{provider}` route can keep a typed `Map` if the trade-off
of one untyped path is worth keeping plugins drop-in — but the
provider-specific validation should still happen inside each provider
via a dedicated parse method.

### 12. Inconsistent error response shapes
Some endpoints return `{ "error": "...", "validKeys": "..." }`, the
download endpoint returns `{ "error": "...", "requested": "..." }`,
and unhandled exceptions return Spring's default `{ "timestamp": ...,
"status": 500, "error": "...", "path": "..." }`. Standardize on RFC
7807 `application/problem+json` and add a
`@RestControllerAdvice` global exception handler.

### 13. `System.out.println` in `SteamService` and `MicrosoftStoreService`
Replace with SLF4J:
```java
private static final Logger log = LoggerFactory.getLogger(SteamService.class);
log.info("Checking Steam ownership steamId={} appId={}", steamId, appId);
```
Bonus: SLF4J's placeholder logging is parameterized and faster, and
`logback` is already on the classpath via the web starter.

### 14. Unused `RestTemplate` fields
`SteamService` and `MicrosoftStoreService` both declare
`private final RestTemplate restTemplate = new RestTemplate();` and
never use it. Either wire it in (and inject a shared `RestTemplate`
bean from a `@Configuration` so timeouts/interceptors are
centralized) or delete the field. Consider migrating to `RestClient`
or `WebClient` — Spring 6 recommends `RestClient` for new code.

### 15. Unused dependencies
- `com.github.koraktor:steam-condenser` — never imported.
- `io.jsonwebtoken:jjwt-*` (three artifacts) — no JWT code on disk.
- `spring-boot-starter-data-jpa`, `postgresql`, `h2` — no `@Entity` or
  `@Repository` anywhere; JPA boots an empty schema every startup.
Either pull them out, or add the code that justifies them.

### 16. No tests
`src/test/` is empty. Minimum coverage to add:
- `PetType.fromKey` and the `PetCatalog` helpers (pure logic).
- `LicenseService` round-trip (issue → validate) and a tamper case.
- `ProviderRegistry` duplicate-key detection.
- `VerifyController` for unknown provider (404), unknown pet (400),
  denied verification (403), success (200) — `@WebMvcTest` with
  mocked providers.
- `DownloadController` for license-pet mismatch (403), expired license
  (401), happy path (200).

### 17. License key handling allocates fresh `Base64.decode` per call
`Base64.getDecoder().decode(masterKeyBase64)` runs inside every
`issueLicense` and `validate`. Decode once at startup into a `byte[]`
field, ideally via `@PostConstruct`, and reuse. Same for the bundle
signing key in `PetBundleService`. Small allocations are fine, but
the key bytes are a fixed startup concern.

### 18. `Optional<?>` return-typing in `PetController.get` is awkward
```java
.<ResponseEntity<?>>map(p -> ResponseEntity.ok(view(p)))
```
The explicit type witness is needed because of `?` capture. A
`ResponseEntity<Map<String, Object>>` everywhere (with an error map
returned at the same generic type) cleans this up.

---

## P3 — Repo hygiene

### 19. Thirteen `.zip` snapshots at the repo root
~360 KB of historical bundle attempts (`EnterprisePetBackend-Fixed.zip`
through `EnterprisePetBackend-FinalClean.zip`). Per the existing
`ZIP-AUDIT.md`, `FinalClean` is a superset of the others except for
divergent `LicenseService.java` versions. Archive these to a
`backups/` folder outside the working tree, or delete after
confirming `git` has them.

### 20. `target/` is checked in
The Maven output directory is present under version control (or at
least on disk), including stale compiled classes and the bad
`application (1).yml`. Add `target/`, `*.class`, `.idea/`, `.vscode/`,
`*.iml` to a `.gitignore`.

### 21. No `mvnw` wrapper
The build expects a system Maven 3.9+. Add the Maven Wrapper
(`mvn -N wrapper:wrapper`) so contributors don't need a globally
installed Maven, and CI scripts can pin a version.

### 22. README's "Built with ❤️ and paranoia by Grok + Blackbeard" line
Stylistic — fine if intentional, worth a once-over before any external
publication.

---

## Architectural suggestions (longer-term)

### 23. Persist issued licenses, not just sign them
Stateless licenses are clean, but they preclude revocation, per-user
limits, audit logs, and entitlement transfer. A small
`issued_licenses` table (jti, owner, pet, provider, issued_at,
expires_at, revoked_at) costs little and unlocks the four features
above. The JPA + Postgres deps are already in the pom; this would
make them earn their place.

### 24. Move from `Map`-driven verify body to a provider-owned DTO
Today `OwnershipProvider.verify(Map<String,String>)` is convenient but
loses every type guarantee at the API boundary. A cleaner shape:
```java
public interface OwnershipProvider<R> {
    String key();
    Class<R> requestType();
    VerificationResult verify(R request);
}
```
…with `VerifyController` deserializing the body as
`provider.requestType()` via Jackson. More plumbing, but real types
in each provider.

### 25. Split verify and license issuance
Right now `VerifyController.verify` does two unrelated things:
ownership verification and license issuance. Splitting them lets you
re-issue a license without re-verifying every time (e.g. when the
client loses its license but you trust an existing session), and lets
you charge a different rate-limit budget to each.

### 26. Add an Asset Catalog for the bundles
The download URL format is `{base}/{petKey}.zip`. As pets gain
versions, platform-specific builds (Windows vs macOS), and asset
variants (size, language), this naming will collapse. A
`PetAsset(petKey, version, platform, sha256, sizeBytes, url)` record
returned in the manifest is the natural next step. Also lets the
client verify the download didn't get tampered with at the CDN.

---

## Quick wins (pick a few for the next session)

If I were picking the smallest set of fixes that move the needle:
1. Delete `application (1).yml` and the stale `target/classes/` copy.
2. Replace BouncyCastle deprecated API calls (2 lines in `LicenseService`).
3. Remove the default `bundle.signing-key` fallback (or guard at startup).
4. Add `.gitignore` covering `target/`, `*.class`, IDE folders.
5. Move the 13 historical zips out of the repo root.
6. Decode the license/bundle keys once in `@PostConstruct`, store as `byte[]`.
7. Replace `System.out.println` with SLF4J in the two provider stubs.
8. Add a global `@RestControllerAdvice` exception handler with
   `application/problem+json` errors.

Each is small, none is risky.
