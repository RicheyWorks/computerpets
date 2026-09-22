# 0065. Secret rotation cadence, dual-key verify, and HSM/KMS pointer

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `JwtService`, `PetBundleService`, `LicenseService`, `AdminController`, `ProductionProfileGuard` (`COMPUTERPETS_KEYS_ROTATED_AT`); `deploy/k8s/verify-secret-rotation.sh`; `docs/SETUP.md` rotation checklist

## Context

[0064](0064-secret-operator-prod-refuses-plain-env.md) closed prod plain-env Secret injection. ARCHITECTURE §10 residual **#13** still asked to rotate the three critical keys on a schedule and name an HSM story. Inventory on `main` tip `2eeca3f9f`:

| Material | Env | Role | Dual-key natural? |
|----------|-----|------|-------------------|
| License AES-256 | `LICENSE_SECRET_KEY` | Encrypt/decrypt issued licenses | Yes — decrypt current then previous |
| JWT HS256 | `JWT_SECRET_KEY` | Issue/verify short download JWTs | Yes — verify current then previous |
| Bundle HMAC | `BUNDLE_SIGNING_KEY` | Sign/verify CDN URL MACs | Yes — verify current then previous |
| Admin gate | `ADMIN_API_KEY` | Request HMAC ([0071](0071-admin-request-signature.md)) | Yes — verify current or previous |
| SM shells | `deploy/terraform/modules/secrets` | `computerpets/<KEY>` names only | N/A — populate out of band |

No scheduled rotation contract, no dual-key verify window, and no HSM/KMS pointer existed. This slice closes that gap without storefront work, without DirectX 12 / Vulkan / Solana, and without reopening presence / CSP, Hikari / replica, bundle zip, cosign, Terraform modules, CDN edge redeem, or ProductionProfileGuard beyond the rotation-stamp check. Catalog stays 221. No live AWS apply / ESO install / HSM appliance is required.

## Decision

**Documented cadence + dual-key verify/decrypt + optional rotation stamp. HSM/KMS is a keeper pointer, not a hosted appliance in this repo.**

1. **Cadence (operator checklist)**
   - `JWT_SECRET_KEY` / `BUNDLE_SIGNING_KEY` / `ADMIN_API_KEY`: rotate about every **90 days**.
   - `LICENSE_SECRET_KEY`: rotate about every **180 days** (licenses live up to 365 days; keep previous until outstanding payloads expire or keepers re-verify).
2. **Zero-downtime roll**
   - Put the retiring value into `NAME_PREVIOUS` (or `NAME_PREVIOUS_FILE`).
   - Publish the new value as `NAME`.
   - **Issue / sign / encrypt with current only.**
   - **Verify / decrypt / admin-accept with current, then previous.**
   - After the window, unset `*_PREVIOUS`. Minimum windows: JWT ≥ `jwt.ttl-minutes` (+ skew); bundle ≥ 15 min download TTL (+ skew); license ≥ remaining lifetime of payloads still under the old key (or force re-verify); admin ≥ operator cutover time.
3. **Fail-closed mid-flight**
   - `*_PREVIOUS` equal to current → refuse start.
   - Placeholder / wrong-length previous → refuse start.
   - Missing current with only previous → refuse start (existing blank-current guards).
   - Optional `COMPUTERPETS_KEYS_ROTATED_AT` (ISO-8601). When set on `prod`, refuse if unparseable, future, or older than **400 days**.
4. **HSM / KMS pointer** — Prefer AWS KMS CMK / CloudHSM / Vault Transit to generate and wrap house key material into the existing Secrets Manager shells / file mounts / External Secrets path ([0056](0056-house-secrets-from-file-mounts.md), [0062](0062-terraform-managed-stores.md)). The JVM still consumes HMAC / AES key bytes in-process after unwrap. This repo does **not** ship a live HSM appliance or require `aws kms` calls at runtime.
5. **Deploy gate** — `deploy/k8s/verify-secret-rotation.sh` asserts the contract (previous env wiring, ADR, cadence doc, dual-key code paths).

## Consequences

- Rolling JWT / bundle / license / admin keys no longer requires a hard cutover that drops in-flight tokens or old sealed licenses, as long as `*_PREVIOUS` stays loaded for the window.
- Dropping `*_PREVIOUS` too early fails closed (old JWTs / MACs / ciphertext reject) — intentional.
- Operators who set `COMPUTERPETS_KEYS_ROTATED_AT` must refresh it on rotation or prod refuses after 400 days.
- Secret-operator attestation ([0064](0064-secret-operator-prod-refuses-plain-env.md)) is unchanged beyond this stamp check.
- Clients that decrypt locally should provision `LICENSE_SECRET_KEY_PREVIOUS` during the AES window; download still works with opaque ciphertext when only the backend holds previous.
