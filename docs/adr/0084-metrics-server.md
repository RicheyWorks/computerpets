# 0084. metrics-server for API resource metrics

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`

## Context

[0083](0083-cluster-autoscaler.md) left this gap: `hpa.yaml` does not raise the replica count until `metrics.k8s.io` answers, and this repo did not install metrics-server. Cluster Autoscaler adds a node for pods that are already Pending. Inventory on `main` tip `33b5d5bff`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/hpa.yaml` | Resource metrics on cpu and memory. Comment named `metrics.k8s.io` | Did not install the API. Without it, blue stays at 2 |
| `deploy/k8s/kustomization.yaml` | Local apply stays blue 2 / green 0. HPA and PDB stay out | No metrics-server manifest to omit |
| `deploy/k8s/` | Cluster Autoscaler manifest, also outside the kustomization | No metrics-server Deployment, image, or APIService |
| `docs/adr/0078-horizontal-pod-autoscaling.md` | Named the addon as something the keeper already runs | No pinned install path in this repo |
| `deploy/terraform/` | Node groups and Cluster Autoscaler IRSA | Does not install a Kubernetes addon |

EKS, GKE, and AKS can offer their own addon. This slice vendors the upstream manifest so the install is a file a check can read. It does not call a cloud addon API.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the PDB `minAvailable`, the hostname/zone topology spread, the node-pool shape, or Cluster Autoscaler beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**The resource-metrics addon is `deploy/k8s/metrics-server.yaml`. It is upstream metrics-server `components.yaml` v0.9.0. It is not in the kustomization. Local apply does not install it. Kubelet scrapes stay verified. `hpa.yaml` still does not raise replicas until that API answers.**

1. **Pinned upstream file.** The objects below the header are [components.yaml v0.9.0](https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/components.yaml). Image `registry.k8s.io/metrics-server/metrics-server:v0.9.0`. That release tracks Kubernetes 1.34+ and depends on 1.36.2, the same minor line as the Cluster Autoscaler image. `:latest` is not used. There is no Helm chart.
2. **The API the HPA reads.** One `APIService` named `v1beta1.metrics.k8s.io`, group `metrics.k8s.io`, version `v1beta1`. CPU and memory on `hpa.yaml` are `Resource` metrics. They do not move until this API answers. `kubectl top pods -n computerpets` is the keeper's check.
3. **Not in the kustomization.** Same pattern as `hpa.yaml` and `pdb.yaml`. `kubectl apply -k deploy/k8s` does not install it. Kind and minikube do not apply it. The addon namespace is `kube-system`, not `computerpets`. Apply order is this file, then wait for `kubectl top`, then `hpa.yaml`.
4. **Kubelet TLS stays on.** The args are the upstream set: `--cert-dir=/tmp`, `--secure-port=10250`, `--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname`, `--kubelet-use-node-status-port`, `--metric-resolution=15s`. `--kubelet-insecure-tls` is not set. A kubelet certificate this addon does not trust leaves `kubectl top` empty. The fix is a serving cert the addon trusts. Skipping verification is not the install.
5. **APIService serving cert.** `insecureSkipTLSVerify: true` appears once, on that APIService. Upstream uses it because the addon mints its serving cert in `/tmp`, and the apiserver does not have that cert's CA. That flag is not the kubelet scrape skip. The check rejects a second copy and rejects `--kubelet-insecure-tls`.
6. **One pod.** The Deployment does not set `replicas`, so the count stays 1. `priorityClassName` is `system-cluster-critical`. The container is non-root, drops all capabilities, and uses a read-only root filesystem. No host network, no host PID, no privileged flag. Upstream `high-availability-1.21+.yaml` (replicas 2 and pod anti-affinity) is not this file.
7. **What this does not change.** `hpa.yaml` still targets `computerpets-blue`, floor 3, ceiling 10, CPU 70% of the `250m` request, memory at `800Mi`. Blue stays `replicas: 2`. Green stays `replicas: 0`. The PDB, hostname spread, and zone spread stay as they are. Cluster Autoscaler still adds a node only for pods that are already Pending. No live cluster apply.

## Consequences

- A keeper who applies `metrics-server.yaml` and then sees cpu and memory from `kubectl top` can apply `hpa.yaml` and have the floor of 3 mean something. Until that API answers, the HPA object still does not raise blue.
- A laptop `kubectl apply -k deploy/k8s` still starts two API pods and an idle green Deployment. It does not start metrics-server.
- Adding `--kubelet-insecure-tls`, floating the image tag, or listing the file in `kustomization.yaml` fails `check-metrics-server.sh`. `check-metrics-server.test.sh` proves those three failures. No `kubectl apply`.
- The APIService still skips verification of the addon's own serving cert. That is the upstream components file. It does not skip kubelet verification.
- One metrics-server pod is a single point of failure for the HPA signal. This slice does not pretend otherwise.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the vendored Deployment does not set `replicas`, so metrics-server stays one pod. Upstream `high-availability-1.21+.yaml` (v0.9.0, replicas 2, pod anti-affinity) is not this file. If that pod is not Ready, `metrics.k8s.io` stops answering and `hpa.yaml` does not raise the replica count. The APIService still uses upstream `insecureSkipTLSVerify: true` for the addon's own serving cert. A kubelet certificate the addon does not trust still leaves `kubectl top` empty; this file does not mount a kubelet CA and does not add `--kubelet-insecure-tls`. Zone spread stays `ScheduleAnyway`. Cluster Autoscaler still only adds a node for pods that are already Pending. Not started here.
