# 0037. Unlock names the license website before the code made from this computer's ID is sent

- **Status:** Accepted (the POST itself waits in [0045](0045-license-requests-wait-for-the-painted-line.md))
- **Date:** 2026-09-22
- **Code:** `desktop/license/license-net.cjs`, `desktop/license/session.cjs`, `desktop/renderer/license-net.js`, `desktop/renderer/settings.html`, `client/computerpets_client/license/license_net.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`

## Context

[0036](0036-cloud-talk-and-voice-name-the-network-address.md) names this computer's network address on cloud talk and cloud voice. That sentence is `clientNetLine`. Unlock did not use it.

Unlock posts the license hash to `POST /api/verify/{provider}` on the backend URL. A license that already has `hwid` posts that same hash again on `POST /api/download/{pet}`. The default backend is `http://127.0.0.1:8081`. A keeper can point the field at another host. The raw operating-system id is not in either body. [0019](0019-license-mark-is-a-local-hash.md). The hash is still a fingerprint.

An unbound download does not send a hash. Opening the house window calls license status. That reads `hwid.txt` only. It does not post. The signed bundle GET does not carry the hash. The browser desk does not post one.

## Decision

This slice shows the same network-address sentence, with the backend host named, before a remote hash leaves. It does not post on house open. It does not start DirectX 12 or Vulkan. It does not move the talk, voice, news, quote, forecast, geocode, or station-stream gates. It does not chase a URL fragment or a hostname secret. It does not send the raw operating-system id. Catalog stays 221.

- `clientNetLine` names the backend hostname. The line is `this unlock sends the license hash.` plus that sentence, plus `a bound download sends that same hash.` The path, the query, the fragment, the port, and any userinfo stay off the line.
- `licenseMaySend` is true for a remote host only when that line is shown. The overlay paints the line, then calls the gate, then the unlock or download IPC. The blotter does the same before its session call. The session refuses the post when the line is missing. It does not read the operating-system id on that refusal, and it does not write `hwid.txt`.
- `127.0.0.1`, `localhost`, and `::1` stay on this computer. The screen says the hash does not leave. Those unlocks do not need the outbound sentence.
- A stored `hwid.txt` is still reused. A missing operating-system id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md). An unbound download still omits the hash.

## Consequences

- A remote license host sees this computer's network address, as any client, and it receives the hash. The house does not ask that host to turn the address into a city. The shared sentence still says "https request", including when the backend URL is http. The hash POST leaves only inside `postLicenseHash`. A missing line does not post, does not read the operating-system id, and does not say "can't reach". [0045](0045-license-requests-wait-for-the-painted-line.md).
- The hash is still a fingerprint. Hashing is not anonymity. The raw id is still not sent.
- The signed bundle GET names that CDN host before it leaves. [0038](0038-signed-bundle-names-the-cdn-host.md).
- An unbound download names that backend host before the POST leaves. [0039](0039-unbound-download-names-the-backend-host.md).
- News, quotes, a later forecast, a geocode look-up, a station stream, cloud talk, and cloud voice keep their gates.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the unlock line now says "This asks license.example, the license website, to check your license. It sends what you typed for your license and a scrambled code made from this computer's ID. The ID itself stays here." plus the `plainNetLine` address sentence and "A download tied to this computer sends that same code." The license hash is that scrambled code. The gate still needs the line and the address sentence.
