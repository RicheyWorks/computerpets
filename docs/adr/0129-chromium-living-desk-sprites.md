# 0129. The living desk room pet, and desk Sip, Brick, called guests, and plants, draw on the same canvas

- **Status:** Accepted (day's visitor, house floor, hive, and den blotters moved to [0130](0130-chromium-visitor-floor-hive-den-sprites.md))
- **Date:** 2026-09-23
- **Code:** `web/src/lib/pets/desk-sprite-surface.ts`, `web/src/components/desk/living-pet.tsx`, `web/src/components/desk/companion-room.tsx`, `web/src/components/desk/bird-fly.tsx`, `web/src/components/desk/robin-fly.tsx`, `web/src/components/desk/called-guests.tsx`, `web/src/components/desk/desk-plants.tsx`, `desktop/renderer/sprite-surface.test.cjs`

## Context

[0128](0128-chromium-visit-and-demo-sprites.md) draws the visit guest and the desk `/demo` pet on the canvas the host pet already uses. That slice left the living desk outside `/demo` drawing the room pet as an `img`. Sip, Brick, called guests, and plants on that desk still assigned `src` on an image.

Inventory on `main` tip `afd4781cb`. `CompanionRoom` passed `spriteSurface={demoWindow}`, so `LivingPet` assigned `imgRef.current.src` whenever the room was not `/demo`. `BirdFlyer` assigned `img.src`. `RobinFlyer` assigned `src` with `setAttribute`. `CalledGuests` assigned `src` on an `img`. `DeskPlants` rendered an `img` with `object-fit: contain` and `object-position: bottom`. There was still no WebGL context. `gpu-path.cjs` still opened the glass only for hardware `gpu_compositing`.

The same catalog PNGs can be drawn through the surface the host pet already uses. The room pet keeps the 176px host box. Sip and Brick keep 112px. A called guest and a plant keep 128px. Contain, then sit on the bottom. A missing context stays blank. It does not become an `img` again. A desk path may start with `/`. A path with `..`, another origin, or another extension is not drawn.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. The hardware gate stays [0125](0125-chromium-overlay-gpu-path.md). The host pet surface stays [0126](0126-chromium-sprite-surface.md). Company sprites on the overlay stay [0127](0127-chromium-overlay-company-sprites.md). The visit guest and the `/demo` pet stay [0128](0128-chromium-visit-and-demo-sprites.md). GPU sense probes stay unread where those ADRs left them.

## Decision

**The living desk room pet, and desk Sip, Brick, called guests, and plants, draw on the same canvas Chromium composites. The glass still opens only when the [0125](0125-chromium-overlay-gpu-path.md) gate says so. If that canvas cannot be created, the sprite stays blank.**

1. **What draws.** `desk-sprite-surface.ts` calls `paintHeld` with the same catalog path: `sprites/<key>/<anim>/<n>.png`, or the same path with a leading `/`. The bitmap is contained in that actor's box and sits on the bottom. The room pet uses the host 176px box. Sip and Brick use 112px. A called guest and a plant use 128px. A path with `..`, another origin, or another extension is not drawn.
2. **Which surface.** The same rule as the host pet. When `OffscreenCanvas` can create a 2d context and the visible canvas can take a bitmap, the frame is drawn offscreen and transferred. When `OffscreenCanvas` is missing or its constructor throws, the visible canvas 2d context draws the same fit. `CompanionRoom` always sets `spriteSurface` on its room pet, including outside `/demo`. Sip is a canvas in `BirdFlyer`. Brick is a canvas in `RobinFlyer`. Called guests and plants are canvases in those desk nodes. None of them is a WebGL context. The desk page is not the overlay glass.
3. **What stays closed.** No canvas, no image decoder, an OffscreenCanvas whose 2d context is null, or a bitmap renderer that cannot take the bitmap: `data-surface` is `refused`, `data-frame` is unset, and these doors do not assign an `img` src. A decode error or a zero-size bitmap does not claim the frame. A frame that already painted stays until a later good frame replaces it. Width and height attributes are not written onto a canvas after that surface owns the bitmap.
4. **What the gate still is.** `gpu-path.cjs` is unchanged except the cross-link. `gpu_compositing`, `softwareRendering`, and the software GL names still open or close the glass. This module does not read `getGPUFeatureStatus()` or `getGPUInfo()`. It does not pass `--use-angle`. A software accept still means the window may open. It does not turn a refused canvas into an `img`.
5. **What stayed an image in this slice.** The day's visitor, the house floor, the hive, and the den blotters still drew through `LivingPet` without `spriteSurface`, so those catalog sprites were still `img` elements. They draw on this same canvas now ([0130](0130-chromium-visitor-floor-hive-den-sprites.md)). The habitat photograph stays an image. The blotter stays the Qt OpenGL viewport. Catalog stays 221.

## Consequences

- A keeper on the living desk, including outside `/demo`, sees the room pet on that surface. Sip, Brick, a called guest, and a plant on the desk use the same surface. `/demo` still draws the room pet on it. The desk does not open or close the overlay glass. The tray still says `Chromium GPU compositor` when the gate is hardware.
- A keeper whose canvas context cannot be created does not get an `img` that pretends to be that surface. The node stays blank.
- OffscreenCanvas is the preferred surface. It is not a shader and not a texture API this tree owns. WebGL is not opened.
- Sip and Brick still mount with the desk's `/demo` window plates. Called guests and plants still mount on every living desk, including outside `/demo`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the day's visitor, the house floor, the hive, and the den blotters draw on this same canvas now ([0130](0130-chromium-visitor-floor-hive-den-sprites.md)). The hardware gate still applies to the overlay. Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
