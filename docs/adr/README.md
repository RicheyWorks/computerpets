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
