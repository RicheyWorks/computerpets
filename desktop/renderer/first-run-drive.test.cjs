// desktop/first-run-drive.cjs drives the real first run on the keeper's screen (opt-in: the harness's --gui row
// gui.first_run_drive). Its judgements and its care for the keeper's own data are pinned here without Electron.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const D = require("../first-run-drive.cjs");

const src = readFileSync(join(__dirname, "..", "first-run-drive.cjs"), "utf8");

test("the drive's box judgements", () => {
  // The real old-code numbers: the line at 58..278 x 912..948 over the card at 177..491 x -13..1214.
  assert.equal(D.overlaps([58, 912, 278, 948], [177, -13, 491, 1214]), true);
  assert.equal(D.overlaps([499, 1140, 719, 1178], [177, 18, 491, 1214]), false);
  assert.equal(D.onScreen([177, -13, 491, 1214], 2560, 1392), false);
  assert.equal(D.onScreen([2272, 18, 2586, 1214], 2560, 1392), false);
  assert.equal(D.onScreen([2238, 18, 2552, 1214], 2560, 1392), true);
  assert.deepEqual(D.duplicateLabels([{ label: "Hide" }, { label: "Feed" }, { label: "Companions", submenu: [{ label: "Rui" }, { label: "Rui" }] }, { label: "hide" }]), ["Rui", "hide"]);
  assert.deepEqual(D.allLabels([{ label: "A", submenu: [{ label: "B" }] }, { label: "" }]), ["A", "B"]);
});

test("user data is a throwaway folder under target/first-run-drive, checked before anything runs, removed after", () => {
  assert.equal(D.throwawayOk(join(D.WORK, "ud-12-34")), true);
  assert.equal(D.throwawayOk(D.WORK), false);
  assert.equal(D.throwawayOk(join(D.WORK, "..", "ud-12-34")), false);
  assert.equal(D.throwawayOk(join(D.WORK, "ud-12-34", "..", "..", "x")), false);
  assert.equal(D.throwawayOk(join(process.env.APPDATA || "/home/x/.config", "computerpets-desktop")), false);
  assert.match(D.WORK, /target[\\/]first-run-drive$/);
  assert.match(src, /`--user-data-dir=\$\{ud\}`/);
  assert.match(src, /a\.getPath\("userData"\)/);
  assert.match(src, /not the throwaway folder; stopped before touching it/);
  assert.match(src, /const removed = await removeDir\(ud\);/);
  assert.match(src, /if \(!throwawayOk\(dir\)\) return false;/);
});

test("no OS input and no popped-up menus: menus are recorded, input goes through Chromium", () => {
  assert.match(src, /Menu\.prototype\.popup = function \(\) \{\n\s+g\.__popups\.push\(this\);/);
  assert.doesNotMatch(src, /robotjs|nut-js|SendInput|keybd_event|sendInputEvent|globalShortcut/);
  assert.match(src, /proc\.kill\(\)/, "the app never outlives the drive");
});

test("the drive walks the whole first run", () => {
  for (const id of ["hello_shows", "card_on_screen", "got_it_target", "pet_on_screen", "bubble_clear_of_card", "care_menu", "care_menu_no_twins", "trick_word_matches", "plates_clear_of_card", "rain_falls_full_height", "feed_with_card_opened_on_the_way", "card_holds_after_press_hello_unread", "got_it_persists", "card_holds_after_press_hello_read", "escape_closes_card", "card_fits_at_right_edge", "house_minds", "house_unlock", "house_hash_reload", "house_closes", "hide_window", "tray_show", "quit", "second_start_no_hello", "no_page_errors", "throwaway_removed"]) {
    assert.match(src, new RegExp(`check\\(\\s*"${id}"`), id);
  }
});
