# 0029. The window enumerator does not read a keeper window class

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/windows-enum.cjs`, `desktop/renderer/windows.js`, `web/src/lib/pets/windows.ts`

## Context

[0011](0011-presence-does-not-list-folders.md) stopped writing a window class onto the enum pipe. The glass already kept rects. One leftover stayed open: the enumerator still called `GetClassName` on every visible top-level window, held that string, and used it only to set a shell bit for the taskbar and the desktop host. The string did not leave the process. It was still the class of the keeper's window.

A shell bit is still required. Rui and the other guests must not perch on the taskbar or the desktop host. That bit does not need the class of Notepad, Explorer, or Chrome.

## Decision

This slice closes that leftover. It does not start DirectX 12 or Vulkan. It does not chase a pasted secret in a URL fragment or a hostname. It does not move the license hwid door. It does not change the overlay Gemini header.

- The enumerator does not call `GetClassName`. It does not allocate a class buffer. It does not call `GetWindowText`.
- Before the walk, it collects handles: `GetShellWindow`, then `FindWindowEx` for `Shell_TrayWnd`, `Shell_SecondaryTrayWnd`, `NotifyIconOverflowWindow`, `Progman`, and `WorkerW`. The title argument is null. A match is a handle. The class of any other window is not returned.
- A visible top-level window whose handle is in that set is shell `1` on the pipe. Every other row is shell `0`. The pipe is still `id`, rect, minimized, tool, cloaked, and that bit.
- `parseEnumText` still lets a legacy class token set the shell bit. The token is not stored. Extra columns (a title, a document name, a path) are ignored. The live enumerator does not write those tokens.
- `takeRects` still skips an in-memory row that already carries one of those five shell names. The glass payload stays `{ id, x, y, width, height }`. Catalog stays 221.

## Consequences

- A keeper window's class is not copied into the enumerator. The five shell names in the script are search keys, not a read of the desk.
- `FindWindowEx` can still miss a shell window the OS does not publish under those names. That window can become a perch. It is not a class string.
- A legacy enum line that still carries `Shell_TrayWnd` in field 9 still skips that row. New lines carry `0` or `1`.
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. When that read fails, a computer-name or random mark waits for an in-app yes. [0030](0030-missing-os-id-waits-for-a-yes.md).
- The overlay plugin key still goes out as a header on the direct plugin call. Gemini uses `x-goog-api-key`. That header is the call. [0022](0022-gemini-key-stays-off-the-query.md).
- A raw token in a URL fragment that is not a secret query can still ride on a base URL. A secret in the hostname can still ride. Those stay documented. This slice does not chase them. [0028](0028-model-field-drops-a-pasted-secret.md).
- Geolocation is not a standing process grant. Electron cannot revoke a grant Chromium already cached in the renderer. An in-app yes is not that revoke. A later locate still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine.
