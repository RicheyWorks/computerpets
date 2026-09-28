# 0030. A missing OS id waits for a yes before a weaker license mark

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `desktop/license/hwid.cjs`, `desktop/license/session.cjs`, `desktop/renderer/settings.html`, `client/computerpets_client/license/hwid.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`

## Context

[0019](0019-license-mark-is-a-local-hash.md) hashes a named operating-system id when Unlock or a bound download has no `hwid.txt`. The raw id stays on the machine. The house receives the hash.

That ADR also named the miss: Windows used the computer name, and a machine with no name hashed a random ID. The code did that inside the same Unlock click. The keeper was not asked. A rename changes a computer-name hash. A random ID changes if `hwid.txt` is deleted. An existing file was already the binding, including a hash minted that way before this slice.

## Decision

A missing named id does not mint a license mark until the keeper says yes. This slice does not start DirectX 12 or Vulkan. It does not change weather. It does not reseal the plugin key. It does not unify the `win32` and `windows` salt tokens.

- A non-empty `hwid.txt` is still the binding. Unlock reuses it and does not read the operating-system id again. The file is not rewritten.
- Linux `machine-id`, the Mac platform UUID, and Windows `MachineGuid` are still read only when that file is missing and a bind needs a mark. Opening the house window does not read them. License status peeks at `hwid.txt` only.
- When that named read fails and `hwid.txt` is missing, Unlock and a bound download stop. They do not hash the computer name. They do not hash a random ID. They do not write `hwid.txt`. The error tells the keeper this computer has no stable operating-system id, that a yes hashes the computer name, that a computer with no name gets a random ID, that a rename changes the computer-name hash, and that deleting `hwid.txt` makes a random ID a different mark.
- The yes is a control in the house window and a question on the blotter. The label names the computer name, and a random ID when there is no name. After that yes, the same digest recipe runs. The overlay token stays `win32`. The blotter token stays `windows`.
- The raw computer name is not written, not logged, and not sent. The house still receives only the hash.

## Consequences

- A keeper who already has `hwid.txt` keeps that string, including a hash that was minted from a computer name before this yes existed. Deleting the file and unlocking again follows the named id when that read works. When it does not, the weaker hash is minted only after a new yes.
- The computer-name hash is still a fingerprint. A rename changes it. The random ID is still unstable if `hwid.txt` is deleted.
- The Unlock screen says this before the click, and again when the named read fails. It does not print the hash, the raw id, or the computer name.
- Desk presence does not read a machine id. [0019](0019-license-mark-is-a-local-hash.md).
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- A raw token in a URL fragment, and a secret in a hostname, stay documented. This slice does not chase them.
- Geolocation is not a standing process grant. Electron cannot revoke a grant Chromium already cached in the renderer. A later locate still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine. Catalog stays 221.
