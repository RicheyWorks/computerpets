"""Procedural living-pet frames. The repo does not ship PNG sprite packs.

Drawn with QPainter into pixmaps, then composited by the GPU-backed scene.
Not photographed assets and not a shader engine.
"""

from __future__ import annotations

from PyQt6.QtCore import QPointF, QRectF, Qt
from PyQt6.QtGui import QBrush, QColor, QLinearGradient, QPainter, QPainterPath, QPen, QPixmap

from .species import Species

SIZE = 176
ANIMS = {
    "idle": 4,
    "walk": 6,
    "sit": 2,
    "eat": 4,
    "sleep": 4,
}


def _color(rgb: tuple[int, int, int], a: int = 255) -> QColor:
    return QColor(rgb[0], rgb[1], rgb[2], a)


def paint_frame(species: Species, anim: str, index: int) -> QPixmap:
    n = ANIMS.get(anim, 4)
    i = index % n
    pix = QPixmap(SIZE, SIZE)
    pix.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pix)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing, True)
    _draw_pet(painter, species, anim, i, n)
    painter.end()
    return pix


def frames_for(species: Species) -> dict[str, list[QPixmap]]:
    return {
        anim: [paint_frame(species, anim, i) for i in range(count)]
        for anim, count in ANIMS.items()
    }


def paint_treat(shape: str) -> QPixmap:
    pix = QPixmap(36, 28)
    pix.fill(Qt.GlobalColor.transparent)
    p = QPainter(pix)
    p.setRenderHint(QPainter.RenderHint.Antialiasing, True)
    if shape == "bamboo":
        p.setBrush(QBrush(QColor(168, 196, 92)))
        p.setPen(QPen(QColor(88, 120, 48), 1.4))
        p.drawRoundedRect(QRectF(6, 8, 24, 10), 4, 4)
        p.setPen(QPen(QColor(88, 120, 48), 1.2))
        p.drawLine(14, 8, 14, 18)
        p.drawLine(22, 8, 22, 18)
    else:
        p.setBrush(QBrush(QColor(196, 148, 88)))
        p.setPen(QPen(QColor(120, 80, 40), 1.2))
        p.drawEllipse(QRectF(10, 8, 16, 12))
    p.end()
    return pix


def _draw_pet(p: QPainter, species: Species, anim: str, i: int, _n: int) -> None:
    pal = species.palette
    bob = 0.0
    lean = 0.0
    sit = 0.0
    eat = 0.0
    sleep = 0.0
    stride = 0.0
    if anim == "idle":
        bob = (-1, 0, 1, 0)[i] * 2.2
    elif anim == "walk":
        bob = (0, -3, 0, -3, 0, -2)[i]
        lean = (1, 0, -1, 0, 1, 0)[i] * 3
        stride = (1, 0, -1, 0, 1, 0)[i]
    elif anim == "sit":
        sit = 14 + i * 2
        bob = i
    elif anim == "eat":
        sit = 8
        eat = (0, 6, 2, 7)[i]
        bob = 1
    elif anim == "sleep":
        sit = 18
        sleep = 1
        bob = (0, 1, 0, 1)[i]

    cx, cy = 88.0, 118.0 + bob + sit * 0.15
    p.translate(cx + lean, cy)
    if sleep:
        p.rotate(-18)

    # Shadow
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(QColor(20, 14, 10, 50)))
    p.drawEllipse(QRectF(-38, 38 - sit * 0.2, 76, 14))

    body = _color(pal.body)
    belly = _color(pal.belly)
    ear = _color(pal.ear)
    ear_inner = _color(pal.ear_inner)
    nose = _color(pal.nose)
    ring = _color(pal.ring)
    accent = _color(pal.accent)

    # Tail
    tail = QPainterPath()
    if species.silhouette == "cat":
        tail.moveTo(40, 8)
        tail.cubicTo(62, -18 - stride * 6, 48, -40, 28, -36)
    elif species.silhouette == "dog":
        tail.moveTo(38, 10)
        tail.cubicTo(56, 4, 58, -8 - stride * 4, 50, -16)
    else:
        tail.moveTo(36, 10)
        tail.cubicTo(70, 8, 78, 36, 58, 44)
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.2))
    p.drawPath(tail)
    if species.silhouette == "panda":
        p.setBrush(QBrush(ring))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QRectF(48, 18, 10, 8))
        p.drawEllipse(QRectF(60, 28, 9, 7))

    # Hind / fore legs
    p.setBrush(QBrush(ear if species.silhouette != "dog" else accent))
    p.setPen(Qt.PenStyle.NoPen)
    hind = 6 * stride
    fore = -6 * stride
    p.drawRoundedRect(QRectF(-22, 22, 12, 20 + (0 if anim != "walk" else abs(hind))), 4, 4)
    p.drawRoundedRect(QRectF(8, 22, 12, 20 + (0 if anim != "walk" else abs(fore))), 4, 4)
    p.drawRoundedRect(QRectF(-8, 24, 11, 16), 4, 4)
    p.drawRoundedRect(QRectF(18, 24, 11, 16), 4, 4)

    # Body
    p.setBrush(QBrush(body))
    p.setPen(QPen(accent, 1.1))
    p.drawRoundedRect(QRectF(-36, -18, 72, 52 - sit * 0.35), 28, 24)
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(belly))
    p.drawEllipse(QRectF(-18, -4, 36, 30 - sit * 0.2))

    # Head
    hx, hy = -2.0, -36.0 + eat * 0.4
    if species.silhouette == "cat":
        # Pointed ears
        p.setBrush(QBrush(ear))
        p.drawPolygon([QPointF(hx - 22, hy - 2), QPointF(hx - 8, hy - 28), QPointF(hx + 2, hy - 6)])
        p.drawPolygon([QPointF(hx + 22, hy - 2), QPointF(hx + 8, hy - 28), QPointF(hx - 2, hy - 6)])
        p.setBrush(QBrush(ear_inner))
        p.drawPolygon([QPointF(hx - 16, hy - 4), QPointF(hx - 8, hy - 20), QPointF(hx - 4, hy - 6)])
        p.drawPolygon([QPointF(hx + 16, hy - 4), QPointF(hx + 8, hy - 20), QPointF(hx + 4, hy - 6)])
    elif species.silhouette == "dog":
        p.setBrush(QBrush(ear))
        p.drawRoundedRect(QRectF(hx - 30, hy - 6, 16, 28), 7, 7)
        p.drawRoundedRect(QRectF(hx + 14, hy - 6, 16, 28), 7, 7)
    else:
        p.setBrush(QBrush(ear))
        p.drawEllipse(QRectF(hx - 30, hy - 22, 22, 22))
        p.drawEllipse(QRectF(hx + 8, hy - 22, 22, 22))
        p.setBrush(QBrush(ear_inner))
        p.drawEllipse(QRectF(hx - 24, hy - 16, 12, 12))
        p.drawEllipse(QRectF(hx + 12, hy - 16, 12, 12))

    p.setBrush(QBrush(body if species.silhouette != "panda" else belly))
    p.setPen(QPen(accent, 1.1))
    p.drawEllipse(QRectF(hx - 28, hy - 16, 56, 48))
    if species.silhouette == "panda":
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(body))
        p.drawEllipse(QRectF(hx - 26, hy + 2, 18, 16))
        p.drawEllipse(QRectF(hx + 8, hy + 2, 18, 16))

    # Face
    p.setPen(Qt.PenStyle.NoPen)
    if sleep:
        p.setPen(QPen(nose, 2.2))
        p.drawLine(int(hx - 12), int(hy + 6), int(hx - 4), int(hy + 8))
        p.drawLine(int(hx + 4), int(hy + 8), int(hx + 12), int(hy + 6))
        p.setPen(Qt.PenStyle.NoPen)
    else:
        blink = anim == "idle" and i == 3
        p.setBrush(QBrush(QColor(24, 16, 14)))
        if blink:
            p.setPen(QPen(QColor(24, 16, 14), 2))
            p.drawLine(int(hx - 12), int(hy + 6), int(hx - 4), int(hy + 6))
            p.drawLine(int(hx + 4), int(hy + 6), int(hx + 12), int(hy + 6))
            p.setPen(Qt.PenStyle.NoPen)
        else:
            p.drawEllipse(QRectF(hx - 13, hy + 2, 8, 9))
            p.drawEllipse(QRectF(hx + 5, hy + 2, 8, 9))
            p.setBrush(QBrush(QColor(250, 246, 236)))
            p.drawEllipse(QRectF(hx - 11, hy + 3, 3, 3))
            p.drawEllipse(QRectF(hx + 7, hy + 3, 3, 3))

    p.setBrush(QBrush(nose))
    if species.silhouette == "dog":
        p.drawEllipse(QRectF(hx - 7, hy + 12, 14, 10))
    else:
        p.drawEllipse(QRectF(hx - 5, hy + 12, 10, 8))

    if eat:
        p.setBrush(QBrush(QColor(40, 24, 20)))
        p.drawEllipse(QRectF(hx - 6, hy + 20, 12, 5 + eat * 0.15))

    # Soft top light
    grad = QLinearGradient(QPointF(-20, -50), QPointF(20, 10))
    grad.setColorAt(0, QColor(255, 236, 210, 40))
    grad.setColorAt(1, QColor(255, 236, 210, 0))
    p.setBrush(QBrush(grad))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawEllipse(QRectF(hx - 20, hy - 14, 40, 22))
