# Architecture Decision Records

← [Back to Documentation Index](../README.md)

This folder records **decisions the code already made**. Each ADR explains a
choice a new engineer will trip over if they only read the living desk or a
stale paragraph in `ARCHITECTURE.md`.

ADRs are not a wishlist. Do not file one for Solana, a live NFT collection
address, or an API that is not on `main`.

| Field | Value |
|-------|--------|
| **Template** | Status, Context, Decision, Consequences ([Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)) |
| **Numbering** | Four-digit prefix, sequential (`0001`, `0002`, …) |
| **Status values** | `Accepted` (true on `main`), `Superseded` (point at the replacement), `Deprecated` |

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-modular-monolith-ownership-provider.md) | Modular monolith with an `OwnershipProvider` SPI | Accepted |
| [0002](0002-aes-gcm-license-and-short-jwt.md) | AES-256-GCM licenses plus a short JWT | Accepted |
| [0003](0003-redis-rate-limit-and-jti-denylist.md) | Redis for shared rate limits and the jti deny-list; Postgres is the revoke ledger | Accepted |
| [0004](0004-empty-nft-allowlist.md) | Official NFT allowlist stays empty until a collection exists | Accepted |
| [0005](0005-electron-overlay-implements-client-contract.md) | Electron overlay implements the client contract (PyQt-vision clause superseded by 0007) | Superseded (in part) |
| [0006](0006-spring-profiles-and-kubernetes-manifests.md) | Spring `dev` / `staging` / `prod` profiles and Kubernetes manifests (not Helm) | Accepted |
| [0007](0007-pyqt-blotter-client.md) | PyQt6 blotter client implements the same contract; Electron overlay stays | Accepted |
| [0008](0008-desktop-local-gpu-sense.md) | GPU load is desktop-local on the keeper machine, not `/metrics/gpu` | Accepted |
| [0009](0009-mind-listener-name.md) | The keeper HUD names who is listening; it does not show the key | Accepted |
| [0010](0010-presence-does-not-open-files.md) | Desk presence does not open a dropped keeper file | Accepted |
| [0011](0011-presence-does-not-list-folders.md) | Desk presence does not list user folders or read window titles | Accepted (class read superseded by 0029) |
| [0012](0012-presence-does-not-log-keys.md) | Desk presence does not log keys outside a focused field | Accepted |
| [0013](0013-weather-locate-is-not-a-process-grant.md) | Weather location is a click, not a process grant | Accepted |
| [0014](0014-weather-does-not-ask-an-ip-place.md) | Weather does not ask an IP place service | Accepted |
| [0015](0015-weather-locate-sends-a-rounded-place.md) | A weather locate sends a rounded place, and a saved typed area wins | Accepted |
| [0016](0016-weather-locate-waits-for-an-in-app-yes.md) | A live weather locate waits for an in-app yes | Accepted |
| [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md) | A saved computer place waits for a forecast yes | Accepted (later load send superseded in part by 0032) |
| [0018](0018-mind-key-is-not-plain-text.md) | The overlay plugin key is not plain text in mind.json | Accepted |
| [0019](0019-license-mark-is-a-local-hash.md) | A license mark is a local hash of a named machine id | Accepted |
| [0020](0020-desk-mind-key-is-not-in-the-browser.md) | The desk `/mind` key is not stored in the browser | Accepted |
| [0021](0021-desk-talk-does-not-send-the-key.md) | Desk talk does not send the plugin key to the house | Accepted |
| [0022](0022-gemini-key-stays-off-the-query.md) | The overlay Gemini call does not put the plugin key on the query string | Accepted |
| [0023](0023-pasted-key-query-is-dropped.md) | A pasted plugin URL drops a key query before the direct call | Accepted |
| [0024](0024-desk-talk-drops-a-pasted-key-query.md) | Desk talk drops a pasted key query before the post | Accepted |
| [0025](0025-listener-read-drops-a-pasted-key-query.md) | The listener read drops a pasted key query before the post | Accepted |
| [0026](0026-mind-json-drops-a-pasted-key-query.md) | mind.json drops a pasted key query on save and on read | Accepted |
| [0027](0027-base-url-drops-userinfo-and-a-path-key.md) | A base URL drops userinfo, a path key, and a non-URL key assignment | Accepted |
| [0028](0028-model-field-drops-a-pasted-secret.md) | A model field drops a pasted secret | Accepted |
| [0029](0029-enumerator-does-not-read-a-window-class.md) | The window enumerator does not read a keeper window class | Accepted |
| [0030](0030-missing-os-id-waits-for-a-yes.md) | A missing OS id waits for a yes before a weaker license mark | Accepted |
| [0031](0031-later-locate-still-asks-in-the-app.md) | A later weather locate still asks in the app | Accepted |
| [0032](0032-later-forecast-names-the-network-address.md) | A later forecast names the network address | Accepted |
| [0033](0033-geocode-names-the-network-address.md) | A geocode look-up names the network address | Accepted |
| [0034](0034-news-quotes-and-radio-name-the-network-address.md) | News, quotes, and Radio Find name the network address | Accepted |
| [0035](0035-station-stream-names-the-network-address.md) | A station stream names the network address when Play is pressed | Accepted (the open itself waits in 0044) |
| [0036](0036-cloud-talk-and-voice-name-the-network-address.md) | Cloud talk and cloud voice name the network address | Accepted (the request itself waits in 0044) |
| [0037](0037-license-hash-names-the-network-address.md) | Unlock names the host before the license hash leaves | Accepted (the POST itself waits in 0045) |
| [0038](0038-signed-bundle-names-the-cdn-host.md) | A signed bundle names the CDN host before the GET leaves | Accepted (the GET itself waits in 0045) |
| [0039](0039-unbound-download-names-the-backend-host.md) | An unbound download names the backend host before the POST leaves | Accepted (the POST itself waits in 0045) |
| [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md) | News, quotes, and Radio Find wait for the painted line in main | Accepted |
| [0041](0041-featured-page-waits-for-the-wikipedia-line.md) | The featured page waits for the wikipedia line | Accepted |
| [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md) | Desk and overlay plate fetches wait for the painted line | Accepted |
| [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md) | A forecast and a geocode look-up wait for the painted line | Accepted |
| [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md) | A station stream and cloud talk wait for the painted line | Accepted |
| [0045](0045-license-requests-wait-for-the-painted-line.md) | License requests wait for the painted line | Accepted |
| [0046](0046-house-fonts-stay-on-this-computer.md) | House fonts stay on this computer | Accepted |
| [0047](0047-stun-waits-for-the-painted-line.md) | A STUN host waits for the painted line | Accepted |
| [0048](0048-overlay-connect-src-names-the-house-hosts.md) | Overlay connect-src names the house hosts | Accepted |
| [0049](0049-plate-ipc-times-out-and-denies.md) | Overlay plate IPC times out and denies | Accepted |
| [0050](0050-weather-page-times-out-and-denies.md) | Weather page reads time out and deny | Accepted |
| [0051](0051-news-quote-radio-page-times-out-and-denies.md) | News, quote, and radio page reads time out and deny | Accepted |
| [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md) | Cloud talk and cloud voice page reads time out and deny | Accepted |
| [0053](0053-itch-and-epic-restclient-times-out-and-denies.md) | Itch and Epic RestClient reads time out and deny | Accepted |
| [0054](0054-ownership-time-limiter-denies-on-wall.md) | Shared ownership time limiter denies on wall exceed | Accepted |
| [0055](0055-download-jti-one-time-and-ip-bound.md) | Download jti grants are one-time and IP-bound | Accepted |
| [0056](0056-house-secrets-from-file-mounts.md) | House secrets from env, *_FILE mounts, or External Secrets | Accepted |
| [0057](0057-license-issuance-observation.md) | License issuance is a business observation | Accepted |
| [0058](0058-license-soft-delete-and-audit.md) | License revoke soft-deletes and writes an audit ledger | Accepted |
| [0059](0059-hikari-pool-and-read-replica.md) | Hikari pool defaults and optional deny-safe read replica | Accepted |
| [0060](0060-bundle-zip-contents-and-update.md) | Bundle zip contents and fail-closed update process | Accepted |
| [0061](0061-ghcr-image-signing.md) | GHCR image signing with keyless cosign (fail-closed verify) | Accepted |
| [0062](0062-terraform-managed-stores.md) | Terraform for managed Postgres, Redis, secrets, CDN, and WAF stubs | Accepted |
| [0063](0063-cdn-edge-redeem-verification.md) | CDN edge redeem verification (fail-closed house redeem) | Accepted |
| [0064](0064-secret-operator-prod-refuses-plain-env.md) | Secret-operator hardening — prod refuses plain env Secret | Accepted |
| [0065](0065-secret-rotation-cadence-and-hsm.md) | Secret rotation cadence, dual-key verify, and HSM/KMS pointer | Accepted |
| [0066](0066-provider-verify-field-bounds.md) | Provider verify fields fail closed on length and charset | Accepted |
| [0067](0067-trusted-proxy-client-address.md) | Trusted-proxy client address (fail-closed XFF / Forwarded) | Accepted |
| [0068](0068-discovery-rate-limit.md) | Discovery rate limit on `/api/pets` (fail-closed) | Accepted |
| [0069](0069-bundle-catalog-rate-limit.md) | Bundle catalog rate limit on `GET /api/bundles/{petKey}` (fail-closed) | Accepted |
| [0070](0070-machine-request-signature.md) | Signed machine verify requests (fail-closed HMAC, license key) | Accepted |
| [0071](0071-admin-request-signature.md) | Signed admin requests (fail-closed HMAC, admin key) | Accepted |
| [0072](0072-signed-request-nonce.md) | Single-use nonce for signed admin and machine requests | Accepted |
| [0073](0073-download-jwt-single-use.md) | Single-use download JWT (`jti` claimed once per bearer) | Accepted |
| [0074](0074-waf-in-front-of-rate-limiter.md) | Regional WAF in front of the rate limiter (fail-closed ALB association) | Accepted |
| [0075](0075-redis-auth-and-transit-tls.md) | Redis AUTH and transit TLS (optional; prod fails closed when required) | Accepted |
| [0076](0076-postgres-transit-tls.md) | Postgres transit TLS (`sslmode` + `rds.force_ssl`; prod fails closed when half-set) | Accepted |
| [0077](0077-api-listener-tls.md) | API listener TLS (Ingress cert-manager or ACM HTTPS listener; prod fails closed when required) | Accepted |
| [0078](0078-horizontal-pod-autoscaling.md) | Horizontal pod autoscaling for the API (prod HPA; local apply stays unscaled) | Accepted |
| [0079](0079-pod-disruption-budget.md) | Pod disruption budget for the live API color (prod PDB; local apply omits it) | Accepted |
| [0080](0080-api-pod-topology-spread.md) | Soft hostname topology spread for the API colors (ScheduleAnyway; local replica counts unchanged) | Superseded (in part) by 0100 |
| [0081](0081-api-pod-zone-spread.md) | Soft zone topology spread beside hostname (ScheduleAnyway; single-zone clusters still schedule) | Accepted |
| [0082](0082-multi-az-node-pool.md) | Private multi-AZ API node pool (one managed node group per zone; no public IP; no SSH) | Accepted |
| [0083](0083-cluster-autoscaler.md) | Cluster Autoscaler for those node groups (desired size ignored; max at least the HPA ceiling; IRSA) | Accepted |
| [0084](0084-metrics-server.md) | metrics-server for API resource metrics (upstream v0.9.0; not in the kustomization; kubelet TLS stays on) | Accepted |
| [0085](0085-metrics-server-ha.md) | High availability for metrics-server (replicas 2, required hostname anti-affinity; still not in the kustomization) | Accepted |
| [0086](0086-metrics-server-kubelet-ca.md) | Kubelet CA for metrics-server (operator ConfigMap or Secret; `--kubelet-insecure-tls` stays off) | Accepted |
| [0087](0087-metrics-server-serving-cert.md) | Serving certificate for metrics-server (operator Secret; `insecureSkipTLSVerify` stays off) | Accepted |
| [0088](0088-metrics-server-zone-spread.md) | Soft zone spread for metrics-server beside required hostname anti-affinity (`ScheduleAnyway`; single-zone clusters still schedule) | Superseded (in part) by 0098 |
| [0089](0089-metrics-server-node-pool.md) | Pin metrics-server to the multi-AZ API node pool (`computerpets/node-pool=api`; kind stays off the file) | Accepted |
| [0090](0090-cluster-autoscaler-ha.md) | High availability for Cluster Autoscaler (replicas 2, required hostname anti-affinity, leader election; still not in the kustomization) | Superseded (in part) by 0099 |
| [0091](0091-cluster-autoscaler-node-pool.md) | Pin Cluster Autoscaler to the multi-AZ API node pool (`computerpets/node-pool=api` and linux; kind stays off the file) | Accepted |
| [0092](0092-cluster-autoscaler-pdb.md) | Pod disruption budget for Cluster Autoscaler (`minAvailable: 1` on `app=cluster-autoscaler`; kind stays off the file) | Accepted |
| [0093](0093-api-node-pool.md) | Pin the API Deployments to the multi-AZ API node pool (`computerpets/node-pool=api` and linux; kind stays Pending until the label exists) | Accepted |
| [0094](0094-api-pool-taint.md) | Taint the API node pool `computerpets/node-pool=api:NoSchedule` and tolerate it on the workloads that already select the pool (kind stays untainted) | Accepted |
| [0095](0095-api-zone-hard-spread.md) | Hard zone spread for the API colors (`DoNotSchedule` on `topology.kubernetes.io/zone`; one labeled zone still schedules) | Accepted |
| [0096](0096-system-daemon-api-pool-toleration.md) | API pool toleration on `aws-node` (`vpc-cni` `configuration_values`) and `kube-proxy` (strategic-merge patch; kind stays untainted) | Accepted |
| [0097](0097-kube-proxy-toleration-hook.md) | Reassert kube-proxy API pool coverage on plan drift, or fail closed (kind stays untainted; the live probe defaults off) | Accepted |
| [0098](0098-metrics-server-zone-hard-spread.md) | Hard zone spread for metrics-server (`DoNotSchedule` on `topology.kubernetes.io/zone`; one labeled zone still schedules; replicas stay 2) | Accepted |
| [0099](0099-cluster-autoscaler-zone-hard-spread.md) | Hard zone spread for Cluster Autoscaler (`DoNotSchedule` on `topology.kubernetes.io/zone`; one labeled zone still schedules; preferred zone anti-affinity removed; replicas stay 2) | Accepted |
| [0100](0100-api-hostname-hard-spread.md) | Hard hostname spread for the API colors (`DoNotSchedule` on `kubernetes.io/hostname`; one hostname still schedules; the second local replica is not left Pending; zone stays `DoNotSchedule`) | Accepted |
| [0101](0101-cluster-autoscaler-leader-scale.md) | The scheduled Cluster Autoscaler leader scales the underfilled zone (the standby is not the scaler; `least-waste` and similar per-zone groups stay; kind stays off the file) | Accepted |
| [0102](0102-cluster-autoscaler-scale-up-salvo.md) | The leader scales another group in the same loop (`--salvo-scale-up=true`, budget `1m`; `least-waste` and similar groups stay; no priority expander ConfigMap; kind stays off the file) | Accepted |
| [0103](0103-cluster-autoscaler-salvo-early-stop.md) | The salvo keeps the `1m` budget when a later option does not start (provision time and node-group backoff stay at the v1.36.1 defaults; the next main loop is the retry; kind stays off the file) | Accepted |
| [0104](0104-per-zone-node-max.md) | Per-zone API node-group max is 20 (twice the HPA ceiling; Cluster Autoscaler reads Auto Scaling group `MaxSize` and cannot lift it; the old max of 10 is refused; kind stays off the file) | Accepted (min of 1 superseded in part by 0105; twice-the-ceiling justification superseded in part by 0109) |
| [0105](0105-api-hostname-floor.md) | Two hostnames per API zone for the HPA floor (`min_size` 2 and create-time `desired_size` 2; two healthy zones are four hostnames; HPA min stays 3 because the PDB keeps 2; the old floor of 1 is refused; no `minDomains`; kind stays off the pool) | Accepted (single-zone floor superseded in part by 0106) |
| [0106](0106-api-single-zone-hostname-floor.md) | Three hostnames in the one Ready API zone (`min_size` 3 and create-time `desired_size` 3; one Ready zone holds the HPA floor as 1 and 1 and 1; the zone gate stays two; the floor of 2 is refused; no `minDomains`; kind stays off the pool) | Accepted (healthy-pool ceiling superseded in part by 0107) |
| [0107](0107-api-hostname-ceiling.md) | HPA ceiling matches the six healthy API hostnames (`maxReplicas` 6; two zones times `min_size` 3; the old ceiling of 10 is refused; `min_size` stays 3; no `minDomains`; kind stays off the HPA and the pool) | Accepted (one Ready zone ceiling superseded in part by 0108) |
| [0108](0108-api-single-zone-hostname-ceiling.md) | One Ready zone holds the HPA ceiling (`maxReplicas` 3, equal to `minReplicas` and to `min_size` 3; the ceiling of 6 is refused; eight, ten, twelve, and twenty node bills are refused; no `minDomains`; kind stays off the HPA and the pool) | Accepted |
| [0109](0109-per-zone-node-max-floor.md) | Per-zone API node-group max stays 20, above a one-zone floor of 8 (`maxReplicas` 3 + Cluster Autoscaler 2 + metrics-server 2 + one drain node; twice the new ceiling is 6 and is refused; the live set binds on `min_size` 3, so `MaxLimitReached` at 20 is unreachable; kind stays off the file) | Accepted |
| [0110](0110-cluster-autoscaler-pending-lease.md) | A Pending Cluster Autoscaler pod never holds the lease (the Running leader remains the scaler; v1.36.1 acquires `leases/cluster-autoscaler` inside the container; `system-cluster-critical` stays; kind stays off the file) | Accepted |
| [0111](0111-metrics-server-serving-cert-chain.md) | metrics-server serving cert chains to APIService `caBundle` and its DNS SAN is `metrics-server.kube-system.svc` (apply refuses otherwise; kind stays off the file) | Accepted |
| [0112](0112-metrics-server-kubelet-ca-chain.md) | Kubelet leafs chain to ConfigMap `metrics-server-kubelet-ca` before that object is written (apply refuses a missing CA, a swapped CA, or `--kubelet-insecure-tls`; kind stays off the file) | Accepted |
| [0113](0113-metrics-server-kubelet-san.md) | Kubelet leaf SAN covers the metrics-server dial address (`InternalIP`, then `ExternalIP`, then `Hostname`; apply refuses a miss; kind stays off the file; no dial) | Accepted |

## How to add one

1. Confirm the decision is already true in the code on `main` (or lands in the same PR).
2. Copy the headings from any existing ADR. Do not invent endpoints, collection
   addresses, or storefronts.
3. Add a row to the table above and link it from `docs/README.md` if the set
   grows a new theme.
4. When a later change replaces a decision, mark the old ADR `Superseded` and
   write a new numbered file. Do not silently rewrite history.

The narrative architecture doc is still [ARCHITECTURE.md](../ARCHITECTURE.md).
The wire format a native client implements is [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md).
