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
    assert "30 living kinds" in result.stdout
    assert "species plaque" in result.stdout
    assert "shader engine" in result.stdout
    assert any(sky in result.stdout for sky in ("Clear", "Rain", "Wind", "Heat"))
    assert "may call" in result.stdout


def test_desk_day_has_weather_visitor_and_shed_coat():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.weather import weather_label

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    window.show()
    assert window.weather.sky in ("clear", "rain", "wind", "heat")
    assert weather_label(window.weather.sky) in window.vital_label.text()
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
