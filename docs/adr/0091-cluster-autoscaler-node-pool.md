# 0091. Pin Cluster Autoscaler to the multi-AZ API node pool

- **Status:** Accepted (the disruption budget is [0092](0092-cluster-autoscaler-pdb.md); the nodeSelector stays)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/cluster-autoscaler.yaml`; `deploy/terraform/check-cluster-autoscaler.sh`

## Context

[0090](0090-cluster-autoscaler-ha.md) left this gap: the two Cluster Autoscaler pods are not pinned to `computerpets/node-pool=api`. Required hostname anti-affinity can be met by two nodes outside the groups this scaler manages. Inventory on `main` tip `e9397f623`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/cluster-autoscaler.yaml` | `replicas: 2`. Required pod anti-affinity on `kubernetes.io/hostname`. Preferred pod anti-affinity on `topology.kubernetes.io/zone` (weight 100). Leader election on the `leases` lock named `cluster-autoscaler`. Rolling update `maxUnavailable: 1`, `maxSurge: 0`. Out of the kustomization | No `nodeSelector`. No `computerpets/node-pool` key. Any two hostnames satisfy the required rule |
| `deploy/terraform/modules/node_pool/main.tf` | One private managed node group per availability zone, at least two. The only custom label is `computerpets/node-pool=api`. EKS sets `topology.kubernetes.io/zone` from the instance AZ. No taints | Did not place the scaler. API Deployments do not select the label ([0082](0082-multi-az-node-pool.md)) |
| `deploy/k8s/metrics-server.yaml` | `nodeSelector` is `kubernetes.io/os: linux` and `computerpets/node-pool: api` ([0089](0089-metrics-server-node-pool.md)) | Not this Deployment. Its zone rule is a spread constraint with `nodeAffinityPolicy: Honor` |
| `deploy/k8s/deployment-blue.yaml` and `deployment-green.yaml` | Soft hostname and zone spread | No `nodeSelector`. They are not pinned to the pool |
| `deploy/terraform/check-cluster-autoscaler.sh` | Fails closed on replicas, required hostname anti-affinity, the soft zone rule, leader election, and a kustomize listing | Did not require the pool label |

`nodeAffinityPolicy` is a field of `topologySpreadConstraints`. This Deployment has no spread constraint ([0090](0090-cluster-autoscaler-ha.md)). The zone rule is preferred pod anti-affinity, which matches other pods, not nodes. A `nodeSelector` is what stops the pods themselves from landing outside the labeled pool. Preferred node affinity would still admit those nodes.

The node-pool floor is one worker in each of at least two zones, and `min_size` stays 1, so scale-down does not take the labeled pool to zero. Kind and minikube do not apply this file and do not carry the label.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the node-pool shape beyond this label cross-link, metrics-server TLS/CA/zone/pin, or Cluster Autoscaler replica count, anti-affinity, and leader election beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/cluster-autoscaler.yaml` keeps `replicas: 2`, required hostname anti-affinity, preferred zone anti-affinity, and leader election, and its `nodeSelector` requires both `kubernetes.io/os: linux` and `computerpets/node-pool: api`. The pool label already exists on the multi-AZ groups. Kind and minikube stay on the feature-off path: they do not apply this file. A single-zone set of nodes that do carry the label still schedules both pods when two hostnames exist, because the zone rule stays preferred. The manifest stays out of the kustomization.**

1. **Target.** The Cluster Autoscaler pod template. `nodeSelector` adds `kubernetes.io/os: linux` and `computerpets/node-pool: api`. That value is the label `aws_eks_node_group.zone` already sets. This slice does not add a second label, a taint, a toleration, or a scaling change on the node pool.
2. **Required, not preferred.** The selector is a hard filter. `nodeAffinity` is not set. `preferredDuringSchedulingIgnoredDuringExecution` is not added for nodes. A preference would still place pods on nodes that lack the pool label. Required node affinity is not used in place of `nodeSelector`: the selector is the filter, and an extra required term can only narrow it.
3. **Hostname rule stays inside the pool.** `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` still matches `app: cluster-autoscaler` in `kube-system` on `kubernetes.io/hostname`. The selector runs first, so a hostname outside the labeled groups cannot satisfy that rule. A second labeled hostname is required or the second pod stays Pending.
4. **Soft zone stays soft.** Preferred pod anti-affinity on `topology.kubernetes.io/zone` (weight 100) stays. It is not required. It is not a `topologySpreadConstraints` item, so `nodeAffinityPolicy` does not apply and is not set. `DoNotSchedule` stays unset. A single-zone cluster whose nodes carry the label still schedules both pods when two hostnames exist. Required zone anti-affinity stays unset, so the standby can still start in the surviving zone.
5. **Leader election and IRSA stay.** `replicas: 2`, `--leader-elect=true`, the `leases` lock named `cluster-autoscaler`, `maxUnavailable: 1`, `maxSurge: 0`, and the one IRSA service account stay as [0090](0090-cluster-autoscaler-ha.md) set them. This slice does not add a second role or a live AWS apply.
6. **Kind and single-zone.** Kind and minikube do not apply this file, and `enable_node_pool=false` does not label their nodes. Applying `cluster-autoscaler.yaml` on a cluster whose nodes lack `computerpets/node-pool=api` leaves both pods Pending. That is the feature-off path. Do not delete the pool key to make a laptop apply schedule. A cluster that does carry the label on only one zone still runs both pods when two hostnames exist: the hostname rule is met, and the zone preference is not a hard gate. The node-pool plan still refuses fewer than two zones, so groups this module creates already span two zones. A one-node cluster still leaves the second pod Pending on the hostname rule from [0090](0090-cluster-autoscaler-ha.md).
7. **API Deployments stay unpinned.** Blue and green do not gain `nodeSelector` and do not select `computerpets/node-pool`. Their zone spread stays `ScheduleAnyway`.
8. **Still out of the kustomization.** `kubectl apply -k deploy/k8s` does not install the scaler on a laptop. Blue stays `replicas: 2`. Green stays `replicas: 0`.
9. **Verify without a cluster.** `check-cluster-autoscaler.sh` fails when the pool key or the linux key is missing from `nodeSelector`, when a second selector appears, when `nodeAffinity` replaces the selector, when the node-pool module stops setting `computerpets/node-pool=api`, when either API Deployment gains a `nodeSelector`, when replicas, hostname anti-affinity, the soft zone rule, or leader election regress, or when `kustomization.yaml` lists the file. `check-cluster-autoscaler.test.sh` proves a dropped pool key, a dropped linux key, a drifted pool label, and a pool selector added to blue. No `kubectl apply` and no `terraform apply`.

## Consequences

- On a cluster whose API workers carry `computerpets/node-pool=api` in at least two zones, both Cluster Autoscaler pods schedule only onto those workers. A node outside the groups does not receive a pod and does not satisfy the required hostname rule.
- A node that carries the label but is not in the managed groups can still take a replica. The label is the contract. This slice does not add a second selector.
- If every labeled node is gone, these pods stay Pending and cannot raise desired capacity until one labeled node exists. The pool floor is already one worker per zone. Kind and minikube have no such nodes. Do not apply this file there, and do not delete the pool key to make that apply schedule.
- Preferred zone anti-affinity can still place both pods in one zone. That is accepted. A hard zone rule would block the standby when only one zone remains.
- The API Deployments stay unpinned. Their pods can still schedule outside this label.
- The disruption budget is [0092](0092-cluster-autoscaler-pdb.md). `minAvailable` is 1. The nodeSelector stays.
- One running replica can still change desired capacity while the other is down, after it holds the lease. Both pods down still leaves Pending pods without new nodes until one replica is back and leading.
- Adding the file to `kustomization.yaml`, dropping either selector key, dropping to one replica, removing required hostname anti-affinity, making the zone rule required, turning leader election off, or floating the image tag fails `check-cluster-autoscaler.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The disruption budget is [0092](0092-cluster-autoscaler-pdb.md).
