"""Main window: living blotter + care verbs + fail-closed unlock."""

from __future__ import annotations

import argparse
import os
import random
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

from .blotter import DayWash, DeskBackground, WeatherLayer, attach_gpu_viewport
from .guide import plaque_for
from .hive import colony_of, colony_word, is_hive_place
from .hours import (
    CHECK_HOUR,
    day_part,
    day_part_label,
    is_resting_hour,
    remember_visit,
    return_line,
)
from .life import (
    CareState,
    ambient_line,
    apply_bath,
    apply_call,
    apply_clean,
    apply_feed,
    apply_hide,
    apply_medicine,
    apply_play,
    apply_praise,
    apply_rest,
    apply_talk,
    apply_treat,
    decay,
    keep_hive,
    load_care,
    pick_mess,
    save_care,
)
from .license.session import create_license_session
from .paths import default_user_data_dir
from .pet_item import LivingPetItem, MessPileItem, ShedCoatItem, TreatItem
from .plaque import SpeciesPlaque
from .rail import SpeciesRail
from .shed import apply_shed, is_blue
from .specials import apply_special, trait_for
from .species import (
    CATALOG_KEYS,
    DEFAULT_SPECIES_KEY,
    SPECIES,
    Species,
    is_snake,
    next_species_key,
    prev_species_key,
    species_by_key,
)
from .unlock_dialog import UnlockDialog
from .visitor import (
    VISIT_GONE_MS,
    VISIT_LEAVE_MS,
    VISIT_TALK_MS,
    VISIT_WAIT_MS,
    VISIT_WANDER_MS,
    todays_visitor,
    visit_caption,
    visit_line,
)
from .weather import weather_idle, weather_label, weather_line, weather_of

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
    def __init__(self, session: dict[str, Any] | None = None, user_data_dir: Any = None):
        super().__init__()
        self._user_data_dir = user_data_dir if user_data_dir is not None else default_user_data_dir()
        self.session = session or create_license_session(user_data_dir=self._user_data_dir)
        self.species: Species = species_by_key(DEFAULT_SPECIES_KEY)
        self.care = keep_hive(
            load_care(user_data_dir=self._user_data_dir, key=DEFAULT_SPECIES_KEY),
            species_by_key(DEFAULT_SPECIES_KEY),
        )
        self.treat: TreatItem | None = None
        self.coats: list[ShedCoatItem] = []
        self.piles: list[MessPileItem] = []
        self._speech_ms = 0.0
        self._visit_ms = 0.0
        self._visit_phase = "wait"
        self._weather_acc = 0.0
        self._care_acc = 0.0
        self.sky = weather_of()
        self.part = day_part()

        self.setWindowTitle("ComputerPets — blotter")
        self.resize(1000, 860)

        self.scene = QGraphicsScene(0, 0, SCENE_W, SCENE_H, self)
        self.scene.addItem(DeskBackground(SCENE_W, SCENE_H))
        self.hours = DayWash(SCENE_W, SCENE_H, self.part)
        self.scene.addItem(self.hours)
        self.weather = WeatherLayer(SCENE_W, SCENE_H, self.sky)
        self.scene.addItem(self.weather)
        self.pet = LivingPetItem(self.species)
        self.pet.tapped.connect(self._tap_guest)
        self.scene.addItem(self.pet)
        self.guest = LivingPetItem(todays_visitor(self.species.key))
        self.guest.setScale(0.72)
        self.guest.setZValue(3)
        self.guest.tapped.connect(self._tap_visitor)
        self.guest.setVisible(False)
        self.scene.addItem(self.guest)

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
        self.play_btn = QPushButton("Play")
        self.rest_btn = QPushButton("Rest")
        self.clean_btn = QPushButton("Clean")
        self.bath_btn = QPushButton("Bath")
        self.medicine_btn = QPushButton("Medicine")
        self.medicine_btn.setVisible(False)
        self.praise_btn = QPushButton("Praise")
        self.talk_btn = QPushButton("Talk")
        self.special_btn = QPushButton(trait_for(self.species.key).verb)
        self.shed_btn = QPushButton("Shed")
        self.unlock_btn = QPushButton("Unlock…")
        self.prev_btn = QPushButton("◀")
        self.next_btn = QPushButton("▶")
        self.prev_btn.setFixedWidth(36)
        self.next_btn.setFixedWidth(36)
        self.prev_btn.setToolTip("Previous companion")
        self.next_btn.setToolTip("Next companion")
        self.kind_box = QComboBox()
        for key in CATALOG_KEYS:
            spec = SPECIES[key]
            gait = "crawl" if spec.gait == "crawl" else "walk"
            self.kind_box.addItem(f"{spec.name} · {spec.label} ({gait})", key)
        self.kind_box.setCurrentIndex(0)
        self.rail = SpeciesRail()
        self.rail.set_active(self.species.key)
        self.plaque = SpeciesPlaque()
        self.plaque.set_key(self.species.key)

        self.feed_btn.clicked.connect(self._feed)
        self.treat_btn.clicked.connect(self._treat)
        self.hide_btn.clicked.connect(self._hide_or_call)
        self.play_btn.clicked.connect(self._play)
        self.rest_btn.clicked.connect(self._rest)
        self.clean_btn.clicked.connect(self._clean)
        self.bath_btn.clicked.connect(self._bath)
        self.medicine_btn.clicked.connect(self._medicine)
        self.praise_btn.clicked.connect(self._praise)
        self.talk_btn.clicked.connect(self._talk)
        self.special_btn.clicked.connect(self._special)
        self.shed_btn.clicked.connect(self._shed)
        self.unlock_btn.clicked.connect(self._unlock)
        self.kind_box.currentIndexChanged.connect(self._change_kind)
        self.rail.picked.connect(self._pick_key)
        self.prev_btn.clicked.connect(self._cycle_prev)
        self.next_btn.clicked.connect(self._cycle_next)

        self.license_label = QLabel()
        self.license_label.setStyleSheet("color: #9a9288;")
        self.vital_label = QLabel()
        self.vital_label.setStyleSheet("color: #c4a574;")

        bar = QHBoxLayout()
        bar.addWidget(self.feed_btn)
        bar.addWidget(self.treat_btn)
        bar.addWidget(self.hide_btn)
        bar.addWidget(self.play_btn)
        bar.addWidget(self.rest_btn)
        bar.addWidget(self.clean_btn)
        bar.addWidget(self.bath_btn)
        bar.addWidget(self.medicine_btn)
        bar.addWidget(self.praise_btn)
        bar.addWidget(self.talk_btn)
        bar.addWidget(self.special_btn)
        bar.addWidget(self.shed_btn)
        bar.addWidget(self.prev_btn)
        bar.addWidget(self.kind_box, 1)
        bar.addWidget(self.next_btn)
        bar.addStretch()
        bar.addWidget(self.unlock_btn)

        root = QWidget()
        layout = QVBoxLayout(root)
        layout.setContentsMargins(10, 10, 10, 8)
        layout.addLayout(bar)
        layout.addWidget(self.rail)
        layout.addWidget(self.license_label)
        layout.addWidget(self.view, 1)
        layout.addWidget(self.plaque)
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

        self._greet()
        self._refresh_license()
        self._refresh_vitals()
        self._reset_visit()

    def closeEvent(self, event) -> None:
        remember_visit(self.species.key, user_data_dir=self._user_data_dir)
        self._keep_care()
        super().closeEvent(event)

    def _keep_care(self) -> None:
        save_care(self.care, user_data_dir=self._user_data_dir, key=self.species.key)

    def _say(self, text: str, hold_ms: float = 4200) -> None:
        if not text:
            return
        self.bubble.setPlainText(text)
        self.bubble.setVisible(True)
        self._speech_ms = hold_ms
        self.care.last_line = text

    def _greet(self) -> None:
        away = remember_visit(self.species.key, user_data_dir=self._user_data_dir)
        line = return_line(away)
        if not line:
            line = weather_line(self.species.key, self.sky)
        if not line:
            line = self.species.greet[0] if self.species.greet else "Hello."
        self._say(line, 5200)
        if is_resting_hour(self.species.key) and self.care.energy < 88:
            self.pet.issue("sleep")

    def _reset_visit(self) -> None:
        self._visit_ms = 0.0
        self._visit_phase = "wait"
        guest = todays_visitor(self.species.key)
        self.guest.set_species(guest)
        self.guest.setVisible(False)
        self.guest.setPos(SCENE_W + 8, self.guest._floor_y())
        self.guest.issue("idle")

    def _sync_coats(self) -> None:
        for item in self.coats:
            self.scene.removeItem(item)
        self.coats = []
        for gift in self.care.gifts:
            if gift.kind != "shed":
                continue
            item = ShedCoatItem(gift, SCENE_W)
            self.scene.addItem(item)
            self.coats.append(item)

    def _sync_mess(self) -> None:
        for item in self.piles:
            self.scene.removeItem(item)
        self.piles = []
        for pile in self.care.mess:
            if pile.kind != "mess":
                continue
            item = MessPileItem(pile, SCENE_W)
            item.tapped.connect(self._pick_mess)
            self.scene.addItem(item)
            self.piles.append(item)

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
        blue = is_blue(s, self.species.key)
        hive = colony_of(s, s.hidden) if is_hive_place(self.species.key) else None
        self.pet.set_dull(blue or bool(hive and hive.quiet))
        self.pet.set_unwell(s.sick)
        self.part = day_part()
        self.hours.set_part(self.part)
        vital = (
            f"{colony_word(hive)} · Brood · {hive.brood} · Stores · {hive.stores}"
            if hive
            else s.vitals(blue=blue)
        )
        self.vital_label.setText(
            f"{self.species.name} · {vital} · {day_part_label(self.part)} · "
            f"{weather_label(self.sky)} · "
            f"{visit_caption(self.species.key)}   "
            f"hunger {s.hunger}   mood {s.mood}   energy {s.energy}"
        )
        self.hide_btn.setText("Call back" if s.hidden else "Hide")
        self.treat_btn.setText(self.species.treat)
        self.special_btn.setText(trait_for(self.species.key).verb)
        self.shed_btn.setVisible(is_snake(self.species.key))
        self.medicine_btn.setVisible(s.sick)
        self.guest.setVisible(self._visit_phase not in ("wait", "gone") and not s.hidden)

    def _pick_key(self, key: str) -> None:
        idx = self.kind_box.findData(key)
        if idx >= 0 and idx != self.kind_box.currentIndex():
            self.kind_box.setCurrentIndex(idx)
            return
        self._apply_kind(key)

    def _cycle_prev(self) -> None:
        self._pick_key(prev_species_key(self.species.key))

    def _cycle_next(self) -> None:
        self._pick_key(next_species_key(self.species.key))

    def _change_kind(self) -> None:
        self._apply_kind(self.kind_box.currentData())

    def _apply_kind(self, key: str | None) -> None:
        next_kind = species_by_key(key)
        if next_kind.key != self.species.key:
            self._keep_care()
        self.species = next_kind
        self.pet.set_species(self.species)
        self.rail.set_active(self.species.key)
        self.plaque.set_key(self.species.key)
        idx = self.kind_box.findData(self.species.key)
        if idx >= 0 and idx != self.kind_box.currentIndex():
            blocked = self.kind_box.blockSignals(True)
            self.kind_box.setCurrentIndex(idx)
            self.kind_box.blockSignals(blocked)
        self.care = keep_hive(
            load_care(user_data_dir=self._user_data_dir, key=self.species.key),
            self.species,
        )
        self._sync_coats()
        self._sync_mess()
        self._reset_visit()
        self._greet()
        self._refresh_vitals()

    def _feed(self) -> None:
        result = apply_feed(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
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
        self._keep_care()
        self._refresh_vitals()

    def _play(self) -> None:
        result = apply_play(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
        self._refresh_vitals()

    def _apply_care(self, result) -> None:
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
        self._refresh_vitals()

    def _rest(self) -> None:
        self._apply_care(apply_rest(self.care, self.species))

    def _bath(self) -> None:
        self._apply_care(apply_bath(self.care, self.species))

    def _praise(self) -> None:
        self._apply_care(apply_praise(self.care, self.species))

    def _talk(self) -> None:
        self._apply_care(apply_talk(self.care, self.species))

    def _clean(self) -> None:
        result = apply_clean(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._sync_mess()
        self._keep_care()
        self._refresh_vitals()

    def _medicine(self) -> None:
        result = apply_medicine(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
        self._refresh_vitals()

    def _pick_mess(self, pile_id: int) -> None:
        result = pick_mess(self.care, pile_id)
        self.care = result.state
        self._say(result.line)
        self._sync_mess()
        self._keep_care()
        self._refresh_vitals()

    def _special(self) -> None:
        result = apply_special(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
        self._refresh_vitals()

    def _hide_or_call(self) -> None:
        if self.care.hidden:
            result = apply_call(self.care, self.species)
        else:
            result = apply_hide(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._keep_care()
        self._refresh_vitals()

    def _tap_guest(self) -> None:
        """Same as the web blotter: tap the guest, the plaque teaches, they say the lesson."""
        guide = plaque_for(self.species.key)
        if guide:
            self.plaque.set_key(self.species.key)
            self._say(guide.lesson, 5200)

    def _tap_visitor(self) -> None:
        guest = todays_visitor(self.species.key)
        self._say(visit_line(guest.key), 4200)
        self.guest.issue("sit")

    def _shed(self) -> None:
        result = apply_shed(self.care, self.species)
        self.care = result.state
        self.pet.issue(result.cmd)
        self._say(result.line)
        self._sync_coats()
        self._keep_care()
        self._refresh_vitals()

    def _advance_visit(self, dt_ms: float) -> None:
        if self.care.hidden:
            self.guest.setVisible(False)
            return
        if self._visit_phase == "gone":
            return
        self._visit_ms += dt_ms
        elapsed = self._visit_ms
        if self._visit_phase == "wait" and elapsed >= VISIT_WAIT_MS:
            self._visit_phase = "in"
            self.guest.setVisible(True)
            self.guest.setPos(SCENE_W + 8, self.guest._floor_y())
            self.guest.issue("seek", SCENE_W * 0.52)
        elif self._visit_phase == "in" and elapsed >= VISIT_WAIT_MS + VISIT_TALK_MS:
            self._visit_phase = "talk"
            self.guest.issue("sit")
            self._say(visit_line(self.guest.species.key), 4200)
        elif self._visit_phase == "talk" and elapsed >= VISIT_WAIT_MS + VISIT_WANDER_MS:
            self._visit_phase = "wander"
            self.guest.issue("wander")
        elif self._visit_phase == "wander" and elapsed >= VISIT_WAIT_MS + VISIT_LEAVE_MS:
            self._visit_phase = "leave"
            self.guest.issue("hide")
        elif elapsed >= VISIT_WAIT_MS + VISIT_GONE_MS:
            self._visit_phase = "gone"
            self.guest.setVisible(False)
        if self.guest.isVisible():
            self.guest.advance_pet(dt_ms / 1000.0, CareState(), SCENE_W)

    def _maybe_weather_idle(self) -> None:
        if self.care.hidden or self.bubble.isVisible():
            return
        mood = weather_idle(self.species.key, self.sky)
        if mood and random.random() < 0.45:
            if random.random() < 0.4:
                line = weather_line(self.species.key, self.sky)
                if line:
                    self._say(line, 3600)
            self.pet.issue(mood)
            return
        if is_resting_hour(self.species.key) and self.care.energy < 88:
            self.pet.issue("sleep")

    def _unlock(self) -> None:
        dialog = UnlockDialog(self.session, self)
        dialog.exec()
        self._refresh_license()

    def _tick(self) -> None:
        dt = self.timer.interval() / 1000.0
        before_mess = len(self.care.mess)
        self.care = keep_hive(decay(self.care, self.timer.interval(), key=self.species.key), self.species)
        if len(self.care.mess) != before_mess:
            self._sync_mess()
        self.pet.advance_pet(dt, self.care, SCENE_W)
        self.weather.advance_weather(dt)
        self._advance_visit(self.timer.interval())
        if self.treat is not None and self.pet.cmd == "eat":
            self.scene.removeItem(self.treat)
            self.treat = None
        if self._speech_ms > 0:
            self._speech_ms -= self.timer.interval()
            if self._speech_ms <= 0:
                self.bubble.setVisible(False)
        self._ambient_acc += self.timer.interval()
        self._care_acc += self.timer.interval()
        if self._care_acc > 5000:
            self._care_acc = 0
            self._keep_care()
        if self._ambient_acc > 18000 and not self.bubble.isVisible() and not self.care.hidden:
            self._ambient_acc = 0
            self._say(ambient_line(self.care, self.species), 3600)
        self._weather_acc += self.timer.interval()
        if self._weather_acc > 5600:
            self._weather_acc = 0
            self._maybe_weather_idle()
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
        print(f"ok: {window.species.name} on the blotter ({len(CATALOG_KEYS)} living kinds)")
        guide = plaque_for(window.species.key)
        if window.plaque.guide() is None or guide is None:
            print("check failed: no species plaque on the blotter", file=sys.stderr)
            return 1
        print(f"ok: species plaque for {guide.name} ({guide.latin})")
        print(f"ok: {weather_label(window.sky)} on the blotter")
        print(f"ok: {visit_caption(window.species.key)}")
        print(f"ok: {day_part_label(day_part())} on the blotter")
        fixture_part = day_part_label(day_part(CHECK_HOUR))
        resting = is_resting_hour(window.species.key, CHECK_HOUR)
        rest_word = "resting" if resting else "awake"
        print(f"ok: fixture {CHECK_HOUR}:00 is {fixture_part}; {window.species.name} {rest_word}")
        print(f"ok: {trait_for(window.species.key).verb}")
        well = "unwell" if window.care.sick else "well"
        print(f"ok: {window.species.name} is {well}")
        print(window.renderer_label)
        QTimer.singleShot(250, app.quit)
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
