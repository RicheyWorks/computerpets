"""Plain words for Unlock / Signed download failures. Port of desktop/license/plain-error.cjs.

Network trouble (refused, no such host, timeout, TLS, HTTP 5xx) becomes one sentence that names
the host. Every house license code gets one plain sentence; only codes whose messages were
written for people pass through. The raw error goes to the log (``raw_log_line``), never to
the Unlock dialog.
"""

from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlparse

from .errors import LicenseError

PETS_STILL = "Pets still work without it."

_REFUSED = re.compile(
    r"\b(ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH|EPIPE|WinError 10061|WinError 10054|Errno 111|Errno 104)\b"
    r"|Connection refused|actively refused|Connection reset|forcibly closed|backend is unreachable|network is unreachable",
    re.I,
)
_NOT_FOUND = re.compile(
    r"\b(ENOTFOUND|EAI_AGAIN|EAI_NONAME|WinError 11001|WinError 11004|Errno -2|Errno -3|Errno -5|Errno 8)\b"
    r"|getaddrinfo|Name or service not known|nodename nor servname|No address associated|Temporary failure in name resolution",
    re.I,
)
_TIMEOUT = re.compile(r"\b(ETIMEDOUT|WinError 10060)\b|timed out|timeout", re.I)
_TLS = re.compile(r"CERTIFICATE_VERIFY_FAILED|\bSSL\b|\bTLS\b|certificate|WRONG_VERSION_NUMBER", re.I)

BUNDLE_DEFAULT = "The downloaded bundle did not match what the house server promised, so it was not installed."

HOUSE_CODES = frozenset(
    {
        "bad_response",
        "bundle_zip_invalid",
        "cdn_net_unnamed",
        "decrypt_failed",
        "denied",
        "download_failed",
        "download_net_unnamed",
        "expired",
        "fields_missing",
        "hwid_mismatch",
        "hwid_needs_fallback_yes",
        "hwid_too_long",
        "license_net_unnamed",
        "missing_backend",
        "missing_secret",
        "no_license",
        "no_token",
        "revoked",
        "signed_url_invalid",
        "unknown_provider",
    }
)

PASSTHROUGH_CODES = frozenset(
    {
        "cdn_net_unnamed",
        "download_net_unnamed",
        "fields_missing",
        "hwid_needs_fallback_yes",
        "license_net_unnamed",
        "no_license",
        "no_token",
    }
)

_KIND_CODES = {
    "refused": "unreachable",
    "notfound": "not_found",
    "timeout": "timeout",
    "tls": "tls",
    "server": "server_error",
    "busy": "busy",
}


def host_of(url: str | None) -> str:
    if not isinstance(url, str) or not url.strip():
        return ""
    try:
        return urlparse(url.strip()).netloc
    except Exception:  # noqa: BLE001
        return ""


def _where(host: str) -> str:
    return f"the house server at {host}" if host else "the house server"


def _capital(text: str) -> str:
    return text[:1].upper() + text[1:]


def raw_text(err: object) -> str:
    """Every raw string an error carries (type, code, message, detail, cause chain)."""
    if err is None:
        return ""
    if isinstance(err, str):
        return err
    bits: list[str] = []
    seen: set[int] = set()
    cur: Any = err
    depth = 0
    while cur is not None and depth < 4 and id(cur) not in seen:
        seen.add(id(cur))
        if isinstance(cur, str):
            bits.append(cur)
            break
        bits.append(type(cur).__name__)
        code = getattr(cur, "code", None)
        if isinstance(code, (str, int)):
            bits.append(str(code))
        bits.append(str(cur))
        detail = getattr(cur, "detail", None)
        if isinstance(detail, str):
            bits.append(detail)
        elif isinstance(detail, dict) and isinstance(detail.get("error"), str):
            bits.append(detail["error"])
        reason = getattr(cur, "reason", None)
        if reason is not None and not isinstance(reason, (dict, list)):
            bits.append(str(reason))
        cur = getattr(cur, "__cause__", None) or getattr(cur, "__context__", None)
        depth += 1
    return " ".join(b for b in bits if b)


def network_class(err: object) -> str | None:
    text = raw_text(err)
    if not text:
        return None
    if _TLS.search(text):
        return "tls"
    if _NOT_FOUND.search(text):
        return "notfound"
    if _TIMEOUT.search(text):
        return "timeout"
    if _REFUSED.search(text):
        return "refused"
    return None


def _sentence(kind: str, host: str, status: int = 0) -> str:
    at = _where(host)
    if kind == "notfound":
        return f"Couldn't find {at}. Check the Backend URL. {PETS_STILL}"
    if kind == "timeout":
        return f"{_capital(at)} took too long to answer. {PETS_STILL}"
    if kind == "tls":
        return f"Couldn't make a secure connection to {at} (certificate problem), so nothing was sent. {PETS_STILL}"
    if kind == "server":
        return f"{_capital(at)} had a problem{f' (error {status})' if status else ''}. Try again later. {PETS_STILL}"
    if kind == "busy":
        return f"{_capital(at)} is busy right now. Try again in a minute. {PETS_STILL}"
    return f"Couldn't reach {at}. {PETS_STILL}"


def house_sentence(code: str, host: str = "") -> str:
    """One plain sentence per house code whose raised message is developer or server text."""
    at = _where(host)
    words = {
        "expired": f"This license has expired. Unlock again to get a new one. {PETS_STILL}",
        "hwid_mismatch": f"This license belongs to a different computer, so it does not work here. Unlock again on this computer. {PETS_STILL}",
        "revoked": f"{_capital(at)} no longer accepts this license. Unlock again to get a new one. {PETS_STILL}",
        "denied": f"{_capital(at)} did not confirm that you own the game. Check the Steam ID and the App ID, then try again. {PETS_STILL}",
        "decrypt_failed": f"The license on this computer could not be opened, so it was not used. Unlock again to get a fresh one. {PETS_STILL}",
        "missing_secret": f"This copy of the app has no license key set up, so it cannot open a license. {PETS_STILL}",
        "missing_backend": f"The Backend URL is not a web address. It should look like http://127.0.0.1:8081 or https://house.example. {PETS_STILL}",
        "bad_response": f"{_capital(at)} sent an answer this app does not understand. Try again later. {PETS_STILL}",
        "download_failed": f"{_capital(at)} did not hand over the download. Unlock again, then download. {PETS_STILL}",
        "unknown_provider": f"{_capital(at)} does not know this store. Pick Steam and try again. {PETS_STILL}",
        "signed_url_invalid": f"The download link did not check out, so nothing was downloaded. Unlock again, then download. {PETS_STILL}",
        "hwid_too_long": f"This computer's license mark is too long. Delete hwid.txt in the app's data folder, then unlock again. {PETS_STILL}",
        "bundle_zip_invalid": BUNDLE_DEFAULT,
    }
    return words.get(code, "")


def _status_of(err: object) -> int:
    status = getattr(err, "http_status", None) or getattr(err, "status", None)
    return status if isinstance(status, int) and not isinstance(status, bool) else 0


def plain_license_error(err: object, host: str = "") -> dict[str, str]:
    """``{"code", "message"}`` safe to show. ``host`` names the server when the error does not."""
    own_host = getattr(err, "host", None)
    host = own_host if isinstance(own_host, str) and own_host else (host or "")
    code = err.code if isinstance(err, LicenseError) and isinstance(err.code, str) else ""
    if isinstance(err, dict):
        code = err.get("code") if isinstance(err.get("code"), str) else ""
    status = _status_of(err)
    if status >= 500:
        return {"code": _KIND_CODES["server"], "message": _sentence("server", host, status)}
    if status == 429:
        return {"code": _KIND_CODES["busy"], "message": _sentence("busy", host)}
    kind = network_class(err)
    if kind and (code == "unreachable" or code not in HOUSE_CODES):
        return {"code": _KIND_CODES[kind], "message": _sentence(kind, host)}
    if code == "unreachable":
        return {"code": _KIND_CODES["refused"], "message": _sentence("refused", host)}
    message = err.get("message") if isinstance(err, dict) else (str(err) if isinstance(err, LicenseError) else "")
    if code in PASSTHROUGH_CODES and isinstance(message, str) and message:
        return {"code": code, "message": message}
    house = house_sentence(code, host) if code in HOUSE_CODES else ""
    if house:
        return {"code": code, "message": house}
    return {"code": "failed", "message": f"Something went wrong talking to {_where(host)}. {PETS_STILL}"}


def raw_log_line(err: object) -> str:
    """The raw error for the log only, never the dialog."""
    return raw_text(err) or repr(err)
