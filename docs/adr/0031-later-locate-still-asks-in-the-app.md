# 0031. A later weather locate still asks in the app

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence.cjs`, `desktop/renderer/presence.js`, `desktop/renderer/pet.js`, `desktop/renderer/weather-areas.js`, `desktop/renderer/index.html`, `web/src/lib/pets/presence.ts`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0016](0016-weather-locate-waits-for-an-in-app-yes.md) asks in the app before the first live locate. [0013](0013-weather-locate-is-not-a-process-grant.md) arms geolocation for that one read and then closes the session check. Electron 35 `PermissionManager::ResetPermission` is empty, so a grant Chromium already cached for the origin cannot be revoked.

After the keeper sends a place, that cached grant can satisfy a later `getCurrentPosition` without a new OS or browser prompt. `maximumAge: 0` refuses a cached position. It does not flush the permission. The house cannot make Chromium ask again.

The first click of "Use this computer's location" already showed the question and did not call `getCurrentPosition`. The read itself did not remember that the yes had been spent. A second call in the same session, from a timer or from opening the weather panel, would have asked the browser again, and the cached grant could have answered it with no new prompt.

The desk and `/demo` share one weather plate. The overlay uses the same question. The blotter does not read machine location. Its weather is the civil-day clock.

## Decision

This slice spends the in-app yes on one locate. It does not revoke a Chromium grant. It does not start DirectX 12 or Vulkan. It does not move the license hwid door. It does not chase a URL fragment or a hostname secret. It does not restore an IP place lookup.

- "Send the place" notes one yes, then calls `getCurrentPosition` once. That yes is spent when the read starts. A second read in the same session returns nothing and does not call `getCurrentPosition` until the keeper notes a yes again.
- "Don't send" clears a pending yes. It does not arm geolocation and does not call `getCurrentPosition`.
- The first click of "Use this computer's location" still only shows the question. It does not note the yes.
- Opening the weather panel, a forecast refresh, and a timer do not note the yes and do not call `getCurrentPosition`.
- The question names the limit: "a prior browser allow can satisfy the next locate without a new os or browser prompt. the house still asks in the app. this house cannot revoke that grant."
- A saved typed area is still kept. That click does not note a yes and does not locate.
- The blotter's `read_weather_here` still returns nothing. Noting a yes there does not read a place.

## Consequences

- Electron 35 still cannot revoke a geolocation grant Chromium already cached in the renderer. The in-app yes is not a revoke and not a browser prompt. After a fresh yes, that cached grant can still satisfy `getCurrentPosition` without a new OS or browser prompt. `maximumAge: 0` refuses a cached position. It does not flush the permission grant. A reload is the only flush of that renderer cache. This slice does not pretend otherwise.
- The house still asks in the app for the next locate. A silent call does not run.
- A forecast of an acknowledged saved pin, and a typed city, still go to the forecast host. Those paths do not locate. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). A later one waits until the weather panel is open and the line names the network address. [0032](0032-later-forecast-names-the-network-address.md).
- Rounding is about 11 km. It is not anonymity.
- License `hwid` still reads a named machine id only when a bind needs it. A missing OS id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md). This slice does not change that door.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the locate question now reads "Send where this computer is? If you said yes to your browser or computer before, it may not ask again, but this app still asks you first. This app can't take back a yes you gave your browser or computer. You can change that in its settings." Same gate. See ROADMAP (network consent lines in plain words).
