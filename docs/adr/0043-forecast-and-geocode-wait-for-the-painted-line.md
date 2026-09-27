# 0043. A forecast and a geocode look-up wait for the painted line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/weather-areas.ts`, `web/src/components/desk/desk-plates.tsx`

## Context

[0032](0032-later-forecast-names-the-network-address.md) paints the forecast sentence before a later forecast of a typed city or an acknowledged saved pin. [0033](0033-geocode-names-the-network-address.md) paints the geocode sentence before a typed look-up and before the reverse lookup after Send the place. The forecast host is `api.open-meteo.com`. The geocode host is `geocoding-api.open-meteo.com`.

Those requests already waited on the caller. `forecastMaySend` is true only while the current weather panel is open and the gate would send. `geocodeMaySend` is true only while the painted geocode line is in view. The fetch itself was still a raw `fetch` after that check. A caller that skipped the plate could still reach the forecast host or the geocode host. The desk and `/demo` have no main door. The overlay calls these from the renderer. The blotter does not call them.

[0041](0041-featured-page-waits-for-the-wikipedia-line.md) and [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md) put other plate fetches behind refusing wrappers. Forecast and geocode were the leftover.

## Decision

A forecast, a typed geocode look-up, and the reverse lookup do not leave unless the painted line for that host is present on the string the caller painted. They do not move onto a main handler. They do not rework the news, quote, or Radio IPC gates. They do not start DirectX 12 or Vulkan. They do not scrub a signed CDN query. They do not rewrite the unlock or download sentences. Catalog stays 221.

- The forecast line is `this forecast sends the named place.` or `this forecast continues the saved place you already allowed.` plus `clientNetLine()`. That empty host is the forecast sentence. The saved-place question also contains that sentence, and it does not count. The geocode sentence does not count.
- Look up uses `this look-up sends the typed name.` plus `clientNetLine("the geocode host")`. The reverse lookup uses `this reverse lookup sends the rounded place.` plus that same geocode sentence. One sentence does not unlock the other.
- `readForecast`, `readGeocode`, and `readReverse` are the only fetches. `forecastMayLeave`, `geocodeLookMayLeave`, and `geocodeReverseMayLeave` are false when that sentence is missing. A miss resolves to null and does not call `fetch`. The plate does not say "can't reach" for that hold.
- The overlay paints the line, then `forecastMaySend` or `geocodeMaySend`, then the wrapper. A closed panel does not call the wrapper. The desk and `/demo` share those wrappers. The blotter still does not call either host.

## Consequences

- The forecast host sees this computer's network address only after a forecast send sentence was on the open current panel, as any client. The geocode host sees it only after the look-up sentence or the reverse sentence was in view. The house does not ask either host to turn the address into a city.
- Panel-open and the existing network-address copy stay. A later forecast still waits until the weather panel is open. [0032](0032-later-forecast-names-the-network-address.md). A geocode look-up still waits for its own line. [0033](0033-geocode-names-the-network-address.md).
- News RSS, quotes, and Radio Find still wait in main. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). The featured page and the other desk plate fetches stay on their wrappers. [0041](0041-featured-page-waits-for-the-wikipedia-line.md). [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). A station stream and cloud talk refuse inside their own wrappers. [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- Unlock, a bound download, an unbound download, and the signed bundle GET keep their lines. [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the weather, news, and quotes plates now paint a kid-plain line that names the website, e.g. "This asks Open-Meteo, a weather website, for your forecast. It sends the place you picked. This computer's internet address also goes to Open-Meteo, like visiting any website." (`plainNetLine`); the gate still waits for that exact painted line. See ROADMAP (network consent lines in plain words).
