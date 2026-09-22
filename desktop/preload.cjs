const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desk", {
  platform: process.platform,
  setClickable: (clickable) => ipcRenderer.send("set-clickable", !!clickable),
  setHits: (rects) => ipcRenderer.send("set-hits", Array.isArray(rects) ? rects : []),
  setFocusable: (focusable) => ipcRenderer.send("set-focusable", !!focusable),
  openMenu: (x, y) => ipcRenderer.send("pet-menu", { x, y }),
  switchPet: (key) => ipcRenderer.send("switch-pet", key),
  notify: (title, body, meta) => {
    const payload =
      title && typeof title === "object"
        ? title
        : { title, body, ...(meta && typeof meta === "object" ? meta : {}) };
    ipcRenderer.send("notify", payload);
  },
  vitals: (payload) => ipcRenderer.send("vitals", payload),
  mindGet: () => ipcRenderer.sendSync("mind-get"),
  mindSet: (data) => ipcRenderer.send("mind-set", data),
  cardGet: () => ipcRenderer.sendSync("card-get"),
  cardSet: (data) => ipcRenderer.send("card-set", data),
  quit: () => ipcRenderer.send("quit-desk"),
  roster: () => ipcRenderer.invoke("roster-get"),
  radioSearch: (query, area) => ipcRenderer.invoke("radio-search", query, area),
  newsTopic: (query) => ipcRenderer.invoke("news-topic", query),
  newsFeed: (opts) => ipcRenderer.invoke("news-feed", opts),
  marketQuote: (ticker) => ipcRenderer.invoke("market-quote", ticker),
  marketQuotes: (ids) => ipcRenderer.invoke("market-quotes", ids),
  marketTerminal: (ticker) => ipcRenderer.invoke("market-terminal", ticker),
  marketSearch: (query) => ipcRenderer.invoke("market-search", query),
  nftQuote: (nft) => ipcRenderer.invoke("nft-quote", nft),
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
  onWindows: (fn) => {
    const wrapped = (_e, list) => fn(list);
    ipcRenderer.on("windows", wrapped);
    return () => ipcRenderer.removeListener("windows", wrapped);
  },
  onGpu: (fn) => {
    const wrapped = (_e, sample) => fn(sample);
    ipcRenderer.on("gpu", wrapped);
    return () => ipcRenderer.removeListener("gpu", wrapped);
  },
});
