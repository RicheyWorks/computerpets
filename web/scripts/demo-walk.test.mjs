import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const A = await import(join(root, "src/lib/pets/arrive.ts"));
const P = await import(join(root, "src/lib/pets/play.ts"));
const D = await import(join(root, "src/lib/pets/mac-desk.ts"));

const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const extraSrc = readFileSync(join(root, "src/components/desk/mac-desk-extra.tsx"), "utf8");
const markSrc = readFileSync(join(root, "src/components/desk/linux-desk-extra.tsx"), "utf8");
const demoPageSrc = readFileSync(join(root, "src/routes/demo.$slug.tsx"), "utf8");

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
  assert.match(arrived, /applySnack/);
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
