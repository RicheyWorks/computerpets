"""Honest GPU sense: valid, missing, malformed, stale, unsupported."""

import sys
from pathlib import Path

import pytest

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
    assert gpu_line(sample) == "GPU · no reading"
    assert gpu_line(UNREAD) == "GPU · no reading"
    assert "0%" not in gpu_line(sample)

    partial = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, [N/A], 7, 100, 8192, [Not Supported]"},
        platform="win32",
        now_ms=NOW,
    )
    assert partial["tempC"] is None
    assert partial["powerWatts"] is None
    assert partial["utilPercent"] == 7
    assert gpu_line(partial) == "GPU NVIDIA GeForce RTX 4070 · — · 7% · 100 MiB/8 GiB · —"


def test_malformed_is_dark():
    bad = parse_sample(0)
    assert bad["status"] == "malformed"
    assert bad["utilPercent"] is None
    assert gpu_line(bad) == "GPU · reading looked wrong"
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
    assert gpu_line(stale) == "GPU · reading is old"
    assert "62" not in gpu_line(stale)


def test_linux_reads_nvidia_and_mac_reads_ioaccelerator(monkeypatch, tmp_path):
    assert senses_on("win32")
    assert senses_on("linux")
    assert senses_on("darwin")
    assert is_mac("darwin")
    assert is_linux("linux")
    assert later_door("win32") is None
    assert later_door("linux") is None
    assert later_door("darwin") is None
    assert later_door("freebsd") == LATER_DOOR
    assert LATER_DOOR == "unsupported"
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
        {"nvidiaCsv": "Apple M2, [N/A], 16, 542, [N/A], [N/A]"},
        platform="darwin",
        now_ms=NOW,
    )
    assert mac["status"] == "read"
    assert mac["source"] == "ioaccelerator"
    assert mac["name"] == "Apple M2"
    assert mac["utilPercent"] == 16
    assert mac["tempC"] is None
    assert mac["powerWatts"] is None
    assert mac["memoryTotalBytes"] is None
    assert gpu_line(mac) == "GPU Apple M2 · — · 16% · 542 MiB/— · —"
    other = sample_from_probe(
        {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"},
        platform="freebsd",
        now_ms=NOW,
    )
    assert other["status"] == "unsupported"
    assert other["tempC"] is None
    assert gpu_line(other) == "GPU · not read on this computer"
    live = read_local(platform="linux", now_ms=NOW)
    assert live["status"] in {"read", "unread", "malformed"}
    if live["status"] != "read":
        assert live["utilPercent"] is None
        assert live["tempC"] is None
        assert "0%" not in gpu_line(live)
    initial = initial_sample(platform="linux", now_ms=NOW)
    assert initial["status"] == "unread"
    assert "0%" not in gpu_line(initial)
    assert initial_sample(platform="darwin", now_ms=NOW)["status"] == "unread"


# The probe scripts are POSIX sh. These fixtures put a fake `ioreg` shell script on PATH
# and build sysfs trees with symlinks, then run desktop/gpu-probe-mac.sh and
# desktop/gpu-probe.sh through /bin/sh. Windows has no /bin/sh and reads the GPU via
# desktop/gpu-probe.ps1 instead, so this half only runs where the scripts run (CI is Linux).
@pytest.mark.skipif(
    sys.platform == "win32" or not Path("/bin/sh").exists(),
    reason="runs the POSIX sh GPU probe scripts via /bin/sh with a shell-script ioreg shim and sysfs symlinks; not available on Windows",
)
def test_posix_probe_scripts_read_ioreg_and_sysfs_fixtures(monkeypatch, tmp_path):
    fixture = "\n".join(
        [
            "+-o AGXAccelerator  <class AGXAccelerator, id 0x1, registered>",
            '{ "model" = "Apple M2"',
            '  "PerformanceStatistics" = {"Device Utilization %"=16,"In use system memory"=568164352,"Alloc system memory"=16749051904} }',
            "",
        ]
    )
    fake = tmp_path / "ioreg"
    fake.write_text("#!/bin/sh\ncat <<'FIXTURE'\n" + fixture + "FIXTURE\n")
    fake.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tmp_path}{__import__('os').pathsep}{__import__('os').environ['PATH']}")
    probed = read_local(platform="darwin", now_ms=NOW)
    assert probed["status"] == "read"
    assert probed["source"] == "ioaccelerator"
    assert probed["utilPercent"] == 16
    assert probed["powerWatts"] is None
    assert probed["tempC"] is None
    assert "16749051904" not in gpu_line(probed)
    monkeypatch.setenv("PATH", "/usr/bin:/bin")
    missing = read_local(platform="darwin", now_ms=NOW)
    assert missing["status"] == "unread"
    assert missing["utilPercent"] is None
    assert missing["tempC"] is None
    assert "0%" not in gpu_line(missing)

    from computerpets_client.gpu import linux_probe_script, parse_probe_text
    import os
    import subprocess

    sysfs = tmp_path / "sysfs"
    dev = sysfs / "card0" / "device"
    dev.mkdir(parents=True)
    os.symlink("amdgpu", dev / "driver")
    (dev / "uevent").write_text("PCI_ID=1002:73BF\n")
    (dev / "gpu_busy_percent").write_text("37\n")
    (dev / "mem_info_vram_used").write_text("2147483648\n")
    (dev / "mem_info_vram_total").write_text("8589934592\n")
    (dev / "mem_busy_percent").write_text("50\n")
    intel = sysfs / "card1" / "device"
    intel.mkdir(parents=True)
    os.symlink("i915", intel / "driver")
    (intel / "gpu_busy_percent").write_text("77\n")
    monkeypatch.setenv("GPU_SYSFS_ROOT", str(sysfs))
    monkeypatch.setenv("PATH", "/usr/bin:/bin")
    probed_amd = read_local(platform="linux", now_ms=NOW)
    assert probed_amd["status"] == "read"
    assert probed_amd["source"] == "amdgpu"
    assert probed_amd["name"] == "amdgpu 1002:73BF"
    assert probed_amd["utilPercent"] == 37
    assert probed_amd["tempC"] is None
    assert probed_amd["powerWatts"] is None
    assert probed_amd["memoryUsedBytes"] == 2048 * 1024 * 1024
    assert "50" not in gpu_line(probed_amd)
    assert "77" not in gpu_line(probed_amd)
    raw = subprocess.run(
        ["/bin/sh", str(linux_probe_script())],
        check=False,
        capture_output=True,
        text=True,
        env={**os.environ, "PATH": "/usr/bin:/bin", "GPU_SYSFS_ROOT": str(sysfs)},
    )
    assert "AMDGPU" in raw.stdout
    assert "77" not in raw.stdout
    assert "50" not in raw.stdout

    hwmon = tmp_path / "amd-hwmon" / "card0" / "device"
    hwmon.mkdir(parents=True)
    os.symlink("amdgpu", hwmon / "driver")
    (hwmon / "uevent").write_text("PCI_ID=1002:73BF\n")
    (hwmon / "gpu_busy_percent").write_text("37\n")
    sensor = hwmon / "hwmon" / "hwmon0"
    sensor.mkdir(parents=True)
    (sensor / "temp1_label").write_text("edge\n")
    (sensor / "temp1_input").write_text("45500\n")
    (sensor / "temp2_label").write_text("junction\n")
    (sensor / "temp2_input").write_text("90000\n")
    (sensor / "power1_label").write_text("PPT\n")
    (sensor / "power1_average").write_text("33000000\n")
    (sensor / "power1_cap").write_text("180000000\n")
    hwmon_raw = subprocess.run(
        ["/bin/sh", str(linux_probe_script())],
        check=False,
        capture_output=True,
        text=True,
        env={**os.environ, "PATH": "/usr/bin:/bin", "GPU_SYSFS_ROOT": str(tmp_path / "amd-hwmon")},
    )
    assert "amdgpu 1002:73BF, 45.5, 37, [N/A], [N/A], 33" in hwmon_raw.stdout
    assert "90000" not in hwmon_raw.stdout
    assert "180000000" not in hwmon_raw.stdout
    hwmon_sample = sample_from_probe(parse_probe_text(hwmon_raw.stdout), platform="linux", now_ms=NOW)
    assert hwmon_sample["source"] == "amdgpu"
    assert hwmon_sample["tempC"] == 45.5
    assert hwmon_sample["powerWatts"] == 33
    assert hwmon_sample["utilPercent"] == 37
    assert "90" not in gpu_line(hwmon_sample)
    plain = sample_from_probe(
        parse_probe_text(
            "\n".join(
                [
                    "NVIDIA_ABSENT",
                    "AMDGPU",
                    "amdgpu 1002:73BF, [N/A], 37, 2048, 8192, [N/A]",
                    "ENDAMDGPU",
                    "ENGINE_ABSENT",
                    "MEMORY_ABSENT",
                    "END",
                ]
            )
        ),
        platform="linux",
        now_ms=NOW,
    )
    assert plain["tempC"] is None
    assert plain["powerWatts"] is None
    empty = sample_from_probe(
        parse_probe_text("\n".join(["NVIDIA_ABSENT", "AMDGPU_EMPTY", "ENGINE_ABSENT", "MEMORY_ABSENT", "END"])),
        platform="linux",
        now_ms=NOW,
    )
    assert empty["status"] == "unread"
    assert empty["utilPercent"] is None
    assert "0%" not in gpu_line(empty)

    intel_root = tmp_path / "intel-sysfs"
    i915 = intel_root / "card0"
    (i915 / "device").mkdir(parents=True)
    os.symlink("i915", i915 / "device" / "driver")
    (i915 / "device" / "uevent").write_text("PCI_ID=8086:9A49\n")
    (i915 / "gt" / "gt0").mkdir(parents=True)
    (i915 / "gt" / "gt0" / "rc6_residency_ms").write_text("812345\n")
    (i915 / "gt" / "gt0" / "rps_act_freq_mhz").write_text("1450\n")
    xe = intel_root / "card1" / "device"
    (xe / "tile0" / "gt0" / "gtidle").mkdir(parents=True)
    os.symlink("xe", xe / "driver")
    (xe / "tile0" / "gt0" / "gtidle" / "idle_residency_ms").write_text("654321\n")
    (xe / "tile0" / "memory").mkdir(parents=True)
    (xe / "tile0" / "memory" / "physical_vram_size_bytes").write_text("17179869184\n")
    (xe / "memory_info").mkdir(parents=True)
    (xe / "memory_info" / "vram_total").write_text("8589934592\n")
    (xe / "memory_info" / "vram_avail").write_text("6442450944\n")
    (xe / "memory_info" / "vram_used").write_text("0\n")
    (xe / "vram_d3cold_threshold").write_text("314159\n")
    monkeypatch.setenv("GPU_SYSFS_ROOT", str(intel_root))
    intel_raw = subprocess.run(
        ["/bin/sh", str(linux_probe_script())],
        check=False,
        capture_output=True,
        text=True,
        env={**os.environ, "PATH": "/usr/bin:/bin", "GPU_SYSFS_ROOT": str(intel_root)},
    )
    assert "INTEL_EMPTY" in intel_raw.stdout
    assert "812345" not in intel_raw.stdout
    assert "654321" not in intel_raw.stdout
    assert "1450" not in intel_raw.stdout
    assert "17179869184" not in intel_raw.stdout
    assert "8589934592" not in intel_raw.stdout
    assert "6442450944" not in intel_raw.stdout
    assert "314159" not in intel_raw.stdout
    assert "8086" not in intel_raw.stdout
    intel_sample = sample_from_probe(parse_probe_text(intel_raw.stdout), platform="linux", now_ms=NOW)
    assert intel_sample["status"] == "unread"
    assert intel_sample["utilPercent"] is None
    assert intel_sample["memoryUsedBytes"] is None
    assert "0%" not in gpu_line(intel_sample)
    planted = sample_from_probe(
        parse_probe_text(
            "\n".join(
                [
                    "NVIDIA_ABSENT",
                    "AMDGPU_ABSENT",
                    "INTEL_EMPTY",
                    "i915 8086:9A49, 40, 12, 100, 200, 15",
                    "ENGINE_ABSENT",
                    "MEMORY_ABSENT",
                    "END",
                ]
            )
        ),
        platform="linux",
        now_ms=NOW,
    )
    assert planted["status"] == "unread"
    assert planted["utilPercent"] is None
    assert "12%" not in gpu_line(planted)

    proc1 = tmp_path / "proc1"
    proc2 = tmp_path / "proc2"
    fd_root = tmp_path / "fd-sys"
    dev = fd_root / "card0" / "device"
    dev.mkdir(parents=True)
    os.symlink("i915", dev / "driver")
    (dev / "uevent").write_text("PCI_ID=8086:9A49\nPCI_SLOT_NAME=0000:00:02.0\n")
    (fd_root / "card0" / "gt" / "gt0").mkdir(parents=True)
    (fd_root / "card0" / "gt" / "gt0" / "rc6_residency_ms").write_text("812345\n")
    mem = dev / "memory_info"
    mem.mkdir(parents=True)
    (mem / "vram_total").write_text("8589934592\n")
    (mem / "vram_avail").write_text("6442450944\n")
    (mem / "vram_used").write_text("0\n")
    one = proc1 / "10" / "fdinfo"
    two = proc2 / "10" / "fdinfo"
    one.mkdir(parents=True)
    two.mkdir(parents=True)
    (one / "3").write_text(
        "drm-driver:\ti915\n"
        "drm-pdev:\t0000:00:02.0\n"
        "drm-client-id:\t7\n"
        "drm-engine-render:\t1000 ns\n"
        "drm-engine-copy:\t999 ns\n"
        "drm-engine-capacity-render:\t1\n"
        "drm-total-resident-vram:\t999999999\n"
        "drm-resident-local:\t888888888\n"
        "drm-total-local:\t777777777\n"
    )
    (two / "3").write_text(
        "drm-driver:\ti915\n"
        "drm-pdev:\t0000:00:02.0\n"
        "drm-client-id:\t7\n"
        "drm-engine-render:\t50001000 ns\n"
        "drm-engine-copy:\t999999999 ns\n"
        "drm-engine-capacity-render:\t1\n"
        "drm-total-resident-vram:\t999999999\n"
        "drm-resident-local:\t888888888\n"
        "drm-total-local:\t777777777\n"
    )
    fd_raw = subprocess.run(
        ["/bin/sh", str(linux_probe_script())],
        check=False,
        capture_output=True,
        text=True,
        env={
            **os.environ,
            "PATH": "/usr/bin:/bin",
            "GPU_SYSFS_ROOT": str(fd_root),
            "GPU_PROC_ROOT": str(proc1),
            "GPU_FDINFO_ROOT_2": str(proc2),
            "GPU_FDINFO_INTERVAL_NS": "100000000",
        },
    )
    assert "i915 8086:9A49, [N/A], 50, [N/A], [N/A], [N/A]" in fd_raw.stdout
    assert "999999999" not in fd_raw.stdout
    assert "888888888" not in fd_raw.stdout
    assert "777777777" not in fd_raw.stdout
    assert "8589934592" not in fd_raw.stdout
    assert "6442450944" not in fd_raw.stdout
    assert "812345" not in fd_raw.stdout
    assert ", 0," not in fd_raw.stdout
    fd_sample = sample_from_probe(parse_probe_text(fd_raw.stdout), platform="linux", now_ms=NOW)
    assert fd_sample["status"] == "read"
    assert fd_sample["source"] == "fdinfo"
    assert fd_sample["utilPercent"] == 50
    assert fd_sample["tempC"] is None
    assert fd_sample["powerWatts"] is None
    assert fd_sample["memoryUsedBytes"] is None
    assert gpu_line(fd_sample) == "GPU i915 8086:9A49 · — · 50% · — · —"
    rewind = subprocess.run(
        ["/bin/sh", str(linux_probe_script())],
        check=False,
        capture_output=True,
        text=True,
        env={
            **os.environ,
            "PATH": "/usr/bin:/bin",
            "GPU_SYSFS_ROOT": str(fd_root),
            "GPU_PROC_ROOT": str(proc2),
            "GPU_FDINFO_ROOT_2": str(proc1),
            "GPU_FDINFO_INTERVAL_NS": "100000000",
        },
    )
    assert "INTEL_EMPTY" in rewind.stdout
    assert "ENDINTEL" not in rewind.stdout
    assert "50" not in rewind.stdout


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
        platform="freebsd",
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
    # The web card hides the GPU row: a browser cannot read the GPU, so it would always say "no reading".
    assert "sparkline(" not in card and "keeper-gpu" not in card
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


def test_counters_add_processes_per_engine_then_take_the_busiest_engine():
    """Task Manager's number: sum every process on one engine, then the busiest engine."""
    from computerpets_client.gpu import parse_probe_text

    text = "\n".join(
        [
            "NVIDIA_ABSENT",
            "ENGINE",
            "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t20.25",
            "pid_2_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t30.5",
            "pid_3_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t0.04",
            "pid_1_luid_0x1_0x2_phys_0_eng_2_engtype_VideoDecode\t40",
            "pid_2_luid_0x1_0x2_phys_0_eng_2_engtype_VideoDecode\t15",
            "pid_1_luid_0x1_0x2_phys_0_eng_4_engtype_Copy\t5",
            "ENDENGINE",
            "END",
        ]
    )
    sample = sample_from_probe(parse_probe_text(text), platform="win32", now_ms=NOW)
    assert sample["source"] == "pdh"
    assert sample["utilPercent"] == 55
    over = "\n".join(
        [
            "NVIDIA_ABSENT",
            "ENGINE",
            "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t70",
            "pid_2_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t60",
            "ENDENGINE",
            "END",
        ]
    )
    assert sample_from_probe(parse_probe_text(over), platform="win32", now_ms=NOW)["utilPercent"] == 100
    small = "\n".join(
        [
            "NVIDIA_ABSENT",
            "ENGINE",
            "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t0.04",
            "pid_2_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t0.04",
            "ENDENGINE",
            "END",
        ]
    )
    assert sample_from_probe(parse_probe_text(small), platform="win32", now_ms=NOW)["utilPercent"] == 0.1
    busy = "\n".join(
        [
            "NVIDIA_ABSENT",
            "ENGINE",
            "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t110.8",
            "pid_2_luid_0x1_0x2_phys_0_eng_4_engtype_Copy\t2",
            "ENDENGINE",
            "END",
        ]
    )
    busy_sample = sample_from_probe(parse_probe_text(busy), platform="win32", now_ms=NOW)
    assert busy_sample["status"] == "read"
    assert busy_sample["utilPercent"] == 100
    broken = "\n".join(["NVIDIA_ABSENT", "ENGINE", "pid_1_luid_0x1_0x2_phys_0_eng_0_engtype_3D\t5000", "ENDENGINE", "END"])
    assert sample_from_probe(parse_probe_text(broken), platform="win32", now_ms=NOW)["utilPercent"] != 100


def test_saved_windows_counters_read_the_busiest_engine():
    from computerpets_client.gpu import parse_probe_text

    saved = Path(__file__).resolve().parents[2] / "desktop" / "renderer" / "fixtures" / "replay" / "gpu-win-pdh.txt"
    sample = sample_from_probe(parse_probe_text(saved.read_text(encoding="utf-8")), platform="win32", now_ms=NOW)
    # Video decode carries 4.2%. The old reading took one process's 3D share (0.5%).
    assert sample["utilPercent"] == 4.2
    assert gpu_line(sample) == "GPU · — · 4.2% · 1.5 GiB/— · —"

# Hand-built: two adapters that both report phys_0 (see fixtures/replay/README.md).
TWO_ADAPTER_LINE = "GPU · — · 12.5% · 2 GiB/8 GiB · —"
TWO_NO_LIMIT = "\n".join(
    [
        "NVIDIA_ABSENT",
        "ENGINE",
        "pid_1_luid_0x0_0xa1_phys_0_eng_0_engtype_3d\t70",
        "pid_2_luid_0x0_0xb2_phys_0_eng_0_engtype_3d\t9",
        "ENDENGINE",
        "MEMORY",
        "luid_0x0_0xa1_phys_0\t104857600\t",
        "luid_0x0_0xB2_phys_0\t3221225472\t",
        "ENDMEMORY",
        "END",
    ]
)
NVIDIA_BLANK_TWO = "\n".join(
    [
        "NVIDIA",
        "NVIDIA GeForce RTX 4070, 60, [N/A], 3200, 12288, 40",
        "ENDNVIDIA",
        "ENGINE",
        "pid_1_luid_0x0_0xa1_phys_0_eng_0_engtype_3d\t70",
        "pid_2_luid_0x0_0xb2_phys_0_eng_0_engtype_3d\t9",
        "ENDENGINE",
        "END",
    ]
)


def _reversed_blocks(text):
    out = []
    block = None
    for line in text.split("\n"):
        if line in ("ENGINE", "MEMORY"):
            out.append(line)
            block = []
        elif line in ("ENDENGINE", "ENDMEMORY"):
            out.extend(reversed(block))
            out.append(line)
            block = None
        elif block is not None:
            block.append(line)
        else:
            out.append(line)
    return "\n".join(out)


def test_two_adapters_sharing_phys_0_are_read_apart():
    from computerpets_client.gpu import parse_probe_text, reduce_pdh

    saved = Path(__file__).resolve().parents[2] / "desktop" / "renderer" / "fixtures" / "replay" / "gpu-win-two-adapters.txt"
    text = saved.read_text(encoding="utf-8")
    parsed = parse_probe_text(text)
    reduced = reduce_pdh(parsed["engines"], parsed["adapterMemory"])
    # One row per adapter LUID, not one row for phys_0.
    assert [row["utilPercent"] for row in reduced["rows"]] == [61.5, 12.5]
    assert [row["memoryTotalBytes"] for row in reduced["rows"]] == [536870912, 8589934592]
    sample = sample_from_probe(parsed, platform="win32", now_ms=NOW)
    # The 8 GiB adapter wins. The integrated adapter's 61.5% and 128 MiB stay off its line.
    assert sample["source"] == "pdh"
    assert sample["utilPercent"] == 12.5
    assert sample["memoryUsedBytes"] == 2147483648
    assert gpu_line(sample) == TWO_ADAPTER_LINE
    # The order the counters list them in does not change the choice.
    flipped = sample_from_probe(parse_probe_text(_reversed_blocks(text)), platform="win32", now_ms=NOW)
    assert gpu_line(flipped) == TWO_ADAPTER_LINE


def test_no_vram_limit_shows_the_adapter_holding_the_most_memory():
    from computerpets_client.gpu import parse_probe_text

    sample = sample_from_probe(parse_probe_text(TWO_NO_LIMIT), platform="win32", now_ms=NOW)
    assert sample["utilPercent"] == 9
    assert gpu_line(sample) == "GPU · — · 9% · 3 GiB/— · —"


def test_nvidia_blanks_are_not_filled_when_two_counter_adapters_share_an_index():
    from computerpets_client.gpu import parse_probe_text

    sample = sample_from_probe(parse_probe_text(NVIDIA_BLANK_TWO), platform="win32", now_ms=NOW)
    assert sample["source"] == "nvidia-smi"
    assert sample["utilPercent"] is None
