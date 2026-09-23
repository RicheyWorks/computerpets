# 0093. Pin the API Deployments to the multi-AZ API node pool

- **Status:** Accepted (the selector stays; zone `whenUnsatisfiable` is `DoNotSchedule` in [0095](0095-api-zone-hard-spread.md); hostname `whenUnsatisfiable` is `DoNotSchedule` in [0100](0100-api-hostname-hard-spread.md))
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/deployment-blue.yaml`; `deploy/k8s/deployment-green.yaml`; `deploy/k8s/check-api-node-pool.sh`

## Context

[0092](0092-cluster-autoscaler-pdb.md) left this gap: the API Deployments are not pinned to `computerpets/node-pool=api`. metrics-server and Cluster Autoscaler already require that label. Blue and green can still schedule onto nodes outside the groups those addons use. Inventory on `main` tip `cb4134451`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/deployment-blue.yaml` and `deployment-green.yaml` | Soft hostname and zone spread (`maxSkew: 1`, `ScheduleAnyway`, `nodeTaintsPolicy: Honor`). Local replicas blue 2 / green 0. Both are in the kustomization | No `nodeSelector`. No `computerpets/node-pool` key. No `nodeAffinityPolicy`. Any linux node satisfies the soft spread |
| `deploy/k8s/metrics-server.yaml` | `nodeSelector` is `kubernetes.io/os: linux` and `computerpets/node-pool: api`. Zone item sets `nodeAffinityPolicy: Honor` ([0089](0089-metrics-server-node-pool.md)) | Not these Deployments. Out of the kustomization |
| `deploy/k8s/cluster-autoscaler.yaml` | Same two `nodeSelector` keys ([0091](0091-cluster-autoscaler-node-pool.md)). `PodDisruptionBudget` `minAvailable: 1` ([0092](0092-cluster-autoscaler-pdb.md)) | Not these Deployments. Preferred zone anti-affinity stays preferred. Out of the kustomization |
| `deploy/terraform/modules/node_pool/main.tf` | One private managed node group per availability zone, at least two. The only custom label is `computerpets/node-pool=api`. No taints | Did not place the API. The module comment said the Deployments do not select the label |
| `deploy/k8s/hpa.yaml` / `pdb.yaml` | Prod floor 3, ceiling 10, `minAvailable: 2` on the live color | Do not place pods. Not in the kustomization |
| `deploy/k8s/postgres.yaml` and `redis.yaml` | In-cluster scaffolding, one replica each | Not the API. They stay unpinned so a laptop store still schedules |

A preferred node affinity would still admit nodes that lack the pool label. Required zone spread is still the wrong follow-up: `DoNotSchedule` on `topology.kubernetes.io/zone` leaves pods Pending when every labeled node shares one zone, or omits the zone label. Kind and minikube apply these two files. `enable_node_pool=false` does not label their nodes and does not strip this selector.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread beyond `nodeAffinityPolicy: Honor`, the node-pool shape beyond this label cross-link, metrics-server TLS/CA/zone/pin, or Cluster Autoscaler replica count, anti-affinity, leader election, node-pool pin, and disruption budget beyond this cross-link. Required zone anti-affinity for Cluster Autoscaler stays unset. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`computerpets-blue` and `computerpets-green` keep soft hostname and zone spread, and each pod template `nodeSelector` requires both `kubernetes.io/os: linux` and `computerpets/node-pool: api`. Both spread items set `nodeAffinityPolicy: Honor`, so the skew counts only nodes that match that selector. The pool label already exists on the multi-AZ groups. Kind and minikube apply these Deployments. Pods stay Pending until a node carries the label. `ScheduleAnyway` stays, so one labeled node still schedules both blue replicas. HPA and PDB are unchanged. Postgres and Redis stay unpinned.**

1. **Target.** The blue and green pod templates. `nodeSelector` is exactly `kubernetes.io/os: linux` and `computerpets/node-pool: api`. That value is the label `aws_eks_node_group.zone` already sets. This slice does not add a second label, a taint, a toleration, or a scaling change on the node pool. Postgres and Redis do not gain a selector.
2. **Required, not preferred.** The selector is a hard filter. `nodeAffinity` is not set. `preferredDuringSchedulingIgnoredDuringExecution` is not added for nodes. A preference would still place API pods on nodes that lack the pool label. Required node affinity is not used in place of `nodeSelector`: the selector is the filter, and an extra required term can only narrow it.
3. **Spread stays soft, and counts only eligible nodes.** Both `topologySpreadConstraints` items keep `maxSkew: 1`, `whenUnsatisfiable: ScheduleAnyway`, `nodeTaintsPolicy: Honor`, and the color-scoped selector. Each item adds `nodeAffinityPolicy: Honor`. Honor drops nodes that fail `nodeSelector` out of the skew. `Ignore` would count nodes outside the API groups as empty domains again. `DoNotSchedule` and `minDomains` stay unset. There is no required hostname anti-affinity and no required zone anti-affinity.
4. **Kind and minikube.** These Deployments are in the kustomization, so `kubectl apply -k deploy/k8s` installs the selector. Kind and minikube nodes carry `kubernetes.io/os=linux` and do not carry `computerpets/node-pool=api` unless a human labels them. The API pods stay Pending until that label exists. That is the missing-label path. Do not delete the pool key to make a laptop apply schedule. Label the node (`computerpets/node-pool=api`) when a local cluster should run the API. `enable_node_pool=false` does not add the label and does not remove the selector. A single labeled node still schedules both blue pods: hostname and zone spread stay `ScheduleAnyway`. Green stays `replicas: 0`, so it does not need a node until a human scales it. Postgres and Redis have no selector, so the laptop stores still schedule on an unlabeled node.
5. **HPA and PDB stay.** `hpa.yaml` stays min 3 / max 10 on `computerpets-blue`. `pdb.yaml` stays `minAvailable: 2` on the live color. Neither file is in the kustomization. The selector does not change their targets. A budget applied while every API pod is Pending has nothing Ready to protect.
6. **Single labeled zone.** A cluster whose labeled nodes share one zone, or omit `topology.kubernetes.io/zone`, still schedules. `ScheduleAnyway` binds the skew it cannot meet. The node-pool plan still refuses fewer than two zones, so groups this module creates already span two zones. Required zone anti-affinity for Cluster Autoscaler stays unset.
7. **Verify without a cluster.** `check-api-node-pool.sh` fails when either color drops the pool key or the linux key, when a second selector appears, when `nodeAffinity` replaces the selector, when `nodeAffinityPolicy` is missing or `Ignore`, when `DoNotSchedule` returns, when the node-pool module stops setting `computerpets/node-pool=api`, when Postgres or Redis gains a `nodeSelector`, or when the HPA floor, the HPA ceiling, or the API PDB `minAvailable` drifts. `check-api-node-pool.test.sh` proves a dropped pool key, a dropped linux key, `nodeAffinityPolicy: Ignore`, a nodeAffinity block, a drifted pool label, a hard zone item, and a pool selector on Postgres. No `kubectl apply` and no `terraform apply`.

## Consequences

- On a cluster whose API workers carry `computerpets/node-pool=api` in at least two zones, blue and green schedule only onto those workers, and the soft hostname and zone rules count only those workers. A node outside the groups does not receive an API pod and does not count as an empty hostname or zone.
- `ScheduleAnyway` is still a preference inside that set. One labeled zone, labeled nodes that omit `topology.kubernetes.io/zone`, a failed score, or a zone that cannot fit another pod can still co-locate every pod of the live color. Required zone spread is still not the follow-up.
- Kind and minikube apply this pin. Until a node is labeled `computerpets/node-pool=api`, the API pods stay Pending. Do not delete the pool key to make that apply schedule. Postgres and Redis still start on the unlabeled node.
- The pool has no taint. A pod that does not select the label can still land on an API worker. This slice does not add a taint or a toleration.
- A node that carries the label but is not in the managed groups can still take an API pod. The label is the contract. This slice does not add a second selector.
- HPA and PDB are unchanged. Applying `pdb.yaml` before any API pod is Ready does not create a spare.
- `nodeAffinityPolicy` is the same Kubernetes field family as `nodeTaintsPolicy`. A cluster that rejects the field cannot apply these Deployments.
- Dropping either selector key, setting `nodeAffinityPolicy: Ignore`, adding `nodeAffinity`, adding `DoNotSchedule`, or pinning Postgres or Redis fails `check-api-node-pool.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The API pool taint is [0094](0094-api-pool-taint.md).
