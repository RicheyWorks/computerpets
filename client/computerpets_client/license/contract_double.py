"""TEST ONLY. Stand-in for the house backend. Speaks the published contract.

Not imported by the running client.
"""

from __future__ import annotations

import json
import time
import uuid
from typing import Any
from urllib.parse import quote, urlparse

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from .http_client import HttpResponse
from .signed_url import download_mac_message, sign_download_mac


def encrypt_license(payload: dict[str, Any], secret_b64: str) -> dict[str, str]:
    import base64
    import os

    key = base64.b64decode(secret_b64)
    iv = os.urandom(12)
    packed = AESGCM(key).encrypt(iv, json.dumps(payload).encode("utf-8"), None)
    return {
        "ciphertext": base64.b64encode(packed).decode("ascii"),
        "iv": base64.b64encode(iv).decode("ascii"),
        "expiresAt": payload["validUntil"],
    }


def create_contract_test_double(
    *,
    license_secret: str,
    signing_key: str = "test-bundle-signing-key-not-a-placeholder",
    revoked_jtis: set[str] | None = None,
    deny_steam_ids: list[str] | None = None,
    cdn_bytes: bytes | None = None,
) -> dict[str, Any]:
    issued: dict[str, dict[str, Any]] = {}
    revoked = revoked_jtis if revoked_jtis is not None else set()
    deny = set(deny_steam_ids or [])
    calls: list[dict[str, Any]] = []

    def json_response(status: int, body: dict[str, Any]) -> HttpResponse:
        return HttpResponse(status, json.dumps(body).encode("utf-8"), {"Content-Type": "application/json"})

    def fetch_impl(
        url: str,
        *,
        method: str = "GET",
        headers: dict[str, str] | None = None,
        body: bytes | None = None,
        timeout: float = 12.0,
    ) -> HttpResponse:
        parsed = urlparse(url)
        payload: dict[str, Any] = {}
        if body:
            try:
                payload = json.loads(body.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                payload = {}
        headers = headers or {}
        calls.append({"method": method.upper(), "path": parsed.path, "query": parsed.query, "body": payload, "headers": headers})

        if method.upper() == "POST" and parsed.path.startswith("/api/verify/"):
            provider = parsed.path.rsplit("/", 1)[-1]
            if provider != "steam":
                return json_response(404, {"error": "unknown provider", "provider": provider, "validProviders": "steam"})
            if not payload.get("steamId") or not payload.get("appId"):
                return json_response(403, {"error": "steamId and appId are required", "provider": "steam"})
            if isinstance(payload.get("hwid"), str) and len(payload["hwid"]) > 128:
                return json_response(400, {"error": "hwid too long", "maxLength": 128})
            if payload["steamId"] in deny:
                return json_response(403, {"error": "ownership not verified", "provider": "steam"})
            now = time.time()
            valid_until = time.strftime("%Y-%m-%dT%H:%M:%S.000000Z", time.gmtime(now + 365 * 86400))
            issued_at = time.strftime("%Y-%m-%dT%H:%M:%S.000000Z", time.gmtime(now))
            jti = str(uuid.uuid4())
            pet = str(payload.get("petType") or "").strip() or "red_panda"
            hwid = str(payload["hwid"]).strip() if payload.get("hwid") else None
            license_payload = {
                "jti": jti,
                "owner": payload["steamId"],
                "pet": pet,
                "validUntil": valid_until,
                "issuedAt": issued_at,
                "hwid": hwid,
            }
            license_body = encrypt_license(license_payload, license_secret)
            issued[jti] = {"payload": license_payload, "license": license_body, "provider": "steam"}
            return json_response(
                200,
                {
                    "status": "success",
                    "provider": "steam",
                    "license": license_body,
                    "auth": {
                        "token": f"test.{jti}",
                        "tokenType": "Bearer",
                        "expiresInSeconds": 1800,
                        "expiresAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now + 1800)),
                    },
                    "pet": {"key": pet, "displayName": "Red Panda"},
                    "message": "Steam ownership verified. License issued.",
                },
            )

        if method.upper() == "POST" and parsed.path.startswith("/api/download/"):
            pet_key = parsed.path.rsplit("/", 1)[-1]
            auth = headers.get("Authorization") or headers.get("authorization") or ""
            if not str(auth).startswith("Bearer "):
                return json_response(401, {"error": "missing bearer"})
            token = str(auth)[len("Bearer ") :]
            jti_from_token = token[5:] if token.startswith("test.") else None
            record = issued.get(jti_from_token) if jti_from_token else None
            if not record:
                return json_response(401, {"error": "license missing, expired, or tampered"})
            if record["payload"]["jti"] in revoked:
                return json_response(401, {"error": "license missing, expired, or tampered"})
            if payload.get("ciphertext") != record["license"]["ciphertext"] or payload.get("iv") != record["license"]["iv"]:
                return json_response(401, {"error": "license missing, expired, or tampered"})
            if record["payload"]["pet"] != pet_key:
                return json_response(403, {"error": "license is not valid for the requested pet"})
            if record["payload"].get("hwid") and payload.get("hwid") != record["payload"]["hwid"]:
                return json_response(
                    403,
                    {"error": "hardware binding mismatch", "hint": "This license is bound to a specific device"},
                )
            exp = int(time.time()) + 900
            message = download_mac_message(
                {
                    "petKey": pet_key,
                    "owner": record["payload"]["owner"],
                    "jti": record["payload"]["jti"],
                    "exp": exp,
                }
            )
            sig = sign_download_mac(message, signing_key)
            download_url = (
                f"https://cdn.enterprisepet.example/bundles/{pet_key}.zip"
                f"?owner={quote(record['payload']['owner'], safe='')}"
                f"&jti={quote(record['payload']['jti'], safe='')}"
                f"&exp={exp}&sig={sig}"
            )
            return json_response(
                200,
                {
                    "petKey": pet_key,
                    "displayName": "Red Panda",
                    "rarity": "COMMON",
                    "downloadUrl": download_url,
                    "expiresAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(exp)),
                    "ttlSeconds": 900,
                    "jti": record["payload"]["jti"],
                },
            )

        if method.upper() == "GET" and parsed.hostname == "cdn.enterprisepet.example":
            return HttpResponse(200, cdn_bytes or b"PK\x03\x04fake-zip", {"Content-Type": "application/zip"})

        return json_response(404, {"error": "not found"})

    return {
        "fetch_impl": fetch_impl,
        "calls": calls,
        "issued": issued,
        "revoked": revoked,
        "encrypt_license": encrypt_license,
    }
