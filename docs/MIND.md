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

Assign a house default or override per animal on `/mind`. Keys stay in the browser. Server env vars (`XAI_API_KEY`, `OPENAI_API_KEY`, …) fill in if the field is empty.

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

## Desktop

Tray → **Minds**. Same roster of plugins. The overlay calls the chosen mind directly (CSP allows `https:` and localhost).
