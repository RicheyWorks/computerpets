/** Windows 10/11 top-level window bounds. Rects only. Mac/Linux stay a later door.
 * The taskbar and the desktop host are known shell handles. A keeper window's
 * class is not copied. The shell bit on the pipe is 0 or 1.
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

let pump = null;
let pumpBuf = "";
/** @type {{ ok: (text: string) => void, err: (err: Error) => void } | null} */
let pumpWait = null;

function ensurePump(spawnFn) {
  if (pump) return pump;
  const spawnImpl = spawnFn || spawn;
  pump = spawnImpl("powershell.exe", ["-NoProfile", "-STA", "-ExecutionPolicy", "Bypass", "-Command", ENUM_SCRIPT], {
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
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
  return new Promise((resolve, reject) => {
    if (pumpWait) {
      resolve("");
      return;
    }
    const child = ensurePump(spawnFn);
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
  listRaw,
  runPumpTick,
  disposePump,
  parseEnumText: Windows.parseEnumText,
  takeRects: Windows.takeRects,
  hwndFromHandle: Windows.hwndFromHandle,
  enumeratesOn: Windows.enumeratesOn,
  laterDoor: Windows.laterDoor,
};
