"""Python floor: 3.10 (the oldest Python the suite has run on), nothing needs 3.11, and an older Python is told so at start."""

from __future__ import annotations

import ast
import io
import re
import sys
from pathlib import Path

import pytest

import computerpets_client as pkg

CLIENT = Path(__file__).resolve().parents[1]
PKG = CLIENT / "computerpets_client"
ROOT = CLIENT.parent


def test_the_floor_is_three_ten_everywhere_it_is_written():
    assert pkg.MIN_PYTHON == (3, 10)
    assert 'requires-python = ">=3.10"' in (CLIENT / "pyproject.toml").read_text(encoding="utf-8")
    assert "Python 3.10+ (3.12 recommended)" in (CLIENT / "README.md").read_text(encoding="utf-8")
    start = (ROOT / "docs" / "START-HERE.md").read_text(encoding="utf-8")
    assert "**Python 3.10 or newer**" in start
    assert "You need 3.10 or newer." in start
    assert "3.10 or newer (3.12+ recommended)" in (ROOT / "docs" / "SETUP.md").read_text(encoding="utf-8")
    for doc in ("docs/START-HERE.md", "docs/SETUP.md", "docs/CONTRIBUTING.md", "client/README.md", "docs/APP-HARNESS.md"):
        text = (ROOT / doc).read_text(encoding="utf-8")
        assert not re.search(r"Python 3\.11|3\.11 or newer|>=3\.11", text), doc


def test_this_python_is_new_enough():
    assert pkg.python_too_old_message() is None
    assert pkg.python_too_old_message((3, 10, 0)) is None
    assert pkg.python_too_old_message((3, 13, 1, "final", 0)) is None


def test_an_older_python_gets_one_plain_line():
    msg = pkg.python_too_old_message((3, 9, 18))
    assert msg == (
        "ComputerPets needs Python 3.10 or newer. This is Python 3.9.18. "
        "Get a newer one from https://www.python.org/downloads, then start it again."
    )
    assert "\n" not in msg


def test_the_package_stops_an_older_python_before_any_import(monkeypatch):
    src = (PKG / "__init__.py").read_text(encoding="utf-8")
    err = io.StringIO()
    monkeypatch.setattr(sys, "version_info", (3, 9, 7, "final", 0))
    monkeypatch.setattr(sys, "stderr", err)
    with pytest.raises(SystemExit) as stop:
        exec(compile(src, str(PKG / "__init__.py"), "exec"), {"__name__": "computerpets_client"})
    assert stop.value.code == 1
    assert err.getvalue().startswith("ComputerPets needs Python 3.10 or newer. This is Python 3.9.7.")


def test_the_guard_reads_on_an_old_python():
    src = (PKG / "__init__.py").read_text(encoding="utf-8")
    ast.parse(src, feature_version=(3, 7))
    assert "f\"" not in src and "f'" not in src, "no f-strings before the guard"
    head = src.split("_too_old = python_too_old_message()")[0]
    assert re.findall(r"^(?:import|from) (\S+)", head, re.M) == ["sys"], "nothing but sys loads before the guard"


_ONLY_311 = re.compile(
    r"\btomllib\b|\bExceptionGroup\b|except\s*\*|\bStrEnum\b|datetime\.UTC\b|from datetime import[^\n]*\bUTC\b"
    r"|\bTaskGroup\b|asyncio\.timeout\b|\bLiteralString\b|\bassert_never\b|\breveal_type\b|\bNotRequired\b"
    r"|typing import[^\n]*\b(Self|Never|Required|Unpack|TypeVarTuple)\b|\.add_note\(|hashlib\.file_digest"
    r"|contextlib\.chdir|enum import[^\n]*\b(verify|ReprEnum|nonmember|global_enum)\b|re\.NOFLAG"
    r"|getLevelNamesMapping|getmembers_static|math\.(cbrt|exp2)\b"
)


def test_nothing_in_the_client_needs_three_eleven():
    hits = []
    for path in sorted(list(PKG.rglob("*.py")) + list((CLIENT / "tests").rglob("*.py"))):
        if path.name == "test_python_minimum.py":
            continue
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if _ONLY_311.search(line):
                hits.append(f"{path.name}:{n}: {line.strip()}")
    assert hits == []
