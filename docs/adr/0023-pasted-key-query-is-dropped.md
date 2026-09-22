# 0023. A pasted plugin URL drops a key query before the direct call

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/mind.js`, `web/src/lib/ai/safe-url.ts`, `web/src/lib/ai/complete.ts`

## Context

[0022](0022-gemini-key-stays-off-the-query.md) stopped the overlay from appending the plugin key as `generateContent?key=`. The key, when present, is the `x-goog-api-key` header. That call is still the plugin. There is no house account in front of it.

A keeper can still paste a base URL that already carries `?key=`, `?api_key=`, or the same kind of secret. `safeUrl` and the house URL check returned that string as-is, so the direct fetch kept the secret on the query. The overlay also interpolated the model into the Gemini path with no charset check. The house already refuses a model that is not letters, digits, and `._:/-`. A model value such as `gemini-2.5-flash?key=` could put a query on the overlay path. The house path could not.

## Decision

Before a direct plugin fetch, a pasted secret query is dropped. The overlay model uses the house charset. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change `mind.json`, the desk seal, or the house talk body.

- The overlay and the house plugin fetch (`complete.ts`, the same URL check the desk spend uses) drop query names `key`, `api_key`, `api-key`, `apikey`, `access_token`, `refresh_token`, `id_token`, `token`, `secret`, `client_secret`, `x-goog-api-key`, `x-api-key`, `auth`, `authorization`, and `bearer`. Hyphens and underscores match. A hash that is only that kind of query is dropped too.
- A leftover query that is not a secret stays a query. The path is joined after the scrub, so `?alt=sse` is not glued into the path.
- The overlay model uses the house rule: at most 80 characters, no `..`, no backslash, only `a-z`, `A-Z`, `0-9`, and `._:/-`. Anything else uses the preset model. A model cannot add `?` or `&` to the Gemini path.
- Gemini still sends the plugin key as `x-goog-api-key` when a key is present. OpenAI-compatible calls and the custom webhook keep `Authorization`. Anthropic keeps `x-api-key`. Those stay headers.
- The overlay does not send this call to the house.

## Consequences

- A log, a Referer, or a screenshot of the plugin request URL cannot collect a pasted `key` or `api_key` query. The plugin key is not on that URL.
- The call remains a direct plugin request. There is no ComputerPets account in front of the overlay.
- Desk talk drops that same secret query from the base URL before the post. [0024](0024-desk-talk-drops-a-pasted-key-query.md). The listener read drops it before posting the saved base URL. Desk mind prefs drop it on save and on read. [0025](0025-listener-read-drops-a-pasted-key-query.md). The plugin fetch still drops it too. `mind.json` and the overlay browser copy of mind prefs drop that same query on save and on read. A leftover dirty base URL in `mind.json` is rewritten without a seal rewrite. [0026](0026-mind-json-drops-a-pasted-key-query.md). The same scrub also drops userinfo, a token-shaped path segment, and a `key=` assignment in a non-URL. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). A model string that passes the charset can still be a path segment. A dotted model id stays.
- The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). The overlay key stays out of plain `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key.
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
