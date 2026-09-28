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

module.exports = { PREFIX, harnessDir, pidAlive, staleHarnessDirs, pruneStale };
