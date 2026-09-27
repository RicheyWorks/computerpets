/** Overlay window gate. The host pet, Sip, Brick, called guests, plants, the visit guest, the desk /demo pet, and the living desk room pet draw on a canvas Chromium composites (ADR 0126, ADR 0127, ADR 0128, ADR 0129). Desk Sip, Brick, called guests, and plants use that same canvas. The day's visitor, the house floor, the hive, and the den blotters use it too (ADR 0130). This file still opens the glass only for hardware gpu_compositing. Not a shader engine, not DirectX 12, and not Vulkan. */
const path = require("path");

const FILE = "gpu-path.json";
const TIMEOUT_MS = 8000;

/** Electron 35 `gpu_compositing` values that mean hardware acceleration. */
const HARDWARE_COMPOSITING = new Set([
  "enabled",
  "enabled_on",
  "enabled_force",
  "enabled_force_on",
  "enabled_readback",
]);

/** Electron 35 values that mean the compositor fell back to software. */
const SOFTWARE_COMPOSITING = new Set(["disabled_software", "unavailable_software"]);

const LABEL = {
  hardware: "Chromium GPU compositor",
  software: "Chromium software compositing (accepted)",
  softwareRefused: "Software compositing. Overlay closed.",
  unread: "Compositor unread. Overlay closed.",
  off: "GPU compositing off. Overlay closed.",
};

function fileOf(dir) {
  if (!dir || typeof dir !== "string") return "";
  return path.join(dir, FILE);
}

function writeExpect(dir, fsImpl, expect) {
  if (expect !== "hardware" && expect !== "software") return false;
  const file = fileOf(dir);
  if (!file || !fsImpl) return false;
  try {
    if (typeof fsImpl.mkdirSync === "function") fsImpl.mkdirSync(dir, { recursive: true });
    fsImpl.writeFileSync(file, JSON.stringify({ expect }) + "\n");
    return true;
  } catch {
    return false;
  }
}

/** Missing file becomes `{ expect: "hardware" }`. A bad file stays hardware and is not rewritten. */
function ensureExpect(dir, fsImpl) {
  const file = fileOf(dir);
  if (!file || !fsImpl) return { expect: "hardware", stored: false };
  let raw;
  try {
    raw = fsImpl.readFileSync(file, "utf8");
  } catch (err) {
    if (err && err.code !== "ENOENT") return { expect: "hardware", stored: false };
    return { expect: "hardware", stored: writeExpect(dir, fsImpl, "hardware") };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { expect: "hardware", stored: false };
  }
  if (!parsed || (parsed.expect !== "hardware" && parsed.expect !== "software")) {
    return { expect: "hardware", stored: false };
  }
  return { expect: parsed.expect, stored: true };
}

function readBool(info, key, snake) {
  const aux = info && info.auxAttributes;
  if (aux && typeof aux[key] === "boolean") return aux[key];
  if (aux && snake && typeof aux[snake] === "boolean") return aux[snake];
  if (info && typeof info[key] === "boolean") return info[key];
  if (info && snake && typeof info[snake] === "boolean") return info[snake];
  return null;
}

function readText(info, key, snake) {
  const aux = info && info.auxAttributes;
  const candidates = [aux && aux[key], aux && snake && aux[snake], info && info[key], info && snake && info[snake]];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return "";
}

/** A software GL string is not the hardware path, even when a feature flag says enabled. */
function softwareGl(renderer) {
  const text = String(renderer || "").toLowerCase();
  if (!text) return false;
  return (
    text.includes("swiftshader") ||
    text.includes("llvmpipe") ||
    text.includes("softpipe") ||
    text.includes("lavapipe") ||
    text.includes("microsoft basic render") ||
    text.includes("software rasterizer") ||
    text.includes("apple software renderer")
  );
}

function compositingToken(featureStatus, gpuInfo) {
  const fromApp = featureStatus && featureStatus.gpu_compositing;
  const nested = gpuInfo && gpuInfo.featureStatus && gpuInfo.featureStatus.gpu_compositing;
  const raw = fromApp || nested || "";
  return String(raw).trim().toLowerCase();
}

function compositorKind(featureStatus, gpuInfo) {
  const compositing = compositingToken(featureStatus, gpuInfo);
  const softwareRendering = readBool(gpuInfo, "softwareRendering", "software_rendering");
  const glRenderer = readText(gpuInfo, "glRenderer", "gl_renderer");
  const glSoftware = softwareGl(glRenderer);
  let kind = "unread";
  let because = "missing";
  if (softwareRendering === true) {
    kind = "software";
    because = "software-rendering";
  } else if (glSoftware) {
    kind = "software";
    because = "gl-renderer";
  } else if (SOFTWARE_COMPOSITING.has(compositing)) {
    kind = "software";
    because = "gpu-compositing";
  } else if (HARDWARE_COMPOSITING.has(compositing)) {
    kind = "hardware";
    because = compositing;
  } else if (compositing) {
    kind = "off";
    because = compositing;
  }
  return { kind, compositing, softwareRendering, glRenderer, because };
}

function decide(expect, kind) {
  const safe = kind || { kind: "unread", because: "missing", compositing: "" };
  const wantHardware = expect !== "software";
  if (safe.kind === "hardware") {
    return {
      open: true,
      path: "hardware",
      reason: "gpu-compositing",
      because: safe.because,
      label: LABEL.hardware,
    };
  }
  if (safe.kind === "software" && !wantHardware) {
    return {
      open: true,
      path: "software",
      reason: "software-accepted",
      because: safe.because,
      label: LABEL.software,
    };
  }
  if (safe.kind === "software") {
    return {
      open: false,
      path: "refused",
      reason: "software-refused",
      because: safe.because,
      label: LABEL.softwareRefused,
    };
  }
  if (safe.kind === "unread") {
    return {
      open: false,
      path: "refused",
      reason: "compositor-unread",
      because: "missing",
      label: LABEL.unread,
    };
  }
  return {
    open: false,
    path: "refused",
    reason: "compositor-off",
    because: safe.because || safe.compositing || "off",
    label: LABEL.off,
  };
}

function readChromiumGpu(app, opts) {
  const timeoutMs = (opts && opts.timeoutMs) || TIMEOUT_MS;
  return new Promise((resolve) => {
    let settled = false;
    let gpuInfo = null;
    const timer = setTimeout(() => finish(statusNow(), gpuInfo), timeoutMs);
    function finish(featureStatus, info) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (app && typeof app.removeListener === "function") app.removeListener("gpu-info-update", onUpdate);
      resolve({ featureStatus: featureStatus || null, gpuInfo: info || null });
    }
    function statusNow() {
      try {
        return (app && app.getGPUFeatureStatus && app.getGPUFeatureStatus()) || null;
      } catch {
        return null;
      }
    }
    function usable(featureStatus, info) {
      if (compositingToken(featureStatus, info)) return true;
      if (readBool(info, "softwareRendering", "software_rendering") === true) return true;
      if (softwareGl(readText(info, "glRenderer", "gl_renderer"))) return true;
      return false;
    }
    function consider() {
      const featureStatus = statusNow();
      if (usable(featureStatus, gpuInfo)) finish(featureStatus, gpuInfo);
    }
    function onUpdate() {
      consider();
    }
    if (app && typeof app.on === "function") app.on("gpu-info-update", onUpdate);
    function ask(kind) {
      try {
        return Promise.resolve(app.getGPUInfo(kind));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    ask("complete").then(
      (info) => {
        gpuInfo = info || null;
        consider();
        if (settled) return;
        ask("basic").then(
          (basic) => {
            gpuInfo = basic || gpuInfo;
            consider();
          },
          () => {}
        );
      },
      () => {
        ask("basic").then(
          (info) => {
            gpuInfo = info || null;
            consider();
          },
          () => {}
        );
      }
    );
  });
}

function gate(app, fsImpl, opts) {
  const dir = app && typeof app.getPath === "function" ? app.getPath("userData") : "";
  const pref = ensureExpect(dir, fsImpl);
  return readChromiumGpu(app, opts).then((snap) => {
    const kind = compositorKind(snap.featureStatus, snap.gpuInfo);
    return { ...decide(pref.expect, kind), expect: pref.expect, stored: pref.stored, kind };
  });
}

module.exports = {
  FILE,
  LABEL,
  HARDWARE_COMPOSITING,
  SOFTWARE_COMPOSITING,
  writeExpect,
  ensureExpect,
  softwareGl,
  compositorKind,
  decide,
  readChromiumGpu,
  gate,
};
