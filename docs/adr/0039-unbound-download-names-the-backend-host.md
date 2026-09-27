# 0039. An unbound download names the backend host before the POST leaves

- **Status:** Accepted (the POST itself waits in [0045](0045-license-requests-wait-for-the-painted-line.md))
- **Date:** 2026-09-22
- **Code:** `desktop/license/license-net.cjs`, `desktop/license/session.cjs`, `desktop/renderer/license-net.js`, `desktop/renderer/settings.html`, `client/computerpets_client/license/license_net.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`

## Context

[0038](0038-signed-bundle-names-the-cdn-host.md) names the CDN host before a signed bundle GET. The unbound download POST did not use a session gate.

`POST /api/download/{pet}` with no `hwid` in the body goes to the backend URL. The default is `http://127.0.0.1:8081`. A keeper can point the field at another host. The body is the opaque license (`ciphertext`, `iv`) and a Bearer token. The license hash is not in that body. The POST still shows this computer's network address to that host.

The overlay and the blotter already required a line before they called it. That line was the hash sentence, which says a hash is sent. The session skipped its gate because the POST has no hash. A direct session call could still POST to a remote backend. Opening the house calls license status. It does not POST.

## Decision

This slice shows a download sentence, with the backend host named, before that unbound remote POST leaves. It does not rewrite the hash sentence. It does not scrub the signed query (`owner`, `jti`, `exp`, `sig`). It does not post on house open. It does not start DirectX 12 or Vulkan. It does not chase a URL fragment or a hostname secret. It does not read the operating-system id for this POST. Catalog stays 221.

- `clientNetLine` names the backend hostname. The line is `this download talks to <host>.` plus that sentence, plus `the license hash is not on that request.` The path, the query, the fragment, the port, and any userinfo stay off the line.
- `downloadMayPost` is true for a remote host only when that line is shown. The hash sentence is not that line. The overlay paints the line when the stored license has no `hwid`, then calls the gate, then the download IPC. The blotter does the same before its session call. The session refuses the POST when the line is missing.
- `127.0.0.1`, `localhost`, and `::1` stay on this computer. The screen says the download talks to this computer and the hash is not on that request. Those posts do not need the outbound sentence.
- A bound download still uses the hash line. [0037](0037-license-hash-names-the-network-address.md). The signed GET still names the CDN host. [0038](0038-signed-bundle-names-the-cdn-host.md).

## Consequences

- A remote backend sees this computer's network address on an unbound download, as any client, and it does not receive the hash. The house does not ask that host to turn the address into a city. The shared sentence still says "https request", including when the backend URL is http. That POST leaves only inside `postUnboundDownload`. A missing line does not post and does not say "can't reach". [0045](0045-license-requests-wait-for-the-painted-line.md).
- Opening the house does not post.
- The hash sentence is unchanged. The signed query on the bundle GET is unchanged.
- News, quotes, a later forecast, a geocode look-up, a station stream, cloud talk, and cloud voice keep their gates.
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
- Later wording (2026-09): the unbound download line now says "This asks license.example, the license website, for your pet. It sends your saved license and the pass from unlocking." plus the `plainNetLine` address sentence and "It does not send the code made from this computer's ID." The unlock line still does not open this POST, and this line still does not open the unlock POST.
