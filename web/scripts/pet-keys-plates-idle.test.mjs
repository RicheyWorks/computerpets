import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// The pet on the web desk is a keyboard button (Enter or Space taps; the room's opens the sit choice
// with focus in it); the overlay's weather, news, and market plates join the open keeper card's Tab
// cycle; hidden tabs stop the floor walker, the news refresh, and the room's 20s / 5.2s / 1s ticks;
// the keeper clock keeps running but parses the saved card only when it changed; alarm and mute say
// pressed; and the admin page's Details, list name, and focus. The desktop README lists the Keeper card
// item; there is still no global shortcut (ADR 0012).

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const Card = await import(pathToFileURL(join(web, "src/lib/pets/card.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);

test("petTapLabel / isTapKey: the pet's hit area has a name and Enter or Space taps (not a held repeat)", () => {
  assert.equal(K.petTapLabel("Rui", "choice"), "Choose what Rui does");
  assert.equal(K.petTapLabel("Rui", "choice", "Rui"), "Choose what Rui does", "the bare name is not repeated");
  assert.equal(K.petTapLabel("Rui", "choice", "Rui, asleep"), "Choose what Rui does (Rui, asleep)");
  assert.equal(K.petTapLabel("Chirp", "pick", "chosen"), "Pick Chirp (chosen)");
  assert.equal(K.petTapLabel("Wave", "hello"), "Say hello to Wave");
  assert.equal(K.isTapKey("Enter"), true);
  assert.equal(K.isTapKey(" "), true);
  assert.equal(K.isTapKey("Spacebar"), true);
  assert.equal(K.isTapKey("Escape"), false);
  assert.equal(K.isTapKey("Enter", true), false);
});

test("living pet: with onTap and a tapLabel the hit area is a focusable button; Enter/Space tap from the keyboard", () => {
  const pet = src("src/components/desk/living-pet.tsx");
  assert.match(pet, /onTap\?: \(how\?: \{ keys\?: boolean \}\) => void;/);
  assert.match(pet, /role=\{onTap && tapLabel \? "button" : undefined\}/);
  assert.match(pet, /tabIndex=\{onTap && tapLabel \? \(tabStop \? 0 : -1\) : undefined\}/);
  assert.match(pet, /aria-label=\{onTap && tapLabel \? tapLabel : undefined\}/);
  assert.match(pet, /if \(e\.target !== e\.currentTarget \|\| !isTapKey\(e\.key, e\.repeat\)\) return;\n\s+e\.preventDefault\(\);\n\s+tapRef\.current\?\.\(\{ keys: true \}\);/);
  const css = src("src/styles.css");
  assert.match(css, /\[data-pet-hit\]:focus-visible \{\n\s+outline: 2px solid var\(--color-primary\);/);
  // Every host names its pet's tap.
  for (const [rel, want] of [
    ["src/components/desk/companion-room.tsx", 'tapLabel={petTapLabel(displayName, "choice"'],
    ["src/components/desk/blotter-guests.tsx", 'tapLabel={petTapLabel(kind.name, "pick"'],
    ["src/components/desk/hive-den.tsx", 'tapLabel={petTapLabel(kind.name, "pick"'],
    ["src/components/desk/house-visit.tsx", 'tapLabel={petTapLabel(guest.name, "hello")}'],
    ["src/components/desk/house-floor.tsx", 'tapLabel={petTapLabel(kind.name, "hello")}'],
  ]) {
    assert.ok(src(rel).includes(want), `${rel} names the tap`);
  }
});

test("companion room: a keyboard tap opens the sit choice with focus in it, and closing it hands focus back to the pet", () => {
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /onTap=\{\(how\) => \{[\s\S]{0,260}choiceByKeys\.current = !!how\?\.keys;\n\s+setChoiceOpen\(\(open\) => !open\);/);
  assert.match(room, /if \(choiceOpen\) \{\n\s+room\?\.querySelector<HTMLElement>\("\[data-guest-choice\] button"\)\?\.focus\(\);/);
  assert.match(room, /choiceByKeys\.current = false;\n\s+room\?\.querySelector<HTMLElement>\("\[data-pet-hit\]"\)\?\.focus\(\);/);
  assert.match(room, /<section\n\s+ref=\{roomRef\}/);
});

test("hidden tab: floor walker, news refresh, and the room's 20s / 5.2s / 1s intervals stop and resume", () => {
  const floor = src("src/components/desk/house-floor.tsx");
  assert.match(floor, /const stop = everyVisible\(\(\) => \{/);
  assert.doesNotMatch(floor, /window\.setInterval/);
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /return everyVisible\(age, 20_000, \{ onResume: true \}\);/);
  assert.match(room, /return everyVisible\(\(\) => \{\n\s+if \(busy \|\| statsRef\.current\.hidden \|\| deskOff\) return;/);
  assert.match(room, /if \(deskOff\) return;\n[^\n]*\n\s+return everyVisible\(\(\) => \{\n\s+const sky = skyNow\(\);/);
  assert.doesNotMatch(room, /window\.setInterval/, "every room interval pauses while hidden");
  const plates = src("src/components/desk/desk-plates.tsx");
  assert.match(plates, /const NEWS_REFRESH_MS = 20 \* 60 \* 1000;/);
  assert.match(plates, /if \(isStale\(newsReadAt\.current, Date\.now\(\), NEWS_STALE_MS\)\) void load\(\);/);
  assert.match(plates, /NEWS_REFRESH_MS,\n\s+\{ onResume: true \},/);
  assert.match(plates, /if \(!newsMaySend\(prefs, shown\)\) return;\n\s+newsReadAt\.current = Date\.now\(\);/);
  assert.doesNotMatch(plates, /20 \* 60 \* 1000\);/);
});

test("isStale: the news plate reads on return only when the last read is old enough", () => {
  assert.equal(K.isStale(null, 1000, 500), true, "never read");
  assert.equal(K.isStale(1000, 1400, 500), false);
  assert.equal(K.isStale(1000, 1500, 500), true);
});

test("createCardTickReader: a still card is parsed once; a changed card (any tab) is parsed again", () => {
  let raw = '{"color":"ink"}';
  let loads = 0;
  const readTick = Card.createCardTickReader({ getRaw: () => raw, load: () => ({ n: ++loads }) });
  const first = readTick();
  assert.equal(readTick(), first);
  assert.equal(readTick(), first);
  assert.equal(loads, 1);
  raw = '{"color":"moss"}';
  assert.notEqual(readTick(), first);
  assert.equal(loads, 2);
  raw = null;
  readTick();
  assert.equal(loads, 3, "a cleared card is read again");
  let boom = 0;
  const broken = Card.createCardTickReader({ getRaw: () => { throw new Error("storage"); }, load: () => ({ n: ++boom }) });
  broken();
  broken();
  assert.equal(boom, 2, "unreadable storage falls back to a full read");
  // In node there is no window: the default reader answers a blank card.
  assert.deepEqual(Card.createCardTickReader()(), Card.blankCard());
});

test("keeper card: the clock keeps its plain 1s interval (runs while hidden) but reads through the tick reader", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  assert.match(card, /const readCardForTick = createCardTickReader\(\);/);
  const clock = card.slice(card.indexOf("let since = Date.now();"), card.indexOf("let since = Date.now();") + 700);
  assert.match(clock, /const live = readCardForTick\(\);/);
  assert.match(clock, /window\.setInterval\(\(\) => \{/);
  assert.doesNotMatch(clock, /loadCard\(\)|everyVisible|document\.hidden/);
});

test("alarm and mute toggles say pressed on web and the overlay, and keep their changing words", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  assert.match(card, /aria-label=\{guest\.alarm\.on \? "Alarm on" : "Alarm off"\}\n\s+aria-pressed=\{guest\.alarm\.on\}/);
  assert.match(card, /\{guest\.alarm\.on \? "On" : "Off"\}/);
  assert.match(card, /aria-pressed=\{!!card\.mutes\[bus\]\}/);
  assert.match(card, /\{card\.mutes\[bus\] \? `Muted \$\{bus\}` : `Mute \$\{bus\}`\}/);
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /hudAlarmOn\.setAttribute\("aria-pressed", guest\.alarm\.on \? "true" : "false"\);/);
  assert.match(pet, /btn\.setAttribute\("aria-pressed", card\.mutes\[bus\] \? "true" : "false"\);/);
  const html = read(repo, "desktop/renderer/index.html");
  assert.match(html, /id="hud-alarm-on"[^>]*aria-label="Alarm off" aria-pressed="false">Off<\/button>/);
});

test("admin: Details is a real toggle, the list has a name, focus follows lock and unlock", () => {
  assert.equal(B.ledgerCaption(0), "Licenses: none shown");
  assert.equal(B.ledgerCaption(1), "Licenses: 1 shown");
  assert.equal(B.ledgerCaption(4), "Licenses: 4 shown");
  assert.equal(B.focusAfterGate(true), "search");
  assert.equal(B.focusAfterGate(false), "key");
  const page = src("src/routes/admin.tsx");
  assert.match(page, /aria-expanded=\{open\}\n\s+aria-controls=\{detailId\}/);
  assert.match(page, /<p id=\{detailId\} hidden=\{!open\}/);
  assert.match(page, /useEffect\(\(\) => setOpen\(false\), \[detail\]\);/);
  // The status line also takes focus after a confirmed revoke (first-run-hints.test.mjs).
  assert.match(page, /<div className="space-y-1" role="status"[ >]/);
  assert.match(page, /<h2 id=\{ledgerId\} className="sr-only">\n\s+\{ledgerCaption\(rows\.length\)\}/);
  assert.match(page, /<ul className="space-y-3" aria-labelledby=\{ledgerId\} ref=\{ledgerList\}>/);
  assert.match(page, /\(focusAfterGate\(unlocked\) === "search" \? searchInput : keyInput\)\.current\?\.focus\(\);/);
  assert.match(page, /showError\(err, ADMIN_FALLBACK\.unlock\);\r?\n\s+keyInput\.current\?\.focus\(\);/);
  assert.match(page, /ref=\{keyInput\}\n\s+type="password"/);
  assert.match(page, /ref=\{searchInput\}/);
});

test("overlay: the open card's Tab cycle takes in the plates on the glass; a repaint keeps focus on the rebuilt button", () => {
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /const KEY_PLATE_IDS = \["weather-plate", "news-plate", "market-plate"\];/);
  assert.ok(pet.indexOf("const KEY_PLATE_IDS") < pet.indexOf("function paintCard"), "declared before any paint");
  assert.ok(pet.indexOf("const REBUILT_KEYS") < pet.indexOf("function paintCard"), "declared before any paint");
  // An open choice menu is one stop ahead of the card (first-run-hints.test.mjs); the plates still follow it.
  assert.match(pet, /function cardFocusables\(\) \{\n\s+if \(!hud \|\| card\.collapsed\) return \[\];\n(?:\s+\/\/[^\n]*\n)?\s+const out = choiceOpen && choiceEl \? focusablesIn\(choiceEl\) : \[\];\n\s+out\.push\(\.\.\.hudFocusables\(\)\);\n\s+for \(const plate of keyPlates\(\)\) out\.push\(\.\.\.focusablesIn\(plate\)\);/);
  assert.match(pet, /if \(act !== "tab" \|\| !cardKeysOn\) return;\n\s+const list = cardFocusables\(\);/);
  assert.match(pet, /if \(inCardOrPlate\(active\) && typeof active\.blur === "function"\) active\.blur\(\);/);
  assert.match(pet, /for \(const id of KEY_PLATE_IDS\) \{[\s\S]{0,200}if \(!card\.collapsed\) cardKeys\(true\);/);
  assert.match(pet, /if \(!hud \|\| !C\) return;\n\s+const refocus = rebuiltFocus\(\);/);
  assert.match(pet, /fillCallLists\(\);\n\s+refocusRebuilt\(refocus\);\n\}/);
  // Click-through stays with hits: the keyboard path never calls setClickable.
  const keys = pet.slice(pet.indexOf("function cardKeys"), pet.indexOf("function cardKeys") + 900);
  assert.doesNotMatch(keys, /setClickable/);
  const css = read(repo, "desktop/renderer/styles.css");
  assert.match(css, /\.desk-plate button:focus-visible,[\s\S]{0,160}outline: 2px solid #d8cfc0;/);
});

test("desktop README lists the Keeper card item; main still registers no global shortcut (ADR 0012)", () => {
  const readme = read(repo, "desktop/README.md");
  assert.match(readme, /The tray and the pet menu have \*\*Keeper card\*\*: it shows the overlay and opens the card with the keyboard on it/);
  assert.match(readme, /Tab and Shift\+Tab walk its buttons and then the weather, news, and market plates/);
  assert.match(readme, /There is no global shortcut/);
  const main = read(repo, "desktop/main.cjs");
  assert.doesNotMatch(main, /globalShortcut|before-input-event|SetWindowsHook/);
  assert.match(main, /\{ label: "Keeper card", click: \(\) => openKeeperCardFromMenu\(\) \}/);
});
