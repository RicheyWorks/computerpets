const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require("electron");
const fs = require("fs");
const path = require("path");

/** @type {BrowserWindow | null} */
let win = null;
/** @type {Tray | null} */
let tray = null;
/** @type {{ key: string, name: string, speciesLabel: string }[]} */
let roster = [];
let currentKey = "red_panda";

function loadRoster() {
  const file = path.join(__dirname, "renderer", "roster.json");
  roster = JSON.parse(fs.readFileSync(file, "utf8"));
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

function trayTemplate() {
  return [
    { label: currentName(), enabled: false },
    { type: "separator" },
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    { label: "Feed", click: () => win?.webContents.send("command", "feed") },
    { label: "Play", click: () => win?.webContents.send("command", "play") },
    { label: "Rest", click: () => win?.webContents.send("command", "rest") },
    { label: "Talk", click: () => win?.webContents.send("command", "talk") },
    { type: "separator" },
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
  tray?.setToolTip(`${currentName()} — ComputerPets`);
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
    { label: "Companions", submenu: companionMenu() },
    { type: "separator" },
    { label: "Feed", click: () => win?.webContents.send("command", "feed") },
    { label: "Play", click: () => win?.webContents.send("command", "play") },
    { label: "Rest", click: () => win?.webContents.send("command", "rest") },
    { label: "Talk", click: () => win?.webContents.send("command", "talk") },
    { type: "separator" },
    { label: `Hide ${currentName()}`, click: () => win?.hide() },
    { label: "Quit", click: () => app.quit() },
  ]).popup({ window: win, x: Math.round(x), y: Math.round(y) });
}

app.commandLine.appendSwitch("enable-transparent-visuals");

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

app.on("window-all-closed", () => {
  app.quit();
});
