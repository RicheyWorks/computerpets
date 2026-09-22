# 0017. A saved computer place waits for a forecast yes

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `desktop/renderer/desk-house.js`, `desktop/renderer/card.js`, `web/src/lib/pets/weather-areas.ts`, `web/src/lib/pets/card.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0016](0016-weather-locate-waits-for-an-in-app-yes.md) asks before a live locate and rounds a stored live pin. One leftover stayed open.

When the current weather area was already a saved live pin (`id: "here"` or query `this computer`), opening the desk or the overlay still requested a forecast for that place. No new in-app yes. The digits were already a tenth of a degree. The request was the saved place, not a new device locate, and it still left the machine.

A typed city was, and still is, a place the keeper named. That forecast is a different door.

The blotter does not read machine location. Its weather is the civil-day clock. It has no saved computer place, so this slice does not add a forecast there.

## Decision

This slice holds a forecast of the current saved live pin until the keeper acknowledges that pin. It does not arm geolocation for that yes. It does not reverse-geocode that pin. It does not ask again on a later read of the same pin. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key. It does not restore an IP place lookup. The Chromium grant cache named in [0016](0016-weather-locate-waits-for-an-in-app-yes.md) is unchanged.

- When the current area is a typed city, the forecast goes out as before. The host is still `api.open-meteo.com`. That click path is not this gate.
- When the current area is a saved live pin and `hereForecastAck` is not that rounded place, the house does not call the forecast host and does not call the reverse host. The closed plate says the saved place was not sent. The question is inside the open weather panel: "use this saved computer place for the forecast? this sends the saved place. it does not locate again."
- "Use this saved place" stores `{ lat, lon }` at a tenth of a degree on the card (`card.json` on the overlay, `computerpets.card.v1` on the desk). That yes sticks for that pin. A later load or refresh of the same pin sends the forecast and does not ask again.
- "Don't send" does not store the yes and does not send. The question stays in the open panel. It is not repeated on a timer.
- Clearing the pin, or picking another current area, drops the yes. Coming back to the pin asks once, not on every read.
- A fresh locate still requires the in-app locate yes from [0016](0016-weather-locate-waits-for-an-in-app-yes.md). That yes acknowledges the new pin, so the forecast from that locate is the same yes. It does not ask a second time for the pin just saved. It still does not run when the keeper has not sent the place.
- `ipPlace()` still returns nothing. The blotter's `read_weather_here` returns nothing.

## Consequences

- Electron 35 still cannot revoke a geolocation grant Chromium already cached in the renderer. This yes is not a revoke, not a browser prompt, and not a call to `getCurrentPosition`. After a locate yes, that cached grant can still satisfy `getCurrentPosition` without a new browser prompt. `maximumAge: 0` refuses a cached position. It does not flush the permission grant. A reload is the only flush of that renderer cache. This slice does not pretend otherwise. A later locate in the same session still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- The saved-place yes does not arm the session grant, does not call `getCurrentPosition`, and does not reverse-geocode. There is no `watchPosition`.
- A typed city lookup and an acknowledged forecast still show the client address to the forecast host. The house does not ask the host to turn that address into a city. Rounding to a tenth of a degree is about 11 km. It is not anonymity. A later load of that same pin used to send without a new question. [0032](0032-later-forecast-names-the-network-address.md) holds that send, and a typed-city forecast, until the weather panel is open and the line names the network address. It still does not ask again.
- An ack with digits finer than a tenth is dropped. It cannot keep a precise pin on the card.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The overlay plugin key is not plain text in `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
