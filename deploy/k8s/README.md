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
| Deployment | `computerpets-blue` | Live app replicas (`color=blue`, local `replicas: 2`). Soft hostname spread ([ADR 0080](../../docs/adr/0080-api-pod-topology-spread.md)) and soft zone spread ([ADR 0081](../../docs/adr/0081-api-pod-zone-spread.md)) |
| Deployment | `computerpets-green` | Idle slot (`replicas: 0`, `color=green`). Not an HPA or PDB target. Same soft hostname and zone spread |
| Service | `computerpets` | Selects `app=computerpets,color=blue` |
| HorizontalPodAutoscaler | `computerpets` | **Not created by this apply.** Prod file `hpa.yaml` ([ADR 0078](../../docs/adr/0078-horizontal-pod-autoscaling.md)) |
| PodDisruptionBudget | `computerpets` | **Not created by this apply.** Prod file `pdb.yaml` ([ADR 0079](../../docs/adr/0079-pod-disruption-budget.md)) |

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
| `METRICS_SCRAPE_TOKEN` | No | Bearer for `/actuator/prometheus` and `/actuator/info` (32+ chars). Unset = nobody scrapes ([ADR 0133](../../docs/adr/0133-actuator-metrics-scrape-token.md)) |

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

## Admin ledger from the web site

The web site's `/admin` page calls `/api/admin/**` from the browser, so two settings meet:

- **Web build:** `VITE_LICENSE_API_URL` is the license service's public address (for example the value of `API_PUBLIC_BASE_URL`). It is read when the web site is built (Vercel project environment, or `web/.env` locally; see `web/.env.example`). Unset, the page starts from its own origin, and only a page on localhost starts from `http://localhost:8081`. The field stays editable.
- **This service:** `ADMIN_ALLOWED_ORIGINS` (ConfigMap, optional) lists the web site origins allowed to make those browser calls, comma-separated, for example `https://<your web site>`. Unset means any origin, as before. Every admin call is still HMAC-signed with `ADMIN_API_KEY`; CORS only decides which pages the browser lets through.

Neither is a secret. Do not put the admin key in either.

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
optional doors do not restart the house.

`/actuator/prometheus` and `/actuator/info` need their own scrape bearer
([ADR 0133](../../docs/adr/0133-actuator-metrics-scrape-token.md)). A
customer download JWT is **403** there. The Ingress routes `/` to this
Service, so without that rule any keeper could read house metrics. Every
other `/actuator/**` path is closed. Put `METRICS_SCRAPE_TOKEN` (32+
chars, `openssl rand -hex 32`) on the Secret, or `METRICS_SCRAPE_TOKEN_FILE`.
Unset means nobody scrapes. Health and probes do not change. An in-cluster
Prometheus job reads the same token from a file:

```yaml
- job_name: computerpets
  metrics_path: /actuator/prometheus
  # scheme: https when the API listener has TLS (ADR 0077)
  authorization:
    type: Bearer
    credentials_file: /etc/prometheus/secrets/computerpets/METRICS_SCRAPE_TOKEN
  static_configs:
    - targets: ["computerpets.computerpets.svc:8081"]
```

## Horizontal pod autoscaling (ADR 0078)

`hpa.yaml` is **not** in the kustomization. There is no `overlays/`
directory. `kubectl apply -k deploy/k8s` stays the local/dev shape:
blue `replicas: 2`, green `replicas: 0`. Postgres and Redis stay at 1.

The prod autoscaler targets Deployment `computerpets-blue` only
(the Service's default live color). `minReplicas` is 3. `maxReplicas`
is 3 ([ADR 0108](../../docs/adr/0108-api-single-zone-hostname-ceiling.md)).
That is one Ready zone times `min_size` 3, so that zone holds the ceiling
at one pod per hostname. The range equals the floor. The
[ADR 0107](../../docs/adr/0107-api-hostname-ceiling.md) ceiling of 6
stacked as 2, 2, and 2 on that zone and is refused. Raising `min_size`
to keep a higher ceiling (eight, ten, twelve, or twenty nodes) is refused.
CPU scales at 70% of the `250m` request. Memory scales at an
absolute `800Mi` (above the `512Mi` request, under the `1Gi` limit),
not at a percent of the request. A JVM that sits on its heap must not
be read as load.

**metrics-server** (the `metrics.k8s.io` API) is
`metrics-server.yaml` ([ADR 0084](../../docs/adr/0084-metrics-server.md),
[ADR 0085](../../docs/adr/0085-metrics-server-ha.md),
[ADR 0086](../../docs/adr/0086-metrics-server-kubelet-ca.md),
[ADR 0087](../../docs/adr/0087-metrics-server-serving-cert.md),
[ADR 0088](../../docs/adr/0088-metrics-server-zone-spread.md),
[ADR 0089](../../docs/adr/0089-metrics-server-node-pool.md),
[ADR 0098](../../docs/adr/0098-metrics-server-zone-hard-spread.md),
[ADR 0111](../../docs/adr/0111-metrics-server-serving-cert-chain.md),
[ADR 0112](../../docs/adr/0112-metrics-server-kubelet-ca-chain.md),
[ADR 0113](../../docs/adr/0113-metrics-server-kubelet-san.md),
[ADR 0114](../../docs/adr/0114-metrics-server-kubelet-port.md)).
That file is also not in the kustomization. It runs two replicas with
required hostname anti-affinity and hard zone spread (`DoNotSchedule`
on `topology.kubernetes.io/zone`, `maxSkew` 1). One labeled zone still
schedules. Do not set minDomains. `nodeSelector` requires
`computerpets/node-pool: api`, and `nodeAffinityPolicy: Honor` keeps
the zone count on those nodes. Kind and minikube do not apply it
(`enable_node_pool=false` does not label their nodes). A single-zone
set of labeled nodes still schedules both pods when two hostnames exist
and the nodes carry one zone value.
Let `metrics-server-kubelet-ca.sh` write ConfigMap
`metrics-server-kubelet-ca` only after every supplied kubelet leaf
chains to that CA ([ADR 0112](../../docs/adr/0112-metrics-server-kubelet-ca-chain.md)),
then let `metrics-server-serving-cert.sh` mint the serving leaf and write
`caBundle` ([ADR 0111](../../docs/adr/0111-metrics-server-serving-cert-chain.md)).
`kubectl top pods -n computerpets` must show cpu and memory. Until that
API answers, applying the HPA does not raise the replica count, so blue
can stay at 2.

```bash
# Prod only. Not kind or minikube. The kubelet CA script refuses a
# missing CA, a leaf that does not chain to ca.crt, or
# --kubelet-insecure-tls, before any kubectl (ADR 0112). The SAN script
# refuses a leaf whose SAN does not cover InternalIP, then ExternalIP,
# then Hostname, before any kubectl (ADR 0113). It does not connect to
# a node. The port script refuses a missing, zero, or wrong
# kubeletEndpoint.port before any kubectl (ADR 0114). A non-zero status
# port is the dial; otherwise metrics-server would dial 10250. That
# dial must be the kubelet listen port. It does not connect to a node.
# Do not set --kubelet-port. The serving script refuses a leaf that
# does not chain to ca.crt, or whose DNS SAN is not
# metrics-server.kube-system.svc, before any kubectl (ADR 0111).
KUBELET="$(mktemp -d)"
# keeper copies ca.crt and kubelet.crt (and kubelet-*.crt) into "$KUBELET"
./deploy/k8s/metrics-server-kubelet-ca.sh verify "$KUBELET"
COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-ca.sh apply "$KUBELET"
SAN="$(mktemp -d)"
# keeper copies ca.crt and nodes/<name>/{kubelet.crt,addresses} into "$SAN"
./deploy/k8s/metrics-server-kubelet-san.sh verify "$SAN"
COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-san.sh apply "$SAN"
PORT="$(mktemp -d)"
# keeper copies ca.crt and nodes/<name>/{kubelet.crt,addresses,kubelet-port}
./deploy/k8s/metrics-server-kubelet-port.sh verify "$PORT"
COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-port.sh apply "$PORT"
OUT="$(mktemp -d)"
./deploy/k8s/metrics-server-serving-cert.sh render "$OUT"
COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  ./deploy/k8s/metrics-server-serving-cert.sh apply "$OUT"
kubectl apply -f deploy/k8s/hpa.yaml
./deploy/k8s/check-metrics-server-kubelet-ca.sh
./deploy/k8s/check-metrics-server-serving-cert.sh
./deploy/k8s/check-hpa.sh
```

A later `kubectl apply -k` writes blue back to 2 until the autoscaler
reconciles. Do not add `hpa.yaml` to `kustomization.yaml`.

## Pod disruption budget (ADR 0079)

`pdb.yaml` is **not** in the kustomization. `kubectl apply -k deploy/k8s`
does not create it. Local blue stays at `replicas: 2`. Do not apply the
budget on that shape: `minAvailable: 2` with only 2 Ready pods allows
zero voluntary evictions, so a node drain stalls.

The prod budget selects `app=computerpets, color=blue` (the Service's
default live color). `minAvailable` is 2. Green, Postgres, and Redis are
not selected. Apply it only after `hpa.yaml` has actually reached 3 Ready
pods of that color. One pod may be evicted. Two stay. A node crash is not
a voluntary disruption and is not blocked. `kubectl scale` is not an
eviction.

```bash
# Prod only, after the live color is actually at 3 or more.
kubectl apply -f deploy/k8s/pdb.yaml
./deploy/k8s/check-pdb.sh
```

Re-applying `pdb.yaml` points the selector back at blue. Do not add
`pdb.yaml` to `kustomization.yaml`.

## Hostname spread (ADR 0080, ADR 0100)

Both API pod templates set `topologySpreadConstraints` on
`kubernetes.io/hostname`. `maxSkew` is 1. `whenUnsatisfiable` is
`DoNotSchedule`. `nodeTaintsPolicy` is `Honor`. `nodeAffinityPolicy`
is `Honor`. The selector is `app=computerpets` plus that Deployment's
own color. Blue pods do not count as green's spread, and green pods
do not count as blue's. There is no `minDomains`. Do not set
`minDomains`. `ScheduleAnyway` is not the hostname action. Required
hostname anti-affinity is not set.

`nodeTaintsPolicy: Honor` drops a node this pod cannot tolerate out of
the count. These pods tolerate the API pool taint, so tainted API
workers stay in the skew. A control-plane taint they do not tolerate
stays out. The default `Ignore` would count that tainted node as an
empty domain and leave later pods Pending. Honor does not.

One hostname still schedules. `minDomains` is unset, so the constraint
behaves as `minDomains: 1`. The only eligible domain is that hostname,
and the skew of placing another pod there is 1, which `maxSkew` allows.
Hard spread does not invent a second node. Kind and minikube with one
eligible hostname still run both local blue replicas on that node. The
second pod is not left Pending by this item. Required hostname
anti-affinity would leave that second pod Pending. It is not set.
`minDomains: 2` would also leave it Pending. Do not set it.

On two or more pool hostnames that can take a pod, a placement that
would make the skew greater than 1 stays Pending. The live color cannot
put every pod on one node while another eligible hostname has room. On
two hostnames the local blue count of 2 is 1 and 1, not 2 and 0. On two
hostnames the HPA floor of 3 is 2 and 1, not 3 and 0. Pods of one color
can still share a node when the count stays inside that skew. If the
lighter hostname has no remaining capacity, the pod stays Pending until
that hostname can take it. Cluster Autoscaler can add a node. This
apply does not change the scaler.

That 2 and 1 placement is what two hostnames allow. It is not the
pool. Each API zone's `min_size` is 3, and the create-time
`desired_size` is 3
([ADR 0106](../../docs/adr/0106-api-single-zone-hostname-floor.md)).
One Ready zone is three hostnames, so the HPA floor of 3 is 1 and 1
and 1 under hostname `maxSkew` 1. Two healthy zones are six hostnames.
The HPA floor stays 3 because the disruption budget keeps 2. A floor
of 2 would stack 2 and 1 when only one zone is Ready, and it is refused.
The zone gate stays two. The HPA ceiling is that same 3
([ADR 0108](../../docs/adr/0108-api-single-zone-hostname-ceiling.md)),
so one Ready zone holds it as 1 and 1 and 1. The ceiling of 6 is
2, 2, and 2 on those three hostnames and is refused. Kind and minikube
do not plan the pool and do not apply the HPA.
One hostname on a laptop still schedules. Do not set `minDomains`.
Required hostname anti-affinity is not set. A keeper must raise
`desired_size` to at least 3 before `min_size` 3 will apply.
Terraform ignores `desired_size` after create, so a group still at 2
or still at 1 does not move on its own
([ADR 0105](../../docs/adr/0105-api-hostname-floor.md)).

The zone key is a second constraint
([ADR 0081](../../docs/adr/0081-api-pod-zone-spread.md)). Its action is
`DoNotSchedule` ([ADR 0095](../../docs/adr/0095-api-zone-hard-spread.md)).
Postgres and Redis are not constrained. Local `replicas` stay 2 and 0.
This rule is on the pod template, so `kubectl apply -k` does apply it.
It does not apply `hpa.yaml` or `pdb.yaml`. The pool pin is
[ADR 0093](../../docs/adr/0093-api-node-pool.md). An unlabeled kind or
minikube node leaves the API pods Pending. A pool label without one
zone value also leaves them Pending.

```bash
./deploy/k8s/check-topology-spread.sh
./deploy/k8s/check-api-hostname-hard-spread.sh
./deploy/k8s/check-api-hostname-hard-spread.test.sh
./deploy/k8s/check-api-hostname-floor.sh
./deploy/k8s/check-api-hostname-floor.test.sh
./deploy/k8s/check-api-single-zone-hostname-floor.sh
./deploy/k8s/check-api-single-zone-hostname-floor.test.sh
./deploy/k8s/check-api-hostname-ceiling.sh
./deploy/k8s/check-api-hostname-ceiling.test.sh
./deploy/k8s/check-api-single-zone-hostname-ceiling.sh
./deploy/k8s/check-api-single-zone-hostname-ceiling.test.sh
```

A cutover does not patch this. Scaling green creates pods from the
green template, which already has the same hard rule. The Service, HPA,
and PDB patches below are unchanged. One hostname can still hold every
pod of the live color, because it is then the only domain. A crash of
that node is not blocked by the budget.

## Zone spread (ADR 0081, ADR 0095)

Both API pod templates add a second `topologySpreadConstraints` item on
`topology.kubernetes.io/zone`. `maxSkew` is 1. `whenUnsatisfiable` is
`DoNotSchedule`. `nodeTaintsPolicy` is `Honor`. `nodeAffinityPolicy` is
`Honor`. The selector is the same color-scoped pair as the hostname
item. Hostname spread is `DoNotSchedule`
([ADR 0100](../../docs/adr/0100-api-hostname-hard-spread.md)). There is no `minDomains`.
Do not set `minDomains`.

`DoNotSchedule` skips a node that omits `topology.kubernetes.io/zone`.
Kind and minikube do not set that label. A pool label alone leaves the
API pods Pending. Set one zone value on the labeled node when a local
cluster should run the API.

One labeled zone still schedules. `minDomains` is unset, so the
constraint behaves as `minDomains: 1`. The only eligible domain is that
zone, and the skew of placing another pod there is 1, which `maxSkew`
allows. Hard spread does not invent a second zone. Every replica of the
live color can still sit in that one zone. That is the honest limit.

On two or more pool zones that can take a pod, a placement that would
make the skew greater than 1 stays Pending. The live color cannot put
every pod in one zone while another labeled zone has room. On two zones
the HPA floor of 3 is 2 and 1, not 3 and 0. If the lighter zone has no
remaining capacity, the pod stays Pending until that zone can take it.
Cluster Autoscaler can add a node there. This apply does not change the
scaler.

`nodeTaintsPolicy: Honor` drops nodes this pod cannot tolerate out of
the count. These pods tolerate the API pool taint, so tainted API
workers stay in the skew. A control-plane taint they do not tolerate
stays out. `nodeAffinityPolicy: Honor` counts only nodes that match the
pool selector.

**Prod expectation:** schedulable workers in at least two availability zones
(three when the floor of 3 should land one pod per zone). Cloud
providers set the zone label. Private workers are one EKS managed node
group per zone ([ADR 0082](../../docs/adr/0082-multi-az-node-pool.md)).
This apply does not create them. No live AWS apply. `aws-node` and
`kube-proxy` are not in this repo. A failure of a zone that still has
no eligible node is not blocked by the budget, and the remaining zone
can take every pod because it is then the only domain.

```bash
./deploy/k8s/check-zone-spread.sh
./deploy/k8s/check-api-zone-hard-spread.sh
./deploy/k8s/check-api-zone-hard-spread.test.sh
```

A cutover does not patch the zone item. Scaling green uses the green
template, which already has it.

## API node pool pin (ADR 0093)

Both API pod templates set `nodeSelector` to `kubernetes.io/os: linux`
and `computerpets/node-pool: api`. That pool label is the one
`deploy/terraform/modules/node_pool` already sets on each multi-AZ
group, the same pair metrics-server and Cluster Autoscaler require.
The selector is required. There is no `nodeAffinity` block. A node
outside the groups does not receive an API pod.

Both spread items set `nodeAffinityPolicy: Honor`, so hostname and zone
skew count only nodes that match the selector. Hostname
`whenUnsatisfiable` is `DoNotSchedule`
([ADR 0100](../../docs/adr/0100-api-hostname-hard-spread.md)). The zone item is
`DoNotSchedule` ([ADR 0095](../../docs/adr/0095-api-zone-hard-spread.md)).
One labeled node still schedules both blue pods when that node also
carries one zone label. One hostname still schedules. One labeled zone
still schedules. HPA and PDB
are unchanged. Postgres and Redis are not pinned.

Kind and minikube apply these Deployments (`kubectl apply -k
deploy/k8s`). Their nodes omit `computerpets/node-pool=api` unless a
human labels one. The API pods stay Pending until then. That is the
missing-label path. Do not delete the pool key to make a laptop apply
schedule. Label the node when a local cluster should run the API.
`enable_node_pool=false` does not add the label and does not remove
the selector. Postgres and Redis still schedule on the unlabeled node.

```bash
./deploy/k8s/check-api-node-pool.sh
```

## API pool taint (ADR 0094)

The node group taints `computerpets/node-pool=api:NoSchedule`. Blue,
green, metrics-server, and Cluster Autoscaler tolerate that exact key,
`Equal`, value `api`, and `NoSchedule`. They keep the pool
`nodeSelector`. Postgres and Redis do not tolerate it and stay
unpinned. `PreferNoSchedule` is not used. `NoExecute` is not used.
`NoSchedule` does not evict a pod that is already running.

Kind and minikube apply the blue and green tolerations (`kubectl apply
-k deploy/k8s`) and do not apply the node group. Their nodes are not
tainted.
A toleration does not require the taint.
Do not taint a kind or minikube node.
The API pods stay Pending until a node is labeled
`computerpets/node-pool=api`. Labeling that node without the taint
still schedules the API once the node also carries one
`topology.kubernetes.io/zone` value
([ADR 0095](../../docs/adr/0095-api-zone-hard-spread.md)). A pool label
alone leaves the API Pending. Postgres and Redis still schedule on the
untainted node. Tainting the only laptop node leaves the stores
Pending. metrics-server and Cluster Autoscaler stay out of the
kustomization. `aws-node` and `kube-proxy` are not in this kustomization.
The vpc-cni addon records the API pool toleration for `aws-node`. The
kube-proxy strategic-merge patch is not applied here. The EKS reassert
hook is not applied here
([ADR 0096](../../docs/adr/0096-system-daemon-api-pool-toleration.md),
[ADR 0097](../../docs/adr/0097-kube-proxy-toleration-hook.md)).
No live AWS apply.

```bash
./deploy/k8s/check-api-pool-taint.sh
./deploy/k8s/check-api-pool-taint.test.sh
```

## Cluster Autoscaler (ADR 0083, ADR 0090, ADR 0091, ADR 0092, ADR 0099, ADR 0101, ADR 0102, ADR 0103, ADR 0104, ADR 0109)

`cluster-autoscaler.yaml` is **not** in the kustomization. `kubectl apply -k
deploy/k8s` does not install it. Kind and minikube set
`enable_node_pool=false`, which also skips the IRSA role.

The prod scaler runs in `kube-system` and changes desired capacity on the
Auto Scaling groups behind the per-zone node groups. Each group's max is
20
([ADR 0104](../../docs/adr/0104-per-zone-node-max.md)).
The one-zone floor under that cap is 8: the HPA ceiling of 3, plus both
Cluster Autoscaler pods, plus both metrics-server pods, plus one drain
node. Twice the new ceiling is 6 and is under that floor. The live set
binds on the per-zone minimum of 3, so `MaxLimitReached` at 20 is
unreachable in this design
([ADR 0109](../../docs/adr/0109-per-zone-node-max-floor.md)).
The HPA ceiling is 3, so one Ready zone holds it at one pod per hostname
([ADR 0108](../../docs/adr/0108-api-single-zone-hostname-ceiling.md)).
The leader reads that number from the group's `MaxSize`
(`DescribeAutoScalingGroups`). It does not raise it. The minimum is 3 per zone
([ADR 0106](../../docs/adr/0106-api-single-zone-hostname-floor.md)).
Terraform ignores `desired_size`
after the first apply. `--balance-similar-node-groups=true` keeps the two
zones from drifting apart. Scale-down still reads `poddisruptionbudgets`.

The Deployment sets `replicas: 2`. Pod anti-affinity is required on
`kubernetes.io/hostname` for `app: cluster-autoscaler` in `kube-system`,
so the second pod stays Pending until a second node exists. Beside that,
`topologySpreadConstraints` hard-spreads zones
(`topology.kubernetes.io/zone`, `maxSkew: 1`, `whenUnsatisfiable:
DoNotSchedule`, `nodeTaintsPolicy: Honor`, `nodeAffinityPolicy: Honor`)
([ADR 0099](../../docs/adr/0099-cluster-autoscaler-zone-hard-spread.md)).
`minDomains` is unset. Do not set `minDomains`. There is no preferred
zone anti-affinity term and no required zone anti-affinity term. On two
or more labeled zones that can take a pod, the two replicas cannot share
one zone. One labeled zone still schedules both pods when two hostnames
exist. A node that omits `topology.kubernetes.io/zone` does not. Kind and
minikube do not apply this file. Do not apply it there to invent a second
zone. Rolling update is `maxUnavailable: 1` and `maxSurge: 0`,
so a replacement uses a hostname that is already free instead of asking
for a third node while both pods are up.

Leader election stays on: `--leader-elect=true`, lock `leases`, name
`cluster-autoscaler`. The ClusterRole can create leases and update that
named lease. Both pods use ServiceAccount `cluster-autoscaler` and the
one IRSA role. Only the leader calls `SetDesiredCapacity`. There is no
second role. The standby is not the scaler
([ADR 0101](../../docs/adr/0101-cluster-autoscaler-leader-scale.md)).
A Pending replica never holds the lease. The Running leader remains
the scaler. v1.36.1 acquires the lease inside the running container.
No flag hands it to a pod that has not started
([ADR 0110](../../docs/adr/0110-cluster-autoscaler-pending-lease.md)).
The scheduled leader still
raises desired capacity on the underfilled zone's Auto Scaling group.
`--balance-similar-node-groups=true` and `--expander=least-waste` stay.
`--skip-nodes-with-system-pods=false` stays. That flag is scale-down.
`--namespace=kube-system` is the lease namespace, not a pod filter.
There is no scheduler allow-list and no `--nodes` list. The node pool
is one similar group per zone, at least two.
`--salvo-scale-up=true` and `--salvo-scale-up-budget=1m` run another
scale-up in that same loop for pods the first least-waste choice did
not place, including the underfilled zone. `--frequent-loops-enabled=true`
stays, so a loop that did scale up starts the next pass without waiting
out the scan interval. There is no priority expander ConfigMap
([ADR 0102](../../docs/adr/0102-cluster-autoscaler-scale-up-salvo.md)).
The `1m` budget stays. Node-provision time stays the unset `15m`
default, and node-group backoff stays the unset `5m` / `30m` / `3h`
defaults. A budget that is already gone, a failed snapshot update, or
a scale-up that is not successful still ends that salvo. The next
main loop is the retry
([ADR 0103](../../docs/adr/0103-cluster-autoscaler-salvo-early-stop.md)).
`MaxLimitReached` at 20 is unreachable for this set
([ADR 0109](../../docs/adr/0109-per-zone-node-max-floor.md)).
One Ready zone at min 3 is
three hostnames, so the HPA floor is 1 and 1 and 1
([ADR 0106](../../docs/adr/0106-api-single-zone-hostname-floor.md)).
Above the floor, ten pods on six healthy hostnames still share nodes.
Do not set `minDomains`.
Required zone anti-affinity is not set. Required hostname anti-affinity
is not the follow-up.

The same file adds a `policy/v1` `PodDisruptionBudget` named
`cluster-autoscaler` in `kube-system`. `minAvailable` is 1. The selector
is `app: cluster-autoscaler`, the same `matchLabels` as the Deployment.
`minAvailable` 2 is not used: with two replicas it would allow zero
voluntary evictions. One pod can drain while the other holds or takes
the lease. A node crash is not blocked. Kind and minikube do not apply
this file, so they do not install this budget
([ADR 0092](../../docs/adr/0092-cluster-autoscaler-pdb.md)). The API
budget in `pdb.yaml` is unchanged.

`nodeSelector` requires `kubernetes.io/os: linux` and
`computerpets/node-pool: api`. That second label is the one the node
pool already sets. The selector is required. There is no `nodeAffinity`
block, so a node outside the groups cannot take a replica. Required
hostname anti-affinity then needs two hostnames inside that pool. Kind
and minikube do not apply this file. `enable_node_pool=false` does not
label their nodes. Applying the file there leaves both pods Pending.
That is the feature-off path. Do not delete the pool key to make a
laptop apply schedule. A pool label without `topology.kubernetes.io/zone`
also leaves both pods Pending. A single-zone cluster whose nodes do carry the
label and one `topology.kubernetes.io/zone` value still schedules both
pods when two hostnames exist. One domain keeps skew at 1. Hard spread
does not invent a second zone. The API Deployments select the same label
([ADR 0093](../../docs/adr/0093-api-node-pool.md)).
The pod template tolerates the API pool taint
([ADR 0094](../../docs/adr/0094-api-pool-taint.md)).

The committed manifest uses three tokens: `CLUSTER_NAME`, `AWS_REGION`, and
account `000000000000` on the role ARN. Substitute the cluster name, the
region, and the `cluster_autoscaler_role_arn` output before apply. The image
tag is `v1.36.1` (Kubernetes 1.36). A different cluster minor needs that
minor's latest patch instead. Do not commit a real account id.

```bash
./deploy/terraform/check-cluster-autoscaler.sh
./deploy/terraform/check-cluster-autoscaler.test.sh
./deploy/k8s/check-cluster-autoscaler-zone-hard-spread.sh
./deploy/k8s/check-cluster-autoscaler-zone-hard-spread.test.sh
./deploy/k8s/check-cluster-autoscaler-leader-scale.sh
./deploy/k8s/check-cluster-autoscaler-leader-scale.test.sh
./deploy/k8s/check-cluster-autoscaler-scale-up-salvo.sh
./deploy/k8s/check-cluster-autoscaler-scale-up-salvo.test.sh
./deploy/k8s/check-cluster-autoscaler-salvo-early-stop.sh
./deploy/k8s/check-cluster-autoscaler-salvo-early-stop.test.sh
./deploy/k8s/check-cluster-autoscaler-zone-max.sh
./deploy/k8s/check-cluster-autoscaler-zone-max.test.sh
./deploy/k8s/check-cluster-autoscaler-zone-max-floor.sh
./deploy/k8s/check-cluster-autoscaler-zone-max-floor.test.sh
./deploy/k8s/check-cluster-autoscaler-pending-lease.sh
./deploy/k8s/check-cluster-autoscaler-pending-lease.test.sh
```

Zone spread for the API colors stays the item in those Deployments.
Adding a node does not force a pod onto it. The scaler's own zone item
is `DoNotSchedule`. If the lighter zone cannot fit the second scaler
pod, that pod stays Pending and never holds the lease. The Running
leader remains the scaler
([ADR 0110](../../docs/adr/0110-cluster-autoscaler-pending-lease.md)).
The standby is
not the scaler. The scheduled leader raises desired capacity on the
underfilled zone's group
([ADR 0101](../../docs/adr/0101-cluster-autoscaler-leader-scale.md)).
When another Pending pod wins least-waste first, `--salvo-scale-up=true`
still asks for the other group in that same loop
([ADR 0102](../../docs/adr/0102-cluster-autoscaler-scale-up-salvo.md)).
If that call uses the whole `1m` budget, the snapshot update fails, or
the scale-up is not successful, the pods still waiting use the next
main loop
([ADR 0103](../../docs/adr/0103-cluster-autoscaler-salvo-early-stop.md)).

## metrics-server (ADR 0084, ADR 0085, ADR 0086, ADR 0087, ADR 0088, ADR 0089, ADR 0098, ADR 0111, ADR 0112)

`metrics-server.yaml` is **not** in the kustomization. `kubectl apply -k
deploy/k8s` does not install it. Kind and minikube do not apply it.

The file starts from upstream [high-availability-1.21+.yaml v0.9.0](https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/high-availability-1.21+.yaml).
Image `registry.k8s.io/metrics-server/metrics-server:v0.9.0`. The
APIService is `v1beta1.metrics.k8s.io`. That is the API `hpa.yaml` reads
for CPU and memory. Namespace is `kube-system`. There is no Helm chart
and no floating tag.

The Deployment sets `replicas: 2`. Pod anti-affinity is required on
`kubernetes.io/hostname`, so the second pod stays Pending until a second
node exists. Beside that, `topologySpreadConstraints` hard-spreads zones
(`topology.kubernetes.io/zone`, `maxSkew: 1`, `whenUnsatisfiable:
DoNotSchedule`, `nodeTaintsPolicy: Honor`, `nodeAffinityPolicy: Honor`)
([ADR 0098](../../docs/adr/0098-metrics-server-zone-hard-spread.md)).
`minDomains` is unset. Do not set `minDomains`. On two or more labeled
zones that can take a pod, the two replicas cannot share one zone.
One labeled zone still schedules both pods when two hostnames exist:
the only domain keeps skew at 1. Hard spread does not invent a second
zone. A node that omits `topology.kubernetes.io/zone` does not receive
a pod. There is no required zone anti-affinity. That required rule
would leave the second pod Pending when every node shares one zone.
`nodeSelector` requires
`kubernetes.io/os: linux` and `computerpets/node-pool: api`. That pool
label is the one `deploy/terraform/modules/node_pool` already sets on
each multi-AZ group ([ADR 0089](../../docs/adr/0089-metrics-server-node-pool.md)).
`nodeAffinityPolicy: Honor` keeps the zone count on nodes that
match the selector. Linux nodes outside those groups do not receive
these pods and do not count. The selector is required. Kind and minikube
do not apply this file. `enable_node_pool=false` does not label their
nodes, so applying the file there leaves both pods Pending. That is the
feature-off path. A pool label without a zone value also leaves both
pods Pending. A single-zone cluster whose nodes carry the pool label
and one zone value still schedules both pods when two hostnames exist.
One node still leaves the second pod Pending on the hostname rule.
The API Deployments select the same label
([ADR 0093](../../docs/adr/0093-api-node-pool.md)).
The pod template tolerates the API pool taint
([ADR 0094](../../docs/adr/0094-api-pool-taint.md)).
Rolling update `maxUnavailable` is 1.
An addon `PodDisruptionBudget` in `kube-system` keeps `minAvailable: 1`. That
budget is not `pdb.yaml`.

`--kubelet-insecure-tls` is not set. Kubelet scrapes stay verified.
`--kubelet-certificate-authority` points at
`/etc/metrics-server/kubelet-ca/ca.crt`, a read-only mount of ConfigMap
`metrics-server-kubelet-ca` (key `ca.crt`, `optional: false`). This repo
does not vendor that certificate. A Secret with the same name, key, and
`optional: false` is the equivalent hand substitution. `hostPath` is not.
The flag replaces the in-cluster CA for kubelet scrapes.
`metrics-server-kubelet-ca.sh` writes that ConfigMap only after every
supplied kubelet leaf chains to `ca.crt`
([ADR 0112](../../docs/adr/0112-metrics-server-kubelet-ca-chain.md)).
A missing CA, a swapped CA, or `--kubelet-insecure-tls` refuses apply
before `kubectl`. A missing object leaves the pods unstarted. Do not add
the kubelet TLS skip.
`metrics-server-kubelet-san.sh` writes that same ConfigMap only after
each node file set's leaf chains to `ca.crt` and the leaf SAN covers
the address metrics-server dials
([ADR 0113](../../docs/adr/0113-metrics-server-kubelet-san.md)).
The dial order is `InternalIP`, then `ExternalIP`, then `Hostname`.
The first address of the first present type is the one in the SAN.
An IP dial needs an IP SAN. A hostname dial needs a DNS SAN.
The script does not connect to a node. Kind and minikube do not
receive the ConfigMap. Do not add `--kubelet-insecure-tls`.
`metrics-server-kubelet-port.sh` writes that same ConfigMap only after
the SAN verify passes and each node's `kubeletEndpoint.port` is the
port metrics-server dials
([ADR 0114](../../docs/adr/0114-metrics-server-kubelet-port.md)).
A non-zero status port is that dial. A zero would dial 10250 and is
refused. The dial port must be the kubelet listen port. The script
does not connect to a node. The chain-only writer and the SAN writer
still do not read the port. Do not set `--kubelet-port`. Do not add
`--kubelet-insecure-tls`.

`insecureSkipTLSVerify` is not set. `--tls-cert-file` and
`--tls-private-key-file` point at `/etc/metrics-server/serving/tls.crt`
and `tls.key`, a read-only mount of Secret `metrics-server-serving`
(keys `tls.crt` and `tls.key`, `optional: false`). This repo does not
vendor that certificate or key. `--cert-dir=/tmp` stays in the upstream
arg list and is ignored while both files are set, so the process does
not mint a serving cert. `metrics-server-serving-cert.sh` mints a
private CA and a leaf whose DNS SAN is `metrics-server.kube-system.svc`
([ADR 0111](../../docs/adr/0111-metrics-server-serving-cert-chain.md)).
`apply` verifies the chain and the SAN, then writes the Secret and
patches APIService `caBundle` from that same `ca.crt`. A cluster.local
name is not a substitute. A leaf that does not chain refuses apply
before `kubectl`. Do not commit the certificate, the key, or
`caBundle`. A missing Secret leaves the pods unstarted. Do not add
`insecureSkipTLSVerify`. Do not add `--kubelet-insecure-tls`.

Run `metrics-server-kubelet-port.sh` before
`metrics-server-serving-cert.sh`, and that script before `hpa.yaml`.
The port script calls the SAN verify, then writes ConfigMap
`metrics-server-kubelet-ca` only when `kubeletEndpoint.port` is the
dial port, and does not apply this file. The SAN script remains the
address-only writer. The chain script remains the chain-only writer.
The serving script applies
this file only after the serving leaf chains to `ca.crt` and the DNS SAN
is `metrics-server.kube-system.svc`.

```bash
# Prod only. Not part of kubectl apply -k. Not kind or minikube.
KUBELET="$(mktemp -d)"
# keeper copies ca.crt and kubelet.crt (and kubelet-*.crt) into "$KUBELET"
./deploy/k8s/metrics-server-kubelet-ca.sh verify "$KUBELET"
COMPUTERPETS_METRICS_KUBELET_CA_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-ca.sh apply "$KUBELET"
SAN="$(mktemp -d)"
# keeper copies ca.crt and nodes/<name>/{kubelet.crt,addresses} into "$SAN"
./deploy/k8s/metrics-server-kubelet-san.sh verify "$SAN"
COMPUTERPETS_METRICS_KUBELET_SAN_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-san.sh apply "$SAN"
PORT="$(mktemp -d)"
# keeper copies ca.crt and nodes/<name>/{kubelet.crt,addresses,kubelet-port}
./deploy/k8s/metrics-server-kubelet-port.sh verify "$PORT"
COMPUTERPETS_METRICS_KUBELET_PORT_APPLY=1 \
  ./deploy/k8s/metrics-server-kubelet-port.sh apply "$PORT"
OUT="$(mktemp -d)"
./deploy/k8s/metrics-server-serving-cert.sh render "$OUT"
COMPUTERPETS_METRICS_SERVING_APPLY=1 \
  ./deploy/k8s/metrics-server-serving-cert.sh apply "$OUT"
./deploy/k8s/check-metrics-server-kubelet-ca.sh
./deploy/k8s/check-metrics-server-kubelet-ca.test.sh
./deploy/k8s/check-metrics-server-kubelet-san.sh
./deploy/k8s/check-metrics-server-kubelet-san.test.sh
./deploy/k8s/check-metrics-server-kubelet-port.sh
./deploy/k8s/check-metrics-server-kubelet-port.test.sh
./deploy/k8s/check-metrics-server-serving-cert.sh
./deploy/k8s/check-metrics-server-serving-cert.test.sh
./deploy/k8s/check-metrics-server.sh
./deploy/k8s/check-metrics-server-zone-hard-spread.sh
./deploy/k8s/check-metrics-server-zone-hard-spread.test.sh
```

Do not add `metrics-server.yaml` to `kustomization.yaml`.

## Blue / green

Two Deployments, one Service. No mesh.

Without the HPA (local/dev):

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

With `hpa.yaml` applied, green is still not a target (a resource HPA
cannot scale from zero). Scale green by hand to **3**, wait Ready, flip
the Service, then point the HPA at green **before** scaling blue to 0.
Scaling blue to 0 while the HPA still names blue brings blue back to 3.
Re-applying `hpa.yaml` points the autoscaler back at blue.

When `pdb.yaml` is also applied, patch its selector onto the same live
color in that cutover, after green is Ready and before scaling blue to 0.
`kubectl scale` does not consult the budget, so scaling blue to 0 while
the budget still selects blue succeeds and leaves green with no budget.
Re-applying `pdb.yaml` points the selector back at blue. Skip the `pdb`
patch below if that object is not on the cluster.

```bash
kubectl -n computerpets scale deploy/computerpets-green --replicas=3
kubectl -n computerpets rollout status deploy/computerpets-green
kubectl -n computerpets patch svc computerpets \
  -p '{"spec":{"selector":{"app":"computerpets","color":"green"}}}'
kubectl -n computerpets patch hpa computerpets --type merge \
  -p '{"spec":{"scaleTargetRef":{"name":"computerpets-green"}}}'
kubectl -n computerpets patch pdb computerpets --type merge \
  -p '{"spec":{"selector":{"matchLabels":{"app":"computerpets","color":"green"}}}}'
kubectl -n computerpets scale deploy/computerpets-blue --replicas=0
```

Flip `color` back to `blue` the next time (scale blue to 3, flip the
Service, patch the HPA back to blue, patch the PDB selector back to blue,
then scale green to 0). Each Deployment still uses `RollingUpdate`
(`maxUnavailable: 0`) for in-color patches. Both templates already
prefer different hostnames (ADR 0080) and different zones (ADR 0081).
There is no spread patch in this cutover. A missing or wrong signature
must stop at step 1 — do not set image.

## `spring.profiles.active=prod`

The ConfigMap sets it. That loads `application-prod.yml` (Postgres, no
H2 console, `show-sql: false`, Redis, `microsoft.dev-mode: false`) and
activates `ProductionProfileGuard`. Operators must also set
`COMPUTERPETS_SECRETS_SOURCE` (`external-secrets`, `file`, or `vault-agent`)
before the house will boot — see ADR 0064.
