"use strict";

/**
 * When the see-through pet window cannot open, say so where the keeper will see it, and say why.
 *
 * 1. No compositor (Linux, X11). The pet window is one transparent always-on-top window over the whole desk. On an
 *    X desktop with no compositing manager (Xvfb, i3, Openbox, Xfce with its compositor off) X ignores the alpha and
 *    the window covers the screen in solid black: seen on the box under Xvfb, with and without the GPU, and gone as
 *    soon as a compositor (picom) ran. So the window stays closed there and a plain message says what to turn on.
 *    The question asked is the EWMH one: does anyone own the _NET_WM_CM_S<screen> selection? It is asked the way
 *    windows-enum.cjs lists windows, python3 with libxcb through ctypes, so nothing new is installed. A Wayland
 *    session always composites. When the answer cannot be read (no python3, no libxcb), the window opens as before.
 * 2. The GPU gate (gpu-path.cjs) refused the window. That was said only in the tray menu, and many Linux desktops
 *    (GNOME without the AppIndicator extension, a bare X server) show no tray at all, so the app looked like it did
 *    nothing. The same words now come up in a message box too.
 *
 * This module holds the words and the check; main.cjs shows them. It does not read settings or talk to the network.
 */

const { spawn } = require("child_process");

const TIMEOUT_MS = 4000;

const COMPOSITOR_SCRIPT = `
import ctypes
import ctypes.util
import sys

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

class OwnerReply(ctypes.Structure):
    _fields_ = [
        ("response_type", ctypes.c_uint8),
        ("pad0", ctypes.c_uint8),
        ("sequence", ctypes.c_uint16),
        ("length", ctypes.c_uint32),
        ("owner", ctypes.c_uint32),
    ]

def main():
    try:
        xcb = ctypes.CDLL(ctypes.util.find_library("xcb") or "libxcb.so.1")
    except OSError:
        return "unknown"
    libc = ctypes.CDLL(None)
    libc.free.argtypes = [ctypes.c_void_p]
    xcb.xcb_connect.restype = ctypes.c_void_p
    xcb.xcb_connect.argtypes = [ctypes.c_char_p, ctypes.POINTER(ctypes.c_int)]
    xcb.xcb_connection_has_error.restype = ctypes.c_int
    xcb.xcb_connection_has_error.argtypes = [ctypes.c_void_p]
    xcb.xcb_disconnect.argtypes = [ctypes.c_void_p]
    xcb.xcb_intern_atom.restype = Cookie
    xcb.xcb_intern_atom.argtypes = [ctypes.c_void_p, ctypes.c_uint8, ctypes.c_uint16, ctypes.c_char_p]
    xcb.xcb_intern_atom_reply.restype = ctypes.POINTER(InternReply)
    xcb.xcb_intern_atom_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    xcb.xcb_get_selection_owner.restype = Cookie
    xcb.xcb_get_selection_owner.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
    xcb.xcb_get_selection_owner_reply.restype = ctypes.POINTER(OwnerReply)
    xcb.xcb_get_selection_owner_reply.argtypes = [ctypes.c_void_p, Cookie, ctypes.c_void_p]
    screen = ctypes.c_int(0)
    conn = xcb.xcb_connect(None, ctypes.byref(screen))
    if not conn or xcb.xcb_connection_has_error(conn):
        return "unknown"
    try:
        name = ("_NET_WM_CM_S%d" % screen.value).encode("ascii")
        got = xcb.xcb_intern_atom_reply(conn, xcb.xcb_intern_atom(conn, 0, len(name), name), None)
        if not got:
            return "unknown"
        atom = got.contents.atom
        libc.free(got)
        owner = xcb.xcb_get_selection_owner_reply(conn, xcb.xcb_get_selection_owner(conn, atom), None)
        if not owner:
            return "unknown"
        held = owner.contents.owner
        libc.free(owner)
        return "yes" if held else "no"
    finally:
        xcb.xcb_disconnect(conn)

sys.stdout.write(main() + chr(10))
`;

function isLinux(platform) {
  return platform === "linux" || /^Linux/i.test(String(platform || ""));
}

/** A Wayland session: the compositor is the display server itself. */
function waylandSession(env) {
  const e = env || {};
  return !!e.WAYLAND_DISPLAY || String(e.XDG_SESSION_TYPE || "").toLowerCase() === "wayland";
}

/** The script's one word, or "unknown" for anything else. */
function compositorWord(text) {
  const w = String(text || "").trim().toLowerCase();
  return w === "yes" || w === "no" ? w : "unknown";
}

/**
 * Whether a compositing manager runs: "yes", "no", "unknown" (could not tell), or "n/a" (not Linux).
 * @param {{ platform?: string, env?: Record<string, string | undefined>, spawn?: typeof spawn, timeoutMs?: number }} [opts]
 * @returns {Promise<"yes" | "no" | "unknown" | "n/a">}
 */
function readCompositor(opts) {
  const platform = (opts && opts.platform) || process.platform;
  const env = (opts && opts.env) || process.env;
  if (!isLinux(platform)) return Promise.resolve("n/a");
  const wayland = waylandSession(env);
  if (!env.DISPLAY) return Promise.resolve(wayland ? "yes" : "unknown");
  const spawnFn = (opts && opts.spawn) || spawn;
  const timeoutMs = (opts && opts.timeoutMs) || TIMEOUT_MS;
  return new Promise((resolve) => {
    let out = "";
    let done = false;
    /** @param {"yes" | "no" | "unknown"} word */
    const finish = (word) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      // Under XWayland the Wayland compositor draws every window, whatever the X answer was.
      resolve(wayland && word !== "yes" ? "yes" : word);
    };
    const timer = setTimeout(() => {
      try {
        child && child.kill();
      } catch {
        /* gone */
      }
      finish("unknown");
    }, timeoutMs);
    let child = null;
    try {
      child = spawnFn("python3", ["-c", COMPOSITOR_SCRIPT], { windowsHide: true, env, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      finish("unknown");
      return;
    }
    if (child.stdout) {
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        out += String(chunk);
      });
    }
    child.on("error", () => finish("unknown"));
    child.on("close", () => finish(compositorWord(out)));
  });
}

/** Only a plain "no" keeps the window closed; "unknown" opens it as before. */
function overlayMayOpen(state) {
  return state !== "no";
}

/**
 * The message box and tray words for a closed pet window. `why` is "no-compositor" or a gpu-path.cjs reason
 * ("software-refused", "compositor-unread", "compositor-off"). `buttons` are in order; `actions` name what each does.
 * @param {string} why
 * @returns {{ tray: string, message: string, detail: string, buttons: string[], actions: string[] }}
 */
function closedWords(why) {
  if (why === "no-compositor") {
    return {
      tray: "No compositor. Overlay closed.",
      message: "The pets are not on the screen: this desktop is not compositing windows.",
      detail:
        "On Linux the see-through pet window needs a compositor. Without one it would cover your whole screen in black, so it stayed closed. " +
        "Turn on compositing in your desktop's settings (in Xfce: Window Manager Tweaks, then Compositor), or start a compositor such as picom, then press Check again.",
      buttons: ["Check again", "Quit", "OK"],
      actions: ["recheck", "quit", "none"],
    };
  }
  if (why === "software-refused") {
    return {
      tray: "Software compositing. Overlay closed.",
      message: "The pets are not on the screen: this computer is drawing windows without its graphics card.",
      detail:
        "The pet window waits for the graphics card, and here windows are drawn in software. That happens in virtual machines, remote desktops, and on computers without a graphics driver. " +
        "Allow software compositing to turn the pets on anyway. They may use more of the processor.",
      buttons: ["Allow software compositing", "Quit", "OK"],
      actions: ["allow-software", "quit", "none"],
    };
  }
  if (why === "compositor-unread") {
    return {
      tray: "Compositor unread. Overlay closed.",
      message: "The pets are not on the screen: the app could not tell how this computer draws windows.",
      detail: "The graphics part of the app did not answer in time, so the see-through pet window stayed closed. Start the pets again. If this keeps happening, update the graphics driver.",
      buttons: ["Quit", "OK"],
      actions: ["quit", "none"],
    };
  }
  return {
    tray: "GPU compositing off. Overlay closed.",
    message: "The pets are not on the screen: graphics compositing is turned off here.",
    detail: "The graphics part of the app reports compositing as off, so the see-through pet window stayed closed. Update or turn on the graphics driver, then start the pets again.",
    buttons: ["Quit", "OK"],
    actions: ["quit", "none"],
  };
}

module.exports = { COMPOSITOR_SCRIPT, TIMEOUT_MS, isLinux, waylandSession, compositorWord, readCompositor, overlayMayOpen, closedWords };
