# Build review — EnterprisePetBackend (current `src/`)

The sandbox has no Maven and the proxy blocks every Apache / Maven Central / Adoptium endpoint, so `mvn package` could not actually be executed here. Instead, this is a line-level static review of all 6 Java files against the dependencies declared in `pom.xml`.

**Bottom line:** `mvn package` should **succeed** with the current source — there are no syntax errors and every `import` resolves against the declared deps. There are, however, two runtime bugs and one config-loading bug that will bite on first start.

A `build.ps1` script is included in the workspace; run it to perform the actual build.

---

## Will it compile? (Per file)

| File | Imports resolve? | Notes |
|---|---|---|
| `EnterprisePetBackendApplication.java` | yes | Stock Spring Boot entrypoint. |
| `config/SecurityConfig.java` | yes | Spring Security 6 (Boot 3.3.5) lambda DSL — correct shape. `csrf.disable()`, `authorizeHttpRequests`, `requestMatchers`, `SessionCreationPolicy.STATELESS` all valid. |
| `controller/VerifyController.java` | yes | Uses `Map<String,String>` request bodies — no DTO classes required. |
| `license/LicenseService.java` | yes | All BC and JDK imports resolve. **Two deprecation warnings expected** (see below), not errors. |
| `nft/EthereumNftService.java` | yes | web3j 4.12.0 API is correct. |
| `steam/SteamService.java` | yes | Uses `RestTemplate`; the `steam-condenser` dep is declared but unused. |

Expected compiler output: success with 2 deprecation warnings.

## Bugs the build will not catch

These compile cleanly but break at runtime — flagging because you asked me to keep going on the build:

### 1. `application (1).yml` won't be loaded

Spring Boot's resource resolver looks for `application.yml`, `application.yaml`, or `application.properties` on the classpath. A file literally named `application (1).yml` is treated as an arbitrary unrelated resource and **ignored**. Consequences:

- `@Value("${license.secret-key}")` in `LicenseService` → throws `IllegalArgumentException: Could not resolve placeholder` at app startup.
- `@Value("${steam.api-key}")` in `SteamService` → same.
- `@Value("${ethereum.rpc-url:...}")` in `EthereumNftService` survives because it has a default.

**Fix:** rename `src/main/resources/application (1).yml` → `application.yml`.

### 2. `EthereumNftService` initializes web3j before `@Value` injection

```java
@Value("${ethereum.rpc-url:...}")
private String rpcUrl;        // field-injected by Spring AFTER constructor runs

public EthereumNftService() {
    this.web3j = Web3j.build(new HttpService(rpcUrl));   // rpcUrl is null here
}
```

Spring sets `rpcUrl` *after* the no-arg constructor returns. At construction time `rpcUrl == null`, so `HttpService` is built against null. The web3j client will not point at the intended RPC.

**Fix:** either constructor-inject `@Value` as a parameter, or move the `Web3j.build(...)` call into an `@PostConstruct` method.

### 3. The placeholder license master-key crashes at first issuance

```yaml
license:
  secret-key: "CHANGE_THIS_TO_A_32_BYTE_BASE64_KEY_IN_PRODUCTION_1234567890AB=="
```

`Base64.getDecoder()` is the standard (RFC 4648 §4) decoder, which **rejects `_`**. The placeholder string contains underscores, so the very first call to `issueLicense(...)` throws `IllegalArgumentException: Illegal base64 character 5f` — even before the AES key-length check (which would also fail; a valid base64-encoded AES-256 key is a 44-char string ending in `=`, decoding to 32 bytes).

**Fix:** replace with a real 32-byte key, e.g. produced by `openssl rand -base64 32` and pasted in as the secret.

## Things that compile but are dead weight

- `com.github.koraktor:steam-condenser:1.3.1` — not imported anywhere; `SteamService` uses `RestTemplate` instead. Safe to remove from `pom.xml`.
- `jjwt-api/impl/jackson` (3 deps) — no JWT code on disk; the `JwtService` and `JwtAuthenticationFilter` classes only exist in the `EnterprisePetBackend-FullFlex+` zips. Either pull the JWT classes in or drop the deps.
- `spring-boot-starter-data-jpa`, `postgresql`, `h2` — included, but there are no `@Entity`/`@Repository` classes on disk yet. JPA will spin up empty against H2 at startup; harmless but slow.

## Deprecation warnings the compiler will emit

```
LicenseService.java:54: warning: [deprecation] AESEngine() in AESEngine has been deprecated
LicenseService.java:54: warning: [deprecation] GCMBlockCipher(BlockCipher) in GCMBlockCipher has been deprecated
```

BouncyCastle 1.78+ moved to factory methods:

```java
// old (deprecated):
GCMBlockCipher cipher = new GCMBlockCipher(new AESEngine());

// new:
GCMBlockCipher cipher = GCMBlockCipher.newInstance(AESEngine.newInstance());
```

Won't break the build, just emits warnings.

## How to actually run the build

1. Install JDK 21 (Temurin/Adoptium recommended) and Maven 3.9+.
2. From `C:\Users\730ri\projects\ComputerPets`, run:

```powershell
.\build.ps1
```

The script verifies your JDK/Maven versions, runs `mvn -B -DskipTests package`, and prints the location of the resulting fat JAR. It does **not** fix any of the bugs above — those are listed for you to address.
