#!/usr/bin/env node
/**
 * Drives the desktop app's first run in real Electron, the way a new keeper meets it: the transparent overlay, the
 * hello on the keeper card, the pet, its care menu, the House window (Minds, Unlock), hiding and showing the window,
 * Quit, and a second start; then past the first minute: every care word from the card and the menu (the stats move the
 * right way and the pet comes back to normal), the held card on a long walk, Minds (House lines first, then xAI with a
 * stand-in key: sealed, Save testing it and saying plainly it was refused, and a Talk that fails honestly), sounds,
 * another pet, and all of it after a restart; and the #1557 audit: a rested pet wakes by itself, the talk pose ends
 * with the pet's own line while house chatter goes on, a play stays on the screen with a carried ribbon, the
 * volume slider is this pet's, and at the right edge the card stays by its pet off the plates. Every request to
 * api.x.ai is answered 401 inside the drive (page.route), so nothing leaves for the internet. `--scale 1.25`
 * (or 1.5) starts Electron with --force-device-scale-factor to check the same fit at display scaling. Playwright's _electron (playwright-core from web/node_modules or desktop/node_modules;
 * nothing is downloaded) launches desktop/node_modules/electron with COMPUTERPETS_SETTINGS_DIR set to a throwaway folder under
 * the gitignored target\first-run-drive, so the keeper's own settings and pets (%APPDATA%\computerpets-desktop) are
 * never read or written; it stops if Electron reports any other userData. Native menus are recorded instead of
 * popped up (Menu.prototype.popup), and their own click handlers are called; renderer input goes through Chromium's
 * own input path (CDP), never the OS mouse or keyboard, so nothing lands on the real desktop. The folder is removed
 * at the end and every window closes.
 *
 * Opens real windows on the screen, so it is opt-in: `node desktop/first-run-drive.cjs [--scale 1.25]`, or the app
 * harness's `--gui` row gui.first_run_drive. Prints one JSON line: { ok, checks: [{ id, ok, detail }], ms, userData, scale }.
 */
const path = require("node:path");
const fs = require("node:fs");

const ROOT = path.resolve(__dirname, "..");
const DESKTOP = __dirname;
const WORK = path.join(ROOT, "target", "first-run-drive");
/** Loaded before main.cjs: message boxes and app.relaunch are recorded, not shown or run. */
const HOOK = path.join(DESKTOP, "first-run-drive-hook.cjs");

/**
 * Which gate a message box from the app is: the words overlay-gate.cjs closedWords gives the GPU refusal and the
 * missing Linux compositor. Anything else is "other".
 * @param {{ message?: string, buttons?: string[] } | null | undefined} box
 */
function gateOf(box) {
  const m = String((box && box.message) || "");
  const b = (box && box.buttons) || [];
  if (/not compositing windows/.test(m) && b.includes("Check again")) return "no-compositor";
  if (/without its graphics card/.test(m) && b.includes("Allow software compositing")) return "software-refused";
  if (/started as a Wayland app/.test(m)) return "wayland-native";
  if (/^The pets are not on the screen/.test(m)) return "closed";
  return "other";
}

/** Two boxes [left, top, right, bottom] share more than a pixel. */
function overlaps(a, b) {
  return Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > 1 && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > 1;
}

/** A box [left, top, right, bottom] lies inside a w by h screen. */
function onScreen(box, w, h) {
  return box[0] >= 0 && box[1] >= 0 && box[2] <= w && box[3] <= h;
}

/** Labels that show twice in one menu level (separators and blanks aside), submenus checked too. */
function duplicateLabels(items) {
  /** @type {string[]} */
  const dups = [];
  const seen = new Set();
  for (const it of items || []) {
    if (it.label) {
      const low = it.label.trim().toLowerCase();
      if (seen.has(low)) dups.push(it.label);
      seen.add(low);
    }
    if (it.submenu) dups.push(...duplicateLabels(it.submenu));
  }
  return dups;
}

/** Every label in a menu and its submenus. */
function allLabels(items) {
  return (items || []).flatMap((it) => [...(it.label ? [it.label] : []), ...allLabels(it.submenu)]);
}

/** Where the hook writes what app.relaunch was asked for (in the throwaway userData), for the drive to follow. */
const RELAUNCH_FILE = "drive-relaunch.json";

/** The --ozone-platform the app asked to be started with again, from its app.relaunch args ("" for none). */
function ozoneOf(args) {
  const a = (Array.isArray(args) ? args : []).map(String).find((x) => /^--ozone-platform=/.test(x));
  return a ? a.slice("--ozone-platform=".length) : "";
}

/**
 * Electron 38 and newer start as a native Wayland app by themselves on a Wayland session (their --ozone-platform
 * defaults to auto: XDG_SESSION_TYPE=wayland with a WAYLAND_DISPLAY), with no switch at all. Read here on its own,
 * not from overlay-gate.cjs, so the drive can catch the app missing it.
 * @param {string} platform
 * @param {Record<string, string | undefined>} env
 * @param {number} major Electron's major version
 */
function autoWaylandStart(platform, env, major) {
  return platform === "linux" && major >= 38 && String(env.XDG_SESSION_TYPE || "").toLowerCase() === "wayland" && !!env.WAYLAND_DISPLAY;
}

/** The installed Electron's version (node_modules/electron/package.json), or "" when it cannot be read. */
function electronVersion() {
  try {
    return String(JSON.parse(fs.readFileSync(path.join(DESKTOP, "node_modules", "electron", "package.json"), "utf8")).version || "");
  } catch {
    return "";
  }
}

/** `--wayland` from the command line: start Electron as a native Wayland app (--ozone-platform=wayland). */
function waylandArg(argv) {
  return Array.isArray(argv) && argv.includes("--wayland");
}

/** A stand-in xAI key for the Minds checks; api.x.ai never sees it (the drive answers every request itself). */
const STANDIN_KEY = "xai-standin-not-a-real-key-0000";

/** `--scale 1.25` from the command line: a device scale factor between 1 and 3, else none. */
function scaleArg(argv) {
  const i = argv.indexOf("--scale");
  const n = i >= 0 ? Number(argv[i + 1]) : NaN;
  return isFinite(n) && n >= 1 && n <= 3 ? n : null;
}

/** How many times the drive tries Got it, and how long each try waits for card.json. */
const GOT_IT_TRIES = 3;
const GOT_IT_WAIT_MS = 4000;

/**
 * Reads `get()` until `done(value)` holds or `ms` runs out, sleeping `step` between reads with `sleep`.
 * Returns the last value read.
 */
async function pollFor(get, done, ms, step, sleep) {
  const until = Date.now() + ms;
  let v = await get();
  while (!done(v) && Date.now() < until) {
    await sleep(step);
    v = await get();
  }
  return v;
}

/**
 * The Got it judgement: the hello is gone and card.json says firstHintSeen. The words say how many presses it
 * took, whether the card had to be opened again, and every failed press with what sat on the button.
 */
function gotItVerdict({ hint, seen, presses, reopened, errors }) {
  const ok = !hint && seen === true;
  const bits = [`hello ${hint ? "still shows" : "gone"}`, `card.json firstHintSeen ${seen === true}`, `${presses} press${presses === 1 ? "" : "es"}`];
  if (reopened) bits.push(`card opened again ${reopened}x`);
  if (errors && errors.length) bits.push(`press failed: ${errors.join(" / ")}`);
  return { ok, detail: bits.join("; ") };
}

/** The biggest gap in px between two boxes [left, top, right, bottom] side by side (0 when they overlap in x). */
function sideGap(a, b) {
  return Math.max(0, a[0] - b[2], b[0] - a[2]);
}

/** The throwaway folder must sit under target\first-run-drive, never the keeper's own userData. */
function throwawayOk(dir) {
  const rel = path.relative(WORK, path.resolve(dir));
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel) && /^ud-\d+-\d+$/.test(rel);
}

function playwright() {
  for (const base of [DESKTOP, path.join(ROOT, "web")]) {
    try {
      return require(require.resolve("playwright-core", { paths: [base] }));
    } catch {
      /* next */
    }
  }
  return null;
}

async function removeDir(dir) {
  if (!throwawayOk(dir)) return false;
  for (let i = 0; i < 20; i += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      if (!fs.existsSync(dir)) return true;
    } catch {
      /* Chromium lets go a moment after exit */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return !fs.existsSync(dir);
}

async function drive(opts = {}) {
  const scale = opts && opts.scale ? opts.scale : null;
  /** --wayland: the first start is a native Wayland one; later starts use what the app asked for (XWayland). */
  const wayland = !!(opts && opts.wayland);
  /** Extra switches for the next start, from the app's own app.relaunch (the hook records them). */
  let nextArgs = wayland ? ["--ozone-platform=wayland"] : [];
  /** Environment the app set for its own relaunch (COMPUTERPETS_X11_TRIED), carried to the next start. */
  let nextEnv = {};
  const t0 = Date.now();
  /** @type {{ id: string, ok: boolean, detail: string }[]} */
  const checks = [];
  const check = (id, ok, detail) => checks.push({ id, ok: !!ok, detail: String(detail) });
  // opts.pw / opts.exe / opts.windowMs: a stand-in Playwright for renderer/linux-drive.test.cjs.
  const pw = opts.pw || playwright();
  if (!pw) return { ok: false, skipped: "playwright-core not found under desktop/ or web/node_modules", checks, ms: 0 };
  const exe = opts.exe || path.join(DESKTOP, "node_modules", "electron", "dist", process.platform === "win32" ? "electron.exe" : "electron");
  // Electron 42 and newer download Electron itself the first time it runs, not during npm install (the three-line
  // start's first npm start does it). The drive starts the binary directly, so it gets it the same way first.
  const installJs = path.join(DESKTOP, "node_modules", "electron", "install.js");
  if (!opts.exe && !fs.existsSync(exe) && fs.existsSync(installJs)) {
    require("node:child_process").spawnSync(process.execPath, [installJs], { cwd: DESKTOP, stdio: ["ignore", 2, 2], timeout: 600_000 });
  }
  if (!fs.existsSync(exe)) return { ok: false, skipped: `no Electron at ${exe} (npm install in desktop)`, checks, ms: 0 };
  const windowMs = opts.windowMs || 60_000;
  const electron = opts.electron != null ? String(opts.electron) : electronVersion();
  const major = Number((/^(\d+)\./.exec(electron) || [])[1] || 0);
  /** A Wayland session with Electron 38+: the first start is a native Wayland one even with no switch. */
  const autoWayland = !wayland && autoWaylandStart(opts.platform || process.platform, process.env, major);
  /** Whether the next start is still the first one (the only one Electron picks Wayland for by itself). */
  let firstStart = true;
  /** Set when the app kept its pet window closed on purpose and said why; the rest of the drive cannot run then. */
  let gated = "";
  const ud = path.join(WORK, `ud-${process.pid}-${Date.now()}`);
  if (!throwawayOk(ud)) throw new Error(`refusing user data ${ud}`);
  fs.mkdirSync(ud, { recursive: true });
  const errors = [];
  /** Every request the overlay made to api.x.ai, and whether the line naming it was in view on the card then. */
  const cloud = [];
  /** The House window while Minds is open, so a request to api.x.ai can be checked against its line in view. */
  let housePage = null;

  /**
   * The first questions to a just-started app. On Linux, Playwright's first evaluate now and then comes back with
   * "Resulting promise was garbage collected" while the app is fine and its window opens (seen on the box, about one
   * start in three, once the window opens a moment later than before). The question is asked again then, up to
   * three times; any other error is thrown as it came.
   * @template T
   * @param {any} app
   * @param {() => Promise<T>} ask
   * @returns {Promise<T>}
   */
  async function firstAsk(app, ask) {
    for (let i = 0; ; i += 1) {
      try {
        return await ask();
      } catch (e) {
        const gc = /garbage collected/i.test(String(e && e.message ? e.message : e));
        if (!gc || i >= 2) throw e;
        await new Promise((r) => setTimeout(r, 250));
      }
    }
  }

  /** The app started, its userData checked and its menus recorded; no window waited for yet. */
  async function start(env = {}) {
    try {
      fs.rmSync(path.join(ud, RELAUNCH_FILE), { force: true });
    } catch {
      /* none */
    }
    let app;
    try {
      app = await pw._electron.launch({
        executablePath: exe,
        args: ["-r", HOOK, DESKTOP, ...(scale ? [`--force-device-scale-factor=${scale}`] : []), ...nextArgs],
        cwd: DESKTOP,
        // The supported way to keep a run's settings apart (settings-dir.cjs); the userData check below proves it.
        env: { ...process.env, COMPUTERPETS_GUI_HARNESS: "", ...nextEnv, ...env, COMPUTERPETS_SETTINGS_DIR: ud },
        timeout: 90_000,
      });
    } catch (e) {
      // A native Wayland start asks to start again on XWayland and quits before Playwright has finished meeting it.
      if (relaunchAsked()) return /** @type {any} */ ({ relaunched: true });
      throw e;
    }
    // The Electron process, kept while it can still be asked (app.process() throws once the app has closed).
    try {
      app.__proc = app.process();
    } catch {
      app.__proc = null;
    }
    let got = "";
    try {
      got = await firstAsk(app, () => app.evaluate(({ app: a }) => a.getPath("userData")));
    } catch (e) {
      await stop(app);
      // A native Wayland start asks to be started again on XWayland and quits at once: that is its answer.
      if (relaunchAsked()) return /** @type {any} */ ({ relaunched: true });
      throw new Error(`the app ended as it started (${String(e && e.message ? e.message : e).split("\n")[0]})`);
    }
    if (path.resolve(got).toLowerCase() !== path.resolve(ud).toLowerCase()) {
      await stop(app);
      throw new Error(`userData is ${got}, not the throwaway folder; stopped before touching it`);
    }
    await firstAsk(app, () => app.evaluate(({ Menu }) => {
      const g = /** @type {any} */ (globalThis);
      g.__built = [];
      const build = Menu.buildFromTemplate.bind(Menu);
      Menu.buildFromTemplate = (t) => {
        const m = build(t);
        g.__built.push(m);
        if (g.__built.length > 60) g.__built.shift();
        return m;
      };
      g.__popups = [];
      Menu.prototype.popup = function (o) {
        g.__popups.push(this);
        this.__at = o && typeof o.x === "number" ? { x: o.x, y: o.y } : null;
      };
    }));
    return app;
  }

  /** What the app asked app.relaunch for, as the hook wrote it (null when it did not ask). */
  function relaunchAsked() {
    try {
      return JSON.parse(fs.readFileSync(path.join(ud, RELAUNCH_FILE), "utf8"));
    } catch {
      return null;
    }
  }

  /** The app's message boxes so far (first-run-drive-hook.cjs), words and buttons. */
  const boxes = (app) =>
    app
      .evaluate(() => ((/** @type {any} */ (globalThis)).__dialogs || []).map((d) => ({ message: d.message, detail: d.detail, buttons: d.buttons, answered: d.answered })))
      .catch(() => []);
  /** Press button `label` on the app's latest unanswered message box. */
  const pressBox = (app, label) =>
    app
      .evaluate((_e, label) => {
        const d = [...((/** @type {any} */ (globalThis)).__dialogs || [])].reverse().find((x) => !x.answered);
        const i = d ? d.buttons.indexOf(label) : -1;
        if (i < 0) return false;
        d.answer(i);
        return true;
      }, label)
      .catch(() => false);
  /** Close an app that never showed its window, so the drive ends instead of waiting on it forever. */
  async function stop(app) {
    const proc = app.__proc || null;
    await app.close().catch(() => {});
    // Gone for real before the next start: a copy still quitting holds the single-instance lock, and the next start
    // then quits at once (seen on Linux right after Quit and after Allow software compositing).
    const exited = () => !proc || proc.exitCode != null || proc.signalCode != null;
    for (let i = 0; i < 50 && !exited(); i += 1) await new Promise((r) => setTimeout(r, 100));
    try {
      if (!exited()) proc.kill();
    } catch {
      /* gone */
    }
    for (let i = 0; i < 30 && !exited(); i += 1) await new Promise((r) => setTimeout(r, 100));
  }

  /**
   * The overlay window, or the message box saying why it stayed closed, whichever comes first. A GPU that draws in
   * software (a virtual machine, Xvfb) gets the app's own Allow software compositing button pressed: the app writes
   * gpu-path.json itself and asks to restart (recorded), and the drive starts it again. A desktop without a
   * compositor ends the drive there, with that message checked.
   */
  /**
   * Rui rests from 1 to 6 in the morning (hours.js restWindow), and a run then saw her sleep on through Call back and
   * Rest, failing three checks that pass at any other hour. The drive keeps the house's day hours instead, so a run
   * checks the same thing whenever it starts: no resting hour, and no night sleep held over from before.
   */
  async function dayHours(page) {
    await page
      .evaluate(() => {
        const g = /** @type {any} */ (window);
        if (g.PetHours) g.PetHours.isRestingHour = () => false;
        if (typeof life !== "undefined" && life && life.sleepHeld) Object.assign(life, { asleep: false, sleepHeld: false, nightSat: false });
      })
      .catch(() => {});
  }

  async function launch(env = {}) {
    for (let round = 0; round < 3; round += 1) {
      const app = await start(env);
      if (app && app.relaunched) {
        if (followRelaunch()) continue;
        throw new Error("the app asked to start again without saying how");
      }
      try {
        const got = await meet(app);
        if (got === "again") continue;
        if (got && got.page) await dayHours(got.page);
        return got;
      } catch (e) {
        // Whatever went wrong, the app this round started is closed: it kept the drive waiting forever before.
        await stop(app);
        throw e;
      }
    }
    throw new Error("the overlay stayed closed after Allow software compositing");
  }

  /**
   * The app quit asking to be started again (a native Wayland start asks for XWayland): check what it asked for and
   * start it that way next. True when it asked for X11.
   */
  function followRelaunch() {
    const asked = relaunchAsked();
    if (!asked) return false;
    const ozone = ozoneOf(asked.args);
    const wasWayland = nextArgs.includes("--ozone-platform=wayland") || (autoWayland && firstStart);
    firstStart = false;
    if (wasWayland) {
      check(
        "gate_wayland_restarts_on_x11",
        ozone === "x11" && asked.env && asked.env.COMPUTERPETS_X11_TRIED === "1",
        `a native Wayland start${autoWayland ? ` (Electron ${electron} on XDG_SESSION_TYPE=wayland, no switch)` : ""} asked to start again with --ozone-platform=${ozone || "unset"} (XWayland at DISPLAY ${process.env.DISPLAY || "none"}), X11 tried ${asked.env ? asked.env.COMPUTERPETS_X11_TRIED : "unset"}`,
      );
    }
    nextArgs = ozone ? [`--ozone-platform=${ozone}`] : [];
    nextEnv = asked.env && asked.env.COMPUTERPETS_X11_TRIED ? { COMPUTERPETS_X11_TRIED: String(asked.env.COMPUTERPETS_X11_TRIED) } : {};
    return ozone === "x11";
  }

  /**
   * One start: the overlay window (with the page ready), "again" after Allow software compositing, or the end of the
   * drive at a desktop without a compositor.
   * @returns {Promise<{ app: any, page: any } | "again">}
   */
  async function meet(app) {
    /** @type {any} */
    let page = null;
    /** @type {{ message: string, detail: string, buttons: string[] } | null} */
    let box = null;
    const until = Date.now() + windowMs;
    while (!page && !box && Date.now() < until) {
      page = app.windows()[0] || (await app.waitForEvent("window", { timeout: 1000 }).catch(() => null));
      if (!page) box = (await boxes(app)).find((b) => !b.answered && gateOf(b) !== "other") || null;
      if (!page && !box && relaunchAsked()) break;
    }
    if (page) return { app, page: await attach(page) };
    if (!box && relaunchAsked()) {
      await stop(app);
      if (followRelaunch()) return "again";
      throw new Error("the app asked to start again without saying how");
    }
    if (!box) {
      await stop(app);
      throw new Error(`no overlay window and no message saying why in ${Math.round(windowMs / 1000)} s`);
    }
    const gate = gateOf(box);
    const noWindow = app.windows().length === 0;
    if (gate === "software-refused") {
      const pressed = await pressBox(app, "Allow software compositing");
      const closed = await app.waitForEvent("close", { timeout: 20_000 }).then(() => true, () => false);
      let expect = "";
      try {
        expect = JSON.parse(fs.readFileSync(path.join(ud, "gpu-path.json"), "utf8")).expect;
      } catch {
        /* missing */
      }
      check(
        "gate_software_says_so",
        noWindow && pressed && closed && expect === "software",
        `"${box.message}" [${box.buttons.join(" | ")}]; no window ${noWindow}; Allow pressed ${pressed}, app closed to restart ${closed}, gpu-path.json expect ${expect || "unset"}`,
      );
      await stop(app);
      return "again";
    }
    if (gate === "wayland-native") {
      const pressed = await pressBox(app, "Quit");
      const closed = await app.waitForEvent("close", { timeout: 20_000 }).then(() => true, () => false);
      check(
        "gate_wayland_says_so",
        noWindow && pressed && closed,
        `"${box.message}" [${box.buttons.join(" | ")}]; DISPLAY ${process.env.DISPLAY || "none"} (no XWayland to start on); no window ${noWindow}; Quit ended the app ${closed}`,
      );
      await stop(app);
      gated = "wayland-native";
      return { app: null, page: null };
    }
    if (gate === "no-compositor") {
      const OverlayGate = require("./overlay-gate.cjs");
      const seen = await OverlayGate.readCompositor();
      const pressed = await pressBox(app, "Quit");
      const closed = await app.waitForEvent("close", { timeout: 20_000 }).then(() => true, () => false);
      check("gate_no_compositor_says_so", seen === "no" && noWindow && pressed && closed, `"${box.message}" [${box.buttons.join(" | ")}]; compositor ${seen}; no window ${noWindow}; Quit ended the app ${closed}`);
      await stop(app);
      gated = "no-compositor";
      return { app: null, page: null };
    }
    await stop(app);
    throw new Error(`the overlay stayed closed: "${box.message}"`);
  }

  /** Listeners and the api.x.ai stand-in on the overlay page. */
  async function attach(page) {
    await page.waitForLoadState("load");
    page.on("pageerror", (e) => errors.push(`overlay: ${String(e).slice(0, 160)}`));
    page.on("console", (m) => {
      // The drive's own 401 for api.x.ai shows as a failed load; that one is the stand-in key being refused.
      // A file that did not load names itself (a missing picture said only "Failed to load resource").
      const where = /Failed to load resource/.test(m.text()) && m.location && m.location().url ? ` ${m.location().url.replace(/^.*\/renderer\//, "")}` : "";
      if (m.type() === "error" && !(cloud.length && /status of 401/.test(m.text()))) errors.push(`overlay console: ${m.text().slice(0, 160)}${where}`);
    });
    await page.route("https://api.x.ai/**", async (route) => {
      const inView = await page
        .evaluate(() => {
          const e = document.getElementById("hud-talk-net");
          const hud = document.getElementById("hud");
          if (!e || !hud || e.hidden || !e.getClientRects().length) return false;
          if (hud.dataset.collapsed === "1" || Number(getComputedStyle(hud).opacity) < 0.95) return false;
          const a = e.getBoundingClientRect();
          const b = hud.getBoundingClientRect();
          return a.bottom > b.top + 1 && a.top < b.bottom - 1 && a.top >= 0 && a.bottom <= innerHeight;
        })
        .catch(() => false);
      const houseInView = housePage
        ? await housePage
            .evaluate(() => {
              const e = document.getElementById("mindNet");
              if (!e || e.hidden || !(e.textContent || "").trim()) return false;
              const r = e.getBoundingClientRect();
              return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight;
            })
            .catch(() => false)
        : false;
      cloud.push({ at: Date.now(), inView, houseInView });
      await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "Incorrect API key provided" }) });
    });
    return page;
  }

  const menuItems = (app, which) =>
    app.evaluate((_e, which) => {
      const g = /** @type {any} */ (globalThis);
      const m = which === "tray" ? [...g.__built].reverse().find((x) => x.items.some((i) => i.label === "Show")) : g.__popups.at(-1);
      const walk = (items) => items.filter((i) => i.type !== "separator").map((i) => ({ label: i.label, submenu: i.submenu ? walk(i.submenu.items) : undefined }));
      return m ? walk(m.items) : null;
    }, which);
  const clickItem = (app, label, which = "pet") =>
    app.evaluate((_e, [label, which]) => {
      const g = /** @type {any} */ (globalThis);
      const m = which === "tray" ? [...g.__built].reverse().find((x) => x.items.some((i) => i.label === "Show")) : g.__popups.at(-1);
      const it = m && m.items.find((i) => i.label === label);
      if (!it) return false;
      it.click();
      return true;
    }, [label, which]);

  let app = null;
  /** The first pet and the one chosen from Companions, for the restart check. */
  let firstKey = null;
  let switchedKey = null;
  /** What the Minds page said about where the key is kept, at Save. */
  let keyLine = "";
  try {
    let page;
    ({ app, page } = await launch());
    if (autoWayland && firstStart) {
      // Opened with no relaunch: the overlay is a native Wayland window (no cursor outside it, no keep-on-top), so
      // click-through and always-on-top quietly stop working. The drive's own CDP input would never notice.
      firstStart = false;
      check(
        "gate_wayland_restarts_on_x11",
        false,
        `Electron ${electron} started as a native Wayland app by itself (XDG_SESSION_TYPE=wayland, WAYLAND_DISPLAY ${process.env.WAYLAND_DISPLAY}), and the app opened its overlay there instead of starting again on XWayland`,
      );
    }
    firstStart = false;
    if (gated) throw new Error(`gated: ${gated}`);
    check("user_data_throwaway", true, ud);
    await page.waitForTimeout(3500);
    const state = () =>
      page.evaluate(() => {
        const box = (s) => {
          const e = document.querySelector(s);
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
        };
        const hud = document.getElementById("hud");
        const bubble = document.getElementById("bubble");
        const bs = bubble ? getComputedStyle(bubble) : null;
        return {
          w: innerWidth,
          h: innerHeight,
          open: !!hud && hud.dataset.collapsed !== "1" && hud.classList.contains("show"),
          hint: !document.getElementById("first-hint")?.hidden,
          card: box("#hud"),
          ok: box("#first-hint-ok"),
          pet: box("#pet"),
          bubble: box("#bubble"),
          bubbleShows: !!bs && bs.display !== "none" && bs.visibility !== "hidden" && Number(bs.opacity) > 0.05 && !!(document.getElementById("bubble-text")?.textContent || "").trim(),
          hunger: Number((document.getElementById("hud-hunger")?.textContent || "").replace(/[^0-9]/g, "")) || 0,
          plates: ["weather-plate", "news-plate", "market-plate"].map((id) => ({ id, el: document.getElementById(id) })).filter((p) => p.el && !p.el.hidden && p.el.getClientRects().length).map((p) => {
            const r = p.el.getBoundingClientRect();
            return { id: p.id, box: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] };
          }),
          special: (document.querySelector('#hud [data-care="special"]')?.textContent || "").trim(),
        };
      });
    const petMiddle = async () => {
      const b = await page.locator("#pet").boundingBox();
      return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null;
    };
    /** The pet's box when the menu was last asked for, for menu_at_pet. */
    let menuPet = null;
    const petMenu = async () => {
      const p = await petMiddle();
      if (!p) return null;
      menuPet = await page.evaluate(() => {
        const r = document.getElementById("pet")?.getBoundingClientRect();
        return r ? [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] : null;
      });
      await page.mouse.click(p.x, p.y, { button: "right" });
      await page.waitForTimeout(500);
      return menuItems(app, "pet");
    };
    /** Sample the open card and the pet's line; count samples where the line shows over the open card. */
    const sampleBubble = async (ms) => {
      let shown = 0;
      let over = 0;
      let worst = "";
      for (let t = 0; t < ms; t += 400) {
        const s = await state();
        if (s.open && s.bubbleShows && s.card && s.bubble) {
          shown += 1;
          if (overlaps(s.card, s.bubble)) {
            over += 1;
            worst = `line ${s.bubble} over card ${s.card}`;
          }
        }
        await page.waitForTimeout(400);
      }
      return { shown, over, worst };
    };

    // 1. The first window: the hello on an open keeper card, all of it on the screen, and the pet.
    let s = await state();
    check("hello_shows", s.open && s.hint, `card open ${s.open}, hello ${s.hint}`);
    check("card_on_screen", s.card && onScreen(s.card, s.w, s.h), `card ${s.card} on ${s.w}x${s.h}`);
    check("got_it_target", s.ok && s.ok[2] - s.ok[0] >= 24 && s.ok[3] - s.ok[1] >= 24, `Got it ${s.ok ? `${s.ok[2] - s.ok[0]}x${s.ok[3] - s.ok[1]}` : "missing"}`);
    check("pet_on_screen", s.pet && s.pet[2] - s.pet[0] > 20 && onScreen(s.pet, s.w, s.h), `pet ${s.pet}`);
    const under = (s.plates || []).filter((p) => s.card && overlaps(p.box, s.card));
    check("plates_clear_of_card", s.open && (s.plates || []).length > 0 && !under.length, `${(s.plates || []).length} plates shown; under the card ${s.card}: ${under.map((p) => `${p.id} ${p.box}`).join(", ") || "none"}`);
    // The overlay window covers the work area and no more (1 DIP of rounding allowed at 1.25 / 1.5 scaling).
    const win = await app.evaluate(({ BrowserWindow, screen }) => {
      const w = BrowserWindow.getAllWindows().find((x) => /index\.html/.test(x.webContents.getURL()));
      if (!w) return null;
      const d = screen.getDisplayMatching(w.getBounds());
      return { b: w.getBounds(), work: d.workArea, sf: d.scaleFactor };
    });
    const fits = !!win && win.b.x >= win.work.x - 1 && win.b.y >= win.work.y - 1 && win.b.x + win.b.width <= win.work.x + win.work.width + 1 && win.b.y + win.b.height <= win.work.y + win.work.height + 1;
    check("window_fits_work_area", fits, win ? `window ${JSON.stringify(win.b)} in work area ${JSON.stringify(win.work)} at scale ${win.sf}` : "no overlay window");

    // 2. The pet's line never paints over the open card (it talks on its own; a Talk makes sure it does).
    let b = await sampleBubble(6000);
    if (!b.shown) {
      await petMenu();
      await clickItem(app, "Talk");
      await page.waitForTimeout(300);
      const b2 = await sampleBubble(4000);
      b = { shown: b.shown + b2.shown, over: b.over + b2.over, worst: b.worst || b2.worst };
    }
    check("bubble_clear_of_card", b.over === 0, `${b.over} of ${b.shown} samples with the line over the open card${b.worst ? `; ${b.worst}` : ""}`);

    // 2b. Rain (when the day's sky is rain) falls the whole height of the screen; it only crossed the top fifth, so
    // it showed as faint still lines at the top of the glass.
    const rain = await page.evaluate(async () => {
      const drops = [...document.querySelectorAll("#weather .wx-rain")];
      if (!drops.length) return null;
      let low = 0;
      for (let i = 0; i < 12; i += 1) {
        for (const d of drops) low = Math.max(low, d.getBoundingClientRect().bottom);
        await new Promise((r) => setTimeout(r, 120));
      }
      return { drops: drops.length, low: Math.round(low), h: innerHeight };
    });
    check("rain_falls_full_height", !rain || rain.low >= rain.h * 0.8, rain ? `${rain.drops} streaks reach y=${rain.low} of ${rain.h}` : "no rain in today's sky");

    // 3. The care menu: the care words, no row twice, and the card's trick button says the menu's word.
    s = await state();
    const menu = await petMenu();
    const labels = allLabels(menu || []);
    const need = ["Feed", "Treat", "Play", "Rest", "Talk", "Hide", "Call back", "Keeper card", "Minds…", "Unlock…", "Hide the window", "Quit"];
    const missing = need.filter((l) => !labels.includes(l));
    check("care_menu", menu && !missing.length, missing.length ? `missing ${missing.join(", ")}` : `${labels.length} rows`);
    const dups = duplicateLabels(menu || []);
    check("care_menu_no_twins", !dups.length, dups.length ? `twice: ${dups.join(", ")}` : "none");
    check("trick_word_matches", !!s.special && s.special !== "Special" && labels.includes(s.special), `card "${s.special}"; menu has it ${labels.includes(s.special)}`);
    const trickWord = s.special;
    // The menu opens where the pet was clicked (window coordinates), on the pet, at any display scaling.
    const at = await app.evaluate(() => {
      const g = /** @type {any} */ (globalThis);
      const m = g.__popups.at(-1);
      return m ? m.__at : null;
    });
    const mp = menuPet;
    check("menu_at_pet", !!at && !!mp && at.x >= mp[0] - 2 && at.x <= mp[2] + 2 && at.y >= mp[1] - 2 && at.y <= mp[3] + 2, `menu at ${at ? `${at.x},${at.y}` : "no point"}; pet ${mp}`);

    /** The page's own walk state (sim is pet.js's), for the card-holds checks. */
    const walking = () => page.evaluate(() => (typeof sim !== "undefined" && sim ? sim.anim === "walk" : false));
    /** Sample the card for ms: how many samples had it open, and whether the pet walked meanwhile. */
    const holds = async (ms) => {
      let open = 0;
      let n = 0;
      let walked = false;
      for (let t = 0; t < ms; t += 300) {
        const o = await state();
        n += 1;
        if (o.open) open += 1;
        if (await walking()) walked = true;
        await page.waitForTimeout(300);
      }
      return { open, n, walked };
    };

    // 4. Feed with the card opened while the pet walks to its food: fold the card, Feed from the menu, open the card
    // from the menu on the way. Opening it stranded the pet short of the food (hunger held at 78). The wait watches
    // the page's own life state; the check reads the painted card.
    const before = (await state()).hunger;
    await page.locator("#hud-collapse").click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
    // Feed while the pet is at play when it can (the first-run pet climbs a window within seconds): the play's end
    // set it idle with the food still its target, card open or closed.
    const atPlay = await page
      .waitForFunction(() => typeof sim !== "undefined" && !!sim && !!(sim.play || sim.trick || sim.happy), null, { timeout: 20_000, polling: 100 })
      .then(() => true, () => false);
    await petMenu();
    await clickItem(app, "Feed");
    await page.waitForTimeout(700);
    await petMenu();
    await clickItem(app, "Keeper card");
    const ate = await page
      .waitForFunction((b) => {
        const w = /** @type {any} */ (window);
        const l = typeof life !== "undefined" ? life : null;
        return !!l && !!w.PetKeeper && w.PetKeeper.meters(l).hunger > b;
      }, before, { timeout: 30_000, polling: 300 })
      .then(() => true, () => false);
    if (!(await state()).open) {
      await petMenu();
      await clickItem(app, "Keeper card");
      await page.waitForTimeout(600);
    }
    const after = (await state()).hunger;
    const stuck = ate
      ? ""
      : await page.evaluate(() => (typeof sim !== "undefined" && sim ? `; pet ${sim.cmd}/${sim.anim} at ${Math.round(sim.x)}, target ${sim.target == null ? "none" : Math.round(sim.target)}` : ""));
    check("feed_with_card_opened_on_the_way", (ate && after > before) || before >= 100, `hunger ${before} -> ${after}; fed ${atPlay ? "during play" : "with the pet free"}${ate ? "" : ` (the pet did not eat in 30 s${stuck})`}`);

    // 4b. A care press on the open card, the hello still unread: the card stays up while the pet walks off.
    s = await state();
    if (!s.open) {
      await petMenu();
      await clickItem(app, "Keeper card");
      await page.waitForTimeout(500);
    }
    await page.locator('#hud [data-care="play"]').click({ timeout: 5000 }).catch(() => {});
    const h1 = await holds(3000);
    check("card_holds_after_press_hello_unread", h1.walked && h1.open === h1.n, `open in ${h1.open} of ${h1.n} samples; the pet walked ${h1.walked}`);

    // 5. Got it: the hello goes and card.json keeps it gone. The card can close between the look and the press
    //    (the pet walked off after 4b's Play and the leash took the card down), which hides the button. So each
    //    try opens the card when it is shut, waits for the button to show, presses it, then waits up to 4 s for
    //    card.json. A press that fails is reported with what sat on the button, never swallowed.
    const readCardJson = () => {
      try {
        return JSON.parse(fs.readFileSync(path.join(ud, "card.json"), "utf8"));
      } catch {
        return {};
      }
    };
    const gotIt = { presses: 0, reopened: 0, errors: [], seen: false };
    let cardJson = {};
    for (let attempt = 1; attempt <= GOT_IT_TRIES && !gotIt.seen; attempt += 1) {
      s = await state();
      if (!s.open) {
        gotIt.reopened += 1;
        await petMenu();
        await clickItem(app, "Keeper card");
        await page.waitForTimeout(700);
        s = await state();
      }
      if (s.hint) {
        const ok = page.locator("#first-hint-ok");
        try {
          await ok.waitFor({ state: "visible", timeout: 5000 });
          gotIt.presses += 1;
          await ok.click({ timeout: 5000 });
        } catch (e) {
          const on = await page
            .evaluate(() => {
              const b = document.getElementById("first-hint-ok")?.getBoundingClientRect();
              if (!b || !b.width) return "button not laid out";
              const at = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
              const hud = document.getElementById("hud");
              return `on the button: ${at ? at.id || at.className || at.tagName : "nothing"}; card ${hud && hud.dataset.collapsed === "1" ? "shut" : "open"}`;
            })
            .catch(() => "page gone");
          gotIt.errors.push(`try ${attempt}: ${String((e && e.message) || e).split("\n")[0]} (${on})`);
        }
      }
      cardJson = await pollFor(() => readCardJson(), (c) => c.firstHintSeen === true, GOT_IT_WAIT_MS, 200, (ms) => page.waitForTimeout(ms));
      gotIt.seen = cardJson.firstHintSeen === true;
    }
    s = await state();
    const gi5 = gotItVerdict({ hint: s.hint, seen: gotIt.seen, presses: gotIt.presses, reopened: gotIt.reopened, errors: gotIt.errors });
    check("got_it_persists", gi5.ok, gi5.detail);

    // 5b. The hello read: a care press on the card still holds it up while the pet walks (for a few seconds).
    if (!s.open) {
      await petMenu();
      await clickItem(app, "Keeper card");
      await page.waitForTimeout(500);
    }
    await page.locator('#hud [data-care="snack"]').click({ timeout: 5000 }).catch(() => {});
    const h2 = await holds(3000);
    check("card_holds_after_press_hello_read", h2.walked && h2.open === h2.n, `open in ${h2.open} of ${h2.n} samples; the pet walked ${h2.walked}`);

    // 5c. Escape: a click on the pet opens the card and hands it the keyboard (the window takes focus, so a real
    // Escape reaches it); Escape with focus on nothing in the card closes it and gives the keyboard back.
    s = await state();
    if (s.open) {
      await page.locator("#hud-collapse").click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.waitForFunction(() => typeof sim === "undefined" || !sim || sim.anim !== "walk", null, { timeout: 15_000 }).catch(() => {});
    const tap = await petMiddle();
    if (tap) await page.mouse.click(tap.x, tap.y);
    await page.waitForTimeout(600);
    const focusOf = () => app.evaluate(({ BrowserWindow }) => {
      const w = BrowserWindow.getAllWindows().find((x) => /index\.html/.test(x.webContents.getURL()));
      return w ? { focusable: w.isFocusable(), focused: w.isFocused() } : null;
    });
    const tapped = await focusOf();
    const openAfterTap = (await state()).open;
    // A click on the pet also opens its choice menu; Escape closes that first (the card stays), then the card.
    const menuOpen = () => page.evaluate(() => (typeof choiceOpen !== "undefined" ? !!choiceOpen : false));
    const menuAfterTap = await menuOpen();
    const blur = () =>
      page.evaluate(() => {
        const a = /** @type {HTMLElement | null} */ (document.activeElement);
        if (a && a !== document.body && typeof a.blur === "function") a.blur();
      });
    let openAfterMenuEsc = true;
    if (menuAfterTap) {
      await blur();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      openAfterMenuEsc = (await state()).open && !(await menuOpen());
    }
    await blur();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    const afterEsc = await focusOf();
    const openAfterEsc = (await state()).open;
    // The window's focusable flag is the fix (the overlay never took the keyboard after a click on the pet, so a
    // real Escape went to another app); isFocused is reported only, since a driven window can read focused anyway.
    check(
      "escape_closes_card",
      openAfterTap && !!tapped && tapped.focusable && openAfterMenuEsc && !openAfterEsc && !!afterEsc && !afterEsc.focusable,
      `after a click on the pet: card open ${openAfterTap}, menu ${menuAfterTap}, window ${JSON.stringify(tapped)}; ${menuAfterTap ? `Escape closed the menu, card still open ${openAfterMenuEsc}; ` : ""}after Escape: card open ${openAfterEsc}, window ${JSON.stringify(afterEsc)}`,
    );

    // 6. At the right edge of the screen the open card still fits.
    // The drag starts on a still pet (a window play or a walk moves it out from under the pointer) and is tried
    // again if the pet did not end up at the edge.
    let p = null;
    for (let tries = 0; tries < 3; tries += 1) {
      await page
        .waitForFunction(() => typeof sim === "undefined" || !sim || (sim.anim !== "walk" && !sim.play && !sim.trick && !sim.happy), null, { timeout: 15_000, polling: 200 })
        .catch(() => {});
      p = await petMiddle();
      if (!p) break;
      await page.mouse.move(p.x, p.y);
      await page.mouse.down();
      for (let i = 1; i <= 12; i += 1) await page.mouse.move(p.x + ((s.w - 70 - p.x) * i) / 12, p.y, { steps: 2 });
      await page.mouse.up();
      await page.waitForTimeout(400);
      const at = await page.locator("#pet").boundingBox();
      if (at && at.x + at.width > s.w - 300) break;
    }
    await petMenu();
    await clickItem(app, "Keeper card");
    await page.waitForTimeout(600);
    s = await state();
    const nearRight = s.pet && s.pet[2] > s.w - 300;
    check("card_fits_at_right_edge", nearRight && s.open && s.card && onScreen(s.card, s.w, s.h), `pet ${s.pet}, card ${s.card} on ${s.w}x${s.h}`);
    // The #1557 audit: the news plate pushed the card to 1745..2059 with the pet at 2382..2530 (323 px away). Now it
    // stays within the leash of the pet and covers no plate (made shorter under the plate, it scrolls).
    await page.waitForTimeout(500);
    s = await state();
    const edgeGap = s.card && s.pet ? sideGap(s.card, s.pet) : -1;
    const edgeOver = s.card ? s.plates.filter((p) => overlaps(s.card, p.box)).map((p) => `${p.id} ${p.box}`) : [];
    check("card_by_pet_at_right_edge", nearRight && s.open && edgeGap >= 0 && edgeGap <= 160 && !edgeOver.length, `card ${s.card}, pet ${s.pet}: gap ${edgeGap} px (leash 160); plates ${s.plates.map((p) => `${p.id} ${p.box}`).join("; ") || "none"}; covered ${edgeOver.join("; ") || "none"}`);
    const bRight = await sampleBubble(2400);
    check("bubble_clear_at_right_edge", bRight.over === 0, `${bRight.over} of ${bRight.shown} samples over the card${bRight.worst ? `; ${bRight.worst}` : ""}`);

    // 6b. Past the first minute: every care word, from the card or the menu, does what it says, the stats move the
    // right way, and the pet comes back to normal after it. A stat is set first where the word needs room to move (a
    // full belly cannot be fed; medicine needs a sick pet); the check reads the page's own life and walk state.
    const lifeNow = () =>
      page.evaluate(() => {
        const l = /** @type {any} */ (typeof life !== "undefined" && life ? life : {});
        const m = /** @type {any} */ (typeof sim !== "undefined" && sim ? sim : {});
        const r = (n) => Math.round(Number(n) || 0);
        return { hunger: r(l.hunger), mood: r(l.mood), energy: r(l.energy), health: r(l.health), bond: r(l.bond), sick: !!l.sick, asleep: !!l.asleep, hidden: !!l.hidden, cmd: m.cmd, anim: m.anim };
      });
    /** Back to normal: wandering (a window play counts), or idle / sitting with nowhere to go; awake, no trick, not hidden. */
    const settle = (ms = 30_000) =>
      page
        .waitForFunction(
          () => {
            const m = /** @type {any} */ (typeof sim !== "undefined" ? sim : null);
            const l = /** @type {any} */ (typeof life !== "undefined" ? life : null);
            if (!m || !l || l.hidden || l.asleep || m.trick || m.anim === "eat" || m.anim === "talk") return false;
            return m.cmd === "wander" || ((m.cmd === "idle" || m.cmd === "sit") && m.target == null);
          },
          null,
          { timeout: ms, polling: 250 },
        )
        .then(() => true, () => false);
    const openCard = async () => {
      if ((await state()).open) return;
      await petMenu();
      await clickItem(app, "Keeper card");
      await page.waitForTimeout(450);
    };
    const press = async (how, what) => {
      if (how === "menu") {
        await petMenu();
        return clickItem(app, what);
      }
      for (let tries = 0; tries < 3; tries += 1) {
        await openCard();
        if (await page.locator(`#hud [data-care="${what}"]`).click({ timeout: 2500 }).then(() => true, () => false)) return true;
      }
      return false;
    };
    const said = () => page.waitForFunction(() => !!document.getElementById("bubble")?.classList.contains("open"), null, { timeout: 5000, polling: 150 }).then(() => true, () => false);
    const acted = () =>
      page
        .waitForFunction(() => {
          const m = /** @type {any} */ (typeof sim !== "undefined" ? sim : null);
          return !!m && (!!m.trick || !!m.play || m.cmd === "seek" || m.anim === "play" || !!document.getElementById("bubble")?.classList.contains("open"));
        }, null, { timeout: 6000, polling: 150 })
        .then(() => true, () => false);
    // A card opened from the menu stays up while the pet wanders off (it folded on the next wander step, so its
    // buttons went before they could be pressed).
    await settle(20_000);
    if ((await state()).open) {
      await page.locator("#hud-collapse").click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    await petMenu();
    await clickItem(app, "Keeper card");
    await page.waitForTimeout(300);
    const h3 = await holds(6000);
    check("card_stays_after_open", h3.open === h3.n, `open in ${h3.open} of ${h3.n} samples after Keeper card; the pet walked ${h3.walked}`);
    const careSteps = [
      { id: "care_feed", how: "menu", what: "Feed", stage: { hunger: 40 }, ok: (a, b) => b.hunger > a.hunger, show: "hunger" },
      { id: "care_treat", how: "card", what: "snack", stage: { hunger: 40 }, ok: (a, b) => b.hunger > a.hunger, show: "hunger" },
      { id: "care_play", how: "card", what: "play", stage: { mood: 40, energy: 90 }, ok: (a, b) => b.mood > a.mood && b.energy < a.energy, show: "mood energy" },
      { id: "care_trick", how: "menu", what: trickWord, act: true, ok: () => true, show: "" },
      { id: "care_praise", how: "menu", what: "Praise", stage: { bond: 10 }, ok: (a, b) => b.bond > a.bond, show: "bond" },
      { id: "care_medicine", how: "card", what: "medicine", stage: { sick: true, health: 40 }, ok: (a, b) => b.health > a.health && !b.sick, show: "health sick" },
      { id: "care_talk", how: "card", what: "talk", say: true, ok: () => true, show: "" },
      { id: "care_rest", how: "menu", what: "Rest", stage: { energy: 30 }, end: "asleep", ok: (a, b) => b.asleep && b.energy > a.energy, show: "energy asleep" },
      { id: "care_hide", how: "card", what: "hide", end: "hidden", ok: (a, b) => b.hidden, show: "hidden" },
      { id: "care_call_back", how: "menu", what: "Call back", ok: (a, b) => !b.hidden, show: "hidden" },
      { id: "care_hide_menu", how: "menu", what: "Hide", end: "hidden", ok: (a, b) => b.hidden, show: "hidden" },
      { id: "care_call_back_card", how: "card", what: "call", ok: (a, b) => !b.hidden, show: "hidden" },
    ];
    for (const step of careSteps) {
      // Hide follows Rest (a sleeping pet is sent away) and Call back follows Hide; the rest start from normal.
      if (!["care_hide", "care_call_back", "care_call_back_card"].includes(step.id)) await settle(20_000);
      if (step.stage) await page.evaluate((st) => Object.assign(/** @type {any} */ (life), st), step.stage);
      const a = await lifeNow();
      const t = Date.now();
      const pressed = !!step.what && (await press(step.how, step.what));
      const spoke = step.say ? await said() : true;
      const did = step.act ? await acted() : true;
      let back = false;
      if (step.end === "asleep") {
        back = await page.waitForFunction(() => !!(/** @type {any} */ (life).asleep), null, { timeout: 8000, polling: 200 }).then(() => true, () => false);
      } else if (step.end === "hidden") {
        back = await page
          .waitForFunction(() => !!(/** @type {any} */ (life).hidden) && !!document.getElementById("pet")?.classList.contains("hidden"), null, { timeout: 30_000, polling: 250 })
          .then(() => true, () => false);
      } else {
        await page.waitForTimeout(1200);
        // A talk holds its pose while the bubble has words (the house's own chatter can keep it up); give it longer.
        back = await settle(step.say ? 45_000 : 30_000);
      }
      const b = await lifeNow();
      const where = await page.evaluate(() => {
        const m = /** @type {any} */ (typeof sim !== "undefined" ? sim : {});
        return `pet ${m.cmd}/${m.anim} at ${Math.round(m.x)}${m.target == null ? "" : ` -> ${Math.round(m.target)}`}${m.play ? " (window play)" : ""}${typeof leaving !== "undefined" && leaving ? " leaving" : ""}`;
      });
      const moved = step.show
        .split(" ")
        .filter(Boolean)
        .map((k) => `${k} ${a[k]} -> ${b[k]}`)
        .join(", ");
      check(
        step.id,
        pressed && spoke && did && back && step.ok(a, b),
        `${step.how} ${step.what}: ${moved || (step.say ? `said ${spoke}` : `acted ${did}`)}; ${step.end ? `${step.end} ${back}` : `back to ${b.cmd}/${b.anim} ${back}`} in ${((Date.now() - t) / 1000).toFixed(1)} s${pressed ? "" : " (the press missed)"}${back ? "" : `; ${where}`}`,
      );
    }

    // 6b2. The #1557 audit, driven. A pet put to bed at 99 energy is fully rested after Rest and wakes by itself on
    // the next life tick (it slept on at 100 until something woke it).
    await settle(20_000);
    await page.evaluate(() => Object.assign(/** @type {any} */ (life), { energy: 99, hunger: 70, sick: false }));
    const restT = Date.now();
    const restPressed = await press("menu", "Rest");
    const slept = await page.waitForFunction(() => !!(/** @type {any} */ (life).asleep), null, { timeout: 8000, polling: 200 }).then(() => true, () => false);
    const wokeSelf = await page
      .waitForFunction(() => !(/** @type {any} */ (life).asleep) && /** @type {any} */ (sim).anim !== "sleep", null, { timeout: 20_000, polling: 250 })
      .then(() => true, () => false);
    const afterRest = await lifeNow();
    check("rest_wakes_when_rested", restPressed && slept && wokeSelf, `Rest at 99: asleep ${slept}; woke by itself ${wokeSelf} in ${((Date.now() - restT) / 1000).toFixed(1)} s; energy ${afterRest.energy}, ${afterRest.cmd}/${afterRest.anim}`);

    // The talk pose ends with the pet's own line. A Talk from the card; a second later the house chatters (the
    // same say() a robin's song or a guest's line uses) and keeps the bubble up for 15 s. The pose held with it.
    await settle(30_000);
    const talkPressed = await press("card", "talk");
    const ownLine = await page
      .waitForFunction(() => /** @type {any} */ (sim).cmd === "talk" && !!document.getElementById("bubble")?.classList.contains("open") && performance.now() < speechUntil, null, { timeout: 8000, polling: 100 })
      .then(() => page.evaluate(() => speechUntil), () => 0);
    await page.waitForTimeout(1000);
    await page.evaluate(() => say("The house hums along: a robin somewhere sings a long, bright song.", 15_000));
    const poseEnd = await page
      .waitForFunction(() => /** @type {any} */ (sim).cmd !== "talk", null, { timeout: 25_000, polling: 100 })
      .then(() => page.evaluate(() => ({ at: performance.now(), bubble: !!document.getElementById("bubble")?.classList.contains("open") })), () => null);
    const lateBy = poseEnd && ownLine ? Math.round(poseEnd.at - ownLine) : -1;
    check("talk_pose_ends_with_own_line", talkPressed && ownLine > 0 && !!poseEnd && lateBy <= 1200 && poseEnd.bubble, `the pet's line ended; the talk pose ended ${lateBy} ms after it${poseEnd ? `, with the house chatter still up ${poseEnd.bubble}` : " (never, in 25 s)"}`);
    await page.evaluate(() => {
      speechUntil = 0;
      bubble.classList.remove("open");
    });

    // On the screen through a window play with the ribbon carried. A play on a window past the left edge put the pet
    // at x = -109; the drive stands in one play step that walks there (the real window-play step, then x = -109),
    // since it moves no real app window, and samples the pet and the ribbon it carries for 1.5 s.
    await settle(20_000);
    await page.evaluate(() => {
      const WP = /** @type {any} */ (window).PetWindowPlay;
      /** @type {any} */ (window).__realStepPlay = WP.stepPlay;
      WP.stepPlay = (p) => ({ ...p, x: -109, facing: -1, anim: "walk", phase: "walk", lift: 0, rot: 0 });
      mark = { kind: "lure", x: 0, hops: 0, carried: true };
      lureEl.classList.add("show");
      /** @type {any} */ (sim).play = { x: 20, facing: -1, anim: "walk", phase: "walk", lift: 0, rot: 0 };
    });
    let offN = 0;
    let offSamples = 0;
    let worstOff = "";
    let lastOn = { simX: 0, pet: /** @type {number[] | null} */ (null), lure: [0, 0] };
    for (let t = 0; t < 1500; t += 150) {
      const o = await page.evaluate(() => {
        const r = lureEl.getBoundingClientRect();
        const p = document.getElementById("pet")?.getBoundingClientRect();
        return { simX: Math.round(/** @type {any} */ (sim).x), play: !!(/** @type {any} */ (sim).play), lure: [Math.round(r.left), Math.round(r.right)], pet: p ? [Math.round(p.left), Math.round(p.right)] : null, w: innerWidth };
      });
      if (o.play) {
        offSamples += 1;
        lastOn = o;
        if (o.simX < 0 || o.lure[0] < 0 || o.lure[1] > o.w) {
          offN += 1;
          worstOff = `pet x ${o.simX}, ribbon ${o.lure}`;
        }
      }
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => {
      const WP = /** @type {any} */ (window).PetWindowPlay;
      WP.stepPlay = /** @type {any} */ (window).__realStepPlay;
      /** @type {any} */ (sim).play = null;
      mark = null;
      lureEl.classList.remove("show");
    });
    check("play_stays_on_screen", offSamples >= 5 && offN === 0, `${offN} of ${offSamples} samples off the screen${worstOff ? `; ${worstOff}` : ""}; last: pet x ${lastOn.simX} (box ${lastOn.pet}), ribbon ${lastOn.lure}`);

    // 6c. The held card on a long walk stays within a leash of the pet (it stood where the walk began). The pet is
    // put at 60% of the screen and its food at the far left (the one Feed press is made with Math.random pinned, since
    // the food lands at random), so the card, which opens over the pet's right side, is left behind; it is sampled
    // while it is open and the pet walks.
    await settle(20_000);
    const leashFrom = Math.round(s.w * 0.6);
    for (let tries = 0; tries < 3; tries += 1) {
      const q = await petMiddle();
      if (!q) break;
      await page.mouse.move(q.x, q.y);
      await page.mouse.down();
      for (let i = 1; i <= 12; i += 1) await page.mouse.move(q.x + ((leashFrom - q.x) * i) / 12, q.y, { steps: 2 });
      await page.mouse.up();
      await page.waitForTimeout(400);
      const there = await page.locator("#pet").boundingBox();
      if (there && Math.abs(there.x + there.width / 2 - leashFrom) < 200) break;
      await settle(10_000);
    }
    await openCard();
    await page.evaluate(() => Object.assign(/** @type {any} */ (life), { hunger: 40 }));
    const startPet = (await state()).pet;
    const foodAt = await page.evaluate(() => {
      const r = Math.random;
      Math.random = () => 0;
      try {
        /** @type {HTMLElement | null} */ (document.querySelector('#hud [data-care="feed"]'))?.click();
      } finally {
        Math.random = r;
      }
      const mk = /** @type {any} */ (typeof mark !== "undefined" ? mark : null);
      return mk ? Math.round(mk.x) : null;
    });
    let leashN = 0;
    let maxGap = 0;
    let lastPet = startPet;
    for (let t = 0; t < 12_000; t += 250) {
      const o = await state();
      if (o.open && o.card && o.pet && (await walking())) {
        leashN += 1;
        maxGap = Math.max(maxGap, sideGap(o.card, o.pet));
        lastPet = o.pet;
      }
      await page.waitForTimeout(250);
    }
    const walked = startPet && lastPet ? Math.abs(lastPet[0] - startPet[0]) : 0;
    check("card_leash_on_long_walk", leashN >= 4 && walked >= 400 && maxGap <= 260, `food at ${foodAt}; the pet walked ${walked} px with the card open (${leashN} samples); widest card-to-pet gap ${maxGap} px (leash 260)`);
    await settle(30_000);

    // 7. Minds… opens the House window; Unlock… takes it to Unlock; closing it closes it.
    await petMenu();
    const winP = app.waitForEvent("window", { timeout: 20_000 }).catch(() => null);
    await clickItem(app, "Minds…");
    const house = await winP;
    if (house) {
      await house.waitForLoadState("load");
      await house.waitForTimeout(1200);
      const hi = await house.evaluate(() => ({
        title: document.title,
        heads: [...document.querySelectorAll("h1,h2,h3")].map((h) => (h.textContent || "").trim()),
        wide: document.documentElement.scrollWidth - innerWidth,
      }));
      check("house_minds", /House/.test(hi.title) && hi.heads.includes("Minds") && hi.heads.includes("Unlock") && hi.wide <= 0, `${hi.title}; Minds ${hi.heads.includes("Minds")}, Unlock ${hi.heads.includes("Unlock")}; sideways ${hi.wide}`);
      const mindsHash = await house.evaluate(() => location.hash);
      await petMenu();
      await clickItem(app, "Unlock…");
      await house.waitForTimeout(1200);
      const y = await house.evaluate(() => scrollY);
      const unlockHash = await house.evaluate(() => location.hash);
      check("house_unlock", y > 0, `scrolled to ${y}`);
      await house.reload({ waitUntil: "load" });
      await house.waitForTimeout(1200);
      const back = await house.evaluate(() => ({ hash: location.hash, y: Math.round(scrollY), top: Math.round(document.getElementById("unlockSection")?.getBoundingClientRect().top ?? -1) }));
      check("house_hash_reload", mindsHash === "#minds" && unlockHash === "#unlock" && back.hash === "#unlock" && back.y > 0 && back.top >= 0 && back.top < 80, `Minds… ${mindsHash}; Unlock… ${unlockHash}; after a reload ${JSON.stringify(back)}`);
      await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find((w) => /House/.test(w.getTitle()))?.close());
      await page.waitForTimeout(800);
      const left = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().filter((w) => /House/.test(w.getTitle())).length);
      check("house_closes", left === 0, `${left} House windows left`);
    } else {
      check("house_minds", false, "no House window opened");
    }

    // 7b. Minds: House lines first; xAI with a stand-in key is saved sealed (mind.json holds no plain key); a Talk
    // from the menu with the card folded opens the card and leaves only once the line naming xAI is in view; the
    // refused key (the drive's own 401) still gets a house line, and the card says why.
    await petMenu();
    const mindsP = app.waitForEvent("window", { timeout: 20_000 }).catch(() => null);
    await clickItem(app, "Minds…");
    const minds = await mindsP;
    if (minds) {
      housePage = minds;
      await minds.waitForLoadState("load");
      await minds.waitForTimeout(900);
      const m0 = await minds.evaluate(() => ({
        plugin: /** @type {HTMLSelectElement | null} */ (document.getElementById("plugin"))?.value,
        fields: !document.getElementById("mindFields")?.hidden,
      }));
      check("minds_house_default", m0.plugin === "local" && !m0.fields, `Minds starts at ${m0.plugin}; key fields ${m0.fields ? "shown" : "hidden"}`);
      await minds.selectOption("#plugin", "xai");
      await minds.fill("#key", STANDIN_KEY);
      await minds.click("#save");
      await minds.waitForTimeout(900);
      const savedLine = await minds.evaluate(() => (document.getElementById("ok")?.textContent || "").trim());
      keyLine = await minds.evaluate(() => (document.getElementById("keyStore")?.textContent || "").trim());
      let raw = "";
      try {
        raw = fs.readFileSync(path.join(ud, "mind.json"), "utf8");
      } catch {
        /* missing */
      }
      check("minds_key_sealed", /Saved/.test(savedLine) && /"xai"/.test(raw) && !raw.includes(STANDIN_KEY), `"${savedLine}"; mind.json names xai ${/"xai"/.test(raw)}, plain key in it ${raw.includes(STANDIN_KEY)}`);
      // Save tests the key, the way the web's Test this mind does: one talk, through the overlay (the House window
      // has no fetch of its own), only with the line naming xAI in view; the drive's 401 reads as a refused key.
      const tested = await minds
        .waitForFunction(() => {
          const t = (document.getElementById("mindTest")?.textContent || "").trim();
          return !!t && !/^Asking /.test(t);
        }, null, { timeout: 16_000, polling: 200 })
        .then(() => minds.evaluate(() => (document.getElementById("mindTest")?.textContent || "").trim()), () => "");
      const fromHouse = cloud.filter((c) => c.houseInView);
      const refusedLine = "The mind did not answer. The AI website did not accept your key. Check your key for that AI website. House lines will.";
      check("minds_save_tests_key", tested === refusedLine && fromHouse.length >= 1, `under Save: "${tested || "nothing"}"; ${fromHouse.length} request(s) to api.x.ai with the House window's line in view`);
      // Test this mind, its own button like the web's: the saved mind again without saving (one more request, the
      // line in view again); with a box changed and not saved it says so and asks nothing.
      const mindLine = () =>
        minds
          .waitForFunction(() => {
            const t = (document.getElementById("mindTest")?.textContent || "").trim();
            return !!t && !/^Asking /.test(t);
          }, null, { timeout: 16_000, polling: 200 })
          .then(() => minds.evaluate(() => (document.getElementById("mindTest")?.textContent || "").trim()), () => "");
      const asked = cloud.filter((c) => c.houseInView).length;
      await minds.click("#testMind");
      const retested = await mindLine();
      const askedAgain = cloud.filter((c) => c.houseInView).length - asked;
      const savedModel = await minds.inputValue("#model");
      await minds.fill("#model", `${savedModel}-not-saved`);
      const beforeUnsaved = cloud.length;
      await minds.click("#testMind");
      const unsaved = await mindLine();
      const askedUnsaved = cloud.length - beforeUnsaved;
      await minds.fill("#model", savedModel);
      check(
        "minds_test_button",
        retested === refusedLine && askedAgain === 1 && /^Save first\./.test(unsaved) && askedUnsaved === 0,
        `Test this mind: "${retested || "nothing"}" (${askedAgain} more request(s) with the line in view); with the model box changed: "${unsaved || "nothing"}" (${askedUnsaved} request(s))`,
      );
      await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find((w) => /House/.test(w.getTitle()))?.close());
      housePage = null;
      await page.waitForTimeout(700);
    } else {
      check("minds_house_default", false, "no House window opened");
    }
    await settle(20_000);
    if ((await state()).open) {
      await page.locator("#hud-collapse").click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const sentFrom = cloud.length;
    await petMenu();
    await clickItem(app, "Talk");
    const whyShown = await page
      .waitForFunction(() => {
        const e = document.getElementById("hud-talk-why");
        return !!e && !e.hidden && !!(e.textContent || "").trim();
      }, null, { timeout: 10_000, polling: 200 })
      .then(() => true, () => false);
    await page.waitForTimeout(300);
    const sent = cloud.slice(sentFrom);
    const afterTalk = await state();
    check("talk_line_before_cloud", sent.length >= 1 && sent.every((c) => c.inView) && afterTalk.open, `${sent.length} request(s) to api.x.ai; the line in view at each: ${sent.map((c) => c.inView).join(", ") || "none"}; card open ${afterTalk.open}`);
    const why = await page.evaluate(() => {
      const e = document.getElementById("hud-talk-why");
      return e && !e.hidden ? (e.textContent || "").trim() : "";
    });
    check("talk_failure_says_why", whyShown && /did not accept your key/.test(why), why ? `"${why}"` : "nothing said why the mind did not answer");

    // 7c. Sounds: the talk sound muted and the pet's volume at 35; then another pet from Companions.
    await openCard();
    firstKey = await page.evaluate(() => (typeof kind !== "undefined" && kind ? kind.key : null));
    await page.evaluate(() => {
      const v = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-volume"));
      if (!v) return;
      v.value = "35";
      v.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.locator('#hud-mutes [data-bus="talk"]').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    const snd = await page.evaluate(() => {
      const c = /** @type {any} */ (typeof card !== "undefined" ? card : {});
      const k = typeof kind !== "undefined" && kind ? kind.key : "";
      return { talk: !!(c.mutes && c.mutes.talk), vol: c.pets && c.pets[k] ? c.pets[k].volume : null };
    });
    check("sound_settings", snd.talk && snd.vol === 35, `talk muted ${snd.talk}; volume ${snd.vol}`);
    await petMenu();
    const nextPet = await app.evaluate(() => {
      const g = /** @type {any} */ (globalThis);
      const comp = g.__popups.at(-1)?.items.find((i) => i.label === "Companions");
      // Companions is one submenu per den now (House, Snakes, …); the guests are one level further in.
      const guests = comp && comp.submenu ? comp.submenu.items.flatMap((d) => (d.submenu ? d.submenu.items : [d])) : [];
      const it = guests.find((i) => i.type === "radio" && !i.checked && / · /.test(i.label || "") && !/Rui/.test(i.label || "")) || null;
      if (!it) return null;
      it.click();
      return it.label;
    });
    await page.waitForTimeout(1800);
    switchedKey = await page.evaluate(() => (typeof kind !== "undefined" && kind ? kind.key : null));
    check("pet_switch", !!nextPet && !!switchedKey && switchedKey !== firstKey, `Companions "${nextPet}": ${firstKey} -> ${switchedKey}`);
    // The volume slider is this pet's, and says so: the next pet has its own (not the 35 set for the first).
    await openCard();
    const vol = await page.evaluate((first) => {
      const v = /** @type {HTMLInputElement | null} */ (document.getElementById("hud-volume"));
      const label = v && v.closest("label") ? (v.closest("label")?.textContent || "").trim() : "";
      const c = /** @type {any} */ (typeof card !== "undefined" ? card : {});
      return { label, shown: v ? Number(v.value) : null, first: c.pets && first && c.pets[first] ? c.pets[first].volume : null };
    }, firstKey);
    check("volume_is_this_pets", vol.label === "Volume for this pet" && vol.first === 35 && vol.shown !== null && vol.shown !== 35, `label "${vol.label}"; the first pet keeps ${vol.first}, the slider shows ${vol.shown} for ${switchedKey}`);

    // 8. Hide the window, tray Show. Where no tray can be seen (Linux under Xvfb) Hide asks first: say Hide.
    await petMenu();
    await clickItem(app, "Hide the window");
    await page.waitForTimeout(700);
    const hideBox = (await boxes(app)).find((b) => !b.answered && /no tray icon on this desktop/.test(b.message));
    if (hideBox) {
      await pressBox(app, "Hide");
      await page.waitForTimeout(700);
    }
    const visible = () => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().filter((w) => w.isVisible()).length);
    const hidden = await visible();
    check("hide_window", hidden === 0, `${hidden} windows visible${hideBox ? " (asked first: no tray to see here)" : ""}`);
    const tray = await menuItems(app, "tray");
    await clickItem(app, "Show", "tray");
    await page.waitForTimeout(700);
    const shown = await visible();
    check("tray_show", !!tray && shown >= 1, `tray ${tray ? tray.length : 0} rows; ${shown} visible`);

    // 9. Quit from the pet's menu ends the app.
    await petMenu();
    const closed = app.waitForEvent("close", { timeout: 20_000 }).then(
      () => true,
      () => false,
    );
    await clickItem(app, "Quit").catch(() => {});
    check("quit", await closed, "app exited");
    await stop(app);
    app = null;

    // 10. A second start: the hello stays gone.
    ({ app, page } = await launch());
    await page.waitForTimeout(3000);
    const again = await page.evaluate(() => !document.getElementById("first-hint")?.hidden);
    check("second_start_no_hello", !again, again ? "the hello came back" : "hello stays gone");
    // Every setting from 7b and 7c after the restart: the pet chosen, the mute, the first pet's volume, the mind.
    const kept = await page.evaluate((first) => {
      const c = /** @type {any} */ (typeof card !== "undefined" ? card : {});
      const k = typeof kind !== "undefined" && kind ? kind.key : null;
      const M = /** @type {any} */ (window).PetMind;
      const bind = M && k ? M.binding(k) : {};
      return { key: k, talk: !!(c.mutes && c.mutes.talk), vol: c.pets && first && c.pets[first] ? c.pets[first].volume : null, plugin: bind.plugin, keyKept: !!bind.apiKey };
    }, firstKey);
    // A computer with no secret store (Linux with no keyring, as on a bare X server) cannot keep the key across a
    // restart: the key is not written to disk at all, and the Minds page said so at Save. That is the honest answer.
    const noStore = /no secret store, so the key was not written to disk/.test(keyLine);
    // A keyring on the session bus (gnome-keyring, KeePassXC) is a secret store: the key must be kept then, whatever
    // the desktop is called (Chromium chose the Secret Service only on desktops it knew by name).
    const keyring = process.platform === "linux" && require("./overlay-gate.cjs").secretServiceRunning({ env: process.env });
    check(
      "settings_survive_restart",
      !!switchedKey && kept.key === switchedKey && kept.talk && kept.vol === 35 && kept.plugin === "xai" && (kept.keyKept || (noStore && !keyring)),
      `pet ${kept.key} (chosen ${switchedKey}); talk muted ${kept.talk}; ${firstKey} volume ${kept.vol}; mind ${kept.plugin}, key kept ${kept.keyKept}${keyring ? " (a Secret Service is on the session bus)" : ""}${noStore ? ` (${keyring ? "yet " : "no secret store here; "}the Minds page said the key was not written to disk)` : ""}`,
    );
    await stop(app);
    app = null;

    // 11. No tray to see (GNOME without AppIndicator, a bare X server): every tray-only thing has another way. On
    //     Linux the app's own answer is used (Xvfb has no tray host); elsewhere COMPUTERPETS_TRAY=none says so.
    //     The hello comes back once for this (card.json firstHintSeen false) to check its words.
    try {
      const cj = path.join(ud, "card.json");
      const c = JSON.parse(fs.readFileSync(cj, "utf8"));
      c.firstHintSeen = false;
      fs.writeFileSync(cj, JSON.stringify(c));
    } catch {
      /* the check below says so */
    }
    const forced = process.platform !== "linux";
    ({ app, page } = await launch(forced ? { COMPUTERPETS_TRAY: "none" } : {}));
    await page.waitForTimeout(3500);
    const nt = await page.evaluate(() => ({
      host: typeof trayHost !== "undefined" ? trayHost : "?",
      name: typeof kind !== "undefined" && kind ? kind.name : "",
      hint: !document.getElementById("first-hint")?.hidden,
      lines: [...document.querySelectorAll("#first-hint-lines li")].map((li) => (li.textContent || "").trim()),
      off: (document.getElementById("hud-off-truth")?.textContent || "").trim(),
    }));
    const helloNoTray = nt.lines.join(" ");
    check(
      "no_tray_hello",
      nt.host === "no" && nt.hint && !/That is the tray icon/.test(helloNoTray) && new RegExp(`Right-click ${nt.name} and pick Companions`).test(helloNoTray) && /pick Quit/.test(helloNoTray),
      `tray host ${nt.host}${forced ? " (COMPUTERPETS_TRAY=none)" : " (the app's own check)"}; hello ${nt.hint}: "${nt.lines[2] || ""}"`,
    );
    const wantOff = process.platform === "win32" ? /type \.\\desktop\.ps1 again/ : /type sh desktop\.sh again/;
    check("turn_off_words", wantOff.test(nt.off), `Turn off says "${nt.off}"`);
    // Every row the tray has is in the pet's own menu too, but the tray's status line and Show (the window is up).
    const petRows = await petMenu();
    const trayRows = await app.evaluate(() => {
      const g = /** @type {any} */ (globalThis);
      const m = [...g.__built].reverse().find((x) => x.items.some((i) => i.label === "Show"));
      return m ? m.items.filter((i) => i.type !== "separator" && i.enabled !== false).map((i) => i.label) : null;
    });
    const petLabels = new Set((petRows || []).map((r) => r.label));
    const trayOnly = (trayRows || []).filter((l) => l !== "Show" && !petLabels.has(l));
    check("no_tray_pet_menu", !!trayRows && !!petRows && !trayOnly.length, `pet menu ${(petRows || []).length} rows; tray-only rows: ${trayOnly.join(", ") || "none"}`);
    // Hide the window asks first where no tray can be seen, and Cancel keeps the pets.
    await clickItem(app, "Hide the window");
    await page.waitForTimeout(700);
    const ask = (await boxes(app)).find((b) => !b.answered && /no tray icon on this desktop/.test(b.message));
    await pressBox(app, "Cancel");
    await page.waitForTimeout(500);
    const keptUp = await visible();
    await petMenu();
    await clickItem(app, "Hide the window");
    await page.waitForTimeout(700);
    await pressBox(app, "Hide");
    await page.waitForTimeout(700);
    const goneNow = await visible();
    check(
      "no_tray_hide_asks",
      !!ask && ask.buttons.join("|") === "Hide|Cancel" && keptUp >= 1 && goneNow === 0,
      ask ? `"${ask.message}" "${ask.detail}"; Cancel kept ${keptUp} window(s); Hide left ${goneNow}` : "Hide the window did not ask",
    );
    // Starting again brings them back, with the keeper card open: a second copy tells the first and quits.
    const { spawn } = require("node:child_process");
    const second = spawn(exe, [DESKTOP, ...nextArgs], { cwd: DESKTOP, env: { ...process.env, ...nextEnv, COMPUTERPETS_GUI_HARNESS: "", COMPUTERPETS_SETTINGS_DIR: ud }, stdio: "ignore" });
    const secondEnd = await new Promise((resolve) => {
      const t = setTimeout(() => {
        second.kill();
        resolve("killed after 20 s");
      }, 20_000);
      second.on("exit", (code) => {
        clearTimeout(t);
        resolve(`exited ${code}`);
      });
    });
    await page.waitForTimeout(1500);
    const back = await visible();
    s = await state();
    check("no_tray_second_start", back >= 1 && s.open, `the second copy ${secondEnd}; ${back} window(s) visible, keeper card open ${s.open}`);
    // 12. A tray host that starts after the pets (a panel that comes up late). On Linux X11 with stalonetray here, a
    //     real XEmbed tray is started now: within the app's 10 s ask-again the overlay hears "yes", the hello names the
    //     tray again, the icon is made again and docks in it, and Hide the window no longer asks.
    const lateTray = !forced && !!process.env.DISPLAY && !waylandArg(nextArgs) && whichSync("stalonetray");
    if (lateTray) {
      const st = spawn(lateTray, ["--geometry", "4x1+0+0", "--icon-size", "24"], { env: process.env, stdio: "ignore" });
      try {
        let seenYes = "";
        for (let i = 0; i < 30 && seenYes !== "yes"; i += 1) {
          await page.waitForTimeout(1000);
          seenYes = await page.evaluate(() => (typeof trayHost !== "undefined" ? trayHost : "?"));
        }
        const hello = await page.evaluate(() => ({
          shown: !document.getElementById("first-hint")?.hidden,
          text: [...document.querySelectorAll("#first-hint-lines li")].map((li) => (li.textContent || "").trim()).join(" "),
        }));
        await page.waitForTimeout(1500);
        const docked = trayIcons();
        await petMenu();
        await clickItem(app, "Hide the window");
        await page.waitForTimeout(900);
        const asked = (await boxes(app)).some((b) => !b.answered && /no tray icon on this desktop/.test(b.message));
        const hiddenNow = await visible();
        check(
          "tray_appears_later",
          seenYes === "yes" && (!hello.shown || /tray icon/.test(hello.text)) && docked === 1 && !asked && hiddenNow === 0,
          `stalonetray started after the pets: overlay heard ${seenYes}; hello ${hello.shown ? `"${(hello.text.match(/[^.]*tray icon[^.]*\./) || [hello.text.slice(0, 120)])[0].trim()}"` : "already put away"}; ${docked} icon docked in the tray; Hide the window ${asked ? "still asked" : "hid at once"} (${hiddenNow} visible)`,
        );
      } finally {
        st.kill();
      }
    }
    // 13. The same with a StatusNotifier tray host (KDE, GNOME's AppIndicator, waybar and most panels today) that
    //     starts after the pets: desktop/sni-watcher.py takes org.kde.StatusNotifierWatcher on the session bus. The
    //     overlay must hear "yes", the icon made again must register with it exactly once (the one from before
    //     dropped), and Hide the window must hide at once. Needs a session bus with no watcher on it and python3-gi.
    const sni = !forced && !waylandArg(nextArgs) && sniReady();
    if (sni) {
      if (lateTray) {
        // Back to no tray first: the window out again from the tray menu, stalonetray gone, the app's ask-again.
        await clickItem(app, "Show", "tray");
        await page.waitForTimeout(600);
      }
      let seenNo = "";
      for (let i = 0; i < 30 && seenNo !== "no"; i += 1) {
        seenNo = await page.evaluate(() => (typeof trayHost !== "undefined" ? trayHost : "?"));
        if (seenNo !== "no") await page.waitForTimeout(1000);
      }
      const list = path.join(ud, "sni-items.json");
      const w = spawn("python3", [path.join(DESKTOP, "sni-watcher.py"), list], { env: process.env, stdio: "ignore" });
      try {
        let seenYes = "";
        for (let i = 0; i < 30 && seenYes !== "yes"; i += 1) {
          await page.waitForTimeout(1000);
          seenYes = await page.evaluate(() => (typeof trayHost !== "undefined" ? trayHost : "?"));
        }
        await page.waitForTimeout(2000);
        let items = [];
        try {
          items = JSON.parse(fs.readFileSync(list, "utf8"));
        } catch {
          /* none written */
        }
        const shownBefore = await visible();
        await petMenu();
        await clickItem(app, "Hide the window");
        await page.waitForTimeout(900);
        const asked = (await boxes(app)).some((b) => !b.answered && /no tray icon on this desktop/.test(b.message));
        const hiddenNow = await visible();
        check(
          "tray_appears_later_sni",
          seenNo === "no" && seenYes === "yes" && items.length === 1 && shownBefore >= 1 && !asked && hiddenNow === 0,
          `a StatusNotifier watcher started after the pets (the overlay heard ${seenNo} before it): overlay heard ${seenYes}; ${items.length} item(s) registered with it${items.length ? ` (${items.join(", ")})` : ""}; Hide the window ${asked ? "still asked" : "hid at once"} (${shownBefore} -> ${hiddenNow} visible)`,
        );
      } finally {
        w.kill();
      }
    }
    check("no_page_errors", !errors.length, errors.length ? errors.slice(0, 4).join(" | ") : "none");
  } catch (e) {
    // A closed pet window that said why is the honest end of the drive there, not a crash.
    if (!gated) check("drive", false, String(e && e.stack ? e.stack.split("\n")[0] : e));
  } finally {
    if (app) await stop(app);
  }
  const removed = await removeDir(ud);
  check("throwaway_removed", removed, removed ? "removed" : `still at ${ud}`);
  try {
    if (fs.existsSync(WORK) && !fs.readdirSync(WORK).length) fs.rmdirSync(WORK);
  } catch {
    /* another run */
  }
  return { ok: !gated && checks.every((c) => c.ok), ...(gated ? { gated } : {}), checks, ms: Date.now() - t0, userData: ud, scale, electron };
}

/** The full path of a program on PATH, or "" (Linux/Mac: the drive's optional helpers such as stalonetray). */
function whichSync(name) {
  for (const dir of String(process.env.PATH || "").split(path.delimiter)) {
    const at = path.join(dir, name);
    try {
      fs.accessSync(at, fs.constants.X_OK);
      return at;
    } catch {
      /* next */
    }
  }
  return "";
}

/**
 * Whether the StatusNotifier check can run here: Linux, a session bus with no StatusNotifierWatcher on it yet (a real
 * panel's would already be the tray), dbus-send, and python3 with PyGObject for desktop/sni-watcher.py.
 */
function sniReady() {
  if (process.platform !== "linux" || !process.env.DBUS_SESSION_BUS_ADDRESS || !whichSync("dbus-send") || !whichSync("python3")) return false;
  const { spawnSync } = require("node:child_process");
  const gi = spawnSync("python3", ["-c", "import gi; gi.require_version('Gio', '2.0'); from gi.repository import Gio"], { timeout: 10_000 });
  if (gi.status !== 0) return false;
  const owner = spawnSync(
    "dbus-send",
    ["--session", "--print-reply", "--dest=org.freedesktop.DBus", "/org/freedesktop/DBus", "org.freedesktop.DBus.NameHasOwner", "string:org.kde.StatusNotifierWatcher"],
    { encoding: "utf8", timeout: 5000 },
  );
  return owner.status === 0 && /boolean false/.test(owner.stdout || "");
}

/**
 * How many icons are docked in stalonetray, read with xwininfo; 0 when it cannot tell. Its direct child windows are
 * the icons plus one 1x1 window of its own, which is not counted.
 */
function trayIcons() {
  const { spawnSync } = require("node:child_process");
  const tree = spawnSync("xwininfo", ["-root", "-tree"], { encoding: "utf8", timeout: 5000 }).stdout || "";
  const id = (tree.match(/^\s+(0x[0-9a-f]+) "stalonetray"/m) || [])[1];
  if (!id) return 0;
  const kids = spawnSync("xwininfo", ["-id", id, "-tree"], { encoding: "utf8", timeout: 5000 }).stdout || "";
  const lines = kids.split("\n").filter((l) => /^\s+0x[0-9a-f]+ /.test(l));
  const indent = (l) => l.length - l.trimStart().length;
  const top = Math.min(...lines.map(indent));
  return lines.filter((l) => indent(l) === top && !/\s1x1\+/.test(l)).length;
}

module.exports = { overlaps, onScreen, duplicateLabels, allLabels, throwawayOk, scaleArg, waylandArg, autoWaylandStart, ozoneOf, sideGap, gateOf, pollFor, gotItVerdict, GOT_IT_TRIES, GOT_IT_WAIT_MS, STANDIN_KEY, WORK, HOOK, RELAUNCH_FILE, drive };

if (require.main === module) {
  drive({ scale: scaleArg(process.argv.slice(2)), wayland: waylandArg(process.argv.slice(2)) }).then(
    (r) => {
      process.stdout.write(`${JSON.stringify(r)}\n`);
      process.exitCode = r.ok ? 0 : r.skipped ? 2 : 1;
    },
    (e) => {
      process.stdout.write(`${JSON.stringify({ ok: false, checks: [{ id: "drive", ok: false, detail: String(e) }] })}\n`);
      process.exitCode = 1;
    },
  );
}
