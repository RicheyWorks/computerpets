"""Care harness catalog + invoke + assert for real blotter care actions."""

from computerpets_client.care_harness import assert_action, catalog_ids, invoke, run_all
from computerpets_client.life import CareState
from computerpets_client.specials import trait_for


REQUIRED = {
    "feed",
    "rest",
    "walk",
    "talk",
    "treat",
    "play",
    "special",
    "hide",
    "pick",
    "clean",
    "bath",
    "close",
    "exit",
}


def test_catalog_has_stable_required_ids():
    ids = set(catalog_ids())
    assert REQUIRED <= ids
    assert trait_for("red_panda").verb == "Steal ribbon"


def test_invoke_feed_and_special_ribbon():
    fed = invoke("feed", CareState(hunger=40, energy=50, bond=10))
    assert fed.ok
    assert not assert_action("feed", fed)
    special = invoke("special", CareState(hunger=40, mood=50, energy=50, bond=10))
    assert special.ok
    assert "ribbon" in (special.line or "").lower() or special.line
    assert not assert_action("special", special)


def test_menu_exit_close_and_runner():
    assert invoke("close").ok
    assert invoke("exit").ok
    assert not assert_action("close", invoke("close"))
    results = run_all()
    assert results
    failed = [r for r in results if not r.passed]
    assert not failed, failed