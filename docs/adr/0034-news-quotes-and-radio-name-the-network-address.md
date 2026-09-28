# 0034. News, quotes, and Radio Find say this computer's internet address goes to that website

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/news.js`, `desktop/renderer/market.js`, `desktop/renderer/house-music.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `web/src/lib/pets/news.ts`, `web/src/lib/pets/market.ts`, `web/src/lib/pets/house-music.ts`, `web/src/components/desk/desk-plates.tsx`, `web/src/components/desk/keeper-card.tsx`, `client/computerpets_client/presence.py`

## Context

[0032](0032-later-forecast-names-the-network-address.md) names this computer's network address on a later forecast. [0033](0033-geocode-names-the-network-address.md) names it on a geocode look-up. That sentence is `clientNetLine()`. News RSS, market quotes, and Radio Find did not use it.

The overlay called `fetchNews` and `fetchMarket` when the roster finished loading. The news body and the quotes body start closed. Both also refresh on a twenty-minute interval, including while the plate is closed. The desk and `/demo` share those plates. The news effect fetched on mount and on that same interval without looking at whether the plate was open. The quotes effect fetched on mount the same way. It has no interval of its own. Radio Find and Local run when the keeper submits the radio form. That form does not fetch on load. None of those requests said that this computer's network address goes with the https request, the way any client does.

Popular news, a named topic, and the X tab read `news.google.com`. World reads `en.wikipedia.org`. A quote of a saved coin or an NFT floor reads `api.coingecko.com`. A contract reads `api.geckoterminal.com`. A stock reads `query1.finance.yahoo.com`. A typed coin or collection look-up reads `api.coingecko.com`. Radio Find reads a Radio Browser host. Favorites stay on the card. The blotter does not call any of them.

## Decision

This slice shows the same network-address sentence, with the host named, before those requests leave. It does not send news or quotes on load or while the plate is closed. It does not add a tracker. It does not start DirectX 12 or Vulkan. It does not move the license hwid door, the second-locate latch, or the forecast and geocode gates. It does not chase a URL fragment or a hostname secret. Catalog stays 221.

- `clientNetLine("the news host")` covers a Google News RSS send. `clientNetLine("the wikipedia host")` covers the featured page. `clientNetLine("the quote host")` covers CoinGecko prices, floors, and a typed look-up. A contract adds "the terminal host". A stock adds "the stock host". `clientNetLine("the radio host")` covers Find and Local.
- `newsMaySend` and `quoteMaySend` are true only when that line is in the open plate. A closed plate, a load, and the news favorites tab do not send. The page paints the line, then calls the gate, then builds the URL.
- The twenty-minute refresh still exists. It sends only while the plate stays open and the line is in view. It does not ask again on each tick. The desk quotes plate has no interval; opening it, or changing the saved list while it is open, is the send.
- Radio Find and Local wait until the radio form shows the line. A load does not search. A coin or collection look-up waits until the open quotes plate shows the look-up line. A known coin or a pasted contract is still added on the card without that search.
- The blotter still does not call a news host, a quote host, or a radio host. Play of a station stream is [0035](0035-station-stream-names-the-network-address.md). The main handlers re-check that same line before a remote fetch leaves. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). The featured page wrapper re-checks the wikipedia line before that renderer fetch. [0041](0041-featured-page-waits-for-the-wikipedia-line.md). Desk, `/demo`, and overlay no-door RSS, quote, and Radio fetches re-check the painted line inside the same kind of wrapper. [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md).

## Consequences

- The news host, the quote host, the terminal host, the stock host, and the radio host see this computer's network address, as any HTTPS client. The house does not ask them to turn that address into a city.
- A later forecast still waits until the weather panel is open. [0032](0032-later-forecast-names-the-network-address.md). A geocode look-up still waits for its own line. [0033](0033-geocode-names-the-network-address.md). This slice does not change those gates.
- License `hwid` still reads a named machine id only when a bind needs it. A missing OS id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md). This slice does not change that door.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): news and quotes now name Google News, Wikipedia, CoinGecko, GeckoTerminal, and Yahoo Finance in plain words (`plainNetLine`); Radio Find is in Rui's music block and keeps the sentence above. See ROADMAP (network consent lines in plain words).
