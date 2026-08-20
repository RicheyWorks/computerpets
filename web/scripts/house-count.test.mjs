import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");
const shellSrc = readFileSync(join(root, "src/components/app-shell.tsx"), "utf8");
const meetSrc = readFileSync(join(root, "src/routes/meet.tsx"), "utf8");
const rootSrc = readFileSync(join(root, "src/routes/__root.tsx"), "utf8");
const ogSrc = readFileSync(join(root, "scripts/og-card.html"), "utf8");
const readmeSrc = readFileSync(join(repo, "README.md"), "utf8");
const webReadmeSrc = readFileSync(join(root, "README.md"), "utf8");

const KEYS = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);

const SHORE = [
  "fiddler_crab",
  "ghost_crab",
  "limpet",
  "barnacle",
  "chiton",
  "periwinkle",
  "sand_dollar",
  "sea_urchin",
  "knobbed_whelk",
  "lugworm",
];
const MEADOW = [
  "field_cricket",
  "katydid",
  "grasshopper",
  "swallowtail",
  "jewelwing",
  "lacewing",
  "earwig",
  "acorn_weevil",
  "click_beetle",
  "robber_fly",
];

test("the catalog is one hundred ninety, once each", () => {
  assert.equal(KEYS.length, 190);
  assert.equal(new Set(KEYS).size, 190);
  for (const key of SHORE) assert.ok(KEYS.includes(key), key);
  for (const key of MEADOW) assert.ok(KEYS.includes(key), key);
});

test("the house copy says one hundred ninety, not a leftover count", () => {
  assert.match(readmeSrc, /One hundred ninety guests walk the blotter/);
  assert.match(readmeSrc, /One hundred ninety living kinds/);
  assert.doesNotMatch(readmeSrc, /One hundred thirty living kinds/);
  assert.doesNotMatch(readmeSrc, /One hundred seventy/);
  assert.doesNotMatch(readmeSrc, /One hundred sixty/);
  assert.match(meetSrc, /One hundred ninety guests walk the blotter/);
  assert.match(meetSrc, /One hundred ninety, on their shelves/);
  assert.doesNotMatch(meetSrc, /One hundred seventy/);
  assert.match(rootSrc, /One hundred ninety living desk companions/);
  assert.match(rootSrc, /a shore of ten strand guests/);
  assert.match(rootSrc, /a meadow of ten grass-and-night insects/);
  assert.doesNotMatch(rootSrc, /One hundred seventy/);
  assert.match(ogSrc, /One hundred ninety living demos/);
  assert.doesNotMatch(ogSrc, /One hundred twenty/);
  assert.match(webReadmeSrc, /\*\*190\*\* living kinds/);
});

test("shore and meadow walk the same den door as the other rooms", () => {
  assert.match(roomsSrc, /path: "\/shore"/);
  assert.match(roomsSrc, /path: "\/meadow"/);
  assert.match(roomsSrc, /watchSlug: "wave"/);
  assert.match(roomsSrc, /watchSlug: "chirp"/);
  assert.match(shellSrc, /to: "\/shore"/);
  assert.match(shellSrc, /to: "\/meadow"/);
  const header = shellSrc.slice(shellSrc.indexOf("<header"), shellSrc.indexOf("</header>"));
  assert.match(header, /shore \|\| meadow/);
  const bleed = shellSrc.slice(shellSrc.indexOf("{desk || demo"), shellSrc.indexOf("mx-auto max-w-6xl px-4 py-8"));
  assert.match(bleed, /shore \|\| meadow/);
});
