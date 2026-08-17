import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const snakesSrc = readFileSync(join(root, "src/lib/pets/snakes.ts"), "utf8");
const guideSrc = readFileSync(join(root, "src/lib/pets/snake-guide.ts"), "utf8");
const denSrc = readFileSync(join(root, "src/routes/snakes.tsx"), "utf8");

const EXPECTED = [
  ["ball_python", "nori", "Python regius"],
  ["corn_snake", "saffron", "Pantherophis guttatus"],
  ["kingsnake", "bandit", "Lampropeltis californiae"],
  ["green_tree_python", "jade", "Morelia viridis"],
  ["hognose", "bluff", "Heterodon nasicus"],
  ["garter", "stripe", "Thamnophis sirtalis"],
  ["boa", "lula", "Boa constrictor"],
  ["milk_snake", "coral", "Lampropeltis gentilis"],
  ["rosy_boa", "blush", "Lichanura trivirgata"],
  ["carpet_python", "atlas", "Morelia spilota cheynei"],
];

function quotedKeys(src) {
  return [...src.matchAll(/key:\s*"([a-z_]+)"/g)].map((m) => m[1]);
}

test("the den lists the same ten snakes as the roster", () => {
  const rosterKeys = quotedKeys(snakesSrc);
  const guideKeys = [...guideSrc.matchAll(/entry\(\s*"([a-z_]+)"/g)].map((m) => m[1]);
  assert.deepEqual(rosterKeys, EXPECTED.map(([key]) => key));
  assert.deepEqual(guideKeys, rosterKeys);
  assert.equal(guideKeys.length, 10);
});

test("each guide entry has a tell, a mix-up, a lesson, and the latin name", () => {
  for (const [key, slug, latin] of EXPECTED) {
    assert.match(guideSrc, new RegExp(`entry\\(\\s*"${key}"`));
    assert.match(snakesSrc, new RegExp(`slug:\\s*"${slug}"`));
    assert.match(guideSrc, new RegExp(latin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const entries = [...guideSrc.matchAll(/entry\(\s*"[a-z_]+"/g)];
  assert.equal(entries.length, 10);
  assert.match(guideSrc, /tell,/);
  assert.match(guideSrc, /mixup,/);
  assert.match(guideSrc, /lesson,/);
  assert.match(guideSrc, /latin,/);
});

test("the important mix-ups are actually taught", () => {
  const milk = guideSrc.slice(guideSrc.indexOf('"milk_snake"'), guideSrc.indexOf('"rosy_boa"'));
  const ball = guideSrc.slice(guideSrc.indexOf('"ball_python"'), guideSrc.indexOf('"corn_snake"'));
  const king = guideSrc.slice(guideSrc.indexOf('"kingsnake"'), guideSrc.indexOf('"green_tree_python"'));
  const boa = guideSrc.slice(guideSrc.indexOf('"boa"'), guideSrc.indexOf('"milk_snake"'));
  assert.match(milk, /coral snake/i);
  assert.match(milk, /red against yellow/i);
  assert.match(milk, /red against black/i);
  assert.match(ball, /boa/i);
  assert.match(boa, /ball python|Nori/i);
  assert.match(king, /coral snake/i);
  assert.match(king, /no red/i);
});

test("the den page is a field guide, not a portrait catalog", () => {
  assert.match(denSrc, /createFileRoute\("\/snakes"\)/);
  assert.match(denSrc, /SnakeDen/);
  assert.match(denSrc, /SpeciesPlaque/);
  assert.match(denSrc, /\/demo\/\$slug/);
  assert.match(denSrc, /SNAKE_GUIDE\.map/);
});
