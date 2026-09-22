# 0054. Shared ownership time limiter denies on wall exceed

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `src/main/java/com/enterprisepet/provider/OwnershipTimeLimiter.java`, Steam / Itch / Epic / Microsoft ownership services, `application.yml` `resilience4j.timelimiter.instances.ownership`

## Context

[0053](0053-itch-and-epic-restclient-times-out-and-denies.md) finished the RestClient ten-second connect and read deadlines for Itch and Epic. Steam and Microsoft already timed out the same way. Resilience4j still wrapped those providers with circuit breaker and retry only. A per-HTTP deadline does not cap Epic's token hop plus ownership hop as one wall, and it does not give the house one shared outer clock across the store providers.

## Decision

One shared Resilience4j time limiter instance (`ownership`, twelve seconds, `cancelRunningFuture`) wraps Steam, Itch, Epic, and Microsoft ownership probes through `OwnershipTimeLimiter`. Exceed returns empty / false — deny-safe, no invented entitlement. Circuit breaker and retry stay as they are; this does not add a retry budget. NFT stays on its own RPC timeouts. Catalog stays 221. DirectX 12 / Vulkan is not started.

### Outer wall vs RestClient hop

- **RestClient (inner):** ten-second connect and read per HTTP hop. Steam, Itch, Epic, and Microsoft already use that. A silent store host usually fails here first on a single call.
- **Time limiter (outer):** twelve-second wall for one ownership probe. Epic's Auth token hop and Ecom ownership hop share that wall so two ten-second deadlines cannot stack open the verify path. On a single-hop provider the RestClient deadline usually fires first; the outer wall is the house safety net, not a second invent-a-grant path.

## Consequences

- A hung ownership probe denies. Deny means the store did not answer in time, not that the keeper owns the title.
- The bean constructs its own twelve-second `TimeLimiter` from `OWNERSHIP_WALL` so Spring context start does not depend on Resilience4j registry bean ordering (same wall as yml).
- Presence / CSP series is not reopened. One-line cross-links only.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
