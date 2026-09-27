/** Windows virtual desktop follow for the overlay (ADR 0131).
 * Electron's setVisibleOnAllWorkspaces does nothing on Windows. Mac Spaces and Linux
 * workspaces keep it. On win32 a PowerShell helper answers one question about the
 * overlay's own HWND: is it on the current virtual desktop? It asks the documented
 * IVirtualDesktopManager.IsWindowOnCurrentVirtualDesktop and reads the DWMWA_CLOAKED
 * bit of that same HWND. It does not walk windows, does not ask for the foreground
 * window, and reads no window text or class.
 * MoveWindowToDesktop refuses a window owned by another process (E_ACCESSDENIED), so
 * the helper never calls it. When the overlay is off the current desktop, the main
 * process re-shows its own window: hide, showInactive, always-on-top again.
 * The follower waits SETTLE_MS before it acts and SETTLE_MS after, so a fast flip
 * through desktops does not bounce the pet. vdesk.json { follow } turns it off.
 * ADR 0132: the same ask also reads GetWindowDesktopId for that one HWND. When the
 * overlay turns up on the current desktop with a different id than last time, the
 * follower calls onArrive({ from, to }) so the renderer can keep a spot per desktop.
 */
const { spawn } = require("child_process");
const path = require("path");
const Spots = require("./renderer/desk-spots.js");

const FILE = "vdesk.json";
const POLL_MS = 750;
const SETTLE_MS = 300;
const MAX_MISSES = 3;
const TIMEOUT_MS = 3500;
/** DWM_CLOAKED_SHELL: the shell cloaked the window, which is what another desktop does. */
const CLOAKED_SHELL = 0x2;

const PROBE_SCRIPT = `
Add-Type @"
using System;
using System.Runtime.InteropServices;

[ComImport, Guid("a5cd92ff-29be-454c-8d04-d82879fb3f1b"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IDeskVdManager {
  [PreserveSig] int IsWindowOnCurrentVirtualDesktop(IntPtr topLevelWindow, [MarshalAs(UnmanagedType.Bool)] out bool onCurrentDesktop);
  [PreserveSig] int GetWindowDesktopId(IntPtr topLevelWindow, out Guid desktopId);
  [PreserveSig] int MoveWindowToDesktop(IntPtr topLevelWindow, [MarshalAs(UnmanagedType.LPStruct)] Guid desktopId);
}

[ComImport, Guid("aa509086-5ca9-4c25-8f95-589d3c07b48a")]
public class DeskVdManagerCo {}

public static class DeskVd {
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)] public static extern bool IsWindow(IntPtr h);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out int pvAttribute, int cbAttribute);
  public const int DWMWA_CLOAKED = 14;
  static IDeskVdManager mgr;

  public static string Ask(long id) {
    IntPtr h = new IntPtr(id);
    if (!IsWindow(h)) return "gone";
    int cloaked = 0;
    try { if (DwmGetWindowAttribute(h, DWMWA_CLOAKED, out cloaked, 4) != 0) cloaked = 0; } catch { cloaked = 0; }
    string on = "?";
    try {
      if (mgr == null) mgr = (IDeskVdManager)new DeskVdManagerCo();
      bool current;
      if (mgr.IsWindowOnCurrentVirtualDesktop(h, out current) == 0) on = current ? "1" : "0";
    } catch { mgr = null; on = "?"; }
    string desk = "-";
    try {
      Guid g;
      if (mgr != null && mgr.GetWindowDesktopId(h, out g) == 0 && g != Guid.Empty) desk = g.ToString("D");
    } catch { desk = "-"; }
    return on + " " + cloaked + " " + desk;
  }
}
"@
while ($true) {
  $line = [Console]::In.ReadLine()
  if ($null -eq $line) { break }
  if ($line -eq "quit") { break }
  $id = [Int64]0
  if ([Int64]::TryParse($line, [ref]$id) -and $id -gt 0) { Write-Output ([DeskVd]::Ask($id)) } else { Write-Output "bad" }
  Write-Output "END"
}
`;

function probeCommand() {
  return {
    cmd: "powershell.exe",
    args: ["-NoProfile", "-STA", "-ExecutionPolicy", "Bypass", "-Command", PROBE_SCRIPT],
  };
}

/** The overlay's own HWND as a decimal string, or "". Nothing else goes down the pipe. */
function cleanHwnd(hwnd) {
  const text = typeof hwnd === "bigint" ? hwnd.toString() : String(hwnd == null ? "" : hwnd).trim();
  return /^[1-9][0-9]{0,19}$/.test(text) ? text : "";
}

/** "gone" | "<1|0|?> <cloaked> [<desktop id>|-]" -> { gone, on, cloaked, desk } or null. */
function parseProbeText(text) {
  const line = String(text || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.length > 0);
  if (!line || line === "bad") return null;
  if (line === "gone") return { gone: true, on: null, cloaked: 0, desk: "" };
  const parts = line.split(/\s+/);
  const on = parts[0] === "1" ? true : parts[0] === "0" ? false : null;
  const cloaked = Number.parseInt(parts[1], 10);
  return { gone: false, on, cloaked: Number.isFinite(cloaked) ? cloaked : 0, desk: Spots.cleanDeskId(parts[2]) };
}

/** The manager's answer wins. The shell cloak bit only speaks when the manager could not. */
function offDesktop(sample) {
  if (!sample || sample.gone) return false;
  if (sample.on === false) return true;
  if (sample.on === true) return false;
  return (Number(sample.cloaked) & CLOAKED_SHELL) !== 0;
}

/** One PowerShell helper, spawned on the first ask. One line in (the HWND), one answer out. */
function createProbe(opts) {
  const o = opts || {};
  const spawnImpl = o.spawn || spawn;
  const timeoutMs = o.timeoutMs > 0 ? o.timeoutMs : TIMEOUT_MS;
  let child = null;
  let buf = "";
  /** @type {{ ok: (text: string) => void, err: () => void } | null} */
  let wait = null;

  function ensure() {
    if (child) return child;
    const spec = probeCommand();
    const c = spawnImpl(spec.cmd, spec.args, {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      env: o.env || process.env,
    });
    child = c;
    buf = "";
    if (c.stdout) {
      c.stdout.setEncoding("utf8");
      c.stdout.on("data", (chunk) => {
        buf += String(chunk);
        const mark = buf.indexOf("END");
        if (mark < 0) return;
        const text = buf.slice(0, mark);
        buf = buf.slice(mark + 3).replace(/^\r?\n/, "");
        const w = wait;
        wait = null;
        if (w) w.ok(text);
      });
    }
    if (c.stderr) {
      c.stderr.setEncoding("utf8");
      c.stderr.on("data", () => {});
    }
    const fail = () => {
      if (child === c) child = null;
      const w = wait;
      wait = null;
      if (w) w.err();
    };
    c.on("error", fail);
    c.on("exit", fail);
    return c;
  }

  function ask(hwnd) {
    const id = cleanHwnd(hwnd);
    if (!id || wait) return Promise.resolve(null);
    return new Promise((resolve) => {
      let c;
      try {
        c = ensure();
      } catch {
        resolve(null);
        return;
      }
      if (!c || !c.stdin) {
        resolve(null);
        return;
      }
      const w = {
        ok(text) {
          clearTimeout(timer);
          resolve(parseProbeText(text));
        },
        err() {
          clearTimeout(timer);
          resolve(null);
        },
      };
      const timer = setTimeout(() => {
        if (wait !== w) return;
        wait = null;
        dispose();
        resolve(null);
      }, timeoutMs);
      wait = w;
      try {
        c.stdin.write(id + "\n");
      } catch {
        wait = null;
        clearTimeout(timer);
        resolve(null);
      }
    });
  }

  function dispose() {
    const c = child;
    child = null;
    buf = "";
    const w = wait;
    wait = null;
    if (w) w.err();
    if (!c) return;
    try {
      c.stdin && c.stdin.write("quit\n");
    } catch {
      /* ignore */
    }
    try {
      c.kill();
    } catch {
      /* ignore */
    }
  }

  return { ask, dispose };
}

/**
 * Poll the overlay's own HWND and bring it to the current desktop.
 * win: { hwnd(), visible(), reshow(), move?() }. move is tried first when present and
 * must resolve true; the re-show is the fallback. Windows has no cross-process move.
 * onArrive({ from, to }) runs when the overlay is on the current desktop and its desktop
 * id is not the one it last had there (ADR 0132). The first id after start only records.
 */
function createFollower(opts) {
  const o = opts || {};
  const probe = o.probe;
  const win = o.win;
  const enabled = typeof o.enabled === "function" ? o.enabled : () => true;
  const pollMs = o.pollMs > 0 ? o.pollMs : POLL_MS;
  const settleMs = o.settleMs >= 0 ? o.settleMs : SETTLE_MS;
  const maxMisses = o.maxMisses > 0 ? o.maxMisses : MAX_MISSES;
  const now = typeof o.now === "function" ? o.now : Date.now;
  const timers = o.timers || { setInterval, clearInterval, setTimeout, clearTimeout };
  const onArrive = typeof o.onArrive === "function" ? o.onArrive : null;
  const stats = { probes: 0, moves: 0, reshows: 0, misses: 0, arrivals: 0 };
  let poll = null;
  let settleTimer = null;
  let busy = false;
  let offSince = 0;
  let quietUntil = 0;
  let acted = false;
  let misses = 0;
  let hereDesk = "";

  function live() {
    return !!poll && enabled() && !!win && win.visible();
  }

  async function ask() {
    const id = win.hwnd();
    if (!id) return null;
    stats.probes += 1;
    try {
      return await probe.ask(id);
    } catch {
      return null;
    }
  }

  /** The manager said "on the current desktop": note its id, and tell on a change. */
  function noteDesk(sample) {
    if (!sample || sample.gone || sample.on !== true || !sample.desk) return;
    const from = hereDesk;
    hereDesk = sample.desk;
    if (!from || from === sample.desk) return;
    stats.arrivals += 1;
    if (!onArrive) return;
    try {
      onArrive({ from, to: sample.desk });
    } catch {
      /* the renderer may be gone */
    }
  }

  function armSettle() {
    if (settleTimer) timers.clearTimeout(settleTimer);
    settleTimer = timers.setTimeout(() => {
      settleTimer = null;
      tick("settle");
    }, settleMs);
  }

  async function bringHere() {
    if (typeof win.move === "function") {
      let moved = false;
      try {
        moved = (await win.move()) === true;
      } catch {
        moved = false;
      }
      if (moved) {
        const after = await ask();
        if (after && !offDesktop(after)) {
          stats.moves += 1;
          return "move";
        }
      }
    }
    win.reshow();
    stats.reshows += 1;
    return "reshow";
  }

  /** @param {"poll" | "settle"} reason */
  async function tick(reason) {
    if (busy || !live()) {
      if (!busy) offSince = 0;
      return null;
    }
    busy = true;
    try {
      const sample = await ask();
      if (!live()) {
        offSince = 0;
        return null;
      }
      if (!offDesktop(sample)) {
        offSince = 0;
        acted = false;
        misses = 0;
        noteDesk(sample);
        return null;
      }
      const t = now();
      if (t < quietUntil) return null;
      if (acted) {
        acted = false;
        misses += 1;
        stats.misses += 1;
      }
      if (misses >= maxMisses) return null;
      if (!offSince) {
        offSince = t;
        armSettle();
        return null;
      }
      if (reason !== "settle" && t - offSince < settleMs) return null;
      offSince = 0;
      const how = await bringHere();
      acted = true;
      quietUntil = now() + settleMs;
      return how;
    } finally {
      busy = false;
    }
  }

  function start() {
    if (poll || !probe || !win) return false;
    poll = timers.setInterval(() => {
      tick("poll");
    }, pollMs);
    tick("poll");
    return true;
  }

  function stop() {
    if (poll) timers.clearInterval(poll);
    if (settleTimer) timers.clearTimeout(settleTimer);
    poll = null;
    settleTimer = null;
    offSince = 0;
    quietUntil = 0;
    acted = false;
    misses = 0;
    hereDesk = "";
  }

  return {
    start,
    stop,
    tick,
    nudge: () => tick("poll"),
    running: () => !!poll,
    desk: () => hereDesk,
    stats,
  };
}

function fileOf(dir) {
  if (!dir || typeof dir !== "string") return "";
  return path.join(dir, FILE);
}

/** Follow is on unless vdesk.json says { "follow": false }. A bad file stays on. */
function readFollow(dir, fsImpl) {
  const file = fileOf(dir);
  if (!file || !fsImpl) return true;
  try {
    const parsed = JSON.parse(fsImpl.readFileSync(file, "utf8"));
    return !(parsed && typeof parsed === "object" && parsed.follow === false);
  } catch {
    return true;
  }
}

function writeFollow(dir, fsImpl, on) {
  const file = fileOf(dir);
  if (!file || !fsImpl) return false;
  try {
    if (typeof fsImpl.mkdirSync === "function") fsImpl.mkdirSync(dir, { recursive: true });
    fsImpl.writeFileSync(file, JSON.stringify({ follow: !!on }) + "\n");
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  FILE,
  POLL_MS,
  SETTLE_MS,
  MAX_MISSES,
  CLOAKED_SHELL,
  PROBE_SCRIPT,
  probeCommand,
  cleanHwnd,
  parseProbeText,
  offDesktop,
  createProbe,
  createFollower,
  readFollow,
  writeFollow,
};