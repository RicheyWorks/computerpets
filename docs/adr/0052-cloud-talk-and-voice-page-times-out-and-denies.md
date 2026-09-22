# 0052. Cloud talk and cloud voice page reads time out and deny

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `web/src/lib/pets/talk-net.ts`, `web/src/lib/pets/talk.ts`, `web/src/lib/ai/complete.ts`, `web/src/lib/ai/voice.ts`, `desktop/renderer/mind.js`, `src/main/java/com/enterprisepet/steam/SteamService.java`

## Context

[0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md) keeps cloud talk and cloud voice behind the painted host line. [0051](0051-news-quote-radio-page-times-out-and-denies.md) timed out news, quote, and radio page wrappers. Desk, `/demo`, and overlay `readTalk` / `readVoice` still called the request with no wrapper deadline. A silent talk host never returned the house line. A silent voice host could hang before audio. Overlay cloud talk fetches had no AbortSignal. Steam's RestClient still had no connect or read deadline while Microsoft and NFT already timed out.

## Decision

`readTalk` and `readVoice` give up after twelve seconds on a remote leave. The timer covers the response headers and the body. A timeout rejects with `TalkTimeout` or `VoiceTimeout`. The caller does not get a body. A late body after the deadline is not parsed. Desk and `/demo` share those wrappers. Overlay `readTalk` matches. They do not invent a reply or audio. They do not phone a new host as the timeout fallback. They do not start DirectX 12 or Vulkan. Catalog stays 221.

- A missing painted line still resolves to the house line or undefined and does not call the request. That hold still does not say "can't reach".
- A loopback mind still calls the request with no remote deadline. `speechSynthesis` and browser speech stay on this computer and do not call `readVoice`.
- A hang rejects. Desk and overlay catch and keep the house line or silence. They do not invent a reply or audio.
- Steam's RestClient now uses a ten-second connect and read deadline, same spirit as Microsoft Collections. A hang denies ownership. Resilience4j still has no time limiter.

## Consequences

- Cloud talk and cloud voice no longer wait forever on a silent host. The house line and silence mean the host did not answer. They do not mean the mind had nothing to say.
- News, quote, radio, and weather page wrappers already time out. [0050](0050-weather-page-times-out-and-denies.md). [0051](0051-news-quote-radio-page-times-out-and-denies.md). Overlay plate IPC already times out. [0049](0049-plate-ipc-times-out-and-denies.md).
- Resilience4j still has no time limiter. Itch and Epic RestClient deadlines stay for a follow-on if they still hang open.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
