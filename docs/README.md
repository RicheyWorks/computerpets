# Documentation

Welcome to the **ComputerPets** documentation hub.

**Never coded?** Start with [How to get your first pet](START-HERE.md). That page puts Rui on the real Windows desktop. Pictures of the house guests sit on the [front door](../README.md) (`readme-friends.jpg`). There is no Microsoft Store download yet.

This repository also contains the backend service for a secure, extensible platform that enables premium desktop virtual pets through verified ownership across multiple platforms (Steam, Ethereum NFTs, Microsoft Store, Itch.io, and Epic Games Store). Keepers do not need that door to meet Rui.

The documentation in this folder is designed to help you understand the system architecture, get the project running locally, and contribute effectively.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Main Documentation](#main-documentation)
- [API Reference](#api-reference)
- [Roadmap & Future Plans](#roadmap--future-plans)
- [Contributing](#contributing)
- [Additional Resources](#additional-resources)

---

## Overview

**ComputerPets** (EnterprisePet Backend) is a secure Java Spring Boot application that handles ownership verification and license issuance for premium virtual desktop pets.

Key features of the system include:
- Pluggable ownership verification (Steam, Ethereum NFTs, Microsoft Store, and more)
- AES-256-GCM encrypted licenses
- Short-lived JWT authentication
- HMAC-signed CDN download URLs
- Strong emphasis on security and extensibility

For a deep technical understanding, start with the Architecture documentation.

---

## Getting Started

Friends who have never coded should open [How to get your first pet](START-HERE.md) first. That is the Windows desk download. Node is a helper for that walk, not the first lesson.

Operators new to the backend? Follow this recommended path:

1. **Understand the System**  
   Read the **[Architecture](ARCHITECTURE.md)** document, then the **[Architecture Decision Records](adr/README.md)** for the choices the code already made.

2. **Set Up Your Environment**  
   Follow the **[Setup & Installation Guide](SETUP.md)** to install prerequisites, generate required secrets, and run the backend locally.

3. **Explore the Code**  
   Start the Spring Boot application and test the API endpoints listed in the root [README](../README.md).

4. **Get Involved**  
   Read the **[Contributing Guidelines](CONTRIBUTING.md)** if you want to contribute features, fixes, or documentation.

---

## Main Documentation

| Document | Description |
|----------|-------------|
| **[How to get your first pet](START-HERE.md)** | Kid-facing Windows 10/11 path: copy the house from GitHub, put Rui on the real desktop overlay, then the browser `/demo`. No Store download. |
| **[Cry credits](CRIES.md)** | Full field-tape Call credits for the 220 guests with real cries. Root README stays short. |
| **[Architecture](ARCHITECTURE.md)** | Comprehensive system architecture document. Covers high-level design, component breakdown, data flows, deployment architecture, technology stack, security considerations, and recommendations. **§11** is the house polish north-star (the X ads). **Start here** for a complete understanding. |
| **[Architecture Decision Records](adr/README.md)** | Numbered records of decisions already true on `main` (SPI, license crypto, Redis/Postgres, empty NFT allowlist, Electron + PyQt contract clients, profiles + k8s). Not a wishlist. |
| **[Client contract](CLIENT-CONTRACT.md)** | What a native client implements: verify → AES-256-GCM license decrypt, hwid, JWT, signed download URL. Matches the code. |
| **[NFT ownership](NFT.md)** | Official collections, token→pet bindings, ERC-721/1155, signatures, and verify examples. |
| **[Mind plugins](MIND.md)** | Plug any AI into the pets — OpenAI-compatible, Claude, Gemini, Ollama, custom webhook. |
| **[Desktop companion](../desktop/README.md)** | Native overlay — all two hundred twenty-one living kinds, plus the first client-contract unlock slice. |
| **[PyQt blotter](../client/README.md)** | PyQt6 desk — all two hundred twenty-one, plaques, house weather / visitor / shed, mess / illness, Qt OpenGL viewport, same contract unlock. |
| **[Setup & Installation Guide](SETUP.md)** | Build and run locally. Secrets, `dev`/`staging`/`prod` profiles, and `deploy/k8s/`. |
| **[Contributing Guidelines](CONTRIBUTING.md)** | How to contribute to the project, including development setup, code style, pull request process, and documentation update expectations. |

---

## API Reference

Detailed API examples and endpoint documentation are currently maintained in the following locations:

- **[Root README](../README.md)** — Contains practical API usage examples (verify ownership, download bundles, list providers, etc.).
- **[Architecture](ARCHITECTURE.md)** — Includes data flow diagrams and endpoint behavior descriptions.

A dedicated `API.md` document may be added in the future as the API matures.

---

## Roadmap & Future Plans

The long-term vision for ComputerPets includes:

- A custom GPU shader engine (the PyQt client uses Qt’s OpenGL-backed scene; the overlay is Electron/Chromium). GPU load sensing and its sample sparkline shipped. They are not that engine.
- The keeper card names who is listening on the mind bus. House lines unless that plugin can actually be asked. The key stays with the keeper.
- A live ComputerPets collection address in `ethereum.collections`
- Additional ownership providers (Solana, etc.)

Already shipped: Steam Web API + NFT allowlist + Itch.io download-key verify + Epic Games Store Ecom v3,
JPA persistence and revocation, optional hwid, Micrometer + OpenTelemetry tracing,
`dev`/`staging`/`prod` profiles + `deploy/k8s/`, the [client contract](CLIENT-CONTRACT.md),
the [PyQt blotter](../client/README.md) first slice,
and [ADRs](adr/README.md) for those decisions.

Current status and detailed future plans are documented in the **[Roadmap](ROADMAP.md)**
(Phase 6 is the house polish north-star) and **[Architecture](ARCHITECTURE.md)** (§11).

---

## Contributing

We welcome contributions of all kinds — code, documentation, ideas, and bug reports.

Please read the **[Contributing Guidelines](CONTRIBUTING.md)** before getting started. It covers:

- Development environment setup
- Code style and conventions
- Pull request process
- How to update architecture and documentation

All documents in this folder are **living documents**. When you make changes that affect architecture or developer experience, please update the relevant documentation as part of your pull request.

---

## Additional Resources

- **[Project README](../README.md)** — High-level overview, features, and quick start examples
- **[Security & Audit Notes](../AUDIT.md)** — Known issues, P0 security concerns, and remediation priorities
- **[Build Script](../build.ps1)** — Windows helper script for building and validating the project
- **[LICENSE](../LICENSE)** — All rights reserved. Private house.

---

*Thank you for exploring ComputerPets. We hope these documents help you understand and contribute to the project.* 🐾