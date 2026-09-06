const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const P = require("./desk-plants.js");

const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const cssSrc = readFileSync(join(__dirname, "styles.css"), "utf8");

test("Disk and Felt are existing garden guests, not a new taxon", () => {
  assert.deepEqual(P.PLANT_KEYS, ["water_lily", "moss"]);
  assert.equal(P.PLANT_NAMES.water_lily, "Disk");
  assert.equal(P.PLANT_NAMES.moss, "Felt");
  assert.equal(existsSync(join(__dirname, "sprites/water_lily/idle/1.png")), true);
  assert.equal(existsSync(join(__dirname, "sprites/moss/idle/1.png")), true);
  assert.match(htmlSrc, /id="plants"/);
  assert.match(cssSrc, /\.desk-plant[\s\S]{0,240}object-fit:\s*contain/);
  assert.match(petSrc, /sitPlants/);
  assert.match(petSrc, /PetDeskPlants/);
});

test("plants drag to a new spot and stay, and lean in the wind", () => {
  const store = {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
  const plants = P.loadPlants(800, 480, store);
  assert.equal(plants.length, 2);
  assert.equal(plants[0].key, "water_lily");
  assert.equal(plants[1].key, "moss");
  let disk = P.beginDrag(plants[0], plants[0].x + 10, plants[0].y + 10);
  assert.equal(disk.dragging, true);
  assert.equal(disk.selected, true);
  disk = P.moveDrag(disk, 400, 220, 800, 480);
  assert.ok(Math.abs(disk.x - 390) < 2);
  disk = P.endDrag(disk);
  assert.equal(disk.dragging, false);
  P.savePlants([{ key: disk.key, x: disk.x, y: disk.y }, plants[1]], store);
  const again = P.loadPlants(800, 480, store);
  assert.ok(Math.abs(again[0].x - disk.x) < 1);
  const gust = P.windLean(0.25, true, false);
  const still = P.windLean(0.25, false, false);
  assert.notEqual(gust, 0);
  assert.ok(Math.abs(gust) > Math.abs(still));
  const src = P.plantSrc("water_lily", { idle: ["sprites/water_lily/idle/1.png"] });
  assert.notEqual(src, "");
  const img = { style: {}, setAttribute(n, v) { this[n] = v; } };
  assert.equal(P.applyDest(img), true);
  assert.equal(img.style.objectFit, "contain");
  assert.match(P.paintTransform(disk, 4), /rotate\(4deg\)/);
});

test("click sets Still with no wind, Wind restores sway, Meet is the grass sit", () => {
  assert.deepEqual(P.PLANT_MODES, ["still", "wind", "meet"]);
  assert.equal(P.defaultMode("moss"), "meet");
  assert.equal(P.defaultMode("water_lily"), "wind");
  assert.equal(P.isGrass("moss"), true);
  assert.equal(P.isGrass("water_lily"), false);
  const store = {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
  let plants = P.loadPlants(800, 480, store);
  const felt = plants.find((p) => p.key === "moss");
  assert.equal(felt.mode, "meet");
  const still = P.setMode(felt, "still");
  assert.equal(P.windLean(0.25, true, false, still.mode), 0);
  const wind = P.setMode(still, "wind");
  assert.notEqual(P.windLean(0.25, true, false, wind.mode), 0);
  const meet = P.setMode(wind, "meet");
  const bound = P.grassBound(meet, { width: 800, height: 480, floorLift: 0 });
  assert.ok(bound);
  assert.equal(bound.kind, "grass");
  assert.ok(Math.abs(bound.x - (meet.x + P.DEST_PX * 0.38)) < 1);
  const frozen = P.setMode(meet, "still");
  assert.equal(P.grassBound(frozen, { width: 800, height: 480 }), null);
  P.savePlants([plants[0], meet], store);
  const again = P.loadPlants(800, 480, store);
  assert.equal(again[1].mode, "meet");
  assert.equal(P.clickMoved(2, 2), false);
  assert.equal(P.clickMoved(20, 0), true);
  assert.deepEqual(P.plantChoiceMarks().map((m) => m.id), ["still", "wind", "meet"]);
  assert.equal(P.plantPick("wind"), "wind");
  assert.match(petSrc, /openPlantChoice/);
  assert.match(petSrc, /clickMoved/);
  assert.match(petSrc, /plant-choice/);
  assert.match(htmlSrc, /id="plant-choice"/);
});
