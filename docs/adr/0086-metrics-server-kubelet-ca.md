# 0086. Kubelet CA for metrics-server

- **Status:** Accepted (the APIService `insecureSkipTLSVerify` clause is superseded in part by [0087](0087-metrics-server-serving-cert.md); the unguarded ConfigMap create is superseded in part by [0112](0112-metrics-server-kubelet-ca-chain.md); the kubelet CA mount stays)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`

## Context

[0085](0085-metrics-server-ha.md) left this gap: a kubelet certificate this file does not trust still leaves `kubectl top` empty. The Deployment did not mount a kubelet CA and did not set `--kubelet-insecure-tls`. Inventory on `main` tip `9237e450e`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | Upstream `high-availability-1.21+.yaml` v0.9.0. `replicas: 2`. Required hostname anti-affinity. Kubelet TLS verified. Out of the kustomization | No `--kubelet-certificate-authority`. No CA volume. Default trust is the in-cluster CA, which is not the kubelet signer on every cluster |
| `deploy/k8s/check-metrics-server.sh` | Fails closed on `--kubelet-insecure-tls`, a floating tag, a kustomize listing, one replica, and missing anti-affinity | Did not require a kubelet CA mount |
| metrics-server v0.9.0 | `--kubelet-certificate-authority` sets `TLSClientConfig.CAFile` and clears `CAData`. The process refuses that flag together with `--kubelet-insecure-tls` | The upstream manifest does not set the flag |
| FAQ (v0.9.0) | Run securely by mounting a CA file and passing `--kubelet-certificate-authority`. Avoid `--kubelet-insecure-tls` and `--deprecated-kubelet-completely-insecure` | Does not ship this repo's operator object |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the hostname/zone topology spread, the node-pool shape, Cluster Autoscaler, or the two-replica install path beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/metrics-server.yaml` keeps the v0.9.0 high-availability shape and adds `--kubelet-certificate-authority` pointed at a read-only mount. The keeper supplies ConfigMap or Secret `metrics-server-kubelet-ca` before apply. The volume is `optional: false`. `--kubelet-insecure-tls` stays unset. The file stays out of the kustomization. `replicas: 2` and the required hostname anti-affinity stay.**

1. **The flag.** The container args keep the upstream set and add `--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt`. metrics-server v0.9.0 copies that path onto `TLSClientConfig.CAFile` and clears `CAData`, so kubelet scrapes trust that file instead of the in-cluster CA. The flag appears once.
2. **The mount.** Volume `kubelet-ca` mounts at `/etc/metrics-server/kubelet-ca`, `readOnly: true`. The item key and path are `ca.crt`. The root filesystem stays read-only, so the file exists only because of this mount. `hostPath` is not used. `kube-root-ca.crt` is not used. The service-account `ca.crt` is not used.
3. **Operator object, not a vendored certificate.** The committed volume source is a ConfigMap named `metrics-server-kubelet-ca` in `kube-system`, `optional: false`. This file does not contain a `ConfigMap` or a `Secret`, and it does not contain a PEM. Create the object before apply, with the CA that signed the kubelet serving certificates:

   ```bash
   kubectl -n kube-system create configmap metrics-server-kubelet-ca \
     --from-file=ca.crt=/path/to/kubelet-serving-ca.crt
   ```

   A Secret is the equivalent source when that bundle is already a Secret. Replace the `configMap` volume with `secret.secretName: metrics-server-kubelet-ca`, same key `ca.crt`, same `optional: false`. The check accepts that substitution and rejects both sources at once. A missing object leaves the pods unstarted. An optional volume is rejected.
4. **Refuse the skip.** `--kubelet-insecure-tls` is not set. `--deprecated-kubelet-completely-insecure` is not set. v0.9.0 already refuses the CA flag together with `--kubelet-insecure-tls`. The check fails if either insecure flag appears in the YAML body. Skipping verification is not how a kubelet certificate becomes trusted.
5. **High availability stays.** `replicas: 2`, required pod anti-affinity on `kubernetes.io/hostname`, rolling update `maxUnavailable: 1`, and the addon `PodDisruptionBudget` `minAvailable: 1` stay. The image stays `registry.k8s.io/metrics-server/metrics-server:v0.9.0`.
6. **Still not in the kustomization.** `kubectl apply -k deploy/k8s` does not install this file. Kind and minikube do not apply it. Blue stays `replicas: 2`. Green stays `replicas: 0`. Apply order is the operator CA object, then this file, then wait for `kubectl top`, then `hpa.yaml`.
7. **APIService serving cert.** `insecureSkipTLSVerify: true` was the upstream hop for the cert minted in `/tmp`. That flag is not the kubelet scrape skip. The serving-cert mount that replaces this sentence is [0087](0087-metrics-server-serving-cert.md).
8. **Verify without a cluster.** `check-metrics-server.sh` fails when the CA flag, the mount, or `optional: false` is missing, when the volume is `hostPath` or optional, when a certificate is vendored, when `--kubelet-insecure-tls` is set, when the tag floats, or when `kustomization.yaml` lists the file. It passes when the volume source is the Secret substitution. `check-metrics-server.test.sh` proves those cases. No `kubectl apply`.

## Consequences

- A keeper who puts the kubelet serving CA in `metrics-server-kubelet-ca` and then applies this file gives both metrics-server pods a trust anchor those scrapes will use. `kubectl top` can show cpu and memory when the kubelet certificate chains to that bundle.
- A certificate that does not chain to the mounted bundle still leaves `kubectl top` empty. The mount does not skip verification to hide that.
- A missing ConfigMap or Secret leaves the pods unstarted. Local `kubectl apply -k deploy/k8s` still does not install metrics-server.
- Adding `--kubelet-insecure-tls`, making the volume optional, vendoring a PEM, floating the image tag, or listing the file in `kustomization.yaml` fails `check-metrics-server.sh`.
- The APIService skip in this paragraph is [0087](0087-metrics-server-serving-cert.md). It does not skip kubelet verification.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The serving certificate is [0087](0087-metrics-server-serving-cert.md). The kubelet chain gate is [0112](0112-metrics-server-kubelet-ca-chain.md).
