const assert = require("node:assert/strict");
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

test("Mac and Linux do not spawn and stay unsupported", async () => {
  let calls = 0;
  const spawn = () => {
    calls += 1;
    throw new Error("should not spawn");
  };
  const mac = await Sense.read({ platform: "darwin", nowMs: NOW, spawn });
  const linux = await Sense.read({ platform: "linux", nowMs: NOW, spawn });
  assert.equal(calls, 0);
  assert.equal(mac.status, "unsupported");
  assert.equal(linux.status, "unsupported");
  assert.equal(mac.tempC, null);
  assert.equal(linux.utilPercent, null);
  assert.equal(mac.reason, "mac-linux-gpu-sense");
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
