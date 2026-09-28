# 0032. A later forecast says this computer's internet address goes to the weather website

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `desktop/renderer/desk-house.js`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`, `client/computerpets_client/presence.py`

## Context

[0017](0017-saved-computer-place-waits-for-a-forecast-yes.md) holds a saved live pin until the keeper says to use that place. That yes sticks. [0031](0031-later-locate-still-asks-in-the-app.md) spends a later locate on a fresh in-app yes. Neither of those stops a forecast of a place already on the card.

The overlay called `fetchWeather` when the roster finished loading. The weather body starts closed. A typed city, or a saved pin whose yes was already stored, still requested `api.open-meteo.com` on that load. Picking the area again, or applying the house after a tab or a favorite, called it again. Opening the panel did not. There is no weather forecast timer. News and the market refresh on their own interval. They do not call the forecast host.

The desk and `/demo` share one plate. Its forecast effect ran on mount and whenever the areas or the saved-pin yes changed. It did not look at whether the plate was open. A closed plate still sent. The keeper line did not say that this computer's network address goes with that HTTPS request, the way any client does. The house does not ask the host to turn that address into a city.

The blotter does not read machine location. Its weather is the civil-day clock. It has no forecast refresh.

## Decision

This slice does not send a later forecast on load or while the weather panel is closed. It does not ask again for a pin the keeper already allowed. It does not add a forecast timer. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the second-locate latch. It does not chase a URL fragment or a hostname secret. It does not restore an IP place lookup. Catalog stays 221.

- `forecastMaySend` is true only when the forecast gate would send and the current weather panel is open. The favorites tab hides that line, so it does not count as open. A load with the plate closed does not call the forecast host. Closing the plate does not start a new call.
- Opening that panel, or switching back to the current place while it is open, shows one line and then sends. A typed city says "this forecast sends the named place. this computer's network address goes with the https request, as any client." An acknowledged pin says "this forecast continues the saved place you already allowed. this computer's network address goes with the https request, as any client. it does not locate again."
- The first saved-pin question uses the same network-address sentence. "Use this saved place" is still the yes. It still sticks for that pin. A later read does not ask again.
- While the plate is closed and no forecast is in hand, the chip says "forecast waits". It does not say "looking up".
- A place change that the keeper cannot see on the current panel does not send, and it drops a sky that belonged to the previous place. The civil-day clock covers the room until a forecast is actually in hand.
- The blotter's `read_weather_here` still returns nothing. `ipPlace()` still returns nothing.

## Consequences

- Electron 35 still cannot revoke a geolocation grant Chromium already cached in the renderer. This slice does not call `getCurrentPosition` and does not arm that grant. A later locate still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md). This slice does not change that latch.
- The saved-pin yes is not a new question on each open. Opening the current panel again sends once more, with the same line in view. That is the continuing send. It is not a timer and not a dialog.
- A typed city and an acknowledged pin share that network-address line. Look up and the reverse lookup after Send the place name that same address before they leave for the geocode host. [0033](0033-geocode-names-the-network-address.md). This slice is the forecast.
- Rounding to a tenth of a degree is about 11 km. It is not anonymity. The house does not ask the host to turn the client address into a city.
- License `hwid` still reads a named machine id only when a bind needs it. A missing OS id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md). This slice does not change that door.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- News RSS, market quotes, and Radio Find name the network address in [0034](0034-news-quotes-and-radio-name-the-network-address.md).
- Later wording (2026-09): the weather, news, and quotes plates now paint a kid-plain line that names the website, e.g. "This asks Open-Meteo, a weather website, for your forecast. It sends the place you picked. This computer's internet address also goes to Open-Meteo, like visiting any website." (`plainNetLine`); the gate still waits for that exact painted line. See ROADMAP (network consent lines in plain words).
