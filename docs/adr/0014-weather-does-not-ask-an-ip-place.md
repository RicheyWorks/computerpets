# 0014. Weather does not ask an IP place service

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence.cjs`, `desktop/renderer/presence.js`, `desktop/renderer/pet.js`, `desktop/renderer/weather-areas.js`, `web/src/lib/pets/presence.ts`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0013](0013-weather-locate-is-not-a-process-grant.md) closed the standing geolocation grant. One leftover stayed open: when that fix was missing, the weather control asked `ipwho.is` for a city. That request locates the machine from the network address. It does not use the geolocation permission, so a denied or missing prompt still placed the desk.

The overlay, the living desk, and `/demo` all did this from "Use this computer's location". The blotter did not. Its weather is the civil-day clock. A place the keeper already saved on the card was, and still is, sent to the forecast.

There is no separate control that asks to use the network's city. Binding the lookup to a hidden consent flag would still locate without a visible choice. This slice drops the lookup.

## Decision

This slice drops the IP place fallback. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key. The one-shot geolocation grant from [0013](0013-weather-locate-is-not-a-process-grant.md) stays.

- `ipPlace()` returns nothing on the overlay, the desk, and `/demo`. A consent argument does not open a lookup. The weather control calls it and does not fetch a network city.
- If the one-shot fix is missing, the saved area stays. The line says the computer did not share a place.
- If the fix arrives and the city name cannot be reached, the control keeps that granted fix as "This computer". It does not switch to a network city.
- The blotter's `ip_place` returns nothing. It does not open a device location API and it does not ask an IP place service.
- Typed cities and a saved area still go to Open-Meteo. That request shows the client address to that host the way any HTTPS request does. The house does not ask the host to turn the address into a city.

## Consequences

- Electron 35 `PermissionManager::ResetPermission` is empty. A geolocation grant Chromium already cached in the renderer cannot be revoked mid-session. The check handler denies the next status query once the locate closes. A reload is the only flush of that cache. Dropping the IP lookup does not change that limit.
- A browser origin grant can outlive the click. The next click may return a fix without a new prompt. It is still one `getCurrentPosition` from the weather control. There is no background watcher. Many desktop sessions have no GNSS fix. The button then says the computer did not share a place. It does not invent a city from the address.
- A granted fix's coordinates are still sent to Open-Meteo to name the place and to read the forecast. That is the click's fix, not an IP place service.
- A saved area on the card is still sent to the forecast.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The keeper's plugin key still sits in `mind.json`. It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
