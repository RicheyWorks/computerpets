"""The Unlock download sign-in is never written in plain text, and Unlock errors are plain words.

Mirrors desktop/license (session codec + plain-error.cjs). Fakes only: a contract double for the
house, an in-memory disk, a fake codec / fake keyring. No network and no real secrets.
"""

from __future__ import annotations

import base64
import json
import logging
import sys
import types
from urllib.error import URLError

import pytest

from computerpets_client.license import plain_error, token_store
from computerpets_client.license.contract_double import create_contract_test_double
from computerpets_client.license.errors import LicenseError
from computerpets_client.license.http_client import HttpResponse, create_license_client
from computerpets_client.license.license_net import bundle_honesty
from computerpets_client.license.plain_error import PETS_STILL, plain_license_error
from computerpets_client.license.session import (
    FIELDS_MISSING_MESSAGE,
    NO_TOKEN_MESSAGE,
    STORE_NAME,
    create_license_session,
)

SECRET = base64.b64encode(bytes([7] * 32)).decode("ascii")
SIGNING = "test-bundle-signing-key-not-a-placeholder"
BACKEND = "http://127.0.0.1:8080"
UNLOCK = {
    "steamId": "76561198000000000",
    "appId": "123456",
    "petType": "red_panda",
    "provider": "steam",
    "cdnLine": bundle_honesty("https://cdn.enterprisepet.example/bundles/red_panda.zip"),
}


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

    def store(self) -> dict:
        (name,) = [p for p in self.files if p.endswith(STORE_NAME)]
        return json.loads(self.files[name])

    def text(self) -> str:
        return "\n".join(self.files.values())


class FakeCodec:
    """Stands in for DPAPI / keyring: reversible, and never the plain token."""

    def __init__(self):
        self.sealed: list[str] = []
        self.forgot = 0

    def encrypt(self, text: str) -> str:
        self.sealed.append(text)
        return "fake:" + base64.b64encode(text[::-1].encode()).decode()

    def decrypt(self, sealed: str) -> str:
        assert sealed.startswith("fake:")
        return base64.b64decode(sealed[5:]).decode()[::-1]

    def forget(self) -> None:
        self.forgot += 1


def session_for(backend, disk, codec=None):
    return create_license_session(
        user_data_dir="/tmp/cp-license-token",
        env={"LICENSE_SECRET_KEY": SECRET, "BUNDLE_SIGNING_KEY": SIGNING, "COMPUTERPETS_BACKEND_URL": BACKEND},
        fetch_impl=backend["fetch_impl"],
        hwid="device-abc-123",
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
        codec=codec,
    )


def downloads(backend) -> list[dict]:
    return [c for c in backend["calls"] if c["path"].startswith("/api/download/")]


def issued_token(backend) -> str:
    """The bearer the double handed out (read back from the download call it saw)."""
    return downloads(backend)[0]["headers"]["Authorization"][len("Bearer ") :]


# -- sealing -----------------------------------------------------------------------------------


def test_unlock_seals_the_download_token_and_never_writes_it_plain():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk, codec = MemoryFs(), FakeCodec()
    result = session_for(backend, disk, codec)["unlock"](UNLOCK)
    assert result["unlocked"] is True
    token = issued_token(backend)
    auth = disk.store()["auth"]
    assert "token" not in auth
    assert auth["sealedToken"].startswith("fake:")
    assert token not in disk.text()
    assert codec.decrypt(auth["sealedToken"]) == token
    assert result["tokenKept"] == "sealed"


def test_a_later_run_opens_the_seal_for_a_signed_download():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk, codec = MemoryFs(), FakeCodec()
    session_for(backend, disk, codec)["unlock"](UNLOCK)
    token = issued_token(backend)
    backend["calls"].clear()
    later = session_for(backend, disk, codec)  # a fresh run: nothing in memory
    with pytest.raises(LicenseError) as caught:
        later["download"]({"cdnLine": UNLOCK["cdnLine"]})
    # The double's bearer is single use, so the house says 409; what matters is that the sealed
    # token was opened and sent, not dropped.
    assert caught.value.code == "download_failed"
    assert downloads(backend)[0]["headers"]["Authorization"] == f"Bearer {token}"


def test_codec_may_be_a_factory_like_default_token_codec():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk, codec = MemoryFs(), FakeCodec()
    session_for(backend, disk, lambda: codec)["unlock"](UNLOCK)
    assert disk.store()["auth"]["sealedToken"].startswith("fake:")


def test_no_secret_store_keeps_the_token_in_memory_for_this_run_only():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    session = session_for(backend, disk, None)
    result = session["unlock"](UNLOCK)
    token = issued_token(backend)
    assert token not in disk.text()
    assert disk.store()["auth"] == {"expiresAt": disk.store()["auth"]["expiresAt"]}
    assert result["tokenKept"] == "memory"
    assert session["status"]()["tokenKept"] == "memory"

    backend["calls"].clear()
    later = session_for(backend, disk, None)
    assert later["status"]()["tokenKept"] == "none"
    with pytest.raises(LicenseError) as caught:
        later["download"]({"cdnLine": UNLOCK["cdnLine"]})
    assert caught.value.code == "no_token"
    assert str(caught.value) == NO_TOKEN_MESSAGE
    assert str(caught.value).endswith(PETS_STILL)
    assert downloads(backend) == []  # nothing was posted without a sign-in


def test_a_codec_that_fails_is_no_store_not_a_plain_write():
    class Broken(FakeCodec):
        def encrypt(self, text: str) -> str:
            raise OSError("store locked")

    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    result = session_for(backend, disk, Broken())["unlock"](UNLOCK)
    assert issued_token(backend) not in disk.text()
    assert result["tokenKept"] == "memory"


def test_an_old_plain_token_is_used_once_then_sealed():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    session_for(backend, disk, None)["unlock"](UNLOCK)
    # Rewrite license.json the way an older client left it: the sign-in in plain text.
    (path,) = [p for p in disk.files if p.endswith(STORE_NAME)]
    old = disk.store()
    old["auth"] = {"token": "test.old-plain-token", "expiresAt": old["auth"]["expiresAt"]}
    disk.files[path] = json.dumps(old)

    codec = FakeCodec()
    backend["calls"].clear()
    session = session_for(backend, disk, codec)
    status = session["status"]()
    assert "old-plain-token" not in disk.text()  # sealed on first read
    assert codec.decrypt(disk.store()["auth"]["sealedToken"]) == "test.old-plain-token"
    assert status["tokenKept"] == "sealed"
    with pytest.raises(LicenseError):
        session["download"]({"cdnLine": UNLOCK["cdnLine"]})
    assert downloads(backend)[0]["headers"]["Authorization"] == "Bearer test.old-plain-token"
    assert codec.sealed.count("test.old-plain-token") == 1  # migrated once


def test_an_old_plain_token_with_no_store_is_dropped_from_disk_but_kept_for_this_run():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    session_for(backend, disk, None)["unlock"](UNLOCK)
    (path,) = [p for p in disk.files if p.endswith(STORE_NAME)]
    old = disk.store()
    old["auth"] = {"token": "test.old-plain-token", "expiresAt": old["auth"]["expiresAt"]}
    disk.files[path] = json.dumps(old)

    session = session_for(backend, disk, None)
    assert session["status"]()["tokenKept"] == "memory"
    assert "old-plain-token" not in disk.text()


def test_clear_forgets_the_sealed_token():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk, codec = MemoryFs(), FakeCodec()
    session = session_for(backend, disk, codec)
    session["unlock"](UNLOCK)
    status = session["clear"]()
    assert status["unlocked"] is False
    assert codec.forgot == 1
    assert "sealedToken" not in disk.text()


def test_blank_steam_fields_say_so_plainly_before_anything_is_sent():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    with pytest.raises(LicenseError) as caught:
        session_for(backend, MemoryFs(), FakeCodec())["unlock"]({**UNLOCK, "steamId": "  "})
    assert caught.value.code == "fields_missing"
    assert str(caught.value) == FIELDS_MISSING_MESSAGE
    assert backend["calls"] == []


# -- secret stores -----------------------------------------------------------------------------


class FakeKeyringModule(types.ModuleType):
    def __init__(self, priority=5):
        super().__init__("keyring")
        self.saved: dict[tuple[str, str], str] = {}
        self._priority = priority

    def get_keyring(self):
        return types.SimpleNamespace(priority=self._priority)

    def set_password(self, service, user, value):
        self.saved[(service, user)] = value

    def get_password(self, service, user):
        return self.saved.get((service, user))

    def delete_password(self, service, user):
        self.saved.pop((service, user), None)


def test_keyring_codec_keeps_the_token_in_the_keychain_and_only_a_mark_on_disk(monkeypatch):
    fake = FakeKeyringModule()
    monkeypatch.setitem(sys.modules, "keyring", fake)
    codec = token_store.default_token_codec(platform="linux")
    assert isinstance(codec, token_store.KeyringCodec)
    mark = codec.encrypt("test.keychain-token")
    assert mark == token_store.KEYRING_MARK and "keychain-token" not in mark
    assert codec.decrypt(mark) == "test.keychain-token"
    codec.forget()
    assert fake.saved == {}


def test_no_keyring_and_no_dpapi_means_memory_only(monkeypatch):
    monkeypatch.setitem(sys.modules, "keyring", None)  # import keyring -> ImportError
    assert token_store.default_token_codec(platform="linux") is None


def test_a_keyring_with_no_real_backend_is_not_used(monkeypatch):
    monkeypatch.setitem(sys.modules, "keyring", FakeKeyringModule(priority=0))
    assert token_store.default_token_codec(platform="darwin") is None


@pytest.mark.skipif(sys.platform != "win32", reason="DPAPI is Windows only")
def test_dpapi_round_trip_on_windows():
    codec = token_store.default_token_codec()
    assert isinstance(codec, token_store.DpapiCodec)
    sealed = codec.encrypt("test.dpapi-token")
    assert sealed.startswith(token_store.DPAPI_PREFIX) and "dpapi-token" not in sealed
    assert codec.decrypt(sealed) == "test.dpapi-token"


# -- plain words -------------------------------------------------------------------------------


def _client(fetch):
    return create_license_client(fetch_impl=fetch)


def _verify(client):
    return client["verify"](
        backend_url="https://house.example",
        provider="steam",
        license_secret=SECRET,
        fields={"steamId": "1", "appId": "2", "hwid": "dev"},
    )


@pytest.mark.parametrize(
    "raised, expected",
    [
        (ConnectionRefusedError(111, "Connection refused"), "Couldn't reach the house server at house.example."),
        (URLError(OSError(-2, "Name or service not known")), "Couldn't find the house server at house.example."),
        (TimeoutError("timed out"), "The house server at house.example took too long to answer."),
        (URLError("[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed"), "Couldn't make a secure connection"),
    ],
)
def test_network_trouble_names_the_host_in_one_plain_sentence(raised, expected):
    def fetch(url, **_):
        raise raised

    with pytest.raises(LicenseError) as caught:
        _verify(_client(fetch))
    words = plain_license_error(caught.value)["message"]
    assert words.startswith(expected)
    assert words.endswith(PETS_STILL)
    assert "Errno" not in words and "SSL:" not in words


def test_server_errors_and_busy_say_so_without_server_words():
    def fetch500(url, **_):
        return HttpResponse(500, json.dumps({"error": "provider call failed: stack trace"}).encode())

    def fetch429(url, **_):
        return HttpResponse(429, b"{}")

    with pytest.raises(LicenseError) as caught:
        _verify(_client(fetch500))
    words = plain_license_error(caught.value)["message"]
    assert words == f"The house server at house.example had a problem (error 500). Try again later. {PETS_STILL}"
    with pytest.raises(LicenseError) as caught:
        _verify(_client(fetch429))
    assert plain_license_error(caught.value)["message"].startswith("The house server at house.example is busy")


def test_a_refusal_never_shows_the_servers_own_words():
    def fetch403(url, **_):
        return HttpResponse(403, json.dumps({"error": "steam api key rotated; see ops runbook"}).encode())

    with pytest.raises(LicenseError) as caught:
        _verify(_client(fetch403))
    words = plain_license_error(caught.value, "house.example")["message"]
    assert "runbook" not in words
    assert words.startswith("The house server at house.example did not confirm that you own the game.")
    assert words.endswith(PETS_STILL)


@pytest.mark.parametrize("code", sorted(plain_error.HOUSE_CODES - plain_error.PASSTHROUGH_CODES - {"bundle_zip_invalid"}))
def test_every_house_code_has_a_plain_sentence_ending_pets_still_work(code):
    words = plain_license_error(LicenseError(code, "raw developer text"), "house.example")["message"]
    assert "raw developer text" not in words
    assert words.endswith(PETS_STILL)


def test_a_stored_status_error_dict_gets_the_same_words():
    words = plain_license_error({"code": "expired", "message": "license expired at 2026-01-01"})["message"]
    assert words == f"This license has expired. Unlock again to get a new one. {PETS_STILL}"


def test_unlock_dialog_text_is_plain_and_the_raw_error_goes_to_the_log(caplog):
    pytest.importorskip("PyQt6")
    from computerpets_client.unlock_dialog import license_error_text

    err = LicenseError("denied", "steam says: key 1234 over quota", {"error": "steam says: key 1234 over quota"})
    with caplog.at_level(logging.WARNING, logger="computerpets.license"):
        words = license_error_text(err, "house.example")
    assert "quota" not in words and words.endswith(PETS_STILL)
    assert "over quota" in caplog.text and "denied" in caplog.text


def test_unexpected_errors_in_the_dialog_are_not_called_unreachable():
    pytest.importorskip("PyQt6")
    from computerpets_client.unlock_dialog import license_error_text

    words = license_error_text(KeyError("license"), "house.example")
    assert words == f"Something went wrong talking to the house server at house.example. {PETS_STILL}"
