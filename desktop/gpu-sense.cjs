/** Windows-only GPU probe. Mac and Linux return unsupported and do not spawn. */
const { spawn } = require("child_process");
const path = require("path");
const Gpu = require("./renderer/gpu.js");

const PROBE_SCRIPT = path.join(__dirname, "gpu-probe.ps1");
const TIMEOUT_MS = 8000;

function runProbe(opts) {
  const spawnFn = (opts && opts.spawn) || spawn;
  const timeoutMs = (opts && opts.timeoutMs) || TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawnFn(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", PROBE_SCRIPT],
        { windowsHide: true },
      );
    } catch (err) {
      reject(err);
      return;
    }
    if (!child || !child.stdout) {
      reject(new Error("gpu probe has no stdout"));
      return;
    }
    let out = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        child.kill();
      } catch {
        /* already gone */
      }
      reject(new Error("gpu probe timeout"));
    }, timeoutMs);
    const finish = (err, text) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(text);
    };
    child.stdout.setEncoding ? child.stdout.setEncoding("utf8") : null;
    child.stdout.on("data", (chunk) => {
      out += String(chunk);
    });
    if (child.stderr && child.stderr.on) child.stderr.on("data", () => {});
    child.on("error", (err) => finish(err));
    child.on("exit", (code) => {
      if (!out.trim()) finish(new Error(`gpu probe exit ${code}`));
      else finish(null, out);
    });
  });
}

function read(opts) {
  const platform = opts && opts.platform;
  const nowMs = opts && typeof opts.nowMs === "number" ? opts.nowMs : Date.now();
  if (!Gpu.sensesOn(platform)) {
    return Promise.resolve(Gpu.present(Gpu.parseSample({
      status: "unsupported",
      platform: platform || null,
      readAtMs: nowMs,
    }), nowMs));
  }
  return runProbe(opts)
    .then((text) => {
      const parsed = Gpu.parseProbeText(text);
      if (parsed.malformed) {
        return Gpu.parseSample({ status: "malformed", platform, readAtMs: nowMs });
      }
      return Gpu.sampleFromProbe(parsed, { platform, nowMs });
    })
    .catch(() => Gpu.parseSample({ status: "unread", platform, reason: "probe-failed", readAtMs: nowMs }));
}

module.exports = { read, PROBE_SCRIPT, TIMEOUT_MS };
