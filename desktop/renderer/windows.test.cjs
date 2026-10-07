const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { execFileSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { readFileSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { spawn } = require("node:child_process");
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

test("Windows, Linux, and Mac enumerate and do not name a later door", () => {
  assert.equal(W.enumeratesOn("win32"), true);
  assert.equal(W.enumeratesOn("Win32"), true);
  assert.equal(W.enumeratesOn("linux"), true);
  assert.equal(W.enumeratesOn("Linux"), true);
  assert.equal(W.enumeratesOn("darwin"), true);
  assert.equal(W.enumeratesOn("Mac"), true);
  assert.equal(W.laterDoor("win32"), null);
  assert.equal(W.laterDoor("linux"), null);
  assert.equal(W.laterDoor("darwin"), null);
  assert.equal(W.laterDoor("Mac"), null);
  assert.equal(W.LATER_DOOR, null);
  assert.equal(W.isLinux("linux"), true);
  assert.equal(W.isMac("darwin"), true);
});

test("a Mac media source id is the window number, and a view pointer is not", () => {
  assert.equal(W.cgWindowIdFromMediaSource("window:1869:0"), "1869");
  assert.equal(W.cgWindowIdFromMediaSource("window:1869:1"), "1869");
  assert.equal(W.cgWindowIdFromMediaSource("window:-1:0"), "");
  assert.equal(W.cgWindowIdFromMediaSource("window:0:0"), "");
  assert.equal(W.cgWindowIdFromMediaSource("1869"), "");
  assert.equal(W.cgWindowIdFromMediaSource(""), "");
});

test("Mac shell, tool, minimized, and hidden bits match the helper", () => {
  const classify = new Function(
    "SHELL",
    "TOOL_SUB",
    "TOOL_BUNDLE",
    `${Enum.MAC_CLASSIFY_JS}\nreturn classify;`,
  )(W.MAC_SHELL_BUNDLES, W.MAC_TOOL_SUBROLES, W.MAC_TOOL_BUNDLES);
  const cases = [
    ["AXStandardWindow", "com.example.notes", false, false, { minimized: false, tool: false, cloaked: false, shell: false }],
    ["AXFloatingWindow", "com.example.notes", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXSystemFloatingWindow", "com.example.notes", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXDialog", "com.example.notes", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXSystemDialog", "com.example.notes", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXUnknown", "com.example.notes", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXStandardWindow", "com.apple.dock", false, false, { minimized: false, tool: false, cloaked: false, shell: true }],
    ["AXFloatingWindow", "com.apple.dock", false, false, { minimized: false, tool: false, cloaked: false, shell: true }],
    ["AXStandardWindow", "com.apple.WindowServer", false, false, { minimized: false, tool: false, cloaked: false, shell: true }],
    ["AXStandardWindow", "com.apple.SystemUIServer", false, false, { minimized: false, tool: false, cloaked: false, shell: true }],
    ["AXStandardWindow", "com.apple.controlcenter", false, false, { minimized: false, tool: false, cloaked: false, shell: true }],
    ["", "com.apple.notificationcenterui", false, false, { minimized: false, tool: true, cloaked: false, shell: false }],
    ["AXStandardWindow", "com.example.notes", true, false, { minimized: true, tool: false, cloaked: false, shell: false }],
    ["AXStandardWindow", "com.example.notes", false, true, { minimized: false, tool: false, cloaked: true, shell: false }],
  ];
  for (const [sub, bundle, mini, hidden, expect] of cases) {
    assert.deepEqual(W.macWindowBits(sub, bundle, mini, hidden), expect);
    const bits = classify(sub, bundle, mini, hidden);
    assert.equal(bits.mini, expect.minimized ? 1 : 0);
    assert.equal(bits.tool, expect.tool ? 1 : 0);
    assert.equal(bits.cloaked, expect.cloaked ? 1 : 0);
    assert.equal(bits.shell, expect.shell ? 1 : 0);
  }
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

test("enum text from a fake run is parsed on Windows, Mac, and Linux", async () => {
  const text = "11\t100\t80\t500\t400\t0\t0\t0\t0\nEND\n";
  const listed = await Enum.listRaw({
    platform: "win32",
    run: async () => text,
  });
  assert.equal(listed.later, null);
  assert.equal(listed.raw[0].id, "11");
  assert.equal(listed.raw[0].shell, false);
  assert.equal(JSON.stringify(listed.raw).includes("Notepad"), false);
  const mac = await Enum.listRaw({
    platform: "darwin",
    run: async () => text,
  });
  assert.equal(mac.later, null);
  assert.equal(mac.raw[0].id, "11");
  assert.equal(mac.raw[0].shell, false);
  const linux = await Enum.listRaw({
    platform: "linux",
    run: async () => text,
  });
  assert.equal(linux.later, null);
  assert.equal(linux.raw[0].id, "11");
  assert.equal(linux.raw[0].shell, false);
});

test("hwnd buffer reads as the skip id", () => {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(123456789n, 0);
  assert.equal(W.hwndFromHandle(buf), "123456789");
  assert.equal(W.hwndFromHandle(null), "");
});

test("the overlay asks main for window rects; it does not capture pixels", () => {
  assert.match(mainSrc, /windows-enum/);
  assert.match(mainSrc, /windowEnumsHere/);
  assert.match(mainSrc, /Desk\.isLinux/);
  assert.match(mainSrc, /Desk\.isMac/);
  assert.match(mainSrc, /takeRects/);
  assert.match(mainSrc, /skipIds/);
  assert.match(mainSrc, /hwndFromHandle/);
  assert.match(mainSrc, /getMediaSourceId/);
  assert.match(mainSrc, /cgWindowIdFromMediaSource/);
  assert.match(mainSrc, /isMac\(process\.platform\) \? 1/);
  assert.match(mainSrc, /webContents\.send\("windows"/);
  assert.match(preloadSrc, /onWindows/);
  assert.match(petSrc, /onWindows/);
  assert.match(petSrc, /PetWindowPlay/);
  assert.match(htmlSrc, /windows\.js/);
  assert.match(htmlSrc, /window-play\.js/);
  assert.match(enumSrc, /GetWindowRect/);
  assert.match(enumSrc, /IsIconic/);
  assert.match(enumSrc, /GetShellWindow/);
  assert.match(enumSrc, /FindWindowEx\(IntPtr\.Zero, prev, name, null\)/);
  for (const name of ["Shell_TrayWnd", "Shell_SecondaryTrayWnd", "NotifyIconOverflowWindow", "Progman", "WorkerW"]) {
    assert.match(enumSrc, new RegExp(name));
  }
  assert.doesNotMatch(enumSrc, /desktopCapturer|PrintWindow|BitBlt|GetDC|GetWindowText|GetClassName|StringBuilder/);
  assert.doesNotMatch(enumSrc, /cls\.Replace/);
  assert.doesNotMatch(mainSrc, /desktopCapturer/);
  assert.doesNotMatch(petSrc, /desktopCapturer/);
  assert.match(enumSrc, /_NET_CLIENT_LIST/);
  assert.match(enumSrc, /_NET_WM_WINDOW_TYPE_DOCK/);
  assert.match(enumSrc, /_NET_WM_WINDOW_TYPE_DESKTOP/);
  assert.equal(Enum.enumCommand("linux").cmd, "python3");
  assert.equal(Enum.enumCommand("win32").cmd, "powershell.exe");
  assert.equal(Enum.enumCommand("darwin").cmd, "/usr/bin/osascript");
  assert.deepEqual(Enum.enumCommand("darwin").args.slice(0, 3), ["-l", "JavaScript", "-e"]);
  assert.doesNotMatch(Enum.LINUX_ENUM_SCRIPT, /WM_NAME|_NET_WM_NAME|WM_CLASS|_NET_WM_ICON_NAME|XFetchName|xcb_get_atom_name/);
  const macSrc = Enum.macEnumScript();
  assert.match(macSrc, /AXIsProcessTrusted/);
  assert.match(macSrc, /_AXUIElementGetWindow/);
  assert.match(macSrc, /AXWindows/);
  assert.match(macSrc, /AXPosition/);
  assert.match(macSrc, /AXSize/);
  assert.match(macSrc, /AXMinimized/);
  assert.match(macSrc, /AXSubrole/);
  assert.match(macSrc, /AXRole/);
  assert.doesNotMatch(macSrc, /AXTitle|kCGWindowName|CGWindowListCopyWindowInfo|AXTrustedCheckOptionPrompt|AXIsProcessTrustedWithOptions/);
  for (const name of W.MAC_SHELL_BUNDLES) assert.match(macSrc, new RegExp(name.replace(/\./g, "\\.")));
  const checked = join(tmpdir(), "computerpets-mac-window-enum.js");
  writeFileSync(checked, macSrc);
  execFileSync(process.execPath, ["--check", checked], { stdio: "pipe" });
});

function fakePump(text) {
  const stdout = new EventEmitter();
  stdout.setEncoding = () => {};
  const stderr = new EventEmitter();
  stderr.setEncoding = () => {};
  const child = new EventEmitter();
  child.stdout = stdout;
  child.stderr = stderr;
  child.stdin = {
    write(chunk) {
      if (String(chunk).startsWith("tick")) setImmediate(() => stdout.emit("data", text));
      return true;
    },
  };
  child.kill = () => {};
  return child;
}

test("linux pump spawns python3 and windows pump still spawns powershell", async () => {
  Enum.disposePump();
  const text = "11\t100\t80\t500\t400\t0\t0\t0\t0\nEND\n";
  let linuxCmd = "";
  const linux = await Enum.listRaw({
    platform: "linux",
    spawn(cmd) {
      linuxCmd = cmd;
      return fakePump(text);
    },
  });
  assert.equal(linuxCmd, "python3");
  assert.equal(linux.later, null);
  assert.equal(linux.raw[0].id, "11");
  Enum.disposePump();
  let winCmd = "";
  const win = await Enum.listRaw({
    platform: "win32",
    spawn(cmd) {
      winCmd = cmd;
      return fakePump(text);
    },
  });
  assert.equal(winCmd, "powershell.exe");
  assert.equal(win.raw[0].id, "11");
  Enum.disposePump();
});

test("darwin pump spawns osascript and parses the nine-field pipe", async () => {
  Enum.disposePump();
  const text = "11\t80\t90\t400\t290\t0\t0\t0\t0\nEND\n";
  let cmd = "";
  const listed = await Enum.listRaw({
    platform: "darwin",
    spawn(bin) {
      cmd = bin;
      return fakePump(text);
    },
  });
  assert.equal(cmd, "/usr/bin/osascript");
  assert.equal(listed.later, null);
  assert.equal(listed.raw[0].id, "11");
  assert.equal(listed.raw[0].left, 80);
  assert.equal(listed.raw[0].shell, false);
  const taken = W.takeRects(listed.raw, { workArea: { x: 0, y: 0, width: 1280, height: 800 }, scaleFactor: 1 });
  assert.equal(taken[0].id, "11");
  assert.equal(taken[0].width, 320);
  assert.equal(taken[0].height, 200);
  Enum.disposePump();
});

test("a missing Mac helper stays empty and does not invent rows", async () => {
  Enum.disposePump();
  const listed = await Enum.listRaw({
    platform: "darwin",
    spawn() {
      const stdout = new EventEmitter();
      stdout.setEncoding = () => {};
      const stderr = new EventEmitter();
      stderr.setEncoding = () => {};
      const child = new EventEmitter();
      child.stdout = stdout;
      child.stderr = stderr;
      child.stdin = { write() { return true; } };
      child.kill = () => {};
      setImmediate(() => child.emit("error", Object.assign(new Error("spawn ENOENT"), { code: "ENOENT" })));
      return child;
    },
  });
  assert.equal(listed.later, null);
  assert.deepEqual(listed.raw, []);
  Enum.disposePump();
});

test("off a Mac the real helper does not invent rows", async () => {
  if (process.platform === "darwin") return;
  Enum.disposePump();
  const listed = await Enum.listRaw({ platform: "darwin", timeoutMs: 2000 });
  Enum.disposePump();
  assert.equal(listed.later, null);
  assert.deepEqual(listed.raw, []);
});

const X11_FIXTURE = `
import ctypes
import ctypes.util
import sys

XA_WINDOW = 33
XA_ATOM = 4
XA_STRING = 31

class Screen(ctypes.Structure):
    _fields_ = [
        ("root", ctypes.c_uint32),
        ("default_colormap", ctypes.c_uint32),
        ("white_pixel", ctypes.c_uint32),
        ("black_pixel", ctypes.c_uint32),
        ("current_input_masks", ctypes.c_uint32),
        ("width_in_pixels", ctypes.c_uint16),
        ("height_in_pixels", ctypes.c_uint16),
        ("width_in_millimeters", ctypes.c_uint16),
        ("height_in_millimeters", ctypes.c_uint16),
        ("min_installed_maps", ctypes.c_uint16),
        ("max_installed_maps", ctypes.c_uint16),
        ("root_visual", ctypes.c_uint32),
        ("backing_stores", ctypes.c_uint8),
        ("save_unders", ctypes.c_uint8),
        ("root_depth", ctypes.c_uint8),
        ("allowed_depths_len", ctypes.c_uint8),
    ]

class ScreenIter(ctypes.Structure):
    _fields_ = [("data", ctypes.POINTER(Screen)), ("rem", ctypes.c_int), ("index", ctypes.c_int)]

class Cookie(ctypes.Structure):
    _fields_ = [("sequence", ctypes.c_uint)]

class InternReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("pad0", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("atom", ctypes.c_uint32),
    ]

def main():
    xcb = ctypes.CDLL(ctypes.util.find_library("xcb") or "libxcb.so.1")
    libc = ctypes.CDLL(None)
    libc.free.argtypes = [ctypes.c_void_p]
    xcb.xcb_connect.restype = ctypes.c_void_p
    xcb.xcb_connect.argtypes = [ctypes.c_char_p, ctypes.POINTER(ctypes.c_int)]
    xcb.xcb_connection_has_error.restype = ctypes.c_int
    xcb.xcb_connection_has_error.argtypes = [ctypes.c_void_p]
    xcb.xcb_disconnect.argtypes = [ctypes.c_void_p]
    xcb.xcb_flush.restype = ctypes.c_int
    xcb.xcb_flush.argtypes = [ctypes.c_void_p]
    xcb.xcb_get_setup.restype = ctypes.c_void_p
    xcb.xcb_get_setup.argtypes = [ctypes.c_void_p]
    xcb.xcb_setup_roots_iterator.restype = ScreenIter
    xcb.xcb_setup_roots_iterator.argtypes = [ctypes.c_void_p]
    xcb.xcb_screen_next.argtypes = [ctypes.POINTER(ScreenIter)]
    xcb.xcb_generate_id.restype = ctypes.c_uint32
    xcb.xcb_generate_id.argtypes = [ctypes.c_void_p]
    xcb.xcb_intern_atom.restype = Cookie
    xcb.xcb_intern_atom.argtypes = [ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint16, ctypes.c_char_p]
    xcb.xcb_intern_atom_reply.restype = ctypes.POINTER(InternReply)
    xcb.xcb_intern_atom_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_create_window.argtypes = [
        ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint32, ctypes.c_uint32,
        ctypes.c_int16, ctypes.c_int16, ctypes.c_uint16, ctypes.c_uint16,
        ctypes.c_uint16, ctypes.c_uint16, ctypes.c_uint32, ctypes.c_uint32, ctypes.c_void_p,
    ]
    xcb.xcb_map_window.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
    xcb.xcb_change_property.argtypes = [
        ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint32, ctypes.c_uint32,
        ctypes.c_uint32, ctypes.c_uint8, ctypes.c_uint32, ctypes.c_void_p,
    ]
    screen_i = ctypes.c_int(0)
    conn = xcb.xcb_connect(None, ctypes.byref(screen_i))
    if not conn or xcb.xcb_connection_has_error(conn):
        sys.stderr.write("no display\\n")
        sys.exit(1)
    setup = xcb.xcb_get_setup(conn)
    it = xcb.xcb_setup_roots_iterator(setup)
    step = 0
    while step < int(screen_i.value):
        xcb.xcb_screen_next(ctypes.byref(it))
        step += 1
    screen = it.data.contents
    root = int(screen.root)

    def intern(name):
        raw = name.encode("ascii")
        cookie = xcb.xcb_intern_atom(conn, 0, len(raw), raw)
        reply = xcb.xcb_intern_atom_reply(conn, cookie, None)
        value = int(reply.contents.atom)
        libc.free(reply)
        return value

    client_list = intern("_NET_CLIENT_LIST")
    type_atom = intern("_NET_WM_WINDOW_TYPE")
    dock = intern("_NET_WM_WINDOW_TYPE_DOCK")
    wm_state = intern("WM_STATE")
    wm_name = intern("WM_NAME")

    def make(x, y, w, h, mapped):
        wid = int(xcb.xcb_generate_id(conn))
        xcb.xcb_create_window(conn, int(screen.root_depth), wid, root, x, y, w, h, 0, 1, int(screen.root_visual), 0, None)
        if mapped:
            xcb.xcb_map_window(conn, wid)
        return wid

    normal = make(80, 90, 320, 200, True)
    panel = make(0, 0, 1280, 100, True)
    iconic = make(400, 120, 220, 180, True)
    title = b"homework-secret-title"
    xcb.xcb_change_property(conn, 0, normal, wm_name, XA_STRING, 8, len(title), title)
    dock_id = (ctypes.c_uint32 * 1)(dock)
    xcb.xcb_change_property(conn, 0, panel, type_atom, XA_ATOM, 32, 1, ctypes.cast(dock_id, ctypes.c_void_p))
    state = (ctypes.c_uint32 * 2)(3, 0)
    xcb.xcb_change_property(conn, 0, iconic, wm_state, wm_state, 32, 2, ctypes.cast(state, ctypes.c_void_p))
    ids = (ctypes.c_uint32 * 3)(normal, panel, iconic)
    xcb.xcb_change_property(conn, 0, root, client_list, XA_WINDOW, 32, 3, ctypes.cast(ids, ctypes.c_void_p))
    xcb.xcb_flush(conn)
    sys.stdout.write(str(normal) + "\\n")
    sys.stdout.flush()
    # Stay connected. The server drops a client's windows when that client leaves.
    while True:
        line = sys.stdin.readline()
        if line == "" or line.strip() == "quit":
            break
    xcb.xcb_disconnect(conn)

if __name__ == "__main__":
    main()
`;

function pickDisplay() {
  for (let n = 80; n < 140; n += 1) {
    if (!existsSync("/tmp/.X11-unix/X" + n)) return ":" + n;
  }
  return ":97";
}

// A fixture that dies (no display yet) ends its stdout without a line: resolve "" then, and give up after a while,
// so the test fails with the fixture's own words instead of hanging the whole run.
function readLine(stream, timeoutMs = 15_000) {
  return new Promise((resolve, reject) => {
    let buf = "";
    const done = (value) => {
      clearTimeout(timer);
      stream.off("data", onData);
      stream.off("end", onEnd);
      resolve(value);
    };
    const onData = (chunk) => {
      buf += chunk;
      const mark = buf.indexOf("\n");
      if (mark < 0) return;
      done(buf.slice(0, mark).trim());
    };
    const onEnd = () => done("");
    const timer = setTimeout(() => done(""), timeoutMs);
    stream.on("data", onData);
    stream.on("end", onEnd);
    stream.on("error", reject);
  });
}

// Xvfb takes a moment to listen: wait for its socket rather than a fixed sleep (300 ms was not always enough in CI).
async function waitForDisplay(display, timeoutMs = 10_000) {
  const socket = "/tmp/.X11-unix/X" + display.slice(1);
  const until = Date.now() + timeoutMs;
  while (!existsSync(socket) && Date.now() < until) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

test("an X11 client rect is listed and a dock, an iconic window, and a title are not perches", { timeout: 60_000 }, async (t) => {
  if (!existsSync("/usr/bin/Xvfb")) {
    t.skip("Xvfb is not installed");
    return;
  }
  const display = pickDisplay();
  const xvfb = spawn("Xvfb", [display, "-screen", "0", "1280x800x24", "-nolisten", "tcp", "-noreset"], {
    stdio: "ignore",
  });
  let planter = null;
  await waitForDisplay(display);
  try {
    const env = { ...process.env, DISPLAY: display };
    planter = spawn("python3", ["-u", "-c", X11_FIXTURE], { env, stdio: ["pipe", "pipe", "pipe"] });
    planter.stderr.setEncoding("utf8");
    let planterErr = "";
    planter.stderr.on("data", (chunk) => {
      planterErr += chunk;
    });
    planter.stdout.setEncoding("utf8");
    const normalId = await readLine(planter.stdout);
    if (!normalId) throw new Error(planterErr || "fixture did not plant a window");
    Enum.disposePump();
    const listed = await Enum.listRaw({ platform: "linux", env, timeoutMs: 4000 });
    Enum.disposePump();
    try {
      planter.stdin.write("quit\n");
    } catch {
      /* ignore */
    }
    assert.equal(listed.later, null);
    assert.equal(JSON.stringify(listed.raw).includes("homework-secret-title"), false);
    const normal = listed.raw.find((row) => row.id === normalId);
    assert.ok(normal, "normal client missing");
    assert.equal(normal.left, 80);
    assert.equal(normal.top, 90);
    assert.equal(normal.right, 400);
    assert.equal(normal.bottom, 290);
    assert.equal(normal.shell, false);
    assert.equal(normal.minimized, false);
    assert.equal(normal.tool, false);
    const taken = W.takeRects(listed.raw, {
      workArea: { x: 0, y: 0, width: 1280, height: 800 },
      scaleFactor: 1,
    });
    assert.deepEqual(taken.map((row) => row.id), [normalId]);
    assert.equal(taken[0].width, 320);
    assert.equal(taken[0].height, 200);
  } finally {
    Enum.disposePump();
    try {
      planter && planter.kill();
    } catch {
      /* ignore */
    }
    try {
      xvfb.kill();
    } catch {
      /* ignore */
    }
  }
});
