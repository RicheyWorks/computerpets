# 0040. News, quotes, and Radio Find wait for the painted line in main

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence/plate-net.cjs`, `desktop/main.cjs`, `desktop/preload.cjs`, `desktop/renderer/pet.js`

## Context

[0034](0034-news-quotes-and-radio-name-the-network-address.md) paints the network-address line before the renderer calls main. [0039](0039-unbound-download-names-the-backend-host.md) makes the unbound download session refuse a remote POST when that line is missing. News, quotes, and Radio Find did not.

The overlay calls `news-feed`, `news-topic`, `market-quote`, `market-quotes`, `market-terminal`, `market-search`, `nft-quote`, and `radio-search`. Those handlers fetch as soon as the IPC runs. A caller that skips the plate still reaches the news host, the quote host, the terminal host, the stock host, or the radio host. Find and Local use the same radio search. Opening the house calls license status. It does not call these handlers while the plates are closed.

## Decision

Main does not fetch a remote URL for those handlers unless the painted line for that host is on the IPC payload. It does not add an account. It does not start DirectX 12 or Vulkan. It does not scrub a signed CDN query. It does not rewrite the unlock or download sentences. It does not chase a URL fragment or a hostname secret. Catalog stays 221.

- The payload carries the painted line. News uses `this news send reads the rss feed.` plus `clientNetLine("the news host")`. Radio Find and Local use `this find sends the station look-up.` plus `clientNetLine("the radio host")`. A saved quote uses `this quote sends the saved list.` plus the shared sentence. A combined plate phrase still counts when it names the host that this fetch will call: the quote host, the terminal host, or the stock host. A typed look-up uses `this look-up sends the typed name.` plus `clientNetLine("the quote host")`. The quote sentence is not the look-up sentence.
- `mayFetch` is false for a remote URL when that line is missing. The handler returns `unnamed` and does not call `fetch`. The plate does not say "can't reach" for that hold.
- `127.0.0.1`, `localhost`, and `::1` stay on this computer. The copy for that read is `this read stays on this computer.` Those fetches do not need the outbound sentence. A mix of loopback and a remote host still needs the line.
- An empty URL list does not fetch. Opening the house does not open these plates, and it does not search radio.

## Consequences

- A remote news host, quote host, terminal host, stock host, or radio host sees this computer's network address only after that line was handed to main, as any client. The house does not ask the host to turn the address into a city.
- The featured Wikipedia page stays a renderer fetch. [0041](0041-featured-page-waits-for-the-wikipedia-line.md) gates that wrapper. Desk, `/demo`, and overlay no-door RSS, quote, and Radio fetches use the same kind of refusing wrapper. [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). They are not these handlers. [0034](0034-news-quotes-and-radio-name-the-network-address.md). A forecast and a geocode look-up refuse inside their own wrappers. [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md). A station stream and cloud talk refuse inside their own wrappers. [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- Unlock, a bound download, an unbound download, and the signed bundle GET keep their lines. [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): main `plate-net.cjs` now checks the kid-plain news and quote lines ("This computer's internet address also goes to CoinGecko and GeckoTerminal, like visiting any website."); Radio Find keeps the older sentence. Same gate. See ROADMAP (network consent lines in plain words).
