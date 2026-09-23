const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { EventEmitter } = require("node:events");
const { mkdtempSync, writeFileSync, chmodSync, rmSync, readFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");
const Sense = require("./gpu-sense.cjs");
const Gpu = require("./renderer/gpu.js");

const NOW = 1_700_000_000_000;
const VALID = [
  "NVIDIA",
  "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5",
  "ENDNVIDIA",
  "ENGINE_ABSENT",
  "MEMORY_ABSENT",
  "END",
  "",
].join("\n");

function fakeSpawn(stdout, { code = 0, hang = false } = {}) {
  let killed = false;
  const spawn = () => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.kill = () => {
      killed = true;
      child.emit("exit", null);
    };
    if (!hang) {
      setImmediate(() => {
        child.stdout.emit("data", stdout);
        child.emit("exit", code);
      });
    }
    return child;
  };
  spawn.killed = () => killed;
  return spawn;
}

const APPLE_IOREG = [
  "+-o AGXAccelerator  <class AGXAccelerator, id 0x1000002a1, registered, matched, active, busy 0 (1 ms), retain 28>",
  "  | {",
  "  |   \"IOClass\" = \"AGXAccelerator\"",
  "  |   \"model\" = <\"Apple M2\">",
  "  |   \"PerformanceStatistics\" = {\"In use system memory (driver)\"=0,\"Alloc system memory\"=16749051904,\"Tiler Utilization %\"=7,\"recoveryCount\"=0,\"Renderer Utilization %\"=11,\"Device Utilization %\"=16,\"In use system memory\"=568164352}",
  "  | }",
  "",
].join("\n");

function runMacProbe(body, { code = 0, path = null } = {}) {
  const env = { ...process.env };
  let dir = null;
  if (path != null) env.PATH = path;
  else if (body != null) {
    dir = mkdtempSync(join(tmpdir(), "gpu-mac-"));
    const bin = join(dir, "ioreg");
    writeFileSync(bin, `#!/bin/sh\ncat <<'FIXTURE'\n${body}\nFIXTURE\nexit ${code}\n`);
    chmodSync(bin, 0o755);
    env.PATH = `${dir}:${process.env.PATH}`;
  } else env.PATH = "/usr/bin:/bin";
  try {
    return execFileSync("/bin/sh", [Sense.PROBE_MAC], { encoding: "utf8", timeout: 8000, env });
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

test("Mac spawns the IOAccelerator probe and keeps a real reading", async () => {
  const text = runMacProbe(APPLE_IOREG);
  assert.match(text, /^NVIDIA\n/m);
  assert.match(text, /Apple M2, \[N\/A\], 16, 542, \[N\/A\], \[N\/A\]/);
  assert.doesNotMatch(text, /16749051904|15973/);
  assert.match(text, /ENGINE_ABSENT/);
  assert.match(text, /MEMORY_ABSENT/);
  let seen = null;
  const spawn = (command, args) => {
    seen = { command, args };
    return fakeSpawn(text)();
  };
  const sample = await Sense.read({ platform: "darwin", nowMs: NOW, spawn });
  assert.equal(seen.command, "/bin/sh");
  assert.match(seen.args[0], /gpu-probe-mac\.sh$/);
  assert.equal(sample.status, "read");
  assert.equal(sample.source, "ioaccelerator");
  assert.equal(sample.name, "Apple M2");
  assert.equal(sample.utilPercent, 16);
  assert.equal(sample.memoryUsedBytes, 542 * 1024 * 1024);
  assert.equal(sample.memoryTotalBytes, null);
  assert.equal(sample.tempC, null);
  assert.equal(sample.powerWatts, null);
  assert.equal(Gpu.gpuLine(sample), "GPU Apple M2 · unread · 16% · 542 MiB/unread · unread");
  assert.doesNotMatch(Gpu.gpuLine(sample), /0°C|0 W|0%/);
});

test("Mac without ioreg, or with no accepted field, stays unread and is not zero", async () => {
  const absent = runMacProbe(null);
  assert.match(absent, /NVIDIA_ABSENT/);
  assert.doesNotMatch(absent, /[0-9]/);
  const absentSample = await Sense.read({
    platform: "darwin",
    nowMs: NOW,
    spawn: fakeSpawn(absent),
  });
  assert.equal(absentSample.status, "unread");
  assert.equal(absentSample.reason, "missing");
  assert.equal(absentSample.utilPercent, null);
  assert.doesNotMatch(Gpu.gpuLine(absentSample), /0%/);

  const empty = runMacProbe([
    "+-o AGXAccelerator  <class AGXAccelerator, id 0x1, registered>",
    "{",
    "\"PerformanceStatistics\" = {\"Renderer Utilization %\"=11,\"Tiler Utilization %\"=7,\"recoveryCount\"=0,\"Alloc system memory\"=16749051904}",
    "}",
    "",
  ].join("\n"));
  assert.match(empty, /NVIDIA_EMPTY/);
  assert.doesNotMatch(empty, /[0-9]/);
  const emptySample = Gpu.sampleFromProbe(Gpu.parseProbeText(empty), { platform: "darwin", nowMs: NOW });
  assert.equal(emptySample.status, "unread");
  assert.equal(emptySample.utilPercent, null);

  const zero = runMacProbe([
    "+-o AGXAccelerator  <class AGXAccelerator, id 0x1, registered>",
    "{ \"PerformanceStatistics\" = {\"Device Utilization %\"=0,\"In use system memory\"=0} }",
    "",
  ].join("\n"));
  const zeroSample = Gpu.sampleFromProbe(Gpu.parseProbeText(zero), { platform: "darwin", nowMs: NOW });
  assert.equal(zeroSample.utilPercent, 0);
  assert.equal(zeroSample.memoryUsedBytes, 0);
  assert.equal(zeroSample.tempC, null);
  assert.equal(Gpu.gpuLine(zeroSample), "GPU AGXAccelerator · unread · 0% · 0 MiB/unread · unread");

  const tiny = runMacProbe([
    "+-o AGXAccelerator  <class AGXAccelerator, id 0x1, registered>",
    "{ \"PerformanceStatistics\" = {\"Device Utilization %\"=3,\"In use system memory\"=1000} }",
    "",
  ].join("\n"));
  const tinySample = Gpu.sampleFromProbe(Gpu.parseProbeText(tiny), { platform: "darwin", nowMs: NOW });
  assert.equal(tinySample.utilPercent, 3);
  assert.equal(tinySample.memoryUsedBytes, null);
  assert.doesNotMatch(Gpu.gpuLine(tinySample), /0 MiB/);

  const crashed = runMacProbe("nope", { code: 1 });
  assert.match(crashed, /NVIDIA_ABSENT/);
  assert.doesNotMatch(crashed, /[0-9]/);
});

test("the Mac probe names IOAccelerator and does not ask for root", () => {
  const text = readFileSync(Sense.PROBE_MAC, "utf8");
  assert.match(text, /-c IOAccelerator/);
  assert.match(text, /PerformanceStatistics/);
  assert.match(text, /Device Utilization %/);
  assert.match(text, /In use system memory/);
  assert.match(text, /NVIDIA_ABSENT/);
  assert.match(text, /NVIDIA_EMPTY/);
  assert.doesNotMatch(text, /powermetrics|sudo|nvidia-smi|\/sys\/class\/drm/);
});

test("a platform without a probe does not spawn", async () => {
  let calls = 0;
  const sample = await Sense.read({
    platform: "freebsd",
    nowMs: NOW,
    spawn() {
      calls += 1;
      throw new Error("should not spawn");
    },
  });
  assert.equal(calls, 0);
  assert.equal(sample.status, "unsupported");
  assert.equal(sample.reason, "unsupported");
  assert.equal(sample.utilPercent, null);
  assert.equal(Gpu.gpuLine(sample), "GPU unread · unsupported");
});

test("Linux spawns the shell probe and keeps a real nvidia-smi reading", async () => {
  let seen = null;
  const spawn = (command, args) => {
    seen = { command, args };
    return fakeSpawn(VALID)();
  };
  const sample = await Sense.read({ platform: "linux", nowMs: NOW, spawn });
  assert.equal(seen.command, "/bin/sh");
  assert.match(seen.args[0], /gpu-probe\.sh$/);
  assert.equal(sample.status, "read");
  assert.equal(sample.source, "nvidia-smi");
  assert.equal(sample.tempC, 62);
  assert.equal(sample.utilPercent, 14);
  assert.equal(sample.powerWatts, 48.5);
});

test("Linux without nvidia-smi stays unread and is not zero", async () => {
  const absent = ["NVIDIA_ABSENT", "ENGINE_ABSENT", "MEMORY_ABSENT", "END", ""].join("\n");
  const sample = await Sense.read({
    platform: "linux",
    nowMs: NOW,
    spawn: fakeSpawn(absent),
  });
  assert.equal(sample.status, "unread");
  assert.equal(sample.reason, "missing");
  assert.equal(sample.tempC, null);
  assert.equal(sample.utilPercent, null);
  assert.equal(sample.powerWatts, null);
});

test("the Linux probe script names nvidia-smi and does not invent a zero", () => {
  const { readFileSync } = require("node:fs");
  const text = readFileSync(Sense.PROBE_SH, "utf8");
  assert.match(text, /nvidia-smi/);
  assert.match(text, /NVIDIA_ABSENT/);
  assert.match(text, /NVIDIA_EMPTY/);
  assert.match(text, /ENGINE_ABSENT/);
  assert.match(text, /MEMORY_ABSENT/);
  assert.doesNotMatch(text, /\/sys\/class\/drm|powermetrics|ioreg /);
  assert.doesNotMatch(text, /tempC\s*=\s*0/);
  assert.doesNotMatch(text, /utilPercent\s*=\s*0/);
  const live = execFileSync("/bin/sh", [Sense.PROBE_SH], { encoding: "utf8", timeout: 8000 });
  assert.match(live, /ENGINE_ABSENT/);
  assert.match(live, /MEMORY_ABSENT/);
  assert.match(live, /\nEND\n?$/);
  assert.doesNotMatch(live, /^ENGINE$/m);
  assert.doesNotMatch(live, /^MEMORY$/m);
});

test("a Windows probe text becomes a real reading", async () => {
  const sample = await Sense.read({
    platform: "win32",
    nowMs: NOW,
    spawn: fakeSpawn(VALID),
  });
  assert.equal(sample.status, "read");
  assert.equal(sample.tempC, 62);
  assert.equal(sample.utilPercent, 14);
  assert.equal(sample.powerWatts, 48.5);
});

test("a hung or empty probe stays unread and is not zero", async () => {
  const empty = await Sense.read({
    platform: "win32",
    nowMs: NOW,
    spawn: fakeSpawn("", { code: 1 }),
  });
  assert.equal(empty.status, "unread");
  assert.equal(empty.utilPercent, null);
  assert.equal(empty.reason, "probe-failed");

  const hungSpawn = fakeSpawn("", { hang: true });
  const hung = await Sense.read({
    platform: "win32",
    nowMs: NOW,
    timeoutMs: 30,
    spawn: hungSpawn,
  });
  assert.equal(hung.status, "unread");
  assert.equal(hung.tempC, null);
  assert.equal(hungSpawn.killed(), true);
});
