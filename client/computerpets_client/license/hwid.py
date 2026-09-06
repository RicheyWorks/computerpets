"""Opaque device binding. Backend does not define a fingerprint algorithm."""

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


def assert_hwid(hwid: object) -> str:
    if not isinstance(hwid, str) or not hwid:
        raise LicenseError("hwid_mismatch", "hwid is required for a bound license")
    if len(hwid) > MAX_HWID_LENGTH:
        raise LicenseError("hwid_too_long", "hwid too long", {"maxLength": MAX_HWID_LENGTH})
    return hwid


def resolve_hwid(
    *,
    user_data_dir: str | Path | None = None,
    plat: str | None = None,
    read_file: Callable[[str], str] | None = None,
    write_file: Callable[[str, str], None] | None = None,
    exec_cmd: Callable[[str], str] | None = None,
    fallback_id: str | None = None,
) -> str:
    persist = Path(user_data_dir) / "hwid.txt" if user_data_dir else None
    reader = read_file or (lambda p: Path(p).read_text(encoding="utf-8"))
    writer = write_file or (lambda p, data: Path(p).write_text(data, encoding="utf-8"))

    if persist is not None:
        try:
            existing = reader(str(persist)).strip()
            if existing:
                return assert_hwid(existing)
        except OSError:
            pass

    raw = _read_machine_source(plat, reader, exec_cmd) or fallback_id or str(uuid.uuid4())
    digest = hashlib.sha256(f"computerpets:{plat or platform.system().lower()}:{raw}".encode("utf-8")).hexdigest()
    assert_hwid(digest)

    if persist is not None:
        try:
            persist.parent.mkdir(parents=True, exist_ok=True)
            writer(str(persist), digest)
        except OSError:
            pass
    return digest


def _read_machine_source(
    plat: str | None,
    read_file: Callable[[str], str],
    exec_cmd: Callable[[str], str] | None,
) -> str | None:
    system = (plat or platform.system()).lower()
    if system in ("linux",):
        for path in ("/etc/machine-id", "/var/lib/dbus/machine-id"):
            try:
                text = read_file(path).strip()
                if text:
                    return text
            except OSError:
                continue
        return None

    runner = exec_cmd or _default_exec
    if system in ("darwin", "macos"):
        try:
            out = runner("ioreg -rd1 -c IOPlatformExpertDevice")
            for line in out.splitlines():
                if "IOPlatformUUID" in line and '"' in line:
                    return line.rsplit('"', 2)[-2]
        except (OSError, subprocess.SubprocessError):
            return None
        return None

    if system in ("win32", "windows"):
        try:
            out = runner("reg query HKLM\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid")
            for line in out.splitlines():
                if "MachineGuid" in line:
                    parts = line.split()
                    if parts:
                        return parts[-1]
        except (OSError, subprocess.SubprocessError):
            return os.uname().nodename if hasattr(os, "uname") else None
        return None

    try:
        return os.uname().nodename
    except AttributeError:
        return None


def _default_exec(cmd: str) -> str:
    return subprocess.check_output(cmd, shell=True, text=True, timeout=3)
