"""Species plaque card — house visual language, taught on the blotter."""

from __future__ import annotations

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont
from PyQt6.QtWidgets import QFrame, QLabel, QScrollArea, QVBoxLayout, QWidget

from .guide import Classroom, FieldGuide, classroom_for, plaque_for


class SpeciesPlaque(QFrame):
    """Paper card: tell, one mix-up, latin, house voice. Stays in the window."""

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self._guide: FieldGuide | None = None
        self._classroom: Classroom | None = None

        self.setObjectName("speciesPlaque")
        self.setStyleSheet(
            "QFrame#speciesPlaque { background: #f0e6d4; border: 1px solid #c4a574;"
            " border-radius: 10px; }"
            "QLabel { background: transparent; }"
        )

        self.kicker = QLabel("Species plaque")
        self.kicker.setStyleSheet(
            "color: #8a8074; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;"
        )
        self.name = QLabel()
        name_font = QFont("Georgia", 18)
        self.name.setFont(name_font)
        self.name.setStyleSheet("color: #2a2218;")
        self.species = QLabel()
        self.species.setStyleSheet("color: #5a4e40; font-size: 13px;")
        self.latin = QLabel()
        latin_font = QFont("Georgia", 10)
        latin_font.setItalic(True)
        self.latin.setFont(latin_font)
        self.latin.setStyleSheet("color: #8a8074;")
        self.tell = QLabel()
        self.tell.setWordWrap(True)
        self.tell.setStyleSheet("color: #2a2218; font-size: 13px;")
        self.mix_kicker = QLabel("A common mix-up")
        self.mix_kicker.setStyleSheet(
            "color: #8a8074; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;"
        )
        self.mixup = QLabel()
        self.mixup.setWordWrap(True)
        self.mixup.setStyleSheet("color: #4a4034; font-size: 13px;")
        self.lesson = QLabel()
        self.lesson.setWordWrap(True)
        lesson_font = QFont("Georgia", 11)
        lesson_font.setItalic(True)
        self.lesson.setFont(lesson_font)
        self.lesson.setStyleSheet("color: #5a4634;")
        self.place = QLabel()
        self.place.setStyleSheet("color: #8a8074; font-size: 11px;")
        self.classroom = QLabel()
        self.classroom.setStyleSheet("color: #5a4634; font-size: 12px;")

        inner = QWidget()
        col = QVBoxLayout(inner)
        col.setContentsMargins(14, 12, 14, 12)
        col.setSpacing(4)
        col.addWidget(self.kicker)
        col.addWidget(self.name)
        col.addWidget(self.species)
        col.addWidget(self.latin)
        col.addSpacing(6)
        col.addWidget(self.tell)
        col.addSpacing(8)
        col.addWidget(self.mix_kicker)
        col.addWidget(self.mixup)
        col.addSpacing(6)
        col.addWidget(self.lesson)
        col.addSpacing(4)
        col.addWidget(self.place)
        col.addWidget(self.classroom)
        col.addStretch()

        scroll = QScrollArea()
        scroll.setWidget(inner)
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        scroll.setStyleSheet("QScrollArea { background: transparent; border: none; }")

        wrap = QVBoxLayout(self)
        wrap.setContentsMargins(0, 0, 0, 0)
        wrap.addWidget(scroll)
        self.setMinimumHeight(168)
        self.setMaximumHeight(220)

    def guide(self) -> FieldGuide | None:
        return self._guide

    def set_key(self, key: str | None) -> None:
        self._guide = plaque_for(key)
        self._classroom = classroom_for(key) if key else None
        self._render()

    def _render(self) -> None:
        guide = self._guide
        room = self._classroom
        if not guide:
            self.name.setText("—")
            self.species.setText("")
            self.latin.setText("")
            self.tell.setText("No plaque for this guest.")
            self.mixup.setText("")
            self.lesson.setText("")
            self.place.setText("")
            self.classroom.setText("")
            return
        self.name.setText(guide.name)
        self.species.setText(guide.species)
        self.latin.setText(guide.latin)
        self.tell.setText(guide.tell)
        self.mixup.setText(guide.mixup)
        self.lesson.setText(guide.lesson)
        self.place.setText(f"{guide.habitat} · {guide.temperament}")
        if room:
            self.classroom.setText(f"They {room.verb}. {room.label}.")
        else:
            self.classroom.setText("")
