# 0045. License requests wait for the painted line

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/license/license-net.cjs`, `desktop/license/session.cjs`, `desktop/renderer/license-net.js`, `desktop/renderer/settings.html`, `client/computerpets_client/license/license_net.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`

## Context

[0037](0037-license-hash-names-the-network-address.md) paints the hash sentence before an unlock or a bound download posts the license hash. [0039](0039-unbound-download-names-the-backend-host.md) paints the download sentence before an unbound `POST /api/download/{pet}`. [0038](0038-signed-bundle-names-the-cdn-host.md) paints the bundle sentence before the signed CDN GET. The hash host is the backend URL. The unbound host is that same backend. The bundle host is the signed download URL.

Those opens already waited on the caller. `licenseMaySend` is true for a remote host only when the hash sentence is shown. `downloadMayPost` is true only when the download sentence is shown. `bundleMayFetch` is true only when the bundle sentence is shown. The POST and the GET were still separate calls after that boolean. A caller that passed true, or that skipped the plate, could still reach `verify`, `download`, or `fetchBundle`. The overlay paints the line and then called the IPC. The blotter painted the line and then called the session. The session asserted, then called the client.

[0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md) put a station stream and cloud talk behind refusing wrappers. These three license requests were the leftover.

## Decision

The unlock hash POST, the unbound download POST, and the signed bundle GET do not leave unless the painted line for that host is present on the string the caller painted. A bound download that sends the same hash uses the hash wrapper. They do not move the news, quote, or Radio IPC gates. They do not rewrite the forecast, geocode, stream, or talk wrappers. They do not start DirectX 12 or Vulkan. They do not scrub a signed CDN query (`owner`, `jti`, `exp`, `sig`). They do not rewrite the painted sentences. Catalog stays 221.

- The hash line stays `this unlock sends the license hash.` plus `clientNetLine` for that backend host, plus `a bound download sends that same hash.` The download line stays `this download talks to <host>.` plus that sentence, plus `the license hash is not on that request.` The bundle line stays `this download gets the signed bundle.` plus `clientNetLine` for that CDN host, plus `the license hash is not on that request.` One sentence does not unlock the other. The path, the query, the fragment, the port, and any userinfo stay off the line.
- `postLicenseHash` is the only unlock-hash POST, including a bound download. `postUnboundDownload` is the only unbound download POST. `getSignedBundle` is the only signed-bundle GET. `licenseMaySend`, `downloadMayPost`, and `bundleMayFetch` stay the predicates inside those wrappers. A miss does not call the request. It does not read the operating-system id. It does not write `hwid.txt`. The plate does not say "can't reach" for that hold. The session still refuses with `license_net_unnamed`, `download_net_unnamed`, or `cdn_net_unnamed`.
- A loopback backend, a loopback CDN, and a `file:` URL still call the request. That call stays on this computer. The screen keeps the local sentence.
- The overlay paints the line, then passes that DOM text into the wrapper, and the IPC is the request callback. The blotter does the same with the label text before the session call. The session passes the same text into the wrapper, and the client call is the request callback. A stored `hwid.txt` is still reused. A missing operating-system id still waits for its own yes. [0030](0030-missing-os-id-waits-for-a-yes.md).

## Consequences

- A remote license host sees this computer's network address only after the hash sentence or the download sentence was painted, as any client. A remote CDN sees it only after the bundle sentence was painted. The signed query still rides that GET. The house does not ask either host to turn the address into a city.
- The painted sentences stay. [0037](0037-license-hash-names-the-network-address.md). [0038](0038-signed-bundle-names-the-cdn-host.md). [0039](0039-unbound-download-names-the-backend-host.md). Opening the house still does not post or fetch.
- News RSS, quotes, and Radio Find still wait in main. [0040](0040-news-quotes-and-radio-wait-for-the-line-in-main.md). The featured page, the other desk plate fetches, a forecast or geocode look-up, a station stream, and cloud talk stay on their wrappers. [0041](0041-featured-page-waits-for-the-wikipedia-line.md). [0042](0042-desk-and-overlay-fetches-wait-for-the-painted-line.md). [0043](0043-forecast-and-geocode-wait-for-the-painted-line.md). [0044](0044-station-stream-and-cloud-talk-wait-for-the-painted-line.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- The house font request is not these wrappers. [0046](0046-house-fonts-stay-on-this-computer.md).
- Later wording (2026-09): the unlock, unbound download, and bundle lines are now kid-plain and name "the license website" and "the download website" (see 0037, 0038, 0039). The wrappers still refuse a request until that exact line is painted.
