"""Presence does not open keeper files. Drops are not gifts."""

from computerpets_client.presence import (
    allow_navigation,
    allow_permission,
    classify_key,
    host_path_label,
    house_file,
    list_host_folder,
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
    assert allow_navigation("file:///home/keeper/homework.html") is False
    assert allow_navigation("https://evil.example") is False
    assert allow_permission("geolocation") is True
    assert allow_permission("clipboard-read") is False
    assert allow_permission("display-capture") is False
    assert allow_permission("fileSystem") is False


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
