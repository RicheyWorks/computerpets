# 0061. GHCR image signing with keyless cosign (fail-closed verify)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `.github/workflows/ci.yml` (`docker-build` cosign sign + verify); `deploy/k8s/verify-image-signature.sh`; `deploy/k8s/image-signature-policy.example.yaml`

## Context

ARCHITECTURE §10 / deployment gaps still listed **image signing** after the bundle zip contract ([0060](0060-bundle-zip-contents-and-update.md)). Inventory on `main` tip `74d3110ea`:

- CI already builds and pushes `ghcr.io/richeyworks/computerpets` (`main` + `sha-<git>`) from `.github/workflows/ci.yml`. No cosign / Sigstore step. No verify gate before blue/green `kubectl set image`.
- Bundle HMAC (`BUNDLE_SIGNING_KEY`) signs download URLs, not container images. House AES / JWT keys are unrelated.
- Terraform for managed stores remains a separate gap; this slice does not invent cloud accounts.

This slice closes GHCR image signing without storefront work, without DirectX 12 / Vulkan, and without reopening presence / CSP, Hikari / replica, or the bundle zip contract beyond this cross-link. Catalog stays 221. Solana stays blocked.

## Decision

**Keyless cosign on every main publish. Prod deploy verifies or refuses. Local unsigned stays local.**

1. **Publish** — after `docker/build-push-action`, CI installs cosign and signs the **immutable digest** (`ghcr.io/<repo>@sha256:…`) with Sigstore Fulcio + Rekor via GitHub OIDC (`permissions.id-token: write`). CI then `cosign verify` against the same digest before the job succeeds. A push without a digest, or a verify miss, fails the job.
2. **Identity** — certificate subject is `https://github.com/RicheyWorks/computerpets/.github/workflows/ci.yml@refs/heads/main`; OIDC issuer is `https://token.actions.githubusercontent.com`. Operators must check both (identity alone is not enough).
3. **Deploy gate** — `deploy/k8s/verify-image-signature.sh` requires `@sha256:…`, runs `cosign verify`, and exits non-zero on missing / wrong signature. `COMPUTERPETS_ALLOW_UNSIGNED=1` is local-only and must never be set on the prod path. Optional `COMPUTERPETS_COSIGN_KEY` documents a public-key path for air-gapped keepers; keyless remains the house default.
4. **Cluster policy (optional)** — `image-signature-policy.example.yaml` is a Kyverno `ClusterPolicy` scaffold (**not** in kustomization), same honesty pattern as External Secrets. Admission enforcement is the keeper's install; the script is the documented operator gate when Kyverno is absent.
5. **Out of scope** — Terraform / managed Postgres / Redis / CDN; signing third-party base images; inventing a long-lived cosign private key in git.

## Consequences

- Images published before this ADR remain unsigned; prod path must pin a digest that CI signed after this lands (or refuse).
- Tag-only refs (`:main`, `:local`) are rejected by the verify script — blue/green docs pin digest after verify.
- Managed-store Terraform lands in [0062](0062-terraform-managed-stores.md) (cross-link only — this ADR does not reopen signing).
