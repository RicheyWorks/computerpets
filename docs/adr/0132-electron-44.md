# 0132. The desktop app moves from Electron 35 to Electron 44

- **Status:** Accepted
- **Date:** 2026-09-28
- **Code:** `desktop/package.json`, `desktop/main.cjs`, `desktop/overlay-gate.cjs`, `desktop.sh`, `desktop.ps1`, `desktop/first-run-drive.cjs`, `desktop/sni-watcher.py`, `client/computerpets_client/app_harness.py`, `desktop/renderer/electron-up.test.cjs`, `desktop/renderer/pieces.test.cjs`

## Context

The overlay ran on Electron 35.7.5. Electron 35 left support long ago. `npm audit` in `desktop/` reported **2 high** findings: 32 Electron advisories (among them a context isolation bypass through `Function.prototype.bind`, `contextBridge` copies honoring prototype setters, use-after-frees in permission and dialog callbacks, and an out-of-bounds read in second-instance IPC on Linux), plus 2 in `extract-zip`, which Electron's installer used. The only fix npm offered was `npm audit fix --force`, which "Will install electron@44.4.5, which is a breaking change". START-HERE told keepers not to type that, because a surprise major can stop the pets.

Electron supports its three newest majors. On 2026-09-28 those are 42, 43 and 44 (electronjs.org/docs/latest/tutorial/electron-timelines). 44.4.5 is the newest stable, and 44 is supported until 2027-03-02.

`desktop/package-lock.json` is not tracked. `npm install` resolves `^44.4.5` on each machine, the same way it resolved `^35.7.5`.

## What changed between 35 and 44 that touches this app

Every breaking-change note for 36 to 44 was read (electronjs.org/docs/latest/breaking-changes). The ones this app meets:

1. **36: `app.commandLine` lowercases switches.** The app already uses lowercase switches only (`password-store`, `ozone-platform`, `ozone-platform-hint`). **GTK 4 is the default on GNOME.** No GTK API is called. The tray and the message boxes were driven under Xvfb and sway.
2. **37: `BrowserWindow.isVisibleOnAllWorkspaces` changed on Linux.** The app only calls `setVisibleOnAllWorkspaces` (Mac and Linux, ADR 0131).
3. **38: `--ozone-platform` defaults to `auto`, and `ELECTRON_OZONE_PLATFORM_HINT` is removed.** On a Wayland session (`XDG_SESSION_TYPE=wayland` with a `WAYLAND_DISPLAY`, the Ubuntu GNOME default), Electron now starts as a native Wayland app with no switch. A native Wayland overlay cannot read the cursor outside itself (so click-through cannot work) and cannot keep itself on top. Checked on the box under a headless sway: Electron 44 writes the platform it picked into its own command line before `main.cjs` loads (`app.commandLine.getSwitchValue("ozone-platform")` reads `"wayland"` with no switch given; Electron 35 reads `""`). So the existing `nativeWayland` check already caught it, and the app started itself again on XWayland. It was not a live bug. `nativeWayland` now also takes `process.versions.electron`: when the switch is empty on Electron 38 or newer, the session decides. The environment hint counts only before 38. The drive now checks this path (point 9).
4. **39: `window.open` popups are resizable.** Every `window.open` is answered with deny (`presence/open-link.cjs`), so nothing changes.
5. **40 and 44: `clipboard` is gone from the renderer.** The renderers never used it. The clipboard permission stays denied.
6. **42: npm install no longer downloads Electron itself.** `postinstall` is gone. The binary comes the first time something runs Electron's bin or `require("electron")`, or runs `node node_modules/electron/install.js`. `path.txt` is written only after the extract. This broke three things here:
   - `desktop.ps1` and `desktop.sh` ran `npm rebuild electron` when the binary was missing. That runs no download any more, so a fresh clone would have stopped with "The overlay piece (Electron) did not download". Both scripts now print "Getting Electron, the overlay piece (about 100 MB). Leave this window open." and run `node node_modules/electron/install.js` right after `npm install`.
   - The pieces check. A finished install used to mean only the scripts' own stamp. After the three-line start (`cd desktop; npm install; npm start`), `-Check` / `--check` said `unfinished` although the pieces were complete. npm writes `node_modules/.package-lock.json` last when an install finishes, and rewrites it even when nothing changed (checked with npm 10 on the box and npm 11 on BLACKBEARD). So that file now counts as a finished install too. The pieces are `ready` only once `path.txt` names a file under `node_modules/electron/dist`. States: `missing` (no Electron package), `unfinished` (no finished record, or Electron not downloaded yet), `changed` (package.json newer than every finished record), and `ready`. The harness's `desk.launch_check` reads the same state from the files (`launch_pieces_here`). It fails if the script disagrees, or if the stamp or npm's record changes.
   - `first-run-drive.cjs` starts `dist/electron` directly, so it now runs `install.js` first when the binary is missing. The drive's JSON names the Electron version.
   - Unsigned macOS apps can no longer show notifications. This app is not signed. macOS is untested here.
7. **43: frameless windows get rounded corners on Linux.** The overlay is one frameless, transparent window over the whole work area, so rounded corners would clip a pet in a screen corner. It now sets `roundedCorners: false`.
8. **44: ANGLE is statically linked, macOS 13 or newer, no 32-bit Windows, `app.isUnityRunning` removed.** Not used here. The GPU gate reads the same `app.getGPUFeatureStatus().gpu_compositing` strings from 35 through 44. The gate stays honest: software compositing still keeps the glass closed until the keeper presses **Allow software compositing** (`gate_software_says_so` passes under Xvfb), and a desktop without a compositor still stays closed (`gate_no_compositor_says_so`). No DirectX 12, Vulkan or WebGL work.
9. **Also checked, unchanged:** `setIgnoreMouseEvents(true, { forward: true })` and the transparent click-through overlay (the Windows drive at three scales), the tray and its menus, the `screen` APIs (`getCursorScreenPoint`, `getDisplayNearestPoint`, work areas at 1, 1.25 and 1.5), `contextIsolation: true` with `sandbox` and the preload bridge, `--password-store` (the Minds key kept with gnome-keyring on a desktop Chromium does not know by name), and Playwright's `_electron` (playwright-core 1.62.1 from `web/node_modules` drives Electron 44 on Windows and Linux).

## Decision

**Electron 44 (`^44.4.5`).** It is the newest supported major, and `npm audit` finds 0 vulnerabilities with it. The app follows each breaking change above instead of pinning an older major.

The drive gains two checks:

- **A Wayland session with no switch** (`autoWaylandStart`, read on its own and not taken from `overlay-gate.cjs`). The first start must ask to start again on XWayland (`gate_wayland_restarts_on_x11`). An overlay that opened there without asking fails.
- **`tray_appears_later_sni`**, after the XEmbed `tray_appears_later`. `desktop/sni-watcher.py` is a small PyGObject StatusNotifier watcher and host that takes `org.kde.StatusNotifierWatcher` on the session bus after the pets are up. The overlay must hear no, then yes. Exactly one item must register with the watcher (the one made before is dropped when its bus name goes). Hide the window must hide at once. The check runs only with a session bus that has no watcher yet, `dbus-send`, and python3 with PyGObject, so a keeper's real panel is never replaced.

## Consequences

- `npm audit` in `desktop/`: before, 2 high (32 Electron advisories plus 2 in `extract-zip`); after, **found 0 vulnerabilities**. Electron 44 no longer depends on `extract-zip`.
- The first `npm start` after the three-line start downloads about 100 MB (Electron itself), as before. Now it happens when Electron first runs, not during `npm install`. `desktop.ps1` and `desktop.sh` do it right after `npm install`.
- The drive numbers are in the PR and in `docs/APP-HARNESS.md`.
- **Not proven here:** macOS (untested; 44 needs macOS 13 or newer, and an unsigned app gets no notifications). A real mouse through the click-through layer on native Wayland, or on XWayland: the drive's input is CDP, and the box's virtual pointer sends X clients no clicks.
