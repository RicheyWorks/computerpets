# 0022. The overlay Gemini call does not put the plugin key on the query string

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/mind.js`, `web/src/lib/ai/complete.ts`

## Context

[0021](0021-desk-talk-does-not-send-the-key.md) kept the plugin key off the house talk post. The overlay still calls the chosen plugin itself. That call is not a house account and not a proxy in front of the plugin.

The Gemini branch built `generateContent?key=` and put the keeper's plugin key on the query string. A query string is a URL. It shows up in logs, Referer, history, and screenshots. OpenAI-compatible calls and the custom webhook already send `Authorization`. Anthropic already sends `x-api-key`. The house Gemini path already sends `x-goog-api-key`. The Generative Language API accepts that same header on `generateContent`.

## Decision

The overlay Gemini call does not put the plugin key on the URL. It does not start DirectX 12 or Vulkan. It does not change weather. It does not move the license hwid door. It does not change `mind.json`, the desk seal, or the house talk body.

- The overlay posts `generateContent` to the plugin base URL. The key, when present, is the `x-goog-api-key` header. There is no `key` query parameter.
- The house Gemini path uses that same header. It does not put the key on the URL either. That path still spends the house env key for a signed-in keeper. It is not a proxy in front of the overlay.
- OpenAI-compatible calls and the custom webhook keep `Authorization: Bearer`. Anthropic keeps `x-api-key`. Those stay headers.
- The overlay does not send this call to the house, and it does not put the plugin key on a house body or a house query.

## Consequences

- A log, a Referer, or a screenshot of the Gemini URL cannot collect the plugin key from the query string. The key is not in that URL. A pasted base URL that already carries `key` or `api_key` is dropped before the direct call, and a model value cannot add a query. [0023](0023-pasted-key-query-is-dropped.md).
- The call remains a direct plugin request. There is no ComputerPets account in front of it.
- Desk talk still does not post the key. [0021](0021-desk-talk-does-not-send-the-key.md). The desk `/mind` key stays out of browser storage. [0020](0020-desk-mind-key-is-not-in-the-browser.md). The overlay key stays out of plain `mind.json`. [0018](0018-mind-key-is-not-plain-text.md).
- License `hwid` still reads a named machine id only when a bind needs it, and only when `hwid.txt` is empty. A stored hash is reused. The raw id is not sent. The hash is still a fingerprint. [0019](0019-license-mark-is-a-local-hash.md).
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator still reads a window class inside its own process to set the shell bit. That string does not leave the process.
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant.
- DirectX 12 / Vulkan is still open. This slice is not that engine.
