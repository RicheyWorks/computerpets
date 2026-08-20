import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/arrive.ts"));
const P = await import(join(root, "src/lib/pets/play.ts"));
const D = await import(join(root, "src/lib/pets/mac-desk.ts"));
const Hive = await import(join(root, "src/lib/pets/hive.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));
const Treats = await import(join(root, "src/lib/pets/treats.ts"));

const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const treatsSrc = readFileSync(join(root, "src/lib/pets/treats.ts"), "utf8");
const overlayPetSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayStyleSrc = readFileSync(join(root, "../desktop/renderer/styles.css"), "utf8");
const extraSrc = readFileSync(join(root, "src/components/desk/mac-desk-extra.tsx"), "utf8");
const markSrc = readFileSync(join(root, "src/components/desk/linux-desk-extra.tsx"), "utf8");
const sitSrc = readFileSync(join(root, "src/components/desk/tablet-desk-sit.tsx"), "utf8");
const phoneSitSrc = readFileSync(join(root, "src/components/desk/phone-desk-sit.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");
const T = await import(join(root, "src/lib/pets/tablet-desk.ts"));
const H = await import(join(root, "src/lib/pets/phone-desk.ts"));

function lureSeek() {
  return { taken: false, cmd: "seek", mark: "lure" };
}

function onUpSrc() {
  const start = livingSrc.indexOf("const onUp");
  const end = livingSrc.indexOf("root.addEventListener");
  return livingSrc.slice(start, end);
}

test("the demo is a room; the guest is already walking", () => {
  assert.match(demoPageSrc, /DemoStage/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.match(demoSrc, /MacDeskExtra/);
  assert.match(demoSrc, /LinuxDeskExtra/);
  assert.match(demoSrc, /TabletDeskSit/);
  assert.match(demoSrc, /PhoneDeskSit/);
  assert.match(roomSrc, /LivingPet/);
  assert.match(roomSrc, /dropTreatAt/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents|overlay/);
});

test("the demo room walks to the treat", () => {
  assert.match(roomSrc, /function dropTreatAt/);
  assert.match(roomSrc, /setMark\(\{ kind: "treat"/);
  assert.match(roomSrc, /issue\("seek"\)/);
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  assert.match(arrived, /act === "snack"/);
  assert.match(arrived, /applySnackFor/);
  assert.match(arrived, /issue\("eat"\)/);
  assert.match(livingSrc, /cmd === "seek"/);
  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
});

test("play on the demo is one hop", () => {
  const catchThenArrive = P.playChase(["catch", "arrive"], lureSeek());
  assert.deepEqual(catchThenArrive.acts, ["play", "idle"]);
  assert.equal(catchThenArrive.applyPlay, 1);
  assert.equal(catchThenArrive.issuePlay, 1);

  const arriveThenCatch = P.playChase(["arrive", "catch"], lureSeek());
  assert.deepEqual(arriveThenCatch.acts, ["play", "none"]);
  assert.equal(arriveThenCatch.applyPlay, 1);
  assert.equal(arriveThenCatch.issuePlay, 1);

  assert.match(roomSrc, /playClaim\("catch"/);
  assert.match(roomSrc, /playClaim\("arrive"/);
  const arrived = roomSrc.slice(roomSrc.indexOf("onArrived="), roomSrc.indexOf("onTap="));
  assert.equal([...arrived.matchAll(/issue\("play"\)/g)].length, 1);
});

test("a drag on the demo living pet does not arrive", () => {
  const tap = A.pointerUp(3, 4);
  assert.equal(tap.kind, "tap");
  assert.equal(tap.arrive, false);
  const drag = A.pointerUp(40, 12);
  assert.equal(drag.kind, "place");
  assert.equal(drag.arrive, false);

  const lift = onUpSrc();
  assert.match(lift, /pointerUp/);
  assert.match(lift, /afterPlace/);
  assert.doesNotMatch(lift, /arrivedRef/);
  assert.match(livingSrc, /walkLand/);
  assert.match(livingSrc, /finishArrive/);
});

test("the demo is the same house: Bandit and Coral drop an egg, the way the blotter already does", () => {
  assert.equal(Treats.treatFor("kingsnake").shape, "egg");
  assert.equal(Treats.treatFor("kingsnake").verb, "Egg");
  assert.equal(Treats.treatFor("milk_snake").shape, "egg");
  assert.equal(Treats.treatFor("milk_snake").verb, "Egg");
  assert.match(treatsSrc, /kingsnake: \{ shape: "egg"/);
  assert.match(treatsSrc, /milk_snake: \{ shape: "egg"/);
  assert.match(roomSrc, /treatShape=\{treatFor\(kind\.key\)\.shape\}/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(overlayPetSrc, /kingsnake: "egg"/);
  assert.match(overlayPetSrc, /milk_snake: "egg"/);
  assert.match(overlayStyleSrc, /data-shape="egg"/);
  assert.doesNotMatch(overlayPetSrc, /kingsnake: "pebble"/);
  assert.doesNotMatch(overlayPetSrc, /milk_snake: "pebble"/);
});

test("the demo is the same house: Wax keeps brood and stores, and can go quieter", () => {
  const now = 1_700_000_000_000;
  const seed = Hive.stampColony({ ...C.blankCare(now), hunger: 40, health: 50 });
  const snack = C.applySnackFor("honeycomb", seed, now);
  assert.equal(snack.stores, snack.hunger);
  assert.ok(snack.stores > seed.stores);
  const empty = Hive.colonyOf({ hunger: 8, health: 0, brood: 0, stores: 8 });
  assert.equal(empty.quiet, true);
  assert.equal(Hive.colonyWord(empty), "The line went quieter.");
  assert.match(roomSrc, /colonyWord/);
  assert.match(roomSrc, /Brood/);
  assert.match(roomSrc, /Stores/);
  assert.match(roomSrc, /hive && hive\.quiet/);
  assert.match(demoSrc, /CompanionRoom/);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents|overlay/);
});

test("the demo room shows the Mac walk the way it shows the Windows walk", () => {
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(D.tapPxFor("darwin"), D.TAP_PX_MAC);
  assert.equal(D.tapPxFor("MacIntel"), D.TAP_PX_MAC);
  assert.equal(D.tapPxFor("Win32"), D.TAP_PX);
  assert.equal(D.firstClick("darwin"), "accept");
  assert.equal(D.spacesWalk("darwin"), true);
  assert.equal(D.followCursorDisplay("darwin"), true);
  assert.equal(D.overlayChrome("darwin").type, "panel");
  assert.equal(D.overlayChrome("darwin").acceptFirstMouse, true);
  assert.equal(D.carePointer({ button: 0, ctrlKey: true }), true);

  const tap = A.pointerUp(9, 0, D.tapPxFor("darwin"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(12, 0, D.tapPxFor("darwin"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);

  assert.match(demoSrc, /MacDeskExtra/);
  assert.match(extraSrc, /data-mac-extra/);
  assert.match(extraSrc, /CARE_VERBS/);
  assert.match(extraSrc, /the extra/);
  assert.doesNotMatch(extraSrc, /Unlock|Minds/);
  for (const verb of D.careVerbs()) {
    assert.ok(D.CARE_VERBS.includes(verb));
  }

  assert.match(livingSrc, /tapPxFor/);
  assert.match(livingSrc, /carePointer/);
  assert.match(livingSrc, /navigator\.platform/);
  const lift = onUpSrc();
  assert.match(lift, /tapPxFor/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents/);
});

test("the demo room shows the Linux walk the way it shows the Windows and Mac walks", () => {
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("Linux x86_64"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(D.tapPxFor("linux"), D.TAP_PX_LINUX);
  assert.equal(D.tapPxFor("Linux x86_64"), D.TAP_PX_LINUX);
  assert.equal(D.firstClick("linux"), "accept");
  assert.equal(D.spacesWalk("linux"), true);
  assert.equal(D.followCursorDisplay("linux"), true);
  assert.equal(D.hitForward("linux"), true);
  assert.equal(D.hitForward("win32"), false);
  assert.equal(D.overlayChrome("linux").type, "toolbar");
  assert.equal(D.overlayChrome("linux").acceptFirstMouse, true);
  assert.equal(D.overlayChrome("linux").focusable, false);
  assert.equal(D.overlayChrome("darwin").type, "panel");
  assert.equal(D.overlayChrome("win32").type, null);
  assert.equal(D.cursorHits({ x: 12, y: 8 }, [{ x: 10, y: 6, width: 20, height: 12 }]), true);
  assert.equal(D.carePointer({ button: 2 }), true);

  const tap = A.pointerUp(9, 0, D.tapPxFor("linux"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(10, 0, D.tapPxFor("linux"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);

  assert.match(demoSrc, /LinuxDeskExtra/);
  assert.match(markSrc, /data-linux-mark/);
  assert.match(markSrc, /CARE_VERBS/);
  assert.match(markSrc, /the mark/);
  assert.doesNotMatch(markSrc, /Unlock|Minds/);
  for (const verb of D.careVerbs()) {
    assert.ok(D.CARE_VERBS.includes(verb));
  }

  assert.match(livingSrc, /tapPxFor/);
  assert.match(livingSrc, /carePointer/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents/);
});

test("the demo room shows the tablet sit the way it shows the Windows, Mac, and Linux walks", () => {
  assert.equal(T.isTablet("iPad"), true);
  assert.equal(T.isTablet("iPhone"), false);
  assert.equal(T.isTablet("darwin"), false);
  assert.equal(T.tapPxFor("iPad"), T.TAP_PX_TABLET);
  assert.equal(T.tapPxFor("darwin"), D.TAP_PX_MAC);
  assert.equal(T.tapPxFor("linux"), D.TAP_PX_LINUX);
  assert.equal(T.tapPxFor("win32"), D.TAP_PX);
  assert.equal(T.tabletLift(T.HOLD_MS, 2, 1), "tend");
  assert.equal(T.tabletLift(80, 2, 1), "tap");
  assert.equal(T.tabletLift(T.HOLD_MS, 40, 0), "place");
  assert.equal(T.tabletOrient(1024, 768), "blotter");
  assert.equal(T.tabletOrient(768, 1024), "sit");
  assert.equal(T.followHover("iPad"), false);
  assert.equal(T.overlayChrome("iPad").type, "sit");
  assert.equal(T.overlayChrome("iPad").extra, false);
  assert.equal(T.sitClick("iPad"), "care");
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");

  const tap = A.pointerUp(9, 0, T.tapPxFor("iPad"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(24, 0, T.tapPxFor("iPad"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);

  assert.match(demoSrc, /TabletDeskSit/);
  assert.match(sitSrc, /data-tablet-sit/);
  assert.match(sitSrc, /CARE_VERBS/);
  assert.match(sitSrc, /the sit/);
  assert.doesNotMatch(sitSrc, /Unlock|Minds/);
  for (const verb of D.careVerbs()) {
    assert.ok(D.CARE_VERBS.includes(verb));
  }

  assert.match(livingSrc, /tabletLift/);
  assert.match(livingSrc, /onTend/);
  assert.match(livingSrc, /followHover/);
  const lift = onUpSrc();
  assert.match(lift, /tabletLift/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents/);
});

test("the demo room shows the phone sit the way it shows the desk and tablet walks", () => {
  assert.equal(H.isPhone("iPhone"), true);
  assert.equal(H.isPhone("iPad"), false);
  assert.equal(H.isPhone("darwin"), false);
  assert.equal(H.tapPxFor("iPhone"), H.TAP_PX_PHONE);
  assert.equal(H.tapPxFor("iPad"), T.TAP_PX_TABLET);
  assert.equal(H.tapPxFor("darwin"), D.TAP_PX_MAC);
  assert.equal(H.tapPxFor("linux"), D.TAP_PX_LINUX);
  assert.equal(H.tapPxFor("win32"), D.TAP_PX);
  assert.ok(H.TAP_PX_PHONE < T.TAP_PX_TABLET);
  assert.ok(H.TAP_PX_PHONE > D.TAP_PX);
  assert.equal(H.phoneLift(H.HOLD_MS, 2, 1), "tend");
  assert.equal(H.phoneLift(80, 2, 1), "tap");
  assert.equal(H.phoneLift(H.HOLD_MS, 24, 0), "place");
  assert.equal(H.phoneOrient(390, 844), "blotter");
  assert.equal(H.phoneOrient(844, 390), "sit");
  assert.equal(H.followHover("iPhone"), false);
  assert.equal(H.overlayChrome("iPhone").type, "sit");
  assert.equal(H.overlayChrome("iPhone").extra, false);
  assert.equal(H.sitClick("iPhone"), "care");
  assert.equal(T.sitClick("iPhone"), "none");
  assert.equal(T.tabletOrient(1024, 768), "blotter");
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");

  const tap = A.pointerUp(9, 0, H.tapPxFor("iPhone"));
  assert.equal(tap.kind, "tap");
  const place = A.pointerUp(16, 0, H.tapPxFor("iPhone"));
  assert.equal(place.kind, "place");
  assert.equal(place.arrive, false);

  assert.match(demoSrc, /PhoneDeskSit/);
  assert.match(demoSrc, /TabletDeskSit/);
  assert.match(phoneSitSrc, /data-phone-sit/);
  assert.match(phoneSitSrc, /CARE_VERBS/);
  assert.match(phoneSitSrc, /the sit/);
  assert.doesNotMatch(phoneSitSrc, /Unlock|Minds/);
  for (const verb of D.careVerbs()) {
    assert.ok(D.CARE_VERBS.includes(verb));
  }

  assert.match(livingSrc, /isPhone/);
  assert.match(livingSrc, /tabletLift/);
  assert.match(livingSrc, /onTend/);
  assert.match(livingSrc, /followHover/);
  const lift = onUpSrc();
  assert.match(lift, /isPhone/);
  assert.match(lift, /tabletLift/);
  assert.doesNotMatch(demoSrc, /BrowserWindow|setIgnoreMouseEvents/);
});
