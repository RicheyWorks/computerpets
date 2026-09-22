# 0046. House fonts stay on this computer

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/routes/__root.tsx`, `web/src/styles.css`, `web/scripts/og-card.html`, `desktop/renderer/keeper.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/keeper.ts`, `web/src/components/desk/keeper-card.tsx`

## Context

Opening the desk loaded a stylesheet from `fonts.googleapis.com`. That CSS names files on `fonts.gstatic.com`. The request shows this computer's network address to that host, as any client. There is no painted line, and the house does not ask the keeper first. The overlay already uses system faces and does not call that host.

The next presence fetch after the license wrappers was the overlay heartbeat: a direct `fetch` of `http://127.0.0.1:8081/api/public/heartbeat` on a 15-second timer, and the same constant on the desk card (15 seconds) and the desk heartbeat line (20 seconds). That URL is a source constant. `COMPUTERPETS_BACKEND_URL`, the unlock field, and the desk env do not feed it. There is no setting that points it at another host. A loopback-only wrapper around a URL that cannot be configured would not close a hole, and it would not fall back to a remote host because there is no remote to fall back to. Opening the house can still poll this house.

[0045](0045-license-requests-wait-for-the-painted-line.md) still refuses a license post and the signed bundle GET without the painted line. This slice does not move those wrappers.

## Decision

The house document and the picture card do not request a font host. They do not start DirectX 12 or Vulkan. They do not scrub a URL. They do not rewrite the license, talk, forecast, or news gates. Catalog stays 221.

- The desk head links the house stylesheet, the icon, and the manifest. It does not link `fonts.googleapis.com` or `fonts.gstatic.com`.
- The type stacks stay names already on this computer: Fraunces then Iowan Old Style and Palatino; Figtree then Segoe UI and system-ui; IBM Plex Mono then ui-monospace. A face that is not installed is skipped. The house does not download one. There is no cloud font account.
- The picture card uses those same stacks. It does not link a font host.
- The overlay stylesheet stays system faces. It does not gain a font host.
- The heartbeat fetch stays `http://127.0.0.1:8081/api/public/heartbeat`. The overlay timer stays 15 seconds. The desk card stays 15 seconds. The desk heartbeat line stays 20 seconds. A missing Java door stays DOWN / unread. This slice does not add a helper for a URL that cannot leave.

## Consequences

- Opening the house does not show this computer's network address to a font host. The page uses faces already on this computer.
- The heartbeat still polls this house on those timers. It cannot be pointed at another machine without editing the constant. [0045](0045-license-requests-wait-for-the-painted-line.md).
- News, quotes, Radio Find, the featured page, a forecast, a geocode look-up, a station stream, and cloud talk stay on their wrappers. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). [0041](0041-featured-page-waits-for-the-wikipedia-line.md). [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md). [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- A STUN host is not this font request. [0047](0047-stun-waits-for-the-painted-line.md).
