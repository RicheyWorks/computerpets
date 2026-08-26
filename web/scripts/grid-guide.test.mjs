import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gridSrc = readFileSync(join(root, "src/lib/pets/grid.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/grid-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/grid.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const rosterSrc = readFileSync(join(root, "src/lib/pets/roster.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const stoneSrc = readFileSync(join(root, "src/lib/pets/stone.ts"), "utf8");
const beesSrc = readFileSync(join(root, "src/lib/pets/bees.ts"), "utf8");
const hiveDenSrc = readFileSync(join(root, "src/components/desk/hive-den.tsx"), "utf8");
const walkerSrc = readFileSync(join(root, "scripts/house_walkers.py"), "utf8");

const EXPECTED = [
  ["cyber_dragon", "arc", "Draco reticulum"],
  ["volt_dragon", "volt", "Draco spira"],
  ["trace_dragon", "trace", "Draco semita"],
  ["flux_dragon", "flux", "Draco campus"],
  ["spark_dragon", "spark", "Draco scintilla"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the grid lists the same five guests as the roster", () => {
  const rosterKeys = quotedKeys(gridSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 5);
});

test("the guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(gridSrc, new RegExp(`slug:\\s*"${slug}"`));
    assert.match(guideSrc, new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const entries = [...guideSrc.matchAll(/entry\(\s*"[a-z_]+"/g)];
  assert.equal(entries.length, 5);
  assert.match(guideSrc, /tell,/);
  assert.match(guideSrc, /mixup,/);
  assert.match(guideSrc, /lesson,/);
  assert.match(guideSrc, /latin,/);
});

test("the important mix-up is actually taught", () => {
  const arc = guideSrc.slice(guideSrc.indexOf('"cyber_dragon"'), guideSrc.indexOf('"volt_dragon"'));
  assert.match(arc, /not Vesper/i);
  assert.match(arc, /mantel/);
  assert.match(arc, /grid/i);
  assert.doesNotMatch(arc, /Wikipedia/i);
  const volt = guideSrc.slice(guideSrc.indexOf('"volt_dragon"'), guideSrc.indexOf('"trace_dragon"'));
  assert.match(volt, /not Arc/i);
  assert.match(volt, /coil/i);
  assert.match(volt, /ribs/i);
  assert.doesNotMatch(volt, /Wikipedia/i);
  const trace = guideSrc.slice(guideSrc.indexOf('"trace_dragon"'), guideSrc.indexOf('"flux_dragon"'));
  assert.match(trace, /not Arc/i);
  assert.match(trace, /not Volt/i);
  assert.match(trace, /path/i);
  assert.match(trace, /circuit-trace/i);
  assert.doesNotMatch(trace, /Wikipedia/i);
  const flux = guideSrc.slice(guideSrc.indexOf('"flux_dragon"'), guideSrc.indexOf('"spark_dragon"'));
  assert.match(flux, /not Arc/i);
  assert.match(flux, /not Volt/i);
  assert.match(flux, /not Trace/i);
  assert.match(flux, /field/i);
  assert.match(flux, /heat-field/i);
  assert.doesNotMatch(flux, /Wikipedia/i);
  const spark = guideSrc.slice(guideSrc.indexOf('"spark_dragon"'));
  assert.match(spark, /not Arc/i);
  assert.match(spark, /not Volt/i);
  assert.match(spark, /not Trace/i);
  assert.match(spark, /not Flux/i);
  assert.match(spark, /crackle/i);
  assert.match(spark, /crackle-points/i);
  assert.doesNotMatch(spark, /Wikipedia/i);
});

test("the grid page is a field guide, not a costume party", () => {
  assert.match(denSrc, /createFileRoute\("\/grid"\)/);
  assert.match(denSrc, /GridDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /GRID_GUIDE\.map/);
  assert.match(denSrc, /a grid dragon is not a mantel dragon/i);
  assert.match(denSrc, /Arc is not Vesper/);
  assert.match(denSrc, /Volt is not Arc/);
  assert.match(denSrc, /Trace is not Arc/);
  assert.match(denSrc, /Flux is not Trace/);
  assert.match(denSrc, /Spark is not Flux/);
  assert.doesNotMatch(denSrc, /Wikipedia/i);
  assert.doesNotMatch(denSrc, /NFT/i);
  assert.doesNotMatch(denSrc, /cyber-scorpion/i);
});

test("the catalog and living roster include the five grid keys", () => {
  assert.match(catalogSrc, /key:\s*"cyber_dragon"/);
  assert.match(catalogSrc, /displayName:\s*"Grid Dragon"/);
  assert.match(catalogSrc, /rarity:\s*"LEGENDARY"/);
  assert.match(catalogSrc, /key:\s*"volt_dragon"/);
  assert.match(catalogSrc, /displayName:\s*"Coil Dragon"/);
  assert.match(catalogSrc, /key:\s*"trace_dragon"/);
  assert.match(catalogSrc, /displayName:\s*"Path Dragon"/);
  assert.match(catalogSrc, /key:\s*"flux_dragon"/);
  assert.match(catalogSrc, /displayName:\s*"Field Dragon"/);
  assert.match(catalogSrc, /key:\s*"spark_dragon"/);
  assert.match(catalogSrc, /displayName:\s*"Crack Dragon"/);
  assert.match(rosterSrc, /GRID_ROSTER/);
  assert.doesNotMatch(gridSrc, /key:\s*"dragon"/);
  assert.doesNotMatch(gridSrc, /key:\s*"red_panda"/);
  assert.doesNotMatch(gridSrc, /name:\s*"Vesper"/);
  assert.doesNotMatch(gridSrc, /name:\s*"Rui"/);
  assert.doesNotMatch(guideSrc, /Wikipedia/i);
});

test("rooms.ts adds a grid room that still watches Arc", () => {
  assert.match(roomsSrc, /id:\s*"grid"/);
  assert.match(roomsSrc, /watchSlug:\s*"arc"/);
  assert.match(roomsSrc, /watchName:\s*"Arc"/);
  assert.match(roomsSrc, /Five of the grid\. Not Vesper\./);
  assert.match(roomsSrc, /isGrid/);
});

test("the stone, hive, and walker elifs for other guests stay theirs", () => {
  assert.doesNotMatch(stoneSrc, /cyber_dragon|slug:\s*"arc"/);
  assert.doesNotMatch(beesSrc, /cyber_dragon/);
  assert.doesNotMatch(hiveDenSrc, /GridDen|GRID_KEYS|\/grid/);
  assert.match(walkerSrc, /elif key == "tuatara":/);
  assert.match(walkerSrc, /elif key == "cyber_dragon":/);
  assert.match(walkerSrc, /elif key == "volt_dragon":/);
  assert.match(walkerSrc, /elif key == "trace_dragon":/);
  assert.match(walkerSrc, /elif key == "flux_dragon":/);
  assert.match(walkerSrc, /elif key == "spark_dragon":/);
  const tan = walkerSrc.slice(walkerSrc.indexOf("TAN_SIT ="), walkerSrc.indexOf("}", walkerSrc.indexOf("TAN_SIT =")) + 1);
  assert.doesNotMatch(tan, /cyber_dragon/);
  assert.doesNotMatch(tan, /volt_dragon/);
  assert.doesNotMatch(tan, /trace_dragon/);
  assert.doesNotMatch(tan, /flux_dragon/);
  assert.doesNotMatch(tan, /spark_dragon/);
  const dark = walkerSrc.slice(walkerSrc.indexOf("DARK_MATTE ="), walkerSrc.indexOf("}", walkerSrc.indexOf("DARK_MATTE =")) + 1);
  assert.doesNotMatch(dark, /cyber_dragon/);
  assert.doesNotMatch(dark, /volt_dragon/);
  assert.doesNotMatch(dark, /trace_dragon/);
  assert.doesNotMatch(dark, /flux_dragon/);
  assert.doesNotMatch(dark, /spark_dragon/);
  assert.match(tan, /morel/);
  assert.match(tan, /lions_mane/);
  assert.match(tan, /rosy_boa/);
  assert.match(tan, /yeast/);
});
