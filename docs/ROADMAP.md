# ComputerPets — Implementation Roadmap

This document outlines the phased plan to evolve the EnterprisePet Backend from its current secure baseline into a production-ready, scalable service.

> **Current Status (May 2026):** All P0 security items + **Phase 1 Production Readiness Foundations** have been completed.
> We are now starting **Phase 2: Security & Reliability Hardening**.

---

## Phase 0: Security & Quality Baseline (Completed)

All critical items required before any public or limited production exposure have been delivered:

- Real Steam Web API integration + provider enable/disable toggles
- Proper ABI decoding for NFT ownership verification
- Default `LICENSE_SECRET_KEY` now fails hard outside of tests
- Unit tests for all three ownership providers

**Outcome:** The service is now safe for internal development and limited testing.

---

## Phase 1: Production Readiness Foundations (Completed — May 2026)

**Goal:** Make the service safe, observable, and operationally ready for internal / limited production use.

### 1.1 Observability Baseline
- [x] Add Spring Boot Actuator + Prometheus metrics
- [x] Expose proper health, readiness, and liveness probes (`/actuator/health/liveness`, `/readiness`)
- [x] Add structured logging (request IDs, correlation IDs via MDC + `RequestMdcFilter`)
- [x] Custom health indicators (`SteamHealthIndicator`) + GlobalExceptionHandler with RFC 7807 ProblemDetails

### 1.2 Basic Persistence Layer
- [x] JPA `IssuedLicense` entity with jti, owner, pet, provider, timestamps, `revokedAt`
- [x] `LicenseRepository` (JpaRepository + `findByJti`)
- [x] Full revocation checks integrated into `LicenseService.validate()` (and issuance persistence)
- [x] Flyway `V1__Create_issued_licenses_table.sql` migration + `ddl-auto=validate`

### 1.3 CI/CD & Containerization
- [x] GitHub Actions (`ci.yml`): build/test + separate GHCR publish job (multi-arch tags)
- [x] Multi-stage `Dockerfile` (Eclipse Temurin 21, non-root `appuser`, healthcheck with wget)
- [x] `docker-compose.yml` (app + Postgres 16 + optional WireMock profile) with proper health conditions
- [x] `.dockerignore`, externalized Steam base URL + secrets via env

### 1.4 API Contract & Documentation
- [x] Full springdoc-openapi + rich `@Schema` DTOs (VerifySuccessResponse, DownloadResponse, ErrorResponse, PetInfo, etc.)
- [x] Centralized `ApiExamples` class with 25+ reusable request/response/error examples (all 3 providers, download flows, 10+ error variants)
- [x] Professional docs/ folder (ARCHITECTURE.md living doc, ROADMAP.md, SETUP.md, CONTRIBUTING.md, README index)
- [x] Root README + .github/ issue/PR templates for open-source readiness

**Outcome:** The backend is now production-foundation ready. Docker images publish to GHCR, Postgres-backed, fully observable, and have excellent machine-readable API contracts.

**Phase 1 completed May 2026.**

---

## Phase 2: Security & Reliability Hardening (Current Focus — Starting May 2026)

**Goal:** Significantly improve defense-in-depth and reduce operational risk.

- **2.1 Download Authorization Hardening**
  - [x] jti-bound signed download URLs (signature now `pet|owner|jti|exp`)
  - [x] Usage recording (`lastUsedAt` on IssuedLicense) on every successful download via /api/download
  - One-time-use + IP binding can now be layered on the jti foundation

- **2.2 Hardware Binding (hwid)**
  - [x] Optional `hwid` stored on IssuedLicense + inside the encrypted LicensePayload
  - [x] Enforced at download time when the license was originally issued with a device binding

- **2.3 Resilience Patterns**
  - [x] Circuit breakers + retries (Resilience4j) added for Steam, Microsoft, and NFT providers (with per-provider configuration in application.yml)
  - Timeouts and graceful degradation (in progress — fallbacks currently deny safely)

- **2.4 Secret Management**
  - All critical secrets already use the same strict fail-hard placeholder pattern (LICENSE_SECRET_KEY, JWT_*, BUNDLE_*, new ADMIN_API_KEY)
  - docker-compose and application.yml updated for the admin key
  - Recommended production path: Vault / Kubernetes External Secrets / Docker secrets (documented in SETUP)

- **Admin Tooling (new)**
  - [x] `POST /api/admin/revoke` — revokes any license by jti using the existing persistence layer. Protected by `X-Admin-Key` header.

---

## Phase 3: Scalability & Operational Maturity

**Goal:** Prepare the service for horizontal scaling and production traffic.

- **3.1 Distributed State**
  - Redis-backed rate limiting (replace in-memory Bucket4j)
  - Distributed revocation / jti blacklist

- **3.2 Observability Maturity**
  - Distributed tracing (Micrometer + OpenTelemetry)
  - Custom business metrics (verification success rate, latency per provider)

- **3.3 Deployment & Environments**
  - Proper Spring profiles (`dev` / `staging` / `prod`)
  - Kubernetes manifests or Helm charts
  - Blue/green or canary deployments

---

## Phase 4: Client & Ecosystem Integration

**Goal:** Deliver a complete, usable platform for the desktop client.

- Finalize and publish the PyQt6 client contract (license format, hwid, decryption)
- Add more ownership providers (Epic, Itch.io, Solana, etc.)
- Build internal admin tools for revocation and audit

---

## Phase 5: Long-term Architecture Evolution

**Goal:** Prepare the system for growth and increased complexity.

- Evaluate splitting into bounded contexts (License Service, Provider Gateway, etc.)
- Consider event-driven patterns for revocation and auditing
- Dynamic, admin-managed Pet Catalog
- Multi-tenancy support (if needed)

---

## Documentation & Process (Ongoing)

- Keep `README.md`, `ARCHITECTURE.md`, and this roadmap in sync
- Introduce Architecture Decision Records (ADRs) under `docs/adr/`
- Perform lightweight threat modeling for every new provider
- Conduct regular architecture and security reviews

---

**Last Updated:** 2026-05-24 (Phase 2.3 resilience foundation started)

This roadmap is a living document. It will be updated as priorities, constraints, and learnings evolve.