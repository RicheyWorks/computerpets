# ComputerPets

**A secure backend for GPU-accelerated premium desktop pets with pluggable ownership verification.**

[![Java](https://img.shields.io/badge/Java-21-blue?style=flat-square)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green?style=flat-square)](https://spring.io/projects/spring-boot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Overview

**ComputerPets** is a modern desktop pet platform featuring high-quality, GPU-accelerated virtual companions. This repository contains the **enterprise-grade backend service** responsible for ownership verification, license issuance, and secure asset delivery.

The vision is to deliver premium, always-on desktop pets that feel alive — powered by GPU rendering on the client and protected by a robust, cryptographically secure backend on the server.

This backend enables users to prove ownership of pets through multiple platforms (Steam, Ethereum NFTs, Microsoft Store, and future providers) and receive time-limited, tamper-proof licenses without ever exposing master keys to the client application.

**Key goals:**
- Enterprise-level security and architecture
- Easy extensibility for new ownership platforms
- Clean separation between client and server responsibilities
- Production-ready foundations from day one

---

## Features

- **Pluggable Ownership Verification** — Add support for new platforms by implementing the `OwnershipProvider` interface (currently supports Steam, Ethereum NFTs via Web3j, and Microsoft Store).
- **Strong Cryptographic Licensing** — AES-256-GCM encrypted licenses and HMAC-signed short-lived CDN URLs.
- **Stateless & Scalable** — Designed for horizontal scaling with minimal server-side state.
- **Defense-in-Depth Security** — Dual validation using both encrypted licenses and short-lived JWTs on every download.
- **Rate Limiting** — Built-in per-IP protection using Bucket4j.
- **Rich Pet Catalog** — 20 pets across four rarity tiers (Common, Uncommon, Rare, Legendary).
- **Clean Architecture** — Modular monolith with clear package boundaries and strong separation of concerns.

**Planned / Vision:**
- GPU-accelerated desktop client (PyQt6 / modern rendering)
- Real Steam Web API and improved NFT verification
- Persistent license store and revocation support
- Hardware binding and advanced anti-piracy measures

---

## Architecture

The backend is built as a **modular monolith** using Spring Boot 3.3 and Java 21. It follows a plugin-based architecture centered around the `OwnershipProvider` SPI, making it trivial to add new storefronts and wallet types.

Core responsibilities include:
- Verifying ownership across multiple platforms
- Issuing cryptographically sealed licenses
- Authorizing short-lived bundle downloads
- Protecting sensitive endpoints with JWT and rate limiting

For a complete view of the system design (including component diagrams, data flows, deployment architecture, and technology decisions), see the dedicated architecture document:

> **[📖 Architecture Documentation](docs/ARCHITECTURE.md)**

---

## Getting Started

### Prerequisites

- **Java 21** (Temurin or other OpenJDK distribution recommended)
- **Maven 3.9+**
- A modern terminal (PowerShell, bash, etc.)

### Quick Start

1. **Generate required secrets** (the application will not start without them):

   **PowerShell (Windows)**
   ```powershell
   $env:LICENSE_SECRET_KEY   = [Convert]::ToBase64String((1..32   | ForEach-Object { Get-Random -Maximum 256 }))
   $env:JWT_SECRET_KEY       = [Convert]::ToBase64String((1..48   | ForEach-Object { Get-Random -Maximum 256 }))
   $env:BUNDLE_SIGNING_KEY   = [Convert]::ToBase64String((1..48   | ForEach-Object { Get-Random -Maximum 256 }))
   $env:MICROSOFT_DEV_MODE   = "true"   # Development only
   ```

2. **Run the application**

   ```bash
   mvn spring-boot:run
   ```

   Or use the convenience script on Windows:
   ```powershell
   .\build.ps1
   ```

3. **Verify the server is running**

   ```powershell
   Invoke-RestMethod http://localhost:8080/api/verify/providers
   ```

For full instructions (including IDE setup, troubleshooting, and environment variable management), see the [Setup Guide](docs/SETUP.md).

---

## Documentation

All detailed documentation is located in the `docs/` directory:

- **[Documentation Index](docs/README.md)** — Overview of all available docs
- **[Architecture](docs/ARCHITECTURE.md)** — Comprehensive system design, diagrams, and recommendations (**recommended starting point**)
- **[Setup Guide](docs/SETUP.md)** — How to build, configure, and run the project locally
- **[Contributing Guide](docs/CONTRIBUTING.md)** — Development workflow and contribution process

---

## Project Structure

```
ComputerPets/
├── .github/                      # GitHub templates (issues & PRs)
├── docs/                         # Project documentation
│   ├── ARCHITECTURE.md           # Full system architecture (living document)
│   ├── SETUP.md                  # Local development guide
│   └── CONTRIBUTING.md
├── src/main/java/com/enterprisepet/
│   ├── controller/               # REST API controllers
│   ├── provider/                 # OwnershipProvider SPI + registry
│   │   ├── steam/
│   │   ├── nft/
│   │   └── microsoft/
│   ├── license/                  # AES-GCM license issuance & validation
│   ├── security/                 # JWT authentication
│   ├── bundle/                   # CDN download URL signing
│   ├── pet/                      # Pet catalog and types
│   ├── config/                   # Security, rate limiting, exception handling
│   └── EnterprisePetBackendApplication.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
├── build.ps1                     # Windows build helper
├── LICENSE
└── README.md
```

---

## Contributing

Contributions are welcome and appreciated! Whether you're fixing bugs, adding new providers, improving documentation, or suggesting architectural improvements, your help makes the project better.

Please read the contribution guidelines before getting started:

- [Contributing Guide](CONTRIBUTING.md) (root)
- [Detailed Contributing Guidelines](docs/CONTRIBUTING.md)

We especially value:
- Real implementations for the Steam and Microsoft providers
- Improvements to NFT ownership verification
- Tests and CI/CD enhancements
- Documentation and architecture refinements

---

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

*Built with security, extensibility, and a love for cute digital creatures.* 🐾