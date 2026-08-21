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
    "rest",
    "sit",
    "talk",
    "treat",
    "play",
    "special",
    "hide",
  ]);
  assert.deepEqual(ids(C.guestMarks({ hidden: true })), ["talk", "special", "call"]);
  assert.ok(ids(C.guestMarks({ gifts: 1 })).includes("pick"));
  assert.equal(C.guestPick("play"), "play");
  assert.equal(C.guestPick("bath"), null);

  assert.match(htmlSrc, /choice\.js/);
  assert.match(htmlSrc, /id="choice"/);
  assert.match(cssSrc, /#choice\.show/);
  assert.match(petSrc, /openChoice/);
  assert.match(petSrc, /pickChoice/);
  const liftStart = petSrc.indexOf('window.addEventListener("pointerup"');
  const liftEnd = petSrc.indexOf('window.addEventListener("pointercancel"');
  const lift = petSrc.slice(liftStart, liftEnd);
  assert.match(lift, /openChoice/);
  assert.doesNotMatch(lift, /handle\("talk"\)/);
});
