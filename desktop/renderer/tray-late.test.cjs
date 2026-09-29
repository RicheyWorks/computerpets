const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

// A tray host that starts after the pets (a panel or AppIndicator that comes up late on Linux). main.cjs asked once
// at start; with "no" the no-tray words, the Hide question and OK-quits stayed on forever, and a tray icon made
// before a StatusNotifier watcher existed never registered with it (seen on the box: it registered only when made
// again). desk.no_tray drives the behaviour; this pins where it lives.
const DESKTOP = join(__dirname, "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const main = read(DESKTOP, "main.cjs");
const body = (name) => {
  const at = main.indexOf(`function ${name}(`);
  assert.ok(at > 0, name);
  return main.slice(at, main.indexOf("\n}\n", at) + 2);
};

test("the overlay asks again every 10 s whether a tray can be seen, once the first answer is in, only where it can change", () => {
  assert.match(main, /const TRAY_RECHECK_MS = 10_000;/);
  assert.match(body("startOverlay"), /learnTrayHost\(\)\.then\(watchTrayHost\);/);
  const watch = body("watchTrayHost");
  assert.match(watch, /if \(trayWatch \|\| trayHost === "n\/a"\) return;/, "Windows and the Mac always have a tray");
  assert.match(watch, /COMPUTERPETS_TRAY \|\| ""\)\.trim\(\)\.toLowerCase\(\) === "none"\) return;/, "told there is none");
  assert.match(watch, /setInterval\(\(\) => \{\n\s+recheckTrayHost\(\);\n\s+\}, TRAY_RECHECK_MS\);/);
});

test("a tray host that shows up: the tray icon is made again so it docks, and the overlay is told only on a change", () => {
  const again = body("recheckTrayHost");
  assert.match(again, /if \(trayRechecking\) return;/, "one ask at a time");
  assert.match(again, /const before = await learnTrayHost\(\);\n\s+if \(before !== "yes" && trayHost === "yes" && tray\) \{\n\s+tray\.destroy\(\);\n\s+tray = null;\n\s+createTray\(\);/);
  const learn = body("learnTrayHost");
  assert.match(learn, /if \(\(!trayHostTold \|\| trayHost !== before\) && win && !win\.isDestroyed\(\)\) \{\n\s+trayHostTold = true;\n\s+win\.webContents\.send\("tray-host", trayHost\);/);
  assert.match(learn, /return before;/);
  // What turns the fallbacks off reads trayHost each time (not a copy made at start).
  assert.match(body("hideWindowFromPetMenu"), /trayHost/);
  const pet = read(__dirname, "pet.js");
  assert.match(pet, /window\.desk\?\.onTrayHost\?\.\(\(state\) => \{\n\s+trayHost = String\(state \|\| "unknown"\);/, "the hello repaints");
});

test("the Linux drive starts a real tray after the pets and checks the icon docks once and Hide stops asking", () => {
  const drive = read(DESKTOP, "first-run-drive.cjs");
  assert.match(drive, /check\(\s*"tray_appears_later"/);
  assert.match(drive, /const lateTray = !forced && !!process\.env\.DISPLAY && !waylandArg\(nextArgs\) && whichSync\("stalonetray"\);/);
  assert.match(drive, /docked === 1 && !asked && hiddenNow === 0/, "one icon: the old one went away");
  assert.match(drive, /st\.kill\(\);/, "the tray the drive started is stopped");
});
