// Linux with no tray to see, a native Wayland start, and the Minds key on a keyring: what driving the app on the box
// found (Debian 13: Xvfb with and without picom, a headless sway with XWayland, gnome-keyring in a throwaway D-Bus
// session). Each test below failed on the code before this change.
//   1. No tray to see (GNOME without AppIndicator, a bare X server): the pet's menu lacked two of the tray's rows,
//      Hide the window left nothing to bring the pets back with and said nothing, the hello pointed at a tray icon
//      that was not there, and a gate's OK left the app running with nothing to reach it from.
//   2. The keeper card's Turn off said "type .\desktop.ps1 again" on Linux and the Mac, which start with sh desktop.sh.
//   3. A native Wayland start (--ozone-platform=wayland) crashed at boot: SIGSEGV in screen.getCursorScreenPoint,
//      asked before any window was up. Now it starts again on XWayland, or says plainly why the pets stay off.
//   4. The Minds key on sway, i3 or any desktop Chromium does not know by name was written nowhere even with an
//      unlocked keyring on the session bus (safeStorage fell back to basic_text). Now the Secret Service is asked for.
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const Module = require("node:module");
const os = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");

const DESKTOP = join(__dirname, "..");
const read = (...p) => fs.readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
/** overlay-gate.cjs, loaded inside each test, so the other tests still run on code without the new parts. */
const G = new Proxy({}, { get: (_t, k) => require("../overlay-gate.cjs")[k] });
const K = require("./keeper.js");
const main = read(DESKTOP, "main.cjs");

/** A child process per command: `answers[cmd]` is its output, "missing", or "hang". */
function fakeSpawn(answers, seen) {
  return (cmd, args) => {
    seen.push({ cmd, args });
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stdout.setEncoding = () => {};
    child.kill = () => {};
    const a = answers[cmd];
    setImmediate(() => {
      if (a === "missing") child.emit("error", Object.assign(new Error("spawn ENOENT"), { code: "ENOENT" }));
      else if (a !== "hang") {
        child.stdout.emit("data", String(a || ""));
        child.emit("close", 0);
      }
    });
    return child;
  };
}

/** The body of a function in main.cjs, up to the next top-level function. */
function body(name) {
  const at = main.indexOf(`function ${name}(`);
  assert.ok(at >= 0, `main.cjs has ${name}`);
  const next = main.indexOf("\nfunction ", at + 10);
  const nextAsync = main.indexOf("\nasync function ", at + 10);
  const ends = [next, nextAsync].filter((i) => i > 0);
  return main.slice(at, ends.length ? Math.min(...ends) : undefined);
}

test("readTrayHost: a StatusNotifier host or an X system tray is a tray to see; neither is none", async () => {
  const bare = [];
  const env = { DISPLAY: ":9", DBUS_SESSION_BUS_ADDRESS: "unix:path=/x" };
  // Xvfb alone: no StatusNotifierWatcher (dbus-send prints an error, nothing on stdout), no _NET_SYSTEM_TRAY_S0 owner.
  assert.equal(await G.readTrayHost({ platform: "linux", env, spawn: fakeSpawn({ "dbus-send": "", python3: "no\n" }, bare) }), "no");
  assert.equal(bare[0].cmd, "dbus-send");
  assert.deepEqual(bare[0].args, G.SNI_ARGS);
  assert.ok(G.SNI_ARGS.includes("string:IsStatusNotifierHostRegistered"));
  assert.equal(bare[1].cmd, "python3");
  assert.equal(bare[1].args.at(-1), "_NET_SYSTEM_TRAY_S", "the X tray's selection, by the compositor check's own script");
  // swaybar or KDE: the watcher says a host is registered; X is not asked then.
  const sni = [];
  assert.equal(await G.readTrayHost({ platform: "linux", env, spawn: fakeSpawn({ "dbus-send": "method return\n   variant       boolean true\n" }, sni) }), "yes");
  assert.equal(sni.length, 1);
  // stalonetray, xfce4-panel, a bare window manager's tray: the X selection has an owner.
  assert.equal(await G.readTrayHost({ platform: "linux", env, spawn: fakeSpawn({ "dbus-send": "", python3: "yes\n" }, []) }), "yes");
  // A native Wayland start cannot see an X tray; no DISPLAY neither.
  const wl = [];
  assert.equal(await G.readTrayHost({ platform: "linux", env, nativeWayland: true, spawn: fakeSpawn({ "dbus-send": "" }, wl) }), "no");
  assert.equal(wl.length, 1);
  // Could not tell: no dbus-send, or it never answered.
  assert.equal(await G.readTrayHost({ platform: "linux", env: {}, spawn: fakeSpawn({ "dbus-send": "missing" }, []) }), "unknown");
  assert.equal(await G.readTrayHost({ platform: "linux", env: {}, timeoutMs: 30, spawn: fakeSpawn({ "dbus-send": "hang" }, []) }), "unknown");
  // Windows and the Mac always have one; COMPUTERPETS_TRAY=none treats it as absent anywhere (the drive uses it).
  assert.equal(await G.readTrayHost({ platform: "win32", env: {}, spawn: () => assert.fail("nothing to ask") }), "n/a");
  assert.equal(await G.readTrayHost({ platform: "win32", env: { COMPUTERPETS_TRAY: "none" } }), "no");
  assert.equal(await G.readTrayHost({ platform: "linux", env: { COMPUTERPETS_TRAY: " None " }, spawn: () => assert.fail("nothing to ask") }), "no");
});

test("no tray to see: the pet's own menu has every row the tray has but Show", () => {
  const tray = body("trayTemplate");
  const pet = body("popupPetMenu");
  const labels = (src) => [...src.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]);
  for (const l of labels(tray)) {
    if (l === "Show") continue;
    assert.ok(labels(pet).includes(l), `the pet menu has ${l}`);
  }
  // The tray's spreads too: the GPU path's own row (Require hardware compositing) and Follow me across desktops.
  assert.match(tray, /\.\.\.gpuPathRows\(\),/);
  assert.match(tray, /\.\.\.desktopFollowRows\(\),/);
  assert.match(pet, /\.\.\.desktopFollowRows\(\),/);
  assert.match(pet, /gpuGate\.path === "software" \? \[\{ label: "Require hardware compositing", click: \(\) => requireHardwareCompositing\(\) \}\]/);
  assert.match(pet, /\{ label: "Hide the window", click: \(\) => hideWindowFromPetMenu\(\) \}/);
});

test("no tray to see: Hide the window asks first and says how the pets come back", () => {
  const hide = body("hideWindowFromPetMenu");
  assert.match(hide, /if \(trayHost !== "no"\) \{\n\s+win\.hide\(\);\n\s+return;\n\s+\}/);
  assert.match(hide, /OverlayGate\.hideWords\(process\.platform\)/);
  assert.match(hide, /if \(w\.actions\[r\.response\] === "hide"\) win\?\.hide\(\);/);
  const lin = G.hideWords("linux");
  assert.equal(lin.message, "Hide the pets? There is no tray icon on this desktop to bring them back from.");
  assert.deepEqual(lin.buttons, ["Hide", "Cancel"]);
  assert.deepEqual(lin.actions, ["hide", "none"]);
  assert.match(lin.detail, /type sh desktop\.sh, just like the first time/);
  assert.match(G.hideWords("win32").detail, /type \.\\desktop\.ps1, just like the first time/);
  // Starting again is the way back: a second copy opens the keeper card on the first (and its window).
  const at = main.indexOf('app.on("second-instance"');
  assert.ok(at > 0);
  assert.match(main.slice(at, at + 700), /openKeeperCardFromMenu\(\);\n\s+\}\);/);
});

test("no tray to see: the app learns it once the tray is made and tells the overlay", () => {
  const learn = body("learnTrayHost");
  assert.match(learn, /trayHost = await OverlayGate\.readTrayHost\(\{ platform: process\.platform, env: process\.env, nativeWayland: NATIVE_WAYLAND \}\);/);
  assert.match(learn, /win\.webContents\.send\("tray-host", trayHost\)/);
  assert.match(body("startOverlay"), /else refreshMenus\(\);\n\s+learnTrayHost\(\)\.then\(watchTrayHost\);/);
  assert.match(main, /ipcMain\.on\("tray-host-get", \(e\) => \{\n\s+e\.returnValue = trayHost;/);
  const pre = read(DESKTOP, "preload.cjs");
  assert.match(pre, /trayHost: \(\) => ipcRenderer\.sendSync\("tray-host-get"\),/);
  assert.match(pre, /ipcRenderer\.on\("tray-host", wrapped\);/);
  const pet = read(__dirname, "pet.js");
  assert.match(pet, /const hint = K\.firstHint\(kind \? kind\.name : "", \{ tray: trayHost \}\);/);
  assert.match(pet, /window\.desk\?\.onTrayHost\?\.\(\(state\) => \{\n\s+trayHost = String\(state \|\| "unknown"\);\n\s+paintFirstHint\(\);/);
});

test("no tray to see: a gate's OK quits too, and the message says so (nothing else could reach the app)", () => {
  const w = G.closedWords("no-compositor");
  const nt = G.gateWithoutTray(w, "no");
  assert.deepEqual(nt.buttons, w.buttons);
  assert.deepEqual(nt.actions, ["recheck", "quit", "quit"]);
  assert.equal(nt.detail, `${w.detail} ${G.NO_TRAY_GATE}`);
  assert.equal(G.NO_TRAY_GATE, "There is no tray icon on this desktop to find the pets from, so OK quits too. Start ComputerPets again to see this message.");
  assert.equal(G.gateWithoutTray(w, "yes"), w);
  assert.equal(G.gateWithoutTray(w, "unknown"), w);
  assert.match(body("showClosedMessage"), /const w = OverlayGate\.gateWithoutTray\(shown\.words, trayHost\);/);
  const pics = body("showPicturesMessage");
  assert.match(pics, /detail: noTray \? `\$\{w\.detail\} \$\{OverlayGate\.NO_TRAY_GATE\}` : w\.detail,/);
  assert.match(pics, /if \(noTray\) app\.quit\(\);/);
  // Every gate learns the tray before its message.
  const boot = body("bootDesk");
  const gates = boot.split("createTray();").slice(1);
  assert.equal(gates.length, 4, "the wayland, pictures, GPU and compositor gates each make the tray");
  for (const g of gates) assert.match(g, /^\n(\s+closedGate = [^\n]+\n)?\s+await learnTrayHost\(\);\n\s+show(Closed|Pictures)Message\(\);/);
});

test("the hello points at the pet's menu where no tray can be seen, and at the tray where it can", () => {
  const seen = K.firstHint("Miso", { tray: "yes" });
  assert.match(seen.lines[2], /That is the tray icon\./);
  assert.deepEqual(K.firstHint("Miso").lines, seen.lines, "unknown or unsaid: the tray words as before");
  const none = K.firstHint("Miso", { tray: "no" });
  assert.equal(none.lines[2], "This computer shows no tray icon by the clock, so Miso's menu has it all. Right-click Miso and pick Companions to pick a new friend, or pick Quit to turn the pets off.");
  assert.deepEqual(none.lines.slice(0, 2), seen.lines.slice(0, 2));
});

test("Turn off says how the pets come back on this computer: sh desktop.sh on Linux and the Mac", () => {
  assert.equal(K.quitTruth("linux"), "Turns the pets off. To bring them back, type sh desktop.sh again, just like the first time.");
  assert.equal(K.quitTruth("darwin"), K.QUIT_TRUTH_SH);
  assert.equal(K.quitTruth("win32"), K.QUIT_TRUTH);
  assert.equal(K.quitTruth(undefined), K.QUIT_TRUTH, "the web (no platform) keeps its words");
  assert.match(K.QUIT_TRUTH, /type \.\\desktop\.ps1 again/);
  assert.match(read(__dirname, "pet.js"), /K\.quitTruth\(window\.desk\?\.platform\)/);
});

test("a native Wayland start: told apart from an X11 start on a Wayland session", () => {
  assert.equal(G.nativeWayland({ platform: "linux", env: { WAYLAND_DISPLAY: "wayland-1" }, ozone: "wayland" }), true);
  assert.equal(G.nativeWayland({ platform: "linux", env: { WAYLAND_DISPLAY: "wayland-1", DISPLAY: ":0" } }), false, "Electron 35 is X11 unless told");
  assert.equal(G.nativeWayland({ platform: "linux", env: { WAYLAND_DISPLAY: "wayland-1", ELECTRON_OZONE_PLATFORM_HINT: "auto" } }), true);
  assert.equal(G.nativeWayland({ platform: "linux", env: { ELECTRON_OZONE_PLATFORM_HINT: "wayland" } }), false, "no Wayland session to be on");
  assert.equal(G.nativeWayland({ platform: "linux", env: { WAYLAND_DISPLAY: "w" }, hint: "wayland" }), true);
  assert.equal(G.nativeWayland({ platform: "linux", env: { WAYLAND_DISPLAY: "w", ELECTRON_OZONE_PLATFORM_HINT: "auto" }, ozone: "x11" }), false, "the switch wins");
  assert.equal(G.nativeWayland({ platform: "win32", env: { WAYLAND_DISPLAY: "w" }, ozone: "wayland" }), false);
});

test("a native Wayland start goes again on XWayland once, or stays closed and says why", () => {
  assert.equal(G.waylandPlan({ native: false, env: { DISPLAY: ":0" } }), "none");
  assert.equal(G.waylandPlan({ native: true, env: { DISPLAY: ":0" } }), "relaunch-x11");
  assert.equal(G.waylandPlan({ native: true, env: { DISPLAY: ":0", COMPUTERPETS_X11_TRIED: "1" } }), "closed", "never a loop");
  assert.equal(G.waylandPlan({ native: true, env: {} }), "closed", "no XWayland");
  assert.deepEqual(G.x11Args(["/app/desktop", "--ozone-platform=wayland", "--user-data-dir=/t", "--ozone-platform-hint=auto"]), ["/app/desktop", "--user-data-dir=/t", "--ozone-platform=x11"]);
  const w = G.closedWords("wayland-native");
  assert.equal(w.message, "The pets are not on the screen: they were started as a Wayland app, and there is no XWayland here to start them on instead.");
  assert.deepEqual(w.buttons, ["Quit", "OK"]);
  assert.deepEqual(w.actions, ["quit", "none"]);
  assert.match(w.detail, /The pets need XWayland, which lets Wayland desktops run X11 apps\. .*sudo apt install xwayland\. Then start them again with sh desktop\.sh\./);
  const boot = body("bootDesk");
  const plan = boot.indexOf("OverlayGate.waylandPlan({ native: NATIVE_WAYLAND, env: process.env })");
  assert.ok(plan > 0 && plan < boot.indexOf("Pictures.picturesSurvey"), "before anything else is made");
  assert.match(boot, /process\.env\.COMPUTERPETS_X11_TRIED = "1";\n\s+app\.relaunch\(\{ args: OverlayGate\.x11Args\(process\.argv\.slice\(1\)\) \}\);\n\s+app\.quit\(\);\n\s+return;/);
  assert.match(boot, /closedGate = \{ why: "wayland-native", words: OverlayGate\.closedWords\("wayland-native"\) \};/);
  assert.match(main, /const NATIVE_WAYLAND = OverlayGate\.nativeWayland\(\{\n\s+platform: process\.platform,\n\s+env: process\.env,\n\s+ozone: app\.commandLine\.getSwitchValue\("ozone-platform"\),\n\s+hint: app\.commandLine\.getSwitchValue\("ozone-platform-hint"\),\n\s+electron: process\.versions\.electron,\n\}\);/);
});

test("the boot never asks for the cursor on a native Wayland start (it crashed Electron there)", () => {
  const floor = body("floorOf");
  assert.match(floor, /if \(Desk\.followCursorDisplay\(process\.platform\) && !NATIVE_WAYLAND\) \{\n\s+return screen\.getDisplayNearestPoint\(screen\.getCursorScreenPoint\(\)\)\.workArea;/);
});

test("the Minds key store: the Secret Service by name where Chromium would not pick it", () => {
  let asked = 0;
  const has = () => {
    asked += 1;
    return true;
  };
  assert.equal(G.passwordStoreFor({ platform: "linux", env: { XDG_CURRENT_DESKTOP: "sway" }, secretService: has }), "gnome-libsecret");
  assert.equal(G.passwordStoreFor({ platform: "linux", env: {}, secretService: true }), "gnome-libsecret", "a bare X server or i3 with a keyring");
  assert.equal(asked, 1);
  assert.equal(G.passwordStoreFor({ platform: "linux", env: { XDG_CURRENT_DESKTOP: "ubuntu:GNOME" }, secretService: has }), "");
  assert.equal(G.passwordStoreFor({ platform: "linux", env: { XDG_CURRENT_DESKTOP: "KDE" }, secretService: has }), "");
  assert.equal(G.passwordStoreFor({ platform: "linux", env: { DESKTOP_SESSION: "xfce" }, secretService: has }), "");
  assert.equal(asked, 1, "a desktop Chromium knows is not asked about (no dbus-send before ready)");
  assert.equal(G.passwordStoreFor({ platform: "linux", env: { XDG_CURRENT_DESKTOP: "sway" }, secretService: false }), "", "no keyring: Chromium's own answer (the Minds page says the key stays off disk)");
  assert.equal(G.passwordStoreFor({ platform: "linux", env: {}, given: "basic", secretService: has }), "", "a --password-store given by hand wins");
  assert.equal(G.passwordStoreFor({ platform: "win32", env: {}, secretService: has }), "");
  assert.equal(asked, 1);
  const store = main.indexOf("OverlayGate.passwordStoreFor(");
  assert.ok(store > 0 && store < main.indexOf("app.whenReady()"), "switches count only before ready");
  assert.match(main, /if \(store\) app\.commandLine\.appendSwitch\("password-store", store\);/);
  assert.match(main, /secretService: \(\) => OverlayGate\.secretServiceRunning\(\{ env: process\.env \}\),/);
});

test("secretServiceRunning asks the session bus whether org.freedesktop.secrets has an owner, without starting one", () => {
  const calls = [];
  const run = (answer) => (cmd, args, opts) => {
    calls.push({ cmd, args, opts });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  assert.equal(G.secretServiceRunning({ env: {}, spawnSync: run({ status: 0, stdout: "method return\n   boolean true\n" }) }), true);
  assert.equal(calls[0].cmd, "dbus-send");
  assert.ok(calls[0].args.includes("org.freedesktop.DBus.NameHasOwner"), "NameHasOwner, not StartServiceByName");
  assert.ok(calls[0].args.includes("string:org.freedesktop.secrets"));
  assert.ok(calls[0].opts.timeout <= 1500, "asked before ready: never a long wait");
  assert.equal(G.secretServiceRunning({ env: {}, spawnSync: run({ status: 0, stdout: "   boolean false\n" }) }), false);
  assert.equal(G.secretServiceRunning({ env: {}, spawnSync: run({ status: 1, stdout: "" }) }), false, "no session bus");
  assert.equal(G.secretServiceRunning({ env: {}, spawnSync: run(new Error("ENOENT")) }), false, "no dbus-send");
});

test("the drive follows a relaunch the app asks for: the hook writes its args where the drive can read them", () => {
  const dir = fs.mkdtempSync(join(os.tmpdir(), "cp-relaunch-"));
  const fake = { app: { relaunch: () => assert.fail("a real relaunch"), getPath: () => dir }, dialog: { showMessageBox: () => assert.fail("a real message box") } };
  const load = Module._load;
  Module._load = function (request, ...rest) {
    return request === "electron" ? fake : load.call(this, request, ...rest);
  };
  const g = /** @type {any} */ (globalThis);
  const was = process.env.COMPUTERPETS_X11_TRIED;
  try {
    delete require.cache[require.resolve("../first-run-drive-hook.cjs")];
    require("../first-run-drive-hook.cjs");
    process.env.COMPUTERPETS_X11_TRIED = "1";
    fake.app.relaunch({ args: ["/d", "--ozone-platform=x11"] });
  } finally {
    Module._load = load;
    if (was === undefined) delete process.env.COMPUTERPETS_X11_TRIED;
    else process.env.COMPUTERPETS_X11_TRIED = was;
  }
  const D = require("../first-run-drive.cjs");
  try {
    assert.equal(g.__relaunches, 1);
    assert.deepEqual(g.__relaunchArgs, ["/d", "--ozone-platform=x11"]);
    const rec = JSON.parse(fs.readFileSync(join(dir, D.RELAUNCH_FILE), "utf8"));
    assert.deepEqual(rec, { args: ["/d", "--ozone-platform=x11"], env: { COMPUTERPETS_X11_TRIED: "1" } });
    assert.equal(D.ozoneOf(rec.args), "x11");
    assert.equal(D.ozoneOf(["/d"]), "");
    assert.equal(D.waylandArg(["--wayland"]), true);
    assert.equal(D.waylandArg([]), false);
    assert.equal(D.gateOf({ message: G.closedWords("wayland-native").message, buttons: ["Quit", "OK"] }), "wayland-native");
  } finally {
    delete g.__dialogs;
    delete g.__relaunches;
    delete g.__relaunchArgs;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the drive checks all of it: no tray, the Wayland gate, and Turn off's words", () => {
  const src = read(DESKTOP, "first-run-drive.cjs");
  for (const id of ["no_tray_hello", "no_tray_pet_menu", "no_tray_hide_asks", "no_tray_second_start", "turn_off_words", "gate_wayland_restarts_on_x11", "gate_wayland_says_so"]) {
    assert.match(src, new RegExp(`check\\(\\s*"${id}"`), id);
  }
  // On Linux the app's own answer is checked (Xvfb has no tray host); elsewhere COMPUTERPETS_TRAY=none says so.
  assert.match(src, /const forced = process\.platform !== "linux";\n\s+\(\{ app, page \} = await launch\(forced \? \{ COMPUTERPETS_TRAY: "none" \} : \{\}\)\);/);
});

test("the drive accepts the key not kept only when no Secret Service is on the session bus", () => {
  const src = read(DESKTOP, "first-run-drive.cjs");
  assert.match(src, /const keyring = process\.platform === "linux" && require\("\.\/overlay-gate\.cjs"\)\.secretServiceRunning\(\{ env: process\.env \}\);/);
  assert.match(src, /kept\.plugin === "xai" && \(kept\.keyKept \|\| \(noStore && !keyring\)\),/);
});

test("sh desktop.sh: with Git LFS installed but the pictures not fetched, it does not say to install Git LFS", () => {
  const ROOT = join(DESKTOP, "..");
  const sh = read(ROOT, "desktop.sh");
  assert.match(sh, /lfs_here\(\) \{\n\s+if git lfs version >\/dev\/null 2>&1; then echo yes; else echo no; fi\n\}/);
  assert.match(sh, /\[ "\$seen" = ready \] \|\| lfs=\$\(lfs_here\)/, "asked only when the pictures are not ready");
  const stopHere = sh.indexOf('[ "$seen" = ready ] || [ "$lfs" = no ] || stop_start "The pet pictures did not download. Git LFS is installed here, but it has not fetched them yet.');
  assert.ok(stopHere > 0 && stopHere < sh.indexOf("npm install ||"), "stops before npm install");
  if (process.platform !== "linux" || Number(process.versions.node.split(".")[0]) < 22) return;
  // A fresh clone made without LFS smudging (crow's first frame is a pointer), and a git that has LFS or not.
  const dir = fs.mkdtempSync(join(os.tmpdir(), "cp-lfs-"));
  try {
    fs.mkdirSync(join(dir, "desktop", "renderer", "sprites", "crow", "idle"), { recursive: true });
    fs.copyFileSync(join(ROOT, "desktop.sh"), join(dir, "desktop.sh"));
    fs.writeFileSync(join(dir, "desktop", "package.json"), "{}");
    fs.writeFileSync(join(dir, "desktop", "renderer", "sprites", "crow", "idle", "1.png"), "version https://git-lfs.github.com/spec/v1\noid sha256:00\nsize 1\n");
    const run = (hasLfs) => {
      const bin = join(dir, hasLfs ? "lfs-bin" : "no-lfs-bin");
      fs.mkdirSync(bin, { recursive: true });
      fs.writeFileSync(join(bin, "git"), hasLfs ? '#!/bin/sh\n[ "$1 $2" = "lfs version" ] && { echo git-lfs/3.6.1; exit 0; }\nexit 1\n' : '#!/bin/sh\necho "git: \'lfs\' is not a git command." >&2\nexit 1\n', { mode: 0o755 });
      const env = { PATH: `${bin}:${require("node:path").dirname(process.execPath)}:/usr/bin:/bin`, DISPLAY: ":0" };
      const check = require("node:child_process").spawnSync("sh", [join(dir, "desktop.sh"), "--check"], { env, encoding: "utf8" });
      const start = require("node:child_process").spawnSync("sh", [join(dir, "desktop.sh")], { env, encoding: "utf8" });
      return { check: check.stdout.trim().split("\n").at(-1), start: start.stdout.trim(), code: start.status };
    };
    const here = run(true);
    assert.equal(here.check, "next: The pet pictures are not here yet. Git LFS is installed but has not fetched them. In the computerpets folder type git lfs install and then git lfs pull. Then type sh desktop.sh and press Enter.");
    assert.equal(here.start, "The pet pictures did not download. Git LFS is installed here, but it has not fetched them yet. In the computerpets folder run git lfs install and then git lfs pull, and run sh desktop.sh again.");
    assert.equal(here.code, 1);
    const none = run(false);
    assert.match(none.check, /^next: The pet pictures are not here yet\. Install Git LFS from https:\/\/git-lfs\.com/);
    assert.match(none.start, /^The pet pictures did not download\. They come through Git LFS, which this Git does not have yet\./);
    assert.equal(none.code, 1);
    assert.ok(!fs.existsSync(join(dir, "desktop", "node_modules")), "nothing installed");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
