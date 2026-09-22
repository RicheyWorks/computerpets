# 0010. Desk presence does not open a dropped keeper file

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence.cjs`, `desktop/renderer/presence.js`, `web/src/lib/pets/presence.ts`, `client/computerpets_client/presence.py`

## Context

Architecture §11 says pets occupy the real desktop among homework, browsers, and icons, and that presence is not filesystem theft. No silent read or write of keeper files. No keyloggers. No secret capture. No clipboard harvest.

The overlay is a transparent window over the whole work area. It becomes clickable when the cursor is on the pet, a gift, a plate, or the card. Electron approves every permission request unless the app installs a handler. A file dropped on that glass navigates the window to the file. The preload bridge would still be attached, so a dropped page could ask for the mind store. Clipboard read, display capture, and the File System Access API would have been approved the same way.

Gifts and place marks are house objects (a ribboned box, a lure, a guest stood on the floor). They are not the keeper's files. Card and mind prefs already lived in overlay `userData`, but the path was a string join with no allowlist.

## Decision

This slice refuses the drop and the silent grants. It does not list the desktop.

- Renderer navigation is refused (`will-navigate`, `will-redirect`, `will-frame-navigate`). New windows are denied. `loadFile` from main is not that path.
- Permission requests and checks allow `geolocation` only. That is the weather button. Clipboard read, clipboard write, display capture, microphone and camera, and `fileSystem` stay denied.
- A drag that carries `Files` or `text/uri-list` is cancelled. The handler does not read the path or the bytes. The same guard sits the overlay, the minds window, the living desk (including `/demo`), and the blotter. The blotter does not accept drops.
- Window rows pushed to the glass are `id`, `x`, `y`, `width`, `height`. Titles and paths are dropped before send. The enumerator still does not call `GetWindowText`.
- Overlay presence writes resolve only to `card.json` and `mind.json` under `userData`. Any other name, including `..` and a Desktop path, is not written.

## Consequences

- Listing Desktop or Documents, and reading window titles or document names, closed in [0011](0011-presence-does-not-list-folders.md). Logging keys outside a focused field is still open. Do not add a key log in a later guest.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The keeper's plugin key still sits in `mind.json`. It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- Geolocation remains granted for the process once the page asks. The button is the keeper's ask. A later slice can bind the grant to that click.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
