# 0123. Linux i915 and xe device VRAM stay unread

- **Status:** Accepted (Mac temperature and power fail-closed moved to [0124](0124-mac-gpu-temp-power.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.test.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0122](0122-linux-amdgpu-hwmon-gpu-sense.md) left this gap: Intel device VRAM used and total. Per-client fdinfo memory is not that pair. Mac temperature and power stayed unread.

Inventory on `main` tip `ac5a15805`. The shared CSV line is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`.

| Surface | How used and total are printed | What it does not print |
|---------|--------------------------------|------------------------|
| Windows and Linux `nvidia-smi` | `memory.used` and `memory.total` from the same query, already in MiB. A zero the tool printed is kept. `[N/A]` stays null | It does not invent a pair when the binary is missing |
| Linux amdgpu | `mem_info_vram_used` and `mem_info_vram_total`, bytes converted to whole MiB. A total of zero is not capacity. Used greater than total drops both. A positive value under half a MiB stays `[N/A]`. A file that prints zero stays zero | GTT, VRAM busyness, and another card's files |
| Mac IOAccelerator | When both `vramUsedBytes` and `vramFreeBytes` are present, used and total come from that pair. `In use system memory` can fill used alone | `Alloc system memory` is not capacity. Temperature and power are not in the dictionary |
| Linux i915 and xe | Render utilization from two DRM fdinfo reads, when that percent is honest. Memory columns on that line are `[N/A]` | No device used and total pair |

Upstream, checked against `torvalds/linux` master for this slice, does not hand this probe an honest device pair:

- xe `tileN/memory/physical_vram_size_bytes` is gone. `xe_tile_sysfs.c` creates the tile directory and the PVC HBM frequency files under `tileN/memory/freq0`. Frequency is not a byte pair. `vram_d3cold_threshold` is the D3cold save policy in megabytes, not used and not total.
- An i915 `memory_info` directory (`vram_total`, `vram_avail`, and the visible siblings) is not in `i915_sysfs.c`. The May 2025 draft can print `0` for both total and available when the reader lacks `CAP_PERFMON`. A zero total is not capacity. A zero available beside a real total would paint the card full.
- xe `DRM_XE_DEVICE_QUERY_MEM_REGIONS` publishes `total_size`. `used` is zero unless the reader has `CAP_PERFMON` or `CAP_SYS_ADMIN`. The interface says that zero is the refusal, not an idle card. System memory in that query is not VRAM.
- i915 `I915_QUERY_MEMORY_REGIONS` publishes `probed_size`. `unallocated_size` is zero without `CAP_PERFMON`. Used computed as probed minus that zero paints the card full.
- Per-client fdinfo (`drm-total-vram`, `drm-resident-vram`, `drm-total-local`, `drm-resident-local`, `drm-total-system`) is one client's memory. A sum misses kernel and display allocations, shared objects, and clients the probe cannot read.
- GTT and stolen memory are not card capacity. An integrated GPU has no device VRAM. System memory is not that pair.
- PMU and debugfs stay closed. Opening `/dev/dri` for a query whose used field is a capability zero is the same lie.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Intel fdinfo utilization stays as [0121](0121-linux-intel-fdinfo-gpu-sense.md) landed it. Mac temperature and power stay unread ([0118](0118-mac-ioaccelerator-gpu-sense.md)).

## Decision

**On Linux, an i915 or xe row still may print render utilization. Device VRAM used and total stay `[N/A]`. A fixture that plants a memory file, including a zero, is not copied. The probe does not open `/dev/dri` to query memory.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Temperature, memory, and power on an Intel row stay `[N/A]`. The section markers stay `INTEL` / `ENDINTEL`, or `INTEL_ABSENT`, or `INTEL_EMPTY`. A memory file alone does not open `INTEL`. Engine and adapter-memory sections stay absent.
2. **What is refused.** `memory_info/vram_total`, `memory_info/vram_avail`, `memory_info/vram_used`, `mem_info_vram_used`, `mem_info_vram_total` on an Intel device, `tileN/memory/physical_vram_size_bytes`, `tileN/memory/vram_used_bytes`, `vram_d3cold_threshold`, HBM frequency, and per-client fdinfo memory are not copied. A zero in those files is not a sample. The probe does not open `/dev/dri`. It does not treat a query zero as idle, and it does not subtract that zero from a capacity to paint the card full.
3. **Who wins.** Unchanged. A `nvidia-smi` row that actually printed is the sample. An amdgpu row that actually printed wins over fdinfo. Those rows still carry their own used and total pair. Parsers keep source `fdinfo` for an Intel utilization row. The fullest row still wins, and the lowest index on a tie.
4. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe.sh` on Linux. `GPU_SYSFS_ROOT` selects the drm directory. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
5. **What stays.** Windows, amdgpu, and Mac probes are unchanged. The browser still has no sensor. There is no `/metrics/gpu` route. Intel temperature and power stay unread. Catalog stays 221.

## Consequences

- A Linux keeper whose i915 or xe card has an honest render percent still gets that percent. Memory on that line stays the word unread. The HUD does not gain a MiB pair from a planted file or from fdinfo memory.
- A card whose only new files are those memory candidates stays `INTEL_EMPTY` when utilization is also unread. A zero in a candidate file is not printed as `0 MiB`.
- nvidia-smi and amdgpu keep the pairs they already print. This slice does not change those columns.
- This tree was not run on an Intel host. The names are the published files and the query fields. A later kernel file that really is a device used and total pair, readable without painting a capability zero, stays unread until a probe accepts that file by name.
- Mac temperature and power are still not this record. IOAccelerator does not carry them. powermetrics is not the door.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Mac temperature and power. IOAccelerator does not carry them, and powermetrics is not the door. Instance engine keys stay unread. Intel device VRAM stays unread until an upstream used and total pair does not paint a capability zero. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
