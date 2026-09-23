const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { EventEmitter } = require("node:events");
const { test } = require("node:test");
const Sense = require("./gpu-sense.cjs");

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

test("Mac does not spawn and stays mac-gpu-sense", async () => {
  let calls = 0;
  const spawn = () => {
    calls += 1;
    throw new Error("should not spawn");
  };
  const mac = await Sense.read({ platform: "darwin", nowMs: NOW, spawn });
  assert.equal(calls, 0);
  assert.equal(mac.status, "unsupported");
  assert.equal(mac.tempC, null);
  assert.equal(mac.utilPercent, null);
  assert.equal(mac.reason, "mac-gpu-sense");
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
