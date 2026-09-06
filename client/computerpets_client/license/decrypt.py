"""AES-256-GCM license decrypt — CLIENT-CONTRACT.md §3.

No KDF. LICENSE_SECRET_KEY is standard Base64 of exactly 32 bytes.
IV is 12 bytes, sent separately. 16-byte tag is appended to the ciphertext.
"""

from __future__ import annotations

import base64
import json
import re
from datetime import datetime, timezone
from typing import Any, Callable

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from .errors import LicenseError

AES_KEY_BYTES = 32
GCM_IV_BYTES = 12
GCM_TAG_BYTES = 16

REQUIRED_FIELDS = ("jti", "owner", "pet", "validUntil", "issuedAt")
_B64_RE = re.compile(r"^[A-Za-z0-9+/]+={0,2}$")


def decode_standard_base64(value: str | None, label: str) -> bytes:
    if not isinstance(value, str) or not value.strip():
        raise LicenseError("decrypt_failed", f"{label} missing")
    trimmed = re.sub(r"\s+", "", value.strip())
    if "-" in trimmed or "_" in trimmed:
        raise LicenseError("decrypt_failed", f"{label} must be standard base64, not URL-safe")
    if not _B64_RE.match(trimmed):
        raise LicenseError("decrypt_failed", f"{label} is not valid base64")
    try:
        buf = base64.b64decode(trimmed, validate=True)
    except Exception:
        raise LicenseError("decrypt_failed", f"{label} is not valid base64") from None
    if not buf:
        raise LicenseError("decrypt_failed", f"{label} is not valid base64")
    # Round-trip: reject non-canonical padding / alphabet (Electron does this).
    if _strip_pad(base64.b64encode(buf).decode("ascii")) != _strip_pad(trimmed):
        raise LicenseError("decrypt_failed", f"{label} is not valid base64")
    return buf


def _strip_pad(s: str) -> str:
    return s.rstrip("=")


def decode_license_key(secret_b64: str | None) -> bytes:
    if not isinstance(secret_b64, str) or not secret_b64.strip():
        raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing")
    try:
        key = decode_standard_base64(secret_b64, "LICENSE_SECRET_KEY")
    except LicenseError as err:
        if err.code == "decrypt_failed":
            raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is not valid base64") from err
        raise
    if len(key) != AES_KEY_BYTES:
        raise LicenseError(
            "missing_secret",
            f"LICENSE_SECRET_KEY must decode to {AES_KEY_BYTES} bytes (AES-256). Got {len(key)}",
        )
    return key


def parse_iso8601(value: str) -> datetime:
    raw = value.strip()
    if raw.endswith("Z"):
        raw = raw[:-1] + "+00:00"
    if "." in raw:
        head, rest = raw.split(".", 1)
        digits = []
        tz = ""
        for i, ch in enumerate(rest):
            if ch.isdigit():
                digits.append(ch)
            else:
                tz = rest[i:]
                break
        frac = ("".join(digits) + "000000")[:6]
        raw = f"{head}.{frac}{tz}"
    parsed = datetime.fromisoformat(raw)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def decrypt_license(
    ciphertext_b64: str,
    iv_b64: str,
    secret_b64: str | None,
    *,
    now: Callable[[], float] | None = None,
) -> dict[str, Any]:
    key = decode_license_key(secret_b64)
    iv = decode_standard_base64(iv_b64, "iv")
    packed = decode_standard_base64(ciphertext_b64, "ciphertext")

    if len(iv) != GCM_IV_BYTES:
        raise LicenseError("decrypt_failed", f"iv must be {GCM_IV_BYTES} bytes, got {len(iv)}")
    if len(packed) <= GCM_TAG_BYTES:
        raise LicenseError("decrypt_failed", "ciphertext too short to contain a GCM tag")

    try:
        plaintext = AESGCM(key).decrypt(iv, packed, None)
    except InvalidTag:
        raise LicenseError("decrypt_failed", "license ciphertext failed authentication") from None
    except Exception:
        raise LicenseError("decrypt_failed", "license ciphertext failed authentication") from None

    try:
        payload = json.loads(plaintext.decode("utf-8"))
    except Exception:
        raise LicenseError("decrypt_failed", "license plaintext is not JSON") from None
    if not isinstance(payload, dict):
        raise LicenseError("decrypt_failed", "license payload is not an object")

    for field in REQUIRED_FIELDS:
        value = payload.get(field)
        if not isinstance(value, str) or not value:
            raise LicenseError("decrypt_failed", f"license payload missing {field}")

    try:
        valid_until = parse_iso8601(payload["validUntil"])
    except Exception:
        raise LicenseError("decrypt_failed", "license validUntil is not ISO-8601") from None

    now_ms = now() if now else datetime.now(timezone.utc).timestamp() * 1000
    if valid_until.timestamp() * 1000 <= now_ms:
        raise LicenseError("expired", "license expired", {"validUntil": payload["validUntil"]})

    hwid = payload.get("hwid")
    return {
        "jti": payload["jti"],
        "owner": payload["owner"],
        "pet": payload["pet"],
        "validUntil": payload["validUntil"],
        "issuedAt": payload["issuedAt"],
        "hwid": hwid if isinstance(hwid, str) and hwid else None,
    }
