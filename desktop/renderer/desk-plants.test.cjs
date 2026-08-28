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
