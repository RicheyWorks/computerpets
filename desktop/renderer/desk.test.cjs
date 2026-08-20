const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const D = require("./desk.js");

const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");

test("Mac extra click opens care; Windows tray still toggles", () => {
  assert.equal(D.extraClick("darwin"), "menu");
  assert.equal(D.extraClick("MacIntel"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(D.extraClick("linux"), "menu");
  assert.match(mainSrc, /extraClick/);
  assert.match(mainSrc, /popUpContextMenu/);
  assert.match(mainSrc, /win\.isVisible\(\)/);
  assert.match(mainSrc, /win\.hide\(\)/);
});

test("the Mac floor sits under the menu bar and follows the desk you are on", () => {
  assert.equal(D.followCursorDisplay("darwin"), true);
  assert.equal(D.followCursorDisplay("win32"), false);
  assert.equal(D.spacesWalk("darwin"), true);
  assert.equal(D.spacesWalk("win32"), false);
  assert.match(mainSrc, /getDisplayNearestPoint/);
  assert.match(mainSrc, /getCursorScreenPoint/);
  assert.match(mainSrc, /getPrimaryDisplay\(\)\.workArea/);
  assert.match(mainSrc, /setVisibleOnAllWorkspaces\(true, \{ visibleOnFullScreen: true \}\)/);
});

test("Mac overlay is a panel extra, not a Windows tray in a wrapper", () => {
  const mac = D.overlayChrome("darwin");
  assert.equal(mac.type, "panel");
  assert.equal(mac.acceptFirstMouse, true);
  assert.equal(mac.hiddenInMissionControl, true);
  assert.equal(mac.hideDock, true);
  assert.equal(D.firstClick("darwin"), "accept");
  assert.equal(D.extraIconTemplate("darwin"), true);
  assert.equal(D.appMenu("darwin"), true);

  const win = D.overlayChrome("win32");
  assert.equal(win.type, null);
  assert.equal(win.acceptFirstMouse, false);
  assert.equal(win.hiddenInMissionControl, false);
  assert.equal(D.firstClick("win32"), "focus");
  assert.equal(D.appMenu("win32"), false);

  assert.match(mainSrc, /acceptFirstMouse/);
  assert.match(mainSrc, /hiddenInMissionControl/);
  assert.match(mainSrc, /type: chrome\.type/);
  assert.match(mainSrc, /setTemplateImage/);
  assert.match(mainSrc, /setApplicationMenu/);
  assert.match(mainSrc, /label: "Care"/);
  const appMenuSrc = mainSrc.slice(mainSrc.indexOf("function macAppMenu"), mainSrc.indexOf("function refreshMenus"));
  assert.match(appMenuSrc, /label: "Care"/);
  assert.doesNotMatch(appMenuSrc, /Unlock/);
  assert.doesNotMatch(appMenuSrc, /Minds/);
});

test("a Mac tap talks; a drag is still a carry; control-click tends", () => {
  assert.equal(D.tapPx("darwin"), D.TAP_PX_MAC);
  assert.equal(D.tapPx("win32"), D.TAP_PX);
  assert.equal(D.tapPx("MacIntel"), 12);
  assert.equal(D.carePointer({ button: 2 }), true);
  assert.equal(D.carePointer({ button: 0, ctrlKey: true }), true);
  assert.equal(D.carePointer({ button: 0, ctrlKey: false }), false);
  assert.match(petSrc, /PetDesk/);
  assert.match(petSrc, /tapPx/);
  assert.match(petSrc, /carePointer/);
  assert.match(htmlSrc, /desk\.js/);
  assert.match(preloadSrc, /platform:\s*process\.platform/);
});

test("the Linux mark sits in the panel; a click opens care; first click is a sit", () => {
  assert.equal(D.isLinux("linux"), true);
  assert.equal(D.isLinux("Linux x86_64"), true);
  assert.equal(D.isLinux("win32"), false);
  assert.equal(D.isLinux("darwin"), false);
  assert.equal(D.extraClick("linux"), "menu");
  assert.equal(D.extraClick("Linux x86_64"), "menu");
  assert.equal(D.extraClick("win32"), "toggle");
  assert.equal(D.firstClick("linux"), "accept");
  assert.equal(D.spacesWalk("linux"), true);
  assert.equal(D.followCursorDisplay("linux"), true);
  assert.equal(D.extraIconTemplate("linux"), false);
  assert.equal(D.appMenu("linux"), false);
  assert.equal(D.tapPx("linux"), D.TAP_PX_LINUX);
  assert.equal(D.tapPx("Linux x86_64"), 10);
  assert.equal(D.hitForward("linux"), true);
  assert.equal(D.hitForward("win32"), false);
  assert.equal(D.hitForward("darwin"), false);

  const linux = D.overlayChrome("linux");
  assert.equal(linux.type, "toolbar");
  assert.equal(linux.acceptFirstMouse, true);
  assert.equal(linux.focusable, false);
  assert.equal(linux.hideDock, false);
  assert.equal(linux.hiddenInMissionControl, false);

  const win = D.overlayChrome("win32");
  assert.equal(win.type, null);
  assert.equal(win.focusable, true);
  const mac = D.overlayChrome("darwin");
  assert.equal(mac.type, "panel");
  assert.equal(mac.focusable, true);

  assert.equal(D.cursorHits({ x: 12, y: 8 }, [{ x: 10, y: 6, width: 20, height: 12 }]), true);
  assert.equal(D.cursorHits({ x: 4, y: 8 }, [{ x: 10, y: 6, width: 20, height: 12 }]), false);
  assert.equal(D.cursorHits({ x: 12, y: 8 }, [{ x: 10, y: 6, width: 1, height: 12 }]), false);
  assert.equal(D.sameArea({ x: 0, y: 24, width: 800, height: 600 }, { x: 0, y: 24, width: 800, height: 600 }), true);
  assert.equal(D.sameArea({ x: 0, y: 24, width: 800, height: 600 }, { x: 1920, y: 24, width: 800, height: 600 }), false);

  assert.match(mainSrc, /hitForward/);
  assert.match(mainSrc, /cursorHits/);
  assert.match(mainSrc, /set-hits/);
  assert.match(mainSrc, /focusable: chrome\.focusable/);
  assert.match(petSrc, /setHits|hitRects/);
  assert.match(preloadSrc, /setHits/);
});

test("the extra keeps the house verbs; hide-the-guest is not hide-the-window", () => {
  for (const verb of D.careVerbs()) {
    assert.match(mainSrc, new RegExp(`label: "${verb}"`));
  }
  assert.equal(D.hideWindowLabel(), "Hide the window");
  assert.equal([...mainSrc.matchAll(/label: "Call back"/g)].length, 1);
  assert.equal([...mainSrc.matchAll(/label: "Hide the window"/g)].length, 2);
  assert.doesNotMatch(mainSrc, /label: "Hide", click: \(\) => win\?\.hide/);
});
