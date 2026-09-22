import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  LATER_DOOR,
  STALE_MS,
  UNREAD_GPU,
  gpuLine,
  isLinux,
  isMac,
  laterDoor,
  parseSample,
  present,
  sampleFromProbe,
  sensesOn,
} from "../src/lib/pets/gpu.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const NOW = 1_700_000_000_000;
const VALID_LINE = "GPU NVIDIA GeForce RTX 4070 · 62°C · 14% · 3.1 GiB/12 GiB · 48.5 W";

test("the browser contract matches the overlay: valid, missing, malformed, stale, unsupported", () => {
  assert.equal(sensesOn("win32"), true);
  assert.equal(isMac("darwin"), true);
  assert.equal(isLinux("linux"), true);
  assert.equal(laterDoor("darwin"), LATER_DOOR);
  assert.equal(laterDoor("linux"), LATER_DOOR);
  assert.equal(laterDoor("win32"), null);
  assert.equal(STALE_MS, 20000);

  const valid = sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(valid.status, "read");
  assert.equal(valid.utilPercent, 14);
  assert.equal(gpuLine(valid), VALID_LINE);

  const idle = sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 40, 0, 0, 8192, 5" },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(idle.utilPercent, 0);
  assert.equal(gpuLine(idle), "GPU NVIDIA GeForce RTX 4070 · 40°C · 0% · 0 MiB/8 GiB · 5 W");

  const missing = sampleFromProbe(
    { nvidiaCsv: null, engines: null, adapterMemory: null },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(missing.status, "unread");
  assert.equal(gpuLine(missing), "GPU unread");
  assert.equal(gpuLine(UNREAD_GPU), "GPU unread");
  assert.equal(missing.utilPercent, null);

  const malformed = parseSample(0);
  assert.equal(malformed.status, "malformed");
  assert.equal(malformed.utilPercent, null);
  assert.equal(gpuLine(malformed), "GPU unread · malformed");
  assert.doesNotMatch(gpuLine(malformed), /0%/);
  const typedZero = parseSample({ status: "read", platform: "win32", utilPercent: "0", readAtMs: NOW });
  assert.equal(typedZero.status, "malformed");

  const stale = present(valid, NOW + STALE_MS + 1);
  assert.equal(stale.status, "stale");
  assert.equal(stale.tempC, null);
  assert.equal(gpuLine(stale), "GPU unread · stale");
  assert.doesNotMatch(gpuLine(stale), /62/);
  assert.equal(present(valid, NOW + STALE_MS).status, "read");

  const mac = sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "darwin", nowMs: NOW },
  );
  const linux = sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "linux", nowMs: NOW },
  );
  assert.equal(mac.status, "unsupported");
  assert.equal(linux.status, "unsupported");
  assert.equal(gpuLine(mac), "GPU unread · mac-linux-gpu-sense");
  assert.equal(mac.tempC, null);
  assert.equal(linux.powerWatts, null);
});

test("demo and overlay keeper surfaces share the unread GPU row", () => {
  const card = readFileSync(join(root, "web/src/components/desk/keeper-card.tsx"), "utf8");
  const overlay = readFileSync(join(root, "desktop/renderer/index.html"), "utf8");
  const blotter = readFileSync(join(root, "client/computerpets_client/app.py"), "utf8");
  assert.match(card, /keeper-gpu/);
  assert.match(card, /gpuLine\(UNREAD_GPU\)/);
  assert.match(overlay, /id="hud-gpu"/);
  assert.match(overlay, /data-gpu="unread"/);
  assert.match(blotter, /gpu_label/);
  assert.match(blotter, /start_gpu_sense/);
  assert.doesNotMatch(card, /\/metrics\/gpu/);
});
