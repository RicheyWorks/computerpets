"""Where the download sign-in (auth.token) may live. Never plain text in license.json.

Same rule as the desktop app (desktop/license/session.cjs + main.cjs mindCodec):
license.json keeps ``auth.sealedToken`` when this computer has a secret store, and no token
at all when it does not. The session holds the token in memory for the run either way.

Secret stores, in order:
- Windows: DPAPI (CryptProtectData, the current user's key) through ctypes. No extra package.
- Elsewhere: the optional ``keyring`` package (macOS Keychain, Secret Service, KWallet) when it
  is installed and has a working backend. ``pip install keyring`` turns it on; nothing needs it.
- Neither: ``default_token_codec()`` returns None and the token is kept in memory only.

A codec has ``encrypt(text) -> str`` (what license.json may keep) and ``decrypt(sealed) -> str``.
"""

from __future__ import annotations

import base64
import sys
from typing import Any, Optional, Protocol

DPAPI_PREFIX = "dpapi:v1:"
KEYRING_MARK = "keyring:v1"
KEYRING_SERVICE = "ComputerPets"
KEYRING_USER = "license-download-token"
_ENTROPY = b"computerpets-license-download-token"


class TokenCodec(Protocol):
    def encrypt(self, text: str) -> str: ...

    def decrypt(self, sealed: str) -> str: ...


def _dpapi(data: bytes, protect: bool) -> bytes:
    import ctypes
    from ctypes import wintypes

    class Blob(ctypes.Structure):
        _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

    crypt32 = ctypes.windll.crypt32  # type: ignore[attr-defined]
    kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
    fn = crypt32.CryptProtectData if protect else crypt32.CryptUnprotectData
    fn.argtypes = [
        ctypes.POINTER(Blob),
        ctypes.c_void_p,
        ctypes.POINTER(Blob),
        ctypes.c_void_p,
        ctypes.c_void_p,
        wintypes.DWORD,
        ctypes.POINTER(Blob),
    ]
    fn.restype = wintypes.BOOL
    kernel32.LocalFree.argtypes = [ctypes.c_void_p]
    kernel32.LocalFree.restype = ctypes.c_void_p

    data_buf = ctypes.create_string_buffer(data, len(data))
    ent_buf = ctypes.create_string_buffer(_ENTROPY, len(_ENTROPY))
    blob_in = Blob(len(data), ctypes.cast(data_buf, ctypes.POINTER(ctypes.c_char)))
    entropy = Blob(len(_ENTROPY), ctypes.cast(ent_buf, ctypes.POINTER(ctypes.c_char)))
    blob_out = Blob()
    ui_forbidden = 0x1
    if not fn(ctypes.byref(blob_in), None, ctypes.byref(entropy), None, None, ui_forbidden, ctypes.byref(blob_out)):
        raise OSError("DPAPI refused")
    try:
        return ctypes.string_at(blob_out.pbData, blob_out.cbData)
    finally:
        kernel32.LocalFree(ctypes.cast(blob_out.pbData, ctypes.c_void_p))


class DpapiCodec:
    """Windows DPAPI: only this Windows user on this computer can open the seal."""

    name = "dpapi"

    def encrypt(self, text: str) -> str:
        return DPAPI_PREFIX + base64.b64encode(_dpapi(str(text).encode("utf-8"), True)).decode("ascii")

    def decrypt(self, sealed: str) -> str:
        raw = str(sealed)
        if not raw.startswith(DPAPI_PREFIX):
            raise ValueError("not a DPAPI seal")
        return _dpapi(base64.b64decode(raw[len(DPAPI_PREFIX) :]), False).decode("utf-8")


class KeyringCodec:
    """The optional keyring package: the token lives in the OS keychain; license.json keeps a mark."""

    name = "keyring"

    def __init__(self, module: Any):
        self._keyring = module

    def encrypt(self, text: str) -> str:
        self._keyring.set_password(KEYRING_SERVICE, KEYRING_USER, str(text))
        return KEYRING_MARK

    def decrypt(self, sealed: str) -> str:
        if str(sealed) != KEYRING_MARK:
            raise ValueError("not a keyring mark")
        value = self._keyring.get_password(KEYRING_SERVICE, KEYRING_USER)
        return value or ""

    def forget(self) -> None:
        try:
            self._keyring.delete_password(KEYRING_SERVICE, KEYRING_USER)
        except Exception:  # noqa: BLE001 — nothing stored is fine
            pass


def _usable_keyring() -> Optional[Any]:
    try:
        import keyring  # type: ignore[import-not-found]
    except Exception:  # noqa: BLE001 — optional package
        return None
    try:
        backend = keyring.get_keyring()
        priority = getattr(backend, "priority", 0)
        if callable(priority):
            priority = priority()
        if not isinstance(priority, (int, float)) or priority <= 0:
            return None
    except Exception:  # noqa: BLE001
        return None
    return keyring


def default_token_codec(platform: str | None = None) -> Optional[TokenCodec]:
    """The OS secret store for the download sign-in, or None (memory only)."""
    plat = platform or sys.platform
    if plat == "win32":
        try:
            codec = DpapiCodec()
            if codec.decrypt(codec.encrypt("check")) == "check":
                return codec
        except Exception:  # noqa: BLE001 — no DPAPI: fall through
            pass
    module = _usable_keyring()
    if module is not None:
        return KeyringCodec(module)
    return None
