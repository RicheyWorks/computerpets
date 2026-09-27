# 0009. The keeper HUD names who is listening, and does not show the key

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/listener.js`, `web/src/lib/ai/listener.ts`, `web/src/lib/ai/listener-read.ts`, `client/computerpets_client/listener.py`

## Context

Architecture §11 says the mind plugin bus may show who is listening. It must not invent a mind, leak a key, or ship a server-side secret. House lines are the fallback (`docs/MIND.md`).

The desk’s saved default can say xAI while a guest’s talk is forced to house lines and the client key is stripped. Painting “xAI Grok” on that card would invent a listener. Painting a key, a webhook URL, or a model string would leak the secret the line is supposed to withhold.

The blotter has no plugin bus. The overlay keeps the keeper’s key in `mind.json` and calls the plugin itself.

## Decision

The keeper card shows one line: `Listening · {name}`.

- **House lines** is the name when nothing can actually be asked. That includes an unknown plugin, a missing key, an unsafe URL, every blotter, and every unsigned desk (demo, Meet, a desk with no session).
- **Overlay** names a cloud plugin only when `hasKey` is strictly true. A key string does not count and is never copied into the line. Ollama, LM Studio, and a custom webhook are named when their URL is safe. The URL stays off the card.
- **Desk** asks the server who will be asked. The browser sends the plugin id and base URL, not the key. A pasted `key` or `api_key` query is dropped from that URL before the post. [0025](0025-listener-read-drops-a-pasted-key-query.md). The validator rejects `apiKey`. A signed-in cloud name requires the house env key for that plugin, as a boolean. The secret stays on the server. Until that read returns, the line is `Listening · unread`.
- A forged payload with an extra field, or a line that is not the preset’s own name, stays unread.

## Consequences

- `/mind` can still show a cloud assignment the guest card will not claim. The card is who answers. The settings page is what the keeper asked for.
- Desk talk posts plugin, model, and base URL. It does not post the key. [0021](0021-desk-talk-does-not-send-the-key.md). A pasted `key` query is stripped from that URL before the post. [0024](0024-desk-talk-drops-a-pasted-key-query.md). The listener read drops that same query before it posts the saved base URL. Desk mind prefs drop it on save and on read. [0025](0025-listener-read-drops-a-pasted-key-query.md). `mind.json` and the overlay browser copy of mind prefs drop that same query on save and on read. A leftover dirty base URL in `mind.json` is rewritten without a seal rewrite. [0026](0026-mind-json-drops-a-pasted-key-query.md). The same scrub drops userinfo, a path key, and a non-URL `key=` assignment. [0027](0027-base-url-drops-userinfo-and-a-path-key.md). The overlay Gemini call does not put the plugin key on the query string. [0022](0022-gemini-key-stays-off-the-query.md). A pasted `key` query is dropped before the direct call. [0023](0023-pasted-key-query-is-dropped.md).
- A failed cloud call still falls back to house lines for that sentence. The card names the plugin that can be asked, not a painted success.
- DirectX 12 / Vulkan is still open. Desktop presence (no silent file read, no keylogger, no secret capture) is still open. This line is not either of those.
- The overlay no longer leaves the plugin key in plain text in `mind.json`. [0018](0018-mind-key-is-not-plain-text.md). The desk `/mind` key is not stored in the browser. [0020](0020-desk-mind-key-is-not-in-the-browser.md).
- Later wording (2026-09): the unsure line now reads `Listening · not sure` (id stays `unread`). See ROADMAP (kid-plain words).
