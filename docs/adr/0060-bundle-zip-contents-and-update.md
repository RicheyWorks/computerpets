# 0060. Bundle zip contents and fail-closed update process

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `BundleZipContract`; `desktop/license/bundle-zip.cjs`; `client/computerpets_client/license/bundle_zip.py`; session / `fetchBundle` accept path

## Context

ARCHITECTURE §10 / Phase 4.1 Desktop Client Contract still listed **Define bundle zip contents and update process** after the signed-download catalog ([bundle.catalog](../CLIENT-CONTRACT.md) version / platform / sha256) and the CDN host line ([0038](0038-signed-bundle-names-the-cdn-host.md), [0045](0045-license-requests-wait-for-the-painted-line.md)). Inventory on `main` tip `f44c82573`:

- Signed URL + optional catalog metadata shipped. Redeem is one-time and IP-bound ([0055](0055-download-jti-one-time-and-ip-bound.md)).
- Overlay and blotter fetched CDN bytes and counted them. They did **not** check the catalog sha256, did not describe zip members, and had no versioned install / skip / replace rule.
- Empty `bundle.catalog` remains honest URL-only behavior (no invented hash).

This slice closes the zip + update gap without a storefront, without DirectX 12 / Vulkan, and without inventing CDN objects. Presence / CSP, license soft-delete, and Hikari / replica are not reopened beyond this cross-link. Catalog stays 221. Solana stays blocked.

## Decision

**Published zips are `computerpets.bundle/v1`. Catalog integrity claims fail closed. Empty catalog stays opaque.**

1. **Zip root** — required `manifest.json` with exactly `format`, `petKey`, `version`, `platform`, `files`. `format` is `computerpets.bundle/v1`. No price / storefront fields.
2. **Members** — every non-manifest entry is listed in `files[]` with path + lowercase hex sha256. Paths only under `sprites/`, `cries/`, or `meta/`. At least one `sprites/` member. Undeclared members, unsafe paths (`..`, absolute, `\`), and member digest mismatch refuse.
3. **Outer digest** — when the download manifest carries `version` / `sha256` from `bundle.catalog`, the client hashes the zip bytes and compares. Version without sha256 → `bundle_sha256_missing`. Digest mismatch → `bundle_sha256_mismatch`. Bad / missing URL HMAC stays the existing signed-URL refuse.
4. **Update** — local `installedBundle` `{ petKey, version, platform, sha256 }`. Same pet + version + sha256 → `current` (CDN GET may be skipped). No local → `install`. Different → `replace` after a passing zip. Empty catalog (no version/sha256) → `opaque` bytes only; not a versioned install.
5. **Backend** — still does not serve zip bytes. `BundleZipContract` is the shared rule the clients mirror.

## Consequences

- Operators publishing a catalog row must ship a real zip that matches this layout and the configured sha256. Placeholder hashes still fail startup.
- Legacy empty-catalog downloads keep working as opaque fetches.
- Image signing lands in [0061](0061-ghcr-image-signing.md). Terraform for managed stores remains the next non-storefront / non-DX12 maturity item.
