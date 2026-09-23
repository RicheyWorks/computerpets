# 0118. Mac reads IOAccelerator for desktop-local GPU sense

- **Status:** Accepted (Linux amdgpu sysfs moved to [0119](0119-linux-amdgpu-sysfs-gpu-sense.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe-mac.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0117](0117-linux-nvidia-gpu-sense.md) left this gap: Mac GPU sense (`mac-gpu-sense`). Linux already reads `nvidia-smi` with the line protocol Windows parses. A missing binary stays unread. Mac returned `unsupported` and did not spawn. The numbers were not faked.

Inventory on `main` tip `b7fc2e8f4`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.sh` | Ran `nvidia-smi` and printed `NVIDIA` / `ENDNVIDIA`, or `NVIDIA_ABSENT`, or `NVIDIA_EMPTY` | It is the Linux probe. Mac did not run it |
| `desktop/gpu-sense.cjs` | Spawned PowerShell on Windows and the shell probe on Linux | `darwin` returned before spawn |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Parsed the nvidia-smi CSV. `[N/A]` and `[Not Supported]` stay null. A zero the tool printed is kept | `sensesOn` was Windows and Linux. A Mac CSV was discarded as `mac-gpu-sense` |

`powermetrics` can print GPU power, and it needs root. A prompt for root is not a sense. This slice does not call it.

IOAccelerator `PerformanceStatistics` is readable with `ioreg` and does not prompt. The published keys this probe accepts are `Device Utilization %`, `GPU Activity(%)`, `In use system memory`, `vramUsedBytes`, and `vramFreeBytes`. `Alloc system memory` is not card capacity. Renderer and tiler percents are not device utilization. Temperature and power are not in this dictionary.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Linux amdgpu and Intel sysfs are not read.

## Decision

**On Mac, the overlay and the blotter run `ioreg -r -w 0 -c IOAccelerator -l` and print accepted PerformanceStatistics fields in the nvidia-smi line the parsers already understand. A missing tool or an empty dictionary stays unread. Temperature and power stay unread.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Missing fields are `[N/A]`, not zeros. Engine and adapter-memory sections stay `ENGINE_ABSENT` and `MEMORY_ABSENT`. There are no PDH counters on Mac.
2. **What is copied.** Device utilization comes from `Device Utilization %`, or from `GPU Activity(%)` when the device key is absent. In-use bytes come from `In use system memory`, converted to whole MiB. A value under half a MiB stays `[N/A]` so the MiB column does not become a painted zero. A registry value of zero stays zero. When both `vramUsedBytes` and `vramFreeBytes` are present, used and total come from that pair. `Alloc system memory` is ignored.
3. **Who senses.** `sensesOn` is Windows, Linux, and Mac. `laterDoor("darwin")` is null. A platform with no probe stays `unsupported`. The old reason `mac-gpu-sense` is not painted. A Mac row's source is `ioaccelerator`, not `nvidia-smi`.
4. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter run `/bin/sh desktop/gpu-probe-mac.sh` on Mac. A missing `ioreg` prints `NVIDIA_ABSENT`. A dictionary with no accepted field prints `NVIDIA_EMPTY`. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
5. **What stays.** Windows and Linux probes are unchanged. The browser still has no sensor, so the desk row stays unread. There is no `/metrics/gpu` route. amdgpu and Intel sysfs are not read. Catalog stays 221.

## Consequences

- A Mac keeper whose IOAccelerator dictionary prints device utilization or in-use memory gets those fields on the same HUD line. Temperature and power stay the word unread. The overlay tick and the blotter both call this probe.
- A Mac keeper without `ioreg`, or whose dictionary uses different keys, stays unread (`missing`). The house does not invent a percent.
- `powermetrics` is not called. Root is not requested.
- This tree was not run on a Mac host. The key names are the published PerformanceStatistics names. A dictionary that does not use them fails closed to empty.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Linux amdgpu and Intel sysfs. They stay unread until a later probe prints real fields into this same protocol. Mac temperature and power stay unread with this dictionary. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
