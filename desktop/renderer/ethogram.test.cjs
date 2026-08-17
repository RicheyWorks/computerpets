const assert = require("node:assert/strict");
const { test } = require("node:test");
const E = require("./ethogram.js");

test("snake keys never schedule scratch and can schedule tongue", () => {
  for (const key of E.TONGUE_KEYS) {
    const names = E.actsFor(key).map((a) => a.name);
    assert.ok(names.includes("tongue"), key);
    assert.equal(names.includes("scratch"), false, key);
  }
  let tongue = 0;
  for (let i = 0; i < 80; i++) {
    const act = E.pickAct("garter");
    assert.notEqual(act && act.name, "scratch");
    if (act && act.name === "tongue") tongue += 1;
  }
  assert.ok(tongue > 0);
});

test("only the scratching mammals list scratch", () => {
  assert.deepEqual(E.SCRATCH_KEYS, ["dog", "cat", "red_panda"]);
  assert.equal(E.actsFor("fox").some((a) => a.name === "scratch"), false);
  assert.equal(E.actsFor("iguana").some((a) => a.name === "scratch"), false);
});
