# Architecture Decision Records

← [Back to Documentation Index](../README.md)

This folder records **decisions the code already made**. Each ADR explains a
choice a new engineer will trip over if they only read the living desk or a
stale paragraph in `ARCHITECTURE.md`.

ADRs are not a wishlist. Do not file one for Solana, a live NFT collection
address, or an API that is not on `main`.

| Field | Value |
|-------|--------|
| **Template** | Status, Context, Decision, Consequences ([Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)) |
| **Numbering** | Four-digit prefix, sequential (`0001`, `0002`, …) |
| **Status values** | `Accepted` (true on `main`), `Superseded` (point at the replacement), `Deprecated` |

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-modular-monolith-ownership-provider.md) | Modular monolith with an `OwnershipProvider` SPI | Accepted |
| [0002](0002-aes-gcm-license-and-short-jwt.md) | AES-256-GCM licenses plus a short JWT | Accepted |
| [0003](0003-redis-rate-limit-and-jti-denylist.md) | Redis for shared rate limits and the jti deny-list; Postgres is the revoke ledger | Accepted |
| [0004](0004-empty-nft-allowlist.md) | Official NFT allowlist stays empty until a collection exists | Accepted |
| [0005](0005-electron-overlay-implements-client-contract.md) | Electron overlay implements the client contract (PyQt-vision clause superseded by 0007) | Superseded (in part) |
| [0006](0006-spring-profiles-and-kubernetes-manifests.md) | Spring `dev` / `staging` / `prod` profiles and Kubernetes manifests (not Helm) | Accepted |
| [0007](0007-pyqt-blotter-client.md) | PyQt6 blotter client implements the same contract; Electron overlay stays | Accepted |
| [0008](0008-desktop-local-gpu-sense.md) | GPU load is desktop-local on the keeper machine, not `/metrics/gpu` | Accepted |
| [0009](0009-mind-listener-name.md) | The keeper HUD names who is listening; it does not show the key | Accepted |
| [0010](0010-presence-does-not-open-files.md) | Desk presence does not open a dropped keeper file | Accepted |
| [0011](0011-presence-does-not-list-folders.md) | Desk presence does not list user folders or read window titles | Accepted |
| [0012](0012-presence-does-not-log-keys.md) | Desk presence does not log keys outside a focused field | Accepted |
| [0013](0013-weather-locate-is-not-a-process-grant.md) | Weather location is a click, not a process grant | Accepted |
| [0014](0014-weather-does-not-ask-an-ip-place.md) | Weather does not ask an IP place service | Accepted |
| [0015](0015-weather-locate-sends-a-rounded-place.md) | A weather locate sends a rounded place, and a saved typed area wins | Accepted |
| [0016](0016-weather-locate-waits-for-an-in-app-yes.md) | A live weather locate waits for an in-app yes | Accepted |
| [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md) | A saved computer place waits for a forecast yes | Accepted |
| [0018](0018-mind-key-is-not-plain-text.md) | The overlay plugin key is not plain text in mind.json | Accepted |
| [0019](0019-license-mark-is-a-local-hash.md) | A license mark is a local hash of a named machine id | Accepted |
| [0020](0020-desk-mind-key-is-not-in-the-browser.md) | The desk `/mind` key is not stored in the browser | Accepted |
| [0021](0021-desk-talk-does-not-send-the-key.md) | Desk talk does not send the plugin key to the house | Accepted |
| [0022](0022-gemini-key-stays-off-the-query.md) | The overlay Gemini call does not put the plugin key on the query string | Accepted |
| [0023](0023-pasted-key-query-is-dropped.md) | A pasted plugin URL drops a key query before the direct call | Accepted |
| [0024](0024-desk-talk-drops-a-pasted-key-query.md) | Desk talk drops a pasted key query before the post | Accepted |
| [0025](0025-listener-read-drops-a-pasted-key-query.md) | The listener read drops a pasted key query before the post | Accepted |
| [0026](0026-mind-json-drops-a-pasted-key-query.md) | mind.json drops a pasted key query on save and on read | Accepted |

## How to add one

1. Confirm the decision is already true in the code on `main` (or lands in the same PR).
2. Copy the headings from any existing ADR. Do not invent endpoints, collection
   addresses, or storefronts.
3. Add a row to the table above and link it from `docs/README.md` if the set
   grows a new theme.
4. When a later change replaces a decision, mark the old ADR `Superseded` and
   write a new numbered file. Do not silently rewrite history.

The narrative architecture doc is still [ARCHITECTURE.md](../ARCHITECTURE.md).
The wire format a native client implements is [CLIENT-CONTRACT.md](../CLIENT-CONTRACT.md).
