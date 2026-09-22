# CDN edge redeem (HMAC / one-time grant)

After [ADR 0062](../../docs/adr/0062-terraform-managed-stores.md) the Terraform CDN
stub provisions private S3 + CloudFront OAC but **does not** call house redeem
before serving bytes. House redeem already exists ([ADR 0055](../../docs/adr/0055-download-jti-one-time-and-ip-bound.md)).

This directory is the fail-closed **edge verifier** ([ADR 0063](../../docs/adr/0063-cdn-edge-redeem-verification.md)):

| File | Role |
|------|------|
| `edge-redeem.js` | Pure helpers + Lambda@Edge `handler` + Cloudflare `workerFetch` |
| `edge-redeem.test.cjs` | Stub-fetch unit tests (no AWS account) |

## Behavior

1. Parse signed query (`pet`, `owner`, `jti`, `exp`, `sig`). Prefer `pet=` over
   stripping `.zip` from the object key (catalog paths are not `{petKey}.zip`).
2. Call `GET {HOUSE_API_BASE}/api/bundles/{petKey}/redeem?...` with the viewer
   address as `X-Forwarded-For` (same binding as rate limits).
3. Serve origin bytes only when the house returns `{ "allowed": true }`.
4. Otherwise respond **401 / 403 / 503** and **do not** fetch the object.
5. Missing `HOUSE_API_BASE`, network errors, and grant-store 503 all fail closed.

The edge worker does **not** hold `BUNDLE_SIGNING_KEY`. HMAC verification stays
on the house redeem path.

## Local verify (no cloud)

```bash
node deploy/cdn/edge-redeem.test.cjs
```

## Operator wiring (keeper's account — not CI)

1. Apply `deploy/terraform/` CDN outputs when ready (optional; skeleton only).
2. Publish `edge-redeem.js` as Lambda@Edge (origin-request) or a Cloudflare Worker.
3. Set `HOUSE_API_BASE` to the public house origin (e.g. `https://api.example`).
4. Point `BUNDLE_BASE_URL` at the distribution (`…/bundles`).
5. Confirm a spent URL returns 403 on a second GET (one-time grant).

Cross-link only in `deploy/terraform/modules/cdn/main.tf` — this slice does not
reopen Terraform modules beyond that line.
