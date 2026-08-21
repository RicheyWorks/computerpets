"""A tap on the guest is a choice. They pick. Then they do that sit."""

from __future__ import annotations

import inspect
import os

from computerpets_client.choice import (
    GUEST_CHOICE,
    guest_hit_pad,
    guest_marks,
    guest_pick,
    guest_tap,
    mark_ids,
    pose_flip,
    walking_cmd,
)


def test_a_tap_is_a_choice_not_a_sit():
    assert guest_tap() == "choice"
    assert guest_pick("talk") == "talk"
    assert guest_pick("feed") is None
    assert guest_pick("bath") is None
    assert "rest" in GUEST_CHOICE
    assert "walk" in GUEST_CHOICE
    assert pose_flip(True) == {"id": "sit", "label": "Sit"}
    assert pose_flip(False) == {"id": "walk", "label": "Walk"}


def test_hidden_keeps_call_back_and_a_gift_keeps_pick():
    assert mark_ids(guest_marks(walking=True)) == (
        "rest",
        "sit",
        "talk",
        "treat",
        "play",
        "special",
        "hide",
    )
    assert mark_ids(guest_marks(hidden=True)) == ("talk", "special", "call")
    assert "pick" in mark_ids(guest_marks(gifts=1))
    assert "pick" not in mark_ids(guest_marks(hidden=True, gifts=1))
    assert mark_ids(guest_marks(leaving=True)) == ("talk", "special")
    assert walking_cmd("wander") is True
    assert walking_cmd("sit") is False
    assert guest_hit_pad(phone=True) == 12
    assert guest_hit_pad(tablet=True) == 16
    assert guest_hit_pad() == 0


def test_desk_window_tap_opens_a_choice_and_rest_sleeps():
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.guide import plaque_for

    app = QApplication.instance() or QApplication([])
    window = DeskWindow()
    assert window.plaque.guide() is plaque_for("red_panda")
    window._pick_key("axolotl")
    assert window.species.key == "axolotl"
    assert window.plaque.guide().key == "axolotl"
    assert window._choice is None
    window._tap_guest()
    assert window._choice is not None
    assert mark_ids(window._choice)[0] == "rest"
    assert "talk" in mark_ids(window._choice)
    assert window.choice_bar.isVisible()
    before = window.care.energy
    window._pick_choice("rest")
    assert window._choice is None
    assert window.care.energy >= before
    assert window.pet.cmd == "sleep"
    window._tap_guest()
    window._pick_choice("walk")
    assert window.pet.cmd == "wander"
    window.close()
    del app


def test_blotter_choice_is_the_desk_law():
    src = inspect.getsource(__import__("computerpets_client.app", fromlist=["DeskWindow"]).DeskWindow)
    assert "_open_choice" in src
    assert "_pick_choice" in src
    assert "guest_tap" in src
    assert "the plaque teaches, they say the lesson" not in src
