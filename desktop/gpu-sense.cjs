/** Desktop-local GPU probe. Windows uses PowerShell. Linux uses nvidia-smi, then amdgpu sysfs, then i915/xe DRM fdinfo. Mac uses IOAccelerator. */
const { spawn } = require("child_process");
const path = require("path");
const Gpu = require("./renderer/gpu.js");

const PROBE_PS1 = path.join(__dirname, "gpu-probe.ps1");
const PROBE_SH = path.join(__dirname, "gpu-probe.sh");
const PROBE_MAC = path.join(__dirname, "gpu-probe-mac.sh");
const TIMEOUT_MS = 8000;

function probeSpec(platform) {
  if (platform === "win32" || /^Win/i.test(String(platform || ""))) {
    return {
      command: "powershell.exe",
      args: ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", PROBE_PS1],
    };
  }
  if (Gpu.isLinux(platform)) {
    return { command: "/bin/sh", args: [PROBE_SH] };
  }
  if (Gpu.isMac(platform)) {
    return { command: "/bin/sh", args: [PROBE_MAC] };
  }
  return null;
}

function runProbe(opts) {
  const spawnFn = (opts && opts.spawn) || spawn;
  const timeoutMs = (opts && opts.timeoutMs) || TIMEOUT_MS;
  const spec = (opts && opts.probe) || probeSpec(opts && opts.platform);
  return new Promise((resolve, reject) => {
    if (!spec) {
      reject(new Error("gpu probe has no command"));
      return;
    }
    let child;
    try {
      child = spawnFn(spec.command, spec.args, { windowsHide: true });
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

module.exports = { read, probeSpec, PROBE_PS1, PROBE_SH, PROBE_MAC, PROBE_SCRIPT: PROBE_PS1, TIMEOUT_MS };
