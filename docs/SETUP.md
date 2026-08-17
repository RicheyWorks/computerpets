# Setup & Installation Guide

This guide provides step-by-step instructions for setting up and running the **ComputerPets** project locally.

> **Note**: This repository currently contains **only the backend service**. The desktop client application is planned for future development and is not yet included in this repository.

---

## Prerequisites

### Backend Requirements

To run the Spring Boot backend, you will need the following:

| Requirement       | Recommended Version          | Notes |
|-------------------|------------------------------|-------|
| **Java JDK**      | 21 (LTS)                     | Temurin, Oracle JDK, or Amazon Corretto |
| **Apache Maven**  | 3.9 or newer                 | Used to build and run the project |
| **Git**           | Latest stable                | Required to clone the repository |
| **Terminal**      | PowerShell, Bash, or Zsh     | Windows PowerShell is fully supported |

**Optional but Recommended Tools:**
- IDE: IntelliJ IDEA, Visual Studio Code (with Java Extension Pack), or Eclipse
- OpenSSL (for generating secrets on non-Windows systems)

### Desktop Client Requirements (Planned)

The GPU-accelerated desktop client is not yet implemented. When it is added, the following will be required:

- **Python** — 3.11 or newer (3.12+ recommended)
- **PyQt6** — For building the desktop user interface
- **GPU Drivers** — Modern NVIDIA or AMD drivers with Vulkan / OpenGL support
- **Additional Python packages** — PyOpenGL, requests, and other dependencies (to be defined when the client is developed)

---

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ComputerPets
```

### 2. Install Backend Prerequisites

Ensure you have **Java 21** and **Maven 3.9+** installed and available in your system `PATH`.

Verify your installation:

```bash
java -version
mvn -v
```

### 3. Configure Required Environment Variables

The backend requires four secrets to start. These must be set as environment variables.

| Variable                | Length     | Purpose                                      |
|-------------------------|------------|----------------------------------------------|
| `LICENSE_SECRET_KEY`    | 32 bytes   | Master AES-256-GCM key for encrypting licenses |
| `JWT_SECRET_KEY`        | 48+ bytes  | Signing key for short-lived JWT tokens       |
| `BUNDLE_SIGNING_KEY`    | 48+ bytes  | HMAC key for signing temporary download URLs |
| `ADMIN_API_KEY`         | 32+ bytes  | Pre-shared key for `/api/admin/*` and the house `/admin` ledger (`X-Admin-Key`) |

#### Generate Secrets (PowerShell - Windows)

```powershell
$env:LICENSE_SECRET_KEY   = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
$env:JWT_SECRET_KEY       = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
$env:BUNDLE_SIGNING_KEY   = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
$env:ADMIN_API_KEY        = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

Write-Host "Copy these values to your environment:"
Write-Host "LICENSE_SECRET_KEY=$env:LICENSE_SECRET_KEY"
Write-Host "JWT_SECRET_KEY=$env:JWT_SECRET_KEY"
Write-Host "BUNDLE_SIGNING_KEY=$env:BUNDLE_SIGNING_KEY"
Write-Host "ADMIN_API_KEY=$env:ADMIN_API_KEY"
```

#### Generate Secrets (macOS / Linux)

```bash
export LICENSE_SECRET_KEY=$(openssl rand -base64 32)
export JWT_SECRET_KEY=$(openssl rand -base64 48)
export BUNDLE_SIGNING_KEY=$(openssl rand -base64 48)
export ADMIN_API_KEY=$(openssl rand -base64 32)
```

**Important**: The application will refuse to start if these variables are missing or contain obvious placeholder values.

### 4. (Optional) Enable Microsoft Development Mode

For local testing without real Microsoft authentication:

```powershell
$env:MICROSOFT_DEV_MODE = "true"
```

---

## Running the Project

### Starting the Spring Boot Backend

You can run the backend in several ways:

**Using Maven (Recommended for Development)**

```bash
mvn spring-boot:run
```

**Using the Windows Build Script**

```powershell
.\build.ps1
java -jar target\*-SNAPSHOT.jar
```

**Build a Standalone JAR First**

```bash
mvn clean package -DskipTests
java -jar target\enterprise-pet-backend-1.0.0-SNAPSHOT.jar
```

The backend will start on **http://localhost:8080** by default.

The living desk ledger is `/admin` (not in the house nav). Point it at this origin and paste `ADMIN_API_KEY` — the page sends `X-Admin-Key` on every lookup and revoke.

### Verifying the Backend

Once the server is running, test it with:

```bash
curl http://localhost:8080/api/verify/providers
```

You should receive a JSON response listing the available ownership providers.

### Running the Desktop Client

The desktop client (PyQt6 + GPU-accelerated rendering) is **not yet available** in this repository.

When the client is developed, it will be located in a separate directory (likely `client/` or `desktop/`). Instructions for installing Python dependencies and launching the client will be added to this guide at that time.

---

## Environment Variables Reference

| Variable                  | Required | Default | Description |
|---------------------------|----------|---------|-------------|
| `LICENSE_SECRET_KEY`      | Yes      | —       | AES-256 master encryption key (base64) |
| `JWT_SECRET_KEY`          | Yes      | —       | JWT signing key (base64) |
| `BUNDLE_SIGNING_KEY`      | Yes      | —       | CDN URL signing key (base64) |
| `ADMIN_API_KEY`           | Yes      | —       | Admin API + `/admin` ledger (`X-Admin-Key` header) |
| `MICROSOFT_DEV_MODE`      | No       | false   | Bypasses real Microsoft verification (development only) |
| `ITCH_API_KEY`            | No       | placeholder | itch.io developer API key for download-key receipt verify |
| `ITCH_GAME_ID`            | No       | empty   | Optional official itch.io game id allowlist (do not invent one) |
| `EPIC_CLIENT_ID`          | No       | placeholder | EOS Trusted Server client id (Developer Portal) |
| `EPIC_CLIENT_SECRET`      | No       | placeholder | EOS Trusted Server client secret |
| `EPIC_DEPLOYMENT_ID`      | No       | placeholder | Deployment id required by the Ecommerce APIs |
| `EPIC_SANDBOX_ID`         | No       | empty   | Optional official Epic sandbox allowlist (do not invent one) |
| `EPIC_CATALOG_ITEM_ID`    | No       | empty   | Optional official catalog item allowlist (do not invent one) |
| `BUNDLE_BASE_URL`         | No       | CDN placeholder | Base URL used when generating signed download links |

---

## Provider Configuration

You can enable or disable individual ownership verification providers using the following configuration:

```yaml
ownership:
  providers:
    steam:
      enabled: true
    microsoft:
      enabled: true
    nft:
      enabled: true
    itch:
      enabled: true
    epic:
      enabled: true
```

By default, all providers are enabled.

This is useful when:
- You want to temporarily disable a provider during development
- You are not yet ready to provide real credentials for a specific platform (e.g., Steam API key)
- You want to run the application without certain external dependencies

Example – running with only the NFT provider enabled:

```yaml
ownership:
  providers:
    steam:
      enabled: false
    microsoft:
      enabled: false
    nft:
      enabled: true
    itch:
      enabled: false
    epic:
      enabled: false
```

### Itch.io

Itch verify calls the official download-key receipt API
(`GET https://api.itch.io/games/{gameId}/download_keys`) with a developer
API key. A placeholder or blank `ITCH_API_KEY` fails closed (ownership
denied), the same way a missing Steam Web API key does. Do not invent a
live ComputerPets game id — leave `ITCH_GAME_ID` empty until a page exists.

| Variable        | Purpose                                              |
|-----------------|------------------------------------------------------|
| `ITCH_API_KEY`  | Developer API key from https://itch.io/user/settings/api-keys |
| `ITCH_GAME_ID`  | Optional numeric game id; when set, `gameId` must match |

```yaml
itch:
  api-key: ${ITCH_API_KEY}
  api-base-url: https://api.itch.io
  game-id: ${ITCH_GAME_ID:}
```

`POST /api/verify/itch` expects `gameId` and `downloadKey` (the receipt
from the buyer's download URL).

### Epic Games Store

Epic verify uses the documented EOS Auth + Ecom Web APIs:

1. `POST https://api.epicgames.dev/epic/oauth/v2/token` with
   `grant_type=client_credentials` and HTTP Basic `clientId:clientSecret`.
   Ecommerce calls require `deployment_id`.
2. `GET https://api.epicgames.dev/epic/ecom/v3/platforms/{platform}/identities/{accountId}/ownership?nsCatalogItemId={sandboxId:catalogItemId}`
   with the client-credentials access token.

A placeholder or blank `EPIC_CLIENT_ID` / `EPIC_CLIENT_SECRET` /
`EPIC_DEPLOYMENT_ID` fails closed (ownership denied), the same way a
missing Steam Web API key does. Live values come from the Epic Developer
Portal: create a **Trusted Server** client, enable the **Ecom** feature
on its client policy, and use that client's credentials. There is no
public "always owns" path and no invented ComputerPets sandbox — leave
`EPIC_SANDBOX_ID` / `EPIC_CATALOG_ITEM_ID` empty until a store page exists.

| Variable               | Purpose                                                         |
|------------------------|-----------------------------------------------------------------|
| `EPIC_CLIENT_ID`       | Trusted Server client id from the Developer Portal              |
| `EPIC_CLIENT_SECRET`   | Trusted Server client secret                                    |
| `EPIC_DEPLOYMENT_ID`   | Deployment id (required by the Ecommerce APIs)                  |
| `EPIC_SANDBOX_ID`      | Optional sandbox allowlist; when set, `sandboxId` must match    |
| `EPIC_CATALOG_ITEM_ID` | Optional catalog-item allowlist; when set, `catalogItemId` must match |

```yaml
epic:
  client-id: ${EPIC_CLIENT_ID}
  client-secret: ${EPIC_CLIENT_SECRET}
  deployment-id: ${EPIC_DEPLOYMENT_ID}
  api-base-url: https://api.epicgames.dev
  sandbox-id: ${EPIC_SANDBOX_ID:}
  catalog-item-id: ${EPIC_CATALOG_ITEM_ID:}
```

`POST /api/verify/epic` expects `accountId` (32-char Epic Account ID),
`sandboxId`, and `catalogItemId`. `platform` defaults to `EPIC`.

See [Auth Web APIs](https://dev.epicgames.com/docs/web-api-ref/authentication)
and [Ecom Web APIs](https://dev.epicgames.com/docs/web-api-ref/ecom-web-apis).

### Ethereum / NFT

NFT verify is allowlisted by default. Until `ethereum.collections` lists a live
contract, `POST /api/verify/nft` returns 403 (`no official NFT collections configured`).
See [NFT.md](NFT.md) for the full contract.

| Variable            | Purpose                                      |
|---------------------|----------------------------------------------|
| `ETHEREUM_RPC_URL`  | JSON-RPC endpoint (Alchemy, Infura, a node)  |

```yaml
ethereum:
  rpc-url: ${ETHEREUM_RPC_URL}
  allowlist-required: true
  require-signature: false
  collections:
    - address: "0xYourOfficialComputerPetsContract"
      standard: ERC721
      name: "ComputerPets Genesis"
      tokens:
        1: red_panda
        2: dragon
```

`GET /api/verify/nft/collections` exposes the public allowlist.

---

## Troubleshooting

### Java Version Errors
**Problem**: `UnsupportedClassVersionError` or similar  
**Solution**: Install Java 21 and ensure `JAVA_HOME` points to it.

### Application Fails to Start
**Problem**: Errors about missing `JWT_SECRET_KEY` or `BUNDLE_SIGNING_KEY`  
**Solution**: Set the three required environment variables before running the application.

### Using the Default License Key
**Problem**: Application refuses to start with message about the committed default key  
**Solution**: You **must** generate and provide your own random 32-byte key via the `LICENSE_SECRET_KEY` environment variable. The previously committed default key is no longer accepted outside of automated tests.

### Port Already in Use
**Problem**: Port 8080 is occupied  
**Solution**: Start the application with a different port:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### Maven Cannot Find Java
**Problem**: `mvn` uses the wrong Java version  
**Solution**: Set `JAVA_HOME` correctly and restart your terminal.

---

## Next Steps

- Read the [Architecture Documentation](ARCHITECTURE.md) for a deep understanding of the system design.
- The Electron overlay in `desktop/` implements the first [Client contract](CLIENT-CONTRACT.md) slice (Steam verify, license decrypt, hwid, signed download). See `desktop/README.md`.
- Explore the API examples in the main [README.md](../README.md).
- Review the [Contributing Guidelines](CONTRIBUTING.md) if you plan to contribute.

If you run into issues not covered here, feel free to open an issue on the project repository.