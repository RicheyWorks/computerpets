# Kubernetes manifests

Plain manifests (not Helm). They match how the app runs today: Spring Boot
on 8081, Postgres for the license ledger, Redis for shared rate limits and
the jti deny-list, fail-hard secrets, and the Actuator probes already in
`application.yml`.

```
kubectl apply -k deploy/k8s
```

Fill `secret.yaml` **only for local scaffolding**, or replace it with External Secrets /
Vault Agent so real values never sit in git. Empty or placeholder keys will not
boot — `LicenseService`, `JwtService`, `PetBundleService`, and
`AdminController` refuse to start, and `ProductionProfileGuard` refuses
H2, `RATE_LIMIT_BACKEND=memory`, `MICROSOFT_DEV_MODE=true`, and plain env
Secret without `COMPUTERPETS_SECRETS_SOURCE` (ADR 0064).

## Secret management (Phase 2.4 / ADR 0064)

Three shapes; same deny-safe contract ([ADR 0056](../../docs/adr/0056-house-secrets-from-file-mounts.md)).
**Prod path is fail-closed** ([ADR 0064](../../docs/adr/0064-secret-operator-prod-refuses-plain-env.md)):

| Shape | Mechanism |
|-------|-----------|
| **Opaque Secret + envFrom** (scaffolding only) | Edit `secret.yaml` + `COMPUTERPETS_ALLOW_PLAIN_SECRET=1` for laptop experiments — **not** the prod path |
| **External Secrets Operator** | Example CR: `external-secret.example.yaml` (**not** in kustomization). Set `COMPUTERPETS_SECRETS_SOURCE=external-secrets`. Point `secretStoreRef` at your Vault / AWS / GCP / Azure store. |
| **File mounts + `NAME_FILE`** | Example: `deployment-secrets-file.example.yaml`. Set `COMPUTERPETS_SECRETS_SOURCE=file` and `LICENSE_SECRET_KEY_FILE=…` (JWT / BUNDLE / ADMIN). `SecretFileEnvironmentPostProcessor` loads them. Missing path → refuse start. |

```bash
# Before prod roll out — repo contract + optional rendered manifests
./deploy/k8s/verify-secret-operator.sh
./deploy/k8s/verify-secret-operator.sh deploy/k8s/external-secret.example.yaml
```

Optional storefront keys may use `STEAM_API_KEY_FILE` / `ITCH_API_KEY_FILE` / `EPIC_*_FILE` / `ETHEREUM_RPC_URL_FILE`. Blank still fails closed at verify.

Never invent production secret values in manifests. Never log secret values.
Local-dev keeps env / `.env.example` and plain `docker-compose.yml`.

## What gets created

| Resource | Name | Role |
|----------|------|------|
| Namespace | `computerpets` | Isolation |
| Secret | `computerpets-secrets` | Keys + Postgres password |
| ConfigMap | `computerpets-config` | `SPRING_PROFILES_ACTIVE=prod`, JDBC URL, Redis host |
| Deployment + Service + PVC | `computerpets-postgres` | Same Postgres 16 image as `docker-compose.yml` |
| Deployment + Service | `computerpets-redis` | Same Redis 7 image as compose (AUTH-less; managed AUTH is ADR 0075) |
| Deployment | `computerpets-blue` | Live app replicas (`color=blue`) |
| Deployment | `computerpets-green` | Idle slot (`replicas: 0`, `color=green`) |
| Service | `computerpets` | Selects `app=computerpets,color=blue` |

`ingress.yaml` is **not** in the kustomization. It is the local/dev HTTP
door and has no `tls` block. Public prod is `ingress-tls.yaml` (also not
in the kustomization): cert-manager annotation, TLS redirect, HTTP to the
pod ([ADR 0077](../../docs/adr/0077-api-listener-tls.md)). Apply it only
when that ClusterIssuer already exists. Change the issuer name and the
host. It does not create an ACME account. Neither file has nginx
rate-limit annotations. The outer gate is the regional WAF on the API ALB
([ADR 0074](../../docs/adr/0074-waf-in-front-of-rate-limiter.md)). The JVM
filter stays the inner bucket. Point `TRUSTED_PROXY_CIDRS` at the ALB
subnet so that bucket sees the client
([ADR 0067](../../docs/adr/0067-trusted-proxy-client-address.md)).
The Service stays HTTP on 8081. Leave `API_LISTENER_TLS_REQUIRED` unset
for this in-cluster door. Set it, with `API_PUBLIC_BASE_URL=https://<host>`,
only for the public listener. Do not set `server.ssl`.

In-cluster Postgres and Redis are scaffolding, the same as compose. A
real production cluster should point `SPRING_DATASOURCE_URL` and
`REDIS_HOST` at managed services and drop those two Deployments.
Reference Terraform: `deploy/terraform/` ([ADR 0062](../../docs/adr/0062-terraform-managed-stores.md))
— Secrets Manager shells match `external-secret.example.yaml`; see
`configmap-managed.example.yaml` for the ConfigMap overlay.

## Required secrets

Create or edit `secret.yaml` **only for scaffolding**. Prefer External Secrets
or file mounts for prod (see above). Generate values the same way as [SETUP](../../docs/SETUP.md):

```bash
openssl rand -base64 32   # LICENSE_SECRET_KEY, ADMIN_API_KEY
openssl rand -base64 48   # JWT_SECRET_KEY, BUNDLE_SIGNING_KEY
openssl rand -base64 24   # SPRING_DATASOURCE_PASSWORD (also POSTGRES_PASSWORD)
```

| Key | Required | Used by |
|-----|----------|---------|
| `LICENSE_SECRET_KEY` | Yes | AES-256-GCM licenses (32 bytes, base64) |
| `JWT_SECRET_KEY` | Yes | Download JWTs (48+ bytes, base64) |
| `BUNDLE_SIGNING_KEY` | Yes | HMAC download URLs |
| `ADMIN_API_KEY` | Yes | HMAC key for `/api/admin/**` and house `/admin` ([ADR 0071](../../docs/adr/0071-admin-request-signature.md)) |
| `JWT_SECRET_KEY_PREVIOUS` / `BUNDLE_SIGNING_KEY_PREVIOUS` / `LICENSE_SECRET_KEY_PREVIOUS` / `ADMIN_API_KEY_PREVIOUS` | No | Dual-key window during rotation ([ADR 0065](../../docs/adr/0065-secret-rotation-cadence-and-hsm.md)). Unset after the window. |
| `COMPUTERPETS_KEYS_ROTATED_AT` | No | Optional ISO-8601 stamp; when set on prod, max age 400 days |
| `SPRING_DATASOURCE_USERNAME` | Yes | JDBC (must match `POSTGRES_USER`) |
| `SPRING_DATASOURCE_PASSWORD` | Yes | JDBC (must match `POSTGRES_PASSWORD`) |
| `SPRING_DATASOURCE_REPLICA_URL` | No | Optional managed Postgres **read** replica. Leave unset for the in-cluster single primary. Do not invent a replica Service. |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Yes if using the in-cluster Postgres | `postgres` container |

In-cluster Redis has no secret in this tree. `REDIS_HOST`, `REDIS_PORT`,
and `REDIS_TIMEOUT` stay on the ConfigMap. Optional managed AUTH
([ADR 0075](../../docs/adr/0075-redis-auth-and-transit-tls.md)): put
`REDIS_PASSWORD` on the Secret (or `REDIS_PASSWORD_FILE`) and set
`REDIS_SSL=true` plus `REDIS_AUTH_REQUIRED=true`. Do not invent a token
in git. `openssl rand -hex 16` matches the ElastiCache character rules.

In-cluster Postgres has no TLS. Leave `POSTGRES_SSL_REQUIRED` unset. The
managed URL from terraform includes `sslmode=require` (or `verify-full` when
a CA path is set). Set `POSTGRES_SSL_REQUIRED=true` with that URL. Mount a
real PEM before setting `POSTGRES_SSL_ROOT_CERT`. Do not invent a bundle
([ADR 0076](../../docs/adr/0076-postgres-transit-tls.md)).

Optional provider env (add to the Secret or ConfigMap if you have real
values — do not invent a collection address, itch game id, or Epic
sandbox): `STEAM_API_KEY`, `STEAM_APP_ID`, `MICROSOFT_PRODUCT_ID`,
`ETHEREUM_RPC_URL`, `ITCH_API_KEY`,
`ITCH_GAME_ID`, `EPIC_CLIENT_ID`, `EPIC_CLIENT_SECRET`,
`EPIC_DEPLOYMENT_ID`, `EPIC_SANDBOX_ID`, `EPIC_CATALOG_ITEM_ID`,
`OTEL_EXPORTER_OTLP_ENDPOINT`. Do not invent a live Steam AppID or
Microsoft Store product id; leave `STEAM_APP_ID` and
`MICROSOFT_PRODUCT_ID` empty until a ComputerPets door exists.

## Image

CI publishes `ghcr.io/richeyworks/computerpets` (`main` and `sha-<git>`) and
**signs the immutable digest** with keyless cosign (Sigstore Fulcio + Rekor)
from `.github/workflows/ci.yml` ([ADR 0061](../../docs/adr/0061-ghcr-image-signing.md)).
A publish that cannot sign or verify fails the job.

**Prod path is fail-closed:** verify the digest before `kubectl set image`.
Tag-only refs (`:main`, `:local`) are refused.

```bash
# Digest from the GHCR package UI, `cosign triangulate`, or CI log.
IMAGE=ghcr.io/richeyworks/computerpets@sha256:<digest>
./deploy/k8s/verify-image-signature.sh "$IMAGE"
# then set image / kustomize newName+digest — never skip on prod
```

`COMPUTERPETS_ALLOW_UNSIGNED=1` skips cosign for local experiments only — never
set it on the production path. Optional `COMPUTERPETS_COSIGN_KEY` points at a
cosign public key for air-gapped keepers; keyless identity is the house default.

Cluster admission: optional Kyverno scaffold in
`image-signature-policy.example.yaml` (**not** in kustomization). Same honesty
pattern as `external-secret.example.yaml`.

Override the tag in `kustomization.yaml` or build locally:

```bash
docker build -t ghcr.io/richeyworks/computerpets:local .
# then set newTag: local in kustomization.yaml (unsigned — not for prod)
```

## Probes

| Probe | Path | Why |
|-------|------|-----|
| startup / liveness | `/actuator/health/liveness` | `management.endpoint.health.probes.enabled` |
| readiness | `/actuator/health/readiness` | same |

`SecurityConfig` permits those three paths (and `/actuator/health`)
without a JWT. Public `/actuator/health` stays quiet — no room names,
no Steam or Redis reasons. Liveness is the process is up. Unhung
optional doors do not restart the house. `/actuator/prometheus` stays
authenticated.

## Blue / green

Two Deployments, one Service. No mesh.

1. Verify the signed digest, ship it on **green**, and scale it up:
   ```bash
   IMAGE=ghcr.io/richeyworks/computerpets@sha256:<digest>
   ./deploy/k8s/verify-image-signature.sh "$IMAGE"
   kubectl -n computerpets set image deploy/computerpets-green \
     computerpets="$IMAGE"
   kubectl -n computerpets scale deploy/computerpets-green --replicas=2
   kubectl -n computerpets rollout status deploy/computerpets-green
   ```
2. Flip the Service selector when green is Ready:
   ```bash
   kubectl -n computerpets patch svc computerpets \
     -p '{"spec":{"selector":{"app":"computerpets","color":"green"}}}'
   ```
3. Drain blue:
   ```bash
   kubectl -n computerpets scale deploy/computerpets-blue --replicas=0
   ```

Flip `color` back to `blue` the next time. Each Deployment still uses
`RollingUpdate` (`maxUnavailable: 0`) for in-color patches. A missing or
wrong signature must stop at step 1 — do not set image.

## `spring.profiles.active=prod`

The ConfigMap sets it. That loads `application-prod.yml` (Postgres, no
H2 console, `show-sql: false`, Redis, `microsoft.dev-mode: false`) and
activates `ProductionProfileGuard`. Operators must also set
`COMPUTERPETS_SECRETS_SOURCE` (`external-secrets`, `file`, or `vault-agent`)
before the house will boot — see ADR 0064.
