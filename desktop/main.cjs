const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen, Notification, powerMonitor, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const { createLicenseSession } = require("./license/session.cjs");
const PlainError = require("./license/plain-error.cjs");
const HouseServer = require("./house-server.cjs");
const Desk = require("./renderer/desk.js");
const Roster = require("./renderer/roster-load.js");
const Windows = require("./renderer/windows.js");
const WindowEnum = require("./windows-enum.cjs");
const GpuSense = require("./gpu-sense.cjs");
const GpuPath = require("./gpu-path.cjs");
const HouseMusic = require("./renderer/house-music.js");
const PetNews = require("./renderer/news.js");
const PetMarket = require("./renderer/market.js");
const Presence = require("./presence.cjs");
const PlateNet = require("./presence/plate-net.cjs");
const PlateFetch = require("./presence/plate-fetch.cjs");
const OpenLink = require("./presence/open-link.cjs");
const MindSecret = require("./mind-secret.cjs");
const PetCard = require("./renderer/card.js");
const VDesk = require("./vdesk-win.cjs");

/** Buffffff opt-in: COMPUTERPETS_GUI_HARNESS=1 runs Electron smokes then quits. */
const GUI_HARNESS = process.env.COMPUTERPETS_GUI_HARNESS === "1";
const GUI_HARNESS_OUT = process.env.COMPUTERPETS_GUI_HARNESS_OUT || "";
if (GUI_HARNESS) {
  const os = require("os");
  const harnessData = path.join(os.tmpdir(), `computerpets-gui-harness-${process.pid}`);
  fs.mkdirSync(harnessData, { recursive: true });
  app.setPath("userData", harnessData);
  app.commandLine.appendSwitch("disable-gpu-sandbox");
}

app.setAppUserModelId("works.richey.computerpets.desk");
app.commandLine.appendSwitch("enable-transparent-visuals");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

/** @type {ReturnType<typeof createLicenseSession> | null} */
let licenseSession = null;

function getLicenseSession() {
  if (!licenseSession) {
    licenseSession = createLicenseSession({
      userDataDir: app.getPath("userData"),
      env: process.env,
      // The download sign-in is sealed in the OS secret store like a plugin key; with no store it stays in memory only.
      codec: () => mindCodec(),
    });
  }
  return licenseSession;
}

/** The host a license call was aimed at, for the plain sentence when the error does not carry one. */
function licenseHost(input) {
  const typed = input && typeof input.backendUrl === "string" ? PlainError.hostOf(input.backendUrl.trim()) : "";
  if (typed) return typed;
  try {
    return PlainError.hostOf(getLicenseSession().status().backendUrl || "");
  } catch {
    return "";
  }
}

/** A bundle refusal comes back as a code or caught text; the window gets its sentence. */
function plainLicenseResult(result) {
  if (result && typeof result.error === "string" && result.error) {
    const host = PlainError.hostOf(result.downloadUrl || "");
    console.warn(`[license] bundle: ${result.error}`);
    return { ...result, error: PlainError.plainBundleError(result.error, { host }) };
  }
  if (result && result.error && typeof result.error === "object" && typeof result.error.code === "string") {
    // license-status carries a stored license's own refusal (expired, cannot open); it gets the same plain words.
    const host = PlainError.hostOf(result.backendUrl || "");
    console.warn(`[license] status: ${PlainError.rawLogLine(result.error)}`);
    return { ...result, error: PlainError.plainLicenseError(result.error, { host }) };
  }
  return result;
}

function licenseIpc(fn) {
  return async (_e, ...args) => {
    try {
      const result = await fn(...args);
      return plainLicenseResult(result && typeof result === "object" ? { ok: true, ...result } : { ok: true, result });
    } catch (err) {
      // Raw network text (ECONNREFUSED, fetch failed, certificate ...) goes to the log, not the Settings window.
      const plain = PlainError.plainLicenseError(err, { host: licenseHost(args[0]) });
      console.warn(`[license] ${plain.code}: ${PlainError.rawLogLine(err)}`);
      return { ok: false, unlocked: false, error: plain };
    }
  };
}

/** @type {Awaited<ReturnType<typeof GpuPath.gate>> | null} */
let gpuGate = null;
/** @type {BrowserWindow | null} */
let win = null;
/** @type {BrowserWindow | null} */
let settingsWin = null;
/** @type {Tray | null} */
let tray = null;
/** @type {{ key: string, name: string, speciesLabel: string }[]} */
let roster = [];
let currentKey = "red_panda";
let lastVitals = { vital: "Settled", hunger: 80, sick: false, hidden: false, mess: 0, bond: 0, stage: "grown", verb: "Special" };

function loadRoster() {
  roster = Roster.readRoster(path.join(__dirname, "renderer", "roster.json"), fs);
}

function mindFile() {
  return Presence.houseFile(app.getPath("userData"), "mind.json");
}

function cardFile() {
  return Presence.houseFile(app.getPath("userData"), "card.json");
}

function readCard() {
  const file = cardFile();
  if (!file) return { collapsed: false, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!parsed || typeof parsed !== "object") return { collapsed: false, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
    return parsed;
  } catch {
    return { collapsed: false, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
  }
}

function writeCard(data) {
  const file = cardFile();
  if (!file || !data || typeof data !== "object") return;
  try {
    fs.writeFileSync(file, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function mindCodec() {
  try {
    const { safeStorage } = require("electron");
    if (!safeStorage || typeof safeStorage.isEncryptionAvailable !== "function") return null;
    if (!safeStorage.isEncryptionAvailable()) return null;
    return {
      encrypt(text) {
        return safeStorage.encryptString(String(text)).toString("base64");
      },
      decrypt(payload) {
        return safeStorage.decryptString(Buffer.from(String(payload), "base64"));
      },
    };
  } catch {
    return null;
  }
}

function readMind() {
  const file = mindFile();
  let parsed = null;
  if (file) {
    try {
      parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      parsed = null;
    }
  }
  const result = MindSecret.readMindRecord(parsed, mindCodec());
  if (result.rewrite && file) {
    try {
      fs.writeFileSync(file, JSON.stringify(result.file));
    } catch {
      if (MindSecret.fileHasPlainKey(parsed)) result.mind.keyKept = "plain";
    }
  }
  return result.mind;
}

function writeMind(data) {
  const file = mindFile();
  if (!file || !data || typeof data !== "object") return { kept: "none", saved: false };
  let previous = null;
  try {
    previous = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    previous = null;
  }
  const result = MindSecret.writeMindRecord(data, mindCodec(), previous);
  try {
    fs.writeFileSync(file, JSON.stringify(result.file));
  } catch {
    // saved:false lets Minds say "Not saved" instead of "Saved" when mind.json could not be written.
    return { kept: MindSecret.fileHasPlainKey(previous) ? "plain" : "none", saved: false };
  }
  return { kept: result.kept, saved: true };
}

const sealedContents = new WeakSet();

/**
 * Renderer navigation and capture stay refused. Main loadFile is not this path.
 * A clicked http(s) link goes to the keeper's default browser (shell.openExternal);
 * every other scheme is refused and logged. The window-open answer is always "deny",
 * so no Electron window is made for a link. See presence/open-link.cjs.
 */
function sealDeskContents(contents) {
  OpenLink.sealContents(contents, {
    presence: Presence,
    openExternal: (url) => shell.openExternal(url),
    log: (line) => console.warn(line),
    sealed: sealedContents,
  });
}

/** The weather control on the overlay glass. The minds window is not that control. */
function weatherLocateSender(event) {
  try {
    const url = event && event.sender ? String(event.sender.getURL() || "") : "";
    return url.endsWith("/index.html") || url.endsWith("\\index.html");
  } catch {
    return false;
  }
}

/** The weather control opens one locate. Nothing else may arm geolocation. */
function registerWeatherLocate(ipc) {
  ipc.handle("weather-locate-arm", (event) => {
    if (!weatherLocateSender(event)) return { open: false };
    return { open: true, until: Presence.armWeatherLocate() };
  });
  ipc.handle("weather-locate-clear", () => {
    Presence.clearWeatherLocate();
    return { open: false };
  });
}

registerWeatherLocate(ipcMain);

function iconImage() {
  return nativeImage.createFromPath(path.join(__dirname, "renderer", "icon.png"));
}

function currentName() {
  return roster.find((r) => r.key === currentKey)?.name ?? "Companion";
}

function guestRadio(r) {
  return {
    label: `${r.name} — ${r.speciesLabel}`,
    type: "radio",
    checked: r.key === currentKey,
    click: () => {
      currentKey = r.key;
      win?.webContents.send("switch", r.key);
      refreshMenus();
    },
  };
}

function companionMenu() {
  return roster.map(guestRadio);
}

/** Rui, Sip, and the grid ten sit first. The rest of the house stays under Companions. */
function deskPickMenu() {
  return Desk.deskPicks()
    .map((key) => roster.find((r) => r.key === key))
    .filter((r) => r && r.key)
    .map(guestRadio);
}

function careMenu() {
  return [
    { label: "Feed", click: () => win?.webContents.send("command", "feed") },
    { label: "Treat", click: () => win?.webContents.send("command", "snack") },
    { label: "Play", click: () => win?.webContents.send("command", "play") },
    { label: "Rest", click: () => win?.webContents.send("command", "rest") },
    { label: "Talk", click: () => win?.webContents.send("command", "talk") },
    { type: "separator" },
    { label: "Hide", click: () => win?.webContents.send("command", "hide") },
    { label: "Call back", click: () => win?.webContents.send("command", "call") },
    { label: "Clean", click: () => win?.webContents.send("command", "clean") },
    { label: "Bath", click: () => win?.webContents.send("command", "bath") },
    { label: "Medicine", click: () => win?.webContents.send("command", "medicine") },
    { label: "Praise", click: () => win?.webContents.send("command", "praise") },
    { label: lastVitals.verb || "Special", click: () => win?.webContents.send("command", "special") },
    { label: "Shed", click: () => win?.webContents.send("command", "shed") },
  ];
}

function acceptSoftwareCompositing() {
  if (!GpuPath.writeExpect(app.getPath("userData"), fs, "software")) return;
  app.relaunch();
  app.quit();
}

function requireHardwareCompositing() {
  if (!GpuPath.writeExpect(app.getPath("userData"), fs, "hardware")) return;
  app.relaunch();
  app.quit();
}

function gpuPathRows() {
  if (!gpuGate || !gpuGate.open) return [];
  const rows = [{ label: gpuGate.label, enabled: false }];
  if (gpuGate.path === "software") {
    rows.push({ label: "Require hardware compositing", click: () => requireHardwareCompositing() });
  }
  rows.push({ type: "separator" });
  return rows;
}

function refusedTrayTemplate() {
  const rows = [
    { label: gpuGate.label, enabled: false },
    { type: "separator" },
  ];
  if (gpuGate.reason === "software-refused") {
    rows.push({ label: "Allow software compositing", click: () => acceptSoftwareCompositing() });
  }
  rows.push({ label: "Quit", click: () => app.quit() });
  return rows;
}

function statusLabel() {
  const bits = [currentName(), lastVitals.stage, lastVitals.vital];
  if (lastVitals.mess) bits.push(`mess ${lastVitals.mess}`);
  if (lastVitals.bond) bits.push(`bond ${lastVitals.bond}`);
  return bits.join(" · ");
}

function trayTemplate() {
  return [
    ...gpuPathRows(),
    { label: statusLabel(), enabled: false },
    { type: "separator" },
    { label: "On the desk", submenu: deskPickMenu() },
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    ...careMenu(),
    { type: "separator" },
    { label: "Unlock…", click: () => openSettings("unlock") },
    { label: "Minds…", click: () => openSettings("minds") },
    {
      label: "Show",
      click: () => {
        win?.showInactive();
        win?.setAlwaysOnTop(true, "screen-saver");
      },
    },
    { label: "Hide the window", click: () => win?.hide() },
    ...desktopFollowRows(),
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ];
}

function macAppMenu() {
  return [
    { role: "appMenu" },
    { label: "Care", submenu: careMenu() },
    { label: "On the desk", submenu: deskPickMenu() },
    { label: "Companions", submenu: companionMenu() },
    {
      label: "Window",
      submenu: [
        {
          label: "Show",
          click: () => {
            win?.showInactive();
            win?.setAlwaysOnTop(true, "screen-saver");
          },
        },
        { role: "hide" },
        { role: "minimize" },
      ],
    },
  ];
}

function refreshMenus() {
  const refused = gpuGate && !gpuGate.open;
  const template = refused ? refusedTrayTemplate() : trayTemplate();
  tray?.setContextMenu(Menu.buildFromTemplate(template));
  tray?.setToolTip(refused ? gpuGate.label : statusLabel() + " — ComputerPets");
  if (!Desk.appMenu(process.platform)) return;
  if (!refused) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(macAppMenu()));
    return;
  }
  const mac = [
    { label: gpuGate.label, enabled: false },
    { label: "Quit", click: () => app.quit() },
  ];
  if (gpuGate.reason === "software-refused") {
    mac.splice(1, 0, { label: "Allow software compositing", click: () => acceptSoftwareCompositing() });
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(mac));
}

/** The Mac floor sits under the menu bar and above the dock, on the desk under the cursor. */
function floorOf() {
  if (Desk.followCursorDisplay(process.platform)) {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  }
  return screen.getPrimaryDisplay().workArea;
}

function fitWorkArea() {
  if (!win) return;
  const area = floorOf();
  win.setBounds({ x: area.x, y: area.y, width: area.width, height: area.height });
  win.setAlwaysOnTop(true, "screen-saver");
  if (Desk.spacesWalk(process.platform)) {
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
}

/** Unlock… opens the House window at Unlock; Minds… at Minds (the top). An open window scrolls there. */
function openSettings(section) {
  const at = section === "unlock" ? "unlock" : "minds";
  if (settingsWin) {
    settingsWin.show();
    settingsWin.focus();
    settingsWin.webContents.send("settings-section", at);
    return;
  }
  settingsWin = new BrowserWindow({
    width: 440,
    height: 740,
    title: "House — ComputerPets",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  sealDeskContents(settingsWin.webContents);
  settingsWin.loadFile(path.join(__dirname, "renderer", "settings.html"), { hash: at });
  settingsWin.on("closed", () => {
    settingsWin = null;
  });
}

function createWindow() {
  const area = floorOf();
  const chrome = Desk.overlayChrome(process.platform);
  win = new BrowserWindow({
    x: area.x,
    y: area.y,
    width: area.width,
    height: area.height,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: chrome.focusable,
    show: false,
    ...(chrome.type ? { type: chrome.type } : {}),
    acceptFirstMouse: chrome.acceptFirstMouse,
    hiddenInMissionControl: chrome.hiddenInMissionControl,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  sealDeskContents(win.webContents);
  win.setAlwaysOnTop(true, "screen-saver");
  if (Desk.spacesWalk(process.platform)) win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setMenuBarVisibility(false);
  if (GUI_HARNESS) {
    win.loadFile(path.join(__dirname, "renderer", "index.html"), { query: { gui_harness: "1" } });
  } else {
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
  }
  win.once("ready-to-show", () => {
    fitWorkArea();
    win?.showInactive();
    if (GUI_HARNESS) {
      setTimeout(() => {
        runGuiHarnessSmokes(win).catch((err) => {
          writeGuiHarnessResult({
            ok: false,
            error: `${err && err.name}: ${err && err.message}`,
            results: {},
          });
          app.quit();
        });
      }, 900);
    }
  });
  win.on("closed", () => {
    win = null;
  });
}

/** On a Mac the extra is a menu-bar mark. On Linux the mark sits in the panel. A click opens care. */
function createTray() {
  const icon = iconImage().resize({ width: 16, height: 16 });
  if (Desk.extraIconTemplate(process.platform)) icon.setTemplateImage(true);
  tray = new Tray(icon);
  refreshMenus();
  tray.on("click", () => {
    if (Desk.extraClick(process.platform) === "menu") {
      tray.popUpContextMenu();
      return;
    }
    if (!win) return;
    if (win.isVisible()) win.hide();
    else {
      win.showInactive();
      win.setAlwaysOnTop(true, "screen-saver");
    }
  });
}

function popupPetMenu(x, y) {
  if (!win) return;
  Menu.buildFromTemplate([
    { label: statusLabel(), enabled: false },
    { type: "separator" },
    { label: "On the desk", submenu: deskPickMenu() },
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    ...careMenu(),
    { type: "separator" },
    { label: "Unlock…", click: () => openSettings("unlock") },
    { label: "Minds…", click: () => openSettings("minds") },
    { type: "separator" },
    { label: "Hide the window", click: () => win?.hide() },
    { label: "Quit", click: () => app.quit() },
  ]).popup({ window: win, x: Math.round(x), y: Math.round(y) });
}

let guiHarnessDone = false;

function writeGuiHarnessResult(payload) {
  guiHarnessDone = true;
  const body = `${JSON.stringify(payload)}\n`;
  if (GUI_HARNESS_OUT) {
    try {
      fs.writeFileSync(GUI_HARNESS_OUT, body, "utf8");
    } catch (err) {
      process.stderr.write(`gui-harness write failed: ${err && err.message}\n`);
    }
  }
  process.stdout.write(body);
}

async function runGuiHarnessSmokes(target) {
  if (!target || target.isDestroyed()) {
    writeGuiHarnessResult({ ok: false, error: "no window", results: {} });
    app.quit();
    return;
  }
  const script = `(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 60; i++) {
      const snap = window.PetGuiHarness && window.PetGuiHarness.snapshot();
      if (snap && snap.kind && snap.petSrc) break;
      await sleep(100);
    }
    const H = window.PetGuiHarness;
    if (!H) return { ok: false, error: "PetGuiHarness missing (gui_harness query?)", results: {} };
    const results = {};
    const boot = H.snapshot();
    results["gui.overlay_paint"] = {
      ok: !!(boot.kind && boot.petSrc && boot.hudName && boot.hudName !== "?"),
      detail: "kind=" + boot.kind + " hud=" + boot.hudName,
      trace: [
        "kind=" + boot.kind,
        "petSrc=" + boot.petSrc,
        "hudName=" + boot.hudName,
        "vital=" + (boot.vital || ""),
      ],
      extras: boot,
    };
    let s = H.openHostChoice();
    const opened = !!(s.choiceOpen && s.choiceHasClose && s.choiceHasExit);
    s = H.pick("close");
    const closed = !s.choiceOpen;
    s = H.openHostChoice();
    s = H.pick("exit");
    const exited = !s.choiceOpen && !!s.collapsed;
    results["gui.overlay_paint"].ok = !!(results["gui.overlay_paint"].ok && opened && closed && exited);
    results["gui.overlay_paint"].trace.push(
      "choice.open=" + opened,
      "choice.close=" + closed,
      "choice.exit.collapse=" + exited,
    );
    results["gui.overlay_paint"].detail += " choice close/exit";

    s = H.openCard();
    const openOk = !s.collapsed && s.hudShow && !!(s.vital && s.vital.length > 1);
    const vitalSnap = s.vital;
    s = H.collapse();
    const collapseOk = !!s.collapsed && s.hudCollapsedAttr === "1";
    s = H.openCard();
    const reopenOk = !s.collapsed && s.hudShow;
    results["gui.card_hud_paint"] = {
      ok: !!(openOk && collapseOk && reopenOk),
      detail: "vital=" + (vitalSnap || ""),
      trace: [
        "open.show=" + openOk,
        "collapse.attr=" + collapseOk,
        "reopen.show=" + reopenOk,
        "vital=" + (vitalSnap || ""),
      ],
      extras: s,
    };

    s = H.placeGift();
    const placed = s.gifts >= 1 && s.giftDots >= 1;
    s = H.clickGiftDot();
    const picked = s.gifts === 0 && s.giftDots === 0;
    results["gui.gift_drag_place"] = {
      ok: !!(placed && picked),
      detail: "place+hit-target pick (gift-dot data-hit)",
      trace: [
        "place.gifts=" + (placed ? "1+" : "0"),
        "giftDots.hit=" + placed,
        "pick.clear=" + picked,
      ],
      extras: s,
    };

    const beforeX = H.snapshot().hostX;
    s = H.placeHostAt(240);
    const hostA = !!(s.hostPlaced && s.hostHit && s.hostX === 240);
    s = H.placeHostAt(420);
    const hostB = !!(s.hostPlaced && s.hostHit && s.hostX === 420 && s.hostX !== beforeX);
    results["gui.host_place"] = {
      ok: !!(hostA && hostB),
      detail: "placeHostAt 240->420 + data-hit",
      trace: [
        "place.240=" + hostA,
        "place.420=" + hostB,
        "hostHit=" + !!s.hostHit,
        "hostX=" + s.hostX,
        "hostNear=" + !!s.hostNear,
      ],
      extras: s,
    };

    const ok = Object.values(results).every((r) => r && r.ok);
    return { ok, results, error: ok ? null : "one or more gui smokes failed" };
  })()`;
  const payload = await target.webContents.executeJavaScript(script, true);
  writeGuiHarnessResult(payload || { ok: false, error: "empty harness payload", results: {} });
  setTimeout(() => app.quit(), 200);
}

function bootDesk() {
  app.whenReady().then(async () => {
    loadRoster();
    if (process.platform === "darwin") app.dock?.hide();
    try {
      gpuGate = await GpuPath.gate(app, fs);
    } catch {
      gpuGate = GpuPath.decide("hardware", { kind: "unread" });
    }
    if (!gpuGate.open) {
      if (GUI_HARNESS) {
        writeGuiHarnessResult({
          ok: false,
          error: gpuGate.reason,
          results: { "gui.gpu_path": { ok: false, detail: gpuGate.label } },
        });
        app.quit();
        return;
      }
      createTray();
      return;
    }
    createWindow();
    if (!GUI_HARNESS) {
      createTray();
      startHitForward();
      startWindowTick();
      startGpuTick();
      startDesktopFollow();
      screen.on("display-metrics-changed", fitWorkArea);
      screen.on("display-added", fitWorkArea);
      screen.on("display-removed", fitWorkArea);
      powerMonitor.on("suspend", () => win?.webContents.send("command", "rest"));
      powerMonitor.on("resume", fitWorkArea);
      powerMonitor.on("lock-screen", () => win?.webContents.send("command", "rest"));
    } else {
      setTimeout(() => {
        if (!guiHarnessDone) {
          writeGuiHarnessResult({ ok: false, error: "gui harness timed out", results: {} });
          app.quit();
        }
      }, 45000);
    }
  });
}

if (GUI_HARNESS) {
  bootDesk();
} else {
  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      win?.showInactive();
      win?.setAlwaysOnTop(true, "screen-saver");
    });
    bootDesk();
  }
}

/** Windows virtual desktops (ADR 0131). The probe asks about the overlay's own HWND only. */
/** @type {ReturnType<typeof VDesk.createProbe> | null} */
let vdeskProbe = null;
/** @type {ReturnType<typeof VDesk.createFollower> | null} */
let vdeskFollower = null;
let followDesktops = true;

function overlayHere() {
  return !!(win && !win.isDestroyed() && win.isVisible() && !win.isMinimized());
}

function startDesktopFollow() {
  if (!Desk.desktopFollow(process.platform) || vdeskFollower) return;
  followDesktops = VDesk.readFollow(app.getPath("userData"), fs);
  vdeskProbe = VDesk.createProbe();
  vdeskFollower = VDesk.createFollower({
    probe: vdeskProbe,
    enabled: () => followDesktops,
    win: {
      hwnd: () => (win && !win.isDestroyed() ? Windows.hwndFromHandle(win.getNativeWindowHandle()) : ""),
      visible: overlayHere,
      reshow: () => {
        if (!overlayHere()) return;
        win.hide();
        win.showInactive();
        fitWorkArea();
      },
    },
  });
  if (followDesktops) vdeskFollower.start();
  refreshMenus();
}

function setDesktopFollow(on) {
  followDesktops = !!on;
  VDesk.writeFollow(app.getPath("userData"), fs, followDesktops);
  if (vdeskFollower && followDesktops) vdeskFollower.start();
  if (vdeskFollower && !followDesktops) {
    vdeskFollower.stop();
    vdeskProbe?.dispose();
  }
  refreshMenus();
}

function stopDesktopFollow() {
  vdeskFollower?.stop();
  vdeskProbe?.dispose();
  vdeskFollower = null;
  vdeskProbe = null;
}

function desktopFollowRows() {
  if (!Desk.desktopFollow(process.platform)) return [];
  return [
    {
      label: "Follow me across desktops",
      type: "checkbox",
      checked: followDesktops,
      click: (item) => setDesktopFollow(item.checked),
    },
  ];
}

let hitRects = [];
let hitPoll = null;
let wantClickable = false;

/** DWM, Mutter, and KWin do not reliably forward a hover. The tray watches the cursor. */
function startHitForward() {
  if (!Desk.hitForward(process.platform) || hitPoll) return;
  hitPoll = setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const area = floorOf();
    const bounds = win.getBounds();
    if (Desk.followCursorDisplay(process.platform) && !Desk.sameArea(area, bounds)) {
      fitWorkArea();
    }
    const cursor = screen.getCursorScreenPoint();
    const over = Desk.cursorHits({ x: cursor.x - bounds.x, y: cursor.y - bounds.y }, hitRects);
    win.setIgnoreMouseEvents(!(wantClickable || over));
  }, 50);
}

ipcMain.on("set-hits", (_e, rects) => {
  hitRects = Array.isArray(rects) ? rects : [];
});

ipcMain.on("set-clickable", (_e, clickable) => {
  wantClickable = !!clickable;
  if (Desk.hitForward(process.platform)) return;
  win?.setIgnoreMouseEvents(!clickable, { forward: true });
});

ipcMain.on("set-focusable", (_e, focusable) => {
  if (!win || win.isDestroyed()) return;
  const want = !!focusable;
  if (win.isFocusable() === want) {
    if (want) win.focus();
    return;
  }
  win.setFocusable(want);
  if (want) win.focus();
});

ipcMain.on("pet-menu", (_e, pos) => {
  popupPetMenu(pos?.x ?? 40, pos?.y ?? 40);
});

ipcMain.on("switch-pet", (_e, key) => {
  if (!roster.some((r) => r.key === key)) return;
  currentKey = key;
  win?.webContents.send("switch", key);
  refreshMenus();
});

let lastVitalsSig = "";

ipcMain.on("notify", (_e, payload) => {
  if (!Notification.isSupported()) return;
  const note = new Notification({
    title: String(payload?.title || currentName()).slice(0, 60),
    body: String(payload?.body || "").slice(0, 160),
    silent: true,
    icon: iconImage(),
  });
  // A care note opens care on its need. A keeper-clock note shows the overlay and its saved line.
  const click = PetCard.noteCommand(payload, currentKey);
  note.on("click", () => {
    if (!win) return;
    win.showInactive();
    win.setAlwaysOnTop(true, "screen-saver");
    win.webContents.send("command", click);
  });
  note.show();
});

ipcMain.on("vitals", (_e, payload) => {
  if (!payload) return;
  lastVitals = { ...lastVitals, ...payload };
  if (typeof payload.key === "string" && roster.some((r) => r.key === payload.key)) currentKey = payload.key;
  const sig = `${currentKey}|${lastVitals.vital}|${lastVitals.stage}|${lastVitals.mess}|${lastVitals.bond}|${lastVitals.sick}|${lastVitals.hidden}|${lastVitals.verb}`;
  if (sig === lastVitalsSig) return;
  lastVitalsSig = sig;
  refreshMenus();
});

ipcMain.on("mind-get", (e) => {
  e.returnValue = readMind();
});

ipcMain.handle("mind-set", (_e, data) => writeMind(data));

ipcMain.on("card-get", (e) => {
  e.returnValue = readCard();
});

ipcMain.on("card-set", (_e, data) => {
  writeCard(data);
});

ipcMain.on("quit-desk", () => {
  app.quit();
});

ipcMain.handle("roster-get", () => roster);

function fetchRadioJson(url) {
  return PlateFetch.readRadioDirectory(url, {
    hosts: HouseMusic.RADIO_HOSTS || [],
    urlsOnHost: HouseMusic.urlsOnHost,
    init: {
      cache: "no-store",
      headers: {
        "User-Agent": HouseMusic.RADIO_UA,
        Accept: "application/json",
      },
    },
  });
}

function heldPlate(extra) {
  return { ok: false, error: "unnamed", ...extra };
}

function shownLine(value) {
  return typeof value === "string" ? value : "";
}

ipcMain.handle("radio-search", async (_e, query, area, line) => {
  const urls = HouseMusic.radioSearchUrls(query, area);
  if (!urls.length) return { ok: true, stations: [] };
  if (!PlateNet.mayFetch("radio", shownLine(line), urls)) return heldPlate({ stations: [] });
  const batches = await Promise.all(
    urls.map((url) =>
      fetchRadioJson(url)
        .then((json) => HouseMusic.parseStations(json))
        .catch(() => null),
    ),
  );
  if (batches.every((b) => b == null)) return { ok: false, error: "unread", stations: [] };
  const merged = HouseMusic.mergeStations(batches.filter(Boolean));
  return { ok: true, stations: HouseMusic.rankStations(merged, query, area).slice(0, 16) };
});

async function fetchNewsRss(url) {
  if (!url) return { ok: true, items: [] };
  try {
    const res = await PlateFetch.fetchPlate(url, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!res.ok) return PlateFetch.unread({ items: [] });
    return { ok: true, items: PetNews.parseRss(res.text) };
  } catch {
    return PlateFetch.unread({ items: [] });
  }
}

ipcMain.handle("news-topic", async (_e, query, line) => {
  const url = PetNews.topicRssUrl(query);
  if (!url) return { ok: true, items: [] };
  if (!PlateNet.mayFetch("news", shownLine(line), [url])) return heldPlate({ items: [] });
  return fetchNewsRss(url);
});

ipcMain.handle("news-feed", async (_e, opts) => {
  const kind = opts && typeof opts.kind === "string" ? opts.kind : "topic";
  const query = opts && typeof opts.query === "string" ? opts.query : "";
  const line = opts && typeof opts.line === "string" ? opts.line : "";
  const url = kind === "popular"
    ? PetNews.popularRssUrl()
    : kind === "x"
      ? PetNews.xTopicRssUrl(query || "news")
      : PetNews.topicRssUrl(query);
  if (!url) return { ok: true, items: [] };
  if (!PlateNet.mayFetch("news", line, [url])) return heldPlate({ items: [] });
  return fetchNewsRss(url);
});

ipcMain.handle("market-quote", async (_e, ticker, line) => {
  const row = PetMarket.parseTicker(ticker);
  if (!row) return { ok: false, error: "unread", live: null };
  try {
    if (row.kind === "crypto" && row.address) {
      const url = PetMarket.terminalTokenUrl(row.platform || "solana", row.address);
      if (!url) return { ok: false, error: "unread", live: null };
      if (!PlateNet.mayFetch("terminal", shownLine(line), [url])) return heldPlate({ live: null });
      const res = await PlateFetch.fetchPlate(url);
      if (!res.ok) return PlateFetch.unread({ live: null });
      const live = PetMarket.parseTerminalToken(PlateFetch.parseJson(res.text));
      return live ? { ok: true, live } : PlateFetch.unread({ live: null });
    }
    if (row.kind === "crypto") {
      const url = PetMarket.geckoUrl(row.geckoId);
      if (!url) return { ok: false, error: "unread", live: null };
      if (!PlateNet.mayFetch("quote", shownLine(line), [url])) return heldPlate({ live: null });
      const res = await PlateFetch.fetchPlate(url);
      if (!res.ok) return PlateFetch.unread({ live: null });
      const live = PetMarket.parseGecko(PlateFetch.parseJson(res.text), row.geckoId);
      return live ? { ok: true, live } : PlateFetch.unread({ live: null });
    }
    const url = PetMarket.yahooUrl(row.symbol);
    if (!url) return { ok: false, error: "unread", live: null };
    if (!PlateNet.mayFetch("stock", shownLine(line), [url])) return heldPlate({ live: null });
    const res = await PlateFetch.fetchPlate(url);
    if (!res.ok) return PlateFetch.unread({ live: null });
    const live = PetMarket.parseYahoo(PlateFetch.parseJson(res.text));
    return live ? { ok: true, live } : PlateFetch.unread({ live: null });
  } catch {
    return PlateFetch.unread({ live: null });
  }
});

ipcMain.handle("market-quotes", async (_e, ids, line) => {
  try {
    const url = PetMarket.geckoManyUrl(Array.isArray(ids) ? ids : []);
    if (!url) return { ok: true, lives: {} };
    if (!PlateNet.mayFetch("quote", shownLine(line), [url])) return heldPlate({ lives: {} });
    const res = await PlateFetch.fetchPlate(url);
    if (!res.ok) return PlateFetch.unread({ lives: {} });
    return { ok: true, lives: PetMarket.parseGeckoMany(PlateFetch.parseJson(res.text)) };
  } catch {
    return PlateFetch.unread({ lives: {} });
  }
});

ipcMain.handle("market-terminal", async (_e, ticker, line) => {
  const row = PetMarket.parseTicker(ticker);
  if (!row || !row.address) return { ok: false, error: "unread", live: null };
  try {
    const url = PetMarket.terminalTokenUrl(row.platform || "solana", row.address);
    if (!url) return { ok: false, error: "unread", live: null };
    if (!PlateNet.mayFetch("terminal", shownLine(line), [url])) return heldPlate({ live: null });
    const res = await PlateFetch.fetchPlate(url);
    if (!res.ok) return PlateFetch.unread({ live: null });
    const live = PetMarket.parseTerminalToken(PlateFetch.parseJson(res.text));
    return live ? { ok: true, live } : PlateFetch.unread({ live: null });
  } catch {
    return PlateFetch.unread({ live: null });
  }
});

ipcMain.handle("market-search", async (_e, query, line) => {
  try {
    const url = PetMarket.searchUrl(query);
    if (!url) return { ok: true, coins: [], nfts: [] };
    if (!PlateNet.mayFetch("look", shownLine(line), [url])) return heldPlate({ coins: [], nfts: [] });
    const res = await PlateFetch.fetchPlate(url);
    if (!res.ok) return PlateFetch.unread({ coins: [], nfts: [] });
    const json = PlateFetch.parseJson(res.text);
    return { ok: true, coins: PetMarket.parseSearchCoins(json), nfts: PetMarket.parseSearchNfts(json) };
  } catch {
    return PlateFetch.unread({ coins: [], nfts: [] });
  }
});

ipcMain.handle("nft-quote", async (_e, nft, line) => {
  const row = PetMarket.parseNftRow(nft);
  if (!row) return { ok: false, error: "unread", live: null };
  try {
    const url = PetMarket.nftUrl(row.geckoId);
    if (!url) return { ok: false, error: "unread", live: null };
    if (!PlateNet.mayFetch("quote", shownLine(line), [url])) return heldPlate({ live: null });
    const res = await PlateFetch.fetchPlate(url);
    if (!res.ok) return PlateFetch.unread({ live: null });
    const live = PetMarket.parseNftLive(PlateFetch.parseJson(res.text));
    return live ? { ok: true, live } : PlateFetch.unread({ live: null });
  } catch {
    return PlateFetch.unread({ live: null });
  }
});

/** Real top-level window bounds on Windows, Linux X11, and Mac Accessibility. Rects only. */
let windowTick = null;
let windowBusy = false;

function windowEnumsHere() {
  return Desk.isWindows(process.platform) || Desk.isLinux(process.platform) || Desk.isMac(process.platform);
}

/** Windows and Linux skip the view handle. Mac skips the window number. The view pointer is not that id. */
function nativeSkipId(target) {
  if (!target || target.isDestroyed()) return "";
  try {
    if (Desk.isMac(process.platform)) return Windows.cgWindowIdFromMediaSource(target.getMediaSourceId());
    return Windows.hwndFromHandle(target.getNativeWindowHandle());
  } catch {
    return "";
  }
}

function overlaySkipIds() {
  const ids = [];
  const overlay = nativeSkipId(win);
  const settings = nativeSkipId(settingsWin);
  if (overlay) ids.push(overlay);
  if (settings) ids.push(settings);
  return ids;
}

function pushWindowRects() {
  if (!windowEnumsHere()) return;
  if (!win || win.isDestroyed() || windowBusy) return;
  windowBusy = true;
  const area = floorOf();
  const display = screen.getDisplayNearestPoint({ x: area.x, y: area.y });
  // Accessibility frames are points, the same space as the work area. A Retina scale would halve the sit.
  const scale = Desk.isMac(process.platform) ? 1 : display.scaleFactor || 1;
  WindowEnum.listRaw({ platform: process.platform })
    .then((listed) => {
      if (!win || win.isDestroyed()) return;
      const windows = Presence.scrubWindows(
        Windows.takeRects(listed.raw, {
          workArea: area,
          scaleFactor: scale,
          skipIds: overlaySkipIds(),
        }),
      );
      win.webContents.send("windows", windows);
    })
    .catch(() => {
      if (win && !win.isDestroyed()) win.webContents.send("windows", []);
    })
    .finally(() => {
      windowBusy = false;
    });
}

function startWindowTick() {
  if (!windowEnumsHere() || windowTick) return;
  pushWindowRects();
  windowTick = setInterval(pushWindowRects, 750);
}

function stopWindowTick() {
  if (windowTick) clearInterval(windowTick);
  windowTick = null;
}

let gpuTimer = null;
let gpuBusy = false;

function pushGpu() {
  if (!win || win.isDestroyed() || gpuBusy) return;
  gpuBusy = true;
  GpuSense.read({ platform: process.platform })
    .then((sample) => {
      if (win && !win.isDestroyed()) win.webContents.send("gpu", sample);
    })
    .catch(() => {
      if (win && !win.isDestroyed()) {
        win.webContents.send("gpu", {
          status: "unread",
          platform: process.platform,
          reason: "probe-failed",
          readAtMs: Date.now(),
        });
      }
    })
    .finally(() => {
      gpuBusy = false;
    });
}

function startGpuTick() {
  if (gpuTimer) return;
  pushGpu();
  gpuTimer = setInterval(pushGpu, 5000);
}

function stopGpuTick() {
  if (gpuTimer) clearInterval(gpuTimer);
  gpuTimer = null;
}

ipcMain.handle("license-status", licenseIpc(() => getLicenseSession().status()));
ipcMain.handle("license-unlock", licenseIpc((input) => getLicenseSession().unlock(input || {})));
ipcMain.handle("license-download", licenseIpc((input) => getLicenseSession().download(input || {})));
ipcMain.handle("license-fetch-bundle", licenseIpc((input) => getLicenseSession().fetchSigned(input || {})));
ipcMain.handle("license-clear", licenseIpc(() => getLicenseSession().clear()));

// Keeper card house-server row: hidden unless a server is named (Settings, env, or a held license).
ipcMain.handle("house-server-get", async () => {
  let licenseHeld = false;
  let licenseBackendUrl = "";
  try {
    const status = getLicenseSession().status();
    licenseHeld = status.held === true || status.unlocked === true;
    licenseBackendUrl = status.backendUrl || "";
  } catch {
    licenseHeld = false;
  }
  return HouseServer.houseServerState({
    savedUrl: HouseServer.readSaved(app.getPath("userData")),
    env: process.env,
    licenseHeld,
    licenseBackendUrl,
  });
});
ipcMain.handle("house-server-saved", () => ({ url: HouseServer.readSaved(app.getPath("userData")) }));
ipcMain.handle("house-server-set", (_e, url) => HouseServer.writeSaved(app.getPath("userData"), url));

app.on("will-quit", () => {
  stopDesktopFollow();
});

app.on("window-all-closed", () => {
  stopWindowTick();
  stopGpuTick();
  stopDesktopFollow();
  WindowEnum.disposePump();
  app.quit();
});
