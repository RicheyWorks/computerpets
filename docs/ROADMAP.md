# ComputerPets — Implementation Roadmap

This document outlines the phased plan to evolve the EnterprisePet Backend from its current secure baseline into a production-ready, scalable service.

> **Current Status (May 2026):** All P0 security and quality items have been completed. We are now in **Phase 1**.

---

## Phase 0: Security & Quality Baseline (Completed)

All critical items required before any public or limited production exposure have been delivered:

- Real Steam Web API integration + provider enable/disable toggles
- Proper ABI decoding for NFT ownership verification
- Default `LICENSE_SECRET_KEY` now fails hard outside of tests
- Unit tests for all three ownership providers

**Outcome:** The service is now safe for internal development and limited testing.

---

## Phase 1: Production Readiness Foundations (Current Focus)

**Goal:** Make the service safe, observable, and operationally ready for internal / limited production use.

### 1.1 Observability Baseline
- [x] Add Spring Boot Actuator + Prometheus metrics
- [ ] Expose proper health, readiness, and liveness probes
- [ ] Add structured logging (request IDs, correlation IDs via MDC)
- [ ] Basic error tracking / alerting integration

**Status:** Actuator + health probes added (May 2026). Remaining items in progress.

### 1.2 Basic Persistence Layer
- [ ] Introduce JPA `IssuedLicense` entity
- [ ] Add `LicenseRepository` with revocation support
- [ ] Integrate revocation checks into `LicenseService`
- [ ] Add database migrations (Flyway or Liquibase)

### 1.3 CI/CD & Containerization
- [ ] GitHub Actions pipeline (build → test → package)
- [ ] Multi-stage `Dockerfile` + `.dockerignore`
- [ ] `docker-compose.yml` for local dev (app + Postgres)

### 1.4 API Contract & Documentation
- [ ] Minimal OpenAPI / Springdoc support
- [ ] Publish clear request/response contract for the desktop client

**Target:** Complete Phase 1 within 2–4 sprints.

---

## Phase 2: Security & Reliability Hardening

**Goal:** Significantly improve defense-in-depth and reduce operational risk.

- **2.1 Download Authorization Hardening**
  - One-time-use or IP-bound signed download URLs
  - Embed license `jti` into HMAC signatures

- **2.2 Hardware Binding (hwid)**
  - Add `hwid` claim to licenses
  - Validate hardware fingerprint on verify and download

- **2.3 Resilience Patterns**
  - Circuit breakers + retries (Resilience4j) for external providers
  - Timeouts and graceful degradation

- **2.4 Secret Management**
  - Integrate with AWS Secrets Manager / Vault / Kubernetes External Secrets
  - Implement secret rotation

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

**Last Updated:** May 2026

This roadmap is a living document. It will be updated as priorities, constraints, and learnings evolve.