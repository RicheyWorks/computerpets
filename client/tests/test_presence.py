"""Presence does not open keeper files. Drops are not gifts."""

from computerpets_client.presence import (
    allow_navigation,
    allow_permission,
    host_path_label,
    house_file,
    list_host_folder,
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


def test_a_dropped_file_is_not_read():
    dropped = refuse_file_drop(["Files", "text/uri-list"], 1)
    assert dropped == {"accept": False, "read": False, "files": True}
    uri = refuse_file_drop(["text/uri-list"], 0)
    assert uri["files"] is True
    assert uri["read"] is False
    plain = refuse_file_drop(["text/plain"], 0)
    assert plain["files"] is False
    assert plain["read"] is False
