"""Renderer label stays honest. Does not claim a shader engine."""

from __future__ import annotations

import os

import pytest

pytest.importorskip("PyQt6")


def test_offscreen_does_not_claim_opengl_viewport():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication, QGraphicsView

    from computerpets_client.blotter import attach_gpu_viewport

    app = QApplication.instance() or QApplication([])
    view = QGraphicsView()
    label = attach_gpu_viewport(view)
    assert "shader engine" in label
    assert "software raster" in label
    assert "QOpenGLWidget" not in label or "On a display" in label
    del app
