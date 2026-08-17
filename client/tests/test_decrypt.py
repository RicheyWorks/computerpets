"""AES-256-GCM decrypt — CLIENT-CONTRACT.md §3. Mirrors desktop/license/decrypt.test.cjs."""

from __future__ import annotations

import base64
import os
from datetime import datetime, timedelta, timezone

import pytest

from computerpets_client.license.contract_double import encrypt_license
from computerpets_client.license.decrypt import GCM_IV_BYTES, decode_license_key, decrypt_license
from computerpets_client.license.errors import LicenseError

SECRET = base64.b64encode(bytes([7] * 32)).decode("ascii")


def payload(**over):
    now = datetime.now(timezone.utc)
    body = {
        "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
        "owner": "76561198000000000",
        "pet": "red_panda",
        "validUntil": (now + timedelta(days=1)).isoformat().replace("+00:00", "Z"),
        "issuedAt": now.isoformat().replace("+00:00", "Z"),
        "hwid": "device-abc-123",
    }
    body.update(over)
    return body


def test_decrypts_aes_256_gcm_no_kdf_12_byte_iv_appended_tag():
    body = payload()
    enc = encrypt_license(body, SECRET)
    iv = base64.b64decode(enc["iv"])
    packed = base64.b64decode(enc["ciphertext"])
    assert len(iv) == GCM_IV_BYTES
    assert len(packed) > 16

    got = decrypt_license(enc["ciphertext"], enc["iv"], SECRET)
    assert got["jti"] == body["jti"]
    assert got["owner"] == body["owner"]
    assert got["pet"] == body["pet"]
    assert got["hwid"] == body["hwid"]
    assert got["validUntil"] == body["validUntil"]
    assert got["issuedAt"] == body["issuedAt"]


def test_unbound_hwid_is_null():
    enc = encrypt_license(payload(hwid=None), SECRET)
    assert decrypt_license(enc["ciphertext"], enc["iv"], SECRET)["hwid"] is None


def test_license_secret_is_32_bytes_no_salt():
    key = decode_license_key(SECRET)
    assert len(key) == 32
    assert key == bytes([7] * 32)


def test_fails_closed_on_tampered_ciphertext():
    enc = encrypt_license(payload(), SECRET)
    buf = bytearray(base64.b64decode(enc["ciphertext"]))
    buf[0] ^= 0xFF
    with pytest.raises(LicenseError) as caught:
        decrypt_license(base64.b64encode(buf).decode("ascii"), enc["iv"], SECRET)
    assert caught.value.code == "decrypt_failed"


def test_fails_closed_on_wrong_key():
    enc = encrypt_license(payload(), SECRET)
    other = base64.b64encode(bytes([9] * 32)).decode("ascii")
    with pytest.raises(LicenseError) as caught:
        decrypt_license(enc["ciphertext"], enc["iv"], other)
    assert caught.value.code == "decrypt_failed"


def test_fails_closed_on_short_iv():
    enc = encrypt_license(payload(), SECRET)
    short_iv = base64.b64encode(os.urandom(8)).decode("ascii")
    with pytest.raises(LicenseError) as caught:
        decrypt_license(enc["ciphertext"], short_iv, SECRET)
    assert caught.value.code == "decrypt_failed"


def test_fails_closed_on_expired_valid_until():
    enc = encrypt_license(payload(validUntil=(datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat().replace("+00:00", "Z")), SECRET)
    with pytest.raises(LicenseError) as caught:
        decrypt_license(enc["ciphertext"], enc["iv"], SECRET)
    assert caught.value.code == "expired"


def test_fails_closed_when_secret_missing():
    enc = encrypt_license(payload(), SECRET)
    with pytest.raises(LicenseError) as caught:
        decrypt_license(enc["ciphertext"], enc["iv"], "")
    assert caught.value.code == "missing_secret"


def test_fails_closed_on_url_safe_base64():
    enc = encrypt_license(payload(), SECRET)
    url_safe = enc["ciphertext"].replace("+", "-").replace("/", "_")
    if url_safe == enc["ciphertext"]:
        with pytest.raises(LicenseError) as caught:
            decrypt_license("abc-def_ghi", enc["iv"], SECRET)
        assert caught.value.code == "decrypt_failed"
        return
    with pytest.raises(LicenseError) as caught:
        decrypt_license(url_safe, enc["iv"], SECRET)
    assert caught.value.code == "decrypt_failed"


def test_fails_closed_when_required_fields_missing():
    enc = encrypt_license(
        {
            "owner": "x",
            "pet": "red_panda",
            "validUntil": payload()["validUntil"],
            "issuedAt": payload()["issuedAt"],
        },
        SECRET,
    )
    with pytest.raises(LicenseError) as caught:
        decrypt_license(enc["ciphertext"], enc["iv"], SECRET)
    assert caught.value.code == "decrypt_failed"
