# 0006. Spring dev / staging / prod profiles and Kubernetes manifests (not Helm)

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `application.yml`, `application-dev.yml`, `application-staging.yml`, `application-prod.yml`, `ProductionProfileGuard`; `deploy/k8s/`

## Context

One `application.yml` plus env vars is enough for `mvn` and tests. A
cluster still needs a fail-hard shape: Postgres, shared Redis, no
Microsoft `dev-mode`, no H2. Helm would add a chart, values files, and
a packaging story this repo does not have. A service mesh would add a
sidecar for a control-plane that is already one Deployment.

## Decision

**Profiles overlay the same YAML + env keys.** No second config format.

| Profile | Database | Rate-limit / deny-list store | Microsoft `dev-mode` |
|---------|----------|------------------------------|----------------------|
| *(none)* / `dev` | H2 unless `SPRING_DATASOURCE_*` is set (compose already points `dev` at Postgres) | Redis default; `memory` allowed | env, default false |
| `staging` | Postgres required | Redis | false in the file (env can still override) |
| `prod` | Postgres required | Redis **required** | **never** — `ProductionProfileGuard` refuses env overrides |

`SPRING_PROFILES_ACTIVE=prod` is the documented production shape. The
guard also refuses an H2 JDBC URL.

**Kubernetes lives in `deploy/k8s/`** (Kustomize, not Helm): namespace,
Secret, ConfigMap, in-cluster Postgres 16 + Redis 7 (compose-equivalent
scaffolding), app Deployment + Service, optional Ingress. Probes are
`/actuator/health/liveness` and `/readiness` (permitted without a JWT).

Blue/green is two Deployments (`computerpets-blue` live,
`computerpets-green` at 0 replicas) and a Service `color` selector.
No mesh.

## Consequences

- Forgetting `SPRING_PROFILES_ACTIVE=prod` on a cluster still boots the
  H2 default. The k8s ConfigMap must keep `prod`.
- In-cluster Postgres/Redis are not a managed HA pair. They match
  docker-compose so the manifests are honest scaffolding.
- Image signing is keyless cosign on GHCR publish + fail-closed verify
  ([0061](0061-ghcr-image-signing.md)). Managed stores are Terraform in
  `deploy/terraform/` ([0062](0062-terraform-managed-stores.md)); in-cluster
  Postgres/Redis remain scaffolding until a keeper applies that root.
  Secret *injection* is Docker `*_FILE` mounts or External Secrets /
  Vault agent into the existing Opaque Secret ([0056](0056-house-secrets-from-file-mounts.md));
  prod refuses plain env without attestation ([0064](0064-secret-operator-prod-refuses-plain-env.md)).
  A hosted Vault cluster is still the keeper's infrastructure.
- Helm values and a service mesh are non-goals until the app outgrows
  one Deployment and a selector flip.
- Prod API replica count is the HPA in `hpa.yaml` (min 3, max 3, not in this
  kustomization). Local apply stays blue 2 / green 0
  ([0078](0078-horizontal-pod-autoscaling.md),
  [0108](0108-api-single-zone-hostname-ceiling.md)).
- Voluntary disruption of that live color keeps 2 pods (`pdb.yaml`, also
  not in this kustomization) ([0079](0079-pod-disruption-budget.md)).
- Each API color hard-spreads hostnames (`DoNotSchedule` on
  `kubernetes.io/hostname`, `maxSkew` 1). One hostname still schedules.
  The second local replica is not left Pending by this item. Local
  replica counts stay blue 2 / green 0
  ([0080](0080-api-pod-topology-spread.md),
  [0100](0100-api-hostname-hard-spread.md)).
- Each API color hard-spreads zones (`DoNotSchedule` on
  `topology.kubernetes.io/zone`, `maxSkew` 1). One labeled zone still
  schedules. A node that omits the zone label does not
  ([0095](0095-api-zone-hard-spread.md)).
- Both API colors require `kubernetes.io/os: linux` and
  `computerpets/node-pool=api`. Kind and minikube leave those pods
  Pending until a node carries the pool label
  ([0093](0093-api-node-pool.md)).
- The API node group taints that key `NoSchedule`. Blue, green,
  metrics-server, and Cluster Autoscaler tolerate it. Kind and minikube
  are not tainted ([0094](0094-api-pool-taint.md)). `aws-node` records
  the same toleration on the `vpc-cni` addon. `kube-proxy` records it
  in a strategic-merge patch that this kustomization does not apply
  ([0096](0096-system-daemon-api-pool-toleration.md)). The EKS reassert
  hook for that patch is [0097](0097-kube-proxy-toleration-hook.md).
- Private workers in at least two zones are the node pool
  ([0082](0082-multi-az-node-pool.md)). This kustomization does not create them.
- Cluster Autoscaler grows those groups when pods are Pending
  ([0083](0083-cluster-autoscaler.md)). Two replicas, required hostname
  anti-affinity, hard zone spread (`DoNotSchedule` on
  `topology.kubernetes.io/zone`; one labeled zone still schedules), and leader election
  ([0090](0090-cluster-autoscaler-ha.md),
  [0099](0099-cluster-autoscaler-zone-hard-spread.md)). The standby is not
  the scaler. The scheduled leader raises the underfilled zone
  ([0101](0101-cluster-autoscaler-leader-scale.md)).
  `--salvo-scale-up=true` runs another choice in that same loop
  ([0102](0102-cluster-autoscaler-scale-up-salvo.md)).
  The `1m` budget stays. The next main loop is the retry when that
  salvo stops early
  ([0103](0103-cluster-autoscaler-salvo-early-stop.md)). `nodeSelector` requires
  `computerpets/node-pool=api` and linux, so kind and minikube stay off
  the file ([0091](0091-cluster-autoscaler-node-pool.md)). Voluntary
  disruption keeps one of those pods (`minAvailable: 1`,
  [0092](0092-cluster-autoscaler-pdb.md)). It is not in
  this kustomization.
- Resource metrics for the HPA are upstream metrics-server v0.9.0, two
  replicas with required hostname anti-affinity, hard zone spread
  (`DoNotSchedule` on `topology.kubernetes.io/zone`; one labeled zone
  still schedules), a kubelet CA mount, and
  a keeper serving certificate
  ([0084](0084-metrics-server.md), [0085](0085-metrics-server-ha.md),
  [0086](0086-metrics-server-kubelet-ca.md),
  [0087](0087-metrics-server-serving-cert.md),
  [0111](0111-metrics-server-serving-cert-chain.md),
  [0088](0088-metrics-server-zone-spread.md),
  [0089](0089-metrics-server-node-pool.md),
  [0098](0098-metrics-server-zone-hard-spread.md)).
  That manifest is not in this kustomization. `nodeSelector` requires
  `computerpets/node-pool=api`, so kind and minikube stay off the file.
  A single-zone set of labeled nodes still schedules both pods when two
  hostnames exist and the nodes carry one zone value. Do not set minDomains.
