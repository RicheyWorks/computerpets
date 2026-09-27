# 0132. The pet keeps a spot per Windows virtual desktop, keyed by the overlay's own desktop id

- **Status:** Accepted (plumbing and store; inert where Windows gives the overlay no desktop id, which is BLACKBEARD today)
- **Date:** 2026-09-26
- **Code:** `desktop/renderer/desk-spots.js`, `desktop/renderer/desk-spots.test.cjs`, `desktop/vdesk-win.cjs`, `desktop/vdesk-win.test.cjs`, `desktop/main.cjs`, `desktop/preload.cjs`, `desktop/renderer/card.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`

## Context

[0131](0131-windows-virtual-desktop-follow.md) brings the Windows overlay to the current virtual desktop. Its next gap was a pet spot per desktop: the overlay is one work-area window, so the pet showed up at the same `x` on every desktop. Remembering a spot per desktop needs the desktop id of the overlay's own window (`GetWindowDesktopId` on that one handle) and a way to move the pet's `x` in the renderer.

There was no saved pet position before this. `card.json` held card prefs, and the pet's `x` lived only in the renderer (`sim.x`). So there is no old field to migrate.

## Decision

**The same helper ask that 0131 makes also reads `GetWindowDesktopId` for the overlay's own HWND. When the overlay is on the current desktop with a different id than last time, main sends `{ from, to }` to the renderer. The renderer keeps the pet's `x` for `from` in `card.json` and puts the pet back at the kept `x` for `to`, if there is one.**

1. **What the probe asks.** The helper still gets one decimal HWND, the overlay's own. It now answers `<on> <cloaked> <desktop id|->`. It calls `GetWindowDesktopId` on that same handle, and only that handle. `GUID_NULL` and a failed call answer `-`. It still never calls `MoveWindowToDesktop`, never walks windows, and reads no title, class, or process.
2. **When it counts as an arrival.** The follower notes the id only when the manager says the overlay is on the current desktop (`on === 1`). The first id after start only records. A different id later calls `onArrive({ from, to })`. Stopping follow (tray checkbox off) forgets the last id, so turning follow back on starts fresh.
3. **Where the spot lives.** `card.json` gets `deskSpots: { "<desktop id>": { x, w, at } }`, parsed in `PetCard.parseCard` like every other card field. An older card without it loads as `{}`. Bad ids (not a GUID, or `GUID_NULL`) and bad rows are dropped.
4. **What the pet does.** On an arrival the renderer writes the pet's current `x` (and the overlay width) under `from`. If `to` has a kept spot, it is scaled to the current width, held inside the floor, and applied on the next frame when the pet is not dragged, leaving, in window play, in a trick, or in a happy dance. A spot that could not be applied within 10 seconds is dropped. If `to` has no spot, the pet stays where it is. That is what it did before.
5. **Pruning.** At most 12 desktop ids are kept, newest first. An id not written for 90 days is dropped, because a removed desktop never comes back.
6. **Who is untouched.** Mac and Linux never start the follower (`Desk.desktopFollow` is `win32` only), so they never get a move. With **Follow me across desktops** off, the follower does not poll and sends nothing. `deskSpots` sits in `card.json` unused.

## Consequences

- **Runtime check on BLACKBEARD (Windows 11 26200, one virtual desktop, 2026-09-26).** Throwaway Electron windows, run from the worktree, answered as follows:
  - A plain window: `GetWindowDesktopId` returned `S_OK` and a real GUID.
  - `skipTaskbar: true` alone: `S_OK` with `GUID_NULL`.
  - `focusable: false` alone: `0x8002802B` (`TYPE_E_ELEMENTNOTFOUND`).
  - A window with the overlay's own flags (frameless, transparent, `skipTaskbar`, `focusable: false`, always-on-top at `screen-saver`): `0x8002802B`.
  - Every one of them answered "on the current desktop" to `IsWindowOnCurrentVirtualDesktop`.
- **So the real overlay gets no desktop id on this build.** The helper answers `-`, no arrival fires, and the pet behaves exactly as before. This slice is the tested store and plumbing. It turns on by itself on any Windows build that gives the overlay window an id.
- The same check raises a question about 0131 that one desktop cannot answer. Windows appears not to track the overlay's window style for virtual desktops. If so, the overlay is probably shown on every desktop already, and the 0131 follower never needs to act. A live two-desktop check (Win+Ctrl+D, then Win+Ctrl+Left/Right) settles it.
- Unit tests cover:
  - the old card loading with an empty map;
  - a card round trip, and bad rows being dropped;
  - saving on leave and restoring on return;
  - the fallback when a desktop has no spot;
  - moves that are not real moves;
  - width scaling and the clamp to the floor;
  - the 12-id cap and the 90-day prune;
  - the probe parsing the id (and treating `GUID_NULL` as no id);
  - the first id only recording;
  - one arrival per switch;
  - follow off sending nothing;
  - main sending the two ids and nothing else;
  - only the Windows follower sending.
- A privacy test still fails if the helper names `EnumWindows`, `GetWindowText`, `GetClassName`, `GetForegroundWindow`, `FindWindow`, or a process lookup. It now asserts `GetWindowDesktopId` is declared once and called once, on `h`.
- **Next gap:** a documented source for the current desktop id that works for a tool-style window, or a live two-desktop check of 0131 first. The undocumented `IVirtualDesktopManagerInternal` interfaces and the `CurrentVirtualDesktop` registry value stay out of bounds, the same as in 0131. The overlay's `skipTaskbar` and `focusable: false` stay, because dropping them would put the pet in the taskbar and Alt-Tab and let it take focus. Catalog stays 221. No Rui sprites. No pet art. Do not start Pane. Do not start DirectX 12, Vulkan, or Solana.