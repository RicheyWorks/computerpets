const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const C = require("./choice.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");

function ids(marks) {
  return marks.map((m) => m.id);
}

test("a tap on the overlay guest is a choice, not a talk", () => {
  assert.equal(C.guestTap(), "choice");
  assert.deepEqual(ids(C.guestMarks({ walking: true })), [
    "feed",
    "rest",
    "sit",
    "talk",
    "treat",
    "play",
    "special",
    "hide",
    "close",
    "exit",
  ]);
  assert.deepEqual(ids(C.guestMarks({ hidden: true })), ["talk", "special", "call", "close", "exit"]);
  assert.ok(ids(C.guestMarks({ gifts: 1 })).includes("pick"));
  assert.equal(C.guestPick("play"), "play");
  assert.equal(C.guestPick("bath"), null);

  assert.match(htmlSrc, /choice\.js/);
  assert.match(htmlSrc, /id="choice"[^>]*data-hit/);
  assert.match(cssSrc, /#choice\.show/);
  assert.match(cssSrc, /#choice[\s\S]*overflow-y:\s*auto/);
  assert.match(cssSrc, /#hud[\s\S]*overflow-y:\s*auto/);
  assert.match(cssSrc, /#hud[\s\S]*max-height/);
  assert.match(petSrc, /openChoice/);
  assert.match(petSrc, /pickChoice/);
  const liftStart = petSrc.indexOf('window.addEventListener("pointerup"');
  const liftEnd = petSrc.indexOf('window.addEventListener("pointercancel"');
  const lift = petSrc.slice(liftStart, liftEnd);
  assert.match(lift, /openChoice/);
  assert.doesNotMatch(lift, /handle\("talk"\)/);
});

test("called and visit marks offer talk care and send, not host feed strip", () => {
  assert.deepEqual(ids(C.guestMarks({ role: "called" })), ["talk", "treat", "play", "walk", "send", "close", "exit"]);
  assert.deepEqual(ids(C.guestMarks({ role: "visit", walking: true })), ["talk", "treat", "play", "sit", "send", "close", "exit"]);
  assert.equal(C.guestPick("send"), "send");
  assert.equal(C.guestPick("close"), "close");
  assert.equal(C.guestPick("exit"), "exit");
});

test("Exit and Close dismiss marks are always last and wired in pet.js", () => {
  const open = ids(C.guestMarks({}));
  assert.deepEqual(open.slice(-2), ["close", "exit"]);
  assert.match(petSrc, /picked === "close"/);
  assert.match(petSrc, /picked === "exit"/);
  assert.match(petSrc, /collapseKeeperCard\(\)/);
  assert.match(petSrc, /PetPresence\.classifyKey\(e\)/);
  assert.match(petSrc, /note\.toggle !== "dismiss"/);
  assert.match(petSrc, /closeChoice\(\)/);
  assert.doesNotMatch(petSrc, /e\.key !== "Escape"/);
});
