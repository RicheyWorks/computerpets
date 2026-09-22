# 0016. A live weather locate waits for an in-app yes

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `desktop/renderer/card.js`, `web/src/lib/pets/weather-areas.ts`, `web/src/lib/pets/card.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0015](0015-weather-locate-sends-a-rounded-place.md) rounds a live fix and keeps a saved typed area. Two leftovers stayed open.

When no typed area is saved, "Use this computer's location" still armed geolocation and called `getCurrentPosition` on that click. A grant Chromium already cached for the origin can satisfy that call without a new browser prompt. Electron 35 `PermissionManager::ResetPermission` is empty, so the house cannot revoke the grant. The click was the only keeper yes, and a stale grant could answer it.

A live pin saved before the rounding could also sit in `card.json` (overlay) or `computerpets.card.v1` (desk) at full precision. Forecast URLs already rounded on the way out. The extra digits stayed on the card for a later read.

The blotter does not read machine location. Its weather is the civil-day clock. There is no live pin on the blotter, so this slice does not add a confirm there.

## Decision

This slice asks in the app before a live locate, and rounds a stored live pin when the card loads. It does not revoke a Chromium grant. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key. It does not restore an IP place lookup. The one-shot arm from [0013](0013-weather-locate-is-not-a-process-grant.md) stays, and it runs only after the in-app yes.

- When a typed area is saved, the click still says "keeping the saved place". It does not call `getCurrentPosition`, does not arm the session grant, and does not reverse-geocode. A cached grant is not consulted on that path.
- When no typed area is saved, the same button does not arm geolocation. It shows "send a place from this computer? a saved browser grant can answer without a new prompt. this house cannot revoke that grant." "Send the place" is the yes. Only that yes arms the session grant, calls `getCurrentPosition`, reverse-geocodes, and sends the forecast from that locate. "Don't send" says "the place was not sent" and does none of that.
- The yes is a boolean from that button. A cached origin grant is not a yes. The gate is checked again on Send, so a typed area saved while the question is open still wins.
- On load, and when the weather plate is first wired, a stored live row (`id: "here"` or `query: "this computer"`) is rounded to a tenth of a degree and written back. A place the keeper typed keeps the coordinates the geocoder returned. Forecast URLs still round on the way out.
- `ipPlace()` still returns nothing. The blotter's `read_weather_here` returns nothing. It does not send a place.

## Consequences

- Electron 35 still cannot revoke a geolocation grant Chromium already cached in the renderer. The in-app yes is not a revoke and not a browser prompt. After the keeper sends the place, that cached grant can still satisfy `getCurrentPosition` without a new browser prompt. `maximumAge: 0` refuses a cached position. It does not flush the permission grant. A reload is the only flush of that renderer cache. This slice does not pretend otherwise.
- The page does not call `getCurrentPosition` on load, on a timer, from a forecast refresh, or from the first click of "Use this computer's location". There is no `watchPosition`.
- A forecast of a place already on the card, including a stored live pin, still goes out when that area is current. That is the saved place, not a new device locate. The digits are a tenth of a degree. Any HTTPS request to the forecast host still shows the client address. The house does not ask the host to turn that address into a city.
- Rounding is about 11 km. It is not anonymity.
- Many desktop sessions have no GNSS fix. After the yes, the line says the computer did not share a place.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The keeper's plugin key still sits in `mind.json`. It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
