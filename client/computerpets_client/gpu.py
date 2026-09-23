"""Desktop-local GPU sense. Windows and Linux nvidia-smi. Mac reads IOAccelerator.

Spring Boot is not the pet's GPU. There is no ``/metrics/gpu`` door.
Temperature, utilization, memory, and power come from nvidia-smi, or from
Windows GPU performance counters. Linux runs the same nvidia-smi query.
When that binary is missing, the Linux probe reads amdgpu sysfs into the
same line. i915 and xe sysfs stay unread (``INTEL_EMPTY``). Mac runs ``ioreg`` on IOAccelerator
PerformanceStatistics and prints that same line. A missing tool stays unread.
Temperature and power on Mac, and on the amdgpu line, stay unread. A missing,
malformed, or stale reading stays unread. A real zero from the hardware is
kept. The sparkline is a trail of those read samples and stays empty until
two fresh utilization points exist.
"""

from __future__ import annotations

import math
import re
import subprocess
import sys
import time
from pathlib import Path

STALE_MS = 20000
LATER_DOOR = "unsupported"
SOURCES = ("nvidia-smi", "pdh", "nvidia-smi+pdh", "ioaccelerator", "amdgpu")
METRIC_KEYS = ("tempC", "utilPercent", "memoryUsedBytes", "memoryTotalBytes", "powerWatts")
_NA = re.compile(r"^\[?\s*(n/a|not supported)\s*\]?$", re.I)
_NUM = re.compile(r"^-?\d+(\.\d+)?$")
_WIN = re.compile(r"^Win", re.I)
_MAC = re.compile(r"^Mac", re.I)
_LINUX = re.compile(r"^Linux", re.I)
_PHYS = re.compile(r"phys_(\d+)")
_HEADER = re.compile(r"^name\s*,", re.I)
_3D = re.compile(r"engtype_3D", re.I)


def is_windows(platform: str | None) -> bool:
    text = platform or ""
    return text == "win32" or bool(_WIN.search(text))


def senses_on(platform: str | None) -> bool:
    return is_windows(platform) or is_linux(platform) or is_mac(platform)


def is_mac(platform: str | None) -> bool:
    text = platform or ""
    return text == "darwin" or bool(_MAC.search(text))


def is_linux(platform: str | None) -> bool:
    text = platform or ""
    return text == "linux" or bool(_LINUX.search(text))


def later_door(platform: str | None) -> str | None:
    if senses_on(platform):
        return None
    return LATER_DOOR


def round1(n: float) -> float:
    return math.floor(n * 10 + 0.5) / 10


def round_int(n: float) -> int:
    return int(math.floor(n + 0.5))


def _stamp(read_at_ms) -> int | None:
    if isinstance(read_at_ms, bool) or not isinstance(read_at_ms, (int, float)):
        return None
    if not math.isfinite(read_at_ms):
        return None
    return int(read_at_ms) if isinstance(read_at_ms, int) or read_at_ms == int(read_at_ms) else read_at_ms


def blank(status: str, reason: str, platform, read_at_ms) -> dict:
    return {
        "status": status,
        "platform": platform or None,
        "name": None,
        "source": None,
        "index": None,
        "tempC": None,
        "utilPercent": None,
        "memoryUsedBytes": None,
        "memoryTotalBytes": None,
        "powerWatts": None,
        "readAtMs": _stamp(read_at_ms),
        "reason": reason or status,
    }


UNREAD = blank("unread", "missing", None, None)


def _finite_in(value, low, high):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    if not math.isfinite(value) or value < low or value > high:
        return None
    return value


def _clean_name(value):
    if not isinstance(value, str):
        return None
    name = value.strip()
    return name or None


def _clean_source(value):
    return value if value in SOURCES else None


def _clean_index(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    if not math.isfinite(value) or value < 0 or math.floor(value) != value:
        return None
    return int(value)


def _metrics_from(raw: dict) -> tuple[dict, bool, bool]:
    offered = any(raw.get(key) is not None for key in METRIC_KEYS)
    temp = _finite_in(raw.get("tempC"), -40, 125)
    util = _finite_in(raw.get("utilPercent"), 0, 100)
    used = _finite_in(raw.get("memoryUsedBytes"), 0, 2**48)
    total = _finite_in(raw.get("memoryTotalBytes"), 0, 2**48)
    power = _finite_in(raw.get("powerWatts"), 0, 2000)
    if used is not None and total is not None and used > total:
        used = None
        total = None
    metrics = {
        "tempC": None if temp is None else round1(temp),
        "utilPercent": None if util is None else round1(util),
        "memoryUsedBytes": None if used is None else round_int(used),
        "memoryTotalBytes": None if total is None else round_int(total),
        "powerWatts": None if power is None else round1(power),
    }
    any_metric = any(metrics[key] is not None for key in METRIC_KEYS)
    return metrics, any_metric, offered


def parse_sample(raw) -> dict:
    if raw is None:
        return blank("unread", "missing", None, None)
    if not isinstance(raw, dict):
        return blank("malformed", "malformed", None, None)
    platform = raw.get("platform") if isinstance(raw.get("platform"), str) and raw.get("platform") else None
    read_at = _stamp(raw.get("readAtMs"))
    if platform and not senses_on(platform):
        return blank("unsupported", LATER_DOOR, platform, read_at)
    status = raw.get("status")
    if status == "unsupported":
        return blank("unsupported", LATER_DOOR, platform, read_at)
    if status == "malformed":
        return blank("malformed", "malformed", platform, read_at)
    if status == "stale":
        return blank("stale", "stale", platform, read_at)
    if status == "unread":
        reason = raw.get("reason") if isinstance(raw.get("reason"), str) and raw.get("reason") else "missing"
        return blank("unread", reason, platform, read_at)
    metrics, any_metric, offered = _metrics_from(raw)
    if not any_metric:
        return blank("malformed" if offered else "unread", "malformed" if offered else "missing", platform, read_at)
    if read_at is None:
        return blank("malformed", "malformed", platform, None)
    return {
        "status": "read",
        "platform": platform,
        "name": _clean_name(raw.get("name")),
        "source": _clean_source(raw.get("source")),
        "index": _clean_index(raw.get("index")),
        **metrics,
        "readAtMs": read_at,
        "reason": None,
    }


def present(sample, now_ms) -> dict:
    clean = parse_sample(sample)
    if clean["status"] != "read":
        return clean
    if isinstance(now_ms, bool) or not isinstance(now_ms, (int, float)) or not math.isfinite(now_ms):
        return blank("malformed", "malformed", clean["platform"], clean["readAtMs"])
    age = now_ms - clean["readAtMs"]
    if age < -5000:
        return blank("malformed", "malformed", clean["platform"], clean["readAtMs"])
    if age > STALE_MS:
        return blank("stale", "stale", clean["platform"], clean["readAtMs"])
    return clean


def _fmt_rounded(n: float) -> str:
    rounded = math.floor(n * 10 + 0.5) / 10
    if abs(rounded - math.trunc(rounded)) < 1e-9:
        return str(math.trunc(rounded))
    return f"{rounded:.1f}"


def _fmt_bytes(n: float) -> str:
    gib = n / (1024 * 1024 * 1024)
    if gib >= 1:
        return f"{_fmt_rounded(gib)} GiB"
    return f"{round_int(n / (1024 * 1024))} MiB"


def _fmt_mem(used, total) -> str:
    if used is None and total is None:
        return "unread"
    if used is None:
        return f"unread/{_fmt_bytes(total)}"
    if total is None:
        return f"{_fmt_bytes(used)}/unread"
    return f"{_fmt_bytes(used)}/{_fmt_bytes(total)}"


def _fmt_measure(n, suffix: str) -> str:
    if isinstance(n, bool) or not isinstance(n, (int, float)) or not math.isfinite(n):
        return "unread"
    return f"{_fmt_rounded(n)}{suffix}"


def gpu_line(sample) -> str:
    clean = parse_sample(sample)
    if clean["status"] == "unsupported":
        return f"GPU unread · {LATER_DOOR}"
    if clean["status"] == "stale":
        return "GPU unread · stale"
    if clean["status"] == "malformed":
        return "GPU unread · malformed"
    if clean["status"] != "read":
        return "GPU unread"
    name = clean["name"] or "unread"
    return (
        f"GPU {name} · {_fmt_measure(clean['tempC'], '°C')} · {_fmt_measure(clean['utilPercent'], '%')} · "
        f"{_fmt_mem(clean['memoryUsedBytes'], clean['memoryTotalBytes'])} · {_fmt_measure(clean['powerWatts'], ' W')}"
    )


READ_INK = "#9a9288"
UNREAD_INK = "#5c564e"
SPARK_W = 72
SPARK_H = 14
SPARK_PAD = 1
SPARK_MAX = 24


def ink(sample) -> str:
    return READ_INK if parse_sample(sample)["status"] == "read" else UNREAD_INK


def empty_history() -> list:
    return []


def _fmt_tenths(n: float) -> str:
    tenths = int(math.floor(n * 10 + 0.5))
    whole = tenths // 10
    frac = abs(tenths % 10)
    if frac == 0:
        return str(whole)
    return f"{whole}.{frac}"


def _fresh_stamp(read_at_ms, now_ms) -> bool:
    if isinstance(read_at_ms, bool) or not isinstance(read_at_ms, (int, float)) or not math.isfinite(read_at_ms):
        return False
    if isinstance(now_ms, bool) or not isinstance(now_ms, (int, float)) or not math.isfinite(now_ms):
        return False
    age = now_ms - read_at_ms
    return age >= -5000 and age <= STALE_MS


def _point_from(sample: dict) -> dict:
    return {
        "readAtMs": sample["readAtMs"],
        "tempC": sample["tempC"],
        "utilPercent": sample["utilPercent"],
        "memoryUsedBytes": sample["memoryUsedBytes"],
        "memoryTotalBytes": sample["memoryTotalBytes"],
        "powerWatts": sample["powerWatts"],
    }


def _clean_point(row) -> dict | None:
    if not isinstance(row, dict):
        return None
    read_at = _stamp(row.get("readAtMs"))
    if read_at is None:
        return None
    temp = _finite_in(row.get("tempC"), -40, 125)
    util = _finite_in(row.get("utilPercent"), 0, 100)
    used = _finite_in(row.get("memoryUsedBytes"), 0, 2**48)
    total = _finite_in(row.get("memoryTotalBytes"), 0, 2**48)
    power = _finite_in(row.get("powerWatts"), 0, 2000)
    if used is not None and total is not None and used > total:
        used = None
        total = None
    point = {
        "readAtMs": read_at,
        "tempC": None if temp is None else round1(temp),
        "utilPercent": None if util is None else round1(util),
        "memoryUsedBytes": None if used is None else round_int(used),
        "memoryTotalBytes": None if total is None else round_int(total),
        "powerWatts": None if power is None else round1(power),
    }
    if not any(point[key] is not None for key in METRIC_KEYS):
        return None
    return point


def _trim_history(history, now_ms) -> list:
    if isinstance(now_ms, bool) or not isinstance(now_ms, (int, float)) or not math.isfinite(now_ms):
        return []
    rows = history if isinstance(history, list) else []
    kept = []
    for row in rows:
        point = _clean_point(row)
        if point is None or not _fresh_stamp(point["readAtMs"], now_ms):
            continue
        kept.append(point)
    kept.sort(key=lambda point: point["readAtMs"])
    if len(kept) > SPARK_MAX:
        return kept[-SPARK_MAX:]
    return kept


def remember(history, sample, now_ms) -> list:
    kept = _trim_history(history, now_ms)
    clean = present(sample, now_ms)
    if clean["status"] != "read" or not _fresh_stamp(clean["readAtMs"], now_ms):
        return kept
    next_points = [point for point in kept if point["readAtMs"] != clean["readAtMs"]]
    next_points.append(_point_from(clean))
    next_points.sort(key=lambda point: point["readAtMs"])
    if len(next_points) > SPARK_MAX:
        return next_points[-SPARK_MAX:]
    return next_points


def _spark_coord(index: int, count: int, util: float) -> dict:
    span = SPARK_W - SPARK_PAD * 2
    x = round1(SPARK_PAD + (index * span) / (count - 1))
    y = round1(SPARK_PAD + ((100 - util) * (SPARK_H - SPARK_PAD * 2)) / 100)
    return {"x": x, "y": y}


def sparkline(history, sample, now_ms) -> dict:
    shown = present(sample, now_ms)
    fresh = _trim_history(history, now_ms) if shown["status"] == "read" else []
    util_points = [point for point in fresh if isinstance(point["utilPercent"], (int, float)) and not isinstance(point["utilPercent"], bool)]
    if shown["status"] != "read" or len(util_points) < 2:
        return {"empty": True, "ink": UNREAD_INK, "history": fresh, "points": [], "path": "", "coords": []}
    coords = [_spark_coord(index, len(util_points), point["utilPercent"]) for index, point in enumerate(util_points)]
    path = "".join(
        f"{'M' if index == 0 else ' L'}{_fmt_tenths(coord['x'])} {_fmt_tenths(coord['y'])}"
        for index, coord in enumerate(coords)
    )
    return {"empty": False, "ink": READ_INK, "history": fresh, "points": util_points, "path": path, "coords": coords}


def _metric_token(token):
    if token is None:
        return {"state": "missing", "value": None}
    text = str(token).strip()
    if not text or _NA.match(text):
        return {"state": "missing", "value": None}
    if not _NUM.match(text):
        return {"state": "bad", "value": None}
    try:
        n = float(text)
    except ValueError:
        return {"state": "bad", "value": None}
    if not math.isfinite(n):
        return {"state": "bad", "value": None}
    return {"state": "ok", "value": n}


def _ranged(token, low, high, digits: str):
    if not token or token["state"] == "missing":
        return None
    if token["state"] != "ok":
        return "bad"
    if token["value"] < low or token["value"] > high:
        return "bad"
    return round_int(token["value"]) if digits == "int" else round1(token["value"])


def _mib_to_bytes(token):
    mib = _ranged(token, 0, 2**24, "int")
    if mib == "bad" or mib is None:
        return mib
    return round_int(mib * 1024 * 1024)


def _row_has_metric(row: dict) -> bool:
    return any(row.get(key) is not None for key in METRIC_KEYS)


def parse_nvidia_csv(text) -> dict:
    if text is None:
        return {"rows": [], "malformed": False, "rejected": False}
    if not isinstance(text, str):
        return {"rows": [], "malformed": True, "rejected": False}
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return {"rows": [], "malformed": False, "rejected": False}
    rows = []
    structural = False
    for line in lines:
        if _HEADER.match(line) and "temperature" in line.lower():
            continue
        parts = [part.strip() for part in line.split(",")]
        if len(parts) < 6:
            structural = True
            continue
        temp = _ranged(_metric_token(parts[-5]), -40, 125, "1")
        util = _ranged(_metric_token(parts[-4]), 0, 100, "1")
        used = _mib_to_bytes(_metric_token(parts[-3]))
        total = _mib_to_bytes(_metric_token(parts[-2]))
        power = _ranged(_metric_token(parts[-1]), 0, 2000, "1")
        bad = any(value == "bad" for value in (temp, util, used, total, power))
        name = ", ".join(parts[:-5]).strip() or None
        row = {
            "index": len(rows),
            "name": name,
            "tempC": None if temp == "bad" else temp,
            "utilPercent": None if util == "bad" else util,
            "memoryUsedBytes": None if used == "bad" else used,
            "memoryTotalBytes": None if total == "bad" else total,
            "powerWatts": None if power == "bad" else power,
            "bad": bad,
        }
        if (
            row["memoryUsedBytes"] is not None
            and row["memoryTotalBytes"] is not None
            and row["memoryUsedBytes"] > row["memoryTotalBytes"]
        ):
            row["memoryUsedBytes"] = None
            row["memoryTotalBytes"] = None
            row["bad"] = True
        rows.append(row)
    if not rows and structural:
        return {"rows": [], "malformed": True, "rejected": False}
    rejected = any(row["bad"] and not _row_has_metric(row) for row in rows)
    return {"rows": rows, "malformed": False, "rejected": rejected}


def _phys_of(instance):
    match = _PHYS.search(str(instance or ""))
    return int(match.group(1)) if match else None


def reduce_pdh(engines, adapter_memory) -> dict:
    if engines is None and adapter_memory is None:
        return {"rows": [], "malformed": False, "rejected": False}
    if (engines is not None and not isinstance(engines, list)) or (
        adapter_memory is not None and not isinstance(adapter_memory, list)
    ):
        return {"rows": [], "malformed": True, "rejected": False}
    by_phys: dict[int, dict] = {}

    def bucket(phys: int) -> dict:
        if phys not in by_phys:
            by_phys[phys] = {
                "index": phys,
                "utils3d": [],
                "utils": [],
                "used": [],
                "limit": [],
                "rejected": False,
            }
        return by_phys[phys]

    bad_shape = False
    for row in engines or []:
        if not isinstance(row, dict):
            bad_shape = True
            continue
        phys = _phys_of(row.get("instance"))
        if phys is None:
            bad_shape = True
            continue
        if row.get("util") is None:
            continue
        util = _ranged(_metric_token(str(row.get("util"))), 0, 100, "1")
        slot = bucket(phys)
        if util == "bad" or util is None:
            slot["rejected"] = True
            continue
        if _3D.search(str(row.get("instance"))):
            slot["utils3d"].append(util)
        else:
            slot["utils"].append(util)
    for row in adapter_memory or []:
        if not isinstance(row, dict):
            bad_shape = True
            continue
        phys = _phys_of(row.get("instance"))
        if phys is None:
            bad_shape = True
            continue
        slot = bucket(phys)
        if row.get("dedicatedUsage") is not None:
            used = _finite_in(row.get("dedicatedUsage"), 0, 2**48)
            if used is None:
                bad_shape = True
            else:
                slot["used"].append(round_int(used))
        if row.get("dedicatedLimit") is not None:
            limit = _finite_in(row.get("dedicatedLimit"), 0, 2**48)
            if limit is None:
                bad_shape = True
            else:
                slot["limit"].append(round_int(limit))
    rows = []
    for slot in by_phys.values():
        if slot["utils3d"]:
            util_percent = max(slot["utils3d"])
        elif slot["utils"]:
            util_percent = max(slot["utils"])
        else:
            util_percent = None
        memory_used = sum(slot["used"]) if slot["used"] else None
        memory_total = max(slot["limit"]) if slot["limit"] else None
        if memory_used is not None and memory_total is not None and memory_used > memory_total:
            memory_used = None
            memory_total = None
        rows.append(
            {
                "index": slot["index"],
                "name": None,
                "tempC": None,
                "utilPercent": util_percent,
                "memoryUsedBytes": memory_used,
                "memoryTotalBytes": memory_total,
                "powerWatts": None,
                "bad": False,
                "rejected": slot["rejected"],
            }
        )
    rejected = any(row["rejected"] and not _row_has_metric(row) for row in rows)
    if not rows and bad_shape:
        return {"rows": [], "malformed": True, "rejected": False}
    return {"rows": rows, "malformed": False, "rejected": rejected}


def _pick_best(rows: list[dict]):
    best = None
    best_count = 0
    for row in rows:
        count = sum(1 for key in METRIC_KEYS if row.get(key) is not None)
        if not count:
            continue
        if best is None or count > best_count or (count == best_count and row["index"] < best["index"]):
            best = row
            best_count = count
    return best


def sample_from_probe(probe, *, platform: str | None, now_ms) -> dict:
    now = _stamp(now_ms)
    if not senses_on(platform):
        return blank("unsupported", LATER_DOOR, platform or None, now)
    if probe is None:
        return blank("unread", "missing", platform, now)
    if not isinstance(probe, dict):
        return blank("malformed", "malformed", platform, now)
    if probe.get("malformed"):
        return blank("malformed", "malformed", platform, now)
    nvidia = parse_nvidia_csv(probe.get("nvidiaCsv"))
    amd = parse_nvidia_csv(probe.get("amdgpuCsv"))
    pdh = reduce_pdh(probe.get("engines"), probe.get("adapterMemory"))
    nvidia_rows = [] if nvidia["malformed"] else nvidia["rows"]
    amd_rows = [] if amd["malformed"] else amd["rows"]
    pdh_rows = [] if pdh["malformed"] else pdh["rows"]
    nvidia_best = _pick_best(nvidia_rows)
    amd_best = _pick_best(amd_rows)
    pdh_best = _pick_best(pdh_rows)
    nvidia_count = sum(1 for row in nvidia_rows if _row_has_metric(row))
    pdh_count = sum(1 for row in pdh_rows if _row_has_metric(row))
    if nvidia_best is None and amd_best is None and pdh_best is None:
        if (
            nvidia["malformed"]
            or amd["malformed"]
            or pdh["malformed"]
            or nvidia["rejected"]
            or amd["rejected"]
            or pdh["rejected"]
        ):
            return blank("malformed", "malformed", platform, now)
        return blank("unread", "missing", platform, now)
    if nvidia_best and pdh_best and nvidia_count == 1 and pdh_count == 1:
        chosen = {
            "index": nvidia_best["index"],
            "name": nvidia_best["name"],
            "tempC": nvidia_best["tempC"],
            "utilPercent": nvidia_best["utilPercent"],
            "memoryUsedBytes": nvidia_best["memoryUsedBytes"],
            "memoryTotalBytes": nvidia_best["memoryTotalBytes"],
            "powerWatts": nvidia_best["powerWatts"],
        }
        filled = False
        for key in METRIC_KEYS:
            if chosen[key] is None and pdh_best.get(key) is not None:
                chosen[key] = pdh_best[key]
                filled = True
        source = "nvidia-smi+pdh" if filled else ("ioaccelerator" if is_mac(platform) else "nvidia-smi")
    elif nvidia_best:
        chosen = nvidia_best
        source = "ioaccelerator" if is_mac(platform) else "nvidia-smi"
    elif amd_best:
        chosen = amd_best
        source = "amdgpu"
    else:
        chosen = pdh_best
        source = "pdh"
    if now is None:
        return blank("malformed", "malformed", platform, None)
    return parse_sample(
        {
            "status": "read",
            "platform": platform,
            "name": chosen["name"],
            "source": source,
            "index": chosen["index"],
            "tempC": chosen["tempC"],
            "utilPercent": chosen["utilPercent"],
            "memoryUsedBytes": chosen["memoryUsedBytes"],
            "memoryTotalBytes": chosen["memoryTotalBytes"],
            "powerWatts": chosen["powerWatts"],
            "readAtMs": now,
        }
    )


def parse_probe_text(text) -> dict:
    if not isinstance(text, str) or not text.strip():
        return {"malformed": True}
    lines = text.splitlines()
    if not any(line.strip() == "END" for line in lines):
        return {"malformed": True}
    nvidia_csv = None
    amdgpu_csv = None
    engines = None
    adapter_memory = None
    mode = None
    nvidia_lines: list[str] = []
    amdgpu_lines: list[str] = []
    for line in lines:
        tag = line.strip()
        if tag == "END":
            break
        if tag == "NVIDIA_ABSENT":
            nvidia_csv = None
            mode = None
            continue
        if tag == "NVIDIA_EMPTY":
            nvidia_csv = ""
            mode = None
            continue
        if tag == "NVIDIA":
            mode = "nvidia"
            nvidia_lines = []
            continue
        if tag == "ENDNVIDIA":
            nvidia_csv = "\n".join(nvidia_lines)
            mode = None
            continue
        if tag == "AMDGPU_ABSENT":
            amdgpu_csv = None
            mode = None
            continue
        if tag == "AMDGPU_EMPTY":
            amdgpu_csv = ""
            mode = None
            continue
        if tag == "AMDGPU":
            mode = "amdgpu"
            amdgpu_lines = []
            continue
        if tag == "ENDAMDGPU":
            amdgpu_csv = "\n".join(amdgpu_lines)
            mode = None
            continue
        if tag == "INTEL_ABSENT" or tag == "INTEL_EMPTY":
            mode = None
            continue
        if tag == "ENGINE_ABSENT":
            engines = None
            mode = None
            continue
        if tag == "ENGINE":
            mode = "engine"
            engines = []
            continue
        if tag == "ENDENGINE":
            mode = None
            continue
        if tag == "MEMORY_ABSENT":
            adapter_memory = None
            mode = None
            continue
        if tag == "MEMORY":
            mode = "memory"
            adapter_memory = []
            continue
        if tag == "ENDMEMORY":
            mode = None
            continue
        if mode == "nvidia":
            nvidia_lines.append(tag)
        elif mode == "amdgpu":
            amdgpu_lines.append(tag)
        elif mode == "engine":
            bits = line.split("\t")
            if len(bits) != 2:
                return {"malformed": True}
            util = _metric_token(bits[1])
            if util["state"] == "bad":
                return {"malformed": True}
            engines.append({"instance": bits[0].strip(), "util": util["value"]})
        elif mode == "memory":
            bits = line.split("\t")
            if len(bits) != 3:
                return {"malformed": True}
            used = {"state": "missing", "value": None} if bits[1].strip() == "" else _metric_token(bits[1])
            limit = {"state": "missing", "value": None} if bits[2].strip() == "" else _metric_token(bits[2])
            if used["state"] == "bad" or limit["state"] == "bad":
                return {"malformed": True}
            adapter_memory.append(
                {
                    "instance": bits[0].strip(),
                    "dedicatedUsage": used["value"],
                    "dedicatedLimit": limit["value"],
                }
            )
    return {
        "nvidiaCsv": nvidia_csv,
        "amdgpuCsv": amdgpu_csv,
        "engines": engines,
        "adapterMemory": adapter_memory,
        "malformed": False,
    }


def probe_script() -> Path:
    return Path(__file__).resolve().parents[2] / "desktop" / "gpu-probe.ps1"


def linux_probe_script() -> Path:
    return Path(__file__).resolve().parents[2] / "desktop" / "gpu-probe.sh"


def mac_probe_script() -> Path:
    return Path(__file__).resolve().parents[2] / "desktop" / "gpu-probe-mac.sh"


def initial_sample(platform: str | None = None, now_ms=None) -> dict:
    plat = sys.platform if platform is None else platform
    now = _stamp(now_ms if now_ms is not None else time.time() * 1000)
    if not senses_on(plat):
        return blank("unsupported", LATER_DOOR, plat, now)
    return blank("unread", "missing", plat, now)


def read_local(platform: str | None = None, now_ms=None) -> dict:
    plat = sys.platform if platform is None else platform
    now = _stamp(now_ms if now_ms is not None else time.time() * 1000)
    if not senses_on(plat):
        return present({"status": "unsupported", "platform": plat, "readAtMs": now}, now)
    try:
        if is_mac(plat):
            script = mac_probe_script()
            if not script.is_file():
                raise FileNotFoundError(script)
            command = ["/bin/sh", str(script)]
        elif is_linux(plat):
            script = linux_probe_script()
            if not script.is_file():
                raise FileNotFoundError(script)
            command = ["/bin/sh", str(script)]
        else:
            script = probe_script()
            if not script.is_file():
                raise FileNotFoundError(script)
            command = [
                "powershell.exe",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(script),
            ]
        proc = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=8,
            check=False,
        )
        if not (proc.stdout or "").strip():
            raise RuntimeError(f"gpu probe exit {proc.returncode}")
        parsed = parse_probe_text(proc.stdout)
    except Exception:
        return parse_sample({"status": "unread", "platform": plat, "reason": "probe-failed", "readAtMs": now})
    if parsed.get("malformed"):
        return parse_sample({"status": "malformed", "platform": plat, "readAtMs": now})
    return sample_from_probe(parsed, platform=plat, now_ms=now)
