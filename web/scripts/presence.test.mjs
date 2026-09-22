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

test("the desk does not list user folders or read a window title", () => {
  for (const folder of ["Desktop", "Documents", "Downloads", "/home/keeper/Projects"]) {
    assert.deepEqual(P.listHostFolder(folder), { listed: false, names: [] });
  }
  const row = {
    title: "homework.docx — Notepad",
    document: "homework.docx",
    path: "C:\\Users\\keeper\\Desktop\\homework.docx",
  };
  assert.equal(P.windowCaption(row), null);
  assert.equal(P.hostPathLabel(row.path, false), "");
  assert.equal(P.hostPathLabel(row.path, true), row.path);
  const src = readFileSync(join(root, "src/lib/pets/presence.ts"), "utf8");
  assert.doesNotMatch(src, /readdir|showDirectoryPicker|webkitdirectory|getDirectory/);
});

test("a focused field keeps the key, and a key outside it is not logged", () => {
  let reads = 0;
  const field = {
    get key() {
      reads += 1;
      return "hunter2";
    },
    target: { tagName: "INPUT" },
  };
  const noted = P.classifyKey(field);
  assert.deepEqual(noted, { record: false, field: true, toggle: false });
  assert.equal(reads, 0);
  assert.equal(JSON.stringify(noted).includes("hunter2"), false);

  const ignored = P.classifyKey({ key: "hunter2", target: { tagName: "BODY" } });
  assert.deepEqual(ignored, { record: false, field: false, toggle: false });
  assert.equal(JSON.stringify(ignored).includes("hunter2"), false);
  const buf = [];
  assert.deepEqual(P.recordKeystroke(buf, { key: "hunter2" }), { record: false, keys: [] });
  assert.deepEqual(buf, []);
  const dismiss = P.classifyKey({ key: "Escape", target: { tagName: "DIV" } });
  assert.deepEqual(dismiss, { record: false, field: false, toggle: "dismiss" });
  assert.equal(JSON.stringify(dismiss).includes("Escape"), false);
  assert.equal(P.classifyKey({ key: "Escape", target: { tagName: "TEXTAREA" } }).field, true);
  assert.match(room, /classifyKey\(e\)/);
  const src = readFileSync(join(root, "src/lib/pets/presence.ts"), "utf8");
  assert.doesNotMatch(src, /SetWindowsHook|globalShortcut|keylog|uiohook|localStorage/);
});

test("the living desk and /demo install the drop guard", () => {
  assert.match(room, /installFileDropGuard/);
  assert.match(demo, /CompanionRoom/);
  const src = readFileSync(join(root, "src/lib/pets/presence.ts"), "utf8");
  assert.doesNotMatch(src, /getData|getAsFile|FileReader|showOpenFilePicker|webkitdirectory/);
});
