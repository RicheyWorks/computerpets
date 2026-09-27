# 0117. Linux reads nvidia-smi for desktop-local GPU sense

- **Status:** Accepted (the Mac stays-dark clause is superseded in part by [0118](0118-mac-ioaccelerator-gpu-sense.md); the amdgpu-unread clause is superseded in part by [0119](0119-linux-amdgpu-sysfs-gpu-sense.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0116](0116-mac-accessibility-window-play.md) left this gap: Mac and Linux GPU sense (`mac-linux-gpu-sense`). Windows already reads the keeper GPU. Mac and Linux returned `unsupported` and did not spawn. The numbers were not faked.

Inventory on `main` tip `c64c6b9b8`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.ps1` | Ran `nvidia-smi` with `name,temperature.gpu,utilization.gpu,memory.used,memory.total,power.draw` and English GPU performance counters. Missing tools printed `ABSENT`, not a zero | It is PowerShell. Linux did not run it |
| `desktop/gpu-sense.cjs` | Spawned that script on Windows and parsed the line protocol | `linux` and `darwin` returned before spawn |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Parsed the nvidia-smi CSV and the PDH counters into one sample. The sparkline is fresh `read` utilization only | `sensesOn` was Windows only. A Linux CSV was discarded as `mac-linux-gpu-sense` |

The CSV parser does not care which operating system printed the line. Linux `nvidia-smi` prints that same CSV. That is the halfway path. Mac has no `nvidia-smi` on Apple silicon, and this tree does not already parse IOAccelerator or `powermetrics`. Both could not land cleanly together. `powermetrics` needs root. This slice does not call it.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana.

## Decision

**On Linux, the overlay and the blotter run `nvidia-smi` and parse it with the line protocol Windows already uses. A missing binary stays unread. Mac stays `mac-gpu-sense` and does not spawn.**

1. **The query is the Windows query.** `nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total,power.draw --format=csv,noheader,nounits`. The probe prints `NVIDIA` / `ENDNVIDIA`, or `NVIDIA_ABSENT`, or `NVIDIA_EMPTY`. Then `ENGINE_ABSENT`, `MEMORY_ABSENT`, and `END`. There are no PDH counters on Linux, so those sections stay absent. They are not zeros.
2. **Who senses.** `sensesOn` is Windows and Linux. `laterDoor("linux")` is null. `laterDoor("darwin")` is `mac-gpu-sense`. The old combined reason `mac-linux-gpu-sense` is not painted.
3. **Who spawns.** `desktop/gpu-sense.cjs` runs `/bin/sh desktop/gpu-probe.sh` on Linux and PowerShell on Windows. The blotter `read_local` does the same split. Mac returns before spawn. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
4. **One adapter.** The existing picker still shows the fullest row, and the lowest index on a tie. `[N/A]` and `[Not Supported]` stay null. A zero the tool actually printed is kept. The sparkline still needs two fresh utilization points inside 20 seconds.
5. **What stays.** Windows PowerShell counters are unchanged. The browser still has no sensor, so the desk row stays unread. There is no `/metrics/gpu` route. amdgpu and Intel sysfs are not read. Catalog stays 221.

## Consequences

- A Linux keeper with `nvidia-smi` on `PATH` gets temperature, utilization, memory, and power on the same HUD line Windows already paints. The overlay tick and the blotter both call this probe.
- A Linux keeper without `nvidia-smi` stays unread (`missing`). That includes amdgpu and Intel. The house does not invent a percent from sysfs it did not read.
- Mac stays dark: `GPU unread · mac-gpu-sense`. No `ioreg` GPU dictionary. No `powermetrics`. A prompt for root is not a sense.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Mac GPU sense (`mac-gpu-sense`). The honest candidate is an IOAccelerator `PerformanceStatistics` read that does not prompt. `powermetrics` needs root and is not that read. Linux amdgpu and Intel sysfs stay unread until a later probe prints real fields into this same protocol. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
- Later wording (2026-09): the unread GPU line now reads `GPU · no reading` (`GPU · not read on this computer` when unsupported), and a missing number is `—`. The web card hides the GPU line (a browser cannot read the GPU). See ROADMAP (kid-plain words).
