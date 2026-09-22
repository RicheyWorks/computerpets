const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const W = require("./windows.js");
const Enum = require("../windows-enum.cjs");

const mainSrc = readFileSync(join(__dirname, "..", "main.cjs"), "utf8");
const preloadSrc = readFileSync(join(__dirname, "..", "preload.cjs"), "utf8");
const petSrc = readFileSync(join(__dirname, "pet.js"), "utf8");
const htmlSrc = readFileSync(join(__dirname, "index.html"), "utf8");
const enumSrc = readFileSync(join(__dirname, "..", "windows-enum.cjs"), "utf8");

const WORK = { x: 0, y: 40, width: 1600, height: 900 };

function raw(over) {
  return {
    id: "100",
    left: 200,
    top: 120,
    right: 900,
    bottom: 700,
    minimized: false,
    tool: false,
    cloaked: false,
    className: "Chrome_WidgetWin_1",
    ...over,
  };
}

test("window-rect parsing sits work-area space and honors scale", () => {
  const line = "4242\t200\t120\t900\t700\t0\t0\t0\tChrome_WidgetWin_1";
  const parsed = W.parseEnumText(`${line}\nEND\n`);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, "4242");
  assert.equal(parsed[0].left, 200);
  assert.equal(parsed[0].minimized, false);
  assert.equal(parsed[0].shell, false);
  assert.equal(Object.prototype.hasOwnProperty.call(parsed[0], "className"), false);

  const [box] = W.takeRects(parsed, { workArea: WORK, scaleFactor: 1 });
  assert.equal(box.id, "4242");
  assert.equal(box.x, 200);
  assert.equal(box.y, 80);
  assert.equal(box.width, 700);
  assert.equal(box.height, 580);

  const [scaled] = W.takeRects(
    [{ id: "7", left: 300, top: 200, right: 900, bottom: 800 }],
    { workArea: { x: 0, y: 0, width: 960, height: 540 }, scaleFactor: 2 },
  );
  assert.equal(scaled.x, 150);
  assert.equal(scaled.y, 100);
  assert.equal(scaled.width, 300);
  assert.equal(scaled.height, 300);
});

test("the overlay hwnd, minimized, taskbar, and cloaked rows are not targets", () => {
  const overlayId = "9999";
  const rows = [
    raw({ id: overlayId }),
    raw({ id: "2", minimized: true }),
    raw({ id: "3", className: "Shell_TrayWnd", left: 0, top: 940, right: 1600, bottom: 1080 }),
    raw({ id: "4", className: "Progman", left: 0, top: 0, right: 1600, bottom: 1080 }),
    raw({ id: "5", tool: true }),
    raw({ id: "6", cloaked: true }),
    raw({ id: "7", left: 10, top: 10, right: 20, bottom: 20 }),
    raw({ id: "8", left: 240, top: 140, right: 880, bottom: 720 }),
  ];
  const taken = W.takeRects(rows, { workArea: WORK, skipIds: [overlayId] });
  assert.deepEqual(taken.map((w) => w.id), ["8"]);
  assert.equal(W.takeRects([raw({ id: overlayId })], { workArea: WORK, skipIds: [overlayId] }).length, 0);
});

test("Mac and Linux name the later door and do not invent rects", () => {
  assert.equal(W.enumeratesOn("win32"), true);
  assert.equal(W.enumeratesOn("Win32"), true);
  assert.equal(W.enumeratesOn("darwin"), false);
  assert.equal(W.enumeratesOn("linux"), false);
  assert.equal(W.laterDoor("win32"), null);
  assert.equal(W.laterDoor("darwin"), "mac-linux-window-play");
  assert.equal(W.laterDoor("linux"), "mac-linux-window-play");
});

test("enum lines keep a shell bit and drop titles, paths, and class names", () => {
  const titled = W.parseEnumText(
    "11\t100\t80\t500\t400\t0\t0\t0\t0\thomework.docx — Notepad\tC:\\Users\\keeper\\Desktop\\homework.docx\n",
  );
  assert.equal(titled[0].shell, false);
  assert.equal(JSON.stringify(titled).includes("homework"), false);
  assert.equal(JSON.stringify(titled).includes("Desktop"), false);
  const shell = W.parseEnumText("12\t0\t0\t1600\t1080\t0\t0\t0\t1\n");
  assert.equal(shell[0].shell, true);
  assert.equal(W.takeRects(shell, { workArea: WORK }).length, 0);
  const legacy = W.parseEnumText("13\t0\t940\t1600\t1080\t0\t0\t0\tShell_TrayWnd\n");
  assert.equal(legacy[0].shell, true);
  assert.equal(Object.prototype.hasOwnProperty.call(legacy[0], "className"), false);
  assert.equal(W.takeRects(legacy, { workArea: WORK }).length, 0);
});

test("enum JSON from a fake run is parsed; a later platform stays empty", async () => {
  const text = "11\t100\t80\t500\t400\t0\t0\t0\t0\nEND\n";
  const listed = await Enum.listRaw({
    platform: "win32",
    run: async () => text,
  });
  assert.equal(listed.later, null);
  assert.equal(listed.raw[0].id, "11");
  assert.equal(listed.raw[0].shell, false);
  assert.equal(JSON.stringify(listed.raw).includes("Notepad"), false);
  const later = await Enum.listRaw({ platform: "darwin" });
  assert.deepEqual(later.raw, []);
  assert.equal(later.later, "mac-linux-window-play");
});

test("hwnd buffer reads as the skip id", () => {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(123456789n, 0);
  assert.equal(W.hwndFromHandle(buf), "123456789");
  assert.equal(W.hwndFromHandle(null), "");
});

test("the overlay asks main for window rects; it does not capture pixels", () => {
  assert.match(mainSrc, /windows-enum/);
  assert.match(mainSrc, /takeRects/);
  assert.match(mainSrc, /skipIds/);
  assert.match(mainSrc, /hwndFromHandle/);
  assert.match(mainSrc, /webContents\.send\("windows"/);
  assert.match(preloadSrc, /onWindows/);
  assert.match(petSrc, /onWindows/);
  assert.match(petSrc, /PetWindowPlay/);
  assert.match(htmlSrc, /windows\.js/);
  assert.match(htmlSrc, /window-play\.js/);
  assert.match(enumSrc, /GetWindowRect/);
  assert.match(enumSrc, /IsIconic/);
  assert.doesNotMatch(enumSrc, /desktopCapturer|PrintWindow|BitBlt|GetDC|GetWindowText/);
  assert.doesNotMatch(enumSrc, /cls\.Replace/);
  assert.doesNotMatch(mainSrc, /desktopCapturer/);
  assert.doesNotMatch(petSrc, /desktopCapturer/);
});
