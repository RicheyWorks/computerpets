// COMPUTERPETS_SETTINGS_DIR: one run's settings in another folder, the supported way (settings-dir.cjs).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const S = require("../settings-dir.cjs");

const DESKTOP = path.join(__dirname, "..");
const main = fs.readFileSync(path.join(DESKTOP, "main.cjs"), "utf8");

test("unset or blank keeps the usual folder; a path is resolved", () => {
  assert.equal(S.settingsDir({}, path.resolve), "");
  assert.equal(S.settingsDir({ COMPUTERPETS_SETTINGS_DIR: "   " }, path.resolve), "");
  assert.equal(S.settingsDir(undefined, path.resolve), "");
  const abs = path.resolve("/tmp/cp-try");
  assert.equal(S.settingsDir({ COMPUTERPETS_SETTINGS_DIR: ` ${abs} ` }, path.resolve), abs);
  assert.equal(S.settingsDir({ COMPUTERPETS_SETTINGS_DIR: "rel/dir" }, (p) => `/base/${p}`), "/base/rel/dir");
});

test("main.cjs moves userData before anything reads it, and the GUI harness keeps its own folder", () => {
  const set = main.indexOf('app.setPath("userData", SETTINGS_DIR);');
  assert.ok(set > 0, "main.cjs sets userData from COMPUTERPETS_SETTINGS_DIR");
  assert.match(main, /const SETTINGS_DIR = GUI_HARNESS \? "" : require\("\.\/settings-dir\.cjs"\)\.settingsDir\(process\.env, path\.resolve\);/);
  // Before the single-instance lock (its lock file lives in userData) and before the first getPath("userData").
  assert.ok(set < main.indexOf("requestSingleInstanceLock"));
  assert.ok(set < main.indexOf('app.getPath("userData")'));
});

test("desktop/README says how to use it", () => {
  const readme = fs.readFileSync(path.join(DESKTOP, "README.md"), "utf8");
  assert.match(readme, /Set `COMPUTERPETS_SETTINGS_DIR` to a full folder path before the start/);
  assert.match(readme, /\$env:COMPUTERPETS_SETTINGS_DIR = /);
});
