# 0019. A license mark is a local hash of a named machine id

- **Status:** Accepted (the silent computer-name and random fallback is superseded by [0030](0030-missing-os-id-waits-for-a-yes.md))
- **Date:** 2026-09-22
- **Code:** `desktop/license/hwid.cjs`, `desktop/license/session.cjs`, `desktop/renderer/settings.html`, `client/computerpets_client/license/hwid.py`, `client/computerpets_client/license/session.py`, `client/computerpets_client/unlock_dialog.py`
- **Plain words (2026-09-27):** "device fingerprint" below means a code that stays the same for this computer, so a website that gets it twice can tell it is the same computer. The app now says the code "works like a fingerprint for this computer". The decision is unchanged.

## Context

[0018](0018-mind-key-is-not-plain-text.md) sealed the overlay plugin key. The license door stayed open: Unlock could read Linux `/etc/machine-id` (or `/var/lib/dbus/machine-id`), the Windows `MachineGuid`, or the Mac `IOPlatformUUID`, and it did that work inside license status as well as unlock.

The house still binds a license to one computer. The backend does not define the fingerprint. It stores whatever opaque string the client sends and later requires the same string. These clients already hashed the OS id before writing `hwid.txt`. The raw id was not a telemetry field. The read itself was easy to miss, and opening the House window could perform it before the keeper asked to unlock.

That OS id is a stable device fingerprint. Hashing it does not make it anonymous. The hash is stable for the same computer, and the house receives the hash when a license is bound.

## Decision

This slice names the read, limits when it happens, and keeps every stored mark. It does not start DirectX 12 or Vulkan. It does not change weather. It does not reseal the plugin key.

- The marks are listed in code: Linux `machine-id`, then the dbus `machine-id`; Mac `IOPlatformUUID` from `ioreg`; Windows `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid`. Listing them does not read them.
- The OS id is read only when `hwid.txt` is missing and a license action needs a mark: Unlock, or a download of a license that is already bound. License status peeks at `hwid.txt` only. Opening the House window does not read the OS id.
- The digest recipe is unchanged: SHA-256 of `computerpets:` + the platform token + `:` + the raw id, hex, 64 characters. The overlay token is Node's platform (`win32` on Windows). The blotter token is `platform.system().lower()` (`windows` on Windows). Each client keeps its own `hwid.txt`. The recipe is not unified, because unifying it would change a hash for a keeper who lost the file.
- A non-empty `hwid.txt` is the binding, including a value that is not a fresh digest. It is not rewritten and not re-hashed. An existing license keeps the string it was issued with. The server still wants exact equality. This client does not invent a second id for one license.
- The raw id is not written, not logged, and not sent. The house receives only the hash, and only on unlock or a bound download. An unbound download does not read the OS id and does not send a mark.
- When the named OS read fails, Unlock does not mint a computer-name or random mark until the keeper says yes. [0030](0030-missing-os-id-waits-for-a-yes.md). A stored `hwid.txt` is still reused. The overlay salt stays `win32` and the blotter salt stays `windows`.
- The Unlock screen says what is read, when, and that the hash is a device fingerprint. It does not print the hash or the raw id.
- Desk presence does not read a machine id. `hwid.txt` is not a presence house file. The browser desk does not read one.

## Consequences

- A keeper who already has `hwid.txt` is not asked to unlock again. Deleting that file and unlocking again recomputes the same hash only when the OS id and the platform token are the same as before.
- The hash that leaves on unlock is still a stable fingerprint of this computer. Hashing is not anonymity. There is no new phone-home of the raw id.
- The desk `/mind` key is not this door. [0020](0020-desk-mind-key-is-not-in-the-browser.md) keeps it out of browser storage. That store is not `hwid.txt`.
- The GUI harness may write `COMPUTERPETS_GUI_HARNESS_OUT`. That path is not presence.
- The enumerator does not call GetClassName. Shell windows are known handles. A keeper window's class is not read. [0029](0029-enumerator-does-not-read-a-window-class.md).
- Geolocation is not a standing process grant. [0013](0013-weather-locate-is-not-a-process-grant.md) opens it for the weather control and closes it after that locate. Electron cannot revoke a grant Chromium already cached in the renderer. An IP place lookup is not a fallback. [0014](0014-weather-does-not-ask-an-ip-place.md) drops it. A live fix is rounded before it leaves, and a saved typed area is kept. [0015](0015-weather-locate-sends-a-rounded-place.md). A live locate waits for an in-app yes, and a stored live pin is rounded on load. [0016](0016-weather-locate-waits-for-an-in-app-yes.md). A saved live pin does not forecast until the keeper says to use that place. [0017](0017-saved-computer-place-waits-for-a-forecast-yes.md). Electron 35 still cannot revoke the cached grant. A later locate in the same session still waits for a fresh in-app yes. [0031](0031-later-locate-still-asks-in-the-app.md).
- DirectX 12 / Vulkan is still open. This slice is not that engine.
