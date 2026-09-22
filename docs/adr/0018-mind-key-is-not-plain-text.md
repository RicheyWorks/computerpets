# 0018. The overlay plugin key is not plain text in mind.json

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/mind-secret.cjs`, `desktop/main.cjs`, `desktop/preload.cjs`, `desktop/renderer/mind.js`, `desktop/renderer/settings.html`

## Context

[0009](0009-mind-listener-name.md) kept the keeper's plugin key off the card. The overlay still wrote that key, in plain text, into `mind.json` under the app user-data directory, and the renderer copied the same object into `localStorage`.

The key is the keeper's own credential for a cloud plugin. It is not a house secret and not a license. The mind bus still needs it in memory so the overlay can call the plugin. It does not need to sit on disk where a backup, a copied profile, or a glance at the file can read it.

Electron 35 can seal a string with `safeStorage` when the operating system has a secret store. There is no ComputerPets account to put the key in, and this slice does not add one.

## Decision

This slice takes the plugin key out of plain text in `mind.json`. It does not start DirectX 12 or Vulkan. It does not move the license hwid door. It does not change weather.

- `writeMind` stores plugin, model, base URL, voice, and per-animal prefs in `mind.json`. A non-empty `apiKey` is not one of those fields.
- When `safeStorage.isEncryptionAvailable()` is true, the keys are sealed and the ciphertext is the `sealedKeys` field in the same file. The plain key is not in that ciphertext. The house file list stays `card.json` and `mind.json`.
- `readMind` opens the seal and returns the key to the overlay process so the plugin call still works. The card still receives only `hasKey`.
- A file that already has a plain `apiKey` is rewritten on the next read. The key stays in memory for that process. The file does not keep the plain field.
- When the secret store is missing, or the codec would echo the key, the key is not written. The Minds window says so. A key the keeper just typed still works until quit.
- When a seal is present and the store does not open, the seal stays. The form does not invent a key, and saving an empty field does not throw the seal away.
- Clearing the key and saving removes the seal.
- With the desk bridge up, the overlay `localStorage` copy is prefs only. The plain key is scrubbed from that copy on load.
- The desk `/mind` page is unchanged. Its key stays in the browser. The blotter has no plugin bus.

## Consequences

- License `hwid` still reads machine-id or MachineGuid. That read is hashed locally and the raw id is not a new telemetry field. Existing `hwid.txt` values are left alone. That door is not this one.
- The desk `/mind` key still stays in the browser. That store is not `mind.json`.
- If this computer has no secret store, a key that used to be in `mind.json` is removed from the file and is not there after quit.
- The overlay process still holds the key in memory while it is calling the plugin. That is not a copy on disk and not a line on the card.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator still reads a window class inside its own process to set the shell bit. That string does not leave the process.
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
