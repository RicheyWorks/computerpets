const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { EventEmitter } = require("node:events");
const { mkdtempSync, writeFileSync, chmodSync, rmSync, readFileSync, mkdirSync, symlinkSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { dirname, join } = require("node:path");
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

function writeSysfsFile(dir, rel, body) {
  const file = join(dir, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
}

function amdCard(root, name, { driver = "amdgpu", pci = null, files = {} } = {}) {
  const dev = join(root, name, "device");
  mkdirSync(dev, { recursive: true });
  if (driver) symlinkSync(driver, join(dev, "driver"));
  if (pci) writeFileSync(join(dev, "uevent"), `DRIVER=amdgpu\nPCI_ID=${pci}\nPCI_SLOT_NAME=0000:03:00.0\n`);
  Object.entries(files).forEach(([rel, body]) => writeSysfsFile(dev, rel, body));
}

function runLinuxProbe(extraEnv) {
  return execFileSync("/bin/sh", [Sense.PROBE_SH], {
    encoding: "utf8",
    timeout: 8000,
    env: { ...process.env, PATH: "/usr/bin:/bin", ...extraEnv },
  });
}

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

test("the Linux probe script names nvidia-smi and amdgpu sysfs and does not invent a zero", () => {
  const text = readFileSync(Sense.PROBE_SH, "utf8");
  assert.match(text, /nvidia-smi/);
  assert.match(text, /gpu_busy_percent/);
  assert.match(text, /mem_info_vram_used/);
  assert.match(text, /mem_info_vram_total/);
  assert.match(text, /NVIDIA_ABSENT/);
  assert.match(text, /NVIDIA_EMPTY/);
  assert.match(text, /AMDGPU_ABSENT/);
  assert.match(text, /AMDGPU_EMPTY/);
  assert.match(text, /INTEL_ABSENT/);
  assert.match(text, /INTEL_EMPTY/);
  assert.match(text, /rc6_residency_ms/);
  assert.match(text, /idle_residency_ms/);
  assert.match(text, /ENGINE_ABSENT/);
  assert.match(text, /MEMORY_ABSENT/);
  assert.match(text, /\/sys\/class\/drm/);
  assert.match(text, /hwmon/);
  assert.match(text, /edge/);
  assert.match(text, /PPT/);
  assert.match(text, /drm-engine-render/);
  assert.match(text, /drm-cycles-rcs/);
  assert.match(text, /drm-total-cycles-rcs/);
  assert.match(text, /\/proc/);
  assert.match(text, /\bsleep\b/);
  assert.doesNotMatch(text, /powermetrics|ioreg |intel_gpu_top|busy_ns|rps_cur_freq|mem_busy_percent|mem_info_gtt|temp1_input|debugfs|perf_event|\/sys\/kernel\/debug/);
  assert.doesNotMatch(text, /tempC\s*=\s*0/);
  assert.doesNotMatch(text, /utilPercent\s*=\s*0/);
  const emptyRoot = mkdtempSync(join(tmpdir(), "gpu-empty-"));
  try {
    const absent = runLinuxProbe({ GPU_SYSFS_ROOT: emptyRoot });
    assert.match(absent, /NVIDIA_ABSENT/);
    assert.match(absent, /AMDGPU_ABSENT/);
    assert.match(absent, /INTEL_ABSENT/);
    assert.match(absent, /ENGINE_ABSENT/);
    assert.match(absent, /MEMORY_ABSENT/);
    assert.match(absent, /\nEND\n?$/);
    assert.doesNotMatch(absent, /[0-9]/);
    assert.doesNotMatch(absent, /^ENGINE$/m);
    assert.doesNotMatch(absent, /^MEMORY$/m);
  } finally {
    rmSync(emptyRoot, { recursive: true, force: true });
  }
  const live = execFileSync("/bin/sh", [Sense.PROBE_SH], { encoding: "utf8", timeout: 8000 });
  assert.match(live, /ENGINE_ABSENT/);
  assert.match(live, /MEMORY_ABSENT/);
  assert.match(live, /\nEND\n?$/);
  assert.doesNotMatch(live, /^ENGINE$/m);
  assert.doesNotMatch(live, /^MEMORY$/m);
});

test("Linux amdgpu sysfs prints the shared line and ignores Intel and decoys", async () => {
  const root = mkdtempSync(join(tmpdir(), "gpu-amd-"));
  const bin = mkdtempSync(join(tmpdir(), "gpu-smi-"));
  try {
    amdCard(root, "card2", {
      pci: "1002:164E",
      files: { gpu_busy_percent: "80\n" },
    });
    amdCard(root, "card10", {
      pci: "1002:73BF",
      files: {
        gpu_busy_percent: "37\n",
        mem_info_vram_used: "2147483648\n",
        mem_info_vram_total: "8589934592\n",
        mem_busy_percent: "50\n",
        mem_info_gtt_used: "111111111\n",
        mem_info_gtt_total: "222222222\n",
        "hwmon/hwmon0/temp1_input": "45000\n",
        "hwmon/hwmon0/power1_average": "33000000\n",
      },
    });
    amdCard(root, "card0-DP-1", {
      pci: "1002:FFFF",
      files: { gpu_busy_percent: "99\n" },
    });
    const intel = join(root, "card1");
    mkdirSync(join(intel, "device"), { recursive: true });
    symlinkSync("i915", join(intel, "device", "driver"));
    writeSysfsFile(intel, "device/gpu_busy_percent", "77\n");
    writeSysfsFile(intel, "gt/gt0/rps_cur_freq_mhz", "1400\n");
    writeSysfsFile(intel, "gt/gt0/rps_max_freq_mhz", "2000\n");
    writeSysfsFile(intel, "device/gt/gt0/rps_cur_freq_mhz", "1500\n");
    writeSysfsFile(intel, "engine/rcs0/busy", "999999\n");
    const text = runLinuxProbe({ GPU_SYSFS_ROOT: root });
    assert.match(text, /NVIDIA_ABSENT/);
    assert.match(text, /AMDGPU\n/);
    assert.match(text, /amdgpu 1002:164E, \[N\/A\], 80, \[N\/A\], \[N\/A\], \[N\/A\]/);
    assert.match(text, /amdgpu 1002:73BF, \[N\/A\], 37, 2048, 8192, \[N\/A\]/);
    assert.match(text, /ENDAMDGPU/);
    assert.doesNotMatch(text, /^INTEL/m);
    assert.doesNotMatch(text, /99|77|50|45|1400|1500|2000|999999|111111111|222222222|33000000|45000/);
    const sample = Gpu.sampleFromProbe(Gpu.parseProbeText(text), { platform: "linux", nowMs: NOW });
    assert.equal(sample.status, "read");
    assert.equal(sample.source, "amdgpu");
    assert.equal(sample.name, "amdgpu 1002:73BF");
    assert.equal(sample.utilPercent, 37);
    assert.equal(sample.tempC, null);
    assert.equal(sample.powerWatts, null);
    assert.equal(sample.memoryUsedBytes, 2048 * 1024 * 1024);
    assert.equal(sample.memoryTotalBytes, 8192 * 1024 * 1024);
    assert.equal(Gpu.gpuLine(sample), "GPU amdgpu 1002:73BF · unread · 37% · 2 GiB/8 GiB · unread");

    const tieRoot = mkdtempSync(join(tmpdir(), "gpu-tie-"));
    try {
      amdCard(tieRoot, "card10", { pci: "1002:73BF", files: { gpu_busy_percent: "9\n" } });
      amdCard(tieRoot, "card2", { pci: "1002:164E", files: { gpu_busy_percent: "4\n" } });
      const tie = runLinuxProbe({ GPU_SYSFS_ROOT: tieRoot });
      const tieSample = Gpu.sampleFromProbe(Gpu.parseProbeText(tie), { platform: "linux", nowMs: NOW });
      assert.equal(tieSample.utilPercent, 4);
      assert.equal(tieSample.name, "amdgpu 1002:164E");
      assert.equal(tieSample.index, 0);
    } finally {
      rmSync(tieRoot, { recursive: true, force: true });
    }

    const quiet = mkdtempSync(join(tmpdir(), "gpu-quiet-"));
    try {
      amdCard(quiet, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "0\n",
          mem_info_vram_used: "0\n",
          mem_info_vram_total: "8589934592\n",
        },
      });
      const zeroText = runLinuxProbe({ GPU_SYSFS_ROOT: quiet });
      const zeroSample = Gpu.sampleFromProbe(Gpu.parseProbeText(zeroText), { platform: "linux", nowMs: NOW });
      assert.equal(zeroSample.utilPercent, 0);
      assert.equal(zeroSample.memoryUsedBytes, 0);
      assert.equal(zeroSample.memoryTotalBytes, 8192 * 1024 * 1024);
      assert.equal(zeroSample.tempC, null);
      assert.equal(Gpu.gpuLine(zeroSample), "GPU amdgpu 1002:73BF · unread · 0% · 0 MiB/8 GiB · unread");
    } finally {
      rmSync(quiet, { recursive: true, force: true });
    }

    const tinyRoot = mkdtempSync(join(tmpdir(), "gpu-tiny-"));
    try {
      amdCard(tinyRoot, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "3\n",
          mem_info_vram_used: "1000\n",
          mem_info_vram_total: "8589934592\n",
        },
      });
      const tinyText = runLinuxProbe({ GPU_SYSFS_ROOT: tinyRoot });
      assert.match(tinyText, /amdgpu 1002:73BF, \[N\/A\], 3, \[N\/A\], 8192, \[N\/A\]/);
      assert.doesNotMatch(tinyText, /1000/);
      const tinySample = Gpu.sampleFromProbe(Gpu.parseProbeText(tinyText), { platform: "linux", nowMs: NOW });
      assert.equal(tinySample.utilPercent, 3);
      assert.equal(tinySample.memoryUsedBytes, null);
      assert.equal(tinySample.memoryTotalBytes, 8192 * 1024 * 1024);
      assert.doesNotMatch(Gpu.gpuLine(tinySample), /0 MiB/);
    } finally {
      rmSync(tinyRoot, { recursive: true, force: true });
    }

    const edge = mkdtempSync(join(tmpdir(), "gpu-edge-"));
    try {
      amdCard(edge, "card0", {
        files: { mem_info_vram_used: "524287\n", mem_info_vram_total: "1048576\n" },
      });
      const under = runLinuxProbe({ GPU_SYSFS_ROOT: edge });
      assert.match(under, /amdgpu, \[N\/A\], \[N\/A\], \[N\/A\], 1, \[N\/A\]/);
      assert.doesNotMatch(under, /524287/);
      amdCard(edge, "card4", {
        pci: "1002:164E",
        files: {
          gpu_busy_percent: "101\n",
          mem_info_vram_used: "999999999999\n",
          mem_info_vram_total: "1048576\n",
        },
      });
      const bad = runLinuxProbe({ GPU_SYSFS_ROOT: edge });
      assert.doesNotMatch(bad, /101|999999999999/);
    } finally {
      rmSync(edge, { recursive: true, force: true });
    }

    const closed = mkdtempSync(join(tmpdir(), "gpu-closed-"));
    try {
      amdCard(closed, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "Operation not supported\n",
          mem_info_vram_total: "0\n",
          mem_info_vram_used: "0\n",
          mem_busy_percent: "50\n",
        },
      });
      const empty = runLinuxProbe({ GPU_SYSFS_ROOT: closed });
      assert.match(empty, /AMDGPU_EMPTY/);
      assert.doesNotMatch(empty, /[0-9]|Operation/);
      const emptySample = Gpu.sampleFromProbe(Gpu.parseProbeText(empty), { platform: "linux", nowMs: NOW });
      assert.equal(emptySample.status, "unread");
      assert.equal(emptySample.utilPercent, null);
      assert.doesNotMatch(Gpu.gpuLine(emptySample), /0%/);
      const blocked = join(closed, "card0", "device", "gpu_busy_percent");
      rmSync(blocked);
      mkdirSync(blocked);
      writeFileSync(join(closed, "card0", "device", "mem_info_vram_total"), "8589934592\n");
      writeFileSync(join(closed, "card0", "device", "mem_info_vram_used"), "2147483648\n");
      const noUtil = runLinuxProbe({ GPU_SYSFS_ROOT: closed });
      assert.match(noUtil, /amdgpu 1002:73BF, \[N\/A\], \[N\/A\], 2048, 8192, \[N\/A\]/);
      assert.doesNotMatch(noUtil, /, 12,|, 0,/);
    } finally {
      rmSync(closed, { recursive: true, force: true });
    }

    writeFileSync(join(bin, "nvidia-smi"), "#!/bin/sh\nprintf '%s\\n' 'NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5'\nexit 0\n");
    chmodSync(join(bin, "nvidia-smi"), 0o755);
    const nvidia = runLinuxProbe({ GPU_SYSFS_ROOT: root, PATH: `${bin}:/usr/bin:/bin` });
    assert.match(nvidia, /ENDNVIDIA/);
    assert.doesNotMatch(nvidia, /AMDGPU|INTEL|73BF|37,/);
    const nvidiaSample = await Sense.read({
      platform: "linux",
      nowMs: NOW,
      spawn: fakeSpawn(nvidia),
    });
    assert.equal(nvidiaSample.source, "nvidia-smi");
    assert.equal(nvidiaSample.utilPercent, 14);
    assert.equal(nvidiaSample.tempC, 62);

    writeFileSync(join(bin, "nvidia-smi"), "#!/bin/sh\nexit 0\n");
    const afterEmpty = runLinuxProbe({ GPU_SYSFS_ROOT: root, PATH: `${bin}:/usr/bin:/bin` });
    assert.match(afterEmpty, /NVIDIA_EMPTY/);
    assert.match(afterEmpty, /amdgpu 1002:73BF, \[N\/A\], 37, 2048, 8192, \[N\/A\]/);
    const fell = Gpu.sampleFromProbe(Gpu.parseProbeText(afterEmpty), { platform: "linux", nowMs: NOW });
    assert.equal(fell.source, "amdgpu");
    assert.equal(fell.utilPercent, 37);
    assert.equal(fell.tempC, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(bin, { recursive: true, force: true });
  }
});

test("Linux amdgpu hwmon copies edge temperature and PPT power and leaves the other channels unread", async () => {
  const root = mkdtempSync(join(tmpdir(), "gpu-hwmon-"));
  try {
    amdCard(root, "card0", {
      pci: "1002:73BF",
      files: {
        gpu_busy_percent: "37\n",
        mem_info_vram_used: "2147483648\n",
        mem_info_vram_total: "8589934592\n",
        "hwmon/hwmon0/temp1_label": "edge\n",
        "hwmon/hwmon0/temp1_input": "45500\n",
        "hwmon/hwmon0/temp2_label": "junction\n",
        "hwmon/hwmon0/temp2_input": "90000\n",
        "hwmon/hwmon0/temp3_label": "mem\n",
        "hwmon/hwmon0/temp3_input": "70000\n",
        "hwmon/hwmon0/power1_label": "PPT\n",
        "hwmon/hwmon0/power1_input": "48500000\n",
        "hwmon/hwmon0/power1_average": "33000000\n",
        "hwmon/hwmon0/power1_cap": "180000000\n",
      },
    });
    const text = runLinuxProbe({ GPU_SYSFS_ROOT: root });
    assert.match(text, /amdgpu 1002:73BF, 45\.5, 37, 2048, 8192, 48\.5/);
    assert.doesNotMatch(text, /90|70|33|180|45500|48500000|33000000|90000|70000|180000000/);
    assert.doesNotMatch(text, /^INTEL/m);
    const sample = Gpu.sampleFromProbe(Gpu.parseProbeText(text), { platform: "linux", nowMs: NOW });
    assert.equal(sample.status, "read");
    assert.equal(sample.source, "amdgpu");
    assert.equal(sample.tempC, 45.5);
    assert.equal(sample.utilPercent, 37);
    assert.equal(sample.powerWatts, 48.5);
    assert.equal(Gpu.gpuLine(sample), "GPU amdgpu 1002:73BF · 45.5°C · 37% · 2 GiB/8 GiB · 48.5 W");

    const averageOnly = mkdtempSync(join(tmpdir(), "gpu-hwmon-avg-"));
    try {
      amdCard(averageOnly, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "12\n",
          "hwmon/hwmon0/temp1_label": "edge\n",
          "hwmon/hwmon0/temp1_input": "45000\n",
          "hwmon/hwmon0/power1_label": "PPT\n",
          "hwmon/hwmon0/power1_average": "33000000\n",
          "hwmon/hwmon0/power1_cap": "180000000\n",
        },
      });
      const avgText = runLinuxProbe({ GPU_SYSFS_ROOT: averageOnly });
      assert.match(avgText, /amdgpu 1002:73BF, 45, 12, \[N\/A\], \[N\/A\], 33/);
      assert.doesNotMatch(avgText, /180|45000|33000000/);
      const avgSample = Gpu.sampleFromProbe(Gpu.parseProbeText(avgText), { platform: "linux", nowMs: NOW });
      assert.equal(avgSample.tempC, 45);
      assert.equal(avgSample.powerWatts, 33);
    } finally {
      rmSync(averageOnly, { recursive: true, force: true });
    }

    const unlabeled = mkdtempSync(join(tmpdir(), "gpu-hwmon-plain-"));
    try {
      amdCard(unlabeled, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "8\n",
          "hwmon/hwmon0/temp1_input": "45000\n",
          "hwmon/hwmon0/power1_average": "33000000\n",
        },
      });
      const plain = runLinuxProbe({ GPU_SYSFS_ROOT: unlabeled });
      assert.match(plain, /amdgpu 1002:73BF, \[N\/A\], 8, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(plain, /45|33|45000|33000000/);
    } finally {
      rmSync(unlabeled, { recursive: true, force: true });
    }

    const split = mkdtempSync(join(tmpdir(), "gpu-hwmon-split-"));
    try {
      amdCard(split, "card0", {
        pci: "1002:164E",
        files: {
          gpu_busy_percent: "4\n",
          "hwmon/hwmon0/power1_label": "slowPPT\n",
          "hwmon/hwmon0/power1_average": "17000000\n",
          "hwmon/hwmon0/power2_label": "fastPPT\n",
          "hwmon/hwmon0/power2_average": "19000000\n",
          "hwmon/hwmon0/temp2_label": "junction\n",
          "hwmon/hwmon0/temp2_input": "88000\n",
        },
      });
      const splitText = runLinuxProbe({ GPU_SYSFS_ROOT: split });
      assert.match(splitText, /amdgpu 1002:164E, \[N\/A\], 4, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(splitText, /17|19|88|17000000|19000000|88000/);
    } finally {
      rmSync(split, { recursive: true, force: true });
    }

    const closed = mkdtempSync(join(tmpdir(), "gpu-hwmon-closed-"));
    try {
      amdCard(closed, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "6\n",
          "hwmon/hwmon0/temp1_label": "edge\n",
          "hwmon/hwmon0/temp1_input": "200000\n",
          "hwmon/hwmon0/power1_label": "PPT\n",
          "hwmon/hwmon0/power1_average": "2500000000\n",
        },
      });
      const hot = runLinuxProbe({ GPU_SYSFS_ROOT: closed });
      assert.match(hot, /amdgpu 1002:73BF, \[N\/A\], 6, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(hot, /200|2500|200000|2500000000/);
      amdCard(closed, "card1", {
        pci: "1002:164E",
        files: {
          "hwmon/hwmon0/temp1_label": "edge\n",
          "hwmon/hwmon0/temp1_input": "0\n",
          "hwmon/hwmon0/power1_label": "PPT\n",
          "hwmon/hwmon0/power1_average": "0\n",
        },
      });
      const zero = runLinuxProbe({ GPU_SYSFS_ROOT: closed });
      assert.match(zero, /amdgpu 1002:164E, 0, \[N\/A\], \[N\/A\], \[N\/A\], 0/);
      const zeroSample = Gpu.sampleFromProbe(Gpu.parseProbeText(zero), { platform: "linux", nowMs: NOW });
      assert.equal(zeroSample.name, "amdgpu 1002:164E");
      assert.equal(zeroSample.tempC, 0);
      assert.equal(zeroSample.powerWatts, 0);
      assert.equal(zeroSample.utilPercent, null);
      assert.equal(Gpu.gpuLine(zeroSample), "GPU amdgpu 1002:164E · 0°C · unread · unread · 0 W");
    } finally {
      rmSync(closed, { recursive: true, force: true });
    }

    const twice = mkdtempSync(join(tmpdir(), "gpu-hwmon-twice-"));
    try {
      amdCard(twice, "card0", {
        pci: "1002:73BF",
        files: {
          gpu_busy_percent: "9\n",
          "hwmon/hwmon0/temp1_label": "edge\n",
          "hwmon/hwmon0/temp1_input": "45000\n",
          "hwmon/hwmon1/temp1_label": "edge\n",
          "hwmon/hwmon1/temp1_input": "46000\n",
          "hwmon/hwmon0/power1_label": "PPT\n",
          "hwmon/hwmon0/power1_average": "33000000\n",
          "hwmon/hwmon1/power1_label": "PPT\n",
          "hwmon/hwmon1/power1_input": "34000000\n",
        },
      });
      const two = runLinuxProbe({ GPU_SYSFS_ROOT: twice });
      assert.match(two, /amdgpu 1002:73BF, \[N\/A\], 9, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(two, /45|46|33|34|45000|46000|33000000|34000000/);
    } finally {
      rmSync(twice, { recursive: true, force: true });
    }

    const onlyHeat = mkdtempSync(join(tmpdir(), "gpu-hwmon-heat-"));
    try {
      amdCard(onlyHeat, "card0", {
        pci: "1002:73BF",
        files: {
          "hwmon/hwmon0/temp1_label": "edge\n",
          "hwmon/hwmon0/temp1_input": "41000\n",
        },
      });
      const intel = join(onlyHeat, "card1", "device");
      mkdirSync(intel, { recursive: true });
      symlinkSync("i915", join(intel, "driver"));
      writeFileSync(join(intel, "uevent"), "PCI_ID=8086:9A49\n");
      writeSysfsFile(intel, "hwmon/hwmon0/temp1_label", "edge\n");
      writeSysfsFile(intel, "hwmon/hwmon0/temp1_input", "61000\n");
      const heat = runLinuxProbe({ GPU_SYSFS_ROOT: onlyHeat });
      assert.match(heat, /amdgpu 1002:73BF, 41, \[N\/A\], \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(heat, /^INTEL/m);
      assert.doesNotMatch(heat, /61|61000|8086/);
    } finally {
      rmSync(onlyHeat, { recursive: true, force: true });
    }

    const linked = mkdtempSync(join(tmpdir(), "gpu-hwmon-link-"));
    try {
      amdCard(linked, "card0", { pci: "1002:73BF", files: { gpu_busy_percent: "11\n" } });
      const sensor = join(linked, "class-hwmon");
      mkdirSync(sensor, { recursive: true });
      writeFileSync(join(sensor, "temp1_label"), "edge\n");
      writeFileSync(join(sensor, "temp1_input"), "42000\n");
      writeFileSync(join(sensor, "power1_label"), "PPT\n");
      writeFileSync(join(sensor, "power1_average"), "21000000\n");
      mkdirSync(join(linked, "card0", "device", "hwmon"), { recursive: true });
      symlinkSync(sensor, join(linked, "card0", "device", "hwmon", "hwmon0"));
      const linkText = runLinuxProbe({ GPU_SYSFS_ROOT: linked });
      assert.match(linkText, /amdgpu 1002:73BF, 42, 11, \[N\/A\], \[N\/A\], 21/);
      assert.doesNotMatch(linkText, /42000|21000000/);
    } finally {
      rmSync(linked, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Linux i915 and xe sysfs stay unread and do not paint a percent or a memory pair", async () => {
  const root = mkdtempSync(join(tmpdir(), "gpu-intel-"));
  try {
    const i915 = join(root, "card0");
    mkdirSync(join(i915, "device"), { recursive: true });
    symlinkSync("i915", join(i915, "device", "driver"));
    writeFileSync(join(i915, "device", "uevent"), "DRIVER=i915\nPCI_ID=8086:9A49\n");
    writeSysfsFile(i915, "gt/gt0/rc6_residency_ms", "812345\n");
    writeSysfsFile(i915, "power/rc6_residency_ms", "812345\n");
    writeSysfsFile(i915, "gt/gt0/rps_act_freq_mhz", "1450\n");
    writeSysfsFile(i915, "gt/gt0/rps_max_freq_mhz", "2100\n");
    writeSysfsFile(i915, "engine/rcs0/busy", "999999999\n");
    writeSysfsFile(i915, "device/gpu_busy_percent", "77\n");
    const xe = join(root, "card2");
    mkdirSync(join(xe, "device"), { recursive: true });
    symlinkSync("../../bus/pci/drivers/xe", join(xe, "device", "driver"));
    writeFileSync(join(xe, "device", "uevent"), "DRIVER=xe\nPCI_ID=8086:E20B\n");
    writeSysfsFile(xe, "device/tile0/gt0/gtidle/name", "gt0-rc\n");
    writeSysfsFile(xe, "device/tile0/gt0/gtidle/idle_residency_ms", "654321\n");
    writeSysfsFile(xe, "device/tile0/gt0/gtidle/idle_status", "gt-c0\n");
    writeSysfsFile(xe, "device/tile0/memory/physical_vram_size_bytes", "17179869184\n");
    writeSysfsFile(xe, "device/tile0/memory/freq0/max_freq", "1200\n");
    writeSysfsFile(xe, "device/tile0/gt1/gtidle/idle_residency_ms", "111111\n");
    const plug = join(root, "card0-DP-1");
    mkdirSync(join(plug, "device"), { recursive: true });
    symlinkSync("i915", join(plug, "device", "driver"));
    writeSysfsFile(plug, "gt/gt0/rc6_residency_ms", "424242\n");
    const text = runLinuxProbe({ GPU_SYSFS_ROOT: root });
    assert.match(text, /NVIDIA_ABSENT/);
    assert.match(text, /AMDGPU_ABSENT/);
    assert.match(text, /INTEL_EMPTY/);
    assert.doesNotMatch(text, /^INTEL$/m);
    assert.doesNotMatch(text, /ENDINTEL/);
    assert.doesNotMatch(text, /8086|9A49|E20B|812345|654321|1450|2100|999999999|17179869184|1200|111111|424242|77|gt-c0/);
    assert.doesNotMatch(text, /, 0,/);
    const sample = Gpu.sampleFromProbe(Gpu.parseProbeText(text), { platform: "linux", nowMs: NOW });
    assert.equal(sample.status, "unread");
    assert.equal(sample.reason, "missing");
    assert.equal(sample.utilPercent, null);
    assert.equal(sample.memoryUsedBytes, null);
    assert.equal(sample.memoryTotalBytes, null);
    assert.equal(sample.tempC, null);
    assert.equal(sample.powerWatts, null);
    assert.equal(Gpu.gpuLine(sample), "GPU unread");
    assert.doesNotMatch(Gpu.gpuLine(sample), /0%/);

    const decoy = mkdtempSync(join(tmpdir(), "gpu-decoy-"));
    try {
      const nouveau = join(decoy, "card0");
      mkdirSync(join(nouveau, "device"), { recursive: true });
      symlinkSync("nouveau", join(nouveau, "device", "driver"));
      writeSysfsFile(nouveau, "gt/gt0/rc6_residency_ms", "555\n");
      const other = runLinuxProbe({ GPU_SYSFS_ROOT: decoy });
      assert.match(other, /INTEL_ABSENT/);
      assert.doesNotMatch(other, /555|INTEL_EMPTY/);
      const otherSample = Gpu.sampleFromProbe(Gpu.parseProbeText(other), { platform: "linux", nowMs: NOW });
      assert.equal(otherSample.status, "unread");
      assert.equal(otherSample.utilPercent, null);
    } finally {
      rmSync(decoy, { recursive: true, force: true });
    }

    const planted = [
      "NVIDIA_ABSENT",
      "AMDGPU_ABSENT",
      "INTEL_EMPTY",
      "i915 8086:9A49, 40, 12, 100, 200, 15",
      "ENGINE_ABSENT",
      "MEMORY_ABSENT",
      "END",
    ].join("\n");
    const plantedSample = Gpu.sampleFromProbe(Gpu.parseProbeText(planted), { platform: "linux", nowMs: NOW });
    assert.equal(plantedSample.status, "unread");
    assert.equal(plantedSample.utilPercent, null);
    assert.doesNotMatch(Gpu.gpuLine(plantedSample), /12%|0%/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Linux DRM fdinfo prints i915 and xe utilization from two reads and fails closed otherwise", () => {
  function card(root, name, driver, pci, slot) {
    const dev = join(root, name, "device");
    mkdirSync(dev, { recursive: true });
    symlinkSync(driver, join(dev, "driver"));
    const lines = [`DRIVER=${driver}`];
    if (pci) lines.push(`PCI_ID=${pci}`);
    if (slot) lines.push(`PCI_SLOT_NAME=${slot}`);
    writeFileSync(join(dev, "uevent"), `${lines.join("\n")}\n`);
  }
  function client(root, pid, fd, body) {
    const file = join(root, String(pid), "fdinfo", String(fd));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, body);
  }
  function i915Body(render, extras = {}) {
    const id = extras.id == null ? 7 : extras.id;
    const cap = extras.cap == null ? 1 : extras.cap;
    const pdev = extras.pdev || "0000:00:02.0";
    return [
      "drm-driver:\ti915",
      `drm-pdev:\t${pdev}`,
      `drm-client-id:\t${id}`,
      `drm-engine-render:\t${render} ns`,
      "drm-engine-copy:\t999 ns",
      `drm-engine-capacity-render:\t${cap}`,
      "drm-total-resident-vram:\t999999999",
      "",
    ].join("\n");
  }
  function xeBody(cycles, total, extras = {}) {
    const id = extras.id == null ? 6 : extras.id;
    const pdev = extras.pdev || "0000:00:02.0";
    return [
      "drm-driver:\txe",
      `drm-pdev:\t${pdev}`,
      `drm-client-id:\t${id}`,
      `drm-cycles-rcs:\t${cycles}`,
      `drm-total-cycles-rcs:\t${total}`,
      "drm-cycles-bcs:\t99999",
      "drm-total-cycles-bcs:\t99999",
      "drm-cycles-rcs0:\t888888",
      "drm-total-cycles-rcs0:\t888888",
      "",
    ].join("\n");
  }
  const root = mkdtempSync(join(tmpdir(), "gpu-fd-"));
  const first = mkdtempSync(join(tmpdir(), "gpu-fd1-"));
  const second = mkdtempSync(join(tmpdir(), "gpu-fd2-"));
  try {
    card(root, "card0", "i915", "8086:9A49", "0000:00:02.0");
    card(root, "card0-DP-1", "i915", "8086:FFFF", "0000:00:02.1");
    writeSysfsFile(root, "card0/gt/gt0/rc6_residency_ms", "812345\n");
    client(first, 10, 3, i915Body(1000, { id: 7 }));
    client(first, 11, 4, i915Body(4000, { id: 8 }));
    client(first, 12, 5, i915Body(50, { id: 3, pdev: "0000:00:03.0" }));
    client(second, 10, 3, i915Body(25001000, { id: 7 }));
    client(second, 11, 4, i915Body(25004000, { id: 8 }));
    client(second, 19, 9, i915Body("900000000000", { id: 99 }));
    const text = runLinuxProbe({
      GPU_SYSFS_ROOT: root,
      GPU_PROC_ROOT: first,
      GPU_FDINFO_ROOT_2: second,
      GPU_FDINFO_INTERVAL_NS: "100000000",
    });
    assert.match(text, /NVIDIA_ABSENT/);
    assert.match(text, /AMDGPU_ABSENT/);
    assert.match(text, /INTEL\n/);
    assert.match(text, /i915 8086:9A49, \[N\/A\], 50, \[N\/A\], \[N\/A\], \[N\/A\]/);
    assert.match(text, /ENDINTEL/);
    assert.doesNotMatch(text, /999999999|900000000000|812345|888888|FFFF|0000:00:03/);
    assert.doesNotMatch(text, /, 0,/);
    const sample = Gpu.sampleFromProbe(Gpu.parseProbeText(text), { platform: "linux", nowMs: NOW });
    assert.equal(sample.status, "read");
    assert.equal(sample.source, "fdinfo");
    assert.equal(sample.name, "i915 8086:9A49");
    assert.equal(sample.utilPercent, 50);
    assert.equal(sample.tempC, null);
    assert.equal(sample.powerWatts, null);
    assert.equal(sample.memoryUsedBytes, null);
    assert.equal(sample.memoryTotalBytes, null);
    assert.equal(Gpu.gpuLine(sample), "GPU i915 8086:9A49 · unread · 50% · unread · unread");

    const xeRoot = mkdtempSync(join(tmpdir(), "gpu-xe-"));
    const xe1 = mkdtempSync(join(tmpdir(), "gpu-xe1-"));
    const xe2 = mkdtempSync(join(tmpdir(), "gpu-xe2-"));
    try {
      card(xeRoot, "card1", "xe", "8086:E20B", "0000:00:02.0");
      client(xe1, 4, 3, xeBody(100, 1000));
      client(xe2, 4, 3, xeBody(400000100, 1000001000));
      const xeText = runLinuxProbe({
        GPU_SYSFS_ROOT: xeRoot,
        GPU_PROC_ROOT: xe1,
        GPU_FDINFO_ROOT_2: xe2,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(xeText, /xe 8086:E20B, \[N\/A\], 40, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(xeText, /888888|99999/);
      const xeSample = Gpu.sampleFromProbe(Gpu.parseProbeText(xeText), { platform: "linux", nowMs: NOW });
      assert.equal(xeSample.source, "fdinfo");
      assert.equal(xeSample.utilPercent, 40);
      assert.equal(xeSample.memoryUsedBytes, null);
      assert.equal(Gpu.gpuLine(xeSample), "GPU xe 8086:E20B · unread · 40% · unread · unread");
      client(xe2, 4, 3, xeBody(100, 50001000));
      const idleXe = runLinuxProbe({
        GPU_SYSFS_ROOT: xeRoot,
        GPU_PROC_ROOT: xe1,
        GPU_FDINFO_ROOT_2: xe2,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(idleXe, /xe 8086:E20B, \[N\/A\], 0, \[N\/A\], \[N\/A\], \[N\/A\]/);
      const idleSample = Gpu.sampleFromProbe(Gpu.parseProbeText(idleXe), { platform: "linux", nowMs: NOW });
      assert.equal(idleSample.utilPercent, 0);
      assert.equal(idleSample.tempC, null);
      assert.equal(idleSample.memoryUsedBytes, null);
    } finally {
      rmSync(xeRoot, { recursive: true, force: true });
      rmSync(xe1, { recursive: true, force: true });
      rmSync(xe2, { recursive: true, force: true });
    }

    const wide1 = mkdtempSync(join(tmpdir(), "gpu-wide1-"));
    const wide2 = mkdtempSync(join(tmpdir(), "gpu-wide2-"));
    try {
      client(wide1, 1, 3, i915Body(0, { cap: 2 }));
      client(wide2, 1, 3, i915Body(100000000, { cap: 2 }));
      const wide = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_ROOT_2: wide2,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(wide, /i915 8086:9A49, \[N\/A\], 50, \[N\/A\], \[N\/A\], \[N\/A\]/);
      client(wide2, 1, 3, i915Body(200000001, { cap: 1 }));
      client(wide1, 1, 3, i915Body(0, { cap: 1 }));
      const over = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_ROOT_2: wide2,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(over, /INTEL_EMPTY/);
      assert.doesNotMatch(over, /ENDINTEL|100%|, 100,/);
      client(wide2, 1, 3, i915Body(10));
      const rewind = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide2,
        GPU_FDINFO_ROOT_2: wide1,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(rewind, /INTEL_EMPTY/);
      assert.doesNotMatch(rewind, /ENDINTEL/);
      const zeroGap = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_ROOT_2: wide2,
        GPU_FDINFO_INTERVAL_NS: "0",
      });
      assert.match(zeroGap, /INTEL_EMPTY/);
      assert.doesNotMatch(zeroGap, /ENDINTEL/);
      client(wide1, 1, 3, "drm-driver:\ti915\ndrm-pdev:\t0000:00:02.0\ndrm-client-id:\t7\ndrm-engine-copy:\t10 ns\n");
      client(wide2, 1, 3, "drm-driver:\ti915\ndrm-pdev:\t0000:00:02.0\ndrm-client-id:\t7\ndrm-engine-copy:\t90 ns\n");
      const missing = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_ROOT_2: wide2,
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      assert.match(missing, /INTEL_EMPTY/);
      assert.doesNotMatch(missing, /, 0,|ENDINTEL/);
      const started = Date.now();
      const fast = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_INTERVAL_MS: "0",
      });
      assert.ok(Date.now() - started < 500);
      assert.match(fast, /INTEL_EMPTY/);
      client(wide1, 1, 3, i915Body("00000000000000000042"));
      const slept = Date.now();
      const live = runLinuxProbe({
        GPU_SYSFS_ROOT: root,
        GPU_PROC_ROOT: wide1,
        GPU_FDINFO_INTERVAL_MS: "40",
        GPU_FDINFO_INTERVAL_NS: "100000000",
      });
      const elapsed = Date.now() - slept;
      assert.ok(elapsed >= 30);
      assert.ok(elapsed < 2500);
      assert.match(live, /i915 8086:9A49, \[N\/A\], 0, \[N\/A\], \[N\/A\], \[N\/A\]/);
      assert.doesNotMatch(live, /999999999|812345/);
      const liveSample = Gpu.sampleFromProbe(Gpu.parseProbeText(live), { platform: "linux", nowMs: NOW });
      assert.equal(liveSample.utilPercent, 0);
      assert.equal(liveSample.memoryUsedBytes, null);
      assert.doesNotMatch(Gpu.gpuLine(liveSample), /0 MiB|0°C|0 W/);
    } finally {
      rmSync(wide1, { recursive: true, force: true });
      rmSync(wide2, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
  }
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
