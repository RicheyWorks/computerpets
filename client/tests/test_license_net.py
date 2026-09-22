"""The license hash names its host before it leaves."""

from pathlib import Path

from computerpets_client.license.license_net import (
    LOCAL_STAYS,
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
