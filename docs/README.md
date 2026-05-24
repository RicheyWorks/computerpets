# Documentation

Welcome to the **ComputerPets** documentation hub.

This repository contains the backend service for a secure, extensible platform that enables premium desktop virtual pets through verified ownership across multiple platforms (Steam, Ethereum NFTs, and Microsoft Store).

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

New to the project? Follow this recommended path:

1. **Understand the System**  
   Read the **[Architecture](ARCHITECTURE.md)** document to learn about the design, components, and security model.

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
| **[Architecture](ARCHITECTURE.md)** | Comprehensive system architecture document. Covers high-level design, component breakdown, data flows, deployment architecture, technology stack, security considerations, and recommendations. **Start here** for a complete understanding. |
| **[Setup & Installation Guide](SETUP.md)** | Detailed instructions for building and running the project locally. Includes prerequisites, secret generation, environment configuration, and troubleshooting. |
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

- A GPU-accelerated desktop client (planned PyQt6 application)
- Full implementation of real Steam Web API and improved NFT verification
- Persistent license storage and revocation support
- Hardware binding and advanced security features
- Additional ownership providers (Epic, Itch.io, etc.)

Current status and detailed future plans are documented in the **[Architecture](ARCHITECTURE.md)** document, particularly in the Recommendations and Deployment sections.

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
- **[LICENSE](../LICENSE)** — Project license (MIT)

---

*Thank you for exploring ComputerPets. We hope these documents help you understand and contribute to the project.* 🐾