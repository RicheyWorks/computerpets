"""The Steam App ID box follows the overlay's rule: hidden unless this copy has one set up
(COMPUTERPETS_STEAM_APP_ID or a steam_appid.txt) or a past unlock saved one. With none, Unlock says so
in one plain line and sends nothing."""

from __future__ import annotations

import os
import re
from pathlib import Path

import pytest

from computerpets_client.license.contract_double import create_contract_test_double
from computerpets_client.license.errors import LicenseError
from computerpets_client.license.session import (
    FIELDS_MISSING_MESSAGE,
    NO_APP_ID_MESSAGE,
    STEAM_APPID_FILE,
    configured_steam_app_id,
    create_license_session,
)
from tests.test_license_token import BACKEND, SECRET, SIGNING, UNLOCK, FakeCodec, MemoryFs

REPO = Path(__file__).resolve().parents[2]


def _files(files: dict[str, str]):
    def read(path: str) -> str:
        key = str(Path(path))
        if key not in files:
            raise FileNotFoundError(path)
        return files[key]

    return read


def test_configured_app_id_reads_the_env_then_steam_appid_txt_digits_only():
    here = str(Path("/opt/cp"))
    txt = str(Path(here) / STEAM_APPID_FILE)
    assert configured_steam_app_id({}, [], _files({})) == ""
    assert configured_steam_app_id({"COMPUTERPETS_STEAM_APP_ID": " 480 "}, [], _files({})) == "480"
    assert configured_steam_app_id({}, [here], _files({txt: "480\n"})) == "480"
    assert configured_steam_app_id({"COMPUTERPETS_STEAM_APP_ID": "12"}, [here], _files({txt: "480"})) == "12"
    for bad in ("", "abc", "12a", "1234567890123", "-5", "٣٤"):
        assert configured_steam_app_id({"COMPUTERPETS_STEAM_APP_ID": bad}, [], _files({})) == "", bad
        assert configured_steam_app_id({}, [here], _files({txt: bad})) == "", bad
    # A folder that is missing or unreadable counts as none.
    assert configured_steam_app_id({}, ["", str(Path("/nope"))], _files({})) == ""


def test_the_words_and_the_rule_are_the_overlays():
    cjs = (REPO / "desktop" / "license" / "session.cjs").read_text(encoding="utf-8")
    compact = re.sub(r"\s+", " ", cjs)
    assert f'"{NO_APP_ID_MESSAGE}"' in compact
    assert f'"{FIELDS_MISSING_MESSAGE}"' in compact
    assert f'"{STEAM_APPID_FILE}"' in cjs
    assert "COMPUTERPETS_STEAM_APP_ID" in cjs and r"/^\d{1,12}$/" in cjs
    assert len(NO_APP_ID_MESSAGE.split()) <= 20


def _session(backend, disk, env_extra=None, steam_dirs=None):
    return create_license_session(
        user_data_dir="/tmp/cp-app-id",
        env={"LICENSE_SECRET_KEY": SECRET, "BUNDLE_SIGNING_KEY": SIGNING, "COMPUTERPETS_BACKEND_URL": BACKEND, **(env_extra or {})},
        fetch_impl=backend["fetch_impl"],
        hwid="device-abc-123",
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
        codec=FakeCodec(),
        steam_dirs=steam_dirs,
    )


def test_status_names_the_configured_app_id_or_none():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    assert _session(backend, disk)["status"]()["steamAppId"] == ""
    assert _session(backend, disk, {"COMPUTERPETS_STEAM_APP_ID": "480"})["status"]()["steamAppId"] == "480"
    disk.files[str(Path("/opt/cp") / STEAM_APPID_FILE)] = "777"
    assert _session(backend, disk, steam_dirs=["/opt/cp"])["status"]()["steamAppId"] == "777"


def test_no_app_id_anywhere_says_so_plainly_and_sends_nothing():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    with pytest.raises(LicenseError) as caught:
        _session(backend, MemoryFs())["unlock"]({**UNLOCK, "appId": ""})
    assert caught.value.code == "fields_missing"
    assert str(caught.value) == NO_APP_ID_MESSAGE
    assert backend["calls"] == []
    # A blank Steam ID still gets its own line first.
    with pytest.raises(LicenseError) as caught:
        _session(backend, MemoryFs())["unlock"]({**UNLOCK, "steamId": " ", "appId": ""})
    assert str(caught.value) == FIELDS_MISSING_MESSAGE


def test_a_blank_box_uses_the_configured_app_id():
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = MemoryFs()
    status = _session(backend, disk, {"COMPUTERPETS_STEAM_APP_ID": "480"})["unlock"]({**UNLOCK, "appId": ""})
    assert status["unlocked"] is True
    assert disk.store()["fields"]["appId"] == "480"


def _dialog(status):
    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    from PyQt6.QtWidgets import QApplication, QLabel

    from computerpets_client import unlock_dialog as dialog

    app = QApplication.instance() or QApplication([])
    window = dialog.UnlockDialog({"status": lambda: status})
    return app, window, dialog, QLabel


BASE = {"backendUrl": "", "hwidMark": {"read": "unread"}, "unlocked": False}


@pytest.mark.parametrize(
    ("extra", "shown", "value"),
    [
        ({"fields": {}, "steamAppId": ""}, False, ""),
        ({"fields": {}}, False, ""),
        ({"fields": {}, "steamAppId": "480"}, True, "480"),
        ({"fields": {"appId": "123456"}, "steamAppId": ""}, True, "123456"),
        ({"fields": {"appId": "123456"}, "steamAppId": "480"}, True, "123456"),
    ],
)
def test_the_app_id_row_shows_only_when_set_up_or_saved(extra, shown, value):
    app, window, dialog, QLabel = _dialog({**BASE, **extra})
    try:
        label = window.findChild(QLabel, "appIdLabel")
        helper = window.findChild(QLabel, "appIdHelp")
        assert label.text() == dialog.APP_ID_LABEL and helper.text() == dialog.APP_ID_HELP
        assert window.app_id_shown() is shown
        for part in (label, window.app_id, helper):
            assert part.isHidden() is (not shown)
            # Never its own window: the row lives inside the dialog.
            assert part.window() is window
        assert window.app_id.text() == value
        window.show()
        app.processEvents()
        assert window.app_id.isVisible() is shown
        window.hide()
    finally:
        window.deleteLater()
        app.processEvents()


def test_a_first_unlock_that_saves_an_app_id_shows_the_row():
    app, window, _dialog_mod, _ = _dialog({**BASE, "fields": {}, "steamAppId": ""})
    try:
        assert not window.app_id_shown()
        window._paint_app_id({**BASE, "fields": {"appId": "480"}, "steamAppId": ""})
        assert window.app_id_shown() and window.app_id.text() == "480"
    finally:
        window.deleteLater()
        app.processEvents()


class _WatchFs(MemoryFs):
    def __init__(self):
        super().__init__()
        self.reads: list[str] = []

    def read(self, path: str) -> str:
        self.reads.append(path)
        return super().read(path)


@pytest.mark.parametrize(
    ("env_extra", "fields", "code"),
    [
        ({"LICENSE_SECRET_KEY": ""}, UNLOCK, "missing_secret"),
        ({}, {**UNLOCK, "steamId": ""}, "fields_missing"),
        ({}, {**UNLOCK, "appId": ""}, "fields_missing"),
    ],
)
def test_an_unlock_that_cannot_go_does_not_read_the_computer_id(env_extra, fields, code):
    backend = create_contract_test_double(license_secret=SECRET, signing_key=SIGNING)
    disk = _WatchFs()
    session = create_license_session(
        user_data_dir="/tmp/cp-app-id",
        env={"LICENSE_SECRET_KEY": SECRET, "COMPUTERPETS_BACKEND_URL": BACKEND, **env_extra},
        fetch_impl=backend["fetch_impl"],
        read_file=disk.read,
        write_file=disk.write,
        mkdir=disk.mkdir,
        codec=FakeCodec(),
    )
    with pytest.raises(LicenseError) as caught:
        session["unlock"](fields)
    assert caught.value.code == code
    assert not [p for p in disk.files if p.endswith("hwid.txt")]
    assert not [p for p in disk.reads if "machine-id" in p or p.endswith("hwid.txt")]
    assert backend["calls"] == []
