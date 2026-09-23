# 0092. Pod disruption budget for Cluster Autoscaler

- **Status:** Accepted (the API pool pin is [0093](0093-api-node-pool.md); zone spread is [0099](0099-cluster-autoscaler-zone-hard-spread.md); `minAvailable` stays)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/cluster-autoscaler.yaml`; `deploy/terraform/check-cluster-autoscaler.sh`

## Context

[0091](0091-cluster-autoscaler-node-pool.md) left this gap: there is no PodDisruptionBudget on the Cluster Autoscaler Deployment. A drain of the leader's node drops that pod. The standby takes the lease only when it is already scheduled on another labeled hostname. Inventory on `main` tip `8729bfe20`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/cluster-autoscaler.yaml` | `replicas: 2`. Required hostname anti-affinity. Preferred zone anti-affinity. Leader election on the `leases` lock named `cluster-autoscaler`. `nodeSelector` `kubernetes.io/os: linux` and `computerpets/node-pool: api`. Rolling update `maxUnavailable: 1`, `maxSurge: 0`. Out of the kustomization | No `PodDisruptionBudget`. A voluntary drain can evict the leader even when the standby is the pod that should stay |
| `deploy/k8s/pdb.yaml` | `policy/v1` `minAvailable: 2` on `app=computerpets,color=blue` ([0079](0079-pod-disruption-budget.md)). Not in the kustomization. Apply only after the HPA floor is running | Does not select `app=cluster-autoscaler`. `minAvailable: 2` is the API floor, not this Deployment |
| `deploy/k8s/metrics-server.yaml` | Addon `PodDisruptionBudget` `minAvailable: 1` in `kube-system`, selector aligned with that Deployment ([0085](0085-metrics-server-ha.md)) | Not this Deployment. `check-pdb.sh` excludes that file from the API budget count |
| `deploy/k8s/check-pdb.sh` | Fails closed on the API budget: `policy/v1`, `minAvailable: 2`, blue selector, kustomize does not list `pdb.yaml` | Counts one API budget. An autoscaler budget in another file must stay out of that count |
| `deploy/terraform/check-cluster-autoscaler.sh` | Fails closed on replicas, anti-affinity, leader election, the pool pin, and a kustomize listing | Did not require a budget or a selector match |

The API budget uses `minAvailable: 2` because the HPA floor is 3, so one API pod can leave and two stay. This Deployment's replica count is 2. `minAvailable: 2` on it would allow zero voluntary evictions, the same stall `pdb.yaml` documents for a laptop shape that has only two Ready API pods. `minAvailable: 1` is the number that stays up. A percent and `maxUnavailable` are not used.

The budget selects pods. It does not place them. Required hostname anti-affinity and the pool pin stay what make the standby a different labeled hostname. A node crash and a zone loss are involuntary, so this budget does not apply to them. Kind and minikube do not apply this file.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the node-pool shape, metrics-server TLS/CA/zone/pin, or Cluster Autoscaler replica count, anti-affinity, leader election, and node-pool pin beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/cluster-autoscaler.yaml` keeps two replicas, required hostname anti-affinity, preferred zone anti-affinity, leader election, and the pool `nodeSelector`, and it adds one `policy/v1` `PodDisruptionBudget` named `cluster-autoscaler` in `kube-system`. `minAvailable` is 1. `spec.selector.matchLabels` is `app: cluster-autoscaler`, the Deployment selector. The file stays out of the kustomization. Kind and minikube do not apply it, so they do not install this budget.**

1. **Target.** The same manifest as the Deployment, not a second file and not `pdb.yaml`. One `policy/v1` `PodDisruptionBudget` named `cluster-autoscaler` in `kube-system`. `spec.selector.matchLabels` is exactly the Deployment selector: `app: cluster-autoscaler`. Green, the API colors, Postgres, Redis, and metrics-server are not selected. A selector that omits `app: cluster-autoscaler` would not protect these pods.
2. **Budget.** `minAvailable: 1`. Not `minAvailable: 2`. Not `minAvailable: 0`. Not a percent. Not `maxUnavailable`. With `replicas: 2`, one pod may be evicted. The other stays Ready so it can hold the lease or take it. `minAvailable: 2` would allow zero voluntary evictions and stall a drain of either labeled hostname.
3. **Not the API budget.** `pdb.yaml` stays `minAvailable: 2` on `color=blue` in `computerpets`. `check-pdb.sh` still counts that file as the one house budget. This object is excluded from that count the same way `metrics-server.yaml` is. This slice does not change the API number.
4. **High availability and the pool pin stay.** `replicas: 2`, required hostname anti-affinity, preferred zone anti-affinity, `--leader-elect=true` on the `leases` lock named `cluster-autoscaler`, rolling update `maxUnavailable: 1` and `maxSurge: 0`, and `nodeSelector` `kubernetes.io/os: linux` plus `computerpets/node-pool: api` stay as [0090](0090-cluster-autoscaler-ha.md) and [0091](0091-cluster-autoscaler-node-pool.md) set them. There is no second Deployment and no second IRSA role. No live AWS apply.
5. **Kind and minikube stay off.** They do not apply this file. `enable_node_pool=false` does not label their nodes and does not install this budget. Applying the file there leaves both pods Pending. That is the feature-off path. Do not delete the pool key, and do not drop the budget, to make a laptop apply schedule. `minAvailable: 1` with fewer than two Ready pods blocks eviction of the last Ready replica. Install the budget only with these two replicas.
6. **Still out of the kustomization.** `kubectl apply -k deploy/k8s` does not install the scaler or this budget. Blue stays `replicas: 2`. Green stays `replicas: 0`. There is no overlay directory.
7. **Voluntary disruption only.** A drain of the leader's node can evict that pod while the other Ready pod remains. The standby takes the lease only when it is already scheduled. A drain that would leave zero Ready pods is refused. A node crash or a zone loss is not blocked. Preferred zone anti-affinity can still place both pods in one zone. Required zone anti-affinity stays unset.
8. **Verify without a cluster.** `check-cluster-autoscaler.sh` fails when the budget is missing, when `minAvailable` is not 1 (including 2, 0, or a percent), when the selector does not match the Deployment, when the budget sets `maxUnavailable` or uses `policy/v1beta1`, when replicas, hostname anti-affinity, the soft zone rule, leader election, or the pool pin regress, or when `kustomization.yaml` lists the file. `check-cluster-autoscaler.test.sh` proves `minAvailable: 2`, a drifted selector, and a removed budget. No `kubectl apply` and no `terraform apply`.

## Consequences

- On a cluster running both replicas, a voluntary drain may evict one Cluster Autoscaler pod. The other stays. If that other pod is already the leader, it keeps the lease. If the drained pod was the leader, the remaining pod can take the lease after the leader releases it. Only the leader changes desired capacity.
- `minAvailable: 1` with one Ready pod blocks a drain of that last pod. That is the spare the lease needs. `minAvailable: 2` is rejected by the check because it would block every voluntary eviction.
- A node crash is involuntary. This budget does not keep a pod that was only on the crashed node. The standby takes the lease only when it was already scheduled on another labeled hostname.
- Draining every labeled node that holds a Ready replica cannot finish while that would leave zero Ready pods. If no other labeled hostname can take the evicted pod, the drain stalls. That is the budget.
- Kind and minikube do not install this object. Do not apply `cluster-autoscaler.yaml` there.
- The API budget is unchanged. A cutover still patches `pdb.yaml`'s color with the HPA.
- Adding the file to `kustomization.yaml`, dropping the budget, raising `minAvailable` to 2, drifting the selector, dropping to one replica, removing required hostname anti-affinity, dropping either `nodeSelector` key, or turning leader election off fails `check-cluster-autoscaler.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The API pool pin is [0093](0093-api-node-pool.md).
