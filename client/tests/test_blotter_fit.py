"""Newcomer pass 6: the blotter on a laptop-height screen, one locked sentence, Download my pet waits with a reason,
drawn picker arrows, and only the known-harmless offscreen Qt line kept quiet."""

from __future__ import annotations

import os
import re
from pathlib import Path

import pytest

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

REPO = Path(__file__).resolve().parents[2]


@pytest.fixture()
def app(tmp_path, monkeypatch):
    monkeypatch.setenv("COMPUTERPETS_CLIENT_HOME", str(tmp_path))
    from PyQt6.QtWidgets import QApplication

    return QApplication.instance() or QApplication([])


def _pump(app, n=20):
    for _ in range(n):
        app.processEvents()


def _window(tmp_path):
    from computerpets_client.app import DeskWindow

    return DeskWindow()


@pytest.mark.parametrize("size", [(1350, 697), (1264, 649)])
def test_the_blotter_keeps_a_readable_height_on_a_laptop_screen(app, tmp_path, size):
    from PyQt6.QtWidgets import QGraphicsItem

    from computerpets_client.app import VIEW_MIN_H

    w = _window(tmp_path)
    try:
        w.show()
        w.resize(*size)
        _pump(app)
        # 1366×768 and 1280×720 screens, less the taskbar and title bar: the whole window fits.
        assert w.minimumSizeHint().height() <= size[1]
        assert w.height() <= size[1] + 1
        assert w.view.height() >= VIEW_MIN_H >= 260
        # The speech keeps 12 pt on the screen however small the wood is drawn.
        assert w.bubble.flags() & QGraphicsItem.GraphicsItemFlag.ItemIgnoresTransformations
        assert w.bubble.font().pointSize() == 12
        # The plaque gave up height first and still scrolls.
        assert w.plaque.height() < 220
        # The locked line and the listener line no longer take rows of their own.
        assert w.license_label.parentWidget() is w.unlock_btn.parentWidget()
        assert w.listener_label.parentWidget() is w.gpu_label.parentWidget()
    finally:
        w.close()
        w.deleteLater()
        _pump(app)


def test_the_picker_arrows_are_drawn_not_characters(app, tmp_path):
    w = _window(tmp_path)
    try:
        for btn, word in ((w.prev_btn, "Previous companion"), (w.next_btn, "Next companion")):
            assert btn.text() == ""
            assert not btn.icon().isNull()
            assert btn.iconSize().width() >= 12
            assert btn.toolTip() == word and btn.accessibleName() == word
    finally:
        w.deleteLater()
        _pump(app)


def test_one_locked_sentence_on_the_blotter_the_unlock_window_and_the_overlay(app, tmp_path):
    from computerpets_client import unlock_dialog as dialog

    assert dialog.LOCKED_LINE == "Locked. Pets still work without unlocking."
    html = (REPO / "desktop" / "renderer" / "settings.html").read_text(encoding="utf-8")
    assert html.count(f'licenseOk.textContent = "{dialog.LOCKED_LINE}";') == 2
    assert not re.search(r"Locked\. (Pets on the desk|Pet still lives|The pet on the blotter)", html)
    src = "\n".join(
        (REPO / "client" / "computerpets_client" / name).read_text(encoding="utf-8") for name in ("app.py", "unlock_dialog.py")
    )
    assert not re.search(r"Pet still lives on the blotter|The pet on the blotter still works", src)
    w = _window(tmp_path)
    try:
        assert w.license_label.text() == dialog.LOCKED_LINE
        d = dialog.UnlockDialog(w.session, w)
        assert d.ok.text() == dialog.LOCKED_LINE
        d.deleteLater()
    finally:
        w.deleteLater()
        _pump(app)


def test_download_my_pet_waits_with_a_reason_until_a_license_is_saved(app):
    from computerpets_client import unlock_dialog as dialog

    base = {"backendUrl": "", "fields": {}, "hwidMark": {"read": "unread"}, "unlocked": False}
    none = dialog.UnlockDialog({"status": lambda: {**base, "held": False}})
    held = dialog.UnlockDialog({"status": lambda: {**base, "held": True}})
    try:
        assert not none.download_btn.isEnabled()
        assert not none.download_help.isHidden()
        assert none.download_help.text() == dialog.DOWNLOAD_WAITS
        assert held.download_btn.isEnabled() and held.download_help.isHidden()
        # The overlay says the same words and waits the same way.
        html = (REPO / "desktop" / "renderer" / "settings.html").read_text(encoding="utf-8")
        assert f'<p class="hint" id="downloadHelp" hidden>{dialog.DOWNLOAD_WAITS}</p>' in html
        # After an unlock the button wakes.
        none._paint_status({**base, "held": True, "unlocked": False})
        assert none.download_btn.isEnabled() and none.download_help.isHidden()
    finally:
        none.deleteLater()
        held.deleteLater()
        _pump(app)


def test_status_says_whether_a_license_is_held(tmp_path):
    from computerpets_client.license.session import create_license_session

    session = create_license_session(user_data_dir=str(tmp_path), env={}, hwid="dev")
    assert session["status"]()["held"] is False
    (tmp_path / "license.json").write_text('{"license": {"ciphertext": "x", "iv": "y"}}', encoding="utf-8")
    assert session["status"]()["held"] is True


def test_only_the_known_harmless_offscreen_line_is_kept_quiet(app, capsys):
    from PyQt6.QtCore import qInstallMessageHandler, qWarning

    from computerpets_client.app import KNOWN_HARMLESS_QT, quiet_known_qt_noise

    assert KNOWN_HARMLESS_QT == frozenset({"This plugin does not support propagateSizeHints()"})
    assert quiet_known_qt_noise("xcb") is False
    assert quiet_known_qt_noise("wayland") is False
    try:
        assert quiet_known_qt_noise("offscreen") is True
        qWarning(b"This plugin does not support propagateSizeHints()")
        qWarning(b"QOpenGLWidget: Failed to create context")
        err = capsys.readouterr().err
        assert "propagateSizeHints" not in err
        assert "Failed to create context" in err
    finally:
        qInstallMessageHandler(None)


def test_check_prints_no_size_hint_noise(tmp_path):
    import subprocess
    import sys

    env = {**os.environ, "QT_QPA_PLATFORM": "offscreen", "COMPUTERPETS_CLIENT_HOME": str(tmp_path)}
    done = subprocess.run(
        [sys.executable, "-m", "computerpets_client", "--check"],
        cwd=REPO / "client", env=env, capture_output=True, text=True, timeout=120,
    )
    assert done.returncode == 0, done.stderr
    assert "propagateSizeHints" not in done.stdout + done.stderr
