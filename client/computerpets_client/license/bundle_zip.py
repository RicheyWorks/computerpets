"""Pet-bundle zip layout (computerpets.bundle/v1) and fail-closed update rules.

Mirrors ``BundleZipContract`` / ``desktop/license/bundle-zip.cjs``.
"""

from __future__ import annotations

import hashlib
import io
import json
import zipfile
from typing import Any

from .errors import LicenseError

FORMAT = "computerpets.bundle/v1"
MANIFEST_NAME = "manifest.json"
VERSION_RE = __import__("re").compile(r"^[A-Za-z0-9._+-]{1,64}$")
SHA256_RE = __import__("re").compile(r"^[0-9a-f]{64}$")
MEMBER_PATH_RE = __import__("re").compile(
    r"^(sprites|cries|meta)/[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)*$"
)
PLATFORMS = frozenset({"win", "mac", "linux", "any"})


def blank_to_null(value: object) -> str | None:
    if not isinstance(value, str):
        return None
    trimmed = value.strip()
    return trimmed or None


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def constant_time_equals(a: object, b: object) -> bool:
    if not isinstance(a, str) or not isinstance(b, str):
        return False
    left = a.encode("utf-8")
    right = b.encode("utf-8")
    if len(left) != len(right):
        length = max(len(left), len(right))
        diff = len(left) ^ len(right)
        for i in range(length):
            lb = left[i] if i < len(left) else 0
            rb = right[i] if i < len(right) else 0
            diff |= lb ^ rb
        return False
    diff = 0
    for i, ch in enumerate(left):
        diff |= ch ^ right[i]
    return diff == 0


def _normalize_expect(raw: object) -> dict[str, Any]:
    expect = raw if isinstance(raw, dict) else {}
    local_raw = expect.get("local") if isinstance(expect.get("local"), dict) else None
    return {
        "petKey": blank_to_null(expect.get("petKey")),
        "version": blank_to_null(expect.get("version")),
        "platform": blank_to_null(expect.get("platform")),
        "sha256": blank_to_null(expect.get("sha256")),
        "local": (
            {
                "petKey": blank_to_null(local_raw.get("petKey")),
                "version": blank_to_null(local_raw.get("version")),
                "platform": blank_to_null(local_raw.get("platform")),
                "sha256": blank_to_null(local_raw.get("sha256")),
            }
            if local_raw is not None
            else None
        ),
    }


def claims_catalog_integrity(expect: dict[str, Any]) -> bool:
    return bool(expect.get("version") or expect.get("sha256"))


def already_current(raw: object) -> bool:
    expect = _normalize_expect(raw)
    if not claims_catalog_integrity(expect):
        return False
    if not expect["sha256"] or not expect["version"] or not expect["petKey"]:
        return False
    if not SHA256_RE.match(expect["sha256"]):
        return False
    local = expect["local"]
    if not local or not local["sha256"] or not local["version"] or not local["petKey"]:
        return False
    if expect["petKey"] != local["petKey"]:
        return False
    if expect["version"] != local["version"]:
        return False
    if not constant_time_equals(expect["sha256"], local["sha256"]):
        return False
    if expect["platform"] and local["platform"] and expect["platform"] != local["platform"]:
        return False
    return True


def _refuse(code: str) -> dict[str, Any]:
    return {
        "action": "refuse",
        "error": code,
        "petKey": None,
        "version": None,
        "platform": None,
        "sha256": None,
        "memberCount": 0,
        "accepted": False,
    }


def read_layout(zip_bytes: bytes) -> dict[str, Any]:
    if not isinstance(zip_bytes, (bytes, bytearray)) or not zip_bytes:
        raise LicenseError("bundle_zip_invalid", "zip could not be read")
    try:
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
            members: dict[str, bytes] = {}
            for info in zf.infolist():
                name = info.filename
                if not name or name.endswith("/"):
                    continue
                if "\\" in name or name.startswith("/") or ".." in name:
                    raise LicenseError("bundle_zip_invalid", "unsafe zip member path")
                if name in members:
                    raise LicenseError("bundle_zip_invalid", "duplicate zip member")
                members[name] = zf.read(info)
    except LicenseError:
        raise
    except Exception as exc:  # noqa: BLE001 — fail closed on any zip parse error
        raise LicenseError("bundle_zip_invalid", "zip could not be read") from exc

    if not members:
        raise LicenseError("bundle_zip_invalid", "zip is empty")
    manifest_bytes = members.get(MANIFEST_NAME)
    if manifest_bytes is None:
        raise LicenseError("bundle_zip_invalid", "manifest.json missing at zip root")
    try:
        root = json.loads(manifest_bytes.decode("utf-8"))
    except Exception as exc:  # noqa: BLE001
        raise LicenseError("bundle_zip_invalid", "manifest.json is not JSON") from exc
    if not isinstance(root, dict):
        raise LicenseError("bundle_zip_invalid", "manifest.json must be an object")
    for field in root:
        if field not in {"format", "petKey", "version", "platform", "files"}:
            raise LicenseError("bundle_zip_invalid", "manifest has unknown field")
    if root.get("format") != FORMAT:
        raise LicenseError("bundle_zip_invalid", "unsupported bundle format")
    pet_key = blank_to_null(root.get("petKey"))
    if not pet_key:
        raise LicenseError("bundle_zip_invalid", "manifest petKey missing")
    version = blank_to_null(root.get("version"))
    if not version or not VERSION_RE.match(version):
        raise LicenseError("bundle_zip_invalid", "manifest version invalid")
    platform = blank_to_null(root.get("platform"))
    if not platform or platform not in PLATFORMS:
        raise LicenseError("bundle_zip_invalid", "manifest platform invalid")
    files = root.get("files")
    if not isinstance(files, list) or not files:
        raise LicenseError("bundle_zip_invalid", "manifest files missing")

    declared: set[str] = set()
    has_sprite = False
    for row in files:
        if not isinstance(row, dict):
            raise LicenseError("bundle_zip_invalid", "manifest files row invalid")
        path = blank_to_null(row.get("path"))
        file_sha = blank_to_null(row.get("sha256"))
        if not path or not MEMBER_PATH_RE.match(path):
            raise LicenseError("bundle_zip_invalid", "manifest file path invalid")
        if not file_sha or not SHA256_RE.match(file_sha):
            raise LicenseError("bundle_zip_invalid", "manifest file sha256 invalid")
        if path in declared:
            raise LicenseError("bundle_zip_invalid", "duplicate manifest file path")
        declared.add(path)
        body = members.get(path)
        if body is None:
            raise LicenseError("bundle_zip_invalid", "declared file missing from zip")
        if not constant_time_equals(sha256_hex(body), file_sha):
            raise LicenseError("bundle_zip_invalid", "member sha256 mismatch")
        if path.startswith("sprites/"):
            has_sprite = True
    if not has_sprite:
        raise LicenseError("bundle_zip_invalid", "bundle needs at least one sprites/ member")
    for name in members:
        if name == MANIFEST_NAME:
            continue
        if name not in declared:
            raise LicenseError("bundle_zip_invalid", "undeclared zip member")
    return {
        "petKey": pet_key.lower(),
        "version": version,
        "platform": platform,
        "memberCount": len(declared),
    }


def accept_bundle_bytes(zip_bytes: object, raw_expect: object = None) -> dict[str, Any]:
    expect = _normalize_expect(raw_expect)
    if not claims_catalog_integrity(expect):
        return {
            "action": "opaque",
            "error": None,
            "petKey": None,
            "version": None,
            "platform": None,
            "sha256": None,
            "memberCount": 0,
            "accepted": True,
        }
    if not expect["sha256"] or not SHA256_RE.match(expect["sha256"]):
        return _refuse("bundle_sha256_missing")
    if not expect["version"] or not VERSION_RE.match(expect["version"]):
        return _refuse("bundle_version_missing")
    if not expect["petKey"]:
        return _refuse("bundle_pet_missing")
    if not isinstance(zip_bytes, (bytes, bytearray)) or not zip_bytes:
        return _refuse("bundle_zip_missing")
    digest = sha256_hex(bytes(zip_bytes))
    if not constant_time_equals(digest, expect["sha256"]):
        return _refuse("bundle_sha256_mismatch")
    try:
        layout = read_layout(bytes(zip_bytes))
    except LicenseError as err:
        return _refuse(err.code if isinstance(err.code, str) else "bundle_zip_invalid")
    if expect["petKey"] != layout["petKey"]:
        return _refuse("bundle_pet_mismatch")
    if expect["version"] != layout["version"]:
        return _refuse("bundle_version_mismatch")
    if expect["platform"] and expect["platform"] != layout["platform"]:
        return _refuse("bundle_platform_mismatch")
    local = expect["local"]
    if (
        local
        and expect["petKey"] == local["petKey"]
        and expect["version"] == local["version"]
        and constant_time_equals(expect["sha256"], local["sha256"])
        and (not local["platform"] or local["platform"] == layout["platform"])
    ):
        return {
            "action": "current",
            "error": None,
            "petKey": layout["petKey"],
            "version": layout["version"],
            "platform": layout["platform"],
            "sha256": expect["sha256"],
            "memberCount": layout["memberCount"],
            "accepted": True,
        }
    action = "install" if (not local or not local["petKey"]) else "replace"
    return {
        "action": action,
        "error": None,
        "petKey": layout["petKey"],
        "version": layout["version"],
        "platform": layout["platform"],
        "sha256": expect["sha256"],
        "memberCount": layout["memberCount"],
        "accepted": True,
    }
