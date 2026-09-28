"""App inspect harness: catalog + run_all across house domains. Care stays 18/18."""

import os

import pytest

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
    "desk.plates.first_run",
    "desk.news.replay",
    "desk.market.replay",
    "desk.nft.replay",
    "desk.gpu.replay",
    "desk.links.open",
    "desk.launch_check",
    "desk.tray.switch",
    "desk.quit",
    "desk.pictures_gate",
    "desk.market.search",
    "desk.settings.window",
    "desk.license.offline",
    "desk.tray.menu",
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
    "card.minds_blotter",
    "card.house_server",
    "card.alarm",
    "card.timer",
    "card.saved_lines",
    "card.first_run",
    "card.music",
    "card.mind",
    "gui.choice_close_exit",
    "web.guest_choice",
    "web.ethogram_tricks",
    "web.demo_room",
    "web.load_problems",
    "web.plain_reasons",
    "web.care_talk_plates",
    "web.pets_admin_music",
    "web.pets_keys_idle",
    "web.pet_keys_plates",
    "web.menu_keys_escape",
    "web.plain_words",
    "web.consent_plain",
    "web.consent_types_plain",
    "web.loop_guard_unlock_plain",
    "web.desk_guard_plain",
    "web.guest_loops_mount",
    "web.minds_flight_plain",
    "web.overlay_birds_plain",
    "web.flake_house_plain",
    "web.unlock_plain_lfs",
    "web.pictures_start_names",
    "web.portraits_tray_minds",
    "blotter.hours",
    "blotter.hive",
    "blotter.guide",
    "blotter.classroom",
    "blotter.return_memory",
    "blotter.gait",
    "blotter.play",
    "blotter.weather",
    "blotter.unlock_offline",
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
    assert "Seattle · can't reach" in " ".join(weather.trace)
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


def test_start_script_checks_node_and_pieces_without_installing():
    import shutil

    result = invoke("desk.launch_check")
    assert result.ok, result.error
    assert result.extras["script"] in {"desktop.ps1", "desktop.sh"}
    if result.extras["expect"] == "ready to start":
        assert result.extras["exit"] == 0
        assert result.extras["pieces"] in {"ready", "missing", "unfinished", "changed"}
        # The pictures line matches the file: a Git without LFS leaves text pointers.
        assert result.extras["pictures"] in {"ready", "missing", "lfs-pointers"}
        assert result.extras["pictures"] == result.extras["picturesReal"]
        assert result.extras["node"] and result.extras["node"].startswith("v")
    else:
        # No Node, an older Node, or no npm: the start stops with plain words.
        assert result.extras["exit"] != 0
    assert shutil.which("node") is None or result.extras["node"]


@pytest.mark.skipif(
    os.name == "nt",
    reason="Windows runs desktop.ps1, and this test would copy a start script into a temp folder (antivirus flags "
    "temporary scripts there). The PowerShell twin is held by web/scripts/start-here.test.mjs.",
)
def test_start_script_stops_on_git_lfs_pointers_before_installing(tmp_path):
    """A Git without LFS copies text pointers for the pet pictures. sh desktop.sh says so and stops early."""
    import shutil
    import subprocess

    from computerpets_client.app_harness import LAUNCH_PICTURE, launch_pictures_state, repo_root

    node, npm, sh = shutil.which("node"), shutil.which("npm"), shutil.which("sh")
    if not (node and npm and sh):
        pytest.skip("needs node, npm, and sh on PATH to reach the pictures check")
    major = subprocess.run([node, "-v"], capture_output=True, text=True, timeout=60).stdout.strip()
    if not major.startswith("v") or int(major[1:].split(".")[0]) < 22:
        pytest.skip(f"needs Node 22 or newer to reach the pictures check (this is {major})")
    shutil.copy(repo_root() / "desktop.sh", tmp_path / "desktop.sh")
    (tmp_path / "desktop").mkdir()
    (tmp_path / "desktop" / "package.json").write_text("{}", encoding="utf-8")
    picture = tmp_path.joinpath(*LAUNCH_PICTURE)
    picture.parent.mkdir(parents=True)
    picture.write_text("version https://git-lfs.github.com/spec/v1\noid sha256:0\nsize 1\n", encoding="utf-8")

    def run(*args: str) -> subprocess.CompletedProcess:
        return subprocess.run([sh, str(tmp_path / "desktop.sh"), *args], capture_output=True, text=True, timeout=120)

    assert launch_pictures_state(tmp_path) == "lfs-pointers"
    check = run("--check")
    assert check.returncode == 0 and "pictures: lfs-pointers" in check.stdout
    start = run()
    assert start.returncode == 1
    assert "The pet pictures did not download. They come through Git LFS" in start.stdout
    assert "git lfs pull" in start.stdout
    assert "Getting the pieces" not in start.stdout and not (tmp_path / "desktop" / "node_modules").exists()
    picture.write_bytes(b"\x89PNG\r\n\x1a\n" + b"\0" * 32)
    assert launch_pictures_state(tmp_path) == "ready"
    assert "pictures: ready" in run("--check").stdout


def test_main_rows_drive_the_real_main_process_offline():
    """Keeper card and tray rows load desktop/main.cjs under a stand-in Electron."""
    rows = {
        "desk.tray.switch": "tray_switch=",
        "desk.quit": "quit-desk=1",
        "desk.market.search": "http_500=unread",
        "card.alarm": "hidden_rings=1",
        "card.timer": "late_ms=0",
        "card.saved_lines": "persist=card.json",
        "card.music": "radio_no_line=held",
        "card.mind": "disk_plain_key=0",
    }
    for aid, mark in rows.items():
        result = invoke(aid)
        assert result.ok, f"{aid}: {result.error}"
        assert any(mark in t for t in result.trace), (aid, result.trace)
    alarm = invoke("card.alarm")
    assert "pet_clock_hidden=runs" in alarm.trace
    # A clicked clock notification shows the overlay and the saved line; care notes still open care.
    assert "note_click=clock-note" in alarm.trace
    assert "care_note=open-care" in alarm.trace
    assert "note_click=clock-note" in invoke("card.timer").trace
    tray = invoke("desk.tray.switch")
    assert tray.extras["companions"] == 221
    assert tray.extras["picks"][0] == "red_panda"


def test_house_window_unlock_and_tray_rows_run_offline_with_plain_words():
    """The House window, Unlock offline, and the whole tray menu, through the real main.cjs."""
    window = invoke("desk.settings.window")
    assert window.ok, window.error
    for mark in ("plugins=14", "pets=221", "unlock_opens=unlock", "minds=house_lines_need_nothing", "minds=plain_address_and_key", "base_url_refused=4", "save=sealed",
                 "disk_plain_key=0", "unwritable=not_saved", "no_store=not_written", "details=folded_toggles",
                 "mark=stored", "unlock_refused=plain"):
        assert mark in window.trace, (mark, window.trace)
    lic = invoke("desk.license.offline")
    assert lic.ok, lic.error
    for mark in ("valid=unlocked", "token_plain=0", "token=sealed", "no_store_token=memory", "no_token=plain",
                 "expired=plain", "wrong_machine=plain", "server_binding=plain", "local_binding=plain",
                 "net_down=plain", "http_500=plain", "denied=plain", "status_expired=plain",
                 "missing_secret=plain", "fields_missing=plain", "secret_on_disk=0"):
        assert mark in lic.trace, (mark, lic.trace)
    tray = invoke("desk.tray.menu")
    assert tray.ok, tray.error
    for mark in ("care_commands=13", "keeper_card=open-card", "vitals=status+tooltip", "house_window=one", "unlock_section=unlock",
                 "hide_show=ok", "quit=1", "software=require_hardware", "refused=allow_software", "blocked=quit_only"):
        assert mark in tray.trace, (mark, tray.trace)
    labels = tray.extras["labels"]
    assert labels[labels.index("Keeper card") + 1] == "Unlock…"
    assert labels[labels.index("Unlock…") + 1] == "Minds…"
    assert labels[-1] == "Quit"


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
    # Every one of the 221 guests has a house cry, and all 221 decode.
    assert result.extras["n"] == 221
    assert result.extras["decoded"] == 221
    assert "prefersHouseCry=221" in result.trace
    assert "decoded=221" in result.trace
    assert "crocodile" in _prefers_house_cry_keys()
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
        "card.minds_blotter",
        "card.house_server",
    "card.house_server",
        "gui.choice_close_exit",
        "web.guest_choice",
        "web.ethogram_tricks",
        "web.demo_room",
        "web.load_problems",
        "web.plain_reasons",
        "web.care_talk_plates",
        "web.pets_admin_music",
        "web.pets_keys_idle",
        "web.pet_keys_plates",
        "web.menu_keys_escape",
        "web.plain_words",
        "web.consent_plain",
        "web.consent_types_plain",
        "web.loop_guard_unlock_plain",
        "web.desk_guard_plain",
        "web.guest_loops_mount",
        "web.minds_flight_plain",
        "web.overlay_birds_plain",
        "web.flake_house_plain",
        "web.unlock_plain_lfs",
        "web.pictures_start_names",
        "web.portraits_tray_minds",
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

    loads = invoke("web.load_problems")
    assert loads.ok, (loads.error, loads.detail)
    assert "admin.404=not_license_service" in loads.trace
    assert set(loads.extras.get("lines") or {}) == {"kennel", "ember", "desk", "signin"}

    reasons = invoke("web.plain_reasons")
    assert reasons.ok, (reasons.error, reasons.detail)
    assert "play.save=plain+retry+meters_kept" in reasons.trace
    assert "mind.test=plain_reason" in reasons.trace
    assert (reasons.extras.get("minds") or {}).get("key") == "key"

    cares = invoke("web.care_talk_plates")
    assert cares.ok, (cares.error, cares.detail)
    assert "feed+tend.save=plain+retry+meters_kept" in cares.trace
    assert "admin.revoke=confirmed_only" in cares.trace
    assert set(cares.extras.get("care") or {}) == {"feed", "rest", "clean", "medicine"}

    pam = invoke("web.pets_admin_music")
    assert pam.ok, (pam.error, pam.detail)
    assert "pets.care=room_line_only" in pam.trace
    assert "music.shared=every_guest_but_rui" in pam.trace
    assert (pam.extras.get("heartbeat") or {}).get("intervals") == 1

    pki = invoke("web.pets_keys_idle")
    assert pki.ok, (pki.error, pki.detail)
    assert "overlay.keys=tab_wrap+escape" in pki.trace
    assert "idle=pause_while_hidden" in pki.trace
    assert (pki.extras.get("hint") or {}).get("off") == "Pick music on Rui's card."

    pkp = invoke("web.pet_keys_plates")
    assert pkp.ok, (pkp.error, pkp.detail)
    for mark in ("pet.keys=button+enter_space", "overlay.plates=tab_cycle", "idle=floor+news+room",
                 "clock=parse_on_change", "admin=expanded+caption+focus", "alarm_mute=pressed"):
        assert mark in pkp.trace, (mark, pkp.trace)
    assert (pkp.extras.get("clock") or {}).get("loads") == 2

    mke = invoke("web.menu_keys_escape")
    assert mke.ok, (mke.error, mke.detail)
    for mark in ("menu=menuitem+arrows+escape", "card.web=escape+open_key", "plates=escape_to_card+tab_arrows",
                 "lines.drop=focus_next", "walkers=one_stop", "admin=row_names+ask_focus", "idle=visit+flyers+p2p"):
        assert mark in mke.trace, (mark, mke.trace)
    assert (mke.extras.get("visit") or {}).get("whileHidden") == 1



def test_plain_words_row_keeps_developer_words_off_the_card_and_plates():
    """Kid-plain keeper card and plates on web and overlay, closed headers, and roving web plate tabs."""
    pw = invoke("web.plain_words")
    assert pw.ok, (pw.error, pw.detail)
    for mark in ("heartbeat=optional+running+stopped", "tooltip=port_profile", "care=plain", "gpu=no_unread",
                 "listener=not_sure", "plates.closed=open_to", "tabs.web=roving+no_pressed", "lockstep=web+overlay"):
        assert mark in pw.trace, (mark, pw.trace)
    assert pw.extras["heartbeat"]["stopped"] == "House server stopped answering (optional). Pets still work."
    assert pw.extras["lines"]["care"] == "Your pet's care stays on this computer."
    assert pw.extras["lines"]["weatherClosed"] == "open to add a place"
    assert pw.extras["lines"]["newsClosed"] == "open to see headlines"
    assert pw.extras["gpu"][0] == "GPU · no reading"


def test_consent_plain_row_names_the_website_and_keeps_the_gates():
    """Consent lines in plain words on web and overlay, same painted-line gates, web GPU hidden, calm server tone."""
    cp = invoke("web.consent_plain")
    assert cp.ok, (cp.error, cp.detail)
    for mark in ("consent=names_site+what_is_sent", "consent=no_https_jargon", "gate=same_painted_lines",
                 "main=plain_lines+radio_kept", "overlay.html=same_words", "gpu.web=hidden",
                 "heartbeat=off_neutral+down_warns", "quotes+admin=plain", "lockstep=web+overlay"):
        assert mark in cp.trace, (mark, cp.trace)
    assert cp.extras["lines"]["forecast"] == (
        "This asks Open-Meteo, a weather website, for your forecast. It sends the place you picked. "
        "This computer's internet address also goes to Open-Meteo, like visiting any website."
    )
    assert cp.extras["lines"]["quote"].endswith("goes to CoinGecko and GeckoTerminal, like visiting any website.")
    assert all(cp.extras["gate"].values()), cp.extras["gate"]
    assert cp.extras["tones"]["webNever"] == "OFF" and cp.extras["tones"]["webStopped"] == "DOWN"


def test_consent_types_plain_row_names_every_website_and_keeps_the_bug_fixes():
    """Talk, voice, license, and STUN lines in plain words on every surface; AA warning colour; type-found bugs fixed."""
    ct = invoke("web.consent_types_plain")
    assert ct.ok, (ct.error, ct.detail)
    for mark in ("consent=talk+voice+license+stun_plain", "lockstep=web+overlay+main+blotter", "gate=same_painted_lines",
                 "warn=css_var+wcag_aa", "words=favorites+waits+price_plain",
                 "bugs=morel_costa+thank_you_nan+overlay_shorthand", "tsc=0", "gpu.ts=kept_for_parity"):
        assert mark in ct.trace, (mark, ct.trace)
    assert ct.extras["lines"]["talk"].startswith("This sends what you typed, your pet's name, and how hungry, happy, and rested it is to xAI, an AI website")
    assert ct.extras["lines"]["unlock"].startswith("This asks license.example.test, the license website, to check your license.")
    assert all(ct.extras["gate"].values()), ct.extras["gate"]
    assert ct.extras["contrast"]["worstDark"] >= 4.5 and ct.extras["contrast"]["paperRatio"] >= 4.5
    assert ct.extras["bugs"]["overlayThrows"] == 0 and ct.extras["bugs"]["tscBaseline"] == "0"


def test_loop_guard_row_keeps_the_overlay_moving_and_the_unlock_words_plain():
    """A throwing trick cannot freeze the overlay; desktop checkJs holds its line; unlock and gate words are plain."""
    lg = invoke("web.loop_guard_unlock_plain")
    assert lg.ok, (lg.error, lg.detail)
    for mark in ("loop=schedule_first+guarded", "fault=injected_trick_throws", "log=once_per_error+pet_key",
                 "reset=safe_idle", "checkjs=baseline_held+wired", "bugs=thank_you_repeat+api_dup_keys+dead_compares",
                 "unlock=plain_words+honest", "gate=plain_license_messages"):
        assert mark in lg.trace, (mark, lg.trace)
    run = lg.extras["guardRun"]
    assert run["frames"] == 1200 and run["pending"] == 1 and run["logs"] == 1
    assert run["caught"] >= 2 and run["resets"] == run["caught"]
    assert "(cat)" in run["log"]
    assert all(lg.extras["wired"].values()), lg.extras["wired"]
    from pathlib import Path

    root = Path(__file__).resolve().parents[2]
    baseline = (root / "desktop" / "checkjs-baseline.txt").read_text(encoding="utf-8").strip()
    assert lg.extras["checkjs"]["baseline"] == baseline and lg.extras["checkjs"]["docCount"] == baseline
    assert lg.extras["checkjs"]["apiDuplicates"] == 0 and lg.extras["checkjs"]["thankYouRepeats"] == 0
    assert all(lg.extras["unlock"].values()), lg.extras["unlock"]
    assert lg.extras["gates"]["messages"][0] == (
        "Nothing was sent to license.example.test. This page has to name the license website first."
    )


def test_desk_guard_row_keeps_the_web_desk_moving_and_the_house_words_plain():
    """A throwing trick cannot freeze the web desk; trick calls are typed; checkJs is held to its file; words are plain."""
    dg = invoke("web.desk_guard_plain")
    assert dg.ok, (dg.error, dg.detail)
    for mark in ("web_loop=schedule_first+guarded", "fault=injected_trick_throws", "log=once_per_error+pet_key",
                 "reset=safe_idle", "share=overlay_frame_guard_rules", "types=no_as_never", "checkjs=baseline_file+electron_types",
                 "words=house_server+admin+license_website+adr"):
        assert mark in dg.trace, (mark, dg.trace)
    run = dg.extras["guardRun"]
    assert run["frames"] == 1200 and run["pending"] == 1 and run["logs"] == 1
    assert run["caught"] >= 2 and run["resets"] == run["caught"] and run["idle"]
    assert run["log"].startswith("desk frame error (cat): Error: injected trick fault.")
    assert all(dg.extras["parity"].values()), dg.extras["parity"]
    assert all(dg.extras["wired"].values()), dg.extras["wired"]
    from pathlib import Path

    baseline = (Path(__file__).resolve().parents[2] / "desktop" / "checkjs-baseline.txt").read_text(encoding="utf-8").strip()
    assert dg.extras["checkjs"]["baseline"] == baseline and dg.extras["checkjs"]["docCount"] == baseline
    assert all(v for k, v in dg.extras["checkjs"].items() if k not in ("baseline", "docCount")), dg.extras["checkjs"]
    assert all(dg.extras["words"].values()), dg.extras["words"]


def test_guest_loops_row_keeps_every_desk_guest_moving_and_mounts_the_real_pets():
    """Each web desk guest loop survives a throw; LivingPet and each guest mounted with React show the reset."""
    gl = invoke("web.guest_loops_mount")
    assert gl.ok, (gl.error, gl.detail)
    for mark in ("guests=robin+bird+called+plants+lure", "loop=schedule_first+guest_guard", "log=once_per_error+key",
                 "reset=leave_or_rest", "mount=living_pet+5_guests_react_dom", "music=backoff_after_broken_dance",
                 "types=typed_thank_you", "license=no_dead_stand_in", "words=readme+admin+adr+minds"):
        assert mark in gl.trace, (mark, gl.trace)
    assert all(gl.extras["wired"].values()), gl.extras["wired"]
    for shape in gl.extras["shapes"].values():
        assert shape["logs"] == 1 and shape["resets"] == 2 and shape["caught"] == 2
    mount = gl.extras["mount"]
    assert mount["pass"] == 9 and mount["fail"] == 0
    assert mount["tests"][:2] == ["LivingPet", "LivingPet with the robin"]
    assert gl.extras["music"] == [16, 16]
    assert all(gl.extras["typed"].values()) and all(gl.extras["license"].values())
    assert all(gl.extras["words"].values()), gl.extras["words"]


def test_minds_blotter_row_says_talk_works_without_an_ai_in_the_same_words():
    """The blotter's Minds note and the plain address and key boxes match the web desk and the overlay."""
    mb = invoke("card.minds_blotter")
    assert mb.ok, (mb.error, mb.detail)
    for mark in ("minds=same_words_web+overlay+blotter", "house_lines=no_ai_boxes", "blotter=talk_without_ai"):
        assert mark in mb.trace, (mark, mb.trace)
    assert all(mb.extras.values()), mb.extras


def test_minds_flight_row_keeps_words_plain_and_leaves_no_bird_on_the_page():
    """Plain Minds boxes everywhere; robin and bird leave the page after a flight; START-HERE and ARCHITECTURE plain."""
    mf = invoke("web.minds_flight_plain")
    assert mf.ok, (mf.error, mf.detail)
    for mark in ("minds=same_words_web+overlay+blotter", "minds=plain_address_and_key+helper",
                 "minds=house_lines_no_ai_boxes", "download=download_my_pet", "checkjs=baseline_file_in_desk_guard",
                 "flight=canvas_off_page+no_loop", "start_here=kid_plain+desktop_first+honest",
                 "architecture=plain_words_first"):
        assert mark in mf.trace, (mark, mf.trace)
    assert all(mf.extras["minds"].values()), mf.extras["minds"]
    assert all(mf.extras["words"].values()), mf.extras["words"]
    assert mf.extras["flight"]["pass"] == 2 and mf.extras["flight"]["fail"] == 0
    start = mf.extras["startHere"]
    assert 4 <= start["bullets"] <= 8 and start["longest"] <= 20 and start["desktopFirst"] and start["browserAfter"]
    assert start["talkShort"] and start["talkListKept"]
    assert all(mf.extras["architecture"].values()), mf.extras["architecture"]


def test_overlay_birds_row_leaves_no_bird_on_the_glass_and_keeps_minds_plain():
    """Overlay robin and bird leave on flight end, hide, and a broken frame; Which AI / model words match; /mind folded."""
    ob = invoke("web.overlay_birds_plain")
    assert ob.ok, (ob.error, ob.detail)
    for mark in ("overlay_birds=flight_end+hide+broken_frame_leave", "reset=drop_robin+drop_bird+end_visit",
                 "minds=which_ai+model_name+key_placeholder_same", "overlay=no_plugin_key_or_mind_json_words",
                 "mind_page=kid_top+for_builders_fold", "cards=plain_blurbs+tags", "start_here=detail_short_lines+facts_kept"):
        assert mark in ob.trace, (mark, ob.trace)
    assert ob.extras["birds"]["pass"] == 9 and ob.extras["birds"]["fail"] == 0
    assert all(ob.extras["same"].values()), ob.extras["same"]
    assert all(ob.extras["overlay"].values()), ob.extras["overlay"]
    assert all(ob.extras["web"].values()), ob.extras["web"]
    assert ob.extras["startHere"]["longest"] <= 18 and ob.extras["startHere"]["missing"] == []


def test_flake_house_plain_row_passes_every_seed_and_keeps_words_plain():
    """desk-mount 9/9 under three seeds (no stale frame when a flight ends); Use for all pets; short Unlock lines."""
    fh = invoke("web.flake_house_plain")
    assert fh.ok, (fh.error, fh.detail)
    for mark in ("mount=seeds_3_all_9_of_9", "loop=halt_cancels_queued_frame", "guests=5_pass_cancel",
                 "minds=use_for_all_pets_same", "cards=name_tag_blurb+model_ids_folded",
                 "unlock=short_lines_overlay+blotter", "start_here=one_pet_per_line", "readme=minds_plain_first"):
        assert mark in fh.trace, (mark, fh.trace)
    assert [r["pass"] for r in fh.extras["runs"]] == [9, 9, 9]
    assert all(r["fail"] == 0 and r["aligned"] for r in fh.extras["runs"])
    for group in ("flake", "allPets", "cards", "readme"):
        assert all(fh.extras[group].values()), (group, fh.extras[group])
    assert fh.extras["unlock"]["overlayLongest"] <= 18 and fh.extras["unlock"]["blotterLongest"] <= 18
    assert fh.extras["sounds"]["pets"] == 109


def test_unlock_plain_lfs_row_keeps_unlock_words_plain_and_names_git_lfs():
    """Plain Unlock fields on both doors, random ID, room-grouped cry list, and the Git LFS stop in both start scripts."""
    ul = invoke("web.unlock_plain_lfs")
    assert ul.ok, (ul.error, ul.detail)
    for mark in ("unlock_fields=plain_labels+helpers_same", "pet_list=name_and_kind", "random_id=capital_ID_everywhere",
                 "start_here=cry_list_room_groups", "lfs=start_scripts_stop_on_pointers", "lfs=mac_linux_docs"):
        assert mark in ul.trace, (mark, ul.trace)
    for group in ("fields", "honest", "lfs"):
        assert all(ul.extras[group].values()), (group, ul.extras[group])
    assert ul.extras["randomId"]["lower"] == []
    assert ul.extras["sounds"]["pets"] == 109 and len(ul.extras["sounds"]["heads"]) == 10


def test_pictures_start_names_row_says_so_at_app_start_and_keeps_one_name_per_kind():
    """Overlay and web dev server picture checks, YAML LF, one kind name per pet, and the START-HERE copy size."""
    from computerpets_client.app_harness import launch_pictures_state, repo_root

    ps = invoke("web.pictures_start_names")
    assert ps.ok, (ps.error, ps.detail)
    for mark in ("pictures=overlay_checks_before_glass", "pictures=web_dev_server_warns", "pictures=python_draws_own",
                 "eol=yaml_lf", "names=one_per_kind_221", "start_here=copy_size"):
        assert mark in ps.trace, (mark, ps.trace)
    for group in ("overlay", "python", "yaml", "size"):
        assert all(ps.extras[group].values()), (group, ps.extras[group])
    assert ps.extras["names"]["drift"] == []
    assert ps.extras["names"]["bees"] == ["Blue Orchard Mason", "Alfalfa Leafcutter", "Western Honey Bee Drone", "Western Honey Bee Queen"]
    assert ps.extras["pictures"] == launch_pictures_state(repo_root())


def test_portraits_tray_minds_row_tiles_one_note_dev_start_name_kind_plain_test_and_small_copy():
    """Broken web portraits: name tiles and one Git LFS note; npm run dev starts; Name · Kind everywhere; plain mind test; depth 1."""
    pt = invoke("web.portraits_tray_minds")
    assert pt.ok, (pt.error, pt.detail)
    for mark in ("portraits=tile_and_one_note", "dev_server=surface_global", "pet_line=name_kind_221",
                 "mind_test=plain_source", "start_here=depth_1"):
        assert mark in pt.trace, (mark, pt.trace)
    assert all(pt.extras["portraits"].values()), pt.extras["portraits"]
    assert pt.extras["dev"] == {"noDefault": True, "setsGlobal": True, "sideEffect": True, "valueImports": 0}
    assert pt.extras["tray"]["rows"] == 221 and pt.extras["tray"]["wrong"] == 0
    assert pt.extras["minds"]["plainGuest"] and pt.extras["minds"]["wired"]
    assert all(pt.extras["depth"].values()), pt.extras["depth"]


def test_pictures_gate_row_boots_real_main_with_pointers_and_opens_no_glass():
    """The real main.cjs with Git LFS pointers or no pictures: no window, the Git LFS words, tray fix, link gate."""
    pg = invoke("desk.pictures_gate")
    assert pg.ok, (pg.error, pg.detail)
    for mark in ("pointers=no_glass+small_window", "missing=no_glass+small_window", "tray=how_to_fix+git_lfs_link+quit",
                 "second_start=words_again", "link=through_open_link_gate", "ready=glass_opens"):
        assert mark in pg.trace, (mark, pg.trace)
    for state in ("lfs-pointers", "missing"):
        row = pg.extras[state]
        assert row["windows"] == 0 and row["ticks"] == 0
        assert row["message"] == "The pet pictures did not download."
        assert "git lfs install and then git lfs pull, and start ComputerPets again." in row["detail"]
    assert pg.extras["ready"] == {"windows": 1, "dialogs": 0}

def test_python_blotter_draws_its_own_pets_and_loads_no_picture_files():
    """The Git LFS picture check is for the overlay and the site; the blotter paints its pets, so it has none to check."""
    from pathlib import Path

    pkg = Path(__file__).resolve().parents[1] / "computerpets_client"
    frames = (pkg / "frames.py").read_text(encoding="utf-8")
    assert "The repo does not ship PNG sprite packs." in frames and "QPainter" in frames
    loads = []
    for py in pkg.rglob("*.py"):
        if py.name in ("app_harness.py", "bundle_zip.py"):
            continue
        src = py.read_text(encoding="utf-8").replace("\\", "/")
        if any(mark in src for mark in ("renderer/sprites", '"sprites"', "public/pets", '.png"', ".png'", '.jpg"', ".jpg'")):
            loads.append(py.name)
    assert loads == []


def test_first_run_rows_start_clean_and_show_the_hello_once():
    """A brand-new keeper on desktop and web, and each network plate from a clean card."""
    first = invoke("card.first_run")
    assert first.ok, (first.error, first.detail)
    for mark in ("clean=no_card_json", "defaults=open+ink+hearth+unmuted", "hint=shows_once",
                 "persist=card.json firstHintSeen", "server=not_running_optional_until_answered",
                 "clean=no_storage", "hint=shows_once+own_key", "heartbeat=optional>up>down",
                 "plates=next_step+quotes_wait", "menu=overlay_matches_web", "admin=revoke_focus_status", "p2p=dormant"):
        assert mark in first.trace, (mark, first.trace)
    assert first.extras["desk"]["shows"] == 1
    assert first.extras["web"]["shows"] == 1
    assert first.extras["desk"]["rows"][1] == "House server not running (optional)"
    assert first.extras["web"]["lines"][0] == "House server not running (optional)"
    plates = invoke("desk.plates.first_run")
    assert plates.ok, (plates.error, plates.detail)
    assert plates.extras["weatherNext"] == "No place yet. Type a city below and press Look up."
    assert plates.extras["quotesClosed"].endswith("· open to see the price")
    assert plates.extras["stations"] == 1
    assert any(t.startswith("weather=") and "Overcast" in t for t in plates.trace), plates.trace
    assert any(t.startswith("news=") and "_headlines" in t for t in plates.trace), plates.trace


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
        "blotter.unlock_offline",
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
    assert len(driven_ok) == 11
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
    unlock = invoke("blotter.unlock_offline")
    assert unlock.ok, (unlock.error, unlock.detail)
    assert unlock.trace[:3] == ["sealed=ok", "memory_only=ok", "migrated=ok"]
    assert all(w.endswith("Pets still work without it.") for w in unlock.extras["words"].values())


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
