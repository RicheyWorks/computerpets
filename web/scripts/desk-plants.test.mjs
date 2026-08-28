import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/desk-plants.js"));
const P = await import(pathToFileURL(join(root, "src/lib/pets/desk-plants.ts")).href);
const deskSrc = readFileSync(join(root, "src/components/desk/desk-plants.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");

test("/demo plants are Disk and Felt, drag-placeable, and lean in the wind", () => {
  assert.deepEqual([...P.PLANT_KEYS], Overlay.PLANT_KEYS);
  assert.equal(P.PLANT_NAMES.water_lily, "Disk");
  assert.equal(P.PLANT_NAMES.moss, "Felt");
  const store = {
    data: Object.create(null),
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; },
  };
  const plants = P.loadPlants(800, 480, store);
  assert.equal(plants.length, 2);
  let disk = P.beginDrag(plants[0], plants[0].x + 4, plants[0].y + 4);
  disk = P.moveDrag(disk, 360, 200, 800, 480);
  disk = P.endDrag(disk);
  assert.equal(disk.dragging, false);
  assert.ok(disk.x > 200);
  const gust = P.windLean(0.3, true, false);
  assert.notEqual(gust, 0);
  assert.equal(P.windLean(0.3, true, false), Overlay.windLean(0.3, true, false));
  assert.match(deskSrc, /beginDrag/);
  assert.match(deskSrc, /windLean/);
  assert.match(roomSrc, /DeskPlants/);
});
