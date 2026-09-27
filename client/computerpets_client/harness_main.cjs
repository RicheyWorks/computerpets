/**
 * Buffffff app_harness: load the real desktop/main.cjs under a stand-in Electron and drive its
 * IPC handlers and tray menus. Nothing opens: no window, no tray icon, no network, no quit.
 * app.quit is counted, not called. Timers main starts are recorded and never run. A fake fetch
 * answers plate reads, so radio and market look-ups stay offline and deterministic.
 */
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Module = require("node:module");

const DESKTOP = path.join(__dirname, "..", "..", "desktop");
const RENDERER = path.join(DESKTOP, "renderer");
const MAIN = path.join(DESKTOP, "main.cjs");

function ok(detail, extras = {}, trace = []) {
  return { ok: true, detail, extras, trace };
}

function fail(error, extras = {}, trace = []) {
  return { ok: false, detail: error, error, extras, trace };
}

/** A reversible stand-in for the OS secret store: never echoes the text. */
function codec(text) {
  return Buffer.from(String(text), "utf8").map((b) => b ^ 0x5a);
}

function makeContents(ctx) {
  const contents = {
    send: (channel, ...args) => ctx.sent.push([channel, ...args]),
    on() {},
    once() {},
    setWindowOpenHandler() {},
    session: { setPermissionRequestHandler() {}, setPermissionCheckHandler() {} },
    getURL: () => "file:///desktop/renderer/index.html",
    executeJavaScript: async () => null,
  };
  return new Proxy(contents, { get: (t, p) => (p in t ? t[p] : () => undefined) });
}

function makeElectron(ctx) {
  class FakeWindow {
    constructor(opts) {
      this.opts = opts || {};
      this.visible = false;
      this.webContents = makeContents(ctx);
      ctx.windows.push(this);
      return new Proxy(this, { get: (t, p) => (p in t ? t[p] : () => undefined) });
    }
    loadFile(file, options) {
      this.file = file;
      this.loadOpts = options || {};
    }
    focus() {
      this.focused = (this.focused || 0) + 1;
    }
    once() {}
    on() {}
    isVisible() {
      return this.visible;
    }
    isDestroyed() {
      return false;
    }
    isMinimized() {
      return false;
    }
    show() {
      this.visible = true;
    }
    showInactive() {
      this.visible = true;
    }
    hide() {
      this.visible = false;
    }
    getBounds() {
      return { x: 0, y: 0, width: 1280, height: 800 };
    }
    getNativeWindowHandle() {
      return Buffer.alloc(8);
    }
  }
  class FakeTray {
    constructor() {
      ctx.trays.push(this);
    }
    setContextMenu(menu) {
      ctx.trayMenus.push(menu.template);
    }
    setToolTip(tip) {
      ctx.tips.push(tip);
    }
    setImage() {}
    on() {}
    popUpContextMenu() {}
  }
  class FakeNotification {
    static isSupported() {
      return true;
    }
    constructor(opts) {
      this.opts = opts;
      this.handlers = {};
    }
    on(ev, fn) {
      this.handlers[ev] = fn;
    }
    show() {
      ctx.notes.push(this);
    }
  }
  const display = { workArea: { x: 0, y: 0, width: 1280, height: 800 }, bounds: { x: 0, y: 0, width: 1280, height: 800 }, scaleFactor: 1 };
  return {
    app: {
      whenReady: () => ctx.ready,
      on: (ev, fn) => {
        (ctx.appEvents[ev] = ctx.appEvents[ev] || []).push(fn);
      },
      quit: () => {
        ctx.quits += 1;
      },
      relaunch: () => {
        ctx.relaunches += 1;
      },
      setAppUserModelId() {},
      setPath() {},
      getPath: () => ctx.userData,
      requestSingleInstanceLock: () => true,
      commandLine: { appendSwitch() {} },
      dock: { hide() {} },
    },
    BrowserWindow: FakeWindow,
    Tray: FakeTray,
    Menu: {
      buildFromTemplate: (template) => ({
        template,
        popup: () => ctx.popups.push(template),
      }),
      setApplicationMenu: (menu) => ctx.appMenus.push(menu && menu.template),
    },
    ipcMain: {
      on: (channel, fn) => ctx.ipcOn.set(channel, fn),
      handle: (channel, fn) => ctx.ipcHandle.set(channel, fn),
    },
    nativeImage: {
      createFromPath: () => ({ resize: () => ({ setTemplateImage() {} }), setTemplateImage() {} }),
    },
    screen: {
      getPrimaryDisplay: () => display,
      getDisplayNearestPoint: () => display,
      getCursorScreenPoint: () => ({ x: 0, y: 0 }),
      getAllDisplays: () => [display],
      on() {},
    },
    Notification: FakeNotification,
    powerMonitor: { on() {} },
    shell: { openExternal: (url) => ctx.opened.push(url) },
    safeStorage: {
      isEncryptionAvailable: () => ctx.encryption,
      encryptString: (text) => codec(text),
      decryptString: (buf) => codec(buf).toString("utf8"),
    },
  };
}

/** The GPU gate a row asks for (bootMain opts.gate); writeExpect answers are counted on the ctx. */
const GPU = { gate: null, ctx: null };

const STUBS = {
  "./gpu-path.cjs": {
    gate: async () => GPU.gate || { open: true, path: "hardware", label: "GPU path · hardware (harness)" },
    decide: (p) => ({ open: true, path: p, label: "GPU path · harness" }),
    writeExpect: (_dir, _fs, want) => {
      if (!GPU.ctx) return false;
      GPU.ctx.expects.push(want);
      return GPU.ctx.writeExpect === true;
    },
  },
  "./gpu-sense.cjs": { read: () => new Promise(() => {}) },
  "./windows-enum.cjs": { listRaw: () => new Promise(() => {}), disposePump() {} },
  "./vdesk-win.cjs": {
    readFollow: () => false,
    writeFollow() {},
    createProbe: () => ({ dispose() {} }),
    createFollower: () => ({ start() {}, stop() {} }),
  },
};

/**
 * Boot the real main.cjs once in this process. The ready promise resolves so the tray and the
 * overlay window are built on the stand-ins; the hit, window, GPU, and desktop ticks are recorded only.
 */
async function bootMain(opts = {}) {
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), "computerpets-harness-main-"));
  const ctx = {
    expects: [],
    writeExpect: false,
    userData,
    encryption: true,
    ready: Promise.resolve(),
    appEvents: {},
    ipcOn: new Map(),
    ipcHandle: new Map(),
    sent: [],
    windows: [],
    trays: [],
    trayMenus: [],
    tips: [],
    popups: [],
    appMenus: [],
    notes: [],
    opened: [],
    intervals: [],
    fetches: [],
    fetchImpl: null,
    quits: 0,
    relaunches: 0,
  };
  GPU.gate = opts.gate || null;
  GPU.ctx = ctx;
  const electron = makeElectron(ctx);
  const realLoad = Module._load;
  Module._load = function load(request, parent, isMain) {
    if (request === "electron") return electron;
    if (parent && parent.filename === MAIN && STUBS[request]) return STUBS[request];
    return realLoad.call(this, request, parent, isMain);
  };
  global.setInterval = (fn, ms) => {
    ctx.intervals.push(ms);
    return { ref() {}, unref() {}, hasRef: () => false };
  };
  global.clearInterval = () => {};
  globalThis.fetch = async (url, init) => {
    const headers = (init && init.headers) || {};
    ctx.fetches.push({ url: String(url), ua: headers["User-Agent"] || "" });
    if (!ctx.fetchImpl) throw new Error("offline harness: no fetch answer");
    return ctx.fetchImpl(String(url), init);
  };
  delete process.env.COMPUTERPETS_GUI_HARNESS;
  require(MAIN);
  // bootDesk awaits the ready promise and the stubbed GPU gate before it builds the tray.
  for (let i = 0; i < 20 && !ctx.trayMenus.length; i += 1) await new Promise((r) => setImmediate(r));
  ctx.send = (channel, ...args) => {
    const fn = ctx.ipcOn.get(channel);
    if (!fn) throw new Error(`main has no ipc listener ${channel}`);
    const event = { sender: ctx.windows[0] && ctx.windows[0].webContents, returnValue: undefined };
    fn(event, ...args);
    return event.returnValue;
  };
  ctx.sendSync = ctx.send;
  ctx.invoke = async (channel, ...args) => {
    const fn = ctx.ipcHandle.get(channel);
    if (!fn) throw new Error(`main has no ipc handler ${channel}`);
    return fn({ sender: ctx.windows[0] && ctx.windows[0].webContents }, ...args);
  };
  ctx.tray = () => ctx.trayMenus[ctx.trayMenus.length - 1] || [];
  ctx.cleanup = () => {
    try {
      fs.rmSync(userData, { recursive: true, force: true });
    } catch {
      /* temp */
    }
  };
  return ctx;
}

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(body) };
}

function item(template, label) {
  return (template || []).find((row) => row && row.label === label) || null;
}

function checkedKey(submenu, roster) {
  const row = (submenu || []).find((r) => r.checked);
  if (!row) return "";
  const hit = roster.find((r) => row.label === `${r.name} — ${r.speciesLabel}`);
  return hit ? hit.key : "";
}

/**
 * Send a notification the way the overlay does, then click it the way the keeper does.
 * Returns what the overlay was told and whether it is showing.
 */
function clickNote(ctx, payload) {
  const win = ctx.windows[0];
  win.visible = false;
  const before = ctx.notes.length;
  ctx.send("notify", payload);
  const note = ctx.notes[before];
  if (!note || typeof note.handlers.click !== "function") return { shown: false, command: null, body: "" };
  const sent = ctx.sent.length;
  note.handlers.click();
  const commands = ctx.sent.slice(sent).filter((m) => m[0] === "command");
  return { shown: win.visible === true, command: commands.length === 1 ? commands[0][1] : null, body: note.opts.body };
}

/** A clock note click shows the overlay and hands the saved line back; care is not opened. */
function clockNoteFails(ctx, C, rang, key, line) {
  const fails = [];
  const named = C.clockNote(rang, "Soot", key, line);
  const click = clickNote(ctx, named);
  const want = line && line.kind !== "do" ? C.clipLine(line.text) : "";
  if (!click.shown) fails.push(`${rang} note click did not show the overlay`);
  if (!click.command || click.command.type !== "clock-note") fails.push(`${rang} note click sent ${click.command ? click.command.type : "nothing"}, not clock-note`);
  else if (click.command.line !== want || click.command.key !== key || click.command.clock !== rang) fails.push(`${rang} note click lost its line or guest`);
  if (click.body !== (want || (rang === "alarm" ? "The clock asked." : "The timer is done."))) fails.push(`${rang} note body is ${click.body}`);
  const care = clickNote(ctx, { title: "Soot", body: "Soot is hungry.", key, need: "hunger" });
  if (!care.command || care.command.type !== "open-care" || care.command.need !== "hunger") fails.push("a care note no longer opens care on its need");
  const pet = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8").replace(/\r\n/g, "\n");
  if (!/cmd\.type === "clock-note"[\s\S]{0,40}showClockNote\(cmd\)/.test(pet)) fails.push("pet.js does not route a clock note to showClockNote");
  const show = pet.slice(pet.indexOf("function showClockNote("), pet.indexOf("function openCareFromNotify("));
  if (!/bubbleText\.textContent = line/.test(show) || /openKeeperCard|careForNeed/.test(show)) fails.push("showClockNote does not just show the line");
  return fails;
}

function loadFresh(name) {
  const file = path.join(RENDERER, name);
  delete require.cache[require.resolve(file)];
  return require(file);
}

/** Wire the renderer card store to main's card-get / card-set, as preload does. */
function cardThroughMain(ctx) {
  const store = new Map();
  global.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  global.desk = {
    cardGet: () => ctx.sendSync("card-get"),
    cardSet: (data) => ctx.send("card-set", data),
  };
  const C = loadFresh("card.js");
  const Presence = require(path.join(DESKTOP, "presence.cjs"));
  const file = Presence.houseFile(ctx.userData, "card.json");
  return { C, file, store, forget: () => store.clear() };
}

async function trayOnTheDesk() {
  const ctx = await bootMain();
  try {
    const Desk = require(path.join(RENDERER, "desk.js"));
    const roster = JSON.parse(fs.readFileSync(path.join(RENDERER, "roster.json"), "utf8"));
    const fails = [];
    const t0 = ctx.tray();
    const onDesk = item(t0, "On the desk");
    const companions = item(t0, "Companions");
    if (!onDesk || !Array.isArray(onDesk.submenu)) return fail("tray has no On the desk submenu", { labels: t0.map((r) => r.label) });
    const picks = Desk.deskPicks().map((key) => roster.find((r) => r.key === key)).filter(Boolean);
    const want = picks.map((r) => `${r.name} — ${r.speciesLabel}`);
    const got = onDesk.submenu.map((r) => r.label);
    if (JSON.stringify(got) !== JSON.stringify(want)) fails.push("On the desk rows are not the desk picks in order");
    if (!companions || companions.submenu.length !== roster.length) fails.push(`Companions lists ${companions ? companions.submenu.length : 0} of ${roster.length}`);
    const start = checkedKey(onDesk.submenu, roster);
    if (start !== "red_panda") fails.push(`first checked guest is ${start || "none"}`);
    const target = picks.find((r) => r.key !== start);
    const sentBefore = ctx.sent.length;
    onDesk.submenu[picks.indexOf(target)].click();
    const switched = ctx.sent.slice(sentBefore).filter((m) => m[0] === "switch");
    if (switched.length !== 1 || switched[0][1] !== target.key) fails.push("tray click did not send one switch to the overlay");
    const t1 = ctx.tray();
    if (checkedKey(item(t1, "On the desk").submenu, roster) !== target.key) fails.push("rebuilt tray does not check the picked guest");
    const status = t1.find((r) => r.enabled === false && String(r.label).startsWith(target.name));
    if (!status) fails.push("tray status line does not name the picked guest");
    // The overlay's own switch-pet: an unknown key is ignored, a real guest is switched.
    const n = ctx.sent.length;
    ctx.send("switch-pet", "not_a_guest");
    if (ctx.sent.length !== n) fails.push("switch-pet sent a switch for an unknown key");
    const third = picks.find((r) => r.key !== start && r.key !== target.key);
    ctx.send("switch-pet", third.key);
    const last = ctx.sent[ctx.sent.length - 1];
    if (!last || last[0] !== "switch" || last[1] !== third.key) fails.push("switch-pet did not switch a real guest");
    if (checkedKey(item(ctx.tray(), "On the desk").submenu, roster) !== third.key) fails.push("tray did not follow switch-pet");
    // Hide the window / Show: the overlay the alarm keeps ringing behind.
    const win = ctx.windows[0];
    win.visible = true;
    item(ctx.tray(), "Hide the window").click();
    const hidden = win.visible === false;
    item(ctx.tray(), "Show").click();
    const shown = win.visible === true;
    if (!hidden || !shown) fails.push("Hide the window / Show did not hide and show the overlay");
    const picked = picks.map((r) => r.key);
    return fails.length
      ? fail(fails.join("; "), { picks: picked })
      : ok(`On the desk ${picks.length} picks; tray + switch-pet switch ${target.key}, ${third.key}; hide/show`, {
          picks: picked,
          companions: companions.submenu.length,
          switched: [target.key, third.key],
        }, [`picks=${picks.length}`, `companions=${companions.submenu.length}`, `tray_switch=${target.key}`, `ipc_switch=${third.key}`, "unknown_key=ignored", "hide_show=ok"]);
  } finally {
    ctx.cleanup();
  }
}

async function quitDesk() {
  const ctx = await bootMain();
  try {
    const fails = [];
    if (ctx.quits !== 0) fails.push("main quit during boot");
    ctx.send("quit-desk");
    const afterIpc = ctx.quits;
    if (afterIpc !== 1) fails.push(`quit-desk asked app.quit ${afterIpc} times`);
    item(ctx.tray(), "Quit").click();
    if (ctx.quits !== 2) fails.push("tray Quit did not ask app.quit");
    ctx.send("pet-menu", { x: 10, y: 10 });
    const menu = ctx.popups[ctx.popups.length - 1];
    const quitRow = item(menu, "Quit");
    if (!quitRow) fails.push("pet menu has no Quit");
    else quitRow.click();
    if (ctx.quits !== 3) fails.push("pet menu Quit did not ask app.quit");
    for (const fn of ctx.appEvents["will-quit"] || []) fn();
    const beforeClosed = ctx.quits;
    for (const fn of ctx.appEvents["window-all-closed"] || []) fn();
    if (ctx.quits !== beforeClosed + 1) fails.push("closing the last window does not quit");
    const pet = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8");
    const preload = fs.readFileSync(path.join(DESKTOP, "preload.cjs"), "utf8");
    const html = fs.readFileSync(path.join(RENDERER, "index.html"), "utf8");
    const off = pet.slice(pet.indexOf("if (hudOff) {\n") >= 0 ? pet.indexOf("if (hudOff) {\n") : pet.indexOf("if (hudOff) {\r\n"));
    const armAt = off.indexOf("offArmed = true");
    const quitAt = off.indexOf("window.desk.quit()");
    if (!(armAt > 0 && quitAt > armAt)) fails.push("Turn off does not ask twice before quitting");
    if (!/quit: \(\) => ipcRenderer\.send\("quit-desk"\)/.test(preload)) fails.push("preload quit is not quit-desk");
    if (!/id="hud-off"[^>]*>Turn off</.test(html)) fails.push("keeper card has no Turn off button");
    const C = loadFresh("card.js");
    if (!/desktop\.ps1/.test(C.QUIT_TRUTH)) fails.push("Turn off truth does not say how to start again");
    return fails.length
      ? fail(fails.join("; "), { quits: ctx.quits })
      : ok("quit-desk, tray Quit, pet-menu Quit each ask app.quit once (stand-in); Turn off asks twice", { quits: ctx.quits }, [
          "quit-desk=1",
          "tray_quit=1",
          "pet_menu_quit=1",
          "window_all_closed=quit",
          "turn_off=armed_then_quit",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function mindGetSet() {
  const ctx = await bootMain();
  try {
    const Presence = require(path.join(DESKTOP, "presence.cjs"));
    const SECRET = "xai-harness-0123456789abcdef";
    const mind = {
      default: { plugin: "xai", model: "grok-4.5", baseUrl: "https://api.x.ai/v1", apiKey: SECRET },
      voice: "browser",
    };
    const fails = [];
    const kept = await ctx.invoke("mind-set", mind);
    const file = Presence.houseFile(ctx.userData, "mind.json");
    const disk = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    if (!kept || kept.kept !== "os") fails.push(`mind-set kept ${kept && kept.kept}`);
    if (!disk) fails.push("mind-set wrote no mind.json");
    if (disk.includes(SECRET) || disk.includes("apiKey")) fails.push("mind.json holds the plain key");
    const back = ctx.sendSync("mind-get");
    if (!back || !back.default || back.default.apiKey !== SECRET) fails.push("mind-get did not open the sealed key");
    if (!back || back.default.model !== "grok-4.5" || back.voice !== "browser") fails.push("mind-get lost the plugin or voice");
    // No secret store: the key is not written at all.
    ctx.encryption = false;
    ctx.userData = fs.mkdtempSync(path.join(os.tmpdir(), "computerpets-harness-mind-"));
    const bare = await ctx.invoke("mind-set", mind);
    const file2 = Presence.houseFile(ctx.userData, "mind.json");
    const disk2 = fs.existsSync(file2) ? fs.readFileSync(file2, "utf8") : "";
    if (!bare || bare.kept !== "none") fails.push(`with no secret store mind-set kept ${bare && bare.kept}`);
    if (disk2.includes(SECRET)) fails.push("with no secret store the key reached the disk");
    const back2 = ctx.sendSync("mind-get");
    if (back2 && back2.default && back2.default.apiKey) fails.push("with no secret store mind-get invented a key");
    fs.rmSync(ctx.userData, { recursive: true, force: true });
    return fails.length
      ? fail(fails.join("; "))
      : ok("mind-set seals the key (os), mind-get opens it; no store keeps no key", { kept: kept.kept, bare: bare.kept }, [
          "mind_set=os",
          "disk_plain_key=0",
          "mind_get=opened",
          "no_store=none",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function savedLines() {
  const ctx = await bootMain();
  try {
    const { C, file, forget } = cardThroughMain(ctx);
    const fails = [];
    const KEY = "crow";
    let card = C.load();
    if (C.guestOf(card, KEY).lines.length) fails.push("a fresh card has saved lines");
    card = C.addLine(card, KEY, "  A ribbon   I was keeping. ", "say");
    card = C.addLine(card, KEY, "sit", "do");
    card = C.addLine(card, KEY, "   ", "say");
    card = C.addLine(card, KEY, "x".repeat(400), "say");
    let lines = C.guestOf(card, KEY).lines;
    if (lines.length !== 3) fails.push(`blank line was kept (${lines.length} lines)`);
    if (lines[0].text !== "A ribbon I was keeping.") fails.push("saved line was not trimmed");
    if (lines[1].kind !== "do") fails.push("do line lost its kind");
    const clipped = lines[2].text.length;
    if (clipped > 140) fails.push(`long line kept ${clipped} characters`);
    C.save(card);
    const disk = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
    if (!disk || !disk.pets || !disk.pets[KEY] || disk.pets[KEY].lines.length !== 3) fails.push("card-set did not write the lines to card.json");
    forget();
    card = C.load();
    lines = C.guestOf(card, KEY).lines;
    if (lines.length !== 3 || lines[0].text !== "A ribbon I was keeping.") fails.push("card-get did not bring the lines back");
    const ribbon = lines[0].id;
    if (!C.lineById(card, KEY, ribbon) || C.lineById(card, KEY, "l-missing")) fails.push("lineById drifted");
    for (let i = 0; i < 14; i += 1) card = C.addLine(card, KEY, `line ${i}`, "say");
    lines = C.guestOf(card, KEY).lines;
    if (lines.length !== 12 || lines[11].text !== "line 13") fails.push("more than 12 lines are not trimmed to the newest 12");
    card = C.removeLine(card, KEY, lines[11].id);
    C.save(card);
    forget();
    card = C.load();
    if (C.guestOf(card, KEY).lines.length !== 11) fails.push("a removed line came back");
    // An alarm names a saved line; the clock rings that line.
    let named = C.addLine(card, KEY, "Time to stretch.", "say");
    const stretch = C.guestOf(named, KEY).lines.slice(-1)[0];
    named = C.setGuest(named, KEY, { alarm: { on: true, hour: 7, minute: 0, lineId: stretch.id, lastRingDay: "" } });
    const at = new Date(2026, 8, 27, 7, 0, 10).getTime();
    const tick = C.clockTick(C.guestOf(named, KEY), at, at - 1000);
    const rung = C.lineById(named, KEY, tick.lineId);
    if (tick.rang !== "alarm" || !rung || rung.text !== "Time to stretch.") fails.push("the alarm did not ring its saved line");
    return fails.length
      ? fail(fails.join("; "))
      : ok("saved lines trim, clip, cap at 12, persist through card-set/card-get, and ring from the alarm", { clipped }, [
          "blank=skipped",
          `clip=${clipped}`,
          "cap=12",
          "persist=card.json",
          "remove=kept",
          "alarm_line=Time to stretch.",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function alarmClock() {
  const ctx = await bootMain();
  try {
    const { C, forget } = cardThroughMain(ctx);
    const fails = [];
    const KEY = "crow";
    const at = (d, h, m, s = 0) => new Date(2026, 8, d, h, m, s).getTime();
    let card = C.setGuest(C.load(), KEY, { alarm: { on: true, hour: 7, minute: 0, lineId: "", lastRingDay: "" } });
    C.save(card);
    // The overlay hides at 6:58 and the clock keeps looking every second, as pet.js now does.
    let since = at(27, 6, 58);
    const rings = [];
    for (let now = since + 1000; now <= at(27, 7, 4); now += 1000) {
      const guest = C.guestOf(card, KEY);
      const tick = C.clockTick(guest, now, since);
      since = now;
      if (!tick.changed) continue;
      card = C.setGuest(card, KEY, { alarm: tick.alarm, timer: tick.timer });
      C.save(card);
      if (tick.rang) rings.push({ rang: tick.rang, now, lateMs: tick.lateMs });
    }
    if (rings.length !== 1 || rings[0].rang !== "alarm" || rings[0].now !== at(27, 7, 0)) fails.push(`hidden overlay rang ${rings.length} times`);
    // The day it rang is on disk, so a restart the same morning does not ring it again.
    forget();
    card = C.load();
    const day = C.guestOf(card, KEY).alarm.lastRingDay;
    if (day !== "2026-09-27") fails.push(`lastRingDay on disk is ${day || "empty"}`);
    if (C.clockTick(C.guestOf(card, KEY), at(27, 7, 0, 30)).rang) fails.push("a restart in the same minute rang again");
    // A computer asleep from 6:50 to 7:40 rings once, forty minutes late.
    const slow = C.clockTick({ alarm: { on: true, hour: 7, minute: 0 }, timer: C.blankTimer() }, at(28, 7, 40), at(28, 6, 50));
    if (slow.rang !== "alarm" || slow.lateMs !== 40 * 60_000) fails.push("a slow look missed the alarm");
    // Midnight: 23:59 passed while asleep keeps yesterday as its ring day.
    const mid = C.clockTick({ alarm: { on: true, hour: 23, minute: 59 }, timer: C.blankTimer() }, at(28, 0, 3), at(27, 23, 58));
    if (mid.rang !== "alarm" || mid.alarm.lastRingDay !== "2026-09-27") fails.push("a 23:59 alarm crossing midnight took the wrong day");
    // An earlier time set now does not ring; an alarm that is off does not ring.
    if (C.clockTick({ alarm: { on: true, hour: 8, minute: 0 }, timer: C.blankTimer() }, at(27, 9, 0, 30), at(27, 9, 0, 29)).rang) fails.push("setting a past time rang");
    if (C.clockTick({ alarm: { on: false, hour: 7, minute: 0 }, timer: C.blankTimer() }, at(27, 7, 3), at(27, 6, 59)).rang) fails.push("an off alarm rang");
    const pet = fs.readFileSync(path.join(RENDERER, "pet.js"), "utf8").replace(/\r\n/g, "\n");
    const clockAt = pet.indexOf("let clockSince = Date.now();");
    const body = clockAt >= 0 ? pet.slice(clockAt, pet.indexOf("}, 1000);", clockAt)) : "";
    if (!body || /if \(document\.hidden[^)]*\) return/.test(body)) fails.push("pet.js clock still stops while the overlay is hidden");
    if (!/clockTick\(cardGuest\(\), now, since\)/.test(body)) fails.push("pet.js clock does not use clockTick with the last look");
    if (!/if \(document\.hidden\) window\.desk\?\.notify\(window\.PetCard\.clockNote\(/.test(body)) fails.push("a hidden overlay gets no clock notification");
    // Clicking that notification shows the overlay and the alarm's saved line; it does not open care.
    fails.push(...clockNoteFails(ctx, C, "alarm", KEY, { id: "l-stretch", text: "Time to stretch.", kind: "say" }));
    fails.push(...clockNoteFails(ctx, C, "alarm", KEY, null));
    return fails.length
      ? fail(fails.join("; "))
      : ok("alarm rings once while hidden, once after a sleep, keeps its day on disk", { late_ms: slow.lateMs }, [
          "hidden_rings=1",
          "ring_day_on_disk=2026-09-27",
          "restart_same_minute=quiet",
          "asleep_40m=rang_late",
          "midnight_day=2026-09-27",
          "past_time=quiet",
          "off=quiet",
          "pet_clock_hidden=runs",
          "note_click=clock-note",
          "note_line=Time to stretch.",
          "care_note=open-care",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function timerClock() {
  const ctx = await bootMain();
  try {
    const { C, forget } = cardThroughMain(ctx);
    const fails = [];
    const KEY = "crow";
    const t0 = new Date(2026, 8, 27, 9, 0, 0).getTime();
    let card = C.load();
    card = C.setGuest(card, KEY, { timer: C.startTimer(C.guestOf(card, KEY).timer, 5 * 60_000, t0) });
    C.save(card);
    // Hidden the whole time, one look a second: it rings once, on the second it ends.
    let since = t0;
    const rings = [];
    for (let now = t0 + 1000; now <= t0 + 6 * 60_000; now += 1000) {
      const tick = C.clockTick(C.guestOf(card, KEY), now, since);
      since = now;
      if (!tick.changed) continue;
      card = C.setGuest(card, KEY, { alarm: tick.alarm, timer: tick.timer });
      if (tick.rang) rings.push({ now, lateMs: tick.lateMs });
      if (now === t0 + 60_000) C.save(card);
    }
    if (rings.length !== 1 || rings[0].now !== t0 + 5 * 60_000 || rings[0].lateMs !== 0) fails.push(`timer rang ${rings.length} times, late ${rings[0] && rings[0].lateMs}`);
    // A running timer saved at one minute comes back from card.json and still ends on the wall clock.
    forget();
    const back = C.guestOf(C.load(), KEY).timer;
    if (!back.running || back.endsAt !== t0 + 5 * 60_000) fails.push("a running timer did not come back from card.json");
    const reopened = C.clockTick({ alarm: C.blankAlarm(), timer: back }, t0 + 5 * 60_000 + 700, t0 + 4 * 60_000);
    if (reopened.rang !== "timer" || reopened.lateMs !== 700) fails.push("a reloaded timer did not ring at its end");
    // Stop keeps what is left; start again runs from there.
    const stopped = C.stopTimer(C.startTimer(C.blankTimer(), 60_000, t0), t0 + 20_000);
    if (stopped.running || stopped.remainingMs !== 40_000) fails.push("stop did not keep the time left");
    const resumed = C.startTimer(stopped, stopped.remainingMs, t0 + 30_000);
    if (resumed.endsAt !== t0 + 70_000) fails.push("start again did not run from the time left");
    fails.push(...clockNoteFails(ctx, C, "timer", KEY, null));
    fails.push(...clockNoteFails(ctx, C, "timer", KEY, { id: "l-tea", text: "Tea is ready.", kind: "say" }));
    return fails.length
      ? fail(fails.join("; "))
      : ok("timer rings once on time while hidden; survives card.json reload; stop keeps time left", {}, [
          "hidden_rings=1",
          "late_ms=0",
          "reload_rings_on_end",
          "stop_left=40000",
          "note_click=clock-note",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function musicRadio() {
  const ctx = await bootMain();
  try {
    const M = loadFresh("house-music.js");
    const fails = [];
    const ids = M.MUSIC_PLUGINS.map((p) => p.id);
    if (JSON.stringify(ids) !== JSON.stringify(["off", "house", "radio"])) fails.push(`music plugins are ${ids.join(",")}`);
    // The house loop plays a real file from the overlay folder, with no network.
    const house = { ...M.blankMusic(), plugin: "house", playing: true };
    const src = M.overlayPlaySrc ? M.overlayPlaySrc(house) : M.overlayHouseLoopSrc();
    const wav = path.join(RENDERER, src);
    const head = fs.existsSync(wav) ? fs.readFileSync(wav).subarray(0, 12) : Buffer.alloc(0);
    const size = fs.existsSync(wav) ? fs.statSync(wav).size : 0;
    if (src !== "sounds/house-loop.wav" || head.toString("latin1", 0, 4) !== "RIFF" || head.toString("latin1", 8, 12) !== "WAVE" || size < 10_000) {
      fails.push(`house loop ${src} is not a real wav (${size} bytes)`);
    }
    if (M.playSrc({ ...house, plugin: "off" }) !== "") fails.push("Quiet still plays");
    if (M.HOUSE_LOOP_LICENSE !== "CC0 · house-made") fails.push("house loop license line drifted");
    // Radio find through main's radio-search: no painted line, no look-up.
    const held = await ctx.invoke("radio-search", "jazz", "", "");
    if (held.ok !== false || held.error !== "unnamed" || ctx.fetches.length) fails.push("radio-search left without the painted line");
    const line = M.radioHonesty();
    const hosts = M.RADIO_HOSTS.map((h) => new URL(h).hostname);
    ctx.fetchImpl = async () =>
      jsonResponse([
        { stationuuid: "a1", name: "Harness Jazz FM", url_resolved: "https://stream.example.org/jazz", tags: "jazz", country: "Test", countrycode: "US" },
        { stationuuid: "a2", name: "<img src=x onerror=alert(1)> Radio", url: "https://stream.example.org/two", tags: "jazz" },
        { stationuuid: "a3", name: "No stream", url: "javascript:alert(1)" },
      ]);
    const found = await ctx.invoke("radio-search", "jazz", "", line);
    const names = (found.stations || []).map((s) => s.name);
    if (!found.ok || !names.includes("Harness Jazz FM")) fails.push("radio-search did not return the directory stations");
    if (names.includes("No stream")) fails.push("a station with no safe stream was kept");
    const leftHosts = ctx.fetches.map((f) => new URL(f.url).hostname);
    if (!leftHosts.length || leftHosts.some((h) => !hosts.includes(h))) fails.push(`radio-search reached ${leftHosts.join(",")}`);
    if (ctx.fetches.some((f) => f.ua !== M.RADIO_UA)) fails.push("radio-search did not send the house user agent");
    // Every directory host down: can't reach, not an empty list.
    ctx.fetchImpl = async () => jsonResponse({ error: "down" }, 503);
    const down = await ctx.invoke("radio-search", "jazz", "", line);
    if (down.ok !== false || down.error !== "unread") fails.push("a dead directory read as no stations");
    return fails.length
      ? fail(fails.join("; "), { names })
      : ok(`house loop ${size} bytes; radio-search held/found ${names.length}/unread`, { stations: names.length, hosts: [...new Set(leftHosts)] }, [
          "plugins=off,house,radio",
          `house_loop=${src}`,
          "radio_no_line=held",
          `radio_found=${names.length}`,
          "radio_unsafe_stream=dropped",
          "radio_down=unread",
        ]);
  } finally {
    ctx.cleanup();
  }
}

async function marketSearch() {
  const ctx = await bootMain();
  try {
    const P = loadFresh("market.js");
    const fails = [];
    const empty = await ctx.invoke("market-search", "", P.QUOTE_LOOK);
    if (!empty.ok || empty.coins.length || ctx.fetches.length) fails.push("an empty look-up left the computer");
    const held = await ctx.invoke("market-search", "bitcoin", "");
    if (held.ok !== false || held.error !== "unnamed" || ctx.fetches.length) fails.push("market-search left without the painted line");
    ctx.fetchImpl = async () =>
      jsonResponse({
        coins: [
          { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
          { id: "", symbol: "zzz", name: "No id" },
        ],
        nfts: [{ id: "pudgy-penguins", name: "Pudgy Penguins", symbol: "PPG" }],
      });
    const found = await ctx.invoke("market-search", "bitcoin", P.QUOTE_LOOK);
    const coin = (found.coins || [])[0] || {};
    if (!found.ok || found.coins.length !== 1 || coin.geckoId !== "bitcoin" || coin.symbol !== "BTC") fails.push("market-search did not read the coin");
    if (!found.nfts || found.nfts.length !== 1) fails.push("market-search did not read the NFT row");
    const url = ctx.fetches[0] ? new URL(ctx.fetches[0].url) : null;
    if (!url || url.hostname !== "api.coingecko.com" || url.searchParams.get("query") !== "bitcoin") fails.push("market-search asked the wrong host or query");
    ctx.fetchImpl = async () => jsonResponse({}, 500);
    const down = await ctx.invoke("market-search", "bitcoin", P.QUOTE_LOOK);
    if (down.ok !== false || down.error !== "unread") fails.push("a failed look-up read as no coins");
    return fails.length
      ? fail(fails.join("; "))
      : ok("market-search: empty stays home, no line held, found BTC + 1 NFT, 500 unread", { coins: found.coins.length, nfts: found.nfts.length }, [
          "empty=home",
          "no_line=held",
          "found=bitcoin/BTC",
          `host=${url.hostname}`,
          "http_500=unread",
        ]);
  } finally {
    ctx.cleanup();
  }
}

/**
 * A brand-new keeper: no card.json in a fresh userData. The card starts open with the house defaults,
 * the first-run hello shows, Got it saves firstHintSeen through card-set, and after a restart (card-get)
 * and an unrelated card write it never shows again. A named server that never answered reads
 * "House server not running (optional)"; "unreachable" only after it answered.
 */
async function firstRun() {
  const ctx = await bootMain();
  try {
    const fails = [];
    const Presence = require(path.join(DESKTOP, "presence.cjs"));
    const file = Presence.houseFile(ctx.userData, "card.json");
    if (fs.existsSync(file)) fails.push("a clean profile already has card.json");
    const { C, forget } = cardThroughMain(ctx);
    const K = loadFresh("keeper.js");
    let card = C.load();
    const defaults = {
      collapsed: card.collapsed,
      off: card.off,
      color: card.color,
      voiceStyle: card.voiceStyle,
      pets: Object.keys(card.pets || {}).length,
      firstHintSeen: card.firstHintSeen,
    };
    const want = { collapsed: false, off: false, color: "ink", voiceStyle: "hearth", pets: 0, firstHintSeen: false };
    if (JSON.stringify(defaults) !== JSON.stringify(want)) fails.push(`clean defaults ${JSON.stringify(defaults)}`);
    if (Object.values(card.mutes || {}).some(Boolean)) fails.push("a new keeper starts with something muted");
    let shows = 0;
    if (K.firstHintShows(card)) shows += 1;
    else fails.push("the hello does not show on a clean profile");
    const hint = K.firstHint("Rui");
    if (hint.ok !== "Got it" || hint.lines.length !== 3 || !/tray icon/.test(hint.lines[2])) fails.push("the hello lost its words");
    if (/\b(npm|install|overlay|IPC|Electron)\b/i.test([hint.title, ...hint.lines].join(" "))) fails.push("the hello uses grown-up words");
    // A reload before Got it still shows it (it waits for the keeper, not for a timer).
    forget();
    if (!K.firstHintShows(C.load())) fails.push("the hello vanished before Got it");
    // Got it.
    card = C.load();
    card.firstHintSeen = true;
    C.save(card);
    const disk = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
    if (!disk || disk.firstHintSeen !== true) fails.push("card-set did not write firstHintSeen to card.json");
    forget();
    card = C.load();
    if (K.firstHintShows(card)) shows += 1;
    // An unrelated write (a color pick) keeps it gone.
    card = C.save({ ...card, color: "moss" });
    forget();
    if (K.firstHintShows(C.load())) shows += 1;
    if (shows !== 1) fails.push(`the hello showed ${shows} times across Got it and two restarts`);
    const rows = [
      K.houseServerLine({ show: false, seen: false }),
      K.houseServerLine({ show: true, reachable: false, seen: false }),
      K.houseServerLine({ show: true, reachable: true, seen: true }),
      K.houseServerLine({ show: true, reachable: false, seen: true }),
    ];
    const wantRows = ["", "House server not running (optional)", "House server running", "House server stopped answering (optional). Pets still work."];
    if (JSON.stringify(rows) !== JSON.stringify(wantRows)) fails.push(`house server rows ${JSON.stringify(rows)}`);
    return fails.length
      ? fail(fails.join("; "), { defaults, rows })
      : ok("a clean profile starts open with the house defaults, the hello shows once, and Got it survives restarts", { defaults, rows, shows }, [
          "clean=no_card_json",
          "defaults=open+ink+hearth+unmuted",
          "hint=shows_once",
          "persist=card.json firstHintSeen",
          "server=not_running_optional_until_answered",
        ]);
  } finally {
    ctx.cleanup();
  }
}

module.exports = {
  bootMain,
  first_run: firstRun,
  tray_on_the_desk: trayOnTheDesk,
  quit_desk: quitDesk,
  mind_get_set: mindGetSet,
  saved_lines: savedLines,
  alarm_clock: alarmClock,
  timer_clock: timerClock,
  music_radio: musicRadio,
  market_search: marketSearch,
};
