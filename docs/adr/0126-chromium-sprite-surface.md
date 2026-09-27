# 0126. The host pet draws on a canvas Chromium composites

- **Status:** Accepted (Sip, Brick, called guests, and plants moved to [0127](0127-chromium-overlay-company-sprites.md))
- **Date:** 2026-09-23
- **Code:** `desktop/renderer/sprite-surface.js`, `desktop/renderer/pet.js`, `desktop/renderer/sprite-surface.test.cjs`

## Context

[0125](0125-chromium-overlay-gpu-path.md) opens the overlay only when `gpu_compositing` is hardware-accelerated. That slice left the host pet as an `img`. Chromium composited the window. It did not draw the catalog frame onto a surface of its own.

Inventory on `main` tip `3fb551bfe`. `#pet` in `desktop/renderer/index.html` was an `img`. `pet.js` assigned `pet.src` to `sprites/<key>/<anim>/<n>.png`. Sip, Brick, called guests, and plants stayed image elements. There was no pet canvas, no OffscreenCanvas, and no WebGL context. `webgl` and `vulkan` feature tokens are still not the pet path. DirectX 12 and Vulkan stay unstarted.

The same catalog PNGs can be drawn into a canvas Chromium already composites. OffscreenCanvas plus a `bitmaprenderer` context is that surface when both exist. An on-screen 2d canvas is the same family when OffscreenCanvas is absent. A missing 2d context is not an `img` again.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. The hardware gate stays [0125](0125-chromium-overlay-gpu-path.md). GPU sense probes stay unread where those ADRs left them.

## Decision

**The host pet frame is drawn on a canvas Chromium composites. The glass still opens only when the [0125](0125-chromium-overlay-gpu-path.md) gate says so. If that canvas cannot be created, the pet stays blank.**

1. **What draws.** `sprite-surface.js` loads the same catalog path the `img` used: `sprites/<key>/<anim>/<n>.png` for idle, walk, sit, sleep, talk, eat, and play. The bitmap is contained in the 176px box and sits on the bottom, which is what `object-fit: contain` and `object-position: bottom` did. A path with `..`, another origin, or another extension is not drawn.
2. **Which surface.** When `OffscreenCanvas` can create a 2d context and the visible canvas can take a bitmap, the frame is drawn offscreen and transferred. Chromium composites that bitmap. When `OffscreenCanvas` is missing or its constructor throws, the visible canvas 2d context draws the same fit. The element is `<canvas id="pet">`. It is not a WebGL context.
3. **What stays closed.** No canvas, no image decoder, an OffscreenCanvas whose 2d context is null, or a bitmap renderer that cannot take the bitmap: `data-surface` is `refused`, `data-frame` is unset, and `pet.js` does not assign an `img` src. A decode error or a zero-size bitmap does not claim the frame. A frame that already painted stays until a later good frame replaces it.
4. **What the gate still is.** `gpu-path.cjs` is unchanged except the cross-link. `gpu_compositing`, `softwareRendering`, and the software GL names still open or close the glass. This module does not read `getGPUFeatureStatus()` or `getGPUInfo()`. It does not pass `--use-angle`. A software accept still means the window may open. It does not turn a refused canvas into an `img`.
5. **What stayed an image in this slice.** Sip, Brick, called guests, and plants were still `img` elements. They draw on this same canvas now ([0127](0127-chromium-overlay-company-sprites.md)). The visit guest and the desk `/demo` pet draw on this same canvas now ([0128](0128-chromium-visit-and-demo-sprites.md)). The living desk room pet, and desk Sip, Brick, called guests, and plants, draw on this same canvas now ([0129](0129-chromium-living-desk-sprites.md)). The day's visitor, the house floor, the hive, and the den blotters draw on this same canvas now ([0130](0130-chromium-visitor-floor-hive-den-sprites.md)). The blotter stays the Qt OpenGL viewport. Catalog stays 221.

## Consequences

- A keeper whose compositor is hardware-accelerated, and whose Chromium can create the canvas, sees the same catalog frame on that surface. The tray still says `Chromium GPU compositor` when the gate is hardware.
- A keeper whose canvas context cannot be created does not get an `img` that pretends to be that surface. The GUI harness waits for `data-frame` and fails the paint smoke when the surface stays refused.
- OffscreenCanvas is the preferred surface. It is not a shader and not a texture API this tree owns. WebGL is not opened.
- Sip, Brick, called guests, and plants draw on this same canvas ([0127](0127-chromium-overlay-company-sprites.md)). The visit guest and the desk `/demo` pet draw on this same canvas ([0128](0128-chromium-visit-and-demo-sprites.md)).
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the unused `img` helper in `web/src/lib/pets/call-guests.ts` ([0130](0130-chromium-visitor-floor-hive-den-sprites.md)). Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
