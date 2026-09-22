# 0021. Desk talk does not send the plugin key to the house

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/pets/talk-post.ts`, `web/src/lib/pets/talk.ts`, `web/src/components/desk/companion-room.tsx`, `web/src/routes/mind.tsx`

## Context

[0020](0020-desk-mind-key-is-not-in-the-browser.md) kept the desk `/mind` key out of browser storage. The talk post was the leftover. Desk talk, including `/demo`, Live, Meet, and the `/mind` test, handed the whole mind binding to the house. That object included `apiKey`. The house already ignored it: spend uses the server env key for a signed-in keeper, and house lines for everyone else. The field still rode on the request.

The listener read already refuses that field. Talk did not match it. There is no ComputerPets account to put the key in. This slice does not add one.

The overlay still calls the chosen plugin itself. That call is not a post to the house.

## Decision

House talk does not carry the plugin key. It does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change `mind.json` or the desk seal.

- The desk, `/demo`, Live, Meet, and the `/mind` test build the talk body with plugin, model, and base URL. `apiKey` is not copied onto that body.
- The post is JSON. There is no query string, and the key is not placed on one.
- If a client still sends `apiKey` on the body or inside `mind`, the house drops it before spend. It does not unlock `XAI_API_KEY`, `OPENAI_API_KEY`, or any other house env key.
- A signed-in keeper may still spend the house env key for the plugin they asked for. That secret stays on the server. It is not a field the browser posts.
- The overlay talk path does not call this house post. It does not put `apiKey` on a house body or a house query.

## Consequences

- A proxy or a house log of this post cannot collect the keeper's plugin key from the talk body. The key is not in that JSON.
- Guests stay on house lines. A signed-in cloud reply still depends on the server env key, not on a key the browser sent.
- The overlay still sends its sealed key to the plugin it calls, as a header. Gemini uses `x-goog-api-key` and does not put that key on the query string. [0022](0022-gemini-key-stays-off-the-query.md). A pasted `key` query is dropped before that direct call. [0023](0023-pasted-key-query-is-dropped.md). Desk talk drops that same query from the base URL before the post. [0024](0024-desk-talk-drops-a-pasted-key-query.md). The listener read drops that same query from the saved base URL before it posts. Desk mind prefs drop it on save and on read. [0025](0025-listener-read-drops-a-pasted-key-query.md). `mind.json` and the overlay browser copy of mind prefs drop that same query on save and on read. A leftover dirty base URL in `mind.json` is rewritten without a seal rewrite. [0026](0026-mind-json-drops-a-pasted-key-query.md). The same scrub drops userinfo, a path key, and a non-URL `key=` assignment. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). That overlay request is the plugin, not the house.
- The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). The overlay key stays out of plain `mind.json`. [0018](0018-mind-key-is-not-plain-text.md).
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
