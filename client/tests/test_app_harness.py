"""App inspect harness: catalog + run_all across house domains. Care stays 18/18."""

from computerpets_client.app_harness import (
    DOMAINS,
    accounting,
    catalog,
    catalog_ids,
    domains,
    gaps,
    invoke,
    run_all,
    run_domain,
)
from computerpets_client.care_harness import catalog_ids as care_ids


CARE_REQUIRED = {
    "care.feed",
    "care.rest",
    "care.walk",
    "care.talk",
    "care.treat",
    "care.play",
    "care.special",
    "care.hide",
    "care.pick",
    "care.clean",
    "care.bath",
    "care.close",
    "care.exit",
}

CROSS_DOMAIN = {
    "guest.tap",
    "guest.marks",
    "guest.close",
    "guest.exit",
    "species.catalog",
    "species.lookup",
    "ethogram.acts.red_panda",
    "cry.prefersHouseCry.parse",
    "gift.leave",
    "gift.pick",
    "desk.weather",
    "desk.plates",
    "desk.news.urls",
    "desk.market.urls",
    "card.collapse_hook",
    "card.open_hook",
}


def test_domains_are_the_real_house_surfaces():
    assert domains() == DOMAINS
    assert set(domains()) == {"care", "guest", "species", "ethogram", "cry", "gift", "desk", "card"}


def test_catalog_has_stable_ids_and_grows_without_a_frozen_total():
    ids = set(catalog_ids())
    assert CARE_REQUIRED <= ids
    assert CROSS_DOMAIN <= ids
    # Care catalog is the existing 18, wrapped not replaced.
    assert tuple(f"care.{i}" for i in care_ids()) == catalog_ids(domain="care")
    assert len(catalog_ids(domain="care")) == 18
    # Guest marks include the real close/exit dismiss pair.
    guest = set(catalog_ids(domain="guest"))
    assert {"guest.close", "guest.exit", "guest.marks"} <= guest
    assert "guest.feed" not in guest
    # Every catalog row names a real domain and a handler.
    for row in catalog():
        assert row.domain in DOMAINS
        assert row.handler
        if row.fate == "excluded":
            assert row.exclude_reason


def test_care_run_domain_is_still_eighteen_of_eighteen():
    results = run_domain("care")
    assert len(results) == 18
    failed = [r for r in results if not r.passed]
    assert not failed, failed
    assert all(r.fate == "driven" for r in results)


def test_guest_close_exit_marks_and_no_invented_verbs():
    marks = invoke("guest.marks")
    assert marks.ok
    ids = tuple(marks.extras["marks"])
    assert ids[-2:] == ("close", "exit")
    assert "feed" not in ids
    assert invoke("guest.close").ok
    assert invoke("guest.exit").ok
    assert invoke("guest.tap").extras["tap"] == "choice"
    bogus = invoke("guest.feed")
    assert not bogus.ok


def test_run_all_accounting_identity_and_new_domains():
    results = run_all()
    assert results
    ledger = accounting(results, discovered=len(results))
    assert ledger.holds(), ledger
    assert ledger.unaccounted == 0
    assert ledger.failed == 0
    assert ledger.driven >= 18
    assert ledger.excluded >= 1
    failed = [r for r in results if not r.passed]
    assert not failed, failed
    by_domain = {name: [r for r in results if r.domain == name] for name in DOMAINS}
    for name in DOMAINS:
        assert by_domain[name], name
    care_driven = [r for r in by_domain["care"] if r.fate == "driven" and r.passed]
    assert len(care_driven) == 18


def test_gaps_are_honest_and_accounted():
    hole_ids = {row.id for row in gaps()}
    assert hole_ids
    for row in gaps():
        assert row.fate == "excluded"
        assert row.exclude_reason
    # Live network and GUI paint are holes, not silent passes.
    assert "live.market_quote" in hole_ids
    assert "gui.overlay_paint" in hole_ids
    assert "gui.card_hud_paint" in hole_ids
    results = run_all()
    skipped = {r.action_id for r in results if r.fate == "excluded"}
    assert hole_ids <= skipped


def test_bare_care_id_still_resolves():
    fed = invoke("feed")
    assert fed.ok
    assert fed.action_id == "care.feed"
