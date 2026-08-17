const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen, Notification, powerMonitor } = require("electron");
const fs = require("fs");
const path = require("path");
const { createLicenseSession } = require("./license/session.cjs");
const { LicenseError } = require("./license/errors.cjs");

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
let lastVitals = { vital: "Settled", hunger: 80, sick: false, hidden: false, mess: 0, bond: 0, stage: "grown" };

function loadRoster() {
  const file = path.join(__dirname, "renderer", "roster.json");
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    roster = Array.isArray(parsed) ? parsed.filter((r) => r && r.key && r.name) : [];
  } catch {
    roster = [];
  }
}

function mindFile() {
  return path.join(app.getPath("userData"), "mind.json");
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

function companionMenu() {
  return roster.map((r) => ({
    label: `${r.name} — ${r.speciesLabel}`,
    type: "radio",
    checked: r.key === currentKey,
    click: () => {
      currentKey = r.key;
      win?.webContents.send("switch", r.key);
      refreshMenus();
    },
  }));
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
    { label: "Call back", click: () => win?.webContents.send("command", "call") },
    { label: "Special", click: () => win?.webContents.send("command", "special") },
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
    { label: "Hide", click: () => win?.hide() },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ];
}

function refreshMenus() {
  tray?.setContextMenu(Menu.buildFromTemplate(trayTemplate()));
  tray?.setToolTip(statusLabel() + " — ComputerPets");
}

function fitWorkArea() {
  if (!win) return;
  const area = screen.getPrimaryDisplay().workArea;
  win.setBounds({ x: area.x, y: area.y, width: area.width, height: area.height });
  win.setAlwaysOnTop(true, "screen-saver");
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
  const area = screen.getPrimaryDisplay().workArea;
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
    focusable: true,
    show: false,
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
  win.once("ready-to-show", () => win?.showInactive());
  win.on("closed", () => {
    win = null;
  });
}

function createTray() {
  tray = new Tray(iconImage().resize({ width: 16, height: 16 }));
  refreshMenus();
  tray.on("click", () => {
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
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    ...careMenu(),
    { type: "separator" },
    { label: "Unlock…", click: () => openSettings() },
    { label: "Minds…", click: () => openSettings() },
    { type: "separator" },
    { label: `Hide ${currentName()}`, click: () => win?.hide() },
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
    screen.on("display-metrics-changed", fitWorkArea);
    screen.on("display-added", fitWorkArea);
    screen.on("display-removed", fitWorkArea);
    powerMonitor.on("suspend", () => win?.webContents.send("command", "rest"));
    powerMonitor.on("resume", fitWorkArea);
    powerMonitor.on("lock-screen", () => win?.webContents.send("command", "rest"));
  });
}

ipcMain.on("set-clickable", (_e, clickable) => {
  win?.setIgnoreMouseEvents(!clickable, { forward: true });
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
  const sig = `${currentKey}|${lastVitals.vital}|${lastVitals.stage}|${lastVitals.mess}|${lastVitals.bond}|${lastVitals.sick}|${lastVitals.hidden}`;
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

ipcMain.handle("license-status", licenseIpc(() => getLicenseSession().status()));
ipcMain.handle("license-unlock", licenseIpc((input) => getLicenseSession().unlock(input || {})));
ipcMain.handle("license-download", licenseIpc(() => getLicenseSession().download()));
ipcMain.handle("license-clear", licenseIpc(() => getLicenseSession().clear()));

app.on("window-all-closed", () => {
  app.quit();
});
