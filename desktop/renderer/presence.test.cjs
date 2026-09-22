const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Presence = require("../presence.cjs");
const Guard = require("./presence.js");

const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const settingsSrc = readFileSync(join(__dirname, "settings.html"), "utf8");
const enumSrc = readFileSync(join(__dirname, "..", "windows-enum.cjs"), "utf8");
const guardSrc = readFileSync(join(__dirname, "presence.js"), "utf8");
const webSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "lib", "pets", "presence.ts"), "utf8");
const roomSrc = readFileSync(join(__dirname, "..", "..", "web", "src", "components", "desk", "companion-room.tsx"), "utf8");
const pySrc = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "presence.py"), "utf8");
const appSrc = readFileSync(join(__dirname, "..", "..", "client", "computerpets_client", "app.py"), "utf8");

test("presence writes stay inside userData house files", () => {
  const card = Presence.houseFile("/tmp/computerpets-user", "card.json");
  const mind = Presence.houseFile("/tmp/computerpets-user", "mind.json");
  assert.equal(card, "/tmp/computerpets-user/card.json");
  assert.equal(mind, "/tmp/computerpets-user/mind.json");
  assert.equal(Presence.houseFile("/tmp/computerpets-user", "../secrets.txt"), null);
  assert.equal(Presence.houseFile("/tmp/computerpets-user", "/etc/passwd"), null);
  assert.equal(Presence.houseFile("/tmp/computerpets-user", "Desktop/homework.txt"), null);
  assert.equal(Presence.houseFile("/tmp/computerpets-user", "hwid.txt"), null);
  assert.equal(Presence.houseFile("", "card.json"), null);
  assert.equal(Presence.houseFile("/tmp/computerpets-user", "card.json/../../x"), null);
});

test("in-page navigation is refused, including a dropped file URL", () => {
  assert.equal(Presence.allowNavigation(), false);
  assert.equal(Presence.allowNavigation("file:///home/keeper/homework.html"), false);
  assert.equal(Presence.allowNavigation("https://evil.example/exfil"), false);
});

test("clipboard, screen capture, and the file system stay denied; geolocation is the weather button", () => {
  assert.equal(Presence.allowPermission("geolocation"), true);
  for (const name of ["clipboard-read", "clipboard-sanitized-write", "display-capture", "media", "keyboardLock", "fileSystem", "midi", ""]) {
    assert.equal(Presence.allowPermission(name), false, name);
  }
});

test("window payloads stay rects — titles and paths are dropped", () => {
  const scrubbed = Presence.scrubWindows([
    {
      id: "9",
      x: 10,
      y: 20,
      width: 300,
      height: 200,
      title: "homework.docx — Notepad",
      className: "CabinetWClass",
      path: "C:\\Users\\keeper\\Desktop\\homework.docx",
    },
    { id: "", x: 1, y: 1, width: 1, height: 1 },
  ]);
  assert.deepEqual(scrubbed, [{ id: "9", x: 10, y: 20, width: 300, height: 200 }]);
  assert.equal(JSON.stringify(scrubbed).includes("homework"), false);
  assert.equal(JSON.stringify(scrubbed).includes("Cabinet"), false);
});

test("presence does not list Desktop, Documents, or Downloads", () => {
  for (const folder of ["Desktop", "Documents", "Downloads", "C:\\Users\\keeper\\Pictures", "/home/keeper/Projects"]) {
    const listed = Presence.listHostFolder(folder);
    assert.deepEqual(listed, { listed: false, names: [] });
  }
  assert.doesNotMatch(readFileSync(join(__dirname, "..", "presence.cjs"), "utf8"), /readdir|readdirSync|Get-ChildItem|listdir/);
});

test("a window caption is never a title, and a path needs consent", () => {
  const row = {
    title: "homework.docx — Notepad",
    document: "homework.docx",
    path: "C:\\Users\\keeper\\Documents\\homework.docx",
    className: "CabinetWClass",
  };
  assert.equal(Presence.windowCaption(row), null);
  assert.equal(Presence.hostPathLabel(row.path, false), "");
  assert.equal(Presence.hostPathLabel(row.path, undefined), "");
  assert.equal(Presence.hostPathLabel(row.path, true), row.path);
  assert.equal(Presence.hostPathLabel("  ", true), "");
});

test("a focused field keeps the key, and a key outside it is not logged", () => {
  let fieldReads = 0;
  const field = {
    get key() {
      fieldReads += 1;
      return "hunter2";
    },
    target: { tagName: "INPUT" },
  };
  const noted = Presence.classifyKey(field);
  assert.deepEqual(noted, { record: false, field: true, toggle: false });
  assert.equal(fieldReads, 0);
  assert.equal(JSON.stringify(noted).includes("hunter2"), false);

  let logReads = 0;
  const outside = {
    get key() {
      logReads += 1;
      return "hunter2";
    },
    target: { tagName: "BODY" },
  };
  const ignored = Presence.classifyKey(outside);
  assert.deepEqual(ignored, { record: false, field: false, toggle: false });
  assert.equal(JSON.stringify(ignored).includes("hunter2"), false);
  const buf = [];
  const logged = Presence.recordKeystroke(buf, outside);
  assert.deepEqual(logged, { record: false, keys: [] });
  assert.deepEqual(buf, []);
  assert.equal(logReads, 1);

  const dismiss = Presence.classifyKey({ key: "Escape", target: { tagName: "DIV" } });
  assert.deepEqual(dismiss, { record: false, field: false, toggle: "dismiss" });
  assert.equal(JSON.stringify(dismiss).includes("Escape"), false);
  const inField = Presence.classifyKey({ key: "Escape", target: { tagName: "TEXTAREA" } });
  assert.equal(inField.field, true);
  assert.equal(inField.toggle, false);

  const guardNote = Guard.classifyKey({ key: "q", target: { tagName: "SELECT" } });
  assert.deepEqual(guardNote, { record: false, field: true, toggle: false });
  assert.deepEqual(Guard.recordKeystroke(["q"], { key: "q" }), { record: false, keys: [] });
  assert.doesNotMatch(readFileSync(join(__dirname, "..", "presence.cjs"), "utf8"), /SetWindowsHook|globalShortcut|keylog|uiohook/);
  assert.doesNotMatch(guardSrc, /SetWindowsHook|globalShortcut|keylog|uiohook|localStorage/);
});

test("a host file drop is not a gift and is not read", () => {
  const file = Presence.refuseFileDrop({ types: ["Files", "text/uri-list"], fileCount: 1 });
  assert.deepEqual(file, { accept: false, read: false, files: true });
  const uri = Presence.refuseFileDrop({ types: ["text/uri-list"], files: { length: 0 } });
  assert.equal(uri.files, true);
  assert.equal(uri.read, false);
  const text = Presence.refuseFileDrop({ types: ["text/plain"], files: { length: 0 } });
  assert.equal(text.files, false);
  assert.equal(text.read, false);
  assert.equal(Guard.hasHostFiles({ types: ["Files"], files: { length: 1 } }), true);
  assert.equal(Guard.hasHostFiles({ types: ["text/plain"], files: { length: 0 } }), false);
});

test("install cancels a file drop and does not read the path", () => {
  const events = {};
  const node = {
    addEventListener(type, fn) {
      events[type] = fn;
    },
    removeEventListener() {},
  };
  const stop = Guard.install(node);
  let prevented = false;
  const transfer = { types: ["Files", "text/uri-list"], files: { length: 1 }, dropEffect: "copy" };
  events.drop({
    dataTransfer: transfer,
    preventDefault() {
      prevented = true;
    },
    stopPropagation() {},
  });
  assert.equal(prevented, true);
  assert.equal(transfer.dropEffect, "none");
  assert.equal(Object.prototype.hasOwnProperty.call(transfer, "path"), false);
  events.dragover({
    dataTransfer: { types: ["text/plain"], files: { length: 0 } },
    preventDefault() {
      throw new Error("plain text is not a host file");
    },
    stopPropagation() {},
  });
  stop();
});

test("the drop guard never reads a path or the file bytes", () => {
  assert.doesNotMatch(guardSrc, /getData|getAsFile|FileReader|readAsText|getPathForFile|webUtils|showOpenFilePicker/);
  assert.match(guardSrc, /dropEffect = "none"/);
  assert.match(htmlSrc, /presence\.js/);
  assert.match(settingsSrc, /presence\.js/);
});

test("overlay main seals navigation and permissions and scrubs window rows", () => {
  assert.match(mainSrc, /sealDeskContents/);
  assert.match(mainSrc, /will-navigate/);
  assert.match(mainSrc, /will-redirect/);
  assert.match(mainSrc, /will-frame-navigate/);
  assert.match(mainSrc, /setWindowOpenHandler/);
  assert.match(mainSrc, /action: "deny"/);
  assert.match(mainSrc, /setPermissionRequestHandler/);
  assert.match(mainSrc, /setPermissionCheckHandler/);
  assert.match(mainSrc, /Presence\.allowPermission/);
  assert.match(mainSrc, /Presence\.scrubWindows/);
  assert.match(mainSrc, /Presence\.houseFile/);
  assert.doesNotMatch(mainSrc, /clipboard|globalShortcut|desktopCapturer|getPathForFile|showOpenDialog|SetWindowsHook|uiohook|before-input-event/);
  assert.doesNotMatch(preloadSrc, /clipboard|getPathForFile|showOpenFilePicker|readFile/);
  assert.doesNotMatch(petSrc, /dataTransfer|getPathForFile|showOpenFilePicker|clipboard|desktopCapturer/);
  assert.doesNotMatch(enumSrc, /GetWindowText|desktopCapturer|PrintWindow|BitBlt|GetDC/);
  assert.doesNotMatch(enumSrc, /Get-ChildItem|Directory\.GetFiles|Environment\.GetFolderPath|SpecialFolder|KnownFolder|cls\.Replace/);
  assert.match(enumSrc, /shell \? "1" : "0"/);
});

test("desk, demo, and blotter share the same refusal", () => {
  assert.match(webSrc, /card\.json/);
  assert.match(webSrc, /mind\.json/);
  assert.match(webSrc, /return false/);
  assert.match(webSrc, /geolocation/);
  assert.match(webSrc, /installFileDropGuard/);
  assert.match(roomSrc, /installFileDropGuard/);
  assert.match(pySrc, /card\.json/);
  assert.match(pySrc, /def allow_navigation/);
  assert.match(pySrc, /return False/);
  assert.match(appSrc, /seal_widget/);
  assert.match(appSrc, /def dragEnterEvent/);
  assert.match(appSrc, /def dropEvent/);
  assert.doesNotMatch(appSrc, /mimeData\(\)|urls\(\)/);
  assert.match(webSrc, /export function classifyKey/);
  assert.match(webSrc, /export function recordKeystroke/);
  assert.match(roomSrc, /classifyKey\(e\)/);
  assert.match(petSrc, /PetPresence\.classifyKey\(e\)/);
  assert.match(pySrc, /def classify_key/);
  assert.match(pySrc, /def record_keystroke/);
  assert.match(appSrc, /classify_key/);
  assert.match(appSrc, /record_keystroke/);
  assert.doesNotMatch(appSrc, /grabKeyboard|SetWindowsHook|pynput|keyPressEvent|installEventFilter/);
  assert.doesNotMatch(petSrc, /recordKeystroke|keylog|SetWindowsHook/);
  assert.doesNotMatch(roomSrc, /recordKeystroke|keylog/);
  const listenerAt = petSrc.indexOf('document.addEventListener("keydown"');
  const listener = petSrc.slice(listenerAt, listenerAt + 420);
  assert.match(listener, /classifyKey\(e\)/);
  assert.equal(listener.slice(0, listener.indexOf("classifyKey")).includes("e.key"), false);
});
