# 0020. The desk /mind key is not stored in the browser

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/ai/settings.ts`, `web/src/routes/mind.tsx`, `web/src/lib/ai/use-mind.ts`, `desktop/renderer/mind.js`

## Context

[0018](0018-mind-key-is-not-plain-text.md) sealed the overlay plugin key. `mind.json` no longer keeps that key in plain text when the OS secret store can seal it. The overlay `localStorage` copy is scrubbed while the desk bridge is up.

The desk `/mind` page was the other copy. It wrote the same `computerpets.mind.v1` object, including `apiKey`, into the browser. That store is not `hwid.txt` and not `mind.json`. A backup of the profile, another script on the origin, or a glance at storage could read the keeper's plugin key.

There is no ComputerPets account to put the key in. This slice does not add one.

## Decision

The desk `/mind` page does not persist the plugin key in `localStorage` or `sessionStorage`. It does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door.

- Plugin, model, base URL, voice, and per-animal prefs may stay in `localStorage` under `computerpets.mind.v1`. `apiKey` is not one of those fields. `sessionStorage` does not keep this object.
- On load, a leftover plain key is removed from both stores.
- When `window.desk.mindGet` and `window.desk.mindSet` are present, the key is handed to the main-process seal from [0018](0018-mind-key-is-not-plain-text.md). The browser copy stays prefs only. A leftover browser key is sealed on that read when the seal does not already hold one.
- When the bridge is missing, or the secret store cannot seal the key, the key is not written. It stays in page memory so a key the keeper just typed still works until they leave. The page says this browser has no secret store. The next load does not have the key.
- When a seal is present and the store does not open, the page says so. It does not invent a key, and saving an empty field does not throw the seal away.
- Clearing the key and saving removes it from page memory and asks the seal to drop it.
- The overlay page, with no desk bridge, also stops writing the plain key into `computerpets.mind.v1`. The same key is held for that page only.
- The blotter has no plugin bus.

## Consequences

- A key that used to sit in the browser is not there after the next load. If this visit had no secret store, that key works until the keeper leaves and is then gone.
- The overlay process still holds a sealed key in memory while it calls the plugin. That is not a copy in the browser and not a line on the card.
- Desk talk does not place `apiKey` on the house request. [0021](0021-desk-talk-does-not-send-the-key.md). The overlay Gemini call does not put that key on the query string. [0022](0022-gemini-key-stays-off-the-query.md). A pasted `key` query is dropped before the direct call. [0023](0023-pasted-key-query-is-dropped.md). Desk talk drops that same query from the base URL before the post. [0024](0024-desk-talk-drops-a-pasted-key-query.md). The listener read drops that same query from the saved base URL before it posts. Desk mind prefs drop it on save and on read. [0025](0025-listener-read-drops-a-pasted-key-query.md).
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator still reads a window class inside its own process to set the shell bit. That string does not leave the process.
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
