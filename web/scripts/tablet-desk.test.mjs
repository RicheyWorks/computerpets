import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = await import(join(root, "src/lib/pets/tablet-desk.ts"));
const D = await import(join(root, "src/lib/pets/mac-desk.ts"));
const A = await import(join(root, "src/lib/pets/arrive.ts"));

const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const sitSrc = readFileSync(join(root, "src/components/desk/tablet-desk-sit.tsx"), "utf8");
const extraSrc = readFileSync(join(root, "src/components/desk/mac-desk-extra.tsx"), "utf8");
const markSrc = readFileSync(join(root, "src/components/desk/linux-desk-extra.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const deskJs = readFileSync(join(root, "..", "desktop", "renderer", "desk.js"), "utf8");

const ipad = {
  platform: "iPad",
  userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 1024,
  height: 768,
};

const ipadPortrait = { ...ipad, width: 768, height: 1024 };

const ipadAsMac = {
  platform: "MacIntel",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 1180,
  height: 820,
};

const androidTablet = {
  platform: "Linux armv8l",
  userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel Tablet) AppleWebKit/537.36",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 1200,
  height: 800,
};

const phone = {
  platform: "iPhone",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 390,
  height: 844,
};

const macDesk = {
  platform: "MacIntel",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  pointer: "fine",
  hover: "hover",
  maxTouchPoints: 0,
  width: 1440,
  height: 900,
};

function onUpSrc() {
  const start = livingSrc.indexOf("const onUp");
  const end = livingSrc.indexOf("root.addEventListener");
  return livingSrc.slice(start, end);
}

test("a tablet is a tablet; a phone waits; a Mac desk stays a Mac", () => {
  assert.equal(T.isTablet("iPad"), true);
  assert.equal(T.isTablet("iPadOS"), true);
  assert.equal(T.isTablet(ipad), true);
  assert.equal(T.isTablet(ipadAsMac), true);
  assert.equal(T.isTablet(androidTablet), true);
  assert.equal(T.isTablet(phone), false);
  assert.equal(T.isTablet("iPhone"), false);
  assert.equal(T.isTablet(macDesk), false);
  assert.equal(T.isTablet("darwin"), false);
  assert.equal(T.isTablet("linux"), false);
  assert.equal(T.isTablet("win32"), false);
  assert.equal(T.isTablet("MacIntel"), false);
  assert.equal(T.isPhone(phone), true);
  assert.equal(T.isPhone("iPhone"), true);
  assert.equal(T.isPhone(ipad), false);
});

test("a finger needs more wood than a mouse; the desks keep their slop", () => {
  assert.equal(T.tapPxFor("iPad"), T.TAP_PX_TABLET);
  assert.equal(T.tapPxFor("MacIntel", ipadAsMac), T.TAP_PX_TABLET);
  assert.equal(T.tapPxFor("darwin"), D.TAP_PX_MAC);
  assert.equal(T.tapPxFor("linux"), D.TAP_PX_LINUX);
  assert.equal(T.tapPxFor("win32"), D.TAP_PX);
  assert.equal(T.tapPxFor("MacIntel"), D.TAP_PX_MAC);
  assert.ok(T.TAP_PX_TABLET > D.TAP_PX_MAC);
  assert.ok(T.TAP_PX_TABLET > D.TAP_PX);

  const tap = A.pointerUp(9, 0, T.tapPxFor("iPad"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(24, 0, T.tapPxFor("iPad"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);
});

test("a long still finger tends; a short still finger talks; a drag is a carry", () => {
  assert.equal(T.tabletLift(80, 3, 2), "tap");
  assert.equal(T.tabletLift(T.HOLD_MS, 3, 2), "tend");
  assert.equal(T.tabletLift(T.HOLD_MS + 40, 2, 1), "tend");
  assert.equal(T.tabletLift(T.HOLD_MS, 40, 8), "place");
  assert.equal(T.tabletLift(80, 40, 8), "place");
  assert.equal(T.careHold(T.HOLD_MS, false), true);
  assert.equal(T.careHold(T.HOLD_MS, true), false);
  assert.equal(T.careHold(80, false), false);
  assert.equal(D.carePointer({ button: 0 }), false);
  assert.equal(D.carePointer({ button: 2 }), true);
});

test("landscape is the blotter; portrait is a sit; the floor keeps the notch", () => {
  assert.equal(T.tabletOrient(1024, 768), "blotter");
  assert.equal(T.tabletOrient(768, 1024), "sit");
  assert.equal(T.tabletOrient(ipad.width, ipad.height), "blotter");
  assert.equal(T.tabletOrient(ipadPortrait.width, ipadPortrait.height), "sit");
  const safe = T.tabletSafe({ top: 24, bottom: 20, left: 0, right: 0 });
  assert.equal(safe.floorTop, 24);
  assert.equal(safe.floorBottom, 20);
  assert.equal(T.thumbCare("blotter").zone, "rail");
  assert.equal(T.thumbCare("sit").zone, "sit");
  assert.ok(T.thumbCare("sit").minTarget >= 44);
  assert.equal(T.followHover(ipad), false);
  assert.equal(T.followHover(macDesk), true);
  assert.equal(T.followHover("iPad"), false);
});

test("the sit is the chrome; there is no extra and no mark", () => {
  const chrome = T.overlayChrome(ipad);
  assert.equal(chrome.type, "sit");
  assert.equal(chrome.hover, false);
  assert.equal(chrome.extra, false);
  assert.equal(chrome.mark, false);
  assert.equal(T.sitClick(ipad), "care");
  assert.equal(T.sitClick(phone), "none");
  assert.equal(T.overlayChrome("darwin").type, null);
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(D.overlayChrome("darwin").type, "panel");
  assert.equal(D.overlayChrome("linux").type, "toolbar");
  assert.equal(D.overlayChrome("win32").type, null);
});

test("the demo room shows the tablet sit the way it shows the desk walks", () => {
  assert.match(demoSrc, /TabletDeskSit/);
  assert.match(demoSrc, /MacDeskExtra/);
  assert.match(demoSrc, /LinuxDeskExtra/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(sitSrc, /data-tablet-sit/);
  assert.match(sitSrc, /the sit/);
  assert.match(sitSrc, /CARE_VERBS/);
  assert.match(sitSrc, /safe-area-inset-bottom/);
  assert.doesNotMatch(sitSrc, /Unlock|Minds/);
  assert.doesNotMatch(sitSrc, /menu bar|tray|StatusNotifier/);
  assert.match(extraSrc, /data-mac-extra/);
  assert.match(markSrc, /data-linux-mark/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents|overlay/);
});

test("the living guest learns the tablet sit; the desks stay", () => {
  assert.match(livingSrc, /tabletLift/);
  assert.match(livingSrc, /tapPxFor/);
  assert.match(livingSrc, /carePointer/);
  assert.match(livingSrc, /onTend/);
  assert.match(livingSrc, /HOLD_MS/);
  assert.match(livingSrc, /followHover/);
  assert.match(livingSrc, /contextmenu/);
  const lift = onUpSrc();
  assert.match(lift, /tabletLift/);
  assert.match(lift, /pointerUp/);
  assert.match(lift, /afterPlace/);
  assert.match(roomSrc, /onTend=/);
  assert.match(roomSrc, /blotter-care-tablet/);
  assert.match(roomSrc, /data-tablet-floor/);
  assert.match(roomSrc, /data-tablet-orient/);
  assert.match(roomSrc, /safe-area-inset-top/);
  assert.match(roomSrc, /safe-area-inset-bottom/);
  assert.match(liveSrc, /isTablet/);
  assert.match(liveSrc, /tablet=\{pad\}/);
  assert.match(liveSrc, /phone=\{!pad\}/);
  assert.doesNotMatch(deskJs, /TAP_PX_TABLET|isTablet|HOLD_MS/);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 170);
});
