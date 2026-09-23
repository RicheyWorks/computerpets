# 0125. The overlay opens on Chromium's GPU compositor or it stays closed

- **Status:** Accepted (host pet frame moved to [0126](0126-chromium-sprite-surface.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-path.cjs`, `desktop/main.cjs`, `desktop/gpu-path.test.cjs`

## Context

[0124](0124-mac-gpu-temp-power.md) left this gap: a real GPU path. GPU sensing is not that engine. DirectX 12 and Vulkan stay unstarted.

Inventory on `main` tip `0a89dcb37`. The overlay is Electron 35. Pets are DOM sprite frames (`img` elements in `desktop/renderer/pet.js`), moved on a timer. The transparent `BrowserWindow` is composited by Chromium's GPU process. There is no pet WebGL context, no shader, and no ANGLE switch in `main.cjs`. The switches that do exist are `enable-transparent-visuals`, `disable-renderer-backgrounding`, and `autoplay-policy`. `disable-gpu-sandbox` is only the GUI harness. Nothing read `app.getGPUFeatureStatus()` or `app.getGPUInfo()`. A software fallback still opened the glass and looked like the hardware path.

The blotter already names its path. `client/computerpets_client/blotter.py` attaches a `QOpenGLWidget` when the platform can create one, and it says software raster when it cannot. The overlay had no matching sentence.

Chromium's own status, from Electron 35's `GPUFeatureStatus`, is the check that matches how these pets are drawn:

| Signal | Hardware | Not hardware |
|--------|----------|----------------|
| `gpu_compositing` | `enabled`, `enabled_on`, `enabled_force`, `enabled_force_on`, `enabled_readback` | `disabled_software` and `unavailable_software` are a software fallback. `disabled_off`, `disabled_off_ok`, `unavailable_off`, `unavailable_off_ok`, and any other token are off |
| `auxAttributes.softwareRendering` | `false`, or absent | `true` is software, even when the compositing token says enabled |
| GL renderer | ANGLE on Direct3D 11, ANGLE on Metal, Mesa including a hardware `LLVM` string | `SwiftShader`, `llvmpipe`, `softpipe`, `lavapipe`, Microsoft Basic Render, a software rasterizer |

`webgl` and `vulkan` are not the pet. A WebGL software token does not close a hardware compositor. A Vulkan token is not turned on and is not read as the path. This slice does not pass `--use-angle`, does not enable Vulkan, and does not add a DirectX 12 backend.

`app.getGPUFeatureStatus()` is usable after Chromium has published GPU info. `app.getGPUInfo()` is that wait. A hang is unread.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Mac temperature and power stay unread ([0124](0124-mac-gpu-temp-power.md)).

## Decision

**The overlay glass opens when Chromium's GPU compositor is hardware-accelerated. A software fallback keeps it closed while hardware is expected. `gpu-path.json` defaults to `{"expect":"hardware"}`. `expect` `software` is the explicit accept of a software fallback, and the tray says so. An unread or off compositor stays closed either way.**

1. **What draws.** This decision drew pets as DOM sprite frames. The host pet frame is now a canvas Chromium composites ([0126](0126-chromium-sprite-surface.md)). Chromium's GPU process still composites the transparent window. The glass gate below is unchanged. It is not a shader engine.
2. **What opens.** `gpu_compositing` is one of the hardware tokens above, `softwareRendering` is not `true`, and the GL renderer is not a software name. `enabled_readback` is still hardware. The label is `Chromium GPU compositor`.
3. **What stays closed.** Software compositing, a software GL renderer, or `softwareRendering: true` refuses the window when `expect` is `hardware`. The tray says `Software compositing. Overlay closed.` and offers `Allow software compositing`, which writes `expect` `software` and relaunches. A missing status says `Compositor unread. Overlay closed.` An off compositor says `GPU compositing off. Overlay closed.` Those two do not offer the software accept, because that accept would not open them.
4. **What software accept means.** `expect` `software` opens a real software fallback and labels it `Chromium software compositing (accepted)`. The same file can require hardware again from the tray. If the compositor is actually hardware, the label stays the hardware one. Unread and off stay closed.
5. **Where the preference lives.** `gpu-path.json` under the overlay user-data directory. A missing file is written as hardware. A corrupt file or any other `expect` value is treated as hardware and is not rewritten. `vulkan` is not a value.
6. **What stays.** The blotter's Qt OpenGL viewport is unchanged. GPU sense probes are unchanged. There is no `/metrics/gpu` route. Catalog stays 221.

## Consequences

- A keeper whose Chromium compositor is hardware-accelerated gets the same glass as before, with the tray naming `Chromium GPU compositor`.
- A keeper whose Chromium fell back to SwiftShader, llvmpipe, or software compositing does not get a glass that pretends to be that path. The tray is the control that accepts the fallback on purpose.
- A hung or empty GPU info read stays closed. That is unread, not a guessed accelerator.
- The host pet frame moved to a canvas Chromium composites ([0126](0126-chromium-sprite-surface.md)). This slice did not create a WebGL context.
- ANGLE's Direct3D 11 or Metal string is Chromium's choice. This tree does not request DirectX 12 or Vulkan.
- The GUI harness quits with the refusal instead of waiting out the smoke when the glass stays closed.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the host pet draws on a canvas Chromium composites ([0126](0126-chromium-sprite-surface.md)). Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
