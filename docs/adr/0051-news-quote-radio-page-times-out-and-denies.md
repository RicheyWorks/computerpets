# 0051. News, quote, and radio page reads time out and deny

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/pets/news.ts`, `web/src/lib/pets/market.ts`, `web/src/lib/pets/house-music.ts`, `desktop/renderer/news.js`, `desktop/renderer/market.js`, `desktop/renderer/house-music.js`

## Context

[0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md) and [0041](0041-featured-page-waits-for-the-wikipedia-line.md) keep desk and overlay news, quote, and radio page fetches behind the painted host line. [0049](0049-plate-ipc-times-out-and-denies.md) gave overlay news, quote, and radio IPC reads a twelve-second deadline. [0050](0050-weather-page-times-out-and-denies.md) timed out weather page wrappers the same way. Desk and overlay news RSS, featured Wikipedia, quote, and radio Find page wrappers still called `fetch` with no deadline. A silent host held the plate on "looking up" or never returned the house line.

## Decision

`readRss`, `readFeatured`, `readGeckoMany`, `readTerminal`, `readYahoo`, `readNft`, `readQuoteSearch`, and `readRadioSearch` give up after twelve seconds. The timer covers the response headers and the body. A timeout rejects with `NewsTimeout`, `QuoteTimeout`, or `RadioTimeout`. The caller does not get a body. A late body after the deadline is not parsed. Desk and overlay share those wrappers. They do not invent a headline, a price, or a station. They do not phone a new host as the timeout fallback. A radio timeout does not call the next directory host. They do not start DirectX 12 or Vulkan. Catalog stays 221.

- A missing painted line still resolves to null and does not call `fetch`. That hold still does not say "can't reach".
- A hang or a null body after a real leave flips the plate to unread. The chip or keeper line stays "can't reach".
- A host that answers in time is parsed as that body. A body that is not the expected record stays unread. It is not filled in.

## Consequences

- The news, quotes, and radio plates no longer wait forever on those page reads. "can't reach" and unread mean the host did not answer or the body did not land. They do not mean the search found nothing.
- Cloud talk and cloud voice page wrappers time out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Overlay news, quote, and radio IPC already time out. [0049](0049-plate-ipc-times-out-and-denies.md). Weather page wrappers already time out. [0050](0050-weather-page-times-out-and-denies.md).
- Steam's RestClient times out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Itch and Epic RestClients time out. [0053](0053-itch-and-epic-restclient-times-out-and-denies.md). Microsoft and NFT already time out. Resilience4j still has no time limiter. Those stay Phase 2.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
