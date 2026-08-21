import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = await import(join(root, "src/lib/pets/care.ts"));
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const liveSrc = readFileSync(join(root, "src/components/desk/live-stage.tsx"), "utf8");
const deskSrc = readFileSync(join(root, "src/components/desk/desk-stage.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");
const roomsSrc = readFileSync(join(root, "src/lib/pets/rooms.ts"), "utf8");

const now = 1_700_000_000_000;
const RUI = "computerpets.desk.red_panda.v1";
const CHIRP = "computerpets.desk.field_cricket.v1";

function guest(over = {}) {
  return {
    ...C.blankCare(now),
    ...over,
    bornAt: now,
    lastTick: over.lastTick ?? now,
  };
}

function memoryStore() {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => {
      mem.set(k, String(v));
    },
    removeItem: (k) => {
      mem.delete(k);
    },
    clear: () => mem.clear(),
  };
  return mem;
}

test("a kind change keeps the leaving guest and sits the arriving one", () => {
  const mem = memoryStore();
  const rui = guest({ hunger: 22, hidden: true, bond: 40, mood: 31 });
  const chirp = guest({ hunger: 78, hidden: false, bond: 18, mood: 74 });
  C.saveCare(RUI, rui);
  C.saveCare(CHIRP, chirp);

  const sat = C.switchGuest(
    { localKey: RUI, stats: { ...rui, hunger: 11, mess: [{ id: 1, x: 20 }] } },
    { localKey: CHIRP, speciesKey: "field_cricket" },
    true,
    now,
  );

  assert.equal(sat.hunger, 78);
  assert.equal(sat.hidden, false);
  assert.equal(sat.bond, 18);
  assert.equal(sat.mess.length, 0);

  const keptRui = JSON.parse(mem.get(RUI));
  assert.equal(keptRui.hunger, 11);
  assert.equal(keptRui.hidden, true);
  assert.equal(keptRui.mess.length, 1);

  const keptChirp = JSON.parse(mem.get(CHIRP));
  assert.equal(keptChirp.hunger, 78);
  assert.equal(keptChirp.hidden, false);
});

test("a kind change does not pour Rui onto Chirp's slot", () => {
  const mem = memoryStore();
  C.saveCare(RUI, guest({ hunger: 19, hidden: true }));
  C.saveCare(CHIRP, guest({ hunger: 70, hidden: false }));

  C.switchGuest(
    { localKey: RUI, stats: guest({ hunger: 19, hidden: true }) },
    { localKey: CHIRP, speciesKey: "field_cricket" },
    true,
    now,
  );

  assert.equal(JSON.parse(mem.get(CHIRP)).hunger, 70);
  assert.equal(JSON.parse(mem.get(CHIRP)).hidden, false);
  assert.notEqual(JSON.parse(mem.get(CHIRP)).hunger, 19);
});

test("/demo a kind change is memory only; the kept guest is not written", () => {
  const mem = memoryStore();
  C.saveCare(RUI, guest({ hunger: 22 }));
  C.saveCare(CHIRP, guest({ hunger: 70 }));

  const sat = C.switchGuest(
    { localKey: RUI, stats: guest({ hunger: 5, hidden: true }) },
    { localKey: CHIRP, speciesKey: "field_cricket", seed: { hunger: 78, mood: 80, energy: 82 } },
    false,
    now,
  );

  assert.equal(sat.hunger, 78);
  assert.equal(sat.hidden, false);
  assert.equal(JSON.parse(mem.get(RUI)).hunger, 22);
  assert.equal(JSON.parse(mem.get(CHIRP)).hunger, 70);
  assert.equal(mem.size, 2);
  assert.match(demoSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(demoSrc, /saveCare|localStorage/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
  assert.doesNotMatch(deskSrc, /persistLocal=\{false\}/);
});

test("the desk and /live keep then sit; they do not write the sitting body onto the next key", () => {
  assert.match(roomSrc, /switchGuest/);
  assert.match(roomSrc, /sittingRef\.current === kind\.localKey/);
  assert.match(roomSrc, /sittingRef\.current !== kind\.localKey/);
  assert.match(roomSrc, /Only write the guest who is sitting/);
  assert.doesNotMatch(roomSrc, /if \(persistLocal\) saveCare\(kind\.localKey, stats\)/);
  assert.match(liveSrc, /CompanionRoom/);
  assert.match(deskSrc, /CompanionRoom/);
  assert.doesNotMatch(liveSrc, /persistLocal=\{false\}/);
});

test("the catalog is still two hundred ten; rooms gained no room", () => {
  const keys = [...catalogSrc.matchAll(/\{ key: "([a-z0-9_]+)"/g)].map((m) => m[1]);
  assert.equal(keys.length, 210);
  assert.equal(new Set(keys).size, 210);
  assert.equal([...roomsSrc.matchAll(/^\s+id: "/gm)].length, 19);
});
