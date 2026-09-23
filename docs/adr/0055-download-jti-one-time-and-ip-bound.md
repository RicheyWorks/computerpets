# 0055. Download jti grants are one-time and IP-bound

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `DownloadGrantIndex`, `InMemoryDownloadGrantIndex`, `RedisDownloadGrantIndex`, `DownloadGrantService`, `DownloadController`, `BundleController` redeem, `PetBundleService.signatureMatches`

## Context

[0003](0003-redis-rate-limit-and-jti-denylist.md) put `jti` in the signed download MAC (`pet|owner|jti|exp`) and left replay of that URL open for fifteen minutes. Phase 2.1 on the roadmap asked to layer one-time-use and IP binding on that foundation. A successful `POST /api/download/{pet}` still returned a URL any caller could GET until `exp`.

## Decision

Each issued signed URL is an open **download grant** keyed by `jti` + `exp` in the same Redis as rate limits (process memory when `rate-limit.backend=memory`).

1. **Issue** — after license validation, register the grant with the requesting `ClientAddress` (trusted-proxy XFF / `Forwarded`, else remote address — [0067](0067-trusted-proxy-client-address.md)) and the fifteen-minute TTL. If the grant store is down, **fail closed** with 503 and do not return a URL that cannot be tracked.
2. **Redeem** — `GET /api/bundles/{petKey}/redeem?owner=&jti=&exp=&sig=` verifies the HMAC, rejects an expired `exp`, then atomically consumes the grant. First success returns `{ "allowed": true, ... }`. A second redeem of the same grant returns **403** `download grant already used` with keeper copy to request a new download. The house does **not** silently re-open that grant.
3. **IP binding** — redeem must present the same address bound at issue when both are non-blank. Mismatch is **403** `download grant address mismatch`. An edge worker that calls redeem must forward the keeper's requesting address (same `X-Forwarded-For` convention as rate limits). Shared NAT / CGNAT may make several keepers look like one address. This is not geolocation and does not invent a city.
4. Signed query fields (`owner`, `jti`, `exp`, `sig`) stay on the URL. Catalog stays 221. DirectX 12 / Vulkan is not started. Presence / CSP series is not reopened.

## Consequences

- Replay of a spent download link denies with clear API copy. A fresh `POST /api/download` with a new bearer issues a new `exp` and a new grant. The same download JWT cannot mint a second URL ([0073](0073-download-jwt-single-use.md)).
- Redis is a runtime dependency for one-time download grants in `prod`, same as rate limits. Grant-store failure denies issue and redeem.
- Operators behind a trusted proxy must forward the real client address on redeem or IP binding will fail closed against the edge address.
- [0003](0003-redis-rate-limit-and-jti-denylist.md) still owns revoke; this slice does not move the deny-list.
