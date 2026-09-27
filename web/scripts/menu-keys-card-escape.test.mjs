import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// The sit choice is a real menu (menuitems, one tab stop, arrows / Home / End, Escape closes and focus goes
// back to the guest); Escape closes the web keeper card and a keyboard button opens it again; overlay plates
// step back to the card on Escape and their tabs take the arrow keys; a saved line's Drop keeps focus in the
// list on both surfaces; the /meet walkers are one hello group with one tab stop; admin rows are named by
// license id and the revoke ask moves focus; the visit, the flyers, and the p2p relay poll rest while hidden.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const Card = await import(pathToFileURL(join(web, "src/lib/pets/card.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const P2P = await import(pathToFileURL(join(web, "src/lib/multiplayer/p2p.ts")).href);
const req = createRequire(import.meta.url);
const OverlayKeeper = req(join(repo, "desktop/renderer/keeper.js"));

function fakeDoc(hidden = false) {
  const fns = new Set();
  return {
    hidden,
    addEventListener: (_t, fn) => fns.add(fn),
    removeEventListener: (_t, fn) => fns.delete(fn),
    flip(next) {
      this.hidden = next;
      for (const fn of [...fns]) fn();
    },
    get listeners() {
      return fns.size;
    },
  };
}

/** A hand-cranked clock: timers fire only when advance() passes their time. */
function fakeClock() {
  let now = 0;
  let seq = 0;
  const timers = new Map();
  return {
    now: () => now,
    set: (fn, ms) => {
      const id = ++seq;
      timers.set(id, { fn, at: now + ms });
      return id;
    },
    clear: (id) => timers.delete(id),
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const due = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]);
        now = due[1].at;
        due[1].fn();
      }
      now = end;
    },
    get pending() {
      return timers.size;
    },
  };
}

test("rovingIndex / menuKey: arrows step and wrap, Home and End jump, Escape closes, other keys pass", () => {
  assert.equal(K.rovingIndex("ArrowRight", 0, 4), 1);
  assert.equal(K.rovingIndex("ArrowDown", 3, 4), 0, "wraps forward");
  assert.equal(K.rovingIndex("ArrowLeft", 0, 4), 3, "wraps back");
  assert.equal(K.rovingIndex("ArrowUp", 2, 4), 1);
  assert.equal(K.rovingIndex("ArrowRight", -1, 4), 0, "from outside the group lands on the first");
  assert.equal(K.rovingIndex("Home", 2, 4), 0);
  assert.equal(K.rovingIndex("End", 0, 4), 3);
  assert.equal(K.rovingIndex("Tab", 1, 4), -1, "Tab leaves the group");
  assert.equal(K.rovingIndex("ArrowRight", 0, 0), -1);
  assert.equal(K.menuKey("Escape", 1, 4), "close");
  assert.equal(K.menuKey("End", 1, 4), 3);
  assert.equal(K.menuKey("a", 1, 4), null);
});

test("visibleTimeline counts shown time only: hidden holds the next step, showing resumes the rest", () => {
  const clock = fakeClock();
  const doc = fakeDoc(false);
  const ran = [];
  const stop = K.visibleTimeline(
    [
      { at: 1000, run: () => ran.push("in") },
      { at: 3000, run: () => ran.push("talk") },
      { at: 3000, run: () => ran.push("same-time") },
      { at: 5000, run: () => ran.push("gone") },
    ],
    { doc, setTimeoutImpl: clock.set, clearTimeoutImpl: clock.clear, now: clock.now },
  );
  clock.advance(1000);
  assert.deepEqual(ran, ["in"]);
  clock.advance(500);
  doc.flip(true);
  assert.equal(clock.pending, 0, "hidden: no timer waits");
  clock.advance(60_000);
  assert.deepEqual(ran, ["in"], "nothing runs behind another tab");
  doc.flip(false);
  clock.advance(1499);
  assert.deepEqual(ran, ["in"], "1.5 s of shown time was already spent");
  clock.advance(1);
  assert.deepEqual(ran, ["in", "talk", "same-time"]);
  stop();
  assert.equal(doc.listeners, 0);
  clock.advance(10_000);
  assert.deepEqual(ran, ["in", "talk", "same-time"], "stop drops the rest");
});

test("visibleTimeline started behind a hidden tab waits for the page to show", () => {
  const clock = fakeClock();
  const doc = fakeDoc(true);
  const ran = [];
  K.visibleTimeline([{ at: 100, run: () => ran.push(1) }], { doc, setTimeoutImpl: clock.set, clearTimeoutImpl: clock.clear, now: clock.now });
  clock.advance(1000);
  assert.deepEqual(ran, []);
  doc.flip(false);
  clock.advance(100);
  assert.deepEqual(ran, [1]);
  const always = [];
  K.visibleTimeline([{ at: 5, run: () => always.push(1) }], { doc: null, setTimeoutImpl: clock.set, clearTimeoutImpl: clock.clear, now: clock.now });
  clock.advance(5);
  assert.deepEqual(always, [1], "no document: it just runs");
});

test("afterDrop (web and overlay agree), revokeAskFocus, pollDelay", () => {
  for (const f of [Card.afterDrop, OverlayKeeper.afterDrop]) {
    assert.equal(f(1, 3), 1, "the line that slid up");
    assert.equal(f(3, 3), 2, "the last one: the line above");
    assert.equal(f(0, 0), -1, "none left: the field");
  }
  assert.equal(B.revokeAskFocus("abc", null), "confirm");
  assert.equal(B.revokeAskFocus(null, "abc"), "revoke");
  assert.equal(B.revokeAskFocus(null, null), null);
  assert.equal(P2P.pollDelay(true, true), 400, "a handshake keeps fast polling even hidden");
  assert.equal(P2P.pollDelay(false, false), 2000);
  assert.equal(P2P.pollDelay(false, true), 10_000);
});

test("sit choice: role=menu with menuitems and one tab stop; arrows move, Escape closes and focus goes home", () => {
  const choice = src("src/components/desk/guest-choice.tsx");
  assert.doesNotMatch(choice, /BlotterCare/, "no Care toolbar nested in the menu");
  assert.match(choice, /role="menu"\n\s+aria-label="A sit"\n\s+aria-orientation="horizontal"/);
  assert.match(choice, /role="menuitem"\n\s+tabIndex=\{i === stop \? 0 : -1\}/);
  assert.match(choice, /const act = menuKey\(e\.key, items\.indexOf\(document\.activeElement as HTMLButtonElement\), items\.length\);/);
  assert.match(choice, /if \(act === "close"\) \{\n[\s\S]{0,140}e\.stopPropagation\(\);\n\s+onClose\?\.\(\);/);
  assert.match(choice, /onClick=\{\(e\) => onPick\(mark\.id, \{ keys: e\.detail === 0 \}\)\}/);
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /onClose=\{\(\) => \{\n\s+choiceByKeys\.current = true;\n\s+setChoiceOpen\(false\);/);
  assert.match(room, /onPick=\{\(id, how\) => \{\n\s+if \(how\?\.keys\) choiceByKeys\.current = true;/);
});

test("web keeper card: Escape closes it (not from a field) and a keyboard button opens it with focus inside", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  assert.match(card, /const note = classifyKey\(e\.nativeEvent\);\n\s+if \(stayOpen \|\| note\.field \|\| note\.toggle !== "dismiss"\) return;\n\s+e\.stopPropagation\(\);\n\s+hideCard\(\{ keys: true \}\);/);
  assert.match(card, /if \(card\.collapsed && !stayOpen\) return null/);
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /\{cardOpen \? null : \(\n\s+<button\n\s+type="button"\n\s+data-card="open"\n\s+aria-expanded="false"/);
  assert.match(room, /sr-only[^"]*focus:not-sr-only/);
  assert.match(room, /Open \{displayName\}&apos;s keeper card/);
  assert.match(room, /function openCardByKeys\(\) \{\n\s+saveCard\(\{ \.\.\.loadCard\(\), collapsed: false \}\);\n\s+cardFocus\.current = "card";/);
  assert.match(room, /onCollapse=\{\(how\) => \{\n\s+if \(how\?\.keys\) cardFocus\.current = "open";/);
  assert.match(room, /want === "card" \? '\[data-keeper-poster\] \[data-card="collapse"\]' : '\[data-card="open"\]'/);
});

test("saved lines: Play and Drop are named by their line; a keyboard Drop keeps focus in the list (web and overlay)", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  assert.match(card, /data-line-drop=\{line\.id\}\n\s+aria-label=\{`Drop: \$\{line\.text\}`\}/);
  assert.match(card, /aria-label=\{`Play: \$\{line\.text\}`\}/);
  assert.match(card, /if \(document\.activeElement === e\.currentTarget\) dropFocus\.current = at;/);
  assert.match(card, /const next = afterDrop\(at, drops\.length\);\n\s+\(next < 0 \? draftInput\.current : drops\[next\]\)\?\.focus\(\);/);
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /const REBUILT_KEYS = \["color", "voice", "bus", "step", "sleep", "linePlay", "lineDrop"\];/);
  assert.match(pet, /drop\.dataset\.lineDrop = line\.id;\n\s+drop\.setAttribute\("aria-label", `Drop: \$\{line\.text\}`\);/);
  assert.match(pet, /play\.setAttribute\("aria-label", `Play: \$\{line\.text\}`\);/);
  assert.match(pet, /const land = next >= 0 \? same\[next\] : document\.getElementById\("hud-line-text"\);/);
  // The call dropdowns are filled once and never replaced, so a focused one keeps focus across paints.
  assert.match(pet, /if \(hudCallPick && !callFilled\) \{/);
});

test("overlay plates: Escape steps back to the card (then closes it); plate tabs are one stop with arrow keys", () => {
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: true, inPlate: true }), "card");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: false, inPlate: true }), "leave");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: true, inPlate: true, menuOpen: true }), "none");
  assert.equal(OverlayKeeper.cardKey({ key: "Escape", cardOpen: true }), "close");
  assert.equal(OverlayKeeper.rovingIndex("ArrowRight", 3, 4), 0);
  assert.equal(OverlayKeeper.rovingIndex("ArrowLeft", 0, 4), 3);
  assert.equal(OverlayKeeper.rovingIndex("End", 0, 2), 1);
  assert.equal(OverlayKeeper.rovingIndex("ArrowDown", 0, 4), -1, "horizontal tabs: Down is not a move");
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /const plate = inPlate\(active\) && !fieldOf\(active\);/, "a field keeps its own Escape");
  assert.match(pet, /if \(act === "card"\) \{\n[\s\S]{0,120}backToCard\(\);/);
  assert.match(pet, /if \(plateTabKey\(e\)\) return;\n\s+if \(act !== "tab" \|\| !cardKeysOn\) return;/);
  const house = read(repo, "desktop/renderer/desk-house.js");
  assert.equal((house.match(/btn\.tabIndex = on \? 0 : -1;/g) || []).length, 2, "weather and news tabs rove");
  const html = read(repo, "desktop/renderer/index.html");
  // Each tab also names its tabpanel now (first-run-hints.test.mjs).
  assert.match(html, /data-weather-tab="current" id="weather-tab-current" role="tab" aria-selected="true" aria-controls="weather-panel" tabindex="0"/);
  assert.match(html, /data-news-tab="x" id="news-tab-x" role="tab" aria-selected="false" aria-controls="news-panel" tabindex="-1"/);
});

test("/meet walkers: one hello group with one tab stop; arrows move between walkers", () => {
  const floor = src("src/components/desk/house-floor.tsx");
  assert.match(floor, /role="group" aria-label="Say hello to the walkers"/);
  assert.match(floor, /tabStop=\{i === stop\}/);
  assert.match(floor, /const next = rovingIndex\(e\.key, hits\.indexOf\(document\.activeElement as HTMLElement\), hits\.length\);/);
  const pet = src("src/components/desk/living-pet.tsx");
  assert.match(pet, /tabStop = true,/, "every other surface keeps its pet in Tab order");
});

test("admin: each row is named by its license id; the revoke ask takes focus, Keep or Escape gives it back", () => {
  const page = src("src/routes/admin.tsx");
  assert.match(page, /aria-labelledby=\{`\$\{ledgerId\}-jti-\$\{i\}`\}/);
  assert.match(page, /<p id=\{`\$\{ledgerId\}-jti-\$\{i\}`\} className="break-all font-mono text-sm text-fg">\n\s+<span className="sr-only">License <\/span>/);
  assert.match(page, /data-revoke-confirm\n/);
  assert.match(page, /data-revoke=\{row\.jti\}/);
  assert.match(page, /const want = revokeAskFocus\(pendingJti, kept\);/);
  assert.match(page, /if \(e\.key !== "Escape"\) return;\n\s+e\.preventDefault\(\);\n\s+keepLicense\(row\.jti\);/);
  assert.match(page, /onClick=\{\(\) => keepLicense\(row\.jti\)\}/);
});

test("hidden tab: the visit holds on shown time, the flyers ride rAF, the p2p relay poll slows", () => {
  const visit = src("src/components/desk/house-visit.tsx");
  assert.match(visit, /return visibleTimeline\(\[/);
  assert.doesNotMatch(visit, /setTimeout/);
  for (const f of ["src/components/desk/bird-fly.tsx", "src/components/desk/robin-fly.tsx"]) {
    const s = src(f);
    assert.match(s, /requestAnimationFrame\(tick\)/);
    assert.match(s, /Math\.min\(0\.08, \(now - last\) \/ 1000\)/);
    assert.doesNotMatch(s, /setInterval/);
  }
  const p2p = src("src/lib/multiplayer/p2p.ts");
  assert.match(p2p, /this\.schedulePoll\(this\.nextDelay\(\)\);\n\s+this\.doc\?\.addEventListener\("visibilitychange", this\.onVisible\);/);
  assert.match(p2p, /this\.doc\?\.removeEventListener\("visibilitychange", this\.onVisible\);/);
  assert.match(p2p, /if \(!this\.doc \|\| this\.doc\.hidden \|\| this\.closed\) return;\n\s+this\.schedulePoll\(0\);/);
});
