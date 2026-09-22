# 0026. mind.json drops a pasted key query on save and on read

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/mind-secret.cjs`, `desktop/main.cjs`, `desktop/renderer/mind.js`

## Context

[0025](0025-listener-read-drops-a-pasted-key-query.md) drops a pasted `key`, `api_key`, and the same kind of secret query before the listener read posts the base URL. Desk mind prefs (`computerpets.mind.v1`) drop that query on save and on read.

`mind.json` did not. The overlay save wrote the base URL it was given, and a read copied that string back. The overlay browser copy of mind prefs did the same. A pasted `?key=` or `?api_key=` could sit in the file after the post and the plugin fetch had already dropped it.

The seal in that file is the plugin key. This slice does not rewrite how that key is encoded or decoded. There is no house account in front of the overlay plugin call.

## Decision

On overlay save and on overlay load, that same secret query is dropped from the base URL before it is kept. A leftover dirty base URL in `mind.json` is rewritten on read. The seal ciphertext is not replaced for that cleanup. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change the overlay Gemini header.

- Query names `key`, `api_key`, `api-key`, `apikey`, `access_token`, `refresh_token`, `id_token`, `token`, `secret`, `client_secret`, `x-goog-api-key`, `x-api-key`, `auth`, `authorization`, and `bearer` are removed from the default base URL and from each animal base URL. Hyphens and underscores match. A hash that is only that kind of query is dropped too. A leftover query that is not a secret stays. The name list lives in `secret-query.mjs`. The overlay file writer and the overlay page keep the same names.
- `writeMindRecord` stores the scrubbed base URL. The seal payload is still only the keys. A save that carries a pasted query does not change the ciphertext of the same keys.
- `readMindRecord` returns the scrubbed base URL. When the stored string still has that query, `readMind` rewrites the file with the scrubbed prefs and the same `sealedKeys` value. A clean base URL does not rewrite the file. A string that is not a URL is left as typed.
- The overlay browser copy (`computerpets.mind.v1` in the overlay page) drops that query when it is saved and when it is read. With the desk bridge up, the value handed to the seal path is already scrubbed. The plain plugin key stays out of that copy.
- The overlay does not send this cleanup to the house. Gemini still sends the plugin key as `x-goog-api-key` when a key is present.
- Catalog stays 221.

## Consequences

- `mind.json` no longer keeps a pasted `key` or `api_key` query on a base URL. A later read of a leftover dirty URL rewrites the file without a seal rewrite.
- The overlay browser copy no longer keeps that query either.
- The seal codec is unchanged. The plain key stays out of `mind.json`. [0018](0018-mind-key-is-not-plain-text.md).
- Userinfo, a token-shaped path segment, and a `key=` assignment in a non-URL are dropped by the same scrub. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). A model string is not this scrub. The plugin fetch still drops a secret query before the direct call. [0023](0023-pasted-key-query-is-dropped.md). Desk talk and the listener read still drop it before their posts. [0024](0024-desk-talk-drops-a-pasted-key-query.md). [0025](0025-listener-read-drops-a-pasted-key-query.md).
- The overlay call remains a direct plugin request. There is no ComputerPets account in front of it.
- Desk talk still does not post the plugin key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key.
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator still reads a window class inside its own process to set the shell bit. That string does not leave the process.
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
