import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const Hours = await import(join(root, "src/lib/pets/hours.ts"));
const C = await import(join(root, "src/lib/pets/care.ts"));
const G = await import(join(root, "src/lib/pets/gait.ts"));
const OverlayHours = require(join(root, "../desktop/renderer/hours.js"));
const OverlayGait = require(join(root, "../desktop/renderer/gait.js"));
const OverlayLife = require(join(root, "../desktop/renderer/life.js"));

const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const overlayPetSrc = readFileSync(join(root, "../desktop/renderer/pet.js"), "utf8");
const overlayLifeSrc = readFileSync(join(root, "../desktop/renderer/life.js"), "utf8");
const blotterHours = readFileSync(join(root, "../client/computerpets_client/hours.py"), "utf8");
const blotterLife = readFileSync(join(root, "../client/computerpets_client/life.py"), "utf8");
const blotterPet = readFileSync(join(root, "../client/computerpets_client/pet_item.py"), "utf8");

const CATALOG = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
const PIP = "You called. I brought the whole tail.";

test("call lines cover the house, and Chirp is not Pip", () => {
  assert.equal(CATALOG.length, 210);
  assert.equal(Object.keys(Hours.CALL_LINE).length, 210);
  assert.deepEqual(Object.keys(Hours.CALL_LINE).sort(), [...CATALOG].sort());
  assert.equal(Hours.callLine("dog"), "You called. I was already coming.");
  assert.equal(Hours.callLine("field_cricket"), "I sang. Hello.");
  assert.equal(Hours.callLine("brain_coral"), "I sat the rock. Hello.");
  assert.equal(Hours.callLine("fiddler_crab"), "I waved. Hello.");
  assert.equal(Hours.callLine("red_panda"), PIP);
  assert.notEqual(Hours.callLine("field_cricket"), PIP);
  assert.equal(Hours.callLine("dog", "Already here."), "Already here.");
  assert.equal(Hours.callLine("not_a_pet"), "You called.");
  assert.equal(Hours.hideLine("cat"), "The ledge is closed.");
});

test("the desk walks off and walks in the house way, and call-back is not Pip for every guest", () => {
  const hidden = C.applyHide({ mood: 50, bond: 10 });
  assert.equal(hidden.hidden, true);
  const back = C.applyCall(hidden);
  assert.equal(back.hidden, false);
  assert.equal(back.mood, 54);
  assert.equal(back.bond, 11);

  assert.equal(G.leaveTarget(80, 800, 176), -200);
  assert.equal(G.leaveTarget(600, 800, 176), 812);
  assert.equal(G.enterSpawn(800, 176, 20, true), -176);
  assert.ok(G.enterSpawn(800, 176, 20, false) > 400);
  assert.equal(G.enterSit(800, 176, 20, 0), 80);

  assert.match(roomSrc, /applyCall/);
  assert.match(roomSrc, /callLine\(kind\.key\)/);
  assert.match(roomSrc, /hideLine\(kind\.key\)/);
  assert.match(roomSrc, /issue\("leave"\)/);
  assert.match(roomSrc, /issue\("enter"\)/);
  assert.doesNotMatch(roomSrc, /say\("You called\. I brought the whole tail\."\)/);
  assert.match(livingSrc, /leaveTarget/);
  assert.match(livingSrc, /enterSpawn/);
  assert.match(livingSrc, /enterSit/);
  assert.match(demoSrc, /CompanionRoom/);
});

test("overlay and blotter keep the same call and the same walk", () => {
  assert.equal(Object.keys(OverlayHours.CALL_LINE).length, 210);
  assert.equal(OverlayHours.callLine("field_cricket"), Hours.callLine("field_cricket"));
  assert.equal(OverlayHours.callLine("grouper"), Hours.callLine("grouper"));
  assert.match(blotterHours, /CALL_LINE/);
  assert.match(blotterHours, /def call_line/);
  assert.match(blotterHours, /field_cricket.: "I sang\. Hello\."/);

  const trait = { extra: {} };
  const hidden = { ...OverlayLife.blank(), hidden: true, mood: 50, bond: 10 };
  const back = OverlayLife.act(hidden, trait, "call", Date.now(), "field_cricket");
  assert.equal(back.life.hidden, false);
  assert.equal(back.life.mood, 54);
  assert.equal(back.life.bond, 11);
  assert.equal(back.line, "I sang. Hello.");
  assert.equal(back.cmd, "enter");

  assert.equal(OverlayGait.leaveTarget(80, 800, 176), G.leaveTarget(80, 800, 176));
  assert.equal(OverlayGait.leaveTarget(600, 800, 176), G.leaveTarget(600, 800, 176));
  assert.equal(OverlayGait.enterSpawn(800, 176, 20, true), G.enterSpawn(800, 176, 20, true));
  assert.equal(OverlayGait.enterSit(800, 176, 20, 0), G.enterSit(800, 176, 20, 0));

  assert.match(overlayLifeSrc, /callLine\(key\)/);
  assert.match(overlayPetSrc, /PetGait\.leaveTarget/);
  assert.match(overlayPetSrc, /PetGait\.enterSpawn/);
  assert.match(blotterLife, /bond=clamp\(state\.bond \+ 1\)/);
  assert.match(blotterPet, /leave_target/);
  assert.match(blotterPet, /enter_spawn/);
  assert.doesNotMatch(overlayLifeSrc, /mood \+ 6/);
});
