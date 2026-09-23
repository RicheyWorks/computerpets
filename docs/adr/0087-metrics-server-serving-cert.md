# 0087. Serving certificate for metrics-server

- **Status:** Accepted (the unguarded keeper `caBundle` patch is superseded in part by [0111](0111-metrics-server-serving-cert-chain.md); the Secret mount stays)
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`

## Context

[0086](0086-metrics-server-kubelet-ca.md) left this gap: the APIService still uses upstream `insecureSkipTLSVerify: true` for the addon's own serving cert minted in `/tmp`. The v0.9.0 FAQ names `--tls-cert-file` and `--tls-private-key-file` as the way to give the apiserver a cert it can verify. Inventory on `main` tip `f9916b335`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | Upstream `high-availability-1.21+.yaml` v0.9.0. `replicas: 2`. Required hostname anti-affinity. `--kubelet-certificate-authority` on a required ConfigMap mount. Out of the kustomization | No `--tls-cert-file`. No `--tls-private-key-file`. No serving-cert volume. `insecureSkipTLSVerify: true` on the APIService. `--cert-dir=/tmp` is how the process mints that cert |
| `deploy/k8s/check-metrics-server.sh` | Fails closed on `--kubelet-insecure-tls`, a floating tag, a kustomize listing, one replica, missing anti-affinity, and a missing kubelet CA | Required `insecureSkipTLSVerify: true` once. Did not require a serving cert |
| metrics-server v0.9.0 | `--tls-cert-file` and `--tls-private-key-file` are the serving pair. When both are set, `--cert-dir` is ignored and the process does not mint a cert. If either path is set alone, startup fails | The upstream manifest sets neither flag |
| kube-aggregator | `insecureSkipTLSVerify` false and an empty `caBundle` verify the serving cert. `ServerName` is `metrics-server.kube-system.svc`. Empty `CAData` uses the system trust store | `APIService` cannot reference a Secret. `caBundle` is inline bytes |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the hostname/zone topology spread, the node-pool shape, Cluster Autoscaler, the two-replica install path, or the kubelet CA mount beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/metrics-server.yaml` keeps the v0.9.0 high-availability shape and the kubelet CA mount, and adds `--tls-cert-file` and `--tls-private-key-file` pointed at a read-only Secret. The keeper supplies Secret `metrics-server-serving` before apply. The volume is `optional: false`. `insecureSkipTLSVerify` is unset. The file does not contain a certificate, a key, or `caBundle`. The file stays out of the kustomization. `replicas: 2` and the required hostname anti-affinity stay.**

1. **The flags.** The container args keep the upstream set, the kubelet CA flag, and add `--tls-cert-file=/etc/metrics-server/serving/tls.crt` and `--tls-private-key-file=/etc/metrics-server/serving/tls.key`. Each flag appears once. v0.9.0 uses that pair for the HTTPS listener. `--cert-dir=/tmp` stays in the arg list and is ignored while both files are set, so the process does not mint a serving cert in `/tmp`. One of the two flags without the other fails startup. That is not a return to the `/tmp` cert.
2. **The mount.** Volume `serving-cert` mounts at `/etc/metrics-server/serving`, `readOnly: true`. The item keys and paths are `tls.crt` and `tls.key`. The root filesystem stays read-only, so the files exist only because of this mount. `hostPath` is not used. The kubelet CA volume is a different mount and is not this material.
3. **Operator Secret, not a vendored certificate.** The committed volume source is a Secret named `metrics-server-serving` in `kube-system`, `optional: false`. A ConfigMap is not the source: the object holds a private key. This file does not contain a `Secret` object and it does not contain a PEM. Create the object before apply:

   ```bash
   kubectl -n kube-system create secret generic metrics-server-serving \
     --from-file=tls.crt=/path/to/tls.crt \
     --from-file=tls.key=/path/to/tls.key \
     --from-file=ca.crt=/path/to/serving-ca.crt
   ```

   The volume projects `tls.crt` and `tls.key` only. `ca.crt` stays in the Secret so the keeper can copy it into `caBundle`. A missing Secret leaves the pods unstarted. An optional volume is rejected. The certificate's DNS SAN must include `metrics-server.kube-system.svc`. kube-aggregator sets `ServerName` to that name.
4. **Turn verification on.** `insecureSkipTLSVerify` is not set. The check fails if that field returns. With the field unset and `caBundle` empty, kube-aggregator sets `TLS.Insecure` false and `TLS.CAData` empty, and client-go verifies against the system trust store. A serving cert that chains to a system root verifies with no further field. A private CA does not.
5. **Keeper `caBundle`, not a committed PEM.** `APIService` has no Secret reference for the trust anchor. This file does not set `caBundle`, because that field would be the CA bytes. After apply, the keeper sets it from the Secret (the value is already base64):

   ```bash
   CA_B64="$(kubectl -n kube-system get secret metrics-server-serving \
     -o jsonpath='{.data.ca\.crt}')"
   kubectl patch apiservice v1beta1.metrics.k8s.io --type=merge \
     -p "{\"spec\":{\"caBundle\":\"${CA_B64}\"}}"
   ```

   `kubectl apply -f` does not clear a `caBundle` that was never in this file. `kubectl replace` and a server-side apply that owns the field do. Re-patch after those. Until `caBundle` is the CA that signed `tls.crt`, a private serving cert leaves `kubectl top` empty. The pods can still be Running. That is verification, not a skip.
6. **Kubelet verification stays on.** `--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt` stays. The kubelet CA volume stays `optional: false`. `--kubelet-insecure-tls` is not set. `--deprecated-kubelet-completely-insecure` is not set. The serving Secret is not the kubelet trust anchor. Skipping kubelet verification is not how the apiserver learns this addon's certificate.
7. **High availability stays.** `replicas: 2`, required pod anti-affinity on `kubernetes.io/hostname`, rolling update `maxUnavailable: 1`, and the addon `PodDisruptionBudget` `minAvailable: 1` stay. The image stays `registry.k8s.io/metrics-server/metrics-server:v0.9.0`.
8. **Still not in the kustomization.** `kubectl apply -k deploy/k8s` does not install this file. Kind and minikube do not apply it. Blue stays `replicas: 2`. Green stays `replicas: 0`. Apply order is the kubelet CA object, then this Secret, then this file, then the `caBundle` patch when the CA is private, then wait for `kubectl top`, then `hpa.yaml`.
9. **Verify without a cluster.** `check-metrics-server.sh` fails when either serving flag or the Secret mount is missing, when `optional: false` is missing, when `insecureSkipTLSVerify` returns, when `caBundle` or a PEM is committed, when `--kubelet-insecure-tls` is set, when the tag floats, or when `kustomization.yaml` lists the file. It still passes when the kubelet CA volume source is the Secret substitution. `check-metrics-server.test.sh` proves those cases. No `kubectl apply`.

## Consequences

- A keeper who puts `tls.crt` and `tls.key` in `metrics-server-serving`, applies this file, and sets `caBundle` to the CA that signed that cert gives the apiserver a serving certificate it verifies. `insecureSkipTLSVerify` is not the way that hop works.
- A private serving cert with an empty `caBundle` still leaves `kubectl top` empty. The pods do not skip verification to hide that.
- A certificate whose SAN is not `metrics-server.kube-system.svc` fails that same check. The mount does not change the name the apiserver dials.
- A missing Secret leaves the pods unstarted. Local `kubectl apply -k deploy/k8s` still does not install metrics-server.
- Adding `insecureSkipTLSVerify`, adding `--kubelet-insecure-tls`, making either volume optional, vendoring a PEM, committing `caBundle`, floating the image tag, or listing the file in `kustomization.yaml` fails `check-metrics-server.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. Zone spread for this addon is [0088](0088-metrics-server-zone-spread.md). The chain and SAN gate is [0111](0111-metrics-server-serving-cert-chain.md).
