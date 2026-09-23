import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = await import(join(root, "src/lib/pets/windows.ts"));
const require = createRequire(import.meta.url);
const Overlay = require(join(root, "../desktop/renderer/windows.js"));

const livingSrc = readFileSync(join(root, "src/components/desk/living-pet.tsx"), "utf8");
const demoSrc = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const plateSrc = readFileSync(join(root, "src/components/desk/demo-window-plate.tsx"), "utf8");
const roomSrc = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const startSrc = readFileSync(join(root, "../docs/START-HERE.md"), "utf8");

const WORK = { x: 0, y: 40, width: 1600, height: 900 };

test("web and overlay parse the same window TSV", () => {
  const text =
    "88\t200\t120\t900\t700\t0\t0\t0\t0\thomework.docx — Notepad\tC:\\Users\\keeper\\Documents\\notes.txt\n";
  const web = W.parseEnumText(text);
  const desk = Overlay.parseEnumText(text);
  assert.deepEqual(web, desk);
  assert.equal(web[0].shell, false);
  assert.equal(JSON.stringify(web).includes("homework"), false);
  assert.equal(JSON.stringify(web).includes("Documents"), false);
  const taken = W.takeRects(web, { workArea: WORK, scaleFactor: 1 });
  assert.equal(taken[0].y, 80);
  assert.deepEqual(Object.keys(taken[0]).sort(), ["height", "id", "width", "x", "y"]);
  assert.equal(Overlay.laterDoor("darwin"), W.LATER_DOOR);
  assert.equal(W.LATER_DOOR, null);
  assert.equal(W.enumeratesOn("win32"), true);
  assert.equal(W.enumeratesOn("linux"), true);
  assert.equal(W.enumeratesOn("darwin"), true);
  assert.equal(W.laterDoor("linux"), null);
  assert.equal(W.laterDoor("darwin"), null);
  assert.equal(Overlay.enumeratesOn("linux"), true);
  assert.equal(Overlay.enumeratesOn("darwin"), true);
  assert.deepEqual(Overlay.MAC_SHELL_BUNDLES, W.MAC_SHELL_BUNDLES);
  assert.deepEqual(Overlay.MAC_TOOL_SUBROLES, W.MAC_TOOL_SUBROLES);
  assert.deepEqual(Overlay.MAC_TOOL_BUNDLES, W.MAC_TOOL_BUNDLES);
  assert.equal(W.cgWindowIdFromMediaSource("window:1869:0"), "1869");
  assert.equal(W.cgWindowIdFromMediaSource("window:-1:0"), "");
  assert.equal(W.macWindowBits("AXStandardWindow", "com.apple.dock", false, false).shell, true);
  assert.equal(W.macWindowBits("AXFloatingWindow", "com.example.notes", false, false).tool, true);
  assert.equal(Overlay.macWindowBits("AXStandardWindow", "com.apple.dock", false, false).shell, true);
});

test("overlay-self and the taskbar never become a climb target", () => {
  const rows = [
    { id: "self", left: 0, top: 40, right: 1600, bottom: 940, className: "Chrome_WidgetWin_1" },
    { id: "bar", left: 0, top: 940, right: 1600, bottom: 1080, className: "Shell_TrayWnd" },
    { id: "hw", left: 240, top: 140, right: 880, bottom: 720, className: "Notepad" },
  ];
  const taken = W.takeRects(rows, { workArea: WORK, skipIds: ["self"] });
  assert.deepEqual(taken.map((w) => w.id), ["hw"]);
});

test("the demo draws a window plate; the overlay keeps real rects", () => {
  assert.match(demoSrc, /demoWindow/);
  assert.match(roomSrc, /DemoWindowPlate/);
  assert.match(plateSrc, /data-demo-window/);
  assert.match(plateSrc, /A window/);
  assert.match(plateSrc, /A second window/);
  assert.equal(W.demoWindowPlates({ width: 1400, height: 800 }).length, 2);
  assert.match(livingSrc, /window-play/);
  assert.match(livingSrc, /beginPlay/);
  assert.doesNotMatch(plateSrc, /desktopCapturer|GetDC|BitBlt/);
  assert.match(startSrc, /221/);
});
