# 0033. Looking up a place says this computer's internet address goes to the place look-up website

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `desktop/renderer/desk-house.js`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0032](0032-later-forecast-names-the-network-address.md) names this computer's network address on a later forecast. That line is `clientNetLine()`. The forecast host is `api.open-meteo.com`. Look up and the reverse lookup do not use that host.

Look up sends a typed name to `geocoding-api.open-meteo.com` when the keeper submits the weather form. After Send the place, a live fix is rounded and the reverse lookup sends that rounded place to the same geocode host. Both are ordinary HTTPS clients. The keeper line for those two requests did not say so. The house does not ask either host to turn the client address into a city. It does not restore an IP place lookup.

The overlay, the desk, and `/demo` share the weather plate. The form and the reverse lookup run only from Look up and from Send the place. Opening the plate, loading the roster, and a forecast refresh do not call the geocode host. The blotter's weather is the civil-day clock. It does not call that host.

## Decision

This slice shows the same network-address sentence before those two requests leave. It does not geocode on load. It does not add a timer. It does not start DirectX 12 or Vulkan. It does not move the license hwid door, the second-locate latch, or the forecast-panel gate. It does not chase a URL fragment or a hostname secret. It does not restore an IP place lookup. Catalog stays 221.

- `clientNetLine()` is the forecast sentence. `clientNetLine("the geocode host")` is that sentence with the host named: "this computer's network address goes with the https request to the geocode host, as any client." Look up says "this look-up sends the typed name" and then that line. The reverse lookup says "this reverse lookup sends the rounded place" and then that line.
- `geocodeMaySend` is true only for `look` or `reverse`, and only when that line is in view. A closed plate, the favorites tab, and a missing line do not send. The page paints the line, then calls `geocodeMaySend`, then builds the geocode URL.
- Look up is the keeper submit of a typed name. Send the place is still the locate yes from [0031](0031-later-locate-still-asks-in-the-app.md). The reverse lookup runs only after that yes, a rounded fix, and the line in view. If the line is not in view, the rounded place is kept without a name and the geocode host is not called.
- The blotter's `read_weather_here` still returns nothing. `ipPlace()` still returns nothing.

## Consequences

- Electron 35 still cannot revoke a geolocation grant Chromium already cached in the renderer. This slice does not change the in-app locate yes. [0031](0031-later-locate-still-asks-in-the-app.md). A later forecast still waits until the weather panel is open. [0032](0032-later-forecast-names-the-network-address.md).
- Rounding to a tenth of a degree is about 11 km. It is not anonymity. The reverse lookup sends that rounded place. It does not send the raw fix.
- The geocode host sees this computer's network address, as any HTTPS client. The house does not ask it for a city from that address.
- License `hwid` still reads a named machine id only when a bind needs it. A missing OS id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md). This slice does not change that door.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- News RSS, market quotes, and Radio Find name the network address in [0034](0034-news-quotes-and-radio-name-the-network-address.md).
- Later wording (2026-09): Look up now reads "This asks Open-Meteo, a weather website, to find the place you typed. It sends what you typed." and the reverse lookup "… for the name of the place you sent. It sends that place, rounded to about 11 km.", each followed by "This computer's internet address also goes to Open-Meteo, like visiting any website." Same gate. See ROADMAP (network consent lines in plain words).
