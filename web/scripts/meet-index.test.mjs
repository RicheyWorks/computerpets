import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// A new visitor's way through the site on a phone (the #1549 audit): /meet was ~135,000 px of cards at 375×667, so
// it gets a room index, closed room drawers and a guest search (lib/pets/meet-index.ts); "The house" under a room's
// title and the keeper card's Check are 44 px on a phone; /login fits a landscape phone; a mistyped link gets a page
// with ways on instead of a bare "Not Found"; and the phone check's stand-in session gets a small dev-only kennel
// (lib/pets/dev-seed.ts). The browser side is in phone-desk-layout.test.mjs.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(web, "src", p), "utf8");
const M = await import(pathToFileURL(join(web, "src/lib/pets/meet-index.ts")).href);
const S = await import(pathToFileURL(join(web, "src/lib/pets/dev-seed.ts")).href);
const C = await import(pathToFileURL(join(web, "src/lib/pets/catalog.ts")).href);

const guest = (key, name, speciesLabel, slug = key) => ({ key, name, speciesLabel, slug });

test("a room's anchor and a /meet hash: #room-snakes opens the snakes, nothing else opens anything", () => {
  const ids = ["house", "snakes", "tide"];
  assert.equal(M.meetRoomAnchor("snakes"), "room-snakes");
  assert.equal(M.roomFromHash("#room-snakes", ids), "snakes");
  assert.equal(M.roomFromHash("room-TIDE", ids), "tide");
  for (const bad of ["", null, undefined, "#room-", "#room-attic", "#snakes", "#room-snakes/x", "#room-snakes extra"]) assert.equal(M.roomFromHash(bad, ids), null, String(bad));
});

test("find a guest: every word must match its name, kind, slug or key; accents and case do not matter", () => {
  const rui = guest("red_panda", "Rui", "Red Panda", "rui");
  const emile = guest("gecko", "Émile", "Leopard Gecko", "emile");
  assert.equal(M.guestMatches(rui, ""), true);
  assert.equal(M.guestMatches(rui, "   "), true);
  assert.equal(M.guestMatches(rui, "rui"), true);
  assert.equal(M.guestMatches(rui, "RED panda"), true);
  assert.equal(M.guestMatches(rui, "red_panda".replace("_", " ")), true);
  assert.equal(M.guestMatches(rui, "rui fox"), false);
  assert.equal(M.guestMatches(emile, "emile"), true);
  assert.equal(M.guestMatches(emile, "leopard  GECKO"), true);
  assert.equal(M.foldQuery("  Émile   the Gecko "), "emile the gecko");
});

test("the line under the search box says how many match in plain words", () => {
  assert.equal(M.matchLine(221, 221, "", 20), "221 guests in 20 rooms. Open a room, or type a name.");
  assert.equal(M.matchLine(0, 221, "zzz", 20), "No guest by that name. Try a kind, like fox or owl.");
  assert.equal(M.matchLine(1, 221, "rui", 20), "1 guest matches.");
  assert.equal(M.matchLine(7, 221, "fox", 20), "7 guests match.");
});

test("/meet is wired to the index: room drawers closed at first, jump links, search, every guest in the page", () => {
  const meet = src("routes/meet.tsx");
  for (const want of ["<MeetShelves />", "data-meet-index", "data-meet-search", "data-meet-count", "data-meet-found", "data-meet-room", "data-meet-guest", 'aria-label="Jump to a room"', "roomFromHash(", "hashchange", "guestMatches(", "matchLine("]) {
    assert.ok(meet.includes(want), `meet.tsx has ${want}`);
  }
  assert.match(meet, /<details[\s\S]*?id=\{meetRoomAnchor\(/, "each room is a drawer with its anchor");
  assert.match(meet, /LIVING_KINDS/, "the guests come from the one living list (221; no new pets)");
  assert.doesNotMatch(meet, /ROOMS\.map\(\(room\) => \(\s*<section/, "the old wall of cards is gone");
});

test("thumb-sized: The house under a room's title, the keeper card's Check on a phone, the hero's Open the desk", () => {
  assert.match(src("components/desk/room-hero.tsx"), /data-hero-house className="inline-flex min-h-11 items-center/);
  const css = src("styles.css");
  assert.match(css, /@media \(pointer: coarse\), \(max-width: 639px\) \{\s*\.keeper-heartbeat-check \{[^}]*min-height: 2\.75rem;[^}]*min-width: 2\.75rem;/);
  assert.match(src("routes/meet.tsx"), /inline-flex min-h-11 items-center[^"]*"[^>]*>\s*Open the desk/);
});

test("/login tightens on a landscape phone (max-height 480px) so the buttons stay on screen", () => {
  const login = src("routes/login.tsx");
  assert.match(login, /<main data-login className="[^"]*\[@media\(max-height:480px\)\]:min-h-0/);
  assert.match(login, /\[@media\(max-height:480px\)\]:p-5/);
  assert.match(src("components/app-shell.tsx"), /\[@media\(max-height:480px\)\]:py-3/);
});

test("a mistyped link gets a page with ways on, not a bare Not Found", () => {
  assert.match(src("router.tsx"), /defaultNotFoundComponent: AppNotFound/);
  const nf = src("lib/not-found.tsx");
  assert.match(nf, /useDocumentTitle\(NOT_FOUND_TITLE\)/);
  assert.match(nf, /pageTitle\("No room here"\)/);
  for (const to of ['to="/"', 'to="/meet"', 'to="/collection"']) assert.ok(nf.includes(to), `not-found links ${to}`);
  assert.match(nf, /min-h-11/);
});

const allowed = { env: { COMPUTERPETS_DEV_SEED: "kennel" }, dbSource: "pglite", authConfigured: false, userId: "dev-user", devUserId: "dev-user" };

test("the stand-in kennel seeds only when asked, on in-memory PGLite, with sign-in off, for the dev keeper", () => {
  assert.equal(S.devSeedAllowed(allowed), true);
  assert.equal(S.devSeedAllowed({ ...allowed, env: {} }), false, "not asked");
  assert.equal(S.devSeedAllowed({ ...allowed, env: { COMPUTERPETS_DEV_SEED: "yes" } }), false, "asked for something else");
  assert.equal(S.devSeedAllowed({ ...allowed, dbSource: "neon" }), false, "a real database");
  assert.equal(S.devSeedAllowed({ ...allowed, env: { ...allowed.env, DATABASE_URL: "postgres://x" } }), false, "DATABASE_URL set");
  assert.equal(S.devSeedAllowed({ ...allowed, authConfigured: true }), false, "sign-in on");
  assert.equal(S.devSeedAllowed({ ...allowed, userId: "someone-real" }), false, "not the dev keeper");
  assert.equal(S.devSeedAllowed({ ...allowed, userId: "", devUserId: "" }), false, "no dev keeper");
  assert.match(src("lib/auth/verify.server.ts"), /export const DEV_USER_ID = "dev-user";/);
});

test("the stand-in kennel is six catalog guests (no new pets), hatched once, from the sanctuary read", () => {
  assert.equal(S.DEV_SEED_PETS.length, 6);
  assert.equal(new Set(S.DEV_SEED_PETS.map((p) => p.key)).size, 6);
  for (const p of S.DEV_SEED_PETS) assert.ok(C.SPECIES_BY_KEY[p.key], `${p.key} is in the catalog`);
  assert.equal(C.SPECIES.length >= 6, true);
  const server = src("lib/pets/dev-seed.server.ts");
  assert.match(server, /devSeedAllowed\(\{ env: process\.env, dbSource, authConfigured, userId, devUserId: DEV_USER_ID \}\)/);
  assert.match(server, /select id from companion_pets where user_id = \$\{userId\} limit 1/, "only a keeper with no pets yet");
  const actions = src("lib/pets/actions.ts");
  assert.match(actions, /await ensureKeeper\(context\.userId\);\s*await seedDevKennelOnce\(context\.userId\);/);
  assert.match(actions, /await import\("\.\/dev-seed\.server"\)/, "the seed code loads only when the sanctuary asks");
  assert.match(actions, /__devKennelSeed__/, "two reads at once seed once");
  const layout = readFileSync(join(web, "scripts/phone-desk-layout.test.mjs"), "utf8");
  assert.match(layout, /VITE_AUTH_ENABLED: "false", DATABASE_URL: "", COMPUTERPETS_DEV_SEED: "kennel"/);
});
