"""HMAC-SHA256 signed CDN URL — CLIENT-CONTRACT.md §7."""

from __future__ import annotations

import base64
import hashlib
import hmac
from typing import Any
from urllib.parse import parse_qs, urlparse, unquote

from .errors import LicenseError


def download_mac_message(parts: dict[str, Any]) -> str:
    if not parts or not parts.get("petKey") or parts.get("owner") is None or parts.get("exp") is None:
        raise LicenseError("signed_url_invalid", "signed URL MAC fields missing")
    exp = str(parts["exp"])
    if parts.get("jti"):
        return f"{parts['petKey']}|{parts['owner']}|{parts['jti']}|{exp}"
    return f"{parts['petKey']}|{parts['owner']}|{exp}"


def sign_download_mac(message: str, signing_key: str) -> str:
    if not isinstance(signing_key, str) or not signing_key:
        raise LicenseError("signed_url_invalid", "BUNDLE_SIGNING_KEY is missing")
    mac = hmac.new(signing_key.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(mac).decode("ascii").rstrip("=")


def parse_signed_download_url(url_string: str) -> dict[str, str | None]:
    if not isinstance(url_string, str) or not url_string:
        raise LicenseError("signed_url_invalid", "downloadUrl missing")
    try:
        url = urlparse(url_string)
    except Exception:
        raise LicenseError("signed_url_invalid", "downloadUrl is not a URL") from None
    if not url.scheme or not url.netloc:
        raise LicenseError("signed_url_invalid", "downloadUrl is not a URL")
    file = url.path.rstrip("/").split("/")[-1] if url.path else ""
    pet_key = file[:-4] if file.endswith(".zip") else file
    query = parse_qs(url.query, keep_blank_values=True)

    def first(name: str) -> str | None:
        values = query.get(name)
        if not values:
            return None
        return unquote(values[0])

    return {
        "petKey": pet_key,
        "owner": first("owner"),
        "jti": first("jti"),
        "exp": first("exp"),
        "sig": first("sig"),
    }


def verify_signed_download_url(url_string: str, expect: dict[str, Any] | None = None) -> dict[str, str | None]:
    expect = expect or {}
    parsed = parse_signed_download_url(url_string)
    if expect.get("jti") and parsed["jti"] != expect["jti"]:
        raise LicenseError(
            "signed_url_invalid",
            "signed URL jti does not match license",
            {"expected": expect["jti"], "received": parsed["jti"]},
        )
    if not parsed["jti"] and expect.get("jti"):
        raise LicenseError("signed_url_invalid", "signed URL missing jti")
    if expect.get("petKey") and parsed["petKey"] != expect["petKey"]:
        raise LicenseError("signed_url_invalid", "signed URL petKey does not match license")
    if expect.get("owner") and parsed["owner"] != expect["owner"]:
        raise LicenseError("signed_url_invalid", "signed URL owner does not match license")
    if expect.get("signingKey"):
        if not parsed["sig"] or not parsed["exp"] or not parsed["owner"] or not parsed["petKey"]:
            raise LicenseError("signed_url_invalid", "signed URL missing HMAC fields")
        message = download_mac_message(
            {
                "petKey": parsed["petKey"],
                "owner": parsed["owner"],
                "jti": parsed["jti"],
                "exp": parsed["exp"],
            }
        )
        expected = sign_download_mac(message, expect["signingKey"])
        a = expected.encode("ascii")
        b = parsed["sig"].encode("ascii")
        if len(a) != len(b) or not hmac.compare_digest(a, b):
            raise LicenseError("signed_url_invalid", "signed URL MAC mismatch")
    return parsed
