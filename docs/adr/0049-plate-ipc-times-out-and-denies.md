# 0049. Overlay plate IPC times out and denies

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence/plate-fetch.cjs`, `desktop/main.cjs`

## Context

[0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md) keeps a news, quote, or radio fetch in main until the painted line is on the IPC payload. Those handlers then called `fetch` with no deadline. A host that never answered held the IPC open. The plate stayed on "looking up", which is not a result. License posts already time out inside the license client. These plate reads did not.

Radio Find also walks `de1`, `de2`, and `fi1` when a call fails fast. That walk is the same Radio Browser directory. A timeout is not a reason to start the next host.

## Decision

An overlay news, quote, or radio read from main gives up after twelve seconds. The handler returns `ok: false` and `error: "unread"` with an empty plate: no items, no live price, no stations. The keeper line stays "can't reach". It does not invent a headline, a price, or a station. It does not open a wider permission. A radio timeout does not call the next directory host. It does not start DirectX 12 or Vulkan. Catalog stays 221.

- The deadline covers the response headers and the body. A late body after the deadline is not parsed.
- A missing painted line still returns `unnamed` and does not fetch. That hold still does not say "can't reach".
- An empty URL list is still an empty success. Nothing was asked.
- A host that answers in time is parsed as that body. A body that is not the expected record stays unread. It is not filled in.
- A fast HTTP failure on radio may still walk the next Radio Browser mirror. A timeout does not.

## Consequences

- The overlay plate no longer waits forever on those IPC reads. "can't reach" means the host did not answer. It does not mean the search found nothing.
- Desk and `/demo` news, quote, and radio page wrappers time out. [0051](0051-news-quote-radio-page-times-out-and-denies.md). Cloud talk and cloud voice page wrappers time out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Weather forecast and geocode page wrappers time out. [0050](0050-weather-page-times-out-and-denies.md).
- Steam's RestClient times out. [0052](0052-cloud-talk-and-voice-page-times-out-and-denies.md). Itch and Epic RestClients time out. [0053](0053-itch-and-epic-restclient-times-out-and-denies.md). Microsoft and NFT already time out. Shared ownership time limiter. [0054](0054-ownership-time-limiter-denies-on-wall.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
