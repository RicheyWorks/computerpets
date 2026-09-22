# 0011. Desk presence does not list user folders or read window titles

- **Status:** Accepted (the in-process `GetClassName` clause is superseded by [0029](0029-enumerator-does-not-read-a-window-class.md))
- **Date:** 2026-09-22
- **Code:** `desktop/windows-enum.cjs`, `desktop/renderer/windows.js`, `desktop/presence.cjs`, `web/src/lib/pets/windows.ts`, `web/src/lib/pets/presence.ts`, `client/computerpets_client/presence.py`

## Context

[0010](0010-presence-does-not-open-files.md) refused a dropped keeper file and sent window rows as rects. Two leftovers stayed open: listing Desktop or Documents, and reading window titles or document names.

The window enumerator called `GetClassName` and wrote that string onto the pipe. Node kept it on the raw row until `takeRects` used it to skip the taskbar and the desktop host. The glass already dropped it. The string was still a window identity in the main process. Explorer's class is not the folder name, and `GetWindowText` was not called, but a title or a path appended on that same line would have been stored as the class.

Nothing in the overlay, the desk, or the blotter listed a user folder. The contract did not say no.

## Decision

This slice closes those two leftovers. It does not log keys. It does not start DirectX 12 or Vulkan.

- The class string is not written on the pipe. `GetWindowText` is not called. No folder API is called. The in-process class read closed in [0029](0029-enumerator-does-not-read-a-window-class.md): shell windows are known handles.
- `parseEnumText` keeps `id` and the rect flags plus `shell`. A legacy class token can still set the shell bit. It is not stored. Extra columns (a title, a document name, a path) are ignored.
- `takeRects` and the glass payload stay `{ id, x, y, width, height }`. A caption that is not null, or a path label that is not empty, drops the row.
- `listHostFolder` returns `{ listed: false, names: [] }` for Desktop, Documents, Downloads, and any other name. It does not touch the disk. The desk, `/demo`, and the blotter share that function.
- `windowCaption` returns null. `hostPathLabel` returns empty unless `consent` is already true. No consent control exists, so a path is omitted. House files stay `card.json` and `mind.json` under overlay userData.

## Consequences

- Logging keys outside a focused field closed in [0012](0012-presence-does-not-log-keys.md). Do not add a key log in a later guest.
- License `hwid` still reads machine-id or MachineGuid. That is the license door, not presence.
- The overlay plugin key is not plain text in `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). It stays off the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- A keeper window's class is not copied. [0029](0029-enumerator-does-not-read-a-window-class.md). It is not a title, not a document name, and not a folder list.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
