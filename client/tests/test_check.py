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
