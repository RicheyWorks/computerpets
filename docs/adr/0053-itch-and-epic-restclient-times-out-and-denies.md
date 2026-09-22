# 0053. Itch and Epic RestClient reads time out and deny

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `src/main/java/com/enterprisepet/itch/ItchService.java`, `src/main/java/com/enterprisepet/epic/EpicService.java`

## Context

[0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md) timed out Steam's RestClient at ten seconds alongside cloud talk and voice. Microsoft Collections and NFT RPC already timed out. Itch.io and Epic Games Store ownership clients still built an unbounded RestClient. A silent itch or Epic host could hang the verify path open. Resilience4j already wraps those providers with circuit breakers and retries, but still has no time limiter.

## Decision

Itch and Epic RestClients use a ten-second connect and read deadline, same spirit as Steam and Microsoft Collections. A hang denies ownership. They do not invent an entitlement. They do not retry into a storm beyond the existing Resilience4j retry budget. They do not phone a new host as the timeout fallback. They do not start DirectX 12 or Vulkan. Catalog stays 221.

- Existing catch paths and circuit-breaker fallbacks still return empty / denied. A late body after the deadline is not treated as ownership.
- Resilience4j time limiter lands in [0054](0054-ownership-time-limiter-denies-on-wall.md). Circuit breaker and retry stay as they are.

## Consequences

- Itch and Epic no longer wait forever on a silent store host. Deny means the store did not answer in time, not that the keeper owns the title.
- Steam, Microsoft, and NFT already time out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md).
- Shared ownership time limiter. [0054](0054-ownership-time-limiter-denies-on-wall.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
