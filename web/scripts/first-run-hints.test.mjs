import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// First run for a brand-new keeper: the heartbeat says "House server not running (optional)" until the
// server has answered once (DOWN only after it answered and stopped), a one-time hello on the web room and
// the overlay keeper card (kid-plain, keyboard and screen-reader friendly, gone for good after Got it),
// plates on a clean profile end in a next step instead of a dead end, p2p is honestly dormant, and the
// a11y leftovers: the overlay choice menu keys match the web, plate tabs name their tabpanel, and a
// confirmed revoke moves focus to the status line.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const desk = (rel) => read(repo, join("desktop", rel));
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const F = await import(pathToFileURL(join(web, "src/lib/pets/first-run.ts")).href);
const WA = await import(pathToFileURL(join(web, "src/lib/pets/weather-areas.ts")).href);
const M = await import(pathToFileURL(join(web, "src/lib/pets/market.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const req = createRequire(import.meta.url);
const OK = req(join(repo, "desktop/renderer/keeper.js"));
const Choice = req(join(repo, "desktop/renderer/choice.js"));
const DeskCard = req(join(repo, "desktop/renderer/card.js"));
const DeskAreas = req(join(repo, "desktop/renderer/weather-areas.js"));
const DeskMarket = req(join(repo, "desktop/renderer/market.js"));

function memoryStore() {
  const map = new Map();
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

test("heartbeat: never answered reads 'not running (optional)'; DOWN only after it answered and stopped", async () => {
  assert.equal(K.NO_HOUSE_SERVER, "House server not running (optional)");
  let up = false;
  const poll = K.createHeartbeatPoll({
    url: "http://127.0.0.1:1/api/public/heartbeat",
    doc: null,
    setIntervalImpl: () => 1,
    clearIntervalImpl: () => {},
    fetchImpl: async () => {
      if (!up) throw new TypeError("fetch failed");
      return { json: async () => ({ status: "UP", profile: "local", uptimeSeconds: 61, port: 8081 }) };
    },
  });
  assert.equal(poll.answered(), false);
  assert.equal(K.heartbeatLine(poll.current(), poll.answered()), "House server not running (optional)");
  await poll.read();
  assert.equal(poll.answered(), false, "a failed read is not an answer");
  assert.equal(K.heartbeatLine(poll.current(), poll.answered()), "House server not running (optional)");
  up = true;
  await poll.read();
  assert.equal(poll.answered(), true);
  assert.equal(K.heartbeatLine(poll.current(), poll.answered()), "Java 8081 · UP · local · 1m");
  up = false;
  await poll.read();
  assert.equal(poll.answered(), true, "it answered once this session");
  assert.equal(K.heartbeatLine(poll.current(), poll.answered()), "Java 8081 · DOWN · unread · unread");
  // The default (answered) keeps the old line for callers that pass one beat.
  assert.equal(K.heartbeatLine(K.UNREAD_HEARTBEAT), "Java 8081 · DOWN · unread · unread");
  const card = src("src/components/desk/keeper-card.tsx");
  assert.equal(card.match(/heartbeatLine\(beat, heartbeatPoll\.answered\(\)\)/g)?.length, 2);
  assert.doesNotMatch(card, /heartbeatLine\(beat\)/);
});

test("overlay house server row: 'not running (optional)' until it answered; 'unreachable' after", () => {
  assert.equal(OK.NO_HOUSE_SERVER, K.NO_HOUSE_SERVER);
  assert.equal(OK.houseServerLine({ show: false, seen: false }), "", "no server named: the row stays hidden");
  assert.equal(OK.houseServerLine({ show: true, reachable: false, seen: false }), "House server not running (optional)");
  assert.equal(OK.houseServerLine({ show: true, reachable: true, seen: true, uptimeSeconds: 90 }), "House server · reachable · up 1m");
  assert.equal(OK.houseServerLine({ show: true, reachable: false, seen: true }), "House server · unreachable");
  assert.doesNotMatch(OK.houseServerLine({ show: true, reachable: false, seen: false }), /DOWN|Java|unread/);
  const pet = desk("renderer/pet.js");
  assert.match(pet, /if \(houseServer\.show && houseServer\.reachable === true\) houseServerSeenHost = houseServer\.host \|\| "";/);
  assert.match(pet, /K\.houseServerLine\(\{ \.\.\.houseServer, seen \}\)/);
  assert.match(pet, /houseServer\.reachable === true \? "UP" : seen \? "DOWN" : "OFF"/);
});

test("web first hint: kid-plain words, shown until Got it, then never again", () => {
  const hint = F.firstHintWeb("Rui");
  assert.deepEqual(hint, {
    title: "Hi! This is Rui.",
    lines: [
      "Tap Rui to open the keeper card and pick something to do together.",
      "The keeper card shows if Rui is hungry, sleepy, or happy.",
      "Press Feed, Play, or Rest to take care of Rui.",
    ],
    ok: "Got it",
  });
  assert.equal(F.firstHintWeb("").title, "Hi! This is Your pet.");
  const store = memoryStore();
  assert.equal(F.firstHintSeen(store), false, "a clean browser shows the hint");
  assert.equal(F.firstHintSeen(store), false, "reading does not mark it");
  F.markFirstHintSeen(store);
  assert.equal(store.map.get(F.FIRST_HINT_STORE), "1");
  assert.equal(F.firstHintSeen(store), true, "after Got it it never shows again");
  assert.equal(F.firstHintSeen(null), true, "no storage (server render): nothing flashes");
  const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.equal(F.firstHintSeen(broken), false);
  assert.doesNotThrow(() => F.markFirstHintSeen(broken));
  // Its own key, never the card: an older card write cannot bring it back.
  assert.equal(F.FIRST_HINT_STORE, "computerpets.first-hint.v1");
  assert.doesNotMatch(src("src/lib/pets/card.ts"), /firstHint/);
});

test("web first hint component: a named region, one Got it button, focus lands on the card button", () => {
  const view = src("src/components/desk/first-hint.tsx");
  assert.match(view, /aria-labelledby=\{`\$\{id\}-title`\}/);
  assert.match(view, /<h2 id=\{`\$\{id\}-title`\}/);
  assert.match(view, /<button\n\s+type="button"\n\s+data-first-hint-ok/);
  assert.match(view, /markFirstHintSeen\(\);\n\s+setShow\(false\);\n\s+onDone\?\.\(\);/);
  assert.match(view, /useEffect\(\(\) => setShow\(!firstHintSeen\(\)\), \[\]\);/);
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /<FirstHint\n\s+name=\{displayName\}/);
  assert.match(room, /querySelector<HTMLElement>\('\[data-card="open"\], \[data-card="collapse"\]'\)\?\.focus\(\);/);
});

test("overlay first hint: same words as the web lockstep, card.json firstHintSeen, inside the card's Tab cycle", () => {
  const hint = OK.firstHint("Rui");
  assert.deepEqual(hint, F.firstHintOverlay("Rui"));
  assert.deepEqual(hint, {
    title: "Hi! Rui lives on your screen now.",
    lines: [
      "This is Rui's keeper card. It shows if Rui is hungry, sleepy, or happy. Press Feed, Play, or Rest to help.",
      "Click Rui any time to open this card again. Right-click Rui for more things to do.",
      "Near the clock there is a tiny ComputerPets picture. That is the tray icon. Right-click it to pick a new friend, or pick Quit to turn the pets off.",
    ],
    ok: "Got it",
  });
  assert.equal(DeskCard.blankCard().firstHintSeen, false);
  assert.equal(DeskCard.parseCard(null).firstHintSeen, false);
  assert.equal(DeskCard.parseCard({ firstHintSeen: true }).firstHintSeen, true);
  assert.equal(DeskCard.parseCard({ firstHintSeen: "yes" }).firstHintSeen, false);
  assert.equal(OK.firstHintShows(DeskCard.parseCard(null)), true);
  assert.equal(OK.firstHintShows(DeskCard.parseCard({ firstHintSeen: true })), false);
  const html = desk("renderer/index.html");
  assert.match(html, /<section id="first-hint" class="first-hint" data-hit data-first-hint aria-labelledby="first-hint-title" hidden>\n\s+<h3 id="first-hint-title" class="first-hint-title"><\/h3>\n\s+<ul id="first-hint-lines" class="first-hint-lines"><\/ul>\n\s+<button type="button" id="first-hint-ok" data-hit>Got it<\/button>/);
  assert.ok(html.indexOf('id="first-hint"') > html.indexOf('id="hud-collapse"') && html.indexOf('id="first-hint"') < html.indexOf('id="hud-body"'));
  const pet = desk("renderer/pet.js");
  assert.match(pet, /card\.firstHintSeen = true;\n\s+persistCard\(\);/);
  assert.match(pet, /if \(hadFocus && hudCollapse\) hudCollapse\.focus\(\);/);
  assert.match(pet, /closest\("\[data-care\], \[data-card\], \[data-first-hint\], input, button, label"\)/);
  const css = desk("renderer/styles.css");
  assert.match(css, /#hud\[data-collapsed="1"\] \.first-hint \{\n\s+display: none;/);
  // main's card.json default for a new keeper opens the card, so the hello is seen on the first start.
  assert.match(desk("main.cjs"), /if \(!file\) return \{ collapsed: false,/);
});

test("clean-profile plates: a weather next step, and a closed Quotes plate says how to see prices", () => {
  assert.equal(WA.NO_AREA_NEXT, "No place yet. Type a city below and press Look up.");
  assert.equal(DeskAreas.NO_AREA_NEXT, WA.NO_AREA_NEXT);
  assert.equal(WA.NO_AREA, "no area set", "the header chip stays short");
  assert.equal(M.QUOTE_WAITS, "open to see the price");
  assert.equal(DeskMarket.QUOTE_WAITS, M.QUOTE_WAITS);
  const house = M.parseMarket(undefined);
  const symbol = M.currentTicker(house).symbol;
  assert.equal(M.plateLine(house, null, false, true), `${symbol} · open to see the price`);
  assert.equal(M.plateLine(house, null, false, false), `${symbol} · looking up`);
  assert.equal(DeskMarket.plateLine(DeskMarket.parseMarket(undefined), null, false, true), `${DeskMarket.currentTicker(DeskMarket.parseMarket(undefined)).symbol} · open to see the price`);
  assert.equal(M.plateLine(house, null, true, true), `${symbol} · can't reach`, "a failed read still says so");
  const plates = src("src/components/desk/desk-plates.tsx");
  assert.match(plates, /\{!area \? <p className="text-subtle">\{NO_AREA_NEXT\}<\/p> : null\}/);
  assert.match(plates, /marketLine\(house, live, unread, !open\)/);
  const house2 = desk("renderer/desk-house.js");
  assert.match(house2, /liveBits\.push\(para\(A\.NO_AREA_NEXT \|\| A\.NO_AREA\)\)/);
  assert.match(house2, /line\.textContent = M\.plateLine\(house, live, unread, closed\);/);
});

test("p2p is honestly dormant: no dead file references, nothing constructs or imports it, ROADMAP says future", () => {
  const p2p = src("src/lib/multiplayer/p2p.ts");
  assert.match(p2p, /^\/\*\*\n \* DORMANT\. Nothing in the app constructs a P2PRoom/);
  assert.doesNotMatch(p2p, /signaling\.server\.ts|multiplayer-p2p skill/);
  assert.match(src("src/lib/multiplayer/index.ts"), /^\/\/ Dormant:/);
  const roadmap = read(repo, "docs/ROADMAP.md");
  assert.match(roadmap, /Multiplayer \(future, dormant\)/);
});

test("overlay choice menu keys match the web sit menu", () => {
  const cases = [
    ["ArrowRight", 0, 5], ["ArrowDown", 4, 5], ["ArrowLeft", 0, 5], ["ArrowUp", 2, 5], ["Home", 3, 5],
    ["End", 1, 5], ["Escape", 1, 5], ["Esc", 0, 5], ["a", 1, 5], ["Enter", 0, 5], ["ArrowDown", -1, 5], ["ArrowDown", 0, 0],
  ];
  for (const [key, at, count] of cases) {
    assert.deepEqual(Choice.menuKey(key, at, count), K.menuKey(key, at, count), `${key} ${at}/${count}`);
  }
  assert.equal(Choice.MENU_LABEL, "A sit");
  assert.match(src("src/components/desk/guest-choice.tsx"), /aria-label="A sit"/);
  const html = desk("renderer/index.html");
  assert.match(html, /<div id="choice" data-hit role="menu" aria-label="A sit" aria-orientation="vertical"><\/div>/);
  const pet = desk("renderer/pet.js");
  assert.match(pet, /btn\.setAttribute\("role", "menuitem"\);\n\s+btn\.tabIndex = i === 0 \? 0 : -1;/);
  assert.match(pet, /const act = P\.menuKey\(e\.key, items\.indexOf\(document\.activeElement\), items\.length\);/);
  assert.match(pet, /const inMenu = !!\(choiceEl && choiceEl\.contains\(document\.activeElement\)\);\n\s+closeChoice\(\);\n\s+if \(inMenu\) returnChoiceFocus\(\);/);
  assert.match(pet, /const out = choiceOpen && choiceEl \? focusablesIn\(choiceEl\) : \[\];/);
  // The first document keydown in pet.js is still the menu's dismiss (it classifies the key first).
  const first = pet.indexOf('document.addEventListener("keydown"');
  assert.ok(pet.indexOf("classifyKey(e)", first) < pet.indexOf("e.key", first));
});

test("plate tabs name their tabpanel (overlay and web)", () => {
  const html = desk("renderer/index.html");
  for (const tab of ["current", "favorites"]) {
    assert.match(html, new RegExp(`data-weather-tab="${tab}" id="weather-tab-${tab}" role="tab" aria-selected="(true|false)" aria-controls="weather-panel"`));
  }
  for (const tab of ["popular", "topics", "x", "favorites"]) {
    assert.match(html, new RegExp(`data-news-tab="${tab}" id="news-tab-${tab}" role="tab" aria-selected="(true|false)" aria-controls="news-panel"`));
  }
  assert.match(html, /<div id="weather-panel" role="tabpanel" aria-labelledby="weather-tab-current">\n\s+<div id="weather-live"><\/div>/);
  assert.match(html, /<div id="news-panel" role="tabpanel" aria-labelledby="news-tab-popular">\n\s+<div id="news-live"><\/div>/);
  const house = desk("renderer/desk-house.js");
  assert.match(house, /weatherPanel\.setAttribute\("aria-labelledby", `weather-tab-\$\{tab\}`\)/);
  assert.match(house, /newsPanel\.setAttribute\("aria-labelledby", `news-tab-\$\{tab\}`\)/);
  const plates = src("src/components/desk/desk-plates.tsx");
  assert.equal(plates.match(/aria-controls=\{`\$\{problemId\}-panel`\}/g)?.length, 2);
  assert.equal(plates.match(/<div id=\{`\$\{problemId\}-panel`\} role="tabpanel" aria-labelledby=\{`\$\{problemId\}-tab-\$\{tab\}`\}>/g)?.length, 2);
});

test("admin: after a confirmed revoke focus moves to the status line", () => {
  assert.equal(B.revokeDoneFocus("revoked"), "status");
  assert.equal(B.revokeDoneFocus("stale"), "status");
  assert.equal(B.revokeDoneFocus("locked"), null);
  assert.equal(B.revokeDoneFocus("failed"), null);
  const page = src("src/routes/admin.tsx");
  assert.match(page, /statusFocus\.current = revokeDoneFocus\("revoked"\) === "status";\n\s+setNote\(REVOKED_NOTE\);/);
  assert.match(page, /statusFocus\.current = revokeDoneFocus\("stale"\) === "status";\n\s+setNote\(revokedListStale/);
  assert.match(page, /if \(!statusFocus\.current \|\| !note\) return;\n\s+statusFocus\.current = false;\n\s+statusLine\.current\?\.focus\(\);/);
  assert.match(page, /role="status" ref=\{statusRef\} tabIndex=\{statusRef \? -1 : undefined\}/);
  assert.match(page, /<Note note=\{note\} detail=\{detail\} statusRef=\{statusLine\} \/>/);
});

test("docs describe the first run, and there is still no global shortcut", () => {
  const start = read(repo, "docs/START-HERE.md");
  assert.match(start, /House server not running \(optional\)/);
  assert.match(start, /Got it/);
  assert.doesNotMatch(desk("main.cjs"), /globalShortcut/);
});
