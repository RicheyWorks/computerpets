"""Desk presence is not a file API. A dropped host file is not a gift and not a place."""

from __future__ import annotations

import time

HOUSE_FILES = ("card.json", "mind.json")

# Geolocation is not a standing grant. It opens only for one weather locate,
# then closes. The blotter does not read machine location, does not ask an
# IP place service, and does not send a place to a forecast host. Weather
# is the civil-day clock. There is no watcher and no silent re-query.
# A cached origin grant is a desk limit. This process does not locate, so
# it has no in-app locate confirm, no live pin to round, and no saved
# computer place to send to a forecast host. Noting a locate yes still
# does not call for a place. It does not call a geocode host. News RSS,
# market quotes, and radio find are not this client. A station stream
# is not this client. Cloud talk and cloud voice are not this client.
# Unlock says the license website's name before the code made from this
# computer's ID goes there. Opening this process does not send it. Your
# pet's files are asked for only after the download website is named.
# Opening this process does not download them.
# Electron 35
# cannot revoke a Chromium grant.
WEATHER_LOCATE_MS = 120_000
_weather_locate_until = 0
_weather_locate_yes = False


def _now_ms(now: int = 0) -> int:
    if isinstance(now, (int, float)) and now > 0:
        return int(now)
    return int(time.time() * 1000)


def allow_navigation(url: str = "") -> bool:
    del url
    return False


def arm_weather_locate(now: int = 0) -> int:
    """Open geolocation until clear_weather_locate or WEATHER_LOCATE_MS."""
    global _weather_locate_until
    base = _now_ms(now)
    _weather_locate_until = base + WEATHER_LOCATE_MS
    return _weather_locate_until


def clear_weather_locate() -> None:
    global _weather_locate_until
    _weather_locate_until = 0


def weather_locate_open(now: int = 0) -> bool:
    return _weather_locate_until > _now_ms(now)


def allow_permission(permission: str, now: int = 0) -> bool:
    if permission != "geolocation":
        return False
    return weather_locate_open(now)


def note_weather_locate_yes() -> None:
    """The blotter has no Send the place button. Noting a yes does not read a place."""
    global _weather_locate_yes
    _weather_locate_yes = True


def hold_weather_locate() -> None:
    """Don't send. The blotter never had a locate to hold."""
    global _weather_locate_yes
    _weather_locate_yes = False


def read_weather_here() -> None:
    """The blotter does not read the machine location and does not send a place.

    A fresh in-app yes on the desk is not this function. Noting one still returns nothing.
    """
    hold_weather_locate()
    clear_weather_locate()
    return None


def ip_place(*_ignored: object) -> None:
    """No IP place service. A consent flag does not open one."""
    return None


def read_machine_mark(*_ignored: object) -> dict[str, object]:
    """Presence does not read a machine id. License binding is license/hwid.py.

    This does not open machine-id, MachineGuid, or the Mac platform UUID.
    """
    return {"read": False, "raw": None, "id": ""}


def house_file(user_data_dir: str, name: str) -> str | None:
    if not isinstance(user_data_dir, str) or not user_data_dir.strip():
        return None
    if name not in HOUSE_FILES:
        return None
    if "/" in name or "\\" in name or ".." in name:
        return None
    root = user_data_dir.rstrip("/\\")
    return f"{root}/{name}"


def refuse_file_drop(types: list[str] | None = None, file_count: int = 0) -> dict[str, bool]:
    listed = [str(item) for item in (types or [])]
    uri = "text/uri-list" in listed or "application/x-moz-file" in listed
    files = file_count > 0 or "Files" in listed or uri
    return {"accept": False, "read": False, "files": files}


def list_host_folder(name: str = "") -> dict[str, object]:
    """Presence does not list a host folder. This does not touch the disk."""
    del name
    return {"listed": False, "names": []}


def window_caption(row: dict | None = None) -> None:
    """The blotter has no window title and no document name."""
    del row
    return None


def host_path_label(value: str = "", consent: bool = False) -> str:
    """A host path is omitted unless the keeper has already consented."""
    if consent is not True:
        return ""
    if not isinstance(value, str):
        return ""
    return value.strip()


_FIELD_TAGS = frozenset({"INPUT", "TEXTAREA", "SELECT"})


def _focused_field(event: dict | None) -> bool:
    if not isinstance(event, dict):
        return False
    if event.get("focused") is True or event.get("field") is True:
        return True
    target = event.get("target")
    if not isinstance(target, dict):
        return False
    if target.get("isContentEditable") is True:
        return True
    tag = str(target.get("tagName") or target.get("tag") or "").upper()
    return tag in _FIELD_TAGS


def classify_key(event: dict | None = None) -> dict[str, object]:
    """A key outside a focused field is not a presence log.

    A focused field keeps the character. This does not read it.
    Escape outside a field may dismiss a menu. The key text is not returned.
    """
    if _focused_field(event):
        return {"record": False, "field": True, "toggle": False}
    key = ""
    if isinstance(event, dict) and isinstance(event.get("key"), str):
        key = event["key"]
    if key == "Escape":
        return {"record": False, "field": False, "toggle": "dismiss"}
    return {"record": False, "field": False, "toggle": False}


def record_keystroke(buffer: list | None = None, event: dict | None = None) -> dict[str, object]:
    """Refuse a keystroke log. The buffer is not appended. The key is not returned."""
    del buffer, event
    return {"record": False, "keys": []}


def seal_widget(widget) -> None:
    """Qt ignores drops when this is false. Callers still override the events."""
    widget.setAcceptDrops(False)
