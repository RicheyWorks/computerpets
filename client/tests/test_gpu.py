"""Honest GPU sense: valid, missing, malformed, stale, unsupported."""

from computerpets_client.gpu import (
    LATER_DOOR,
    STALE_MS,
    UNREAD,
    gpu_line,
    initial_sample,
    is_linux,
    is_mac,
    later_door,
    parse_sample,
    present,
    read_local,
    sample_from_probe,
    senses_on,
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


def test_mac_and_linux_are_explicit_and_ignore_numbers():
    assert senses_on("win32")
    assert is_mac("darwin")
    assert is_linux("linux")
    assert later_door("win32") is None
    assert later_door("darwin") == LATER_DOOR
    assert later_door("linux") == LATER_DOOR
    for platform in ("darwin", "linux"):
        sample = sample_from_probe(
            {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
            platform=platform,
            now_ms=NOW,
        )
        assert sample["status"] == "unsupported"
        assert sample["tempC"] is None
        assert sample["utilPercent"] is None
        assert gpu_line(sample) == "GPU unread · mac-linux-gpu-sense"
    assert read_local(platform="linux", now_ms=NOW)["status"] == "unsupported"
    assert read_local(platform="darwin", now_ms=NOW)["reason"] == LATER_DOOR
    initial = initial_sample(platform="linux", now_ms=NOW)
    assert initial["status"] == "unsupported"
    assert "0%" not in gpu_line(initial)


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
