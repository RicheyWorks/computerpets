import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// A new keeper's first minutes on a phone (the #1550 audit): the kennel comes before the desk's words on /collection,
// the room's line links and /login's way back are 44 px, /study and /log are field-note indexes instead of 10,959 and
// 6,607 px of notes, /login stops scrolling at 568×320, the not-found tab title comes from the server, and /demo stops
// looping on a phone (so it takes the phone layout). The browser side is in phone-desk-layout.test.mjs.

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(web, "src", p), "utf8");
const M = await import(pathToFileURL(join(web, "src/lib/pets/meet-index.ts")).href);
const W = await import(pathToFileURL(join(web, "src/lib/pets/windows.ts")).href);

test("a field note's anchor and hash: #note-rui opens Rui's note, nothing else opens anything", () => {
  const slugs = ["rui", "miso", "pip"];
  assert.equal(M.noteAnchor("rui"), "note-rui");
  assert.equal(M.noteFromHash("#note-rui", slugs), "rui");
  assert.equal(M.noteFromHash("note-PIP", slugs), "pip");
  assert.equal(M.noteFromHash(`#${M.noteAnchor("miso")}`, slugs), "miso");
  for (const bad of ["", null, undefined, "#note-", "#note-attic", "#rui", "#room-rui", "#note-rui/x", "#note-rui extra"]) assert.equal(M.noteFromHash(bad, slugs), null, String(bad));
});

test("the note search line says how many match in plain words, and suggests a kind on a miss", () => {
  assert.equal(M.notesLine(20, 20, "", "fox"), "20 field notes. Open one, or type a name.");
  assert.equal(M.notesLine(20, 20, "   ", "fox"), "20 field notes. Open one, or type a name.");
  assert.equal(M.notesLine(0, 10, "qqq", "millipede"), "No guest by that name here. Try a kind, like millipede.");
  assert.equal(M.notesLine(1, 20, "fox", "fox"), "1 note matches.");
  assert.equal(M.notesLine(3, 20, "a", "fox"), "3 notes match.");
});

test("the note search finds a guest by name or kind, the way /meet's does", () => {
  const notes = [
    { key: "red_panda", slug: "rui", name: "Rui", species: "Red Panda" },
    { key: "fox", slug: "juniper", name: "Juniper", species: "Fox" },
    { key: "millipede", slug: "tally", name: "Tally", species: "Millipede" },
  ];
  const find = (q) => notes.filter((g) => M.guestMatches({ key: g.key, slug: g.slug, name: g.name, speciesLabel: g.species }, q)).map((g) => g.slug);
  assert.deepEqual(find("fox"), ["juniper"]);
  assert.deepEqual(find("RUI"), ["rui"]);
  assert.deepEqual(find("milli"), ["tally"]);
  assert.deepEqual(find("qqqzz"), []);
});

test("/study and /log use the field-note index; every note keeps its words in the page and a 44 px name", () => {
  const notes = src("components/desk/field-notes.tsx");
  assert.match(src("routes/study.tsx"), /<FieldNotes notes=\{HOUSE_GUIDE\}/);
  assert.match(src("routes/log.tsx"), /<FieldNotes notes=\{LOG_GUIDE\}/);
  for (const bit of ["data-field-notes", "data-notes-search", "data-notes-all", "data-notes-count", "data-note=", "data-note-tell", "aria-live", "<details", "noteFromHash", "hashchange", "/demo/$slug"]) assert.ok(notes.includes(bit), bit);
  assert.match(notes, /<summary className="[^"]*min-h-11/);
  // Closed drawers, not unmounted notes: the tell and the mix-up are rendered for every note.
  assert.doesNotMatch(notes, /isOpen \?\s*\(/);
});

test("/collection on a phone: the kennel sits under the name, before the hour line, and its cards are short", () => {
  const room = src("components/desk/companion-room.tsx");
  const css = src("styles.css");
  assert.match(room, /asideFirst\?: boolean/);
  assert.match(room, /\{hand && asideFirst \? null : kicker\}/);
  assert.match(room, /\{hand && asideFirst \? null : aside\}/);
  assert.match(src("routes/collection.tsx"), /asideFirst/);
  assert.match(src("routes/collection.tsx"), /data-kennel/);
  assert.match(src("components/pet-card.tsx"), /data-card-more/);
  for (const rule of ["[data-phone-floor] [data-kennel] {", "[data-phone-floor] [data-kennel] [data-card-more] {", "[data-phone-floor] [data-line-link] {"]) assert.ok(css.includes(rule), rule);
  assert.match(css, /\[data-phone-floor\] \[data-line-link\] \{[^}]*min-height: 2\.75rem/);
});

test("the room line links and /login's way back are 44 px on a phone; /login tightens at 568×320", () => {
  assert.match(src("routes/hatch.tsx"), /data-line-link/);
  assert.match(src("routes/nest.tsx"), /data-line-link/);
  assert.match(src("routes/collection.tsx"), /data-line-link/);
  assert.match(src("components/desk/species-plaque.tsx"), /data-line-link/);
  const login = src("routes/login.tsx");
  assert.match(login, /data-login-desk className="inline-flex min-h-11 items-center/);
  assert.match(login, /\[@media\(max-height:480px\)\]:p-4/);
  assert.match(login, /\[@media\(max-height:340px\)\]:hidden">Keeper desk/);
});

test("a path no page answers gets its tab title from the root head, on the server", () => {
  const root = src("routes/__root.tsx");
  assert.match(root, /head: \(\{ matches \}\) =>/);
  assert.match(root, /title: notFoundHere\(matches\) \? NOT_FOUND_TITLE : APP_NAME/);
  assert.match(src("lib/not-found.tsx"), /export function notFoundHere\(matches[^)]*\): boolean \{\s*return !!matches && matches\.length > 0 && matches\.every\(\(m\) => m\.routeId === "__root__"\);/);
});

test("the /demo plates' bounds: a same report keeps the old list, so the room cannot loop", () => {
  const a = { id: W.DEMO_WINDOW_ID, x: 10, y: 20, width: 100, height: 80 };
  const b = { id: W.DEMO_WINDOW_B_ID, x: 5, y: 60, width: 90, height: 70 };
  const sky = { id: "weather", x: 0, y: 0, width: 200, height: 40 };
  const start = W.swapWindows([], [a.id, b.id], [a, b], true);
  assert.deepEqual(start, [a, b]);
  const withSky = W.swapWindows(start, ["weather"], [sky]);
  assert.deepEqual(withSky, [a, b, sky]);
  // The same bounds again (fresh objects, sub-pixel jitter): the very same array comes back.
  assert.equal(W.swapWindows(withSky, [a.id, b.id], [{ ...a, x: 10.2 }, { ...b }], true), withSky);
  assert.equal(W.swapWindows(withSky, ["weather"], [{ ...sky }]), withSky);
  // A real move is a new list; the weather plate going away drops only it.
  const moved = W.swapWindows(withSky, [a.id, b.id], [{ ...a, x: 40 }, b], true);
  assert.notEqual(moved, withSky);
  assert.equal(moved[0].x, 40);
  assert.deepEqual(W.swapWindows(moved, ["weather"], []).map((w) => w.id), [a.id, b.id]);
  assert.equal(W.sameWindows([a], [a, b]), false);
  assert.equal(W.sameWindows([a, b], [b, a]), false);
});

test("the room hands the /demo plates steady callbacks, and a phone demo shows only the phone's sit", () => {
  const room = src("components/desk/companion-room.tsx");
  assert.match(room, /const onDemoBounds = useCallback\(/);
  assert.match(room, /const onWeatherBounds = useCallback\(/);
  assert.match(room, /<DemoWindowPlate onBounds=\{onDemoBounds\} \/>/);
  assert.match(room, /onBounds=\{onWeatherBounds\}/);
  assert.doesNotMatch(room, /onBounds=\{\(/);
  assert.match(src("components/desk/demo-stage.tsx"), /data-demo-stage/);
  assert.match(src("styles.css"), /@layer utilities \{\s*\[data-demo-stage\]:has\(\[data-phone-floor\]\) :is\(\[data-mac-extra\], \[data-linux-mark\], \[data-windows-sit\], \[data-tablet-sit\]\) \{\s*display: none;/);
});
