# Mind plugins

The pet engine talks through a **plugin bus**. House lines are always the fallback. Any other mind is a plugin.

## Built in

| Plugin | Shape |
|---|---|
| House lines | local roster |
| xAI Grok | OpenAI-compatible |
| OpenAI | OpenAI |
| Anthropic | Messages API |
| Google Gemini | generateContent |
| Groq | OpenAI-compatible |
| OpenRouter | OpenAI-compatible |
| Together | OpenAI-compatible |
| Fireworks | OpenAI-compatible |
| DeepSeek | OpenAI-compatible |
| Mistral | OpenAI-compatible |
| Ollama | `/api/chat` |
| LM Studio | OpenAI-compatible local |
| Custom webhook | your URL |

Voice plugins: browser `speechSynthesis`, xAI TTS, OpenAI TTS, silent.

Assign a house default or override per animal on `/mind`. The plugin key is not stored in this browser. When the desk bridge can seal it, the key goes to the OS secret store. Otherwise it stays on the page until you leave, and the page says so. Server env vars (`XAI_API_KEY`, `OPENAI_API_KEY`, …) fill in if the field is empty.

## Custom webhook

```
POST {baseUrl}
Content-Type: application/json
Authorization: Bearer {apiKey}   # optional

{
  "name": "Rui",
  "species": "red_panda",
  "system": "You are Rui...",
  "user": "Your name is Rui. ... The keeper says: hello",
  "stats": { "hunger": 70, "mood": 72, "energy": 68, "hygiene": 80 },
  "message": "hello"
}
```

Reply with `{ "text": "..." }` (also accepts `{ "content": "..." }` or OpenAI message shape). Keep it under ~2 sentences.

## Who is listening

The keeper card names the plugin that will actually be asked.

| Door | Line |
|---|---|
| Overlay | `Listening · House lines` unless the keeper saved a key for a cloud plugin, or chose Ollama, LM Studio, or a custom webhook with a safe URL. The key is sealed in the OS secret store when that store exists, and is not written in plain text in `mind.json`. It is not on the card. If this computer has no secret store, the key is not written to disk. |
| Desk, `/demo`, Live, Meet | Guests are House lines, even when `/mind` still shows a cloud default. A signed-in keeper sees a cloud name only when that house env key exists. The card says `Listening · unread` until the read returns. The browser does not send the key. |
| Blotter | House lines. There is no plugin bus on the blotter. |

An unknown plugin, a missing key, or an unsafe URL stays House lines. The line never includes a key, a URL, or a model.

## Desktop

Tray → **Minds**. Same roster of plugins. The overlay calls the chosen mind directly (CSP allows `https:` and localhost). The plugin key is sealed with Electron `safeStorage` when the OS secret store is available. `mind.json` keeps the prefs and the seal, not the plain key.
