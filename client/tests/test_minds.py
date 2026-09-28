"""Minds on the blotter: pets talk without an AI, and House lines shows no AI boxes.

The same words sit on the web desk (web/src/lib/ai/mind-words.ts) and in the overlay Settings window
(desktop/renderer/settings.html); these tests hold all three together.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

import pytest

from computerpets_client import minds
from computerpets_client.listener import PRESETS

ROOT = Path(__file__).resolve().parents[2]
WEB_WORDS = (ROOT / "web" / "src" / "lib" / "ai" / "mind-words.ts").read_text(encoding="utf-8")
SETTINGS = (ROOT / "desktop" / "renderer" / "settings.html").read_text(encoding="utf-8")
MIND_JS = (ROOT / "desktop" / "renderer" / "mind.js").read_text(encoding="utf-8")


def _web(name: str) -> str:
    hit = re.search(rf'^\s+{name}: "((?:[^"\\]|\\.)*)",\r?$', WEB_WORDS, re.M)
    assert hit, name
    return hit.group(1)


def test_the_same_words_on_the_web_desk_the_overlay_and_the_blotter():
    pairs = {
        "intro": minds.MINDS_INTRO,
        "which": minds.WHICH_LABEL,
        "house": minds.HOUSE_NOTE,
        "model": minds.MODEL_LABEL,
        "modelHelp": minds.MODEL_HELP,
        "address": minds.ADDRESS_LABEL,
        "addressHelp": minds.ADDRESS_HELP,
        "key": minds.KEY_LABEL,
        "keyHelp": minds.KEY_HELP,
        "keyPlaceholder": minds.KEY_PLACEHOLDER,
    }
    for name, text in pairs.items():
        assert _web(name) == text, name
    assert f'<p class="lead" id="mindsIntro">{minds.MINDS_INTRO}</p>' in SETTINGS
    assert f'<p class="lead" id="mindHouse">{minds.HOUSE_NOTE}</p>' in SETTINGS
    assert f'<label for="base">{minds.ADDRESS_LABEL}</label>' in SETTINGS
    assert f'<p class="hint" id="baseHelp">{minds.ADDRESS_HELP}</p>' in SETTINGS
    assert f'<label for="key">{minds.KEY_LABEL}</label>' in SETTINGS
    assert f'<p class="hint" id="keyHelp">{minds.KEY_HELP}</p>' in SETTINGS
    assert f'<label for="plugin">{minds.WHICH_LABEL}</label>' in SETTINGS
    assert f'<label for="model">{minds.MODEL_LABEL}</label>' in SETTINGS
    assert f'<p class="hint" id="modelHelp">{minds.MODEL_HELP}</p>' in SETTINGS
    assert f'placeholder="{minds.KEY_PLACEHOLDER}"' in SETTINGS


def test_no_base_url_or_api_key_words_left_on_a_minds_screen():
    assert not re.search(r"<label[^>]*>(Base URL|API key|Plugin|Model)</label>", SETTINGS)
    # The overlay's refusal lines (what a keeper reads when an address is refused) use the plain name too.
    said = re.findall(r'return "([^"]*)";', MIND_JS[MIND_JS.index("function baseUrlProblem("):MIND_JS.index("function binding(")])
    assert len(said) >= 5
    for line in said:
        assert "Base URL" not in line and "API key" not in line and "plugin's" not in line, line
    assert any("AI website address" in line for line in said)


def test_house_lines_shows_no_ai_boxes_and_every_real_ai_shows_all_three():
    assert minds.mind_fields("local") == []
    assert minds.mind_fields(None) == [] and minds.mind_fields("not-a-plugin") == []
    for row in PRESETS:
        if row["kind"] == "local":
            continue
        labels = [f["label"] for f in minds.mind_fields(row["id"])]
        assert labels == [minds.MODEL_LABEL, minds.ADDRESS_LABEL, minds.KEY_LABEL], row["id"]
        helps = [f["help"] for f in minds.mind_fields(row["id"])]
        assert helps == [minds.MODEL_HELP, minds.ADDRESS_HELP, minds.KEY_HELP], row["id"]
    assert minds.blotter_minds_text().startswith("Pets talk without an AI.")
    assert "House lines need nothing else." in minds.blotter_minds_text()


def test_the_blotter_window_says_talk_works_without_an_ai_and_shows_no_ai_box(tmp_path):
    pytest.importorskip("PyQt6")
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication, QLabel, QLineEdit

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    app.processEvents()
    assert window.minds_label.objectName() == "mindsNote"
    assert window.minds_label.text() == minds.blotter_minds_text()
    assert window.minds_label.isVisible()
    words = {minds.MODEL_LABEL, minds.ADDRESS_LABEL, minds.KEY_LABEL, "Base URL", "API key", "Model"}
    assert not [w for w in window.findChildren(QLabel) if w.text().strip() in words]
    assert not [w for w in window.findChildren(QLineEdit) if w.echoMode() != QLineEdit.EchoMode.Normal]
    assert window.listener_label.text() == "Listening · House lines"
    window.close()
