# 0064. Secret-operator hardening — prod refuses plain env Secret

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `ProductionProfileGuard` (`COMPUTERPETS_SECRETS_SOURCE`); `deploy/k8s/verify-secret-operator.sh`; `deploy/k8s/deployment-secrets-file.example.yaml`

## Context

[0056](0056-house-secrets-from-file-mounts.md) landed `*_FILE` mounts and an External Secrets example. [0063](0063-cdn-edge-redeem-verification.md) closed CDN edge redeem and named **secret-operator hardening** as the next non-storefront / non-DX12 gap. Inventory on `main` tip `9e95e1429`:

- Default kustomization still applies scaffolding `secret.yaml` (hand-filled Opaque Secret → `envFrom`).
- `ProductionProfileGuard` refused H2 / memory rate-limit / Microsoft dev-mode, but **accepted plain env secrets** on `prod`.
- ARCHITECTURE deployment gaps still listed plain env / Kubernetes `Secret` as open.

This slice closes that gap without storefront work, without DirectX 12 / Vulkan / Solana, and without reopening presence / CSP, Hikari / replica, bundle zip, cosign, Terraform modules, or CDN edge redeem beyond one-line cross-links. Catalog stays 221. No live AWS / Terraform apply is required.

## Decision

**Fail-closed prod attestation. Local-dev keep plain Secret. ESO / file / Vault are the only prod sources.**

1. **`ProductionProfileGuard`** — when `spring.profiles.active=prod`, require `COMPUTERPETS_SECRETS_SOURCE` ∈ `{external-secrets, file, vault-agent}`. Blank or unknown values refuse start (plain env / hand-filled `secret.yaml` is not enough). When source is `file`, require `LICENSE_SECRET_KEY_FILE`, `JWT_SECRET_KEY_FILE`, `BUNDLE_SIGNING_KEY_FILE`, and `ADMIN_API_KEY_FILE` (missing path still refuse-starts in `SecretFileEnvironmentPostProcessor`).
2. **Local escape** — `COMPUTERPETS_ALLOW_PLAIN_SECRET=1` skips the attestation (scaffolding / laptop only). Must never be set on the real prod path — same honesty pattern as `COMPUTERPETS_ALLOW_UNSIGNED`.
3. **Deploy gate** — `deploy/k8s/verify-secret-operator.sh` asserts the repo contract (ESO example, file-mount example, guard, ADR) and, when given manifests, accepts ExternalSecret / `*_FILE` env and refuses a lone Opaque `computerpets-secrets` with `stringData` house keys.
4. **Examples** — `external-secret.example.yaml` and `deployment-secrets-file.example.yaml` stay **out of** kustomization. Managed ConfigMap example sets `COMPUTERPETS_SECRETS_SOURCE=external-secrets`. Default `configmap.yaml` does not set the marker (operators attest on apply).
5. **Out of scope** — hosted Vault / ESO install; putting real secret values in git; live cloud apply; changing envFrom for keepers who already sync via ESO (they set the marker).

## Consequences

- `kubectl apply -k deploy/k8s` with only a filled `secret.yaml` and no attestation **will not boot** under `prod` — that is intentional.
- ESO → Opaque Secret → `envFrom` remains valid when `COMPUTERPETS_SECRETS_SOURCE=external-secrets` (values may still appear in process env; the operator contract is the sync path, not scrubbing `environ`).
- File mounts keep crypto keys out of process environment listings when operators choose `file`.
- CDN edge redeem ([0063](0063-cdn-edge-redeem-verification.md)) and Terraform managed stores ([0062](0062-terraform-managed-stores.md)) are not reopened beyond this cross-link.
