# 0122. Linux reads amdgpu temperature and power from hwmon

- **Status:** Accepted (Intel device VRAM fail-closed moved to [0123](0123-linux-intel-device-vram-gpu-sense.md))
- **Date:** 2026-09-23
- **Code:** `desktop/gpu-probe.sh`, `desktop/gpu-sense.cjs`, `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py`

## Context

[0121](0121-linux-intel-fdinfo-gpu-sense.md) left this gap: amdgpu temperature and power. hwmon was not that probe. The sensor index is not one temperature. Intel device VRAM used and total stayed unread. Mac temperature and power stayed unread.

Inventory on `main` tip `667e4b9b2`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/gpu-probe.sh` | Printed amdgpu utilization and VRAM on the shared CSV line. Temperature and power on that line were `[N/A]` | It did not read the card's hwmon directory. A fixture that planted `temp1_input` and `power1_average` without labels stayed unread |
| `desktop/renderer/gpu.js`, `web/src/lib/pets/gpu.ts`, `client/computerpets_client/gpu.py` | Parsed temperature and power on the same CSV line Windows already fills. An amdgpu `[N/A]` stayed null | They had no second source for an amdgpu degree or watt |

The kernel's amdgpu hwmon, under the card device, names the channels:

- `temp1_label` is `edge`. `temp2_label` is `junction`. `temp3_label` is `mem`. The input file is millidegrees Celsius. Junction and memory are not the edge temperature. On some chips the edge channel is hidden, so the index alone is not the GPU temperature.
- `power1_label` is `PPT` on the common cards. The input file is instantaneous microwatts. The average file is average microwatts. The cap file is the limit, not the draw. Vangogh prints `slowPPT` and `fastPPT` on two channels. Those are not one board draw. On an APU the PPT file includes the CPU. That is the number the driver prints.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy, metrics-server TLS/dial, Linux X11 window play, or Mac Accessibility window play. No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Intel fdinfo utilization stays as [0121](0121-linux-intel-fdinfo-gpu-sense.md) landed it. Mac temperature and power stay unread ([0118](0118-mac-ioaccelerator-gpu-sense.md)).

## Decision

**On Linux, an amdgpu sample may include temperature and power from that card's hwmon when the label names the field. An unlabeled channel stays unread. Junction, memory temperature, a power cap, slowPPT, and fastPPT stay unread.**

1. **The line is the existing line.** One CSV row is `name, temperature, utilization, memory.used MiB, memory.total MiB, power`. Temperature and power fill the same columns Windows and `nvidia-smi` already fill. Other missing fields stay `[N/A]`. The section markers stay `AMDGPU` / `ENDAMDGPU`, or `AMDGPU_ABSENT`, or `AMDGPU_EMPTY`. A temperature or a power reading alone is an accepted field, so the card prints a row. Engine and adapter-memory sections stay absent.
2. **What is copied.** The probe looks only at `hwmon/hwmonN` under that card's device. Temperature is the one channel whose label is `edge`, converted from millidegrees Celsius to degrees. The accepted range is -40 through 125, the same range the line parser keeps. Power is the one channel whose label is `PPT`. Instantaneous power is used when that file prints a number in range. Otherwise the average file is used. Microwatts become watts. The accepted range is 0 through 2000. A file that prints zero is kept. A value outside the range, a non-integer file, a failed read, or two channels with the same accepted label stays `[N/A]`.
3. **What is refused.** The probe does not treat channel 1 as edge or as PPT when the label file is missing. It does not copy junction, mem, a power cap, `slowPPT`, or `fastPPT`. It does not open PMU. It does not read another card's hwmon into an amdgpu row. It does not subtract a CPU estimate from an APU PPT reading.
4. **Who wins.** Unchanged. A `nvidia-smi` row that actually printed is the sample. An amdgpu row that actually printed wins over fdinfo. Parsers keep source `amdgpu`. The fullest row still wins, and the lowest index on a tie.
5. **Who spawns.** `desktop/gpu-sense.cjs` and the blotter still run `/bin/sh desktop/gpu-probe.sh` on Linux. `GPU_SYSFS_ROOT` selects the drm directory. A hung probe is killed. An empty or crashed probe is `unread` / `probe-failed`, not a zero.
6. **What stays.** Windows and Mac probes are unchanged. The browser still has no sensor. There is no `/metrics/gpu` route. Intel temperature, power, and device memory stay unread. Catalog stays 221.

## Consequences

- A Linux keeper whose amdgpu card prints an `edge` temperature or a `PPT` power gets that number on the same HUD line. The source stays `amdgpu`. Utilization and VRAM are unchanged.
- A card with no label file stays unread for that field. The HUD does not gain a degree from junction or a watt from the cap. Two edge channels, or two PPT channels, stay unread rather than picking one.
- A real zero in an accepted file is kept. A missing file is not turned into that zero.
- On an APU the PPT watt includes the CPU, because that is the file the driver publishes. This probe does not invent a GPU-only subtraction.
- This tree was not run on an AMD host. The names are the published hwmon labels. A card that does not expose them fails closed.
- Intel device VRAM used and total are still not this hwmon record. Per-client fdinfo memory is not that pair ([0120](0120-linux-intel-sysfs-gpu-sense.md), [0121](0121-linux-intel-fdinfo-gpu-sense.md)).
- Non-English Windows counter fields stay unread when the English counter path does not resolve. That was already [0008](0008-desktop-local-gpu-sense.md).
- Wayland without an X11 display stays empty. That is [0115](0115-linux-x11-window-play.md). Windows virtual desktops stay a later door. Neither blocks this probe.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Intel device VRAM used and total. There is still no shipped used and total pair, and per-client fdinfo memory is not that pair. Mac temperature and power stay unread; IOAccelerator does not carry them, and powermetrics is not the door. Instance engine keys stay unread. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
