# 0127. Sip, Brick, called guests, and plants draw on the same canvas

- **Status:** Accepted (visit guest and desk `/demo` pet moved to [0128](0128-chromium-visit-and-demo-sprites.md))
- **Date:** 2026-09-23
- **Code:** `desktop/renderer/sprite-surface.js`, `desktop/renderer/pet.js`, `desktop/renderer/call-guests.js`, `desktop/renderer/sprite-surface.test.cjs`

## Context

[0126](0126-chromium-sprite-surface.md) draws the host pet on a canvas Chromium composites. That slice left Sip, Brick, called guests, and plants as `img` elements. Chromium composited the window. Those four still assigned `src` on an image.

Inventory on `main` tip `4a214eaa1`. `#bird` and `#robin` in `desktop/renderer/index.html` were images. `pet.js` assigned `birdEl.src` and `robinEl.src`. `paintPlants` created an `img.desk-plant`. `syncCalledPaint` created an `img.called-guest` and assigned `src`. The visit guest `#guest` and the desk `/demo` pet stayed images. There was still no WebGL context. `gpu-path.cjs` still opened the glass only for hardware `gpu_compositing`.

The same catalog PNGs can be drawn through the surface the host pet already uses. Each actor keeps its own box: 112px for Sip and Brick, 128px for a called guest and a plant. Contain, then sit on the bottom, which is what `object-fit: contain` and `object-position: bottom` did. A missing context stays blank. It does not become an `img` again.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. The hardware gate stays [0125](0125-chromium-overlay-gpu-path.md). The host pet surface stays [0126](0126-chromium-sprite-surface.md). GPU sense probes stay unread where those ADRs left them.

## Decision

**Sip, Brick, called guests, and plants draw on the same canvas Chromium composites. The glass still opens only when the [0125](0125-chromium-overlay-gpu-path.md) gate says so. If that canvas cannot be created, the sprite stays blank.**

1. **What draws.** `sprite-surface.js` `paintHeld` loads the same catalog path: `sprites/<key>/<anim>/<n>.png`. The bitmap is contained in that actor's box and sits on the bottom. Sip and Brick use 112px. A called guest and a plant use 128px. The host pet stays 176px. A path with `..`, another origin, or another extension is not drawn.
2. **Which surface.** The same rule as the host pet. When `OffscreenCanvas` can create a 2d context and the visible canvas can take a bitmap, the frame is drawn offscreen and transferred. When `OffscreenCanvas` is missing or its constructor throws, the visible canvas 2d context draws the same fit. Sip and Brick are `<canvas id="bird">` and `<canvas id="robin">`. Called guests and plants are canvases created for those nodes. None of them is a WebGL context.
3. **What stays closed.** No canvas, no image decoder, an OffscreenCanvas whose 2d context is null, or a bitmap renderer that cannot take the bitmap: `data-surface` is `refused`, `data-frame` is unset, and the overlay does not assign an `img` src. A decode error or a zero-size bitmap does not claim the frame. A frame that already painted stays until a later good frame replaces it. Width and height attributes are not written onto a canvas, because that clears the backing store this surface owns.
4. **What the gate still is.** `gpu-path.cjs` is unchanged except the cross-link. `gpu_compositing`, `softwareRendering`, and the software GL names still open or close the glass. This module does not read `getGPUFeatureStatus()` or `getGPUInfo()`. It does not pass `--use-angle`. A software accept still means the window may open. It does not turn a refused canvas into an `img`.
5. **What stayed an image in this slice.** The visit guest `#guest` and the desk `/demo` pet were still `img` elements. They draw on this same canvas now ([0128](0128-chromium-visit-and-demo-sprites.md)). The living desk room pet, and desk Sip, Brick, called guests, and plants, draw on this same canvas now ([0129](0129-chromium-living-desk-sprites.md)). The day's visitor, the house floor, the hive, and the den blotters stay image elements. The blotter stays the Qt OpenGL viewport. Catalog stays 221.

## Consequences

- A keeper whose compositor is hardware-accelerated, and whose Chromium can create the canvas, sees Sip, Brick, a called guest, and a plant on that surface. The tray still says `Chromium GPU compositor` when the gate is hardware.
- A keeper whose canvas context cannot be created does not get an `img` that pretends to be that surface. The node stays blank.
- OffscreenCanvas is the preferred surface. It is not a shader and not a texture API this tree owns. WebGL is not opened.
- The visit guest and the desk `/demo` pet draw on this same canvas ([0128](0128-chromium-visit-and-demo-sprites.md)).
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the day's visitor, the house floor, the hive, and the den blotters still draw catalog sprites as images ([0129](0129-chromium-living-desk-sprites.md)). Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
