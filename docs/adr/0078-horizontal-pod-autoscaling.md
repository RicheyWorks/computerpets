# 0078. Horizontal pod autoscaling

- **Status:** Accepted (the "does not install metrics-server" clause is superseded in part by [0084](0084-metrics-server.md); the ceiling of 10 is superseded in part by [0107](0107-api-hostname-ceiling.md); the HPA object otherwise stays)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/hpa.yaml`; `deploy/k8s/check-hpa.sh`

## Context

[0077](0077-api-listener-tls.md) left this gap: the deployment diagram says 3+ API replicas with HPA, and the manifests did not. Inventory on `main` tip `fc830f66a`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/deployment-blue.yaml` | Live API Deployment, `replicas: 2`, cpu request `250m`, memory request `512Mi`, memory limit `1Gi` | No autoscaler. Not the diagram's floor of 3 |
| `deploy/k8s/deployment-green.yaml` | Idle color, `replicas: 0`, same container resources | Must stay at 0 until a cutover. A resource HPA cannot scale from zero |
| `deploy/k8s/postgres.yaml`, `redis.yaml` | Scaffolding, `replicas: 1` | Not the API |
| `deploy/k8s/kustomization.yaml` | Applies blue and green. No `overlays/` directory | This is the local/dev apply. No `HorizontalPodAutoscaler` |
| Docs | Diagram label "3+ replicas, HPA enabled" | No metrics-server note |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, or API listener TLS beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**The prod API autoscaler is `deploy/k8s/hpa.yaml`. It is not in the kustomization. Local apply stays at blue 2 / green 0. Metrics-server is a cluster addon this repo does not install. CPU is a percent of the request. Memory is an absolute value above a quiet JVM, not a percent of the 512Mi request.**

The install clause in that sentence is the part [0084](0084-metrics-server.md) replaces. The ceiling of 10 in point 2 is the part [0107](0107-api-hostname-ceiling.md) replaces. `minReplicas` stays 3.

1. **Target.** One `autoscaling/v2` `HorizontalPodAutoscaler` named `computerpets`. `scaleTargetRef` is Deployment `computerpets-blue`, the Service's default live color. Green, Postgres, and Redis are not targets.
2. **Range.** `minReplicas: 3` (the diagram's floor). `maxReplicas: 10`. Scale up at most 2 pods per 60 seconds. Scale down waits 300 seconds and drops 1 pod per 60 seconds. The floor is the HPA minimum, not a disruption budget.
3. **Signals.** CPU `averageUtilization: 70` of the `250m` request. Memory `averageValue: 800Mi` (above the `512Mi` request, under the `1Gi` limit). A percent of the memory request would treat a normal JVM heap as load and pin the replica count. Both signals are `Resource` metrics. No External, Object, or Prometheus-adapter metric.
4. **Local/dev.** `kubectl apply -k deploy/k8s` does not apply `hpa.yaml`. Blue stays `replicas: 2`. Green stays `replicas: 0`. There is no overlay to scale. Same pattern as `ingress-tls.yaml`.
5. **metrics-server.** Resource metrics come from `metrics.k8s.io`. `kubectl top pods -n computerpets` must show cpu and memory before the autoscaler can leave the current replica count. This ADR did not ship a metrics-server Deployment. The install path landed as [0084](0084-metrics-server.md). If that API is absent, applying `hpa.yaml` does not raise blue from 2 to 3. The HPA object in this file is unchanged.
6. **Cutover.** Scale green by hand to 3 and wait Ready. Flip the Service selector to green. Patch this HPA's `scaleTargetRef.name` to `computerpets-green`. Then scale blue to 0. Scaling blue to 0 while the HPA still names blue brings blue back to 3. Re-applying the committed file points the autoscaler back at blue. Green keeps the same cpu request so a retarget still has a utilization base.
7. **Verify without a cluster.** `check-hpa.sh` locks the markers: floor 3, ceiling 10, blue-only target, memory absolute value, kustomize does not list the file, local replica counts unchanged. `check-hpa.test.sh` fails the gate when the floor drops below 3. No `kubectl apply`.

## Consequences

- A laptop `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment. It does not install metrics-server and it does not adopt the autoscaler.
- A keeper who applies `hpa.yaml` on a cluster without metrics-server gets the object and does not get a third pod. The dependency is named in the manifest and the README.
- A keeper who applies `hpa.yaml` where `kubectl top` works gets at least 3 blue pods and at most 10. A later `kubectl apply -k` sets blue back to 2 until the autoscaler reconciles. Apply the Deployment and the HPA in that order, or leave the replica field to the HPA after the first prod apply.
- Memory does not scale on heap residency under 800Mi. CPU does. A quiet JVM stays at the floor.
- Green stays at 0 until a human scales it. The committed HPA will not wake the idle color.
- Postgres and Redis stay at one replica. They are scaffolding, not the API.
- This HPA does not spread pods across nodes and does not stop a drain from evicting every API pod.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Pod disruption budget landed as [0079](0079-pod-disruption-budget.md). Not started in this ADR.
