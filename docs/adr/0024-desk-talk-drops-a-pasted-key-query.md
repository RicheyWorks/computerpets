# 0024. Desk talk drops a pasted key query before the post

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/ai/secret-query.mjs`, `web/src/lib/pets/talk-post.ts`, `web/src/lib/ai/safe-url.ts`

## Context

[0023](0023-pasted-key-query-is-dropped.md) drops a pasted `key`, `api_key`, and the same kind of secret query before the direct plugin fetch. The overlay and the house plugin fetch use that drop. Desk talk did not.

`talkBody` copied the base URL the keeper typed. Live, Meet, `/demo`, and the `/mind` test post that body. A house log of the post could collect `?key=` or `?api_key=` even though the plugin fetch that followed had already dropped it.

The overlay stays a direct plugin call. This slice does not put a house account in front of it.

## Decision

Before desk talk posts the base URL, that same secret query is dropped. The rest of the talk body stays. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not rewrite `mind.json` or the desk seal. It does not change the overlay Gemini header.

- Desk talk, `/demo`, Live, Meet (the companion room), and the `/mind` test build the body with plugin, model, and base URL. Query names `key`, `api_key`, `api-key`, `apikey`, `access_token`, `refresh_token`, `id_token`, `token`, `secret`, `client_secret`, `x-goog-api-key`, `x-api-key`, `auth`, `authorization`, and `bearer` are removed first. Hyphens and underscores match. A hash that is only that kind of query is dropped too. A leftover query that is not a secret stays.
- The name list lives in `secret-query.mjs`. The house plugin fetch and desk talk both call it. The overlay keeps the same names.
- If a body still arrives with that query, the house drops it before it keeps the parsed talk body. `apiKey` is still not a field, and it still does not unlock a house env key.
- The overlay does not send this call to the house. Gemini still sends the plugin key as `x-goog-api-key` when a key is present. There is no house account in front of that call.
- A saved base URL is not rewritten on this slice.

## Consequences

- A house log of the desk talk post cannot collect a pasted `key` or `api_key` query from the base URL. The rest of that JSON is the same post.
- The overlay call remains a direct plugin request. There is no ComputerPets account in front of it.
- This slice does not rewrite a saved base URL. The listener read of that URL, and desk mind prefs, are [0025](0025-listener-read-drops-a-pasted-key-query.md). `mind.json` and the overlay browser copy drop that query on save and on read. [0026](0026-mind-json-drops-a-pasted-key-query.md). The same scrub drops userinfo, a path key, and a non-URL `key=` assignment. [0027](0027-base-url-drops-userinfo-and-a-path-key.md).
- Userinfo, a token-shaped path segment, and a `key=` assignment in a non-URL are dropped by the same scrub before the post. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). A model string is not this scrub. [0023](0023-pasted-key-query-is-dropped.md) still drops a secret query on the plugin fetch, and a model value still cannot add a query to the Gemini path.
- Desk talk still does not post the plugin key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). The overlay key stays out of plain `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key.
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant. A later locate in the same session still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine.
