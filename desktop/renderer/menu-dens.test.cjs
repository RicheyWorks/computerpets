// Newcomer pass 2 (September 2026): what the desktop app itself says and shows a first-time keeper.
//   1. Companions was one flat list of all 221 guests, taller than any screen; the pet's own menu (the whole menu
//      on a desktop with no tray to see) ran to 255 rows. It is one submenu per den now, every guest still in it.
//   2. Turn off and Hide (no tray) said "type .\desktop.ps1", which Windows' default policy blocks. They also give
//      the Bypass line START-HERE gives, and desktop.ps1 says that line back when this computer blocks scripts.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const Roster = require("./roster-load.js");
const CallGuests = require("./call-guests.js");
const K = require("./keeper.js");
const C = require("./card.js");
const G = require("../overlay-gate.cjs");
const read = (...p) => fs.readFileSync(path.join(...p), "utf8").replace(/\r\n/g, "\n");
const roster = Roster.readRoster(path.join(__dirname, "roster.json"), fs);
const BYPASS = "powershell -ExecutionPolicy Bypass -File .\\desktop.ps1";

test("Companions is one submenu per den, and every one of the 221 is in exactly one", () => {
  assert.equal(roster.length, 221);
  const dens = Roster.companionDens(roster, CallGuests.groups());
  assert.equal(dens.length, 20);
  assert.deepEqual(dens.map((d) => d.label.replace(/ \(\d+\)$/, "")), CallGuests.groups().map((g) => g.label));
  const keys = dens.flatMap((d) => d.rows.map((r) => r.key));
  assert.equal(keys.length, 221);
  assert.equal(new Set(keys).size, 221);
  assert.deepEqual([...keys].sort(), roster.map((r) => r.key).sort());
  for (const d of dens) {
    assert.ok(d.rows.length > 0 && d.rows.length <= 20, `${d.label} has ${d.rows.length}`);
    assert.match(d.label, new RegExp(`\\(${d.rows.length}\\)$`));
  }
  assert.equal(dens[0].label, "House (20)");
  assert.equal(dens[0].rows[0].key, "red_panda");
});

test("a guest in no den is never dropped: it lands in Others", () => {
  const rows = [{ key: "a" }, { key: "b" }, { key: "c" }];
  const dens = Roster.companionDens(rows, [{ label: "One", keys: ["b", "zz"] }]);
  assert.deepEqual(dens.map((d) => [d.label, d.rows.map((r) => r.key)]), [["One (1)", ["b"]], ["Others (2)", ["a", "c"]]]);
  assert.deepEqual(Roster.companionDens([], []), []);
  // A key in two dens is shown once, in the first.
  const twice = Roster.companionDens(rows, [{ label: "X", keys: ["a"] }, { label: "Y", keys: ["a", "c"] }]);
  assert.deepEqual(twice.map((d) => d.rows.map((r) => r.key)), [["a"], ["c"], ["b"]]);
});

test("the tray, the pet's menu and the Mac menu all build Companions from the dens", () => {
  const main = read(ROOT, "main.cjs");
  assert.match(main, /const CallGuests = require\("\.\/renderer\/call-guests\.js"\);/);
  assert.match(main, /return Roster\.companionDens\(roster, CallGuests\.groups\(\)\)\.map\(\(den\) => \(\{/);
  assert.match(main, /submenu: den\.rows\.map\(guestRadio\),/);
  assert.doesNotMatch(main, /return roster\.map\(guestRadio\);/);
  assert.equal([...main.matchAll(/\{ label: "Companions", submenu: companionMenu\(\) \}/g)].length, 3);
  // The drive's pet switch looks one level further in.
  const drive = read(ROOT, "first-run-drive.cjs");
  assert.match(drive, /comp\.submenu\.items\.flatMap\(\(d\) => \(d\.submenu \? d\.submenu\.items : \[d\]\)\)/);
});

test("Turn off on Windows gives the Bypass line too; the Mac and Linux keep sh desktop.sh", () => {
  assert.ok(K.QUIT_TRUTH.includes("type .\\desktop.ps1 again, just like the first time."));
  assert.ok(K.QUIT_TRUTH.includes(`If Windows says running scripts is disabled, type ${BYPASS} instead.`));
  assert.equal(C.QUIT_TRUTH, K.QUIT_TRUTH);
  assert.equal(K.quitTruth("win32"), K.QUIT_TRUTH);
  assert.equal(K.quitTruth("linux"), K.QUIT_TRUTH_SH);
  assert.doesNotMatch(K.QUIT_TRUTH_SH, /ExecutionPolicy/);
  const html = read(__dirname, "index.html");
  assert.ok(html.includes(`<p id="hud-off-truth" class="keeper-truth">${K.QUIT_TRUTH}</p>`));
});

test("Hide with no tray on Windows names the Bypass line; Linux and the Mac do not", () => {
  const win = G.hideWords("win32").detail;
  assert.ok(win.includes("type .\\desktop.ps1, just like the first time, or " + BYPASS + " if Windows says running scripts is disabled"), win);
  for (const p of ["linux", "darwin"]) {
    const d = G.hideWords(p).detail;
    assert.match(d, /type sh desktop\.sh, just like the first time/);
    assert.doesNotMatch(d, /ExecutionPolicy|desktop\.ps1/);
  }
});

test("desktop.ps1 says the Bypass line back when this computer's policy blocks scripts", () => {
  const ps1 = read(ROOT, "..", "desktop.ps1");
  // Read without this window's own -ExecutionPolicy (Process scope), Undefined everywhere is Windows' Restricted.
  assert.match(ps1, /foreach \(\$scope in "MachinePolicy", "UserPolicy", "CurrentUser", "LocalMachine"\)/);
  assert.match(ps1, /return \(\$policy -eq "Restricted" -or \$policy -eq "AllSigned"\)/);
  assert.doesNotMatch(ps1, /Get-ExecutionPolicy -Scope Process/);
  assert.ok(ps1.includes(`$bypassNote = "Windows blocks scripts on this computer, so wherever these words say .\\desktop.ps1, type ${BYPASS} instead."`));
  // Every stop says it after its own words, and -Check says it before its last line (the next step stays last).
  assert.match(ps1, /Write-Host \$Words\n\s+if \(\$blocked\) \{ Write-Host \$bypassNote \}\n\s+exit 1/);
  const check = ps1.slice(ps1.indexOf('Write-Host "pictures: $seen"'), ps1.indexOf("exit 0"));
  assert.ok(check.indexOf('if ($blocked) { Write-Host "note: $bypassNote" }') < check.indexOf("next:"));
  // The stops' own words are unchanged, so every existing check of them still holds.
  assert.ok(ps1.includes("npm install did not finish. Check the internet, then run .\\desktop.ps1 again. It gets the pieces again."));
});
