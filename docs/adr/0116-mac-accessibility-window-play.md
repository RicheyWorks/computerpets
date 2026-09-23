# 0116. Mac Accessibility lists window rectangles for pet window play

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `desktop/windows-enum.cjs`, `desktop/renderer/windows.js`, `desktop/main.cjs`, `web/src/lib/pets/windows.ts`

## Context

[0115](0115-linux-x11-window-play.md) left this gap: the overlay enumerates windows on Windows 10/11 and on Linux X11. Mac returned `mac-window-play` and an empty list. The rects were not faked. Electron's Mac handle is an `NSView*` pointer. That pointer is not a window id this pipe can skip.

Inventory on `main` tip `f201feefd`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/windows-enum.cjs` | Spawned PowerShell on Windows and libxcb on Linux. The pipe is `id`, rect, minimized, tool, cloaked, shell bit | `darwin` returned the later door and did not ask Accessibility |
| `desktop/main.cjs` | Pushed `takeRects` on a calm tick when the platform was Windows or Linux. The skip id was `getNativeWindowHandle` | The tick returned before `listRaw` on Mac. The view pointer was the only handle |
| `desktop/renderer/windows.js` and `web/src/lib/pets/windows.ts` | Parsed the nine-field pipe and skipped minimized, tool, cloaked, and shell rows | `enumeratesOn` was Windows and Linux only |

Mac already had the overlay floor, the menu, and Spaces walk. The missing piece was the rectangle list. A stock Mac does not ship `python3`. `/usr/bin/osascript` does ship. The list has to run there, in the Accessibility API, or it is not a list.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy reassert, or any metrics-server TLS/dial/serving-cert/kubelet-CA/SAN/port slice. The Linux X11 path stays the libxcb list in [0115](0115-linux-x11-window-play.md). No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana.

## Decision

**On Mac, the overlay asks Accessibility for each app's windows and emits the same nine-field pipe Windows and Linux already use. `takeRects` and window play sit those rectangles. The id is the window number (`CGWindowID`), which is the id in Electron `getMediaSourceId()`. The view pointer is not used. If Accessibility is off, the list is empty.**

1. **The pipe stays the Windows pipe.** Each row is window number, left, top, right, bottom, minimized, tool, cloaked, shell. Field 9 is `0` or `1`. Extra columns are still ignored. The id comes from `_AXUIElementGetWindow`. A window with no number is omitted. It is not given the view pointer.
2. **The bounds are the frame, in points.** `AXPosition` and `AXSize` are the frame. The origin is the top-left of the menu-bar screen. Y increases downward. That is the same point space as Electron's work area. The Mac tick passes scale `1`. A Retina `scaleFactor` of 2 does not halve the sit.
3. **Shell and tool bits do not read a title.** Dock, WindowServer, SystemUIServer, and Control Center set the shell bit. Floating, system-floating, dialog, system-dialog, and unknown subroles set the tool bit. Notification Center sets the tool bit. A hidden app sets cloaked. `AXMinimized` sets minimized. The helper does not read a window name. It does not call `CGWindowListCopyWindowInfo`.
4. **Who ticks.** `startWindowTick` runs on Windows, Linux, and Mac. `laterDoor` is null on those three. The helper is `/usr/bin/osascript` with JavaScript for Automation. It calls `AXIsProcessTrusted` and does not prompt. `AXIsProcessTrustedWithOptions` is not called. A prompt on the 750ms tick would nag.
5. **Empty is honest.** A missing `osascript`, a framework that will not load, a missing `_AXUIElementGetWindow`, a trust check that is false, or a helper crash returns no rows. The glass does not invent a demo rectangle. `/demo` still draws its own plates.
6. **What stays.** Windows PowerShell enumeration is unchanged. Linux libxcb enumeration is unchanged. The five shell search names stay Windows-only. Presence still scrubs a row down to `{ id, x, y, width, height }`. Catalog stays 221.

## Consequences

- A Mac keeper whose overlay (or the `osascript` helper macOS names) is allowed in System Settings → Privacy & Security → Accessibility gets real window rectangles on the same tick Windows and Linux already use. Pets sit those rectangles with the existing `playFor` door.
- Until that box is on, the list stays empty. The house does not pretend the sit is working. Trust is the helper process. macOS may name ComputerPets, or it may name `osascript`. Whichever it names is the one that must be allowed. This tick does not raise the system prompt.
- `_AXUIElementGetWindow` is a private symbol. If it is missing, that window is omitted. The pipe does not invent an id.
- A window on another Space can still be listed with its last frame. This slice does not filter Spaces. A pet can sit a window the keeper cannot see. That is not cloaked unless the app is hidden.
- A Finder window stays a perch. A Dock-owned desktop or wallpaper is shell. A Finder desktop that Accessibility exposes as a standard window can become a perch. The bit is the bundle and the subrole, not a name.
- The overlay skips itself by window number (`window:<id>:<webContents>`). `window:-1` before the glass is on screen is refused, so the first ticks can include the overlay until it has a number. A panel whose subrole is floating is also a tool bit and is not a perch.
- HiDPI Mac stays in points. Windows and Linux still divide by `scaleFactor`.
- The helper does not read a title or a bundle onto the pipe. A title planted on a window does not appear on the pipe.
- Wayland without an X11 display stays empty. That list is [0115](0115-linux-x11-window-play.md) and is not reopened here.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Mac and Linux GPU sense (`mac-linux-gpu-sense`). The overlay lists windows on Windows 10/11, Linux X11, and Mac Accessibility. That door does not read a Mac or Linux GPU, and it is not faked. Wayland without an X11 display stays empty and is not the next slice. Windows virtual desktops stay a later door. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
