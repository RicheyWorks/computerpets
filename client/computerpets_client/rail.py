"""Study-style species rail: all fifty living keys, house then snakes then tide then garden."""

from __future__ import annotations

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QScrollArea, QWidget

from .species import CATALOG_KEYS, GARDEN_KEYS, HOUSE_KEYS, SEA_KEYS, SNAKE_KEYS, SPECIES, Species


class SpeciesRail(QWidget):
    """Horizontal chip rail. Click a name to meet them; house voice stays theirs."""

    picked = pyqtSignal(str)

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self._buttons: dict[str, QPushButton] = {}
        self._active = ""

        row = QHBoxLayout()
        row.setContentsMargins(0, 0, 0, 0)
        row.setSpacing(6)
        row.addWidget(self._label("House"))
        for key in HOUSE_KEYS:
            row.addWidget(self._chip(SPECIES[key]))
        row.addWidget(self._label("Den"))
        for key in SNAKE_KEYS:
            row.addWidget(self._chip(SPECIES[key]))
        row.addWidget(self._label("Tide"))
        for key in SEA_KEYS:
            row.addWidget(self._chip(SPECIES[key]))
        row.addWidget(self._label("Garden"))
        for key in GARDEN_KEYS:
            row.addWidget(self._chip(SPECIES[key]))
        row.addStretch()

        inner = QWidget()
        inner.setLayout(row)

        scroll = QScrollArea()
        scroll.setWidget(inner)
        scroll.setWidgetResizable(False)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        scroll.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll.setFixedHeight(46)
        scroll.setStyleSheet("QScrollArea { background: transparent; }")

        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 2, 0, 0)
        layout.addWidget(scroll)

    def _label(self, text: str) -> QLabel:
        lab = QLabel(text)
        lab.setStyleSheet("color: #8a8074; font-size: 11px; letter-spacing: 0.12em;")
        return lab

    def _chip(self, spec: Species) -> QPushButton:
        btn = QPushButton(f"{spec.name} · {spec.label}")
        btn.setCursor(Qt.CursorShape.PointingHandCursor)
        btn.setCheckable(True)
        btn.setStyleSheet(
            "QPushButton { background: #3a3228; color: #d8d0c4; border: 1px solid #5a4e40;"
            " border-radius: 6px; padding: 4px 10px; }"
            "QPushButton:checked { background: #5a4634; border-color: #c4a574; color: #f4ead8; }"
            "QPushButton:hover { color: #f4ead8; }"
        )
        btn.clicked.connect(lambda _=False, key=spec.key: self.picked.emit(key))
        self._buttons[spec.key] = btn
        return btn

    def set_active(self, key: str) -> None:
        self._active = key
        for item, btn in self._buttons.items():
            btn.setChecked(item == key)

    def keys(self) -> tuple[str, ...]:
        return CATALOG_KEYS
