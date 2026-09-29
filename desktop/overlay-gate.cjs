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
 * 3. No tray to see (Linux). Electron's tray shows through a StatusNotifier host on the session bus or an X system
 *    tray (XEmbed, _NET_SYSTEM_TRAY_S<screen>); GNOME without the AppIndicator extension and a bare X server have
 *    neither, and the icon is simply not there. readTrayHost asks both, so the pet's own menu, the hello, and Hide
 *    the window can say how to get around without it. COMPUTERPETS_TRAY=none treats the tray as absent anywhere.
 * 4. A native Wayland start. Since Electron 38 that is the default on any Wayland session (XDG_SESSION_TYPE=wayland,
 *    the default on Ubuntu's GNOME): no switch is needed. Before, it took --ozone-platform=wayland or
 *    ELECTRON_OZONE_PLATFORM_HINT. Electron 44 writes the platform it picked into its own command line before
 *    main.cjs loads (seen under sway: --ozone-platform reads "wayland" with no switch given), so the switch still
 *    decides; the session is the fallback when it is empty. Electron 35 crashed there (SIGSEGV in screen.getCursorScreenPoint at boot, seen
 *    under sway), and a Wayland app cannot see the mouse outside its window or keep a window on top anyway.
 *    waylandPlan starts it again on XWayland when there is one, and says so plainly when there is not.
 * 5. The Minds key store (Linux). Chromium picks the Secret Service only on desktops it recognises by name (GNOME,
 *    KDE, Xfce, ...); on sway, i3 or any other it wrote the key nowhere even with a keyring running and unlocked.
 *    passwordStoreFor asks for the Secret Service by hand there when one is on the session bus.
 *
 * This module holds the words and the checks; main.cjs shows them. It does not read settings or talk to the network.
 */

const { spawn, spawnSync } = require("child_process");

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
        # The compositor's selection by default; the tray's (_NET_SYSTEM_TRAY_S) when asked by name.
        name = (("_NET_WM_CM_S%d" if len(sys.argv) < 2 else sys.argv[1] + "%d") % screen.value).encode("ascii")
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

/**
 * One child process, its output, and how it ended; never throws, never waits past `timeoutMs`.
 * @returns {Promise<{ out: string, code: number | null, missing: boolean, timedOut: boolean }>}
 */
function runOne(spawnFn, cmd, args, env, timeoutMs) {
  return new Promise((resolve) => {
    let out = "";
    let done = false;
    let child = null;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ out, code: null, missing: false, timedOut: false, ...r });
    };
    const timer = setTimeout(() => {
      try {
        child && child.kill();
      } catch {
        /* gone */
      }
      finish({ timedOut: true });
    }, timeoutMs);
    try {
      child = spawnFn(cmd, args, { windowsHide: true, env, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      finish({ missing: true });
      return;
    }
    if (child.stdout) {
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        out += String(chunk);
      });
    }
    child.on("error", (e) => finish({ missing: !!(e && /ENOENT/.test(String(e.code || e.message))) }));
    child.on("close", (code) => finish({ code: typeof code === "number" ? code : null }));
  });
}

/** Asks the session bus whether a StatusNotifier host is there (KDE, a GNOME AppIndicator extension, swaybar). */
const SNI_ARGS = [
  "--session",
  "--print-reply",
  "--dest=org.kde.StatusNotifierWatcher",
  "/StatusNotifierWatcher",
  "org.freedesktop.DBus.Properties.Get",
  "string:org.kde.StatusNotifierWatcher",
  "string:IsStatusNotifierHostRegistered",
];

/**
 * Whether the tray icon can be seen: "yes", "no", "unknown" (could not tell), or "n/a" (Windows and the Mac always
 * have one). COMPUTERPETS_TRAY=none answers "no" anywhere.
 * @param {{ platform?: string, env?: Record<string, string | undefined>, spawn?: typeof spawn, timeoutMs?: number, nativeWayland?: boolean }} [opts]
 * @returns {Promise<"yes" | "no" | "unknown" | "n/a">}
 */
async function readTrayHost(opts) {
  const platform = (opts && opts.platform) || process.platform;
  const env = (opts && opts.env) || process.env;
  if (String(env.COMPUTERPETS_TRAY || "").trim().toLowerCase() === "none") return "no";
  if (!isLinux(platform)) return "n/a";
  const spawnFn = (opts && opts.spawn) || spawn;
  const timeoutMs = (opts && opts.timeoutMs) || TIMEOUT_MS;
  const sniRun = await runOne(spawnFn, "dbus-send", SNI_ARGS, env, timeoutMs);
  // A reply "boolean true" is a host; an error reply (no watcher, no session bus) is none; no dbus-send cannot tell.
  const sni = sniRun.missing || sniRun.timedOut ? "unknown" : /boolean true/.test(sniRun.out) ? "yes" : "no";
  if (sni === "yes") return "yes";
  let xembed = "no";
  if (env.DISPLAY && !(opts && opts.nativeWayland)) {
    const x = await runOne(spawnFn, "python3", ["-c", COMPOSITOR_SCRIPT, "_NET_SYSTEM_TRAY_S"], env, timeoutMs);
    xembed = x.missing || x.timedOut ? "unknown" : compositorWord(x.out);
  }
  if (xembed === "yes") return "yes";
  return sni === "no" && xembed === "no" ? "no" : "unknown";
}

/** Electron's major version from a version string like "44.4.5" (0 when it cannot be read). */
function electronMajor(version) {
  const m = /^v?(\d+)\./.exec(String(version || ""));
  return m ? Number(m[1]) : 0;
}

/**
 * A native Wayland start. --ozone-platform decides when it is given. Without it, Electron 38 and newer start as a
 * Wayland app on any Wayland session by themselves (their --ozone-platform defaults to auto: XDG_SESSION_TYPE=wayland
 * with a WAYLAND_DISPLAY), and ELECTRON_OZONE_PLATFORM_HINT is gone. Electron 37 and older run on X11 (XWayland on a
 * Wayland session) unless told otherwise, by --ozone-platform-hint / ELECTRON_OZONE_PLATFORM_HINT (auto or wayland).
 * `electron` is the running Electron's version (process.versions.electron); none counts as the old default.
 * @param {{ platform?: string, env?: Record<string, string | undefined>, ozone?: string, hint?: string, electron?: string }} o
 */
function nativeWayland(o) {
  const platform = (o && o.platform) || process.platform;
  const env = (o && o.env) || {};
  if (!isLinux(platform)) return false;
  const low = (v) => String(v || "").toLowerCase();
  const ozone = low(o && o.ozone);
  const modern = electronMajor(o && o.electron) >= 38;
  const session = low(env.XDG_SESSION_TYPE) === "wayland" && !!env.WAYLAND_DISPLAY;
  if (ozone === "auto") return session;
  if (ozone) return ozone === "wayland";
  const hint = low((o && o.hint) || (modern ? "" : env.ELECTRON_OZONE_PLATFORM_HINT));
  if (hint === "wayland") return !!env.WAYLAND_DISPLAY;
  if (hint === "auto") return modern ? session : !!env.WAYLAND_DISPLAY;
  return modern && session;
}

/**
 * What to do at a native Wayland start: "none" (not one), "relaunch-x11" (start again on XWayland, once), or
 * "closed" (no XWayland here, or it was tried already: the window stays closed and the message says why).
 * @param {{ native: boolean, env?: Record<string, string | undefined> }} o
 * @returns {"none" | "relaunch-x11" | "closed"}
 */
function waylandPlan(o) {
  if (!o || !o.native) return "none";
  const env = o.env || {};
  if (env.DISPLAY && env.COMPUTERPETS_X11_TRIED !== "1") return "relaunch-x11";
  return "closed";
}

/** The start's own arguments with the Wayland choice replaced by X11. */
function x11Args(argv) {
  const rest = (Array.isArray(argv) ? argv : []).filter((a) => !/^--ozone-platform(-hint)?=/.test(String(a)));
  return [...rest, "--ozone-platform=x11"];
}

/** Desktops Chromium already gives a key store by name (XDG_CURRENT_DESKTOP / DESKTOP_SESSION). */
const KNOWN_KEY_DESKTOPS = /(^|:)(gnome|unity|xfce|cinnamon|pantheon|deepin|ukui|kde)(:|$)/i;

/**
 * The --password-store to ask for: "gnome-libsecret" on a Linux desktop Chromium does not know by name when a
 * Secret Service is running on the session bus, else "" (leave Chromium's own choice, and any switch given).
 * `secretService` may be a function, asked only when it matters (it runs dbus-send before the app is ready).
 * @param {{ platform?: string, env?: Record<string, string | undefined>, given?: string, secretService?: boolean | (() => boolean) }} o
 */
function passwordStoreFor(o) {
  const platform = (o && o.platform) || process.platform;
  const env = (o && o.env) || {};
  if (!isLinux(platform) || (o && o.given)) return "";
  const desk = `${env.XDG_CURRENT_DESKTOP || ""}:${env.DESKTOP_SESSION || ""}`.replace(/^:|:$/g, "");
  if (desk && KNOWN_KEY_DESKTOPS.test(desk)) return "";
  const has = o && typeof o.secretService === "function" ? o.secretService() : !!(o && o.secretService);
  return has ? "gnome-libsecret" : "";
}

/**
 * Whether a Secret Service (gnome-keyring, KeePassXC, kwallet's bridge) is running on the session bus now. Asked
 * before the app is ready, so it waits at most `timeoutMs`; a keyring that is only activatable is not started.
 */
function secretServiceRunning(opts) {
  const env = (opts && opts.env) || process.env;
  const run = (opts && opts.spawnSync) || spawnSync;
  try {
    const r = run(
      "dbus-send",
      ["--session", "--print-reply", "--dest=org.freedesktop.DBus", "/org/freedesktop/DBus", "org.freedesktop.DBus.NameHasOwner", "string:org.freedesktop.secrets"],
      { env, encoding: "utf8", timeout: (opts && opts.timeoutMs) || 1500, windowsHide: true, stdio: ["ignore", "pipe", "ignore"] },
    );
    return !!(r && r.status === 0 && /boolean true/.test(String(r.stdout || "")));
  } catch {
    return false;
  }
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
  if (why === "wayland-native") {
    return {
      tray: "Wayland start. Overlay closed.",
      message: "The pets are not on the screen: they were started as a Wayland app, and there is no XWayland here to start them on instead.",
      detail:
        "On Wayland an app cannot see where the mouse is outside its own window or keep a window on top, so the pets could not be clicked. " +
        "The pets need XWayland, which lets Wayland desktops run X11 apps. GNOME, KDE and sway have it; on Ubuntu or Debian type sudo apt install xwayland. Then start them again with sh desktop.sh.",
      buttons: ["Quit", "OK"],
      actions: ["quit", "none"],
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

/** Said on a gate's message where no tray icon can be seen: that message is the only way to reach the app. */
const NO_TRAY_GATE = "There is no tray icon on this desktop to find the pets from, so OK quits too. Start ComputerPets again to see this message.";

/**
 * A gate's message box where no tray can be seen (`trayHost` "no"): OK would leave the app running with nothing on
 * the screen and no tray to reach it from, so OK quits too, and the message says so. Otherwise the words as given.
 * @template {{ detail: string, actions: string[] }} W
 * @param {W} words
 * @param {string} trayHost
 * @returns {W}
 */
function gateWithoutTray(words, trayHost) {
  if (trayHost !== "no") return words;
  return { ...words, detail: `${words.detail} ${NO_TRAY_GATE}`, actions: words.actions.map((a) => (a === "none" ? "quit" : a)) };
}

/**
 * The pet menu's Hide the window when no tray can be seen: the tray's Show was the way back, so say what is.
 * @param {string} platform
 */
function hideWords(platform) {
  const again = isLinux(platform) || /^darwin|^Mac/i.test(String(platform || "")) ? "sh desktop.sh" : ".\\desktop.ps1";
  return {
    message: "Hide the pets? There is no tray icon on this desktop to bring them back from.",
    detail: `To bring them back, start ComputerPets again (type ${again}, just like the first time). The pets come back with their keeper card open.`,
    buttons: ["Hide", "Cancel"],
    actions: ["hide", "none"],
  };
}

module.exports = {
  COMPOSITOR_SCRIPT,
  TIMEOUT_MS,
  SNI_ARGS,
  isLinux,
  waylandSession,
  compositorWord,
  readCompositor,
  readTrayHost,
  nativeWayland,
  electronMajor,
  waylandPlan,
  x11Args,
  passwordStoreFor,
  secretServiceRunning,
  overlayMayOpen,
  closedWords,
  hideWords,
  NO_TRAY_GATE,
  gateWithoutTray,
};
