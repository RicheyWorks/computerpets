"""License machine mark. A stored hash is the binding. The raw OS id stays here."""

from __future__ import annotations

import hashlib
import os
import platform
import subprocess
import uuid
from pathlib import Path
from typing import Callable

from .errors import LicenseError

MAX_HWID_LENGTH = 128

# Named marks Unlock may read. Listing them does not read them.
# The raw value is not a field. A hash of that value can leave on unlock.
MACHINE_MARKS: tuple[dict[str, str], ...] = (
    {
        "platform": "linux",
        "source": "etc-machine-id",
        "kind": "file",
        "where": "/etc/machine-id",
        "why": "Linux install id. Stable across boots. A device fingerprint.",
    },
    {
        "platform": "linux",
        "source": "dbus-machine-id",
        "kind": "file",
        "where": "/var/lib/dbus/machine-id",
        "why": "Fallback Linux install id when /etc/machine-id is missing. Same fingerprint.",
    },
    {
        "platform": "darwin",
        "source": "io-platform-uuid",
        "kind": "ioreg",
        "where": "IOPlatformExpertDevice IOPlatformUUID",
        "why": "Mac platform UUID from ioreg. A hardware fingerprint.",
    },
    {
        "platform": "win32",
        "source": "machine-guid",
        "kind": "registry",
        "where": "HKLM\\SOFTWARE\\Microsoft\\Cryptography",
        "value": "MachineGuid",
        "why": "Windows install GUID, value MachineGuid. A device fingerprint.",
    },
    {
        "platform": "hostname",
        "source": "hostname",
        "kind": "hostname",
        "where": "the computer name",
        "why": "Used only after an in-app yes, when the named OS mark cannot be read. The name is still a fingerprint, and a rename changes it.",
    },
    {
        "platform": "random",
        "source": "random",
        "kind": "uuid",
        "where": "a local random id",
        "why": "Used only after that same yes, when there is no computer name. Not stable if hwid.txt is deleted.",
    },
)

# Shown when Unlock would otherwise mint a computer-name or random mark.
WEAK_FALLBACK_MESSAGE = (
    "This computer has no stable operating-system id. Unlock waits until you say yes before it hashes the computer name. "
    "If this computer has no name, that yes hashes a random id. A rename changes the computer-name hash. "
    "Deleting hwid.txt makes a random id a different mark."
)


def assert_hwid(hwid: object) -> str:
    if not isinstance(hwid, str) or not hwid:
        raise LicenseError("hwid_mismatch", "hwid is required for a bound license")
    if len(hwid) > MAX_HWID_LENGTH:
        raise LicenseError("hwid_too_long", "hwid too long", {"maxLength": MAX_HWID_LENGTH})
    return hwid


def describe_machine_marks(plat: str | None = None) -> list[dict[str, str]]:
    """What this platform may read, in order. Does not touch the disk or the registry."""
    want = str(plat) if plat else ""
    system = want.lower()
    rows: list[dict[str, str]] = []
    for mark in MACHINE_MARKS:
        if not want:
            rows.append(dict(mark))
            continue
        if mark["platform"] in ("hostname", "random"):
            rows.append(dict(mark))
            continue
        if system in ("macos", "darwin") and mark["platform"] == "darwin":
            rows.append(dict(mark))
        elif system in ("windows", "win32") and mark["platform"] == "win32":
            rows.append(dict(mark))
        elif mark["platform"] == system:
            rows.append(dict(mark))
    return rows


def _where(source: str) -> str:
    for mark in MACHINE_MARKS:
        if mark["source"] == source:
            return mark["where"]
    return ""


def _value(source: str) -> str:
    for mark in MACHINE_MARKS:
        if mark["source"] == source:
            return mark.get("value", "")
    return ""


def _host_name(hostname: str | None) -> str | None:
    if isinstance(hostname, str) and hostname:
        return hostname
    try:
        return os.uname().nodename or None
    except AttributeError:
        # Windows has no os.uname. platform.node() reads the same computer name there.
        return platform.node() or None


def peek_hwid(
    *,
    user_data_dir: str | Path | None = None,
    read_file: Callable[[str], str] | None = None,
) -> dict[str, object]:
    """Hash already in hwid.txt, or nothing. Does not read the OS machine id.

    A non-empty file is the binding, including a value that is not a fresh digest.
    """
    if not user_data_dir:
        return {"id": "", "source": None, "read": "unread", "rawLeavesMachine": False}
    persist = str(Path(user_data_dir) / "hwid.txt")
    reader = read_file or (lambda p: Path(p).read_text(encoding="utf-8"))
    try:
        existing = reader(persist).strip()
    except OSError:
        return {"id": "", "source": None, "read": "unread", "rawLeavesMachine": False}
    if not existing:
        return {"id": "", "source": None, "read": "unread", "rawLeavesMachine": False}
    return {"id": assert_hwid(existing), "source": "hwid.txt", "read": "stored", "rawLeavesMachine": False}


def _hash_mark(raw: str, plat_token: str) -> str:
    return hashlib.sha256(f"computerpets:{plat_token}:{raw}".encode("utf-8")).hexdigest()


def _read_machine_source(
    plat: str | None,
    read_file: Callable[[str], str],
    exec_cmd: Callable[[str], str] | None,
) -> tuple[str | None, str | None]:
    """Read one named OS mark. The raw string must not be logged, stored, or sent.

    A miss does not read the computer name.
    """
    system = (plat or platform.system()).lower()
    if system in ("linux",):
        for source, path in (
            ("etc-machine-id", _where("etc-machine-id")),
            ("dbus-machine-id", _where("dbus-machine-id")),
        ):
            try:
                text = read_file(path).strip()
            except OSError:
                continue
            if text:
                return text, source
        return None, None

    runner = exec_cmd or _default_exec
    if system in ("darwin", "macos"):
        try:
            out = runner("ioreg -rd1 -c IOPlatformExpertDevice")
        except (OSError, subprocess.SubprocessError):
            return None, None
        for line in out.splitlines():
            if "IOPlatformUUID" in line and '"' in line:
                return line.rsplit('"', 2)[-2], "io-platform-uuid"
        return None, None

    if system in ("win32", "windows"):
        try:
            out = runner(f"reg query {_where('machine-guid')} /v {_value('machine-guid')}")
        except (OSError, subprocess.SubprocessError):
            return None, None
        for line in out.splitlines():
            if "MachineGuid" in line:
                parts = line.split()
                if parts:
                    return parts[-1], "machine-guid"
        return None, None

    return None, None


def _weak_material(hostname: str | None, fallback_id: str | None) -> tuple[str, str]:
    """Computer name, then a caller fallback, then a random id. Only after a yes.

    An explicit empty hostname means this computer has no name.
    """
    if isinstance(hostname, str):
        if hostname:
            return hostname, "hostname"
    else:
        name = _host_name(None)
        if name:
            return name, "hostname"
    if fallback_id:
        return str(fallback_id), "fallback"
    return str(uuid.uuid4()), "random"


def _default_exec(cmd: str) -> str:
    return subprocess.check_output(cmd, shell=True, text=True, timeout=3)


def resolve_hwid_detail(
    *,
    user_data_dir: str | Path | None = None,
    plat: str | None = None,
    read_file: Callable[[str], str] | None = None,
    write_file: Callable[[str, str], None] | None = None,
    exec_cmd: Callable[[str], str] | None = None,
    fallback_id: str | None = None,
    hostname: str | None = None,
    allow_weak_fallback: bool = False,
    mkdir: Callable[[str], None] | None = None,
) -> dict[str, object]:
    """Stable license mark. A stored hwid.txt wins and is not rewritten.

    The OS id is read only when that file is missing. The return has no raw field.
    The digest recipe is unchanged: sha256("computerpets:" + platform token + ":" + raw).
    The platform token is plat, or platform.system().lower() when plat is omitted.
    That token is "windows" here and "win32" in the overlay. Each client keeps its own file.
    A missing named id does not hash the computer name or a random id until allow_weak_fallback.
    An injected write_file owns its storage: no real folder is made unless mkdir is also passed.
    """
    stored = peek_hwid(user_data_dir=user_data_dir, read_file=read_file)
    if stored["read"] == "stored":
        return stored

    reader = read_file or (lambda p: Path(p).read_text(encoding="utf-8"))
    writer = write_file or (lambda p, data: Path(p).write_text(data, encoding="utf-8"))
    raw, source = _read_machine_source(plat, reader, exec_cmd)
    if not raw:
        if not allow_weak_fallback:
            raise LicenseError("hwid_needs_fallback_yes", WEAK_FALLBACK_MESSAGE)
        raw, source = _weak_material(hostname, fallback_id)
    plat_token = plat or platform.system().lower()
    digest = _hash_mark(raw, plat_token)
    assert_hwid(digest)

    if user_data_dir:
        persist = Path(user_data_dir) / "hwid.txt"
        maker = mkdir or (None if write_file else (lambda p: Path(p).mkdir(parents=True, exist_ok=True)))
        try:
            if maker:
                maker(str(persist.parent))
            writer(str(persist), digest)
        except OSError:
            pass
    return {"id": digest, "source": source, "read": "machine", "rawLeavesMachine": False}


def resolve_hwid(
    *,
    user_data_dir: str | Path | None = None,
    plat: str | None = None,
    read_file: Callable[[str], str] | None = None,
    write_file: Callable[[str, str], None] | None = None,
    exec_cmd: Callable[[str], str] | None = None,
    fallback_id: str | None = None,
    hostname: str | None = None,
    allow_weak_fallback: bool = False,
    mkdir: Callable[[str], None] | None = None,
) -> str:
    detail = resolve_hwid_detail(
        user_data_dir=user_data_dir,
        plat=plat,
        read_file=read_file,
        write_file=write_file,
        exec_cmd=exec_cmd,
        fallback_id=fallback_id,
        hostname=hostname,
        allow_weak_fallback=allow_weak_fallback,
        mkdir=mkdir,
    )
    return str(detail["id"])
