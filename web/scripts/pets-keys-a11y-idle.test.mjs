import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// /pets/$key rename and let-go say why they failed (no unhandled rejections); other guests' cards say
// where to pick music; a stale-list revoke re-reads the list once; the desktop keeper card takes the
// keyboard while open (Tab, Escape, a focus ring); Try again, meters, the room, and toggles speak to
// screen readers; and hidden pages pause the house's intervals (the keeper clock keeps running).

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const P = await import(pathToFileURL(join(web, "src/lib/plain-error.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const M = await import(pathToFileURL(join(web, "src/lib/pets/house-music.ts")).href);
const V = K; // everyVisible lives beside the heartbeat poll in pets/keeper.ts
const req = createRequire(import.meta.url);
const OverlayMusic = req(join(repo, "desktop/renderer/house-music.js"));
const OverlayKeeper = req(join(repo, "desktop/renderer/keeper.js"));
const refused = () => Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } });

test("petNotSaved: a rename or let-go that failed says so plainly; raw text only in the log", () => {
  for (const act of ["rename", "release"]) {
    const logged = [];
    const line = P.petNotSaved(act, refused(), (l, e) => logged.push([l, e]));
    assert.ok(line.startsWith(P.PET_NOT_SAVED[act]), line);
    assert.match(line, /Couldn't reach the house server/);
    assert.doesNotMatch(line, /ECONNREFUSED|fetch failed/);
    assert.equal(logged.length, 1);
  }
  assert.equal(P.PET_NOT_SAVED.rename, "The new name wasn't saved.");
  assert.equal(P.PET_NOT_SAVED.release, "They weren't let go; they're still in your kennel.");
});

test("/pets/$key: every server call has a catch; rename and let-go show a line with Try again", () => {
  const page = src("src/routes/pets.$key.tsx");
  assert.equal((page.match(/\.then\(/g) || []).length, 3, "load, rename, let go");
  assert.ok((page.match(/\.catch\(/g) || []).length >= 4, "load, rename, let go, set active");
  assert.match(page, /\.catch\(\(err\) => setPetProblem\(\{ act: "rename", line: petNotSaved\("rename", err\) \}\)\)/);
  assert.match(page, /\.catch\(\(err\) => setPetProblem\(\{ act: "release", line: petNotSaved\("release", err\) \}\)\)/);
  assert.match(page, /void setActivePet\(\{ data: \{ petId: pet\.id \} \}\)\.catch\(\(err\) => plainMessage\(err\)\)/);
  assert.match(page, /\{problemLine\("rename", \(\) => rename\(pet\.id, name\)\)\}/);
  assert.match(page, /\{problemLine\("release", \(\) => release\(petId\), true\)\}/);
  const line = page.slice(page.indexOf("function problemLine"), page.indexOf("async function persistCare"));
  assert.match(line, /<span id=\{id\}>\{petProblem\.line\}<\/span>/);
  assert.match(line, /aria-describedby=\{id\}/);
  assert.match(line, /const Line = inline \? "span" : "p";/, "no <p> inside the footer's <p>");
  const release = page.slice(page.indexOf("function release"), page.indexOf("function problemLine"));
  assert.ok(release.indexOf("window.confirm") < release.indexOf("releasePet("), "Try again still asks first");
});

test("sharedMusicHint: off or radio with no station says pick on Rui's card; web and overlay agree", () => {
  assert.equal(M.MUSIC_PICK_HINT, "Pick music on Rui's card.");
  assert.equal(OverlayMusic.MUSIC_PICK_HINT, M.MUSIC_PICK_HINT);
  const cases = [
    [{ plugin: "off" }, true],
    [{ plugin: "radio" }, true],
    [{ plugin: "radio", stationUrl: "https://stream.example.org/live", playing: true }, false],
    [{ plugin: "house", playing: false }, false],
  ];
  for (const [raw, hint] of cases) {
    const w = M.parseMusic(raw);
    const o = OverlayMusic.parseMusic(raw);
    assert.equal(M.sharedMusicHint("robin", w), hint ? M.MUSIC_PICK_HINT : "", JSON.stringify(raw));
    assert.equal(OverlayMusic.sharedMusicHint("robin", o), M.sharedMusicHint("robin", w));
    assert.equal(M.sharedMusicHint("red_panda", w), "", "never on Rui's own card");
    assert.ok(!(M.sharedMusicHint("robin", w) && M.sharedMusicShows("robin", w)), "hint and Pause/Play never both");
  }
  const card = src("src/components/desk/keeper-card.tsx");
  const hintAt = card.indexOf("{sharedMusicHint(guestKey, music) ? (");
  const ruiAt = card.indexOf('{guestKey === "red_panda" ? (');
  assert.ok(hintAt > 0 && hintAt < ruiAt, "outside Rui's block");
  const html = read(repo, "desktop/renderer/index.html");
  assert.ok(html.indexOf('<p id="hud-house-music-hint" class="keeper-truth" hidden></p>') > html.indexOf('<div id="hud-house-music"'));
  const pet = read(repo, "desktop/renderer/pet.js");
  const paint = pet.slice(pet.indexOf("function paintHouseMusic"), pet.indexOf("function streamLineInView"));
  assert.match(paint, /M\.sharedMusicHint\(kind\.key, music\)/);
  const paintCard = pet.slice(pet.indexOf("function paintCard"), pet.indexOf("function paintCard") + 900);
  assert.match(paintCard, /paintHouseMusic\(\);/, "a change from Rui's card or a guest switch repaints House music");
});

test("rereadOnce: runs once after the delay or on focus, whichever is first; cancel stops it", () => {
  const make = () => {
    const timers = new Map();
    const listeners = new Set();
    let n = 0;
    return {
      timers,
      listeners,
      opts: {
        ms: 5000,
        setTimeoutImpl: (fn, ms) => {
          timers.set(++n, { fn, ms });
          return n;
        },
        clearTimeoutImpl: (id) => timers.delete(id),
        target: { addEventListener: (_t, fn) => listeners.add(fn), removeEventListener: (_t, fn) => listeners.delete(fn) },
      },
    };
  };
  let runs = 0;
  const a = make();
  B.rereadOnce(() => runs++, a.opts);
  assert.equal([...a.timers.values()][0].ms, 5000);
  [...a.timers.values()][0].fn();
  assert.equal(runs, 1);
  assert.equal(a.listeners.size, 0, "focus listener gone after the timer");
  const b = make();
  B.rereadOnce(() => runs++, b.opts);
  [...b.listeners][0]();
  assert.equal(runs, 2);
  assert.equal(b.timers.size, 0, "timer cleared after focus");
  const c = make();
  const cancel = B.rereadOnce(() => runs++, c.opts);
  cancel();
  assert.equal(c.timers.size + c.listeners.size, 0);
  assert.equal(runs, 2, "cancelled never runs");
  assert.equal(B.STALE_REREAD_MS, 5000);
  assert.match(B.revokedListStale("x"), /the list reads again in a few seconds\.$/);
});

test("admin: a stale-list revoke schedules one re-read; searches, locks, and leaving cancel it", () => {
  const page = src("src/routes/admin.tsx");
  const revoke = page.slice(page.indexOf("async function confirmRevoke"), page.indexOf("function lock("));
  const staleAt = revoke.indexOf("setRows((was) => markRevoked(was, jti));");
  assert.ok(staleAt > 0 && revoke.indexOf("rereadOnce(") > staleAt, "only after the stale branch");
  assert.match(revoke, /void rereadAfterRevoke\(base, key, q\);/);
  for (const fn of ["async function openLedger", "async function onSearch", "async function confirmRevoke", "function lock("]) {
    const at = page.indexOf(fn);
    assert.match(page.slice(at, at + 160), /cancelReread\(\);/, fn);
  }
  assert.match(page, /useEffect\(\(\) => cancelReread, \[\]\);/);
  const again = page.slice(page.indexOf("async function rereadAfterRevoke"), page.indexOf("async function confirmRevoke"));
  assert.equal((again.match(/if \(gen !== rereadGen\.current\) return;/g) || []).length, 2, "a late answer is dropped");
  assert.match(again, /setNote\(REVOKED_NOTE\);/);
  assert.doesNotMatch(again, /rereadOnce/, "never loops");
});

test("overlay keyboard: Tab wraps in the open card, Escape closes it, a tray item opens it with focus", () => {
  assert.equal(OverlayKeeper.tabWrap(0, -1, false), -1);
  assert.equal(OverlayKeeper.tabWrap(3, -1, false), 0);
  assert.equal(OverlayKeeper.tabWrap(3, -1, true), 2);
  assert.equal(OverlayKeeper.tabWrap(3, 2, false), 0);
  assert.equal(OverlayKeeper.tabWrap(3, 0, true), 2);
  assert.equal(OverlayKeeper.tabWrap(3, 1, false), -1, "the page moves focus in the middle");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: true }), "close");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: true, menuOpen: true }), "none", "a menu closes first");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: false }), "none");
  assert.equal(OverlayKeeper.cardKey({ key: "Tab", cardOpen: true }), "tab");
  assert.equal(OverlayKeeper.cardKey({ key: "a", cardOpen: true }), "none");
  const pet = read(repo, "desktop/renderer/pet.js");
  const keys = pet.slice(pet.indexOf("function cardKeys"), pet.indexOf("function cardKeys") + 900);
  assert.match(keys, /window\.desk\?\.setFocusable\?\.\(true\);/);
  assert.match(keys, /window\.desk\?\.setFocusable\?\.\(false\);/);
  assert.doesNotMatch(keys, /setClickable/, "click-through is never touched");
  assert.match(pet, /if \(card\.collapsed\) cardKeys\(false\);/, "closing the card lets go of the keyboard");
  assert.match(pet, /if \(fieldOf\(document\.activeElement\) \|\| cardKeysOn\) return;/);
  assert.match(pet, /cmd\.type === "open-card"\) \{\n[\s\S]{0,160}openKeeperCard\(\);\n\s+paintHud\(\);\n\s+cardKeys\(true, \{ focusFirst: true \}\);/);
  const choiceKeysAt = pet.indexOf('if (!note || note.record || note.field || note.toggle !== "dismiss") return;');
  const cardEscAt = pet.indexOf("if (e.defaultPrevented || !K || !K.cardKey) return;");
  assert.ok(choiceKeysAt > 0 && cardEscAt > choiceKeysAt, "the menu's Escape runs first and marks the key handled");
  assert.match(pet, /let cardKeysOn = false;/);
  assert.ok(pet.indexOf("let cardKeysOn = false;") < pet.indexOf("function paintCard"), "declared before any paint");
  const main = read(repo, "desktop/main.cjs");
  assert.equal((main.match(/\{ label: "Keeper card", click: \(\) => openKeeperCardFromMenu\(\) \}/g) || []).length, 2, "tray and pet menu");
  assert.match(main, /win\.webContents\.send\("command", \{ type: "open-card" \}\);/);
  const css = read(repo, "desktop/renderer/styles.css");
  assert.match(css, /#hud button:focus-visible,[\s\S]{0,140}outline: 2px solid #d8cfc0;/);
});

test("screen readers: Try again names its problem, meters are meters, the room and pet art have names", () => {
  for (const rel of ["src/components/load-problem.tsx", "src/components/desk/desk-plates.tsx", "src/components/desk/companion-room.tsx", "src/components/desk/keeper-card.tsx", "src/routes/pets.$key.tsx"]) {
    const text = src(rel);
    let at = text.indexOf("{RETRY_LABEL}");
    assert.ok(at > 0, rel);
    while (at > 0) {
      const open = text.lastIndexOf("<button", at) > text.lastIndexOf("<Button", at) ? text.lastIndexOf("<button", at) : text.lastIndexOf("<Button", at);
      assert.match(text.slice(open, at), /aria-describedby=/, `${rel} @${at}`);
      at = text.indexOf("{RETRY_LABEL}", at + 1);
    }
  }
  const card = src("src/components/desk/keeper-card.tsx");
  const meter = card.slice(card.indexOf("function Meter"), card.indexOf("function Meter") + 600);
  for (const attr of ['role="meter"', "aria-label={label}", "aria-valuemin={0}", "aria-valuemax={100}", "aria-valuenow={value}"]) assert.ok(meter.includes(attr), attr);
  const ruiAt = card.indexOf('{guestKey === "red_panda" ? (');
  const before = card.slice(0, ruiAt);
  for (const v of ["card.color === color.id", "card.voiceStyle === style.id", "houseStep === kind", "sleepAid.plugin === plugin.id"]) {
    assert.ok(before.includes(`aria-pressed={${v}}`), v);
  }
  assert.doesNotMatch(card.slice(ruiAt, ruiAt + 5000), /aria-pressed=\{music\.|aria-pressed=\{music\.stationId/, "Rui's block keeps its own markup");
  assert.equal(K.petArtLabel("Rui"), "Rui");
  assert.equal(K.petArtLabel("Rui", { asleep: true }), "Rui, asleep");
  assert.equal(K.petArtLabel("Rui", { hidden: true, asleep: true }), "Rui, hiding");
  assert.equal(K.petArtLabel("Pip", { unwell: true }), "Pip, unwell");
  assert.equal(K.roomLabel("Pip"), "Pip's room");
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /aria-label=\{roomLabel\(displayName\)\}/);
  assert.match(room, /label=\{petArtLabel\(displayName, \{ hidden: stats\.hidden \|\| deskOff, asleep: !!stats\.asleep, unwell: stats\.sick \}\)\}/);
  const living = src("src/components/desk/living-pet.tsx");
  assert.match(living, /aria-label=\{label\}\n\s+aria-hidden=\{label \? undefined : true\}/);
  const pet = read(repo, "desktop/renderer/pet.js");
  for (const v of ["card.color === color.id", "card.voiceStyle === style.id", "card.stepKind === step", "aid.plugin === plugin.id"]) {
    assert.ok(pet.includes(`btn.setAttribute("aria-pressed", ${v} ? "true" : "false");`), v);
  }
  const ruiDesk = pet.slice(pet.indexOf('if (hudMusic && window.PetHouseMusic && kind && kind.key === "red_panda") {'), pet.indexOf("} else if (hudMusic) {"));
  assert.doesNotMatch(ruiDesk, /aria-pressed/, "Rui's overlay block untouched");
});

function fakeDoc() {
  const fns = new Set();
  return {
    hidden: false,
    fns,
    addEventListener: (_t, fn) => fns.add(fn),
    removeEventListener: (_t, fn) => fns.delete(fn),
    flip(hidden) {
      this.hidden = hidden;
      for (const fn of [...fns]) fn();
    },
  };
}
function fakeTimers() {
  const timers = new Map();
  let n = 0;
  return {
    timers,
    setIntervalImpl: (fn, ms) => {
      timers.set(++n, { fn, ms });
      return n;
    },
    clearIntervalImpl: (id) => timers.delete(id),
  };
}

test("everyVisible: a hidden page pauses the interval, showing it resumes (and runs once with onResume)", () => {
  const doc = fakeDoc();
  const t = fakeTimers();
  let runs = 0;
  const stop = V.everyVisible(() => runs++, 350, { doc, ...t, onResume: true });
  assert.equal(t.timers.size, 1);
  doc.flip(true);
  assert.equal(t.timers.size, 0, "hidden: no interval");
  doc.flip(false);
  assert.equal(runs, 1, "ran once on return");
  assert.equal(t.timers.size, 1);
  stop();
  assert.equal(t.timers.size + doc.fns.size, 0, "stop clears the interval and the listener");
  const hiddenDoc = fakeDoc();
  hiddenDoc.hidden = true;
  V.everyVisible(() => {}, 1000, { doc: hiddenDoc, ...fakeTimers() });
  const t2 = fakeTimers();
  V.everyVisible(() => {}, 1000, { doc: null, ...t2 });
  assert.equal(t2.timers.size, 1, "no document: it just runs");
});

test("the shared heartbeat poll pauses while hidden and reads once on return", async () => {
  const doc = fakeDoc();
  const t = fakeTimers();
  let reads = 0;
  const poll = K.createHeartbeatPoll({ doc, ...t, url: "http://127.0.0.1:1/x", fetchImpl: async () => { reads++; throw new TypeError("fetch failed"); } });
  const off = poll.subscribe(() => {});
  await new Promise((r) => setImmediate(r));
  assert.equal(reads, 1);
  doc.flip(true);
  assert.equal(t.timers.size, 0);
  doc.flip(false);
  await new Promise((r) => setImmediate(r));
  assert.equal(reads, 2, "read at once on return");
  assert.equal(t.timers.size, 1);
  off();
  assert.equal(t.timers.size + doc.fns.size, 0);
});

test("idle pages: room, hive, and blotter intervals pause while hidden; the overlay keeper clock does not", () => {
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /const stopMeet = everyVisible\(\(\) => \{/);
  assert.match(room, /if \(!speech\) return;\n\s+return everyVisible\(/);
  for (const rel of ["src/components/desk/hive-den.tsx", "src/components/desk/blotter-guests.tsx"]) {
    const text = src(rel);
    assert.doesNotMatch(text, /setInterval\(/, rel);
    assert.match(text, /everyVisible\(/, rel);
  }
  assert.match(src("src/components/desk/hive-den.tsx"), /\}, 8000, \{ onResume: true \}\);/);
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /setInterval\(\(\) => \{\n  if \(!document\.hidden\) readHouseServer\(\);\n\}, 15_000\);/);
  assert.match(pet, /setInterval\(\(\) => \{\n  if \(document\.hidden \|\| !window\.PetGpu \|\| !hudGpu\) return;/);
  const clockAt = pet.indexOf("let clockSince = Date.now();");
  const clock = pet.slice(clockAt, pet.indexOf("}, 1000);", clockAt));
  assert.doesNotMatch(clock, /if \(document\.hidden\) return;/, "#1521: the keeper clock keeps looking while hidden");
});
