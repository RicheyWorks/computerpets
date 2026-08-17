# Build review — EnterprisePetBackend (current `src/`)

Historical sandbox review of an early tree (six Java files, no Maven in that
environment). Several findings are **already fixed on current `main`**. This
file keeps the still-true notes and strikes the ones that are no longer true.

A `build.ps1` script is included in the workspace; run it to perform the actual build.

---

## Will it compile?

Yes. The tree is a full Spring Boot 3.3 / Java 21 service (controllers,
`JwtService`, JPA `IssuedLicense`, Flyway, OpenAPI, tests). `mvn -B test`
is the current check, not a six-file static pass.

Expected compiler output: success. BouncyCastle may still emit the two
deprecation warnings below.

## Bugs that were real — now fixed

### 1. `application (1).yml` won't be loaded — **fixed**

Spring Boot loads `application.yml`. The resource is correctly named
`src/main/resources/application.yml`. There is no `application (1).yml`.

### 2. `EthereumNftService` Web3j client / constructor — **fixed**

`EthereumConfig` builds `Web3j` from bound `EthereumProperties`. See the
original write-up in git history if you need the old failure mode.

### 3. Placeholder license master-key / underscore crash — **fixed**

`LICENSE_SECRET_KEY` has **no default** in `application.yml`. Startup
fail-hards if the key is missing, not valid Base64, not 32 bytes, or equal
to the old committed default (except the `test` profile). There is no
underscore placeholder string left for `Base64.getDecoder()` to reject.

## Things that compile but are dead weight

- `com.github.koraktor:steam-condenser:1.3.1` — still declared; `SteamService`
  uses `RestTemplate`. Safe to remove from `pom.xml`.
- `jjwt-api/impl/jackson` — **in use**. `JwtService` + `JwtAuthenticationFilter`
  are on disk and required for `/api/download/**`.
- `spring-boot-starter-data-jpa`, `postgresql`, `h2` — **in use**.
  `IssuedLicense` + `LicenseRepository` persist issuance, revocation, `hwid`,
  and `lastUsedAt`. Flyway owns the schema (`ddl-auto=validate`).

## Deprecation warnings the compiler may emit

```
LicenseService.java: warning: [deprecation] AESEngine() in AESEngine has been deprecated
LicenseService.java: warning: [deprecation] GCMBlockCipher(BlockCipher) in GCMBlockCipher has been deprecated
```

BouncyCastle 1.78+ factory methods:

```java
GCMBlockCipher cipher = GCMBlockCipher.newInstance(AESEngine.newInstance());
```

Won't break the build, just emits warnings. Wire format is unchanged
(AES-256-GCM, 12-byte IV, 128-bit tag appended). See
[docs/CLIENT-CONTRACT.md](docs/CLIENT-CONTRACT.md).

## How to actually run the build

1. Install JDK 21 (Temurin/Adoptium recommended) and Maven 3.9+.
2. Set `LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`, and
   `ADMIN_API_KEY` (see [docs/SETUP.md](docs/SETUP.md)).
3. From the repo root:

```powershell
.\build.ps1
```

Or: `mvn -B test`.
