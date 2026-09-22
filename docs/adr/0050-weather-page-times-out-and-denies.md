# 0050. Weather page reads time out and deny

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/pets/weather-areas.ts`, `desktop/renderer/weather-areas.js`, `desktop/renderer/pet.js`, `web/src/components/desk/desk-plates.tsx`

## Context

[0043](0043-forecast-and-geocode-wait-for-the-painted-line.md) keeps a forecast or geocode fetch behind the painted host line. [0049](0049-plate-ipc-times-out-and-denies.md) gave overlay news, quote, and radio IPC reads a twelve-second deadline. Desk and overlay weather page wrappers still called `fetch` with no deadline. A silent Open-Meteo host held the plate on "looking up". A null result after the call did not flip the plate to unread.

## Decision

`readForecast`, `readGeocode`, and `readReverse` give up after twelve seconds. The timer covers the response headers and the body. A timeout rejects with `WeatherTimeout`. The caller does not get a body. A late body after the deadline is not parsed. Desk and overlay share those wrappers. They do not invent a forecast, a place, or a reverse name. They do not phone a new host as the timeout fallback. They do not start DirectX 12 or Vulkan. Catalog stays 221.

- A missing painted line still resolves to null and does not call `fetch`. That hold still does not say "can't reach".
- A forecast timeout or a null body after a real leave flips the plate to unread. The chip says unread. The keeper look-up line stays "can't reach" when a typed geocode hang or null lands.
- A reverse timeout or null keeps the unnamed rounded pin. It does not invent a city name.
- A host that answers in time is parsed as that body. A body that is not the expected record stays unread. It is not filled in.

## Consequences

- The weather plate no longer waits forever on Open-Meteo. "can't reach" and unread mean the host did not answer or the body did not land. They do not mean the search found nothing.
- Desk and overlay page wrappers for news, quotes, and radio time out. [0051](0051-news-quote-radio-page-times-out-and-denies.md). Cloud talk and cloud voice page wrappers time out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Overlay news, quote, and radio IPC already time out. [0049](0049-plate-ipc-times-out-and-denies.md).
- Steam's RestClient times out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Itch and Epic RestClients time out. [0053](0053-itch-and-epic-restclient-times-out-and-denies.md). Microsoft and NFT already time out. Resilience4j still has no time limiter. Those stay Phase 2.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
