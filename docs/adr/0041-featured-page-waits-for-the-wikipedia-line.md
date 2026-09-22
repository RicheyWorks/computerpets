# 0041. The featured page waits for the wikipedia line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/news.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/news.ts`, `web/src/components/desk/desk-plates.tsx`

## Context

[0034](0034-news-quotes-and-radio-name-the-network-address.md) paints `clientNetLine("the wikipedia host")` on the featured page. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md) makes main refuse a news RSS, quote, or Radio Find fetch when that painted line is missing from the IPC payload. The featured page was not one of those handlers.

World reads `https://en.wikipedia.org/api/rest_v1/feed/featured/YYYY/MM/DD`. The overlay calls that from `fetchNews` in the renderer. The desk and `/demo` call it from the same news plate. The blotter does not call it. The news body starts closed. Opening the house calls `fetchNews` and does not open the plate. A twenty-minute refresh calls `fetchNews` again. The page already painted the line and `newsMaySend` already returned early while the plate was closed. The fetch itself was still a raw `fetch(newsUrl())`. A caller that skipped the plate could still reach the wikipedia host.

## Decision

The featured page does not leave unless the painted line names the wikipedia host. It does not move onto a main handler. It does not rework the news, quote, or Radio IPC gates. It does not start DirectX 12 or Vulkan. It does not scrub a signed CDN query. It does not rewrite the unlock or download sentences. Catalog stays 221.

- The line is `this news send reads the featured page.` plus `clientNetLine("the wikipedia host")`. The path, the query, and the fragment stay off the line.
- `readFeatured` is the only fetch. `featuredMayLeave` is false when that sentence is missing, including when the rss sentence is the one in hand. A miss resolves to null and does not call `fetch`. The plate does not say "can't reach" for that hold.
- The overlay paints the line, then `newsMaySend` checks that the open news body is showing it, then `readFeatured` checks the same string. A closed plate and the house-open call do not fetch. The twenty-minute refresh uses that same gate.
- The desk and `/demo` share the plate. The effect returns while the plate is closed. While it is open, the same wrapper is the fetch. The blotter still does not call the wikipedia host.

## Consequences

- The wikipedia host sees this computer's network address only after that line was on the open plate, as any client. The house does not ask the host to turn the address into a city.
- News RSS, quotes, and Radio Find still wait in main. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). Desk, `/demo`, and overlay no-door paths use the same kind of refusing wrapper for those hosts. [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). A forecast and a geocode look-up refuse inside their own wrappers. [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md). A station stream and cloud talk refuse inside their own wrappers. [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- Unlock, a bound download, an unbound download, and the signed bundle GET keep their lines. [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
