"""The Python ethogram must match the web and desktop ethograms, row for row.

``web/src/lib/pets/ethogram.ts`` and ``desktop/renderer/ethogram.js`` are the
source of truth. This test reads those files from the repo (no copied list),
so any drift between the three fails the suite. It also enforces the same
uniqueness rules the web and desktop trick-names-unique tests enforce: no
``*_soft`` name and no long-hold (``sit_hold``) name sits in two guests' rows,
and no idle trick or feed-happy thank-you name is used by two guests, even
across the two kinds. The trick modules are read from the repo too.
"""

from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

from computerpets_client.ethogram import ETHOGRAM

ROOT = Path(__file__).resolve().parents[2]
WEB = ROOT / "web" / "src" / "lib" / "pets" / "ethogram.ts"
DESKTOP = ROOT / "desktop" / "renderer" / "ethogram.js"
WEB_PETS = WEB.parent
DESKTOP_RENDERER = DESKTOP.parent
# Rui is the one trick module named for the guest rather than the kind; every other
# module is the kind key, the kind key without "_dragon", or names its key in its header.
MODULE_ALIASES = {"rui": "red_panda"}

_ROW = re.compile(r'^\s*"?([a-z_]+)"?:\s*\[([^\]]*)\],?\s*$', re.M)
_ACT = re.compile(
    r'A\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*"([^"]+)"\s*)?\)'
)


def _block(src: str) -> str:
    """The ETHOGRAM object literal: from its opening brace to the first closing ``};`` line."""
    open_brace = src.index("{", src.index("const ETHOGRAM"))
    close = re.compile(r"^\s*};", re.M).search(src, open_brace)
    assert close, "ETHOGRAM object has no closing brace"
    return src[open_brace + 1 : close.start()]


def _parse(path: Path) -> dict[str, list[tuple]]:
    body = _block(path.read_text(encoding="utf-8"))
    rows: dict[str, list[tuple]] = {}
    for m in _ROW.finditer(body):
        key, inner = m.group(1), m.group(2)
        acts = [
            (a.group(1), a.group(2), float(a.group(3)), float(a.group(4)), a.group(5))
            for a in _ACT.finditer(inner)
        ]
        assert inner.count("A(") == len(acts), f"{path.name}: unparsed act in row {key}"
        assert key not in rows, f"{path.name}: duplicate row {key}"
        rows[key] = acts
    assert body.count("A(") == sum(len(v) for v in rows.values()), f"{path.name}: act outside a parsed row"
    return rows


def _python_rows() -> dict[str, list[tuple]]:
    return {
        key: [(a["name"], a["motion"], float(a["hold"]), float(a["weight"]), a.get("anim")) for a in acts]
        for key, acts in ETHOGRAM.items()
    }


def _shared(rows: dict[str, list[tuple]], want) -> list[str]:
    owners: dict[str, list[str]] = defaultdict(list)
    for key, acts in rows.items():
        for act in acts:
            if want(act) and key not in owners[act[0]]:
                owners[act[0]].append(key)
    return sorted(f"{name}: {', '.join(keys)}" for name, keys in owners.items() if len(keys) > 1)


def test_source_files_parse_with_every_guest():
    web, desktop = _parse(WEB), _parse(DESKTOP)
    assert len(web) >= 220
    assert len(desktop) >= 220
    assert sum(len(v) for v in web.values()) >= 1500


def test_python_rows_match_web_row_for_row():
    web, py = _parse(WEB), _python_rows()
    assert sorted(set(web) - set(py)) == []
    assert sorted(set(py) - set(web)) == []
    drift = [key for key in web if web[key] != py[key]]
    assert drift == [], {key: {"web": web[key], "python": py[key]} for key in drift[:3]}


def test_python_rows_match_desktop_row_for_row():
    desktop, py = _parse(DESKTOP), _python_rows()
    assert sorted(set(desktop) - set(py)) == []
    assert sorted(set(py) - set(desktop)) == []
    drift = [key for key in desktop if desktop[key] != py[key]]
    assert drift == [], {key: {"desktop": desktop[key], "python": py[key]} for key in drift[:3]}


def test_web_and_desktop_agree_so_the_source_of_truth_is_one_map():
    web, desktop = _parse(WEB), _parse(DESKTOP)
    drift = sorted(key for key in set(web) | set(desktop) if web.get(key) != desktop.get(key))
    assert drift == []


def test_no_soft_name_sits_in_two_guests_rows():
    assert _shared(_python_rows(), lambda act: act[0].endswith("_soft")) == []


def test_no_hold_name_sits_in_two_guests_rows():
    assert _shared(_python_rows(), lambda act: act[1] == "sit_hold") == []

def _trick_modules(folder: Path, ext: str, pattern: str) -> dict[str, dict[str, list[str]]]:
    """Each ``<guest>-tricks`` module's TRICKS and HAPPY names, keyed by module name."""
    out: dict[str, dict[str, list[str]]] = {}
    for path in sorted(folder.glob(f"*-tricks{ext}")):
        found = {
            m.group(1): re.findall(r'"([^"]+)"', m.group(2))
            for m in re.finditer(pattern, path.read_text(encoding="utf-8"))
        }
        if found:
            out[path.name[: -len(f"-tricks{ext}")]] = found
    return out


def _web_tricks() -> dict[str, dict[str, list[str]]]:
    return _trick_modules(WEB_PETS, ".ts", r"export const (TRICKS|HAPPY) = \[([^\]]*)\]")


def _desktop_tricks() -> dict[str, dict[str, list[str]]]:
    return _trick_modules(DESKTOP_RENDERER, ".js", r"const (TRICKS|HAPPY) = \[([^\]]*)\]")


def _module_guest(module: str) -> str | None:
    key = MODULE_ALIASES.get(module, module.replace("-", "_"))
    if key in ETHOGRAM:
        return key
    if f"{key}_dragon" in ETHOGRAM:
        return f"{key}_dragon"
    header = (WEB_PETS / f"{module}-tricks.ts").read_text(encoding="utf-8").splitlines()[0]
    named = [word for word in re.findall(r"[a-z_]+", header) if word in ETHOGRAM]
    return named[0] if named else None


def _owners(modules: dict[str, dict[str, list[str]]], kinds=("TRICKS", "HAPPY")) -> dict[str, list[str]]:
    owners: dict[str, list[str]] = defaultdict(list)
    for module, found in modules.items():
        for kind in kinds:
            for name in found.get(kind, []):
                if module not in owners[name]:
                    owners[name].append(module)
    return owners


def _shared_owners(owners: dict[str, list[str]]) -> list[str]:
    return sorted(f"{name}: {', '.join(keys)}" for name, keys in owners.items() if len(keys) > 1)


def test_web_and_desktop_trick_modules_agree():
    web, desktop = _web_tricks(), _desktop_tricks()
    assert len(web) >= 220
    assert sorted(set(web) ^ set(desktop)) == []
    assert sorted(module for module in web if web[module] != desktop[module]) == []


def test_every_trick_module_belongs_to_one_ethogram_guest():
    guests = {module: _module_guest(module) for module in _web_tricks()}
    assert sorted(module for module, key in guests.items() if key is None) == []
    assert len(set(guests.values())) == len(guests)


def test_no_idle_trick_or_thank_you_name_is_shared_by_two_guests():
    for modules in (_web_tricks(), _desktop_tricks()):
        assert _shared_owners(_owners(modules, ("TRICKS",))) == []
        assert _shared_owners(_owners(modules, ("HAPPY",))) == []
        assert _shared_owners(_owners(modules)) == []


def test_no_soft_or_hold_name_is_another_guests_trick_or_thank_you():
    owners = {
        name: {_module_guest(module) for module in modules}
        for name, modules in _owners(_web_tricks()).items()
    }
    clashes = sorted(
        f"{key}.{name} is also {', '.join(sorted(owners[name] - {key}))}'s"
        for key, acts in _python_rows().items()
        for name, motion, *_ in acts
        if (name.endswith("_soft") or motion == "sit_hold") and owners.get(name, set()) - {key}
    )
    assert clashes == []