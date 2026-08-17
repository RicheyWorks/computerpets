# 0003. Redis for shared rate limits and the jti deny-list; Postgres is the revoke ledger

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `RateLimitingFilter`, `RedisRateLimitBackend`, `RevocationIndex`, `RedisRevocationIndex`, `LicenseService`, `IssuedLicense`

## Context

Replicas must share two kinds of short-lived state:

1. Per-IP token buckets on `/api/verify/` (10/min) and `/api/download/`
   (30/min). An in-memory Bucket4j map on each pod silently multiplies
   the limit by replica count.
2. Immediate reject of a revoked `jti` even if a replica has not seen
   the `IssuedLicense.revokedAt` row yet.

The durable record of “this license existed / was revoked / was used”
cannot live only in a cache. Redis loss must not resurrect a revoked
license.

## Decision

**Postgres is the ledger.** Every issue writes `issued_licenses`
(`jti` PK, owner, pet, provider, timestamps, optional `hwid`,
`revokedAt`, `lastUsedAt`). `LicenseService.validate` treats a missing
`jti` or a set `revokedAt` as invalid (same 401 as a bad ciphertext).
Admin revoke (`POST /api/admin/revoke`) sets `revokedAt` first.

**Redis is the shared fast path**, same instance as the rate limiter
(`rate-limit.backend=redis`, Lettuce):

- Bucket4j via `bucket4j-redis` for the two HTTP buckets. If Redis is
  unreachable the filter **fail-closes with HTTP 503** and
  `Retry-After`. It does not fall back to per-pod memory.
- `RevocationIndex` keys `revoked:jti:{jti}` (SETEX, TTL ≥ remaining
  license life + 1h skew). Revoke writes Postgres, then the index.
  Validate checks the index, then the ledger.

If the deny-list is down, validate **falls back to Postgres**. It does
not accept a revoked license. HTTP download may still 503 from the
rate-limit filter.

`RATE_LIMIT_BACKEND=memory` is tests / a single local process only.
`ProductionProfileGuard` refuses it under `prod`.

## Consequences

- Adding a replica does not lift verify/download budgets and does not
  create a revoke race that lasts until every pod sees the row.
- Redis is a runtime dependency for HTTP verify/download. Operators
  cannot “run without Redis” in `prod`.
- A Redis write failure after a successful Postgres revoke is logged;
  a repeat revoke heals the deny-list. Replicas that only have the
  ledger still deny, just after a DB read.
- The deny-list is not a second source of truth. Do not revoke only in
  Redis.
- Signed download URLs are still replayable for 15 minutes. jti is in
  the HMAC; one-time or IP-bound URLs are not this decision.
