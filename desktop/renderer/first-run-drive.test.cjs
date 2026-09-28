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
  assert.match(src, /Menu\.prototype\.popup = function \(o\) \{\n\s+g\.__popups\.push\(this\);\n\s+this\.__at = /);
  assert.doesNotMatch(src, /robotjs|nut-js|SendInput|keybd_event|sendInputEvent|globalShortcut/);
  assert.match(src, /proc\.kill\(\)/, "the app never outlives the drive");
});

test("the drive walks the whole first run", () => {
  for (const id of ["hello_shows", "card_on_screen", "got_it_target", "pet_on_screen", "bubble_clear_of_card", "care_menu", "care_menu_no_twins", "trick_word_matches", "plates_clear_of_card", "rain_falls_full_height", "feed_with_card_opened_on_the_way", "card_holds_after_press_hello_unread", "got_it_persists", "card_holds_after_press_hello_read", "escape_closes_card", "card_fits_at_right_edge", "house_minds", "house_unlock", "house_hash_reload", "house_closes", "hide_window", "tray_show", "quit", "second_start_no_hello", "no_page_errors", "throwaway_removed", "window_fits_work_area", "menu_at_pet", "card_stays_after_open", "card_leash_on_long_walk", "minds_house_default", "minds_key_sealed", "talk_line_before_cloud", "talk_failure_says_why", "sound_settings", "pet_switch", "settings_survive_restart", "card_by_pet_at_right_edge", "rest_wakes_when_rested", "talk_pose_ends_with_own_line", "play_stays_on_screen", "minds_save_tests_key", "volume_is_this_pets", "minds_test_button", "gate_software_says_so", "gate_no_compositor_says_so", "no_tray_hello", "no_tray_pet_menu", "no_tray_hide_asks", "no_tray_second_start", "turn_off_words", "gate_wayland_restarts_on_x11", "gate_wayland_says_so"]) {
    assert.match(src, new RegExp(`check\\(\\s*"${id}"`), id);
  }
});

test("past the first minute: every care word from the card and the menu, with its stat and its way back", () => {
  for (const id of ["care_feed", "care_treat", "care_play", "care_trick", "care_praise", "care_medicine", "care_talk", "care_rest", "care_hide", "care_call_back", "care_hide_menu", "care_call_back_card"]) {
    assert.match(src, new RegExp(`id: "${id}"`), id);
  }
  assert.match(src, /check\(\n\s+step\.id,\n\s+pressed && spoke && did && back && step\.ok\(a, b\),/);
});

test("the Minds checks never reach the internet: api.x.ai is answered inside the drive, the key is a stand-in", () => {
  assert.match(src, /await page\.route\("https:\/\/api\.x\.ai\/\*\*", async \(route\) => \{/);
  assert.match(src, /await route\.fulfill\(\{ status: 401,/);
  assert.equal(D.STANDIN_KEY, "xai-standin-not-a-real-key-0000");
  assert.doesNotMatch(src, /route\.continue\(|XAI_API_KEY|process\.env\.[A-Z_]*KEY/);
  // The route is set on the overlay page as launch() meets it (attach), before any Talk, for both starts.
  const attach = src.indexOf("async function attach(page) {");
  assert.ok(attach > 0 && attach < src.indexOf('await page.route("https://api.x.ai/**"') && src.indexOf('await page.route("https://api.x.ai/**"') < src.indexOf("return page;", attach));
  assert.match(src, /if \(page\) return \{ app, page: await attach\(page\) \};/);
});

test("display scaling: --scale adds --force-device-scale-factor, and the gap judgement", () => {
  assert.equal(D.scaleArg(["--scale", "1.25"]), 1.25);
  assert.equal(D.scaleArg(["--scale", "1.5"]), 1.5);
  assert.equal(D.scaleArg([]), null);
  assert.equal(D.scaleArg(["--scale", "0.5"]), null);
  assert.equal(D.scaleArg(["--scale", "x"]), null);
  assert.match(src, /\.\.\.\(scale \? \[`--force-device-scale-factor=\$\{scale\}`\] : \[\]\)/);
  // The real old-code numbers from the long walk: card 1745..2059, pet 1073..1213 walking left: 532 px apart.
  assert.equal(D.sideGap([1745, 18, 2059, 1214], [1073, 1244, 1213, 1392]), 532);
  assert.equal(D.sideGap([400, 18, 714, 1214], [500, 1244, 640, 1392]), 0, "overlapping in x");
  assert.equal(D.sideGap([100, 0, 200, 10], [260, 0, 300, 10]), 60);
});
