"""A living pet on the blotter: wander, eat, hide, seek a treat."""

from __future__ import annotations

import math
import random

from PyQt6.QtCore import QRectF, Qt
from PyQt6.QtGui import QPainter
from PyQt6.QtWidgets import QGraphicsItem, QGraphicsObject, QGraphicsPixmapItem

from .frames import SIZE, frames_for, paint_treat
from .life import CareState
from .species import Species


class TreatItem(QGraphicsPixmapItem):
    def __init__(self, shape: str, x: float, y: float):
        super().__init__(paint_treat(shape))
        self.setPos(x, y)
        self.setZValue(2)
        self.setTransformationMode(Qt.TransformationMode.SmoothTransformation)


class LivingPetItem(QGraphicsObject):
    def __init__(self, species: Species):
        super().__init__()
        self.species = species
        self.frames = frames_for(species)
        self.anim = "idle"
        self.frame = 0
        self.acc = 0.0
        self.facing = 1
        self.cmd = "wander"
        self.target: float | None = None
        self.once_done = False
        self._bob_t = 0.0
        self.setZValue(4)
        self.setFlag(QGraphicsItem.GraphicsItemFlag.ItemIsMovable, False)
        self.setPos(220, self._floor_y())

    def boundingRect(self) -> QRectF:
        return QRectF(0, 0, SIZE, SIZE)

    def paint(self, painter: QPainter, option, widget=None) -> None:  # noqa: ARG002
        pack = self.frames.get(self.anim) or self.frames["idle"]
        pix = pack[self.frame % len(pack)]
        painter.save()
        if self.facing < 0:
            painter.translate(SIZE, 0)
            painter.scale(-1, 1)
        painter.drawPixmap(0, 0, pix)
        painter.restore()

    def _floor_y(self) -> float:
        y = 318.0
        if self.species.perch:
            y -= 18.0
        return y

    def set_species(self, species: Species) -> None:
        self.species = species
        self.frames = frames_for(species)
        self.setPos(self.x(), self._floor_y())
        self.update()

    def _speed(self, kind: str) -> float:
        base = max(18.0, self.species.walk)
        if kind == "hide":
            return base * 1.6
        if kind == "seek":
            return base * 1.4
        return base

    def issue(self, cmd: str, target: float | None = None) -> None:
        self.cmd = cmd
        self.target = target
        self.once_done = False
        if cmd == "eat":
            self.anim = "eat"
            self.frame = 0
            self.acc = 0.0
        elif cmd in ("hide", "enter", "seek", "wander"):
            self.anim = "walk"
            self.frame = 0
            self.acc = 0.0
        elif cmd == "sit":
            self.anim = "sit"

    def advance_pet(self, dt: float, care: CareState, width: float) -> None:
        if care.hidden and self.cmd not in ("hide", "enter"):
            if self.x() > -SIZE:
                self.cmd = "hide"
            else:
                return

        fps = self.species.fps.get(self.anim, 3.0)
        self.acc += dt
        step = 1.0 / max(0.5, fps)
        pack = self.frames.get(self.anim) or self.frames["idle"]
        while self.acc >= step:
            self.acc -= step
            self.frame += 1
            if self.anim in ("eat",) and self.frame >= len(pack):
                self.once_done = True
                self.anim = "idle"
                self.frame = 0
                if self.cmd == "eat":
                    self.cmd = "wander"
            self.frame %= len(pack)

        left = 80.0
        right = max(left + 40.0, width - SIZE - 80.0)
        x = self.x()
        self._bob_t += dt
        y = self._floor_y()
        if self.species.aquatic:
            y += math.sin(self._bob_t * 2.4) * 5

        if self.cmd == "hide":
            self.anim = "walk"
            self.facing = -1
            x -= self._speed("hide") * dt
            if x <= -SIZE:
                x = -SIZE
                self.anim = "idle"
            self.setPos(x, y)
            self.update()
            return

        if self.cmd == "enter":
            self.anim = "walk"
            self.facing = 1
            if x < left:
                x = min(left, x + self._speed("hide") * dt) if x > -SIZE else -SIZE + self._speed("hide") * dt
                if x < -SIZE + 4:
                    x = -SIZE + 8
            x += self._speed("hide") * dt
            if x >= 200:
                x = 200
                self.cmd = "wander"
                self.anim = "idle"
            self.setPos(x, y)
            self.update()
            return

        if self.cmd == "seek" and self.target is not None:
            self.anim = "walk"
            self.facing = 1 if self.target > x else -1
            x += self.facing * self._speed("seek") * dt
            if abs(x - self.target) < 12:
                self.cmd = "eat"
                self.anim = "eat"
                self.frame = 0
                self.target = None
            self.setPos(max(left, min(right, x)), y)
            self.update()
            return

        if self.cmd == "eat":
            self.setPos(x, y)
            self.update()
            return

        if self.cmd == "wander":
            if self.target is None or random.random() < dt * 0.12:
                if random.random() < 0.35:
                    self.cmd = "idle"
                    self.anim = "idle"
                    self.target = None
                elif random.random() < 0.2:
                    self.cmd = "sit"
                    self.anim = "sit"
                    self.target = None
                else:
                    self.target = left + random.random() * (right - left)
            if self.target is not None:
                self.anim = "walk"
                self.facing = 1 if self.target > x else -1
                x += self.facing * self._speed("wander") * dt
                if abs(x - self.target) < 8:
                    self.target = None
                    self.cmd = "idle"
                    self.anim = "idle"
            self.setPos(max(left, min(right, x)), y)
            self.update()
            return

        if self.cmd in ("idle", "sit"):
            if random.random() < dt * 0.18:
                self.cmd = "wander"
                self.target = None
            self.anim = "sit" if self.cmd == "sit" else "idle"
            self.setPos(x, y)
            self.update()
