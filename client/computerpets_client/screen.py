"""Whether the blotter's window can open on this Linux desktop, said in plain words before Qt tries.

PyQt6 brings most of the pieces its X11 window needs, but not all of them: libxcb-cursor (Qt 6.5 and newer),
and on a lean desktop libxkbcommon-x11 and libxcb-keysyms too. Without them Qt printed "Could not load the Qt
platform plugin "xcb"... Reinstalling the application may fix this problem" and aborted (exit 134). Reinstalling
does not fix it; a few packages do. Seen on a fresh Debian desktop (the box), where all three were missing and Qt
named only the first.
"""

from __future__ import annotations

import ctypes
import ctypes.util
import importlib.util
import os
import re
import subprocess
import sys
from collections.abc import Callable, Mapping
from pathlib import Path

#: The Ubuntu / Debian package for each piece the X11 window loads (the same names Qt's own docs list).
APT_PACKAGES = {
    "libxcb-cursor.so.0": "libxcb-cursor0",
    "libxkbcommon-x11.so.0": "libxkbcommon-x11-0",
    "libxkbcommon.so.0": "libxkbcommon0",
    "libxcb-keysyms.so.1": "libxcb-keysyms1",
    "libxcb-icccm.so.4": "libxcb-icccm4",
    "libxcb-image.so.0": "libxcb-image0",
    "libxcb-render-util.so.0": "libxcb-render-util0",
    "libxcb-shape.so.0": "libxcb-shape0",
    "libxcb-xinerama.so.0": "libxcb-xinerama0",
    "libxcb-xkb.so.1": "libxcb-xkb1",
    "libxcb-randr.so.0": "libxcb-randr0",
    "libEGL.so.1": "libegl1",
    "libGL.so.1": "libgl1",
    "libOpenGL.so.0": "libopengl0",
    "libfontconfig.so.1": "libfontconfig1",
    "libdbus-1.so.3": "libdbus-1-3",
}


def _find_library(name: str) -> str | None:
    return ctypes.util.find_library(name)


def _xcb_plugin() -> Path | None:
    """PyQt6's X11 screen plugin, found without starting Qt."""
    try:
        spec = importlib.util.find_spec("PyQt6")
    except (ImportError, ValueError):
        return None
    if spec is None or not spec.origin:
        return None
    plugin = Path(spec.origin).parent / "Qt6" / "plugins" / "platforms" / "libqxcb.so"
    return plugin if plugin.is_file() else None


def missing_pieces(plugin: Path | None = None) -> list[str]:
    """The shared libraries PyQt6's X11 plugin cannot load here (by file name), read with ldd; if there is no ldd,
    loading the plugin names the first one."""
    plugin = _xcb_plugin() if plugin is None else plugin
    if plugin is None:
        return []
    qpa = plugin.parents[2] / "lib" / "libQt6XcbQpa.so.6"
    files = [str(plugin)] + ([str(qpa)] if qpa.is_file() else [])
    try:
        out = subprocess.run(["ldd", *files], capture_output=True, text=True, timeout=20).stdout
        return sorted({m.group(1) for m in re.finditer(r"^\s*(\S+) => not found", out, re.M)})
    except (OSError, subprocess.SubprocessError):
        pass
    try:
        ctypes.CDLL(str(plugin))
    except OSError as e:
        m = re.match(r"(\S+?): cannot open shared object file", str(e))
        return [m.group(1)] if m else []
    return []


def linux_screen_pieces_message(
    platform: str | None = None,
    env: Mapping[str, str] | None = None,
    find: Callable[[str], str | None] | None = None,
    missing: Callable[[], list[str]] | None = None,
) -> str | None:
    """Plain words when the blotter's X11 window cannot open on Linux for want of some packages, else None.

    Only asked where Qt would use X11: Linux, a DISPLAY, and no other Qt screen chosen (QT_QPA_PLATFORM offscreen or
    wayland, or a Wayland session where Qt picks Wayland itself, need no X11 pieces)."""
    platform = sys.platform if platform is None else platform
    env = os.environ if env is None else env
    find = _find_library if find is None else find
    missing = missing_pieces if missing is None else missing
    if not platform.startswith("linux"):
        return None
    qpa = (env.get("QT_QPA_PLATFORM") or "").strip().lower()
    if qpa and not qpa.startswith("xcb"):
        return None
    if not env.get("DISPLAY"):
        return None
    if not qpa and env.get("WAYLAND_DISPLAY"):
        return None
    # Qt opens libxcb-cursor itself at start (the plugin does not link it), so ldd cannot see that one.
    gone = list(missing())
    if not find("xcb-cursor"):
        gone.insert(0, "libxcb-cursor.so.0")
    if not gone:
        return None
    packages = [APT_PACKAGES.get(g) for g in gone]
    count = "one more Linux piece" if len(gone) == 1 else f"{len(gone)} more Linux pieces"
    words = f"The blotter needs {count} to open its window."
    if all(packages):
        words += f" On Ubuntu or Debian type sudo apt install {' '.join(packages)} and press Enter."
        words += f" On other Linux, install the packages that have {', '.join(gone)}."
    else:
        words += f" Install the packages that have {', '.join(gone)}."
    return words + " Then type python -m computerpets_client again."
