# 0085. High availability for metrics-server

- **Status:** Accepted (the no-kubelet-CA clause is superseded in part by [0086](0086-metrics-server-kubelet-ca.md); hard zone spread is [0098](0098-metrics-server-zone-hard-spread.md) (`DoNotSchedule`; one labeled zone still schedules); the soft action was [0088](0088-metrics-server-zone-spread.md); replicas, required hostname anti-affinity, and the install path stay)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`

## Context

[0084](0084-metrics-server.md) left this gap: the vendored Deployment does not set `replicas`, so metrics-server stays one pod. If that pod is not Ready, `metrics.k8s.io` stops answering and `hpa.yaml` does not raise the replica count. Inventory on `main` tip `d649bee63`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | Upstream `components.yaml` v0.9.0. Pinned image. Kubelet TLS verified. Out of the kustomization | No `replicas` field (the count stays 1). No pod anti-affinity. Not `high-availability-1.21+.yaml` |
| `deploy/k8s/check-metrics-server.sh` | Fails closed on `--kubelet-insecure-tls`, a floating tag, and a kustomize listing | Required the `replicas` field to be absent |
| `deploy/k8s/hpa.yaml` | Resource metrics on cpu and memory | Does not raise blue when the one addon pod is down |
| `deploy/k8s/pdb.yaml` | API budget `minAvailable: 2` on `color=blue` | Not an addon budget |
| Node pool ([0082](0082-multi-az-node-pool.md)) | At least two zones, one worker each at the floor | Does not place the addon |

A kubelet certificate this file does not trust still leaves `kubectl top` empty. That is the gap after this one. Two hostnames already exist at the node-pool floor, and the single addon pod is the failure this slice can close without a CA mount.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the hostname/zone topology spread, the node-pool shape, Cluster Autoscaler, or the single-replica install path beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/metrics-server.yaml` is upstream metrics-server `high-availability-1.21+.yaml` v0.9.0. The Deployment sets `replicas: 2` and required pod anti-affinity on `kubernetes.io/hostname`. It is not in the kustomization. Kubelet scrapes stay verified. The image stays pinned. `hpa.yaml` still does not raise replicas until `metrics.k8s.io` answers.**

The no-kubelet-CA sentence in point 7 is the part [0086](0086-metrics-server-kubelet-ca.md) replaces. The same file now mounts an operator CA and sets `--kubelet-certificate-authority`. Replicas, anti-affinity, and the install path in this ADR are unchanged.

1. **Pinned upstream file.** The objects below the header are [high-availability-1.21+.yaml v0.9.0](https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/high-availability-1.21+.yaml). That asset is `components.yaml` from [0084](0084-metrics-server.md) plus four changes: `replicas: 2`, `rollingUpdate.maxUnavailable: 1`, required pod anti-affinity, and a `PodDisruptionBudget` with `minAvailable: 1`. Image `registry.k8s.io/metrics-server/metrics-server:v0.9.0`. `:latest` is not used. There is no Helm chart and no second Deployment.
2. **Two pods.** `replicas: 2` is set. Omitting the field, or setting `1`, is the single-pod shape this slice replaces. `priorityClassName` stays `system-cluster-critical`. The container stays non-root, drops all capabilities, and uses a read-only root filesystem. No host network, no host PID, no privileged flag.
3. **Required hostname anti-affinity.** `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` matches `k8s-app: metrics-server` in namespace `kube-system`, `topologyKey: kubernetes.io/hostname`. It is not `preferredDuringSchedulingIgnoredDuringExecution`. It is not a zone constraint and not the API `ScheduleAnyway` spread. A second hostname is required or the second pod stays Pending. Kind and minikube do not apply this file. The node-pool floor is already one worker in each of at least two zones. If a cluster that does apply this file has only one node, Cluster Autoscaler can add a node for that Pending pod. It does not place the pod itself. Soft zone spread on this Deployment is [0088](0088-metrics-server-zone-spread.md). This required hostname rule stays.
4. **Addon budget, not the API budget.** The same file adds `policy/v1` `PodDisruptionBudget` `metrics-server` in `kube-system` with `minAvailable: 1`. Voluntary disruption can drop the addon to one pod. `pdb.yaml` stays `minAvailable: 2` on `color=blue` in `computerpets`. `check-pdb.sh` still counts that API budget as the one house budget. This file is not that object.
5. **Rolling update.** `maxUnavailable: 1` is the upstream HA value. `components.yaml` used `0`. With `replicas: 2`, the default `maxSurge` is 1. Required anti-affinity may need a free hostname before a surge pod binds.
6. **Still out of the kustomization.** `kubectl apply -k deploy/k8s` does not install two metrics-server pods on a laptop. Blue stays `replicas: 2`. Green stays `replicas: 0`. Apply order is this file, then wait for `kubectl top`, then `hpa.yaml`.
7. **Kubelet TLS stays on.** Args stay the upstream set. `--kubelet-insecure-tls` is not set. This file does not mount a kubelet CA. `insecureSkipTLSVerify: true` was the upstream hop for the cert minted in `/tmp`. That flag is not the kubelet scrape skip. The CA mount is [0086](0086-metrics-server-kubelet-ca.md). The serving-cert mount is [0087](0087-metrics-server-serving-cert.md).
8. **Verify without a cluster.** `check-metrics-server.sh` fails when `replicas` is not 2, when pod anti-affinity is missing or only preferred, when `maxUnavailable` is not 1, when the addon budget is missing, when the tag floats, when `--kubelet-insecure-tls` is set, or when `kustomization.yaml` lists the file. `check-metrics-server.test.sh` proves the replica drop, the missing anti-affinity, and the three failures from [0084](0084-metrics-server.md). No `kubectl apply`.

## Consequences

- One Ready metrics-server pod can still answer `metrics.k8s.io` while the other is down, so `hpa.yaml` can keep reading CPU and memory. Both pods down still leaves that API dark until one is Ready.
- A one-node cluster that applies this file leaves the second pod Pending. Do not apply it on kind or minikube. Local `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment.
- The API disruption budget is unchanged. The addon budget is a different object in `kube-system`.
- Adding `--kubelet-insecure-tls`, floating the image tag, listing the file in `kustomization.yaml`, dropping to one replica, or removing the anti-affinity fails `check-metrics-server.sh`.
- The APIService skip in this paragraph is [0087](0087-metrics-server-serving-cert.md). It does not skip kubelet verification.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The kubelet CA mount is [0086](0086-metrics-server-kubelet-ca.md).
