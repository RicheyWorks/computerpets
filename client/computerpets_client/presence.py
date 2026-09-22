"""Desk presence is not a file API. A dropped host file is not a gift and not a place."""

from __future__ import annotations

HOUSE_FILES = ("card.json", "mind.json")
ALLOWED_PERMISSIONS = frozenset({"geolocation"})


def allow_navigation(url: str = "") -> bool:
    del url
    return False


def allow_permission(permission: str) -> bool:
    return permission in ALLOWED_PERMISSIONS


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
