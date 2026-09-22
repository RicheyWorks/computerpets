"""HMAC for POST /api/verify. Same bytes as MachineRequestSignature.java."""

from __future__ import annotations

import base64
import hashlib
import hmac
import time

from .errors import LicenseError

VERSION = "computerpets-machine-v1"
TIMESTAMP_HEADER = "X-ComputerPets-Timestamp"
SIGNATURE_HEADER = "X-ComputerPets-Signature"


def canonical(*, method: str, path: str, query: str, timestamp: str, body: bytes) -> str:
    digest = hashlib.sha256(body).hexdigest()
    return "\n".join(
        [
            VERSION,
            (method or "POST").upper(),
            path or "",
            query or "",
            timestamp,
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
    body: bytes | None = None,
) -> dict[str, str]:
    if not isinstance(key, str) or not key:
        raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing")
    ts = str(int(time.time())) if timestamp is None else str(timestamp)
    raw = body if isinstance(body, (bytes, bytearray)) else b""
    message = canonical(method=method, path=path, query=query, timestamp=ts, body=bytes(raw))
    mac = hmac.new(key.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    signature = base64.urlsafe_b64encode(mac).rstrip(b"=").decode("ascii")
    return {
        "timestamp": ts,
        "signature": signature,
        TIMESTAMP_HEADER: ts,
        SIGNATURE_HEADER: signature,
    }
