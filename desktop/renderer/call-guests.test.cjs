const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const G = require("./call-guests.js");
const roster = require("./roster.json");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const styleSrc = readFileSync(join(__dirname, "styles.css"), "utf8");
const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");

test("Call matches a name, a group string, and a den picker", () => {
  assert.equal(roster.length, 220);
  assert.deepEqual(G.matchCall("Rui", roster), ["red_panda"]);
  assert.deepEqual(G.matchCall("Sip", roster), ["hummingbird"]);
  assert.deepEqual(G.matchCall("Miso", roster), ["cat"]);
  const plants = G.matchCall("plant", roster);
  assert.equal(plants.length, 10);
  assert.ok(plants.includes("moss"));
  assert.ok(plants.includes("sundew"));
  assert.ok(!plants.includes("kelp"));
  const garden = G.callKeys("", roster, "garden");
  assert.deepEqual(garden, plants);
  assert.deepEqual(G.callKeys("Rui", roster, "roost"), ["red_panda"]);
  assert.equal(G.matchCall("no-such-guest", roster).length, 0);
  assert.equal(G.CALL_EMPTY, "no guest from that look-up");
});

test("a den of walkers keeps the same img nodes across ticks", () => {
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
  const guests = ["cat", "dog", "robin", "crow"].map((key, i) => ({
    ...G.beginCalled(key, 800, i, 4),
    name: key,
    frame: 0,
  }));
  const first = G.syncCalledPaint(root, guests, { createImg, frameOf: () => ["a.png", "b.png"] });
  assert.equal(first.added, 4);
  const kept = nodes.slice();
  const stepped = guests.map((g) => G.stepCalled(g, 0.16, 800));
  stepped[0].frame = 1;
  const second = G.syncCalledPaint(root, stepped, { createImg, frameOf: () => ["a.png", "b.png"] });
  assert.equal(second.added, 0);
  assert.equal(second.reused, 4);
  assert.equal(nodes.length, 4);
  assert.strictEqual(nodes[0], kept[0]);
  assert.strictEqual(nodes[3], kept[3]);
  assert.match(petSrc, /syncCalledPaint/);
  assert.doesNotMatch(petSrc, /calledRoot\.replaceChildren\(\)/);
});

test("the robin lands on sleeping Rui, stays, and sings — MIN_STAY does not vanish a perch", () => {
  assert.equal(G.PERCH_BIRD_KEY, "robin");
  assert.equal(G.ROBIN_SONG.length > 4, true);
  const flags = { hostKey: "red_panda", hostSleeping: true, hostX: 200, hostFacing: 1, hostLift: 0 };
  assert.equal(G.shouldPerchCalled("robin", flags), true);
  assert.equal(G.shouldPerchCalled("cat", flags), false);
  let robin = G.beginCalled("robin", 800, 0, 1);
  robin = G.stepCalled(robin, 0.05, 800, flags);
  assert.equal(robin.phase, "approach-perch");
  for (let i = 0; i < 40 && robin.phase !== "perch"; i++) {
    robin = G.stepCalled(robin, 0.05, 800, flags);
  }
  assert.equal(robin.phase, "perch");
  const parked = robin;
  robin = G.stepCalled(robin, 30, 800, flags);
  assert.equal(robin.phase, "perch");
  assert.ok(Math.abs(robin.x - parked.x) < 8);
  assert.ok(robin.lift >= 28 && robin.lift <= 52);
  assert.equal(G.shouldSing(robin), true);
  const sung = G.markSung(robin);
  assert.equal(G.shouldSing(sung), false);
  robin = G.stepCalled(robin, 0.1, 800, { ...flags, hostSleeping: false });
  assert.notEqual(robin.phase, "gone");
  assert.notEqual(robin.phase, "perch");
});

test("called guests walk, stay, and can be dismissed", () => {
  const walk = G.beginCalled("cat", 800, 0, 1);
  assert.equal(walk.phase, "in");
  const later = G.stepCalled(walk, 2, 800);
  assert.ok(G.stillVisible(later));
  const gone = G.dismissCalled(later);
  assert.equal(gone.dismissed, true);
  assert.equal(gone.phase, "leave");
  assert.deepEqual(G.walkersOf(["hummingbird", "cat"], "red_panda"), ["cat"]);
  assert.deepEqual(G.walkersOf(["hummingbird", "robin", "cat"], "red_panda"), ["cat"]);
  assert.equal(G.shouldFly(["hummingbird", "moss"], "red_panda"), true);
  assert.equal(G.shouldRobinFly(["robin", "cat"], "red_panda"), true);
  assert.equal(G.shouldRobinFly(["cat"], "red_panda"), false);
  assert.equal(G.nextAutoMeet([], "red_panda"), "chickadee");
  assert.equal(G.nextAutoMeet(["chickadee"], "red_panda"), "cat");
  const dest = { style: {}, setAttribute(n, v) { this[n] = v; } };
  assert.equal(G.destFit(dest), true);
  assert.equal(dest.style.objectFit, "contain");
  assert.equal(dest.style.border, "0");
});

test("overlay Call sits the card and the floor, and click-through does not eat type-in", () => {
  assert.match(htmlSrc, /Call Sip/);
  assert.match(htmlSrc, /id="hud-call-q"/);
  assert.match(htmlSrc, /id="hud-call-pick"/);
  assert.match(htmlSrc, /id="hud-call-group"/);
  assert.match(htmlSrc, /id="called"/);
  assert.match(htmlSrc, /call-guests\.js/);
  assert.match(petSrc, /setFocusable/);
  assert.match(petSrc, /openKeeperCard/);
  assert.match(petSrc, /spawnCalled/);
  assert.match(styleSrc, /#hud\[data-collapsed="1"\][\s\S]*display:\s*none/);
  assert.match(styleSrc, /input[\s\S]*user-select:\s*text/);
  assert.match(preloadSrc, /setFocusable/);
  assert.match(mainSrc, /set-focusable/);
  assert.match(mainSrc, /sandbox:\s*true/);
  assert.match(mainSrc, /contextIsolation:\s*true/);
  assert.match(mainSrc, /nodeIntegration:\s*false/);
  assert.doesNotMatch(petSrc, /hid a ribbon/);
});

test("Miso loafs the Felt grass bound when the plant is in Meet", () => {
  const P = require("./desk-plants.js");
  const felt = P.setMode(P.defaultSpot("moss", 800, 480, 1), "meet");
  const grass = P.grassBound(felt, { width: 800, height: 480, floorLift: 0 });
  assert.ok(grass);
  assert.equal(G.GRASS_LIE_KEY, "cat");
  const flags = { hostKey: "red_panda", hostX: 80, hostFacing: 1, hostLift: 0, grassBound: grass };
  assert.equal(G.shouldSitGrass("cat", flags), true);
  assert.equal(G.shouldSitBound("cat", flags), true);
  assert.equal(G.shouldSitGrass("dog", flags), false);
  let miso = G.beginCalled("cat", 800, 0, 1);
  for (let i = 0; i < 80 && miso.phase !== "bound"; i++) miso = G.stepCalled(miso, 0.05, 800, flags);
  assert.equal(miso.phase, "bound");
  assert.ok(Math.abs(miso.x - grass.x) < 2);
  assert.equal(miso.boundKind, "grass");
  assert.equal(G.tellLine(miso), G.CAT_GRASS_LINE);
  const sit = ["sprites/cat/sit/1.png"];
  assert.ok(G.poseSrc(miso, { sit, walk: ["w.png"] }).includes("cat/sit/"));
  const stillFlags = { ...flags, grassBound: null };
  assert.equal(G.shouldSitGrass("cat", stillFlags), false);
});
