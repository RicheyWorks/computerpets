/**
 * Buffffff app_harness: the House window (settings.html), Unlock offline, and the full tray menu,
 * all through the real desktop/main.cjs under the stand-in Electron of harness_main.cjs.
 *
 * - The House window runs its own scripts (weather-areas, license-net, presence, mind, roster-load, and the
 *   inline page script) against a small stand-in DOM, bridged to main by the real preload.cjs.
 * - Unlock drives the real desktop/license code with fake house-server answers. The license key
 *   and the bundle signing key are test-only values made here; nothing reads a real secret, the
 *   OS machine id (hwid.txt is pre-written), or the network.
 * - The tray rows are clicked the way the keeper clicks them. GPU gates that change the tray are
 *   booted in child node processes, because main.cjs loads once per process.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const Main = require("./harness_main.cjs");

const DESKTOP = path.join(__dirname, "..", "..", "desktop");
const RENDERER = path.join(DESKTOP, "renderer");

/** Test-only keys, made here. Never a real LICENSE_SECRET_KEY or BUNDLE_SIGNING_KEY. */
const TEST_SECRET = Buffer.alloc(32, 9).toString("base64");
const TEST_SIGNING = "harness-bundle-signing-key-test-only";
const HWID = crypto.createHash("sha256").update("computerpets-harness-device").digest("hex");
const OTHER_HWID = crypto.createHash("sha256").update("computerpets-harness-other-device").digest("hex");
const BACKEND = "http://127.0.0.1:8081";
const HOST = "127.0.0.1:8081";
const PETS_STILL = "Pets still work without it.";
const RAW = /ECONN|ENOTFOUND|fetch failed|TypeError|NullPointer|java\.|com\.house|license expired|hardware binding|hwid does not|ownership not verified|LICENSE_SECRET_KEY|steamId and appId|backend is unreachable|\n\s+at /;

function ok(detail, extras = {}, trace = []) {
  return { ok: true, detail, extras, trace };
}

function fail(error, extras = {}, trace = []) {
  return { ok: false, detail: error, error, extras, trace };
}

/** Same reversible stand-in as harness_main's safeStorage: XOR 0x5a, base64 on disk. */
function openSeal(sealed) {
  return Buffer.from(Buffer.from(String(sealed), "base64").map((b) => b ^ 0x5a)).toString("utf8");
}

function licenseEnv() {
  for (const k of ["LICENSE_SECRET_KEY", "COMPUTERPETS_LICENSE_SECRET_KEY", "COMPUTERPETS_BACKEND_URL", "ENTERPRISEPET_BACKEND_URL", "BUNDLE_SIGNING_KEY"]) {
    delete process.env[k];
  }
  process.env.LICENSE_SECRET_KEY = TEST_SECRET;
  process.env.BUNDLE_SIGNING_KEY = TEST_SIGNING;
}

function respond(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

/** One verify answer carrying a license the real decrypt opens (or refuses as expired). */
function issuance({ validUntil, hwid, jti = crypto.randomUUID() }) {
  const { encryptLicense } = require(path.join(DESKTOP, "license", "contract-test-double.cjs"));
  const payload = { jti, owner: "76561198000000001", pet: "red_panda", validUntil, issuedAt: new Date(Date.parse(validUntil) - 86400000).toISOString(), hwid };
  return {
    status: "success",
    provider: "steam",
    license: encryptLicense(payload, TEST_SECRET),
    auth: { token: `harness.${jti}`, tokenType: "Bearer", expiresAt: new Date(Date.now() + 1800000).toISOString() },
  };
}

function captureWarn() {
  const lines = [];
  const real = console.warn;
  console.warn = (...args) => lines.push(args.map(String).join(" "));
  return { lines, restore: () => (console.warn = real) };
}

function walk(dir) {
  const out = [];
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) out.push(...walk(file));
    else out.push(file);
  }
  return out;
}

/** Every file main wrote under userData that holds one of the needles. */
function secretFiles(dir, needles) {
  return walk(dir).filter((file) => {
    const text = fs.readFileSync(file, "latin1");
    return needles.some((n) => n && text.includes(n));
  });
}

const UNLOCK = { backendUrl: BACKEND, provider: "steam", steamId: "76561198000000001", appId: "480", petType: "red_panda", licenseLine: "", cdnLine: "" };

async function licenseOffline() {
  licenseEnv();
  const ctx = await Main.bootMain();
  const warn = captureWarn();
  try {
    fs.writeFileSync(path.join(ctx.userData, "hwid.txt"), HWID);
    const { createContractTestDouble } = require(path.join(DESKTOP, "license", "contract-test-double.cjs"));
    const { NO_TOKEN_MESSAGE, FIELDS_MISSING_MESSAGE } = require(path.join(DESKTOP, "license", "session.cjs"));
    const storeFile = path.join(ctx.userData, "license.json");
    const readStore = () => (fs.existsSync(storeFile) ? fs.readFileSync(storeFile, "utf8") : "");
    const fails = [];
    const trace = [];
    const tokens = [];

    /** A refusal: exact plain words, no raw text, raw text only in the log. */
    async function refused(label, channel, input, want, rawInLog) {
      const before = warn.lines.length;
      const r = await ctx.invoke(channel, input);
      const message = r && r.error && r.error.message;
      if (!r || r.ok !== false || r.unlocked !== false) fails.push(`${label}: not refused (${JSON.stringify(r && r.ok)})`);
      else if (message !== want) fails.push(`${label}: said "${message}"`);
      else if (RAW.test(message)) fails.push(`${label}: raw text reached the window`);
      else if (rawInLog && !warn.lines.slice(before).some((l) => rawInLog.test(l))) fails.push(`${label}: the raw error is not in the log`);
      else trace.push(`${label}=plain`);
      return r;
    }

    // 1. Valid: the contract double issues a license bound to this computer.
    const double = createContractTestDouble({ licenseSecret: TEST_SECRET, signingKey: TEST_SIGNING });
    ctx.fetchImpl = double.fetchImpl;
    const good = await ctx.invoke("license-unlock", UNLOCK);
    const download = double.calls.find((c) => c.path === "/api/download/red_panda");
    const token = download ? String(download.headers.Authorization || "").replace(/^Bearer /, "") : "";
    tokens.push(token);
    if (!good || good.ok !== true || good.unlocked !== true) fails.push(`valid unlock did not unlock: ${JSON.stringify(good && good.error)}`);
    else if (good.license.hwid !== HWID || good.license.pet !== "red_panda") fails.push("valid unlock lost the pet or this computer's mark");
    else if (!good.download || !/jti=/.test(good.download.downloadUrl || "")) fails.push("valid unlock did not get a signed download");
    else trace.push("valid=unlocked");
    const verify = double.calls.find((c) => c.path === "/api/verify/steam");
    if (!verify || verify.body.hwid !== HWID) fails.push("verify did not carry the stored hash");
    const disk = readStore();
    const saved = disk ? JSON.parse(disk) : {};
    if (!token) fails.push("the unlock's own download carried no sign-in");
    else if (disk.includes(token)) fails.push("license.json holds the download sign-in in plain text");
    else if (!saved.auth || openSeal(saved.auth.sealedToken || "") !== token) fails.push("license.json did not keep the sealed sign-in");
    else trace.push("token_plain=0", "token=sealed");
    const status = await ctx.invoke("license-status");
    if (!status || status.unlocked !== true || status.error) fails.push("license-status after unlock is not unlocked");

    // 2. The house refuses the bound download (server-side binding check): plain words.
    ctx.fetchImpl = async () => respond(403, { error: "hardware binding mismatch", hint: "This license is bound to a specific device" });
    await refused("server_binding", "license-download", { licenseLine: "", cdnLine: "" },
      `This license belongs to a different computer, so it does not work here. Unlock again on this computer. ${PETS_STILL}`, /hardware binding mismatch/);
    // This computer's stored mark changed: refused before anything is posted.
    fs.writeFileSync(path.join(ctx.userData, "hwid.txt"), OTHER_HWID);
    const posts = ctx.fetches.length;
    await refused("local_binding", "license-download", { licenseLine: "", cdnLine: "" },
      `This license belongs to a different computer, so it does not work here. Unlock again on this computer. ${PETS_STILL}`, /hardware binding mismatch/);
    if (ctx.fetches.length !== posts) fails.push("a download for another computer's license still posted");
    fs.writeFileSync(path.join(ctx.userData, "hwid.txt"), HWID);

    // 3. No secret store: the sign-in stays in memory; a later download says so plainly.
    ctx.encryption = false;
    await ctx.invoke("license-clear");
    const bare = createContractTestDouble({ licenseSecret: TEST_SECRET, signingKey: TEST_SIGNING });
    ctx.fetchImpl = bare.fetchImpl;
    const bareUnlock = await ctx.invoke("license-unlock", UNLOCK);
    const bareDownload = bare.calls.find((c) => c.path === "/api/download/red_panda");
    const bareToken = bareDownload ? String(bareDownload.headers.Authorization || "").replace(/^Bearer /, "") : "";
    tokens.push(bareToken);
    const bareDisk = readStore();
    const bareSaved = bareDisk ? JSON.parse(bareDisk) : {};
    if (!bareUnlock || bareUnlock.ok !== true || !bareToken) fails.push("with no secret store, Unlock's own download did not run");
    else if (bareDisk.includes(bareToken) || (bareSaved.auth && (bareSaved.auth.token || bareSaved.auth.sealedToken))) fails.push("with no secret store the sign-in reached license.json");
    else trace.push("no_store_token=memory");
    // After a restart the memory is gone (Clear drops it here) and license.json is all there is:
    // there is no sign-in to send, so the download says so plainly and posts nothing.
    await ctx.invoke("license-clear");
    fs.writeFileSync(storeFile, JSON.stringify(bareSaved));
    const heldBefore = bare.calls.length;
    await refused("no_token", "license-download", { licenseLine: "", cdnLine: "" }, NO_TOKEN_MESSAGE, null);
    if (bare.calls.length !== heldBefore) fails.push("a download with no sign-in still posted");
    ctx.encryption = true;
    await ctx.invoke("license-clear");

    // 4. Expired: the license the house sent is already out of date.
    ctx.fetchImpl = async () => respond(200, issuance({ validUntil: "2020-01-01T00:00:00.000Z", hwid: HWID }));
    await refused("expired", "license-unlock", UNLOCK, `This license has expired. Unlock again to get a new one. ${PETS_STILL}`, /license expired/);

    // 5. Wrong machine: the house bound the license to another computer.
    ctx.fetchImpl = async () => respond(200, issuance({ validUntil: new Date(Date.now() + 86400000 * 30).toISOString(), hwid: OTHER_HWID }));
    await refused("wrong_machine", "license-unlock", UNLOCK,
      `This license belongs to a different computer, so it does not work here. Unlock again on this computer. ${PETS_STILL}`, /hwid does not match/);

    // 6. Network down: the fetch itself throws, like a refused connection.
    ctx.fetchImpl = async () => {
      throw new TypeError("fetch failed", { cause: Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:8081"), { code: "ECONNREFUSED" }) });
    };
    await refused("net_down", "license-unlock", UNLOCK, `Couldn't reach the house server at ${HOST}. ${PETS_STILL}`, /ECONNREFUSED/);

    // 7. 500 with a stack-trace body.
    ctx.fetchImpl = async () => respond(500, { error: "java.lang.NullPointerException at com.house.Verify" });
    await refused("http_500", "license-unlock", UNLOCK, `The house server at ${HOST} had a problem (error 500). Try again later. ${PETS_STILL}`, /NullPointerException/);

    // 8. 403 with the server's own words.
    ctx.fetchImpl = async () => respond(403, { error: "Steam Web API key rejected by com.house.SteamVerifier" });
    await refused("denied", "license-unlock", UNLOCK,
      `The house server at ${HOST} did not confirm that you own the game. Check the Steam ID and the App ID, then try again. ${PETS_STILL}`, /SteamVerifier/);

    // 9. A stored license that has since expired: license-status says it plainly too.
    const { encryptLicense } = require(path.join(DESKTOP, "license", "contract-test-double.cjs"));
    const old = encryptLicense({ jti: crypto.randomUUID(), owner: "76561198000000001", pet: "red_panda", validUntil: "2021-06-01T00:00:00.000Z", issuedAt: "2021-05-01T00:00:00.000Z", hwid: HWID }, TEST_SECRET);
    fs.writeFileSync(storeFile, JSON.stringify({ backendUrl: BACKEND, provider: "steam", license: old }));
    const before = warn.lines.length;
    const expiredStatus = await ctx.invoke("license-status");
    const stMsg = expiredStatus && expiredStatus.error && expiredStatus.error.message;
    if (!expiredStatus || expiredStatus.unlocked !== false || stMsg !== `This license has expired. Unlock again to get a new one. ${PETS_STILL}`) fails.push(`license-status for an expired license said "${stMsg}"`);
    else if (!warn.lines.slice(before).some((l) => /license expired/.test(l))) fails.push("license-status did not log the raw refusal");
    else trace.push("status_expired=plain");
    await ctx.invoke("license-clear");

    // 10. No license key in this copy of the app, and 11. empty Steam fields: nothing leaves.
    delete process.env.LICENSE_SECRET_KEY;
    const quiet = ctx.fetches.length;
    await refused("missing_secret", "license-unlock", UNLOCK, `This copy of the app has no license key set up, so it cannot open a license. ${PETS_STILL}`, /LICENSE_SECRET_KEY/);
    process.env.LICENSE_SECRET_KEY = TEST_SECRET;
    await refused("fields_missing", "license-unlock", { ...UNLOCK, steamId: "  " }, FIELDS_MISSING_MESSAGE, null);
    if (ctx.fetches.length !== quiet) fails.push("a refused unlock still reached the house server");

    // Nothing main wrote holds the license key or a download sign-in in plain text.
    const leaked = secretFiles(ctx.userData, [TEST_SECRET, ...tokens.filter(Boolean)]);
    if (leaked.length) fails.push(`secret text on disk: ${leaked.map((f) => path.basename(f)).join(", ")}`);
    else trace.push("secret_on_disk=0");
    if (ctx.fetches.some((f) => !/^http:\/\/127\.0\.0\.1:8081\//.test(f.url) && !/^https:\/\/cdn\.enterprisepet\.example\//.test(f.url))) fails.push("a license call left for another host");
    return fails.length
      ? fail(fails.join("; "), { passed: trace })
      : ok(`Unlock offline: valid unlock seals the sign-in; ${trace.filter((t) => t.endsWith("=plain")).length} refusals in plain words, raw text only in the log`, { scenarios: trace.length }, trace);
  } finally {
    warn.restore();
    ctx.cleanup();
  }
}

/* ---------- The House window ---------- */

/** A small stand-in DOM: only what settings.html's scripts touch. */
function makeDom(html) {
  const page = { scrolled: [], docHandlers: {} };
  const els = new Map();
  class El {
    constructor(tag, id, raw, text) {
      this.tagName = String(tag).toUpperCase();
      this.id = id || "";
      this.textContent = text || "";
      this._value = "";
      this.hidden = /\shidden(\s|$|=)/.test(raw || "");
      this.open = /\sopen(\s|$|=)/.test(raw || "");
      this.type = ((raw || "").match(/\stype="([^"]+)"/) || [])[1] || "";
      this.dataset = {};
      this.children = [];
      this.handlers = {};
      this.parent = null;
    }
    get value() {
      return this._value;
    }
    set value(v) {
      if (this.tagName === "SELECT") {
        const hit = this.children.find((o) => o.value === String(v));
        this._value = hit ? hit.value : "";
      } else {
        this._value = String(v == null ? "" : v);
      }
    }
    get options() {
      return this.children;
    }
    appendChild(child) {
      child.parent = this;
      this.children.push(child);
      if (this.tagName === "SELECT" && !this._value) this._value = child.value;
      return child;
    }
    addEventListener(type, fn) {
      (this.handlers[type] = this.handlers[type] || []).push(fn);
    }
    removeEventListener() {}
    async dispatch(type) {
      const ev = { type, target: this, preventDefault() {}, stopPropagation() {} };
      await Promise.all((this.handlers[type] || []).map((fn) => fn(ev)));
    }
    click() {
      return this.dispatch("click");
    }
    scrollIntoView() {
      page.scrolled.push(this.id);
    }
  }
  const tagRe = /<(\w+)\b([^>]*?)\sid="([^"]+)"([^>]*)>([^<]*)/g;
  let m;
  while ((m = tagRe.exec(html))) {
    const [, tag, a, id, b, text] = m;
    els.set(id, new El(tag, id, ` ${a} ${b}`, text.trim()));
  }
  // The provider select ships with its one option in the markup.
  const provider = els.get("provider");
  if (provider) {
    const o = new El("option", "", "", "Steam");
    o.value = "steam";
    provider.appendChild(o);
  }
  // A click on <summary> toggles its <details>, as the browser does.
  const details = els.get("unlockDetails");
  if (details) {
    const summary = new El("summary", "", "", "Details");
    summary.addEventListener("click", () => {
      details.open = !details.open;
    });
    details.appendChild(summary);
    page.summary = summary;
  }
  page.document = {
    getElementById: (id) => els.get(id) || null,
    createElement: (tag) => new El(tag, "", "", ""),
    addEventListener: (type, fn) => {
      (page.docHandlers[type] = page.docHandlers[type] || []).push(fn);
    },
    removeEventListener() {},
  };
  page.el = (id) => els.get(id);
  return page;
}

/** The real preload.cjs, sandboxed: it may require only "electron". Returns window.desk. */
function loadPreload(ctx, settingsWin) {
  const listeners = new Map();
  const required = [];
  let api = null;
  const electron = {
    contextBridge: {
      exposeInMainWorld: (name, value) => {
        if (name === "desk") api = value;
      },
    },
    ipcRenderer: {
      send: (ch, ...a) => ctx.send(ch, ...a),
      sendSync: (ch, ...a) => ctx.sendSync(ch, ...a),
      invoke: (ch, ...a) => ctx.invoke(ch, ...a),
      on: (ch, fn) => {
        if (!listeners.has(ch)) listeners.set(ch, []);
        listeners.get(ch).push(fn);
      },
      removeListener: (ch, fn) => {
        const list = listeners.get(ch) || [];
        const at = list.indexOf(fn);
        if (at >= 0) list.splice(at, 1);
      },
    },
  };
  const src = fs.readFileSync(path.join(DESKTOP, "preload.cjs"), "utf8");
  const fakeRequire = (name) => {
    required.push(name);
    if (name === "electron") return electron;
    throw new Error(`sandboxed preload may not require ${name}`);
  };
  new Function("require", "process", "module", "exports", src)(fakeRequire, { platform: process.platform }, {}, {});
  settingsWin.webContents.send = (ch, ...a) => {
    ctx.sent.push([ch, ...a]);
    for (const fn of listeners.get(ch) || []) fn({}, ...a);
  };
  return { api, required };
}

function memoryStore() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), clear: () => m.clear() };
}

async function settle(n = 40) {
  for (let i = 0; i < n; i += 1) await new Promise((r) => setImmediate(r));
}

/** Load settings.html the way the window does: its scripts in order, then the inline page script. */
function renderSettings(ctx, settingsWin) {
  const html = fs.readFileSync(path.join(RENDERER, "settings.html"), "utf8").replace(/\r\n/g, "\n");
  const page = makeDom(html);
  const { api, required } = loadPreload(ctx, settingsWin);
  const window = {
    document: page.document,
    localStorage: memoryStore(),
    sessionStorage: memoryStore(),
    location: { hash: settingsWin.loadOpts && settingsWin.loadOpts.hash ? `#${settingsWin.loadOpts.hash}` : "" },
    desk: api,
    URL,
    URLSearchParams,
    AbortController,
    setTimeout,
    clearTimeout,
    console,
  };
  window.window = window;
  vm.createContext(window);
  const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((x) => x[1]);
  for (const src of srcs) vm.runInContext(fs.readFileSync(path.join(RENDERER, src), "utf8"), window, { filename: src });
  const inline = html.slice(html.lastIndexOf("<script>") + "<script>".length, html.lastIndexOf("</script>"));
  vm.runInContext(inline, window, { filename: "settings.html (inline)" });
  return { page, window, srcs, required, html };
}

async function settingsWindow() {
  licenseEnv();
  const ctx = await Main.bootMain();
  const warn = captureWarn();
  try {
    const Presence = require(path.join(DESKTOP, "presence.cjs"));
    const mindFile = Presence.houseFile(ctx.userData, "mind.json");
    const SECRET = "xai-harness-window-0123456789abcdef";
    const fails = [];
    const trace = [];

    // The tray opens the House window: sandboxed, preload, isolated, at Minds.
    const count = ctx.windows.length;
    const trayNow = () => ctx.tray();
    const find = (label) => trayNow().find((r) => r && r.label === label);
    find("Minds…").click();
    const settingsWin = ctx.windows[count];
    const prefs = settingsWin && settingsWin.opts.webPreferences;
    if (!settingsWin || !/settings\.html$/.test(settingsWin.file || "")) return fail("Minds… did not open settings.html");
    if (!prefs || prefs.contextIsolation !== true || prefs.nodeIntegration !== false || prefs.sandbox !== true || !/preload\.cjs$/.test(prefs.preload || "")) fails.push("the House window is not sandboxed and isolated with the preload");
    if (settingsWin.loadOpts.hash !== "minds") fails.push(`Minds… opened at ${settingsWin.loadOpts.hash || "the top"}`);

    const { page, srcs, required, html } = renderSettings(ctx, settingsWin);
    await settle();
    const $ = page.el;
    const ids = ["plugin", "model", "base", "key", "keyStore", "save", "ok", "mindErr", "unlockDetails", "licenseMark", "backend", "steamId", "appId", "petType", "unlock", "lock", "licenseOk", "licenseErr", "mindsSection", "unlockSection"];
    const missing = ids.filter((id) => !$(id));
    if (missing.length) return fail(`settings.html has no ${missing.join(", ")}`);
    if (JSON.stringify(required) !== JSON.stringify(["electron"])) fails.push(`preload required ${required.join(", ")}`);
    if (JSON.stringify(srcs) !== JSON.stringify(["weather-areas.js", "license-net.js", "presence.js", "mind.js", "roster-load.js"])) fails.push(`settings.html loads ${srcs.join(", ")}`);
    if (!(page.docHandlers.drop || []).length) fails.push("the drop guard is not installed on the House window");
    if (page.scrolled[page.scrolled.length - 1] !== "mindsSection") fails.push("the window did not start at Minds");

    // Fields: 14 plugins, local by default, the whole roster under Pet, Locked by default.
    const plugin = $("plugin");
    const pluginIds = plugin.options.map((o) => o.value);
    if (pluginIds.length !== 14 || pluginIds[0] !== "local" || pluginIds.indexOf("xai") < 0) fails.push(`plugin list is ${pluginIds.join(",")}`);
    if (plugin.value !== "local") fails.push(`default plugin is ${plugin.value}`);
    if ($("keyStore").textContent !== "No key is saved yet.") fails.push(`key line on open: ${$("keyStore").textContent}`);
    const roster = JSON.parse(fs.readFileSync(path.join(RENDERER, "roster.json"), "utf8"));
    if ($("petType").options.length !== roster.length || $("petType").value !== "red_panda") fails.push(`Pet lists ${$("petType").options.length} of ${roster.length}, picked ${$("petType").value}`);
    if ($("licenseOk").textContent !== "Locked. Pets on the desk still work.") fails.push(`license line on open: ${$("licenseOk").textContent}`);
    if ($("licenseErr").textContent !== "") fails.push(`an error on open: ${$("licenseErr").textContent}`);
    trace.push(`plugins=${pluginIds.length}`, `pets=${$("petType").options.length}`);
    // The Pet list reads like the blotter's: name and kind, never the catalog key.
    const petTexts = $("petType").options.map((o) => o.textContent);
    const keyShown = roster.filter((r, i) => (petTexts[i] || "").includes(r.key) && r.key.includes("_"));
    if (petTexts[0] !== "Rui · Red Panda" || keyShown.length) fails.push(`Pet list lines: first "${petTexts[0]}", ${keyShown.length} show a key`);
    else trace.push("pets=name_and_kind");
    // A new keeper opening Minds reads that talk works without an AI; House lines hide the model, address, and key boxes.
    const intro = $("mindsIntro");
    if (!intro || intro.textContent !== "Pets talk without an AI. Adding one is optional.") fails.push(`Minds intro is ${intro ? intro.textContent : "missing"}`);
    if (!$("mindFields") || $("mindFields").hidden !== true || !$("mindHouse") || $("mindHouse").hidden === true) fails.push("House lines still show the model, address, and key boxes");
    if (!$("redownload") || $("redownload").textContent !== "Download my pet") fails.push(`download button says ${$("redownload") ? $("redownload").textContent : "nothing"}`);

    // Tray Unlock… on the open window: no second window, it scrolls to Unlock.
    find("Unlock…").click();
    await settle(4);
    if (ctx.windows.length !== count + 1) fails.push("Unlock… opened a second House window");
    if (!settingsWin.focused) fails.push("Unlock… did not bring the House window forward");
    if (page.scrolled[page.scrolled.length - 1] !== "unlockSection") fails.push("Unlock… did not scroll to Unlock");
    else trace.push("unlock_opens=unlock");

    // Choosing xai fills its model and base.
    plugin.value = "xai";
    await plugin.dispatch("change");
    const xaiModel = $("model").value;
    const xaiBase = $("base").value;
    if (!/^https:\/\/api\.x\.ai\//.test(xaiBase) || !xaiModel) fails.push(`xai filled ${xaiModel} ${xaiBase}`);
    if ($("mindFields").hidden !== false || $("mindHouse").hidden !== true) fails.push("choosing xai did not show the model, address, and key boxes");
    else trace.push("minds=house_lines_need_nothing");
    // The address and key boxes carry plain labels and a short helper line (same words as the web desk and the blotter).
    const pageHtml = fs.readFileSync(path.join(RENDERER, "settings.html"), "utf8");
    const plainBoxes =
      pageHtml.includes('<label for="base">AI website address</label>') &&
      pageHtml.includes('<label for="key">Your key for that AI website</label>') &&
      !/<label[^>]*>(Base URL|API key)<\/label>/.test(pageHtml) &&
      !!$("baseHelp") && $("baseHelp").textContent === "Where that AI answers. Picking an AI fills this in, so most people leave it alone." &&
      !!$("keyHelp") && $("keyHelp").textContent === "A secret code from that AI website's own page. Keep it secret, like a password.";
    if (!plainBoxes) fails.push("the address and key boxes are not in plain words");
    else trace.push("minds=plain_address_and_key");

    // Validation: each bad AI website address is named and nothing is saved.
    const bad = [
      ["http://api.x.ai/v1", /^The AI website address must start with https:\/\//],
      ["http://localhost:8080/v1", /only works with Ollama, LM Studio, or Custom/],
      ["https://me:hunter2@api.x.ai/v1", /name and password/],
      ["api.x.ai", /not a web address/],
    ];
    for (const [raw, want] of bad) {
      $("base").value = raw;
      $("key").value = SECRET;
      await $("save").click();
      if (!want.test($("mindErr").textContent)) fails.push(`AI website address ${raw} said "${$("mindErr").textContent}"`);
      if ($("ok").textContent) fails.push(`AI website address ${raw} still said "${$("ok").textContent}"`);
      if (fs.existsSync(mindFile)) fails.push(`AI website address ${raw} was saved`);
    }
    trace.push(`base_url_refused=${bad.length}`);

    // A good save seals the key; mind.json has no plain key.
    $("base").value = xaiBase;
    $("key").value = SECRET;
    await $("save").click();
    const disk = fs.existsSync(mindFile) ? fs.readFileSync(mindFile, "utf8") : "";
    if ($("ok").textContent !== "Saved. Talk to them again.") fails.push(`good save said "${$("ok").textContent}" ${$("mindErr").textContent}`);
    if ($("mindErr").textContent) fails.push("a good save left an error showing");
    if (!/locked in this computer's secret store/.test($("keyStore").textContent)) fails.push(`key line after save: ${$("keyStore").textContent}`);
    if (!disk || disk.includes(SECRET) || disk.includes("apiKey")) fails.push("mind.json is missing or holds the plain key");
    const back = ctx.sendSync("mind-get");
    if (!back || !back.default || back.default.apiKey !== SECRET || back.default.plugin !== "xai") fails.push("main did not keep the saved mind");
    else trace.push("save=sealed", "disk_plain_key=0");

    // mind.json cannot be written (a folder sits where it goes): "Not saved", never "Saved".
    fs.rmSync(mindFile, { force: true });
    fs.mkdirSync(mindFile, { recursive: true });
    $("model").value = "grok-4.5-mini";
    await $("save").click();
    if (!/^Not saved\. The settings file could not be written/.test($("mindErr").textContent)) fails.push(`unwritable mind.json said "${$("mindErr").textContent}"`);
    else if ($("ok").textContent) fails.push(`unwritable mind.json still said "${$("ok").textContent}"`);
    else if (/no secret store/.test($("keyStore").textContent)) fails.push("unwritable mind.json blamed the secret store");
    else trace.push("unwritable=not_saved");
    fs.rmSync(mindFile, { recursive: true, force: true });

    // No secret store: saved, and the key line says it was not written to disk.
    ctx.encryption = false;
    await $("save").click();
    const disk2 = fs.existsSync(mindFile) ? fs.readFileSync(mindFile, "utf8") : "";
    if ($("ok").textContent !== "Saved the mind. The key was not written to disk.") fails.push(`no-store save said "${$("ok").textContent}"`);
    if ($("keyStore").textContent !== "This computer has no secret store, so the key was not written to disk.") fails.push(`no-store key line: ${$("keyStore").textContent}`);
    if (disk2.includes(SECRET)) fails.push("with no secret store the key reached mind.json");
    else trace.push("no_store=not_written");
    ctx.encryption = true;

    // Privacy Details: folded at first, the summary opens it, the mark line follows hwid.txt.
    const details = $("unlockDetails");
    const at = page.document.getElementById("licenseMark");
    const firstMark = at.textContent;
    const dStart = html.indexOf('<details class="fold" id="unlockDetails">');
    const markAt = html.indexOf('id="licenseMark"');
    const inside = dStart >= 0 && markAt > dStart && markAt < html.indexOf("</details>", dStart);
    if (details.open) fails.push("Details starts open");
    await page.summary.click();
    if (!details.open) fails.push("the Details summary did not open it");
    await page.summary.click();
    if (details.open) fails.push("the Details summary did not fold it again");
    if (!inside) fails.push("the machine-id wording is not inside Details");
    if (!/did not look at this computer's ID/.test(firstMark)) fails.push("the first mark line changed");
    // Unlock Details is short lines like START-HERE: one sentence per line, none long.
    const markLines = firstMark.split("\n").map((l) => l.trim()).filter(Boolean);
    const longLine = markLines.find((l) => l.split(/\s+/).length > 18);
    if (markLines.length < 15 || longLine) fails.push(`the Details lines are not short (${markLines.length} lines${longLine ? `, "${longLine.slice(0, 40)}"` : ""})`);
    else trace.push(`mark_lines=${markLines.length}`);
    fs.writeFileSync(path.join(ctx.userData, "hwid.txt"), HWID);
    await $("lock").click();
    await settle(4);
    if (!/^A code is already saved in hwid\.txt\./.test(at.textContent)) fails.push(`with hwid.txt the mark line says "${at.textContent.slice(0, 60)}"`);
    else if (at.textContent.split("\n").length < 4) fails.push("the saved-code Details wording is not one sentence per line");
    else trace.push("details=folded_toggles", "mark=stored");

    // The Unlock fields: plain labels, one helper line each, the same words as the blotter dialog.
    const fieldWords = [
      ["provider", "Where you own the game", /^Only Steam works here for now\./],
      ["steamId", "Your Steam ID", /17 digits that start with 7656\. Steam shows it under Account details\.$/],
      ["appId", "Steam App ID", /ComputerPets has no Steam page yet\.$/],
    ];
    const dialogPy = fs.readFileSync(path.join(__dirname, "unlock_dialog.py"), "utf8");
    const unplainField = fieldWords.filter(([id, label, help]) => {
      const line = $(`${id}Help`) ? $(`${id}Help`).textContent : "";
      return !html.includes(`<label for="${id}">${label}</label>`) || !help.test(line) || !dialogPy.includes(`"${line}"`) || !dialogPy.includes(`"${label}"`);
    });
    if (unplainField.length) fails.push(`Unlock field words: ${unplainField.map(([id]) => id).join(", ")}`);
    else trace.push("unlock_fields=plain_labels+helpers_same_as_blotter");

    // Unlock with no Steam ID, then against a refused connection: plain words only.
    $("backend").value = BACKEND;
    await $("backend").dispatch("input");
    $("steamId").value = "";
    $("appId").value = "480";
    await $("unlock").click();
    await settle(4);
    if ($("licenseErr").textContent !== "Fill in the Steam ID and the App ID first. Pets still work without it.") fails.push(`empty Steam ID said "${$("licenseErr").textContent}"`);
    $("steamId").value = "76561198000000001";
    ctx.fetchImpl = async () => {
      throw new TypeError("fetch failed", { cause: Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:8081"), { code: "ECONNREFUSED" }) });
    };
    await $("unlock").click();
    await settle(4);
    const said = $("licenseErr").textContent;
    if (said !== `Couldn't reach the house server at ${HOST}. ${PETS_STILL}`) fails.push(`refused unlock said "${said}"`);
    else if (RAW.test(said)) fails.push("raw text reached the House window");
    else if ($("licenseOk").textContent !== "Locked. Pets on the desk still work.") fails.push(`refused unlock licenseOk "${$("licenseOk").textContent}"`);
    else trace.push("unlock_refused=plain");
    if (!warn.lines.some((l) => /ECONNREFUSED/.test(l))) fails.push("the refused connection is not in the log");
    // The page has no fetch of its own (connect-src 'none'); every call went through main.
    if (ctx.fetches.some((f) => !f.url.startsWith(`${BACKEND}/`))) fails.push("the House window reached a host other than the Backend URL");
    const leaked = secretFiles(ctx.userData, [SECRET, TEST_SECRET]);
    if (leaked.length) fails.push(`secret text on disk: ${leaked.map((f) => path.basename(f)).join(", ")}`);
    return fails.length
      ? fail(fails.join("; "), { passed: trace })
      : ok("House window: fields, AI website address checks, sealed save, Not saved, no store, Details, plain Unlock errors", { plugins: pluginIds.length, pets: roster.length }, trace);

  } finally {
    warn.restore();
    ctx.cleanup();
  }
}

/* ---------- The tray menu ---------- */

const CARE = [
  ["Feed", "feed"],
  ["Treat", "snack"],
  ["Play", "play"],
  ["Rest", "rest"],
  ["Talk", "talk"],
  null,
  ["Hide", "hide"],
  ["Call back", "call"],
  ["Clean", "clean"],
  ["Bath", "bath"],
  ["Medicine", "medicine"],
  ["Praise", "praise"],
  ["Special", "special"],
  ["Shed", "shed"],
];

function shape(template) {
  return template.map((r) => (r.type === "separator" ? "---" : r.label));
}

/** One GPU gate, booted in its own node process (main.cjs loads once per process). */
async function trayGate(kind) {
  const gates = {
    software: { open: true, path: "software", label: "GPU path · software (harness)" },
    refused: { open: false, reason: "software-refused", label: "GPU path · software refused (harness)" },
    blocked: { open: false, reason: "no-adapter", label: "GPU path · no adapter (harness)" },
  };
  // A closed window also says why in a message box now (overlay-gate.cjs); OK (the last button) answers it here, so
  // the tray's own Allow and Quit are what this row counts.
  const ctx = await Main.bootMain({ gate: gates[kind], dialogAnswer: kind === "refused" ? 2 : 1 });
  try {
    const t = ctx.tray();
    const out = { kind, shape: shape(t), disabled: t.filter((r) => r.enabled === false).map((r) => r.label), tip: ctx.tips[ctx.tips.length - 1], windows: ctx.windows.length };
    const hit = (label) => ctx.tray().find((r) => r.label === label);
    const choice = hit(kind === "software" ? "Require hardware compositing" : "Allow software compositing");
    if (choice) {
      ctx.writeExpect = false;
      choice.click();
      out.unsaved = { expects: ctx.expects.slice(), relaunches: ctx.relaunches, quits: ctx.quits };
      ctx.writeExpect = true;
      choice.click();
      out.saved = { expects: ctx.expects.slice(), relaunches: ctx.relaunches, quits: ctx.quits };
    }
    const quit = hit("Quit");
    const q0 = ctx.quits;
    if (quit) quit.click();
    out.quit = ctx.quits - q0;
    return out;
  } finally {
    ctx.cleanup();
  }
}

function runGate(kind) {
  const proc = spawnSync(process.execPath, [__filename, "--gate", kind], { encoding: "utf8", timeout: 20000 });
  const line = String(proc.stdout || "").trim().split(/\r?\n/).pop() || "";
  try {
    return JSON.parse(line);
  } catch {
    return { kind, error: (proc.stderr || line || "no output").slice(0, 200) };
  }
}

async function trayMenu() {
  const ctx = await Main.bootMain();
  try {
    const Desk = require(path.join(RENDERER, "desk.js"));
    const fails = [];
    const trace = [];
    const t0 = ctx.tray();
    const follow = Desk.desktopFollow(process.platform) ? ["Follow me across desktops"] : [];
    const gpu = t0[0] && t0[0].label;
    const status = t0[2] && t0[2].label;
    const want = [
      gpu, "---", status, "---", "On the desk", "Companions", "---",
      ...CARE.map((c) => (c ? c[0] : "---")), "---",
      "Keeper card", "Unlock…", "Minds…", "Show", "Hide the window", ...follow, "---", "Quit",
    ];
    if (JSON.stringify(shape(t0)) !== JSON.stringify(want)) fails.push(`tray rows are ${shape(t0).slice(3).join(" | ")}`);
    else trace.push(`rows=${t0.length}`);
    const disabled = t0.filter((r) => r.enabled === false).map((r) => r.label);
    if (JSON.stringify(disabled) !== JSON.stringify([gpu, status])) fails.push(`disabled rows: ${disabled.join(", ")}`);
    if (!/^GPU path · hardware/.test(gpu)) fails.push(`GPU row says ${gpu}`);
    for (const r of t0) {
      if (r.type === "separator" || r.enabled === false || r.submenu) continue;
      if (typeof r.click !== "function") fails.push(`${r.label} has no click`);
    }
    if (ctx.tips[ctx.tips.length - 1] !== `${status} — ComputerPets`) fails.push(`tooltip is ${ctx.tips[ctx.tips.length - 1]}`);

    // Each care row sends its one command to the overlay.
    let sentCare = 0;
    for (const row of CARE) {
      if (!row) continue;
      const [label, command] = row;
      const n = ctx.sent.length;
      ctx.tray().find((r) => r.label === label).click();
      const got = ctx.sent.slice(n);
      if (got.length !== 1 || got[0][0] !== "command" || got[0][1] !== command) fails.push(`${label} sent ${JSON.stringify(got)}`);
      else sentCare += 1;
    }
    trace.push(`care_commands=${sentCare}`);

    // Keeper card shows the overlay and asks it to open the card with the keyboard on it.
    {
      const n = ctx.sent.length;
      ctx.tray().find((r) => r.label === "Keeper card").click();
      const got = ctx.sent.slice(n);
      if (JSON.stringify(got) !== JSON.stringify([["command", { type: "open-card" }]])) fails.push(`Keeper card sent ${JSON.stringify(got)}`);
      else trace.push("keeper_card=open-card");
    }

    // Vitals rename the special row and fill the status line and tooltip.
    ctx.send("vitals", { verb: "Pounce", vital: "Hungry", stage: "kit", mess: 2, bond: 5 });
    const t1 = ctx.tray();
    const pounce = t1.find((r) => r.label === "Pounce");
    const status1 = t1[2].label;
    if (!pounce || t1.some((r) => r.label === "Special")) fails.push("the special row did not take the pet's verb");
    else {
      const n = ctx.sent.length;
      pounce.click();
      if (JSON.stringify(ctx.sent.slice(n)) !== JSON.stringify([["command", "special"]])) fails.push("the renamed special row did not send special");
    }
    if (!/ · kit · Hungry · mess 2 · bond 5$/.test(status1)) fails.push(`status after vitals: ${status1}`);
    if (ctx.tips[ctx.tips.length - 1] !== `${status1} — ComputerPets`) fails.push("tooltip did not follow the vitals");
    else trace.push("vitals=status+tooltip");

    // Minds… opens one House window at Minds; Unlock… reuses it and asks for Unlock.
    const w0 = ctx.windows.length;
    t1.find((r) => r.label === "Minds…").click();
    const house = ctx.windows[w0];
    if (!house || !/settings\.html$/.test(house.file || "") || house.loadOpts.hash !== "minds") fails.push("Minds… did not open the House window at Minds");
    const n = ctx.sent.length;
    ctx.tray().find((r) => r.label === "Unlock…").click();
    const asked = ctx.sent.slice(n).filter((m) => m[0] === "settings-section");
    if (ctx.windows.length !== w0 + 1) fails.push("Unlock… opened a second House window");
    else if (JSON.stringify(asked) !== JSON.stringify([["settings-section", "unlock"]])) fails.push(`Unlock… asked ${JSON.stringify(asked)}`);
    else if (!house.focused || !house.visible) fails.push("Unlock… did not show the House window");
    else trace.push("house_window=one", "unlock_section=unlock");

    // Show / Hide the window.
    const overlay = ctx.windows[0];
    overlay.visible = true;
    ctx.tray().find((r) => r.label === "Hide the window").click();
    const hidden = overlay.visible === false;
    ctx.tray().find((r) => r.label === "Show").click();
    if (!hidden || overlay.visible !== true) fails.push("Hide the window / Show did not hide and show the overlay");
    else trace.push("hide_show=ok");

    // Follow me across desktops (Windows only): a click flips the checkbox.
    if (follow.length) {
      const row = ctx.tray().find((r) => r.label === follow[0]);
      const was = row.checked;
      row.click({ checked: !was });
      const now = ctx.tray().find((r) => r.label === follow[0]).checked;
      if (now !== !was) fails.push("Follow me across desktops did not flip");
      else trace.push("follow=flips");
    }

    // Quit asks app.quit once (counted, never called).
    const q0 = ctx.quits;
    ctx.tray().find((r) => r.label === "Quit").click();
    if (ctx.quits !== q0 + 1) fails.push("Quit did not ask app.quit");
    else trace.push("quit=1");

    // GPU gates, each in its own process.
    const soft = runGate("software");
    if (soft.error) fails.push(`software gate: ${soft.error}`);
    else {
      if (JSON.stringify(soft.shape.slice(0, 3)) !== JSON.stringify(["GPU path · software (harness)", "Require hardware compositing", "---"])) fails.push(`software tray starts ${soft.shape.slice(0, 3).join(" | ")}`);
      if (soft.unsaved.relaunches || soft.unsaved.quits) fails.push("Require hardware restarted though the choice was not saved");
      if (JSON.stringify(soft.saved) !== JSON.stringify({ expects: ["hardware", "hardware"], relaunches: 1, quits: 1 })) fails.push(`Require hardware saved ${JSON.stringify(soft.saved)}`);
      else trace.push("software=require_hardware");
    }
    const refused = runGate("refused");
    if (refused.error) fails.push(`refused gate: ${refused.error}`);
    else {
      if (JSON.stringify(refused.shape) !== JSON.stringify(["GPU path · software refused (harness)", "---", "Allow software compositing", "Why the pets are not on the screen", "Quit"])) fails.push(`refused tray is ${refused.shape.join(" | ")}`);
      if (JSON.stringify(refused.disabled) !== JSON.stringify(["GPU path · software refused (harness)"])) fails.push("refused tray gate line is not disabled");
      if (refused.tip !== "GPU path · software refused (harness)") fails.push(`refused tooltip ${refused.tip}`);
      if (refused.windows !== 0) fails.push("a refused GPU gate still made the overlay window");
      if (refused.unsaved.relaunches || refused.unsaved.quits) fails.push("Allow software restarted though the choice was not saved");
      if (JSON.stringify(refused.saved) !== JSON.stringify({ expects: ["software", "software"], relaunches: 1, quits: 1 })) fails.push(`Allow software saved ${JSON.stringify(refused.saved)}`);
      if (refused.quit !== 1) fails.push("refused tray Quit did not ask app.quit");
      if (!fails.length) trace.push("refused=allow_software");
    }
    const blocked = runGate("blocked");
    if (blocked.error) fails.push(`blocked gate: ${blocked.error}`);
    else if (JSON.stringify(blocked.shape) !== JSON.stringify(["GPU path · no adapter (harness)", "---", "Why the pets are not on the screen", "Quit"]) || blocked.quit !== 1) fails.push(`blocked tray is ${blocked.shape.join(" | ")}`);
    else trace.push("blocked=quit_only");

    return fails.length
      ? fail(fails.join("; "), { passed: trace })
      : ok(`tray: ${t0.length} rows in order, care commands, vitals, House window, show/hide, quit, 3 GPU gates`, { rows: t0.length, labels: shape(t0).map((l, i) => (i === 2 ? "(status)" : l)) }, trace);
  } finally {
    ctx.cleanup();
  }
}

module.exports = {
  settings_window: settingsWindow,
  license_offline: licenseOffline,
  tray_menu: trayMenu,
};

if (require.main === module && process.argv[2] === "--gate") {
  trayGate(process.argv[3]).then(
    (out) => {
      process.stdout.write(JSON.stringify(out) + "\n");
      process.exit(0);
    },
    (err) => {
      process.stdout.write(JSON.stringify({ error: String(err && err.stack || err).slice(0, 300) }) + "\n");
      process.exit(0);
    },
  );
}
