import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Newcomer pass 2 (September 2026): the leftovers of the first pass, each pinned to the thing it describes.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const L = await import(pathToFileURL(join(root, "src/lib/auth/local-sign-in.ts")).href);
const W = await import(pathToFileURL(join(root, "src/lib/pets/weather.ts")).href);

test("sign-in on this computer's own copy: loopback hosts say why instead of offering buttons that cannot finish", () => {
  for (const h of ["localhost", "LOCALHOST", "app.localhost", "127.0.0.1", "127.1.2.3", "::1", "[::1]"]) assert.equal(L.isLoopbackHost(h), true, h);
  for (const h of ["", null, undefined, "computerpets.vercel.app", "x.grok-sandbox.com", "192.168.1.5", "10.0.0.2", "localhost.example.com", "127.0.0.1.nip.io"]) {
    assert.equal(L.isLoopbackHost(h), false, String(h));
  }
  assert.match(L.LOCAL_SIGN_IN_WORDS, /does not finish on this computer's own copy of the site \(localhost\)\. It works on the hosted site\./);
  assert.match(L.LOCAL_SIGN_IN_TRY, /VITE_AUTH_ENABLED=false in a file named web\/\.env/);
  // The preview client really is limited to the hosted preview, which is why localhost cannot finish.
  assert.match(read(root, "src/lib/auth/preview.ts"), /PREVIEW_ALLOWED_HOSTS = \["\*\.grok-sandbox\.com"\]/);
  const login = read(root, "src/routes/login.tsx");
  // Pass 3: the host AND the server's sign-in client decide (newcomer-gaps-3.test.mjs).
  assert.match(login, /useEffect\(\(\) => setBlocked\(localSignInBlocked\(window\.location\.hostname, ownClient\)\), \[ownClient\]\);/);
  assert.match(login, /\{authEnabled && blocked \? \(\n\s+<div data-login-local/);
  // Everywhere else (a deployed site, the hosted preview) the buttons are exactly as before.
  assert.match(login, /\) : authEnabled \? \(\n\s+<div className="space-y-2">\n\s+\{GROK_PROVIDERS\.map/);
  assert.match(read(root, "README.md"), /The login page says the same on `localhost`/);
});

test("the desk's tab names the pet from the first paint, and a page's own title outlasts a late router rewrite", () => {
  const index = read(root, "src/routes/index.tsx");
  assert.match(index, /const kind = livingByKey\(pet && isLivingSpecies\(pet\) \? pet : "red_panda"\);\n\s+return \{ meta: \[\{ title: petTitle\(kind\.name, kind\.speciesLabel\) \}\] \};/);
  assert.doesNotMatch(index, /pageTitle\("The desk"\)/);
  const t = read(root, "src/lib/page-title.ts");
  assert.match(t, /keep\?\.observe\(document\.head, \{ childList: true, subtree: true, characterData: true \}\);/);
  // Only the same route title is put back; a different one is the next page's, and the observer steps aside.
  assert.match(t, /if \(document\.title !== before\) \{\n\s+keep\?\.disconnect\(\);\n\s+return;\n\s+\}\n\s+document\.title = title;/);
  assert.match(t, /return \(\) => \{\n\s+keep\?\.disconnect\(\);/);
});

test("phone rail names and the keeper card's keyboard open are thumb-sized", () => {
  const css = read(root, "src/styles.css");
  assert.match(css, /\[data-phone-floor\] \[data-desk-rail\] li > \* \{\n\s+height: 100%;\n(\s+\/\*[\s\S]*?\*\/\n)?\s+min-width: 2\.75rem;/);
  assert.match(css, /\.keeper-heartbeat-check \{\n\s+display: inline-flex;\n\s+align-items: center;\n\s+justify-content: center;\n\s+min-height: 1\.5rem;\n\s+min-width: 1\.5rem;/);
  const room = read(root, "src/components/desk/companion-room.tsx");
  assert.match(room, /data-card="open"[\s\S]{0,80}className="sr-only [^"]*focus:not-sr-only focus:inline-flex focus:min-h-11 focus:min-w-11 focus:items-center/);
  assert.match(read(root, "src/routes/meet.tsx"), /<Link to="\/live" data-line-link className="text-sm text-fg">/);
});

test("the catalog's shelf headings are kept clear of the speech bubble", () => {
  const cat = read(root, "src/routes/catalog.tsx");
  // The whole Shelf card is kept clear now (newcomer-gaps-4: the bubble sat on its sentence under the heading).
  assert.match(cat, /<aside data-bubble-avoid="" className="paper-card[^"]*">\s*<p className="[^"]*">Shelf<\/p>\s*<h2 className="mt-1 font-display text-2xl">The two hundred twenty-one\.<\/h2>/);
  assert.match(cat, /<h2 data-bubble-avoid="" className="mt-1 font-display text-2xl">\{room\.label\}<\/h2>/);
  // The bubble reads every [data-bubble-avoid] in the page, not only the desk's.
  assert.match(read(root, "src/components/desk/living-pet.tsx"), /document\.querySelectorAll<HTMLElement>\("\[data-desk-plate\], \[data-bubble-avoid\]"\)/);
});

test("the rain line says what it means, the same on the web, the overlay and the blotter", () => {
  const line = "It is raining outside. I will stay in, thanks.";
  assert.equal(W.weatherLine("red_panda", "rain"), line);
  assert.equal(W.weatherLine("goldfish", "rain"), "Proper weather. At last.");
  for (const f of ["desktop/renderer/weather.js", "client/computerpets_client/weather.py"]) assert.ok(read(repo, f).includes(line), f);
  for (const f of ["web/src/lib/pets/weather.ts", "desktop/renderer/weather.js", "client/computerpets_client/weather.py"]) {
    assert.doesNotMatch(read(repo, f), /honest about rain/, f);
  }
});

test("README, START-HERE and the desktop README agree: Talk plays the cry, Call back brings a pet in", () => {
  const readme = read(repo, "README.md");
  assert.match(readme, /\*\*Talk\*\* plays the pet's own cry when it has one, then the words show in a bubble\./);
  assert.doesNotMatch(readme, /\*\*Call\*\* uses a species cry/);
  assert.match(read(repo, "docs/START-HERE.md"), /\*\*Talk\*\* plays the pet's own sound when it has one \(Rui's is `red_panda\.wav`\)/);
  const desk = read(repo, "desktop/README.md");
  assert.match(desk, /- Talk plays the pet's own cry \(its wav in `renderer\/sounds\/`\) when it has one/);
  assert.doesNotMatch(desk, /Call uses a species cry/);
  // The code: Call back un-hides and speaks through say(), which plays the house cry first for those guests.
  const pet = read(repo, "desktop/renderer/pet.js");
  assert.match(pet, /if \(cmd === "call"\) \{\n\s+leaving = false;\n\s+pet\.classList\.remove\("hidden"\);\n\s+issue\("enter"\);\n\s+\}\n\s+const text = lineFrom\(result\);\n\s+say\(text\);/);
  assert.match(pet, /if \(kind && C && C\.prefersHouseCry && C\.prefersHouseCry\(kind\.key\) && window\.PetDeskHouse\) \{\n\s+const played = window\.PetDeskHouse\.playVoice/);
});

test("the /meet card names the real start, not a bare npm start", () => {
  const meet = read(root, "src/routes/meet.tsx");
  assert.doesNotMatch(meet, /desktop\/ — npm start/);
  assert.match(meet, />\.\\desktop\.ps1 on Windows · sh desktop\.sh on a Mac</);
});
