# 0012. Desk presence does not log keys outside a focused field

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/presence.cjs`, `desktop/renderer/presence.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/presence.ts`, `web/src/components/desk/companion-room.tsx`, `client/computerpets_client/presence.py`

## Context

[0011](0011-presence-does-not-list-folders.md) stopped folder lists and window titles. One leftover stayed open: logging keys outside a focused field.

The overlay and the living desk (including `/demo`) each listened for `keydown` on the whole window. Both read `event.key` before asking whether the target was a card field. The desk listener did not skip a field at all, so Escape in the call box closed the guest menu. Neither listener stored the character, and neither installed an operating-system hook. The contract did not say no. The blotter had no key handler and no hook.

Typing into a card field is the field. A show/hide of the overlay is the tray click, not a logged chord.

## Decision

This slice closes that leftover. It does not start DirectX 12 or Vulkan. It does not move the license hwid door or the `mind.json` key.

- `classifyKey` returns `{ record: false, field, toggle }`. When the target is `input`, `textarea`, `select`, or content editable, it does not read the character. The field keeps it.
- A key outside a field is not appended to a buffer and is not returned. `recordKeystroke` always answers `{ record: false, keys: [] }` and does not touch the buffer it was given.
- Escape outside a field is the dismiss toggle (`toggle: "dismiss"`). The key text is not in the result. The overlay uses it to close the plant chooser or the guest sheet. The desk, including `/demo`, uses it to close the guest menu. Escape inside a field stays with the field.
- No other key is a presence action. The listeners do not call `preventDefault` for it, and they do not send it.
- `keyboardLock` stays denied with the other capture permissions. Main does not register `globalShortcut`, `before-input-event`, or a Windows keyboard hook. The blotter does not grab the keyboard and does not install a key event filter.
- The tray click shows and hides the overlay. That click is not a keystroke log.

## Consequences

- License `hwid` still reads machine-id or MachineGuid. That is the license door, not this key log.
- The keeper's plugin key still sits in `mind.json`. It stays off the card. That store is not a keystroke log.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator still reads a window class inside its own process to set the shell bit. That string does not leave the process.
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
