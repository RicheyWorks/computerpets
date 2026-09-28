// The keeper card's rules on the overlay, from the first-run drive (PR after #1555): opening the card or a window
// play never strands a walk the keeper asked for; the card stays up through a care walk and holds still; a click on
// the pet hands the card the keyboard so Escape reaches it; the card stands off the house plates; the House window's
// address follows Unlock; rain falls the height of the glass.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const K = require("./keeper.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "settings.html"), "utf8");

test("opening the card stops a wander, not a walk the keeper asked for", () => {
  for (const cmd of ["seek", "leave", "enter", "eat", "play"]) assert.equal(K.cardStopsWalk(cmd), false, cmd);
  for (const cmd of ["wander", "idle", "none", undefined, null, ""]) assert.equal(K.cardStopsWalk(cmd), true, String(cmd));
  // openKeeperCard cleared sim.target for every walk: Feed, then the card on the way, left the pet at x=164 short
  // of its food at 1225 for good (hunger held at 78). The clearing is gated now.
  const open = petSrc.slice(petSrc.indexOf("function openKeeperCard()"), petSrc.indexOf("function resumeOrderWalk()"));
  assert.match(open, /const stopWalk = window\.PetKeeper\?\.cardStopsWalk \? window\.PetKeeper\.cardStopsWalk\(sim\.cmd\) : true;\n\s+if \(stopWalk\) \{\n\s+sim\.target = null;/);
  assert.match(open, /if \(stopWalk && sim\.anim === "walk" && !life\?\.asleep\) sim\.anim = "idle";/);
  assert.doesNotMatch(open.replace(/if \(stopWalk\) \{[\s\S]*?\n {2}\}/, ""), /sim\.target = null;/, "no ungated target clear");
});

test("a walk the keeper asked for picks up again when play lets go of the pet", () => {
  assert.equal(K.orderWalkResumes({ cmd: "seek", target: 1054, asleep: false }), true);
  assert.equal(K.orderWalkResumes({ cmd: "leave", target: 0, asleep: false }), true);
  assert.equal(K.orderWalkResumes({ cmd: "seek", target: null, asleep: false }), false);
  assert.equal(K.orderWalkResumes({ cmd: "seek", target: 1054, asleep: true }), false);
  assert.equal(K.orderWalkResumes({ cmd: "wander", target: 600, asleep: false }), false);
  // Feed during a window play: the play's end set the pet idle with the food its target (x=127, target 1054, for
  // good, card closed too). Each end of a play, trick, and happy moment resumes the walk now.
  assert.match(petSrc, /function resumeOrderWalk\(\) \{\n\s+const K = window\.PetKeeper;\n\s+if \(!K\?\.orderWalkResumes \|\| !K\.orderWalkResumes\(\{ cmd: sim\.cmd, target: sim\.target, asleep: !!life\?\.asleep \}\)\) return;\n\s+aimAt\(sim\.target\);/);
  assert.match(petSrc, /sim\.happy = null;\n\s+sim\.land = 1;\n\s+sim\.anim = [^\n]+\n\s+resumeOrderWalk\(\);/);
  assert.match(petSrc, /sim\.playWait = window\.PetWindowPlay\.nextPlayWait\(true\);\n\s+resumeOrderWalk\(\);/);
  assert.match(petSrc, /sim\.trickWait = T\.nextTrickWait\(true, undefined, sim\.lastTrick\);\n\s+resumeOrderWalk\(\);/);
  assert.match(petSrc, /if \(!stopWalk && !sim\.play && !sim\.trick && !sim\.happy && sim\.anim !== "walk" && !\(sim\.turnHold > 0\)\) resumeOrderWalk\(\);/);
});

test("the card stays up through a walk while the hello is unread and for a while after a press on it", () => {
  assert.equal(K.CARD_PRESS_HOLD_MS, 8000);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: true, sinceLastPress: Infinity }), false);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: true, sinceLastPress: 60_000 }), false);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: 1200 }), false);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: 7999 }), false);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: 8000 }), true);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: Infinity }), true);
  assert.equal(K.cardFoldsOnWalk({ helloUnread: false, sinceLastPress: 500, hold: 300 }), true);
  // It folded on the first step of any walk: the card's own Feed folded it under the pointer, hello and all.
  assert.match(petSrc, /if \(cardOpen\(\) && sim\.anim === "walk" && !sim\.dragging && cardFoldsNow\(\)\) \{\n\s+collapseKeeperCard\(\);/);
  assert.match(petSrc, /function cardFoldsNow\(\) \{[\s\S]{0,400}K\.cardFoldsOnWalk\(\{[\s\S]{0,200}performance\.now\(\) - lastCardPress/);
  assert.match(petSrc, /hud\.addEventListener\("click", \(\) => \{\n\s+lastCardPress = performance\.now\(\);\n\s+\}, true\);/);
});

test("the open card holds still while the pet walks, and goes back to the pet when it stands", () => {
  const a = K.cardHeldSpot({ open: true, walking: true, held: null, x: 400, lift: 3 });
  assert.deepEqual(a, { x: 400, lift: 3, held: { x: 400, lift: 3 } });
  const b = K.cardHeldSpot({ open: true, walking: true, held: a.held, x: 612, lift: 7 });
  assert.deepEqual([b.x, b.lift], [400, 3]);
  assert.deepEqual(K.cardHeldSpot({ open: true, walking: false, held: b.held, x: 650, lift: 0 }), { x: 650, lift: 0, held: null });
  assert.deepEqual(K.cardHeldSpot({ open: false, walking: true, held: b.held, x: 650, lift: 5 }), { x: 650, lift: 5, held: null });
  assert.match(petSrc, /window\.PetKeeper\.cardHeldSpot\(\{\n\s+open: !!hudW,\n\s+walking: sim\.anim === "walk" && !sim\.dragging,\n\s+held: cardHeld,\n\s+x: cardX,\n\s+lift,/);
  assert.match(petSrc, /hud\.style\.transform = `translate3d\(\$\{cardX\}px, \$\{-cardLiftPx\}px, 0\)`;/);
});

test("the open card stands off the house plates", () => {
  // The real first-run numbers: card 177..491 (314 wide) over the weather plate 102..392 x 111..150 and the Quotes
  // plate at 529..568; now it stands at the weather plate's right side plus the gap.
  const plates = [
    { left: 102, top: 111, right: 392, bottom: 150 },
    { left: 102, top: 529, right: 392, bottom: 568 },
    { left: 102, top: 320, right: 392, bottom: 359 },
  ];
  assert.equal(K.cardClearOfPlates({ x: 177, w: 314, top: 18, bottom: 1214, plates, width: 2560 }), 400);
  assert.equal(K.cardClearOfPlates({ x: 900, w: 314, top: 18, bottom: 1214, plates, width: 2560 }), 900, "clear stays");
  assert.equal(K.cardClearOfPlates({ x: 177, w: 314, top: 600, bottom: 1214, plates, width: 2560 }), 177, "plates above the card do not count");
  assert.equal(K.cardClearOfPlates({ x: 8, w: 314, top: 0, bottom: 900, plates: [{ left: 0, top: 10, right: 330, bottom: 60 }], width: 340 }), 8, "no room: stays");
  assert.equal(K.cardClearOfPlates({ x: 2000, w: 314, top: 0, bottom: 900, plates: [{ left: 1900, top: 10, right: 2552, bottom: 60 }], width: 2560 }), 1578, "left side when the right is off screen");
  assert.match(petSrc, /cardX = window\.PetKeeper\.cardClearOfPlates\(\{ x: cardX, w: hudW, top: cardBottom - \(hud\.offsetHeight \|\| 0\), bottom: cardBottom, plates: plateBoxes\(\), width \}\);/);
});

test("a click on the pet hands the card the keyboard, so Escape reaches it", () => {
  // The menu's Keeper card did; a click on the pet opened the card and left the window unfocusable, so a real
  // Escape went to whatever app had the keyboard.
  assert.match(petSrc, /if \(lift\.kind === "tap"\) \{\n\s+openKeeperCard\(\);\n(\s+\/\/[^\n]*\n)*\s+cardKeys\(true\);/);
  assert.equal(K.cardKey({ key: "Escape", cardOpen: true, menuOpen: false, inPlate: false }), "close");
  assert.equal(K.cardKey({ key: "Escape", cardOpen: true, menuOpen: true, inPlate: false }), "none", "the menu closes first");
  assert.equal(K.cardKey({ key: "Escape", cardOpen: false, menuOpen: false, inPlate: false }), "none", "a closed card takes nothing");
  assert.doesNotMatch(petSrc, /globalShortcut/);
});

test("rain falls the height of the glass (it was faint still lines at the top)", () => {
  const rule = styleSrc.slice(styleSrc.indexOf(".wx-rain {"), styleSrc.indexOf("}", styleSrc.indexOf(".wx-rain {")));
  assert.match(rule, /height: \d+vh;/);
  assert.match(rule, /top: -\d+vh;/);
  const frames = styleSrc.slice(styleSrc.indexOf("@keyframes wx-rain"), styleSrc.indexOf("@keyframes wx-gust"));
  const fall = /100% \{ transform: translate3d\(\d+px, (\d+)vh, 0\)/.exec(frames);
  assert.ok(fall && Number(fall[1]) >= 100, "the streak's fall is in screen heights, past the bottom");
  assert.doesNotMatch(frames, /130%/, "a % fall is of the 18% streak itself: it crossed the top fifth only");
});

test("the House window's address follows the section, so a reload returns to it", () => {
  const start = settingsSrc.indexOf("function showSection(section)");
  const end = settingsSrc.indexOf("showSection(String(", start);
  const fn = settingsSrc.slice(start, end);
  const run = (startHash, section) => {
    const seen = { hash: startHash, scrolled: null, pushed: 0 };
    const location = { get hash() { return seen.hash; } };
    const history = {
      state: { k: 1 },
      replaceState(state, _t, url) {
        assert.deepEqual(state, { k: 1 });
        seen.hash = url;
        seen.pushed += 1;
      },
    };
    const document = { getElementById: (id) => ({ scrollIntoView: () => { seen.scrolled = id; } }) };
    const ctx = vm.createContext({ window: { history, location }, document });
    vm.runInContext(`${fn}\nshowSection(${JSON.stringify(section)});`, ctx);
    return seen;
  };
  // "Unlock…" from the menu with the window opened at #minds scrolled but kept #minds: a reload went to Minds.
  assert.deepEqual(run("#minds", "unlock"), { hash: "#unlock", scrolled: "unlockSection", pushed: 1 });
  assert.deepEqual(run("#unlock", "minds"), { hash: "#minds", scrolled: "mindsSection", pushed: 1 });
  assert.deepEqual(run("#unlock", "unlock"), { hash: "#unlock", scrolled: "unlockSection", pushed: 0 });
  assert.deepEqual(run("", "anything"), { hash: "#minds", scrolled: "mindsSection", pushed: 1 });
  // replaceState, not location.hash: a button in the page has id="unlock", and a hash jump would scroll to it.
  assert.match(settingsSrc, /id="unlock"/);
  assert.doesNotMatch(fn, /location\.hash\s*=/);
});
