# 0002. AES-256-GCM licenses plus a short JWT

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `LicenseService`, `JwtService`, `DownloadController`; wire rules in [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md)

## Context

After a provider grants ownership, the client needs a durable
entitlement and a short-lived right to ask for a CDN URL. A server-side
session would pin the user to one replica. A plaintext license would be
forgeable. Putting the AES master key *only* on a future GPU/PyQt
client (the original sketch) would let any extracted binary mint
licenses.

The download path must still work if the client never decrypts: it can
POST the opaque `ciphertext` + `iv` back.

## Decision

**Issuance is server-side only.** `LicenseService` encrypts a JSON
payload (`jti`, `owner`, `pet`, `validUntil`, `issuedAt`, optional
`hwid`) with AES-256-GCM:

- Key is `Base64.decode(LICENSE_SECRET_KEY)` — exactly 32 bytes, no KDF,
  no salt, no AAD.
- IV is 12 random bytes, sent as `license.iv`, not prepended.
- 128-bit tag is appended to the ciphertext (BouncyCastle
  `GCMBlockCipher` / standard AES-GCM wire form).
- Encoding is RFC 4648 standard Base64.

The committed default key is rejected at startup except under the
`test` profile.

Alongside the sealed license, `JwtService` issues a **30-minute HS256
JWT** (`iss=enterprisepet-backend`, `sub=owner`, `pet`, `prv`). Clients
replay it as `Authorization: Bearer`. They do not need `JWT_SECRET_KEY`.
`POST /api/download/{petKey}` decrypts the license, then cross-checks
JWT `sub` / `pet` against the payload.

Local decrypt is **optional for the handshake** and **required today
for the Electron unlock UI** (it reads `jti` / `owner` / `pet` / `hwid`
from the plaintext). That client is provisioned with the same
`LICENSE_SECRET_KEY`. Holding the key lets it decrypt; it does not let
it issue. `BUNDLE_SIGNING_KEY` is optional on the client (URL check
only).

## Consequences

- A stolen license without a matching fresh JWT cannot download. A JWT
  for pet A cannot fetch pet B.
- Compromising `LICENSE_SECRET_KEY` is catastrophic (forgery + decrypt
  of every issued payload). It must stay out of git and out of the
  living-desk browser bundle.
- The Electron overlay currently *does* hold the master key for local
  decrypt. That is a provisioning fact, not “the client is the CA.”
  Download still accepts opaque ciphertext if a client never decrypts.
- Revocation is not a property of decrypt. A locally decrypted payload
  can still be denied on `/api/download` via the ledger and deny-list
  ([0003](0003-redis-rate-limit-and-jti-denylist.md)).
- JWT TTL is only long enough for the download handshake, not a year of
  entitlement. The license lifetime is 365 days (`VerifyController.LICENSE_DAYS`).
