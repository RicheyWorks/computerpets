# 0121. Linux reads i915 and xe render utilization from DRM fdinfo

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0120](0120-linux-intel-sysfs-gpu-sense.md) left this gap: DRM client fdinfo engine counters. i915 `drm-engine-render` is cumulative nanoseconds per client. xe `drm-cycles-rcs` and `drm-total-cycles-rcs` are cumulative cycles per client. One read is not a percent. PMU and debugfs stay closed. Device VRAM used and total are not that fdinfo record.

Inventory on `main` tip `5d5424308`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.sh` | Named an i915 or xe card and printed `INTEL_EMPTY` or `INTEL_ABSENT` when nvidia-smi and amdgpu printed nothing | It did not read `/proc`. It did not sleep. A cumulative counter was not turned into a percent |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Treated `INTEL_ABSENT` and `INTEL_EMPTY` as an unread section. A CSV line under `INTEL_EMPTY` was not a sample | There was no `INTEL` / `ENDINTEL` section and no `fdinfo` source |

The overlay tick is five seconds. A hung probe is killed at eight. A second read can sit inside that tick when the gap is short and a scan that has already run long does not start the sleep.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. amdgpu temperature and power stay unread ([0119](0119-linux-amdgpu-sysfs-gpu-sense.md)). Mac temperature and power stay unread ([0118](0118-mac-ioaccelerator-gpu-sense.md)). RC6, GT idle, and frequency stay unread ([0120](0120-linux-intel-sysfs-gpu-sense.md)).

## Decision

**On Linux, when `nvidia-smi` and amdgpu both print no sample, the probe reads DRM client fdinfo twice and prints render utilization on the same CSV line when that percent is honest. A rewind, a zero interval, a missing file, or a percent above 100 stays unread. Temperature, power, and memory stay unread.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Temperature, memory, and power on this line are `[N/A]`. The section markers are `INTEL` / `ENDINTEL`, or `INTEL_ABSENT`, or `INTEL_EMPTY`. A CSV line written under `INTEL_EMPTY` is still not a sample. Engine and adapter-memory sections stay absent.
2. **What is copied.** i915 sums `drm-engine-render` nanoseconds across clients of that card's PCI slot that appear in both reads, then divides by the wall interval and by `drm-engine-capacity-render` when that capacity is present, consistent, and from 1 through 64. A missing capacity is 1. xe sums `drm-cycles-rcs` and `drm-total-cycles-rcs` the same way and divides busy cycles by total cycles. The name is `i915` or `xe` plus `PCI_ID` when that id is hex. The driver symlink must be `i915` or `xe`. Connector nodes such as `card0-DP-1` are not cards. A client seen in only one read is not given a baseline of zero. Two fdinfo files for the same client id count once when they agree and fail the card when they disagree. A real zero busy delta over a positive interval is kept. A counter that moves backwards, a wall interval of zero, a xe total-cycle interval of zero, a percent above 100, or a counter that does not fit in signed 64-bit arithmetic stays unread.
3. **What is refused.** The probe does not open PMU. It does not read `rc6_residency_ms`, `idle_residency_ms`, frequency files, or per-client fdinfo memory. Instance keys such as `drm-cycles-rcs0` are not the class key. The gap between live reads defaults to 200ms and is refused above 1000ms, so the five-second overlay tick is not slept through. A first scan already longer than 1.5 seconds does not start the second read. A probe already longer than 3.5 seconds does not print a percent. `GPU_FDINFO_ROOT_2` and `GPU_FDINFO_INTERVAL_NS` are a fixture stand-in for the second snapshot and the measured gap. The live path measures the gap and ignores that override.
4. **Who wins.** A `nvidia-smi` row that actually printed is the sample, and the Intel section is omitted. An amdgpu row that actually printed is the sample, and the Intel section is omitted. Parsers keep source `fdinfo` for an Intel row. The fullest row still wins, and the lowest index on a tie. nvidia-smi wins over amdgpu, which wins over fdinfo.
5. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe.sh` on Linux. `GPU_SYSFS_ROOT` selects the drm directory. `GPU_PROC_ROOT` selects the proc directory. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
6. **What stays.** Windows and Mac probes are unchanged. The browser still has no sensor. There is no `/metrics/gpu` route. Catalog stays 221.

## Consequences

- A Linux keeper whose i915 or xe card has paired DRM clients gets render utilization on the same HUD line. Temperature, power, and memory stay the word unread. The source is `fdinfo`.
- A rewind, a zero interval, a missing counter, a percent above 100, or a scan that would crowd the overlay tick stays `INTEL_EMPTY`. The HUD does not gain a painted zero for those misses. A measured idle (busy delta zero, interval positive) stays zero.
- A card with no i915 or xe driver stays `INTEL_ABSENT`.
- This tree was not run on an Intel host. The keys are the published fdinfo names. A kernel that only prints per-instance keys stays unread until a probe accepts that name.
- Per-client fdinfo memory is not device VRAM used and total. Those fields stay unread.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** amdgpu temperature and power. hwmon is still not this probe; the sensor index is not one temperature. Intel device VRAM used and total stay unread; per-client fdinfo memory is not that pair. Instance engine keys stay unread. Mac temperature and power stay unread. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
