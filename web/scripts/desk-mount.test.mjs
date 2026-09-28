// Mount tests: the real LivingPet and the desk's guests rendered with React into a small DOM
// (scripts/mount-dom.mjs), their animation frames stepped by hand. A function inside each one is made
// to throw, and the test reads what is on screen afterwards: the pet back on the floor in an idle frame,
// a broken guest gone, and every loop still running.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { mountSetup } from "./mount-setup.mjs";

let m;
let living;

before(async () => {
  m = await mountSetup({
    faults: {
      "lib/pets/cat-tricks.ts": ["stepTrick"],
      "lib/pets/robin-fly.ts": ["stepRobinFly"],
      "lib/pets/bird-fly.ts": ["stepFly"],
      "lib/pets/call-guests.ts": ["stepCalled"],
      "lib/pets/desk-plants.ts": ["windLean"],
      "lib/pets/ribbon.ts": ["carryX"],
    },
  });
  living = await m.load("lib/pets/living.ts");
});

/** Throws on call number `at` only (1-based); counts every call. */
function throwOnce(at, message) {
  const f = (...args) => {
    f.calls += 1;
    f.args = args;
    if (f.calls === at) throw new Error(message);
  };
  f.calls = 0;
  return f;
}

function lift(transform) {
  const hit = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(transform || "");
  return hit ? Number(hit[2]) : NaN;
}

function rot(transform) {
  const hit = /rotate\(([-\d.e]+)deg\)/.exec(transform || "");
  return hit ? Number(hit[1]) : NaN;
}

function newLogs(from) {
  return m.logs.slice(from);
}

test("LivingPet: a trick that throws puts the pet back on the floor in an idle frame, and the loop keeps running", async () => {
  const { LivingPet } = await m.load("components/desk/living-pet.tsx");
  const cat = living.livingByKey("cat");
  const logs0 = m.logs.length;
  const trick = throwOnce(3, "injected trick fault");
  m.fault("stepTrick", trick);
  const s = m.stage();
  // Music on: the cat starts a dance on the first frame. No windows, so no window play.
  await s.render(m.h(LivingPet, { kind: "cat", sprites: cat.sprites, musicOn: true, windows: [] }));
  const hit = s.container.querySelector("[data-pet-hit]");
  const art = s.container.querySelector("[data-pet-art]");
  assert.ok(hit && art, "the pet and its canvas are on the page");
  assert.match(art.dataset.frame, /^\/sprites\/cat\/idle\/1\.png$/, "it starts on its first idle frame");

  await m.frames(1, 16); // the first frame starts the dance, still standing on the floor
  const floor = lift(hit.style.transform);
  assert.ok(Number.isFinite(floor));
  await m.frames(2, 16);
  assert.equal(trick.calls, 2, "two trick steps ran before the broken one");
  assert.doesNotMatch(art.dataset.frame, /\/idle\//, "the dance is on screen: not an idle frame");
  assert.notEqual(rot(hit.style.transform), 0, "the dance tilts the pet");

  await m.frames(1, 16); // the third trick step throws
  assert.equal(trick.calls, 3);
  const logs = newLogs(logs0);
  assert.deepEqual(logs, ["desk frame error (cat): Error: injected trick fault. That pet goes back to idle and keeps moving."]);

  await m.frames(1, 16); // the next frame paints the reset pet
  assert.match(art.dataset.frame, /^\/sprites\/cat\/idle\/\d+\.png$/, "back on an idle frame on screen");
  assert.equal(rot(hit.style.transform), 0, "no tilt left over from the trick");
  assert.equal(lift(hit.style.transform), floor, "feet back on the floor");

  const before1 = hit.style.transform;
  await m.frames(60, 16);
  assert.notEqual(hit.style.transform, before1, "the loop still runs (the idle breath moves the pet)");
  assert.equal(trick.calls, 3, "music does not restart the broken dance straight away");
  assert.match(art.dataset.frame, /\/idle\//);
  assert.ok(m.pending() >= 1, "a next frame is asked for");

  await m.frames(600, 16); // about ten seconds: the eight-second hold is over, music starts a dance again
  assert.ok(trick.calls > 3, "the next dance runs once the hold is over");
  assert.equal(newLogs(logs0).length, 1, "logged once");
  m.fault("stepTrick", null);
  await s.unmount();
});

test("LivingPet with the robin: a broken flight sends the robin away, the pet keeps moving, and the next call flies", async () => {
  const { LivingPet } = await m.load("components/desk/living-pet.tsx");
  const { RobinFlyer } = await m.load("components/desk/robin-fly.tsx");
  const cat = living.livingByKey("cat");
  const logs0 = m.logs.length;
  const fly = throwOnce(5, "injected flight fault");
  m.fault("stepRobinFly", fly);
  const seen = [];
  const onVisible = (on) => seen.push(on);
  const s = m.stage();
  const view = (startId) =>
    m.h(
      "div",
      null,
      m.h(LivingPet, { kind: "cat", sprites: cat.sprites, windows: [] }),
      m.h(RobinFlyer, { startId, onVisible, hostKey: "cat" }),
    );
  await s.render(view(1));
  const robin = s.container.querySelector("[data-robin]");
  const hit = s.container.querySelector("[data-pet-hit]");
  assert.ok(robin && hit);
  assert.deepEqual(seen, [true]);

  await m.frames(4, 16);
  assert.match(robin.style.transform, /translate3d/, "the robin is flying on screen");
  assert.notEqual(robin.style.visibility, "hidden");

  await m.frames(1, 16); // the fifth step throws
  assert.equal(robin.style.visibility, "hidden", "the robin leaves the desk instead of hanging mid-air");
  assert.deepEqual(seen, [true, false], "the desk is told the robin is gone");
  assert.deepEqual(newLogs(logs0), ["desk frame error (robin): Error: injected flight fault. The robin leaves the desk; the other pets keep moving."]);

  const petBefore = hit.style.transform;
  await m.frames(30, 16);
  assert.equal(fly.calls, 5, "that flight's loop has stopped");
  assert.notEqual(hit.style.transform, petBefore, "the pet keeps moving");

  await s.render(view(2)); // call the robin again
  assert.notEqual(robin.style.visibility, "hidden", "a new call shows the robin again");
  await m.frames(3, 16);
  const a = robin.style.transform;
  await m.frames(3, 16);
  assert.notEqual(robin.style.transform, a, "and it flies");
  assert.deepEqual(seen, [true, false, true]);
  assert.equal(newLogs(logs0).length, 1);
  m.fault("stepRobinFly", null);
  await s.unmount();
});

test("BirdFlyer: a broken flight sends the bird away and the next call flies", async () => {
  const { BirdFlyer } = await m.load("components/desk/bird-fly.tsx");
  const logs0 = m.logs.length;
  const fly = throwOnce(4, "injected bird fault");
  m.fault("stepFly", fly);
  const seen = [];
  const onVisible = (on) => seen.push(on);
  const s = m.stage();
  await s.render(m.h(BirdFlyer, { startId: 1, onVisible }));
  const bird = s.container.querySelector("[data-bird]");
  await m.frames(3, 16);
  assert.match(bird.style.transform, /translate3d/);
  await m.frames(1, 16);
  assert.equal(bird.style.visibility, "hidden");
  assert.deepEqual(seen, [true, false]);
  assert.match(newLogs(logs0)[0], /^desk frame error \(hummingbird\): Error: injected bird fault\. The bird leaves the desk/);
  await m.frames(10, 16);
  assert.equal(fly.calls, 4, "that flight's loop has stopped");
  await s.render(m.h(BirdFlyer, { startId: 2, onVisible }));
  await m.frames(3, 16);
  const a = bird.style.transform;
  await m.frames(3, 16);
  assert.notEqual(bird.style.visibility, "hidden");
  assert.notEqual(bird.style.transform, a);
  assert.equal(newLogs(logs0).length, 1);
  m.fault("stepFly", null);
  await s.unmount();
});

test("CalledGuests: one guest that throws leaves; the other keeps walking", async () => {
  const { CalledGuests } = await m.load("components/desk/called-guests.tsx");
  const logs0 = m.logs.length;
  let calls = 0;
  m.fault("stepCalled", (guest) => {
    calls += 1;
    if (guest && guest.key === "rabbit") throw new Error("injected walk fault");
  });
  const s = m.stage();
  await s.render(m.h(CalledGuests, { keys: ["dog", "rabbit"], hostKey: "cat", windows: [] }));
  const dog = s.container.querySelector('[data-called="dog"]');
  const rabbit = s.container.querySelector('[data-called="rabbit"]');
  assert.ok(dog && rabbit, "both guests are on the page");
  await m.frames(1, 16);
  assert.equal(rabbit.style.display, "none", "the broken guest is gone from the desk");
  assert.notEqual(dog.style.display, "none");
  const a = dog.style.transform;
  await m.frames(20, 16);
  assert.notEqual(dog.style.transform, a, "the other guest keeps walking in");
  assert.equal(rabbit.style.display, "none");
  assert.deepEqual(newLogs(logs0), ["desk frame error (rabbit): Error: injected walk fault. That guest leaves the desk; the other pets keep moving."]);
  assert.ok(calls >= 21);
  m.fault("stepCalled", null);
  await s.unmount();
});

test("DeskPlants: a lean that throws stands the plants upright and the wind keeps going", async () => {
  const { DeskPlants } = await m.load("components/desk/desk-plants.tsx");
  const logs0 = m.logs.length;
  const lean = throwOnce(5, "injected wind fault");
  m.fault("windLean", lean);
  m.window.localStorage.clear();
  const s = m.stage();
  await s.render(m.h(DeskPlants, { windOn: true }));
  const plants = s.container.querySelectorAll("[data-plant]").filter((el) => el.getAttribute("data-mode") !== "still");
  assert.ok(plants.length >= 1, "a plant that sways is on the page");
  const plant = plants[0];
  const upright = plant.style.transform;
  await m.frames(4, 40);
  const swaying = plant.style.transform;
  assert.notEqual(swaying, upright, "the plant leans in the wind");
  await m.frames(1, 40); // the fifth lean throws
  assert.equal(plant.style.transform, upright, "upright again after the throw");
  assert.deepEqual(newLogs(logs0), ["desk frame error (plants): Error: injected wind fault. The plants stand upright and the wind keeps going."]);
  await m.frames(4, 40);
  assert.ok(lean.calls > 5, "the loop keeps running");
  assert.notEqual(plant.style.transform, upright, "and the plant sways again");
  m.fault("windLean", null);
  await s.unmount();
});

test("BlotterMarks: a carry that throws leaves the ribbon where it was and it keeps following", async () => {
  const { BlotterMarks } = await m.load("components/desk/blotter.tsx");
  const logs0 = m.logs.length;
  const carry = throwOnce(3, "injected carry fault");
  m.fault("carryX", carry);
  const poseRef = { current: { x: 200, facing: 1 } };
  const s = m.stage();
  const noop = () => {};
  await s.render(m.h(BlotterMarks, { mark: { kind: "lure", x: 200, carried: true }, poseRef, onDropTreat: noop, onCatchLure: noop }));
  const lure = s.container.querySelector(".desk-lure") ?? s.container.querySelector('[aria-label="Catch the ribbon"]');
  assert.ok(lure);
  await m.frames(2, 16);
  const held = lure.style.left;
  poseRef.current = { x: 420, facing: 1 };
  await m.frames(1, 16); // the third carry throws
  assert.equal(lure.style.left, held, "the ribbon stays where it was drawn last");
  assert.deepEqual(newLogs(logs0), ["desk frame error (carried lure): Error: injected carry fault. The lure stays where it is and keeps following on the next frame."]);
  await m.frames(1, 16);
  assert.notEqual(lure.style.left, held, "the next frame follows the pet again");
  assert.ok(carry.calls >= 4);
  m.fault("carryX", null);
  await s.unmount();
});
