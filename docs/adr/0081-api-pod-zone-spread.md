# 0081. API pod zone spread

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/deployment-blue.yaml`; `deploy/k8s/deployment-green.yaml`; `deploy/k8s/check-zone-spread.sh`

## Context

[0080](0080-api-pod-topology-spread.md) left this gap: soft hostname spread does not place pods in different availability zones. Inventory on `main` tip `9c93aa3be`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/deployment-blue.yaml` | One `topologySpreadConstraints` item: `kubernetes.io/hostname`, `maxSkew: 1`, `ScheduleAnyway`, `nodeTaintsPolicy: Honor`, selector `app=computerpets, color=blue` | No `topology.kubernetes.io/zone` item. A node pool that meets hostname `maxSkew: 1` can still sit in one zone |
| `deploy/k8s/deployment-green.yaml` | The same hostname item, selector `color=green` | Same omission. A cutover scale-up would pack green into one zone |
| `deploy/k8s/check-topology-spread.sh` | Locked a single hostname key and rejected a zone key | The rejection was the gap, not a second constraint |
| `deploy/k8s/hpa.yaml` | Prod floor of 3, ceiling 10, on `computerpets-blue` | Does not place pods. Not in the kustomization |
| `deploy/k8s/pdb.yaml` | `minAvailable: 2` on the live color | Does not place pods. A zone outage is involuntary, so the budget does not apply |
| `deploy/k8s/kustomization.yaml` | Applies both Deployments | No cluster and no node pool. Local/dev shape is still blue 2 / green 0 |
| `deploy/terraform/` | Managed Postgres, Redis, secrets, CDN, WAF | No EKS cluster and no node group. Zone labels are whatever the keeper's nodes already carry |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the PDB `minAvailable`, or the hostname constraint beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Both API Deployments keep the soft hostname constraint and add a second soft constraint on `topology.kubernetes.io/zone`. `maxSkew` is 1. `whenUnsatisfiable` is `ScheduleAnyway`. `nodeTaintsPolicy` is `Honor`. The zone action is not `DoNotSchedule`. Local replica counts stay blue 2 / green 0. Prod is expected to run workers in at least two availability zones. This repo does not provision that node pool.**

1. **Target.** A second list item on `computerpets-blue` and the same item on `computerpets-green`. `labelSelector.matchLabels` is `app: computerpets` plus that Deployment's own `color`, matching the hostname item ([0080](0080-api-pod-topology-spread.md)). Green pods do not count toward blue's zone skew. Postgres and Redis are not constrained.
2. **Skew.** `maxSkew: 1` on the zone key, beside `maxSkew: 1` on hostname. On three zones the floor of 3 prefers one pod per zone. On two zones the floor prefers 2 and 1, which is inside the skew, so the HPA minimum does not need a third zone. `maxSkew: 0` is not used.
3. **Soft, not hard.** `DoNotSchedule` on `topology.kubernetes.io/zone` refuses nodes that omit the label. Kind, minikube, and a laptop node omit it. The same hard action, with the default `nodeTaintsPolicy: Ignore`, counts a tainted node in another zone (or with an empty zone label) as a domain at zero and then refuses further pods in the worker zone once the skew would exceed 1. That leaves the HPA floor Pending. `ScheduleAnyway` still prefers the less-loaded zone and still binds. `nodeTaintsPolicy: Honor` drops nodes this pod cannot tolerate out of that count. The hostname item stays `ScheduleAnyway` as well. The two constraints are both preferences. Neither is a placement guarantee.
4. **Fields not set.** No `minDomains`. It is enforced only with `DoNotSchedule`, and a floor of N zones would strand a smaller cluster. No `matchLabelKeys`. No `nodeAffinityPolicy`. No required zone anti-affinity. The hostname item is not removed and is not rewritten into a hard rule.
5. **Prod multi-AZ expectation.** A production cluster should run schedulable workers in at least two availability zones, three when the operator wants the floor of 3 to land one pod per zone. Those nodes should carry the label `topology.kubernetes.io/zone` (cloud providers set it). This repository does not ship an EKS cluster, a node group, or a subnet layout. Applying the Deployments does not create a second zone.
6. **Local/dev.** There is still no `overlays/` directory. `kubectl apply -k deploy/k8s` applies both constraints and still does not apply `hpa.yaml` or `pdb.yaml`. Blue stays `replicas: 2`. Green stays `replicas: 0`. One zone, or nodes with no zone label, still schedule because the action is `ScheduleAnyway`.
7. **Cutover.** No extra patch. Scaling green creates pods from the green template, which already carries both constraints. The Service, HPA, and PDB patches stay the ones in [0078](0078-horizontal-pod-autoscaling.md) and [0079](0079-pod-disruption-budget.md).
8. **Verify without a cluster.** `check-zone-spread.sh` locks the zone item: `maxSkew: 1`, `topology.kubernetes.io/zone`, `ScheduleAnyway`, `nodeTaintsPolicy: Honor`, color-scoped selector, hostname item still present, no `DoNotSchedule`, no `minDomains`, stores untouched, local replica counts unchanged. `check-zone-spread.test.sh` fails the gate when only the blue zone item is switched to `DoNotSchedule`, when the blue zone selector drops `color: blue`, and when green drops the zone key. `check-topology-spread.sh` still locks the hostname item and now expects the zone key beside it. No `kubectl apply`.

## Consequences

- A laptop `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment. Those two pods may share a node and a zone. The scheduler is allowed to do that.
- `nodeTaintsPolicy` is the same Kubernetes 1.26 field as the hostname item. A cluster that rejects the field cannot apply these Deployments. `ScheduleAnyway` is the part that keeps the pod schedulable when the zone skew cannot be met, including when the label is absent.
- A keeper who applies `hpa.yaml` on a cluster whose workers already span three zones gets the floor of 3 preferred onto three zones and, within a zone, onto different hostnames. A pod still binds when either skew cannot be met. On two zones the floor prefers 2+1. Draining the zone that holds two can evict one pod. The second eviction waits until a replacement is Ready elsewhere, or the budget blocks it. A crash of a zone is not a voluntary disruption.
- `ScheduleAnyway` is a preference, not a placement guarantee. One zone, nodes that omit the label, a failed score, or a zone that cannot fit another pod can still co-locate every pod of the live color. A failure of that zone is involuntary. The budget does not apply.
- Green stays at 0 until a human scales it. The committed constraint does not wake the idle color.
- Postgres and Redis stay at one replica with no zone spread. They are scaffolding, not the API.
- Re-applying the Deployments does not retarget the HPA or the PDB.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Soft zone spread does not create a second zone. This repo ships no cluster and no node pool, so every node can still carry one `topology.kubernetes.io/zone` value, or none. `ScheduleAnyway` still binds the live pods into that single domain. A failure of that zone is involuntary, and the disruption budget does not apply. `DoNotSchedule` is not the fix: it strands a local cluster and any node that omits the zone label. Not started here.
