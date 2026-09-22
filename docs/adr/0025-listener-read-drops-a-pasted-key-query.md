# 0025. The listener read drops a pasted key query before the post

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/ai/listener-post.ts`, `web/src/lib/ai/listener-read.ts`, `web/src/lib/ai/settings.ts`, `web/src/components/desk/keeper-card.tsx`

## Context

[0024](0024-desk-talk-drops-a-pasted-key-query.md) drops a pasted `key`, `api_key`, and the same kind of secret query before desk talk posts the base URL. The listener read did not.

The keeper card posts `baseUrl` on `readMindListener` as it was saved. A house log of that body could collect `?key=` or `?api_key=` even though talk and the plugin fetch already drop that query. The saved base URL was the leftover that still fed the post.

The overlay stays a direct plugin call. This slice does not put a house account in front of it.

## Decision

Before the listener read posts the base URL, that same secret query is dropped. Desk mind prefs drop it on save and on read, so that browser store stops feeding a dirty URL. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not rewrite the mind seal. It does not change the overlay Gemini header. It does not change the talk body beyond the shared scrub helper.

- The keeper card builds the listener body with the plugin id and the base URL. Query names `key`, `api_key`, `api-key`, `apikey`, `access_token`, `refresh_token`, `id_token`, `token`, `secret`, `client_secret`, `x-goog-api-key`, `x-api-key`, `auth`, `authorization`, and `bearer` are removed first. Hyphens and underscores match. A hash that is only that kind of query is dropped too. A leftover query that is not a secret stays.
- The name list lives in `secret-query.mjs`. The house plugin fetch, desk talk, and the listener read all call it. The overlay keeps the same names.
- If a body still arrives with that query, the house drops it before it keeps the parsed listener body. `apiKey` is still rejected. It is not a field.
- Desk `/mind` prefs (`computerpets.mind.v1`) drop that query when they are saved and when they are read. A leftover dirty URL in that store is rewritten without the query. A desk save does not hand the query to the seal.
- This slice did not rewrite `mind.json`. [0026](0026-mind-json-drops-a-pasted-key-query.md) drops that query when the overlay saves or reads the base URL. The seal is not rewritten for that cleanup.
- The overlay does not send this call to the house. Gemini still sends the plugin key as `x-goog-api-key` when a key is present. There is no house account in front of that call.
- Catalog stays 221.

## Consequences

- A house log of the listener read cannot collect a pasted `key` or `api_key` query from the base URL the keeper card posts. The body is the plugin id and the scrubbed base URL.
- Desk mind prefs no longer keep that query, and a later read of a leftover copy drops it before the card posts.
- The overlay call remains a direct plugin request. There is no ComputerPets account in front of it.
- `mind.json` and the overlay browser copy no longer keep that query. [0026](0026-mind-json-drops-a-pasted-key-query.md) drops it on save and on read, and rewrites a leftover dirty base URL without a seal rewrite. The plugin fetch still drops the query before the direct call. [0023](0023-pasted-key-query-is-dropped.md).
- Userinfo, a token-shaped path segment, and a `key=` assignment in a non-URL are dropped by the same scrub. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). A model string is not this scrub. Desk talk still drops the query before its own post. [0024](0024-desk-talk-drops-a-pasted-key-query.md).
- Desk talk still does not post the plugin key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). The overlay key stays out of plain `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key.
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
