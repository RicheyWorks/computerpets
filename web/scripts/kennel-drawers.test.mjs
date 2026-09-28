// The kennel drawers pass: the eighteen room pages use the field-notes drawers (/study and /log had them first), the
// /demo plates dock in the panel on a phone, two missing-page links are thumb-sized, /mind is short on a phone, and
// /demo/<unknown> has its own tab title. The real-browser checks are in phone-desk-layout.test.mjs.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(root, p), "utf8");

/** [route file, its guide(s)]. */
export const ROOMS = [
  ["canopy", ["CANOPY_GUIDE"]],
  ["cellar", ["FUNGI_GUIDE"]],
  ["corner", ["CORNER_GUIDE"]],
  ["creek", ["CREEK_GUIDE"]],
  ["far", ["FAR_GUIDE"]],
  ["garden", ["GARDEN_GUIDE"]],
  ["grid", ["GRID_GUIDE"]],
  ["hive", ["INSECT_GUIDE", "BEE_GUIDE"]],
  ["meadow", ["MEADOW_GUIDE"]],
  ["pond", ["POND_GUIDE"]],
  ["reef", ["REEF_GUIDE"]],
  ["roost", ["ROOST_GUIDE"]],
  ["sea", ["SEA_GUIDE"]],
  ["shore", ["SHORE_GUIDE"]],
  ["snakes", ["SNAKE_GUIDE"]],
  ["stone", ["STONE_GUIDE"]],
  ["well", ["WELL_GUIDE"]],
  ["wood", ["WOOD_GUIDE"]],
];

test("every room page's field notes are the drawers, with each guide's words still in the page", () => {
  assert.equal(ROOMS.length, 18);
  for (const [room, guides] of ROOMS) {
    const s = src(`src/routes/${room}.tsx`);
    assert.match(s, /import \{ FieldNotes \} from "@\/components\/desk\/field-notes"/, room);
    for (const g of guides) assert.match(s, new RegExp(`<FieldNotes\\s+notes=\\{${g}\\}`), `${room} ${g}`);
    assert.doesNotMatch(s, /_GUIDE\.map\(/, `${room} still lists its notes one after another`);
    assert.equal((s.match(/<FieldNotes\b/g) || []).length, guides.length, room);
  }
});

test("the field notes take a room's own kicker, words and example, and keep every note's text in the page", () => {
  const s = src("src/components/desk/field-notes.tsx");
  assert.match(s, /kicker = "Field notes"/);
  assert.match(s, /intro\?: ReactNode/);
  assert.match(s, /example \?\? \(notes\[notes\.length - 1\]\?\.species\.toLowerCase\(\)/);
  assert.match(s, /data-note-tell/);
  // A closed drawer still holds its words: the notes are rendered whether open or not (hidden only by a search).
  assert.match(s, /hidden=\{!match\}/);
  assert.doesNotMatch(s, /isOpen \?\s*\(/);
  const hive = src("src/routes/hive.tsx");
  assert.match(hive, /kicker="Bees and comb"/);
  assert.match(src("src/routes/grid.tsx"), /<FieldNotes[\s\S]*?intro=/);
});

test("on a phone /demo docks its weather, news and market plates in the panel, off the hour line", () => {
  const plates = src("src/components/desk/desk-plates.tsx");
  assert.match(plates, /function usePlateChrome\(key: PlateKey, docked = false\)/);
  assert.match(plates, /const DOCKED_PLATE = "desk-plate pointer-events-auto relative w-full/);
  for (const k of ["weather", "news", "market"]) assert.match(plates, new RegExp(`usePlateChrome\\("${k}", docked\\)`), k);
  assert.equal((plates.match(/data-plate-docked=\{docked \? "" : undefined\}/g) || []).length, 3);
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /<div data-demo-plates className="mt-5 max-w-sm space-y-2">/);
  assert.match(room, /<DeskWeatherPlate docked /);
  assert.match(room, /<DeskNewsPlate docked \/>/);
  assert.match(room, /<DeskMarketPlate docked \/>/);
  assert.equal((room.match(/windows=\{demoWindow && !hand \? deskWindows : \[\]\}/g) || []).length, 2);
  assert.doesNotMatch(room, /windows=\{demoWindow \? deskWindows/);
  assert.match(src("src/styles.css"), /\[data-plate-docked\] > button:first-child \{\s*min-height: 2\.75rem;\s*\}/);
});

test("the missing-page links are thumb-sized, and /demo/<unknown> says so in its tab", () => {
  assert.match(src("src/routes/pets.$key.tsx"), /data-back-kennel className="inline-flex min-h-11 items-center/);
  const demo = src("src/routes/demo.$slug.tsx");
  assert.match(demo, /data-demo-missing className="inline-flex min-h-11 items-center/);
  assert.match(demo, /: "No demo here — ComputerPets"/);
  assert.match(demo, /kind \? `\$\{kind\.name\} — ComputerPets`/);
});

test("/mind on a phone: two cards to a row, the chosen one whole with its words, thumb-sized voices and For builders", () => {
  const s = src("src/routes/mind.tsx");
  assert.match(s, /data-mind-cards className="grid grid-flow-row-dense grid-cols-2/);
  assert.match(s, /col-span-2 [^"]*sm:col-span-1/);
  assert.match(s, /\$\{active \? "" : "max-sm:hidden"\}/);
  assert.match(s, /\{presetTag\(preset\)\}/);
  assert.match(s, /<summary className="min-h-11 [^"]*">For builders<\/summary>/);
});

test("both start scripts' check mode ends with what to type next", () => {
  const sh = src("../desktop.sh");
  const ps = src("../desktop.ps1");
  for (const [s, run] of [[sh, "sh desktop.sh"], [ps, ".\\desktop.ps1"]]) {
    assert.ok(s.includes(`next: Type ${run} and press Enter to turn the pets on.`), run);
    assert.ok(s.includes("git lfs install and then git lfs pull"), run);
  }
});
