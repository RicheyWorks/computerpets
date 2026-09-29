"""Steam unlock against the published client contract. Fail closed."""

from __future__ import annotations

import logging
from typing import Any, Callable

from PyQt6.QtCore import QObject, QThread, Qt, pyqtSignal
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
    QToolButton,
    QVBoxLayout,
)

from .license.errors import LicenseError
from .license.plain_error import host_of, plain_license_error, raw_log_line
from .license.session import TOKEN_GONE_NOTE, TOKEN_MEMORY_NOTE
from .license.hwid import WEAK_FALLBACK_MESSAGE
from .license.license_net import (
    BUNDLE_IDLE,
    BUNDLE_LOCAL,
    DOWNLOAD_LOCAL,
    bundle_honesty,
    download_talk_honesty,
    get_signed_bundle,
    LOCAL_STAYS,
    license_honesty,
    license_host_name,
    post_license_hash,
    post_unbound_download,
)
from .species import CATALOG_KEYS, SPECIES

WEAK_FALLBACK_YES = "Use the computer name, or a random ID if there is no name"

# The Unlock fields: a plain label and one helper line each, word for word the same as the overlay
# Settings window (desktop/renderer/settings.html). Only Steam is wired into these windows; the web
# desk has no Unlock form.
PROVIDER_LABEL = "Where you own the game"
PROVIDER_HELP = "Only Steam works here for now. Other stores cannot unlock from this window yet."
STEAM_ID_LABEL = "Your Steam ID"
STEAM_ID_HELP = "Your Steam account number: 17 digits that start with 7656. Steam shows it under Account details."
APP_ID_LABEL = "Steam App ID"
# The Pet list shows the pet's name and kind, the same as the overlay ("Rui · Red Panda"); the key stays the value.
PET_LABEL = "Pet"
WEAK_ASK_TITLE = "Could not read this computer's ID"
APP_ID_HELP = "The game's number on Steam. Ask whoever runs the house server. ComputerPets has no Steam page yet."

# The short first line. The privacy detail folds under Details, in whole sentences.
UNLOCK_INTRO = "Pets work without unlocking. Unlocking is optional."
UNLOCK_WHAT = "Unlock proves Steam ownership to the house server. It does not open a second overlay."
DETAILS_LABEL = "Details"

# Each sentence is checked against license/hwid.py and license/session.py:
# the three named sources, sha256("computerpets:" + platform + ":" + raw), hwid.txt in the
# blotter data folder, a stored hash reused and not rewritten, and the weak fallback that
# waits for a yes (computer name, else a random ID).
# One short sentence per line, like START-HERE and the overlay Details (the label keeps the breaks).
MARK_UNREAD_TEXT = "\n".join(
    (
        "Opening this window did not look at this computer's ID.",
        "Unlock looks at the ID only when no code is saved yet.",
        "So does downloading a pet whose license belongs to this computer.",
        "The ID is the machine-id file on Linux, MachineGuid on Windows, or the platform UUID on a Mac.",
        "The blotter mixes that ID with the app's name and the kind of computer.",
        "It scrambles the result with SHA-256 into a code.",
        "It saves only that code in hwid.txt in its data folder.",
        "Later unlocks use the saved code again.",
        "So your license keeps working on this computer.",
        "The ID itself is never sent.",
        "Only the code goes to the license website.",
        "It goes only when you unlock or download a pet whose license belongs to this computer.",
        "The code still works like a fingerprint for this computer.",
        "That is because this computer always makes the same code.",
        "The line under the house server address names the website before the code is sent.",
        "If the house server is on this computer, the code stays on this computer.",
        "If the app cannot read that ID, Unlock stops and asks you first.",
        "It uses the computer's name only after you say yes.",
        "It uses a random ID instead if this computer has no name.",
        "Renaming the computer changes a code made from its name.",
        "If the code came from a random ID, deleting hwid.txt gives this computer a different code.",
    )
)

MARK_STORED_TEXT = "\n".join(
    (
        "A code is already saved in hwid.txt.",
        "Unlock uses it again and does not look at this computer's ID again.",
        "The ID itself is never sent.",
        "The code still works like a fingerprint for this computer.",
        "That is because this computer always makes the same code.",
        "The line under the house server address names the website before the code is sent.",
        "If the house server is on this computer, the code stays on this computer.",
    )
)


_LOG = logging.getLogger("computerpets.license")


def pet_choice_text(name: str, kind: str) -> str:
    """One Pet list line: the pet's name and kind, never the catalog key (overlay settings.html does the same)."""
    return f"{name} · {kind}" if kind else name


def license_error_text(err: object, host: str = "") -> str:
    """What the dialog shows for a failed license call: one plain sentence, never a traceback,
    a code, or the server's own words. The raw error goes to the log only (license/plain_error.py).
    """
    plain = plain_license_error(err, host)
    _LOG.warning("[license] %s: %s", plain["code"], raw_log_line(err))
    return plain["message"]


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
        except Exception as err:  # noqa: BLE001 — a worker must not raise; the dialog shows plain words
            failure = LicenseError("failed", "unlock failed", raw_log_line(err))
            failure.__cause__ = err
            self.failed.emit(failure)


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
        lead = QLabel(UNLOCK_INTRO)
        lead.setObjectName("unlockIntro")
        lead.setWordWrap(True)
        what = QLabel(UNLOCK_WHAT)
        what.setWordWrap(True)
        # The privacy detail folds under a Details toggle, closed until the keeper opens it.
        self.details = QToolButton()
        self.details.setObjectName("unlockDetails")
        self.details.setText(DETAILS_LABEL)
        self.details.setCheckable(True)
        self.details.setChecked(False)
        self.details.setAutoRaise(True)
        self.details.setArrowType(Qt.ArrowType.RightArrow)
        self.details.setToolButtonStyle(Qt.ToolButtonStyle.ToolButtonTextBesideIcon)
        self.mark = QLabel(self._mark_text(status))
        self.mark.setObjectName("unlockMark")
        self.mark.setWordWrap(True)
        self.mark.setVisible(False)
        self.details.toggled.connect(self._toggle_details)

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
        self.app_id.setObjectName("appId")
        self.app_id.setPlaceholderText("123456")
        # ComputerPets has no Steam page, so the App ID row shows only when this copy has one set up
        # (COMPUTERPETS_STEAM_APP_ID or a steam_appid.txt) or a past unlock saved one: the overlay's rule
        # (desktop/renderer/settings.html #appIdRow). With none, Unlock says so in one plain line
        # (license/session.py NO_APP_ID_MESSAGE) and nothing is sent.
        self.app_id_label = QLabel(APP_ID_LABEL)
        self.app_id_label.setObjectName("appIdLabel")
        self.app_id_label.setBuddy(self.app_id)
        self.app_id_help = self._helper(APP_ID_HELP, "appIdHelp")
        self.pet_type = QComboBox()
        self.pet_type.setEditable(True)
        for key in CATALOG_KEYS:
            spec = SPECIES[key]
            self.pet_type.addItem(pet_choice_text(spec.name, spec.label), key)
        current = (status.get("fields") or {}).get("petType") or "red_panda"
        idx = self.pet_type.findData(current)
        if idx >= 0:
            self.pet_type.setCurrentIndex(idx)
        else:
            self.pet_type.setEditText(str(current))

        form = QFormLayout()
        form.addRow("House server address", self.backend)
        form.addRow("", self.net)
        form.addRow("", self.bundle)
        form.addRow(PROVIDER_LABEL, QLabel("Steam"))
        form.addRow("", self._helper(PROVIDER_HELP, "providerHelp"))
        form.addRow(STEAM_ID_LABEL, self.steam_id)
        form.addRow("", self._helper(STEAM_ID_HELP, "steamIdHelp"))
        form.addRow(self.app_id_label, self.app_id)
        form.addRow("", self.app_id_help)
        form.addRow(PET_LABEL, self.pet_type)

        self.ok = QLabel()
        self.ok.setWordWrap(True)
        self.err = QLabel()
        self.err.setWordWrap(True)
        self.err.setStyleSheet("color: #d9a08a;")
        self._paint_status(status)

        unlock_btn = QPushButton("Unlock")
        unlock_btn.clicked.connect(self._unlock)
        download_btn = QPushButton("Download my pet")
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
        layout.addWidget(what)
        layout.addWidget(self.details)
        layout.addWidget(self.mark)
        layout.addLayout(form)
        layout.addLayout(row)
        layout.addWidget(self.ok)
        layout.addWidget(self.err)
        layout.addWidget(buttons)
        # After the layout owns the row, so showing a part never opens it as its own window.
        self._paint_app_id(status)

    @staticmethod
    def _helper(text: str, name: str) -> QLabel:
        """One small helper line under an Unlock field (same words as the overlay's p.hint)."""
        line = QLabel(text)
        line.setObjectName(name)
        line.setWordWrap(True)
        return line

    def app_id_shown(self) -> bool:
        """True when the App ID row is showing (set up for this copy, saved before, or typed)."""
        return not self.app_id.isHidden()

    def _paint_app_id(self, status: dict[str, Any]) -> None:
        configured = status.get("steamAppId") if isinstance(status.get("steamAppId"), str) else ""
        saved = str((status.get("fields") or {}).get("appId") or "") if isinstance(status.get("fields"), dict) else ""
        if saved and not self.app_id.text():
            self.app_id.setText(saved)
        if configured and not self.app_id.text():
            self.app_id.setText(configured)
        shown = bool(configured or saved or self.app_id.text().strip())
        for part in (self.app_id_label, self.app_id, self.app_id_help):
            part.setVisible(shown)

    def _mark_text(self, status: dict[str, Any]) -> str:
        mark = status.get("hwidMark") if isinstance(status, dict) else None
        if isinstance(mark, dict) and mark.get("read") == "stored":
            return MARK_STORED_TEXT
        return MARK_UNREAD_TEXT

    def _toggle_details(self, shown: bool) -> None:
        self.mark.setVisible(bool(shown))
        self.details.setArrowType(Qt.ArrowType.DownArrow if shown else Qt.ArrowType.RightArrow)
        self.adjustSize()

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

    def _named_hold(self, err: LicenseError) -> bool:
        if err.code == "license_net_unnamed":
            self.ok.setText("Locked. The pet on the blotter still works.")
            self.err.setText("Nothing was sent. This page has to name the license website first.")
            return True
        if err.code == "download_net_unnamed":
            self.ok.setText("Locked. The pet on the blotter still works.")
            self.err.setText("Nothing was sent. This page has to name the license website first.")
            return True
        if err.code == "cdn_net_unnamed":
            self.err.setText("Your pet's files were not downloaded. This page has to name the download website first.")
            return True
        return False

    def _fetch_if_held(self, status: dict[str, Any]) -> None:
        url = self._bundle_url(status)
        self._paint_bundle(url)
        bundle = self._bundle_body(status)
        if not url or bundle.get("held") is not True:
            return
        line = self._shown_bundle_line()
        try:
            get_signed_bundle(line, url, lambda: self.session["fetch_signed"]({"cdnLine": line}), True)
        except LicenseError as err:
            if self._named_hold(err):
                return
            self.err.setText(license_error_text(err, host_of(url)))

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
            # No secret store: say plainly the sign-in lasts this run only, and to unlock again later.
            kept = status.get("tokenKept")
            self.err.setText(TOKEN_MEMORY_NOTE if kept == "memory" else TOKEN_GONE_NOTE if kept == "none" else "")
        else:
            self.ok.setText("Locked. The pet on the blotter still works.")
            err = status.get("error")
            # A stored license's own refusal (expired, cannot open) gets the same plain words.
            self.err.setText(license_error_text(err, host_of(status.get("backendUrl"))) if err else "")

    def _pet_key(self) -> str:
        data = self.pet_type.currentData()
        if isinstance(data, str) and data.strip():
            return data.strip()
        text = self.pet_type.currentText().strip()
        if " — " in text:
            text = text.split(" — ", 1)[0].strip()
        # A typed name or "Name · Kind" finds its key; anything else is sent as typed (the old behavior).
        for key in CATALOG_KEYS:
            spec = SPECIES[key]
            if text in (spec.name, pet_choice_text(spec.name, spec.label)):
                return key
        return text or "red_panda"

    def _ask_weak(self, message: str) -> bool:
        answer = QMessageBox.question(
            self,
            WEAK_ASK_TITLE,
            (message or WEAK_FALLBACK_MESSAGE) + "\n\n" + WEAK_FALLBACK_YES + "?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No,
        )
        return answer == QMessageBox.StandardButton.Yes

    def _begin_unlock(self, allow_weak: bool) -> bool:
        self._unlock_allowed_weak = allow_weak
        self.err.setText("")
        self.ok.setText("Asking the house server…")
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
        return True

    def _unlock(self, allow_weak: bool = False) -> None:
        self._paint_net()
        try:
            post_license_hash(self._shown_line(), self._unlock_target(), lambda: self._begin_unlock(allow_weak))
        except LicenseError as err:
            if self._named_hold(err):
                return
            raise

    def _on_ok(self, status: object) -> None:
        if isinstance(status, dict):
            self._paint_status(status)
            self._paint_app_id(status)
            self._fetch_if_held(status)
            self.accept()

    def _on_fail(self, err: object) -> None:
        code = getattr(err, "code", "failed")
        if isinstance(err, LicenseError) and self._named_hold(err):
            return
        text = license_error_text(err, host_of(self._unlock_target()))
        self.ok.setText("Locked. The pet on the blotter still works.")
        self.err.setText(text)
        if code == "hwid_needs_fallback_yes" and not self._unlock_allowed_weak:
            if self._ask_weak(text):
                self._unlock(allow_weak=True)
            return
        QMessageBox.warning(self, "Unlock failed", text)

    def _download(self, allow_weak: bool = False) -> None:
        self._paint_net()
        line = self._shown_line()
        url = self._download_target()

        def go() -> Any:
            return self.session["download"](
                {
                    "allowWeakFallback": True if allow_weak else False,
                    "licenseLine": line,
                    "cdnLine": self._shown_bundle_line(),
                }
            )

        try:
            poster = post_unbound_download if self._license_unbound else post_license_hash
            downloaded = poster(line, url, go)
        except LicenseError as err:
            if self._named_hold(err):
                return
            text = license_error_text(err, host_of(url))
            self.err.setText(text)
            if err.code == "hwid_needs_fallback_yes" and not allow_weak and self._ask_weak(str(err)):
                self._download(allow_weak=True)
                return
            QMessageBox.warning(self, "Download failed", text)
            return
        except Exception as err:  # noqa: BLE001 — a Qt slot must not raise; plain words, raw text to the log
            text = license_error_text(err, host_of(url))
            self.err.setText(text)
            QMessageBox.warning(self, "Download failed", text)
            return
        if isinstance(downloaded, dict):
            self._fetch_if_held({"download": downloaded})
        self._paint_status(self.session["status"]())

    def _clear(self) -> None:
        self._paint_status(self.session["clear"]())
