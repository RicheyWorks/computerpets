# 0038. A signed bundle names the CDN host before the GET leaves

- **Status:** Accepted (the GET itself waits in [0045](0045-license-requests-wait-for-the-painted-line.md))
- **Date:** 2026-09-22
- **Code:** `desktop/license/license-net.cjs`, `desktop/license/session.cjs`, `desktop/renderer/license-net.js`, `desktop/renderer/settings.html`, `client/computerpets_client/license/license_net.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`

## Context

[0037](0037-license-hash-names-the-network-address.md) names the backend host before a license hash is posted. The signed bundle GET did not use that sentence.

After Unlock or a signed download, the client `GET`s the URL from `POST /api/download/{pet}`. That URL is the CDN (default `cdn.enterprisepet.example`). The GET shows this computer's network address to that host. The license hash is not on that GET. Opening the house calls license status. It does not GET the bundle. A loopback CDN, or a `file:` URL, stays on this computer.

## Decision

This slice shows the same network-address sentence, with the CDN host named, before a remote signed-bundle GET leaves. It does not fetch on house open. It does not put the license hash on that GET. It does not start DirectX 12 or Vulkan. It does not move the hash gate, the missing-OS-id yes, or the talk and voice lines. It does not chase a URL fragment or a hostname secret. Catalog stays 221.

- `clientNetLine` names the bundle hostname. The line is `this download gets the signed bundle.` plus that sentence, plus `the license hash is not on that request.` The path, the query, the fragment, the port, and any userinfo stay off the line.
- `bundleMayFetch` is true for a remote host only when that line is shown. The overlay paints the line, then calls the gate, then the fetch IPC. The blotter does the same before its session call. The session does not GET when the line is missing.
- `127.0.0.1`, `localhost`, `::1`, and a `file:` URL stay on this computer. The screen says the bundle does not leave. Those reads do not need the outbound sentence.
- The hash post keeps its own line. [0037](0037-license-hash-names-the-network-address.md).

## Consequences

- A remote CDN sees this computer's network address, as any client. The signed query (`owner`, `jti`, `exp`, `sig`) still rides that GET. The license hash does not. The house does not ask the CDN to turn the address into a city. The shared sentence still says "https request", including when the bundle URL is http. The GET leaves only inside `getSignedBundle`. A missing line does not fetch and does not say "can't reach". [0045](0045-license-requests-wait-for-the-painted-line.md).
- Opening the house does not fetch a bundle.
- An unbound download POST names the backend host before it leaves. [0039](0039-unbound-download-names-the-backend-host.md).
- News, quotes, a later forecast, a geocode look-up, a station stream, cloud talk, and cloud voice keep their gates.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the bundle line now says "This gets your pet's files from cdn.example, the download website, with the link the license website gave." plus the `plainNetLine` address sentence and "It does not send the code made from this computer's ID." The gate is unchanged.
