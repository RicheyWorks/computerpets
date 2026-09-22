"""Bundle zip layout + fail-closed update rules."""

import io
import json
import zipfile

from computerpets_client.license.bundle_zip import (
    FORMAT,
    MANIFEST_NAME,
    accept_bundle_bytes,
    already_current,
    sha256_hex,
)


def _good_zip(pet_key: str = "red_panda", version: str = "1.0.0", platform: str = "win") -> tuple[bytes, str]:
    sprite = bytes([1, 2, 3, 4, 5])
    manifest = json.dumps(
        {
            "format": FORMAT,
            "petKey": pet_key,
            "version": version,
            "platform": platform,
            "files": [{"path": "sprites/sit/1.png", "sha256": sha256_hex(sprite)}],
        }
    ).encode("utf-8")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_STORED) as zf:
        zf.writestr(MANIFEST_NAME, manifest)
        zf.writestr("sprites/sit/1.png", sprite)
    raw = buf.getvalue()
    return raw, sha256_hex(raw)


def test_empty_expectation_is_opaque():
    decision = accept_bundle_bytes(b"abc", {})
    assert decision["action"] == "opaque"
    assert decision["accepted"] is True


def test_version_without_sha_refuses():
    decision = accept_bundle_bytes(
        b"x",
        {"petKey": "red_panda", "version": "1.0.0", "platform": "win"},
    )
    assert decision["error"] == "bundle_sha256_missing"


def test_sha_mismatch_refuses():
    raw, _ = _good_zip()
    decision = accept_bundle_bytes(
        raw,
        {
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "sha256": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        },
    )
    assert decision["error"] == "bundle_sha256_mismatch"


def test_valid_zip_installs():
    raw, digest = _good_zip()
    decision = accept_bundle_bytes(
        raw,
        {
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "sha256": digest,
        },
    )
    assert decision["action"] == "install"
    assert decision["accepted"] is True
    assert decision["memberCount"] == 1


def test_matching_local_is_current():
    raw, digest = _good_zip()
    expect = {
        "petKey": "red_panda",
        "version": "1.0.0",
        "platform": "win",
        "sha256": digest,
        "local": {
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "sha256": digest,
        },
    }
    assert already_current(expect) is True
    assert accept_bundle_bytes(raw, expect)["action"] == "current"


def test_missing_manifest_refuses():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("sprites/sit/1.png", b"abcd")
    raw = buf.getvalue()
    decision = accept_bundle_bytes(
        raw,
        {
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "sha256": sha256_hex(raw),
        },
    )
    assert decision["error"] == "bundle_zip_invalid"


def test_unknown_manifest_field_refuses():
    sprite = b"hello"
    manifest = json.dumps(
        {
            "format": FORMAT,
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "price": "9.99",
            "files": [{"path": "sprites/sit/1.png", "sha256": sha256_hex(sprite)}],
        }
    ).encode("utf-8")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr(MANIFEST_NAME, manifest)
        zf.writestr("sprites/sit/1.png", sprite)
    raw = buf.getvalue()
    decision = accept_bundle_bytes(
        raw,
        {
            "petKey": "red_panda",
            "version": "1.0.0",
            "platform": "win",
            "sha256": sha256_hex(raw),
        },
    )
    assert decision["error"] == "bundle_zip_invalid"
