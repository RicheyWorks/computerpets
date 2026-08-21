"""They leave a gift on the wood. Shed is not the only one."""

from computerpets_client.gift import GIFT_LINE, gift_line, leave_gift, pick_gift
from computerpets_client.life import CareState, decay, load_care, pack_care, save_care, unpack_care
from computerpets_client.shed import Coat
from computerpets_client.specials import apply_special
from computerpets_client.species import CATALOG_KEYS, RUI, species_by_key


def test_gift_lines_are_the_house_copy():
    assert len(GIFT_LINE) == 210
    assert set(GIFT_LINE) == set(CATALOG_KEYS)
    assert gift_line("red_panda") == "A ribbon I was not using. For the desk."
    assert gift_line("grouper") == "A fish I was finished hiding for."
    assert gift_line("not_a_pet") == "I left this."
    assert gift_line() == "I left this."


def test_known_guest_leaves_a_gift_new_does_not():
    now = 1_700
    known = leave_gift(CareState(bond=25), now=now, gift_x=22)
    assert len(known.gifts) == 1
    gift = known.gifts[0]
    assert gift.kind == "gift"
    assert gift.id == now
    assert gift.x == 22
    assert 16 <= gift.x <= 84
    fresh = leave_gift(CareState(bond=18), now=now, gift_x=22)
    assert fresh.gifts == []
    almost = leave_gift(CareState(bond=24), now=now, gift_x=22)
    assert almost.gifts == []


def test_two_gifts_is_enough():
    held = CareState(
        bond=80,
        gifts=[Coat(id=1, x=20, kind="gift"), Coat(id=2, x=40, kind="shed")],
    )
    kept = leave_gift(held, now=9, gift_x=60)
    assert len(kept.gifts) == 2
    assert [gift.id for gift in kept.gifts] == [1, 2]


def test_pick_gift_is_mood_and_bond():
    before = CareState(
        mood=50,
        bond=30,
        gifts=[Coat(id=7, x=20, kind="gift"), Coat(id=8, x=40, kind="shed")],
    )
    result = pick_gift(before, 7, "red_panda")
    assert [gift.id for gift in result.state.gifts] == [8]
    assert result.state.mood == 56
    assert result.state.bond == 32
    assert result.line == "A ribbon I was not using. For the desk."
    assert result.cmd == "sit"
    shed = pick_gift(result.state, 8, "ball_python")
    assert shed.state.gifts == []
    assert shed.line == "A shed I was finished with."


def test_decay_known_can_leave_a_gift():
    class Sure:
        def random(self):
            return 0.0

    known = decay(CareState(bond=25, hygiene=80, hunger=50, gifts=[]), 180_000, rng=Sure(), now=1_700)
    assert len(known.gifts) == 1
    assert known.gifts[0].kind == "gift"
    assert known.gifts[0].id == 1_717
    assert 14 <= known.gifts[0].x <= 86
    fresh = decay(CareState(bond=18, hygiene=80, hunger=50, gifts=[]), 180_000, rng=Sure(), now=1_700)
    assert fresh.gifts == []


def test_a_special_leaves_a_gift_when_they_are_known():
    known = apply_special(CareState(bond=25), RUI)
    gifted = leave_gift(known.state, now=9, gift_x=30)
    assert gifted.bond == 27
    assert len(gifted.gifts) == 1
    assert gifted.gifts[0].kind == "gift"
    ridge = apply_special(CareState(bond=25), species_by_key("brain_coral"))
    left = leave_gift(ridge.state, now=9, gift_x=30)
    assert len(left.gifts) == 1
    new = leave_gift(apply_special(CareState(bond=18), RUI).state, now=9, gift_x=30)
    assert new.gifts == []


def test_a_gift_survives_the_care_file(tmp_path):
    now = 1_700_000_000_000
    before = CareState(
        bond=40,
        last_tick=now,
        gifts=[Coat(id=3, x=33, kind="gift"), Coat(id=4, x=50, kind="shed")],
    )
    save_care(before, user_data_dir=tmp_path, now=now, key="red_panda")
    later = load_care(user_data_dir=tmp_path, now=now, key="red_panda")
    assert [(gift.id, gift.kind, gift.x) for gift in later.gifts] == [(3, "gift", 33.0), (4, "shed", 50.0)]
    packed = pack_care(before)
    restored = unpack_care(packed)
    assert restored is not None
    assert restored.gifts[0].kind == "gift"
    assert unpack_care({"v": 1, "gifts": [{"id": 1, "x": 20}]}).gifts[0].kind == "gift"


def test_the_blotter_paints_a_gift_and_picking_it_says_the_line(tmp_path):
    import os
    from dataclasses import replace

    import pytest

    pytest.importorskip("PyQt6")
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    from PyQt6.QtWidgets import QApplication

    from computerpets_client.app import DeskWindow
    from computerpets_client.pet_item import GiftItem
    from computerpets_client.shed import Coat

    app = QApplication.instance() or QApplication([])
    window = DeskWindow(user_data_dir=tmp_path)
    window.show()
    window.care = replace(
        window.care,
        bond=40,
        mood=50,
        gifts=[Coat(id=11, x=28, kind="gift")],
    )
    window._sync_coats()
    assert len(window.coats) == 1
    assert isinstance(window.coats[0], GiftItem)
    assert window.coats[0].coat.kind == "gift"
    window._pick_gift(11)
    assert window.care.gifts == []
    assert window.care.mood == 56
    assert window.care.bond == 42
    assert window.care.last_line == "A ribbon I was not using. For the desk."
    assert window.coats == []
    window.care = replace(window.care, bond=30, gifts=[])
    window._special()
    assert any(gift.kind == "gift" for gift in window.care.gifts)
    assert any(isinstance(item, GiftItem) for item in window.coats)
    window.close()
    del app
