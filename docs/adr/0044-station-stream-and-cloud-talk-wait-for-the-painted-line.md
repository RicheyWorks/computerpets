# 0044. A station stream and cloud talk wait for the painted line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/house-music.js`, `desktop/renderer/mind.js`, `desktop/renderer/pet.js`, `web/src/lib/pets/house-music.ts`, `web/src/lib/pets/talk-net.ts`, `web/src/lib/pets/talk.ts`, `web/src/components/desk/keeper-card.tsx`

## Context

[0035](0035-station-stream-names-the-network-address.md) paints the stream sentence before Play constructs an audio element. [0036](0036-cloud-talk-and-voice-name-the-network-address.md) paints the talk sentence and the voice sentence before a cloud request leaves. The stream host is the station URL's hostname. The talk host is the plugin base. Cloud voice is `api.x.ai` or `api.openai.com`.

Those opens already waited on the caller. `streamMaySend` is true only when that line is in view. `talkMaySend` and `voiceMaySend` are true for a remote host only when that line is in view. The audio element and the request were still built after that boolean. A caller that passed true, or that skipped the plate, could still assign a stream source or reach the talk host or the voice host. The desk and `/demo` share the keeper card and the talk post. The overlay opens the stream and calls the talk host from the renderer. The overlay has no cloud voice call. The blotter does not call them.

[0041](0041-featured-page-waits-for-the-wikipedia-line.md) and [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md) put other sends behind refusing wrappers. A station stream and cloud talk were the leftover.

## Decision

A station stream does not open, and a cloud talk or cloud voice request does not leave, unless the painted line for that host is present on the string the caller painted. They do not move onto a main handler. They do not rework the news, quote, or Radio IPC gates. They do not rewrite the forecast or geocode wrappers. They do not start DirectX 12 or Vulkan. They do not scrub a signed CDN query. They do not rewrite the unlock or download sentences. Catalog stays 221.

- The stream line is `this play opens the station stream.` plus `clientNetLine` for that stream host. The radio-find sentence and another host's line do not count. The path, the query, and the fragment stay off the line.
- `openStationStream` is the only station-stream open. `streamMayLeave` is false when that sentence is missing. A miss returns null and does not construct `Audio` or assign `src`. The plate does not say "can't reach" for that hold. A house loop stays `new Audio` of a file on this computer.
- The talk line is `this talk sends the keeper line.` plus `clientNetLine` for that talk host. The voice line is `this voice sends the spoken line.` plus `clientNetLine` for that voice host. One sentence does not unlock the other.
- `readTalk` is the only cloud-talk request. `talkMayLeave` is false for a remote mind when that sentence is missing. A miss resolves to the house line and does not call the request. A loopback mind still calls the request. That fetch stays on this computer.
- `readVoice` is the only cloud-voice request. `voiceMayLeave` is false for `xai` or `openai` when that sentence is missing. A miss resolves to undefined and does not call the request. Browser speech and silence do not call it. `speechSynthesis` stays on this computer.
- The overlay paints the line, then `streamMaySend` or `talkMaySend`, then the wrapper. The desk and `/demo` share those wrappers. A guest stays on house lines. The blotter still does not call a stream host, a talk host, or a voice host.

## Consequences

- The stream host sees this computer's network address only after that stream sentence was painted, as any client. The talk host and the voice host see it only after their own sentence was painted. The house does not ask them to turn the address into a city.
- Play and Talk copy stay. A saved playing flag still does not open the stream on load. A load still does not talk. [0035](0035-station-stream-names-the-network-address.md). [0036](0036-cloud-talk-and-voice-name-the-network-address.md).
- News RSS, quotes, and Radio Find still wait in main. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). The featured page, the other desk plate fetches, and a forecast or geocode look-up stay on their wrappers. [0041](0041-featured-page-waits-for-the-wikipedia-line.md). [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md).
- The unlock hash POST, a bound hash POST, the unbound download POST, and the signed bundle GET leave only inside their wrappers. [0045](0045-license-requests-wait-for-the-painted-line.md). [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the cloud talk line is now kid-plain and names the AI website (see 0036). The station stream line is in Rui's music block and keeps its sentence. Both still wait for the painted line.
