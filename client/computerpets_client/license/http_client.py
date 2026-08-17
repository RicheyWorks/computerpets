"""HTTP verify / download against CLIENT-CONTRACT.md. Same shape as desktop/license/client.cjs."""

from __future__ import annotations

import json
import re
from typing import Any, Callable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse
from urllib.request import Request, urlopen

from .errors import LicenseError
from .hwid import assert_hwid
from .signed_url import verify_signed_download_url

DEFAULT_TIMEOUT_S = 12.0
_PROVIDER_RE = re.compile(r"^[a-z0-9_]+$")


class HttpResponse:
    def __init__(self, status: int, body: bytes, headers: dict[str, str] | None = None):
        self.status = status
        self.body = body
        self.headers = headers or {}

    @property
    def ok(self) -> bool:
        return 200 <= self.status < 300

    def text(self) -> str:
        return self.body.decode("utf-8") if self.body else ""

    def json(self) -> Any:
        text = self.text()
        if not text:
            return {}
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"raw": text}


FetchImpl = Callable[..., HttpResponse]


def normalize_backend_url(raw: str | None) -> str:
    if not isinstance(raw, str) or not raw.strip():
        raise LicenseError("missing_backend", "backend base URL is missing")
    try:
        url = urlparse(raw.strip())
    except Exception:
        raise LicenseError("missing_backend", "backend base URL is not a URL") from None
    if url.scheme not in ("http", "https") or not url.netloc:
        raise LicenseError("missing_backend", "backend base URL must be http or https")
    rebuilt = f"{url.scheme}://{url.netloc}{url.path}"
    return rebuilt.rstrip("/")


def default_fetch(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: bytes | None = None,
    timeout: float = DEFAULT_TIMEOUT_S,
) -> HttpResponse:
    req = Request(url, data=body, headers=headers or {}, method=method)
    try:
        with urlopen(req, timeout=timeout) as resp:
            return HttpResponse(resp.status, resp.read(), dict(resp.headers))
    except HTTPError as err:
        return HttpResponse(err.code, err.read() or b"", dict(err.headers or {}))
    except URLError as err:
        raise LicenseError("unreachable", "backend is unreachable", str(err.reason)) from err
    except TimeoutError as err:
        raise LicenseError("unreachable", "backend request timed out", str(err)) from err


def create_license_client(
    *,
    fetch_impl: FetchImpl | None = None,
    timeout_s: float = DEFAULT_TIMEOUT_S,
) -> dict[str, Callable[..., Any]]:
    fetch = fetch_impl or default_fetch

    def request(url: str, *, method: str, headers: dict[str, str] | None = None, body: bytes | None = None) -> HttpResponse:
        try:
            return fetch(url, method=method, headers=headers, body=body, timeout=timeout_s)
        except LicenseError:
            raise
        except Exception as err:
            name = type(err).__name__
            aborted = name in ("TimeoutError", "AbortError") or "timed out" in str(err).lower()
            raise LicenseError(
                "unreachable",
                "backend request timed out" if aborted else "backend is unreachable",
                str(err),
            ) from err

    def verify(*, backend_url: str, provider: str, fields: dict[str, Any]) -> dict[str, Any]:
        base = normalize_backend_url(backend_url)
        if not isinstance(provider, str) or not _PROVIDER_RE.match(provider):
            raise LicenseError("unknown_provider", "provider key is invalid")
        if not isinstance(fields, dict):
            raise LicenseError("denied", "verify fields missing")

        body: dict[str, str] = {}
        for key, value in fields.items():
            if value is None or value == "":
                continue
            if not isinstance(value, str):
                raise LicenseError("denied", f"verify field {key} must be a string")
            body[key] = value
        if isinstance(body.get("hwid"), str):
            assert_hwid(body["hwid"])

        res = request(
            f"{base}/api/verify/{provider}",
            method="POST",
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            body=json.dumps(body).encode("utf-8"),
        )
        payload = res.json()

        if res.status == 404:
            raise LicenseError("unknown_provider", payload.get("error") or "unknown provider", payload)
        if res.status == 403:
            raise LicenseError("denied", payload.get("error") or "ownership not verified", payload)
        if res.status == 400 and payload.get("error") == "hwid too long":
            raise LicenseError("hwid_too_long", "hwid too long", payload)
        if res.status == 429:
            raise LicenseError("unreachable", "verify rate limited", payload)
        if res.status >= 500:
            raise LicenseError("unreachable", payload.get("error") or "provider call failed", payload)
        if not res.ok:
            raise LicenseError("denied", payload.get("error") or f"verify failed ({res.status})", payload)
        if payload.get("status") != "success" or not payload.get("license") or not (payload.get("auth") or {}).get("token"):
            raise LicenseError("bad_response", "verify response is not a license issuance", payload)
        license_body = payload["license"]
        if not isinstance(license_body.get("ciphertext"), str) or not isinstance(license_body.get("iv"), str):
            raise LicenseError("bad_response", "verify response missing license ciphertext/iv", payload)
        return payload

    def download(
        *,
        backend_url: str,
        pet_key: str,
        ciphertext: str,
        iv: str,
        token: str,
        hwid: str | None = None,
        expect: dict[str, Any] | None = None,
        signing_key: str | None = None,
    ) -> dict[str, Any]:
        base = normalize_backend_url(backend_url)
        if not isinstance(pet_key, str) or not pet_key:
            raise LicenseError("download_failed", "petKey missing")
        if not isinstance(token, str) or not token:
            raise LicenseError("download_failed", "auth token missing")

        body: dict[str, str] = {"ciphertext": ciphertext, "iv": iv}
        if isinstance(hwid, str) and hwid:
            body["hwid"] = assert_hwid(hwid)

        res = request(
            f"{base}/api/download/{quote(pet_key, safe='')}",
            method="POST",
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            },
            body=json.dumps(body).encode("utf-8"),
        )
        payload = res.json()

        if res.status == 401:
            err = payload.get("error") or "license missing, expired, or tampered"
            revoked = bool(re.search(r"expired|tampered|missing", err, re.I))
            raise LicenseError("revoked" if revoked else "download_failed", err, payload)
        if res.status == 403 and payload.get("error") == "hardware binding mismatch":
            raise LicenseError("hwid_mismatch", payload["error"], payload)
        if res.status == 403:
            raise LicenseError("denied", payload.get("error") or "download forbidden", payload)
        if res.status == 429:
            raise LicenseError("unreachable", "download rate limited", payload)
        if not res.ok:
            raise LicenseError("download_failed", payload.get("error") or f"download failed ({res.status})", payload)
        if not isinstance(payload.get("downloadUrl"), str) or not payload["downloadUrl"]:
            raise LicenseError("bad_response", "download response missing downloadUrl", payload)

        expect = expect or {}
        verify_signed_download_url(
            payload["downloadUrl"],
            {
                "jti": expect.get("jti") or payload.get("jti"),
                "petKey": expect.get("petKey") or payload.get("petKey") or pet_key,
                "owner": expect.get("owner"),
                "signingKey": signing_key,
            },
        )
        return payload

    def fetch_bundle(download_url: str) -> dict[str, Any]:
        if not isinstance(download_url, str) or not download_url:
            raise LicenseError("signed_url_invalid", "downloadUrl missing")
        res = request(download_url, method="GET")
        if not res.ok:
            return {"ok": False, "status": res.status, "bytes": 0}
        return {"ok": True, "status": res.status, "bytes": len(res.body)}

    return {
        "verify": verify,
        "download": download,
        "fetch_bundle": fetch_bundle,
        "normalize_backend_url": normalize_backend_url,
    }
