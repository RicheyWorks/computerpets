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

test("Windows senses; Mac and Linux name the later door and do not invent numbers", () => {
  assert.equal(G.sensesOn("win32"), true);
  assert.equal(G.sensesOn("Windows"), true);
  assert.equal(G.laterDoor("win32"), null);
  assert.equal(G.isMac("darwin"), true);
  assert.equal(G.isLinux("linux"), true);
  assert.equal(G.laterDoor("darwin"), "mac-linux-gpu-sense");
  assert.equal(G.laterDoor("linux"), "mac-linux-gpu-sense");
  assert.equal(G.STALE_MS, 20000);
  const mac = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "darwin", nowMs: NOW },
  );
  const linux = G.sampleFromProbe(
    { nvidiaCsv: "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5" },
    { platform: "linux", nowMs: NOW },
  );
  assert.equal(mac.status, "unsupported");
  assert.equal(linux.status, "unsupported");
  assert.equal(G.gpuLine(mac), "GPU unread · mac-linux-gpu-sense");
  assert.equal(G.gpuLine(linux), "GPU unread · mac-linux-gpu-sense");
  assert.equal(mac.tempC, null);
  assert.equal(linux.utilPercent, null);
  assert.doesNotMatch(G.gpuLine(mac), /62|14%|0%/);
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
  assert.match(htmlSrc, /GPU unread/);
  assert.match(petSrc, /PetGpu/);
  assert.match(petSrc, /hudGpu/);
  assert.match(styleSrc, /#hud-gpu\[data-gpu="read"\]/);
  assert.match(styleSrc, /#5c564e/);
  assert.doesNotMatch(styleSrc, /#hud-gpu\[data-gpu="read"\][\s\S]*#8fa08a/);
  assert.match(preloadSrc, /onGpu/);
  assert.match(mainSrc, /gpu-sense/);
  const webGpu = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "gpu.ts"), "utf8");
  const cardSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "keeper-card.tsx"), "utf8");
  const pySrc = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "gpu.py"), "utf8");
  assert.match(webGpu, /mac-linux-gpu-sense/);
  assert.match(webGpu, /STALE_MS = 20000/);
  assert.match(cardSrc, /keeper-gpu/);
  assert.match(cardSrc, /data-gpu=/);
  assert.match(pySrc, /mac-linux-gpu-sense/);
  assert.match(pySrc, /STALE_MS = 20000/);
  assert.match(VALID_LINE, /48\.5 W/);
});
