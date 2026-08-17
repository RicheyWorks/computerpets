"""A living pet on the blotter: wander, eat, hide, seek a treat."""

from __future__ import annotations

import math
import random

from PyQt6.QtCore import QRectF, Qt, pyqtSignal
from PyQt6.QtGui import QBrush, QColor, QCursor, QPainter, QPen
from PyQt6.QtWidgets import QGraphicsItem, QGraphicsObject, QGraphicsPixmapItem

from .frames import SIZE, frames_for, paint_treat
from .gait import (
    BREATHE_IDLE,
    BREATHE_SLEEP,
    POSE_HOLD_S,
    SETTLE_S,
    SWAY_PX,
    overshoot_px,
    settle_offset,
    turn_hold_s,
    walk_speed,
    wander_pause_s,
)
from .life import CareState, MessPile
from .shed import Coat
from .species import Species


class TreatItem(QGraphicsPixmapItem):
    def __init__(self, shape: str, x: float, y: float):
        super().__init__(paint_treat(shape))
        self.setPos(x, y)
        self.setZValue(2)
        self.setTransformationMode(Qt.TransformationMode.SmoothTransformation)


class ShedCoatItem(QGraphicsObject):
    """Old coat on the wood — same cream loop as the web / Electron blotter."""

    def __init__(self, coat: Coat, scene_width: float = 960):
        super().__init__()
        self.coat = coat
        x = 80 + (scene_width - 160) * (coat.x / 100.0)
        self.setPos(x, 412)
        self.setZValue(2)
        self.setRotation(-14)
        self.setAcceptedMouseButtons(Qt.MouseButton.NoButton)

    def boundingRect(self) -> QRectF:
        return QRectF(0, 0, 26, 7)

    def paint(self, painter: QPainter, option, widget=None) -> None:  # noqa: ARG002
        painter.setPen(QPen(QColor(12, 11, 10, 64), 1))
        painter.setBrush(QBrush(QColor(216, 207, 192, 190)))
        painter.drawRoundedRect(QRectF(0, 0, 26, 7), 3, 3)


class MessPileItem(QGraphicsObject):
    """Ink smudge on the blotter — darker and rounder than a shed coat. Tap to pick it up."""

    tapped = pyqtSignal(int)

    def __init__(self, pile: MessPile, scene_width: float = 960):
        super().__init__()
        self.pile = pile
        x = 80 + (scene_width - 160) * (pile.x / 100.0)
        self.setPos(x, 420)
        self.setZValue(2)
        self.setAcceptedMouseButtons(Qt.MouseButton.LeftButton)
        self.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))

    def boundingRect(self) -> QRectF:
        return QRectF(0, 0, 20, 14)

    def paint(self, painter: QPainter, option, widget=None) -> None:  # noqa: ARG002
        painter.setPen(QPen(QColor(12, 11, 10, 80), 1))
        painter.setBrush(QBrush(QColor(90, 74, 52, 204)))
        painter.drawEllipse(QRectF(1, 3, 18, 9))

    def mousePressEvent(self, event) -> None:
        if event.button() == Qt.MouseButton.LeftButton:
            self.tapped.emit(self.pile.id)
            event.accept()
            return
        super().mousePressEvent(event)


class LivingPetItem(QGraphicsObject):
    """Tap the guest to hear the house voice and keep the plaque on them."""

    tapped = pyqtSignal()

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
        self.dull = False
        self.unwell = False
        self.walk_age = 0.0
        self.turn_hold = 0.0
        self.pending_facing: int | None = None
        self.waypoints: list[float] = []
        self.pause = 0.0
        self.settle = 0.0
        self.settle_dir = 1
        self.overshoot = 0.0
        self.pose_hold = 0.0
        self.pending_pose: str | None = None
        self.shift = 0.0
        self.shift_age = 0.0
        self._display_dx = 0.0
        self._logic_x = 220.0
        self.setZValue(4)
        self.setFlag(QGraphicsItem.GraphicsItemFlag.ItemIsMovable, False)
        self.setAcceptedMouseButtons(Qt.MouseButton.LeftButton)
        self.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        self.setPos(220, self._floor_y())

    def mousePressEvent(self, event) -> None:
        if event.button() == Qt.MouseButton.LeftButton:
            self.tapped.emit()
            event.accept()
            return
        super().mousePressEvent(event)

    def boundingRect(self) -> QRectF:
        return QRectF(0, 0, SIZE, SIZE)

    def paint(self, painter: QPainter, option, widget=None) -> None:  # noqa: ARG002
        pack = self.frames.get(self.anim) or self.frames["idle"]
        pix = pack[self.frame % len(pack)]
        painter.save()
        breathe = 1.0
        if self.anim in ("idle", "sit", "sleep"):
            amp = BREATHE_SLEEP if self.anim == "sleep" else BREATHE_IDLE
            breathe = 1.0 + math.sin(self._bob_t * 4.6) * amp
        if self.facing < 0:
            painter.translate(SIZE, 0)
            painter.scale(-1, 1)
        painter.translate(0, SIZE)
        painter.scale(1, breathe)
        painter.translate(0, -SIZE)
        painter.drawPixmap(0, 0, pix)
        if self.dull:
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_SourceAtop)
            painter.fillRect(QRectF(0, 0, SIZE, SIZE), QColor(90, 120, 150, 95))
        elif self.unwell:
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_SourceAtop)
            painter.fillRect(QRectF(0, 0, SIZE, SIZE), QColor(62, 54, 42, 72))
        painter.restore()

    def set_dull(self, dull: bool) -> None:
        if self.dull == dull:
            return
        self.dull = dull
        self.update()

    def set_unwell(self, unwell: bool) -> None:
        if self.unwell == unwell:
            return
        self.unwell = unwell
        self.update()

    def _floor_y(self) -> float:
        y = 318.0
        if self.species.perch:
            y -= 18.0
        return y

    def set_species(self, species: Species) -> None:
        self.species = species
        self.frames = frames_for(species)
        self._logic_x = self.x() - self._display_dx
        self.setPos(self._logic_x, self._floor_y())
        self._display_dx = 0.0
        self.update()

    def _crawl(self) -> bool:
        return self.species.gait == "crawl"

    def _speed(self, kind: str, remaining: float | None = None) -> float:
        base = max(18.0, self.species.walk)
        if kind == "hide":
            base *= 1.6
        elif kind == "seek":
            base *= 1.4
        return walk_speed(999.0 if remaining is None else remaining, self.walk_age, base)

    def _aim_at(self, next_x: float) -> None:
        self.target = next_x
        self.walk_age = 0.0
        self.pause = 0.0
        self.settle = 0.0
        desired = 1 if next_x >= self._logic_x else -1
        if desired != self.facing:
            self.turn_hold = turn_hold_s(crawl=self._crawl(), walk=self.species.walk)
            self.pending_facing = desired
            self.anim = "idle"
            self.frame = 0
            return
        self.turn_hold = 0.0
        self.pending_facing = None
        self.facing = desired
        self.anim = "walk"
        self.frame = 0

    def _begin_settle(self, direction: int) -> None:
        self.target = None
        self.settle = 1.0
        self.settle_dir = direction
        self.overshoot = overshoot_px(crawl=self._crawl(), walk=self.species.walk)
        self.anim = "idle"
        self.frame = 0

    def issue(self, cmd: str, target: float | None = None) -> None:
        # play / talk are house verbs; the wood already has wander and sit.
        if cmd == "play":
            cmd = "wander"
        elif cmd == "talk":
            cmd = "sit"
        self.cmd = cmd
        self.target = target
        self.once_done = False
        self.waypoints = []
        self.pose_hold = 0.0
        self.pending_pose = None
        if cmd == "eat":
            self.anim = "eat"
            self.frame = 0
            self.acc = 0.0
        elif cmd in ("hide", "enter", "seek", "wander"):
            self.anim = "walk"
            self.frame = 0
            self.acc = 0.0
            self.walk_age = 0.0
            if target is not None:
                self._aim_at(target)
        elif cmd in ("sit", "sleep"):
            self.pose_hold = POSE_HOLD_S
            self.pending_pose = cmd
            self.anim = "idle"
            self.frame = 0

    def _place(self, x: float, y: float) -> None:
        sway = math.sin(self.walk_age * 5.5) * SWAY_PX if self.anim == "walk" and self._crawl() else 0.0
        shift = self.shift * math.sin((1.0 - self.shift_age / 0.85) * math.pi) if self.shift_age > 0 else 0.0
        settle = settle_offset(self.settle, self.settle_dir, self.overshoot) if self.settle > 0 else 0.0
        perch_step = abs(math.sin(self.walk_age * 8.0)) * 7.0 if self.anim == "walk" and self.species.perch and not self._crawl() else 0.0
        self._logic_x = x
        self._display_dx = sway + shift + settle
        self.setPos(x + self._display_dx, y - perch_step)
        self.update()

    def advance_pet(self, dt: float, care: CareState, width: float) -> None:
        if care.hidden and self.cmd not in ("hide", "enter"):
            if self._logic_x > -SIZE:
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
        x = self._logic_x
        self._bob_t += dt
        y = self._floor_y()
        if self.species.aquatic:
            y += math.sin(self._bob_t * 2.4) * 5

        if self.pose_hold > 0:
            self.pose_hold = max(0.0, self.pose_hold - dt)
            if self.pose_hold == 0 and self.pending_pose:
                self.anim = self.pending_pose
                self.pending_pose = None
                self.frame = 0
                self.acc = 0.0

        if self.settle > 0:
            self.settle = max(0.0, self.settle - dt / SETTLE_S)

        if self.turn_hold > 0:
            self.turn_hold = max(0.0, self.turn_hold - dt)
            if self.turn_hold == 0 and self.pending_facing is not None:
                self.facing = self.pending_facing
                self.pending_facing = None
                self.anim = "walk"
                self.frame = 0
                self.walk_age = 0.0

        if self.pause > 0:
            self.pause = max(0.0, self.pause - dt)
            self.anim = "idle"
            if self.pause == 0 and self.waypoints:
                self._aim_at(self.waypoints.pop(0))

        if (self.anim in ("idle", "sit")) and self.shift_age <= 0 and random.random() < dt * 0.45:
            self.shift = (1.0 + random.random() * 2.0) * (1 if random.random() < 0.5 else -1)
            self.shift_age = 0.85
        if self.shift_age > 0:
            self.shift_age = max(0.0, self.shift_age - dt)

        if self.cmd == "hide":
            self.anim = "walk"
            self.facing = -1
            self.walk_age += dt
            x -= self._speed("hide") * dt
            if x <= -SIZE:
                x = -SIZE
                self.anim = "idle"
            self._place(x, y)
            return

        if self.cmd == "enter":
            self.anim = "walk"
            self.facing = 1
            self.walk_age += dt
            if x < left:
                x = min(left, x + self._speed("hide") * dt) if x > -SIZE else -SIZE + self._speed("hide") * dt
                if x < -SIZE + 4:
                    x = -SIZE + 8
            x += self._speed("hide") * dt
            if x >= 200:
                x = 200
                self.cmd = "wander"
                self.anim = "idle"
                self.walk_age = 0.0
            self._place(x, y)
            return

        if self.cmd == "seek" and self.target is not None:
            if self.turn_hold <= 0:
                self.anim = "walk"
                self.walk_age += dt
                remaining = abs(self.target - x)
                direction = 1 if self.target >= x else -1
                x += direction * self._speed("seek", remaining) * dt
                if (direction == 1 and x >= self.target) or (direction == -1 and x <= self.target):
                    x = self.target
                    self.cmd = "eat"
                    self.anim = "eat"
                    self.frame = 0
                    self.target = None
                    self.walk_age = 0.0
            self._place(max(left, min(right, x)), y)
            return

        if self.cmd == "eat":
            self._place(x, y)
            return

        if self.cmd == "wander":
            if self.target is None and self.pause <= 0 and self.turn_hold <= 0 and self.settle <= 0:
                if random.random() < dt * 0.12:
                    roll = random.random()
                    if roll < 0.35:
                        self.cmd = "idle"
                        self.pose_hold = 0.0
                        self.anim = "idle"
                        self.target = None
                    elif roll < 0.55:
                        self.cmd = "sit"
                        self.pose_hold = POSE_HOLD_S
                        self.pending_pose = "sit"
                        self.anim = "idle"
                        self.target = None
                    else:
                        nxt = left + random.random() * (right - left)
                        self.waypoints = []
                        crawl = self._crawl()
                        low = self.species.walk < 40
                        if random.random() < (0.7 if crawl or low else 0.42):
                            second = left + random.random() * (right - left)
                            if abs(second - nxt) < 40:
                                second = max(left, min(right, nxt + self.facing * 80))
                            self.waypoints = [second]
                        self._aim_at(nxt)
            if self.target is not None and self.turn_hold <= 0 and self.pause <= 0:
                self.anim = "walk"
                self.walk_age += dt
                remaining = abs(self.target - x)
                direction = 1 if self.target >= x else -1
                x += direction * self._speed("wander", remaining) * dt
                if (direction == 1 and x >= self.target) or (direction == -1 and x <= self.target):
                    x = self.target
                    if self.waypoints:
                        self.target = None
                        self.pause = wander_pause_s()
                        self.anim = "idle"
                        self.frame = 0
                    else:
                        self._begin_settle(direction)
                        self.cmd = "idle"
            self._place(max(left, min(right, x)), y)
            return

        if self.cmd in ("idle", "sit", "sleep"):
            if random.random() < dt * 0.18:
                self.cmd = "wander"
                self.target = None
            elif self.pose_hold <= 0:
                if self.cmd == "sit":
                    self.anim = "sit"
                elif self.cmd == "sleep":
                    self.anim = "sleep"
                else:
                    self.anim = "idle"
            self._place(x, y)
