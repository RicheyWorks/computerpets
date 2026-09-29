const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

// The Electron 35 -> 44 upgrade (ADR 0132). Electron 35.7.5 carried 32 Electron advisories and 2 extract-zip ones (npm audit: 2 high); 44 is a
// supported major with none. What changed in between and touches this app is pinned here; the drives prove the rest.
const DESKTOP = join(__dirname, "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const pkg = JSON.parse(read(DESKTOP, "package.json"));
const main = read(DESKTOP, "main.cjs");
const drive = read(DESKTOP, "first-run-drive.cjs");
const G = require("../overlay-gate.cjs");
const D = require("../first-run-drive.cjs");

test("the desktop app is on Electron 44", () => {
  assert.match(pkg.devDependencies.electron || pkg.dependencies?.electron || "", /^\^44\./);
  assert.equal(G.electronMajor("44.4.5"), 44);
  assert.equal(G.electronMajor("v35.7.5"), 35);
  assert.equal(G.electronMajor(undefined), 0);
});

test("Electron 38+ starts as a Wayland app by itself on a Wayland session: the app counts that as native Wayland", () => {
  const session = { XDG_SESSION_TYPE: "wayland", WAYLAND_DISPLAY: "wayland-1", DISPLAY: ":0" };
  const base = { platform: "linux", env: session, ozone: "", hint: "" };
  // Electron 44 also writes the platform it picked into app.commandLine (--ozone-platform reads "wayland" under sway
  // with no switch given; seen on the box), so the switch still decides first; the session is the fallback.
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", ozone: "wayland" }), true);
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5" }), true);
  assert.equal(G.nativeWayland({ ...base, electron: "38.0.0" }), true);
  assert.equal(G.nativeWayland({ ...base, electron: "35.7.5" }), false, "Electron 37 and older run on XWayland");
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", ozone: "x11" }), false, "the relaunch's --ozone-platform=x11 wins");
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", ozone: "auto" }), true);
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", env: { DISPLAY: ":0", WAYLAND_DISPLAY: "wayland-1" } }), false, "an X11 session with a stray WAYLAND_DISPLAY");
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", env: { ...session, ELECTRON_OZONE_PLATFORM_HINT: "x11" } }), true, "the hint is gone in 38");
  assert.equal(G.nativeWayland({ ...base, electron: "44.4.5", platform: "win32" }), false);
  assert.equal(G.waylandPlan({ native: G.nativeWayland({ ...base, electron: "44.4.5" }), env: session }), "relaunch-x11");
  assert.match(main, /electron: process\.versions\.electron,/);
});

test("the drive checks that a Wayland session start with no switch goes to XWayland (it followed silently before)", () => {
  const session = { XDG_SESSION_TYPE: "wayland", WAYLAND_DISPLAY: "wayland-1" };
  assert.equal(D.autoWaylandStart("linux", session, 44), true);
  assert.equal(D.autoWaylandStart("linux", session, 35), false);
  assert.equal(D.autoWaylandStart("linux", { XDG_SESSION_TYPE: "x11", WAYLAND_DISPLAY: "w" }, 44), false);
  assert.equal(D.autoWaylandStart("win32", session, 44), false);
  assert.match(drive, /if \(autoWayland && firstStart\) \{[\s\S]{0,400}check\(\s*"gate_wayland_restarts_on_x11",\s*false,/);
  assert.match(drive, /nextArgs\.includes\("--ozone-platform=wayland"\) \|\| \(autoWayland && firstStart\)/);
  assert.doesNotMatch(drive, /require\("\.\/overlay-gate\.cjs"\)\.nativeWayland/, "the drive reads it on its own");
});

test("Electron 43's rounded corners on Linux frameless windows are off for the full-screen glass", () => {
  const at = main.indexOf("win = new BrowserWindow({");
  assert.ok(at > 0);
  const opts = main.slice(at, main.indexOf("});", at));
  assert.match(opts, /frame: false,/);
  assert.match(opts, /transparent: true,/);
  assert.match(opts, /roundedCorners: false,/);
});

test("Electron 42+ gets Electron itself on first run: the drive fetches it the same way before starting it", () => {
  assert.match(drive, /node_modules", "electron", "install\.js"/);
  assert.match(drive, /spawnSync\(process\.execPath, \[installJs\]/);
  assert.match(drive, /scale, electron \};/, "the drive's JSON names the Electron it ran");
});

test("a StatusNotifier tray host that starts after the pets is checked in the drive, beside the XEmbed one", () => {
  const w = read(DESKTOP, "sni-watcher.py");
  assert.match(w, /"org\.kde\.StatusNotifierWatcher"/);
  assert.match(w, /IsStatusNotifierHostRegistered/);
  assert.match(w, /NameOwnerChanged/, "an item whose owner left is dropped");
  assert.ok(existsSync(join(DESKTOP, "sni-watcher.py")));
  assert.match(drive, /check\(\s*"tray_appears_later_sni",/);
  assert.match(drive, /seenNo === "no" && seenYes === "yes" && items\.length === 1/);
  assert.match(drive, /string:org\.kde\.StatusNotifierWatcher/, "never with a real panel's watcher already there");
  assert.ok(drive.indexOf('"tray_appears_later_sni"') > drive.indexOf('"tray_appears_later",'), "after the XEmbed check");
});
