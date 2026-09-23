# 0008. GPU load is desktop-local on the keeper machine, not `/metrics/gpu`

- **Status:** Accepted (the Mac and Linux `unsupported` clause is superseded in part by [0117](0117-linux-nvidia-gpu-sense.md) and [0118](0118-mac-ioaccelerator-gpu-sense.md))
- **Date:** 2026-09-22
- **Code:** `desktop/gpu-probe.ps1`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

The X-ad bar asks the keeper HUD to tell the truth about the machine the pet lives on: temperature, utilization, memory, and power. Architecture §11 put that sense on the keeper machine and left a dotted choice between a Spring `/metrics/gpu` door and a desktop-local reading.

Spring Boot on 8081 is the trust anchor for licenses and the heartbeat. It is often a different host than the Windows desktop. A route there would report the server's GPU, or nothing, and a painted zero would look healthy. Chromium's GPU feature status is not temperature, utilization, memory, or power. The overlay is still Electron/Chromium. The blotter is still a Qt OpenGL viewport, not a DirectX 12 or Vulkan engine.

## Decision

GPU load is a desktop-local sense.

- Windows 10/11 reads `nvidia-smi` when it prints real fields, and English GPU performance counters for utilization and dedicated memory. Temperature and power stay unread unless `nvidia-smi` actually reports them. One adapter is shown. Engine counters use the busiest 3D engine, not a sum.
- Mac and Linux return `unsupported` with reason `mac-linux-gpu-sense`. They do not spawn a probe and they do not display numbers that arrived from somewhere else. Linux `nvidia-smi` moved to [0117](0117-linux-nvidia-gpu-sense.md). Mac IOAccelerator moved to [0118](0118-mac-ioaccelerator-gpu-sense.md).
- A missing, malformed, or stale sample (older than 20 seconds) renders dark: the word unread, no zero, no healthy green. A zero the hardware actually reported is kept.
- The overlay, the blotter, and the desk / `/demo` / Live / Meet card share that line. The browser has no sensor, so the desk row stays unread.
- There is no `/metrics/gpu` endpoint.

## Consequences

- The sparkline is a trail of real `read` samples from this sense, kept for the same 20 seconds. It draws only when two or more of those points include utilization. One sample is not a stroke. Unread, unsupported, stale, and malformed readings leave the strip empty in the unread ink. The original decision left the sparkline for later; it landed on 2026-09-22 without inventing samples.
- A real GPU render path (DirectX 12, Vulkan, or an honest Chromium path that still feels like the poster) stays later. Sensing did not build that engine. The sparkline is not that engine.
- Non-English Windows may leave counter fields unread when the English counter path does not resolve. That is unread, not a guessed number.
- AMD and Intel temperature and power stay unread unless a later probe reads those vendors for real.
