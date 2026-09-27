import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = await import(pathToFileURL(join(root, "src/lib/pets/call-guests.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/call-guests.js"));
const roster = createRequire(import.meta.url)(join(root, "../desktop/renderer/roster.json"));
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");

const cardSrc = readFileSync(join(root, "src/components/desk/keeper-card.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const platesSrc = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");
const music = await import(pathToFileURL(join(root, "src/lib/pets/house-music.ts")).href);
const OverlayMusic = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-music.js"));

test("Call lockstep uses the existing dens, not invented groups", () => {
  assert.equal(roster.length, 221);
  assert.match(roomsSrc, /id: "garden"/);
  assert.match(roomsSrc, /id: "roost"/);
  assert.equal(Overlay.CALL_GROUPS.length, G.CALL_GROUPS.length);
  assert.deepEqual(
    G.CALL_GROUPS.map((g) => g.id),
    Overlay.CALL_GROUPS.map((g) => g.id),
  );
  const plants = ["moss", "maidenhair", "ginkgo", "oak", "water_lily", "orchid", "saguaro", "venus_flytrap", "pitcher", "sundew"];
  assert.deepEqual(G.matchCall("plant", roster), plants);
  assert.deepEqual(Overlay.matchCall("plant", roster), plants);
  assert.deepEqual(G.matchCall("Rui", roster), ["red_panda"]);
  assert.deepEqual(G.callKeys("", roster, "roost"), G.CALL_GROUPS.find((g) => g.id === "roost").keys.slice());
  assert.deepEqual(G.callKeys("Rui", roster, "roost"), ["red_panda"]);
});

test("/demo Call sits dropdown, type-in, den picker, and called walkers", () => {
  assert.match(cardSrc, /Call guest dropdown/);
  assert.match(cardSrc, /Call by name or group/);
  assert.match(cardSrc, /Call by den/);
  assert.match(cardSrc, /Call \{FLY_BIRD_NAME\}/);
  assert.match(cardSrc, /onCallGuests/);
  assert.match(cardSrc, /if \(card\.collapsed && !stayOpen\) return null/);
  assert.match(roomSrc, /CalledGuests/);
  assert.match(roomSrc, /setCardOpenTick/);
  assert.match(roomSrc, /collapsed: false/);
});

test("a den of walkers keeps the same overlay nodes across ticks", () => {
  const nodes = [];
  const root = {
    children: nodes,
    appendChild(el) {
      nodes.push(el);
      return el;
    },
    removeChild(el) {
      const i = nodes.indexOf(el);
      if (i >= 0) nodes.splice(i, 1);
      return el;
    },
    replaceChildren() {
      throw new Error("replaceChildren-on-tick");
    },
  };
  function createImg() {
    const el = {
      className: "",
      alt: "",
      dataset: {},
      src: "",
      style: {},
      draggable: false,
      addEventListener() {},
      remove() {
        root.removeChild(el);
      },
    };
    return el;
  }
  const guests = ["cat", "dog", "robin"].map((key, i) => G.beginCalled(key, 800, i, 3));
  const first = Overlay.syncCalledPaint(root, guests, { createImg, frameOf: () => ["a.png", "b.png"] });
  assert.equal(first.added, 3);
  const kept = nodes.slice();
  const stepped = guests.map((g) => G.stepCalled(g, 0.16, 800));
  const second = Overlay.syncCalledPaint(root, stepped, { createImg, frameOf: () => ["a.png", "b.png"] });
  assert.equal(second.added, 0);
  assert.equal(second.reused, 3);
  assert.strictEqual(nodes[0], kept[0]);
  assert.equal(Overlay.syncCalledPaint(root, stepped, { createImg, frameOf: () => ["a.png", "b.png"] }).reused, 3);
});

test("the robin perches on sleeping Rui and does not go gone", () => {
  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  let robin = G.beginCalled("robin", 800, 0, 1);
  robin = G.stepCalled(robin, 0.05, 800, flags);
  assert.equal(robin.phase, "approach-perch");
  for (let i = 0; i < 40 && robin.phase !== "perch"; i++) robin = G.stepCalled(robin, 0.05, 800, flags);
  assert.equal(robin.phase, "perch");
  robin = G.stepCalled(robin, 24, 800, flags);
  assert.equal(robin.phase, "perch");
  assert.equal(G.ROBIN_SONG, Overlay.ROBIN_SONG);
  assert.match(roomSrc, /hostSleeping/);
});

test("radio search splits 99.9 seattle fm and labels the box", () => {
  const q = music.parseRadioQuery("99.9 seattle fm");
  assert.equal(q.freq, "99.9");
  assert.equal(q.place, "seattle");
  const urls = music.radioSearchUrls("99.9 seattle fm");
  assert.ok(urls.some((u) => /name=99\.9/.test(u)));
  assert.ok(urls.some((u) => /seattle/i.test(u)));
  assert.ok(urls.some((u) => /countrycode=US/.test(u)));
  assert.ok(!urls.some((u) => /tag=seattle/.test(u)));
  assert.equal(music.RADIO_LABEL, OverlayMusic.RADIO_LABEL);
  assert.equal(music.RADIO_EMPTY, OverlayMusic.RADIO_EMPTY);
  assert.match(cardSrc, /RADIO_LABEL/);
  assert.match(cardSrc, /RADIO_PLACEHOLDER/);
  assert.match(platesSrc, /AREA_LABEL/);
  assert.match(platesSrc, /Weather area/);
});

test("/demo walkers skip robin and a meet guest can auto-walk in", () => {
  assert.deepEqual(G.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.deepEqual(Overlay.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.equal(G.shouldRobinFly(["robin"], "red_panda"), true);
  assert.equal(G.nextAutoMeet([], "red_panda"), "chickadee");
  assert.equal(Overlay.nextAutoMeet([], "red_panda"), "chickadee");
  assert.match(roomSrc, /nextAutoMeet/);
});

test("/demo Miso loafs Felt grass in Meet lockstep with the overlay", async () => {
  const Plants = await import(pathToFileURL(join(root, "src/lib/pets/desk-plants.ts")).href);
  const felt = Plants.setMode(Plants.defaultSpot("moss", 800, 480, 1), "meet");
  const grass = Plants.grassBound(felt, { width: 800, height: 480, floorLift: 0 });
  const flags = { hostKey: "red_panda", hostX: 80, hostFacing: 1, hostLift: 0, grassBound: grass };
  assert.equal(G.shouldSitGrass("cat", flags), true);
  assert.equal(Overlay.shouldSitGrass("cat", flags), true);
  let miso = G.beginCalled("cat", 800, 0, 1);
  for (let i = 0; i < 80 && miso.phase !== "bound"; i++) miso = G.stepCalled(miso, 0.05, 800, flags);
  assert.equal(miso.phase, "bound");
  assert.equal(G.tellLine(miso), Overlay.CAT_GRASS_LINE);
  assert.match(roomSrc, /CalledGuests/);
});

test("the desk keeps no img paint helpers from the pre-canvas path", async () => {
  const R = await import(pathToFileURL(join(root, "src/lib/pets/robin-fly.ts")).href);
  const P = await import(pathToFileURL(join(root, "src/lib/pets/desk-plants.ts")).href);
  for (const name of ["assignSrc", "assignedSrc", "syncCalledPaint", "destFit", "GUEST_DEST"]) {
    assert.equal(G[name], undefined, name);
  }
  for (const name of ["applyDest", "destStyle"]) {
    assert.equal(R[name], undefined, `robin ${name}`);
    assert.equal(P[name], undefined, `plant ${name}`);
  }
  assert.equal(typeof G.poseFrames, "function");
  assert.equal(typeof G.poseSrc, "function");
  assert.equal(typeof R.destSrc, "function");
  assert.equal(typeof P.plantSrc, "function");
  assert.equal(typeof Overlay.syncCalledPaint, "function");
  assert.equal(typeof Overlay.assignSrc, "function");
});
