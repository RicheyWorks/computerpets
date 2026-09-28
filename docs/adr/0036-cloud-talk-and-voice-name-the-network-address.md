# 0036. Cloud talk and cloud voice say this computer's internet address goes to that website

- **Status:** Accepted (the request itself waits in [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md))
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/mind.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `web/src/lib/pets/talk-net.ts`, `web/src/lib/pets/talk.ts`, `web/src/components/desk/companion-room.tsx`, `web/src/routes/mind.tsx`, `client/computerpets_client/presence.py`

## Context

[0035](0035-station-stream-names-the-network-address.md) names this computer's network address on a station stream when Play is pressed. That sentence is `clientNetLine`. Talk and cloud voice did not use it.

The overlay calls a mind plugin directly from `PetMind.run` when the keeper presses Talk. That request goes to `api.x.ai`, `api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`, another preset host, or a custom base. A house line, and Ollama or LM Studio or a custom webhook on this computer (`127.0.0.1`, `localhost`, `::1`), do not leave. Idle talk is an animation and a house line. It does not call `run`. On-device `speechSynthesis` does not leave. The overlay has no cloud voice call.

The desk and `/demo` share Talk. The post goes to this house. A guest is rewritten to house lines before any plugin fetch, so that post does not call a cloud host. A signed-in keeper's mind is fetched from the house, and cloud voice (`api.x.ai` TTS, `api.openai.com` speech) is fetched from the house, only after the same line is in the post. The `/mind` test is the same talk post with voice left off. `GET /api/public/heartbeat` is this house. It is not a cloud plugin. The listener read posts to this house and does not call a plugin. The blotter does not call either host.

## Decision

This slice shows the same network-address sentence, with the host named, before a cloud talk or a cloud voice request leaves. It does not talk or speak to those hosts on load. It does not add a tracker. It does not start DirectX 12 or Vulkan. It does not move the news, quote, forecast, geocode, or station-stream gates. It does not chase a URL fragment or a hostname secret. It does not put a house account in front of the overlay's direct plugin call. Catalog stays 221.

- `clientNetLine` names the talk hostname when the plugin base has one. Otherwise the name is "the talk host". The line is `this talk sends the keeper line.` plus that sentence. The path, the query, and the fragment stay off the line.
- Cloud voice uses the same sentence. xAI is `api.x.ai`. OpenAI speech is `api.openai.com`. Otherwise the name is "the voice host". The line is `this voice sends the spoken line.` plus that sentence. Browser speech and silence do not use it.
- `talkMaySend` is true for a remote mind only when that line is in view. The overlay paints the line, then calls the gate, then `fetch`. The desk and `/mind` paint the line, then post it. The house fetches only when the posted line is that sentence. A guest's post does not match a cloud spend, so the house stays on house lines.
- `voiceMaySend` is the same gate for cloud voice. The house does not call the voice host until that line is in the post. A load does not.
- A loopback mind stays a local fetch with no outbound line. House lines and `speechSynthesis` stay on this computer.

## Consequences

- The talk host and the voice host see this computer's network address, as any client. The house does not ask them to turn that address into a city. The shared sentence still says "https request". The request leaves only inside `readTalk` or `readVoice`. A missing line does not call the host and does not say "can't reach". [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- A station stream still waits for its own line. [0035](0035-station-stream-names-the-network-address.md). News, quotes, a later forecast, and a geocode look-up keep their gates.
- Desk talk still does not post the plugin key. The overlay still calls the plugin directly.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Unlock and a bound download name their host before the license hash leaves. [0037](0037-license-hash-names-the-network-address.md).
- Later wording (2026-09): cloud talk and voice now name the AI website in plain words (xAI, OpenAI, Anthropic, Google Gemini, and the other known hosts; a custom host is "the AI website you set up"), e.g. "This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website, so your pet can answer." The voice line says "This sends the words your pet will say to …, so it can turn them into a voice." Both end with `plainNetLine` ("This computer's internet address also goes to xAI, like visiting any website."). The gates still wait for that exact line. See ROADMAP (remaining consent lines in plain words).
