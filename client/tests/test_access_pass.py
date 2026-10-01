"""The access pass: the Python client's Tab order and accessible names, a visible keyboard focus on the companion
chips, and small print that reads at WCAG AA on the plaque's paper."""

from __future__ import annotations

import os
from pathlib import Path

import pytest

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

REPO = Path(__file__).resolve().parents[2]


@pytest.fixture()
def app(tmp_path, monkeypatch):
    monkeypatch.setenv("COMPUTERPETS_CLIENT_HOME", str(tmp_path))
    from PyQt6.QtWidgets import QApplication

    return QApplication.instance() or QApplication([])


def _chain(app, root):
    """The widgets Tab reaches, in order."""
    from PyQt6.QtCore import Qt

    root.show()
    for _ in range(10):
        app.processEvents()
    out = []
    w = root.nextInFocusChain()
    start = w
    for _ in range(400):
        if w is None:
            break
        if w.focusPolicy().value & Qt.FocusPolicy.TabFocus.value and w.isVisible() and w.isEnabled() and root.isAncestorOf(w):
            out.append(w)
        w = w.nextInFocusChain()
        if w is start:
            break
    return out


def _named(w) -> str:
    text = w.text() if hasattr(w, "text") and callable(w.text) else ""
    return w.accessibleName() or text


def test_every_tab_stop_on_the_desk_has_a_name_and_the_order_follows_the_rows(app, tmp_path):
    from PyQt6.QtWidgets import QScrollArea

    from computerpets_client.app import DeskWindow

    w = DeskWindow()
    try:
        chain = _chain(app, w)
        nameless = [type(x).__name__ for x in chain if not _named(x).strip()]
        assert nameless == [], nameless
        # The care row, then the picker row (arrows, the companion box, Unlock), then the companion chips.
        order = [chain.index(x) for x in (w.feed_btn, w.talk_btn, w.prev_btn, w.kind_box, w.next_btn, w.unlock_btn)]
        assert order == sorted(order)
        assert w.kind_box.accessibleName() == "Companion"
        scrolls = [x.accessibleName() for x in chain if isinstance(x, QScrollArea)]
        assert "Companions" not in scrolls, "the rail's scroll area is not a Tab stop"
        assert set(scrolls) <= {"Species plaque"}, scrolls
        chips = [x for x in chain if " · " in _named(x)]
        assert len(chips) >= 200 and chain.index(chips[0]) > chain.index(w.unlock_btn)
    finally:
        w.close()


def test_a_companion_chip_draws_its_keyboard_focus():
    src = (REPO / "client" / "computerpets_client" / "rail.py").read_text(encoding="utf-8")
    assert "QPushButton:focus { border: 2px solid #f4ead8; padding: 3px 9px; }" in src
    assert 'scroll.setAccessibleName("Companions")' in src


def _tab_walk(app, root, n):
    """The widgets real Tab presses land on, in order, from the first Tab stop."""
    from PyQt6.QtCore import Qt
    from PyQt6.QtTest import QTest

    root.show()
    root.activateWindow()
    app.processEvents()
    root.focusNextChild()
    app.processEvents()
    seen = []
    for _ in range(n):
        seen.append(app.focusWidget())
        QTest.keyClick(app.focusWidget(), Qt.Key.Key_Tab)
        app.processEvents()
    return seen


def test_the_unlock_fields_carry_their_row_words_and_the_pet_box_is_one_tab_stop(app, tmp_path):
    from PyQt6.QtWidgets import QComboBox, QLineEdit

    from computerpets_client.app import DeskWindow
    from computerpets_client.unlock_dialog import APP_ID_LABEL, PET_LABEL, STEAM_ID_LABEL, UnlockDialog

    w = DeskWindow()
    try:
        d = UnlockDialog(w.session, w)
        assert d.backend.accessibleName() == "House server address"
        assert d.steam_id.accessibleName() == STEAM_ID_LABEL
        assert d.app_id.accessibleName() == APP_ID_LABEL
        assert d.pet_type.accessibleName() == PET_LABEL
        assert d.pet_type.lineEdit().accessibleName() == PET_LABEL
        walk = _tab_walk(app, d, 20)
        nameless = [type(x).__name__ for x in walk if not _named(x).strip()]
        assert nameless == [], nameless
        # One lap of the window visits the pet box once (its own text field is not a second stop).
        lap = walk[: walk.index(walk[0], 1)] if walk[0] in walk[1:] else walk
        pet_stops = [x for x in lap if x is d.pet_type or x is d.pet_type.lineEdit()]
        assert len(pet_stops) == 1, [type(x).__name__ for x in lap]
        assert not any(isinstance(x, QLineEdit) and isinstance(x.parent(), QComboBox) for x in lap if x is not d.pet_type.lineEdit())
        d.close()
    finally:
        w.close()


def _contrast(a: str, b: str) -> float:
    def lum(h: str) -> float:
        c = [int(h[i : i + 2], 16) / 255 for i in (1, 3, 5)]
        c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

    x, y = lum(a), lum(b)
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)


def test_the_plaques_small_print_reads_at_aa_on_its_paper():
    import re

    src = (REPO / "client" / "computerpets_client" / "plaque.py").read_text(encoding="utf-8")
    assert "color: #8a8074" not in src
    for color in set(re.findall(r"color: (#[0-9a-fA-F]{6})", src)):
        assert _contrast(color, "#f0e6d4") >= 4.5, color
