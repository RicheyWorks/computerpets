"""Honest GPU sense: valid, missing, malformed, stale, unsupported."""

from pathlib import Path

from computerpets_client.gpu import (
    LATER_DOOR,
    READ_INK,
    STALE_MS,
    UNREAD,
    UNREAD_INK,
    empty_history,
    gpu_line,
    initial_sample,
    is_linux,
    is_mac,
    later_door,
    parse_sample,
    present,
    read_local,
    remember,
    sample_from_probe,
    senses_on,
    sparkline,
)

NOW = 1_700_000_000_000
VALID_LINE = "GPU NVIDIA GeForce RTX 4070 · 62°C · 14% · 3.1 GiB/12 GiB · 48.5 W"


def test_valid_reading_and_a_real_zero():
    sample = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="win32",
        now_ms=NOW,
    )
    assert sample["status"] == "read"
    assert sample["source"] == "nvidia-smi"
    assert sample["tempC"] == 62
    assert sample["utilPercent"] == 14
    assert sample["powerWatts"] == 48.5
    assert gpu_line(sample) == VALID_LINE

    idle = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 40, 0, 0, 8192, 5"},
        platform="win32",
        now_ms=NOW,
    )
    assert idle["utilPercent"] == 0
    assert idle["memoryUsedBytes"] == 0
    assert gpu_line(idle) == "GPU NVIDIA GeForce RTX 4070 · 40°C · 0% · 0 MiB/8 GiB · 5 W"

    two = sample_from_probe(
        {
            "nvidiaCsv": "\n".join(
                [
                    "NVIDIA GeForce RTX 4070, 40, 10, 100, 1024, 20",
                    "NVIDIA GeForce RTX 4090, 70, 90, 200, 2048, 80",
                ]
            )
        },
        platform="win32",
        now_ms=NOW,
    )
    assert two["index"] == 0
    assert two["tempC"] == 40
    assert "70°C" not in gpu_line(two)
    assert "90%" not in gpu_line(two)


def test_missing_stays_unread():
    sample = sample_from_probe(
        {"nvidiaCsv": None, "engines": None, "adapterMemory": None},
        platform="win32",
        now_ms=NOW,
    )
    assert sample["status"] == "unread"
    assert sample["utilPercent"] is None
    assert gpu_line(sample) == "GPU unread"
    assert gpu_line(UNREAD) == "GPU unread"
    assert "0%" not in gpu_line(sample)

    partial = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, [N/A], 7, 100, 8192, [Not Supported]"},
        platform="win32",
        now_ms=NOW,
    )
    assert partial["tempC"] is None
    assert partial["powerWatts"] is None
    assert partial["utilPercent"] == 7
    assert gpu_line(partial) == "GPU NVIDIA GeForce RTX 4070 · unread · 7% · 100 MiB/8 GiB · unread"


def test_malformed_is_dark():
    bad = parse_sample(0)
    assert bad["status"] == "malformed"
    assert bad["utilPercent"] is None
    assert gpu_line(bad) == "GPU unread · malformed"
    assert "0%" not in gpu_line(bad)
    typed = parse_sample({"status": "read", "platform": "win32", "utilPercent": "0", "readAtMs": NOW})
    assert typed["status"] == "malformed"
    hot = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 999, no, -1, -5, hot"},
        platform="win32",
        now_ms=NOW,
    )
    assert hot["status"] == "malformed"
    assert hot["tempC"] is None


def test_stale_drops_the_old_numbers():
    fresh = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="win32",
        now_ms=NOW,
    )
    assert present(fresh, NOW + STALE_MS)["status"] == "read"
    stale = present(fresh, NOW + STALE_MS + 1)
    assert stale["status"] == "stale"
    assert stale["tempC"] is None
    assert gpu_line(stale) == "GPU unread · stale"
    assert "62" not in gpu_line(stale)


def test_linux_reads_nvidia_and_mac_stays_closed():
    assert senses_on("win32")
    assert senses_on("linux")
    assert is_mac("darwin")
    assert is_linux("linux")
    assert later_door("win32") is None
    assert later_door("linux") is None
    assert later_door("darwin") == LATER_DOOR
    assert LATER_DOOR == "mac-gpu-sense"
    linux = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="linux",
        now_ms=NOW,
    )
    assert linux["status"] == "read"
    assert linux["source"] == "nvidia-smi"
    assert linux["tempC"] == 62
    assert gpu_line(linux) == VALID_LINE
    mac = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="darwin",
        now_ms=NOW,
    )
    assert mac["status"] == "unsupported"
    assert mac["tempC"] is None
    assert mac["utilPercent"] is None
    assert gpu_line(mac) == "GPU unread · mac-gpu-sense"
    live = read_local(platform="linux", now_ms=NOW)
    assert live["status"] in {"read", "unread", "malformed"}
    if live["status"] != "read":
        assert live["utilPercent"] is None
        assert live["tempC"] is None
        assert "0%" not in gpu_line(live)
    assert read_local(platform="darwin", now_ms=NOW)["reason"] == LATER_DOOR
    initial = initial_sample(platform="linux", now_ms=NOW)
    assert initial["status"] == "unread"
    assert "0%" not in gpu_line(initial)


TRAIL = "M1 11.3 L71 8.2"


def _at(util: int, when: int) -> dict:
    return sample_from_probe(
        {"nvidiaCsv": f"NVIDIA GeForce RTX 4070, 62, {util}, 3200, 12288, 48.5"},
        platform="win32",
        now_ms=when,
    )


def test_sparkline_grows_only_from_fresh_reads():
    first = _at(14, NOW)
    history = remember(empty_history(), first, NOW)
    assert len(history) == 1
    assert history[0]["utilPercent"] == 14
    one = sparkline(history, first, NOW)
    assert one["empty"] is True
    assert one["path"] == ""
    assert one["ink"] == UNREAD_INK
    assert len(one["history"]) == 1

    second = _at(40, NOW + 1000)
    history = remember(history, second, NOW + 1000)
    spark = sparkline(history, second, NOW + 1000)
    assert len(history) == 2
    assert history[1]["utilPercent"] == 40
    assert spark["empty"] is False
    assert spark["path"] == TRAIL
    assert spark["ink"] == READ_INK
    assert len(spark["points"]) == 2
    assert spark["coords"][0]["y"] == 11.3

    lied = dict(second)
    lied["history"] = [{"readAtMs": NOW, "utilPercent": 100}, {"readAtMs": NOW + 1, "utilPercent": 1}]
    once = remember([], lied, NOW + 1000)
    assert len(once) == 1
    assert once[0]["utilPercent"] == 40
    assert len(remember(history, second, NOW + 1000)) == 2


def test_unread_malformed_and_unsupported_sparklines_stay_empty():
    unread = sample_from_probe(
        {"nvidiaCsv": None, "engines": None, "adapterMemory": None},
        platform="win32",
        now_ms=NOW,
    )
    assert remember([], unread, NOW) == []
    blank = sparkline([], unread, NOW)
    assert blank["empty"] is True
    assert blank["path"] == ""
    assert blank["history"] == []
    assert blank["points"] == []
    assert blank["ink"] == UNREAD_INK
    assert sparkline([], UNREAD, NOW)["path"] == ""

    prior = remember(remember([], _at(14, NOW), NOW), _at(40, NOW + 1000), NOW + 1000)
    assert len(remember(prior, unread, NOW + 2000)) == 2
    hidden = sparkline(prior, unread, NOW + 2000)
    assert hidden["path"] == ""
    assert hidden["history"] == []

    malformed = parse_sample(0)
    assert remember([], malformed, NOW) == []
    assert sparkline([], malformed, NOW)["path"] == ""
    assert sparkline(prior, malformed, NOW + 2000)["empty"] is True

    mac = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="darwin",
        now_ms=NOW,
    )
    assert mac["status"] == "unsupported"
    assert remember([], mac, NOW) == []
    spark = sparkline([], mac, NOW)
    assert spark["empty"] is True
    assert spark["path"] == ""
    assert spark["ink"] == UNREAD_INK
    assert spark["history"] == []


def test_stale_samples_clear_the_sparkline():
    history = remember(remember([], _at(14, NOW), NOW), _at(40, NOW + 1000), NOW + 1000)
    assert sparkline(history, _at(40, NOW + 1000), NOW + 1000)["path"] == TRAIL
    later = NOW + 1000 + STALE_MS + 1
    stale = present(_at(40, NOW + 1000), later)
    assert stale["status"] == "stale"
    assert remember(history, stale, later) == []
    cleared = sparkline(history, stale, later)
    assert cleared["empty"] is True
    assert cleared["path"] == ""
    assert cleared["history"] == []
    assert cleared["coords"] == []
    assert cleared["ink"] == UNREAD_INK


def test_sparkline_contract_is_lockstep():
    root = Path(__file__).resolve().parents[2]
    overlay = (root / "desktop/renderer/index.html").read_text(encoding="utf-8")
    desk = (root / "desktop/renderer/gpu.js").read_text(encoding="utf-8")
    card = (root / "web/src/components/desk/keeper-card.tsx").read_text(encoding="utf-8")
    web = (root / "web/src/lib/pets/gpu.ts").read_text(encoding="utf-8")
    blotter = (root / "client/computerpets_client/app.py").read_text(encoding="utf-8")
    assert 'data-spark="empty"' in overlay
    assert "function remember" in desk and "function sparkline" in desk
    assert "export function remember" in web and "export function sparkline" in web
    assert "sparkline([], UNREAD_GPU, 0)" in card
    assert "M1 11.3" not in card
    assert "gpu_spark" in blotter and "sparkline" in blotter
    assert sparkline(remember(remember([], _at(14, NOW), NOW), _at(40, NOW + 1000), NOW + 1000), _at(40, NOW + 1000), NOW + 1000)["path"] == TRAIL
    assert sparkline([], UNREAD, NOW)["ink"] == UNREAD_INK
    assert READ_INK == "#9a9288"


def test_counters_do_not_sum_engines():
    text = "\n".join(
        [
            "NVIDIA_ABSENT",
            "ENGINE",
            "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t60",
            "pid_2_luid_0x1_0x2_phys_0_eng_1_engtype_3D\t60",
            "pid_1_luid_0x1_0x2_phys_0_eng_2_engtype_Copy\t5",
            "ENDENGINE",
            "MEMORY",
            "luid_0x1_0x2_phys_0\t1073741824\t8589934592",
            "ENDMEMORY",
            "END",
        ]
    )
    from computerpets_client.gpu import parse_probe_text

    sample = sample_from_probe(parse_probe_text(text), platform="win32", now_ms=NOW)
    assert sample["status"] == "read"
    assert sample["source"] == "pdh"
    assert sample["utilPercent"] == 60
    assert sample["tempC"] is None
    assert "120" not in gpu_line(sample)
