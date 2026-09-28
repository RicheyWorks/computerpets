// The checkJs pass maps "electron" here (desktop/tsconfig.checkjs.json "paths"), so the count is the same
// whether or not desktop/node_modules has Electron installed. When it is installed, scripts/checkjs-baseline.mjs
// runs a second pass with Electron's own types (tsconfig.checkjs-electron.json) that may not find more errors.
export const app: any;
export const BrowserWindow: any;
export const contextBridge: any;
export const ipcMain: any;
export const ipcRenderer: any;
export const Menu: any;
export const nativeImage: any;
export const Notification: any;
export const powerMonitor: any;
export const safeStorage: any;
export const screen: any;
export const shell: any;
export const Tray: any;
export type MenuItemConstructorOptions = any;
