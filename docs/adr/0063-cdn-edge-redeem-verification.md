# 0063. CDN edge redeem verification (fail-closed house redeem)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `deploy/cdn/edge-redeem.js`; `PetBundleService` `pet=` query; desktop/PyQt signed-URL parsers

## Context

[0062](0062-terraform-managed-stores.md) landed a private S3 + CloudFront OAC stub. House redeem already exists ([0055](0055-download-jti-one-time-and-ip-bound.md)): `GET /api/bundles/{petKey}/redeem` verifies HMAC and consumes a one-time IP-bound grant. Inventory on `main` tip `4f41f86b0`:

- Terraform CDN comment still said HMAC was verified only by house redeem — **no edge worker** called redeem before serving bytes.
- ARCHITECTURE / CLIENT-CONTRACT assumed an edge verifier; the gap was the missing fail-closed edge (or proxy) that forwards the keeper address.
- Catalog object paths (`red_panda-win-1.0.0.zip`) are not `{petKey}.zip`, so stripping `.zip` from the filename is not enough for redeem.

This slice closes that named gap without storefront work, without DirectX 12 / Vulkan, and without reopening presence / CSP, Hikari / replica, bundle zip, cosign, or Terraform modules beyond a one-line CDN comment cross-link. Catalog stays 221. Solana stays blocked. No live `terraform apply` is required.

## Decision

**Fail-closed edge calls house redeem. Edge does not hold `BUNDLE_SIGNING_KEY`.**

1. **Signed URL** — `PetBundleService` adds `pet={catalogKey}` to the query (alongside `owner`, `jti`, `exp`, `sig`). Desktop and PyQt parsers prefer `pet=` over the filename basename so catalog paths still rebuild the MAC input.
2. **Edge worker** — `deploy/cdn/edge-redeem.js` (Lambda@Edge `handler` + Cloudflare `workerFetch` + pure helpers) requires `HOUSE_API_BASE`, calls house redeem with `X-Forwarded-For` = viewer address, and allows the origin GET only when `{ "allowed": true }`. Missing base, network errors, 401 / 403 / 503, and 200 without `allowed` all deny bytes.
3. **Verify without a cloud bill** — `node deploy/cdn/edge-redeem.test.cjs` stubs fetch. Operators package and associate the function on their own account when the CDN stub is applied.
4. **Out of scope** — live AWS apply; putting `BUNDLE_SIGNING_KEY` on the edge; storefront checkout; reinventing grants.

## Consequences

- A CloudFront (or Worker) distribution that has not associated this function can still serve an object if the bucket policy allows it — keepers must wire the edge for production honesty.
- Secret-operator hardening (refuse plain env `Secret` on the prod path) lands in [0064](0064-secret-operator-prod-refuses-plain-env.md).
- Terraform CDN module is not reopened beyond the ADR 0063 comment on the distribution.
