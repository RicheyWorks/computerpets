# 0120. Linux i915 and xe sysfs stay unread

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0119](0119-linux-amdgpu-sysfs-gpu-sense.md) left this gap: Intel GPU sysfs. i915 and xe stayed unread until a probe could print a real utilization or a real memory pair into the line Windows, Linux `nvidia-smi`, amdgpu, and Mac already parse. A first sample painted from a cumulative counter would be a lie. A frequency ratio is not utilization.

Inventory on `main` tip `a234b451e`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.sh` | Ran `nvidia-smi`, then amdgpu `gpu_busy_percent` and VRAM bytes. A missing file stayed `[N/A]` | It did not name an i915 or xe card. Those cards stayed in the same unread bucket as a missing drm directory |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Parsed `AMDGPU` / `AMDGPU_EMPTY`. An empty section stayed unread | A later `INTEL_EMPTY` marker was not a tag. A CSV line sitting under it would have been ignored only because no mode was open |

Upstream sysfs, as shipped, does not hand this probe an honest sample:

- i915 publishes `gt/gtN/rc6_residency_ms` (and the older `power/rc6_residency_ms`). That file is cumulative milliseconds in RC6. One read is not a percent. Two reads would be time outside RC6, which includes awake-but-idle. That is not engine busy, and it is not `utilization.gpu`.
- xe publishes `tileN/gtN/gtidle/idle_residency_ms`. Same cumulative idle clock, render C6 or media MC6. The GT name (`gtN-rc`, `gtN-mc`) does not turn it into an engine counter. Reading it also wakes the device. This probe does not read it.
- Engine busy for i915 is `drm-engine-*` nanoseconds in DRM client fdinfo, and a PMU. Engine busy for xe is `drm-cycles-*` / `drm-total-cycles-*` in that same fdinfo, and PMU `engine-active-ticks` / `engine-total-ticks`. None of those files live on sysfs. PMU needs `CAP_PERFMON`. debugfs is not this door.
- Frequency files (`rps_*`, xe `act_freq`, PVC HBM `memory/freq0`) are clocks. A ratio of clocks is not utilization.
- There is no shipped used and total memory pair. xe `physical_vram_size_bytes` was removed. What remains under `tileN/memory/` on PVC is frequency. An i915 local-memory sysfs (`memory_info/vram_*`) is not in upstream, and a draft of it can print `0` when the reader lacks `CAP_PERFMON`. A lone capacity with used painted as zero is a lie. GTT and system memory are not card capacity. Per-client fdinfo totals are not the card's pair.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. amdgpu temperature and power stay unread ([0119](0119-linux-amdgpu-sysfs-gpu-sense.md)). Mac temperature and power stay unread ([0118](0118-mac-ioaccelerator-gpu-sense.md)).

## Decision

**On Linux, when `nvidia-smi` and amdgpu both print no sample, the probe names an i915 or xe card and prints `INTEL_EMPTY`. A drm directory with neither driver prints `INTEL_ABSENT`. No CSV row is printed. Utilization and memory stay unread.**

1. **The line is still the existing line.** This slice does not add a new source and does not print `name, temperature, utilization, memory, power` for Intel. Temperature and power stay unread. Engine and adapter-memory sections stay absent.
2. **What is refused.** The driver symlink must be `i915` or `xe`. Connector nodes such as `card0-DP-1` are not cards. `rc6_residency_ms`, `idle_residency_ms`, frequency files, and a capacity file are not copied, including when a fixture fills them with numbers. The probe does not sleep to subtract two cumulative reads. A single counter is not turned into `0`.
3. **Who wins.** A `nvidia-smi` row that actually printed is the sample, and the Intel section is omitted. An amdgpu row that actually printed is the sample, and the Intel section is omitted. `AMDGPU_ABSENT` and `AMDGPU_EMPTY` both fall through to the Intel marker.
4. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe.sh` on Linux. `GPU_SYSFS_ROOT` selects the drm directory. Parsers treat `INTEL_ABSENT` and `INTEL_EMPTY` as an unread section. A CSV line written under `INTEL_EMPTY` is not a sample.
5. **What stays.** Windows and Mac probes are unchanged. The browser still has no sensor. There is no `/metrics/gpu` route. Catalog stays 221.

## Consequences

- A Linux keeper whose only card is i915 or xe stays unread (`missing`). The HUD does not gain a percent or a memory pair from sysfs. The marker is `INTEL_EMPTY`, so the miss is explicit.
- A keeper with no i915 or xe card, and no earlier sample, gets `INTEL_ABSENT` and stays unread.
- A real zero from `nvidia-smi` or from amdgpu is still kept. An Intel file is not turned into that zero.
- This tree was not run on an Intel host. The file names are the published sysfs names. A later kernel file that really is a one-sample percent, or a real used and total pair, stays unread until a probe accepts that file by name.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** DRM client fdinfo engine counters. i915 `drm-engine-render` is cumulative nanoseconds per client. xe `drm-cycles-rcs` and `drm-total-cycles-rcs` are cumulative cycles per client. A percent needs two reads in one probe, summed for that card's render engine, and a fail-closed rule when the counter moves backwards or the interval is zero. PMU is not the door. debugfs is not the door. RC6 and frequency stay unread. Device VRAM used and total are still not that fdinfo record. amdgpu temperature and power stay unread. Mac temperature and power stay unread. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
