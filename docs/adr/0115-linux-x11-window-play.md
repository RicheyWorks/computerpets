# 0115. Linux X11 lists window rectangles for pet window play

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `desktop/windows-enum.cjs`, `desktop/renderer/windows.js`, `desktop/main.cjs`, `web/src/lib/pets/windows.ts`

## Context

[0114](0114-metrics-server-kubelet-port.md) left this gap: the overlay enumerates windows on Windows 10/11 only. Pets already sit those rectangles (cling, ledge, floor watch, and the rest of `playFor`). Mac and Linux both returned `mac-linux-window-play` and an empty list. The rects were not faked.

Inventory on `main` tip `c51ec173a`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `desktop/windows-enum.cjs` | Spawned PowerShell and walked `EnumWindows` / `GetWindowRect` on Windows. The pipe is `id`, rect, minimized, tool, cloaked, shell bit | It returned the later door for `linux` and `darwin`. It did not open an X11 display |
| `desktop/main.cjs` | Pushed `takeRects` on a calm tick when `Desk.isWindows` | The tick returned before `listRaw` on Linux and on Mac |
| `desktop/renderer/windows.js` and `web/src/lib/pets/windows.ts` | Parsed the nine-field pipe and skipped minimized, tool, cloaked, and shell rows | `enumeratesOn` was Windows only |

Linux already had the overlay floor, the mark, and workspace walk. The missing piece was the rectangle list. Mac still has no Accessibility window list, and Electron's Mac handle is not a window id this pipe can skip. Both could not land cleanly together.

This slice does not reopen presence/CSP, Hikari, bundle zip, cosign, CDN, secrets, field bounds, client address, rate limits, HMAC/nonce, download JWT, WAF, Redis AUTH, Postgres SSL, API listener TLS, HPA, PDB, topology spreads, node-pool pin/taint, Cluster Autoscaler, aws-node/vpc-cni, kube-proxy reassert, or any metrics-server TLS/dial/serving-cert/kubelet-CA/SAN/port slice beyond the cross-link in [0114](0114-metrics-server-kubelet-port.md). No live AWS apply. Catalog stays 221. No Rui sprites. No storefront. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana.

## Decision

**On Linux, the overlay asks libxcb for `_NET_CLIENT_LIST` and emits the same nine-field pipe Windows already uses. `takeRects` and window play sit those rectangles. A desktop or a dock is shell `1`. A missing display, a failed connect, or a display with no client list yields an empty list. Mac stays `mac-window-play` and does not invent rectangles.**

1. **The pipe stays the Windows pipe.** Each row is client id, left, top, right, bottom, minimized, tool, cloaked, shell. Field 9 is `0` or `1`. Extra columns are still ignored. The id is the decimal X id from `_NET_CLIENT_LIST`, which is the id Electron returns from `getNativeWindowHandle` on Linux, so the overlay can skip itself.
2. **The bounds are the frame.** The helper walks parents until the window under the root and translates that frame to the root. That is the rectangle a pet sits, including a reparenting frame. The id stays the client id.
3. **Shell and tool bits do not read a class or a title.** `_NET_WM_WINDOW_TYPE_DESKTOP` and `_NET_WM_WINDOW_TYPE_DOCK` set the shell bit. Toolbar, menu, utility, splash, dropdown, popup, tooltip, notification, combo, and drag-and-drop types set the tool bit. An override-redirect window sets the tool bit. `WM_STATE` iconic or `_NET_WM_STATE_HIDDEN` sets minimized. A window that is not viewable sets cloaked. The helper does not intern a name atom, does not call `xcb_get_atom_name`, and does not read a title.
4. **Who ticks.** `startWindowTick` runs when the platform is Windows or Linux. Mac does not start it. `laterDoor("darwin")` is `mac-window-play`. `laterDoor("linux")` is null. `laterDoor("win32")` stays null.
5. **Empty is honest.** No `DISPLAY`, a refused connect, a missing `_NET_CLIENT_LIST`, or a helper crash returns no rows. The glass does not invent a demo rectangle on the overlay. `/demo` still draws its own plates.
6. **What stays.** Windows PowerShell enumeration is unchanged. The five shell search names stay Windows-only. Presence still scrubs a row down to `{ id, x, y, width, height }`. Catalog stays 221.

## Consequences

- A Linux keeper with an X11 display, including XWayland, gets real window rectangles on the same tick Windows already uses. Pets sit those rectangles with the existing `playFor` door.
- A Wayland session that does not set `DISPLAY` stays empty. Native Wayland windows are not listed. That is not faked.
- A window manager that does not publish `_NET_CLIENT_LIST` yields no perches.
- A dock or desktop that does not set `_NET_WM_WINDOW_TYPE_DOCK` or `_NET_WM_WINDOW_TYPE_DESKTOP` can become a perch. The bit is the type atom, not a class string.
- HiDPI Linux still divides by Electron `scaleFactor`, the same as Windows. A compositor that reports logical X11 pixels while `scaleFactor` is not 1 can mis-place a sit. This slice does not add a second scale probe.
- The helper does not read a title or a class. A title planted on a window does not appear on the pipe.
- Mac window play is still open. Do not invent Mac rectangles in this door.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Mac window play (`mac-window-play`). The overlay lists windows on Windows 10/11 and on Linux X11. That door does not play a window on a Mac, and it is not faked. Wayland without an X11 display stays empty and is not the next slice. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana. Catalog stays 221.
