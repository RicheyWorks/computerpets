"""Offscreen --check still constructs a window with a living pet."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest

pytest.importorskip("PyQt6")

CLIENT_ROOT = Path(__file__).resolve().parents[1]


def test_offscreen_check_constructs_window():
    env = os.environ.copy()
    env["QT_QPA_PLATFORM"] = "offscreen"
    result = subprocess.run(
        [sys.executable, "-m", "computerpets_client", "--check"],
        cwd=CLIENT_ROOT,
        env=env,
        capture_output=True,
        text=True,
        timeout=45,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    assert "on the blotter" in result.stdout
    assert "140 living kinds" in result.stdout
    assert "species plaque" in result.stdout
    assert "shader engine" in result.stdout
    assert any(sky in result.stdout for sky in ("Clear", "Rain", "Wind", "Heat"))
    assert "may call" in result.stdout
    assert any(part in result.stdout for part in ("Dawn", "Day", "Dusk", "Night"))
    assert "14:00" in result.stdout
    assert "Day" in result.stdout
    assert "awake" in result.stdout or "resting" in result.stdout
    assert "Steal ribbon" in result.stdout
    assert "is well" in result.stdout


def test_desk_has_play_and_the_house_special():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    window.show()
    assert window.play_btn is not None
    assert window.play_btn.text() == "Play"
    assert window.special_btn is not None
    assert window.species.key == "red_panda"
    assert window.special_btn.text() == "Steal ribbon"
    window._play()
    assert window.pet.cmd in ("play", "wander")
    assert window.care.last_line
    window._pick_key("hognose")
    assert window.special_btn.text() == "Play dead"
    window._special()
    assert window.pet.cmd == "sit"
    assert window.care.last_line == "I died. I got over it."
    window.close()
    del app


def test_desk_day_has_weather_visitor_and_shed_coat():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.hours import day_part_label
    from computerpets_client.weather import weather_label

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    window.show()
    assert window.weather.sky in ("clear", "rain", "wind", "heat")
    assert weather_label(window.weather.sky) in window.vital_label.text()
    assert window.hours.part in ("dawn", "day", "dusk", "night")
    assert day_part_label(window.hours.part) in window.vital_label.text()
    assert window.guest.species.key != window.species.key
    assert "may call" in window.vital_label.text()
    window._pick_key("ball_python")
    assert window.shed_btn.isVisible()
    assert window.pet.dull
    window._shed()
    assert len(window.coats) == 1
    assert window.coats[0].coat.kind == "shed"
    assert not window.pet.dull
    window.close()
    del app


def test_desk_clean_clears_a_seeded_mess():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from dataclasses import replace

    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.life import MessPile

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    window.show()
    window.care = replace(window.care, mess=[MessPile(id=1, x=30)], hygiene=20)
    window._sync_mess()
    assert len(window.piles) == 1
    assert window.piles[0].pile.kind == "mess"
    window._clean()
    assert window.piles == []
    assert window.care.mess == []
    assert window.care.hygiene > 20
    window.close()
    del app


def test_desk_medicine_clears_unwell():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from dataclasses import replace

    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    window.show()
    window.care = replace(window.care, sick=True, health=40)
    window._refresh_vitals()
    assert "Unwell" in window.vital_label.text()
    assert window.medicine_btn.isVisible()
    assert window.pet.unwell
    window._medicine()
    assert window.care.sick is False
    assert "Unwell" not in window.vital_label.text()
    assert not window.medicine_btn.isVisible()
    assert not window.pet.unwell
    window.close()
    del app


def test_return_line_after_a_real_absence(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    import json
    import time

    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    ago = int(time.time() * 1000) - 2 * 3_600_000
    (tmp_path / "seen.json").write_text(json.dumps({"red_panda": ago}), encoding="utf-8")
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    assert window.care.last_line == "You were elsewhere. I practiced waiting."
    window.close()
    del app


def test_resting_guest_sits_on_greet(tmp_path, monkeypatch):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    monkeypatch.setattr("computerpets_client.app.is_resting_hour", lambda key, hour=None: True)
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    assert window.pet.cmd == "sit"
    window.close()
    del app


def test_frames_paint_for_every_catalog_key():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.frames import ANIMS, frames_for, paint_treat
    from computerpets_client.species import CATALOG_KEYS, SPECIES

    app = QApplication.instance() or QApplication([])
    for key in CATALOG_KEYS:
        pack = frames_for(SPECIES[key])
        assert set(pack) == set(ANIMS)
        for anim, frames in pack.items():
            assert len(frames) == ANIMS[anim]
            assert not frames[0].isNull()
        treat = paint_treat(SPECIES[key].treat_shape)
        assert not treat.isNull()
    del app
