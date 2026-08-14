const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desk", {
  setClickable: (clickable) => ipcRenderer.send("set-clickable", !!clickable),
  openMenu: (x, y) => ipcRenderer.send("pet-menu", { x, y }),
  switchPet: (key) => ipcRenderer.send("switch-pet", key),
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
