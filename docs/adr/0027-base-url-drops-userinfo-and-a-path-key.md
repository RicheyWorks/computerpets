# 0027. A base URL drops userinfo, a path key, and a non-URL key assignment

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/ai/secret-query.mjs`, `web/src/lib/ai/safe-url.ts`, `desktop/mind-secret.cjs`, `desktop/renderer/mind.js`

## Context

[0026](0026-mind-json-drops-a-pasted-key-query.md) drops a pasted `key`, `api_key`, and the same kind of secret query when a base URL is stored or posted. The seal in `mind.json` is not rewritten for that cleanup.

A secret can still ride in the same string without being a query. `https://key@host/v1` puts it in userinfo. `https://host/v1/key/…` or a long token-shaped segment puts it in the path. A string that is not a URL can still contain `key=` or `api_key=`. Those copies were kept on talk, on the listener read, in desk prefs, in `mind.json`, and on the direct plugin fetch.

The seal codec is the plugin key. This slice does not rewrite how that key is encoded or decoded. There is no house account in front of the overlay plugin call.

## Decision

The same scrub drops those three shapes before the string is stored or posted. The name list stays the one in `secret-query.mjs`. The overlay file writer and the overlay page keep that list and the same helper. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change the overlay Gemini header.

- Userinfo is removed. `https://key@host/v1` and `https://user:pass@host/v1` become `https://host/v1`.
- A path segment that is clearly a pasted key is removed. That is a known key shape (`sk-…`, `AIza…`, and the same kind), a JWT-shaped segment, or a long opaque token. A `/key/…` segment (and the same secret-name family) is removed together with the next segment when that next segment is one of those values, or a mixed-case token. A `key=value` glued into a path segment is stripped, including when it was percent-encoded.
- `/v1/`, `/v1beta/`, `/oauth/token`, `/chat/completions`, a dotted model id such as `gemini-2.5-flash`, a lowercase hyphen-word model id, and a UUID stay.
- A string that is not a URL loses `key=`, `api_key=`, and the same secret-name family. The rest of that string stays. `keyboard=keep` stays. A clean non-URL stays as typed.
- Desk talk, the listener read, desk mind prefs, `mind.json`, and the overlay browser copy call this scrub. A leftover dirty base URL in `mind.json` is rewritten on read. The seal ciphertext is not replaced for that cleanup.
- The direct plugin fetch uses the same drop before the call, on the overlay and on the house. A private host is still refused after the secret is gone. Gemini still sends the plugin key as `x-goog-api-key` when a key is present.
- Catalog stays 221.

## Consequences

- A saved or posted base URL no longer keeps userinfo, a token-shaped path segment, or a `key=` assignment in a non-URL.
- A model path and `/v1/` stay. A short path word after a secret name, such as `/auth/login` or `/oauth/token`, stays. A model id after `/key/`, such as `/key/gemini-2.5-flash`, stays, because that segment is a model path and not a pasted key.
- The seal codec is unchanged. The plain key stays out of `mind.json`. [0018](0018-mind-key-is-not-plain-text.md).
- A secret pasted into the model field is not this scrub. The model is still stored as typed. A fetch still refuses a model that is not the house charset, so a model cannot add `?` to the Gemini path. A raw token in the URL fragment that is not a secret query (`#sk-…`) can still ride. A secret in the hostname can still ride. Those are the next leftovers. More path guessing would start to eat real model ids.
- The overlay call remains a direct plugin request. There is no ComputerPets account in front of it.
- Desk talk still does not post the plugin key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key. The query drop still holds. [0023](0023-pasted-key-query-is-dropped.md). [0024](0024-desk-talk-drops-a-pasted-key-query.md). [0025](0025-listener-read-drops-a-pasted-key-query.md). [0026](0026-mind-json-drops-a-pasted-key-query.md).
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant. A later locate in the same session still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine.
