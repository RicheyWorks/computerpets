import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// /pets/$key says a failed feed / tend / play once (the room line with Try again, no second toast);
// a confirmed revoke says it worked even when the list can't refresh; every guest's keeper card can
// pause house music without touching Rui's music block; keeper-card reads the heartbeat from one
// shared poll; and the docs and the NFT floor line match the app.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..");
const read = (base, rel) => readFileSync(join(base, rel), "utf8").replace(/\r\n/g, "\n");
const src = (rel) => read(web, rel);
const P = await import(pathToFileURL(join(web, "src/lib/plain-error.ts")).href);
const B = await import(pathToFileURL(join(web, "src/lib/admin/base.ts")).href);
const K = await import(pathToFileURL(join(web, "src/lib/pets/keeper.ts")).href);
const M = await import(pathToFileURL(join(web, "src/lib/pets/house-music.ts")).href);
const Overlay = createRequire(import.meta.url)(join(repo, "desktop/renderer/house-music.js"));

test("roomReportsCare: feed, play, rest, clean, medicine are the room's; anything else keeps the toast", () => {
  for (const act of ["play", "feed", "rest", "clean", "medicine"]) assert.equal(P.roomReportsCare(act), true, act);
  for (const act of ["shed", "hatch", "toString", "__proto__", ""]) assert.equal(P.roomReportsCare(act), false, act);
  const page = src("src/routes/pets.$key.tsx");
  const persist = page.slice(page.indexOf("async function persistCare"), page.indexOf("if (gone)"));
  assert.match(persist, /if \(!roomReportsCare\(action\)\) toast\.error\(plainMessage\(err, "Care failed\."\)\);/);
  assert.equal((persist.match(/toast\.error\(/g) || []).length, 1, "one guarded toast, not a second copy");
  assert.match(persist, /throw err;/, "the room still gets the error for its own line");
  const room = src("src/components/desk/companion-room.tsx");
  assert.match(room, /careFailed\("feed", err\);/);
  assert.match(room, /careFailed\("play", err\);/);
  assert.match(room, /careFailed\(saved, err\);/);
});

test("a confirmed revoke says it worked; only the list refresh can fail after that", () => {
  const rows = [
    { jti: "a", revoked: false, deleted: false },
    { jti: "b", revoked: false, deleted: false },
  ];
  const next = B.markRevoked(rows, "b");
  assert.deepEqual(next, [
    { jti: "a", revoked: false, deleted: false },
    { jti: "b", revoked: true, deleted: true },
  ]);
  assert.equal(rows[1].revoked, false, "the old rows are not mutated");
  const stale = B.revokedListStale("Couldn't reach the house server.");
  assert.ok(stale.startsWith("License revoked. Downloads with this license stop right away."), stale);
  assert.match(stale, /The list couldn't refresh: Couldn't reach the house server\./);
  assert.doesNotMatch(stale, /failed/i);
  assert.match(B.REVOKED_NOTE, /^License revoked\. Downloads with this license stop right away\./);
  assert.doesNotMatch(`${B.REVOKED_NOTE} ${stale}`, /jti|soft-delet/);
  const page = src("src/routes/admin.tsx");
  const body = page.slice(page.indexOf("async function confirmRevoke"), page.indexOf("function lock("));
  const revokeAt = body.indexOf("await revokeLicense(");
  const failAt = body.indexOf("showError(err, ADMIN_FALLBACK.revoke)");
  const doneAt = body.indexOf("setPendingJti(null)");
  const listAt = body.indexOf("await lookupLicenses(");
  assert.ok(revokeAt > 0 && revokeAt < failAt && failAt < doneAt && doneAt < listAt, "revoke, its failure, then the list");
  const listCatch = body.slice(listAt);
  assert.doesNotMatch(listCatch, /Revoke failed|ADMIN_FALLBACK\.revoke/);
  assert.match(listCatch, /setNote\(REVOKED_NOTE\);/);
  assert.match(listCatch, /setRows\(\(was\) => markRevoked\(was, jti\)\);/);
  assert.match(listCatch, /setNote\(revokedListStale\(plainMessage\(err, "Try again in a moment\."\)\)\);/);
  assert.match(listCatch, /lock\(`License revoked\. \$\{ADMIN_KEY_REJECTED\}`\);/);
});

function fakeClock() {
  const timers = new Map();
  let next = 1;
  return {
    timers,
    setIntervalImpl: (fn, ms) => {
      const id = next++;
      timers.set(id, { fn, ms });
      return id;
    },
    clearIntervalImpl: (id) => timers.delete(id),
  };
}

const tick = () => new Promise((r) => setImmediate(r));

test("createHeartbeatPoll: one interval for every subscriber, stops with the last, DOWN when unreachable", async () => {
  const clock = fakeClock();
  const urls = [];
  let up = true;
  const poll = K.createHeartbeatPoll({
    ...clock,
    url: "http://127.0.0.1:1/api/public/heartbeat",
    fetchImpl: async (url, init) => {
      urls.push([url, init]);
      if (!up) throw new TypeError("fetch failed");
      return { json: async () => ({ status: "UP", uptimeSeconds: 61 }) };
    },
  });
  assert.equal(poll.current().status, K.UNREAD_HEARTBEAT.status);
  const a = [];
  const b = [];
  const offA = poll.subscribe((beat) => a.push(beat));
  const offB = poll.subscribe((beat) => b.push(beat));
  assert.equal(clock.timers.size, 1, "two cards, one interval");
  assert.equal([...clock.timers.values()][0].ms, K.HEARTBEAT_POLL_MS);
  await tick();
  assert.equal(urls.length, 1, "one read on the first subscribe, none for the second");
  assert.deepEqual(urls[0], ["http://127.0.0.1:1/api/public/heartbeat", { cache: "no-store" }]);
  assert.equal(a.at(-1).status, "UP");
  assert.deepEqual(b.at(-1), a.at(-1), "both see the same beat");
  up = false;
  [...clock.timers.values()][0].fn();
  await tick();
  assert.deepEqual(a.at(-1), K.UNREAD_HEARTBEAT, "unreachable reads as the unread (DOWN) beat");
  offA();
  assert.equal(clock.timers.size, 1, "still one card");
  offB();
  assert.equal(clock.timers.size, 0, "last card gone, poll stopped");
  poll.subscribe(() => {});
  assert.equal(clock.timers.size, 1, "a new card starts it again");
  assert.equal(K.HEARTBEAT_POLL_MS, 15_000);
});

test("keeper-card has one heartbeat reader: no own intervals or fetches, both surfaces on the shared poll", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  assert.doesNotMatch(card, /fetch\(HEARTBEAT_URL/);
  assert.doesNotMatch(card, /20_000/);
  assert.equal((card.match(/heartbeatPoll\.subscribe\(setBeat\)/g) || []).length, 1);
  assert.equal((card.match(/useHeartbeat\(\)/g) || []).length, 3, "the hook plus KeeperCard and KeeperHeartbeat");
  const keeper = src("src/lib/pets/keeper.ts");
  assert.match(keeper, /export const heartbeatPoll = createHeartbeatPoll\(\);/);
});

const MUSICS = [
  { plugin: "off", playing: false },
  { plugin: "house", playing: true },
  { plugin: "house", playing: false },
  { plugin: "radio", playing: true },
  { plugin: "radio", playing: true, stationUrl: "https://stream.example.org/live", stationName: "KEXP" },
  { plugin: "radio", playing: false, stationUrl: "https://stream.example.org/live", stationName: "KEXP" },
];

test("shared house music: hidden on Rui's card, shows for any other guest with something to play; web and overlay agree", () => {
  assert.equal(M.HOUSE_MUSIC_OWNER, "red_panda");
  assert.equal(Overlay.HOUSE_MUSIC_OWNER, M.HOUSE_MUSIC_OWNER);
  assert.equal(Overlay.HOUSE_MUSIC_LABEL, M.HOUSE_MUSIC_LABEL);
  for (const raw of MUSICS) {
    const web = M.parseMusic(raw);
    const overlay = Overlay.parseMusic(raw);
    assert.equal(M.sharedMusicShows("red_panda", web), false);
    for (const guest of ["robin", "otter", null]) {
      assert.equal(M.sharedMusicShows(guest, web), Overlay.sharedMusicShows(guest, overlay), JSON.stringify([guest, raw]));
    }
    for (const asked of [false, true]) {
      const w = M.houseMusicToggle(web, asked);
      const o = Overlay.houseMusicToggle(overlay, asked);
      assert.equal(w.audible, o.audible);
      assert.equal(w.label, o.label);
      assert.equal(w.next.playing, o.next.playing);
    }
  }
  assert.equal(M.sharedMusicShows("robin", M.parseMusic({ plugin: "off" })), false);
  assert.equal(M.sharedMusicShows("robin", M.parseMusic({ plugin: "radio" })), false, "no station picked yet");
  assert.equal(M.sharedMusicShows("robin", M.parseMusic({ plugin: "house", playing: false })), true);
  const house = M.houseMusicToggle(M.parseMusic({ plugin: "house", playing: true }), false);
  assert.deepEqual([house.audible, house.label, house.next.playing], [true, "Pause music", false]);
  const paused = M.houseMusicToggle(house.next, false);
  assert.deepEqual([paused.audible, paused.label, paused.next.playing], [false, "Play music", true]);
  const stream = M.parseMusic(MUSICS[4]);
  assert.equal(M.houseMusicToggle(stream, false).label, "Play music", "a stream the keeper has not asked for is not playing");
  assert.equal(M.houseMusicToggle(stream, true).label, "Pause music");
});

test("web keeper card: the shared control sits outside Rui's block and uses the same commit", () => {
  const card = src("src/components/desk/keeper-card.tsx");
  const sharedAt = card.indexOf("{sharedMusicShows(guestKey, music) ? (");
  const ruiAt = card.indexOf('{guestKey === "red_panda" ? (');
  assert.ok(sharedAt > 0 && ruiAt > sharedAt, "shared block closes before Rui's block opens");
  const shared = card.slice(sharedAt, ruiAt);
  assert.match(shared, /role="group" aria-label=\{HOUSE_MUSIC_LABEL\}/);
  assert.match(shared, /aria-pressed=\{houseMusicToggle\(music, streamAsked\)\.audible\}/);
  assert.match(shared, /commitMusic\(houseMusicToggle\(music, streamAsked\)\.next\);/);
  assert.match(shared, /id="hud-stream-net"/, "the stream honesty line shows where the stream is started");
  const rui = card.slice(ruiAt, ruiAt + 1600);
  assert.match(rui, /<p>Music · Rui<\/p>/);
  assert.doesNotMatch(rui, /houseMusicToggle|sharedMusicShows|HOUSE_MUSIC_LABEL/);
  assert.equal((card.match(/id="hud-stream-net"/g) || []).length, 2, "one per branch; the branches never render together");
});

test("desktop overlay: #hud-house-music is outside #hud-music; Rui's overlay block is untouched", () => {
  const html = read(repo, "desktop/renderer/index.html");
  const pet = read(repo, "desktop/renderer/pet.js");
  const musicAt = html.indexOf('<div id="hud-music"');
  const sleepAt = html.indexOf('<div id="hud-sleep"');
  const sharedAt = html.indexOf('<div id="hud-house-music"');
  assert.ok(musicAt > 0 && musicAt < sleepAt && sleepAt < sharedAt, "after Rui's block and the sleep aid");
  assert.match(html, /<div id="hud-house-music" class="keeper-music keeper-house-music" data-hit role="group" aria-label="House music" hidden>/);
  assert.match(html, /<button type="button" id="hud-house-music-play" data-hit aria-pressed="false">Play music<\/button>/);
  assert.match(html, /<p id="hud-house-stream-net" class="keeper-truth" hidden><\/p>/);
  const ruiAt = pet.indexOf('if (hudMusic && window.PetHouseMusic && kind && kind.key === "red_panda") {');
  const elseAt = pet.indexOf("} else if (hudMusic) {\n    hudMusic.hidden = true;\n  }\n  paintHouseMusic();");
  assert.ok(ruiAt > 0 && elseAt > ruiAt, "paint runs right after Rui's block, not inside it");
  assert.doesNotMatch(pet.slice(ruiAt, elseAt), /paintHouseMusic|houseMusicToggle|hud-house/);
  const paint = pet.slice(pet.indexOf("function paintHouseMusic"), pet.indexOf("function streamLineInView"));
  assert.match(paint, /M\.sharedMusicShows\(kind\.key, music\)/);
  assert.match(paint, /btn\.setAttribute\("aria-pressed", toggle\.audible \? "true" : "false"\);/);
  const lineEl = pet.slice(pet.indexOf("function streamLineEl"), pet.indexOf("function paintHouseMusic"));
  assert.match(lineEl, /own && hudMusic && !hudMusic\.hidden/, "a line inside a hidden block does not count");
  for (const fn of ["function streamLineInView", "function streamShown"]) {
    const at = pet.indexOf(fn);
    assert.match(pet.slice(at, at + 120), /const el = streamLineEl\(\);/, fn);
  }
  const clickAt = pet.indexOf("hudHouseMusicPlay.addEventListener");
  const click = pet.slice(clickAt, clickAt + 700);
  const order = ["streamAsked = true", "persistCard()", "paintHouseMusic()", "sitMusic()"].map((s) => click.indexOf(s));
  assert.ok(order.every((n, i) => n > 0 && (i === 0 || n > order[i - 1])), `stream asked, saved, painted, then played: ${order}`);
});

test("docs match the app: TS error count, deploy-sh PyYAML hint; the NFT floor says couldn't load with Try again", () => {
  const contributing = read(repo, "docs/CONTRIBUTING.md");
  assert.doesNotMatch(contributing, /about 1,500 known TypeScript errors/);
  // The count in CONTRIBUTING is the one in web/tsc-baseline.txt (read here, not written into the test).
  const tscBaseline = read(repo, "web/tsc-baseline.txt").trim();
  assert.match(tscBaseline, /^\d+$/);
  const quoted = Number(tscBaseline).toLocaleString("en-US");
  assert.ok(
    contributing.includes(`\`web\` has ${quoted} known TypeScript errors at last count; \`web/tsc-baseline.txt\` always holds the current number`),
    `CONTRIBUTING quotes ${quoted} web TypeScript errors, as web/tsc-baseline.txt holds`,
  );
  const sh = read(repo, "scripts/test-all.sh");
  const ps = read(repo, "scripts/test-all.ps1");
  assert.match(ps, /python3 with PyYAML is not available to bash \(see 'deploy-sh on Windows' in docs\/CONTRIBUTING\.md\)/);
  assert.match(sh, /NOTE="python3 with PyYAML is not available to bash \(python3 -m pip install --user pyyaml; on Windows see 'deploy-sh on Windows' in docs\/CONTRIBUTING\.md\)"/);
  assert.doesNotMatch(sh, /python3 has no PyYAML/);
  assert.equal(P.PLATE_LINES.floor, "Couldn't load the floor price.");
  const logged = [];
  const line = P.plateProblem("floor", Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNREFUSED" } }), (l, e) => logged.push([l, e]));
  assert.ok(line.startsWith("Couldn't load the floor price. "), line);
  assert.doesNotMatch(line, /ECONNREFUSED|fetch failed/);
  assert.equal(logged.length, 1);
  const plates = src("src/components/desk/desk-plates.tsx");
  const market = plates.slice(plates.indexOf("export function DeskMarketPlate"));
  assert.match(market, /setNftProblem\(next \? null : plateProblem\("floor", null\)\);/);
  assert.match(market, /setNftProblem\(plateProblem\("floor", err\)\);/);
  assert.equal((market.match(/setNftProblem\(null\);/g) || []).length, 2, "no NFT, no floor problem");
  assert.match(market, /\{nft && nftUnread && nftProblem \? \(\n\s+<p className="mt-1 text-subtle" role="status" data-plate-problem="floor">/);
});
