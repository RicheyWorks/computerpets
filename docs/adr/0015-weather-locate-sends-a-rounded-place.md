# 0015. A weather locate sends a rounded place, and a saved typed area wins

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `desktop/presence.cjs`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0014](0014-weather-does-not-ask-an-ip-place.md) dropped the IP city lookup. One leftover stayed open: "Use this computer's location" sent the device fix to Open-Meteo at full precision, to name the place and to read the forecast. That click is a locate. The coordinates leave the machine.

A second leftover sits in the permission cache. [0013](0013-weather-locate-is-not-a-process-grant.md) arms geolocation for one `getCurrentPosition` and then closes the session check. Electron 35 `PermissionManager::ResetPermission` is empty, so a grant Chromium already cached in the renderer cannot be revoked mid-session. On the desk and `/demo`, a browser origin grant can outlive the click. The next use of the control can return a fix without a new prompt. `maximumAge: 0` refuses a cached position. It does not flush that grant.

The blotter does not read machine location. Its weather is the civil-day clock. There is no honest forecast path on the blotter, so this slice does not add one.

## Decision

This slice tells the keeper what the click does, rounds a live fix before it leaves, and keeps a saved typed area instead of starting a new locate. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key. It does not restore an IP place lookup. The one-shot arm from [0013](0013-weather-locate-is-not-a-process-grant.md) stays.

- The overlay, the living desk, and `/demo` show "this click sends a place to the forecast host." beside "Use this computer's location". The button describes that line.
- A saved typed area wins. The click says "keeping the saved place" and does not call `getCurrentPosition`, does not arm the session grant, and does not reverse-geocode a new fix. A cached grant is not consulted on that path.
- A live fix, when there is no typed area, is rounded to a tenth of a degree before the reverse lookup, before it is saved, and before any forecast URL. The stored live row stays `id: "here"` so a later click can still tell it from a place the keeper typed.
- After a live fix leaves, the line says "a place was sent to the forecast host".
- `ipPlace()` still returns nothing. A consent argument does not open a network city.
- The blotter's `read_weather_here` returns nothing. It does not send a place.

## Consequences

- Electron 35 cannot revoke a geolocation grant Chromium already cached in the renderer. A reload is the only flush of that cache. The check handler denies the next status query once the locate closes. During the armed window, a grant already cached in the renderer can still satisfy `getCurrentPosition` without a new prompt. This slice does not pretend otherwise.
- A browser origin grant can outlive the click. If no typed area is saved, a later use could return a fix without a new browser prompt. [0016](0016-weather-locate-waits-for-an-in-app-yes.md) requires an in-app yes before that call. The cached grant can still skip the browser prompt after the yes. The page does not call `getCurrentPosition` on load, on a timer, or from a forecast refresh. There is no `watchPosition`.
- Rounding to a tenth of a degree is about 11 km. It is not anonymity. Open-Meteo still receives a place. Any HTTPS request to that host, including a typed city lookup and a forecast of a saved area, shows the client address. The house does not ask the host to turn that address into a city.
- A forecast of a place the keeper already saved still sends that place, rounded on the way out, when the place is a typed city. A pin saved before this slice could sit in `card.json` at full precision. [0016](0016-weather-locate-waits-for-an-in-app-yes.md) rounds that stored live pin on load. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md) holds a forecast of that live pin until the keeper says to use it. The next forecast does not send the extra digits.
- Many desktop sessions have no GNSS fix. The button then says the computer did not share a place.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The keeper's plugin key still sits in `mind.json`. It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
- [0016](0016-weather-locate-waits-for-an-in-app-yes.md) asks in the app before a live locate and rounds a stored live pin on load. The Chromium grant cache named here is unchanged. After that yes, a cached grant can still answer without a new browser prompt.
