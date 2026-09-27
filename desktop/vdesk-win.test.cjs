const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const V = require("./vdesk-win.cjs");
const Desk = require("./renderer/desk.js");

const moduleSrc = readFileSync(join(__dirname, "vdesk-win.cjs"), "utf8");
const mainSrc = readFileSync(join(__dirname, "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "preload.cjs"), "utf8");
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));

const OWN = "4242";

function fakeTimers() {
  let seq = 0;
  const jobs = new Map();
  return {
    setInterval(fn, ms) {
      seq += 1;
      jobs.set(seq, { fn, ms, every: true });
      return seq;
    },
    clearInterval(id) {
      jobs.delete(id);
    },
    setTimeout(fn, ms) {
      seq += 1;
      jobs.set(seq, { fn, ms, every: false });
      return seq;
    },
    clearTimeout(id) {
      jobs.delete(id);
    },
    count(every) {
      return [...jobs.values()].filter((j) => j.every === every).length;
    },
    fireTimeouts() {
      for (const [id, job] of [...jobs]) {
        if (job.every) continue;
        jobs.delete(id);
        job.fn();
      }
    },
  };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

async function settle() {
  for (let i = 0; i < 6; i += 1) await flush();
}

/** A desk we drive by hand: a clock, a probe answer, and the overlay's own window. */
function rig(opts) {
  const o = opts || {};
  const state = { t: 0, off: false, visible: true, enabled: o.enabled !== false, asked: [], reshows: 0, moves: 0 };
  const timers = fakeTimers();
  const probe = {
    ask(id) {
      state.asked.push(id);
      return Promise.resolve({ gone: false, on: !state.off, cloaked: state.off ? 2 : 0 });
    },
  };
  const win = {
    hwnd: () => OWN,
    visible: () => state.visible,
    reshow: () => {
      state.reshows += 1;
      if (o.reshowWorks !== false) state.off = false;
    },
  };
  if (o.move) {
    win.move = () => {
      state.moves += 1;
      return o.move(state);
    };
  }
  const follower = V.createFollower({
    probe,
    win,
    timers,
    now: () => state.t,
    enabled: () => state.enabled,
    pollMs: 750,
    settleMs: 300,
  });
  return { state, timers, follower };
}

test("the probe answer: manager first, shell cloak only when the manager could not say", () => {
  assert.deepEqual(V.parseProbeText("1 0\r\n"), { gone: false, on: true, cloaked: 0, desk: "" });
  assert.deepEqual(V.parseProbeText("0 2\r\n"), { gone: false, on: false, cloaked: 2, desk: "" });
  assert.deepEqual(V.parseProbeText("gone"), { gone: true, on: null, cloaked: 0, desk: "" });
  assert.equal(V.parseProbeText("bad"), null);
  assert.equal(V.parseProbeText(""), null);
  assert.equal(V.offDesktop(V.parseProbeText("0 0")), true);
  assert.equal(V.offDesktop(V.parseProbeText("1 2")), false);
  assert.equal(V.offDesktop(V.parseProbeText("? 2")), true);
  assert.equal(V.offDesktop(V.parseProbeText("? 1")), false);
  assert.equal(V.offDesktop(V.parseProbeText("? 0")), false);
  assert.equal(V.offDesktop(V.parseProbeText("gone")), false);
  assert.equal(V.offDesktop(null), false);
  assert.equal(V.CLOAKED_SHELL, 2);
});

test("only a plain decimal HWND goes down the pipe", () => {
  assert.equal(V.cleanHwnd("3934886"), "3934886");
  assert.equal(V.cleanHwnd(42n), "42");
  assert.equal(V.cleanHwnd(7), "7");
  for (const bad of ["", "0", "-5", "abc", "12 34", "12\n34", "0x10", null, undefined, "1".repeat(21)]) {
    assert.equal(V.cleanHwnd(bad), "", String(bad));
  }
});

test("a desktop switch brings the overlay over after the settle wait", async () => {
  const { state, timers, follower } = rig();
  assert.equal(follower.start(), true);
  await settle();
  assert.equal(timers.count(true), 1);
  assert.equal(state.reshows, 0);
  state.t = 1000;
  state.off = true;
  assert.equal(await follower.tick("poll"), null);
  assert.equal(state.reshows, 0, "first sight only arms the settle wait");
  assert.equal(timers.count(false), 1);
  state.t = 1300;
  timers.fireTimeouts();
  await settle();
  assert.equal(state.reshows, 1);
  assert.equal(follower.stats.reshows, 1);
  state.t = 2050;
  assert.equal(await follower.tick("poll"), null);
  assert.equal(state.reshows, 1, "back on the current desktop, nothing more to do");
  assert.ok(state.asked.every((id) => id === OWN));
  follower.stop();
  assert.equal(timers.count(true), 0);
});

test("a poll that already waited the settle time acts without the timer", async () => {
  const { state, follower } = rig();
  follower.start();
  await settle();
  state.off = true;
  state.t = 1000;
  await follower.tick("poll");
  state.t = 1750;
  assert.equal(await follower.tick("poll"), "reshow");
  assert.equal(state.reshows, 1);
});

test("a move that fails falls back to hide, showInactive, and always-on-top", async () => {
  for (const move of [() => Promise.resolve(false), () => Promise.reject(new Error("E_ACCESSDENIED")), () => true]) {
    const { state, follower } = rig({ move });
    follower.start();
    await settle();
    state.off = true;
    state.t = 1000;
    await follower.tick("poll");
    state.t = 1300;
    const how = await follower.tick("settle");
    assert.equal(how, "reshow");
    assert.equal(state.moves, 1);
    assert.equal(state.reshows, 1);
    assert.equal(follower.stats.moves, 0);
  }
  const { state, follower } = rig({
    move: (s) => {
      s.off = false;
      return Promise.resolve(true);
    },
  });
  follower.start();
  await settle();
  state.off = true;
  state.t = 1000;
  await follower.tick("poll");
  state.t = 1300;
  assert.equal(await follower.tick("settle"), "move");
  assert.equal(state.reshows, 0);
  assert.equal(follower.stats.moves, 1);
});

test("a fast flip through desktops does not bounce the pet", async () => {
  const { state, timers, follower } = rig();
  follower.start();
  await settle();
  state.off = true;
  state.t = 1000;
  await follower.tick("poll");
  state.off = false;
  state.t = 1100;
  await follower.tick("poll");
  state.t = 1300;
  timers.fireTimeouts();
  await settle();
  assert.equal(state.reshows, 0, "back before the settle wait ended");

  state.off = true;
  state.t = 2000;
  await follower.tick("poll");
  state.t = 2300;
  assert.equal(await follower.tick("settle"), "reshow");
  assert.equal(state.reshows, 1);
  state.off = true;
  state.t = 2450;
  assert.equal(await follower.tick("poll"), null);
  assert.equal(await follower.tick("settle"), null);
  assert.equal(state.reshows, 1, "quiet for the settle time after acting");
});

test("a re-show that does not land stops after three tries until the overlay is back", async () => {
  const { state, follower } = rig({ reshowWorks: false });
  follower.start();
  await settle();
  state.off = true;
  for (let step = 1; step <= 12; step += 1) {
    state.t = step * 1000;
    await follower.tick("poll");
    state.t = step * 1000 + 300;
    await follower.tick("settle");
  }
  assert.equal(state.reshows, V.MAX_MISSES);
  state.off = false;
  state.t = 20000;
  await follower.tick("poll");
  state.off = true;
  state.t = 21000;
  await follower.tick("poll");
  state.t = 21300;
  assert.equal(await follower.tick("settle"), "reshow");
  assert.equal(state.reshows, V.MAX_MISSES + 1);
});

test("follow turned off stays off: no probe, no re-show", async () => {
  const { state, timers, follower } = rig({ enabled: false });
  state.off = true;
  follower.start();
  await settle();
  for (let step = 1; step <= 5; step += 1) {
    state.t = step * 1000;
    await follower.tick("poll");
    timers.fireTimeouts();
    await settle();
  }
  assert.deepEqual(state.asked, []);
  assert.equal(state.reshows, 0);

  const second = rig();
  second.follower.start();
  await settle();
  second.state.off = true;
  second.state.t = 1000;
  await second.follower.tick("poll");
  second.state.enabled = false;
  second.state.t = 1300;
  second.timers.fireTimeouts();
  await settle();
  assert.equal(second.state.reshows, 0, "switched off during the settle wait");
  second.follower.stop();
  assert.equal(second.follower.running(), false);
  assert.equal(await second.follower.tick("poll"), null);
});

test("a pet the keeper hid is not shown again", async () => {
  const { state, follower } = rig();
  follower.start();
  await settle();
  state.visible = false;
  state.off = true;
  const before = state.asked.length;
  for (let step = 1; step <= 3; step += 1) {
    state.t = step * 1000;
    await follower.tick("poll");
    state.t = step * 1000 + 300;
    await follower.tick("settle");
  }
  assert.equal(state.asked.length, before);
  assert.equal(state.reshows, 0);
});

function fakeSpawn(reply) {
  const calls = [];
  const spawnFn = (cmd, args, options) => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stdout.setEncoding = () => {};
    child.stderr = new EventEmitter();
    child.stderr.setEncoding = () => {};
    child.writes = [];
    child.killed = false;
    child.stdin = {
      write(text) {
        child.writes.push(text);
        if (text !== "quit\n" && reply) setImmediate(() => child.stdout.emit("data", reply(text)));
      },
    };
    child.kill = () => {
      child.killed = true;
    };
    calls.push({ cmd, args, options, child });
    return child;
  };
  return { calls, spawnFn };
}

test("the helper pipe carries the overlay's own HWND and nothing else", async () => {
  const { calls, spawnFn } = fakeSpawn(() => "0 2\r\nEND\r\n");
  const probe = V.createProbe({ spawn: spawnFn, timeoutMs: 500 });
  assert.equal(await probe.ask("not-a-window"), null);
  assert.equal(calls.length, 0, "a bad id never spawns the helper");
  assert.deepEqual(await probe.ask(OWN), { gone: false, on: false, cloaked: 2, desk: "" });
  assert.deepEqual(await probe.ask(OWN), { gone: false, on: false, cloaked: 2, desk: "" });
  assert.equal(calls.length, 1, "one helper for every ask");
  const [{ cmd, args, options, child }] = calls;
  assert.equal(cmd, "powershell.exe");
  assert.ok(args.includes("-NoProfile"));
  assert.equal(args[args.length - 1], V.PROBE_SCRIPT);
  assert.equal(options.windowsHide, true);
  assert.deepEqual(child.writes, [`${OWN}\n`, `${OWN}\n`]);
  probe.dispose();
  assert.equal(child.writes[child.writes.length - 1], "quit\n");
  assert.equal(child.killed, true);
});

test("a helper that dies or stalls answers null", async () => {
  const dying = fakeSpawn(null);
  const probe = V.createProbe({ spawn: dying.spawnFn, timeoutMs: 500 });
  const pending = probe.ask(OWN);
  dying.calls[0].child.emit("exit", 1);
  assert.equal(await pending, null);

  const stalled = fakeSpawn(null);
  const slow = V.createProbe({ spawn: stalled.spawnFn, timeoutMs: 20 });
  assert.equal(await slow.ask(OWN), null);
  assert.equal(stalled.calls[0].child.killed, true, "a stall kills the helper so answers cannot drift");
});

test("privacy: the helper asks about one HWND and never reads other windows", () => {
  const script = V.PROBE_SCRIPT;
  for (const banned of [
    "EnumWindows",
    "EnumChildWindows",
    "GetWindowText",
    "GetClassName",
    "GetForegroundWindow",
    "FindWindow",
    "GetWindowThreadProcessId",
    "GetWindowModuleFileName",
    "MainWindowTitle",
    "Get-Process",
    "GetTopWindow",
    "GetWindow(",
  ]) {
    assert.equal(script.includes(banned), false, banned);
    assert.equal(moduleSrc.includes(banned), false, banned);
  }
  assert.match(script, /IsWindowOnCurrentVirtualDesktop\(h, out current\)/);
  assert.match(script, /DwmGetWindowAttribute\(h, DWMWA_CLOAKED/);
  assert.match(script, /if \(!IsWindow\(h\)\) return "gone"/);
  assert.equal(script.includes(".MoveWindowToDesktop("), false, "no cross-process move is attempted");
  // ADR 0132: the desktop id is read for the same one HWND, and only that one.
  assert.match(script, /mgr\.GetWindowDesktopId\(h, out g\)/);
  assert.equal(script.split("GetWindowDesktopId(").length - 1, 2, "declared once, called once");
  assert.doesNotMatch(moduleSrc, /require\("\.\/windows-enum\.cjs"\)/);
  assert.doesNotMatch(moduleSrc, /listRaw/);
});

test("vdesk.json turns follow off; a missing or bad file leaves it on", () => {
  const files = new Map();
  const fsImpl = {
    readFileSync(file) {
      if (!files.has(file)) {
        const err = new Error("missing");
        err.code = "ENOENT";
        throw err;
      }
      return files.get(file);
    },
    writeFileSync(file, body) {
      files.set(file, body);
    },
    mkdirSync() {},
  };
  const dir = join("C:", "house");
  const file = join(dir, V.FILE);
  assert.equal(V.FILE, "vdesk.json");
  assert.equal(V.readFollow(dir, fsImpl), true);
  assert.equal(V.writeFollow(dir, fsImpl, false), true);
  assert.equal(files.get(file), '{"follow":false}\n');
  assert.equal(V.readFollow(dir, fsImpl), false);
  assert.equal(V.writeFollow(dir, fsImpl, true), true);
  assert.equal(V.readFollow(dir, fsImpl), true);
  files.set(file, "{not json");
  assert.equal(V.readFollow(dir, fsImpl), true);
  assert.equal(V.readFollow("", fsImpl), true);
  assert.equal(V.writeFollow("", fsImpl, false), false);
});

test("the overlay follows on Windows only; Spaces and workspaces keep Electron's pin", () => {
  assert.equal(Desk.desktopFollow("win32"), true);
  assert.equal(Desk.desktopFollow("darwin"), false);
  assert.equal(Desk.desktopFollow("linux"), false);
  assert.equal(Desk.spacesWalk("win32"), false);
  assert.match(mainSrc, /require\("\.\/vdesk-win\.cjs"\)/);
  assert.match(mainSrc, /if \(!Desk\.desktopFollow\(process\.platform\) \|\| vdeskFollower\) return;/);
  assert.match(mainSrc, /if \(Desk\.spacesWalk\(process\.platform\)\) win\.setVisibleOnAllWorkspaces\(true, \{ visibleOnFullScreen: true \}\);/);
  assert.match(mainSrc, /win\.hide\(\);\s*win\.showInactive\(\);\s*fitWorkArea\(\);/);
  assert.match(mainSrc, /label: "Follow me across desktops",\s*type: "checkbox"/);
  assert.match(mainSrc, /VDesk\.writeFollow\(app\.getPath\("userData"\), fs, followDesktops\)/);
  assert.match(mainSrc, /hwndFromHandle\(win\.getNativeWindowHandle\(\)\)/);
  assert.match(mainSrc, /stopDesktopFollow\(\);/);
  assert.ok(pkg.build.files.includes("vdesk-win.cjs"));
  assert.match(pkg.scripts.test, /vdesk-win\.test\.cjs/);
});

const DESK_A = "8f3c1a52-0d4e-4b7a-9c61-2e5d7f90ab01";
const DESK_B = "1b2c3d4e-5f60-4172-8394-a5b6c7d8e9f0";

/** Two desktops: the keeper's current one and the one the overlay's own window is on. */
function deskRig(opts) {
  const o = opts || {};
  const state = { t: 0, current: DESK_A, overlay: DESK_A, visible: true, enabled: true, arrivals: [], reshows: 0 };
  const timers = fakeTimers();
  const probe = {
    ask() {
      return Promise.resolve({ gone: false, on: state.overlay === state.current, cloaked: state.overlay === state.current ? 0 : 2, desk: state.overlay });
    },
  };
  const follower = V.createFollower({
    probe,
    timers,
    now: () => state.t,
    enabled: () => state.enabled,
    win: {
      hwnd: () => OWN,
      visible: () => state.visible,
      reshow: () => {
        state.reshows += 1;
        state.overlay = state.current;
      },
    },
    onArrive: o.noArrive ? undefined : (move) => state.arrivals.push(move),
  });
  return { state, timers, follower };
}

test("the probe answer carries the overlay's own desktop id, and GUID_NULL is no id", () => {
  assert.deepEqual(V.parseProbeText(`1 0 ${DESK_A.toUpperCase()}\r\n`), { gone: false, on: true, cloaked: 0, desk: DESK_A });
  assert.deepEqual(V.parseProbeText(`0 2 {${DESK_B}}`), { gone: false, on: false, cloaked: 2, desk: DESK_B });
  assert.equal(V.parseProbeText("1 0 -").desk, "");
  assert.equal(V.parseProbeText("1 0 00000000-0000-0000-0000-000000000000").desk, "");
  assert.equal(V.parseProbeText("1 0 not-a-guid").desk, "");
});

test("a desktop switch tells the renderer which desktop the pet left and which it is on", async () => {
  const { state, timers, follower } = deskRig();
  follower.start();
  await settle();
  assert.equal(follower.desk(), DESK_A);
  assert.deepEqual(state.arrivals, [], "the first desktop after start only records");
  state.current = DESK_B;
  state.t = 1000;
  await follower.tick("poll");
  state.t = 1300;
  timers.fireTimeouts();
  await settle();
  assert.equal(state.reshows, 1);
  assert.deepEqual(state.arrivals, [], "no arrival until the manager says the overlay is here");
  state.t = 2000;
  await follower.tick("poll");
  assert.deepEqual(state.arrivals, [{ from: DESK_A, to: DESK_B }]);
  state.t = 2750;
  await follower.tick("poll");
  assert.equal(state.arrivals.length, 1, "staying on a desktop is not another arrival");
  assert.equal(follower.stats.arrivals, 1);
});

test("follow off: no probe, no arrival; turning it back on starts a fresh record", async () => {
  const { state, follower } = deskRig();
  state.enabled = false;
  follower.start();
  await settle();
  state.current = DESK_B;
  state.t = 5000;
  await follower.tick("poll");
  assert.deepEqual(state.arrivals, []);
  assert.equal(follower.desk(), "");
  follower.stop();
  assert.equal(follower.desk(), "");
});

test("a follower without onArrive behaves exactly as before", async () => {
  const { state, timers, follower } = deskRig({ noArrive: true });
  follower.start();
  await settle();
  state.current = DESK_B;
  state.t = 1000;
  await follower.tick("poll");
  state.t = 1300;
  timers.fireTimeouts();
  await settle();
  state.t = 2000;
  await follower.tick("poll");
  assert.equal(state.reshows, 1);
  assert.equal(follower.stats.arrivals, 1);
});

test("main forwards the two desktop ids to the renderer and nothing else", () => {
  assert.match(mainSrc, /onArrive: \(move\) => \{\s*if \(win && !win\.isDestroyed\(\)\) win\.webContents\.send\("vdesk-arrive", move\);/);
  assert.match(preloadSrc, /onDeskArrive: \(fn\) =>/);
  assert.match(preloadSrc, /ipcRenderer\.on\("vdesk-arrive", wrapped\)/);
});
