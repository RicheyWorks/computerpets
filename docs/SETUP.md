# Setup & Installation Guide

This guide provides step-by-step instructions for setting up and running the **ComputerPets** project locally.

> **Note**: This repository contains the backend, the living desk (`web/`), the Electron overlay (`desktop/`), and a first PyQt6 blotter client (`client/`).

---

## Prerequisites

### Backend Requirements

To run the Spring Boot backend, you will need the following:

| Requirement       | Recommended Version          | Notes |
|-------------------|------------------------------|-------|
| **Java JDK**      | 21 (LTS)                     | Temurin, Oracle JDK, or Amazon Corretto |
| **Apache Maven**  | 3.9 or newer                 | Used to build and run the project |
| **Git**           | Latest stable                | Required to clone the repository |
| **Redis**         | 7.x                          | Shared rate-limit store and jti deny-list. `docker compose` starts it. Local `mvn spring-boot:run` needs Redis on `localhost:6379` or `RATE_LIMIT_BACKEND=memory`. |
| **Terminal**      | PowerShell, Bash, or Zsh     | Windows PowerShell is fully supported |

**Optional but Recommended Tools:**
- IDE: IntelliJ IDEA, Visual Studio Code (with Java Extension Pack), or Eclipse
- OpenSSL (for generating secrets on non-Windows systems)

### PyQt blotter client (`client/`)

The first PyQt6 desk is in `client/`. It uses Qt’s GPU-backed scene (`QGraphicsView` + `QOpenGLWidget`), not a custom shader engine.

- **Python** — 3.11 or newer (3.12+ recommended)
- **PyQt6** and **cryptography** — `pip install -e ".[dev]"` from `client/`
- **GPU Drivers** — optional; without a usable OpenGL surface the scene falls back to Qt software raster and says so

See [client/README.md](../client/README.md). The Electron overlay remains in `desktop/`.

---

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ComputerPets
```

### 2. Install Backend Prerequisites

Ensure you have **Java 21** and **Maven 3.9+** installed and available in your system `PATH`.

Verify your installation:

```bash
java -version
mvn -v
```

### 3. Configure Required Environment Variables

The backend requires four secrets to start. These must be set as environment variables.

| Variable                | Length     | Purpose                                      |
|-------------------------|------------|----------------------------------------------|
| `LICENSE_SECRET_KEY`    | 32 bytes   | Master AES-256-GCM key for encrypting licenses |
| `JWT_SECRET_KEY`        | 48+ bytes  | Signing key for short-lived JWT tokens       |
| `BUNDLE_SIGNING_KEY`    | 48+ bytes  | HMAC key for signing temporary download URLs |
| `ADMIN_API_KEY`         | 32+ bytes  | Pre-shared key for `/api/admin/*` and the house `/admin` ledger (`X-Admin-Key`) |

#### Generate Secrets (PowerShell - Windows)

```powershell
$env:LICENSE_SECRET_KEY   = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
$env:JWT_SECRET_KEY       = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
$env:BUNDLE_SIGNING_KEY   = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
$env:ADMIN_API_KEY        = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

Write-Host "Copy these values to your environment:"
Write-Host "LICENSE_SECRET_KEY=$env:LICENSE_SECRET_KEY"
Write-Host "JWT_SECRET_KEY=$env:JWT_SECRET_KEY"
Write-Host "BUNDLE_SIGNING_KEY=$env:BUNDLE_SIGNING_KEY"
Write-Host "ADMIN_API_KEY=$env:ADMIN_API_KEY"
```

#### Generate Secrets (macOS / Linux)

```bash
export LICENSE_SECRET_KEY=$(openssl rand -base64 32)
export JWT_SECRET_KEY=$(openssl rand -base64 48)
export BUNDLE_SIGNING_KEY=$(openssl rand -base64 48)
export ADMIN_API_KEY=$(openssl rand -base64 32)
```

**Important**: The application will refuse to start if these variables are missing or contain obvious placeholder values.

### 4. (Optional) Enable Microsoft Development Mode

For local testing without real Microsoft authentication:

```powershell
$env:MICROSOFT_DEV_MODE = "true"
```

Never set this with `SPRING_PROFILES_ACTIVE=prod`. `ProductionProfileGuard` refuses to start.

Microsoft Store verify uses Collections v9 `publisherQuery`; prod still refuses dev-mode; the live Store ID is still a publish-time config, not invented here.

---

### 5. Spring profiles

| Profile | Activate | Database | Redis | `microsoft.dev-mode` | `show-sql` / H2 console |
|---------|----------|----------|-------|----------------------|-------------------------|
| *(none)* | `mvn spring-boot:run`, tests | H2 in `application.yml` | Redis default; tests overlay `memory` | env, default false | on |
| `dev` | `SPRING_PROFILES_ACTIVE=dev` (docker-compose) | H2 unless `SPRING_DATASOURCE_*` is set (compose sets Postgres) | Redis default; `RATE_LIMIT_BACKEND=memory` allowed | env, default false | on |
| `staging` | `SPRING_PROFILES_ACTIVE=staging` | Postgres required (`SPRING_DATASOURCE_URL` / user / password) | `rate-limit.backend=redis` | false in the file (env can still override) | off |
| `prod` | `SPRING_PROFILES_ACTIVE=prod` | Postgres required | Redis required | **false**, fail-hard if env turns it on | off |

Same YAML + environment-variable style as `application.yml`. There is no second config format.

```bash
# Local, explicit dev profile (still H2 unless you set SPRING_DATASOURCE_*)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production shape — will not start without Postgres URL, Redis, and real secrets
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/computerpets
export SPRING_DATASOURCE_USERNAME=computerpets
export SPRING_DATASOURCE_PASSWORD=...
```

`prod` also rejects `RATE_LIMIT_BACKEND=memory` and `jdbc:h2:` URLs even if you set them in the environment.

---

## Running the Project

### Starting the Spring Boot Backend

You can run the backend in several ways:

**Using Maven (Recommended for Development)**

```bash
mvn spring-boot:run
```

**Using the Windows Build Script**

```powershell
.\build.ps1
java -jar target\*-SNAPSHOT.jar
```

**Build a Standalone JAR First**

```bash
mvn clean package -DskipTests
java -jar target\enterprise-pet-backend-1.0.0-SNAPSHOT.jar
```

The backend will start on **http://localhost:8080** by default.

The living desk ledger is `/admin` (not in the house nav). Point it at this origin and paste `ADMIN_API_KEY` — the page sends `X-Admin-Key` on every lookup and revoke.

Rate limits are Redis-backed (10/min on `/api/verify/`, 30/min on `/api/download/`, per client IP). The same Redis holds the jti deny-list: revoke writes `revokedAt` in Postgres first, then `revoked:jti:{jti}` so every replica rejects immediately. `docker compose up` starts Redis and points the app at it (`REDIS_HOST=redis`). A local Maven run expects Redis on `localhost:6379`. If Redis is down, verify/download return **503** with `Retry-After` and `application/problem+json` — the rate limit is not lifted. `LicenseService.validate` itself falls back to the Postgres ledger (it will not accept a revoked license). For a single-process local run without Redis:

```bash
export RATE_LIMIT_BACKEND=memory
```

Do not use `memory` when more than one app instance is serving traffic; buckets would not be shared.

### Distributed tracing (optional)

Verify, download, and outbound Steam / Itch / Epic / Microsoft / NFT calls emit Micrometer observations (spans + timers). Export is **off** until a collector URL is set. Prometheus at `/actuator/prometheus` is unchanged.

```bash
# Jaeger all-in-one (OTLP/HTTP on 4318, UI on 16686)
docker run --rm -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one:latest

export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
# then start the backend as usual
```

`OTEL_EXPORTER_OTLP_ENDPOINT` is the OpenTelemetry base URL; the app appends `/v1/traces`. After a `POST /api/verify/{provider}` you should see `http.server.requests`, `enterprisepet.verify`, and a client/`eth_call` child span in the collector.

Business metrics (same observations):

| Meter | Tags | Use |
|-------|------|-----|
| `enterprisepet.verify` | `provider`, `outcome` (`success` / `denied` / `error`) | Latency per provider; success rate = `success` / all |
| `enterprisepet.download` | `pet` | Download latency |
| `enterprisepet.provider.call` | `provider`, `operation` | NFT `eth_call` latency |

### Verifying the Backend

Once the server is running, test it with:

```bash
curl http://localhost:8080/api/verify/providers
```

You should receive a JSON response listing the available ownership providers.

### Running the PyQt blotter client

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8080
export LICENSE_SECRET_KEY=   # same value as the backend process
python -m computerpets_client
```

Unlock is fail-closed against [CLIENT-CONTRACT.md](CLIENT-CONTRACT.md). Details: [client/README.md](../client/README.md).

The Electron overlay is still `cd desktop && npm start`.

---

## Environment Variables Reference

| Variable                  | Required | Default | Description |
|---------------------------|----------|---------|-------------|
| `LICENSE_SECRET_KEY`      | Yes      | —       | AES-256 master encryption key (base64) |
| `JWT_SECRET_KEY`          | Yes      | —       | JWT signing key (base64) |
| `BUNDLE_SIGNING_KEY`      | Yes      | —       | CDN URL signing key (base64) |
| `ADMIN_API_KEY`           | Yes      | —       | Admin API + `/admin` ledger (`X-Admin-Key` header) |
| `MICROSOFT_DEV_MODE`      | No       | false   | Bypasses real Microsoft verification (development only) |
| `ITCH_API_KEY`            | No       | placeholder | itch.io developer API key for download-key receipt verify |
| `ITCH_GAME_ID`            | No       | empty   | Optional official itch.io game id allowlist (do not invent one) |
| `EPIC_CLIENT_ID`          | No       | placeholder | EOS Trusted Server client id (Developer Portal) |
| `EPIC_CLIENT_SECRET`      | No       | placeholder | EOS Trusted Server client secret |
| `EPIC_DEPLOYMENT_ID`      | No       | placeholder | Deployment id required by the Ecommerce APIs |
| `EPIC_SANDBOX_ID`         | No       | empty   | Optional official Epic sandbox allowlist (do not invent one) |
| `EPIC_CATALOG_ITEM_ID`    | No       | empty   | Optional official catalog item allowlist (do not invent one) |
| `BUNDLE_BASE_URL`         | No       | CDN placeholder | Base URL used when generating signed download links |
| `REDIS_HOST`              | No       | localhost | Redis hostname for shared verify/download rate limits and the jti deny-list |
| `REDIS_PORT`              | No       | 6379 | Redis port |
| `REDIS_TIMEOUT`           | No       | 200ms | Lettuce command/connect timeout for the rate-limit store |
| `RATE_LIMIT_BACKEND`      | No       | redis | `redis` (default, shared) or `memory` (tests / single local process only) |
| `RATE_LIMIT_FAIL_CLOSED_RETRY_AFTER` | No | 5 | `Retry-After` seconds when Redis is down (HTTP 503) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | empty | OTLP/HTTP collector **base** URL (e.g. `http://localhost:4318`). Empty = no export; the app starts without a collector. |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | No | empty | Full traces URL if you already have `/v1/traces`. Overrides the base URL when set. |
| `TRACING_SAMPLING_PROBABILITY` | No | 1.0 | Micrometer sampling rate (`0.0`–`1.0`). |
| `SPRING_PROFILES_ACTIVE` | No | *(none)* | `dev` / `staging` / `prod`. `prod` is the fail-hard production shape. |
| `SPRING_DATASOURCE_URL` | `staging` / `prod` | H2 in default/`dev` | Postgres JDBC URL. Required when those profiles are active. |
| `SPRING_DATASOURCE_USERNAME` | `staging` / `prod` | `sa` (H2) | Postgres user. |
| `SPRING_DATASOURCE_PASSWORD` | `staging` / `prod` | empty (H2) | Postgres password. |

---

## Kubernetes

Manifests live in `deploy/k8s/` (Kustomize, not Helm). They run the same
stack as compose: app + Postgres 16 + Redis 7, with
`SPRING_PROFILES_ACTIVE=prod` and the existing Actuator probes.

```bash
# 1. Put real keys in deploy/k8s/secret.yaml (see table above)
# 2. Apply
kubectl apply -k deploy/k8s
```

Required Secret keys: `LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`,
`BUNDLE_SIGNING_KEY`, `ADMIN_API_KEY`, plus Postgres username/password.
Redis has no password setting in the app — only `REDIS_HOST` /
`REDIS_PORT` on the ConfigMap.

Blue/green is two Deployments (`computerpets-blue` live,
`computerpets-green` at 0 replicas) and a Service selector
`color=blue`. Flip the selector after green is Ready. Full commands
are in [deploy/k8s/README.md](../deploy/k8s/README.md).

Optional `ingress.yaml` is not in the kustomization; apply it only if
you have an Ingress controller.

---

## Provider Configuration

You can enable or disable individual ownership verification providers using the following configuration:

```yaml
ownership:
  providers:
    steam:
      enabled: true
    microsoft:
      enabled: true
    nft:
      enabled: true
    itch:
      enabled: true
    epic:
      enabled: true
```

By default, all providers are enabled.

This is useful when:
- You want to temporarily disable a provider during development
- You are not yet ready to provide real credentials for a specific platform (e.g., Steam API key)
- You want to run the application without certain external dependencies

Example – running with only the NFT provider enabled:

```yaml
ownership:
  providers:
    steam:
      enabled: false
    microsoft:
      enabled: false
    nft:
      enabled: true
    itch:
      enabled: false
    epic:
      enabled: false
```

### Itch.io

Itch verify calls the official download-key receipt API
(`GET https://api.itch.io/games/{gameId}/download_keys`) with a developer
API key. A placeholder or blank `ITCH_API_KEY` fails closed (ownership
denied), the same way a missing Steam Web API key does. Do not invent a
live ComputerPets game id — leave `ITCH_GAME_ID` empty until a page exists.

| Variable        | Purpose                                              |
|-----------------|------------------------------------------------------|
| `ITCH_API_KEY`  | Developer API key from https://itch.io/user/settings/api-keys |
| `ITCH_GAME_ID`  | Optional numeric game id; when set, `gameId` must match |

```yaml
itch:
  api-key: ${ITCH_API_KEY}
  api-base-url: https://api.itch.io
  game-id: ${ITCH_GAME_ID:}
```

`POST /api/verify/itch` expects `gameId` and `downloadKey` (the receipt
from the buyer's download URL).

### Epic Games Store

Epic verify uses the documented EOS Auth + Ecom Web APIs:

1. `POST https://api.epicgames.dev/epic/oauth/v2/token` with
   `grant_type=client_credentials` and HTTP Basic `clientId:clientSecret`.
   Ecommerce calls require `deployment_id`.
2. `GET https://api.epicgames.dev/epic/ecom/v3/platforms/{platform}/identities/{accountId}/ownership?nsCatalogItemId={sandboxId:catalogItemId}`
   with the client-credentials access token.

A placeholder or blank `EPIC_CLIENT_ID` / `EPIC_CLIENT_SECRET` /
`EPIC_DEPLOYMENT_ID` fails closed (ownership denied), the same way a
missing Steam Web API key does. Live values come from the Epic Developer
Portal: create a **Trusted Server** client, enable the **Ecom** feature
on its client policy, and use that client's credentials. There is no
public "always owns" path and no invented ComputerPets sandbox — leave
`EPIC_SANDBOX_ID` / `EPIC_CATALOG_ITEM_ID` empty until a store page exists.

| Variable               | Purpose                                                         |
|------------------------|-----------------------------------------------------------------|
| `EPIC_CLIENT_ID`       | Trusted Server client id from the Developer Portal              |
| `EPIC_CLIENT_SECRET`   | Trusted Server client secret                                    |
| `EPIC_DEPLOYMENT_ID`   | Deployment id (required by the Ecommerce APIs)                  |
| `EPIC_SANDBOX_ID`      | Optional sandbox allowlist; when set, `sandboxId` must match    |
| `EPIC_CATALOG_ITEM_ID` | Optional catalog-item allowlist; when set, `catalogItemId` must match |

```yaml
epic:
  client-id: ${EPIC_CLIENT_ID}
  client-secret: ${EPIC_CLIENT_SECRET}
  deployment-id: ${EPIC_DEPLOYMENT_ID}
  api-base-url: https://api.epicgames.dev
  sandbox-id: ${EPIC_SANDBOX_ID:}
  catalog-item-id: ${EPIC_CATALOG_ITEM_ID:}
```

`POST /api/verify/epic` expects `accountId` (32-char Epic Account ID),
`sandboxId`, and `catalogItemId`. `platform` defaults to `EPIC`.

See [Auth Web APIs](https://dev.epicgames.com/docs/web-api-ref/authentication)
and [Ecom Web APIs](https://dev.epicgames.com/docs/web-api-ref/ecom-web-apis).

### Ethereum / NFT

NFT verify is allowlisted by default. Until `ethereum.collections` lists a live
contract, `POST /api/verify/nft` returns 403 (`no official NFT collections configured`).
See [NFT.md](NFT.md) for the full contract.

| Variable            | Purpose                                      |
|---------------------|----------------------------------------------|
| `ETHEREUM_RPC_URL`  | JSON-RPC endpoint (Alchemy, Infura, a node)  |

```yaml
ethereum:
  rpc-url: ${ETHEREUM_RPC_URL}
  allowlist-required: true
  require-signature: false
  collections:
    - address: "0xYourOfficialComputerPetsContract"
      standard: ERC721
      name: "ComputerPets Genesis"
      tokens:
        1: red_panda
        2: dragon
```

`GET /api/verify/nft/collections` exposes the public allowlist.

---

## Troubleshooting

### Java Version Errors
**Problem**: `UnsupportedClassVersionError` or similar  
**Solution**: Install Java 21 and ensure `JAVA_HOME` points to it.

### Application Fails to Start
**Problem**: Errors about missing `JWT_SECRET_KEY` or `BUNDLE_SIGNING_KEY`  
**Solution**: Set the four required environment variables (`LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`, `ADMIN_API_KEY`) before running the application.

### Using the Default License Key
**Problem**: Application refuses to start with message about the committed default key  
**Solution**: You **must** generate and provide your own random 32-byte key via the `LICENSE_SECRET_KEY` environment variable. The previously committed default key is no longer accepted outside of automated tests.

### Rate limiter returns 503
**Problem**: `/api/verify/**` or `/api/download/**` returns 503 with `Rate limiter unavailable`  
**Solution**: Redis is the default store and the filter fail-closes when it cannot be reached. Start Redis (`docker compose up redis` or a local `redis-server`) and set `REDIS_HOST` / `REDIS_PORT`, or set `RATE_LIMIT_BACKEND=memory` for a single local process.

### Port Already in Use
**Problem**: Port 8080 is occupied  
**Solution**: Start the application with a different port:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### Maven Cannot Find Java
**Problem**: `mvn` uses the wrong Java version  
**Solution**: Set `JAVA_HOME` correctly and restart your terminal.

---

## Next Steps

- Read the [Architecture Documentation](ARCHITECTURE.md) for a deep understanding of the system design.
- The Electron overlay in `desktop/` implements the first [Client contract](CLIENT-CONTRACT.md) slice (Steam verify, license decrypt, hwid, signed download). See `desktop/README.md`.
- Explore the API examples in the main [README.md](../README.md).
- Review the [Contributing Guidelines](CONTRIBUTING.md) if you plan to contribute.

If you run into issues not covered here, feel free to open an issue on the project repository.