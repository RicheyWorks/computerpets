# 0013. Weather location is a click, not a process grant

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence.cjs`, `desktop/main.cjs`, `desktop/preload.cjs`, `desktop/renderer/presence.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/presence.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0012](0012-presence-does-not-log-keys.md) stopped key logs outside a focused field. One leftover stayed open: geolocation stayed granted for the whole process after the weather button asked.

The overlay installs Electron session permission handlers. The check handler returned true for `geolocation` on every query, so `GetPermissionStatus` was granted before any click. A later `getCurrentPosition` or a watcher could read the machine without asking again. The desk and `/demo` called `getCurrentPosition` only from the weather control, but with `maximumAge` of ten minutes, so a cached fix could be reused. The blotter does not read machine location. Its weather is the civil-day clock.

Electron 35.7 `PermissionManager::ResetPermission` is empty. A grant Chromium has already cached inside the renderer cannot be flushed mid-session. The check handler is the live status: it is consulted again and returns granted or denied. There is no persistent content setting in this path.

## Decision

This slice binds the grant to the weather control. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key.

- `allowPermission("geolocation")` is false unless a weather locate is open. Every other permission stays denied, including clipboard, display capture, media, keyboard lock, and `fileSystem`.
- The overlay button calls `weather-locate-arm`, then one `getCurrentPosition`, then `weather-locate-clear`. The minds window cannot arm that IPC. The grant also closes after 120 seconds if the read never settles.
- The locate uses `maximumAge: 0` and does not call `watchPosition`. Nothing re-queries location on a timer or on load.
- The living desk and `/demo` use the same one-shot reader from the weather control. The browser may keep an origin grant after that click. The page cannot revoke it and does not read again until the control is used again.
- The blotter's `read_weather_here` returns nothing and does not open a device location API.

## Consequences

- Electron cannot revoke a geolocation grant Chromium already cached in the renderer. The check handler denies the next status query once the locate closes. A reload is the only flush of that cache. This slice does not pretend otherwise.
- A browser origin grant can outlive the click. The next click may not show a prompt. It is still a click. There is no background watcher.
- The weather control does not ask an IP place service when the fix fails. [0014](0014-weather-does-not-ask-an-ip-place.md) drops that lookup. A saved area stays.
- A place the keeper already saved on the card is still sent to the forecast. That is the saved area, not a live location watch.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The keeper's plugin key still sits in `mind.json`. It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
