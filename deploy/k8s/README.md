# Kubernetes manifests

Plain manifests (not Helm). They match how the app runs today: Spring Boot
on 8080, Postgres for the license ledger, Redis for shared rate limits and
the jti deny-list, fail-hard secrets, and the Actuator probes already in
`application.yml`.

```
kubectl apply -k deploy/k8s
```

Fill `secret.yaml` **before** apply. Empty or placeholder keys will not
boot — `LicenseService`, `JwtService`, `PetBundleService`, and
`AdminController` refuse to start, and `ProductionProfileGuard` refuses
H2, `RATE_LIMIT_BACKEND=memory`, and `MICROSOFT_DEV_MODE=true`.

## What gets created

| Resource | Name | Role |
|----------|------|------|
| Namespace | `computerpets` | Isolation |
| Secret | `computerpets-secrets` | Keys + Postgres password |
| ConfigMap | `computerpets-config` | `SPRING_PROFILES_ACTIVE=prod`, JDBC URL, Redis host |
| Deployment + Service + PVC | `computerpets-postgres` | Same Postgres 16 image as `docker-compose.yml` |
| Deployment + Service | `computerpets-redis` | Same Redis 7 image as compose (no AUTH — the app has no Redis password setting) |
| Deployment | `computerpets-blue` | Live app replicas (`color=blue`) |
| Deployment | `computerpets-green` | Idle slot (`replicas: 0`, `color=green`) |
| Service | `computerpets` | Selects `app=computerpets,color=blue` |

`ingress.yaml` is **not** in the kustomization. Apply it only if you have
an Ingress controller.

In-cluster Postgres and Redis are scaffolding, the same as compose. A
real production cluster should point `SPRING_DATASOURCE_URL` and
`REDIS_HOST` at managed services and drop those two Deployments.

## Required secrets

Create or edit `secret.yaml`. Generate values the same way as [SETUP](../../docs/SETUP.md):

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
| `ADMIN_API_KEY` | Yes | `/api/admin/*` and house `/admin` (`X-Admin-Key`) |
| `SPRING_DATASOURCE_USERNAME` | Yes | JDBC (must match `POSTGRES_USER`) |
| `SPRING_DATASOURCE_PASSWORD` | Yes | JDBC (must match `POSTGRES_PASSWORD`) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Yes if using the in-cluster Postgres | `postgres` container |

Redis has no secret in this tree: `RateLimitConfiguration` only takes
`REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT` (ConfigMap). Do not invent
a Redis password the app cannot read.

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

CI publishes `ghcr.io/richeyworks/computerpets` (`main` and `sha-<git>`).
Override the tag in `kustomization.yaml` or build locally:

```bash
docker build -t ghcr.io/richeyworks/computerpets:local .
# then set newTag: local in kustomization.yaml
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

1. Ship a new image on **green** and scale it up:
   ```bash
   kubectl -n computerpets set image deploy/computerpets-green \
     computerpets=ghcr.io/richeyworks/computerpets:<tag>
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
`RollingUpdate` (`maxUnavailable: 0`) for in-color patches.

## `spring.profiles.active=prod`

The ConfigMap sets it. That loads `application-prod.yml` (Postgres, no
H2 console, `show-sql: false`, Redis, `microsoft.dev-mode: false`) and
activates `ProductionProfileGuard`.
