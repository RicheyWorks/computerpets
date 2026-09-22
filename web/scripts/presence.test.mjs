import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(join(root, "src/lib/pets/presence.ts"));
const room = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demo = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");

test("desk presence refuses navigation and host paths", () => {
  assert.equal(P.allowNavigation("file:///home/keeper/homework.html"), false);
  assert.equal(P.allowNavigation("https://evil.example"), false);
  assert.equal(P.houseFile("/house", "card.json"), "/house/card.json");
  assert.equal(P.houseFile("/house", "mind.json"), "/house/mind.json");
  assert.equal(P.houseFile("/house", "../Desktop/notes.txt"), null);
  assert.equal(P.houseFile("/house", "hwid.txt"), null);
});

test("clipboard and file-system grants stay denied", () => {
  assert.equal(P.allowPermission("geolocation"), true);
  assert.equal(P.allowPermission("clipboard-read"), false);
  assert.equal(P.allowPermission("display-capture"), false);
  assert.equal(P.allowPermission("fileSystem"), false);
});

test("a dropped file is not a gift and is not read", () => {
  const dropped = P.refuseFileDrop({ types: ["Files", "text/uri-list"], fileCount: 1 });
  assert.deepEqual(dropped, { accept: false, read: false, files: true });
  const plain = P.refuseFileDrop({ types: ["text/plain"], files: [] });
  assert.equal(plain.files, false);
  assert.equal(plain.read, false);
});

test("the living desk and /demo install the drop guard", () => {
  assert.match(room, /installFileDropGuard/);
  assert.match(demo, /CompanionRoom/);
  const src = readFileSync(join(root, "src/lib/pets/presence.ts"), "utf8");
  assert.doesNotMatch(src, /getData|getAsFile|FileReader|showOpenFilePicker|webkitdirectory/);
});
