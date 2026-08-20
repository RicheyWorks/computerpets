# 0007. PyQt6 blotter client implements the same contract; Electron overlay stays

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `client/`; [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md); `client/README.md`
- **Supersedes:** the “PyQt remains vision” clause of [0005](0005-electron-overlay-implements-client-contract.md)

## Context

[0005](0005-electron-overlay-implements-client-contract.md) made the Electron
overlay (`desktop/license/`) the first native client of the published
handshake. Architecture copy still described a future PyQt6/GPU app.
A second toolkit was not required to prove the contract — but the
roadmap still asked for a real start on that desk, not another README.

The living-desk PNGs are not in this repository. A custom shader engine
would be a lie if it only blitted CPU pixmaps.

## Decision

A new **`client/`** tree is the first PyQt6 blotter client:

- `python -m computerpets_client` opens a window with a living pet.
  Every catalog key the backend `PetType` / web roster already has can
  appear (picker, cycle, or house voice). Snakes crawl; the tide swims;
  hermit and horseshoe walk the damp floor; the garden sits and leans;
  the others walk.
- Drawing is **Qt-accelerated**: `QGraphicsView` + `QOpenGLWidget`
  viewport (Qt RHI / OpenGL compositing). If OpenGL cannot attach, the
  scene falls back to Qt software raster and says so. This is **not** a
  custom shader engine.
- Unlock is a port of `desktop/license/`: verify → AES-256-GCM decrypt
  (32-byte key, no KDF, 12-byte IV, 16-byte tag appended) → hwid →
  signed download. Same wire format. Fail closed. No “always licensed”
  stub.
- Care verbs that already exist on the living desk and fit this cut:
  feed, treat, play, hide / call back, clean, medicine, shed for the
  ten snakes, the ten tide guests, the ten garden plants, the ten hive insects, the ten pond Animalia, the ten roost birds, the ten corner guests, the ten wood mammals, the ten stone reptiles, the ten creek fish, the ten log guests, the ten cellar fungi, the ten well leftovers, the ten far guests, and the one hundred seventy species specials (Steal ribbon, Heel,
  Play dead, Ink, Carpet, Waggle, Drink, …). The blotter can go unkempt; the guest can go unwell.
- Daily weather, today’s visitor, and snake shed are **ports** of
  `web/src/lib/pets/weather.ts`, `visitor.ts`, and `shed.ts` — not a
  third house clock and not a rewrite of `desktop/`. The blotter now
  keeps house hours from `hours.ts` (dawn / day / dusk / night, and
  the one hundred seventy rest windows) on the same wood. Play and the one hundred seventy
  specials are ports of `specials.ts` and `traits.ts`.
- The Electron overlay remains a contract client. `desktop/` is not
  rewritten.

Pets walk without a license (same as the overlay). Unlock talks to a
running backend. Tests use a clearly named contract test double.

Do not invent a live NFT collection address or a Solana provider.

## Consequences

- Contract changes must update `docs/CLIENT-CONTRACT.md`,
  `desktop/license/`, and `client/computerpets_client/license/` together.
- Local decrypt still requires provisioning `LICENSE_SECRET_KEY` into
  the client process ([0002](0002-aes-gcm-license-and-short-jwt.md)).
- A later custom GPU renderer can replace the Qt viewport without
  changing the handshake.
- `/study`, `/snakes`, and the Electron overlay are out of scope for
  this tree.
