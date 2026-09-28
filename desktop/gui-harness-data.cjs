"use strict";
// Throwaway userData for the real-window GUI harness (COMPUTERPETS_GUI_HARNESS=1). Each run gets its own folder in the
// temp directory; Chromium holds it open until the app exits, so a run cannot remove its own. The next run removes
// the folders of earlier runs whose process is gone, so at most one is ever left behind.
const PREFIX = "computerpets-gui-harness-";
const NAME = /^computerpets-gui-harness-(\d+)$/;

/** @param {string} tmp @param {number} pid @param {(...parts: string[]) => string} join */
function harnessDir(tmp, pid, join) {
  return join(tmp, `${PREFIX}${pid}`);
}

/** @param {number} pid */
function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return /** @type {{ code?: string }} */ (e).code === "EPERM";
  }
}

/**
 * Names of earlier harness folders that are safe to remove: exact harness names, directories, not this run, process gone.
 * @param {{ name: string, isDirectory: () => boolean }[]} entries @param {number} selfPid @param {(pid: number) => boolean} alive
 */
function staleHarnessDirs(entries, selfPid, alive) {
  const out = [];
  for (const entry of entries) {
    const m = NAME.exec(entry.name);
    if (!m || !entry.isDirectory()) continue;
    const pid = Number(m[1]);
    if (pid === selfPid || alive(pid)) continue;
    out.push(entry.name);
  }
  return out;
}

/**
 * @param {{ readdirSync: Function, rmSync: Function }} fs @param {{ join: (...parts: string[]) => string }} path
 * @param {string} tmp @param {number} selfPid @param {(pid: number) => boolean} [alive]
 * @returns {string[]} the folder names removed
 */
function pruneStale(fs, path, tmp, selfPid, alive = pidAlive) {
  /** @type {{ name: string, isDirectory: () => boolean }[]} */
  let entries = [];
  try {
    entries = fs.readdirSync(tmp, { withFileTypes: true });
  } catch {
    return [];
  }
  const gone = [];
  for (const name of staleHarnessDirs(entries, selfPid, alive)) {
    try {
      fs.rmSync(path.join(tmp, name), { recursive: true, force: true, maxRetries: 2 });
      gone.push(name);
    } catch {
      // Still locked (or not ours to remove): leave it for a later run.
    }
  }
  return gone;
}

/**
 * End of a run: a passing run removes its own folder; a failing run keeps it for debugging. Chromium may still hold
 * a file for a moment at quit, so a folder that will not go yet is left for the next run's pruneStale.
 * @param {{ rmSync: Function, existsSync: Function }} fs @param {string} dir @param {boolean} ok
 * @returns {{ dir: string, removed: boolean, kept: boolean, error?: string }}
 */
function finishRun(fs, dir, ok) {
  if (!dir || !NAME.test(dir.split(/[\\/]/).pop() || "")) return { dir, removed: false, kept: true, error: "not a harness folder" };
  if (!ok) return { dir, removed: false, kept: true };
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  } catch (e) {
    return { dir, removed: false, kept: false, error: String(/** @type {{ code?: string }} */ (e).code || e) };
  }
  const gone = !fs.existsSync(dir);
  return gone ? { dir, removed: true, kept: false } : { dir, removed: false, kept: false, error: "still there" };
}

/**
 * The code a small helper runs after the app has exited (Chromium holds the folder until then): wait for the app's
 * process to go (at most about 20 s), then remove the folder. Only ever a harness folder; inline, no script file.
 */
const AFTER_EXIT_CODE = [
  "const fs = require('fs'); const path = require('path');",
  "const dir = process.env.CP_HARNESS_DIR || ''; const pid = Number(process.env.CP_HARNESS_PID || 0);",
  "if (!/^computerpets-gui-harness-\\d+$/.test(path.basename(dir))) process.exit(2);",
  "const alive = () => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };",
  "let n = 0; const t = setInterval(() => { if (alive() && n++ < 200) return; clearInterval(t);",
  "try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }); } catch (e) { process.exit(1); } }, 100);",
].join("\n");

/**
 * Start the after-exit helper for a passing run whose folder was still in use: the app's own binary run as Node,
 * detached, so it outlives the app. Returns true when the helper started.
 * @param {Function} spawn child_process.spawn @param {string} execPath @param {string} dir @param {number} pid
 */
function removeAfterExit(spawn, execPath, dir, pid) {
  if (!dir || !NAME.test(dir.split(/[\\/]/).pop() || "")) return false;
  try {
    const child = spawn(execPath, ["-e", AFTER_EXIT_CODE], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", CP_HARNESS_DIR: dir, CP_HARNESS_PID: String(pid) },
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}

/** One log line for the end of a run. @param {{ dir: string, removed: boolean, kept: boolean, error?: string, afterExit?: boolean }} r */
function finishWords(r) {
  if (r.removed) return `gui-harness: removed its temp userData ${r.dir}`;
  if (r.kept) return `gui-harness: run failed, kept temp userData for debugging: ${r.dir}`;
  if (r.afterExit) return `gui-harness: temp userData ${r.dir} is in use until the app exits; a helper removes it right after`;
  return `gui-harness: temp userData ${r.dir} is still in use (${r.error}); the next run removes it`;
}

module.exports = { PREFIX, AFTER_EXIT_CODE, harnessDir, pidAlive, staleHarnessDirs, pruneStale, finishRun, removeAfterExit, finishWords };
