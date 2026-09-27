# 0131. The Windows overlay follows you across virtual desktops

- **Status:** Accepted
- **Date:** 2026-09-26
- **Code:** `desktop/vdesk-win.cjs`, `desktop/vdesk-win.test.cjs`, `desktop/main.cjs`, `desktop/renderer/desk.js`, `desktop/package.json`

## Context

`main.cjs` called `win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })` on every platform. Electron honors that on macOS Spaces and Linux workspaces. On Windows it does nothing. A keeper who pressed Win+Ctrl+Right left the pet behind on the old desktop. `desk.js` said so: "Windows virtual desktops stay a later door." ADRs 0117 to 0124 repeated that line.

Windows has one documented, public API for this: `IVirtualDesktopManager` (CLSID `aa509086-5ca9-4c25-8f95-589d3c07b48a`). It has three methods. `IsWindowOnCurrentVirtualDesktop` and `GetWindowDesktopId` work on any top-level window. `MoveWindowToDesktop` only moves a window the calling process owns. On BLACKBEARD (Windows 11 26200), a second process asking to move another process's window got `0x80070005` (E_ACCESSDENIED). The same call on its own window returned `S_OK`. The pinned-app and "switch desktop" interfaces are undocumented, change GUIDs between Windows builds, and are not used here.

`windows-enum.cjs` already runs a persistent `powershell.exe -STA` helper with an `Add-Type` C# block and reads the `DWMWA_CLOAKED` bit. A window on another desktop is cloaked by the shell (`DWM_CLOAKED_SHELL`, 2). No native module is needed, so none is added.

This slice does not reopen presence/CSP, the window-rect pipe, GPU sense, or the canvas arc ([0125](0125-chromium-overlay-gpu-path.md) to [0130](0130-chromium-visitor-floor-hive-den-sprites.md)). Catalog stays 221. No Rui sprites. No pet art is touched. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana.

## Decision

**On Windows the overlay follows the keeper to the current virtual desktop. A helper asks one question about the overlay's own window. When the answer is "not here", the main process re-shows its own window. macOS and Linux keep Electron's pin.**

1. **Who follows.** `Desk.desktopFollow(platform)` is true only on `win32`. `Desk.spacesWalk` stays Mac and Linux, and `setVisibleOnAllWorkspaces` is now called only when `spacesWalk` says so. `startDesktopFollow()` runs after the tray, beside the window and GPU ticks. It never runs in the GUI harness.
2. **What the probe asks.** `vdesk-win.cjs` spawns one `powershell.exe -NoProfile -STA` helper on the first ask. Each ask writes one decimal HWND: the overlay's own, from `Windows.hwndFromHandle(win.getNativeWindowHandle())`. The helper checks `IsWindow`, calls `IsWindowOnCurrentVirtualDesktop`, and reads `DWMWA_CLOAKED` on that one handle. It answers `1 0`, `0 2`, `? 2`, or `gone`. It does not walk windows. It does not ask for the foreground window. It reads no title, class, process, or module. It never calls `MoveWindowToDesktop` or `GetWindowDesktopId`. The COM interface declares them only because a COM vtable must list its methods in order. A handle that is not a window answers `gone`, because the manager returns `S_OK`/"on current" even for a bogus handle.
3. **What counts as "not here".** The manager's answer wins. The shell-cloak bit only speaks when the manager could not answer. An app cloak (1) alone is not "not here".
4. **How it moves.** Windows refuses a cross-process `MoveWindowToDesktop`, so the main process does the move on its own window: `win.hide()`, `win.showInactive()`, then `fitWorkArea()`, which sets always-on-top at `screen-saver` again. Windows places a window that is shown again on the current desktop. That is the behavior this relies on. If a Windows build does not, the three-miss stop in step 5 keeps the follower from looping. `showInactive` does not take focus. The follower still accepts an optional `move()` that must resolve `true` and is checked by a second probe. The re-show is the fallback whenever the move is missing, fails, or does not land.
5. **When it moves.** It polls every 750 ms. The first "not here" only starts a 300 ms settle wait. It acts only if the overlay is still off the desktop when the wait ends. After it acts, it stays quiet for another 300 ms. A fast flip through desktops does not bounce the pet. If three re-shows in a row do not land, it stops until the probe sees the overlay on the current desktop again. It never acts while the keeper has hidden or minimized the window.
6. **How to turn it off.** The tray shows **Follow me across desktops** as a checkbox on Windows. It writes `vdesk.json` (`{ "follow": false }`) under `userData`, the same way `gpu-path.json` holds the compositor choice. A missing or unreadable file leaves follow on. Turning it off stops the poll and ends the helper. The helper also ends on `will-quit` and `window-all-closed`.

## Consequences

- A Windows keeper who switches virtual desktops sees the pet come along within about one second. The pet keeps its place inside the overlay, because the overlay is one work-area window and the pet's position lives in the renderer.
- There is one more `powershell.exe` child on Windows while follow is on. The first answer takes about 350 ms (the `Add-Type` compile). Later answers take a few milliseconds.
- **Runtime check on BLACKBEARD (2026-09-26).** A throwaway 60×60 transparent Electron window, run from the worktree for about three seconds, answered `on=1 cloaked=0`. The follower polled it 8 times in 1.5 s and never re-showed it. After hide + showInactive it was still visible, on top, and unfocused. A destroyed handle and a bogus handle answered `gone`. The helper and Electron were gone afterward. That machine has one virtual desktop, and switching the keeper's desktops was out of bounds. So the re-show landing on a new desktop is covered by the unit tests and by how Windows places a re-shown window. It was not checked with a live switch.
- Unit tests use a fake probe and fake timers. They cover a switch, the move-fail fallback, no bounce, the three-miss stop, follow turned off, a hidden pet, the helper pipe carrying only the HWND, a dead or stalled helper, and `vdesk.json`. A privacy test fails if the helper or module names `EnumWindows`, `GetWindowText`, `GetClassName`, `GetForegroundWindow`, `FindWindow`, or a process lookup.
- Mac Spaces and Linux workspaces are unchanged.
- **Next gap:** a per-desktop pet position. The follower brings the whole overlay across, so the pet appears where it was. Remembering a different spot for each desktop needs the desktop id of the overlay's own window (`GetWindowDesktopId` on that one handle) and a renderer message for the pet's `x`. That is its own slice. Catalog stays 221. Do not start DirectX 12, Vulkan, Solana, or Pane.