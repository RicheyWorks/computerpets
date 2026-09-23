# 0090. High availability for Cluster Autoscaler

- **Status:** Superseded in part by [0099](0099-cluster-autoscaler-zone-hard-spread.md) (the zone rule is `DoNotSchedule` spread, not a preferred anti-affinity; replicas, required hostname anti-affinity, and leader election stay; the pool pin is [0091](0091-cluster-autoscaler-node-pool.md); the disruption budget is [0092](0092-cluster-autoscaler-pdb.md))
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/cluster-autoscaler.yaml`; `deploy/terraform/check-cluster-autoscaler.sh`

## Context

[0089](0089-metrics-server-node-pool.md) left this gap: Cluster Autoscaler is one replica with no anti-affinity. A dead replica stops Pending pods from getting nodes until that pod is back. Inventory on `main` tip `fdf858779`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/cluster-autoscaler.yaml` | One Deployment in `kube-system`. Image `registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1`. IRSA annotation on ServiceAccount `cluster-autoscaler`. ClusterRole can create leases and get/update the lease named `cluster-autoscaler`. Out of the kustomization | `replicas: 1`. No pod anti-affinity. No `--leader-elect` arg. The v1.36.1 binary defaults that flag to true, the lock to `leases`, and the name to `cluster-autoscaler`, but the manifest did not say so |
| `deploy/terraform/modules/cluster_autoscaler/main.tf` | One IRSA role. Trust subject `system:serviceaccount:kube-system:cluster-autoscaler`. Tag-scoped `SetDesiredCapacity`. No EC2 instance principal | Does not run a second role for a second pod. Kind and minikube keep the role off |
| `deploy/terraform/check-cluster-autoscaler.sh` | Fails closed on a max under the HPA ceiling, a desired-size reset, a real account id, and a kustomize listing | Required `replicas: 1` |
| Node pool ([0082](0082-multi-az-node-pool.md)) | At least two zones, one worker each at the floor. No taints | Does not place the scaler |

Leader election in cluster-autoscaler v1.36.1 starts the scale loop only after the replica wins the lease. `OnStoppedLeading` exits the process that lost it. The lease namespace is `--namespace` (`kube-system`). The default lease duration is 15 seconds. Both pods can hold the same IRSA token. Only the leader calls `autoscaling:SetDesiredCapacity`. A second role is not required.

Required zone anti-affinity is the wrong follow-up. During a zone loss the standby must still schedule in the zone that remains. A hard zone rule would leave that pod Pending. Kind and minikube do not apply this file.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the node-pool shape, metrics-server TLS/CA/zone/pin, or the IRSA trust beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/cluster-autoscaler.yaml` sets `replicas: 2`, required pod anti-affinity on `kubernetes.io/hostname`, and preferred pod anti-affinity on `topology.kubernetes.io/zone`. Leader election stays on, pinned to the leases lock named `cluster-autoscaler`. Both pods use the one IRSA service account from [0083](0083-cluster-autoscaler.md). The manifest stays out of the kustomization.**

1. **Two pods.** `replicas: 2` is set. `1` is the single-pod shape this slice replaces. `priorityClassName` stays `system-cluster-critical`. The container stays non-root, drops all capabilities, and uses a read-only root filesystem. No host network, no host PID, no privileged flag. There is no second Deployment and no PodDisruptionBudget in this file.
2. **Required hostname anti-affinity.** `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` matches `app: cluster-autoscaler` in namespace `kube-system`, `topologyKey: kubernetes.io/hostname`. It is not `preferredDuringSchedulingIgnoredDuringExecution` for that key. A second hostname is required or the second pod stays Pending. Kind and minikube do not apply this file. The node-pool floor is already one worker in each of at least two zones.
3. **Soft zone.** The same `podAntiAffinity` adds `preferredDuringSchedulingIgnoredDuringExecution` with weight 100, the same label and namespace, and `topologyKey: topology.kubernetes.io/zone`. It is not required. It is not a `topologySpreadConstraints` item and not `DoNotSchedule`. A single-zone cluster still schedules both pods when two hostnames exist. A zone that cannot fit the second pod still schedules it. Required zone anti-affinity is not set, so the standby can still start in the surviving zone.
4. **Rolling update on two hostnames.** `strategy.rollingUpdate` is `maxUnavailable: 1` and `maxSurge: 0`. The default surge would ask for a third hostname while both pods are up. Required anti-affinity would leave that surge Pending, and the Deployment being updated is the component that adds nodes. Replacing one pod at a time uses a hostname the terminated pod already held.
5. **Leader election stays on.** The container command sets `--leader-elect=true`, `--leader-elect-resource-lock=leases`, and `--leader-elect-resource-name=cluster-autoscaler`. Those match the v1.36.1 defaults and the ClusterRole, which can create `coordination.k8s.io` leases and get/update the lease named `cluster-autoscaler`. The lease lives in `kube-system` because `--namespace=kube-system` is the lock namespace this binary uses. Turning the flag off would let both replicas call `SetDesiredCapacity`.
6. **One IRSA role.** ServiceAccount `cluster-autoscaler` keeps the placeholder `eks.amazonaws.com/role-arn`. Both replicas mount that account. The trust subject stays `system:serviceaccount:kube-system:cluster-autoscaler`. This slice does not add an EC2 principal, a second role, or a live AWS apply. Tag-scoped scale and the explicit denies from [0083](0083-cluster-autoscaler.md) stay.
7. **Still out of the kustomization.** `kubectl apply -k deploy/k8s` does not install two autoscaler pods on a laptop. Blue stays `replicas: 2`. Green stays `replicas: 0`. `enable_node_pool=false` still skips the role.
8. **Verify without a cluster.** `check-cluster-autoscaler.sh` fails when replicas is not 2, when hostname anti-affinity is missing or not required, when the zone preference is missing or required, when a topology spread constraint or `DoNotSchedule` appears, when leader election is off or the lock is not the named lease, when the lease RBAC is gone, or when `kustomization.yaml` lists the file. `check-cluster-autoscaler.test.sh` proves the replica drop, the missing hostname rule, leader election turned off, and the missing zone preference. No `kubectl apply` and no `terraform apply`.

## Consequences

- One running replica can still change desired capacity while the other is down, after it holds the lease. Both pods down still leaves Pending pods without new nodes until one replica is back and leading. Losing the lease waits out the 15-second duration unless the process releases it first.
- A one-node cluster that applies this file leaves the second pod Pending. Do not apply it on kind or minikube. Local `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment.
- Preferred zone anti-affinity can still place both pods in one zone. That is accepted. A hard zone rule would block the standby when only one zone remains.
- The pool pin is [0091](0091-cluster-autoscaler-node-pool.md). Required hostname anti-affinity and leader election stay. The API pool pin is [0093](0093-api-node-pool.md).
- The disruption budget is [0092](0092-cluster-autoscaler-pdb.md). Replicas, anti-affinity, and leader election stay.
- The image tag stays `v1.36.1`. A keeper whose cluster minor is older replaces the tag with that minor's latest patch before apply. `:latest` is not used.
- Adding the file to `kustomization.yaml`, dropping to one replica, removing required hostname anti-affinity, making the zone rule required, turning leader election off, or floating the image tag fails `check-cluster-autoscaler.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The pool pin is [0091](0091-cluster-autoscaler-node-pool.md).
