const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen, Notification, powerMonitor } = require("electron");
const fs = require("fs");
const path = require("path");
const { createLicenseSession } = require("./license/session.cjs");
const { LicenseError } = require("./license/errors.cjs");
const Desk = require("./renderer/desk.js");
const Roster = require("./renderer/roster-load.js");
const Windows = require("./renderer/windows.js");
const WindowEnum = require("./windows-enum.cjs");

app.setAppUserModelId("works.richey.computerpets.desk");
app.commandLine.appendSwitch("enable-transparent-visuals");
app.commandLine.appendSwitch("disable-renderer-backgrounding");

/** @type {ReturnType<typeof createLicenseSession> | null} */
let licenseSession = null;

function getLicenseSession() {
  if (!licenseSession) {
    licenseSession = createLicenseSession({
      userDataDir: app.getPath("userData"),
      env: process.env,
    });
  }
  return licenseSession;
}

function licenseIpc(fn) {
  return async (_e, ...args) => {
    try {
      const result = await fn(...args);
      return result && typeof result === "object" ? { ok: true, ...result } : { ok: true, result };
    } catch (err) {
      const code = err instanceof LicenseError ? err.code : "denied";
      return { ok: false, unlocked: false, error: { code, message: err.message || String(err) } };
    }
  };
}

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
  return path.join(app.getPath("userData"), "mind.json");
}

function cardFile() {
  return path.join(app.getPath("userData"), "card.json");
}

function readCard() {
  try {
    const parsed = JSON.parse(fs.readFileSync(cardFile(), "utf8"));
    if (!parsed || typeof parsed !== "object") return { collapsed: false, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
    return parsed;
  } catch {
    return { collapsed: false, color: "ink", voiceStyle: "hearth", mutes: {}, off: false, pets: {} };
  }
}

function writeCard(data) {
  if (!data || typeof data !== "object") return;
  try {
    fs.writeFileSync(cardFile(), JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function readMind() {
  try {
    const parsed = JSON.parse(fs.readFileSync(mindFile(), "utf8"));
    if (!parsed || typeof parsed !== "object") return { default: { plugin: "local" }, voice: "browser", pets: {} };
    return parsed;
  } catch {
    return { default: { plugin: "local" }, voice: "browser", pets: {} };
  }
}

function writeMind(data) {
  if (!data || typeof data !== "object") return;
  const next = {
    default: data.default && typeof data.default === "object" ? data.default : { plugin: "local" },
    voice: typeof data.voice === "string" ? data.voice : "browser",
    pets: data.pets && typeof data.pets === "object" ? data.pets : {},
  };
  try {
    fs.writeFileSync(mindFile(), JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

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

function statusLabel() {
  const bits = [currentName(), lastVitals.stage, lastVitals.vital];
  if (lastVitals.mess) bits.push(`mess ${lastVitals.mess}`);
  if (lastVitals.bond) bits.push(`bond ${lastVitals.bond}`);
  return bits.join(" · ");
}

function trayTemplate() {
  return [
    { label: statusLabel(), enabled: false },
    { type: "separator" },
    { label: "On the desk", submenu: deskPickMenu() },
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    ...careMenu(),
    { type: "separator" },
    { label: "Unlock…", click: () => openSettings() },
    { label: "Minds…", click: () => openSettings() },
    {
      label: "Show",
      click: () => {
        win?.showInactive();
        win?.setAlwaysOnTop(true, "screen-saver");
      },
    },
    { label: "Hide the window", click: () => win?.hide() },
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
  tray?.setContextMenu(Menu.buildFromTemplate(trayTemplate()));
  tray?.setToolTip(statusLabel() + " — ComputerPets");
  if (Desk.appMenu(process.platform)) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(macAppMenu()));
  }
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

function openSettings() {
  if (settingsWin) {
    settingsWin.show();
    settingsWin.focus();
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
  settingsWin.loadFile(path.join(__dirname, "renderer", "settings.html"));
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

  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  win.once("ready-to-show", () => {
    fitWorkArea();
    win?.showInactive();
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
    { label: "Unlock…", click: () => openSettings() },
    { label: "Minds…", click: () => openSettings() },
    { type: "separator" },
    { label: "Hide the window", click: () => win?.hide() },
    { label: "Quit", click: () => app.quit() },
  ]).popup({ window: win, x: Math.round(x), y: Math.round(y) });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    win?.showInactive();
    win?.setAlwaysOnTop(true, "screen-saver");
  });
  app.whenReady().then(() => {
    loadRoster();
    if (process.platform === "darwin") app.dock?.hide();
    createWindow();
    createTray();
    startHitForward();
    startWindowTick();
    screen.on("display-metrics-changed", fitWorkArea);
    screen.on("display-added", fitWorkArea);
    screen.on("display-removed", fitWorkArea);
    powerMonitor.on("suspend", () => win?.webContents.send("command", "rest"));
    powerMonitor.on("resume", fitWorkArea);
    powerMonitor.on("lock-screen", () => win?.webContents.send("command", "rest"));
  });
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

ipcMain.on("mind-set", (_e, data) => {
  writeMind(data);
});

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

/** Real top-level window bounds on Windows. Rects only. Mac/Linux stay a later door. */
let windowTick = null;
let windowBusy = false;

function overlaySkipIds() {
  const ids = [];
  if (win && !win.isDestroyed()) {
    try {
      const id = Windows.hwndFromHandle(win.getNativeWindowHandle());
      if (id) ids.push(id);
    } catch {
      /* ignore */
    }
  }
  if (settingsWin && !settingsWin.isDestroyed()) {
    try {
      const id = Windows.hwndFromHandle(settingsWin.getNativeWindowHandle());
      if (id) ids.push(id);
    } catch {
      /* ignore */
    }
  }
  return ids;
}

function pushWindowRects() {
  if (!Desk.isWindows(process.platform)) return;
  if (!win || win.isDestroyed() || windowBusy) return;
  windowBusy = true;
  const area = floorOf();
  const display = screen.getDisplayNearestPoint({ x: area.x, y: area.y });
  WindowEnum.listRaw({ platform: process.platform })
    .then((listed) => {
      if (!win || win.isDestroyed()) return;
      const windows = Windows.takeRects(listed.raw, {
        workArea: area,
        scaleFactor: display.scaleFactor || 1,
        skipIds: overlaySkipIds(),
      });
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
  if (!Desk.isWindows(process.platform) || windowTick) return;
  pushWindowRects();
  windowTick = setInterval(pushWindowRects, 750);
}

function stopWindowTick() {
  if (windowTick) clearInterval(windowTick);
  windowTick = null;
}

ipcMain.handle("license-status", licenseIpc(() => getLicenseSession().status()));
ipcMain.handle("license-unlock", licenseIpc((input) => getLicenseSession().unlock(input || {})));
ipcMain.handle("license-download", licenseIpc(() => getLicenseSession().download()));
ipcMain.handle("license-clear", licenseIpc(() => getLicenseSession().clear()));

app.on("window-all-closed", () => {
  stopWindowTick();
  WindowEnum.disposePump();
  app.quit();
});
