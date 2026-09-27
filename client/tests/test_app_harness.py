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
    "ethogram.catalog_all",
    "cry.prefersHouseCry.parse",
    "cry.catalog_wavs",
    "cry.playback",
    "species.portraits",
    "gift.leave",
    "gift.pick",
    "gift.place",
    "desk.weather",
    "desk.plates",
    "desk.news.urls",
    "desk.market.urls",
    "desk.weather.resolve",
    "desk.news.resolve",
    "desk.market.resolve",
    "desk.nft.resolve",
    "desk.favorites.news",
    "desk.favorites.market",
    "desk.favorites.weather",
    "desk.news.topics",
    "desk.plates.style",
    "desk.plants.place",
    "desk.windows.perch",
    "desk.presence",
    "desk.market.tickers",
    "desk.news.x",
    "desk.weather.replay",
    "desk.news.replay",
    "desk.market.replay",
    "desk.nft.replay",
    "desk.gpu.replay",
    "desk.links.open",
    "cry.decode",
    "visit.todays",
    "visit.phases",
    "visit.call",
    "visit.arrive",
    "card.collapse_hook",
    "card.open_hook",
    "card.paint_wire",
    "card.notify_open",
    "card.needs_persist",
    "card.speak_opts",
    "card.volume_mutes",
    "card.listener",
    "card.house_server",
    "gui.choice_close_exit",
    "web.guest_choice",
    "web.ethogram_tricks",
    "web.demo_room",
    "blotter.hours",
    "blotter.hive",
    "blotter.guide",
    "blotter.classroom",
    "blotter.return_memory",
    "blotter.gait",
    "blotter.play",
    "blotter.weather",
    "blotter.rail",
    "blotter.frames",
}


def test_domains_are_the_real_house_surfaces():
    assert domains() == DOMAINS
    assert set(domains()) == {"care", "guest", "visit", "species", "ethogram", "cry", "gift", "desk", "card", "web", "blotter", "gui"}


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
    # Live network and full GUI paint stay holes; narrower smokes are driven instead.
    assert "live.market_quote" in hole_ids
    assert "live.weather_forecast" in hole_ids
    assert "live.news_rss" in hole_ids
    assert "live.nft_floor" in hole_ids
    assert "live.gpu_sense" in hole_ids
    assert "card.gpu" not in hole_ids
    assert "card.listener" not in hole_ids
    assert "live.cry_playback" in hole_ids
    assert "gui.overlay_paint" in hole_ids
    assert "gui.card_hud_paint" in hole_ids
    assert "gui.gift_drag_place" in hole_ids
    assert "gui.host_place" in hole_ids
    assert "gui.blotter_qt" in hole_ids
    assert "ethogram.tricks.red_panda" in hole_ids
    assert "blotter.plaque" in hole_ids
    assert "blotter.frames_paint" in hole_ids
    assert "blotter.scene" in hole_ids
    # Dragon tricks files exist under house/alias stems (relay-/fuse-/earth-tricks.js);
    # they are driven via ethogram.catalog_all alias resolution — not excluded holes.
    assert "ethogram.tricks.relay_dragon" not in hole_ids
    assert "ethogram.tricks.fuse_dragon" not in hole_ids
    assert "ethogram.tricks.ground_dragon" not in hole_ids
    # Sample-only acts/wav rows retired — catalog-wide invariants replace them.
    driven_now = set(catalog_ids())
    assert "ethogram.catalog_all" in driven_now
    assert "cry.catalog_wavs" in driven_now
    assert "species.portraits" in driven_now
    assert "ethogram.acts.red_panda" not in driven_now
    assert "cry.wav.red_panda" not in driven_now
    # These moved from gaps to driven.
    driven_ids = set(catalog_ids())
    assert "cry.playback" in driven_ids
    assert "desk.weather.resolve" in driven_ids
    assert "gift.place" in driven_ids
    assert "gui.choice_close_exit" in driven_ids
    assert "desk.favorites.news" in driven_ids
    assert "desk.favorites.market" in driven_ids
    assert "desk.favorites.weather" in driven_ids
    assert "desk.news.topics" in driven_ids
    assert "desk.plates.style" in driven_ids
    assert "desk.plants.place" in driven_ids
    assert "desk.windows.perch" in driven_ids
    assert "desk.presence" in driven_ids
    assert "card.notify_open" in driven_ids
    assert "card.needs_persist" in driven_ids
    assert "card.speak_opts" in driven_ids
    assert "card.volume_mutes" in driven_ids
    assert "card.listener" in driven_ids
    assert "card.house_server" in driven_ids
    assert "desk.market.tickers" in driven_ids
    assert "desk.news.x" in driven_ids
    assert "visit.todays" in driven_ids
    assert "visit.call" in driven_ids
    assert "cry.playback" not in hole_ids
    assert "desk.weather.resolve" not in hole_ids
    assert "desk.favorites.news" not in hole_ids
    assert "card.notify_open" not in hole_ids
    results = run_all()
    skipped = {r.action_id for r in results if r.fate == "excluded"}
    assert hole_ids <= skipped
    # Default run_all does not promote --live HTTP rows.
    live_skipped = [r for r in results if r.action_id.startswith("live.") and r.fate == "excluded"]
    assert len(live_skipped) >= 4


def test_recorded_feed_replays_drive_read_parse_and_paint():
    from computerpets_client.app_harness import GPU_REPLAYS

    hole_ids = {row.id for row in gaps()}
    for aid in ("desk.weather.replay", "desk.news.replay", "desk.market.replay", "desk.nft.replay", "desk.gpu.replay"):
        assert aid not in hole_ids
        result = invoke(aid)
        assert result.ok, (aid, result.error)
        assert result.trace, aid
    weather = invoke("desk.weather.replay")
    # The saved forecast is WMO 3 now and for two days, then WMO 51.
    assert weather.extras["plate"] == "Seattle · Overcast · 8°"
    assert "2026-09-27 · overcast · 17°" in weather.extras["body"]
    assert "2026-09-29 · drizzle · 15°" in weather.extras["body"]
    assert "Clear" not in weather.extras["plate"]
    assert weather.extras["wmo"] == [
        "0=Clear", "1=Mostly clear", "2=Partly cloudy", "3=Overcast", "45=Fog", "61=Rain", "71=Snow", "95=Thunderstorm",
    ]
    assert "Seattle · unread" in " ".join(weather.trace)
    # Every plate paints feed words as text: no innerHTML write, no element from a hostile title.
    for aid in ("desk.weather.replay", "desk.news.replay", "desk.market.replay", "desk.nft.replay"):
        assert invoke(aid).extras["sinks"] == 0, aid
    assert invoke("desk.news.replay").extras["hostile"] == "letters"
    market = invoke("desk.market.replay")
    assert market.extras["plate"] == "ETH · 2708.39"
    assert market.extras["stockPlate"] == "AAPL · 341.07"
    assert invoke("desk.nft.replay").extras["shown"] == "CryptoPunks. Floor $91246.00. CoinGecko."
    gpu = invoke("desk.gpu.replay")
    for name, _platform, line in GPU_REPLAYS:
        assert gpu.extras["py"][name] == line
        assert gpu.extras["desk"][name] == line
    # The live rows stay excluded; replay is not a live call.
    for aid in ("live.weather_forecast", "live.news_rss", "live.market_quote", "live.nft_floor", "live.gpu_sense"):
        assert aid in hole_ids


def test_painted_links_open_in_the_browser_and_never_in_the_overlay():
    result = invoke("desk.links.open")
    assert result.ok, result.error
    # 3 Popular RSS links, 2 Wikipedia pages, 1 https link from the hostile item.
    assert result.extras["painted"] == result.extras["opened"] == 6
    assert result.extras["refused"] >= 12
    assert result.extras["windows"] == 0
    assert result.extras["navigated"] == 0
    assert "answers=deny" in " ".join(result.trace)


def test_replay_fixtures_are_small_and_hold_no_secrets():
    from computerpets_client.app_harness import _replay_dir

    folder = _replay_dir()
    files = sorted(p for p in folder.iterdir() if p.is_file())
    names = {p.name for p in files}
    assert "README.md" in names
    assert {"forecast-seattle.json", "news-popular.rss", "news-topic-red-pandas.rss", "news-featured.json",
            "gecko-simple-price.json", "yahoo-aapl.json", "nft-cryptopunks.json", "gpu-win-nvidia.txt",
            "gpu-win-two-adapters.txt"} <= names
    # The two-adapter counters are listed as built by hand, not recorded.
    readme = (folder / "README.md").read_text(encoding="utf-8")
    built = readme.split("Built by hand, not recorded:", 1)[1]
    assert "`gpu-win-two-adapters.txt`" in built
    secret = ("api_key", "apikey", "x-cg-", "x_cg_", "authorization", "bearer ", "cookie", "secret", "password")
    for path in files:
        assert path.stat().st_size < 8 * 1024, path.name
        if path.name == "README.md":
            continue
        low = path.read_text(encoding="utf-8").lower()
        for word in secret:
            assert word not in low, (path.name, word)
    # The no-Solana rule: the saved price list has no Solana entry, and the replay shows … for it.
    assert "solana" not in (folder / "gecko-simple-price.json").read_text(encoding="utf-8")


def test_cry_decode_reads_every_house_cry_without_speakers():
    from computerpets_client.app_harness import KNOWN_SILENT_CRIES, _prefers_house_cry_keys

    result = invoke("cry.decode")
    assert result.ok, result.error
    assert result.extras["decoded"] == result.extras["n"] == len(_prefers_house_cry_keys())
    # Silent files are named, never hidden. Each one listed must still be silent.
    assert set(result.extras["known_silent"]) == set(KNOWN_SILENT_CRIES)
    # garter.wav was the one hole (all zeros); it is re-exported, so nothing is silent now.
    assert KNOWN_SILENT_CRIES == {}
    assert result.extras["known_silent"] == []
    assert "known_silent=none" in result.trace
    assert "garter" not in result.extras["quiet"]
    # 220 of 221 guests have a house cry; only crocodile (Jaw) has no legal field tape.
    assert result.extras["n"] == 220
    assert "prefersHouseCry=220" in result.trace
    assert "crocodile" not in _prefers_house_cry_keys()
    assert "live.cry_playback" in {row.id for row in gaps()}


def test_bare_care_id_still_resolves():
    fed = invoke("feed")
    assert fed.ok
    assert fed.action_id == "care.feed"


def test_offline_resolves_and_playback_leave_traces():
    for aid in (
        "cry.playback",
        "desk.weather.resolve",
        "desk.news.resolve",
        "desk.market.resolve",
        "desk.nft.resolve",
        "desk.favorites.news",
        "desk.favorites.market",
        "desk.favorites.weather",
        "desk.news.topics",
        "desk.plates.style",
        "desk.plants.place",
        "desk.windows.perch",
        "desk.presence",
        "desk.market.tickers",
        "desk.news.x",
        "visit.todays",
        "visit.phases",
        "visit.call",
        "visit.arrive",
        "gift.place",
        "card.paint_wire",
        "card.notify_open",
        "card.needs_persist",
        "card.speak_opts",
        "card.volume_mutes",
        "card.listener",
        "card.house_server",
    "card.house_server",
        "gui.choice_close_exit",
        "web.guest_choice",
        "web.ethogram_tricks",
        "web.demo_room",
        "blotter.hours",
        "blotter.hive",
        "blotter.guide",
        "blotter.classroom",
        "blotter.return_memory",
        "blotter.gait",
        "blotter.play",
        "blotter.weather",
        "blotter.rail",
        "blotter.frames",
    ):
        result = invoke(aid)
        assert result.ok, (aid, result.error, result.detail)
        assert result.trace, aid


def test_gui_mode_rows_stay_excluded_by_default_and_document_gui_flag():
    holes = {row.id: row for row in gaps()}
    gui_ids = (
        "gui.overlay_paint",
        "gui.card_hud_paint",
        "gui.gift_drag_place",
        "gui.host_place",
        "gui.blotter_qt",
        "blotter.plaque",
        "blotter.frames_paint",
        "blotter.scene",
    )
    for aid in gui_ids:
        assert aid in holes
        assert holes[aid].mode == "gui"
        assert "--gui" in (holes[aid].exclude_reason or "")
    results = run_all()
    skipped = {r.action_id for r in results if r.fate == "excluded"}
    assert set(gui_ids) <= skipped
    gui_skipped = [
        r for r in results
        if r.action_id.startswith("gui.") and r.action_id != "gui.choice_close_exit" and r.fate == "excluded"
    ]
    assert len(gui_skipped) >= 5




def test_tricks_alias_resolution_dragons():
    """relay/fuse/ground dragons resolve via house stems; Rui stays excluded-only."""
    from computerpets_client.app_harness import NO_TRICKS_KEYS, _tricks_path

    assert NO_TRICKS_KEYS == frozenset({"red_panda"})
    relay = _tricks_path("relay_dragon")
    fuse = _tricks_path("fuse_dragon")
    ground = _tricks_path("ground_dragon")
    assert relay is not None and relay.name == "relay-tricks.js"
    assert fuse is not None and fuse.name == "fuse-tricks.js"
    assert ground is not None and ground.name == "earth-tricks.js"
    # Registry must never win for ground_dragon.
    assert ground.name != "ground-tricks.js"
    # Rui may resolve on disk (rui-tricks.js) but stays a gaps exclusion by design.
    assert "red_panda" in NO_TRICKS_KEYS


def test_catalog_wide_ethogram_cry_portraits():
    """House-wide invariants — every catalog key / prefersHouseCry key, not samples."""
    eth = invoke("ethogram.catalog_all")
    assert eth.ok, (eth.error, eth.extras)
    assert int(eth.extras.get("n") or 0) >= 1
    assert not eth.extras.get("missing")
    assert not eth.extras.get("thin")
    assert not eth.extras.get("broken")
    assert not eth.extras.get("unexpected_missing_tricks")
    # All catalog keys except Rui-excluded gap have a parseable tricks file.
    assert int(eth.extras.get("tricks_ok") or 0) >= 220
    for key in ("relay_dragon", "fuse_dragon", "ground_dragon"):
        one = invoke(f"ethogram.tricks.{key}")
        assert one.ok, (key, one.error, one.detail)

    cry = invoke("cry.catalog_wavs")
    assert cry.ok, (cry.error, cry.extras)
    assert not cry.extras.get("missing")
    assert int(cry.extras.get("n") or 0) >= 1

    portraits = invoke("species.portraits")
    assert portraits.ok, (portraits.error, portraits.extras)
    assert not portraits.extras.get("missing")
    assert int(portraits.extras.get("n") or 0) >= 1


def test_web_companion_lockstep():
    """Web guest-choice.ts, ethogram/tricks TS catalog lockstep, demo room — not desktop-only."""
    guest = invoke("web.guest_choice")
    assert guest.ok, (guest.error, guest.detail)
    assert guest.trace
    marks = guest.extras.get("marks") or []
    assert list(marks)[-2:] == ["close", "exit"]

    eth = invoke("web.ethogram_tricks")
    assert eth.ok, (eth.error, eth.extras)
    assert int(eth.extras.get("n") or 0) >= 1
    assert int(eth.extras.get("ethogram_ts") or 0) == int(eth.extras.get("n") or 0)
    assert int(eth.extras.get("matched") or 0) >= 220
    assert not eth.extras.get("missing_eth")
    assert not eth.extras.get("missing_web")
    assert not eth.extras.get("missing_desk")
    assert not eth.extras.get("drift")

    demo = invoke("web.demo_room")
    assert demo.ok, (demo.error, demo.detail)
    assert demo.trace


def test_blotter_pure_surfaces():
    """Aggregated blotter domain: pure Python + desktop lockstep; Qt stays gaps offline."""
    ids = set(catalog_ids(domain="blotter"))
    driven = {
        "blotter.hours",
        "blotter.hive",
        "blotter.guide",
        "blotter.classroom",
        "blotter.return_memory",
        "blotter.gait",
        "blotter.play",
        "blotter.weather",
        "blotter.rail",
        "blotter.frames",
    }
    assert driven <= ids
    for aid in ("blotter.plaque", "blotter.frames_paint", "blotter.scene"):
        assert aid in ids
    holes = {row.id: row for row in gaps() if row.domain == "blotter"}
    assert set(holes) == {"blotter.plaque", "blotter.frames_paint", "blotter.scene"}
    for row in holes.values():
        assert row.mode == "gui"
        assert "--gui" in (row.exclude_reason or "")

    results = run_domain("blotter")
    failed = [r for r in results if not r.passed]
    assert not failed, failed
    driven_ok = [r for r in results if r.fate == "driven" and r.passed]
    assert len(driven_ok) == 10
    skipped = {r.action_id for r in results if r.fate == "excluded"}
    assert skipped == {"blotter.plaque", "blotter.frames_paint", "blotter.scene"}

    hours = invoke("blotter.hours")
    assert hours.ok and hours.trace
    assert int(hours.extras.get("rest") or 0) == 221
    assert int(hours.extras.get("rest_lockstep") or 0) == 221
    assert not hours.extras.get("rest_drift")
    assert not hours.extras.get("rest_missing")
    assert not hours.extras.get("rest_triple")
    assert "python+web" in str(hours.extras.get("day_part_peers") or "")
    hive = invoke("blotter.hive")
    assert hive.ok and hive.extras.get("place") == "honeycomb"
    guide = invoke("blotter.guide")
    assert guide.ok and int(guide.extras.get("n") or 0) == 221
    classroom = invoke("blotter.classroom")
    assert classroom.ok and classroom.trace, (classroom.error, classroom.detail)
    assert int(classroom.extras.get("n") or 0) == 221
    assert int(classroom.extras.get("matched") or 0) == 221
    assert classroom.extras.get("desktop_classroom") is False
    assert len(classroom.extras.get("rooms") or {}) == 20
    ret = invoke("blotter.return_memory")
    assert ret.ok and ret.trace, (ret.error, ret.detail)
    assert int(ret.extras.get("thresholds") or 0) == 7
    assert ret.extras.get("desktop_return") is False
    frames = invoke("blotter.frames")
    assert frames.extras.get("anims") == ["idle", "walk", "sit", "eat", "sleep", "play"]


def test_blotter_qt_slices_under_gui_optin():
    """--gui promotes blotter.plaque / frames_paint / scene from shared app --check traces."""
    from computerpets_client import app_harness as ah

    # Reset cached bundle so this test owns one --check run.
    ah._blotter_qt_bundle = None
    results = ah.run_domain(
        "blotter",
        only=["blotter.plaque", "blotter.frames_paint", "blotter.scene"],
        gui=True,
    )
    by_id = {r.action_id: r for r in results}
    assert set(by_id) == {"blotter.plaque", "blotter.frames_paint", "blotter.scene"}
    for aid, row in by_id.items():
        assert row.fate == "driven", (aid, row.fate, row.failures, row.detail)
        assert row.passed, (aid, row.failures, row.detail)

    # Default offline still excludes them (catalog fate unchanged).
    offline = ah.run_domain("blotter")
    skipped = {r.action_id for r in offline if r.fate == "excluded"}
    assert {"blotter.plaque", "blotter.frames_paint", "blotter.scene"} <= skipped

    # Each id leaves a distinct observable assert from the shared bundle.
    ah._blotter_qt_bundle = None
    plaque = ah._invoke_blotter_gui_slice("plaque")
    frames = ah._invoke_blotter_gui_slice("frames_paint")
    scene = ah._invoke_blotter_gui_slice("scene")
    assert plaque.ok and any("species plaque" in t.lower() for t in plaque.trace), plaque.trace
    assert frames.ok and any("frames painted" in t.lower() and "pixmap" in t.lower() for t in frames.trace), frames.trace
    assert scene.ok and any("graphics scene" in t.lower() for t in scene.trace), scene.trace
    assert any("weather=" in t.lower() and "day=" in t.lower() for t in scene.trace), scene.trace
    assert any("QGraphicsView" in t for t in scene.trace), scene.trace
