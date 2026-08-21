"""The blotter keeps the same ribbon chase as the desk and the overlay."""

from __future__ import annotations

import inspect
import os
from pathlib import Path

from computerpets_client.life import CareState, apply_play
from computerpets_client.play import (
    BUG_LINE,
    CATCH_LINE,
    FLEE_MS,
    RIBBON_LINE,
    PlayChase,
    play_chase,
    play_claim,
    play_hop,
)
from computerpets_client.species import RUI


def lure_seek() -> PlayChase:
    return PlayChase(taken=False, cmd="seek", mark="lure")


def test_one_lure_chase_finishes_play_once_catch_then_arrive_does_not_double():
    same = play_hop(lure_seek(), "catch")
    assert same.act == "play"
    assert same.apply_play == 1
    assert same.issue_play == 1
    assert play_claim("arrive", PlayChase(taken=True, cmd="seek", mark=None)) == "none"
    assert play_claim("arrive", PlayChase(taken=True, cmd="seek", mark="lure")) == "none"

    local = play_chase(("catch", "arrive"), lure_seek())
    assert local.acts == ("play", "idle")
    assert local.apply_play == 1
    assert local.persist_play == 0
    assert local.issue_play == 1
    assert local.taken is True
    assert local.mark is None
    assert local.cmd == "idle"

    remote = play_chase(("catch", "arrive"), lure_seek(), True)
    assert remote.acts == ("play", "idle")
    assert remote.apply_play == 0
    assert remote.persist_play == 1
    assert remote.issue_play == 1

    start = CareState(mood=40, bond=10, hunger=70, energy=70)
    once = apply_play(start, RUI)
    twice = apply_play(once.state, RUI)
    assert twice.state.mood > once.state.mood
    assert twice.state.bond > once.state.bond
    assert local.apply_play == 1
    assert once.state.mood == apply_play(start, RUI).state.mood


def test_arrive_then_catch_is_the_same_hop_not_a_second_play():
    local = play_chase(("arrive", "catch"), lure_seek())
    assert local.acts == ("play", "none")
    assert local.apply_play == 1
    assert local.persist_play == 0
    assert local.issue_play == 1

    remote = play_chase(("arrive", "catch"), lure_seek(), True)
    assert remote.acts == ("play", "none")
    assert remote.apply_play == 0
    assert remote.persist_play == 1
    assert remote.issue_play == 1

    assert play_claim("catch", PlayChase(taken=True, cmd="seek", mark="lure")) == "none"
    assert play_claim("arrive", PlayChase(taken=True, cmd="seek", mark="lure")) == "none"


def test_treat_seek_still_snacks_hide_still_hides_a_catch_is_not_a_snack():
    treat = play_chase(("arrive",), PlayChase(taken=False, cmd="seek", mark="treat"))
    assert treat.acts == ("snack",)
    assert treat.apply_play == 0
    assert treat.issue_play == 0
    assert treat.issue_eat == 1
    assert treat.cmd == "eat"

    assert play_claim("catch", PlayChase(taken=False, cmd="seek", mark="treat")) == "none"
    assert play_claim("arrive", PlayChase(taken=False, cmd="leave", mark=None)) == "hide"
    assert play_claim("arrive", PlayChase(taken=False, cmd="play", mark=None)) == "idle"


def test_house_chase_lines_match_the_desk():
    assert CATCH_LINE == "You caught it first. I still win."
    assert RIBBON_LINE == "A ribbon. Catch it."
    assert BUG_LINE == "There. A bug."
    assert FLEE_MS == 2200


def test_play_module_is_the_house_chase():
    src = Path(__file__).resolve().parents[1] / "computerpets_client" / "play.py"
    text = src.read_text(encoding="utf-8")
    assert "play_claim" in text
    assert "play_hop" in text
    assert "play_chase" in text
    assert 'via == "catch"' in text
    assert "one hop" in text.lower() or "One hop" in text


def test_blotter_play_drops_a_ribbon_and_does_not_apply_until_the_catch(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    mood = window.care.mood
    hunger = window.care.hunger
    window._play()
    assert window.lure is not None
    assert window._mark == "lure"
    assert window.pet.cmd == "seek"
    assert window.pet.target is not None
    assert window.care.mood == mood
    assert window.care.hunger == hunger
    assert window.care.last_line == RIBBON_LINE
    assert window._lure_timer.isActive()
    window.close()
    del app


def test_catch_then_arrive_is_one_hop_on_the_wood(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    start = CareState(
        hunger=window.care.hunger,
        mood=window.care.mood,
        energy=window.care.energy,
        bond=window.care.bond,
    )
    window._play()
    window._catch_lure()
    played = apply_play(start, RUI)
    assert window.care.mood == played.state.mood
    assert window.care.bond == played.state.bond
    assert window.care.hunger == played.state.hunger
    assert window.care.energy == played.state.energy
    assert window.pet.cmd == "play"
    assert window.pet.anim == "play"
    assert window.lure is None
    assert window.care.last_line == CATCH_LINE
    window._on_arrived()
    assert window.care.mood == played.state.mood
    assert window.care.bond == played.state.bond
    window.close()
    del app


def test_arrive_then_catch_is_one_hop_on_the_wood(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    start = CareState(
        hunger=window.care.hunger,
        mood=window.care.mood,
        energy=window.care.energy,
        bond=window.care.bond,
    )
    window._play()
    window.pet.cmd = "seek"
    window._on_arrived()
    played = apply_play(start, RUI)
    assert window.care.mood == played.state.mood
    assert window.pet.cmd == "play"
    assert window.lure is None
    window._catch_lure()
    assert window.care.mood == played.state.mood
    assert window.care.bond == played.state.bond
    window.close()
    del app


def test_fox_play_asks_for_a_bug(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window._pick_key("fox")
    window._play()
    assert window.care.last_line == BUG_LINE
    assert window.lure is not None
    assert window.pet.cmd == "seek"
    window.close()
    del app


def test_ribbon_flees_once_then_stays(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window._play()
    first = window.lure.x()
    window._flee_lure()
    assert window.lure is not None
    assert window._lure_hops == 1
    assert window.pet.cmd == "seek"
    assert window._mark == "lure"
    assert not window._lure_timer.isActive()
    hopped = window.lure.x()
    window._flee_lure()
    assert window.lure.x() == hopped
    assert isinstance(first, float)
    window.close()
    del app


def test_treat_seek_snacks_when_they_get_there(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.life import apply_treat

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    start = CareState(
        hunger=window.care.hunger,
        mood=window.care.mood,
        energy=window.care.energy,
        bond=window.care.bond,
    )
    window._treat()
    assert window.treat is not None
    assert window._mark == "treat"
    assert window.pet.cmd == "seek"
    assert window.care.hunger == start.hunger
    assert window.care.mood == start.mood
    assert window.care.bond == start.bond
    window._on_arrived()
    snacked = apply_treat(start, RUI)
    assert window.care.hunger == snacked.state.hunger
    assert window.care.mood == snacked.state.mood
    assert window.care.bond == snacked.state.bond
    assert window.pet.cmd == "eat"
    assert window.treat is None
    assert window.care.last_line in RUI.treat_lines
    window.close()
    del app


def test_hide_is_a_leave_until_they_walk_off(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.hours import hide_line

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window._hide_or_call()
    line = hide_line(window.species.key)
    assert window.care.hidden is False
    assert window.pet.cmd == "leave"
    assert window.care.last_line == line
    assert window.bubble.toPlainText() == line
    window._play()
    assert window.lure is None
    window._treat()
    assert window.treat is None
    window._on_arrived()
    assert window.care.hidden is True
    assert window.hide_btn.text() == "Call back"
    window._play()
    assert window.lure is None
    assert window._mark is None
    window.close()
    del app


def test_leave_walk_hides_when_they_reach_the_edge(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window._hide_or_call()
    assert window.pet.cmd == "leave"
    assert window.care.hidden is False
    for _ in range(800):
        window.pet.advance_pet(0.05, window.care, 960)
        if window.care.hidden:
            break
    assert window.care.hidden is True
    assert window.hide_btn.text() == "Call back"
    window.close()
    del app


def test_treat_and_hide_write_the_file_when_they_arrive(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.life import load_care
    from computerpets_client.species import DEFAULT_SPECIES_KEY

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    hunger = window.care.hunger
    window._treat()
    disk = load_care(user_data_dir=tmp_path, key=DEFAULT_SPECIES_KEY)
    assert disk is not None
    assert disk.hunger == hunger
    assert disk.hidden is False
    window._on_arrived()
    disk = load_care(user_data_dir=tmp_path, key=DEFAULT_SPECIES_KEY)
    assert disk.hunger == hunger + 12
    window._hide_or_call()
    disk = load_care(user_data_dir=tmp_path, key=DEFAULT_SPECIES_KEY)
    assert disk.hidden is False
    window._on_arrived()
    disk = load_care(user_data_dir=tmp_path, key=DEFAULT_SPECIES_KEY)
    assert disk.hidden is True
    window.close()
    again = DeskWindow(user_data_dir=tmp_path)
    again.show()
    assert again.care.hidden is True
    again.close()
    del app


def test_hidden_play_does_not_drop_a_ribbon(tmp_path):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window._hide_or_call()
    window._on_arrived()
    assert window.care.hidden is True
    window._play()
    assert window.lure is None
    assert window._mark is None
    window.close()
    del app


def test_window_claims_play_once_catch_and_flee_stay():
    from computerpets_client import app as app_mod
    from computerpets_client import pet_item

    room = inspect.getsource(app_mod.DeskWindow)
    assert "_catch_lure" in room
    assert "_flee_lure" in room
    assert "_on_arrived" in room
    assert "play_hop" in room
    assert '"catch"' in room
    assert '"arrive"' in room
    assert "issue(\"play\")" in room or "issue('play')" in room
    assert room.count("issue(\"play\")") + room.count("issue('play')") == 2
    assert 'issue("leave")' in room or "issue('leave')" in room
    assert "apply_treat" in room
    treat_fn = inspect.getsource(app_mod.DeskWindow._treat)
    arrived_fn = inspect.getsource(app_mod.DeskWindow._on_arrived)
    hide_fn = inspect.getsource(app_mod.DeskWindow._hide_or_call)
    assert "apply_treat" not in treat_fn
    assert "apply_treat" in arrived_fn
    assert "apply_hide" in arrived_fn
    assert "apply_hide" not in hide_fn
    pet = inspect.getsource(pet_item.LivingPetItem)
    assert "arrived" in pet
    assert 'cmd == "play"' in pet or 'cmd == "play"' in inspect.getsource(pet_item.LivingPetItem.issue)
    assert "cmd = \"wander\"" not in inspect.getsource(pet_item.LivingPetItem.issue)
    assert '"leave"' in pet
    assert "arrived.emit" in pet
