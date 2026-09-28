import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// The browser forgets a house server that stopped answering. #1549 made the desk ask 127.0.0.1:8081 only after the
// optional house server had answered on this browser, but it never forgot: a keeper who stopped running it got a
// refused request (a red console line) on every visit, for good. Now the page stops asking on its own after
// HOUSE_SERVER_FORGET_VISITS visits in a row with no answer, or HOUSE_SERVER_FORGET_MS since the last answer,
// whichever comes first; an answer (or Check) starts the count again.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);

const DAY = 24 * 60 * 60 * 1000;
const flush = () => new Promise((r) => setImmediate(r));

function fakeStorage() {
  const map = new Map();
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

/** One page load: the page's poll wired to this storage and clock, like heartbeatPoll. */
async function visit(ls, clock, up) {
  let reads = 0;
  const poll = K.createHeartbeatPoll({
    url: "http://127.0.0.1:1/api/public/heartbeat",
    doc: null,
    setIntervalImpl: () => 1,
    clearIntervalImpl: () => {},
    now: () => clock.t,
    gate: () => K.houseServerSeen(ls, clock.t),
    onAnswer: () => K.rememberHouseServer(ls, clock.t),
    onMiss: () => K.houseServerMissed(ls, clock.t),
    backoff: true,
    fetchImpl: async () => {
      reads++;
      if (!up) throw new TypeError("fetch failed");
      return { json: async () => ({ status: "UP", uptimeSeconds: 5 }) };
    },
  });
  const off = poll.subscribe(() => {});
  await flush();
  off();
  return { reads, poll };
}

test("the forget rule: three silent visits in a row, or three days", () => {
  assert.equal(K.HOUSE_SERVER_FORGET_VISITS, 3);
  assert.equal(K.HOUSE_SERVER_FORGET_MS, 3 * DAY);
});

test("a house server that stopped: asked on the next visits, then forgotten after three silent ones", async () => {
  const ls = fakeStorage();
  const clock = { t: 10 * DAY };
  assert.equal((await visit(ls, clock, true)).reads, 0, "a browser that never saw it does not ask");
  K.rememberHouseServer(ls, clock.t); // the keeper pressed Check and it answered
  assert.equal((await visit(ls, clock, true)).reads, 1, "it answers: remembered");
  assert.deepEqual(JSON.parse(ls.map.get(K.HOUSE_SERVER_SEEN_KEY)), { at: 10 * DAY, missed: 0 });
  const asked = [];
  for (let i = 0; i < 5; i++) {
    clock.t += 60 * 60 * 1000; // an hour between visits
    asked.push((await visit(ls, clock, false)).reads);
  }
  assert.deepEqual(asked, [1, 1, 1, 0, 0], "three refused visits, then no request at all");
  assert.equal(ls.map.has(K.HOUSE_SERVER_SEEN_KEY), false, "the record is gone");
  const quiet = await visit(ls, clock, false);
  assert.equal(K.heartbeatLine(quiet.poll.current(), quiet.poll.answered()), "House server not checked (optional)", "Check is offered again");
});

test("an answer in between starts the count again", async () => {
  const ls = fakeStorage();
  const clock = { t: DAY };
  K.rememberHouseServer(ls, clock.t);
  await visit(ls, clock, false);
  await visit(ls, clock, false);
  assert.equal(K.readHouseServerSeen(ls, clock.t).missed, 2);
  await visit(ls, clock, true);
  assert.equal(K.readHouseServerSeen(ls, clock.t).missed, 0);
  await visit(ls, clock, false);
  assert.equal(K.houseServerSeen(ls, clock.t), true, "one silent visit after an answer is not enough to forget");
});

test("three days with no answer forgets it, even with few visits", async () => {
  const ls = fakeStorage();
  const clock = { t: DAY };
  K.rememberHouseServer(ls, clock.t);
  await visit(ls, clock, true);
  clock.t += 3 * DAY - 1;
  assert.equal(K.houseServerSeen(ls, clock.t), true, "just under three days: still asked");
  clock.t += 1;
  assert.equal((await visit(ls, clock, false)).reads, 0, "three days: no request");
  assert.equal(ls.map.has(K.HOUSE_SERVER_SEEN_KEY), false);
});

test("one silent visit counts once, however many reads fail in it", async () => {
  const ls = fakeStorage();
  K.rememberHouseServer(ls, 0);
  let misses = 0;
  const timers = [];
  const poll = K.createHeartbeatPoll({
    doc: null,
    url: "http://127.0.0.1:1/x",
    setIntervalImpl: (fn) => (timers.push(fn), timers.length),
    clearIntervalImpl: () => {},
    now: () => 0,
    onMiss: () => {
      misses++;
      K.houseServerMissed(ls, 0);
    },
    fetchImpl: async () => {
      throw new TypeError("fetch failed");
    },
  });
  const off = poll.subscribe(() => {});
  await flush();
  for (let i = 0; i < 4; i++) {
    timers[0]();
    await flush();
  }
  off();
  assert.equal(misses, 1);
  assert.equal(K.readHouseServerSeen(ls, 0).missed, 1);
});

test("the record: the first cut's '1' still reads as seen; junk reads as not seen; a store without removeItem is fine", () => {
  const ls = fakeStorage();
  ls.setItem(K.HOUSE_SERVER_SEEN_KEY, "1");
  assert.deepEqual(K.readHouseServerSeen(ls, 5), { at: 5, missed: 0 });
  assert.equal(K.houseServerSeen(ls, 5), true);
  K.houseServerMissed(ls, 7);
  assert.deepEqual(K.readHouseServerSeen(ls, 7), { at: 7, missed: 1 });
  for (const junk of ["{", "null", '{"at":"x"}', '{"at":1,"missed":-1}']) {
    ls.setItem(K.HOUSE_SERVER_SEEN_KEY, junk);
    assert.equal(K.houseServerSeen(ls, 9), false, junk);
  }
  const plain = { map: new Map(), getItem(k) { return this.map.get(k) ?? null; }, setItem(k, v) { this.map.set(k, v); } };
  plain.setItem(K.HOUSE_SERVER_SEEN_KEY, JSON.stringify({ at: 0, missed: 3 }));
  assert.equal(K.houseServerSeen(plain, 1), false);
  assert.equal(K.houseServerSeen(plain, 1), false, "cleared without removeItem");
  const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.doesNotThrow(() => K.houseServerMissed(broken));
  assert.equal(K.houseServerSeen(broken), false);
});
