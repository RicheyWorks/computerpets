"""Steam unlock against the published client contract. Fail closed."""

from __future__ import annotations

from typing import Any, Callable

from PyQt6.QtCore import QObject, QThread, pyqtSignal
from PyQt6.QtWidgets import (
    QComboBox,
    QDialog,
    QDialogButtonBox,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
)

from .license.errors import LicenseError
from .species import CATALOG_KEYS, SPECIES


class UnlockWorker(QObject):
    finished = pyqtSignal(object)
    failed = pyqtSignal(object)

    def __init__(self, session: dict[str, Callable[..., Any]], fields: dict[str, Any]):
        super().__init__()
        self._session = session
        self._fields = fields

    def run(self) -> None:
        try:
            self.finished.emit(self._session["unlock"](self._fields))
        except LicenseError as err:
            self.failed.emit(err)
        except Exception as err:
            self.failed.emit(LicenseError("unreachable", str(err)))


class UnlockDialog(QDialog):
    def __init__(self, session: dict[str, Callable[..., Any]], parent=None):
        super().__init__(parent)
        self.session = session
        self.setWindowTitle("Unlock — ComputerPets")
        self.setMinimumWidth(420)
        self._thread: QThread | None = None
        self._worker: UnlockWorker | None = None

        status = session["status"]()
        lead = QLabel(
            "Prove Steam ownership against the house backend. "
            "The blotter pet still lives here either way — this is the published "
            "license contract, not a second overlay."
        )
        lead.setWordWrap(True)

        self.backend = QLineEdit(status.get("backendUrl") or "http://127.0.0.1:8080")
        self.steam_id = QLineEdit((status.get("fields") or {}).get("steamId") or "")
        self.steam_id.setPlaceholderText("76561198000000000")
        self.app_id = QLineEdit((status.get("fields") or {}).get("appId") or "")
        self.app_id.setPlaceholderText("123456")
        self.pet_type = QComboBox()
        self.pet_type.setEditable(True)
        for key in CATALOG_KEYS:
            spec = SPECIES[key]
            self.pet_type.addItem(f"{key} — {spec.name} · {spec.label}", key)
        current = (status.get("fields") or {}).get("petType") or "red_panda"
        idx = self.pet_type.findData(current)
        if idx >= 0:
            self.pet_type.setCurrentIndex(idx)
        else:
            self.pet_type.setEditText(str(current))

        form = QFormLayout()
        form.addRow("Backend URL", self.backend)
        form.addRow("Provider", QLabel("steam"))
        form.addRow("Steam ID", self.steam_id)
        form.addRow("App ID", self.app_id)
        form.addRow("Pet", self.pet_type)

        self.ok = QLabel()
        self.ok.setWordWrap(True)
        self.err = QLabel()
        self.err.setWordWrap(True)
        self.err.setStyleSheet("color: #d9a08a;")
        self._paint_status(status)

        unlock_btn = QPushButton("Unlock")
        unlock_btn.clicked.connect(self._unlock)
        download_btn = QPushButton("Signed download")
        download_btn.clicked.connect(self._download)
        clear_btn = QPushButton("Clear")
        clear_btn.clicked.connect(self._clear)

        row = QHBoxLayout()
        row.addWidget(unlock_btn)
        row.addWidget(download_btn)
        row.addWidget(clear_btn)
        row.addStretch()

        buttons = QDialogButtonBox(QDialogButtonBox.StandardButton.Close)
        buttons.rejected.connect(self.reject)

        layout = QVBoxLayout(self)
        layout.addWidget(lead)
        layout.addLayout(form)
        layout.addLayout(row)
        layout.addWidget(self.ok)
        layout.addWidget(self.err)
        layout.addWidget(buttons)

    def _paint_status(self, status: dict[str, Any]) -> None:
        if status.get("unlocked") and status.get("license"):
            lic = status["license"]
            text = f"Unlocked — {lic['pet']} · {lic['jti']} · until {lic['validUntil']}"
            last = status.get("lastDownload") or {}
            if last.get("downloadUrl"):
                text += ". Bundle fetched." if (last.get("bundle") or {}).get("ok") else ". Signed URL issued."
            self.ok.setText(text)
            self.err.setText("")
        else:
            self.ok.setText("Locked. The pet on the blotter still works.")
            err = status.get("error")
            self.err.setText(err["message"] if err else "")

    def _pet_key(self) -> str:
        data = self.pet_type.currentData()
        if isinstance(data, str) and data.strip():
            return data.strip()
        text = self.pet_type.currentText().strip()
        if " — " in text:
            text = text.split(" — ", 1)[0].strip()
        return text or "red_panda"

    def _unlock(self) -> None:
        self.err.setText("")
        self.ok.setText("Talking to the backend…")
        fields = {
            "backendUrl": self.backend.text().strip(),
            "provider": "steam",
            "steamId": self.steam_id.text().strip(),
            "appId": self.app_id.text().strip(),
            "petType": self._pet_key(),
        }
        self._thread = QThread(self)
        self._worker = UnlockWorker(self.session, fields)
        self._worker.moveToThread(self._thread)
        self._thread.started.connect(self._worker.run)
        self._worker.finished.connect(self._on_ok)
        self._worker.failed.connect(self._on_fail)
        self._worker.finished.connect(self._thread.quit)
        self._worker.failed.connect(self._thread.quit)
        self._thread.start()

    def _on_ok(self, status: object) -> None:
        if isinstance(status, dict):
            self._paint_status(status)
            self.accept()

    def _on_fail(self, err: object) -> None:
        message = str(err)
        code = getattr(err, "code", "denied")
        self.ok.setText("Locked. The pet on the blotter still works.")
        self.err.setText(f"{code}: {message}")
        QMessageBox.warning(self, "Unlock failed", f"{code}: {message}")

    def _download(self) -> None:
        try:
            self.session["download"]()
            self._paint_status(self.session["status"]())
        except LicenseError as err:
            self.err.setText(f"{err.code}: {err}")
            QMessageBox.warning(self, "Download failed", f"{err.code}: {err}")

    def _clear(self) -> None:
        self._paint_status(self.session["clear"]())
