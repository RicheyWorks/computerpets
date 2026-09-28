# 0035. Pressing Play on a station says this computer's internet address goes to that station

- **Status:** Accepted (the open itself waits in [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md))
- **Date:** 2026-09-22
- **Code:** `desktop/renderer/house-music.js`, `desktop/renderer/pet.js`, `desktop/renderer/index.html`, `web/src/lib/pets/house-music.ts`, `web/src/components/desk/keeper-card.tsx`, `client/computerpets_client/presence.py`

## Context

[0034](0034-news-quotes-and-radio-name-the-network-address.md) names this computer's network address on Radio Find and Local. That sentence is `clientNetLine("the radio host")`. Find waits until the radio form shows it. A load does not search.

Play is a different request. The overlay and the desk open the saved station with an audio element. The source is `stationUrl` (`playSrc` / `overlayPlaySrc`). That URL is the station stream, not the Radio Browser directory. Picking a station, pressing Play, or choosing the radio plugin while a station is already saved sets `playing` and constructs `new Audio(src)`. A saved `playing` flag did the same on load. The house loop is a file on this computer (`sounds/house-loop.wav`). The blotter does not open either one.

## Decision

This slice shows the same network-address sentence, with the stream host named, before that audio element is constructed. It does not open the stream on load. It does not add a tracker. It does not start DirectX 12 or Vulkan. It does not move the Find gate, the news gate, the quote gate, the forecast gate, or the geocode gate. It does not chase a URL fragment or a hostname secret. Catalog stays 221.

- `clientNetLine` names the stream hostname when the station URL has one. Otherwise the name is "the station stream host". The line is `this play opens the station stream.` plus that sentence. The path, the query, and the fragment stay off the line.
- `streamMaySend` is true only when that line is in view and the radio plugin is playing a safe http(s) stream. The page paints the line, then calls the gate, then constructs the audio element.
- Pressing Play, picking a station, or choosing the radio plugin while a station is saved is the commit. A load calls the same sit, and the audio element is not constructed for the stream. A house loop still plays from this computer. A pause stops the element.
- The desk and `/demo` share the keeper card. The blotter still does not open a station stream.

## Consequences

- The station stream host sees this computer's network address, as any client. The house does not ask that host to turn the address into a city. The shared sentence still says "https request", including when the stream itself is http. The audio element is constructed only inside `openStationStream`. A missing line does not assign a stream source and does not say "can't reach". [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- Radio Find still waits for its own line. [0034](0034-news-quotes-and-radio-name-the-network-address.md). News, quotes, a later forecast, and a geocode look-up keep their gates.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
