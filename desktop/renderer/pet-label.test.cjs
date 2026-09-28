const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Roster = require("./roster-load.js");

// One way to name a pet in a list: "Name · Kind". The tray, the house window's Pet list, the card's Call
// list, and the Python blotter (unlock_dialog.py pet_choice_text) all use it. client/tests/test_unlock.py
// runs this formatter and the Python one over all 221 pets and needs the same line for each.
const ROOT = join(__dirname, "..", "..");
const read = (...p) => readFileSync(join(ROOT, ...p), "utf8");

test("choiceText: name and kind, the name alone without a kind, the key only when there is no name", () => {
  assert.equal(Roster.choiceText({ key: "red_panda", name: "Rui", speciesLabel: "Red Panda" }), "Rui · Red Panda");
  assert.equal(Roster.choiceText({ key: "crow", name: "Soot" }), "Soot");
  assert.equal(Roster.choiceText({ key: "crow" }), "crow");
  assert.equal(Roster.choiceText(null), "");
});

test("every one of the 221 roster pets reads Name · Kind and never shows its key", () => {
  const rows = JSON.parse(read("desktop", "renderer", "roster.json"));
  assert.equal(rows.length, 221);
  for (const row of rows) {
    const line = Roster.choiceText(row);
    assert.equal(line, `${row.name} · ${row.speciesLabel}`);
    assert.ok(!line.includes(row.key) || row.name.toLowerCase().includes(row.key) || row.speciesLabel.toLowerCase().includes(row.key), row.key);
  }
});

test("the tray, the house window, and the card Call list all use the one formatter", () => {
  const main = read("desktop", "main.cjs");
  assert.match(main, /function guestRadio\(r\) \{\s*return \{\s*label: Roster\.choiceText\(r\),/);
  assert.doesNotMatch(main, /\$\{r\.name\} — \$\{r\.speciesLabel\}/, "no old dash label left in the tray");
  const settings = read("desktop", "renderer", "settings.html");
  assert.ok(settings.includes('<script src="roster-load.js"></script>'));
  assert.ok(settings.includes("o.textContent = window.PetRoster.choiceText(row);"));
  const pet = read("desktop", "renderer", "pet.js");
  assert.ok(pet.includes("opt.textContent = window.PetRoster.choiceText(row);"));
  assert.doesNotMatch(pet + settings, /\$\{row\.name\} · \$\{row\.speciesLabel/, "no hand-built pet line left");
  const py = read("client", "computerpets_client", "unlock_dialog.py");
  assert.ok(py.includes('return f"{name} · {kind}" if kind else name'));
});
