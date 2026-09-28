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
  const make = main.indexOf("fs.mkdirSync(harnessData, { recursive: true });");
  assert.ok(prune > 0 && make > prune);
  assert.ok(!main.includes("`computerpets-gui-harness-${process.pid}`"), "the name lives in one place");
});

test("end of a run: a pass removes its own folder, a failure keeps it and says so", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cp-ghd-end-"));
  try {
    const pass = path.join(tmp, "computerpets-gui-harness-901");
    const fail = path.join(tmp, "computerpets-gui-harness-902");
    const other = path.join(tmp, "not-a-harness-folder");
    for (const d of [pass, fail, other]) {
      fs.mkdirSync(path.join(d, "Local Storage"), { recursive: true });
      fs.writeFileSync(path.join(d, "Local Storage", "x.log"), "x");
    }
    const ok = HarnessData.finishRun(fs, pass, true);
    assert.deepEqual(ok, { dir: pass, removed: true, kept: false });
    assert.equal(fs.existsSync(pass), false);
    assert.equal(HarnessData.finishWords(ok), `gui-harness: removed its temp userData ${pass}`);
    const bad = HarnessData.finishRun(fs, fail, false);
    assert.deepEqual(bad, { dir: fail, removed: false, kept: true });
    assert.equal(fs.existsSync(fail), true);
    assert.equal(HarnessData.finishWords(bad), `gui-harness: run failed, kept temp userData for debugging: ${fail}`);
    assert.equal(HarnessData.finishRun(fs, other, true).removed, false, "never anything but a harness folder");
    assert.equal(fs.existsSync(other), true);
    const busy = HarnessData.finishRun({ rmSync() { const e = new Error("busy"); /** @type {any} */ (e).code = "EBUSY"; throw e; }, existsSync: () => true }, pass, true);
    assert.equal(HarnessData.finishWords(busy), `gui-harness: temp userData ${pass} is still in use (EBUSY); the next run removes it`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("a folder still in use at quit is removed by a detached helper once the app's process has gone", async () => {
  const { spawn, spawnSync } = require("node:child_process");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cp-ghd-after-"));
  try {
    const dir = path.join(tmp, "computerpets-gui-harness-903");
    fs.mkdirSync(path.join(dir, "Network"), { recursive: true });
    fs.writeFileSync(path.join(dir, "Network", "Cookies"), "x");
    // Stand-in for the app: a process that lives half a second.
    const app = spawn(process.execPath, ["-e", "setTimeout(() => {}, 500)"], { stdio: "ignore" });
    assert.equal(HarnessData.removeAfterExit(spawn, process.execPath, dir, app.pid), true);
    await new Promise((r) => setTimeout(r, 200));
    assert.equal(fs.existsSync(dir), true, "not while the app is still running");
    for (let i = 0; i < 60 && fs.existsSync(dir); i += 1) await new Promise((r) => setTimeout(r, 100));
    assert.equal(fs.existsSync(dir), false, "removed right after the app exited");
    // Never anything but a harness folder, even if asked.
    const other = path.join(tmp, "keep-me");
    fs.mkdirSync(other);
    assert.equal(HarnessData.removeAfterExit(spawn, process.execPath, other, 1), false);
    const refused = spawnSync(process.execPath, ["-e", HarnessData.AFTER_EXIT_CODE], { env: { ...process.env, CP_HARNESS_DIR: other, CP_HARNESS_PID: "1" } });
    assert.equal(refused.status, 2);
    assert.equal(fs.existsSync(other), true);
    assert.equal(HarnessData.finishWords({ dir, removed: false, kept: false, error: "EBUSY", afterExit: true }), `gui-harness: temp userData ${dir} is in use until the app exits; a helper removes it right after`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("main.cjs removes it at quit when the last result passed; the runner finishes after the app exits", () => {
  const main = fs.readFileSync(path.join(__dirname, "main.cjs"), "utf8");
  assert.match(main, /app\.on\("quit", \(\) => \{\n\s+const done = HarnessData\.finishRun\(fs, harnessData, guiHarnessOk\);\n\s+const after = !done\.removed && !done\.kept && HarnessData\.removeAfterExit\(require\("child_process"\)\.spawn, process\.execPath, harnessData, process\.pid\);\n\s+process\.stderr\.write\(`\$\{HarnessData\.finishWords\(\{ \.\.\.done, afterExit: after \}\)\}\\n`\);/);
  assert.match(main, /guiHarnessOk = !!\(payload && payload\.ok\);\n\s+if \(payload && GUI_HARNESS_DATA\) payload\.userData = GUI_HARNESS_DATA;/);
  const runner = fs.readFileSync(path.join(__dirname, "gui-harness.cjs"), "utf8");
  assert.match(runner, /HarnessData\.finishRun\(fs, payload\.userData, !!payload\.ok\)/);
  assert.match(runner, /process\.stderr\.write\(HarnessData\.finishWords\(done\) \+ "\\n"\);/);
});

test("the helper ships with the app (main.cjs requires it in harness mode)", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
  assert.ok(pkg.build.files.includes("gui-harness-data.cjs"));
  assert.match(pkg.scripts.test, /gui-harness-data\.test\.cjs/);
});
