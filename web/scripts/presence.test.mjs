import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(join(root, "src/lib/pets/presence.ts"));
const room = readFileSync(join(root, "src/components/desk/companion-room.tsx"), "utf8");
const demo = readFileSync(join(root, "src/components/desk/demo-stage.tsx"), "utf8");
const plates = readFileSync(join(root, "src/components/desk/desk-plates.tsx"), "utf8");

test("desk presence refuses navigation and host paths", () => {
  assert.equal(P.allowNavigation("file:///home/keeper/homework.html"), false);
  assert.equal(P.allowNavigation("https://evil.example"), false);
  assert.equal(P.houseFile("/house", "card.json"), "/house/card.json");
  assert.equal(P.houseFile("/house", "mind.json"), "/house/mind.json");
  assert.equal(P.houseFile("/house", "../Desktop/notes.txt"), null);
  assert.equal(P.houseFile("/house", "hwid.txt"), null);
});

test("clipboard and file-system grants stay denied; geolocation is not a standing grant", async () => {
  P.clearWeatherLocate();
  assert.equal(P.allowPermission("geolocation", 1_000), false);
  assert.equal(P.armWeatherLocate(1_000), 1_000 + P.WEATHER_LOCATE_MS);
  assert.equal(P.allowPermission("geolocation", 1_000), true);
  assert.equal(P.allowPermission("geolocation", 1_000 + P.WEATHER_LOCATE_MS), false);
  P.clearWeatherLocate();
  assert.equal(P.allowPermission("geolocation", 1_500), false);
  assert.equal(P.allowPermission("clipboard-read"), false);
  assert.equal(P.allowPermission("display-capture"), false);
  assert.equal(P.allowPermission("fileSystem"), false);

  let watched = 0;
  const seen = [];
  const fix = await P.readWeatherHere(
    {
      getCurrentPosition(ok, _err, opts) {
        seen.push(opts);
        assert.equal(P.allowPermission("geolocation"), true);
        ok({ coords: { latitude: 47.6, longitude: -122.3 } });
      },
      watchPosition() {
        watched += 1;
      },
    },
  );
  assert.deepEqual(fix, { lat: 47.6, lon: -122.3 });
  assert.equal(seen[0].maximumAge, 0);
  assert.equal(seen[0].enableHighAccuracy, false);
  assert.equal(watched, 0);
  assert.equal(P.allowPermission("geolocation"), false);
  assert.equal(await P.readWeatherHere(undefined), null);
  assert.equal(P.ipPlace(), null);
  assert.equal(P.ipPlace(true), null);
  assert.match(plates, /readWeatherHere/);
  assert.match(plates, /ipPlace\(/);
  assert.match(plates, /HERE_SEND/);
  assert.match(plates, /HERE_ASK/);
  assert.match(plates, /HERE_YES/);
  assert.match(plates, /locateGate/);
  assert.match(plates, /sharePlace/);
  assert.match(plates, /loadCard\(\)/);
  const useAt = plates.indexOf("function useHere");
  const confirmAt = plates.indexOf("async function confirmHere");
  const useBody = plates.slice(useAt, confirmAt);
  assert.match(useBody, /locateGate\(areas, false\)/);
  assert.doesNotMatch(useBody, /readWeatherHere|reverseUrl|sharePlace/);
  const declineAt = plates.indexOf("function declineHere");
  const confirmBody = plates.slice(confirmAt, declineAt);
  assert.match(confirmBody, /locateGate\(areas, true\)/);
  assert.ok(confirmBody.indexOf("locateGate") < confirmBody.indexOf("readWeatherHere"));
  assert.ok(confirmBody.indexOf("sharePlace") < confirmBody.indexOf("reverseUrl"));
  assert.doesNotMatch(confirmBody, /latitude=\$\{fix|longitude=\$\{fix/);
  assert.match(plates, /forecastGate/);
  assert.match(plates, /SAVED_HERE_ASK/);
  assert.match(plates, /SAVED_HERE_YES/);
  assert.match(plates, /confirmSavedHere/);
  const savedAt = plates.indexOf("function confirmSavedHere");
  const savedBody = plates.slice(savedAt, savedAt + 500);
  assert.match(savedBody, /ackSavedHere\(areas\)/);
  assert.doesNotMatch(savedBody, /readWeatherHere|reverseUrl|sharePlace|armWeatherLocate|getCurrentPosition/);
  const gateAt = plates.indexOf("forecastGate(areas, card.hereForecastAck)");
  const forecastAt = plates.indexOf("forecastUrl(gate.area.lat, gate.area.lon)");
  assert.ok(gateAt > 0 && forecastAt > gateAt);
  const openAt = plates.indexOf("{open ? (");
  const askAt = plates.indexOf('id="weather-saved-ask"');
  assert.ok(openAt > 0 && askAt > openAt);
  assert.doesNotMatch(plates, /getCurrentPosition|watchPosition|maximumAge:\s*600/);
  assert.doesNotMatch(plates, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  const src = readFileSync(join(root, "src/lib/pets/presence.ts"), "utf8");
  assert.doesNotMatch(src, /watchPosition/);
  assert.doesNotMatch(src, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|fetch\(/);
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
