# 0059. Hikari pool defaults and optional deny-safe read replica

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `spring.datasource.hikari.*` defaults; `spring.datasource.replica.*`; `ReadReplicaDataSourceConfiguration`; `ReplicaRoutingSupport`; `ProductionProfileGuard` replica checks

## Context

ARCHITECTURE §10 / Phase 3.2 Database & Persistence Maturity still listed **read replicas strategy and connection pooling tuning** after the license soft-delete / audit ledger slice ([0058](0058-license-soft-delete-and-audit.md)). Inventory on `main` tip `f0be282f7`:

- HikariCP ran on Spring Boot defaults only (no documented size / timeout / leak-detection).
- Redis rate-limit / jti / download-grant traffic already used a **single Lettuce connection** with `REDIS_TIMEOUT` (not a Hikari-style pool) — keep that; do not invent a second Redis pool.
- No `AbstractRoutingDataSource` / replica JDBC URL seam existed. Spring Data JPA already marks repository reads `@Transactional(readOnly=true)` — that is the routing seam, not a fake cloud.

This slice closes the pool + optional-replica gap without storefront work, without DirectX 12 / Vulkan, and without inventing a hosted Postgres replica. Presence / CSP and license soft-delete are not reopened beyond this cross-link. Catalog stays 221. Solana stays blocked.

## Decision

**Document Hikari defaults. Optional replica is deny-safe. Blank replica URL = primary only.**

1. **Primary pool** — `application.yml` sets explicit Hikari defaults: `maximum-pool-size=10`, `minimum-idle=2`, `connection-timeout=3s`, `validation-timeout=1s`, `idle-timeout=10m`, `max-lifetime=30m`, `leak-detection-threshold=0` (off). Staging/prod raise leak detection to **60s**. All overridable via `HIKARI_*`.
2. **Optional replica** — `SPRING_DATASOURCE_REPLICA_URL` (and optional user/password, else inherit primary). When blank, Boot keeps a single pool. When set, `ReadWriteRoutingDataSource` sends `@Transactional(readOnly=true)` to the replica and **everything else** (writes, Flyway, non-transactional JDBC) to primary.
3. **Deny-safe** — refuse startup when replica URL equals primary (query-stripped), when replica is H2, or when replica is set without a primary. Replica `HikariDataSource` is forced `readOnly=true` and Postgres gets `SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY`. Writes must not silently hit a read-only URL.
4. **No invented cloud** — in-cluster `deploy/k8s/postgres.yaml` stays a single primary. Operators point `SPRING_DATASOURCE_REPLICA_URL` at a real managed read replica when they have one.

## Consequences

- Local `mvn` / H2 tests stay on one pool; no replica required.
- Misconfigured replica fails at startup with a clear `IllegalStateException`, not a late write error on a read-only endpoint.
- Bundle zip contents and fail-closed update land in [0060](0060-bundle-zip-contents-and-update.md). Image signing and Terraform remain the next non-storefront / non-DX12 maturity items.
