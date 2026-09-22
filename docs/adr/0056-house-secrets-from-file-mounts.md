# 0056. House secrets from env, *_FILE mounts, or External Secrets

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `SecretFileEnvironmentPostProcessor`; `docker-compose.secrets.yml`; `deploy/k8s/external-secret.example.yaml`; `.env.example`

## Context

Critical house keys (`LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`, `ADMIN_API_KEY`) already fail-hard on missing or placeholder values. Compose and k8s still injected them as plain environment variables (or empty Secret scaffolding). Phase 2.4 asked for a production path — Vault / Kubernetes External Secrets / Docker secrets — without a full Vault deploy the repo does not host.

Keeper-local mind keys (`mind.json` seal, desk bridge) stay on the overlay; they are not house production secrets. Download jti redeem ([0055](0055-download-jti-one-time-and-ip-bound.md)) is unchanged.

## Decision

**One loader, three operator shapes. Deny-safe. No invented production defaults.**

1. **Local-dev** — env vars or `.env` (see `.env.example`). `docker-compose.yml` still accepts inline env for everyday bring-up.
2. **Docker secrets / file mounts** — set `NAME_FILE` to a path (Compose mounts under `/run/secrets/…`). `SecretFileEnvironmentPostProcessor` reads UTF-8, strips one trailing newline, and publishes `NAME` via a `SystemEnvironmentPropertySource` so relaxed binding still reaches `license.secret-key` / `steam.api-key`. Overlay: `docker compose -f docker-compose.yml -f docker-compose.secrets.yml up`.
3. **Kubernetes** — keep `envFrom` of Opaque Secret `computerpets-secrets`. Prefer External Secrets Operator (example CR in `deploy/k8s/external-secret.example.yaml`, **not** in kustomization) or Vault Agent templates that write the same keys. Optional: projected files + `NAME_FILE` instead of `envFrom`.

### Precedence

- Non-blank `NAME` wins over `NAME_FILE` (so a typed local override still works).
- If `NAME_FILE` is set and the path is missing or unreadable → **refuse to start**. Do not invent a secret.
- Blank optional storefront keys (Steam / Itch / Epic / Ethereum RPC) still **fail closed** at verify — refuse the feature, not a fake grant.
- Logs may name which secrets were sourced from files. They must never print secret values.

Catalog stays 221. DirectX 12 / Vulkan is not started. Presence / CSP and download-jti series are not reopened beyond this cross-link.

## Consequences

- Operators can keep secrets out of process environment listings by using file mounts; ESO / Vault still sync into the existing Secret name the Deployments already consume.
- A live HashiCorp Vault cluster, AWS Secrets Manager account, or ESO install is still the keeper's infrastructure — this repo ships the contract and hooks, not a hosted Vault.
- Image signing lands in [0061](0061-ghcr-image-signing.md). Managed-store Terraform (Secrets Manager shells matching this External Secrets contract) lands in [0062](0062-terraform-managed-stores.md).
- Prod refuse of plain env / hand-filled Opaque Secret (require `COMPUTERPETS_SECRETS_SOURCE`) lands in [0064](0064-secret-operator-prod-refuses-plain-env.md). Local-dev env / `.env` stays.
