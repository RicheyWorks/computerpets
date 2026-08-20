const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desk", {
  platform: process.platform,
  setClickable: (clickable) => ipcRenderer.send("set-clickable", !!clickable),
  openMenu: (x, y) => ipcRenderer.send("pet-menu", { x, y }),
  switchPet: (key) => ipcRenderer.send("switch-pet", key),
  notify: (title, body) => ipcRenderer.send("notify", { title, body }),
  vitals: (payload) => ipcRenderer.send("vitals", payload),
  mindGet: () => ipcRenderer.sendSync("mind-get"),
  mindSet: (data) => ipcRenderer.send("mind-set", data),
  licenseStatus: () => ipcRenderer.invoke("license-status"),
  licenseUnlock: (input) => ipcRenderer.invoke("license-unlock", input),
  licenseDownload: () => ipcRenderer.invoke("license-download"),
  licenseClear: () => ipcRenderer.invoke("license-clear"),
  onCommand: (fn) => {
    const wrapped = (_e, cmd) => fn(cmd);
    ipcRenderer.on("command", wrapped);
    return () => ipcRenderer.removeListener("command", wrapped);
  },
  onSwitch: (fn) => {
    const wrapped = (_e, key) => fn(key);
    ipcRenderer.on("switch", wrapped);
    return () => ipcRenderer.removeListener("switch", wrapped);
  },
});
