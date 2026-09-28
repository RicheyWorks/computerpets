import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// The desk no longer knocks on 127.0.0.1:8081 every 15 seconds for a keeper who never ran the optional house
// server. A browser prints every refused request to its console (net::ERR_CONNECTION_REFUSED) whatever the page
// catches, so the only quiet request is the one not sent: the page's poll asks on its own only when a house
// server answered on this browser before; otherwise the line says "House server not checked (optional)" and
// Check asks once. A known server that stops answering is asked less and less often (15 s doubling to 8 min),
// and a card that remounts does not ask again inside one interval. Also here: the tab titles for the desk and a
// pet page, and the speech bubble's room under the site header. The browser half is in phone-desk-layout.test.mjs.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (rel) => readFileSync(join(web, rel), "utf8").replace(/\r\n/g, "\n");
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const D = await import(pathToFileURL(join(web, "src/lib/pets/phone-desk.ts")).href);

const flush = () => new Promise((r) => setImmediate(r));

function rig({ gate, up = false, backoff = true } = {}) {
  const timers = new Map();
  let n = 0;
  let clock = 0;
  const state = { up, reads: 0, answers: 0 };
  const poll = K.createHeartbeatPoll({
    url: "http://127.0.0.1:1/api/public/heartbeat",
    doc: null,
    setIntervalImpl: (fn, ms) => {
      timers.set(++n, { fn, ms });
      return n;
    },
    clearIntervalImpl: (id) => timers.delete(id),
    now: () => clock,
    gate,
    onAnswer: () => state.answers++,
    backoff,
    fetchImpl: async () => {
      state.reads++;
      if (!state.up) throw new TypeError("fetch failed");
      return { json: async () => ({ status: "UP", uptimeSeconds: 61, port: 8081 }) };
    },
  });
  const beat = async (times = 1) => {
    for (let i = 0; i < times; i++) {
      clock += K.HEARTBEAT_POLL_MS;
      for (const t of [...timers.values()]) t.fn();
      await flush();
    }
  };
  return { poll, timers, state, beat, advance: (ms) => (clock += ms) };
}

test("never answered on this browser: the page asks nothing on its own, says 'not checked', and Check asks once", async () => {
  const r = rig({ gate: () => false });
  assert.deepEqual(r.poll.current(), K.UNCHECKED_HEARTBEAT);
  assert.equal(K.heartbeatLine(r.poll.current(), r.poll.answered()), "House server not checked (optional)");
  assert.equal(K.HOUSE_SERVER_UNCHECKED, "House server not checked (optional)");
  assert.equal(K.heartbeatTone(r.poll.current(), r.poll.answered()), "OFF", "muted, not a warning");
  assert.match(K.heartbeatDetail(r.poll.current()), /not checked/);
  const off = r.poll.subscribe(() => {});
  const off2 = r.poll.subscribe(() => {});
  await flush();
  assert.equal(r.state.reads, 0, "no request, so no refused request in the console");
  assert.equal(r.timers.size, 0, "no interval either");
  await r.beat(40);
  assert.equal(r.state.reads, 0);
  // The keeper presses Check: one read, no server: "not running", still no poll.
  await r.poll.check();
  assert.equal(r.state.reads, 1);
  assert.equal(K.heartbeatLine(r.poll.current(), r.poll.answered()), K.NO_HOUSE_SERVER);
  assert.equal(r.timers.size, 0, "a refused Check does not start polling");
  // The keeper starts the house server and presses Check again: it answers, the regular poll starts.
  r.state.up = true;
  await r.poll.check();
  assert.equal(r.poll.answered(), true);
  assert.equal(r.state.answers, 1, "remembered for the next visit");
  assert.equal(K.heartbeatLine(r.poll.current(), r.poll.answered()), "House server running · up 1m");
  assert.equal(r.timers.size, 1);
  off();
  off2();
  assert.equal(r.timers.size, 0);
});

test("a house server that answered here before: asked at once and every 15 s", async () => {
  const r = rig({ gate: () => true, up: true });
  assert.equal(r.poll.current().checked, false, "the first render (server and client alike) says not checked");
  const off = r.poll.subscribe(() => {});
  await flush();
  assert.equal(r.state.reads, 1);
  assert.equal(r.timers.size, 1);
  assert.equal([...r.timers.values()][0].ms, K.HEARTBEAT_POLL_MS);
  await r.beat(3);
  assert.equal(r.state.reads, 4);
  off();
});

test("a known server that stops answering is asked less and less often, and at once again when it is back", async () => {
  const r = rig({ gate: () => true, up: true });
  const off = r.poll.subscribe(() => {});
  await flush();
  r.state.up = false;
  const gaps = [];
  let last = r.state.reads;
  let ticks = 0;
  while (gaps.length < 7) {
    await r.beat();
    ticks++;
    if (r.state.reads !== last) {
      gaps.push(ticks);
      ticks = 0;
      last = r.state.reads;
    }
  }
  // The first miss comes on the next tick; then 2, 4, 8, 16, 32 ticks apart, and never more than 32 (8 min).
  assert.deepEqual(gaps, [1, 2, 4, 8, 16, 32, 32]);
  assert.equal(K.HEARTBEAT_BACKOFF_MAX_SKIPS + 1, 32);
  assert.equal(K.heartbeatLine(r.poll.current(), r.poll.answered()), K.HOUSE_SERVER_STOPPED);
  // Check still asks at once, and an answer ends the backoff.
  r.state.up = true;
  const before = r.state.reads;
  await r.poll.check();
  assert.equal(r.state.reads, before + 1);
  await r.beat();
  assert.equal(r.state.reads, before + 2, "back to every tick");
  off();
});

test("a card that remounts does not ask again inside one interval (the desk used to knock three times in 3 s)", async () => {
  const r = rig({ gate: () => true, up: false });
  for (let i = 0; i < 5; i++) {
    const off = r.poll.subscribe(() => {});
    await flush();
    off();
    r.advance(200);
  }
  assert.equal(r.state.reads, 1);
  r.advance(K.HEARTBEAT_POLL_MS * 40);
  const off = r.poll.subscribe(() => {});
  await flush();
  assert.equal(r.state.reads, 2, "a later visit asks again");
  off();
});

test("the page remembers a house server that answered, in this browser only", () => {
  const store = new Map();
  const ls = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) };
  assert.equal(K.houseServerSeen(ls), false);
  K.rememberHouseServer(ls);
  assert.equal(store.get(K.HOUSE_SERVER_SEEN_KEY), "1");
  assert.equal(K.houseServerSeen(ls), true);
  assert.equal(K.houseServerSeen(null), false, "no storage (server render): not seen");
  const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.equal(K.houseServerSeen(broken), false);
  assert.doesNotThrow(() => K.rememberHouseServer(broken));
  const keeper = src("src/lib/pets/keeper.ts");
  assert.match(keeper, /export const heartbeatPoll = createHeartbeatPoll\(\{ gate: \(\) => houseServerSeen\(\), onAnswer: \(\) => rememberHouseServer\(\), backoff: true \}\);/);
  const card = src("src/components/desk/keeper-card.tsx");
  assert.match(card, /beat\.checked === false \? \(/);
  assert.match(card, /data-heartbeat-check/);
  assert.match(card, /void heartbeatPoll\.check\(\);/);
});

test("tab titles: the desk and a pet page say who is there", async () => {
  const T = await import(pathToFileURL(join(web, "src/lib/page-title.ts")).href);
  assert.equal(T.pageTitle("The desk"), "The desk — ComputerPets");
  assert.equal(T.pageTitle(""), "ComputerPets");
  assert.equal(T.petTitle("Rui", "Red Panda"), "Rui the Red Panda — ComputerPets");
  assert.equal(T.petTitle("  Mochi ", " Raccoon"), "Mochi the Raccoon — ComputerPets");
  assert.equal(T.petTitle("Red Panda", "red panda"), "Red Panda — ComputerPets");
  assert.equal(T.petTitle("", "Axolotl"), "Axolotl — ComputerPets");
  assert.equal(T.petTitle("Pip", ""), "Pip — ComputerPets");
  const desk = src("src/routes/index.tsx");
  assert.match(desk, /head: \(\) => \(\{ meta: \[\{ title: pageTitle\("The desk"\) \}\] \}\)/);
  const stage = src("src/components/desk/desk-stage.tsx");
  assert.match(stage, /useDocumentTitle\(petTitle\(name \?\? kind\.name, kind\.speciesLabel\)\);/);
  const pet = src("src/routes/pets.$key.tsx");
  assert.match(pet, /head: \(\) => \(\{ meta: \[\{ title: pageTitle\("Your pet"\) \}\] \}\)/);
  assert.match(pet, /useDocumentTitle\(pet \? petTitle\(pet\.name, /);
});

test("the speech bubble's room under the site header", () => {
  assert.equal(D.BUBBLE_HEADER_GAP, 6);
  // Rests at 101 px, header ends at 62: it may rise 33 px.
  assert.equal(D.bubbleRoom(101, 62), 33);
  assert.equal(D.bubbleLift(18, 33), 18, "a low pet: as high as it wants");
  assert.equal(D.bubbleLift(120, 33), 33, "a pet high on the ridge: capped under the header");
  // A two-line bubble on a landscape phone rests too high already: it drops below its rest instead.
  assert.equal(D.bubbleLift(18, D.bubbleRoom(60, 62)), -8);
  assert.equal(D.bubbleRoom(101, null), Infinity, "no header: no cap");
  assert.equal(D.bubbleLift(40, D.bubbleRoom(101, undefined)), 40);
  const pet = src("src/components/desk/living-pet.tsx");
  assert.match(pet, /translate3d\(\$\{bx\}px, \$\{-bubbleLift\(drawY \+ 18, bubbleRoomRef\.current\)\}px, 0\)/);
  assert.match(pet, /bubbleRoomRef\.current = bubbleRoom\(restTop, head\.getBoundingClientRect\(\)\.bottom\);/);
  assert.match(src("src/components/app-shell.tsx"), /<header\n\s+data-site-header/);
});
