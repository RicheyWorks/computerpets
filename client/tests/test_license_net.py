"""Unlock names the license website before the code made from this computer's ID is sent there."""

from pathlib import Path

import pytest

from computerpets_client.license.errors import LicenseError
from computerpets_client.license.license_net import (
    BUNDLE_IDLE,
    BUNDLE_LOCAL,
    DOWNLOAD_LOCAL,
    LOCAL_STAYS,
    bundle_honesty,
    bundle_host_name,
    bundle_may_fetch,
    plain_net_line,
    download_may_post,
    download_talk_honesty,
    get_signed_bundle,
    license_honesty,
    license_host_name,
    license_may_send,
    post_license_hash,
    post_unbound_download,
)


def test_license_line_names_the_host_and_drops_the_path():
    dirty = "https://user:secret@license.example.test:8443/api/verify?hwid=raw-id#frag"
    line = license_honesty(dirty)
    assert license_host_name(dirty) == "license.example.test"
    assert line == (
        "This asks license.example.test, the license website, to check your license. It sends what you typed"
        " for your license and a scrambled code made from this computer's ID. The ID itself stays here. "
        + plain_net_line("license.example.test")
        + " A download tied to this computer sends that same code."
    )
    assert "secret" not in line
    assert "raw-id" not in line
    assert "/api" not in line
    assert "8443" not in line
    assert "frag" not in line
    assert license_may_send(dirty, line) is True
    assert license_may_send(dirty, "") is False
    assert license_may_send(dirty, plain_net_line("other.example.test")) is False
    assert license_honesty("http://127.0.0.1:8081") == ""
    assert license_honesty("http://localhost:8081") == ""
    assert license_honesty("http://[::1]:8081") == ""
    assert license_may_send("http://127.0.0.1:8081", "") is True
    assert "does not leave" in LOCAL_STAYS
    assert "https request" not in LOCAL_STAYS


def test_blotter_paints_the_line_before_unlock_or_download():
    dialog = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "unlock_dialog.py").read_text(encoding="utf-8")
    unlock = dialog[dialog.index("def _unlock(self") : dialog.index("def _on_ok")]
    download = dialog[dialog.index("def _download(self") : dialog.index("def _clear")]
    begin = dialog[dialog.index("def _begin_unlock") : dialog.index("def _unlock(self")]
    worker = dialog[dialog.index("def run") : dialog.index("class UnlockDialog")]
    assert unlock.index("_paint_net") < unlock.index("post_license_hash")
    assert unlock.index("post_license_hash") < unlock.index("_begin_unlock")
    assert "license_may_send" not in unlock
    assert "UnlockWorker" in begin
    assert '["unlock"]' in worker
    assert download.index("def go") < download.index("post_license_hash")
    assert "like a fingerprint for this computer" in dialog
    assert "The ID itself is never sent" in dialog


def test_unbound_download_line_names_the_host_and_does_not_say_a_hash_is_sent():
    dirty = "https://user:secret@license.example.test:8443/api/download/red_panda?hwid=raw-id#frag"
    line = download_talk_honesty(dirty)
    hash_line = license_honesty(dirty)
    assert hash_line == (
        "This asks license.example.test, the license website, to check your license. It sends what you typed"
        " for your license and a scrambled code made from this computer's ID. The ID itself stays here. "
        + plain_net_line("license.example.test")
        + " A download tied to this computer sends that same code."
    )
    assert line == (
        "This asks license.example.test, the license website, for your pet. It sends your saved license and the pass from unlocking. "
        + plain_net_line("license.example.test")
        + " It does not send the code made from this computer's ID."
    )
    assert "sends the license hash" not in line
    assert "secret" not in line
    assert "raw-id" not in line
    assert "/api" not in line
    assert "8443" not in line
    assert "frag" not in line
    assert download_may_post(dirty, line) is True
    assert download_may_post(dirty, "") is False
    assert download_may_post(dirty, hash_line) is False
    assert download_may_post(dirty, plain_net_line("license.example.test")) is False
    assert download_talk_honesty("http://127.0.0.1:8081") == ""
    assert download_talk_honesty("http://localhost:8081") == ""
    assert download_talk_honesty("http://[::1]:8081") == ""
    assert download_may_post("http://127.0.0.1:8081", "") is True
    assert "talks to this computer" in DOWNLOAD_LOCAL
    assert "does not send the code made from this computer's ID" in DOWNLOAD_LOCAL
    assert "https request" not in DOWNLOAD_LOCAL
    assert "sends the license hash" not in DOWNLOAD_LOCAL


def test_blotter_paints_the_download_line_before_an_unbound_post():
    dialog = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "unlock_dialog.py").read_text(encoding="utf-8")
    download = dialog[dialog.index("def _download(self") : dialog.index("def _clear")]
    assert download.index("_paint_net") < download.index("post_unbound_download")
    assert download.index("def go") < download.index("post_unbound_download")
    assert "download_may_post" not in download
    assert "_download_may_leave" not in download
    init = dialog[dialog.index("class UnlockDialog") : dialog.index("def _mark_text")]
    assert '["download"]' not in init


def test_bundle_line_names_the_cdn_host_and_drops_the_path():
    dirty = "https://user:secret@cdn.example.test:8443/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc&hwid=raw-id#frag"
    line = bundle_honesty(dirty)
    assert bundle_host_name(dirty) == "cdn.example.test"
    assert line == (
        "This gets your pet's files from cdn.example.test, the download website, with the link the license website gave. "
        + plain_net_line("cdn.example.test")
        + " It does not send the code made from this computer's ID."
    )
    assert "secret" not in line
    assert "raw-id" not in line
    assert "/bundles" not in line
    assert "8443" not in line
    assert "frag" not in line
    assert "hwid" not in line
    assert bundle_may_fetch(dirty, line) is True
    assert bundle_may_fetch(dirty, "") is False
    assert bundle_may_fetch(dirty, plain_net_line("other.example.test")) is False
    assert bundle_honesty("http://127.0.0.1:9/bundles/pet.zip") == ""
    assert bundle_honesty("http://localhost/pet.zip") == ""
    assert bundle_honesty("http://[::1]/pet.zip") == ""
    assert bundle_honesty("file:///tmp/red_panda.zip") == ""
    assert bundle_may_fetch("http://127.0.0.1:9/pet.zip", "") is True
    assert bundle_may_fetch("file:///tmp/red_panda.zip", "") is True
    assert "come from this computer" in BUNDLE_LOCAL
    assert "https request" not in BUNDLE_LOCAL
    assert "https request" not in BUNDLE_IDLE
    assert "signed bundle" not in license_honesty(dirty)


def test_blotter_paints_the_cdn_line_before_the_bundle_get():
    dialog = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "unlock_dialog.py").read_text(encoding="utf-8")
    fetch = dialog[dialog.index("def _fetch_if_held") : dialog.index("def _paint_status")]
    assert fetch.index("_paint_bundle") < fetch.index("get_signed_bundle")
    assert fetch.index("get_signed_bundle") < fetch.index('["fetch_signed"]')
    assert "bundle_may_fetch" not in fetch
    on_ok = dialog[dialog.index("def _on_ok") : dialog.index("def _on_fail")]
    assert on_ok.index("_paint_status") < on_ok.index("_fetch_if_held")
    download = dialog[dialog.index("def _download(self") : dialog.index("def _clear")]
    assert download.index('["download"]') < download.index("_fetch_if_held")
    init = dialog[dialog.index("class UnlockDialog") : dialog.index("def _mark_text")]
    assert "fetch_signed" not in init


def test_wrappers_are_the_only_request_and_a_miss_does_not_call_it():
    remote = "https://user:secret@license.example.test/api/verify?hwid=raw-id#frag"
    bundle = "https://user:secret@cdn.example.test/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc#frag"
    calls = {"n": 0}

    def request():
        calls["n"] += 1
        return "sent"

    with pytest.raises(LicenseError) as missing:
        post_license_hash("", remote, request)
    assert missing.value.code == "license_net_unnamed"
    assert "can't reach" not in str(missing.value)
    assert "unreachable" not in str(missing.value)
    with pytest.raises(LicenseError) as other:
        post_license_hash(plain_net_line("other.example.test"), remote, request)
    assert other.value.code == "license_net_unnamed"
    assert calls["n"] == 0
    assert post_license_hash(license_honesty(remote), remote, request) == "sent"
    assert post_license_hash("", "http://127.0.0.1:8081", lambda: "local") == "local"

    with pytest.raises(LicenseError) as unnamed:
        post_unbound_download(license_honesty(remote), remote, request)
    assert unnamed.value.code == "download_net_unnamed"
    assert "can't reach" not in str(unnamed.value)
    talk = download_talk_honesty(remote)
    assert post_unbound_download(talk, remote, lambda: "posted") == "posted"
    assert post_unbound_download("", "http://127.0.0.1:8081", lambda: "local") == "local"

    held = get_signed_bundle("", bundle, request, False)
    assert held["held"] is True
    with pytest.raises(LicenseError) as cdn:
        get_signed_bundle(bundle_honesty("https://other.example.test/pet.zip"), bundle, request, True)
    assert cdn.value.code == "cdn_net_unnamed"
    assert "sig=" not in str(cdn.value)
    assert "can't reach" not in str(cdn.value)
    fetched = get_signed_bundle(bundle_honesty(bundle), bundle, lambda: bundle, True)
    assert "owner=o" in fetched and "jti=j" in fetched and "exp=1" in fetched and "sig=abc" in fetched
    assert get_signed_bundle("", "http://127.0.0.1:9/pet.zip", lambda: "local") == "local"

    session = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "license", "session.py").read_text(encoding="utf-8")
    unlock = session[session.index("def unlock") : session.index("def download")]
    assert unlock.index("def open_hash") < unlock.index('client["verify"]') < unlock.index("post_license_hash")
    assert "license_may_send" not in unlock
    body = session[session.index("def request_download") : session.index("def _read_bundle")]
    assert body.index("def post") < body.index('client["download"]') < body.index("post_license_hash")
    assert "download_may_post" not in body
    read = session[session.index("def _read_bundle") : session.index("def unlock")]
    assert read.index("def fetch") < read.index('client["fetch_bundle"]') < read.index("get_signed_bundle")
    assert "bundle_may_fetch" not in read


def test_every_miss_names_the_real_host_and_no_dead_fallback_name_is_left():
    """A miss needs a named host (no host never leaves), so there is no stand-in name to fall back to."""
    import computerpets_client.license.license_net as net

    assert not hasattr(net, "LICENSE_HOST_NAME") and not hasattr(net, "BUNDLE_HOST_NAME")
    assert net.license_target("") is None and net.bundle_target("") is None
    assert net.license_target("https://license.example.test/a?x=1") == {"local": False, "label": "license.example.test"}
    assert net.bundle_target("https://cdn.example.test/p.zip?sig=1") == {"local": False, "label": "cdn.example.test"}
    with pytest.raises(LicenseError) as hit:
        post_license_hash("", "https://license.example.test/a", lambda: 1)
    assert str(hit.value) == "Nothing was sent to license.example.test. This page has to name the license website first."
    with pytest.raises(LicenseError) as held:
        get_signed_bundle("", "https://cdn.example.test/p.zip", lambda: 1, strict=True)
    assert str(held.value) == (
        "Your pet's files were not downloaded from cdn.example.test. This page has to name the download website first."
    )
