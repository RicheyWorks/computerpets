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
from .hwid import assert_hwid, peek_hwid, resolve_hwid_detail
from .license_net import get_signed_bundle, post_license_hash, post_unbound_download
from .bundle_zip import already_current

STORE_NAME = "license.json"
DEFAULT_BACKEND = "http://127.0.0.1:8081"
NO_LICENSE_MESSAGE = "No license on this computer yet. Unlock a pet first, then download it."
NO_TOKEN_MESSAGE = (
    "The sign-in from the last unlock is not on this computer anymore, so nothing was downloaded. "
    "Unlock again, then download. Pets still work without it."
)
FIELDS_MISSING_MESSAGE = "Fill in the Steam ID and the App ID first. Pets still work without it."
TOKEN_MEMORY_NOTE = (
    "This computer has no secret store, so the download sign-in is kept only until the app closes. "
    "Unlock again later to download."
)
TOKEN_GONE_NOTE = "The download sign-in was kept only until the app last closed. Unlock again before a Signed download."


def _has_stored_license(store: dict[str, Any] | None) -> bool:
    """True when license.json holds an issued license (ciphertext + iv)."""
    body = store.get("license") if isinstance(store, dict) else None
    if not isinstance(body, dict):
        return False
    ciphertext, iv = body.get("ciphertext"), body.get("iv")
    return isinstance(ciphertext, str) and bool(ciphertext) and isinstance(iv, str) and bool(iv)


def default_backend_url(env: dict[str, str] | None = None) -> str:
    env = env if env is not None else _os_env()
    raw = env.get("COMPUTERPETS_BACKEND_URL") or env.get("ENTERPRISEPET_BACKEND_URL") or DEFAULT_BACKEND
    return normalize_backend_url(raw)


def _shown_license_line(fields: dict[str, Any] | None) -> str:
    raw = (fields or {}).get("licenseLine")
    return raw if isinstance(raw, str) else ""


def _shown_cdn_line(fields: dict[str, Any] | None) -> str:
    raw = (fields or {}).get("cdnLine")
    return raw if isinstance(raw, str) else ""


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
    codec: Any = None,
) -> dict[str, Callable[..., Any]]:
    """``codec`` seals the download sign-in (see token_store.py): an object with
    ``encrypt``/``decrypt``, or a no-argument callable returning one (or None).
    license.json keeps ``auth.sealedToken`` with a codec and no token at all without one;
    this run holds the token in memory either way. It is never written in plain text.
    """
    if not user_data_dir:
        raise LicenseError("missing_backend", "userDataDir is required")

    env = env if env is not None else _os_env()
    reader = read_file or (lambda p: Path(p).read_text(encoding="utf-8"))
    writer = write_file or (lambda p, data: Path(p).write_text(data, encoding="utf-8"))
    maker = mkdir or (lambda p: Path(p).mkdir(parents=True, exist_ok=True))
    store_file = str(Path(user_data_dir) / STORE_NAME)
    client = create_license_client(fetch_impl=fetch_impl)
    now_fn = now
    held: dict[str, str] = {}

    def load() -> dict[str, Any]:
        data = read_disk()
        auth = data.get("auth")
        token = auth.get("token") if isinstance(auth, dict) else None
        if isinstance(token, str) and token:
            # An older license.json kept the sign-in in plain text: hold it for this run, then seal
            # it (or drop it when there is no store) once. It is never written in plain text again.
            body = data.get("license") if isinstance(data.get("license"), dict) else {}
            held.clear()
            held.update({"token": token, "ciphertext": str(body.get("ciphertext") or "")})
            data = {**data, "auth": disk_auth(auth)}
            try:
                maker(str(Path(store_file).parent))
                writer(store_file, json.dumps(data, indent=2))
            except OSError:
                pass
        return data

    def read_disk() -> dict[str, Any]:
        try:
            parsed = json.loads(reader(store_file))
            return parsed if isinstance(parsed, dict) else {}
        except (OSError, json.JSONDecodeError):
            return {}

    def token_codec() -> Any:
        try:
            found = codec() if callable(codec) and not hasattr(codec, "encrypt") else codec
        except Exception:  # noqa: BLE001 — a store that will not open is no store
            found = None
        if found is not None and callable(getattr(found, "encrypt", None)) and callable(getattr(found, "decrypt", None)):
            return found
        return None

    def disk_auth(auth: Any) -> Any:
        """What license.json may keep of the sign-in: a sealed token, or only its expiry."""
        if not isinstance(auth, dict):
            return auth
        expires = auth.get("expiresAt")
        token = auth.get("token")
        if not isinstance(token, str) or not token:
            sealed_prev = auth.get("sealedToken")
            if isinstance(sealed_prev, str) and sealed_prev:
                return {"sealedToken": sealed_prev, "expiresAt": expires}
            return {"expiresAt": expires}
        found = token_codec()
        sealed = ""
        if found is not None:
            try:
                sealed = str(found.encrypt(token) or "")
            except Exception:  # noqa: BLE001
                sealed = ""
        if sealed and sealed != token:
            return {"sealedToken": sealed, "expiresAt": expires}
        return {"expiresAt": expires}

    def save(data: dict[str, Any]) -> None:
        out = dict(data) if isinstance(data, dict) else {}
        if out.get("auth"):
            out["auth"] = disk_auth(out["auth"])
        maker(str(Path(store_file).parent))
        writer(store_file, json.dumps(out, indent=2))

    def token_of(store: dict[str, Any]) -> str:
        """The sign-in for a download: in memory, sealed on disk, or an older plain license.json."""
        auth = store.get("auth") if isinstance(store.get("auth"), dict) else {}
        token = auth.get("token")
        if isinstance(token, str) and token:
            return token
        sealed = auth.get("sealedToken")
        if isinstance(sealed, str) and sealed:
            found = token_codec()
            if found is not None:
                try:
                    opened = str(found.decrypt(sealed) or "")
                    if opened:
                        return opened
                except Exception:  # noqa: BLE001 — a seal this store cannot open
                    pass
        body = store.get("license") if isinstance(store.get("license"), dict) else {}
        if held.get("token") and body.get("ciphertext") == held.get("ciphertext"):
            return held["token"]
        return ""

    def device_mark(allow_read: bool, allow_weak: bool = False) -> dict[str, Any]:
        if isinstance(hwid, str) and hwid:
            return {"id": assert_hwid(hwid), "source": "caller", "read": "caller", "rawLeavesMachine": False}
        peeked = peek_hwid(user_data_dir=user_data_dir, read_file=reader)
        if not allow_read or peeked["read"] == "stored":
            return peeked
        return resolve_hwid_detail(
            user_data_dir=user_data_dir,
            read_file=reader,
            write_file=writer,
            mkdir=maker,
            allow_weak_fallback=allow_weak is True,
        )

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
            mark = device_mark(False)
        except LicenseError:
            mark = {"id": "", "source": "hwid.txt", "read": "rejected", "rawLeavesMachine": False}

        return {
            "unlocked": bool(payload),
            "backendUrl": backend_url,
            "provider": store.get("provider") or "steam",
            "fields": store.get("fields") if isinstance(store.get("fields"), dict) else {},
            "hwid": mark["id"],
            "hwidMark": {
                "read": mark["read"],
                "source": mark["source"],
                "rawLeavesMachine": False,
                "phoneHome": "hash-on-unlock-and-bound-download",
            },
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
            "tokenKept": token_kept(store) if payload else "none",
            "error": error,
        }

    def token_kept(store: dict[str, Any]) -> str:
        """Where the download sign-in lives: "sealed" (OS store), "memory" (this run only), or "none"."""
        auth = store.get("auth") if isinstance(store.get("auth"), dict) else {}
        if isinstance(auth.get("sealedToken"), str) and auth["sealedToken"]:
            return "sealed"
        body = store.get("license") if isinstance(store.get("license"), dict) else {}
        if held.get("token") and body.get("ciphertext") == held.get("ciphertext"):
            return "memory"
        return "none"

    def request_download(
        store_arg: dict[str, Any] | None = None,
        payload_arg: dict[str, Any] | None = None,
        device_id_arg: str | None = None,
        secret_arg: str | None = None,
        allow_weak_fallback: bool = False,
        license_line: str = "",
        cdn_line: str = "",
    ) -> dict[str, Any]:
        store = store_arg if store_arg is not None else load()
        # Never unlocked, or Lock cleared it: say so before any decrypt or POST.
        if not _has_stored_license(store):
            raise LicenseError("no_license", NO_LICENSE_MESSAGE)
        secret = secret_arg if secret_arg is not None else license_secret(env)
        kwargs = {"now": now_fn} if now_fn else {}
        payload = payload_arg or decrypt_license(store["license"]["ciphertext"], store["license"]["iv"], secret, **kwargs)
        bound = bool(payload.get("hwid"))
        backend_url = normalize_backend_url(store.get("backendUrl") or default_backend_url(env))
        shown = license_line if isinstance(license_line, str) else ""
        token = token_of(store)

        def post() -> dict[str, Any]:
            current = device_id_arg or (device_mark(True, allow_weak_fallback is True)["id"] if bound else "")
            if bound and payload.get("hwid") != current:
                raise LicenseError("hwid_mismatch", "hardware binding mismatch")
            if not token:
                raise LicenseError("no_token", NO_TOKEN_MESSAGE)
            return client["download"](
                backend_url=backend_url,
                pet_key=payload["pet"],
                ciphertext=store["license"]["ciphertext"],
                iv=store["license"]["iv"],
                hwid=current if payload.get("hwid") else None,
                token=token,
                expect={"jti": payload["jti"], "petKey": payload["pet"], "owner": payload["owner"]},
                signing_key=env.get("BUNDLE_SIGNING_KEY") or None,
            )

        poster = post_license_hash if bound else post_unbound_download
        manifest = poster(shown, backend_url, post)
        expect = _catalog_expect(manifest if isinstance(manifest, dict) else {}, store)
        if already_current(expect):
            bundle = {
                "ok": True,
                "status": 0,
                "bytes": 0,
                "held": False,
                "update": "current",
                "petKey": expect["petKey"],
                "version": expect["version"],
                "platform": expect["platform"],
                "sha256": expect["sha256"],
            }
        elif expect.get("version") and not expect.get("sha256"):
            bundle = {
                "ok": False,
                "status": 0,
                "bytes": 0,
                "held": False,
                "update": "refuse",
                "error": "bundle_sha256_missing",
            }
        else:
            bundle = _read_bundle(
                manifest["downloadUrl"], cdn_line if isinstance(cdn_line, str) else "", False, expect
            )

        last_download = {
            "petKey": manifest.get("petKey") or payload["pet"],
            "downloadUrl": manifest["downloadUrl"],
            "expiresAt": manifest.get("expiresAt"),
            "jti": manifest.get("jti") or payload["jti"],
            "ttlSeconds": manifest.get("ttlSeconds"),
            "version": manifest.get("version") if isinstance(manifest.get("version"), str) else None,
            "platform": manifest.get("platform") if isinstance(manifest.get("platform"), str) else None,
            "sha256": manifest.get("sha256") if isinstance(manifest.get("sha256"), str) else None,
            "filename": manifest.get("filename") if isinstance(manifest.get("filename"), str) else None,
            "bundle": bundle,
        }
        next_store = {**store, "lastDownload": last_download}
        if (
            isinstance(bundle, dict)
            and bundle.get("ok")
            and bundle.get("update") in {"install", "replace", "current"}
            and bundle.get("sha256")
            and bundle.get("version")
            and bundle.get("petKey")
        ):
            next_store["installedBundle"] = {
                "petKey": bundle["petKey"],
                "version": bundle["version"],
                "platform": bundle.get("platform"),
                "sha256": bundle["sha256"],
            }
        # save() seals or drops a plain token an older license.json still carried.
        save(next_store)
        return last_download

    def _catalog_expect(manifest: dict[str, Any], store: dict[str, Any]) -> dict[str, Any]:
        local = store.get("installedBundle") if isinstance(store.get("installedBundle"), dict) else None
        return {
            "petKey": manifest.get("petKey") if isinstance(manifest.get("petKey"), str) else None,
            "version": manifest.get("version") if isinstance(manifest.get("version"), str) else None,
            "platform": manifest.get("platform") if isinstance(manifest.get("platform"), str) else None,
            "sha256": manifest.get("sha256") if isinstance(manifest.get("sha256"), str) else None,
            "local": local,
        }

    def _read_bundle(
        download_url: str, shown: str, strict: bool = False, expect: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        def fetch() -> dict[str, Any]:
            try:
                bundle = client["fetch_bundle"](download_url, expect)
            except LicenseError as err:
                return {"ok": False, "status": 0, "bytes": 0, "held": False, "error": str(err)}
            except Exception as err:
                return {"ok": False, "status": 0, "bytes": 0, "held": False, "error": str(err)}
            if isinstance(bundle, dict):
                return {**bundle, "held": False}
            return {"ok": False, "status": 0, "bytes": 0, "held": False}

        return get_signed_bundle(shown, download_url, fetch, strict)

    def unlock(input_fields: dict[str, Any] | None = None) -> dict[str, Any]:
        input_fields = input_fields or {}
        store = load()
        backend_url = normalize_backend_url(
            input_fields.get("backendUrl") or store.get("backendUrl") or default_backend_url(env)
        )
        provider = input_fields.get("provider") if isinstance(input_fields.get("provider"), str) and input_fields.get("provider") else "steam"
        allow_weak = input_fields.get("allowWeakFallback") is True

        def open_hash() -> dict[str, Any]:
            current_id = device_mark(True, allow_weak)["id"]
            secret_key = license_secret(env)
            if not secret_key:
                raise LicenseError("missing_secret", "LICENSE_SECRET_KEY is missing; cannot decrypt the issued license")
            fields_out: dict[str, str] = {
                "petType": input_fields["petType"] if isinstance(input_fields.get("petType"), str) and input_fields.get("petType") else "red_panda",
                "hwid": current_id,
            }
            if provider == "steam":
                if not str(input_fields.get("steamId") or "").strip() or not str(input_fields.get("appId") or "").strip():
                    raise LicenseError("fields_missing", FIELDS_MISSING_MESSAGE)
                fields_out["steamId"] = str(input_fields["steamId"])
                fields_out["appId"] = str(input_fields["appId"])
            elif isinstance(input_fields.get("fields"), dict):
                fields_out.update({k: str(v) for k, v in input_fields["fields"].items() if v is not None})
                fields_out["hwid"] = current_id
            else:
                raise LicenseError("denied", f"unsupported provider {provider}")
            verified_body = client["verify"](
                backend_url=backend_url,
                provider=provider,
                fields=fields_out,
                license_secret=secret_key,
            )
            return {"current": current_id, "secret": secret_key, "fields": fields_out, "verified": verified_body}

        opened = post_license_hash(_shown_license_line(input_fields), backend_url, open_hash)
        current = opened["current"]
        secret = opened["secret"]
        fields = opened["fields"]
        verified = opened["verified"]
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
        held.clear()
        held.update({"token": verified["auth"]["token"], "ciphertext": verified["license"]["ciphertext"]})
        save(next_store)
        downloaded = request_download(
            next_store,
            payload,
            current,
            secret,
            allow_weak_fallback=allow_weak,
            license_line=_shown_license_line(input_fields),
            cdn_line=_shown_cdn_line(input_fields),
        )
        return {**public_status(), "download": downloaded}

    def download(input_fields: dict[str, Any] | None = None) -> dict[str, Any]:
        allow = bool(input_fields and input_fields.get("allowWeakFallback") is True)
        return request_download(
            allow_weak_fallback=allow,
            license_line=_shown_license_line(input_fields),
            cdn_line=_shown_cdn_line(input_fields),
        )

    def fetch_signed(input_fields: dict[str, Any] | None = None) -> dict[str, Any]:
        store = load()
        last = store.get("lastDownload") if isinstance(store.get("lastDownload"), dict) else {}
        download_url = last.get("downloadUrl") if isinstance(last.get("downloadUrl"), str) else ""
        if not download_url:
            raise LicenseError("signed_url_invalid", "downloadUrl missing")
        shown = _shown_cdn_line(input_fields)
        expect = _catalog_expect(last, store)
        bundle = _read_bundle(download_url, shown, True, expect)
        next_download = {**last, "bundle": bundle}
        next_store = {**store, "lastDownload": next_download}
        if (
            isinstance(bundle, dict)
            and bundle.get("ok")
            and bundle.get("update") in {"install", "replace", "current"}
            and bundle.get("sha256")
            and bundle.get("version")
            and bundle.get("petKey")
        ):
            next_store["installedBundle"] = {
                "petKey": bundle["petKey"],
                "version": bundle["version"],
                "platform": bundle.get("platform"),
                "sha256": bundle["sha256"],
            }
        save(next_store)
        return next_download

    def clear() -> dict[str, Any]:
        held.clear()
        found = token_codec()
        if found is not None and callable(getattr(found, "forget", None)):
            try:
                found.forget()
            except Exception:  # noqa: BLE001
                pass
        save({})
        return public_status()

    return {
        "status": public_status,
        "unlock": unlock,
        "download": download,
        "fetch_signed": fetch_signed,
        "clear": clear,
        "hwid": lambda: device_mark(True)["id"],
    }
