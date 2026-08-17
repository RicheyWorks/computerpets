"""Fail-closed unlock against a mocked backend. Mirrors desktop/license session + client tests."""

from __future__ import annotations

import base64
import json
from pathlib import Path

import pytest

from computerpets_client.license.contract_double import create_contract_test_double
from computerpets_client.license.errors import LicenseError
from computerpets_client.license.http_client import create_license_client
from computerpets_client.license.session import create_license_session

SECRET = base64.b64encode(bytes([7] * 32)).decode("ascii")
SIGNING = "test-bundle-signing-key-not-a-placeholder"


class MemoryFs:
    def __init__(self):
        self.files: dict[str, str] = {}

    def read(self, path: str) -> str:
        if path not in self.files:
            raise FileNotFoundError(path)
        return self.files[path]

    def write(self, path: str, data: str) -> None:
        self.files[path] = data

    def mkdir(self, path: str) -> None:
        return None


def session_for(backend, extra_env=None, hwid="device-abc-123", disk=None):
    disk = disk or MemoryFs()
    env = {
        "LICENSE_SECRET_KEY": SECRET,
        "BUNDLE_SIGNING_KEY": SIGNING,
        "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080",
    }
    if extra_env:
        env.update(extra_env)
    return create_license_session(
        user_data_dir="/tmp/cp-license-session",
        env=env,
        fetch_impl=backend["fetch_impl"],
        hwid=hwid,
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
    )


def test_unlocks_against_mocked_backend_using_published_contract():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    session = session_for(backend)

    result = session["unlock"](
        {"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"}
    )

    assert result["unlocked"] is True
    assert result["license"]["pet"] == "red_panda"
    assert result["license"]["owner"] == "76561198000000000"
    assert result["license"]["hwid"] == "device-abc-123"
    assert result["license"]["jti"]
    assert result["download"]["jti"] == result["license"]["jti"]
    assert "jti=" in result["download"]["downloadUrl"]
    assert result["download"]["bundle"]["ok"] is True

    verify = next(c for c in backend["calls"] if c["path"] == "/api/verify/steam")
    assert verify["body"]["hwid"] == "device-abc-123"
    download = next(c for c in backend["calls"] if c["path"] == "/api/download/red_panda")
    assert download["body"]["hwid"] == "device-abc-123"
    assert str(download["headers"]["Authorization"]).startswith("Bearer ")


def test_fails_closed_without_license_secret_no_always_licensed_stub():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    session = session_for(backend, {"LICENSE_SECRET_KEY": "", "COMPUTERPETS_LICENSE_SECRET_KEY": ""})
    with pytest.raises(LicenseError) as caught:
        session["unlock"]({"steamId": "1", "appId": "2"})
    assert caught.value.code == "missing_secret"
    assert session["status"]()["unlocked"] is False


def test_fails_closed_when_backend_url_is_missing():
    disk = MemoryFs()
    session = create_license_session(
        user_data_dir="/tmp/cp-license-session",
        env={"LICENSE_SECRET_KEY": SECRET, "COMPUTERPETS_BACKEND_URL": "", "ENTERPRISEPET_BACKEND_URL": ""},
        fetch_impl=lambda *a, **k: (_ for _ in ()).throw(RuntimeError("nope")),
        hwid="device-abc-123",
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
    )
    with pytest.raises(LicenseError) as caught:
        session["unlock"]({"steamId": "1", "appId": "2", "backendUrl": "not-a-url"})
    assert caught.value.code == "missing_backend"


def test_persisted_file_is_not_licensed_if_decrypt_fails():
    disk = MemoryFs()
    store = str(Path("/tmp/cp-license-session") / "license.json")
    disk.write(
        store,
        json.dumps({"license": {"ciphertext": "dGFtcGVyZWQ=", "iv": base64.b64encode(bytes(12)).decode("ascii")}, "auth": {"token": "nope"}}),
    )
    session = create_license_session(
        user_data_dir="/tmp/cp-license-session",
        env={"LICENSE_SECRET_KEY": SECRET},
        fetch_impl=lambda *a, **k: (_ for _ in ()).throw(RuntimeError("nope")),
        hwid="device-abc-123",
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
    )
    status = session["status"]()
    assert status["unlocked"] is False
    assert status["error"]["code"] == "decrypt_failed"


def test_client_posts_steam_wire_shape_then_downloads_with_bearer_and_jti():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    client = create_license_client(fetch_impl=backend["fetch_impl"])

    verified = client["verify"](
        backend_url="http://127.0.0.1:8080",
        provider="steam",
        fields={"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "hwid": "device-abc-123"},
    )
    assert verified["status"] == "success"
    assert verified["license"]["ciphertext"]
    assert verified["auth"]["token"].startswith("Bearer ") is False

    verify_call = backend["calls"][0]
    assert verify_call["method"] == "POST"
    assert verify_call["path"] == "/api/verify/steam"
    assert verify_call["body"] == {
        "steamId": "76561198000000000",
        "appId": "123456",
        "petType": "red_panda",
        "hwid": "device-abc-123",
    }

    jti = verified["auth"]["token"][len("test.") :]
    manifest = client["download"](
        backend_url="http://127.0.0.1:8080",
        pet_key="red_panda",
        ciphertext=verified["license"]["ciphertext"],
        iv=verified["license"]["iv"],
        hwid="device-abc-123",
        token=verified["auth"]["token"],
        expect={"jti": jti, "petKey": "red_panda", "owner": "76561198000000000"},
        signing_key=SIGNING,
    )
    assert "jti=" in manifest["downloadUrl"]
    assert manifest["jti"] == jti

    download_call = backend["calls"][1]
    assert download_call["path"] == "/api/download/red_panda"
    assert download_call["headers"]["Authorization"] == f"Bearer {verified['auth']['token']}"
    assert download_call["body"]["hwid"] == "device-abc-123"

    bundle = client["fetch_bundle"](manifest["downloadUrl"])
    assert bundle["ok"] is True
    assert bundle["bytes"] > 0


def test_fails_closed_when_backend_is_missing():
    def boom(*_a, **_k):
        raise ConnectionError("ECONNREFUSED")

    client = create_license_client(fetch_impl=boom)
    with pytest.raises(LicenseError) as caught:
        client["verify"](
            backend_url="http://127.0.0.1:9",
            provider="steam",
            fields={"steamId": "1", "appId": "2", "hwid": "dev"},
        )
    assert caught.value.code == "unreachable"


def test_fails_closed_on_empty_backend_url():
    client = create_license_client(fetch_impl=lambda *a, **k: (_ for _ in ()).throw(RuntimeError("no")))
    with pytest.raises(LicenseError) as caught:
        client["verify"](backend_url="  ", provider="steam", fields={"steamId": "1", "appId": "2"})
    assert caught.value.code == "missing_backend"


def test_fails_closed_when_steam_denies_ownership():
    backend = create_contract_test_double(license_secret=SECRET, deny_steam_ids=["76561198000000000"])
    client = create_license_client(fetch_impl=backend["fetch_impl"])
    with pytest.raises(LicenseError) as caught:
        client["verify"](
            backend_url="http://127.0.0.1:8080",
            provider="steam",
            fields={"steamId": "76561198000000000", "appId": "123456", "hwid": "dev"},
        )
    assert caught.value.code == "denied"


def test_fails_closed_on_revoked_jti_at_download():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    client = create_license_client(fetch_impl=backend["fetch_impl"])
    verified = client["verify"](
        backend_url="http://127.0.0.1:8080",
        provider="steam",
        fields={"steamId": "1", "appId": "2", "petType": "red_panda", "hwid": "dev"},
    )
    jti = verified["auth"]["token"][len("test.") :]
    backend["revoked"].add(jti)
    with pytest.raises(LicenseError) as caught:
        client["download"](
            backend_url="http://127.0.0.1:8080",
            pet_key="red_panda",
            ciphertext=verified["license"]["ciphertext"],
            iv=verified["license"]["iv"],
            hwid="dev",
            token=verified["auth"]["token"],
            expect={"jti": jti},
        )
    assert caught.value.code == "revoked"


def test_fails_closed_when_download_hwid_does_not_match():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    client = create_license_client(fetch_impl=backend["fetch_impl"])
    verified = client["verify"](
        backend_url="http://127.0.0.1:8080",
        provider="steam",
        fields={"steamId": "1", "appId": "2", "petType": "red_panda", "hwid": "device-abc-123"},
    )
    with pytest.raises(LicenseError) as caught:
        client["download"](
            backend_url="http://127.0.0.1:8080",
            pet_key="red_panda",
            ciphertext=verified["license"]["ciphertext"],
            iv=verified["license"]["iv"],
            hwid="other-device",
            token=verified["auth"]["token"],
        )
    assert caught.value.code == "hwid_mismatch"
