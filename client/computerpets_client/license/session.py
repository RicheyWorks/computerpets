"""Unlock session. No always-licensed path — missing backend, bad ciphertext,
expiry, revoked jti, or hwid mismatch all fail closed.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Callable

from .decrypt import decrypt_license
from .errors import LicenseError
from .http_client import FetchImpl, create_license_client, normalize_backend_url
from .hwid import assert_hwid, resolve_hwid

STORE_NAME = "license.json"
DEFAULT_BACKEND = "http://127.0.0.1:8080"


def default_backend_url(env: dict[str, str] | None = None) -> str:
    env = env if env is not None else _os_env()
    raw = env.get("COMPUTERPETS_BACKEND_URL") or env.get("ENTERPRISEPET_BACKEND_URL") or DEFAULT_BACKEND
    return normalize_backend_url(raw)


def license_secret(env: dict[str, str] | None = None) -> str:
    env = env if env is not None else _os_env()
    return env.get("LICENSE_SECRET_KEY") or env.get("COMPUTERPETS_LICENSE_SECRET_KEY") or ""


def _os_env() -> dict[str, str]:
    import os

    return {k: v for k, v in os.environ.items() if v is not None}


def create_license_session(
    *,
    user_data_dir: str | Path,
    env: dict[str, str] | None = None,
    fetch_impl: FetchImpl | None = None,
    now: Callable[[], float] | None = None,
    hwid: str | None = None,
    read_file: Callable[[str], str] | None = None,
    write_file: Callable[[str, str], None] | None = None,
    mkdir: Callable[[str], None] | None = None,
) -> dict[str, Callable[..., Any]]:
    if not user_data_dir:
        raise LicenseError("missing_backend", "userDataDir is required")

    env = env if env is not None else _os_env()
    reader = read_file or (lambda p: Path(p).read_text(encoding="utf-8"))
    writer = write_file or (lambda p, data: Path(p).write_text(data, encoding="utf-8"))
    maker = mkdir or (lambda p: Path(p).mkdir(parents=True, exist_ok=True))
    store_file = str(Path(user_data_dir) / STORE_NAME)
    client = create_license_client(fetch_impl=fetch_impl)
    now_fn = now

    def load() -> dict[str, Any]:
        try:
            parsed = json.loads(reader(store_file))
            return parsed if isinstance(parsed, dict) else {}
        except (OSError, json.JSONDecodeError):
            return {}

    def save(data: dict[str, Any]) -> None:
        maker(str(Path(store_file).parent))
        writer(store_file, json.dumps(data, indent=2))

    def device_id() -> str:
        if isinstance(hwid, str) and hwid:
            return assert_hwid(hwid)
        return resolve_hwid(user_data_dir=user_data_dir, read_file=reader, write_file=writer)

    def decrypt_stored(store: dict[str, Any]) -> dict[str, Any] | None:
        license_body = store.get("license") or {}
        if not license_body.get("ciphertext") or not license_body.get("iv"):
            return None
        kwargs = {"now": now_fn} if now_fn else {}
        return decrypt_license(license_body["ciphertext"], license_body["iv"], license_secret(env), **kwargs)

    def public_status() -> dict[str, Any]:
        store = load()
        payload = None
        error = None
        try:
            payload = decrypt_stored(store)
        except LicenseError as err:
            error = {"code": err.code, "message": str(err)}
        except Exception as err:
            error = {"code": "decrypt_failed", "message": str(err)}

        backend_url = ""
        try:
            backend_url = store.get("backendUrl") or default_backend_url(env)
        except LicenseError as err:
            error = error or {"code": err.code, "message": str(err)}

        try:
            current_hwid = device_id()
        except LicenseError:
            current_hwid = ""

        return {
            "unlocked": bool(payload),
            "backendUrl": backend_url,
            "provider": store.get("provider") or "steam",
            "fields": store.get("fields") if isinstance(store.get("fields"), dict) else {},
            "hwid": current_hwid,
            "license": (
                {
                    "jti": payload["jti"],
                    "owner": payload["owner"],
                    "pet": payload["pet"],
                    "validUntil": payload["validUntil"],
                    "issuedAt": payload["issuedAt"],
                    "hwid": payload["hwid"],
                    "provider": store.get("provider"),
                }
                if payload
                else None
            ),
            "lastDownload": store.get("lastDownload"),
            "error": error,
        }

    def request_download(
        store_arg: dict[str, Any] | None = None,
        payload_arg: dict[str, Any] | None = None,
        device_id_arg: str | None = None,
        secret_arg: str | None = None,
    ) -> dict[str, Any]:
        store = store_arg if store_arg is not None else load()
        secret = secret_arg if secret_arg is not None else license_secret(env)
        kwargs = {"now": now_fn} if now_fn else {}
        payload = payload_arg or decrypt_license(store["license"]["ciphertext"], store["license"]["iv"], secret, **kwargs)
        current = device_id_arg or device_id()
        backend_url = normalize_backend_url(store.get("backendUrl") or default_backend_url(env))

        if payload.get("hwid") and payload["hwid"] != current:
            raise LicenseError("hwid_mismatch", "hardware binding mismatch")

        manifest = client["download"](
            backend_url=backend_url,
            pet_key=payload["pet"],
            ciphertext=store["license"]["ciphertext"],
            iv=store["license"]["iv"],
            hwid=current if payload.get("hwid") else None,
            token=(store.get("auth") or {}).get("token"),
            expect={"jti": payload["jti"], "petKey": payload["pet"], "owner": payload["owner"]},
            signing_key=env.get("BUNDLE_SIGNING_KEY") or None,
        )

        bundle: dict[str, Any] = {"ok": False, "status": 0, "bytes": 0, "error": None}
        try:
            bundle = client["fetch_bundle"](manifest["downloadUrl"])
        except LicenseError as err:
            bundle = {"ok": False, "status": 0, "bytes": 0, "error": str(err)}
        except Exception as err:
            bundle = {"ok": False, "status": 0, "bytes": 0, "error": str(err)}

        last_download = {
            "petKey": manifest.get("petKey") or payload["pet"],
            "downloadUrl": manifest["downloadUrl"],
            "expiresAt": manifest.get("expiresAt"),
            "jti": manifest.get("jti") or payload["jti"],
            "ttlSeconds": manifest.get("ttlSeconds"),
            "bundle": bundle,
        }
        save({**store, "lastDownload": last_download})
        return last_download

    def unlock(input_fields: dict[str, Any] | None = None) -> dict[str, Any]:
        input_fields = input_fields or {}
        store = load()
        backend_url = normalize_backend_url(
            input_fields.get("backendUrl") or store.get("backendUrl") or default_backend_url(env)
        )
        provider = input_fields.get("provider") if isinstance(input_fields.get("provider"), str) and input_fields.get("provider") else "steam"
        current = device_id()
        secret = license_secret(env)
        if not secret:
            raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing; cannot decrypt the issued license")

        fields: dict[str, str] = {
            "petType": input_fields["petType"] if isinstance(input_fields.get("petType"), str) and input_fields.get("petType") else "red_panda",
            "hwid": current,
        }
        if provider == "steam":
            if not input_fields.get("steamId") or not input_fields.get("appId"):
                raise LicenseError("denied", "steamId and appId are required")
            fields["steamId"] = str(input_fields["steamId"])
            fields["appId"] = str(input_fields["appId"])
        elif isinstance(input_fields.get("fields"), dict):
            fields.update({k: str(v) for k, v in input_fields["fields"].items() if v is not None})
            fields["hwid"] = current
        else:
            raise LicenseError("denied", f"unsupported provider {provider}")

        verified = client["verify"](backend_url=backend_url, provider=provider, fields=fields)
        kwargs = {"now": now_fn} if now_fn else {}
        payload = decrypt_license(verified["license"]["ciphertext"], verified["license"]["iv"], secret, **kwargs)

        if payload.get("hwid") and payload["hwid"] != current:
            raise LicenseError("hwid_mismatch", "issued license hwid does not match this device")

        next_store = {
            "backendUrl": backend_url,
            "provider": provider,
            "fields": {
                "steamId": fields.get("steamId"),
                "appId": fields.get("appId"),
                "petType": fields.get("petType"),
            },
            "license": {
                "ciphertext": verified["license"]["ciphertext"],
                "iv": verified["license"]["iv"],
                "expiresAt": verified["license"].get("expiresAt"),
            },
            "auth": {
                "token": verified["auth"]["token"],
                "expiresAt": verified["auth"].get("expiresAt"),
            },
            "lastDownload": None,
        }
        save(next_store)
        downloaded = request_download(next_store, payload, current, secret)
        return {**public_status(), "download": downloaded}

    def download() -> dict[str, Any]:
        return request_download()

    def clear() -> dict[str, Any]:
        save({})
        return public_status()

    return {
        "status": public_status,
        "unlock": unlock,
        "download": download,
        "clear": clear,
        "hwid": device_id,
    }
