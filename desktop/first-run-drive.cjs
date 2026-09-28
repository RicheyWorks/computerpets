#!/usr/bin/env node
/**
 * Drives the desktop app's first run in real Electron, the way a new keeper meets it: the transparent overlay, the
 * hello on the keeper card, the pet, its care menu, the House window (Minds, Unlock), hiding and showing the window,
 * Quit, and a second start. Playwright's _electron (playwright-core from web/node_modules or desktop/node_modules;
 * nothing is downloaded) launches desktop/node_modules/electron with --user-data-dir set to a throwaway folder under
 * the gitignored target\first-run-drive, so the keeper's own settings and pets (%APPDATA%\computerpets-desktop) are
 * never read or written; it stops if Electron reports any other userData. Native menus are recorded instead of
 * popped up (Menu.prototype.popup), and their own click handlers are called; renderer input goes through Chromium's
 * own input path (CDP), never the OS mouse or keyboard, so nothing lands on the real desktop. The folder is removed
 * at the end and every window closes.
 *
 * Opens real windows on the screen, so it is opt-in: `node desktop/first-run-drive.cjs`, or the app harness's
 * `--gui` row gui.first_run_drive. Prints one JSON line: { ok, checks: [{ id, ok, detail }], ms, userData }.
 */
const path = require("node:path");
const fs = require("node:fs");

const ROOT = path.resolve(__dirname, "..");
const DESKTOP = __dirname;
const WORK = path.join(ROOT, "target", "first-run-drive");

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

async function drive() {
  const t0 = Date.now();
  /** @type {{ id: string, ok: boolean, detail: string }[]} */
  const checks = [];
  const check = (id, ok, detail) => checks.push({ id, ok: !!ok, detail: String(detail) });
  const pw = playwright();
  if (!pw) return { ok: false, skipped: "playwright-core not found under desktop/ or web/node_modules", checks, ms: 0 };
  const exe = path.join(DESKTOP, "node_modules", "electron", "dist", process.platform === "win32" ? "electron.exe" : "electron");
  if (!fs.existsSync(exe)) return { ok: false, skipped: `no Electron at ${exe} (npm install in desktop)`, checks, ms: 0 };
  const ud = path.join(WORK, `ud-${process.pid}-${Date.now()}`);
  if (!throwawayOk(ud)) throw new Error(`refusing user data ${ud}`);
  fs.mkdirSync(ud, { recursive: true });
  const errors = [];

  async function launch() {
    const app = await pw._electron.launch({
      executablePath: exe,
      args: [DESKTOP, `--user-data-dir=${ud}`],
      cwd: DESKTOP,
      env: { ...process.env, COMPUTERPETS_GUI_HARNESS: "" },
      timeout: 90_000,
    });
    const got = await app.evaluate(({ app: a }) => a.getPath("userData"));
    if (path.resolve(got).toLowerCase() !== path.resolve(ud).toLowerCase()) {
      await app.close().catch(() => {});
      throw new Error(`userData is ${got}, not the throwaway folder; stopped before touching it`);
    }
    await app.evaluate(({ Menu }) => {
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
      Menu.prototype.popup = function () {
        g.__popups.push(this);
      };
    });
    const page = await app.firstWindow({ timeout: 60_000 });
    await page.waitForLoadState("load");
    page.on("pageerror", (e) => errors.push(`overlay: ${String(e).slice(0, 160)}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`overlay console: ${m.text().slice(0, 160)}`);
    });
    return { app, page };
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
  try {
    let page;
    ({ app, page } = await launch());
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
    const petMenu = async () => {
      const p = await petMiddle();
      if (!p) return null;
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

    // 5. Got it: the hello goes and card.json keeps it gone.
    s = await state();
    if (!s.open) {
      await petMenu();
      await clickItem(app, "Keeper card");
      await page.waitForTimeout(700);
    }
    await page.locator("#first-hint-ok").click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(900);
    let cardJson = {};
    try {
      cardJson = JSON.parse(fs.readFileSync(path.join(ud, "card.json"), "utf8"));
    } catch {
      /* missing */
    }
    s = await state();
    check("got_it_persists", !s.hint && cardJson.firstHintSeen === true, `hello ${s.hint ? "still shows" : "gone"}; card.json firstHintSeen ${cardJson.firstHintSeen}`);

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
    const bRight = await sampleBubble(2400);
    check("bubble_clear_at_right_edge", bRight.over === 0, `${bRight.over} of ${bRight.shown} samples over the card${bRight.worst ? `; ${bRight.worst}` : ""}`);

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

    // 8. Hide the window, tray Show.
    await petMenu();
    await clickItem(app, "Hide the window");
    await page.waitForTimeout(700);
    const visible = () => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().filter((w) => w.isVisible()).length);
    const hidden = await visible();
    check("hide_window", hidden === 0, `${hidden} windows visible`);
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
    await app.close().catch(() => {});
    app = null;

    // 10. A second start: the hello stays gone.
    ({ app, page } = await launch());
    await page.waitForTimeout(3000);
    const again = await page.evaluate(() => !document.getElementById("first-hint")?.hidden);
    check("second_start_no_hello", !again, again ? "the hello came back" : "hello stays gone");
    check("no_page_errors", !errors.length, errors.length ? errors.slice(0, 4).join(" | ") : "none");
  } catch (e) {
    check("drive", false, String(e && e.stack ? e.stack.split("\n")[0] : e));
  } finally {
    if (app) {
      const proc = app.process();
      await app.close().catch(() => {});
      try {
        if (proc && proc.exitCode === null) proc.kill();
      } catch {
        /* gone */
      }
    }
  }
  const removed = await removeDir(ud);
  check("throwaway_removed", removed, removed ? "removed" : `still at ${ud}`);
  try {
    if (fs.existsSync(WORK) && !fs.readdirSync(WORK).length) fs.rmdirSync(WORK);
  } catch {
    /* another run */
  }
  return { ok: checks.every((c) => c.ok), checks, ms: Date.now() - t0, userData: ud };
}

module.exports = { overlaps, onScreen, duplicateLabels, allLabels, throwawayOk, WORK, drive };

if (require.main === module) {
  drive().then(
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
