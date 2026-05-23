# EnterprisePetBackend — zip & source audit

Read-only audit of `C:\Users\730ri\projects\ComputerPets`. Nothing in the project was modified.

## 1. Zip inventory (13 zips, all dated 2026-05-14)

| Zip | Size | Files | Notes |
|---|---:|---:|---|
| EnterprisePetBackend-Fixed | 11 KB | 10 | Earliest. Java backend only, no DTOs, no security/Jwt, no clients. |
| EnterprisePetBackend-HardwareBinding | 12 KB | 10 | Same shape as Fixed, different LicenseService. |
| EnterprisePetBackend-FullFlex | 18 KB | 18 | Adds `dto/*` (5 classes) + `security/Jwt*` + first python-client. |
| EnterprisePetBackend-Complete | 22 KB | 23 | Adds Docker, RateLimitingFilter, pyqt6 client. |
| EnterprisePetBackend-Final | 24 KB | 25 | Adds GlobalExceptionHandler, animated_pet.py. |
| EnterprisePetBackend-ReadyForTest | 27 KB | 27 | Adds functional_pet.py, local_license_store.py. |
| EnterprisePetBackend-TestReady | 27 KB | 27 | Same file list as ReadyForTest. |
| EnterprisePetBackend-AdvancedPet | 29 KB | 28 | Adds advanced_pet.py. |
| EnterprisePetBackend-PetV2 | 31 KB | 29 | Adds advanced_pet_v2.py. |
| EnterprisePetBackend-FinalPush | 35 KB | 31 | Adds AdminController.java, final_pet.py. |
| EnterprisePetBackend-MultiPet | 37 KB | 32 | Adds multi_pet.py. |
| EnterprisePetBackend-TrayPet | 40 KB | 33 | Adds tray_pet.py. |
| **EnterprisePetBackend-FinalClean** | **42 KB** | **34** | **Newest + largest. Adds evolved_pet.py. Superset of every other zip.** |

> **Recommendation:** `EnterprisePetBackend-FinalClean.zip` is the canonical bundle. The other 12 zips are intermediate snapshots and can be archived/deleted without losing code, with one exception noted below.

## 2. Duplicate vs divergent files across zips

By relative path, how many distinct hashes appear across the 13 zips:

| Path | Distinct versions | Where they diverge |
|---|---:|---|
| `src/main/java/.../license/LicenseService.java` | **5** | Major rewrites between Fixed → Complete → AdvancedPet line → Final → ReadyForTest. |
| `README.md` | 3 | Fixed (earliest), FinalClean (latest), all others (middle). |
| `pom.xml` | 2 | Fixed/FullFlex/HardwareBinding use one version; the other 10 zips share an updated one. |
| `src/main/resources/application.yml` | 2 | Same split as pom.xml. |
| `python-client/enterprise_pet_client.py` | 2 | Complete/FullFlex share one; the other 8 share an updated one. |
| All other 28 paths | 1 each | Identical wherever they appear. |

**The LicenseService.java fork is the only real merge risk.** Five distinct versions exist; the on-disk copy matches none of them exactly (see §3).

## 3. Current `src/` vs the zips — divergence map

The on-disk source tree (6 Java files + 1 yml) is a **hybrid that does not match any single zip**:

| On-disk file | Matches zip exactly? | Closest zip (diff lines) |
|---|---|---|
| `EnterprisePetBackendApplication.java` | YES — matches **all 13 zips** | — |
| `SecurityConfig.java` | no | AdvancedPet / Complete / Final (11) |
| `VerifyController.java` | no | AdvancedPet / Complete / Final (44) |
| `LicenseService.java` | no | Fixed (42), then a 102-line jump to Complete/FullFlex |
| `EthereumNftService.java` | no | AdvancedPet / Complete / Final (66) |
| `SteamService.java` | no | AdvancedPet / Complete / Final (64) |
| `pom.xml` | no | Fixed / FullFlex / HardwareBinding (23) |
| `README.md` | no | Fixed (54) |
| `application (1).yml` | no | Fixed / FullFlex / HardwareBinding (25) |

Interpretation: someone took the **Fixed-era pom + yml + README + LicenseService** and dropped them into a checkout that otherwise had the **Complete/Final-era controller, security, NFT, Steam services**. Result is a Frankenstein tree.

## 4. Files the zips have but the current `src/` is missing

Relative to **FinalClean** (the canonical bundle), the on-disk tree is missing:

- `src/main/java/com/enterprisepet/config/GlobalExceptionHandler.java`
- `src/main/java/com/enterprisepet/config/RateLimitingFilter.java`
- `src/main/java/com/enterprisepet/controller/AdminController.java`
- `src/main/java/com/enterprisepet/dto/LicenseResponse.java`
- `src/main/java/com/enterprisepet/dto/ValidateRequest.java`
- `src/main/java/com/enterprisepet/dto/ValidationResponse.java`
- `src/main/java/com/enterprisepet/dto/VerifyNftRequest.java`
- `src/main/java/com/enterprisepet/dto/VerifySteamRequest.java`
- `src/main/java/com/enterprisepet/security/JwtAuthenticationFilter.java`
- `src/main/java/com/enterprisepet/security/JwtService.java`
- `Dockerfile`, `docker-compose.yml`, `.gitignore`
- All `pyqt6-client/*.py` (10 files)
- All `python-client/*.py` (2 files)

The current Java code's `import` statements don't reference any of the DTO/security classes above, so the missing files don't break compilation of what's on disk — they just mean the on-disk tree is a stripped-down subset of the newer backends.

## 5. Build attempt

**Not runnable in this sandbox.** Maven is not installed and the egress proxy blocks downloads from `dlcdn.apache.org`, `repo.maven.apache.org`, and `archive.apache.org` (HTTP 403). No `mvnw` wrapper exists in the project or in any zip. JDK 11 is present but the pom requires JDK 21 (`<java.version>21</java.version>`, `<source>21</source>`).

Static checks that were possible:

- All 6 Java files have balanced braces and a single top-level class.
- `pom.xml` declares Spring Boot 3.3.5 with starters for web, security, validation, data-jpa, plus PostgreSQL, H2, JJWT, web3j, steam-condenser, BouncyCastle.
- `VerifyController` uses `Map<String,String>` request bodies and does **not** reference the DTO classes from the newer zips, so it should compile against the on-disk set alone (assuming dependencies resolve).

### Known issues that will bite a real build

1. **`application (1).yml` will be ignored by Spring Boot.** It expects `application.yml` or `application.properties` on the classpath. The duplicate-download `(1)` suffix needs to be removed (or the file renamed) before the app will pick up its config at runtime. Compile will still pass, but startup will use defaults.
2. **JDK mismatch.** pom requires Java 21; only Java 11 is available here. On your machine, ensure a JDK 21 is active before `mvn package`.
3. **No `mvnw`.** You'll need a system Maven 3.9+.

## 6. Recommendation

1. Run a build on **`EnterprisePetBackend-FinalClean.zip`** in isolation — it's the newest, largest, and is a superset of the other 12 in terms of paths. Treat that build as the source of truth.
2. Decide which `LicenseService.java` you actually want. The on-disk one matches none of the 5 zip variants — verify with git/file timestamps which one is authoritative before you let FinalClean overwrite it.
3. Delete or archive `EnterprisePetBackend-Fixed/HardwareBinding/FullFlex/Complete/Final/ReadyForTest/TestReady/AdvancedPet/PetV2/FinalPush/MultiPet/TrayPet.zip` — every file in them (except divergent LicenseService versions) is present in FinalClean.
4. Rename `src/main/resources/application (1).yml` → `application.yml` regardless of which bundle you adopt.
