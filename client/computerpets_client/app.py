"""Main window: living blotter + care verbs + fail-closed unlock."""

from __future__ import annotations

import argparse
import os
import sys
from typing import Any

from PyQt6.QtCore import QRectF, Qt, QTimer
from PyQt6.QtGui import QColor, QFont, QPainter
from PyQt6.QtWidgets import (
    QApplication,
    QComboBox,
    QGraphicsScene,
    QGraphicsTextItem,
    QGraphicsView,
    QHBoxLayout,
    QLabel,
    QMainWindow,
    QPushButton,
    QStatusBar,
    QVBoxLayout,
    QWidget,
)

from .blotter import DeskBackground, attach_gpu_viewport
from .life import CareState, ambient_line, apply_call, apply_feed, apply_hide, apply_treat, decay
from .license.session import create_license_session
from .paths import default_user_data_dir
from .pet_item import LivingPetItem, TreatItem
from .species import DEFAULT_SPECIES_KEY, SPECIES, Species, species_by_key
from .unlock_dialog import UnlockDialog

SCENE_W = 960
SCENE_H = 540


class BlotterView(QGraphicsView):
    def __init__(self, scene: QGraphicsScene):
        super().__init__(scene)
        self.setRenderHints(
            QPainter.RenderHint.Antialiasing | QPainter.RenderHint.SmoothPixmapTransform
        )
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.setFrameShape(QGraphicsView.Shape.NoFrame)
        self.setBackgroundBrush(QColor(42, 34, 24))

    def resizeEvent(self, event) -> None:
        super().resizeEvent(event)
        self.fitInView(QRectF(0, 0, SCENE_W, SCENE_H), Qt.AspectRatioMode.KeepAspectRatio)


class DeskWindow(QMainWindow):
    def __init__(self, session: dict[str, Any] | None = None):
        super().__init__()
        self.session = session or create_license_session(user_data_dir=default_user_data_dir())
        self.species: Species = species_by_key(DEFAULT_SPECIES_KEY)
        self.care = CareState()
        self.treat: TreatItem | None = None
        self._speech_ms = 0.0

        self.setWindowTitle("ComputerPets — blotter")
        self.resize(1000, 720)

        self.scene = QGraphicsScene(0, 0, SCENE_W, SCENE_H, self)
        self.scene.addItem(DeskBackground(SCENE_W, SCENE_H))
        self.pet = LivingPetItem(self.species)
        self.scene.addItem(self.pet)

        self.bubble = QGraphicsTextItem()
        self.bubble.setDefaultTextColor(QColor(242, 236, 227))
        font = QFont("Georgia", 12)
        font.setItalic(True)
        self.bubble.setFont(font)
        self.bubble.setTextWidth(360)
        self.bubble.setPos(300, 150)
        self.bubble.setZValue(6)
        self.bubble.setVisible(False)
        self.scene.addItem(self.bubble)

        self.view = BlotterView(self.scene)
        self.renderer_label = attach_gpu_viewport(self.view)

        self.feed_btn = QPushButton("Feed")
        self.treat_btn = QPushButton(self.species.treat)
        self.hide_btn = QPushButton("Hide")
        self.unlock_btn = QPushButton("Unlock…")
        self.kind_box = QComboBox()
        for key, spec in SPECIES.items():
            self.kind_box.addItem(f"{spec.name} · {spec.label}", key)
        self.kind_box.setCurrentIndex(0)

        self.feed_btn.clicked.connect(self._feed)
        self.treat_btn.clicked.connect(self._treat)
        self.hide_btn.clicked.connect(self._hide_or_call)
        self.unlock_btn.clicked.connect(self._unlock)
        self.kind_box.currentIndexChanged.connect(self._change_kind)

        self.license_label = QLabel()
        self.license_label.setStyleSheet("color: #9a9288;")
        self.vital_label = QLabel()
        self.vital_label.setStyleSheet("color: #c4a574;")

        bar = QHBoxLayout()
        bar.addWidget(self.feed_btn)
        bar.addWidget(self.treat_btn)
        bar.addWidget(self.hide_btn)
        bar.addWidget(self.kind_box)
        bar.addStretch()
        bar.addWidget(self.unlock_btn)

        root = QWidget()
        layout = QVBoxLayout(root)
        layout.setContentsMargins(10, 10, 10, 8)
        layout.addLayout(bar)
        layout.addWidget(self.license_label)
        layout.addWidget(self.view, 1)
        layout.addWidget(self.vital_label)
        self.setCentralWidget(root)

        status = QStatusBar()
        status.showMessage(self.renderer_label)
        self.setStatusBar(status)

        self.timer = QTimer(self)
        self.timer.setInterval(33)
        self.timer.timeout.connect(self._tick)
        self.timer.start()
        self._last_ms = 0.0
        self._ambient_acc = 0.0

        self._say(self.species.greet[0] if self.species.greet else "Hello.")
        self._refresh_license()
        self._refresh_vitals()

    def _say(self, text: str, hold_ms: float = 4200) -> None:
        if not text:
            return
        self.bubble.setPlainText(text)
        self.bubble.setVisible(True)
        self._speech_ms = hold_ms
        self.care.last_line = text

    def _refresh_license(self) -> None:
        status = self.session["status"]()
        if status.get("unlocked") and status.get("license"):
            lic = status["license"]
            self.license_label.setText(
                f"Unlocked · {lic['pet']} · jti {lic['jti']} · until {lic['validUntil']}"
            )
            pet_key = lic.get("pet")
            if pet_key in SPECIES and pet_key != self.species.key:
                idx = self.kind_box.findData(pet_key)
                if idx >= 0:
                    self.kind_box.setCurrentIndex(idx)
        else:
            err = status.get("error")
            extra = f" ({err['message']})" if err else ""
            self.license_label.setText(f"Locked. Pet still lives on the blotter.{extra}")

    def _refresh_vitals(self) -> None:
        s = self.care
        self.vital_label.setText(
            f"{self.species.name} · {s.vitals()}   "
            f"hunger {s.hunger}   mood {s.mood}   energy {s.energy}"
        )
        self.hide_btn.setText("Call back" if s.hidden else "Hide")
        self.treat_btn.setText(self.species.treat)

    def _change_kind(self) -> None:
        key = self.kind_box.currentData()
        self.species = species_by_key(key)
        self.pet.set_species(self.species)
        self._refresh_vitals()

    def _feed(self) -> None:
        result = apply_feed(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._refresh_vitals()

    def _treat(self) -> None:
        result = apply_treat(self.care, self.species)
        self.care = result.state
        if result.cmd == "seek":
            if self.treat is not None:
                self.scene.removeItem(self.treat)
            tx = 420 + (hash(self.species.key) % 180)
            self.treat = TreatItem(self.species.treat_shape, tx, 400)
            self.scene.addItem(self.treat)
            self.pet.issue("seek", tx - 40)
        self._say(result.line)
        self._refresh_vitals()

    def _hide_or_call(self) -> None:
        if self.care.hidden:
            result = apply_call(self.care, self.species)
        else:
            result = apply_hide(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._refresh_vitals()

    def _unlock(self) -> None:
        dialog = UnlockDialog(self.session, self)
        dialog.exec()
        self._refresh_license()

    def _tick(self) -> None:
        dt = self.timer.interval() / 1000.0
        self.care = decay(self.care, self.timer.interval())
        self.pet.advance_pet(dt, self.care, SCENE_W)
        if self.treat is not None and self.pet.cmd == "eat":
            self.scene.removeItem(self.treat)
            self.treat = None
        if self._speech_ms > 0:
            self._speech_ms -= self.timer.interval()
            if self._speech_ms <= 0:
                self.bubble.setVisible(False)
        self._ambient_acc += self.timer.interval()
        if self._ambient_acc > 18000 and not self.bubble.isVisible() and not self.care.hidden:
            self._ambient_acc = 0
            self._say(ambient_line(self.care, self.species), 3600)
        self._refresh_vitals()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="ComputerPets PyQt blotter client")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Construct the window (offscreen-friendly) and exit after a few ticks.",
    )
    parser.add_argument(
        "--offscreen",
        action="store_true",
        help="Force QT_QPA_PLATFORM=offscreen before creating the QApplication.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.offscreen or args.check:
        os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

    app = QApplication.instance() or QApplication(sys.argv)
    app.setApplicationName("ComputerPets")
    app.setOrganizationName("RicheyWorks")

    window = DeskWindow()
    window.show()

    if args.check:
        if window.pet is None or window.scene.items() == []:
            print("check failed: no living pet on the blotter", file=sys.stderr)
            return 1
        print(f"ok: {window.species.name} on the blotter")
        print(window.renderer_label)
        QTimer.singleShot(250, app.quit)
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
