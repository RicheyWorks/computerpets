# 0047. A STUN host waits for the painted line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/multiplayer/p2p.ts`, `web/src/lib/multiplayer/index.ts`

## Context

[0046](0046-house-fonts-stay-on-this-computer.md) stopped the desk from requesting a font host. The Java heartbeat stayed a hardcoded loopback poll. The next hole was in `P2PRoom`: `defaultIceServers` named `stun.l.google.com` and `stun.cloudflare.com` when `VITE_STUN_URLS` was empty. Those URLs are STUN binding requests. A browser that gathers ICE against them shows this computer's network address to that host, as any client.

Nothing on the desk, the overlay, or the blotter constructs `P2PRoom`. There is no signaling server in the tree. Opening the house does not call `join`, so those defaults sat idle. They were still the servers a later room would have used with no painted line.

## Decision

A peer connection does not contact a STUN or TURN host unless the painted line names that host. It does not start DirectX 12 or Vulkan. It does not rewrite the license, talk, forecast, or news gates. It does not add a room to the house. Catalog stays 221.

- `defaultIceServers` returns an empty list. `VITE_STUN_URLS` is not read. The Google and Cloudflare STUN hosts are not defaults.
- `iceServersForRoom` is the only list passed to `new RTCPeerConnection`. A `stun`, `stuns`, `turn`, or `turns` URL is kept only when `paintedLine` contains `stunNetLine` for that host. The port, the query, and any userinfo stay off the line. A missing line, a wrong host, or any other URL yields an empty list.
- An empty list gathers host candidates on this computer. It does not send a STUN binding request.
- The constructor does not open a peer connection. `connectTo` is the only `new RTCPeerConnection`, and it runs only after `join` sees another peer. No house path calls `join`.

## Consequences

- Opening the house does not show this computer's network address to a STUN host. A room that has not been built still cannot fall back to a public STUN server.
- A later room that opts in must paint `stunNetLine` for each host before those servers are used. The house does not ask that host to turn the address into a city.
- News, quotes, Radio Find, the featured page, a forecast, a geocode look-up, a station stream, cloud talk, and the license requests stay on their wrappers. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). [0041](0041-featured-page-waits-for-the-wikipedia-line.md). [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md). [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md). [0045](0045-license-requests-wait-for-the-painted-line.md). House fonts stay on this computer. [0046](0046-house-fonts-stay-on-this-computer.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Overlay connect-src names the hardcoded house hosts and keeps one `https:` scheme for a painted custom talk host. [0048](0048-overlay-connect-src-names-the-house-hosts.md).
- Later wording (2026-09): the STUN line now says "This asks stun.example, a website that helps computers find each other, so you can play together. This computer's internet address goes to stun.example, like visiting any website." The gate still waits for that painted line.
