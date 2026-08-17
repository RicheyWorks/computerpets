"""Wooden study blotter. GPU path is Qt's OpenGL-backed QGraphicsView.

This is not a custom shader engine. Sprites are QPainter pixmaps composited
by Qt RHI / OpenGL when a QOpenGLWidget viewport attaches.
"""

from __future__ import annotations

import os

from PyQt6.QtCore import QRectF, Qt
from PyQt6.QtGui import QBrush, QColor, QLinearGradient, QPainter, QPainterPath, QPen
from PyQt6.QtWidgets import QGraphicsObject, QGraphicsRectItem, QGraphicsView, QWidget

from .weather import Weather, weather_of


RENDERER_HONEST = (
    "Qt OpenGL viewport (QGraphicsView + QOpenGLWidget). "
    "Not a custom shader engine — Qt composites the scene on the GPU."
)
RENDERER_FALLBACK = (
    "Qt software raster (OpenGL viewport unavailable). "
    "Still QGraphicsScene — not a custom shader engine."
)


def attach_gpu_viewport(view: QGraphicsView) -> str:
    """Use Qt's GPU-backed viewport when the platform can create one."""
    platform = (os.environ.get("QT_QPA_PLATFORM") or "").split(":")[0]
    if platform in ("offscreen", "minimal", "vnc"):
        return (
            "Qt software raster (offscreen/minimal platform). "
            "On a display this client uses QGraphicsView + QOpenGLWidget — "
            "not a custom shader engine."
        )
    try:
        from PyQt6.QtGui import QOpenGLContext, QSurfaceFormat
        from PyQt6.QtOpenGLWidgets import QOpenGLWidget

        fmt = QSurfaceFormat()
        fmt.setRenderableType(QSurfaceFormat.RenderableType.OpenGL)
        fmt.setSwapBehavior(QSurfaceFormat.SwapBehavior.DoubleBuffer)
        fmt.setSamples(4)
        probe = QOpenGLContext()
        probe.setFormat(fmt)
        if not probe.create():
            return RENDERER_FALLBACK
        gl = QOpenGLWidget()
        gl.setFormat(fmt)
        view.setViewport(gl)
        view.setViewportUpdateMode(QGraphicsView.ViewportUpdateMode.FullViewportUpdate)
        return RENDERER_HONEST
    except Exception:
        return RENDERER_FALLBACK


class DeskBackground(QGraphicsRectItem):
    def __init__(self, width: float = 960, height: float = 540):
        super().__init__(0, 0, width, height)
        self.setZValue(-10)
        self.setAcceptedMouseButtons(Qt.MouseButton.NoButton)

    def paint(self, painter: QPainter, option, widget: QWidget | None = None) -> None:  # noqa: ARG002
        rect = self.rect()
        wood = QLinearGradient(rect.topLeft(), rect.bottomRight())
        wood.setColorAt(0, QColor(92, 62, 38))
        wood.setColorAt(0.45, QColor(120, 78, 46))
        wood.setColorAt(1, QColor(72, 48, 30))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(wood))
        painter.drawRect(rect)

        # Grain
        painter.setPen(QPen(QColor(60, 38, 22, 50), 1))
        y = 18
        while y < rect.height():
            painter.drawLine(int(rect.left()), int(y), int(rect.right()), int(y))
            y += 14

        # Window light
        glow = QLinearGradient(rect.topRight(), rect.center())
        glow.setColorAt(0, QColor(176, 196, 210, 55))
        glow.setColorAt(1, QColor(176, 196, 210, 0))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(glow))
        painter.drawRect(rect)

        # Blotter
        blotter = QRectF(70, 210, rect.width() - 140, 240)
        painter.setBrush(QBrush(QColor(54, 92, 70)))
        painter.setPen(QPen(QColor(36, 64, 48), 2))
        painter.drawRoundedRect(blotter, 10, 10)
        painter.setBrush(QBrush(QColor(46, 80, 60)))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawRoundedRect(blotter.adjusted(10, 10, -10, -10), 6, 6)

        # Books
        painter.setBrush(QBrush(QColor(120, 48, 42)))
        painter.drawRoundedRect(QRectF(92, 148, 86, 58), 3, 3)
        painter.setBrush(QBrush(QColor(48, 64, 96)))
        painter.drawRoundedRect(QRectF(108, 132, 86, 58), 3, 3)
        painter.setBrush(QBrush(QColor(168, 132, 64)))
        painter.drawRoundedRect(QRectF(124, 118, 86, 56), 3, 3)

        # Brass lamp
        painter.setBrush(QBrush(QColor(196, 156, 72)))
        painter.drawEllipse(QRectF(rect.width() - 210, 88, 36, 18))
        path = QPainterPath()
        path.moveTo(rect.width() - 192, 100)
        path.quadTo(rect.width() - 160, 70, rect.width() - 120, 118)
        painter.setPen(QPen(QColor(168, 128, 56), 5))
        painter.setBrush(Qt.BrushStyle.NoBrush)
        painter.drawPath(path)
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(QColor(196, 156, 72)))
        painter.drawEllipse(QRectF(rect.width() - 148, 112, 52, 22))
        lamp = QLinearGradient(rect.width() - 140, 130, rect.width() - 80, 280)
        lamp.setColorAt(0, QColor(232, 196, 120, 70))
        lamp.setColorAt(1, QColor(232, 196, 120, 0))
        painter.setBrush(QBrush(lamp))
        painter.drawEllipse(QRectF(rect.width() - 220, 130, 200, 160))

        # Inkwell
        painter.setBrush(QBrush(QColor(28, 24, 22)))
        painter.drawEllipse(QRectF(rect.width() - 280, 188, 28, 18))
        painter.setBrush(QBrush(QColor(80, 48, 36)))
        painter.drawRect(QRectF(rect.width() - 274, 168, 6, 24))


class WeatherLayer(QGraphicsObject):
    """Rain, wind, or heat wash — same four skies as the web / Electron desk."""

    def __init__(self, width: float = 960, height: float = 540, sky: Weather | None = None):
        super().__init__()
        self._width = width
        self._height = height
        self.sky: Weather = sky if sky is not None else weather_of()
        self._t = 0.0
        self.setZValue(1)
        self.setAcceptedMouseButtons(Qt.MouseButton.NoButton)

    def boundingRect(self) -> QRectF:
        return QRectF(0, 0, self._width, self._height)

    def set_sky(self, sky: Weather) -> None:
        if sky == self.sky:
            return
        self.sky = sky
        self.update()

    def advance_weather(self, dt: float) -> None:
        if self.sky in ("rain", "wind"):
            self._t += dt
            self.update()

    def paint(self, painter: QPainter, option, widget: QWidget | None = None) -> None:  # noqa: ARG002
        if self.sky == "clear":
            return
        painter.setPen(Qt.PenStyle.NoPen)
        if self.sky == "heat":
            wash = QLinearGradient(self._width * 0.7, 0, self._width * 0.2, self._height * 0.7)
            wash.setColorAt(0, QColor(176, 137, 104, 36))
            wash.setColorAt(1, QColor(176, 137, 104, 0))
            painter.setBrush(QBrush(wash))
            painter.drawRect(self.boundingRect())
            return
        if self.sky == "rain":
            dim = QLinearGradient(0, 0, 0, self._height)
            dim.setColorAt(0, QColor(12, 11, 10, 0))
            dim.setColorAt(1, QColor(12, 11, 10, 30))
            painter.setBrush(QBrush(dim))
            painter.drawRect(self.boundingRect())
            painter.setPen(QPen(QColor(216, 207, 192, 72), 1))
            for i in range(16):
                x = 4 + i * (self._width * 0.06)
                delay = (i % 6) * 0.16
                phase = (self._t + delay) % 0.85
                y = -0.12 * self._height + (phase / 0.85) * (self._height * 1.3)
                drift = 10 * (phase / 0.85)
                painter.drawLine(int(x + drift), int(y), int(x + drift), int(y + self._height * 0.18))
            return
        painter.setPen(QPen(QColor(216, 207, 192, 46), 1))
        for i in range(7):
            y = 16 + i * (self._height * 0.10)
            delay = i * 0.35
            phase = (self._t + delay) % 3.2
            x = -0.12 * self._width + (phase / 3.2) * (self._width * 1.2)
            painter.drawLine(int(x), int(y), int(x + self._width * 0.24), int(y))
