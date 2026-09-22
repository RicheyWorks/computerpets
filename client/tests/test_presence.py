"""Presence does not open keeper files. Drops are not gifts."""

from pathlib import Path

from computerpets_client.presence import (
    WEATHER_LOCATE_MS,
    allow_navigation,
    allow_permission,
    arm_weather_locate,
    classify_key,
    clear_weather_locate,
    host_path_label,
    house_file,
    ip_place,
    list_host_folder,
    read_weather_here,
    record_keystroke,
    refuse_file_drop,
    window_caption,
)


def test_house_files_stay_inside_user_data():
    assert house_file("/tmp/computerpets", "card.json") == "/tmp/computerpets/card.json"
    assert house_file("/tmp/computerpets", "mind.json") == "/tmp/computerpets/mind.json"
    assert house_file("/tmp/computerpets", "../Desktop/homework.txt") is None
    assert house_file("/tmp/computerpets", "/etc/passwd") is None
    assert house_file("/tmp/computerpets", "hwid.txt") is None
    assert house_file("", "card.json") is None


def test_navigation_and_capture_stay_refused():
    clear_weather_locate()
    assert allow_navigation("file:///home/keeper/homework.html") is False
    assert allow_navigation("https://evil.example") is False
    assert allow_permission("geolocation", 1_000) is False
    assert arm_weather_locate(1_000) == 1_000 + WEATHER_LOCATE_MS
    assert allow_permission("geolocation", 1_000) is True
    assert allow_permission("geolocation", 1_000 + WEATHER_LOCATE_MS) is False
    clear_weather_locate()
    assert allow_permission("geolocation", 1_500) is False
    assert allow_permission("clipboard-read") is False
    assert allow_permission("display-capture") is False
    assert allow_permission("fileSystem") is False
    assert read_weather_here() is None
    assert allow_permission("geolocation", 1_000) is False
    assert ip_place() is None
    assert ip_place(True) is None
    root = Path(__file__).resolve().parents[1]
    for rel in (
        "computerpets_client/presence.py",
        "computerpets_client/app.py",
        "computerpets_client/weather.py",
    ):
        text = (root / rel).read_text(encoding="utf-8")
        assert "ipwho" not in text
        assert "ip-api.com" not in text
        assert "ipinfo.io" not in text


def test_user_folders_are_not_listed_and_titles_are_not_read():
    for folder in ("Desktop", "Documents", "Downloads", "/home/keeper/Projects"):
        listed = list_host_folder(folder)
        assert listed == {"listed": False, "names": []}
    row = {
        "title": "homework.docx — Notepad",
        "document": "homework.docx",
        "path": r"C:\Users\keeper\Documents\homework.docx",
    }
    assert window_caption(row) is None
    assert host_path_label(row["path"], False) == ""
    assert host_path_label(row["path"], True) == row["path"]


def test_keys_outside_a_focused_field_are_not_logged():
    class _Field(dict):
        def __init__(self):
            super().__init__(target={"tagName": "INPUT"})
            self.reads = 0

        def get(self, name, default=None):
            if name == "key":
                self.reads += 1
                return "hunter2"
            return super().get(name, default)

    field = _Field()
    noted = classify_key(field)
    assert noted == {"record": False, "field": True, "toggle": False}
    assert field.reads == 0
    assert "hunter2" not in str(noted)

    outside = classify_key({"key": "hunter2", "target": {"tagName": "BODY"}})
    assert outside == {"record": False, "field": False, "toggle": False}
    assert "hunter2" not in str(outside)
    buf: list[str] = []
    assert record_keystroke(buf, {"key": "hunter2"}) == {"record": False, "keys": []}
    assert buf == []
    dismiss = classify_key({"key": "Escape", "target": {"tagName": "DIV"}})
    assert dismiss == {"record": False, "field": False, "toggle": "dismiss"}
    assert "Escape" not in str(dismiss)
    assert classify_key({"key": "Escape", "target": {"tagName": "TEXTAREA"}})["field"] is True


def test_a_dropped_file_is_not_read():
    dropped = refuse_file_drop(["Files", "text/uri-list"], 1)
    assert dropped == {"accept": False, "read": False, "files": True}
    uri = refuse_file_drop(["text/uri-list"], 0)
    assert uri["files"] is True
    assert uri["read"] is False
    plain = refuse_file_drop(["text/plain"], 0)
    assert plain["files"] is False
    assert plain["read"] is False
