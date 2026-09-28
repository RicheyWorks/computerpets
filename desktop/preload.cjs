const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desk", {
  platform: process.platform,
  setClickable: (clickable) => ipcRenderer.send("set-clickable", !!clickable),
  setHits: (rects) => ipcRenderer.send("set-hits", Array.isArray(rects) ? rects : []),
  setFocusable: (focusable) => ipcRenderer.send("set-focusable", !!focusable),
  openMenu: (x, y) => ipcRenderer.send("pet-menu", { x, y }),
  // Whether the tray icon can be seen ("no" where there is no tray to see): the hello points at the pet's menu then.
  trayHost: () => ipcRenderer.sendSync("tray-host-get"),
  onTrayHost: (fn) => {
    const wrapped = (_e, state) => fn(typeof state === "string" ? state : "unknown");
    ipcRenderer.on("tray-host", wrapped);
    return () => ipcRenderer.removeListener("tray-host", wrapped);
  },
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
  mindSet: (data) => ipcRenderer.invoke("mind-set", data),
  // Minds Save tests the saved mind: the House window asks, and the overlay (which talks to minds) answers, since
  // the House window has no fetch of its own. `line` is the network line painted in view on the House window.
  mindTest: (line) => ipcRenderer.invoke("mind-test", typeof line === "string" ? line : ""),
  onMindTest: (fn) => {
    const wrapped = (_e, id, line) => {
      Promise.resolve()
        .then(() => fn(typeof line === "string" ? line : ""))
        .then(
          (reply) => ipcRenderer.send("mind-test-done", id, reply),
          () => ipcRenderer.send("mind-test-done", id, { source: "local", problem: "unknown" }),
        );
    };
    ipcRenderer.on("mind-test-run", wrapped);
    return () => ipcRenderer.removeListener("mind-test-run", wrapped);
  },
  cardGet: () => ipcRenderer.sendSync("card-get"),
  cardSet: (data) => ipcRenderer.send("card-set", data),
  quit: () => ipcRenderer.send("quit-desk"),
  roster: () => ipcRenderer.invoke("roster-get"),
  armWeatherLocate: () => ipcRenderer.invoke("weather-locate-arm"),
  clearWeatherLocate: () => ipcRenderer.invoke("weather-locate-clear"),
  radioSearch: (query, area, line) => ipcRenderer.invoke("radio-search", query, area, line),
  newsTopic: (query, line) => ipcRenderer.invoke("news-topic", query, line),
  newsFeed: (opts) => ipcRenderer.invoke("news-feed", opts),
  marketQuote: (ticker, line) => ipcRenderer.invoke("market-quote", ticker, line),
  marketQuotes: (ids, line) => ipcRenderer.invoke("market-quotes", ids, line),
  marketTerminal: (ticker, line) => ipcRenderer.invoke("market-terminal", ticker, line),
  marketSearch: (query, line) => ipcRenderer.invoke("market-search", query, line),
  nftQuote: (nft, line) => ipcRenderer.invoke("nft-quote", nft, line),
  licenseStatus: () => ipcRenderer.invoke("license-status"),
  licenseUnlock: (input) => ipcRenderer.invoke("license-unlock", input),
  licenseDownload: (input) => ipcRenderer.invoke("license-download", input),
  licenseFetchBundle: (input) => ipcRenderer.invoke("license-fetch-bundle", input),
  licenseClear: () => ipcRenderer.invoke("license-clear"),
  houseServer: () => ipcRenderer.invoke("house-server-get"),
  houseServerSaved: () => ipcRenderer.invoke("house-server-saved"),
  houseServerSet: (url) => ipcRenderer.invoke("house-server-set", typeof url === "string" ? url : ""),
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
  onSettingsSection: (fn) => {
    const wrapped = (_e, section) => fn(section === "unlock" ? "unlock" : "minds");
    ipcRenderer.on("settings-section", wrapped);
    return () => ipcRenderer.removeListener("settings-section", wrapped);
  },
  onGpu: (fn) => {
    const wrapped = (_e, sample) => fn(sample);
    ipcRenderer.on("gpu", wrapped);
    return () => ipcRenderer.removeListener("gpu", wrapped);
  },
});
