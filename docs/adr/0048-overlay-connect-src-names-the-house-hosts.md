# 0048. Overlay connect-src names the house hosts

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/index.html`, `desktop/renderer/settings.html`, `desktop/presence/connect-src.cjs`

## Context

The overlay document is the only page with a Content-Security-Policy. Its `connect-src` was the scheme `https:` plus loopback. A renderer script could `fetch` any https host. Cloud talk still refuses inside `readTalk` until the painted line names that talk host. The policy did not.

The desk and `/demo` share one document. It has no Content-Security-Policy. Their plate fetches, cloud talk, cloud voice, and station audio run in that page. A tight page policy would refuse a painted custom talk host, a redirect from a preset talk host, and a station stream host. Those hosts are not a closed list. Copying `connect-src https:` onto the desk would not tighten it. This slice does not add that policy.

Inventory of what actually connects:

- Overlay renderer `fetch` is the loopback heartbeat and cloud talk inside `readTalk`. News, quotes, Radio Find, weather, geocode, the license posts, and the signed bundle GET leave from the main process or over IPC. They are not renderer `connect-src`.
- Preset talk and voice hosts are `api.x.ai`, `api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`, `api.groq.com`, `openrouter.ai`, `api.together.xyz`, `api.fireworks.ai`, `api.deepseek.com`, and `api.mistral.ai`.
- News hosts are `en.wikipedia.org` and `news.google.com`. `x.com` is an Open on X link. It is not a fetch.
- Quote hosts are `api.coingecko.com`, `api.geckoterminal.com`, and `query1.finance.yahoo.com`. Marketplace notes are not fetches and are not on the policy.
- Radio directory hosts are `de1.api.radio-browser.info`, `de2.api.radio-browser.info`, and `fi1.api.radio-browser.info`. The user-agent string names GitHub. That is not a fetch.
- Forecast and geocode hosts are `api.open-meteo.com` and `geocoding-api.open-meteo.com`.
- A custom talk base, a redirect from a preset talk host, a station stream host, and a signed CDN host are whatever host the keeper or the manifest named. The license and CDN requests do not use the renderer policy. The stream uses `media-src`.

The minds window had no policy. It saves prefs and calls main. It does not `fetch`.

## Decision

The overlay `connect-src` names every hardcoded house host and keeps one `https:` scheme. It does not start DirectX 12 or Vulkan. It does not rewrite the talk, forecast, or license wrappers. It does not add a storefront. Catalog stays 221.

- The scheme stays because a painted custom talk host, and a redirect from a preset talk host, are not a closed list. The meta policy is fixed when the document loads. Dropping the scheme would refuse that talk. [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- Each hardcoded talk, voice, news, quote, radio, weather, and geocode host is also a `https://` token on that same `connect-src`. A new literal host has to land in `connect-src.cjs` and in the overlay meta together. The painted-line wrapper for that host stays. One scheme token does not excuse a missing name.
- `media-src` stays `'self' https: http: blob:`. A station stream host is the station URL. A house loop stays on this computer.
- The minds window policy is `connect-src 'none'`. Opening that window does not fetch. Unlock and the signed bundle still leave through IPC. [0045](0045-license-requests-wait-for-the-painted-line.md).
- The desk and `/demo` document still has no Content-Security-Policy. This slice does not give it one.

## Consequences

- Opening the house does not contact a new host. Naming a host on `connect-src` does not fetch it. The heartbeat is still the loopback poll. A STUN host is still not a default. [0047](0047-stun-waits-for-the-painted-line.md). House fonts stay on this computer. [0046](0046-house-fonts-stay-on-this-computer.md).
- A renderer `fetch` to a preset talk host still waits for the painted line. A custom talk host still waits for that line, and the scheme still allows the request. [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- The minds window cannot `fetch` an https host. The desk page still can, because it has no policy. A later desk policy has to name the same hosts and still has to keep a scheme for a painted custom talk host and a station stream, or it will refuse them.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
