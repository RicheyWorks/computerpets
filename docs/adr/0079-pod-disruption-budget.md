# 0079. Pod disruption budget

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/pdb.yaml`; `deploy/k8s/check-pdb.sh`

## Context

[0078](0078-horizontal-pod-autoscaling.md) left this gap: `minReplicas: 3` does not stop a node drain from evicting every API pod. Inventory on `main` tip `28c2e9b74`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/hpa.yaml` | Prod floor of 3 on Deployment `computerpets-blue` | Not a disruption budget. A drain uses the Eviction API |
| `deploy/k8s/deployment-blue.yaml` | Live color, local `replicas: 2`, `RollingUpdate` `maxUnavailable: 0` | Rollout surge is not a node drain |
| `deploy/k8s/deployment-green.yaml` | Idle color, `replicas: 0` | Must stay at 0 until a cutover |
| `deploy/k8s/service.yaml` | Selector `app=computerpets, color=blue` | The live color a budget has to follow |
| `deploy/k8s/kustomization.yaml` | Applies blue and green. No `PodDisruptionBudget` | Local/dev apply. Same omission as `hpa.yaml` |
| `deploy/k8s/postgres.yaml`, `redis.yaml` | Scaffolding, `replicas: 1` | Not the API |
| Docs | "A node drain can still evict every API pod" | No budget, no cutover step |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, or the HPA metrics and replica range beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**The prod API disruption budget is `deploy/k8s/pdb.yaml`. It is not in the kustomization. It keeps 2 pods of the live Service color available during voluntary disruption. The HPA floor of 3 is what makes that budget movable: one pod can leave, two stay.**

1. **Target.** One `policy/v1` `PodDisruptionBudget` named `computerpets`. `spec.selector.matchLabels` is `app: computerpets` and `color: blue`, the Service's default live color. Green, Postgres, and Redis are not selected. A selector of only `app: computerpets` would count both colors during a cutover and would allow the live color to drop below 2.
2. **Budget.** `minAvailable: 2`. Not a percent. Not `maxUnavailable`. Not `minAvailable: 3`: at the HPA floor of 3 that would allow zero voluntary evictions, so a drain could not move a pod. Two is the number that stays up. The third pod, and any pod above the floor, may be evicted.
3. **What it covers.** Voluntary disruption only: `kubectl drain`, the Eviction API, and a cluster autoscaler that honors budgets. `kubectl scale` is not an eviction. In-color `RollingUpdate` (`maxUnavailable: 0`, `maxSurge: 1`) is unchanged. A node crash, a kubelet failure, and an OOM kill are involuntary and are not blocked.
4. **Local/dev.** `kubectl apply -k deploy/k8s` does not apply `pdb.yaml`. Blue stays `replicas: 2`. Green stays `replicas: 0`. Applying this file while only 2 pods are Ready allows zero evictions and stalls a drain. Apply it after `hpa.yaml` has actually reached 3. Same pattern as `hpa.yaml`: no overlay directory.
5. **Cutover.** Scale green by hand to 3 and wait Ready. Flip the Service selector to green. Patch the HPA `scaleTargetRef` to `computerpets-green` ([0078](0078-horizontal-pod-autoscaling.md)). Patch this budget's `spec.selector.matchLabels.color` to `green` in the same cutover, before scaling blue to 0. Scaling blue to 0 is not blocked by the budget. Leaving the selector on blue protects the color that is going idle and leaves the live color with no budget. Re-applying the committed file points the selector back at blue.
6. **Verify without a cluster.** `check-pdb.sh` locks the markers: `policy/v1`, `minAvailable: 2`, blue-only selector, kustomize does not list the file, local replica counts unchanged. `check-pdb.test.sh` fails the gate when the budget drops below 2 and when the selector drops `color: blue`. The Cluster Autoscaler budget in `cluster-autoscaler.yaml` is excluded from this count, same as `metrics-server.yaml` ([0092](0092-cluster-autoscaler-pdb.md)). No `kubectl apply`.

## Consequences

- A laptop `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment. It does not adopt the budget. A drain of that laptop cluster is unchanged.
- A keeper who applies `pdb.yaml` while blue is still at 2 (metrics-server absent, HPA not reconciled) gets an object that allows zero voluntary evictions. The dependency is named in the manifest and the README.
- A keeper who applies `pdb.yaml` after the live color has at least 3 Ready pods can drain one API pod at a time. Two of that color stay. At the HPA ceiling of 10 the same budget still allows a voluntary disruption to drop the live color to 2.
- Green stays at 0 until a human scales it. The committed budget does not select green.
- Postgres and Redis stay at one replica with no budget. They are scaffolding, not the API.
- Re-applying `pdb.yaml` after a green cutover points the budget back at blue. Patch the live color again, or the idle color is what a drain protects.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Soft hostname spread landed as [0080](0080-api-pod-topology-spread.md). Not started in this ADR.
