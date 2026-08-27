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
- [x] Root README + .github/ issue/PR templates

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
  - [x] Circuit breakers + retries (Resilience4j) added for Steam, Microsoft, NFT, Itch, and Epic providers (with per-provider configuration in application.yml)
  - Timeouts and graceful degradation (in progress — fallbacks currently deny safely)
  - [x] Microsoft Store verify uses Collections v9 `publisherQuery`; prod still refuses dev-mode; live Store ID is still a publish-time config, not invented here.

- **2.4 Secret Management**
  - All critical secrets already use the same strict fail-hard placeholder pattern (LICENSE_SECRET_KEY, JWT_*, BUNDLE_*, new ADMIN_API_KEY)
  - docker-compose and application.yml updated for the admin key
  - Recommended production path: Vault / Kubernetes External Secrets / Docker secrets (documented in SETUP)

- **Admin Tooling (new)**
  - [x] `POST /api/admin/revoke` — revokes any license by jti using the existing persistence layer. Protected by `X-Admin-Key` header.

- **2.5 NFT entitlement hardening (Aug 2026)**
  - [x] Reject malformed wallets (`0x`, short hex) instead of substring-matching ABI words
  - [x] Official collection allowlist (`ethereum.collections`) so a random ERC-721 cannot mint a pet license
  - [x] Optional `tokenId → petType` binding; mismatch is a 403
  - [x] ERC-1155 `balanceOf` + `AUTO` fallback
  - [x] Required `personal_sign` proof of wallet control (fail closed)
  - [x] RPC timeouts, placeholder-RPC health indicator, `GET /api/verify/nft/collections`

---

## Phase 3: Scalability & Operational Maturity

**Goal:** Prepare the service for horizontal scaling and production traffic.

- **3.1 Distributed State**
  - [x] Redis-backed rate limiting (replace in-memory Bucket4j)
  - [x] Distributed revocation / jti blacklist

- **3.2 Observability Maturity**
  - [x] Distributed tracing (Micrometer + OpenTelemetry)
  - [x] Custom business metrics (verification success rate, latency per provider)

- **3.3 Deployment & Environments**
  - [x] Proper Spring profiles (`dev` / `staging` / `prod`)
  - [x] Kubernetes manifests (`deploy/k8s/`, not Helm)
  - [x] Blue/green via two Deployments + Service `color` selector (no mesh)

---

## Phase 4: Client & Ecosystem Integration

**Goal:** Deliver a complete, usable platform for the desktop client.

- [x] Living desk browser client (`web/`) — Rui the red panda walks, eats, plays, sleeps, talks
- [x] Native Windows overlay (`desktop/`) — Rui lives on the actual desktop
- [x] Cat (Miso) wakes on the living desk
- [x] Dog (Pip) wakes on the living desk
- [x] Browser ad demos (`/meet`, `/demo/rui`, `/demo/miso`, `/demo/pip`)
- [x] Full catalog awake — all two hundred twenty living kinds have living browser demos
- [x] Windows/Mac desktop overlay for all two hundred twenty + phone/tablet Live companion
- [x] Backend `PetType` catalog matches the living desk (ten snakes, a tide of ten sea creatures, a garden of ten plants, a hive of insects plus bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of ten wild mammals, a canopy of ten tree mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a shore of ten strand guests, a reef of ten living-rock guests, a meadow of ten grass-and-night insects, a cellar of ten fungi, a well of ten leftovers, a far den of ten xenobiology guests, and a grid of ten cyber dragons licensed)
- [x] Per-species life sim — hunger clocks, mess, illness, age, specials, Windows hardening
- [x] Mind plugin bus — 14 AI backends, per-pet assignment, custom webhook
- [x] Browser desk specials + house journal; species gaits on every screen
- [x] Desk hide/mess/night + living Meet house floor
- [x] Treat drop, walk-off hide, species sleep clocks
- [x] Click-to-treat, play chase lure, dawn/day/dusk/night
- [x] Treat/chase/hide on desk, demos, Live, Meet, and Windows overlay
- [x] Fleeing lure + bond titles (New→Soul) on every screen
- [x] Return greetings + hatchling/elder scale on desk, demos, Live, Windows
- [x] Species treats + gifts + demo specials on every screen
- [x] Daily weather (rain/wind/heat) they sit or swim in, all platforms
- [x] Daily house visitor walks through desk, demos, Live, Meet, Windows
- [x] Ten named snakes on desk, demos, Live, Meet, and Windows overlay
- [x] Tide den at `/sea` — ten marine animals on the blotter; plaques teach (jelly and star are not fish; a horseshoe crab is not a crab)
- [x] Garden den at `/garden` — ten plants on the blotter; plaques teach (moss has no flower; a saguaro is not a tree; three hunt: snap, pitfall, glue)
- [x] Far den at `/far` — ten guests that never evolved here; plaques teach
- [x] Snakes go blue and shed; old coat stays on the blotter, all platforms
- [x] Native client contract published (`docs/CLIENT-CONTRACT.md`) — license AES-256-GCM format, hwid rules, JWT, signed download URL
- [x] Bundle artifact catalog — optional version / platform / sha256 on the signed manifest (`bundle.catalog`; empty until a zip is published)
- [x] Electron overlay first contract slice (`desktop/license/`) — Steam verify, AES-256-GCM decrypt, hwid bind, signed download (no invented NFT address)
- [x] PyQt6 blotter client (`client/`) — living Rui, Qt OpenGL viewport (not a custom shader engine), same contract unlock, feed / treat / hide
- [x] Itch.io ownership provider (download-key receipt verify via `ITCH_API_KEY`)
- [x] Epic Games Store ownership provider (EOS Auth client_credentials + Ecom v3 ownership)
- Add more ownership providers (Solana, etc.) — Solana stays blocked until a live collection address exists
- [x] Richer admin UI for revocation and audit (`GET /api/admin/licenses`, `GET /api/admin/licenses/{jti}`, house `/admin` ledger; `POST /api/admin/revoke` already shipped)

---

## Phase 5: Long-term Architecture Evolution

**Goal:** Prepare the system for growth and increased complexity.

- Evaluate splitting into bounded contexts (License Service, Provider Gateway, etc.)
- Consider event-driven patterns for revocation and auditing
- Dynamic, admin-managed Pet Catalog
- Multi-tenancy support (if needed)

---

## Phase 6: House polish — the X ads

**Goal:** Grow into the capability of the two ComputerPets X posters without taking their slogan. Every living guest feels as present, instrumented, and house-hand as Rui in those frames — living on the real Windows desktop, GPU-lit, with a keeper HUD that tells the truth about feed / play / rest and about the machine they live on.

North-star write-up: [ARCHITECTURE.md §11](ARCHITECTURE.md#11-house-polish-north-star-the-x-ads). This phase is the bar. Do not mark HUD / GPU items done until the house ships them. The leftover art campaign on the original 210 is finished. Catalog is two hundred twenty. Arc is the first cyber-dragon guest. Volt is the second. Trace is the third. Flux is the fourth. Spark is the fifth. Ion is the sixth. Gauss is the seventh. Relay is the eighth. Fuse is the ninth. Ground is the tenth.

- [x] House-hand keeper card on overlay, `/demo`, desk, Live, and Meet: name, stage / bond, hunger / rest / bond, FEED / PLAY / REST. Same house. Care is local. `/pet/feed` is not a door. Pirate is Rui’s character, not a new guest.
- [x] Keeper card sits the desk: collapse, personal volume, card color, house-voice styles (still `speechSynthesis`), saved lines, alarm, timer, per-bus mutes, honest overlay quit. Sleep stays on the sleep pose until a real wake. Catalog stays 220.
- [x] Overlay and `/demo` heartbeat that tells the truth about Spring Boot (up/down, profile, uptime) from `GET /api/public/heartbeat` — never a painted “UP”. Unreachable Java is DOWN / unread.
- [x] Rui-sharp poster look for that card. Guest name, stage, bond title, hunger / rest / bond, Feed / Play / Rest, honest heartbeat. Same house on overlay, `/demo`, desk, Live, and Meet.
- [ ] Align advertised care routes with what we ship, or grow `/pet/feed`, `/pet/play`, `/pet/rest` as the contract. Do not claim 200s we do not return.
- [ ] Honest GPU sense as a first-class pet sense (heat, util, memory, power). `/metrics/gpu` or desktop-local metrics. Do not fake numbers.
- [ ] Real GPU path: DirectX 12 / Vulkan, or an honest Chromium GPU path that still feels like the ad. Today’s overlay is Electron/Chromium; the blotter is Qt OpenGL. Do not invent a finished DX12 engine.
- [x] Pets occupy the real Windows 10/11 desktop among real windows and icons. Work-area floor, click-through glass, tray picks Rui, Sip, and the grid ten. `/demo` lockstep. Overlay is still Electron/Chromium, not DX12. Desktop-first. Mac / Linux / phone after Windows feels like the ad.
- [x] House leftover on overlay + `/demo`: keeper multi-area weather plate (Open-Meteo, first-run `no area set`), Wikipedia news plate, Rui ground tricks, Sip pinned and flying (not a 1-second flash), five house voices, footstep options, free music + radio for Rui, and a real steal/carry ribbon. Catalog stays 220. Sandbox stays on.
- [x] Real window rects on Windows (work-area space, skip overlay / minimized / taskbar). Rui (`red_panda`) clings a window side and dives. The species door (`playFor`) is how later guests get their own sit. Other guests walked a sill that leftover. `/demo` draws a plate and walks the same climb. Sleep and hide still win. Mac / Linux window play is a later door. Catalog stays 220.
- [x] Arc (`cyber_dragon` / `arc`) rides a real window ridge: jump onto the title-bar / top, hold, then hop or slide off. Not Rui's cling-dive. Not the generic sill. Same `playFor` door. `/demo` lockstep. Sleep, hide, leave, rest, and the keeper card still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Volt leftover follows.
- [x] Volt (`volt_dragon` / `volt`) coils a real window corner: wrap the top-left or top-right edge-corner, hold, then uncoil off. Not Rui's cling-dive. Not Arc's title-bar ridge. Not the generic sill. Same `playFor` door. `/demo` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Do not start Trace.
- [x] Honest Windows desk download teaching: START-HERE / README lead with the real overlay path. Node after the pets-on-the-desk picture. No Store ID. No published `.exe`. `/demo` stays the same house. Catalog stays 220.
- [x] Overlay finds the roster on Windows: renderer asks main for the house it already read. Sandboxed `file://` fetch is not a door. Catalog stays 220.
- [ ] Desktop presence is not filesystem theft: no silent read/write/exfil, no keyloggers, no secret capture.
- [ ] HUD may show who is listening on the mind plugin bus. Keys stay with the keeper.
- [x] Leftover art campaign on the original two hundred ten is finished (Peak, PR #303). Rui stays the bar. No stamps, no parchment islands. Never retouch a landed guest while sitting a new one.
- [x] Arc sits the first cyber dragon (`cyber_dragon` / `arc`). Catalog was 211. Grid den opened only as far as Arc needs. No invented NFT / Store IDs. Never retouch `START-HERE.md` to paper over `house-count.test.mjs`.
- [x] Volt sits the second cyber dragon (`volt_dragon` / `volt`). Catalog is 212. Same grid den. Coil along the ribs, not Arc's dorsal jump. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Trace sits the third cyber dragon (`trace_dragon` / `trace`). Catalog is 213. Same grid den. A single live circuit-trace from snout to tail, not Arc's dorsal jump, not Volt's rib coils. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Flux sits the fourth cyber dragon (`flux_dragon` / `flux`). Catalog is 214. Same grid den. A living heat-field under the hide, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Spark sits the fifth cyber dragon (`spark_dragon` / `crackle`). Catalog is 215. Same grid den. Live crackle-points at snout, claws, and tail, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Ion sits the sixth cyber dragon (`ion_dragon` / `ion`). Catalog is 216. Same grid den. A pale ion haze clinging to the outline, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field, not Spark's crackle-points. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Gauss sits the seventh cyber dragon (`gauss_dragon` / `gauss`). Catalog is 217. Same grid den. Iron-filing field lines banding the hide, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field, not Spark's crackle-points, not Ion's outline haze. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Relay sits the eighth cyber dragon (`relay_dragon` / `relay`). Catalog is 218. Same grid den. A single live click-node at the nape, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field, not Spark's crackle-points, not Ion's outline haze, not Gauss's iron-filing bands. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Fuse sits the ninth cyber dragon (`fuse_dragon` / `fuse`). Catalog is 219. Same grid den. A single glass cartridge fuse across the sternum, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field, not Spark's crackle-points, not Ion's outline haze, not Gauss's iron-filing bands, not Relay's nape click-node. No invented NFT / Store IDs. Never retouch landed guests.
- [x] Ground sits the tenth cyber dragon (`ground_dragon` / `ground`). Catalog is 220. Same grid den. A braided copper ground-strap from a chest lug down the left foreleg to a claw-lug, not Arc's dorsal jump, not Volt's rib coils, not Trace's circuit-trace, not Flux's heat-field, not Spark's crackle-points, not Ion's outline haze, not Gauss's iron-filing bands, not Relay's nape click-node, not Fuse's glass cartridge. No invented NFT / Store IDs. Never retouch landed guests.

---

## Documentation & Process (Ongoing)

- Keep `README.md`, `ARCHITECTURE.md`, and this roadmap in sync
- [x] Architecture Decision Records under [`docs/adr/`](adr/README.md) — decisions already true on `main`, not a wishlist
- Perform lightweight threat modeling for every new provider
- Conduct regular architecture and security reviews

---

**Last Updated:** 2026-08-27 (Phase 6 leftover: weather, news, Sip, ribbon)

This roadmap is a living document. It will be updated as priorities, constraints, and learnings evolve.