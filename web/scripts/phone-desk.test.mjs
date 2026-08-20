import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(join(root, "src/lib/pets/phone-desk.ts"));
const T = await import(join(root, "src/lib/pets/tablet-desk.ts"));
const D = await import(join(root, "src/lib/pets/mac-desk.ts"));
const A = await import(join(root, "src/lib/pets/arrive.ts"));

const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const sitSrc = readFileSync(join(root, "src/components/desk/phone-desk-sit.tsx"), "utf8");
const padSitSrc = readFileSync(join(root, "src/components/desk/tablet-desk-sit.tsx"), "utf8");
const extraSrc = readFileSync(join(root, "src/components/desk/mac-desk-extra.tsx"), "utf8");
const markSrc = readFileSync(join(root, "src/components/desk/linux-desk-extra.tsx"), "utf8");
const speciesSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const deskJs = readFileSync(join(root, "..", "desktop", "renderer", "desk.js"), "utf8");

const iphone = {
  platform: "iPhone",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 390,
  height: 844,
};

const iphoneLandscape = { ...iphone, width: 844, height: 390 };

const androidPhone = {
  platform: "Linux armv8l",
  userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 412,
  height: 915,
};

const ipad = {
  platform: "iPad",
  userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)",
  pointer: "coarse",
  hover: "none",
  maxTouchPoints: 5,
  width: 1024,
  height: 768,
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

test("a phone is a phone; a tablet stays a tablet; a desk stays a desk", () => {
  assert.equal(P.isPhone("iPhone"), true);
  assert.equal(P.isPhone("iPod"), true);
  assert.equal(P.isPhone(iphone), true);
  assert.equal(P.isPhone(iphoneLandscape), true);
  assert.equal(P.isPhone(androidPhone), true);
  assert.equal(P.isHand(iphone), true);
  assert.equal(P.isPhone(ipad), false);
  assert.equal(P.isPhone("iPad"), false);
  assert.equal(P.isPhone(macDesk), false);
  assert.equal(P.isPhone("darwin"), false);
  assert.equal(P.isPhone("linux"), false);
  assert.equal(P.isPhone("win32"), false);
  assert.equal(T.isTablet(ipad), true);
  assert.equal(T.isTablet(iphone), false);
  assert.equal(T.isTablet("iPhone"), false);
  assert.equal(T.sitClick(iphone), "none");
});

test("a thumb needs more wood than a mouse and less than a tablet", () => {
  assert.equal(P.tapPxFor("iPhone"), P.TAP_PX_PHONE);
  assert.equal(P.tapPxFor("iPhone", iphone), P.TAP_PX_PHONE);
  assert.equal(P.tapPxFor("Linux armv8l", androidPhone), P.TAP_PX_PHONE);
  assert.equal(P.tapPxFor("iPad"), T.TAP_PX_TABLET);
  assert.equal(P.tapPxFor("darwin"), D.TAP_PX_MAC);
  assert.equal(P.tapPxFor("linux"), D.TAP_PX_LINUX);
  assert.equal(P.tapPxFor("win32"), D.TAP_PX);
  assert.ok(P.TAP_PX_PHONE > D.TAP_PX_MAC);
  assert.ok(P.TAP_PX_PHONE < T.TAP_PX_TABLET);
  assert.ok(T.TAP_PX_TABLET > D.TAP_PX);

  const tap = A.pointerUp(9, 0, P.tapPxFor("iPhone"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(16, 0, P.tapPxFor("iPhone"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);
});

test("a long still thumb tends; a short still thumb talks; a drag is a carry", () => {
  assert.equal(P.phoneLift(80, 3, 2), "tap");
  assert.equal(P.phoneLift(P.HOLD_MS, 3, 2), "tend");
  assert.equal(P.phoneLift(P.HOLD_MS + 40, 2, 1), "tend");
  assert.equal(P.phoneLift(P.HOLD_MS, 24, 8), "place");
  assert.equal(P.phoneLift(80, 24, 8), "place");
  assert.equal(P.careHold(P.HOLD_MS, false), true);
  assert.equal(P.careHold(P.HOLD_MS, true), false);
  assert.equal(P.careHold(80, false), false);
  assert.equal(D.carePointer({ button: 0 }), false);
  assert.equal(D.carePointer({ button: 2 }), true);
  assert.equal(T.tabletLift(T.HOLD_MS, 2, 1), "tend");
});

test("portrait is the blotter; landscape is a sit; the floor keeps the notch", () => {
  assert.equal(P.phoneOrient(390, 844), "blotter");
  assert.equal(P.phoneOrient(844, 390), "sit");
  assert.equal(P.phoneOrient(iphone.width, iphone.height), "blotter");
  assert.equal(P.phoneOrient(iphoneLandscape.width, iphoneLandscape.height), "sit");
  assert.equal(T.tabletOrient(1024, 768), "blotter");
  assert.equal(T.tabletOrient(768, 1024), "sit");
  const safe = P.phoneSafe({ top: 47, bottom: 34, left: 0, right: 0 });
  assert.equal(safe.floorTop, 47);
  assert.equal(safe.floorBottom, 34);
  assert.equal(P.thumbCare("blotter").zone, "sit");
  assert.equal(P.thumbCare("sit").zone, "rail");
  assert.ok(P.thumbCare("blotter").minTarget >= 44);
  assert.equal(P.followHover(iphone), false);
  assert.equal(P.followHover("iPhone"), false);
  assert.equal(P.followHover(ipad), false);
  assert.equal(P.followHover(macDesk), true);
});

test("the sit is the chrome; there is no extra and no mark", () => {
  const chrome = P.overlayChrome(iphone);
  assert.equal(chrome.type, "sit");
  assert.equal(chrome.hover, false);
  assert.equal(chrome.extra, false);
  assert.equal(chrome.mark, false);
  assert.equal(chrome.home, true);
  assert.equal(P.sitClick(iphone), "care");
  assert.equal(P.sitClick("iPhone"), "care");
  assert.equal(P.sitClick(ipad), "none");
  assert.equal(P.overlayChrome("darwin").type, null);
  assert.equal(T.sitClick(iphone), "none");
  assert.equal(T.overlayChrome(ipad).type, "sit");
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(P.homeSit(false), "add");
  assert.equal(P.homeSit(true), "home");
  assert.match(P.homeLine(false), /Add to Home Screen/);
  assert.doesNotMatch(P.homeLine(false), /App Store|Play Store|sku|listing/i);
});

test("the demo room shows the phone sit the way it shows the desk and tablet walks", () => {
  assert.match(demoSrc, /PhoneDeskSit/);
  assert.match(demoSrc, /TabletDeskSit/);
  assert.match(demoSrc, /MacDeskExtra/);
  assert.match(demoSrc, /LinuxDeskExtra/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(sitSrc, /data-phone-sit/);
  assert.match(sitSrc, /the sit/);
  assert.match(sitSrc, /CARE_VERBS/);
  assert.match(sitSrc, /safe-area-inset-bottom/);
  assert.doesNotMatch(sitSrc, /Unlock|Minds/);
  assert.doesNotMatch(sitSrc, /menu bar|tray|StatusNotifier/);
  assert.match(padSitSrc, /data-tablet-sit/);
  assert.match(extraSrc, /data-mac-extra/);
  assert.match(markSrc, /data-linux-mark/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents|overlay/);
});

test("the living guest learns the phone sit; the tablet leftover stays", () => {
  assert.match(livingSrc, /isPhone/);
  assert.match(livingSrc, /tabletLift/);
  assert.match(livingSrc, /tapPxFor/);
  assert.match(livingSrc, /carePointer/);
  assert.match(livingSrc, /onTend/);
  assert.match(livingSrc, /HOLD_MS/);
  assert.match(livingSrc, /followHover/);
  assert.match(livingSrc, /contextmenu/);
  const lift = onUpSrc();
  assert.match(lift, /isPhone/);
  assert.match(lift, /tabletLift/);
  assert.match(lift, /pointerUp/);
  assert.match(lift, /afterPlace/);
  assert.match(roomSrc, /onTend=/);
  assert.match(roomSrc, /blotter-care-phone/);
  assert.match(roomSrc, /blotter-care-tablet/);
  assert.match(roomSrc, /data-phone-floor/);
  assert.match(roomSrc, /data-phone-orient/);
  assert.match(roomSrc, /data-tablet-floor/);
  assert.match(roomSrc, /phoneOrient/);
  assert.match(roomSrc, /safe-area-inset-top/);
  assert.match(roomSrc, /safe-area-inset-bottom/);
  assert.match(liveSrc, /isTablet/);
  assert.match(liveSrc, /tablet=\{pad\}/);
  assert.match(liveSrc, /phone=\{!pad\}/);
  assert.match(liveSrc, /homeSit/);
  assert.match(liveSrc, /Add to Home Screen/);
  assert.doesNotMatch(deskJs, /TAP_PX_PHONE|isPhone|phoneOrient|homeSit/);
  assert.equal([...speciesSrc.matchAll(/\{ key: "/g)].length, 200);
});
