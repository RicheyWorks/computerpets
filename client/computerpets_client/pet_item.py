"""A living pet on the blotter: wander, eat, hide, seek a treat."""

from __future__ import annotations

import math
import random

from PyQt6.QtCore import QRectF, Qt, pyqtSignal
from PyQt6.QtGui import QBrush, QColor, QCursor, QPainter, QPen
from PyQt6.QtWidgets import QGraphicsItem, QGraphicsObject, QGraphicsPixmapItem

from .frames import SIZE, frames_for, paint_treat
from .ethogram import act_pose, after_settle_wait, next_act_wait, pick_act, tongue_flick
from .gait import (
    BREATHE_IDLE,
    BREATHE_SLEEP,
    POSE_HOLD_S,
    SETTLE_S,
    SWAY_PX,
    enter_sit,
    enter_spawn,
    leave_target,
    overshoot_px,
    settle_offset,
    turn_hold_s,
    walk_speed,
    wander_pause_s,
)
from .hours import day_part
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
        self.act: str | None = None
        self.act_motion: str | None = None
        self.act_t = 0.0
        self.act_hold = 0.0
        self.act_wait = 10.0 + random.random() * 8.0
        self.act_walk = False
        self._tongue = 0.0
        self._edge: float | None = None
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
        pose = act_pose(self.act_motion, self.act_t, self.act_hold) if self.act else None
        stretch = breathe * (pose["stretch"] if pose else 1.0)
        painter.translate(0, SIZE)
        painter.scale(1, stretch)
        painter.translate(0, -SIZE)
        if pose and pose["rot"]:
            painter.translate(SIZE / 2, SIZE)
            painter.rotate(pose["rot"])
            painter.translate(-SIZE / 2, -SIZE)
        painter.drawPixmap(0, 0, pix)
        if self._tongue > 0.02 and self.species.gait == "crawl":
            painter.setPen(QPen(QColor(214, 92, 108, int(240 * self._tongue)), 1.7))
            snout_x = SIZE * 0.5 + 36
            snout_y = SIZE - 48
            painter.drawLine(int(snout_x), int(snout_y), int(snout_x + 14), int(snout_y))
            painter.drawLine(int(snout_x + 14), int(snout_y), int(snout_x + 26), int(snout_y - 5))
            painter.drawLine(int(snout_x + 14), int(snout_y), int(snout_x + 26), int(snout_y + 5))
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
        self.act_wait = after_settle_wait(self._wander_rate())

    def _wander_rate(self) -> float:
        return max(0.06, min(0.8, self.species.walk / 200.0))

    def _clear_act(self) -> None:
        self.act = None
        self.act_motion = None
        self.act_t = 0.0
        self.act_hold = 0.0
        self.act_walk = False
        self._tongue = 0.0

    def _start_act(self, act: dict | None) -> None:
        if not act:
            return
        self.act = act["name"]
        self.act_motion = act["motion"]
        self.act_t = 0.0
        self.act_hold = float(act["hold"])
        self.target = None
        self.waypoints = []
        if act.get("anim"):
            self.anim = act["anim"]
            self.frame = 0
            self.acc = 0.0
        if act["motion"] in ("dart", "circle"):
            dist = 36.0 if act["motion"] == "circle" else 44.0 + random.random() * 28.0
            self.act_walk = True
            self._aim_at(self._logic_x + self.facing * dist)

    def issue(self, cmd: str, target: float | None = None) -> None:
        # play / talk are house verbs; the wood already has wander and sit.
        if cmd == "play":
            cmd = "wander"
        elif cmd == "talk":
            cmd = "sit"
        if self.act and cmd in ("wander", "idle"):
            return
        self._clear_act()
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
            self._edge = None
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
        pose = act_pose(self.act_motion, self.act_t, self.act_hold) if self.act else {"dx": 0.0, "dy": 0.0}
        self._logic_x = x
        self._display_dx = sway + shift + settle + pose["dx"]
        self.setPos(x + self._display_dx, y - perch_step - pose["dy"])
        self.update()

    def advance_pet(self, dt: float, care: CareState, width: float) -> None:
        if care.hidden and self.cmd not in ("hide", "enter"):
            if -SIZE < self._logic_x < width:
                self.cmd = "hide"
                self._edge = None
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

        if self.act:
            self.act_t += dt
            self._tongue = tongue_flick(self.act_t, self.act_hold) if self.act_motion == "tongue" else 0.0
            if self.act_motion == "stretch" and self.act_hold > 0 and self.act_t / self.act_hold > 0.55 and self.anim == "sit":
                self.anim = "idle"
            if self.act_t >= self.act_hold and not self.act_walk:
                self._clear_act()
                self.anim = "idle"
                self.frame = 0
        elif self.target is None and self.turn_hold <= 0 and self.pause <= 0 and self.settle <= 0 and self.anim in ("idle", "sit"):
            self.act_wait -= dt
            if self.act_wait <= 0:
                self._start_act(pick_act(self.species.key))
                self.act_wait = next_act_wait(self._wander_rate(), False, day_part() == "night")

        if (self.anim in ("idle", "sit")) and self.shift_age <= 0 and self.act_motion != "freeze" and random.random() < dt * 0.45:
            self.shift = (1.0 + random.random() * 2.0) * (1 if random.random() < 0.5 else -1)
            self.shift_age = 0.85
        if self.shift_age > 0:
            self.shift_age = max(0.0, self.shift_age - dt)

        if self.cmd == "hide":
            if self._edge is None:
                self._edge = leave_target(x, width, SIZE)
            self.anim = "walk"
            self.facing = -1 if self._edge < x else 1
            self.walk_age += dt
            step = self._speed("hide") * dt
            if self.facing < 0:
                x = max(self._edge, x - step)
            else:
                x = min(self._edge, x + step)
            if abs(x - self._edge) <= 1:
                x = self._edge
                self.anim = "idle"
            self._place(x, y)
            return

        if self.cmd == "enter":
            pad = 80.0
            if self._edge is None:
                if -SIZE < x < width:
                    x = enter_spawn(width, SIZE, pad)
                self._edge = enter_sit(width, SIZE, pad)
            self.anim = "walk"
            self.facing = 1 if self._edge >= x else -1
            self.walk_age += dt
            step = self._speed("hide") * dt
            if self.facing < 0:
                x = max(self._edge, x - step)
            else:
                x = min(self._edge, x + step)
            if abs(x - self._edge) <= 1:
                x = self._edge
                self.cmd = "wander"
                self.anim = "idle"
                self.walk_age = 0.0
                self._edge = None
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
            if self.act:
                self._place(max(left, min(right, x)), y)
                return
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
                    if self.act_walk:
                        self.target = None
                        self.act_walk = False
                        self.anim = "sit" if self.act_motion == "circle" else "idle"
                        self.frame = 0
                    elif self.waypoints:
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
            if self.act:
                self._place(x, y)
                return
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
