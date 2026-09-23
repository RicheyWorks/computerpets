# Setup & Installation Guide

This guide provides step-by-step instructions for setting up and running the **ComputerPets** project locally.

To sit with the house first, start at the root [README](../README.md). This page is the Java backend.

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
| **Redis**         | 7.x                          | Shared rate-limit store, jti deny-list, and one-time download grants. `docker compose` starts it. Local `mvn spring-boot:run` needs Redis on `localhost:6379` or `RATE_LIMIT_BACKEND=memory`. |
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
git clone https://github.com/RicheyWorks/computerpets
cd computerpets
```

### 2. Install Backend Prerequisites

Ensure you have **Java 21** and **Maven 3.9+** installed and available in your system `PATH`.

Verify your installation:

```bash
java -version
mvn -v
```

### 3. Configure Required Environment Variables

The backend requires four secrets to start. Local-dev may set them as
environment variables or in a `.env` file (see `.env.example`). Production
should prefer file mounts or External Secrets — [Secret management](#secret-management)
and [ADR 0056](adr/0056-house-secrets-from-file-mounts.md).

| Variable                | Length     | Purpose                                      |
|-------------------------|------------|----------------------------------------------|
| `LICENSE_SECRET_KEY`    | 32 bytes   | Master AES-256-GCM key for encrypting licenses. Also the HMAC key for `POST /api/verify` machine signatures ([ADR 0070](adr/0070-machine-request-signature.md)). |
| `JWT_SECRET_KEY`        | 48+ bytes  | Signing key for short-lived JWT tokens       |
| `BUNDLE_SIGNING_KEY`    | 48+ bytes  | HMAC key for signing temporary download URLs |
| `ADMIN_API_KEY`         | 32+ bytes  | HMAC key for `/api/admin/**` and the house `/admin` ledger (not a header; [ADR 0071](adr/0071-admin-request-signature.md)) |

Each of those names also accepts a `NAME_FILE` path (Docker secrets,
Kubernetes projected volumes, Vault agent templates). A non-blank env
value wins; a set but missing file path refuses to start.

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

**Important**: The application will refuse to start if these variables are missing or contain obvious placeholder values. It will not invent a production secret. Secret values are never logged.

### Secret management

Phase 2.4 / ADR 0064 — three operator shapes, one deny-safe contract ([ADR 0056](adr/0056-house-secrets-from-file-mounts.md), [ADR 0064](adr/0064-secret-operator-prod-refuses-plain-env.md)):

| Shape | How | When |
|-------|-----|------|
| **Local-dev** | Env vars or `.env` from `.env.example` | `mvn spring-boot:run`, plain `docker compose up` |
| **Docker secrets** | Files under `./secrets/` + `docker-compose.secrets.yml` sets `NAME_FILE=/run/secrets/…` | Compose bring-up without putting keys in `environment:` |
| **Kubernetes (prod)** | External Secrets Operator (`deploy/k8s/external-secret.example.yaml`) or file mounts (`deployment-secrets-file.example.yaml`) + `COMPUTERPETS_SECRETS_SOURCE=external-secrets\|file\|vault-agent` | Cluster / prod — plain hand-filled `secret.yaml` is refused |

**Prod attestation:** `ProductionProfileGuard` refuses to start on `prod` unless `COMPUTERPETS_SECRETS_SOURCE` is set (or local-only `COMPUTERPETS_ALLOW_PLAIN_SECRET=1`). When source is `file`, the four critical `*_FILE` paths are required. Deploy gate: `./deploy/k8s/verify-secret-operator.sh`.

**Precedence:** non-blank `NAME` wins over `NAME_FILE`. If `NAME_FILE` is set and the path is missing or unreadable, the process **refuses to start**. Optional storefront keys (`STEAM_API_KEY`, `ITCH_API_KEY`, `EPIC_*`, `ETHEREUM_RPC_URL`) may use the same `*_FILE` pattern; blank or placeholder still **fails closed** at verify (no invented entitlement). `REDIS_PASSWORD_FILE` uses that same loader. It is required on `prod` only when Redis AUTH is on and `COMPUTERPETS_SECRETS_SOURCE=file` ([ADR 0075](adr/0075-redis-auth-and-transit-tls.md)).

```bash
# Docker secrets overlay (files gitignored — see secrets/README.md)
mkdir -p secrets
openssl rand -base64 32 > secrets/license_secret_key
openssl rand -base64 48 > secrets/jwt_secret_key
openssl rand -base64 48 > secrets/bundle_signing_key
openssl rand -base64 32 > secrets/admin_api_key
docker compose -f docker-compose.yml -f docker-compose.secrets.yml up --build
```

Keeper-local mind plugin keys (`mind.json` seal on the overlay, desk bridge) are not house production secrets — they stay on the keeper machine.

### Secret rotation (ADR 0065)

Injection and fail-closed prod attestation are done ([ADR 0056](adr/0056-house-secrets-from-file-mounts.md), [ADR 0064](adr/0064-secret-operator-prod-refuses-plain-env.md)). Scheduled rotation is the remaining §10 #13 contract:

| Key | Suggested cadence | Dual-key env | Minimum dual-key window |
|-----|-------------------|--------------|-------------------------|
| `JWT_SECRET_KEY` | ~90 days | `JWT_SECRET_KEY_PREVIOUS` | ≥ JWT TTL (30m) + skew |
| `BUNDLE_SIGNING_KEY` | ~90 days | `BUNDLE_SIGNING_KEY_PREVIOUS` | ≥ 15m download TTL + skew |
| `ADMIN_API_KEY` | ~90 days | `ADMIN_API_KEY_PREVIOUS` | Operator cutover (HMAC verify, [ADR 0071](adr/0071-admin-request-signature.md)) |
| `LICENSE_SECRET_KEY` | ~180 days | `LICENSE_SECRET_KEY_PREVIOUS` | Until old sealed licenses expire or keepers re-verify (up to ~365d) |

**Roll without downtime**

1. Copy the retiring value into `NAME_PREVIOUS` (or `NAME_PREVIOUS_FILE` / External Secrets sibling key).
2. Publish the new value as `NAME`.
3. Set optional `COMPUTERPETS_KEYS_ROTATED_AT` to an ISO-8601 instant (e.g. `2026-09-22T12:00:00Z`). On `prod`, a set stamp older than 400 days refuses start.
4. Rolling restart. Issue / sign / encrypt use **current only**. Verify / decrypt / admin accept **current, then previous**.
5. After the window, unset `*_PREVIOUS`. Equal previous==current, placeholder previous, or blank current all refuse start.

**HSM / KMS pointer** — Prefer AWS KMS CMK / CloudHSM / Vault Transit to generate and wrap material into the existing Secrets Manager shells (`deploy/terraform/modules/secrets`) or file mounts. The app still consumes key bytes after unwrap; this repo does not host a live HSM. Deploy gate: `./deploy/k8s/verify-secret-rotation.sh`.

Clients that decrypt locally should also hold `LICENSE_SECRET_KEY_PREVIOUS` during the AES window. Opaque download ciphertext still works when only the backend keeps previous.

### 4. (Optional) Enable Microsoft Development Mode

For local testing without real Microsoft authentication:

```powershell
$env:MICROSOFT_DEV_MODE = "true"
```

Never set this with `SPRING_PROFILES_ACTIVE=prod`. `ProductionProfileGuard` refuses to start.

Microsoft Store verify uses Collections v9 `publisherQuery`; prod still refuses
dev-mode. The house door is `MICROSOFT_PRODUCT_ID` — empty fails closed. Do not
invent a live Store id.

---

### 5. Spring profiles

| Profile | Activate | Database | Redis | `microsoft.dev-mode` | `show-sql` / H2 console |
|---------|----------|----------|-------|----------------------|-------------------------|
| *(none)* | `mvn spring-boot:run`, tests | H2 in `application.yml` | Redis default; tests overlay `memory` | env, default false | on |
| `dev` | `SPRING_PROFILES_ACTIVE=dev` (docker-compose) | H2 unless `SPRING_DATASOURCE_*` is set (compose sets Postgres) | Redis default; `RATE_LIMIT_BACKEND=memory` allowed | env, default false | on |
| `staging` | `SPRING_PROFILES_ACTIVE=staging` | Postgres required (`SPRING_DATASOURCE_URL` / user / password) | `rate-limit.backend=redis` | false in the file (env can still override) | off |
| `prod` | `SPRING_PROFILES_ACTIVE=prod` | Postgres required. TLS is all-or-nothing: unset for in-cluster cleartext, or `POSTGRES_SSL_REQUIRED=true` with `sslmode=require` / `verify-full` ([ADR 0076](adr/0076-postgres-transit-tls.md)) | Redis required | **false**, fail-hard if env turns it on | off |

Same YAML + environment-variable style as `application.yml`. There is no second config format.

```bash
# Local, explicit dev profile (still H2 unless you set SPRING_DATASOURCE_*)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production shape — will not start without Postgres URL, Redis, and real secrets.
# Local Postgres has no TLS: leave POSTGRES_SSL_REQUIRED unset.
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/computerpets
export SPRING_DATASOURCE_USERNAME=computerpets
export SPRING_DATASOURCE_PASSWORD=...
```

`prod` also rejects `RATE_LIMIT_BACKEND=memory` and `jdbc:h2:` URLs even if you set them in the environment.
Managed RDS is different: set `POSTGRES_SSL_REQUIRED=true` and use the terraform JDBC URL (`sslmode=require`, or `sslmode=verify-full` when `POSTGRES_SSL_ROOT_CERT` names a PEM you mounted). A half-set pair refuses to start ([ADR 0076](adr/0076-postgres-transit-tls.md)).

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

The backend will start on **http://localhost:8081** by default. The desk keeps 8080. They do not share a door.

The living desk ledger is `/admin` (not in the house nav). Point it at this origin and paste `ADMIN_API_KEY`. The page keeps the key in the tab and signs every lookup and revoke. It does not send the key.

Operator curl uses the same MAC. Canonical UTF-8 text is `computerpets-admin-v1`, the uppercase method, the path, the raw query or an empty line, the unix timestamp, a single-use nonce (16–128 of `[A-Za-z0-9_-]`), and the lowercase hex SHA-256 of the raw body. Signature is HMAC-SHA256 with `ADMIN_API_KEY` (UTF-8), Base64 URL, no padding. Headers are `X-ComputerPets-Timestamp`, `X-ComputerPets-Nonce`, and `X-ComputerPets-Signature`. A static `X-Admin-Key` is refused (**401** `application/problem+json`). Replaying the same nonce inside 300 seconds is **401**. Skew is 300 seconds. `ADMIN_API_KEY_PREVIOUS` still verifies during rotation.

```bash
TS=$(date +%s)
NONCE=$(python3 -c 'import secrets; print(secrets.token_urlsafe(16))')
BODY='{"jti":"YOUR-JTI"}'
SIG=$(TS="$TS" NONCE="$NONCE" BODY="$BODY" python3 -c '
import hashlib, hmac, os, base64
key = os.environ["ADMIN_API_KEY"].encode()
body = os.environ["BODY"].encode()
ts = os.environ["TS"]
nonce = os.environ["NONCE"]
digest = hashlib.sha256(body).hexdigest()
msg = "\n".join(["computerpets-admin-v1", "POST", "/api/admin/revoke", "", ts, nonce, digest]).encode()
print(base64.urlsafe_b64encode(hmac.new(key, msg, hashlib.sha256).digest()).decode().rstrip("="))
')
curl -sS -X POST "http://localhost:8081/api/admin/revoke" \
  -H "Content-Type: application/json" \
  -H "X-ComputerPets-Timestamp: $TS" \
  -H "X-ComputerPets-Nonce: $NONCE" \
  -H "X-ComputerPets-Signature: $SIG" \
  --data-binary "$BODY"
```

A list with no query signs an empty body and an empty query line (`GET`, path `/api/admin/licenses`). The nonce line is still required. When `owner` is set, the query line is the raw query (`owner=` plus the encoding you actually send), not a decoded value.

Rate limits are Redis-backed (10/min on `/api/verify/`, 30/min on `/api/download/`, 60/min on `/api/pets` discovery — list/detail share one bucket — and 60/min on `GET /api/bundles/{petKey}` catalog reads, per client IP; [ADR 0068](adr/0068-discovery-rate-limit.md), [ADR 0069](adr/0069-bundle-catalog-rate-limit.md)). Signed `GET /api/bundles/{pet}/redeem` is not on the catalog bucket. The same Redis holds the jti deny-list: revoke soft-deletes in Postgres (`revokedAt` + `deletedAt`; ADR 0058) first, then writes `revoked:jti:{jti}` so every replica rejects immediately. Append-only `license_audit_events` records ISSUED / REVOKED / DOWNLOAD without secret values. It also holds one-time download grants (`download:grant:{jti}:{exp}`) issued by `POST /api/download` and redeemed at `GET /api/bundles/{pet}/redeem` (ADR 0055), and single-use admin/machine nonces (`replay:nonce:{admin|machine}:{nonce}`, 300 seconds, ADR 0072). A down nonce store returns **503** on those signed doors. It also holds single-use download JWTs (`download:jwt:{jti}`, TTL `jwt.ttl-minutes` plus 60 seconds, ADR 0073). A second mint is **409**. A down token store returns **503** and no URL. `docker compose up` starts Redis and points the app at it (`REDIS_HOST=redis`). A local Maven run expects Redis on `localhost:6379`. If Redis is down, verify/download/pets/bundle-catalog reads return **503** with `Retry-After` and `application/problem+json` — the rate limit is not lifted. Download issue and redeem also fail closed when the grant store is down. `LicenseService.validate` itself falls back to the Postgres ledger (it will not accept a revoked or soft-deleted license). For a single-process local run without Redis:

```bash
export RATE_LIMIT_BACKEND=memory
```

Do not use `memory` when more than one app instance is serving traffic; buckets would not be shared.

Client IP for rate limits and download-grant binding is fail-closed on forwarded headers ([ADR 0067](adr/0067-trusted-proxy-client-address.md)). Empty `TRUSTED_PROXY_CIDRS` (default outside the `dev` profile) always uses servlet `remoteAddr`. The `dev` profile defaults to loopback (`127.0.0.1/32,::1/128`) so a laptop can still honour `X-Forwarded-For` from local tooling. Behind an ALB / ingress / CDN edge, set the peer CIDRs explicitly:

```bash
export TRUSTED_PROXY_CIDRS=10.0.0.0/8,172.16.0.0/12
```

### Distributed tracing (optional)

Verify, download, and outbound Steam / Itch / Epic / Microsoft / NFT calls emit Micrometer observations (spans + timers). Export is **off** until a collector URL is set. Prometheus at `/actuator/prometheus` is unchanged.

```bash
# Jaeger all-in-one (OTLP/HTTP on 4318, UI on 16686)
docker run --rm -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one:latest

export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
# then start the backend as usual
```

`OTEL_EXPORTER_OTLP_ENDPOINT` is the OpenTelemetry base URL; the app appends `/v1/traces`. After a `POST /api/verify/{provider}` you should see `http.server.requests`, `enterprisepet.verify`, `enterprisepet.license.issue` (on a successful grant), and a client/`eth_call` child span in the collector.

Business metrics (same observations):

| Meter | Tags | Use |
|-------|------|-----|
| `enterprisepet.verify` | `provider`, `outcome` (`success` / `denied` / `error`) | Latency per provider; success rate = `success` / all |
| `enterprisepet.license.issue` | `provider`, `pet`, `outcome` (`success` / `error`) | Issuance rate after a verified grant; encrypt + persist latency ([ADR 0057](adr/0057-license-issuance-observation.md)) |
| `enterprisepet.download` | `pet` | Download latency |
| `enterprisepet.provider.call` | `provider`, `operation` | NFT `eth_call` latency |

### Verifying the Backend

Once the server is running, test it with:

```bash
curl http://localhost:8081/api/verify/providers
```

You should receive a JSON response listing the available ownership providers.

### Running the PyQt blotter client

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8081
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
| `ADMIN_API_KEY`           | Yes      | —       | Admin HMAC key for `/api/admin/**` and the `/admin` ledger (ADR 0071) |
| `MICROSOFT_DEV_MODE`      | No       | false   | Bypasses real Microsoft verification (development only). House door still applies. |
| `MICROSOFT_PRODUCT_ID`    | No       | empty   | House Microsoft Store product id / comma allowlist. Empty fails closed (do not invent one) |
| `STEAM_API_KEY`           | No       | placeholder | Steam Web API key; placeholder or blank fails closed |
| `STEAM_APP_ID`            | No       | empty   | House Steam AppID / comma allowlist. Empty fails closed (do not invent one) |
| `ITCH_API_KEY`            | No       | placeholder | itch.io developer API key for download-key receipt verify |
| `ITCH_GAME_ID`            | No       | empty   | Optional official itch.io game id allowlist (do not invent one) |
| `EPIC_CLIENT_ID`          | No       | placeholder | EOS Trusted Server client id (Developer Portal) |
| `EPIC_CLIENT_SECRET`      | No       | placeholder | EOS Trusted Server client secret |
| `EPIC_DEPLOYMENT_ID`      | No       | placeholder | Deployment id required by the Ecommerce APIs |
| `EPIC_SANDBOX_ID`         | No       | empty   | Optional official Epic sandbox allowlist (do not invent one) |
| `EPIC_CATALOG_ITEM_ID`    | No       | empty   | Optional official catalog item allowlist (do not invent one) |
| `BUNDLE_BASE_URL`         | No       | CDN placeholder | Base URL used when generating signed download links |
| *(yaml)* `bundle.catalog` | No       | `[]`    | Optional artifact rows (`petKey`, `version`, `platform`, `sha256`, `path`). Empty until a zip exists; unknown keys and placeholder hashes fail startup. Do not invent sha256 values. A published zip must be `computerpets.bundle/v1` (CLIENT-CONTRACT §8 / ADR 0060). |
| `REDIS_HOST`              | No       | localhost | Redis hostname for shared verify/download rate limits, the jti deny-list, and download grants |
| `REDIS_PORT`              | No       | 6379 | Redis port |
| `REDIS_TIMEOUT`           | No       | 200ms | Lettuce command/connect timeout for the rate-limit store |
| `REDIS_PASSWORD`          | No       | empty | Redis AUTH token. Unset for compose and in-cluster Redis. Also `REDIS_PASSWORD_FILE` (ADR 0075) |
| `REDIS_SSL`               | No       | false | Transit TLS on the same Lettuce client (`rediss`, peer verified). Default false |
| `REDIS_AUTH_REQUIRED`     | No       | false | When true, a blank password or `REDIS_SSL=false` refuses to start. On `prod`, password, SSL, and this flag are all-or-nothing |
| `RATE_LIMIT_BACKEND`      | No       | redis | `redis` (default, shared) or `memory` (tests / single local process only) |
| `RATE_LIMIT_FAIL_CLOSED_RETRY_AFTER` | No | 5 | `Retry-After` seconds when Redis is down (HTTP 503) |
| `TRUSTED_PROXY_CIDRS`     | No       | empty; `dev` → loopback | Comma/whitespace CIDRs allowed to present `X-Forwarded-For` / `Forwarded`. Empty = always `remoteAddr` (ADR 0067). |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | empty | OTLP/HTTP collector **base** URL (e.g. `http://localhost:4318`). Empty = no export; the app starts without a collector. |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | No | empty | Full traces URL if you already have `/v1/traces`. Overrides the base URL when set. |
| `TRACING_SAMPLING_PROBABILITY` | No | 1.0 | Micrometer sampling rate (`0.0`–`1.0`). |
| `SPRING_PROFILES_ACTIVE` | No | *(none)* | `dev` / `staging` / `prod`. `prod` is the fail-hard production shape. |
| `SPRING_DATASOURCE_URL` | `staging` / `prod` | H2 in default/`dev` | Postgres JDBC URL. Required when those profiles are active. Managed RDS includes `sslmode=require` (or `verify-full`). Local and in-cluster omit it (ADR 0076). |
| `POSTGRES_SSL_REQUIRED` | No | false | When true on `prod`, the JDBC URL must use `sslmode=require`, or `verify-full` if `POSTGRES_SSL_ROOT_CERT` is set. Leave unset for compose and in-cluster Postgres. Half-set refuses start (ADR 0076). |
| `POSTGRES_SSL_ROOT_CERT` | No | empty | Absolute path to a PEM CA bundle on the app host. Empty keeps `sslmode=require`. Set only when the URL uses `sslmode=verify-full` and `sslrootcert` is that same path. This repo does not ship a bundle. |
| `API_LISTENER_TLS_REQUIRED` | No | false | When true on `prod`, `API_PUBLIC_BASE_URL` must be an `https` origin on port 443. Leave unset for compose and the in-cluster Service. A JVM keystore is refused either way (ADR 0077). |
| `API_PUBLIC_BASE_URL` | No | empty | Public origin, `https://<host>`. Set only with `API_LISTENER_TLS_REQUIRED`. Do not invent a live hostname. |
| `SPRING_DATASOURCE_USERNAME` | `staging` / `prod` | `sa` (H2) | Postgres user. |
| `SPRING_DATASOURCE_PASSWORD` | `staging` / `prod` | empty (H2) | Postgres password. |
| `SPRING_DATASOURCE_REPLICA_URL` | No | empty | Optional Postgres **read** replica JDBC URL. Blank = primary only. Must differ from the primary URL. Do not invent a cloud replica. Writes never route here (ADR 0059). |
| `SPRING_DATASOURCE_REPLICA_USERNAME` | No | inherits primary | Optional replica user. |
| `SPRING_DATASOURCE_REPLICA_PASSWORD` | No | inherits primary | Optional replica password. |
| `HIKARI_MAXIMUM_POOL_SIZE` | No | 10 | Primary Hikari pool size. |
| `HIKARI_MINIMUM_IDLE` | No | 2 | Primary Hikari minimum idle connections. |
| `HIKARI_CONNECTION_TIMEOUT` | No | 3000 (ms) | Hikari wait for a free connection before failing. |
| `HIKARI_VALIDATION_TIMEOUT` | No | 1000 (ms) | Hikari connection validation timeout. |
| `HIKARI_IDLE_TIMEOUT` | No | 600000 (ms) | Idle connection eviction. |
| `HIKARI_MAX_LIFETIME` | No | 1800000 (ms) | Max connection lifetime. |
| `HIKARI_LEAK_DETECTION_THRESHOLD` | No | 0; `60000` in staging/prod | Log borrowed-connection leaks after this many ms. |
| `HIKARI_REPLICA_MAXIMUM_POOL_SIZE` | No | 10 | Replica pool size when `SPRING_DATASOURCE_REPLICA_URL` is set. |
| `HIKARI_REPLICA_MINIMUM_IDLE` | No | 2 | Replica minimum idle when a replica URL is set. |

---

## Kubernetes

Manifests live in `deploy/k8s/` (Kustomize, not Helm). They run the same
stack as compose: app + Postgres 16 + Redis 7, with
`SPRING_PROFILES_ACTIVE=prod` and the existing Actuator probes.

```bash
# Prod path: External Secrets or *_FILE mounts + attestation (ADR 0064).
# Scaffolding secret.yaml alone will not boot under prod without
# COMPUTERPETS_ALLOW_PLAIN_SECRET=1 (local only).
./deploy/k8s/verify-secret-operator.sh
# Apply ESO (or file-mount example), set COMPUTERPETS_SECRETS_SOURCE, then:
kubectl apply -k deploy/k8s
```

Required Secret keys: `LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`,
`BUNDLE_SIGNING_KEY`, `ADMIN_API_KEY`, plus Postgres username/password.
In-cluster Redis stays AUTH-less: leave `REDIS_PASSWORD`, `REDIS_SSL`, and
`REDIS_AUTH_REQUIRED` unset. Managed ElastiCache with a token sets all three
(`REDIS_SSL=true`, `REDIS_AUTH_REQUIRED=true`, password from the Secret or
`REDIS_PASSWORD_FILE`). Generate the token with `openssl rand -hex 16`
(hex avoids the ElastiCache-forbidden `/`, `@`, `"`, and space). Do not put
the token in the ConfigMap ([ADR 0075](adr/0075-redis-auth-and-transit-tls.md)).
In-cluster Postgres stays cleartext: leave `POSTGRES_SSL_REQUIRED` unset.
Managed RDS sets that flag and uses the terraform URL (`sslmode=require`, or
`verify-full` when you mount a CA and set `POSTGRES_SSL_ROOT_CERT`). Do not
invent a CA bundle ([ADR 0076](adr/0076-postgres-transit-tls.md)).
The in-cluster Service stays HTTP on 8081. Leave `API_LISTENER_TLS_REQUIRED`
unset. A public door uses `deploy/k8s/ingress-tls.yaml` or the ALB HTTPS
listener and sets that flag with `API_PUBLIC_BASE_URL=https://<host>`. Do
not set `server.ssl` ([ADR 0077](adr/0077-api-listener-tls.md)).
Prod API replica count is `deploy/k8s/hpa.yaml` (min 3, max 6), applied
on its own after metrics-server answers `kubectl top`. It is not in the
kustomization. Local `kubectl apply -k` stays at blue 2 / green 0
([ADR 0078](adr/0078-horizontal-pod-autoscaling.md)).
Prod voluntary disruption of that live color keeps 2 pods
(`deploy/k8s/pdb.yaml`), also applied on its own, and only after that
floor is actually running. It is not in the kustomization
([ADR 0079](adr/0079-pod-disruption-budget.md)).
Both API Deployments hard-spread hostnames (`kubernetes.io/hostname`,
`maxSkew` 1, `DoNotSchedule`, `nodeTaintsPolicy: Honor`,
`nodeAffinityPolicy: Honor`). `minDomains` is unset. One hostname still
schedules. Kind and minikube with one eligible hostname still run both
local blue replicas on that node. The second pod is not left Pending by
this item. Required hostname anti-affinity is not set. Do not set
`minDomains`. That would leave the second pod Pending on one hostname.
Local replica counts stay 2 and 0
([ADR 0080](adr/0080-api-pod-topology-spread.md),
[ADR 0100](adr/0100-api-hostname-hard-spread.md)).
They also hard-spread zones (`topology.kubernetes.io/zone`, `maxSkew` 1,
`DoNotSchedule`, `nodeTaintsPolicy: Honor`, `nodeAffinityPolicy: Honor`).
`minDomains` is unset. One labeled zone still schedules. A node that
omits the zone label does not. Prod workers are one private EKS managed
node group per availability zone, at least two ([ADR 0082](adr/0082-multi-az-node-pool.md)).
This kustomization does not create them. `enable_node_pool=false` is the
local switch. No live AWS apply
([ADR 0095](adr/0095-api-zone-hard-spread.md)).
Both API Deployments also require `kubernetes.io/os: linux` and
`computerpets/node-pool: api`. Both spread items set
`nodeAffinityPolicy: Honor`. Kind and minikube apply that selector.
Their nodes omit the pool label unless you label one, and the API pods
stay Pending until then. Do not delete the pool key to make a laptop
apply schedule. One labeled node still schedules both blue pods once
it also carries one `topology.kubernetes.io/zone` value. One hostname
still schedules. A pool label
alone leaves the API Pending. Postgres and Redis are not pinned
([ADR 0093](adr/0093-api-node-pool.md)).
The API node group also taints `computerpets/node-pool=api:NoSchedule`.
Blue and green tolerate it. A toleration does not require the taint.
Kind and minikube are not tainted. Do not taint a kind or minikube node.
Labeling a node without that taint still schedules the API once that
node also carries one zone label. Postgres and
Redis do not tolerate it
([ADR 0094](adr/0094-api-pool-taint.md)).
`aws-node` and `kube-proxy` are not in this kustomization. The vpc-cni
addon `configuration_values` records the API pool toleration for
`aws-node`. On EKS, `reassert_kube_proxy_toleration=true` probes
kube-proxy and reasserts that patch, or fails closed. The flag defaults
false. Do not run that patch on kind or minikube
([ADR 0096](adr/0096-system-daemon-api-pool-toleration.md),
[ADR 0097](adr/0097-kube-proxy-toleration-hook.md)).
Cluster Autoscaler grows those groups when pods are Pending. Each zone's
max is 20. The HPA ceiling is 6, so six healthy hostnames hold it at one pod each
([ADR 0107](adr/0107-api-hostname-ceiling.md)). Terraform ignores `desired_size`
after create. `deploy/k8s/cluster-autoscaler.yaml` is not in this
kustomization. Substitute `CLUSTER_NAME`, `AWS_REGION`, and the role ARN
before applying it. `enable_node_pool=false` keeps the role off
([ADR 0083](adr/0083-cluster-autoscaler.md)).
The Deployment is two replicas. Hostname anti-affinity is required.
Zone spread is `DoNotSchedule` on `topology.kubernetes.io/zone`
(`maxSkew` 1, Honor policies, `minDomains` unset). One labeled zone
still schedules when two hostnames exist. A node that omits the zone
label does not. Kind and minikube do not apply the file. Do not set
minDomains. Required zone anti-affinity is not set. Leader election
stays on. Both pods use the one
IRSA service account. Only the leader changes desired capacity. The standby is not the scaler.
`--balance-similar-node-groups=true` and `--expander=least-waste` stay,
so the scheduled leader can raise the underfilled zone's group.
`--salvo-scale-up=true` and `--salvo-scale-up-budget=1m` run another
choice in that same loop. `--frequent-loops-enabled=true` stays
([ADR 0090](adr/0090-cluster-autoscaler-ha.md),
[ADR 0099](adr/0099-cluster-autoscaler-zone-hard-spread.md),
[ADR 0101](adr/0101-cluster-autoscaler-leader-scale.md),
[ADR 0102](adr/0102-cluster-autoscaler-scale-up-salvo.md)).
The `1m` budget stays. A budget that is already gone, a failed snapshot
update, or a scale-up that is not successful still ends that salvo.
The next main loop is the retry
([ADR 0103](adr/0103-cluster-autoscaler-salvo-early-stop.md)).
Each zone's node-group max is 20. The leader reads that as the Auto
Scaling group `MaxSize` and cannot lift it
([ADR 0104](adr/0104-per-zone-node-max.md)).
`nodeSelector` also requires `kubernetes.io/os: linux` and
`computerpets/node-pool: api`, so the hostname rule cannot be met by
nodes outside those groups. Kind and minikube do not apply the file
(`enable_node_pool=false` does not label their nodes and does not set a
zone). A single-zone set of labeled nodes that also carry one zone value
still schedules both pods when two hostnames exist. A pool label without
the zone label leaves both pods Pending.
The API Deployments select the same label
([ADR 0091](adr/0091-cluster-autoscaler-node-pool.md),
[ADR 0093](adr/0093-api-node-pool.md)).
The same file keeps one autoscaler pod during voluntary disruption
(`minAvailable: 1`, selector `app=cluster-autoscaler`). `minAvailable: 2`
is not used, because two replicas would then allow zero evictions. Kind
and minikube do not apply the file, so they do not install this budget
([ADR 0092](adr/0092-cluster-autoscaler-pdb.md)).
Resource metrics for that HPA are `deploy/k8s/metrics-server.yaml`
(upstream high-availability-1.21+.yaml v0.9.0, `replicas: 2`, required
hostname anti-affinity, APIService `v1beta1.metrics.k8s.io`). It is not in
this kustomization. Apply it before `hpa.yaml`, and only after
`kubectl top` shows cpu and memory does the replica count move.
`--kubelet-insecure-tls` is not set. `--kubelet-certificate-authority`
mounts operator ConfigMap or Secret `metrics-server-kubelet-ca` (key
`ca.crt`, `optional: false`). `--tls-cert-file` and
`--tls-private-key-file` mount Secret `metrics-server-serving`.
`insecureSkipTLSVerify` is not set. This repo does not vendor those
certificates.
The same Deployment hard-spreads zones
(`topology.kubernetes.io/zone`, `maxSkew: 1`, `DoNotSchedule`,
`nodeTaintsPolicy: Honor`, `nodeAffinityPolicy: Honor`). `minDomains`
is unset. Do not set minDomains. One labeled zone still schedules both
pods when two hostnames exist. A node that omits the zone label does
not. Kind and minikube do not apply the file.
`nodeSelector` also requires `computerpets/node-pool: api`, and
`nodeAffinityPolicy: Honor` counts only those nodes. Kind and minikube
do not apply the file (`enable_node_pool=false` does not label their
nodes). A single-zone set of labeled nodes still schedules both pods
when two hostnames exist and the nodes carry one zone value
([ADR 0084](adr/0084-metrics-server.md), [ADR 0085](adr/0085-metrics-server-ha.md),
[ADR 0086](adr/0086-metrics-server-kubelet-ca.md),
[ADR 0087](adr/0087-metrics-server-serving-cert.md),
[ADR 0088](adr/0088-metrics-server-zone-spread.md),
[ADR 0089](adr/0089-metrics-server-node-pool.md),
[ADR 0098](adr/0098-metrics-server-zone-hard-spread.md)).

Prefer External Secrets Operator or Vault Agent to fill
`computerpets-secrets` rather than committing values into `secret.yaml`.
Example CR: `deploy/k8s/external-secret.example.yaml` (not in
kustomization). File mounts + `NAME_FILE`: `deployment-secrets-file.example.yaml`.
Set `COMPUTERPETS_SECRETS_SOURCE=external-secrets|file|vault-agent` —
[Secret management](#secret-management).

Blue/green is two Deployments (`computerpets-blue` live,
`computerpets-green` at 0 replicas) and a Service selector
`color=blue`. **Verify the GHCR digest signature first**
(`./deploy/k8s/verify-image-signature.sh ghcr.io/richeyworks/computerpets@sha256:…`)
then flip the selector after green is Ready. Unsigned or tag-only refs are
refused on the prod path ([ADR 0061](adr/0061-ghcr-image-signing.md)). Full
commands are in [deploy/k8s/README.md](../deploy/k8s/README.md).

Optional `ingress.yaml` is the local/dev HTTP door and is not in the
kustomization. Public prod is `ingress-tls.yaml` (also not in the
kustomization): cert-manager TLS, redirect to HTTPS, HTTP to the pod
([ADR 0077](adr/0077-api-listener-tls.md)). Change the issuer name to one
you already run. Optional Kyverno image-signature policy:
`deploy/k8s/image-signature-policy.example.yaml` (not in kustomization).

### Managed stores (Terraform)

For production, prefer managed Postgres / Redis / secrets / CDN / WAF over
the in-cluster scaffolding. The reference root lives in
`deploy/terraform/` ([ADR 0062](adr/0062-terraform-managed-stores.md)):
deny-safe defaults (no public DBs; house crypto not in tfvars/state),
Secrets Manager shells matching `external-secret.example.yaml`, and a
ConfigMap overlay example. Local verify does not need a cloud account:

```bash
./deploy/terraform/check-managed-stores.sh
./deploy/terraform/check-postgres-tls.sh
./deploy/terraform/check-api-listener-tls.sh
```

Managed Postgres sets `rds.force_ssl=1`. `spring_datasource_url` includes
`sslmode=require` unless `postgres_ssl_root_cert` names a PEM path, in which
case the URL uses `verify-full`. Pair that with `POSTGRES_SSL_REQUIRED=true`
([ADR 0076](adr/0076-postgres-transit-tls.md)).

While `enable_api_listener_tls` is true (the default), set
`api_listener_alb_arn` (the same API ALB), `api_listener_certificate_arn`
(an ACM certificate you already have — this root does not call ACM), and
`api_listener_target_group_arn`. Port 80 redirects to 443. The pods stay
HTTP on 8081. Then set `API_LISTENER_TLS_REQUIRED=true` and
`API_PUBLIC_BASE_URL=https://<host>`
([ADR 0077](adr/0077-api-listener-tls.md)).

A real `terraform apply` is the keeper's AWS account — not CI.
While `enable_waf` is true (the default), set `waf_associate_alb_arn` to the
API application load balancer or the plan fails closed
([ADR 0074](adr/0074-waf-in-front-of-rate-limiter.md)). The ACL's four rate
rules match the JVM buckets. Do not attach it to the bundle CloudFront
distribution. Local WAF contract check:

```bash
./deploy/terraform/check-waf-gate.sh
```

### CDN edge redeem

Before zip bytes leave the CDN, associate `deploy/cdn/edge-redeem.js`
([ADR 0063](adr/0063-cdn-edge-redeem-verification.md)). Set `HOUSE_API_BASE`
to the public house origin. Local verify (no AWS):

```bash
node deploy/cdn/edge-redeem.test.cjs
```

The edge does not hold `BUNDLE_SIGNING_KEY`; it calls house redeem and
forwards the viewer address as `X-Forwarded-For`. List the edge / LB peer
CIDRs in `TRUSTED_PROXY_CIDRS` so the house honours that header ([ADR 0067](adr/0067-trusted-proxy-client-address.md)).

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

### Steam

Steam verify asks `IPlayerService/GetOwnedGames` whether the keeper owns
the AppID they named. The house only opens when that AppID is on
`STEAM_APP_ID` (one door, or a comma allowlist) and Steam says they own
it. A placeholder or blank `STEAM_API_KEY` fails closed. An empty
`STEAM_APP_ID` also fails closed — owning any Steam game does not sit
you here. Do not invent a live ComputerPets AppID; leave the door empty
until one exists.

| Variable        | Purpose                                              |
|-----------------|------------------------------------------------------|
| `STEAM_API_KEY` | Steam Web API key                                    |
| `STEAM_APP_ID`  | House AppID / comma allowlist; empty fails closed    |

```yaml
steam:
  api-key: "YOUR_STEAM_WEB_API_KEY"
  api-base-url: https://api.steampowered.com
  app-id: ${STEAM_APP_ID:}
```

`POST /api/verify/steam` still expects `steamId` and `appId`. A foreign
`appId` is denied before Steam is asked.

### Microsoft Store

Microsoft Store verify asks Collections v9 `publisherQuery` whether the
keeper owns the product they named. The house only opens when that
`storeProductId` is on `MICROSOFT_PRODUCT_ID` (one door, or a comma
allowlist) and Collections says they own it. An empty
`MICROSOFT_PRODUCT_ID` fails closed — owning any Microsoft Store
product does not sit you here. Do not invent a live ComputerPets Store
id; leave the door empty until one exists. `MICROSOFT_DEV_MODE` is a
local bypass only; the house door still applies, and prod still refuses it.

| Variable               | Purpose                                                         |
|------------------------|-----------------------------------------------------------------|
| `MICROSOFT_PRODUCT_ID` | House Store product id / comma allowlist; empty fails closed    |
| `MICROSOFT_DEV_MODE`   | Local bypass of Collections; never on prod                      |

```yaml
microsoft:
  tenant: consumers
  collections-url: https://collections.mp.microsoft.com/v9.0/collections/publisherQuery
  product-id: ${MICROSOFT_PRODUCT_ID:}
  dev-mode: ${MICROSOFT_DEV_MODE:false}
```

`POST /api/verify/microsoft` still expects `xstsToken` and
`storeProductId`. A foreign `storeProductId` is denied before
Collections is asked.

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
A named wallet is not enough: `personal_sign` must prove the keeper holds the keys
(`ethereum.require-signature: true`). See [NFT.md](NFT.md) for the full contract.

| Variable            | Purpose                                      |
|---------------------|----------------------------------------------|
| `ETHEREUM_RPC_URL`  | JSON-RPC endpoint (Alchemy, Infura, a node)  |

```yaml
ethereum:
  rpc-url: ${ETHEREUM_RPC_URL}
  allowlist-required: true
  require-signature: true
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
**Problem**: `/api/verify/**`, `/api/download/**`, or `/api/pets` returns 503 with `Rate limiter unavailable`  
**Solution**: Redis is the default store and the filter fail-closes when it cannot be reached. Start Redis (`docker compose up redis` or a local `redis-server`) and set `REDIS_HOST` / `REDIS_PORT`, or set `RATE_LIMIT_BACKEND=memory` for a single local process. If the node requires AUTH, set `REDIS_PASSWORD` (or `REDIS_PASSWORD_FILE`), `REDIS_SSL=true`, and `REDIS_AUTH_REQUIRED=true`. A required password that is missing refuses to start ([ADR 0075](adr/0075-redis-auth-and-transit-tls.md)).

### Port Already in Use
**Problem**: Port 8081 is occupied  
**Solution**: The desk already sits at 8080. Pick another door for Java:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082"
```

### Maven Cannot Find Java
**Problem**: `mvn` uses the wrong Java version  
**Solution**: Set `JAVA_HOME` correctly and restart your terminal.

---

## Next Steps

- Read the [Architecture Documentation](ARCHITECTURE.md) for a deep understanding of the system design.
- The Electron overlay in `desktop/` implements the first [Client contract](CLIENT-CONTRACT.md) slice (Steam verify, license decrypt, hwid, signed download). See `desktop/README.md`.
- Sit with the house from the root [README](../README.md).
- Review the [Contributing Guidelines](CONTRIBUTING.md) if you plan to contribute.

If you run into issues not covered here, feel free to open an issue on the project repository.