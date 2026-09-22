"""The license hash names its host before it leaves."""

from pathlib import Path

from computerpets_client.license.license_net import (
    BUNDLE_IDLE,
    BUNDLE_LOCAL,
    LOCAL_STAYS,
    bundle_honesty,
    bundle_host_name,
    bundle_may_fetch,
    client_net_line,
    license_honesty,
    license_host_name,
    license_may_send,
)


def test_license_line_names_the_host_and_drops_the_path():
    dirty = "https://user:secret@license.example.test:8443/api/verify?hwid=raw-id#frag"
    line = license_honesty(dirty)
    assert license_host_name(dirty) == "license.example.test"
    assert line == (
        "this unlock sends the license hash. "
        + client_net_line("license.example.test")
        + " a bound download sends that same hash."
    )
    assert "secret" not in line
    assert "raw-id" not in line
    assert "/api" not in line
    assert "8443" not in line
    assert "frag" not in line
    assert license_may_send(dirty, line) is True
    assert license_may_send(dirty, "") is False
    assert license_may_send(dirty, client_net_line("other.example.test")) is False
    assert license_honesty("http://127.0.0.1:8081") == ""
    assert license_honesty("http://localhost:8081") == ""
    assert license_honesty("http://[::1]:8081") == ""
    assert license_may_send("http://127.0.0.1:8081", "") is True
    assert "does not leave" in LOCAL_STAYS
    assert "https request" not in LOCAL_STAYS


def test_blotter_paints_the_line_before_unlock_or_download():
    dialog = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "unlock_dialog.py").read_text(encoding="utf-8")
    unlock = dialog[dialog.index("def _unlock") : dialog.index("def _on_ok")]
    download = dialog[dialog.index("def _download") : dialog.index("def _clear")]
    worker = dialog[dialog.index("def run") : dialog.index("class UnlockDialog")]
    assert unlock.index("_hash_may_leave") < unlock.index("UnlockWorker")
    assert '["unlock"]' in worker
    assert download.index("_hash_may_leave") < download.index('["download"]')
    assert "device fingerprint" in dialog
    assert "raw id is not sent" in dialog
    gate = dialog[dialog.index("def _hash_may_leave") : dialog.index("def _paint_status")]
    assert gate.index("_paint_net") < gate.index("license_may_send")


def test_bundle_line_names_the_cdn_host_and_drops_the_path():
    dirty = "https://user:secret@cdn.example.test:8443/bundles/red_panda.zip?owner=o&jti=j&exp=1&sig=abc&hwid=raw-id#frag"
    line = bundle_honesty(dirty)
    assert bundle_host_name(dirty) == "cdn.example.test"
    assert line == (
        "this download gets the signed bundle. "
        + client_net_line("cdn.example.test")
        + " the license hash is not on that request."
    )
    assert "secret" not in line
    assert "raw-id" not in line
    assert "/bundles" not in line
    assert "8443" not in line
    assert "frag" not in line
    assert "hwid" not in line
    assert bundle_may_fetch(dirty, line) is True
    assert bundle_may_fetch(dirty, "") is False
    assert bundle_may_fetch(dirty, client_net_line("other.example.test")) is False
    assert bundle_honesty("http://127.0.0.1:9/bundles/pet.zip") == ""
    assert bundle_honesty("http://localhost/pet.zip") == ""
    assert bundle_honesty("http://[::1]/pet.zip") == ""
    assert bundle_honesty("file:///tmp/red_panda.zip") == ""
    assert bundle_may_fetch("http://127.0.0.1:9/pet.zip", "") is True
    assert bundle_may_fetch("file:///tmp/red_panda.zip", "") is True
    assert "does not leave" in BUNDLE_LOCAL
    assert "https request" not in BUNDLE_LOCAL
    assert "https request" not in BUNDLE_IDLE
    assert "signed bundle" not in license_honesty(dirty)


def test_blotter_paints_the_cdn_line_before_the_bundle_get():
    dialog = Path(__file__).resolve().parents[1].joinpath("computerpets_client", "unlock_dialog.py").read_text(encoding="utf-8")
    fetch = dialog[dialog.index("def _fetch_if_held") : dialog.index("def _hash_may_leave")]
    assert fetch.index("_paint_bundle") < fetch.index('["fetch_signed"]')
    on_ok = dialog[dialog.index("def _on_ok") : dialog.index("def _on_fail")]
    assert on_ok.index("_paint_status") < on_ok.index("_fetch_if_held")
    download = dialog[dialog.index("def _download(self") : dialog.index("def _clear")]
    assert download.index('["download"]') < download.index("_fetch_if_held")
    init = dialog[dialog.index("class UnlockDialog") : dialog.index("def _mark_text")]
    assert "fetch_signed" not in init
