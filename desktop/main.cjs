const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require("electron");
const path = require("path");

/** @type {BrowserWindow | null} */
let win = null;
/** @type {Tray | null} */
let tray = null;

function iconImage() {
  return nativeImage.createFromPath(path.join(__dirname, "renderer", "icon.png"));
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
  tray.setToolTip("Rui — ComputerPets");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Rui", enabled: false },
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
    ]),
  );
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
    { label: "Feed", click: () => win?.webContents.send("command", "feed") },
    { label: "Play", click: () => win?.webContents.send("command", "play") },
    { label: "Rest", click: () => win?.webContents.send("command", "rest") },
    { label: "Talk", click: () => win?.webContents.send("command", "talk") },
    { type: "separator" },
    { label: "Hide Rui", click: () => win?.hide() },
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

app.on("window-all-closed", () => {
  app.quit();
});
