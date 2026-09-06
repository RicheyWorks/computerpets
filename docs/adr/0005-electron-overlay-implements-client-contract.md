# 0005. Electron overlay implements the client contract; PyQt remains vision

- **Status:** Superseded by [0007](0007-pyqt-blotter-client.md) for the “PyQt remains vision” clause. The Electron overlay is still a contract client.
- **Date:** 2026-08-17
- **Code:** `desktop/license/`; [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md); `desktop/README.md`

## Context

`ARCHITECTURE.md` still describes the native client as a future
PyQt6/Python app. The living desk (`web/`) is a browser house, not a
license client. Someone still has to implement the real handshake
against `LicenseService` / `JwtService` / `PetBundleService` without
inventing endpoints, a bundle zip layout, or an NFT address.

A second GPU toolkit (PyQt) is not in this repository and is not
required to prove the contract.

## Decision

The **Electron overlay** (`desktop/`) is the native client that
implements [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md):

- `POST /api/verify/{provider}` → store opaque `ciphertext` / `iv` and
  the JWT.
- AES-256-GCM decrypt with the same `LICENSE_SECRET_KEY` (no KDF) so
  the unlock UI can show `jti` / owner / pet / expiry.
- Device `hwid` (opaque, ≤ 128 chars) on verify and, when bound, on
  download.
- `POST /api/download/{petKey}` with Bearer JWT, then GET of the
  HMAC-SHA256 URL (`petKey|owner|jti|exp`).

Steam is the first unlock shape in the tray UI (`steamId`, `appId`,
`petType`, `hwid`). The HTTP client will call any registered provider
key; the settings form does not add NFT or Solana fields.

PyQt6 was **vision** when this ADR landed. [0007](0007-pyqt-blotter-client.md)
adds `client/` as a second implementation of the same contract. This ADR
still governs the Electron overlay.

Overlay pets already walk on the desk without a license. Unlock is
fail-closed: missing backend, bad ciphertext, expiry, revoked `jti`,
or hwid mismatch do not stub “always licensed.”

## Consequences

- Contract changes must update `docs/CLIENT-CONTRACT.md` and
  `desktop/license/` together. The browser desk is not the license
  client.
- Local decrypt requires provisioning `LICENSE_SECRET_KEY` into the
  overlay process ([0002](0002-aes-gcm-license-and-short-jwt.md)). The
  living-desk web app does not get that key.
- A PyQt client must implement the same contract; it does not replace
  these rules. See [0007](0007-pyqt-blotter-client.md).
- Do not invent a live NFT collection address or a Solana provider to
  make the overlay look complete ([0004](0004-empty-nft-allowlist.md)).
