const assert = require("node:assert/strict");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");
const GpuPath = require("./gpu-path.cjs");

const ANGLE_NVIDIA =
  "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)";
const ANGLE_METAL = "ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)";
const MESA_LLVM = "AMD Radeon RX 6800 (radeonsi, navi21, LLVM 15.0.7, DRM 3.49, 6.1.0)";

function memFs(files) {
  const store = { ...files };
  return {
    store,
    readFileSync(file) {
      if (!Object.prototype.hasOwnProperty.call(store, file)) {
        const err = new Error("missing");
        err.code = "ENOENT";
        throw err;
      }
      return store[file];
    },
    writeFileSync(file, body) {
      store[file] = body;
    },
    mkdirSync() {},
  };
}

function hardwareInfo(glRenderer) {
  return {
    featureStatus: null,
    auxAttributes: {
      softwareRendering: false,
      glRenderer,
    },
  };
}

test("hardware compositing opens the overlay", () => {
  for (const status of ["enabled", "enabled_on", "enabled_force", "enabled_force_on", "enabled_readback"]) {
    const kind = GpuPath.compositorKind(
      { gpu_compositing: status, webgl: "enabled", vulkan: "disabled_off" },
      hardwareInfo(ANGLE_NVIDIA)
    );
    const verdict = GpuPath.decide("hardware", kind);
    assert.equal(kind.kind, "hardware", status);
    assert.equal(verdict.open, true, status);
    assert.equal(verdict.path, "hardware");
    assert.equal(verdict.label, "Chromium GPU compositor");
    assert.equal(verdict.label.includes("DirectX"), false);
    assert.equal(verdict.label.includes("Vulkan"), false);
  }
});

test("ANGLE Metal and Mesa LLVM stay hardware", () => {
  for (const renderer of [ANGLE_METAL, MESA_LLVM, "Mesa Intel(R) Graphics (ADL GT2)", "virgl"]) {
    const kind = GpuPath.compositorKind({ gpu_compositing: "enabled" }, hardwareInfo(renderer));
    assert.equal(kind.kind, "hardware", renderer);
    assert.equal(GpuPath.decide("hardware", kind).open, true);
  }
});

test("webgl software does not close a hardware compositor", () => {
  const kind = GpuPath.compositorKind(
    { gpu_compositing: "enabled", webgl: "disabled_software", vulkan: "enabled" },
    hardwareInfo(ANGLE_NVIDIA)
  );
  assert.equal(kind.kind, "hardware");
  assert.equal(GpuPath.decide("hardware", kind).open, true);
});

test("software compositing stays closed when hardware is expected", () => {
  for (const status of ["disabled_software", "unavailable_software"]) {
    const kind = GpuPath.compositorKind({ gpu_compositing: status }, hardwareInfo(ANGLE_NVIDIA));
    const verdict = GpuPath.decide("hardware", kind);
    assert.equal(kind.kind, "software", status);
    assert.equal(kind.because, "gpu-compositing");
    assert.equal(verdict.open, false);
    assert.equal(verdict.reason, "software-refused");
    assert.equal(verdict.path, "refused");
  }
});

test("softwareRendering true closes the overlay even when the flag says enabled", () => {
  const kind = GpuPath.compositorKind(
    { gpu_compositing: "enabled" },
    { auxAttributes: { softwareRendering: true, glRenderer: ANGLE_NVIDIA } }
  );
  assert.equal(kind.kind, "software");
  assert.equal(kind.because, "software-rendering");
  assert.equal(GpuPath.decide("hardware", kind).open, false);
});

test("a software GL renderer closes the overlay", () => {
  const renderers = [
    "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)",
    "llvmpipe (LLVM 15.0.7, 256 bits)",
    "softpipe",
    "lavapipe",
    "Microsoft Basic Render Driver",
    "Apple Software Renderer",
    "SGI Software Rasterizer",
  ];
  for (const renderer of renderers) {
    const kind = GpuPath.compositorKind(
      { gpu_compositing: "enabled" },
      { auxAttributes: { softwareRendering: false, glRenderer: renderer } }
    );
    assert.equal(kind.kind, "software", renderer);
    assert.equal(kind.because, "gl-renderer");
    assert.equal(GpuPath.decide("hardware", kind).reason, "software-refused");
  }
});

test("a planted string is not the softwareRendering flag", () => {
  const kind = GpuPath.compositorKind(
    { gpu_compositing: "enabled" },
    { auxAttributes: { softwareRendering: "true", glRenderer: ANGLE_NVIDIA } }
  );
  assert.equal(kind.kind, "hardware");
  assert.equal(kind.softwareRendering, null);
});

test("snake_case aux fields count", () => {
  const kind = GpuPath.compositorKind(null, {
    auxAttributes: { software_rendering: true, gl_renderer: ANGLE_NVIDIA },
  });
  assert.equal(kind.kind, "software");
  assert.equal(kind.because, "software-rendering");
});

test("missing compositor status stays closed", () => {
  const kind = GpuPath.compositorKind(null, null);
  assert.equal(kind.kind, "unread");
  const verdict = GpuPath.decide("hardware", kind);
  assert.equal(verdict.open, false);
  assert.equal(verdict.reason, "compositor-unread");
  const accepted = GpuPath.decide("software", kind);
  assert.equal(accepted.open, false);
  assert.equal(accepted.reason, "compositor-unread");
});

test("compositor off stays closed even when software is accepted", () => {
  for (const status of ["disabled_off", "disabled_off_ok", "unavailable_off", "unavailable_off_ok", "disabled"]) {
    const kind = GpuPath.compositorKind({ gpu_compositing: status }, hardwareInfo(""));
    assert.equal(kind.kind, "off", status);
    assert.equal(GpuPath.decide("hardware", kind).reason, "compositor-off");
    assert.equal(GpuPath.decide("software", kind).open, false);
  }
});

test("an empty GL renderer does not invent a software fallback", () => {
  const kind = GpuPath.compositorKind({ gpu_compositing: "enabled" }, { auxAttributes: { softwareRendering: false } });
  assert.equal(kind.kind, "hardware");
  assert.equal(kind.glRenderer, "");
});

test("accepted software opens and does not claim the GPU compositor", () => {
  const kind = GpuPath.compositorKind({ gpu_compositing: "disabled_software" }, { auxAttributes: { softwareRendering: true } });
  const verdict = GpuPath.decide("software", kind);
  assert.equal(verdict.open, true);
  assert.equal(verdict.path, "software");
  assert.equal(verdict.reason, "software-accepted");
  assert.equal(verdict.label.includes("GPU compositor"), false);
});

test("accepted software still reports hardware when the compositor is hardware", () => {
  const kind = GpuPath.compositorKind({ gpu_compositing: "enabled" }, hardwareInfo(ANGLE_NVIDIA));
  const verdict = GpuPath.decide("software", kind);
  assert.equal(verdict.open, true);
  assert.equal(verdict.path, "hardware");
});

test("a bad expect value stays on the hardware bar", () => {
  const kind = GpuPath.compositorKind({ gpu_compositing: "disabled_software" }, null);
  assert.equal(GpuPath.decide("yes", kind).reason, "software-refused");
  assert.equal(GpuPath.decide("", kind).open, false);
});

test("feature status nested on the GPU info object counts", () => {
  const kind = GpuPath.compositorKind(null, {
    featureStatus: { gpu_compositing: "enabled" },
    auxAttributes: { softwareRendering: false, glRenderer: ANGLE_NVIDIA },
  });
  assert.equal(kind.kind, "hardware");
});

test("missing preference file is written as hardware", () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const fs = memFs({});
  const file = join(dir, "gpu-path.json");
  try {
    const pref = GpuPath.ensureExpect(dir, fs);
    assert.equal(pref.expect, "hardware");
    assert.equal(pref.stored, true);
    assert.deepEqual(JSON.parse(fs.store[file]), { expect: "hardware" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("software preference is kept and a corrupt file is not rewritten", () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const file = join(dir, "gpu-path.json");
  const fs = memFs({ [file]: '{"expect":"software","note":"keeper"}\n' });
  try {
    assert.equal(GpuPath.ensureExpect(dir, fs).expect, "software");
    assert.equal(fs.store[file].includes("keeper"), true);
    fs.store[file] = "{";
    const bad = GpuPath.ensureExpect(dir, fs);
    assert.equal(bad.expect, "hardware");
    assert.equal(bad.stored, false);
    assert.equal(fs.store[file], "{");
    fs.store[file] = '{"expect":"vulkan"}\n';
    assert.equal(GpuPath.ensureExpect(dir, fs).expect, "hardware");
    assert.equal(fs.store[file].includes("vulkan"), true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("writeExpect refuses a third value", () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const fs = memFs({});
  try {
    assert.equal(GpuPath.writeExpect(dir, fs, "vulkan"), false);
    assert.equal(GpuPath.writeExpect(dir, fs, "software"), true);
    assert.equal(JSON.parse(fs.store[join(dir, "gpu-path.json")]).expect, "software");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate waits for Chromium and fail-closes a software fallback", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const fs = memFs({});
  const app = {
    getPath() {
      return dir;
    },
    getGPUInfo(kind) {
      if (kind === "complete") return Promise.reject(new Error("no complete"));
      return Promise.resolve({
        auxAttributes: { softwareRendering: true, glRenderer: "llvmpipe" },
      });
    },
    getGPUFeatureStatus() {
      return { gpu_compositing: "disabled_software", vulkan: "disabled_off" };
    },
    on() {},
    removeListener() {},
  };
  try {
    const verdict = await GpuPath.gate(app, fs, { timeoutMs: 200 });
    assert.equal(verdict.expect, "hardware");
    assert.equal(verdict.stored, true);
    assert.equal(verdict.open, false);
    assert.equal(verdict.reason, "software-refused");
    assert.equal(JSON.parse(fs.store[join(dir, "gpu-path.json")]).expect, "hardware");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate opens when the compositor update arrives after an empty read", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const fs = memFs({ [join(dir, "gpu-path.json")]: '{"expect":"hardware"}\n' });
  let listeners = [];
  let status = {};
  const app = {
    getPath() {
      return dir;
    },
    getGPUInfo() {
      return Promise.resolve({});
    },
    getGPUFeatureStatus() {
      return status;
    },
    on(_event, fn) {
      listeners.push(fn);
    },
    removeListener(_event, fn) {
      listeners = listeners.filter((item) => item !== fn);
    },
  };
  try {
    const pending = GpuPath.gate(app, fs, { timeoutMs: 500 });
    await new Promise((resolve) => setImmediate(resolve));
    status = { gpu_compositing: "enabled" };
    for (const fn of listeners) fn();
    const verdict = await pending;
    assert.equal(verdict.open, true);
    assert.equal(verdict.path, "hardware");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a hung GPU info read stays unread", async () => {
  const app = {
    getPath() {
      return "";
    },
    getGPUInfo() {
      return new Promise(() => {});
    },
    getGPUFeatureStatus() {
      return {};
    },
    on() {},
    removeListener() {},
  };
  const snap = await GpuPath.readChromiumGpu(app, { timeoutMs: 30 });
  assert.equal(snap.gpuInfo, null);
  assert.equal(GpuPath.compositorKind(snap.featureStatus, snap.gpuInfo).kind, "unread");
  assert.equal(GpuPath.decide("hardware", GpuPath.compositorKind(snap.featureStatus, snap.gpuInfo)).reason, "compositor-unread");
});

test("a hardware GL string waits for the compositing token", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gpu-path-"));
  const fs = memFs({});
  let listeners = [];
  let status = {};
  const app = {
    getPath() {
      return dir;
    },
    getGPUInfo() {
      return Promise.resolve({
        auxAttributes: { softwareRendering: false, glRenderer: ANGLE_NVIDIA },
      });
    },
    getGPUFeatureStatus() {
      return status;
    },
    on(_event, fn) {
      listeners.push(fn);
    },
    removeListener(_event, fn) {
      listeners = listeners.filter((item) => item !== fn);
    },
  };
  try {
    const pending = GpuPath.gate(app, fs, { timeoutMs: 400 });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(listeners.length > 0, true);
    status = { gpu_compositing: "enabled_on" };
    for (const fn of listeners) fn();
    const verdict = await pending;
    assert.equal(verdict.open, true);
    assert.equal(verdict.path, "hardware");
    assert.equal(verdict.because, "enabled_on");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
