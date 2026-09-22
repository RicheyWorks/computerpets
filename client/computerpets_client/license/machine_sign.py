"""HMAC for POST /api/verify. Same bytes as MachineRequestSignature.java."""

from __future__ import annotations

import base64
import hashlib
import hmac
import re
import secrets
import time

from .errors import LicenseError

VERSION = "computerpets-machine-v1"
TIMESTAMP_HEADER = "X-ComputerPets-Timestamp"
NONCE_HEADER = "X-ComputerPets-Nonce"
SIGNATURE_HEADER = "X-ComputerPets-Signature"
_NONCE_RE = re.compile(r"^[A-Za-z0-9_-]{16,128}$")


def canonical(*, method: str, path: str, query: str, timestamp: str, nonce: str, body: bytes) -> str:
    digest = hashlib.sha256(body).hexdigest()
    return "\n".join(
        [
            VERSION,
            (method or "POST").upper(),
            path or "",
            query or "",
            timestamp,
            nonce,
            digest,
        ]
    )


def sign_machine_request(
    *,
    key: str,
    method: str = "POST",
    path: str,
    query: str = "",
    timestamp: str | int | None = None,
    nonce: str | None = None,
    body: bytes | None = None,
) -> dict[str, str]:
    if not isinstance(key, str) or not key:
        raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing")
    ts = str(int(time.time())) if timestamp is None else str(timestamp)
    raw_nonce = secrets.token_urlsafe(16) if nonce is None else str(nonce)
    if _NONCE_RE.fullmatch(raw_nonce) is None:
        raise LicenseError("denied", "machine nonce is not 16-128 chars of [A-Za-z0-9_-]")
    raw = body if isinstance(body, (bytes, bytearray)) else b""
    message = canonical(
        method=method, path=path, query=query, timestamp=ts, nonce=raw_nonce, body=bytes(raw)
    )
    mac = hmac.new(key.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    signature = base64.urlsafe_b64encode(mac).rstrip(b"=").decode("ascii")
    return {
        "timestamp": ts,
        "nonce": raw_nonce,
        "signature": signature,
        TIMESTAMP_HEADER: ts,
        NONCE_HEADER: raw_nonce,
        SIGNATURE_HEADER: signature,
    }
