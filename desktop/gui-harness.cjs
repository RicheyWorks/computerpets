/** Spawn Electron overlay GUI smokes for Buffffff --gui. Prints one JSON line. */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

function resolveElectron() {
  const localCli = path.join(__dirname, "node_modules", "electron", "cli.js");
  if (fs.existsSync(localCli)) {
    return { cmd: process.execPath, args: [localCli, "."], cwd: __dirname };
  }
  try {
    const electronPath = require(path.join(__dirname, "node_modules", "electron"));
    if (typeof electronPath === "string" && fs.existsSync(electronPath)) {
      return { cmd: electronPath, args: ["."], cwd: __dirname };
    }
  } catch (_) {
    /* ignore */
  }
  try {
    const electronPath = require("electron");
    if (typeof electronPath === "string" && fs.existsSync(electronPath)) {
      return { cmd: electronPath, args: ["."], cwd: __dirname };
    }
  } catch (_) {
    /* ignore */
  }
  return null;
}

function main() {
  const outFile = path.join(os.tmpdir(), `computerpets-gui-harness-out-${process.pid}.json`);
  try { fs.unlinkSync(outFile); } catch (_) { /* ignore */ }
  const resolved = resolveElectron();
  if (!resolved) {
    process.stdout.write(JSON.stringify({
      ok: false,
      error: "electron not installed (npm install in desktop/)",
      results: {},
    }) + "\n");
    process.exitCode = 2;
    return;
  }
  const env = {
    ...process.env,
    COMPUTERPETS_GUI_HARNESS: "1",
    COMPUTERPETS_GUI_HARNESS_OUT: outFile,
  };
  const child = spawn(resolved.cmd, resolved.args, {
    cwd: resolved.cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += String(chunk); });
  const timer = setTimeout(() => {
    try { child.kill(); } catch (_) { /* ignore */ }
  }, 60000);
  child.on("exit", (code) => {
    clearTimeout(timer);
    let payload = null;
    try {
      const raw = fs.readFileSync(outFile, "utf8").trim();
      payload = JSON.parse(raw.split(/\r?\n/).filter(Boolean).pop());
    } catch (err) {
      payload = {
        ok: false,
        error: `harness result missing (exit=${code}): ${err && err.message}`,
        results: {},
        stderr: stderr.slice(-2000),
      };
    }
    // The app removes its temp userData at quit when the run passed; if Chromium still held it then, finish here
    // (the app has exited). A failed run keeps it for debugging.
    if (payload && payload.userData) {
      const HarnessData = require("./gui-harness-data.cjs");
      const done = fs.existsSync(payload.userData)
        ? HarnessData.finishRun(fs, payload.userData, !!payload.ok)
        : { dir: payload.userData, removed: true, kept: false };
      process.stderr.write(HarnessData.finishWords(done) + "\n");
      payload.userDataKept = done.kept || (!done.removed && fs.existsSync(payload.userData));
    }
    process.stdout.write(JSON.stringify(payload) + "\n");
    process.exitCode = payload && payload.ok ? 0 : 1;
  });
}

main();
