const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const fs = require("node:fs");
const R = require("./roster-load.js");

const rosterPath = join(__dirname, "roster.json");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "settings.html"), "utf8");

test("the house roster door reads the two hundred twenty from disk", () => {
  const rows = R.readRoster(rosterPath, fs);
  assert.equal(rows.length, 220);
  assert.equal(rows[0].key, "red_panda");
  assert.equal(R.foundRoster(rows), true);
  const opened = R.openRoster(rows);
  assert.equal(opened.ok, true);
  assert.equal(opened.roster[0].key, "red_panda");
});

test("a missing roster file still says the house line", () => {
  const rows = R.readRoster(join(__dirname, "no-such-roster.json"), fs);
  assert.deepEqual(rows, []);
  assert.equal(R.foundRoster(rows), false);
  assert.equal(R.missingLine(), "The house could not find the roster.");
  const opened = R.openRoster(rows);
  assert.equal(opened.ok, false);
  assert.equal(opened.line, "The house could not find the roster.");
});

test("broken or empty roster JSON is the same house line", () => {
  const broken = {
    readFileSync() {
      return "{";
    },
  };
  const empty = {
    readFileSync() {
      return "[]";
    },
  };
  const junk = {
    readFileSync() {
      return JSON.stringify([{ key: "ghost" }]);
    },
  };
  assert.equal(R.openRoster(R.readRoster("x", broken)).line, "The house could not find the roster.");
  assert.equal(R.openRoster(R.readRoster("x", empty)).line, "The house could not find the roster.");
  assert.equal(R.openRoster(R.readRoster("x", junk)).line, "The house could not find the roster.");
  assert.deepEqual(R.takeRoster({ red_panda: true }), []);
  assert.deepEqual(R.readRoster("x", {}), []);
});

test("the overlay asks the desk for the roster it already has", async () => {
  const disk = R.readRoster(rosterPath, fs);
  const opened = await R.loadHouseRoster({
    roster: async () => disk,
  });
  assert.equal(opened.ok, true);
  assert.equal(opened.roster.length, 220);
  assert.equal(opened.roster[0].key, "red_panda");

  const gone = await R.loadHouseRoster({
    roster: async () => {
      throw new Error("sandboxed file fetch refused");
    },
  });
  assert.equal(gone.ok, false);
  assert.equal(gone.line, "The house could not find the roster.");

  const noDesk = await R.loadHouseRoster(undefined);
  assert.equal(noDesk.ok, false);
  assert.equal(noDesk.line, "The house could not find the roster.");
});

test("a sandboxed overlay does not fetch roster.json from file://", () => {
  assert.match(mainSrc, /ipcMain\.handle\("roster-get"/);
  assert.match(mainSrc, /Roster\.readRoster/);
  assert.match(preloadSrc, /roster:\s*\(\)\s*=>\s*ipcRenderer\.invoke\("roster-get"\)/);
  assert.match(petSrc, /PetRoster\.loadHouseRoster/);
  assert.match(petSrc, /say\("The house could not find the roster\."\)/);
  assert.match(petSrc, /start = "red_panda"/);
  assert.doesNotMatch(petSrc, /fetch\("roster\.json"\)/);
  assert.doesNotMatch(settingsSrc, /fetch\("roster\.json"\)/);
  assert.match(settingsSrc, /desk\?\.roster|desk\.roster/);
  assert.match(htmlSrc, /roster-load\.js/);
  assert.match(mainSrc, /sandbox:\s*true/);
  assert.match(mainSrc, /contextIsolation:\s*true/);
  assert.match(mainSrc, /nodeIntegration:\s*false/);
  assert.doesNotMatch(mainSrc, /nodeIntegration:\s*true/);
  assert.doesNotMatch(mainSrc, /sandbox:\s*false/);
  assert.doesNotMatch(mainSrc, /contextIsolation:\s*false/);
});
