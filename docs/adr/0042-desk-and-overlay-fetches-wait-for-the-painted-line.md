# 0042. Desk and overlay plate fetches wait for the painted line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/news.js`, `desktop/renderer/market.js`, `desktop/renderer/house-music.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/news.ts`, `web/src/lib/pets/market.ts`, `web/src/lib/pets/house-music.ts`, `web/src/components/desk/desk-plates.tsx`, `web/src/components/desk/keeper-card.tsx`

## Context

[0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md) makes main refuse a news RSS, quote, or Radio Find fetch when the painted line is missing from the IPC payload. [0041](0041-featured-page-waits-for-the-wikipedia-line.md) does the same for the featured Wikipedia page inside `readFeatured`. Desk, `/demo`, and the overlay no-door fallbacks still called raw `fetch` after `*MaySend`.

The desk and `/demo` have no main door. The overlay uses main when `window.desk` is up, and falls back to renderer `fetch` when it is not. A caller that skipped the plate, or a no-door path that only checked `*MaySend` outside the fetch, could still reach Google News RSS, CoinGecko, GeckoTerminal, Yahoo, or Radio Browser.

## Decision

Those renderer fetches do not leave unless the painted `clientNetLine` for that host is present on the line the caller painted. They do not rework the news, quote, or Radio IPC gates in main beyond a one-line cross-link. They do not start DirectX 12 or Vulkan. They do not scrub a signed CDN query. They do not rewrite the unlock or download sentences. Catalog stays 221.

- News RSS uses `readRss` / `rssMayLeave`. The line is `NEWS_RSS_HONESTY`. The wikipedia sentence does not count.
- Saved quotes use `readGeckoMany`, `readTerminal`, `readYahoo`, and `readNft` with `quoteHostMayLeave`. A combined plate phrase still counts when it names the host that this fetch will call. A typed look-up uses `readQuoteSearch` / `lookMayLeave` and the look-up sentence.
- Radio Find and Local use `readRadioSearch` / `radioSearchMayLeave` and `RADIO_FIND`.
- A miss resolves to null and does not call `fetch`. The plate does not say "can't reach" for that hold.
- The overlay paints the line, then `*MaySend`, then the wrapper. Desk and `/demo` share those wrappers. The blotter does not call them. Main stays on [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md).

## Consequences

- A remote news host, quote host, terminal host, stock host, or radio host sees this computer's network address from a desk or no-door path only after that line was painted, as any client.
- The featured Wikipedia page stays on [0041](0041-featured-page-waits-for-the-wikipedia-line.md). Forecast, geocode, station stream, and cloud talk stay on their own gates.
- Unlock, a bound download, an unbound download, and the signed bundle GET keep their lines. [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
