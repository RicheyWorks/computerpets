# 0080. API pod topology spread

- **Status:** Superseded in part by [0100](0100-api-hostname-hard-spread.md) (hostname `whenUnsatisfiable` is `DoNotSchedule`; the zone action is [0095](0095-api-zone-hard-spread.md))
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/deployment-blue.yaml`; `deploy/k8s/deployment-green.yaml`; `deploy/k8s/check-topology-spread.sh`

## Context

[0079](0079-pod-disruption-budget.md) left this gap: the live API pods are not spread across nodes. Inventory on `main` tip `f781b21ea`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/deployment-blue.yaml` | Live color, local `replicas: 2`, `RollingUpdate` `maxUnavailable: 0` | No `topologySpreadConstraints`. No affinity. No anti-affinity |
| `deploy/k8s/deployment-green.yaml` | Idle color, `replicas: 0`, same container spec | Same omission. A cutover scale-up would pack green the same way |
| `deploy/k8s/hpa.yaml` | Prod floor of 3, ceiling 10, on `computerpets-blue` | Does not place pods. Not in the kustomization |
| `deploy/k8s/pdb.yaml` | `minAvailable: 2` on `app=computerpets, color=blue` | Does not place pods. If every pod of that color sits on one node, a drain of that node cannot keep two up elsewhere, and a crash of that node is involuntary |
| `deploy/k8s/kustomization.yaml` | Applies both Deployments. No `overlays/` directory | Local/dev shape is still blue 2 / green 0 |
| `deploy/k8s/postgres.yaml`, `redis.yaml` | Scaffolding, `replicas: 1` | Not the API |
| `deploy/k8s/service.yaml` | Selector `app=computerpets, color=blue` | The live color a spread selector has to follow, per Deployment |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, or the PDB `minAvailable` beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Both API Deployments prefer different nodes via `topologySpreadConstraints` on `kubernetes.io/hostname`. `whenUnsatisfiable` is `ScheduleAnyway` (soft). It is not `DoNotSchedule` (hard), and it is not a required hostname anti-affinity. The constraint is on the pod template, so local kustomize applies it. Local replica counts stay blue 2 / green 0.**

1. **Target.** One constraint on `computerpets-blue` and the same constraint on `computerpets-green`. `labelSelector.matchLabels` is `app: computerpets` plus that Deployment's own `color`. Green pods do not count toward blue's skew, and blue pods do not count toward green's. A selector of only `app: computerpets` would, during a cutover, treat the idle color as spread already satisfied and could leave the live color packed. Postgres and Redis are not constrained.
2. **Skew.** `maxSkew: 1`. On three nodes the floor of 3 lands one pod per node. On two nodes the floor lands 2 and 1, which is inside the skew, so the HPA minimum does not need a third node. `maxSkew: 0` is not used.
3. **Soft, not hard.** Kubernetes defaults `whenUnsatisfiable` to `DoNotSchedule`. That refuses to bind a pod when placing it would exceed `maxSkew`. `nodeTaintsPolicy` defaults to `Ignore`, so a tainted node still counts as a domain with zero pods. A worker that already holds one pod then cannot take another: the skew against that empty domain would be 2. The same arithmetic stops a third pod when two workers hold one each and a tainted node is still at zero, so the HPA floor of 3 never becomes Ready and the disruption budget has nothing it can move. `ScheduleAnyway` still prefers the less-loaded hostname and still binds. `nodeTaintsPolicy: Honor` drops nodes this pod cannot tolerate out of that count. Required hostname anti-affinity (`requiredDuringSchedulingIgnoredDuringExecution`) is a stricter rule: one pod per node. The second local replica would stay Pending on one node, and any pod past the node count would stay Pending up to the HPA ceiling of 10. The budget would then be counting pods that never became Ready. Preferred anti-affinity is not added. This constraint is the preference. On a single domain, `maxSkew: 1` is already skew 0, so `DoNotSchedule` would also admit every pod there. The soft action is what still binds when some other counted domain cannot take the pod.
4. **Fields not set.** No `minDomains`. `minDomains` is enforced only with `DoNotSchedule`, and a floor of N hostnames would strand a smaller cluster. No `matchLabelKeys`. Matching `pod-template-hash` would spread each ReplicaSet alone, so a rollout could stack the new pods while the old ones still occupy other nodes. No `nodeAffinityPolicy` (the cluster default applies; these pods have no node affinity). No zone key.
5. **Local/dev.** There is still no `overlays/` directory. `kubectl apply -k deploy/k8s` applies both Deployments, so it applies this soft constraint, and it still does not apply `hpa.yaml` or `pdb.yaml`. Blue stays `replicas: 2`. Green stays `replicas: 0`. `ScheduleAnyway` is what keeps those two pods schedulable on one node.
6. **Cutover.** No extra patch. Scaling green to 3 creates pods from the green template, which already carries the constraint. The Service, HPA, and PDB patches stay the ones in [0078](0078-horizontal-pod-autoscaling.md) and [0079](0079-pod-disruption-budget.md). In-color `RollingUpdate` (`maxUnavailable: 0`, `maxSurge: 1`) is unchanged. The surge pod is scored by the same soft rule.
7. **Verify without a cluster.** `check-topology-spread.sh` locks the markers: `maxSkew: 1`, hostname, `ScheduleAnyway`, `nodeTaintsPolicy: Honor`, color-scoped selector on both Deployments, no `DoNotSchedule`, no required anti-affinity, stores untouched, local replica counts unchanged. `check-topology-spread.test.sh` fails the gate when blue is switched to `DoNotSchedule`, when the blue selector drops `color: blue`, and when green drops the constraint. No `kubectl apply`.

## Consequences

- A laptop `kubectl apply -k deploy/k8s` applies both Deployments. API pods schedule only when a node carries `computerpets/node-pool=api` ([0093](0093-api-node-pool.md)). On one labeled node they may still share it, because `ScheduleAnyway` stays.
- `nodeTaintsPolicy` is the Kubernetes 1.26 node-inclusion field (beta, on by default). A cluster that rejects the field cannot apply these Deployments. `ScheduleAnyway` is the part that keeps the pod schedulable when the skew cannot be met.
- A keeper who applies `hpa.yaml` on a cluster with three schedulable nodes gets the floor of 3 preferred onto three hostnames. A pod still binds when the skew cannot be met, so a scale-up is not left Pending. The disruption budget can then evict one pod and keep two, including across a node drain, only when the remaining pods are actually on other nodes.
- `ScheduleAnyway` is a preference, not a placement guarantee. One node, a failed score, or a node that cannot fit another pod can still co-locate every pod of the live color. A crash of that node is involuntary. The budget does not apply. On two nodes the floor is 2+1. Draining the node that holds two can evict one pod. The second eviction waits until a replacement is Ready elsewhere, or the budget blocks it.
- Green stays at 0 until a human scales it. The committed constraint does not wake the idle color. When it is scaled, those pods prefer different hostnames without a selector patch.
- Postgres and Redis stay at one replica with no spread. They are scaffolding, not the API.
- Re-applying the Deployments does not retarget the HPA or the PDB. Those cutover patches are unchanged.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Soft zone spread landed as [0081](0081-api-pod-zone-spread.md). Not started in this ADR.
