import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Newcomer pass 4 (September 2026): the last pass's ranked leftovers, each pinned to the thing it describes.
// The Unlock App ID logic itself is tested in desktop/license/session.test.cjs.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "..");
const read = (...p) => readFileSync(join(...p), "utf8").replace(/\r\n/g, "\n");

test("/hive says what the comb is and what Nectar and Tend do, in plain words", () => {
  const page = read(root, "src/routes/hive.tsx");
  assert.match(page, /headline="A beehive, and the bugs around it\."/);
  assert.match(page, /Brood counts the cells with young bees in them; Stores is the food put by\./);
  // Nectar is the feed care (hunger, shown as Stores); Tend is the rest care (energy). lib/pets/care.ts applySanctuaryCare.
  assert.match(page, /Nectar<\/strong> feeds the\s+hive and fills its Stores\./);
  assert.match(page, /Tend<\/strong> lets the bees rest\s+and get their energy back\./);
  assert.doesNotMatch(page, /The comb sits|The line stays|Tend the brood|THE LINE IS/i);
  const den = read(root, "src/components/desk/hive-den.tsx");
  assert.match(den, /\{ label: "Nectar", onClick: \(\) => tend\("feed"\) \}/);
  assert.match(den, /\{ label: "Tend", onClick: \(\) => tend\("rest"\) \}/);
  assert.match(den, /"The hive went quiet\. Nectar or Tend brings it back\."/);
  assert.doesNotMatch(den, /The line is the brood/);
});

test("/demo's desk strips say which desk they stand for", () => {
  const strips = {
    "mac-desk-extra.tsx": "on a Mac",
    "linux-desk-extra.tsx": "on Linux",
    "windows-desk-sit.tsx": "on Windows · tray: On the desk",
    "tablet-desk-sit.tsx": "on a tablet",
    "phone-desk-sit.tsx": "on a phone",
  };
  for (const [file, words] of Object.entries(strips)) {
    const src = read(root, "src/components/desk", file);
    assert.ok(src.includes(`{name} · ${words}`), file);
    assert.doesNotMatch(src, /\{name\} · the (extra|mark|sit)\b/, file);
  }
});

test("desk sound waits for a real tap, click or key: no AudioContext or play() before it, volumes untouched", () => {
  const src = read(root, "src/lib/pets/desk-audio.ts");
  assert.match(src, /if \(typeof window === "undefined" \|\| !heardGesture\(\)\) return null;\n\s+const Ctor = window\.AudioContext/);
  assert.match(src, /if \(!event\.isTrusted\) return;/);
  assert.match(src, /userActivation\?: \{ hasBeenActive\?: boolean \}/);
  assert.match(src, /if \(typeof window === "undefined" \|\| !heardGesture\(\)\) return Promise\.resolve\(false\);\n\s+try \{\n\s+const audio = new Audio\(src\);/);
  assert.match(src, /audio\.volume = Math\.max\(0, Math\.min\(1, guestOf\(card, guestKey\)\.volume \/ 100\)\);/);
});

test("the hello waits while the pet is hidden, and the plaque does not wait on a hello that is not shown", () => {
  const hint = read(root, "src/components/desk/first-hint.tsx");
  assert.match(hint, /export function FirstHint\(\{ name, onDone, wait = false \}/);
  assert.match(hint, /if \(!show \|\| wait\) return null;/);
  const room = read(root, "src/components/desk/companion-room.tsx");
  assert.match(room, /<FirstHint\n\s+name=\{displayName\}\n\s+wait=\{stats\.hidden\}/);
  assert.match(room, /\{\(hand \|\| deskFold\) && hintUp && !stats\.hidden \? null : \(/);
});

test("the catalog keeps the speech bubble off the whole Shelf card and each room's line", () => {
  const cat = read(root, "src/routes/catalog.tsx");
  assert.match(cat, /<aside data-bubble-avoid="" className="paper-card rounded-\[var\(--radius-lg\)\] border p-4">/);
  assert.match(cat, /<p data-bubble-avoid="" className="mt-1 text-sm text-muted">\{room\.line\}<\/p>/);
});

test("the House window's Steam App ID box shows only when this copy has one set up or saved", () => {
  const html = read(repo, "desktop/renderer/settings.html");
  assert.match(html, /<div id="appIdRow" hidden>\n\s+<label for="appId">Steam App ID<\/label>/);
  assert.match(html, /appIdRow\.hidden = !\(status\.steamAppId \|\| \(status\.fields && status\.fields\.appId\) \|\| appId\.value\);/);
  assert.match(html, /appId: appId\.value,/);
  const main = read(repo, "desktop/main.cjs");
  assert.match(main, /steamDirs: steamDirs\(\),/);
  assert.match(main, /dirs\.push\(path\.dirname\(app\.getPath\("exe"\)\)\);/);
  assert.match(read(repo, "desktop/README.md"), /\| `COMPUTERPETS_STEAM_APP_ID` \| no \|/);
});

test("/meet says what the nest and neglect mean, and a phone's line reads plainly", () => {
  const meet = read(root, "src/routes/meet.tsx");
  assert.doesNotMatch(meet, /The nest is a square|neglect can close a line|sit the\s+tall blotter/);
  assert.match(meet, /Two grown pets of a kind can pair in the nest, and a pet left without care for too long leaves\./);
});
