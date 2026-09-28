"use strict";
// GUI harness temp folders: each real-window run used to leave os.tmpdir()/computerpets-gui-harness-<pid> behind
// (four, 8.3 MB, on the dev machine). The next run now clears the ones whose process is gone.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const HarnessData = require("./gui-harness-data.cjs");

test("only exact harness folders of finished runs are removed", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cp-ghd-"));
  try {
    for (const d of ["computerpets-gui-harness-111", "computerpets-gui-harness-222", "computerpets-gui-harness-333", "computerpets-gui-harness-x1", "other-444"]) {
      fs.mkdirSync(path.join(tmp, d));
      fs.writeFileSync(path.join(tmp, d, "Preferences"), "{}");
    }
    fs.writeFileSync(path.join(tmp, "computerpets-gui-harness-555"), "a file, not a folder");
    const alive = (/** @type {number} */ pid) => pid === 222;
    const gone = HarnessData.pruneStale(fs, path, tmp, 333, alive);
    assert.deepEqual(gone.sort(), ["computerpets-gui-harness-111"]);
    assert.deepEqual(fs.readdirSync(tmp).sort(), ["computerpets-gui-harness-222", "computerpets-gui-harness-333", "computerpets-gui-harness-555", "computerpets-gui-harness-x1", "other-444"]);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("this process counts as alive; a missing temp folder is fine", () => {
  assert.equal(HarnessData.pidAlive(process.pid), true);
  assert.deepEqual(HarnessData.pruneStale(fs, path, path.join(os.tmpdir(), "cp-ghd-missing-" + process.pid), 1), []);
  assert.equal(HarnessData.harnessDir("T", 42, path.posix.join), "T/computerpets-gui-harness-42");
});

test("main.cjs prunes before it makes this run's folder", () => {
  const main = fs.readFileSync(path.join(__dirname, "main.cjs"), "utf8");
  const prune = main.indexOf("HarnessData.pruneStale(fs, path, os.tmpdir(), process.pid);");
  const make = main.indexOf("const harnessData = HarnessData.harnessDir(os.tmpdir(), process.pid, path.join);");
  assert.ok(prune > 0 && make > prune);
  assert.ok(!main.includes("`computerpets-gui-harness-${process.pid}`"), "the name lives in one place");
});

test("the helper ships with the app (main.cjs requires it in harness mode)", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
  assert.ok(pkg.build.files.includes("gui-harness-data.cjs"));
  assert.match(pkg.scripts.test, /gui-harness-data\.test\.cjs/);
});
