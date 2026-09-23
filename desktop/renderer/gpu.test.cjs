const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const G = require("./gpu.js");

const NOW = 1_700_000_000_000;
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const probeSrc = readFileSync(join(__dirname, "..", "gpu-probe.ps1"), "utf8");

const VALID_LINE = "GPU NVIDIA GeForce RTX 4070 · 62°C · 14% · 3.1 GiB/12 GiB · 48.5 W";

function probe(body) {
  return G.parseProbeText(body);
}

test("Windows, Linux, and Mac sense; another platform stays unsupported", () => {
  assert.equal(G.sensesOn("win32"), true);
  assert.equal(G.sensesOn("Windows"), true);
  assert.equal(G.sensesOn("linux"), true);
  assert.equal(G.sensesOn("Linux"), true);
  assert.equal(G.sensesOn("darwin"), true);
  assert.equal(G.sensesOn("Mac"), true);
  assert.equal(G.laterDoor("win32"), null);
  assert.equal(G.laterDoor("linux"), null);
  assert.equal(G.laterDoor("darwin"), null);
  assert.equal(G.isMac("darwin"), true);
  assert.equal(G.isLinux("linux"), true);
  assert.equal(G.laterDoor("freebsd"), "unsupported");
  assert.equal(G.LATER_DOOR, "unsupported");
  assert.equal(G.STALE_MS, 20000);
  const mac = G.sampleFromProbe(
    { nvidiaCsv: "Apple M2, [N/A], 16, 542, [N/A], [N/A]" },
    { platform: "darwin", nowMs: NOW },
  );
  const linux = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "linux", nowMs: NOW },
  );
  const other = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "freebsd", nowMs: NOW },
  );
  assert.equal(mac.status, "read");
  assert.equal(mac.source, "ioaccelerator");
  assert.equal(mac.name, "Apple M2");
  assert.equal(mac.utilPercent, 16);
  assert.equal(mac.tempC, null);
  assert.equal(mac.powerWatts, null);
  assert.equal(mac.memoryTotalBytes, null);
  assert.equal(G.gpuLine(mac), "GPU Apple M2 · unread · 16% · 542 MiB/unread · unread");
  assert.equal(linux.status, "read");
  assert.equal(linux.source, "nvidia-smi");
  assert.equal(linux.tempC, 62);
  assert.equal(linux.utilPercent, 14);
  assert.equal(G.gpuLine(linux), VALID_LINE);
  const amd = G.sampleFromProbe(
    { amdgpuCsv: "amdgpu 1002:73BF, [N/A], 37, 2048, 8192, [N/A]" },
    { platform: "linux", nowMs: NOW },
  );
  assert.equal(amd.status, "read");
  assert.equal(amd.source, "amdgpu");
  assert.equal(amd.utilPercent, 37);
  assert.equal(amd.tempC, null);
  assert.equal(amd.powerWatts, null);
  assert.equal(amd.memoryUsedBytes, 2048 * 1024 * 1024);
  assert.equal(G.gpuLine(amd), "GPU amdgpu 1002:73BF · unread · 37% · 2 GiB/8 GiB · unread");
  const preferNvidia = G.sampleFromProbe(
    {
      nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5",
      amdgpuCsv: "amdgpu 1002:73BF, [N/A], 37, 2048, 8192, [N/A]",
    },
    { platform: "linux", nowMs: NOW },
  );
  assert.equal(preferNvidia.source, "nvidia-smi");
  assert.equal(preferNvidia.utilPercent, 14);
  assert.equal(other.status, "unsupported");
  assert.equal(other.tempC, null);
  assert.equal(G.gpuLine(other), "GPU unread · unsupported");
  assert.doesNotMatch(G.gpuLine(other), /62|14%|0%/);
  const second = G.sampleFromProbe(
    { nvidiaCsv: "Apple M2, [N/A], 40, 542, [N/A], [N/A]" },
    { platform: "darwin", nowMs: NOW + 1000 },
  );
  const history = G.remember(G.remember([], mac, NOW), second, NOW + 1000);
  assert.equal(history.length, 2);
  assert.equal(G.sparkline(history, second, NOW + 1000).empty, false);
});

test("a valid nvidia reading keeps real zeros and skips a second GPU", () => {
  const sample = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5\n", engines: null, adapterMemory: null },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(sample.status, "read");
  assert.equal(sample.source, "nvidia-smi");
  assert.equal(sample.tempC, 62);
  assert.equal(sample.utilPercent, 14);
  assert.equal(sample.powerWatts, 48.5);
  assert.equal(sample.memoryUsedBytes, 3200 * 1024 * 1024);
  assert.equal(sample.memoryTotalBytes, 12288 * 1024 * 1024);
  assert.equal(G.gpuLine(sample), VALID_LINE);
  assert.equal(G.ink(sample), "#9a9288");

  const idle = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 40, 0, 0, 8192, 5" },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(idle.utilPercent, 0);
  assert.equal(idle.memoryUsedBytes, 0);
  assert.equal(G.gpuLine(idle), "GPU NVIDIA GeForce RTX 4070 · 40°C · 0% · 0 MiB/8 GiB · 5 W");

  const two = G.sampleFromProbe(
    {
      nvidiaCsv: [
        "NVIDIA GeForce RTX 4070, 40, 10, 100, 1024, 20",
        "NVIDIA GeForce RTX 4090, 70, 90, 200, 2048, 80",
      ].join("\n"),
    },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(two.index, 0);
  assert.equal(two.tempC, 40);
  assert.equal(two.utilPercent, 10);
  assert.equal(two.powerWatts, 20);
  assert.doesNotMatch(G.gpuLine(two), /70°C|90%|80 W/);
});

test("missing fields stay unread and are not painted as zero", () => {
  const text = [
    "NVIDIA",
    "NVIDIA GeForce RTX 4070, [N/A], 7, 100, 8192, [Not Supported]",
    "ENDNVIDIA",
    "ENGINE_ABSENT",
    "MEMORY_ABSENT",
    "END",
  ].join("\n");
  const sample = G.sampleFromProbe(probe(text), { platform: "win32", nowMs: NOW });
  assert.equal(sample.status, "read");
  assert.equal(sample.tempC, null);
  assert.equal(sample.powerWatts, null);
  assert.equal(sample.utilPercent, 7);
  assert.equal(G.gpuLine(sample), "GPU NVIDIA GeForce RTX 4070 · unread · 7% · 100 MiB/8 GiB · unread");
  assert.doesNotMatch(G.gpuLine(sample), /0°C|0 W|0%/);

  const absent = G.sampleFromProbe(
    probe(["NVIDIA_ABSENT", "ENGINE_ABSENT", "MEMORY_ABSENT", "END"].join("\n")),
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(absent.status, "unread");
  assert.equal(G.gpuLine(absent), "GPU unread");
  assert.equal(G.ink(absent), "#5c564e");
  assert.equal(absent.utilPercent, null);
  assert.equal(G.gpuLine(G.UNREAD), "GPU unread");
  assert.equal(G.parseSample(null).status, "unread");
});

test("malformed payloads go dark and never become a healthy zero", () => {
  assert.equal(G.parseSample(0).status, "malformed");
  assert.equal(G.parseSample(false).status, "malformed");
  assert.equal(G.parseSample("0").status, "malformed");
  assert.equal(G.gpuLine(G.parseSample(0)), "GPU unread · malformed");
  assert.doesNotMatch(G.gpuLine(G.parseSample(0)), /0%/);
  const badNumber = G.parseSample({
    status: "read",
    platform: "win32",
    utilPercent: "0",
    readAtMs: NOW,
  });
  assert.equal(badNumber.status, "malformed");
  assert.equal(badNumber.utilPercent, null);
  const garbage = G.sampleFromProbe(
    probe("this is not a probe"),
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(probe("this is not a probe").malformed, true);
  assert.equal(garbage.status, "malformed");
  const hot = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 999, no, -1, -5, hot" },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(hot.status, "malformed");
  assert.equal(hot.tempC, null);
  assert.equal(G.gpuLine(hot), "GPU unread · malformed");
});

test("a stale reading is dark even when the old numbers were real", () => {
  const fresh = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "win32", nowMs: NOW },
  );
  assert.equal(G.present(fresh, NOW + G.STALE_MS).status, "read");
  const stale = G.present(fresh, NOW + G.STALE_MS + 1);
  assert.equal(stale.status, "stale");
  assert.equal(stale.tempC, null);
  assert.equal(stale.utilPercent, null);
  assert.equal(G.gpuLine(stale), "GPU unread · stale");
  assert.doesNotMatch(G.gpuLine(stale), /62|14%/);
  const future = G.present(fresh, NOW - 6000);
  assert.equal(future.status, "malformed");
});

test("performance counters use the busiest 3D engine, not a sum", () => {
  const text = [
    "NVIDIA_ABSENT",
    "ENGINE",
    "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t60",
    "pid_2_luid_0x1_0x2_phys_0_eng_1_engtype_3D\t60",
    "pid_1_luid_0x1_0x2_phys_0_eng_2_engtype_Copy\t5",
    "pid_9_luid_0x1_0x2_phys_1_eng_0_engtype_3D\t10",
    "ENDENGINE",
    "MEMORY",
    "luid_0x1_0x2_phys_0\t1073741824\t8589934592",
    "ENDMEMORY",
    "END",
  ].join("\n");
  const sample = G.sampleFromProbe(probe(text), { platform: "win32", nowMs: NOW });
  assert.equal(sample.status, "read");
  assert.equal(sample.source, "pdh");
  assert.equal(sample.index, 0);
  assert.equal(sample.utilPercent, 60);
  assert.equal(sample.memoryUsedBytes, 1073741824);
  assert.equal(sample.memoryTotalBytes, 8589934592);
  assert.equal(sample.tempC, null);
  assert.equal(sample.powerWatts, null);
  assert.equal(G.gpuLine(sample), "GPU unread · unread · 60% · 1 GiB/8 GiB · unread");
  assert.doesNotMatch(G.gpuLine(sample), /120|125|10%/);
});

test("one NVIDIA GPU may fill only its blank fields from the one counter row", () => {
  const text = [
    "NVIDIA",
    "NVIDIA GeForce RTX 4070, 62, [N/A], [N/A], [N/A], [N/A]",
    "ENDNVIDIA",
    "ENGINE",
    "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t11",
    "ENDENGINE",
    "MEMORY",
    "luid_0x1_0x2_phys_0\t1048576\t8589934592",
    "ENDMEMORY",
    "END",
  ].join("\n");
  const sample = G.sampleFromProbe(probe(text), { platform: "win32", nowMs: NOW });
  assert.equal(sample.source, "nvidia-smi+pdh");
  assert.equal(sample.tempC, 62);
  assert.equal(sample.utilPercent, 11);
  assert.equal(sample.memoryUsedBytes, 1048576);
  assert.equal(sample.powerWatts, null);
});

function at(util, when) {
  return G.sampleFromProbe(
    { nvidiaCsv: `NVIDIA GeForce RTX 4070, 62, ${util}, 3200, 12288, 48.5` },
    { platform: "win32", nowMs: when },
  );
}

const TRAIL = "M1 11.3 L71 8.2";

test("a sparkline grows only from fresh read samples", () => {
  const first = at(14, NOW);
  let history = G.remember(G.emptyHistory(), first, NOW);
  assert.equal(history.length, 1);
  assert.equal(history[0].utilPercent, 14);
  let spark = G.sparkline(history, first, NOW);
  assert.equal(spark.empty, true);
  assert.equal(spark.path, "");
  assert.equal(spark.coords.length, 0);
  assert.equal(spark.ink, G.UNREAD_INK);
  assert.equal(spark.history.length, 1);

  const second = at(40, NOW + 1000);
  history = G.remember(history, second, NOW + 1000);
  assert.equal(history.length, 2);
  assert.equal(history[1].utilPercent, 40);
  spark = G.sparkline(history, second, NOW + 1000);
  assert.equal(spark.empty, false);
  assert.equal(spark.path, TRAIL);
  assert.equal(spark.ink, G.READ_INK);
  assert.equal(spark.points.length, 2);
  assert.equal(spark.history.length, 2);
  assert.equal(spark.coords.length, 2);

  const lied = { ...second, history: [{ readAtMs: NOW, utilPercent: 100 }, { readAtMs: NOW + 1, utilPercent: 1 }] };
  const once = G.remember([], lied, NOW + 1000);
  assert.equal(once.length, 1);
  assert.equal(once[0].utilPercent, 40);
  assert.equal(G.remember(history, second, NOW + 1000).length, 2);

  const idleA = at(0, NOW);
  const idleB = at(0, NOW + 1000);
  const idleHistory = G.remember(G.remember([], idleA, NOW), idleB, NOW + 1000);
  const idleSpark = G.sparkline(idleHistory, idleB, NOW + 1000);
  assert.equal(idleSpark.path, "M1 13 L71 13");
  assert.equal(idleHistory[0].utilPercent, 0);
});

test("unread, malformed, and unsupported sparklines stay empty", () => {
  const unread = G.sampleFromProbe(
    { nvidiaCsv: null, engines: null, adapterMemory: null },
    { platform: "win32", nowMs: NOW },
  );
  const unreadHistory = G.remember([], unread, NOW);
  const unreadSpark = G.sparkline(unreadHistory, unread, NOW);
  assert.deepEqual(unreadHistory, []);
  assert.equal(unreadSpark.empty, true);
  assert.equal(unreadSpark.path, "");
  assert.deepEqual(unreadSpark.history, []);
  assert.deepEqual(unreadSpark.points, []);
  assert.equal(unreadSpark.ink, G.UNREAD_INK);

  const prior = G.remember(G.remember([], at(14, NOW), NOW), at(40, NOW + 1000), NOW + 1000);
  const held = G.remember(prior, unread, NOW + 2000);
  assert.equal(held.length, 2);
  const hidden = G.sparkline(held, unread, NOW + 2000);
  assert.equal(hidden.path, "");
  assert.deepEqual(hidden.history, []);
  assert.equal(hidden.ink, G.UNREAD_INK);

  const malformed = G.parseSample(0);
  assert.deepEqual(G.remember([], malformed, NOW), []);
  assert.equal(G.sparkline([], malformed, NOW).path, "");
  assert.equal(G.sparkline(prior, malformed, NOW + 2000).empty, true);
  assert.equal(G.sparkline(prior, malformed, NOW + 2000).path, "");

  const mac = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "freebsd", nowMs: NOW },
  );
  assert.equal(mac.status, "unsupported");
  assert.deepEqual(G.remember([], mac, NOW), []);
  const spark = G.sparkline([], mac, NOW);
  assert.equal(spark.empty, true);
  assert.equal(spark.path, "");
  assert.equal(spark.ink, G.UNREAD_INK);
  assert.deepEqual(spark.history, []);
});

test("stale samples clear the sparkline", () => {
  let history = G.remember([], at(14, NOW), NOW);
  history = G.remember(history, at(40, NOW + 1000), NOW + 1000);
  assert.equal(G.sparkline(history, at(40, NOW + 1000), NOW + 1000).path, TRAIL);
  const later = NOW + 1000 + G.STALE_MS + 1;
  const stale = G.present(at(40, NOW + 1000), later);
  assert.equal(stale.status, "stale");
  history = G.remember(history, stale, later);
  assert.deepEqual(history, []);
  const spark = G.sparkline(history, stale, later);
  assert.equal(spark.empty, true);
  assert.equal(spark.path, "");
  assert.deepEqual(spark.history, []);
  assert.deepEqual(spark.coords, []);
  assert.equal(spark.ink, G.UNREAD_INK);
});

test("the probe script never plants a zero, and the HUD stays lockstep", () => {
  assert.match(probeSrc, /nvidia-smi/);
  assert.match(probeSrc, /GPU Engine\(\*\)\\Utilization Percentage/);
  assert.match(probeSrc, /Dedicated Usage/);
  assert.match(probeSrc, /Dedicated Limit/);
  assert.match(probeSrc, /NVIDIA_ABSENT/);
  assert.doesNotMatch(probeSrc, /tempC\s*=\s*0/);
  assert.doesNotMatch(probeSrc, /utilPercent\s*=\s*0/);
  assert.match(htmlSrc, /id="hud-gpu"/);
  assert.match(htmlSrc, /data-gpu="unread"/);
  assert.match(htmlSrc, /id="hud-gpu-spark"/);
  assert.match(htmlSrc, /data-spark="empty"/);
  assert.match(htmlSrc, /GPU unread/);
  assert.match(petSrc, /PetGpu/);
  assert.match(petSrc, /hudGpu/);
  assert.match(petSrc, /remember/);
  assert.match(petSrc, /sparkline/);
  assert.match(styleSrc, /#hud-gpu\[data-gpu="read"\]/);
  assert.match(styleSrc, /#5c564e/);
  assert.match(styleSrc, /\.gpu-spark\[data-spark="empty"\]/);
  assert.doesNotMatch(styleSrc, /#hud-gpu\[data-gpu="read"\][\s\S]*#8fa08a/);
  assert.doesNotMatch(styleSrc, /\.gpu-spark[\s\S]{0,400}#8fa08a/);
  assert.match(preloadSrc, /onGpu/);
  assert.match(mainSrc, /gpu-sense/);
  const macProbe = readFileSync(join(__dirname, "..", "gpu-probe-mac.sh"), "utf8");
  const webGpu = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "gpu.ts"), "utf8");
  const cardSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "keeper-card.tsx"), "utf8");
  const pySrc = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "gpu.py"), "utf8");
  const appSrc = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "app.py"), "utf8");
  assert.match(macProbe, /IOAccelerator/);
  assert.doesNotMatch(macProbe, /powermetrics|sudo/);
  const linuxProbe = readFileSync(join(__dirname, "..", "gpu-probe.sh"), "utf8");
  assert.match(linuxProbe, /gpu_busy_percent/);
  assert.match(linuxProbe, /mem_info_vram_total/);
  assert.doesNotMatch(linuxProbe, /mem_busy_percent|mem_info_gtt|temp1_input|intel_gpu_top|busy_ns/);
  assert.match(webGpu, /ioaccelerator/);
  assert.match(webGpu, /amdgpu/);
  assert.match(webGpu, /STALE_MS = 20000/);
  assert.match(webGpu, /export function remember/);
  assert.match(webGpu, /export function sparkline/);
  assert.match(cardSrc, /keeper-gpu/);
  assert.match(cardSrc, /data-gpu=/);
  assert.match(cardSrc, /sparkline\(\[\], UNREAD_GPU, 0\)/);
  assert.match(cardSrc, /data-spark=/);
  assert.doesNotMatch(cardSrc, /M1 11\.3/);
  assert.match(pySrc, /ioaccelerator/);
  assert.match(pySrc, /amdgpu/);
  assert.match(pySrc, /STALE_MS = 20000/);
  assert.match(pySrc, /def remember/);
  assert.match(pySrc, /def sparkline/);
  assert.match(appSrc, /gpu_spark/);
  assert.match(appSrc, /sparkline/);
  assert.match(VALID_LINE, /48\.5 W/);
});
