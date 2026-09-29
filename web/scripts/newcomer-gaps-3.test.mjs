import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Newcomer pass 3 (September 2026): small targets, the care row on a cold load, sign-in that can finish locally,
// and a hidden pet's care row, each pinned to the thing it describes. The browser sweep of every page is in
// phone-desk-layout.test.mjs ("every page at phone, tablet and laptop sizes").
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");
const L = await import(pathToFileURL(join(root, "src/lib/auth/local-sign-in.ts")).href);
const H = await import(pathToFileURL(join(root, "src/lib/pets/hidden-care.ts")).href);

const ROOMS = ["canopy", "cellar", "corner", "creek", "far", "garden", "grid", "hive", "log", "meadow", "pond", "reef", "roost", "sea", "shore", "snakes", "stone", "study", "well", "wood"];

test("the twenty room pages' Open the desk with this one, and the shelf's Open the room, are 44 px tall", () => {
  for (const r of ROOMS) {
    const src = read(root, "src/routes", `${r}.tsx`);
    assert.match(src, /<Link to="\/" search=\{\{ pet: selected \}\} className="inline-flex min-h-11 items-center text-sm text-fg">\n\s+Open the desk with this one/, r);
  }
  assert.match(read(root, "src/routes/catalog.tsx"), /data-open-room className="inline-flex min-h-11 items-center /);
});

test("every field on the keeper card is at least 24 px: the slider, the text, time and number fields, the selects", () => {
  const css = read(root, "src/styles.css");
  assert.match(css, /\.keeper-card input:not\(\[type="hidden"\]\):not\(\[type="checkbox"\]\):not\(\[type="radio"\]\),\n\s+\.keeper-card select,\n\s+\.keeper-card textarea \{\n\s+min-height: 24px;/);
});

test("before the desk has measured, the panel and the rail stop above the care buttons", () => {
  const room = read(root, "src/components/desk/companion-room.tsx");
  assert.match(room, /"absolute left-4 top-20 z-20 max-h-\[calc\(100dvh-15rem\)\] max-w-\[min\(100%-2rem,20rem\)\] [^"]*sm:max-h-\[calc\(100dvh-16rem\)\]"/);
  assert.match(room, /"absolute right-4 top-20 z-20 max-h-\[calc\(100dvh-15rem\)\] max-w-\[11rem\] [^"]*sm:max-h-\[calc\(100dvh-16rem\)\]"/);
  // The measured height still wins (an inline style).
  assert.match(room, /!hand && !pad && deskFit \? \{ maxHeight: deskFit\.asideMax \}/);
});

test("sign-in on localhost: the note shows only when the server has no sign-in client of its own", () => {
  assert.equal(L.hasOwnSignInClient({}), false);
  assert.equal(L.hasOwnSignInClient({ GROK_AUTH_CLIENT_ID: "mine" }), false, "no secret");
  assert.equal(L.hasOwnSignInClient({ GROK_AUTH_CLIENT_ID: " ", GROK_AUTH_CLIENT_SECRET: "s" }), false, "blank id");
  assert.equal(L.hasOwnSignInClient({ GROK_AUTH_CLIENT_ID: "grok_preview", GROK_AUTH_CLIENT_SECRET: "s" }), false, "the shared preview client");
  assert.equal(L.hasOwnSignInClient({ GROK_AUTH_CLIENT_ID: "mine", GROK_AUTH_CLIENT_SECRET: "s" }), true);
  assert.equal(L.localSignInBlocked("localhost", false), true);
  assert.equal(L.localSignInBlocked("127.0.0.1", true), false, "a local copy with its own client keeps the buttons");
  assert.equal(L.localSignInBlocked("computerpets.vercel.app", false), false, "production is unchanged");
  assert.equal(L.localSignInBlocked("x.grok-sandbox.com", false), false, "the hosted preview is unchanged");
  // The name matches the preview client the server falls back to.
  assert.match(read(root, "src/lib/auth/preview.ts"), new RegExp(`export const PREVIEW_CLIENT_ID = "${L.PREVIEW_CLIENT_NAME}";`));
  const reach = read(root, "src/lib/auth/sign-in-reach.ts");
  assert.match(reach, /createServerFn\(\{ method: "GET" \}\)\.handler\(async \(\) => \(\{\n\s+ownClient: hasOwnSignInClient\(process\.env\),\n\s*\}\)\)/);
  assert.doesNotMatch(reach, /GROK_AUTH_CLIENT_SECRET/, "only a yes or no leaves the server");
  const login = read(root, "src/routes/login.tsx");
  assert.match(login, /loader: \(\) => getSignInReach\(\)\.catch\(\(\) => \(\{ ownClient: false \}\)\),/);
  assert.match(login, /setBlocked\(localSignInBlocked\(window\.location\.hostname, ownClient\)\)/);
  assert.match(login, /\{authEnabled && blocked \? \(/);
  assert.match(read(root, "README.md"), /sign-in can finish there, so the page keeps the buttons/);
});

test("a hidden pet's care row says why Feed, the treat, Play and Talk wait", () => {
  assert.equal(H.hiddenCareLine("Rui", "Bamboo"), "Rui is hidden. Press Call back to bring Rui back. Feed, Bamboo, Play and Talk wait until then.");
  assert.equal(H.hiddenCareLine(" ", ""), "The pet is hidden. Press Call back to bring The pet back. Feed, the treat, Play and Talk wait until then.");
  const room = read(root, "src/components/desk/companion-room.tsx");
  assert.match(room, /<p data-hidden-note className="keeper-truth" hidden=\{!stats\.hidden\} aria-live="polite">\n\s+\{stats\.hidden \? hiddenCareLine\(displayName, treatFor\(kind\.key\)\.verb\) : ""\}/);
  assert.match(room, /\{ label: "Talk", onClick: \(\) => void talk\(\), disabled: busyOrHidden \},/);
  assert.match(room, /disabled=\{busyOrHidden \|\| !draft\.trim\(\)\}\n\s+>\n\s+Send/);
});

test("/mind's custom webhook says where the builder details are", () => {
  assert.match(read(root, "src/lib/ai/catalog.ts"), /blurb: "Your own AI address\. Details are under For builders, below\.",/);
});

test("the /meet phone test waits for the jump links to hydrate before tapping them", () => {
  const t = read(root, "scripts/phone-desk-layout.test.mjs");
  assert.match(t, /await page\.waitForSelector\("\[data-meet-index\] a", \{ timeout: 60_000 \}\);\n(\s+\/\/.*\n)+\s+await page\.waitForFunction\(\(\) => \{\n\s+const a = document\.querySelector\("\[data-meet-index\] a"\);\n\s+return !!a && Object\.keys\(a\)\.some\(\(k\) => k\.startsWith\("__reactProps"\)\);/);
});
