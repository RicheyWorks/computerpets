// The desktop app on Linux, driven for real for the first time (first-run-drive.cjs under Xvfb on Debian 13), and
// what that found. Each test below failed on the code before this change.
//   1. A desktop with no compositor: the see-through pet window covered the whole screen in solid black (seen with a
//      white window under it: black without picom, white with it). Now it stays closed and a message box says why.
//   2. The GPU gate's refusal (software compositing: every virtual machine and bare X server) was said only in the
//      tray menu, and many Linux desktops show no tray: the app looked like it did nothing. Now a message box says it.
//   3. The drive waited forever when no overlay window came: the Electron it started was never closed.
//   4. sh desktop.sh with no screen (SSH, a text console): Electron printed "Missing X server or $DISPLAY" and died
//      with SIGSEGV. Now the start script says so in words, before installing anything.
// And two parity items: Rest gives the web's +34 on the desktop too (it gave +32), and the Minds page has its own
// Test this mind button like the web's, next to Save (which still tests).
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const Module = require("node:module");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const DESKTOP = join(__dirname, "..");
const ROOT = join(DESKTOP, "..");
// CRLF (a Windows checkout) reads as LF, so the patterns below hold on both.
const read = (...p) => fs.readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
/** overlay-gate.cjs, loaded inside each test, so the other tests still run on code without it. */
const G = new Proxy({}, { get: (_t, k) => require("../overlay-gate.cjs")[k] });

/** A child process that prints `out` and closes, or errors, or never answers. */
function fakeSpawn(behave, seen) {
  return (cmd, args, opts) => {
    seen.push({ cmd, args, opts });
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stdout.setEncoding = () => {};
    child.kill = () => {
      child.killed = true;
    };
    setImmediate(() => {
      if (behave === "error") child.emit("error", new Error("ENOENT"));
      else if (behave !== "hang") {
        child.stdout.emit("data", behave);
        child.emit("close", 0);
      }
    });
    return child;
  };
}

test("no compositor: the X question, and what each answer does", async () => {
  assert.match(G.COMPOSITOR_SCRIPT, /_NET_WM_CM_S%d/);
  assert.match(G.COMPOSITOR_SCRIPT, /xcb_get_selection_owner/);
  const seen = [];
  const x11 = { DISPLAY: ":0" };
  assert.equal(await G.readCompositor({ platform: "linux", env: x11, spawn: fakeSpawn("yes\n", seen) }), "yes");
  assert.equal(await G.readCompositor({ platform: "linux", env: x11, spawn: fakeSpawn("no\n", seen) }), "no");
  assert.equal(seen[0].cmd, "python3");
  assert.equal(seen[0].args[1], G.COMPOSITOR_SCRIPT);
  assert.equal(await G.readCompositor({ platform: "linux", env: x11, spawn: fakeSpawn("error", seen) }), "unknown", "no python3");
  assert.equal(await G.readCompositor({ platform: "linux", env: x11, spawn: fakeSpawn("garbage", seen) }), "unknown");
  assert.equal(await G.readCompositor({ platform: "linux", env: x11, spawn: fakeSpawn("hang", seen), timeoutMs: 50 }), "unknown");
  // Wayland always composites (XWayland windows too); no screen at all cannot be told.
  assert.equal(await G.readCompositor({ platform: "linux", env: { ...x11, WAYLAND_DISPLAY: "wayland-0" }, spawn: fakeSpawn("no\n", seen) }), "yes");
  assert.equal(await G.readCompositor({ platform: "linux", env: { WAYLAND_DISPLAY: "wayland-0" }, spawn: fakeSpawn("no\n", seen) }), "yes");
  assert.equal(await G.readCompositor({ platform: "linux", env: {}, spawn: fakeSpawn("no\n", seen) }), "unknown");
  const before = seen.length;
  assert.equal(await G.readCompositor({ platform: "win32", env: x11, spawn: fakeSpawn("no\n", seen) }), "n/a");
  assert.equal(await G.readCompositor({ platform: "darwin", env: x11, spawn: fakeSpawn("no\n", seen) }), "n/a");
  assert.equal(seen.length, before, "Windows and the Mac ask nothing");
  // Only a plain "no" keeps the window closed.
  assert.equal(G.overlayMayOpen("no"), false);
  for (const s of ["yes", "unknown", "n/a"]) assert.equal(G.overlayMayOpen(s), true, s);
});

test("the closed-window words are plain and every button does what it says", () => {
  for (const why of ["no-compositor", "software-refused", "compositor-unread", "compositor-off"]) {
    const w = G.closedWords(why);
    assert.match(w.message, /^The pets are not on the screen: /, why);
    assert.ok(w.detail.length > 60, why);
    assert.equal(w.buttons.length, w.actions.length, why);
    assert.ok(w.buttons.includes("Quit") && w.actions[w.buttons.indexOf("Quit")] === "quit", why);
    assert.doesNotMatch(`${w.message} ${w.detail}`, /DirectX|Vulkan|WebGL|_NET_WM|xcb|ARGB/, why);
  }
  const nc = G.closedWords("no-compositor");
  assert.match(nc.detail, /cover your whole screen in black/);
  assert.match(nc.detail, /picom/);
  assert.equal(nc.actions[nc.buttons.indexOf("Check again")], "recheck");
  const sw = G.closedWords("software-refused");
  assert.equal(sw.actions[sw.buttons.indexOf("Allow software compositing")], "allow-software");
  assert.equal(sw.tray, "Software compositing. Overlay closed.", "the tray keeps gpu-path.cjs's label");
});

test("main.cjs: the refusal and the missing compositor come up in a message box, not only in a tray", () => {
  const main = read(DESKTOP, "main.cjs");
  assert.match(main, /const OverlayGate = require\("\.\/overlay-gate\.cjs"\);/);
  // The GPU refusal: a tray (where there is one) and the message box.
  assert.match(main, /createTray\(\);\n\s+closedGate = \{ why: gpuGate\.reason, words: OverlayGate\.closedWords\(gpuGate\.reason\) \};\n\s+await learnTrayHost\(\);\n\s+showClosedMessage\(\);\n\s+return;/);
  // The compositor is asked after the GPU gate and before the window; "no" keeps it closed.
  const gpu = main.indexOf("gpuGate = await GpuPath.gate(app, fs);");
  const comp = main.indexOf("const compositor = await OverlayGate.readCompositor(");
  const open = main.indexOf("    startOverlay();\n  });");
  assert.ok(gpu > 0 && comp > gpu && open > comp, "gpu gate, then compositor, then the window");
  assert.match(main, /if \(!OverlayGate\.overlayMayOpen\(compositor\)\) \{\n\s+closedGate = \{ why: "no-compositor"/);
  assert.match(main, /function startOverlay\(\) \{\n\s+createWindow\(\);/);
  // The message box's buttons, Check again opening the window once a compositor runs, and a second start showing it.
  assert.match(main, /dialog\n\s+\.showMessageBox\(\{\n\s+type: "info",\n\s+title: "ComputerPets",\n\s+message: w\.message,/);
  assert.match(main, /if \(action === "quit"\) app\.quit\(\);\n\s+else if \(action === "allow-software"\) acceptSoftwareCompositing\(\);\n\s+else if \(action === "recheck"\) recheckCompositor\(\);/);
  assert.match(main, /closedGate = null;\n\s+startOverlay\(\);\n\s+refreshMenus\(\);/);
  assert.match(main, /if \(closedGate\) \{\n\s+showClosedMessage\(\);\n\s+return;\n\s+\}/);
  assert.match(main, /if \(!tray\) createTray\(\);\n\s+else refreshMenus\(\);/, "Check again does not make a second tray");
  assert.match(main, /\{ label: "Why the pets are not on the screen", click: \(\) => showClosedMessage\(\) \}/);
  const pkg = JSON.parse(read(DESKTOP, "package.json"));
  assert.ok(pkg.build.files.includes("overlay-gate.cjs"), "the built app carries it");
  assert.ok(!pkg.build.files.includes("first-run-drive-hook.cjs"), "the drive's hook is not in the built app");
});

test("sh desktop.sh says when there is no screen, in check mode and before installing", () => {
  const sh = read(ROOT, "desktop.sh");
  assert.match(sh, /elif \[ -n "\$\{WAYLAND_DISPLAY:-\}" \]; then echo wayland\n\s+elif \[ -n "\$\{DISPLAY:-\}" \]; then echo x11\n\s+else echo none/);
  assert.match(sh, /echo "display: \$display"/);
  assert.match(sh, /elif \[ "\$display" = none \]; then\n\s+echo "next: \$no_screen"/);
  const stop = sh.indexOf('[ "$display" != none ] || stop_start "$no_screen"');
  assert.ok(stop > 0 && stop < sh.indexOf("npm install ||"), "stops before npm install");
  assert.match(sh, /no_screen="There is no desktop screen here for the pets: DISPLAY and WAYLAND_DISPLAY are empty/);
  if (process.platform !== "linux") return;
  const node = Number(process.versions.node.split(".")[0]);
  if (node < 22) return;
  const env = { ...process.env };
  delete env.DISPLAY;
  delete env.WAYLAND_DISPLAY;
  const out = execFileSync("sh", [join(ROOT, "desktop.sh"), "--check"], { env, encoding: "utf8" });
  assert.match(out, /^display: none$/m);
  const lines = out.trim().split("\n");
  if (/^pictures: ready$/m.test(out)) assert.match(lines[lines.length - 1], /^next: There is no desktop screen here for the pets/);
  const x = execFileSync("sh", [join(ROOT, "desktop.sh"), "--check"], { env: { ...env, DISPLAY: ":0" }, encoding: "utf8" });
  assert.match(x, /^display: x11$/m);
});

test("the drive closes an app that never shows a window instead of waiting on it forever", async () => {
  const D = require("../first-run-drive.cjs");
  const src = read(DESKTOP, "first-run-drive.cjs");
  // Checked first: the old drive took no stand-in Playwright and would have started the real app here.
  assert.match(src, /const pw = opts\.pw \|\| playwright\(\);/);
  const log = { closed: 0, killed: 0, args: null, env: null, proc: { exitCode: null, signalCode: null, kill: () => ((log.killed += 1), (log.proc.signalCode = "SIGTERM")) } };
  const app = {
    evaluate: async (fn) => {
      const f = String(fn);
      if (f.includes("getPath")) return log.env.COMPUTERPETS_SETTINGS_DIR;
      if (f.includes("__dialogs")) return [];
      return undefined;
    },
    windows: () => [],
    waitForEvent: (_name, o) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), Math.min(50, (o && o.timeout) || 50))),
    close: async () => {
      log.closed += 1;
    },
    // A hung app: close() does not end it, only a kill does.
    process: () => log.proc,
  };
  const pw = { _electron: { launch: async (o) => ((log.args = o.args), (log.env = o.env), app) } };
  const r = await D.drive({ pw, exe: process.execPath, windowMs: 400 });
  assert.equal(r.ok, false);
  const drive = r.checks.find((c) => c.id === "drive");
  assert.ok(drive && /no overlay window and no message saying why/.test(drive.detail), JSON.stringify(r.checks));
  assert.ok(log.closed >= 1 && log.killed >= 1, "the app it started is closed and killed");
  assert.deepEqual(log.args.slice(0, 2), ["-r", D.HOOK], "message boxes are recorded before main.cjs runs");
  assert.ok(r.checks.find((c) => c.id === "throwaway_removed" && c.ok));
});

test("the drive's hook records message boxes and restarts instead of showing or running them", () => {
  const fake = { app: { relaunch: () => assert.fail("a real relaunch") }, dialog: { showMessageBox: () => assert.fail("a real message box") } };
  const load = Module._load;
  Module._load = function (request, ...rest) {
    return request === "electron" ? fake : load.call(this, request, ...rest);
  };
  const g = /** @type {any} */ (globalThis);
  try {
    delete require.cache[require.resolve("../first-run-drive-hook.cjs")];
    require("../first-run-drive-hook.cjs");
  } finally {
    Module._load = load;
  }
  fake.app.relaunch();
  assert.equal(g.__relaunches, 1);
  const answer = fake.dialog.showMessageBox({ message: "The pets are not on the screen: this desktop is not compositing windows.", buttons: ["Check again", "Quit", "OK"] });
  assert.equal(g.__dialogs.length, 1);
  const D = require("../first-run-drive.cjs");
  assert.equal(D.gateOf(g.__dialogs[0]), "no-compositor");
  assert.equal(D.gateOf({ message: G.closedWords("software-refused").message, buttons: G.closedWords("software-refused").buttons }), "software-refused");
  assert.equal(D.gateOf({ message: "Something else", buttons: ["OK"] }), "other");
  g.__dialogs[0].answer(1);
  return answer.then((r) => {
    assert.equal(r.response, 1);
    delete g.__dialogs;
    delete g.__relaunches;
  });
});

test("Rest gives the same energy on the desktop and the web: +34 (the desktop gave +32)", () => {
  const Life = require("./life.js");
  const care = read(ROOT, "web", "src", "lib", "pets", "care.ts");
  const web = /export const REST_ENERGY_GAIN = (\d+);/.exec(care);
  assert.ok(web, "care.ts names its number");
  assert.equal(Life.REST_ENERGY_GAIN, Number(web[1]));
  assert.equal(Life.REST_ENERGY_GAIN, 34);
  assert.match(care, /energy: clampStat\(s\.energy \+ REST_ENERGY_GAIN\),/);
  const trait = { extra: {}, hungerH: 6, energyH: 9, hygieneH: 14, hardy: 0.8, social: 1, messy: 0.4, sleepStart: 22, sleepEnd: 6 };
  const now = new Date(2023, 10, 14, 14, 0, 0).getTime();
  const r = Life.act({ ...Life.blank(now), energy: 40, hunger: 70, lastTick: now }, trait, "rest", now, "fox");
  assert.equal(r.life.energy, 74);
  assert.equal(r.cmd, "sleep");
});

test("the Minds page has its own Test this mind button, and Save still tests", () => {
  const html = read(__dirname, "settings.html");
  assert.match(html, /<button id="save" type="button">Use for all pets<\/button><button id="testMind" class="ghost" type="button">Test this mind<\/button>/);
  assert.match(html, /await testSaved\(false\);\n\s+\}\);/, "Save still tests");
  assert.match(html, /testMindButton\.addEventListener\("click", async \(\) => \{/);
  assert.match(html, /window\.PetMind\.mindTestGate\(saved, \{ plugin: plugin\.value, model: model\.value, baseUrl: base\.value, apiKey: key\.value \}\)/);
  assert.match(html, /await testSaved\(true\);/);
  // mind.js is a renderer script: it runs in a window-shaped context, as desk-audit-1557.test.cjs loads it.
  const store = () => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} });
  const win = { PetWeatherAreas: require("./weather-areas.js"), localStorage: store(), sessionStorage: store(), URL, URLSearchParams, AbortController, setTimeout, clearTimeout };
  win.window = win;
  vm.runInContext(read(__dirname, "mind.js"), vm.createContext(win));
  const M = win.PetMind;
  const xai = M.preset("xai");
  const saved = { plugin: "xai", model: xai.model, baseUrl: xai.base, apiKey: "k1" };
  const same = { plugin: "xai", model: xai.model, baseUrl: xai.base, apiKey: "k1" };
  assert.equal(M.mindTestGate(saved, same), "", "the saved mind is asked");
  assert.equal(M.mindTestGate(saved, { ...same, model: "other" }), M.MIND_TEST_UNSAVED);
  assert.equal(M.mindTestGate(saved, { ...same, plugin: "local" }), M.MIND_TEST_UNSAVED);
  assert.equal(M.mindTestGate(saved, { ...same, apiKey: "k2" }), M.MIND_TEST_UNSAVED);
  assert.equal(M.mindTestGate({ ...saved, apiKey: undefined }, { ...same, apiKey: "typed" }), "", "a key the store did not hand back is not compared");
  assert.equal(M.mindTestGate({ plugin: "local" }, { plugin: "local" }), M.MIND_TEST_HOUSE);
  assert.equal(M.mindTestGate({}, { plugin: "local" }), M.MIND_TEST_HOUSE);
  assert.match(M.MIND_TEST_UNSAVED, /^Save first\./);
  assert.equal(M.MIND_UNTESTED, `Saved. ${M.MIND_NOT_ASKED}`);
});
