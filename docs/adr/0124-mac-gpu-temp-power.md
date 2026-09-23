# 0124. Mac GPU temperature and power stay unread

- **Status:** Accepted (Chromium overlay GPU path moved to [0125](0125-chromium-overlay-gpu-path.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe-mac.sh`, `desktop/gpu-sense.test.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0123](0123-linux-intel-device-vram-gpu-sense.md) left this gap: Mac temperature and power. IOAccelerator does not carry them, and powermetrics is not the door.

Inventory on `main` tip `ca88d0f15`. The shared CSV line is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. The Mac probe already prints `[N/A]` in the temperature and power columns.

| Source | What a keeper can read without a prompt | Why it is not this line |
|--------|------------------------------------------|-------------------------|
| IOAccelerator `PerformanceStatistics` via `ioreg` | `Device Utilization %`, `GPU Activity(%)`, `In use system memory`, and the `vramUsedBytes` / `vramFreeBytes` pair when both are present | The published dictionary has no temperature key and no power key. [0118](0118-mac-ioaccelerator-gpu-sense.md) already copies only those utilization and memory keys |
| `powermetrics` | A GPU power sampler | It needs root. A prompt is not a sense. This probe does not call it |
| IOReport (`Energy Model`, `GPU Stats`) | A private framework. Some Apple silicon power channels can be sampled without root by linking `IOReportCopyChannelsInGroup` | Not a stock text tool, and not `ioreg`. Channel names differ by chip (`GPU Energy` versus `GPU0`). `GPU Energy` is not the millijoule unit of the other energy channels, so copying it paints the wrong watt. Temperature channels are missing on some chips and read back 0 on others. That 0 is the refusal, not a cold die. This probe does not link IOReport |
| AppleSMC user client | `Tg` keys are GPU-related temperatures, read with an IOKit user client | The `ioreg` dump does not print the live key values. There is no one published key that is the GPU temperature across chips. Die, proximity, and an idle sentinel share the prefix. An average of that prefix is not one degree. This probe does not open the user client |
| `system_profiler`, `sysctl`, `pmset` | Battery, CPU power management, thermal pressure | No GPU degree and no GPU watt. `thermalPressureLevel` is not degrees Celsius |

A fixture can plant `Temperature`, `GPU Temperature`, `die temperature`, `dieTemp`, `Power`, `GPU Power`, `GPU Energy`, `watts`, `Tg05`, `Tg0D`, or `thermalPressureLevel` inside `PerformanceStatistics`, including a zero. Those names are not the published fields. Copying one would paint a degree or a watt the registry did not publish.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Intel device VRAM stays unread ([0123](0123-linux-intel-device-vram-gpu-sense.md)).

## Decision

**On Mac, temperature and power on the shared GPU line stay `[N/A]`. A planted temperature or power key, including a zero, is not copied and does not open a row. The probe does not call powermetrics, does not link IOReport, and does not open AppleSMC.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Temperature and power on a Mac row stay `[N/A]`. Utilization and memory stay as [0118](0118-mac-ioaccelerator-gpu-sense.md) landed them. The section markers stay `NVIDIA` / `ENDNVIDIA`, or `NVIDIA_ABSENT`, or `NVIDIA_EMPTY`. Engine and adapter-memory sections stay absent.
2. **What is refused.** `Temperature`, `GPU Temperature`, `die temperature`, `dieTemp`, `Power`, `GPU Power`, `GPU Energy`, `watts`, `Tg05`, `Tg0D`, `Tg0d`, and `thermalPressureLevel` are not copied. A zero in those keys is not a sample. The probe does not spawn powermetrics and does not ask for root. It does not link IOReport. It does not open the AppleSMC user client. It does not treat a `Tg` prefix, or an average of those keys, as the GPU temperature.
3. **Who wins.** Unchanged. A Mac row's source stays `ioaccelerator`. Parsers still keep a temperature or a power value when a probe actually prints one. This probe does not print one.
4. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe-mac.sh` on Mac. A missing `ioreg` prints `NVIDIA_ABSENT`. A dictionary with no accepted field prints `NVIDIA_EMPTY`. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
5. **What stays.** Windows and Linux probes are unchanged. The browser still has no sensor. There is no `/metrics/gpu` route. Intel device VRAM stays unread. Intel temperature and power stay unread. Catalog stays 221.

## Consequences

- A Mac keeper whose IOAccelerator dictionary prints device utilization or in-use memory still gets those fields. Temperature and power on that line stay the word unread. A fixture that plants a degree or a watt does not change the line.
- A dictionary whose only new keys are those temperature and power candidates stays `NVIDIA_EMPTY`. A zero in a candidate key is not printed as `0°C` or `0 W`.
- `powermetrics` is not called. Root is not requested. IOReport is not linked. AppleSMC is not opened.
- This tree was not run on a Mac host. The names are the published IOAccelerator keys and the private channels other tools use. A later public field that really is one GPU degree or one GPU watt, readable without root and without painting a refusal zero, stays unread until a probe accepts that field by name.
- Intel device VRAM used and total stay unread until an upstream pair does not paint a capability zero ([0123](0123-linux-intel-device-vram-gpu-sense.md)). Instance engine keys stay unread. Intel temperature and power stay unread.
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** the overlay's Chromium compositor check is [0125](0125-chromium-overlay-gpu-path.md). Do not start DirectX 12, Vulkan, Solana, or Pane. Catalog stays 221.
