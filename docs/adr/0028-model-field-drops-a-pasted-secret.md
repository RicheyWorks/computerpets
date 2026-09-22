# 0028. A model field drops a pasted secret

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/ai/secret-query.mjs`, `web/src/lib/ai/safe-url.ts`, `web/src/lib/ai/settings.ts`, `web/src/lib/pets/talk-post.ts`, `desktop/mind-secret.cjs`, `desktop/renderer/mind.js`

## Context

[0027](0027-base-url-drops-userinfo-and-a-path-key.md) drops userinfo, a token-shaped path segment, and a non-URL `key=` assignment from a base URL before that URL is stored or posted. It left the model field alone. A fetch already refused a model that was not the house charset, so a model could not add `?` to the Gemini path. A value that still fit that charset was stored and sent.

A pasted key often fits the charset. `sk-…` is letters, digits, and hyphens. So is a long token. `key=` and `api_key=` do not fit the charset, but they were still written into desk prefs, `mind.json`, and the overlay browser copy. Desk talk posted the model as typed.

The listener read has no model field. This slice does not add one. The seal codec is the plugin key. This slice does not rewrite how that key is encoded or decoded. There is no house account in front of the overlay plugin call. Path guessing is not widened. That would start to eat real model ids.

## Decision

The model field uses the same secret-name list and the same pasted-key check as `secret-query.mjs`. The overlay file writer and the overlay page keep that helper. A normal model id is not a secret. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change the overlay Gemini header.

- A model value is a pasted secret when it is a known key shape (`sk-…`, `AIza…`, and the same kind), a JWT-shaped string, a long opaque token, a `key=` / `api_key=` assignment (and the same secret-name family), or query-like junk (`?`, `&`, `#`, or those characters percent-encoded).
- `gemini-2.5-flash`, `gpt-4o`, `claude-sonnet-4-5`, a dotted id, a lowercase hyphen-word, and a slash model path such as `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo` stay. A short word stays. A UUID stays.
- Before store, the secret is not written. The field is empty, and the fetch uses the preset model the way the charset fallback already does. Desk mind prefs, `mind.json`, and the overlay browser copy do this on save and on read. A leftover secret model in `mind.json` is rewritten. The seal ciphertext is not replaced for that cleanup.
- Desk talk drops the secret model before the post, on the client and when the house parses the body. A normal model id is still posted.
- The direct plugin fetch refuses the secret model and uses the preset, on the overlay and on the house. A private host is still refused. Gemini still sends the plugin key as `x-goog-api-key` when a key is present.
- The listener read still posts only a plugin id and a base URL. It has no model to drop.
- Catalog stays 221.

## Consequences

- A saved or posted model no longer keeps `sk-…`, `key=`, `api_key=`, query-like junk, or a long token. A normal model id is unchanged.
- The empty field is the stored mark that the secret was dropped. The next fetch uses the plugin preset. That preset is not written back over the empty field.
- The seal codec is unchanged. The plain key stays out of `mind.json`. [0018](0018-mind-key-is-not-plain-text.md).
- A raw token in a URL fragment that is not a secret query (`#sk-…`) can still ride on a base URL. A secret in the hostname can still ride. Those are the next leftovers. More path guessing would start to eat real model ids. A mixed-case hyphen-only string of 32 characters or more, with a letter and a digit and no dot, is the shared token shape. The published model ids in the house list are not that shape.
- The overlay call remains a direct plugin request. There is no ComputerPets account in front of it.
- Desk talk still does not post the plugin key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). [0022](0022-gemini-key-stays-off-the-query.md) still holds: the overlay does not append the key. The query drop still holds. [0023](0023-pasted-key-query-is-dropped.md). [0024](0024-desk-talk-drops-a-pasted-key-query.md). [0025](0025-listener-read-drops-a-pasted-key-query.md). [0026](0026-mind-json-drops-a-pasted-key-query.md). [0027](0027-base-url-drops-userinfo-and-a-path-key.md).
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
