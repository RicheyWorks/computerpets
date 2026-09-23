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

## Horizontal pod autoscaling (ADR 0078)

`hpa.yaml` is **not** in the kustomization. There is no `overlays/`
directory. `kubectl apply -k deploy/k8s` stays the local/dev shape:
blue `replicas: 2`, green `replicas: 0`. Postgres and Redis stay at 1.

The prod autoscaler targets Deployment `computerpets-blue` only
(the Service's default live color). `minReplicas` is 3. `maxReplicas`
is 10. CPU scales at 70% of the `250m` request. Memory scales at an
absolute `800Mi` (above the `512Mi` request, under the `1Gi` limit),
not at a percent of the request. A JVM that sits on its heap must not
be read as load.

**metrics-server** (the `metrics.k8s.io` API) is
`metrics-server.yaml` ([ADR 0084](../../docs/adr/0084-metrics-server.md),
[ADR 0085](../../docs/adr/0085-metrics-server-ha.md),
[ADR 0086](../../docs/adr/0086-metrics-server-kubelet-ca.md),
[ADR 0087](../../docs/adr/0087-metrics-server-serving-cert.md),
[ADR 0088](../../docs/adr/0088-metrics-server-zone-spread.md),
[ADR 0089](../../docs/adr/0089-metrics-server-node-pool.md)).
That file is also not in the kustomization. It runs two replicas with
required hostname anti-affinity and soft zone spread (`ScheduleAnyway`
on `topology.kubernetes.io/zone`). `nodeSelector` requires
`computerpets/node-pool: api`, and `nodeAffinityPolicy: Honor` keeps
the zone count on those nodes. Kind and minikube do not apply it
(`enable_node_pool=false` does not label their nodes). A single-zone
set of labeled nodes still schedules both pods when two hostnames exist.
Create the kubelet CA object and the serving Secret, then apply it.
`kubectl top pods -n computerpets` must show cpu and memory. Until that
API answers, applying the HPA does not raise the replica count, so blue
can stay at 2.

```bash
# Prod only. Kubelet CA and serving Secret, then metrics-server, then the
# HPA after kubectl top answers.
kubectl -n kube-system create configmap metrics-server-kubelet-ca \
  --from-file=ca.crt=/path/to/kubelet-serving-ca.crt
kubectl -n kube-system create secret generic metrics-server-serving \
  --from-file=tls.crt=/path/to/tls.crt \
  --from-file=tls.key=/path/to/tls.key \
  --from-file=ca.crt=/path/to/serving-ca.crt
kubectl apply -f deploy/k8s/metrics-server.yaml
CA_B64="$(kubectl -n kube-system get secret metrics-server-serving \
  -o jsonpath='{.data.ca\.crt}')"
kubectl patch apiservice v1beta1.metrics.k8s.io --type=merge \
  -p "{\"spec\":{\"caBundle\":\"${CA_B64}\"}}"
kubectl apply -f deploy/k8s/hpa.yaml
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

## Hostname spread (ADR 0080)

Both API pod templates set `topologySpreadConstraints` on
`kubernetes.io/hostname`. `maxSkew` is 1. `whenUnsatisfiable` is
`ScheduleAnyway` (soft). The Kubernetes default is `DoNotSchedule`
(hard): the scheduler refuses the pod when the skew would exceed 1.
The default `nodeTaintsPolicy` is `Ignore`, so a tainted node counts
as a domain with zero pods. A worker that already holds one pod then
cannot take another, and a third pod stays Pending when two workers
hold one each and that tainted node is still at zero. That sticks the
HPA floor of 3. `ScheduleAnyway` still prefers a less-loaded hostname
and still binds. `nodeTaintsPolicy` here is `Honor`, so a node the pod
cannot tolerate is not that empty domain. Required hostname
anti-affinity is not set either: that is one pod per node, so the
second local replica, and any pod past the node count, would stay
Pending.

The selector is `app=computerpets` plus that Deployment's own color.
Blue pods do not count as green's spread, and green pods do not count
as blue's. There is no `minDomains`. The zone key is a second constraint
([ADR 0081](../../docs/adr/0081-api-pod-zone-spread.md)). Postgres and Redis
are not constrained. Local `replicas` stay 2 and 0. This rule is on the
pod template, so `kubectl apply -k` does apply it. It does not apply
`hpa.yaml` or `pdb.yaml`. The pool pin is
[ADR 0093](../../docs/adr/0093-api-node-pool.md). An unlabeled kind or
minikube node leaves the API pods Pending.

```bash
./deploy/k8s/check-topology-spread.sh
```

A cutover does not patch this. Scaling green creates pods from the
green template, which already has the same soft rule. The Service, HPA,
and PDB patches below are unchanged. Soft spread can still place every
pod of the live color on one node. A crash of that node is not blocked
by the budget.

## Zone spread (ADR 0081)

Both API pod templates add a second `topologySpreadConstraints` item on
`topology.kubernetes.io/zone`. `maxSkew` is 1. `whenUnsatisfiable` is
`ScheduleAnyway`. `nodeTaintsPolicy` is `Honor`. The selector is the
same color-scoped pair as the hostname item. Hostname spread stays.

`DoNotSchedule` is not used on the zone key. That action skips nodes
which omit `topology.kubernetes.io/zone`, so a laptop cluster would
leave the second pod Pending. It would also count a tainted node in
another zone as an empty domain and stick the HPA floor of 3. There is
no `minDomains`. A required zone anti-affinity is not set.

**Prod expectation:** schedulable workers in at least two availability zones
(three when the floor of 3 should land one pod per zone). Cloud
providers set the zone label. Private workers are one EKS managed node
group per zone ([ADR 0082](../../docs/adr/0082-multi-az-node-pool.md)).
This apply does not create them. A single-zone pool still schedules once
the nodes carry `computerpets/node-pool=api`
([ADR 0093](../../docs/adr/0093-api-node-pool.md)).
Soft spread can still place every pod of the live color in one zone. A
failure of that zone is not blocked by the budget.

```bash
./deploy/k8s/check-zone-spread.sh
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
skew count only nodes that match the selector. `whenUnsatisfiable`
stays `ScheduleAnyway`. `DoNotSchedule` is not set. One labeled node
still schedules both blue pods. A single labeled zone still schedules.
HPA and PDB are unchanged. Postgres and Redis are not pinned.

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

## Cluster Autoscaler (ADR 0083, ADR 0090, ADR 0091, ADR 0092)

`cluster-autoscaler.yaml` is **not** in the kustomization. `kubectl apply -k
deploy/k8s` does not install it. Kind and minikube set
`enable_node_pool=false`, which also skips the IRSA role.

The prod scaler runs in `kube-system` and changes desired capacity on the
Auto Scaling groups behind the per-zone node groups. Each group's max is
10, the HPA ceiling. The minimum stays 1. Terraform ignores `desired_size`
after the first apply. `--balance-similar-node-groups=true` keeps the two
zones from drifting apart. Scale-down still reads `poddisruptionbudgets`.

The Deployment sets `replicas: 2`. Pod anti-affinity is required on
`kubernetes.io/hostname` for `app: cluster-autoscaler` in `kube-system`,
so the second pod stays Pending until a second node exists. Beside that,
pod anti-affinity prefers a different zone (`topology.kubernetes.io/zone`,
weight 100). That preference is not required, and there is no
`topologySpreadConstraints` item, so a single-zone cluster still
schedules both pods when two hostnames exist. Do not apply this file on
kind or minikube. Rolling update is `maxUnavailable: 1` and `maxSurge: 0`,
so a replacement uses a hostname that is already free instead of asking
for a third node while both pods are up.

Leader election stays on: `--leader-elect=true`, lock `leases`, name
`cluster-autoscaler`. The ClusterRole can create leases and update that
named lease. Both pods use ServiceAccount `cluster-autoscaler` and the
one IRSA role. Only the leader calls `SetDesiredCapacity`. There is no
second role.

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
laptop apply schedule. A single-zone cluster whose nodes do carry the
label still schedules both pods when two hostnames exist, because the
zone rule stays preferred. The API Deployments select the same label
([ADR 0093](../../docs/adr/0093-api-node-pool.md)).

The committed manifest uses three tokens: `CLUSTER_NAME`, `AWS_REGION`, and
account `000000000000` on the role ARN. Substitute the cluster name, the
region, and the `cluster_autoscaler_role_arn` output before apply. The image
tag is `v1.36.1` (Kubernetes 1.36). A different cluster minor needs that
minor's latest patch instead. Do not commit a real account id.

```bash
./deploy/terraform/check-cluster-autoscaler.sh
```

Zone spread stays `ScheduleAnyway`. Adding a node does not force a pod
onto it.

## metrics-server (ADR 0084, ADR 0085, ADR 0086, ADR 0087, ADR 0088, ADR 0089)

`metrics-server.yaml` is **not** in the kustomization. `kubectl apply -k
deploy/k8s` does not install it. Kind and minikube do not apply it.

The file starts from upstream [high-availability-1.21+.yaml v0.9.0](https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/high-availability-1.21+.yaml).
Image `registry.k8s.io/metrics-server/metrics-server:v0.9.0`. The
APIService is `v1beta1.metrics.k8s.io`. That is the API `hpa.yaml` reads
for CPU and memory. Namespace is `kube-system`. There is no Helm chart
and no floating tag.

The Deployment sets `replicas: 2`. Pod anti-affinity is required on
`kubernetes.io/hostname`, so the second pod stays Pending until a second
node exists. Beside that, `topologySpreadConstraints` prefers a different
zone (`topology.kubernetes.io/zone`, `maxSkew: 1`, `whenUnsatisfiable:
ScheduleAnyway`, `nodeTaintsPolicy: Honor`). `DoNotSchedule` is not set,
and there is no required zone anti-affinity, so a single-zone cluster
and nodes that omit the zone label still schedule. The preference can
still place both pods in one zone. `nodeSelector` requires
`kubernetes.io/os: linux` and `computerpets/node-pool: api`. That pool
label is the one `deploy/terraform/modules/node_pool` already sets on
each multi-AZ group ([ADR 0089](../../docs/adr/0089-metrics-server-node-pool.md)).
`nodeAffinityPolicy: Honor` keeps the soft zone count on nodes that
match the selector. Linux nodes outside those groups do not receive
these pods and do not count. The selector is required. Kind and minikube
do not apply this file. `enable_node_pool=false` does not label their
nodes, so applying the file there leaves both pods Pending. That is the
feature-off path. A single-zone cluster whose nodes do carry the label
still schedules both pods when two hostnames exist, because zone spread
stays `ScheduleAnyway`. The API Deployments select the same label
([ADR 0093](../../docs/adr/0093-api-node-pool.md)).
Rolling update `maxUnavailable` is 1.
An addon `PodDisruptionBudget` in `kube-system` keeps `minAvailable: 1`. That
budget is not `pdb.yaml`.

`--kubelet-insecure-tls` is not set. Kubelet scrapes stay verified.
`--kubelet-certificate-authority` points at
`/etc/metrics-server/kubelet-ca/ca.crt`, a read-only mount of ConfigMap
`metrics-server-kubelet-ca` (key `ca.crt`, `optional: false`). This repo
does not vendor that certificate. A Secret with the same name, key, and
`optional: false` is the equivalent volume source. `hostPath` is not.
The flag replaces the in-cluster CA for kubelet scrapes, so the object
must be the CA that signed the kubelet serving certificates. A missing
object leaves the pods unstarted. A certificate that does not chain to
the bundle still leaves `kubectl top` empty. Do not add the kubelet TLS
skip.

`insecureSkipTLSVerify` is not set. `--tls-cert-file` and
`--tls-private-key-file` point at `/etc/metrics-server/serving/tls.crt`
and `tls.key`, a read-only mount of Secret `metrics-server-serving`
(keys `tls.crt` and `tls.key`, `optional: false`). This repo does not
vendor that certificate or key. `--cert-dir=/tmp` stays in the upstream
arg list and is ignored while both files are set, so the process does
not mint a serving cert. The certificate DNS SAN must include
`metrics-server.kube-system.svc`. A private CA is not a system root:
after apply, set APIService `caBundle` from the Secret's `ca.crt`. Do
not commit that field. A missing Secret leaves the pods unstarted. A
private cert with an empty `caBundle` leaves `kubectl top` empty. Do
not add `insecureSkipTLSVerify`.

Create the CA object and the serving Secret, then apply this file,
before `hpa.yaml`.

```bash
# Prod only. Not part of kubectl apply -k.
kubectl -n kube-system create configmap metrics-server-kubelet-ca \
  --from-file=ca.crt=/path/to/kubelet-serving-ca.crt
kubectl -n kube-system create secret generic metrics-server-serving \
  --from-file=tls.crt=/path/to/tls.crt \
  --from-file=tls.key=/path/to/tls.key \
  --from-file=ca.crt=/path/to/serving-ca.crt
kubectl apply -f deploy/k8s/metrics-server.yaml
CA_B64="$(kubectl -n kube-system get secret metrics-server-serving \
  -o jsonpath='{.data.ca\.crt}')"
kubectl patch apiservice v1beta1.metrics.k8s.io --type=merge \
  -p "{\"spec\":{\"caBundle\":\"${CA_B64}\"}}"
./deploy/k8s/check-metrics-server.sh
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
