from computerpets_client.hive import (
    HIVE_PLACE,
    HIVE_SITTERS,
    HIVE_WORKER,
    colony_of,
    colony_word,
    comb_seats,
    hive_walkers,
    is_hive_place,
    sits_on_wax,
    stamp_colony,
)
from computerpets_client.life import CareState, apply_feed, apply_treat, keep_hive, pack_care, unpack_care
from computerpets_client.species import species_by_key


def test_wax_is_the_place():
    assert HIVE_PLACE == "honeycomb"
    assert HIVE_WORKER == "honeybee"
    assert HIVE_SITTERS == ("honeybee", "honey_queen", "honey_drone")
    assert is_hive_place("honeycomb") is True
    assert is_hive_place("honeybee") is False
    assert sits_on_wax("honeybee") is True
    assert sits_on_wax("honeycomb") is False
    assert [seat.key for seat in comb_seats()] == ["honey_queen", "honeybee", "honeybee", "honey_drone"]
    assert hive_walkers(["honeybee", "monarch", "honeycomb", "mason_bee"]) == ["monarch", "mason_bee"]


def test_brood_and_stores_are_a_reading_of_the_blotter_line():
    living = colony_of(CareState(hunger=78, health=92))
    assert living.quiet is False
    assert living.stores == 78
    assert living.brood == 7
    assert "Brood in some cells" in colony_word(living)

    named = colony_of(CareState(hunger=40, health=50, brood=3, stores=40))
    assert named.brood == 3
    assert named.stores == 40

    empty = colony_of(CareState(hunger=8, health=0, brood=0, stores=8))
    assert empty.quiet is True
    assert colony_word(empty) == "The line went quieter."

    stamped = stamp_colony(CareState(hunger=78, health=92, mood=74))
    assert stamped["brood"] == 7
    assert stamped["stores"] == 78


def test_the_blotter_stamps_comb_and_can_go_quieter():
    wax = species_by_key("honeycomb")
    rui = species_by_key("red_panda")
    stamped = keep_hive(CareState(hunger=78, health=92), wax)
    assert stamped.brood == 7
    assert stamped.stores == 78
    dog = keep_hive(CareState(hunger=40, health=50, brood=3, stores=40), rui)
    assert dog.brood is None
    assert dog.stores is None

    spent = CareState(hunger=8, health=0, brood=0, stores=8)
    assert spent.vitals(key="honeycomb") == "The line went quieter."
    assert "quieter" not in spent.vitals(key="dog")

    fed = apply_feed(stamped, wax)
    assert fed.state.stores is not None
    assert fed.state.stores == fed.state.hunger
    assert fed.state.stores > 78 or fed.state.hunger > 78

    snack = apply_treat(stamped, wax)
    assert snack.state.stores == snack.state.hunger
    assert snack.line == "Nectar of a store. I do not bite."


def test_hive_line_survives_the_packed_blotter():
    packed = pack_care(keep_hive(CareState(hunger=78, health=92), species_by_key("honeycomb")))
    assert packed["brood"] == 7
    assert packed["stores"] == 78
    restored = unpack_care(packed)
    assert restored is not None
    assert restored.brood == 7
    assert restored.stores == 78

    dog = pack_care(CareState(hunger=40, health=50))
    assert "brood" not in dog
    assert "stores" not in dog
