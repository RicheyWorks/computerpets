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
from .license.hwid import WEAK_FALLBACK_MESSAGE
from .license.license_net import (
    BUNDLE_IDLE,
    BUNDLE_LOCAL,
    DOWNLOAD_LOCAL,
    bundle_honesty,
    bundle_may_fetch,
    download_may_post,
    download_talk_honesty,
    LOCAL_STAYS,
    license_honesty,
    license_host_name,
    license_may_send,
)
from .species import CATALOG_KEYS, SPECIES

WEAK_FALLBACK_YES = "Use the computer name, or a random id if there is no name"


def _license_is_unbound(status: dict[str, Any]) -> bool:
    lic = status.get("license") if isinstance(status, dict) else None
    return isinstance(lic, dict) and not lic.get("hwid")


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
        self._unlock_allowed_weak = False

        status = session["status"]()
        lead = QLabel(
            "Prove Steam ownership against the house backend. "
            "The blotter pet still lives here either way — this is the published "
            "license contract, not a second overlay."
        )
        lead.setWordWrap(True)
        self.mark = QLabel(self._mark_text(status))
        self.mark.setWordWrap(True)

        self._license_backend = str(status.get("backendUrl") or "")
        self._license_unbound = _license_is_unbound(status)
        self.backend = QLineEdit(self._license_backend or "http://127.0.0.1:8081")
        self.net = QLabel(LOCAL_STAYS)
        self.net.setObjectName("licenseNet")
        self.net.setWordWrap(True)
        self.bundle = QLabel(BUNDLE_IDLE)
        self.bundle.setObjectName("bundleNet")
        self.bundle.setWordWrap(True)
        self.backend.textChanged.connect(self._paint_net)
        self._paint_net()
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
        form.addRow("", self.net)
        form.addRow("", self.bundle)
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
        layout.addWidget(self.mark)
        layout.addLayout(form)
        layout.addLayout(row)
        layout.addWidget(self.ok)
        layout.addWidget(self.err)
        layout.addWidget(buttons)

    def _mark_text(self, status: dict[str, Any]) -> str:
        mark = status.get("hwidMark") if isinstance(status, dict) else None
        if isinstance(mark, dict) and mark.get("read") == "stored":
            return (
                "A license hash is already stored in hwid.txt. Unlock reuses it and does not "
                "read the operating-system id again. The raw id is not sent. That hash is still "
                "a device fingerprint. The line under Backend URL names the host before that hash leaves. "
                "A backend on this computer does not send it."
            )
        return (
            "Opening this window did not read the operating-system machine id. "
            "The first Unlock reads Linux machine-id, Windows MachineGuid, or the Mac platform UUID, "
            "hashes it, and stores that hash in hwid.txt. A hash already stored is reused, so an "
            "existing license stays bound. The raw id is not sent. The house receives only the hash, "
            "and only for unlock or a bound download. That hash is a device fingerprint. "
            "The line under Backend URL names the host before that hash leaves. "
            "A backend on this computer does not send it. "
            "If that named read fails. " + WEAK_FALLBACK_MESSAGE
        )

    def _unlock_target(self) -> str:
        typed = self.backend.text().strip()
        return typed or self._license_backend

    def _download_target(self) -> str:
        stored = self._license_backend.strip()
        return stored or self.backend.text().strip()

    def _paint_net(self, *_args: object) -> None:
        unlock_url = self._unlock_target()
        parts = [license_honesty(unlock_url) or LOCAL_STAYS]
        stored = self._license_backend.strip()
        if stored and license_host_name(stored) and license_host_name(stored) != license_host_name(unlock_url):
            extra = license_honesty(stored) or LOCAL_STAYS
            if extra not in parts:
                parts.append(extra)
        if self._license_unbound:
            talk = download_talk_honesty(self._download_target()) or DOWNLOAD_LOCAL
            if talk not in parts:
                parts.append(talk)
        self.net.setText(" ".join(parts))

    def _shown_line(self) -> str:
        return self.net.text()

    def _shown_bundle_line(self) -> str:
        return self.bundle.text()

    def _bundle_url(self, status: dict[str, Any]) -> str:
        download = status.get("download") if isinstance(status.get("download"), dict) else {}
        last = status.get("lastDownload") if isinstance(status.get("lastDownload"), dict) else {}
        if isinstance(download.get("downloadUrl"), str):
            return download["downloadUrl"]
        if isinstance(last.get("downloadUrl"), str):
            return last["downloadUrl"]
        if isinstance(status.get("downloadUrl"), str):
            return status["downloadUrl"]
        return ""

    def _bundle_body(self, status: dict[str, Any]) -> dict[str, Any]:
        download = status.get("download") if isinstance(status.get("download"), dict) else {}
        last = status.get("lastDownload") if isinstance(status.get("lastDownload"), dict) else {}
        if isinstance(download.get("bundle"), dict):
            return download["bundle"]
        if isinstance(last.get("bundle"), dict):
            return last["bundle"]
        body = status.get("bundle")
        return body if isinstance(body, dict) else {}

    def _paint_bundle(self, download_url: str) -> None:
        if not download_url:
            self.bundle.setText(BUNDLE_IDLE)
            return
        self.bundle.setText(bundle_honesty(download_url) or BUNDLE_LOCAL)

    def _fetch_if_held(self, status: dict[str, Any]) -> None:
        url = self._bundle_url(status)
        self._paint_bundle(url)
        bundle = self._bundle_body(status)
        if not url or bundle.get("held") is not True:
            return
        if not bundle_may_fetch(url, self._shown_bundle_line()):
            self.err.setText("the signed bundle was not fetched. name the host before it leaves.")
            return
        try:
            self.session["fetch_signed"]({"cdnLine": self._shown_bundle_line()})
        except LicenseError as err:
            self.err.setText(f"{err.code}: {err}")

    def _hash_may_leave(self, url: str) -> bool:
        self._paint_net()
        if license_may_send(url, self._shown_line()):
            return True
        self.ok.setText("Locked. The pet on the blotter still works.")
        self.err.setText("the license hash was not sent. name the host before it leaves.")
        return False

    def _download_may_leave(self, url: str) -> bool:
        self._paint_net()
        if download_may_post(url, self._shown_line()):
            return True
        self.ok.setText("Locked. The pet on the blotter still works.")
        self.err.setText("this download was not sent. name the host before it leaves.")
        return False

    def _paint_status(self, status: dict[str, Any]) -> None:
        self._license_unbound = _license_is_unbound(status)
        if isinstance(status.get("backendUrl"), str):
            self._license_backend = status["backendUrl"]
        if hasattr(self, "mark"):
            self.mark.setText(self._mark_text(status))
        if hasattr(self, "net"):
            self._paint_net()
        if hasattr(self, "bundle"):
            self._paint_bundle(self._bundle_url(status))
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

    def _ask_weak(self, message: str) -> bool:
        answer = QMessageBox.question(
            self,
            "No stable operating-system id",
            message + "\n\n" + WEAK_FALLBACK_YES + "?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No,
        )
        return answer == QMessageBox.StandardButton.Yes

    def _unlock(self, allow_weak: bool = False) -> None:
        if not self._hash_may_leave(self._unlock_target()):
            return
        self._unlock_allowed_weak = allow_weak
        self.err.setText("")
        self.ok.setText("Talking to the backend…")
        fields = {
            "backendUrl": self.backend.text().strip(),
            "provider": "steam",
            "steamId": self.steam_id.text().strip(),
            "appId": self.app_id.text().strip(),
            "petType": self._pet_key(),
            "allowWeakFallback": True if allow_weak else False,
            "licenseLine": self._shown_line(),
            "cdnLine": self._shown_bundle_line(),
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
            self._fetch_if_held(status)
            self.accept()

    def _on_fail(self, err: object) -> None:
        message = str(err)
        code = getattr(err, "code", "denied")
        self.ok.setText("Locked. The pet on the blotter still works.")
        self.err.setText(f"{code}: {message}")
        if code == "hwid_needs_fallback_yes" and not self._unlock_allowed_weak:
            if self._ask_weak(message):
                self._unlock(allow_weak=True)
            return
        QMessageBox.warning(self, "Unlock failed", f"{code}: {message}")

    def _download(self, allow_weak: bool = False) -> None:
        if self._license_unbound:
            if not self._download_may_leave(self._download_target()):
                return
        elif not self._hash_may_leave(self._download_target()):
            return
        try:
            downloaded = self.session["download"](
                {
                    "allowWeakFallback": True if allow_weak else False,
                    "licenseLine": self._shown_line(),
                    "cdnLine": self._shown_bundle_line(),
                }
            )
            if isinstance(downloaded, dict):
                self._fetch_if_held({"download": downloaded})
            self._paint_status(self.session["status"]())
        except LicenseError as err:
            self.err.setText(f"{err.code}: {err}")
            if err.code == "hwid_needs_fallback_yes" and not allow_weak and self._ask_weak(str(err)):
                self._download(allow_weak=True)
                return
            QMessageBox.warning(self, "Download failed", f"{err.code}: {err}")

    def _clear(self) -> None:
        self._paint_status(self.session["clear"]())
