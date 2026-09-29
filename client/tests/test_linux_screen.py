"""The blotter on a Linux desktop without Qt's X11 pieces says which packages to install, instead of Qt's abort."""

from __future__ import annotations

import pytest

from computerpets_client.screen import linux_screen_pieces_message, missing_pieces

X11 = {"DISPLAY": ":0"}


def none(_name: str) -> None:
    return None


def here(_name: str) -> str:
    return "libxcb-cursor.so.0"


def test_linux_x11_missing_pieces_names_the_packages_in_plain_words():
    # What the box's fresh Debian desktop had: none of the three (Qt named only libxcb-cursor, then aborted).
    msg = linux_screen_pieces_message("linux", X11, none, lambda: ["libxcb-keysyms.so.1", "libxkbcommon-x11.so.0"])
    assert msg == (
        "The blotter needs 3 more Linux pieces to open its window. On Ubuntu or Debian type sudo apt install "
        "libxcb-cursor0 libxcb-keysyms1 libxkbcommon-x11-0 and press Enter. On other Linux, install the packages that "
        "have libxcb-cursor.so.0, libxcb-keysyms.so.1, libxkbcommon-x11.so.0. Then type python -m computerpets_client "
        "again."
    )
    assert "Reinstall" not in msg and "plugin" not in msg
    one = linux_screen_pieces_message("linux", {**X11, "QT_QPA_PLATFORM": "xcb"}, none, lambda: [])
    assert one.startswith("The blotter needs one more Linux piece to open its window. On Ubuntu or Debian type sudo apt install libxcb-cursor0 and press Enter.")
    odd = linux_screen_pieces_message("linux", X11, here, lambda: ["libodd.so.9"])
    assert odd == "The blotter needs one more Linux piece to open its window. Install the packages that have libodd.so.9. Then type python -m computerpets_client again."


@pytest.mark.parametrize(
    ("platform", "env", "find", "gone"),
    [
        ("linux", X11, here, []),  # every piece is here
        ("win32", X11, none, ["x"]),  # Windows and the Mac do not use X11
        ("darwin", X11, none, ["x"]),
        ("linux", {**X11, "QT_QPA_PLATFORM": "offscreen"}, none, ["x"]),  # --check, CI
        ("linux", {**X11, "QT_QPA_PLATFORM": "wayland"}, none, ["x"]),
        ("linux", {**X11, "WAYLAND_DISPLAY": "wayland-0"}, none, ["x"]),  # a Wayland session: Qt picks Wayland
        ("linux", {}, none, ["x"]),  # no screen at all: Qt says that itself
    ],
)
def test_nothing_to_say_where_the_x11_pieces_are_not_needed_or_are_there(platform, env, find, gone):
    assert linux_screen_pieces_message(platform, env, find, lambda: gone) is None


def test_missing_pieces_reads_the_real_plugin():
    # With PyQt6 here (a Linux venv), the file names ldd cannot find; with no PyQt6, nothing to say.
    real = missing_pieces()
    assert isinstance(real, list) and all(isinstance(x, str) and ".so" in x for x in real)


def test_main_stops_with_the_words_before_qt_starts(monkeypatch, capsys):
    pytest.importorskip("PyQt6")
    from computerpets_client import app

    monkeypatch.setattr("computerpets_client.screen.sys.platform", "linux")
    monkeypatch.setenv("DISPLAY", ":0")
    monkeypatch.delenv("QT_QPA_PLATFORM", raising=False)
    monkeypatch.delenv("WAYLAND_DISPLAY", raising=False)
    monkeypatch.setattr("computerpets_client.screen._find_library", none)

    def no_qt(*_a, **_k):
        raise AssertionError("Qt started: it aborts (exit 134) without its X11 pieces")

    monkeypatch.setattr(app, "QApplication", type("NoQt", (), {"instance": staticmethod(lambda: None), "__new__": no_qt}))
    assert app.main([]) == 1
    assert "sudo apt install libxcb-cursor0" in capsys.readouterr().err
