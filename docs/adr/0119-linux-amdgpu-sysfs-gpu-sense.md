# 0119. Linux reads amdgpu sysfs for desktop-local GPU sense

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0118](0118-mac-ioaccelerator-gpu-sense.md) left this gap: Linux amdgpu and Intel sysfs. They stayed unread until a probe printed real fields into the line Windows, Linux `nvidia-smi`, and Mac already parse. A missing tool stayed unread. The numbers were not faked.

Inventory on `main` tip `4602a606a`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.sh` | Ran `nvidia-smi` and printed `NVIDIA` / `ENDNVIDIA`, or `NVIDIA_ABSENT`, or `NVIDIA_EMPTY`. Engine and adapter-memory sections stayed absent | It did not read `/sys/class/drm`. An AMD card with no `nvidia-smi` stayed unread |
| `desktop/gpu-sense.cjs` | Spawned that shell probe on Linux | It did not choose a second Linux source |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Parsed the CSV line. `[N/A]` stayed null. A zero the tool printed was kept. A Linux row's source was `nvidia-smi` | There was no `amdgpu` source. An AMD line would have been labeled `nvidia-smi` |

The amdgpu driver publishes `gpu_busy_percent` (a percent the SMU computed) and `mem_info_vram_used` / `mem_info_vram_total` (bytes). Those are the fields this probe copies. `mem_busy_percent` is VRAM busyness, not device utilization. GTT is not card capacity. hwmon temperature and power are a later read: the sensor index is not one temperature.

Intel i915 and xe do not publish a single-read utilization percent on sysfs. Engine busy files are cumulative counters. A first sample painted as zero would be a lie, and a frequency ratio is not utilization. This slice does not read them.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Mac temperature and power stay unread ([0118](0118-mac-ioaccelerator-gpu-sense.md)).

## Decision

**On Linux, when `nvidia-smi` is missing, fails, or prints nothing, the probe reads amdgpu sysfs and prints accepted fields on the same CSV line. A missing card or a card with no accepted field stays unread. Intel sysfs stays unread.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Temperature and power on this line are `[N/A]`. Other missing fields are `[N/A]`, not zeros. The section markers are `AMDGPU` / `ENDAMDGPU`, or `AMDGPU_ABSENT`, or `AMDGPU_EMPTY`. Engine and adapter-memory sections stay absent.
2. **What is copied.** Device utilization is `gpu_busy_percent` when it is a number from 0 through 100. A value the file did not print, including a failed read and a percent above 100, stays `[N/A]`. Used and total memory are `mem_info_vram_used` and `mem_info_vram_total` in bytes, converted to whole MiB. A total of zero is not capacity, so both memory fields stay `[N/A]`. Used greater than total drops both. A positive value under half a MiB stays `[N/A]` so the MiB column does not become a painted zero. A file that prints zero stays zero. The name is `amdgpu` plus `PCI_ID` from `uevent` when that id is hex. The driver symlink must be `amdgpu`. Connector nodes such as `card0-DP-1` are not cards.
3. **Who wins.** A `nvidia-smi` row that actually printed is the sample. The probe does not also print amdgpu in that case. Parsers keep source `nvidia-smi` for that row. An amdgpu row's source is `amdgpu`, not `nvidia-smi`. The fullest row still wins, and the lowest index on a tie. Cards are ordered by number.
4. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe.sh` on Linux. `GPU_SYSFS_ROOT` selects the drm directory. Unset, it is `/sys/class/drm`. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
5. **What stays.** Windows and Mac probes are unchanged. The browser still has no sensor, so the desk row stays unread. There is no `/metrics/gpu` route. Intel sysfs is not read. Catalog stays 221.

## Consequences

- A Linux keeper with an amdgpu card and no `nvidia-smi` row gets utilization and VRAM on the same HUD line when those files print real numbers. Temperature and power stay the word unread.
- A Linux keeper with neither `nvidia-smi` nor an accepted amdgpu field stays unread (`missing`). Intel stays in that set. The house does not invent a percent from a frequency or from a cumulative counter.
- A real zero in `gpu_busy_percent` or in a VRAM byte file is kept. A missing file is not turned into that zero.
- This tree was not run on an AMD host. The file names are the published amdgpu sysfs names. A card that does not expose them fails closed to empty.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Intel GPU sysfs. i915 and xe stay unread until a later probe can print a real utilization or a real memory pair into this same protocol without a painted first sample. amdgpu temperature and power stay unread; hwmon is not this slice. Mac temperature and power stay unread with the IOAccelerator dictionary. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
