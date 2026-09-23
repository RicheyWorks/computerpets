# 0088. Zone spread for metrics-server

- **Status:** Accepted (the pool pin is [0089](0089-metrics-server-node-pool.md); soft zone spread and required hostname anti-affinity stay)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`

## Context

[0087](0087-metrics-server-serving-cert.md) left this gap: required anti-affinity is hostname-only, so both metrics-server pods can still land in one zone. Inventory on `main` tip `51db4a68d`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | Upstream `high-availability-1.21+.yaml` v0.9.0. `replicas: 2`. Required pod anti-affinity on `kubernetes.io/hostname`. Kubelet CA mount. Serving Secret. `insecureSkipTLSVerify` unset. Out of the kustomization | No `topology.kubernetes.io/zone` constraint. No zone anti-affinity. Two nodes in one zone satisfy the hostname rule |
| `deploy/k8s/check-metrics-server.sh` | Fails closed on one replica, a preference in place of required hostname anti-affinity, a missing serving cert, a missing kubelet CA, and a kustomize listing | Did not require a zone key. Did not reject `DoNotSchedule` on this addon |
| API Deployments ([0081](0081-api-pod-zone-spread.md)) | Soft zone spread beside hostname: `maxSkew: 1`, `ScheduleAnyway`, `nodeTaintsPolicy: Honor` | That item is on the API colors. It does not place `k8s-app: metrics-server` |
| Node pool ([0082](0082-multi-az-node-pool.md)) | At least two zones, one worker each at the floor. EKS sets `topology.kubernetes.io/zone` | Does not place the addon. The addon `nodeSelector` is only `kubernetes.io/os: linux` |

A zone outage is involuntary. The addon `PodDisruptionBudget` (`minAvailable: 1`) does not apply to it. Required anti-affinity on `topology.kubernetes.io/zone` would leave the second pod Pending when every node shares one zone, and it skips nodes that omit the label. Kind and minikube do not apply this file. A cluster that does apply it may still be single-zone. `DoNotSchedule` on the zone key has the same stranding problem the API constraint already refused.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the node-pool shape, Cluster Autoscaler, the kubelet CA mount, or the serving certificate beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/metrics-server.yaml` keeps required hostname anti-affinity and adds a soft zone constraint on `topology.kubernetes.io/zone`. `maxSkew` is 1. `whenUnsatisfiable` is `ScheduleAnyway`. `nodeTaintsPolicy` is `Honor`. The zone action is not `DoNotSchedule` and not a required zone anti-affinity. A single-zone cluster that applies this file still schedules both pods when two hostnames exist. The file stays out of the kustomization. Replicas, the kubelet CA, and the serving cert stay.**

1. **Target.** One `topologySpreadConstraints` item on the metrics-server Deployment. `labelSelector.matchLabels` is `k8s-app: metrics-server`. The pods already run in `kube-system`, and topology spread matches pods in the pod's own namespace. API pods do not count toward this skew. The API zone items are not edited.
2. **Skew.** `maxSkew: 1` on the zone key. Two replicas on two or more zones prefer one pod per zone. `maxSkew: 0` is not used.
3. **Soft, not hard.** `DoNotSchedule` on `topology.kubernetes.io/zone` refuses to raise the skew and treats nodes that omit the label as their own domain. A single-zone cluster, or a cluster whose nodes omit the label, would leave the second pod Pending. `ScheduleAnyway` still prefers the less-loaded zone and still binds. `nodeTaintsPolicy: Honor` drops nodes this pod cannot tolerate out of that count, the same field the API zone item uses. There is no `minDomains`. It is enforced only with `DoNotSchedule`, and a floor of N zones would strand a smaller cluster.
4. **Hostname anti-affinity stays required.** `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` stays on `kubernetes.io/hostname` for `k8s-app: metrics-server` in `kube-system`. It is not rewritten into `preferredDuringSchedulingIgnoredDuringExecution`. It is not given a second required term on `topology.kubernetes.io/zone`. A required zone term would skip nodes that omit the label and would leave the second pod Pending in one zone. Two hostnames in one zone still satisfy the hostname rule. The zone item is what prefers they not share that zone.
5. **What a single-zone apply does.** Kind and minikube still do not apply this file. A keeper who applies it on one zone, with two nodes, gets both pods: the hostname rule is met, and `ScheduleAnyway` binds the zone skew it cannot meet. A one-node cluster still leaves the second pod Pending because hostname anti-affinity stays required. That Pending pod is the existing [0085](0085-metrics-server-ha.md) rule, not this zone item.
6. **High availability, kubelet CA, and serving cert stay.** `replicas: 2`, rolling update `maxUnavailable: 1`, and the addon `PodDisruptionBudget` `minAvailable: 1` stay. `--kubelet-certificate-authority` stays on the required kubelet CA mount. `--tls-cert-file` and `--tls-private-key-file` stay on Secret `metrics-server-serving`. `insecureSkipTLSVerify` stays unset. `--kubelet-insecure-tls` stays unset. The image stays `registry.k8s.io/metrics-server/metrics-server:v0.9.0`.
7. **Still not in the kustomization.** `kubectl apply -k deploy/k8s` does not install this file. Blue stays `replicas: 2`. Green stays `replicas: 0`. Apply order is unchanged: the kubelet CA object, then the serving Secret, then this file, then the `caBundle` patch when the CA is private, then wait for `kubectl top`, then `hpa.yaml`.
8. **Verify without a cluster.** `check-metrics-server.sh` fails when the zone key, `maxSkew: 1`, `ScheduleAnyway`, or `nodeTaintsPolicy: Honor` is missing, when `DoNotSchedule` or `minDomains` is set, when hostname anti-affinity is no longer required, when either insecure flag returns, or when `kustomization.yaml` lists the file. `check-metrics-server.test.sh` proves the zone-key drop and the hard zone action. No `kubectl apply`.

## Consequences

- On a cluster whose schedulable nodes already span two zones, the scheduler prefers one metrics-server pod in each zone. A failure of one zone is still involuntary. The addon budget does not keep a pod in the other zone by itself. The preference is what makes that other pod the usual case.
- `ScheduleAnyway` is a preference, not a placement guarantee. One zone, nodes that omit `topology.kubernetes.io/zone`, a failed score, or a zone that cannot fit the second pod can still co-locate both pods. The selector that stops nodes outside the API groups from counting is [0089](0089-metrics-server-node-pool.md).
- A single-zone cluster with two nodes still runs both pods. A one-node cluster still leaves the second pod Pending on the hostname rule. Local `kubectl apply -k deploy/k8s` still does not install metrics-server.
- `nodeTaintsPolicy` is the same Kubernetes 1.26 field as the API zone item. A cluster that rejects the field cannot apply this Deployment.
- Adding `DoNotSchedule` on the zone key, adding `minDomains`, dropping the zone key, dropping required hostname anti-affinity, adding `insecureSkipTLSVerify`, adding `--kubelet-insecure-tls`, floating the image tag, or listing the file in `kustomization.yaml` fails `check-metrics-server.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The pool pin is [0089](0089-metrics-server-node-pool.md).
