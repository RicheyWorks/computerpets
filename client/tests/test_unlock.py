"""Fail-closed unlock against a mocked backend. Mirrors desktop/license session + client tests."""

from __future__ import annotations

import base64
import json
from pathlib import Path

import pytest

from computerpets_client.license.contract_double import create_contract_test_double
from computerpets_client.license.errors import LicenseError
from computerpets_client.license.http_client import HttpResponse, create_license_client
from computerpets_client.license.license_net import bundle_honesty, download_talk_honesty, license_honesty
from computerpets_client.license.session import create_license_session

SECRET = base64.b64encode(bytes([7] * 32)).decode("ascii")
SIGNING = "test-bundle-signing-key-not-a-placeholder"


def _pin_linux_host(monkeypatch):
    """These tests hand the session a fake /etc/machine-id. Pin the host token to Linux so a
    Windows or macOS run reads that fake instead of the real registry GUID or ioreg UUID."""
    monkeypatch.setattr("computerpets_client.license.hwid.platform.system", lambda: "Linux")


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
        {
            "steamId": "76561198000000000",
            "appId": "123456",
            "petType": "red_panda",
            "provider": "steam",
            "cdnLine": bundle_honesty("https://cdn.enterprisepet.example/bundles/red_panda.zip"),
        }
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
    gets = [call for call in backend["calls"] if call["method"] == "GET"]
    assert len(gets) == 1
    assert "hwid" not in gets[0]["query"]
    assert "hwid" not in gets[0]["body"]


def test_second_download_with_the_same_bearer_is_409():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    client = create_license_client(fetch_impl=backend["fetch_impl"])
    verified = client["verify"](
        backend_url="http://127.0.0.1:8080",
        provider="steam",
        license_secret=SECRET,
        fields={
            "steamId": "76561198000000000",
            "appId": "123456",
            "petType": "red_panda",
        },
    )
    kwargs = dict(
        backend_url="http://127.0.0.1:8080",
        pet_key="red_panda",
        ciphertext=verified["license"]["ciphertext"],
        iv=verified["license"]["iv"],
        token=verified["auth"]["token"],
        expect={"owner": "76561198000000000", "petKey": "red_panda"},
        signing_key=SIGNING,
    )
    first = client["download"](**kwargs)
    assert first["downloadUrl"]
    with pytest.raises(LicenseError) as caught:
        client["download"](**kwargs)
    assert caught.value.code == "download_failed"
    assert str(caught.value) == "download token already used"


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
        license_secret=SECRET,
        fields={"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "hwid": "device-abc-123"},
    )
    assert verified["status"] == "success"
    assert verified["license"]["ciphertext"]
    assert verified["auth"]["token"].startswith("Bearer ") is False

    verify_call = backend["calls"][0]
    assert verify_call["method"] == "POST"
    assert verify_call["path"] == "/api/verify/steam"
    assert verify_call["headers"]["X-ComputerPets-Timestamp"]
    assert verify_call["headers"]["X-ComputerPets-Nonce"]
    assert verify_call["headers"]["X-ComputerPets-Signature"]
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


def test_fails_closed_when_license_key_missing_before_verify_leaves():
    called = {"n": 0}

    def fetch_impl(*_a, **_k):
        called["n"] += 1
        raise AssertionError("verify must not leave without a license key")

    client = create_license_client(fetch_impl=fetch_impl)
    with pytest.raises(LicenseError) as caught:
        client["verify"](
            backend_url="http://127.0.0.1:8080",
            provider="steam",
            fields={"steamId": "1", "appId": "2", "hwid": "dev"},
        )
    assert caught.value.code == "missing_secret"
    assert called["n"] == 0


def test_fails_closed_when_backend_is_missing():
    def boom(*_a, **_k):
        raise ConnectionError("ECONNREFUSED")

    client = create_license_client(fetch_impl=boom)
    with pytest.raises(LicenseError) as caught:
        client["verify"](
            backend_url="http://127.0.0.1:9",
            provider="steam",
            license_secret=SECRET,
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
            license_secret=SECRET,
            fields={"steamId": "76561198000000000", "appId": "123456", "hwid": "dev"},
        )
    assert caught.value.code == "denied"


def test_fails_closed_on_revoked_jti_at_download():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    client = create_license_client(fetch_impl=backend["fetch_impl"])
    verified = client["verify"](
        backend_url="http://127.0.0.1:8080",
        provider="steam",
        license_secret=SECRET,
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
        license_secret=SECRET,
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


def test_status_does_not_read_the_os_machine_id(tmp_path, monkeypatch):
    _pin_linux_host(monkeypatch)
    reads: list[str] = []
    files: dict[str, str] = {}

    def read(path: str) -> str:
        reads.append(path)
        if path.endswith("machine-id"):
            return "machine-aaa\n"
        if path not in files:
            raise FileNotFoundError(path)
        return files[path]

    def write(path: str, data: str) -> None:
        assert "machine-aaa" not in data
        files[path] = data

    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    session = create_license_session(
        user_data_dir=str(tmp_path / "cp-license-mark"),
        env={
            "LICENSE_SECRET_KEY": SECRET,
            "BUNDLE_SIGNING_KEY": SIGNING,
            "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080",
        },
        fetch_impl=backend["fetch_impl"],
        read_file=read,
        write_file=write,
        mkdir=lambda _path: None,
    )
    before = session["status"]()
    assert before["hwid"] == ""
    assert before["hwidMark"]["read"] == "unread"
    assert before["hwidMark"]["rawLeavesMachine"] is False
    assert not any("machine-id" in item for item in reads)

    session["unlock"](
        {"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"}
    )
    verify = next(call for call in backend["calls"] if call["path"] == "/api/verify/steam")
    assert verify["body"]["hwid"] == "eaa1f7bdd907e76c52b378ce67b87a05bb287933089e7adc50ca18399cbb53a4"
    assert "machine-aaa" not in verify["body"]["hwid"]
    assert session["status"]()["hwidMark"]["read"] == "stored"
    machine_reads = [item for item in reads if "machine-id" in item]
    session["status"]()
    assert [item for item in reads if "machine-id" in item] == machine_reads


def test_missing_os_id_does_not_mint_until_yes(tmp_path, monkeypatch):
    _pin_linux_host(monkeypatch)
    files: dict[str, str] = {}

    def read(path: str) -> str:
        if path not in files:
            raise FileNotFoundError(path)
        return files[path]

    def write(path: str, data: str) -> None:
        files[path] = data

    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    session = create_license_session(
        user_data_dir=str(tmp_path / "cp-license-weak"),
        env={
            "LICENSE_SECRET_KEY": SECRET,
            "BUNDLE_SIGNING_KEY": SIGNING,
            "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080",
        },
        fetch_impl=backend["fetch_impl"],
        read_file=read,
        write_file=write,
        mkdir=lambda _path: None,
    )
    with pytest.raises(LicenseError) as caught:
        session["unlock"](
            {"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"}
        )
    assert caught.value.code == "hwid_needs_fallback_yes"
    assert "computer name" in str(caught.value)
    assert "random ID" in str(caught.value)
    assert backend["calls"] == []
    assert not any(path.endswith("hwid.txt") for path in files)

    session["unlock"](
        {
            "steamId": "76561198000000000",
            "appId": "123456",
            "petType": "red_panda",
            "provider": "steam",
            "allowWeakFallback": True,
        }
    )
    verify = next(call for call in backend["calls"] if call["path"] == "/api/verify/steam")
    assert len(verify["body"]["hwid"]) == 64
    assert any(path.endswith("hwid.txt") for path in files)


def test_remote_hash_waits_until_the_host_is_named(tmp_path, monkeypatch):
    _pin_linux_host(monkeypatch)
    reads: list[str] = []
    files: dict[str, str] = {}
    seen: list[str] = []
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    inner = backend["fetch_impl"]

    def fetch(url, **kwargs):
        seen.append(url)
        return inner(url, **kwargs)

    def read(path: str) -> str:
        reads.append(path)
        if path.endswith("machine-id"):
            return "machine-aaa\n"
        if path not in files:
            raise FileNotFoundError(path)
        return files[path]

    session = create_license_session(
        user_data_dir=str(tmp_path / "cp-license-remote-hash"),
        env={
            "LICENSE_SECRET_KEY": SECRET,
            "BUNDLE_SIGNING_KEY": SIGNING,
            "COMPUTERPETS_BACKEND_URL": "https://user:secret@license.example.test",
        },
        fetch_impl=fetch,
        read_file=read,
        write_file=lambda path, data: files.__setitem__(path, data),
        mkdir=lambda _path: None,
    )
    session["status"]()
    assert seen == []
    assert not any("machine-id" in item for item in reads)

    remote = "https://user:secret@license.example.test/api?hwid=raw-id#frag"
    line = license_honesty(remote)
    assert "license.example.test" in line
    assert "secret" not in line
    assert "raw-id" not in line

    with pytest.raises(LicenseError) as caught:
        session["unlock"](
            {"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"}
        )
    assert caught.value.code == "license_net_unnamed"
    assert "license.example.test" in str(caught.value)
    assert seen == []
    assert not any("machine-id" in item for item in reads)
    assert not any(path.endswith("hwid.txt") for path in files)

    with pytest.raises(LicenseError) as other:
        session["unlock"](
            {
                "steamId": "76561198000000000",
                "appId": "123456",
                "petType": "red_panda",
                "provider": "steam",
                "licenseLine": license_honesty("https://other.example.test"),
            }
        )
    assert other.value.code == "license_net_unnamed"
    assert seen == []

    session["unlock"](
        {
            "steamId": "76561198000000000",
            "appId": "123456",
            "petType": "red_panda",
            "provider": "steam",
            "licenseLine": line,
        }
    )
    assert seen
    from urllib.parse import urlparse

    assert urlparse(seen[0]).hostname == "license.example.test"
    verify = next(call for call in backend["calls"] if call["path"] == "/api/verify/steam")
    assert len(verify["body"]["hwid"]) == 64
    assert "machine-aaa" not in verify["body"]["hwid"]
    assert verify["body"]["hwid"] not in line
    download = next(call for call in backend["calls"] if call["path"] == "/api/download/red_panda")
    assert download["body"]["hwid"] == verify["body"]["hwid"]
    assert not any(urlparse(url).hostname == "cdn.enterprisepet.example" for url in seen)


def test_loopback_unlock_does_not_need_the_outbound_line():
    for backend_url in ("http://127.0.0.1:8080", "http://localhost:8080", "http://[::1]:8080"):
        backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
        session = session_for(backend, {"COMPUTERPETS_BACKEND_URL": backend_url})
        result = session["unlock"](
            {
                "steamId": "76561198000000000",
                "appId": "123456",
                "petType": "red_panda",
                "provider": "steam",
                "backendUrl": backend_url,
            }
        )
        assert result["unlocked"] is True
        assert license_honesty(backend_url) == ""


def test_bound_download_names_the_host_and_an_unbound_download_sends_no_hash():
    from computerpets_client.license.decrypt import decrypt_license
    from computerpets_client.license.contract_double import encrypt_license

    unbound = encrypt_license(
        {
            "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
            "owner": "76561198000000000",
            "pet": "red_panda",
            "validUntil": "2099-01-01T00:00:00Z",
            "issuedAt": "2020-01-01T00:00:00Z",
            "hwid": None,
        },
        SECRET,
    )
    assert decrypt_license(unbound["ciphertext"], unbound["iv"], SECRET)["hwid"] is None
    posts: list[dict] = []

    def fetch(url, **kwargs):
        body = kwargs.get("body")
        if kwargs.get("method", "GET").upper() == "POST":
            posts.append(__import__("json").loads(body.decode("utf-8")))
        return HttpResponse(500, b"no", {})

    disk = MemoryFs()
    store = str(Path("/tmp/cp-license-bound-remote") / "license.json")
    disk.write(
        store,
        __import__("json").dumps(
            {
                "backendUrl": "https://license.example.test",
                "license": {"ciphertext": unbound["ciphertext"], "iv": unbound["iv"]},
                "auth": {"token": "token"},
            }
        ),
    )
    session = create_license_session(
        user_data_dir="/tmp/cp-license-bound-remote",
        env={"LICENSE_SECRET_KEY": SECRET, "COMPUTERPETS_BACKEND_URL": "https://license.example.test"},
        fetch_impl=fetch,
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
    )
    with pytest.raises(LicenseError) as unnamed:
        session["download"]()
    assert unnamed.value.code == "download_net_unnamed"
    assert "license.example.test" in str(unnamed.value)
    assert "secret" not in str(unnamed.value)
    assert posts == []
    with pytest.raises(LicenseError) as hash_line:
        session["download"]({"licenseLine": license_honesty("https://license.example.test")})
    assert hash_line.value.code == "download_net_unnamed"
    assert posts == []
    talk = download_talk_honesty("https://user:secret@license.example.test/api?hwid=raw-id#frag")
    assert "sends the license hash" not in talk
    with pytest.raises(LicenseError) as unbound_err:
        session["download"]({"licenseLine": talk})
    assert unbound_err.value.code == "download_failed"
    assert posts and "hwid" not in posts[0]
    assert "ciphertext" in posts[0]

    bound = encrypt_license(
        {
            "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
            "owner": "76561198000000000",
            "pet": "red_panda",
            "validUntil": "2099-01-01T00:00:00Z",
            "issuedAt": "2020-01-01T00:00:00Z",
            "hwid": "already-bound",
        },
        SECRET,
    )
    disk.write(
        store,
        __import__("json").dumps(
            {
                "backendUrl": "https://license.example.test",
                "license": {"ciphertext": bound["ciphertext"], "iv": bound["iv"]},
                "auth": {"token": "token"},
            }
        ),
    )
    disk.write(str(Path("/tmp/cp-license-bound-remote") / "hwid.txt"), "already-bound")
    posts.clear()
    with pytest.raises(LicenseError) as missing:
        session["download"]()
    assert missing.value.code == "license_net_unnamed"
    assert posts == []
    with pytest.raises(LicenseError) as named:
        session["download"]({"licenseLine": license_honesty("https://license.example.test")})
    assert named.value.code == "download_failed"
    assert posts[0]["hwid"] == "already-bound"


def test_does_not_get_a_remote_signed_bundle_until_the_cdn_host_is_named():
    from urllib.parse import parse_qs

    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    session = session_for(backend)
    session["status"]()
    assert backend["calls"] == []

    held = session["unlock"](
        {"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"}
    )
    assert held["download"]["bundle"]["held"] is True
    assert held["download"]["bundle"]["ok"] is False
    assert not any(call["method"] == "GET" for call in backend["calls"])
    assert "hwid=" not in held["download"]["downloadUrl"]
    session["status"]()
    assert not any(call["method"] == "GET" for call in backend["calls"])

    with pytest.raises(LicenseError) as missing:
        session["fetch_signed"]({})
    assert missing.value.code == "cdn_net_unnamed"
    assert "cdn.enterprisepet.example" in str(missing.value)
    assert "/bundles" not in str(missing.value)
    assert "sig=" not in str(missing.value)
    assert not any(call["method"] == "GET" for call in backend["calls"])

    with pytest.raises(LicenseError) as other:
        session["fetch_signed"]({"cdnLine": bundle_honesty("https://other.example.test/pet.zip")})
    assert other.value.code == "cdn_net_unnamed"
    assert not any(call["method"] == "GET" for call in backend["calls"])

    line = bundle_honesty(held["download"]["downloadUrl"])
    assert "secret" not in line
    assert "/bundles" not in line
    assert "hwid" not in line
    fetched = session["fetch_signed"]({"cdnLine": line})
    assert fetched["bundle"]["ok"] is True
    assert fetched["bundle"]["held"] is False
    gets = [call for call in backend["calls"] if call["method"] == "GET"]
    assert len(gets) == 1
    assert "hwid" not in parse_qs(gets[0]["query"])
    assert "hwid" not in gets[0]["body"]


def test_fetches_a_loopback_bundle_without_the_outbound_line():
    from urllib.parse import urlparse

    from computerpets_client.license.contract_double import encrypt_license
    from computerpets_client.license.http_client import HttpResponse

    now = "2099-01-01T00:00:00Z"
    jti = "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80"
    enc = encrypt_license(
        {
            "jti": jti,
            "owner": "76561198000000000",
            "pet": "red_panda",
            "validUntil": now,
            "issuedAt": "2020-01-01T00:00:00Z",
            "hwid": None,
        },
        SECRET,
    )
    disk = MemoryFs()
    store = str(Path("/tmp/cp-license-loop-cdn") / "license.json")
    disk.write(
        store,
        json.dumps(
            {
                "backendUrl": "http://127.0.0.1:8080",
                "license": {"ciphertext": enc["ciphertext"], "iv": enc["iv"]},
                "auth": {"token": "token"},
            }
        ),
    )
    seen: list[str] = []

    def fetch(url, **kwargs):
        seen.append(url)
        if str(kwargs.get("method") or "GET").upper() == "POST":
            assert b"hwid" not in (kwargs.get("body") or b"")
            body = json.dumps(
                {
                    "petKey": "red_panda",
                    "downloadUrl": f"http://user:secret@127.0.0.1:9/bundles/red_panda.zip?owner=76561198000000000&jti={jti}&exp=1893456000&sig=abc#frag",
                    "expiresAt": "2030-01-01T00:00:00Z",
                    "ttlSeconds": 900,
                    "jti": jti,
                }
            ).encode("utf-8")
            return HttpResponse(200, body, {"Content-Type": "application/json"})
        assert kwargs.get("body") in (None, b"")
        return HttpResponse(200, b"zip", {"Content-Type": "application/zip"})

    session = create_license_session(
        user_data_dir="/tmp/cp-license-loop-cdn",
        env={"LICENSE_SECRET_KEY": SECRET, "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080"},
        fetch_impl=fetch,
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
    )
    downloaded = session["download"]()
    assert bundle_honesty(downloaded["downloadUrl"]) == ""
    assert downloaded["bundle"]["ok"] is True
    assert downloaded["bundle"]["held"] is False
    got = next(url for url in seen if urlparse(url).port == 9)
    assert "hwid" not in urlparse(got).query
    assert "secret" in got
    assert "secret" not in bundle_honesty(got)


def test_download_without_a_stored_license_says_so_in_plain_words():
    from computerpets_client.license.session import NO_LICENSE_MESSAGE

    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    session = session_for(backend, disk=disk)

    def no_license(caught):
        err = caught.value
        assert isinstance(err, LicenseError)
        assert err.code == "no_license"
        assert str(err) == NO_LICENSE_MESSAGE
        for leak in ("KeyError", "ciphertext", "Traceback"):
            assert leak not in str(err)

    with pytest.raises(LicenseError) as caught:
        session["download"]()
    no_license(caught)
    assert backend["calls"] == []

    store = str(Path("/tmp/cp-license-session") / "license.json")
    disk.write(store, json.dumps({"backendUrl": "http://127.0.0.1:8080", "license": {"ciphertext": "", "iv": ""}}))
    with pytest.raises(LicenseError) as caught:
        session["download"]()
    no_license(caught)
    assert backend["calls"] == []

    session["unlock"]({"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"})
    after_unlock = len(backend["calls"])
    assert after_unlock > 0
    session["clear"]()
    with pytest.raises(LicenseError) as caught:
        session["download"]()
    no_license(caught)
    assert len(backend["calls"]) == after_unlock


def test_unlock_dialog_shows_the_no_license_sentence_not_a_traceback():
    from computerpets_client.license.session import NO_LICENSE_MESSAGE
    from computerpets_client.unlock_dialog import license_error_text

    assert license_error_text(LicenseError("no_license", NO_LICENSE_MESSAGE)) == NO_LICENSE_MESSAGE
    assert license_error_text(LicenseError("revoked", "license missing, expired, or tampered"), "house.example") == (
        "The house server at house.example no longer accepts this license. Unlock again to get a new one. "
        "Pets still work without it."
    )
    assert license_error_text(KeyError("license")) == (
        "Something went wrong talking to the house server. Pets still work without it."
    )


def test_session_hands_its_mkdir_to_the_hwid_mark(tmp_path, monkeypatch):
    _pin_linux_host(monkeypatch)
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    made: list[str] = []
    home = tmp_path / "cp-license-nomkdir"

    def read(path: str) -> str:
        if path.endswith("machine-id"):
            return "machine-aaa\n"
        return disk.read(path)

    session = create_license_session(
        user_data_dir=str(home),
        env={
            "LICENSE_SECRET_KEY": SECRET,
            "BUNDLE_SIGNING_KEY": SIGNING,
            "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080",
        },
        fetch_impl=backend["fetch_impl"],
        read_file=read,
        write_file=disk.write,
        mkdir=made.append,
    )
    session["unlock"]({"steamId": "76561198000000000", "appId": "123456", "petType": "red_panda", "provider": "steam"})
    assert str(home / "hwid.txt") in disk.files
    assert str(home) in made
    assert not home.exists()

def _sentences(text: str) -> list[str]:
    import re

    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z])", text.strip()) if s]


def test_unlock_dialog_privacy_detail_is_whole_sentences_and_checked_against_hwid():
    import hashlib

    from computerpets_client import unlock_dialog as dialog
    from computerpets_client.license import hwid

    assert dialog.UNLOCK_INTRO == "Pets work without unlocking. Unlocking is optional."
    assert dialog.DETAILS_LABEL == "Details"
    assert dialog.MARK_UNREAD_TEXT.split("\n") == [
        "Opening this window did not look at this computer's ID.",
        "Unlock looks at the ID only when no code is saved yet.",
        "So does downloading a pet whose license belongs to this computer.",
        "The ID is the machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac.",
        "The blotter mixes that ID with the app's name and the kind of computer.",
        "It scrambles the result with SHA-256 into a code.",
        "It saves only that code in hwid.txt in its data folder.",
        "Later unlocks use the saved code again.",
        "So your license keeps working on this computer.",
        "The ID itself is never sent.",
        "Only the code goes to the license website.",
        "It goes only when you unlock or download a pet whose license belongs to this computer.",
        "The code still works like a fingerprint for this computer.",
        "That is because this computer always makes the same code.",
        "The line under the house server address names the website before the code is sent.",
        "If the house server is on this computer, the code stays on this computer.",
        "If the app cannot read that ID, Unlock stops and asks you first.",
        "It uses the computer's name only after you say yes.",
        "It uses a random ID instead if this computer has no name.",
        "Renaming the computer changes a code made from its name.",
        "If the code came from a random ID, deleting hwid.txt gives this computer a different code.",
    ]
    assert dialog.MARK_STORED_TEXT.split("\n") == [
        "A code is already saved in hwid.txt.",
        "Unlock uses it again and does not look at this computer's ID again.",
        "The ID itself is never sent.",
        "The code still works like a fingerprint for this computer.",
        "That is because this computer always makes the same code.",
        "The line under the house server address names the website before the code is sent.",
        "If the house server is on this computer, the code stays on this computer.",
    ]
    # Short lines like START-HERE: one whole sentence per line, none long, every old fact kept.
    for text in (dialog.MARK_UNREAD_TEXT, dialog.MARK_STORED_TEXT):
        for line in text.split("\n"):
            assert _sentences(line) == [line], line
            assert len(line.split()) <= 18, line
    for fact in (
        "looks at the ID only when no code is saved yet",
        "machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac",
        "mixes that ID with the app's name and the kind of computer",
        "scrambles the result with SHA-256 into a code",
        "saves only that code in hwid.txt in its data folder",
        "use the saved code again",
        "your license keeps working on this computer",
        "Only the code goes to the license website.",
        "download a pet whose license belongs to this computer",
        "this computer always makes the same code",
        "only after you say yes",
        "random ID instead if this computer has no name",
    ):
        assert fact in dialog.MARK_UNREAD_TEXT, fact
    import re

    for text in (dialog.MARK_UNREAD_TEXT, dialog.MARK_STORED_TEXT):
        assert not re.search(r"\bhash|raw id|device fingerprint|operating-system|the host\b|\bleaves\b", text, re.I), text
    for text in (dialog.MARK_UNREAD_TEXT, dialog.MARK_STORED_TEXT):
        for sentence in _sentences(text):
            assert sentence[0].isupper() and sentence.endswith("."), sentence
            assert len(sentence.split()) >= 5, sentence
    # The old run-on fragment is gone from the text and from the source.
    source = Path(dialog.__file__).read_text(encoding="utf-8")
    assert "If that named read fails." not in dialog.MARK_UNREAD_TEXT
    assert "If that named read fails. " not in source
    assert "If the app cannot read that ID, Unlock stops and asks you first." in dialog.MARK_UNREAD_TEXT

    # Each claim matches the Python mark code.
    wheres = {mark["source"]: mark["where"] for mark in hwid.MACHINE_MARKS}
    assert wheres["etc-machine-id"] == "/etc/machine-id"
    assert wheres["io-platform-uuid"].endswith("IOPlatformUUID")
    assert next(m for m in hwid.MACHINE_MARKS if m["source"] == "machine-guid")["value"] == "MachineGuid"
    assert hwid._hash_mark("raw", "windows") == hashlib.sha256(b"computerpets:windows:raw").hexdigest()
    written: dict[str, str] = {}

    def no_file(path: str) -> str:
        raise OSError(path)

    with pytest.raises(LicenseError) as caught:
        hwid.resolve_hwid_detail(user_data_dir="/data", plat="linux", read_file=no_file, write_file=written.__setitem__)
    assert caught.value.code == "hwid_needs_fallback_yes"
    assert written == {}
    got = hwid.resolve_hwid_detail(
        user_data_dir="/data",
        plat="linux",
        read_file=lambda p: "machine-abc\n" if p == "/etc/machine-id" else no_file(p),
        write_file=written.__setitem__,
    )
    assert got["id"] == hashlib.sha256(b"computerpets:linux:machine-abc").hexdigest()
    assert list(written.values()) == [got["id"]]
    assert list(written)[0].replace("\\", "/").endswith("/data/hwid.txt")
    assert "machine-abc" not in json.dumps(got)
    stored = hwid.resolve_hwid_detail(user_data_dir="/data", read_file=lambda p: written[p], write_file=written.__setitem__)
    assert stored["read"] == "stored" and stored["id"] == got["id"]
    named = hwid.resolve_hwid_detail(plat="linux", read_file=no_file, hostname="DESK", allow_weak_fallback=True)
    assert named["source"] == "hostname"
    assert named["id"] == hashlib.sha256(b"computerpets:linux:DESK").hexdigest()
    nameless = hwid.resolve_hwid_detail(plat="linux", read_file=no_file, hostname="", allow_weak_fallback=True)
    assert nameless["source"] == "random"


def test_unlock_dialog_folds_the_privacy_detail_under_details():
    import os

    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    from PyQt6.QtWidgets import QApplication

    from computerpets_client import unlock_dialog as dialog

    app = QApplication.instance() or QApplication([])
    status = {"backendUrl": "", "fields": {}, "hwidMark": {"read": "unread"}, "unlocked": False}
    window = dialog.UnlockDialog({"status": lambda: status})
    try:
        assert window.mark.text() == dialog.MARK_UNREAD_TEXT
        assert window.mark.isHidden()
        assert window.details.text() == "Details"
        window.details.click()
        assert not window.mark.isHidden()
        window.details.click()
        assert window.mark.isHidden()
        window._paint_status({**status, "hwidMark": {"read": "stored"}})
        assert window.mark.text() == dialog.MARK_STORED_TEXT
    finally:
        window.deleteLater()
        app.processEvents()


def test_unlock_fields_have_plain_labels_and_one_helper_each_same_as_the_overlay():
    """Where you own the game / Your Steam ID / Steam App ID, each with one true helper line, word for word
    the same in the blotter dialog and the overlay Settings window. The web desk has no Unlock form."""
    import os
    import re

    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    from PyQt6.QtWidgets import QApplication, QLabel

    from computerpets_client import unlock_dialog as dialog

    repo = Path(__file__).resolve().parents[2]
    settings = (repo / "desktop" / "renderer" / "settings.html").read_text(encoding="utf-8")
    fields = [
        ("provider", dialog.PROVIDER_LABEL, dialog.PROVIDER_HELP),
        ("steamId", dialog.STEAM_ID_LABEL, dialog.STEAM_ID_HELP),
        ("appId", dialog.APP_ID_LABEL, dialog.APP_ID_HELP),
    ]
    assert [label for _, label, _ in fields] == ["Where you own the game", "Your Steam ID", "Steam App ID"]
    for field_id, label, helper in fields:
        assert f'<label for="{field_id}">{label}</label>' in settings, label
        assert f'<p class="hint" id="{field_id}Help">{helper}</p>' in settings, helper
        assert len(helper.split()) <= 20, helper
    # Honest: only Steam is wired in, the Steam ID shape is the real one, and there is no Steam page yet.
    assert "Only Steam works here for now." in dialog.PROVIDER_HELP
    assert '<select id="provider"><option value="steam">Steam</option></select>' in settings
    assert "17 digits that start with 7656" in dialog.STEAM_ID_HELP and "Account details" in dialog.STEAM_ID_HELP
    assert "ComputerPets has no Steam page yet." in dialog.APP_ID_HELP
    # The old bare labels are gone; the error lines still name the Steam ID and the App ID, which the labels say.
    assert not re.search(r"<label>(Provider|Steam ID|App ID)</label>", settings)
    assert not list((repo / "web" / "src").rglob("*unlock*.tsx")), "a web Unlock form would need the same words"

    app = QApplication.instance() or QApplication([])
    status = {"backendUrl": "", "fields": {}, "hwidMark": {"read": "unread"}, "unlocked": False}
    window = dialog.UnlockDialog({"status": lambda: status})
    try:
        texts = [w.text() for w in window.findChildren(QLabel)]
        for field_id, label, helper in fields:
            assert label in texts, label
            line = window.findChild(QLabel, f"{field_id}Help")
            assert line is not None and line.text() == helper and line.wordWrap()
        assert "Steam" in texts and "steam" not in texts
    finally:
        window.deleteLater()
        app.processEvents()


def test_unlock_pet_list_shows_name_and_kind_not_the_key_and_the_ask_title_is_plain():
    """The Pet list reads "Rui · Red Panda" on the blotter and the overlay; the key is still what is sent."""
    import os

    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    from PyQt6.QtWidgets import QApplication

    from computerpets_client import unlock_dialog as dialog
    from computerpets_client.species import CATALOG_KEYS

    repo = Path(__file__).resolve().parents[2]
    settings = (repo / "desktop" / "renderer" / "settings.html").read_text(encoding="utf-8")
    assert "o.textContent = window.PetRoster.choiceText(row);" in settings
    assert dialog.pet_choice_text("Rui", "Red Panda") == "Rui · Red Panda"
    assert dialog.WEAK_ASK_TITLE == "Could not read this computer's ID"
    source = Path(dialog.__file__).read_text(encoding="utf-8")
    assert "operating-system id" not in source

    app = QApplication.instance() or QApplication([])
    status = {"backendUrl": "", "fields": {"petType": "dog"}, "hwidMark": {"read": "unread"}, "unlocked": False}
    window = dialog.UnlockDialog({"status": lambda: status})
    try:
        combo = window.pet_type
        assert combo.count() == len(CATALOG_KEYS) == 221
        assert combo.itemText(0) == "Rui · Red Panda" and combo.itemData(0) == "red_panda"
        assert not [combo.itemText(i) for i in range(combo.count()) if "_" in combo.itemText(i) or " — " in combo.itemText(i)]
        assert window._pet_key() == "dog"
        combo.setCurrentIndex(-1)
        combo.setEditText("Pip")
        assert window._pet_key() == "dog"
        combo.setEditText("Rui · Red Panda")
        assert window._pet_key() == "red_panda"
    finally:
        window.deleteLater()
        app.processEvents()


def test_pet_line_is_the_same_on_the_tray_house_window_and_blotter_for_all_221():
    """The overlay formatter (roster-load.js choiceText) and the blotter's pet_choice_text give the same line."""
    import json
    import shutil
    import subprocess

    import pytest

    from computerpets_client import unlock_dialog as dialog

    node = shutil.which("node")
    if not node:
        pytest.skip("node is not installed; the overlay formatter cannot run here")
    repo = Path(__file__).resolve().parents[2]
    rows = json.loads((repo / "desktop" / "renderer" / "roster.json").read_text(encoding="utf-8"))
    script = (
        "const R = require(process.argv[1]); const rows = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));"
        "process.stdout.write(JSON.stringify(rows.map((r) => R.choiceText(r))));"
    )
    out = subprocess.run(
        [node, "-e", script, str(repo / "desktop" / "renderer" / "roster-load.js"), str(repo / "desktop" / "renderer" / "roster.json")],
        capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout
    overlay = json.loads(out)
    blotter = [dialog.pet_choice_text(r["name"], r["speciesLabel"]) for r in rows]
    assert len(overlay) == 221
    assert overlay == blotter
    assert overlay[0] == "Rui · Red Panda"
