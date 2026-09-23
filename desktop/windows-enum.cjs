/** Top-level window bounds. Rects only.
 * Windows 10/11 uses the shell-handle walk below. Linux X11 uses libxcb.
 * Mac stays a later door and does not invent rects.
 * The taskbar and the desktop host are known shell handles. A Linux dock or
 * desktop is a window-type bit, not a class string. A keeper window's class
 * is not copied. The shell bit on the pipe is 0 or 1.
 * Window text is not read. No folder is listed.
 */
const { spawn } = require("child_process");
const Windows = require("./renderer/windows.js");

const ENUM_SCRIPT = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class DeskWins {
  public delegate bool EnumProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern IntPtr GetShellWindow();
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr FindWindowEx(IntPtr parent, IntPtr after, string cls, string title);
  [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr h, int n);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out int pvAttribute, int cbAttribute);
  public const int GWL_EXSTYLE = -20;
  public const int WS_EX_TOOLWINDOW = 0x00000080;
  public const int DWMWA_CLOAKED = 14;
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

  static HashSet<IntPtr> ShellHandles() {
    var set = new HashSet<IntPtr>();
    IntPtr desk = GetShellWindow();
    if (desk != IntPtr.Zero) set.Add(desk);
    string[] names = new string[] {
      "Shell_TrayWnd",
      "Shell_SecondaryTrayWnd",
      "NotifyIconOverflowWindow",
      "Progman",
      "WorkerW"
    };
    foreach (string name in names) {
      IntPtr prev = IntPtr.Zero;
      while (true) {
        IntPtr h = FindWindowEx(IntPtr.Zero, prev, name, null);
        if (h == IntPtr.Zero || h == prev) break;
        set.Add(h);
        prev = h;
      }
    }
    return set;
  }

  public static List<string> List() {
    var rows = new List<string>();
    var shells = ShellHandles();
    EnumWindows((h, l) => {
      if (!IsWindowVisible(h)) return true;
      bool mini = IsIconic(h);
      int ex = GetWindowLong(h, GWL_EXSTYLE);
      bool tool = (ex & WS_EX_TOOLWINDOW) != 0;
      int cloaked = 0;
      try { DwmGetWindowAttribute(h, DWMWA_CLOAKED, out cloaked, 4); } catch { cloaked = 0; }
      RECT r;
      if (!GetWindowRect(h, out r)) return true;
      ulong id = unchecked((ulong)h.ToInt64());
      bool shell = shells.Contains(h);
      rows.Add(id + "\\t" + r.Left + "\\t" + r.Top + "\\t" + r.Right + "\\t" + r.Bottom + "\\t" + (mini ? "1" : "0") + "\\t" + (tool ? "1" : "0") + "\\t" + (cloaked != 0 ? "1" : "0") + "\\t" + (shell ? "1" : "0"));
      return true;
    }, IntPtr.Zero);
    return rows;
  }
}
"@
while ($true) {
  $line = [Console]::In.ReadLine()
  if ($null -eq $line) { break }
  if ($line -eq "quit") { break }
  [DeskWins]::List() | ForEach-Object { $_ }
  Write-Output "END"
}
`;

/** Linux X11 client list. Same nine fields as the Windows pipe. No title, no class. */
const LINUX_ENUM_SCRIPT = `
import ctypes
import ctypes.util
import sys

XA_WINDOW = 33
VIEWABLE = 2
ICONIC = 3
SEP = chr(9)
NL = chr(10)

SHELL_NAMES = ("_NET_WM_WINDOW_TYPE_DESKTOP", "_NET_WM_WINDOW_TYPE_DOCK")
TOOL_NAMES = (
    "_NET_WM_WINDOW_TYPE_TOOLBAR",
    "_NET_WM_WINDOW_TYPE_MENU",
    "_NET_WM_WINDOW_TYPE_UTILITY",
    "_NET_WM_WINDOW_TYPE_SPLASH",
    "_NET_WM_WINDOW_TYPE_DROPDOWN_MENU",
    "_NET_WM_WINDOW_TYPE_POPUP_MENU",
    "_NET_WM_WINDOW_TYPE_TOOLTIP",
    "_NET_WM_WINDOW_TYPE_NOTIFICATION",
    "_NET_WM_WINDOW_TYPE_COMBO",
    "_NET_WM_WINDOW_TYPE_DND",
)

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

class PropReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("format", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("type", ctypes.c_uint32),
        ("bytes_after", ctypes.c_uint32),
        ("value_len", ctypes.c_uint32),
        ("pad0", ctypes.c_uint8 * 12),
    ]

class GeomReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("depth", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("root", ctypes.c_uint32),
        ("x", ctypes.c_int16),
        ("y", ctypes.c_int16),
        ("width", ctypes.c_uint16),
        ("height", ctypes.c_uint16),
        ("border_width", ctypes.c_uint16),
        ("pad0", ctypes.c_uint8 * 2),
    ]

class AttrReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("backing_store", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("visual", ctypes.c_uint32),
        ("klass", ctypes.c_uint16),
        ("bit_gravity", ctypes.c_uint8),
        ("win_gravity", ctypes.c_uint8),
        ("backing_planes", ctypes.c_uint32),
        ("backing_pixel", ctypes.c_uint32),
        ("save_under", ctypes.c_uint8),
        ("map_is_installed", ctypes.c_uint8),
        ("map_state", ctypes.c_uint8),
        ("override_redirect", ctypes.c_uint8),
        ("colormap", ctypes.c_uint32),
        ("all_event_masks", ctypes.c_uint32),
        ("your_event_mask", ctypes.c_uint32),
        ("do_not_propagate_mask", ctypes.c_uint16),
        ("pad0", ctypes.c_uint8 * 2),
    ]

class TreeReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("pad0", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("root", ctypes.c_uint32),
        ("parent", ctypes.c_uint32),
        ("children_len", ctypes.c_uint16),
        ("pad1", ctypes.c_uint8 * 14),
    ]

class XlatReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("same_screen", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("child", ctypes.c_uint32),
        ("dst_x", ctypes.c_int16),
        ("dst_y", ctypes.c_int16),
    ]

def load():
    name = ctypes.util.find_library("xcb") or "libxcb.so.1"
    try:
        xcb = ctypes.CDLL(name)
    except OSError:
        return None, None
    libc = ctypes.CDLL(None)
    libc.free.argtypes = [ctypes.c_void_p]
    xcb.xcb_connect.restype = ctypes.c_void_p
    xcb.xcb_connect.argtypes = [ctypes.c_char_p, ctypes.POINTER(ctypes.c_int)]
    xcb.xcb_connection_has_error.restype = ctypes.c_int
    xcb.xcb_connection_has_error.argtypes = [ctypes.c_void_p]
    xcb.xcb_disconnect.argtypes = [ctypes.c_void_p]
    xcb.xcb_get_setup.restype = ctypes.c_void_p
    xcb.xcb_get_setup.argtypes = [ctypes.c_void_p]
    xcb.xcb_setup_roots_iterator.restype = ScreenIter
    xcb.xcb_setup_roots_iterator.argtypes = [ctypes.c_void_p]
    xcb.xcb_screen_next.argtypes = [ctypes.POINTER(ScreenIter)]
    xcb.xcb_intern_atom.restype = Cookie
    xcb.xcb_intern_atom.argtypes = [ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint16, ctypes.c_char_p]
    xcb.xcb_intern_atom_reply.restype = ctypes.POINTER(InternReply)
    xcb.xcb_intern_atom_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_get_property.restype = Cookie
    xcb.xcb_get_property.argtypes = [
        ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint32, ctypes.c_uint32,
        ctypes.c_uint32, ctypes.c_uint32, ctypes.c_uint32,
    ]
    xcb.xcb_get_property_reply.restype = ctypes.POINTER(PropReply)
    xcb.xcb_get_property_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_get_property_value.restype = ctypes.c_void_p
    xcb.xcb_get_property_value.argtypes = [ctypes.c_void_p]
    xcb.xcb_get_geometry.restype = Cookie
    xcb.xcb_get_geometry.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
    xcb.xcb_get_geometry_reply.restype = ctypes.POINTER(GeomReply)
    xcb.xcb_get_geometry_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_get_window_attributes.restype = Cookie
    xcb.xcb_get_window_attributes.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
    xcb.xcb_get_window_attributes_reply.restype = ctypes.POINTER(AttrReply)
    xcb.xcb_get_window_attributes_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_query_tree.restype = Cookie
    xcb.xcb_query_tree.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
    xcb.xcb_query_tree_reply.restype = ctypes.POINTER(TreeReply)
    xcb.xcb_query_tree_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_translate_coordinates.restype = Cookie
    xcb.xcb_translate_coordinates.argtypes = [
        ctypes.c_void_p, ctypes.c_uint32, ctypes.c_uint32, ctypes.c_int16, ctypes.c_int16,
    ]
    xcb.xcb_translate_coordinates_reply.restype = ctypes.POINTER(XlatReply)
    xcb.xcb_translate_coordinates_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    return xcb, libc

xcb, libc = load()
conn = None
root = 0
ATOMS = {}

def atom(name):
    if name in ATOMS:
        return ATOMS[name]
    raw = name.encode("ascii")
    cookie = xcb.xcb_intern_atom(conn, 1, len(raw), raw)
    reply = xcb.xcb_intern_atom_reply(conn, cookie, None)
    value = 0
    if reply:
        value = int(reply.contents.atom)
        libc.free(reply)
    ATOMS[name] = value
    return value

def cards(win, prop):
    if not prop:
        return []
    cookie = xcb.xcb_get_property(conn, 0, win, prop, 0, 0, 1024)
    reply = xcb.xcb_get_property_reply(conn, cookie, None)
    if not reply:
        return []
    fmt = int(reply.contents.format)
    count = int(reply.contents.value_len)
    ptr = xcb.xcb_get_property_value(reply)
    out = []
    if ptr and fmt == 32 and count > 0:
        arr = ctypes.cast(ptr, ctypes.POINTER(ctypes.c_uint32))
        out = [int(arr[i]) for i in range(count)]
    libc.free(reply)
    return out

def ensure_conn():
    global conn, root
    if conn is not None and not xcb.xcb_connection_has_error(conn):
        return True
    if conn is not None:
        xcb.xcb_disconnect(conn)
        conn = None
        ATOMS.clear()
    screen_i = ctypes.c_int(0)
    handle = xcb.xcb_connect(None, ctypes.byref(screen_i))
    if not handle or xcb.xcb_connection_has_error(handle):
        if handle:
            xcb.xcb_disconnect(handle)
        return False
    conn = handle
    setup = xcb.xcb_get_setup(conn)
    it = xcb.xcb_setup_roots_iterator(setup)
    step = 0
    while step < int(screen_i.value):
        xcb.xcb_screen_next(ctypes.byref(it))
        step += 1
    if not it.data:
        return False
    root = int(it.data.contents.root)
    return root != 0

def top_frame(win):
    current = win
    seen = 0
    while current and current != root and seen < 16:
        seen += 1
        cookie = xcb.xcb_query_tree(conn, current)
        reply = xcb.xcb_query_tree_reply(conn, cookie, None)
        if not reply:
            return current
        parent = int(reply.contents.parent)
        libc.free(reply)
        if parent == 0 or parent == root:
            return current
        current = parent
    return current

def geometry(win):
    cookie = xcb.xcb_get_geometry(conn, win)
    reply = xcb.xcb_get_geometry_reply(conn, cookie, None)
    if not reply:
        return None
    g = reply.contents
    out = (int(g.x), int(g.y), int(g.width), int(g.height), int(g.border_width))
    libc.free(reply)
    return out

def attributes(win):
    cookie = xcb.xcb_get_window_attributes(conn, win)
    reply = xcb.xcb_get_window_attributes_reply(conn, cookie, None)
    if not reply:
        return None
    a = reply.contents
    out = (int(a.map_state), int(a.override_redirect))
    libc.free(reply)
    return out

def origin(win, fallback_x, fallback_y):
    cookie = xcb.xcb_translate_coordinates(conn, win, root, 0, 0)
    reply = xcb.xcb_translate_coordinates_reply(conn, cookie, None)
    if not reply:
        return fallback_x, fallback_y
    x = int(reply.contents.dst_x)
    y = int(reply.contents.dst_y)
    libc.free(reply)
    return x, y

def list_rows():
    if xcb is None or not ensure_conn():
        return []
    client_atom = atom("_NET_CLIENT_LIST")
    if not client_atom:
        return []
    clients = cards(root, client_atom)
    type_atom = atom("_NET_WM_WINDOW_TYPE")
    state_atom = atom("WM_STATE")
    net_state = atom("_NET_WM_STATE")
    hidden = atom("_NET_WM_STATE_HIDDEN")
    shells = set()
    for name in SHELL_NAMES:
        value = atom(name)
        if value:
            shells.add(value)
    tools = set()
    for name in TOOL_NAMES:
        value = atom(name)
        if value:
            tools.add(value)
    rows = []
    for client in clients:
        if not client or client == root:
            continue
        frame = top_frame(client)
        geo = geometry(frame)
        attr = attributes(client)
        if geo is None or attr is None:
            continue
        gx, gy, gw, gh, border = geo
        map_state, override = attr
        kinds = cards(client, type_atom) if type_atom else []
        shell = 1 if any(kind in shells for kind in kinds) else 0
        tool = 1 if override or any(kind in tools for kind in kinds) else 0
        wm_state = cards(client, state_atom) if state_atom else []
        net = cards(client, net_state) if net_state else []
        mini = 1 if ((wm_state and wm_state[0] == ICONIC) or (hidden and hidden in net)) else 0
        cloaked = 0 if map_state == VIEWABLE else 1
        ox, oy = origin(frame, gx, gy)
        left = ox - border
        top = oy - border
        right = left + gw + border + border
        bottom = top + gh + border + border
        parts = [client, left, top, right, bottom, mini, tool, cloaked, shell]
        rows.append(SEP.join(str(part) for part in parts))
    return rows

def answer():
    rows = []
    try:
        rows = list_rows()
    except Exception:
        rows = []
    for row in rows:
        sys.stdout.write(row)
        sys.stdout.write(NL)
    sys.stdout.write("END")
    sys.stdout.write(NL)
    sys.stdout.flush()

while True:
    line = sys.stdin.readline()
    if line == "" or line.strip() == "quit":
        break
    answer()
`;

let pump = null;
let pumpBuf = "";
/** @type {{ ok: (text: string) => void, err: (err: Error) => void } | null} */
let pumpWait = null;

function isLinuxPlatform(platform) {
  return platform === "linux" || /^Linux/i.test(String(platform || ""));
}

function enumCommand(platform) {
  if (isLinuxPlatform(platform)) {
    return { cmd: "python3", args: ["-u", "-c", LINUX_ENUM_SCRIPT] };
  }
  return {
    cmd: "powershell.exe",
    args: ["-NoProfile", "-STA", "-ExecutionPolicy", "Bypass", "-Command", ENUM_SCRIPT],
  };
}

function ensurePump(spawnFn, platform, env) {
  if (pump) return pump;
  const spawnImpl = spawnFn || spawn;
  const spec = enumCommand(platform);
  pump = spawnImpl(spec.cmd, spec.args, {
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
    env: env || process.env,
  });
  pumpBuf = "";
  if (pump.stdout) {
    pump.stdout.setEncoding("utf8");
    pump.stdout.on("data", (chunk) => {
      pumpBuf += String(chunk);
      const mark = pumpBuf.indexOf("END");
      if (mark < 0) return;
      const text = pumpBuf.slice(0, mark);
      pumpBuf = pumpBuf.slice(mark + 3).replace(/^\r?\n/, "");
      const wait = pumpWait;
      pumpWait = null;
      if (wait) wait.ok(text);
    });
  }
  if (pump.stderr) pump.stderr.setEncoding("utf8");
  pump.on("exit", () => {
    pump = null;
    if (pumpWait) {
      const wait = pumpWait;
      pumpWait = null;
      wait.err(new Error("window enum exited"));
    }
  });
  return pump;
}

function runPumpTick(opts) {
  const spawnFn = opts && opts.spawn;
  const platform = (opts && opts.platform) || process.platform;
  return new Promise((resolve, reject) => {
    if (pumpWait) {
      resolve("");
      return;
    }
    const child = ensurePump(spawnFn, platform, opts && opts.env);
    if (!child || !child.stdin) {
      reject(new Error("window enum has no stdin"));
      return;
    }
    const timer = setTimeout(() => {
      if (!pumpWait) return;
      pumpWait = null;
      reject(new Error("window enum timeout"));
    }, (opts && opts.timeoutMs) || 3500);
    pumpWait = {
      ok(text) {
        clearTimeout(timer);
        resolve(text);
      },
      err(err) {
        clearTimeout(timer);
        reject(err);
      },
    };
    child.stdin.write("tick\n");
  });
}

async function listRaw(opts) {
  const platform = (opts && opts.platform) || process.platform;
  if (!Windows.enumeratesOn(platform)) {
    return { raw: [], later: Windows.laterDoor(platform) };
  }
  if (typeof (opts && opts.run) === "function") {
    const text = await opts.run();
    return { raw: Windows.parseEnumText(text), later: null };
  }
  try {
    const text = await runPumpTick(opts);
    return { raw: Windows.parseEnumText(text), later: null };
  } catch {
    return { raw: [], later: null };
  }
}

function disposePump() {
  if (!pump) return;
  try {
    pump.stdin && pump.stdin.write("quit\n");
  } catch {
    /* ignore */
  }
  try {
    pump.kill();
  } catch {
    /* ignore */
  }
  pump = null;
  pumpWait = null;
  pumpBuf = "";
}

module.exports = {
  ENUM_SCRIPT,
  LINUX_ENUM_SCRIPT,
  enumCommand,
  listRaw,
  runPumpTick,
  disposePump,
  parseEnumText: Windows.parseEnumText,
  takeRects: Windows.takeRects,
  hwndFromHandle: Windows.hwndFromHandle,
  enumeratesOn: Windows.enumeratesOn,
  laterDoor: Windows.laterDoor,
};
