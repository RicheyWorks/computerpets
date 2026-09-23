import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  LATER_DOOR,
  READ_INK,
  STALE_MS,
  UNREAD_GPU,
  UNREAD_INK,
  emptyHistory,
  gpuLine,
  isLinux,
  isMac,
  laterDoor,
  parseSample,
  present,
  remember,
  sampleFromProbe,
  sensesOn,
  sparkline,
} from "../src/lib/pets/gpu.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const NOW = 1_700_000_000_000;
const VALID_LINE = "GPU NVIDIA GeForce RTX 4070 · 62°C · 14% · 3.1 GiB/12 GiB · 48.5 W";

test("the browser contract matches the overlay: valid, missing, malformed, stale, unsupported", () => {
  assert.equal(sensesOn("win32"), true);
  assert.equal(sensesOn("linux"), true);
  assert.equal(isMac("darwin"), true);
  assert.equal(isLinux("linux"), true);
  assert.equal(laterDoor("darwin"), LATER_DOOR);
  assert.equal(laterDoor("linux"), null);
  assert.equal(laterDoor("win32"), null);
  assert.equal(LATER_DOOR, "mac-gpu-sense");
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
  assert.equal(linux.status, "read");
  assert.equal(linux.tempC, 62);
  assert.equal(linux.utilPercent, 14);
  assert.equal(gpuLine(mac), "GPU unread · mac-gpu-sense");
  assert.equal(gpuLine(linux), VALID_LINE);
  assert.equal(mac.tempC, null);
  assert.equal(linux.powerWatts, 48.5);
});

function at(util, when) {
  return sampleFromProbe(
    { nvidiaCsv: `NVIDIA GeForce RTX 4070, 62, ${util}, 3200, 12288, 48.5` },
    { platform: "win32", nowMs: when },
  );
}

const TRAIL = "M1 11.3 L71 8.2";

test("a sparkline grows only from fresh read samples and stays empty otherwise", () => {
  const first = at(14, NOW);
  let history = remember(emptyHistory(), first, NOW);
  assert.equal(history.length, 1);
  assert.equal(history[0].utilPercent, 14);
  let spark = sparkline(history, first, NOW);
  assert.equal(spark.empty, true);
  assert.equal(spark.path, "");
  assert.equal(spark.ink, UNREAD_INK);

  const second = at(40, NOW + 1000);
  history = remember(history, second, NOW + 1000);
  spark = sparkline(history, second, NOW + 1000);
  assert.equal(history.length, 2);
  assert.equal(spark.empty, false);
  assert.equal(spark.path, TRAIL);
  assert.equal(spark.ink, READ_INK);
  assert.equal(spark.points.length, 2);

  const unread = sampleFromProbe(
    { nvidiaCsv: null, engines: null, adapterMemory: null },
    { platform: "win32", nowMs: NOW },
  );
  assert.deepEqual(remember([], unread, NOW), []);
  const unreadSpark = sparkline([], UNREAD_GPU, 0);
  assert.equal(unreadSpark.empty, true);
  assert.equal(unreadSpark.path, "");
  assert.deepEqual(unreadSpark.history, []);
  assert.equal(unreadSpark.ink, UNREAD_INK);
  assert.equal(sparkline(history, unread, NOW + 2000).path, "");

  const malformed = parseSample(0);
  assert.deepEqual(remember([], malformed, NOW), []);
  assert.equal(sparkline([], malformed, NOW).path, "");
  assert.equal(sparkline(history, malformed, NOW + 2000).empty, true);

  const mac = sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "darwin", nowMs: NOW },
  );
  assert.deepEqual(remember([], mac, NOW), []);
  assert.equal(sparkline([], mac, NOW).path, "");
  assert.equal(sparkline([], mac, NOW).ink, UNREAD_INK);

  const later = NOW + 1000 + STALE_MS + 1;
  const stale = present(second, later);
  assert.equal(stale.status, "stale");
  assert.deepEqual(remember(history, stale, later), []);
  const cleared = sparkline(history, stale, later);
  assert.equal(cleared.empty, true);
  assert.equal(cleared.path, "");
  assert.deepEqual(cleared.history, []);
});

test("demo and overlay keeper surfaces share the unread GPU row", () => {
  const card = readFileSync(join(root, "web/src/components/desk/keeper-card.tsx"), "utf8");
  const overlay = readFileSync(join(root, "desktop/renderer/index.html"), "utf8");
  const blotter = readFileSync(join(root, "client/computerpets_client/app.py"), "utf8");
  const deskGpu = readFileSync(join(root, "desktop/renderer/gpu.js"), "utf8");
  const blotterGpu = readFileSync(join(root, "client/computerpets_client/gpu.py"), "utf8");
  assert.match(card, /keeper-gpu/);
  assert.match(card, /gpuLine\(UNREAD_GPU\)/);
  assert.match(card, /sparkline\(\[\], UNREAD_GPU, 0\)/);
  assert.match(card, /data-spark=/);
  assert.doesNotMatch(card, /M1 11\.3/);
  assert.match(overlay, /id="hud-gpu"/);
  assert.match(overlay, /data-gpu="unread"/);
  assert.match(overlay, /data-spark="empty"/);
  assert.match(blotter, /gpu_label/);
  assert.match(blotter, /gpu_spark/);
  assert.match(blotter, /start_gpu_sense/);
  assert.match(blotter, /sparkline/);
  assert.match(deskGpu, /function remember/);
  assert.match(deskGpu, /function sparkline/);
  assert.match(blotterGpu, /def remember/);
  assert.match(blotterGpu, /def sparkline/);
  assert.doesNotMatch(card, /\/metrics\/gpu/);
});
