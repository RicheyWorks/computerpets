"""User-data and asset locations. No Qt import so license tests stay headless."""

from __future__ import annotations

import os
from pathlib import Path


def package_dir() -> Path:
    return Path(__file__).resolve().parent


def default_user_data_dir() -> Path:
    override = os.environ.get("COMPUTERPETS_CLIENT_HOME")
    if override:
        return Path(override)
    xdg = os.environ.get("XDG_DATA_HOME")
    if xdg:
        return Path(xdg) / "computerpets-client"
    return Path.home() / ".local" / "share" / "computerpets-client"
