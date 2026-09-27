# 0130. The day's visitor, the house floor, the hive, and the den blotters draw on the same canvas

- **Status:** Accepted
- **Date:** 2026-09-26
- **Code:** `web/src/components/desk/living-pet.tsx`, `web/src/components/desk/companion-room.tsx`, `web/src/lib/pets/desk-sprite-surface.ts`, `desktop/renderer/sprite-surface.test.cjs`

## Context

[0129](0129-chromium-living-desk-sprites.md) draws the living desk room pet, and desk Sip, Brick, called guests, and plants, on the canvas the host pet already uses. That slice left the day's visitor, the house floor, the hive, and the den blotters drawing catalog sprites as `img` elements.

Inventory on `main` tip `25e0a239d`. All four draw through the same `LivingPet` component. `HouseVisit` (the day's visitor on the living desk), `HouseFloor` (the Meet floor walkers), `HiveGuest` inside `HiveDen`, and `BlotterGuest` inside `LivingBlotter` (every den blotter) rendered `<LivingPet>` without `spriteSurface`. `LivingPet` kept two draw paths behind that flag. With the flag it painted a canvas through `paintDemoFrame`. Without it, it rendered an `img` with `object-fit: contain` and `object-position: bottom` and assigned `imgRef.current.src` on every frame change. `CompanionRoom` was the only caller that set the flag. There was still no WebGL context. `gpu-path.cjs` still opened the glass only for hardware `gpu_compositing`.

The same catalog PNGs can be drawn through the surface the room pet already uses. Every `LivingPet` keeps the 176px host box. Each walker's own gait scale still shrinks it with the same CSS transform as before. Contain, then sit on the bottom. A missing context stays blank. It does not become an `img` again. A desk path may start with `/`. A path with `..`, another origin, or another extension is not drawn.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No pet art is touched. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. The hardware gate stays [0125](0125-chromium-overlay-gpu-path.md). The host pet surface stays [0126](0126-chromium-sprite-surface.md). Company sprites on the overlay stay [0127](0127-chromium-overlay-company-sprites.md). The visit guest and the `/demo` pet stay [0128](0128-chromium-visit-and-demo-sprites.md). The living desk room pet and desk company sprites stay [0129](0129-chromium-living-desk-sprites.md). GPU sense probes stay unread where those ADRs left them.

## Decision

**Every `LivingPet` draws on the same canvas Chromium composites. That covers the day's visitor, the house floor, the hive, and the den blotters, as well as the living desk and `/demo` room pet. The glass still opens only when the [0125](0125-chromium-overlay-gpu-path.md) gate says so. If that canvas cannot be created, the sprite stays blank.**

1. **What draws.** `LivingPet` always renders one `<canvas data-pet-art>` and always calls `paintDemoFrame(canvasRef.current, src)` for the current frame. `desk-sprite-surface.ts` calls `paintHeld` with the same catalog path: `sprites/<key>/<anim>/<n>.png`, or the same path with a leading `/`. The bitmap is contained in the host 176px box and sits on the bottom. A path with `..`, another origin, or another extension is not drawn.
2. **Which surface.** The same rule as the host pet. When `OffscreenCanvas` can create a 2d context and the visible canvas can take a bitmap, the frame is drawn offscreen and transferred. When `OffscreenCanvas` is missing or its constructor throws, the visible canvas 2d context draws the same fit. The `spriteSurface` flag is gone, so no caller can pick the `img` path. `HouseVisit`, `HouseFloor`, `HiveDen`, and `LivingBlotter` need no change. None of them is a WebGL context. The desk page is not the overlay glass.
3. **What stays closed.** No canvas, no image decoder, an OffscreenCanvas whose 2d context is null, or a bitmap renderer that cannot take the bitmap: `data-surface` is `refused`, `data-frame` is unset, and `LivingPet` does not assign an `img` src. It no longer has an `img` to assign. A decode error or a zero-size bitmap does not claim the frame. A frame that already painted stays until a later good frame replaces it. Width and height attributes are not written onto a canvas after that surface owns the bitmap.
4. **What the gate still is.** `gpu-path.cjs` is unchanged except the cross-link. `gpu_compositing`, `softwareRendering`, and the software GL names still open or close the glass. This module does not read `getGPUFeatureStatus()` or `getGPUInfo()`. It does not pass `--use-angle`. A software accept still means the window may open. It does not turn a refused canvas into an `img`.
5. **What stays an image.** The habitat photograph behind each room stays an image. The portrait photographs on pet cards and the Meet grid stay images. They are not catalog sprites. The PyQt blotter stays the Qt OpenGL viewport. Catalog stays 221.

## Consequences

- A keeper who sees the day's visitor on the living desk, the Meet house floor, the hive, or any den blotter sees those walkers on the same surface as the room pet. The desk does not open or close the overlay glass. The tray still says `Chromium GPU compositor` when the gate is hardware.
- A keeper whose canvas context cannot be created does not get an `img` that pretends to be that surface. The walker stays blank.
- OffscreenCanvas is the preferred surface. It is not a shader and not a texture API this tree owns. WebGL is not opened.
- No catalog sprite on the Chromium desk or the overlay draws through an `img` now.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** `web/src/lib/pets/call-guests.ts` still exports `assignSrc` and `syncCalledPaint`, which set an `img` src. No desk component calls them since [0129](0129-chromium-living-desk-sprites.md). A later slice can drop them or route them through this surface. The PyQt blotter is not Chromium and stays Qt OpenGL. Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
