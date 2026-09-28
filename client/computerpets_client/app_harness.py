"""App inspect harness: catalog, invoke, and assert real house surfaces.

Buffffff uses this to automate and troubleshoot the whole app — not only care.

Shape (CSRBT at house scale, FlowersForever registry dual-mode):
    * domains are plugins (care is the existing care_harness wrapped)
    * catalog / invoke / assert / run_all / run_domain
    * accounting identity: discovered == driven + dead + sequenced + hidden + failed + excluded
      UNACCOUNTED is a harness bug
    * general oracle: observable trace + no errors + no NaN/undefined junk
    * invariants that survive growth, not frozen counts
    * offline/headless by default; live network + GUI/Electron/Qt are catalogued as excluded
      (opt-in --live / --gui)

No invented verbs — only real blotter / overlay / web surfaces.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Iterable

from . import care_harness
from .choice import GUEST_CHOICE, guest_marks, guest_pick, guest_tap, mark_ids
from .ethogram import acts_for, pick_act
from .gift import gift_line, leave_gift, pick_gift
from .life import CareState
from .species import CATALOG_KEYS, SPECIES, species_by_key
from .weather import weather_label, weather_of
# blotter pure surfaces (hours/hive/guide/gait/play imported inside invokers)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------


def repo_root() -> Path:
    """ComputerPets repo root (client/computerpets_client/ -> ../..)."""
    return Path(__file__).resolve().parents[2]


def _read(rel: str) -> str:
    path = repo_root() / rel
    if not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")



_HOURS_REST_BLOCK_RE = re.compile(
    r"(?:^|\n)\s*(?:export\s+)?const\s+REST(?:\s*:\s*Record<string,\s*\[number,\s*number\]>)?\s*=\s*\{([\s\S]*?)\n\};",
    re.M,
)
_HOURS_REST_PAIR_RE = re.compile(r"([A-Za-z_][A-Za-z0-9_]*)\s*:\s*[\[\(](\d+)\s*,\s*(\d+)[\]\)]")


def _hours_rest_map(rel: str) -> dict[str, tuple[int, int]]:
    """Parse REST windows from desktop hours.js or web hours.ts."""
    src = _read(rel)
    if not src:
        return {}
    match = _HOURS_REST_BLOCK_RE.search(src)
    body = match.group(1) if match else src
    out: dict[str, tuple[int, int]] = {}
    for key, start, end in _HOURS_REST_PAIR_RE.findall(body):
        out[key] = (int(start), int(end))
    return out


def _hours_rest_lockstep(py_rest: dict[str, tuple[int, int]]) -> tuple[list[str], dict[str, Any]]:
    """Fail on any REST drift across Python / desktop / web (house source: desktop+web when they agree)."""
    desk = _hours_rest_map("desktop/renderer/hours.js")
    web = _hours_rest_map("web/src/lib/pets/hours.ts")
    keys = sorted(set(py_rest) | set(desk) | set(web))
    drift: list[str] = []
    missing: list[str] = []
    triple: list[str] = []
    for key in keys:
        a, b, c = py_rest.get(key), desk.get(key), web.get(key)
        if a is None or b is None or c is None:
            missing.append(key)
            continue
        if b == c and a != b:
            drift.append(f"{key}:py={list(a)} desk/web={list(b)}")
        elif a == b == c:
            continue
        else:
            triple.append(f"{key}:py={list(a)} desk={list(b)} web={list(c)}")
    fails = []
    if missing:
        fails.append(f"REST key missing on a side: {', '.join(missing[:12])}")
    if drift:
        fails.append(f"REST drift (py vs desk/web): {'; '.join(drift[:12])}")
    if triple:
        fails.append(f"REST three-way disagree: {'; '.join(triple[:12])}")
    extras = {
        "rest_lockstep": len(keys) - len(missing) - len(drift) - len(triple),
        "rest_drift": drift,
        "rest_missing": missing,
        "rest_triple": triple,
        "rest_desk": len(desk),
        "rest_web": len(web),
    }
    return fails, extras


def _smoke_script() -> Path:
    return Path(__file__).resolve().with_name("harness_smokes.cjs")


def _run_node_smoke(command: str, *, domain: str, action_id: str) -> InvokeResult:
    """Drive a real renderer module via harness_smokes.cjs (offline fixtures / Audio stub)."""
    import json
    import shutil
    import subprocess

    node = shutil.which("node")
    script = _smoke_script()
    if not node:
        return InvokeResult(action_id, domain, False, error="node not on PATH")
    if not script.is_file():
        return InvokeResult(action_id, domain, False, error=f"missing {script.name}")
    try:
        proc = subprocess.run(
            [node, str(script), command],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            cwd=str(repo_root()),
            timeout=30,
            check=False,
        )
    except Exception as exc:  # oracle: surface, do not crash runner
        return InvokeResult(action_id, domain, False, error=f"{type(exc).__name__}: {exc}")
    raw = (proc.stdout or "").strip().splitlines()
    line = raw[-1] if raw else ""
    try:
        payload = json.loads(line) if line else {}
    except json.JSONDecodeError:
        err = (proc.stderr or line)[:200]
        return InvokeResult(
            action_id,
            domain,
            False,
            error=f"smoke JSON parse failed: {err}",
            detail=line[:200],
        )
    ok = bool(payload.get("ok")) and proc.returncode == 0
    trace = [str(t) for t in (payload.get("trace") or [])]
    extras = dict(payload.get("extras") or {})
    extras["smoke"] = command
    return InvokeResult(
        action_id=action_id,
        domain=domain,
        ok=ok,
        detail=str(payload.get("detail") or ""),
        extras=extras,
        trace=trace or ([f"smoke={command}"] if ok else []),
        error=None if ok else str(
            payload.get("error") or payload.get("detail") or f"smoke {command} failed"
        ),
    )



# ---------------------------------------------------------------------------
# Catalog rows
# ---------------------------------------------------------------------------

# CSRBT fates. excluded is the only way an affordance escapes being driven,
# and every excluded row carries its reason.
FATES = ("driven", "dead", "sequenced", "hidden", "failed", "excluded")

DOMAINS = (
    "care",
    "guest",
    "visit",
    "species",
    "ethogram",
    "cry",
    "gift",
    "desk",
    "card",
    "web",
    "blotter",
    "gui",
)

SAMPLE_GUESTS = ("red_panda", "cat", "honey_queen", "ball_python", "crow")

# Guests kept out of per-key ethogram.tricks.* driven rows by design.
# Rui (red_panda) has rui-tricks.js for the overlay, but idle acts_for covers blotter
# ethogram — do not invent a driven ethogram.tricks.red_panda ultra row.
# Dragon guests (relay/fuse/ground) resolve via alias stems to real *-tricks.js files.
NO_TRICKS_KEYS = frozenset({"red_panda"})

# House denser ethograms are non-empty; thin means below the living floor (Rui has 4).
ETH_MIN_ACTS = 4

ETH_ADDR_RE = re.compile(r"^0x[0-9a-fA-F]{40}$")


@dataclass(frozen=True)
class Affordance:
    """Stable catalog row for one real house function."""

    id: str
    domain: str
    label: str
    handler: str
    notes: str = ""
    mode: str = "offline"  # offline | live | gui  (FlowersForever dual-mode + BLACKBEARD --gui)
    fate: str = "driven"  # driven unless excluded/hidden/sequenced
    exclude_reason: str = ""


@dataclass
class InvokeResult:
    action_id: str
    domain: str
    ok: bool
    detail: str = ""
    extras: dict[str, Any] = field(default_factory=dict)
    trace: list[str] = field(default_factory=list)
    error: str | None = None


@dataclass
class CaseResult:
    action_id: str
    domain: str
    passed: bool
    failures: list[str]
    detail: str = ""
    fate: str = "driven"


@dataclass
class Accounting:
    """CSRBT identity: discovered == driven + dead + sequenced + hidden + failed + excluded."""

    discovered: int
    driven: int
    dead: int
    sequenced: int
    hidden: int
    failed: int
    excluded: int
    unaccounted: int
    by_domain: dict[str, dict[str, int]] = field(default_factory=dict)

    def holds(self) -> bool:
        return (
            self.unaccounted == 0
            and self.discovered
            == self.driven + self.dead + self.sequenced + self.hidden + self.failed + self.excluded
        )


# ---------------------------------------------------------------------------
# Care domain — wrap the existing harness, do not replace it
# ---------------------------------------------------------------------------


def _care_rows() -> list[Affordance]:
    rows = []
    for action in care_harness.catalog():
        rows.append(
            Affordance(
                id=f"care.{action.id}",
                domain="care",
                label=action.label,
                handler=action.handler,
                notes=action.notes,
            )
        )
    return rows


def _invoke_care(local_id: str, **opts: Any) -> InvokeResult:
    species = opts.get("species") or opts.get("species_key") or "red_panda"
    state = opts.get("state")
    inner = care_harness.invoke(local_id, state, species=species)
    trace: list[str] = []
    if inner.ok:
        trace.append(f"ok:{local_id}")
    if inner.line:
        trace.append(inner.line)
    if inner.cmd:
        trace.append(f"cmd:{inner.cmd}")
    if inner.detail:
        trace.append(inner.detail)
    return InvokeResult(
        action_id=f"care.{local_id}",
        domain="care",
        ok=inner.ok,
        detail=inner.detail or (inner.line or ""),
        extras={
            "cmd": inner.cmd,
            "anim": inner.anim,
            "line": inner.line,
            "before": inner.before,
            "after": inner.after,
            "care": inner,
        },
        trace=trace,
        error=None if inner.ok else (inner.detail or "care invoke failed"),
    )


def _assert_care(local_id: str, result: InvokeResult) -> list[str]:
    inner = result.extras.get("care")
    if inner is None:
        return ["missing wrapped care InvokeResult"]
    return list(care_harness.assert_action(local_id, inner))


# ---------------------------------------------------------------------------
# Guest choice
# ---------------------------------------------------------------------------


def _guest_rows() -> list[Affordance]:
    rows = [
        Affordance("guest.tap", "guest", "Tap guest", "choice.guest_tap", "Opens choice; not a sit."),
        Affordance(
            "guest.marks",
            "guest",
            "Choice marks",
            "choice.guest_marks",
            "Includes Close then Exit as last dismiss marks.",
        ),
    ]
    for mark in GUEST_CHOICE:
        rows.append(
            Affordance(
                id=f"guest.{mark}",
                domain="guest",
                label=mark.title() if mark not in {"close", "exit"} else mark.title(),
                handler="choice.guest_pick",
                notes="Real guest-choice id. Not a blotter tend button.",
            )
        )
    return rows


def _invoke_guest(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"guest.{local_id}"
    if local_id == "tap":
        value = guest_tap()
        return InvokeResult(aid, "guest", True, detail=value, extras={"tap": value}, trace=[f"tap={value}"])
    if local_id == "marks":
        marks = guest_marks(
            hidden=bool(opts.get("hidden")),
            leaving=bool(opts.get("leaving")),
            walking=bool(opts.get("walking")),
            gifts=int(opts.get("gifts") or 0),
        )
        ids = mark_ids(marks)
        return InvokeResult(
            aid,
            "guest",
            True,
            detail=" ".join(ids),
            extras={"marks": list(ids)},
            trace=[f"marks={'/'.join(ids)}"],
        )
    picked = guest_pick(local_id)
    ok = picked == local_id
    return InvokeResult(
        aid,
        "guest",
        ok,
        detail=picked or "not a guest-choice id",
        extras={"picked": picked},
        trace=[f"pick={picked}"] if picked else [],
        error=None if ok else f"guest_pick({local_id!r}) -> {picked!r}",
    )


def _assert_guest(local_id: str, result: InvokeResult) -> list[str]:
    fails: list[str] = []
    if local_id == "tap":
        if result.extras.get("tap") != "choice":
            fails.append("tap must open choice, not a sit")
        return fails
    if local_id == "marks":
        ids = tuple(result.extras.get("marks") or ())
        if len(ids) < 2 or ids[-2:] != ("close", "exit"):
            fails.append(f"marks must end with close/exit, got {ids[-2:] if ids else ids}")
        if "feed" in ids or "bath" in ids or "clean" in ids:
            fails.append("guest marks must not invent blotter tend verbs")
        return fails
    if local_id in GUEST_CHOICE:
        if result.extras.get("picked") != local_id:
            fails.append(f"guest_pick({local_id}) should return itself")
        return fails
    fails.append(f"unknown guest id {local_id!r}")
    return fails


# ---------------------------------------------------------------------------
# Species / GUESTS catalog
# ---------------------------------------------------------------------------


def _portrait_path(key: str) -> Path | None:
    """Guest portrait sprite under web/public/pets/{key}.jpg (documented house path)."""
    path = repo_root() / "web" / "public" / "pets" / f"{key}.jpg"
    return path if path.is_file() else None


def _species_rows() -> list[Affordance]:
    rows = [
        Affordance("species.catalog", "species", "Load species catalog", "species.CATALOG_KEYS / SPECIES"),
        Affordance("species.lookup", "species", "species_by_key", "species.species_by_key"),
        Affordance("species.guests_doc", "species", "GUESTS.md roster", "docs/GUESTS.md"),
        Affordance(
            "species.portraits",
            "species",
            "Portrait jpg for every catalog key",
            "web/public/pets/{key}.jpg",
            notes="House-wide: missing portrait fails naming the key. CSRBT-style invariant, not a frozen count.",
        ),
    ]
    for key in SAMPLE_GUESTS:
        rows.append(
            Affordance(
                id=f"species.sample.{key}",
                domain="species",
                label=f"Sample {key}",
                handler="species.species_by_key",
                notes="Sample guest from the living catalog.",
            )
        )
    return rows


def _invoke_species(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"species.{local_id}"
    if local_id == "catalog":
        keys = tuple(CATALOG_KEYS)
        mapping = dict(SPECIES)
        ok = bool(keys) and set(keys) == set(mapping)
        trace = [f"keys={len(keys)}", f"species={len(mapping)}"]
        return InvokeResult(aid, "species", ok, detail=f"{len(keys)} keys", extras={"n": len(keys)}, trace=trace)
    if local_id == "lookup":
        key = str(opts.get("key") or "red_panda")
        sp = species_by_key(key)
        ok = sp.key == key
        return InvokeResult(
            aid, "species", ok, detail=sp.name, extras={"key": sp.key, "name": sp.name, "slug": sp.slug},
            trace=[f"{sp.key}:{sp.name}"], error=None if ok else f"lookup {key} -> {sp.key}",
        )
    if local_id == "guests_doc":
        text = _read("docs/GUESTS.md")
        ok = "red_panda" in text and "honey_queen" in text
        return InvokeResult(
            aid, "species", ok, detail="GUESTS.md" if text else "missing",
            extras={"chars": len(text)}, trace=[f"guests_doc:{len(text)}"],
            error=None if ok else "GUESTS.md missing sample keys",
        )
    if local_id == "portraits":
        missing = [key for key in CATALOG_KEYS if _portrait_path(key) is None]
        ok = not missing
        detail = f"{len(CATALOG_KEYS)} portraits" if ok else f"missing {len(missing)}"
        return InvokeResult(
            aid, "species", ok, detail=detail,
            extras={"n": len(CATALOG_KEYS), "missing": missing[:32], "missing_n": len(missing)},
            trace=[f"portraits={len(CATALOG_KEYS) - len(missing)}/{len(CATALOG_KEYS)}"]
            + ([f"missing={','.join(missing[:12])}"] if missing else []),
            error=None if ok else f"missing portrait jpg for: {', '.join(missing[:12])}",
        )
    if local_id.startswith("sample."):
        key = local_id.split(".", 1)[1]
        sp = species_by_key(key)
        ok = sp.key == key and key in CATALOG_KEYS
        return InvokeResult(
            aid, "species", ok, detail=sp.name,
            extras={"key": sp.key, "name": sp.name},
            trace=[f"{sp.key}:{sp.name}"],
            error=None if ok else f"{key} not in living catalog",
        )
    return InvokeResult(aid, "species", False, error=f"unknown species id {local_id!r}")


def _assert_species(local_id: str, result: InvokeResult) -> list[str]:
    fails: list[str] = []
    if local_id == "catalog":
        if int(result.extras.get("n") or 0) < 1:
            fails.append("catalog is empty")
        if set(CATALOG_KEYS) != set(SPECIES):
            fails.append("CATALOG_KEYS and SPECIES drifted")
        return fails
    if local_id == "portraits":
        missing = result.extras.get("missing") or []
        if missing:
            fails.append(f"missing portrait jpg for: {', '.join(missing[:12])}")
        if not result.ok and not fails:
            fails.append(result.error or "portrait catalog failed")
        return fails
    if not result.ok:
        fails.append(result.error or result.detail or "species invoke failed")
    return fails


# ---------------------------------------------------------------------------
# Ethogram / tricks
# ---------------------------------------------------------------------------


_TRICK_KEY_RE = re.compile(r"""TRICK_KEY\s*=\s*['"]([^'"]+)['"]""")

# Registry only — not a per-guest tricks module (see desktop/renderer/ground-tricks.js).
_TRICKS_REGISTRY_NAMES = frozenset({"ground-tricks.js", "ground-tricks.ts"})


def _tricks_file_key(path: Path) -> str | None:
    """Return TRICK_KEY declared in a *-tricks.js/ts, or None for registries."""
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return None
    match = _TRICK_KEY_RE.search(text)
    return match.group(1) if match else None


def _tricks_stem_candidates(key: str) -> list[str]:
    """Filename stems desktop/web already use for guest tricks modules.

    Order: catalog key, ball-python-style hyphens, strip `_dragon`, species slug /
    house name, specials window-play form (ground_dragon → earth).
    """
    stems: list[str] = []

    def add(stem: str | None) -> None:
        if not stem:
            return
        raw = str(stem).strip()
        if not raw:
            return
        for form in (raw, raw.replace("_", "-")):
            if form and form not in stems:
                stems.append(form)

    add(key)
    if key.endswith("_dragon"):
        add(key[: -len("_dragon")])
    try:
        sp = species_by_key(key)
    except Exception:
        sp = None
    if sp is not None:
        add(getattr(sp, "slug", None))
        name = getattr(sp, "name", None)
        if name:
            add(str(name).lower().replace(" ", "-").replace("'", ""))
    try:
        from .specials import trait_for

        add(trait_for(key).special)
    except Exception:
        pass
    return stems


def _tricks_path(key: str) -> Path | None:
    """Resolve on-disk tricks module for a catalog key (alias-aware).

    Mirrors desktop/web loading: try `{key}-tricks.js`, hyphen forms, strip
    `_dragon`, house slug/name, and specials play stems (e.g. earth for
    ground_dragon). Only accept files whose TRICK_KEY matches `key` so the
    ground-tricks registry is never mistaken for Ground / ground_dragon.
    """
    renderer = repo_root() / "desktop" / "renderer"
    web = repo_root() / "web" / "src" / "lib" / "pets"
    for stem in _tricks_stem_candidates(key):
        for folder, suffix in ((renderer, ".js"), (web, ".ts")):
            path = folder / f"{stem}-tricks{suffix}"
            if not path.is_file() or path.name in _TRICKS_REGISTRY_NAMES:
                continue
            if _tricks_file_key(path) == key:
                return path
    # Fallback scan — catches any future alias stem not listed above.
    for folder, pattern in ((renderer, "*-tricks.js"), (web, "*-tricks.ts")):
        if not folder.is_dir():
            continue
        for path in sorted(folder.glob(pattern)):
            if path.name in _TRICKS_REGISTRY_NAMES:
                continue
            if _tricks_file_key(path) == key:
                return path
    return None


def _tricks_parse_smoke(key: str, path: Path) -> list[str]:
    """Load/parse smoke for an on-disk *-tricks.js/ts — no invented verbs."""
    fails: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        return [f"{key} tricks unreadable: {exc}"]
    if not text.strip():
        fails.append(f"{key} tricks file empty")
        return fails
    has_key = f'TRICK_KEY = "{key}"' in text or f"TRICK_KEY = '{key}'" in text
    has_tricks = "const TRICKS" in text or "TRICKS =" in text or "export const TRICKS" in text
    if not (has_key or has_tricks):
        fails.append(f"{key} tricks missing TRICK_KEY/TRICKS parse markers")
    return fails


def _ethogram_rows() -> list[Affordance]:
    rows = [
        Affordance(
            "ethogram.catalog_all",
            "ethogram",
            "Ethogram + tricks for every catalog key",
            "ethogram.acts_for + desktop/renderer/*-tricks.js",
            notes=(
                "CSRBT-style house-wide invariant: every CATALOG_KEYS guest has a non-empty denser "
                "acts_for set; present *-tricks.js files (alias-resolved) get a load/parse smoke. "
                "Rui stays an excluded ethogram.tricks row — do not invent."
            ),
        ),
    ]
    for key in sorted(NO_TRICKS_KEYS):
        label = "Rui" if key == "red_panda" else key
        rows.append(
            Affordance(
                id=f"ethogram.tricks.{key}",
                domain="ethogram",
                label=f"Tricks file {key}",
                handler="desktop/renderer/*-tricks.js",
                fate="excluded",
                exclude_reason=(
                    f"{label} stays excluded by design; idle acts_for covers blotter ethogram. "
                    "Do not invent a driven ethogram.tricks ultra row for this guest."
                ),
            )
        )
    return rows


def _invoke_ethogram(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"ethogram.{local_id}"
    if local_id == "catalog_all":
        missing: list[str] = []
        thin: list[str] = []
        broken: list[str] = []
        tricks_ok = 0
        tricks_fail: list[str] = []
        unexpected_missing_tricks: list[str] = []
        for key in CATALOG_KEYS:
            acts = acts_for(key)
            names = [a.get("name", "") for a in acts]
            if not acts:
                missing.append(key)
                continue
            if any(not (a.get("name") and a.get("motion")) for a in acts):
                broken.append(key)
            if len(acts) < ETH_MIN_ACTS:
                thin.append(key)
            if any(n in ("NaN", "undefined", "[object Object]") for n in names):
                broken.append(key)
            tricks = _tricks_path(key)
            if tricks is None:
                if key not in NO_TRICKS_KEYS:
                    unexpected_missing_tricks.append(key)
            else:
                parse_fails = _tricks_parse_smoke(key, tricks)
                if parse_fails:
                    tricks_fail.extend(parse_fails)
                else:
                    tricks_ok += 1
        ok = not (missing or thin or broken or tricks_fail or unexpected_missing_tricks)
        parts = [
            f"keys={len(CATALOG_KEYS)}",
            f"tricks_parsed={tricks_ok}",
            f"tricks_excluded={len(NO_TRICKS_KEYS)}",
        ]
        if missing:
            parts.append(f"missing={','.join(missing[:12])}")
        if thin:
            parts.append(f"thin={','.join(thin[:12])}")
        if broken:
            parts.append(f"broken={','.join(broken[:12])}")
        if unexpected_missing_tricks:
            parts.append(f"no_tricks={','.join(unexpected_missing_tricks[:12])}")
        if tricks_fail:
            parts.append(f"tricks_fail={len(tricks_fail)}")
        err = None
        if not ok:
            bits = []
            if missing:
                bits.append(f"missing acts: {', '.join(missing[:12])}")
            if thin:
                bits.append(f"thin acts (<{ETH_MIN_ACTS}): {', '.join(thin[:12])}")
            if broken:
                bits.append(f"broken acts: {', '.join(broken[:12])}")
            if unexpected_missing_tricks:
                bits.append(f"missing tricks file: {', '.join(unexpected_missing_tricks[:12])}")
            if tricks_fail:
                bits.append("; ".join(tricks_fail[:6]))
            err = "; ".join(bits)
        return InvokeResult(
            aid, "ethogram", ok, detail=f"{len(CATALOG_KEYS)} guests",
            extras={
                "n": len(CATALOG_KEYS),
                "missing": missing,
                "thin": thin,
                "broken": broken,
                "tricks_ok": tricks_ok,
                "tricks_fail": tricks_fail[:32],
                "unexpected_missing_tricks": unexpected_missing_tricks,
            },
            trace=parts,
            error=err,
        )
    kind, _, key = local_id.partition(".")
    if kind == "acts":
        acts = acts_for(key)
        names = [a.get("name", "") for a in acts]
        ok = bool(acts) and all(a.get("name") and a.get("motion") for a in acts)
        picked = pick_act(key)
        trace = [f"acts={len(acts)}", f"names={','.join(names[:8])}"]
        if picked:
            trace.append(f"pick={picked.get('name')}")
        return InvokeResult(
            aid, "ethogram", ok, detail=f"{len(acts)} acts",
            extras={"n": len(acts), "names": names, "pick": picked},
            trace=trace, error=None if ok else f"no ethogram acts for {key}",
        )
    if kind == "tricks":
        path = _tricks_path(key)
        ok = path is not None
        return InvokeResult(
            aid, "ethogram", ok, detail=str(path) if path else "missing",
            extras={"path": str(path) if path else ""},
            trace=[f"tricks={path.name}"] if path else [],
            error=None if ok else f"no tricks file for {key}",
        )
    return InvokeResult(aid, "ethogram", False, error=f"unknown ethogram id {local_id!r}")


def _assert_ethogram(local_id: str, result: InvokeResult) -> list[str]:
    fails: list[str] = []
    if local_id == "catalog_all":
        missing = result.extras.get("missing") or []
        thin = result.extras.get("thin") or []
        broken = result.extras.get("broken") or []
        unexpected = result.extras.get("unexpected_missing_tricks") or []
        tricks_fail = result.extras.get("tricks_fail") or []
        for key in missing:
            fails.append(f"FAIL missing ethogram acts for {key}")
        for key in thin:
            fails.append(f"FAIL thin ethogram acts for {key}")
        for key in broken:
            fails.append(f"FAIL broken ethogram acts for {key}")
        for key in unexpected:
            fails.append(f"FAIL missing tricks file for {key}")
        for msg in tricks_fail:
            fails.append(f"FAIL {msg}")
        if not result.ok and not fails:
            fails.append(result.error or "ethogram.catalog_all failed")
        return fails
    if not result.ok:
        fails.append(result.error or "ethogram invoke failed")
        return fails
    if local_id.startswith("acts."):
        names = result.extras.get("names") or []
        if any(n in ("NaN", "undefined", "[object Object]") for n in names):
            fails.append("junk act name")
        if not names:
            fails.append("no act names")
    return fails


# ---------------------------------------------------------------------------
# Cry / prefersHouseCry
# ---------------------------------------------------------------------------


def _prefers_house_cry_keys() -> set[str]:
    src = _read("web/src/lib/pets/card.ts")
    match = re.search(r"export function prefersHouseCry\([^)]*\)\s*\{([^}]*)\}", src)
    if not match:
        return set()
    return set(re.findall(r'key === "([a-z0-9_]+)"', match.group(1)))


def _cry_wav(key: str) -> Path | None:
    sounds = repo_root() / "desktop" / "renderer" / "sounds"
    for name in (f"{key}.wav", f"{key.replace('_', '-')}.wav"):
        path = sounds / name
        if path.is_file():
            return path
    return None


def _replay_dir() -> Path:
    return repo_root() / "desktop" / "renderer" / "fixtures" / "replay"


# Saved probe outputs and the platform each one came from (see fixtures/replay/README.md).
GPU_REPLAYS = (
    ("gpu-win-nvidia.txt", "win32", "GPU NVIDIA GeForce RTX 4090 · 36°C · 11% · 1.5 GiB/24 GiB · 9.6 W"),
    # Counters only: the busiest engine after adding every process on it (Task Manager's
    # number). Here the video decode engine at 4.2%, not one process's 3D share (0.5%).
    ("gpu-win-pdh.txt", "win32", "GPU · — · 4.2% · 1.5 GiB/— · —"),
    # Hand-built: two adapters that both report phys_0. They are read apart by LUID, and the
    # one with the most VRAM (8 GiB, 12.5%) is shown, not the integrated one's 61.5%.
    ("gpu-win-two-adapters.txt", "win32", "GPU · — · 12.5% · 2 GiB/8 GiB · —"),
    ("gpu-linux-amdgpu.txt", "linux", "GPU AMD Radeon RX 7800 XT · 51°C · 23% · 2.2 GiB/16 GiB · 38.5 W"),
    ("gpu-mac-ioaccelerator.txt", "darwin", "GPU Apple M2 Pro · — · 18% · 3 GiB/— · —"),
    ("gpu-linux-absent.txt", "linux", "GPU · no reading"),
)
GPU_REPLAY_NOW = 1790000000000


def _gpu_replay(aid: str) -> InvokeResult:
    """Feed saved probe output to gpu.read_local (no process runs) and to desktop gpu-sense read()."""
    import subprocess
    from unittest import mock

    from . import gpu as gpu_mod

    fails: list[str] = []
    trace: list[str] = []
    py_lines: dict[str, str] = {}
    for name, platform, want in GPU_REPLAYS:
        path = _replay_dir() / name
        if not path.is_file():
            fails.append(f"missing replay {name}")
            continue
        text = path.read_text(encoding="utf-8")
        seen: list[str] = []

        def fake_run(cmd, *args, _text=text, _seen=seen, **kwargs):
            _seen.append(" ".join(str(c) for c in cmd))
            return subprocess.CompletedProcess(cmd, 0, stdout=_text, stderr="")

        with mock.patch.object(gpu_mod.subprocess, "run", fake_run):
            sample = gpu_mod.read_local(platform, now_ms=GPU_REPLAY_NOW)
        line = gpu_mod.gpu_line(gpu_mod.present(sample, GPU_REPLAY_NOW))
        py_lines[name] = line
        script = {"win32": "gpu-probe.ps1", "darwin": "gpu-probe-mac.sh"}.get(platform, "gpu-probe.sh")
        if len(seen) != 1 or script not in seen[0]:
            fails.append(f"{name}: blotter probe ran {seen}")
        if line != want:
            fails.append(f"{name}: blotter line {line!r} != {want!r}")
        trace.append(f"py.{name}={line}")
    smoked = _run_node_smoke("gpu_replay", domain="desk", action_id=aid)
    desk_rows = {row.get("file"): row for row in (smoked.extras.get("rows") or [])}
    if not smoked.ok:
        fails.append(smoked.error or "desktop gpu replay failed")
    for name, _platform, want in GPU_REPLAYS:
        desk_line = (desk_rows.get(name) or {}).get("line")
        if desk_line != want:
            fails.append(f"{name}: desktop line {desk_line!r} != {want!r}")
        elif py_lines.get(name) != desk_line:
            fails.append(f"{name}: desktop and blotter lines differ")
    trace += smoked.trace
    ok = not fails
    return InvokeResult(
        aid,
        "desk",
        ok,
        detail=f"{len(GPU_REPLAYS)} probe replays, desktop == blotter" if ok else "gpu replay drifted",
        extras={"py": py_lines, "desk": {k: v.get("line") for k, v in desk_rows.items()}},
        trace=trace,
        error=None if ok else "; ".join(fails[:8]),
    )


# A cry is a short call. Footsteps and the house loop are not cries and are not checked here.
CRY_MIN_S = 0.05
CRY_MAX_S = 6.0
CRY_SILENT_PEAK = 0.0001  # below this every sample is zero or one step from it: nothing plays
CRY_QUIET_PEAK = 0.02  # quiet on purpose (docs/CRIES.md "attenuated"); listed, not failed

# Known holes: the file decodes but holds no sound. Listed so the run stays honest and green.
# The row fails if another cry goes silent, or if one of these gets real sound and stays listed.
# None today: garter.wav was all zeros until it was re-exported from field tape (2026-09-27).
KNOWN_SILENT_CRIES: dict[str, str] = {}


def _wav_facts(path: Path) -> dict[str, Any]:
    """Decode one wav with the standard library. Raises on a file that is not PCM wav."""
    import array
    import sys
    import wave

    with wave.open(str(path), "rb") as handle:
        channels = handle.getnchannels()
        width = handle.getsampwidth()
        rate = handle.getframerate()
        frames = handle.getnframes()
        raw = handle.readframes(frames)
    if width == 2:
        samples = array.array("h")
        samples.frombytes(raw[: len(raw) - (len(raw) % 2)])
        if sys.byteorder == "big":
            samples.byteswap()
        peak = max((abs(s) for s in samples), default=0) / 32768.0
    elif width == 1:
        peak = max((abs(b - 128) for b in raw), default=0) / 128.0
    else:
        peak = -1.0
    return {
        "channels": channels,
        "width": width,
        "rate": rate,
        "frames": frames,
        "bytes": len(raw),
        "seconds": frames / rate if rate else 0.0,
        "peak": peak,
    }


def _cry_decode(aid: str) -> InvokeResult:
    keys = sorted(_prefers_house_cry_keys())
    fails: list[str] = []
    known: list[str] = []
    quiet: list[str] = []
    lengths: dict[str, float] = {}
    for key in keys:
        wav = _cry_wav(key)
        if wav is None:
            fails.append(f"{key}: no wav")
            continue
        try:
            facts = _wav_facts(wav)
        except Exception as exc:  # oracle: name the file, do not crash the runner
            fails.append(f"{key}: does not decode ({type(exc).__name__}: {exc})")
            continue
        if facts["channels"] not in (1, 2):
            fails.append(f"{key}: {facts['channels']} channels")
        if facts["width"] not in (1, 2):
            fails.append(f"{key}: {facts['width'] * 8}-bit samples are not checked")
        if facts["rate"] not in (22050, 44100, 48000):
            fails.append(f"{key}: sample rate {facts['rate']}")
        if facts["bytes"] != facts["frames"] * facts["channels"] * facts["width"]:
            fails.append(f"{key}: {facts['bytes']} bytes read for {facts['frames']} frames")
        if not (CRY_MIN_S <= facts["seconds"] <= CRY_MAX_S):
            fails.append(f"{key}: {facts['seconds']:.3f}s is outside {CRY_MIN_S}-{CRY_MAX_S}s")
        silent = 0 <= facts["peak"] < CRY_SILENT_PEAK
        if silent and key in KNOWN_SILENT_CRIES:
            known.append(key)
        elif silent:
            fails.append(f"{key}: silent, every sample is zero (peak {facts['peak']:.5f})")
        elif key in KNOWN_SILENT_CRIES:
            fails.append(f"{key}: has sound now (peak {facts['peak']:.4f}); drop it from KNOWN_SILENT_CRIES")
        elif facts["peak"] < CRY_QUIET_PEAK:
            quiet.append(key)
        lengths[key] = round(facts["seconds"], 3)
    ok = bool(keys) and not fails
    shortest = min(lengths, key=lengths.get) if lengths else ""
    longest = max(lengths, key=lengths.get) if lengths else ""
    return InvokeResult(
        aid,
        "cry",
        ok,
        detail=(
            f"{len(lengths)}/{len(keys)} cries decode; silent (known hole): {', '.join(known) or 'none'}"
            if ok
            else f"{len(fails)} cry files failed"
        ),
        extras={
            "n": len(keys),
            "decoded": len(lengths),
            "shortest": shortest,
            "longest": longest,
            "known_silent": known,
            "quiet": quiet,
            "fails": fails,
        },
        trace=[
            f"prefersHouseCry={len(keys)}",
            f"decoded={len(lengths)}",
            f"shortest={shortest}:{lengths.get(shortest, 0)}s" if shortest else "shortest=none",
            f"longest={longest}:{lengths.get(longest, 0)}s" if longest else "longest=none",
            f"known_silent={','.join(known) or 'none'}",
            f"quiet={','.join(quiet) or 'none'}",
        ],
        error=None if ok else "; ".join(fails[:12]),
    )


def _cry_rows() -> list[Affordance]:
    rows = [
        Affordance(
            "cry.prefersHouseCry.parse",
            "cry",
            "Parse prefersHouseCry",
            "web/src/lib/pets/card.ts prefersHouseCry",
        ),
        Affordance(
            "cry.pet_wire",
            "cry",
            "pet.js calls prefersHouseCry",
            "desktop/renderer/pet.js",
        ),
        Affordance(
            "cry.catalog_wavs",
            "cry",
            "Wav on disk for every prefersHouseCry key",
            "desktop/renderer/sounds/{key}.wav",
            notes=(
                "House-wide: every prefersHouseCry key must have a wav (or honest exclude). "
                "Missing wav fails naming the key. CSRBT-style invariant, not sample-only."
            ),
        ),
        Affordance(
            "cry.playback",
            "cry",
            "Stubbed house-cry playback",
            "desk-house.js playVoice + Audio stub",
            notes="Mock Audio + real overlayVoiceSrc/wav; live speakers stay out of default run_all.",
        ),
        Affordance(
            "cry.decode",
            "cry",
            "Every house cry decodes to real sound",
            "desktop/renderer/sounds/{key}.wav via Python wave",
            notes=(
                "Opens and reads every prefersHouseCry wav without speakers: PCM header, sample rate, "
                "channels, a length between 0.05 and 6 seconds, and samples that are not silence."
            ),
        ),
        Affordance(
            "live.cry_playback",
            "cry",
            "Play house cry through real speakers",
            "pet.js / PetDeskHouse",
            mode="live",
            fate="excluded",
            exclude_reason=(
                "Real speakers/Electron session. Stubbed playVoice path is driven as cry.playback; "
                "every cry file is decoded as cry.decode. Nothing checks that a speaker made a sound."
            ),
        ),
    ]
    return rows


def _invoke_cry(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"cry.{local_id}" if not local_id.startswith("live.") else local_id
    if local_id == "prefersHouseCry.parse" or local_id == "parse":
        keys = _prefers_house_cry_keys()
        ok = "red_panda" in keys and "honey_queen" in keys
        return InvokeResult(
            aid, "cry", ok, detail=f"{len(keys)} keys",
            extras={"n": len(keys), "keys": sorted(keys)[:8]},
            trace=[f"prefersHouseCry={len(keys)}"],
            error=None if ok else "could not parse prefersHouseCry",
        )
    if local_id == "pet_wire":
        src = _read("desktop/renderer/pet.js")
        ok = "prefersHouseCry" in src and "PetDeskHouse" in src
        return InvokeResult(
            aid, "cry", ok, detail="wired" if ok else "missing",
            extras={"wired": ok}, trace=[f"pet_wire={ok}"],
            error=None if ok else "pet.js does not call prefersHouseCry",
        )
    if local_id == "catalog_wavs":
        prefers = sorted(_prefers_house_cry_keys())
        missing = [key for key in prefers if _cry_wav(key) is None]
        ok = bool(prefers) and not missing
        return InvokeResult(
            aid, "cry", ok, detail=f"{len(prefers) - len(missing)}/{len(prefers)} wavs",
            extras={"n": len(prefers), "missing": missing, "missing_n": len(missing)},
            trace=[f"prefersHouseCry={len(prefers)}", f"wavs={len(prefers) - len(missing)}"]
            + ([f"missing={','.join(missing[:12])}"] if missing else []),
            error=None if ok else f"missing cry wav for: {', '.join(missing[:12])}",
        )
    if local_id.startswith("wav."):
        key = local_id.split(".", 1)[1]
        prefers = key in _prefers_house_cry_keys()
        wav = _cry_wav(key)
        # House cry first where prefersHouseCry and the file exists.
        # A prefersHouseCry key without a wav is a real wiring hole.
        ok = wav is not None if prefers else True
        detail = str(wav) if wav else ("no wav (not prefersHouseCry)" if not prefers else "missing wav")
        return InvokeResult(
            aid, "cry", ok, detail=detail,
            extras={"prefers": prefers, "wav": str(wav) if wav else ""},
            trace=[f"wav={wav.name if wav else 'none'}", f"prefers={prefers}"],
            error=None if ok else f"{key} prefersHouseCry but wav missing",
        )
    if local_id == "playback":
        smoked = _run_node_smoke("cry_playback", domain="cry", action_id=aid)
        return smoked
    if local_id == "decode":
        return _cry_decode(aid)
    return InvokeResult(aid, "cry", False, error=f"unknown cry id {local_id!r}")


def _assert_cry(local_id: str, result: InvokeResult) -> list[str]:
    if local_id == "catalog_wavs":
        missing = result.extras.get("missing") or []
        if missing:
            return [f"FAIL missing cry wav for {key}" for key in missing[:32]]
        if not result.ok:
            return [result.error or result.detail or "cry.catalog_wavs failed"]
        return []
    if result.ok:
        return []
    return [result.error or result.detail or "cry invoke failed"]


# ---------------------------------------------------------------------------
# Gift place / pick
# ---------------------------------------------------------------------------


def _gift_rows() -> list[Affordance]:
    return [
        Affordance("gift.line", "gift", "Gift line", "gift.gift_line"),
        Affordance("gift.leave", "gift", "Leave gift", "gift.leave_gift", "Known guest, bond >= 25."),
        Affordance("gift.pick", "gift", "Pick gift", "gift.pick_gift"),
        Affordance(
            "gift.place",
            "gift",
            "Place gift on the wood (coords)",
            "life.js leaveGift / gift.leave_gift",
            notes="Observable x on the wood via renderer leaveGift + Python leave_gift(gift_x).",
        ),
    ]


def _invoke_gift(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"gift.{local_id}"
    key = str(opts.get("key") or "red_panda")
    if local_id == "line":
        line = gift_line(key)
        ok = bool(line) and "NaN" not in line
        return InvokeResult(aid, "gift", ok, detail=line, extras={"line": line}, trace=[line])
    if local_id == "leave":
        before = opts.get("state") or CareState(bond=40, mood=50)
        after = leave_gift(before, now=1_700, gift_x=22)
        ok = len(after.gifts) == len(before.gifts) + 1
        return InvokeResult(
            aid, "gift", ok, detail=f"gifts={len(after.gifts)}",
            extras={"before": before, "after": after},
            trace=[f"gifts:{len(before.gifts)}->{len(after.gifts)}"],
            error=None if ok else "leave_gift did not add a gift",
        )
    if local_id == "pick":
        seeded = opts.get("state") or leave_gift(CareState(bond=40, mood=50), now=7, gift_x=22)
        if not seeded.gifts:
            return InvokeResult(aid, "gift", False, error="no gift to pick")
        gift_id = seeded.gifts[0].id
        result = pick_gift(seeded, gift_id, key)
        ok = len(result.state.gifts) == len(seeded.gifts) - 1
        return InvokeResult(
            aid, "gift", ok, detail=result.line or "",
            extras={"line": result.line, "after": result.state},
            trace=[result.line or "picked", f"gifts={len(result.state.gifts)}"],
            error=None if ok else "pick_gift did not remove the gift",
        )
    if local_id == "place":
        smoked = _run_node_smoke("gift_place", domain="gift", action_id=aid)
        # Also drive Python leave_gift with an explicit wood x so both houses leave a trace.
        placed = leave_gift(CareState(bond=40, mood=50), now=9, gift_x=33.5)
        py_ok = bool(placed.gifts) and abs(placed.gifts[0].x - 33.5) < 0.01
        if not smoked.ok:
            return smoked
        if not py_ok:
            return InvokeResult(aid, "gift", False, error="python leave_gift gift_x not sticky")
        smoked.trace = list(smoked.trace) + [f"py.gift_x={placed.gifts[0].x}"]
        smoked.extras["py_x"] = placed.gifts[0].x
        return smoked
    return InvokeResult(aid, "gift", False, error=f"unknown gift id {local_id!r}")


def _assert_gift(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "gift invoke failed"]


# ---------------------------------------------------------------------------
# Visit / call guest lifecycle (PetVisitor + PetCallGuests + PetArrive)
# ---------------------------------------------------------------------------


def _visit_rows() -> list[Affordance]:
    return [
        Affordance(
            "visit.todays",
            "visit",
            "Today's auto visitor pick + line",
            "visitor.js todaysVisitor / visitLine",
            notes="Civil-day guest pick excludes host; offline.",
        ),
        Affordance(
            "visit.phases",
            "visit",
            "Visit phase clock + host-hidden abort",
            "visitor.js visitPhaseFromEnter / visitPhaseFromWait",
            notes="wait/in/talk/wander/leave/gone; host hide forces gone.",
        ),
        Affordance(
            "visit.call",
            "visit",
            "Call guest match/begin/place/dismiss/leave",
            "call-guests.js matchCall / beginCalled / placeCalled / dismissCalled / stepCalled",
            notes="Called-guest place (not host freehand drag); offline.",
        ),
        Affordance(
            "visit.arrive",
            "visit",
            "Arrive vs tap/place lift rules",
            "arrive.js pointerUp / walkLand / arriveFinish",
            notes="Tap/choice and drag-place are not walking in; finished walk arrives.",
        ),
    ]


def _invoke_visit(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"visit.{local_id}"
    smoke = {
        "todays": "visit_todays",
        "phases": "visit_phases",
        "call": "visit_call_lifecycle",
        "arrive": "visit_arrive",
    }.get(local_id)
    if smoke:
        return _run_node_smoke(smoke, domain="visit", action_id=aid)
    return InvokeResult(aid, "visit", False, error=f"unknown visit id {local_id!r}")


def _assert_visit(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "visit invoke failed"]



# ---------------------------------------------------------------------------
# Desk plates — weather / news / quotes(coins) / NFT  (no live network)
# ---------------------------------------------------------------------------


def _desk_rows() -> list[Affordance]:
    return [
        Affordance("desk.weather", "desk", "House weather clock", "weather.weather_of"),
        Affordance("desk.plates", "desk", "Plate keys", "desk-plates.ts PLATE_KEYS"),
        Affordance("desk.news.urls", "desk", "News URL builders", "news.ts newsUrl / topicRssUrl"),
        Affordance("desk.market.urls", "desk", "Quotes/coins URL builders", "market.ts yahooUrl / geckoUrl / nftUrl"),
        Affordance("desk.nft.address", "desk", "Ethereum address normalize", "nft/EthereumAddress.java"),
        Affordance("desk.nft.catalog", "desk", "NftCatalog class", "nft/NftCatalog.java"),
        Affordance(
            "desk.weather.resolve",
            "desk",
            "Offline forecast resolve",
            "weather-areas.js parseForecast + forecastUrl",
            notes="Fixture JSON through the real parser; no HTTP.",
        ),
        Affordance(
            "desk.news.resolve",
            "desk",
            "Offline news resolve",
            "news.js parseRss + topicRssUrl",
            notes="Fixture RSS through the real parser; no HTTP.",
        ),
        Affordance(
            "desk.market.resolve",
            "desk",
            "Offline quotes resolve",
            "market.js parseGecko / parseYahoo",
            notes="Fixture JSON through the real parsers; no HTTP.",
        ),
        Affordance(
            "desk.nft.resolve",
            "desk",
            "Offline NFT floor resolve",
            "market.js parseNftLive + nftUrl",
            notes="Fixture JSON through the real parser; no HTTP.",
        ),
        Affordance(
            "desk.weather.replay",
            "desk",
            "Recorded forecast replay to the painted plate",
            "weather-areas.js forecastGate / readForecast / parseForecast + desk-house.js paintWeather",
            notes=(
                "A saved Open-Meteo response goes through the real read, parse, and paint with a fake fetch. "
                "Checks the plate words, the daily rows, the one forecast URL, and unread after a failed read. "
                "WMO 0/1/2/3/45/61/71/95 each show their own word (3 is Overcast, not Clear). A hostile place "
                "name paints as letters, and no plate writes innerHTML."
            ),
        ),
        Affordance(
            "desk.news.replay",
            "desk",
            "Recorded news replay to the painted plate",
            "news.js readRss / readFeatured / parseRss / parseNews + desk-house.js paintNews",
            notes=(
                "Saved Google News Popular and topic RSS plus a saved Wikipedia featured feed. Checks titles, "
                "sources, whole links, and that no Wikipedia markup reaches the plate. Hostile titles "
                "(<img onerror>, &lt;script&gt;) show as letters with no element made, and a javascript: link "
                "gets no link."
            ),
        ),
        Affordance(
            "desk.market.replay",
            "desk",
            "Recorded coin and stock replay to the painted plate",
            "market.js readGeckoMany / readYahoo / parseGeckoMany / parseYahoo + desk-house.js paintMarket",
            notes=(
                "Saved CoinGecko prices for the default list and a saved Yahoo AAPL chart. A coin missing from "
                "the response reads … and gets no invented price. A hostile coin name makes no element."
            ),
        ),
        Affordance(
            "desk.nft.replay",
            "desk",
            "Recorded NFT floor replay to the painted plate",
            "market.js readNft / parseNftLive + desk-house.js paintMarket",
            notes=(
                "Saved CoinGecko cryptopunks floor. A failed read says can't reach with no number. A hostile "
                "currency symbol from the feed paints as letters."
            ),
        ),
        Affordance(
            "desk.gpu.replay",
            "desk",
            "Saved GPU probe output through both readers",
            "gpu-sense.cjs read + gpu.js gpuLine / gpu.py read_local + gpu_line",
            notes=(
                "A recorded Windows probe plus built Windows-counter, two-adapter, Linux amdgpu, Mac, and "
                "no-GPU outputs. Desktop and blotter must print the same line. A missing reading stays "
                "unread. Counters read like Task Manager: add processes per engine, then the busiest "
                "engine. Counters are grouped per adapter LUID, and the adapter with the most VRAM is shown."
            ),
        ),
        Affordance(
            "desk.launch_check",
            "desk",
            "The start script checks Node and the pieces before it turns the pets on",
            "desktop.ps1 -Check (Windows) / desktop.sh --check (Mac, Linux)",
            notes=(
                "Runs the real start script in check mode, which changes nothing. With Node 22 or newer "
                "and npm on PATH it must print ok: node <the same version node -v prints> and a pieces "
                "state (ready, missing, unfinished, or changed), and a pictures state that matches the file: "
                "ready, missing, or lfs-pointers (a Git without LFS copied text pointers, so every pet would be "
                "invisible; the real start stops with plain Git LFS words). With no Node, an older Node, or no npm "
                "it must stop with plain words. The install stamp must not change. npm install and the "
                "overlay are never run."
            ),
        ),
        Affordance(
            "desk.tray.switch",
            "desk",
            "Tray On the desk and switch-pet change the guest; Hide the window / Show",
            "main.cjs trayTemplate deskPickMenu / switch-pet / Hide the window / Show",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "On the desk lists the desk picks in order with the current guest checked; a click sends one "
                "switch to the overlay and the rebuilt tray checks and names that guest. switch-pet ignores an "
                "unknown key. Companions lists the whole roster."
            ),
        ),
        Affordance(
            "desk.quit",
            "desk",
            "Turn off / Quit reach app.quit through every door",
            "main.cjs quit-desk / tray Quit / pet-menu Quit + pet.js hud-off + preload quit",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "quit-desk, tray Quit, and the pet menu Quit each ask app.quit once (counted, never called). "
                "Turn off on the keeper card asks twice before it sends quit-desk."
            ),
        ),
        Affordance(
            "desk.pictures_gate",
            "desk",
            "Started from npm start with Git LFS pointers or no pictures, the overlay says so instead of opening a glass of invisible pets",
            "main.cjs bootDesk + renderer/pictures.js + dialog.showMessageBox + tray + presence/open-link.cjs",
            notes=(
                "Loads the real desktop/main.cjs under the stand-in Electron with the pet picture read as lfs-pointers, then "
                "missing: no overlay window and no ticks, one small window with the Git LFS steps (Open git-lfs.com, OK), and "
                "the tray says Pet pictures did not download with How to fix, Open git-lfs.com, and Quit. A second start shows "
                "the words again; git-lfs.com opens through the same web-page-only gate as a clicked link. With the pictures "
                "ready the glass opens and no window is shown. Other desk rows boot with the pictures ready."
            ),
        ),
        Affordance(
            "desk.market.search",
            "desk",
            "Quotes look-up through main market-search",
            "main.cjs market-search / market.js searchUrl + parseSearchCoins/Nfts",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "An empty name stays home; no painted look-up line holds the read; a fake CoinGecko answer "
                "reads as coins and NFT rows; an HTTP 500 reads as unread, not as no coins."
            ),
        ),
        Affordance(
            "desk.settings.window",
            "desk",
            "The House window (Minds + Unlock) itself: fields, save, AI website address checks, Details, plain errors",
            "settings.html + mind.js + license-net.js + presence.js through the real preload.cjs and main.cjs",
            notes=(
                "Tray Minds... opens settings.html sandboxed and isolated with the preload, at Minds; Unlock... reuses "
                "the window and scrolls it to Unlock. The page's own scripts run against a stand-in DOM (harness_windows.cjs) "
                "and the real preload.cjs, which may require only electron. 14 plugins with local first, the whole roster "
                "under Pet, Locked on open. Four bad AI website addresses are named and not saved; a good save seals the key "
                "(mind.json has no plain key); an unwritable mind.json says Not saved; no secret store says the key was not "
                "written to disk. Details is folded, the summary toggles it, and the mark line follows hwid.txt. Unlock with "
                "an empty Steam ID or a refused connection shows only plain words; the raw error is logged. No network."
            ),
        ),
        Affordance(
            "desk.license.offline",
            "desk",
            "Unlock / Download my pet offline: valid, expired, wrong machine, network down, 500, 403, no store",
            "main.cjs license-* IPC + desktop/license session / client / decrypt / plain-error",
            notes=(
                "The real license code answers fake house-server replies (contract double and hand-made answers). "
                "The license key and signing key are test-only values; hwid.txt is pre-written, so the OS machine id "
                "is never read. A valid unlock keeps the download sign-in sealed (never plain) in license.json; with no "
                "secret store it stays in memory and a later download says so. Expired, wrong machine (issued and "
                "server-side), refused connection, HTTP 500, 403, an expired stored license on license-status, a missing "
                "license key, and empty Steam fields each give one exact plain sentence; the raw text is only in the log. "
                "No file under userData holds the key or a sign-in."
            ),
        ),
        Affordance(
            "desk.tray.menu",
            "desk",
            "The whole tray menu: rows, enabled state, every click, GPU gate menus",
            "main.cjs trayTemplate / careMenu / refusedTrayTemplate / gpuPathRows / refreshMenus",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron. The tray rows come in order with only the GPU "
                "line and the status line disabled; every care row sends its one command; vitals rename the special row "
                "and fill the status line and tooltip; Minds... opens one House window and Unlock... reuses it at Unlock; "
                "Hide the window / Show, Follow me across desktops (Windows), and Quit (counted). The software, refused, "
                "and no-adapter GPU gates are booted in their own node processes: Require hardware / Allow software "
                "restart only when the choice was saved."
            ),
        ),
        Affordance(
            "desk.links.open",
            "desk",
            "Painted news links open in the keeper's browser, never in the overlay",
            "desk-house.js link + presence/open-link.cjs sealContents / openLink",
            notes=(
                "Paints the saved Popular RSS, the saved Wikipedia featured feed, and a hostile item, then "
                "clicks every painted link through the same seal main.cjs puts on the overlay. Each "
                "http(s) link reaches shell.openExternal once and carries its Opens <host> line. "
                "javascript:, data:, file:, blob:, about:, chrome:, mailto:, ftp:, relative, and "
                "credential links are refused and logged by scheme only. Every window-open answer is deny "
                "and every navigation is prevented. A real browser opening stays unchecked."
            ),
        ),
        Affordance(
            "desk.favorites.news",
            "desk",
            "News Favorites load/persist/list",
            "news.js parseNewsPrefs / toggleFavorite / toCardPatch",
            notes="Offline prefs round-trip; no HTTP.",
        ),
        Affordance(
            "desk.favorites.market",
            "desk",
            "Coins/NFTs Favorites load/persist/list",
            "market.js toggleFavoriteTicker / toggleFavoriteNft / favoriteRows",
            notes="Offline market prefs; no HTTP.",
        ),
        Affordance(
            "desk.favorites.weather",
            "desk",
            "Weather Favorites load/persist/list",
            "weather-areas.js toggleFavorite / favoriteAreas / parseAreas",
            notes="Offline area favorites; no HTTP.",
        ),
        Affordance(
            "desk.news.topics",
            "desk",
            "News topics / Popular tab builders",
            "news.js addTopic / pickTopic / popularRssUrl / NEWS_TABS",
            notes="Topic list + Popular URL builders; no live RSS fetch.",
        ),
        Affordance(
            "desk.plates.style",
            "desk",
            "Plate window style / chrome",
            "desk-plates.js SWATCHES / applySwatch / paintStyle / loadPlates",
            notes="Swatch chrome + drag-place persist via memory store.",
        ),
        Affordance(
            "desk.plates.first_run",
            "desk",
            "Weather, news, quotes, and radio reach content from a clean card after the in-app yes",
            "card.js parseCard(null) + weather-areas / news / market / house-music read + desk-house paint",
            notes=(
                "Replay with saved answers (no network): a clean card's closed weather reads 'no area set' and "
                "the open panel says 'No place yet. Type a city below and press Look up.'; Look up (its painted "
                "line is the yes) finds Seattle and the forecast paints; news opens to headlines; a closed Quotes "
                "plate says 'open to see the price' and opens to prices; radio Find returns a station. An empty "
                "radio Find with no weather area still finds nothing (Rui's music block, left alone)."
            ),
        ),
        Affordance(
            "desk.plants.place",
            "desk",
            "Garden plant drag-place",
            "desk-plants.js beginDrag / moveDrag / endDrag / savePlants",
            notes="Disk/Felt place+mode without Electron; guest freehand drag stays GUI.",
        ),
        Affordance(
            "desk.windows.perch",
            "desk",
            "OS window work-area / perch pick",
            "windows.js takeRects + window-play.js pickTarget/beginPlay",
            notes="Fixture enum + work-area rects; budgie perch / cat ledge pick. No live HWND / multi-monitor.",
        ),
        Affordance(
            "desk.presence",
            "desk",
            "Presence does not list folders, read titles, or log keys",
            "presence.py / presence.cjs / presence.ts + windows-enum.cjs",
            notes=(
                "Offline: Desktop, Documents, Downloads, and any other host folder stay unlistable. "
                "Window captions stay empty. A path is omitted unless consent is already true. "
                "The enum pipe carries a shell bit, not a class name, title, or path. "
                "The enumerator does not copy a keeper window class. "
                "The taskbar and the desktop host are known shell handles. "
                "A focused field keeps its keys. A key outside that field is not logged. "
                "Escape may dismiss a menu. The key text is not stored. "
                "A live locate waits for an in-app yes. A stored live pin is rounded on load. "
                "A saved typed area does not start a new locate. "
                "The blotter does not send a place."
            ),
        ),
        Affordance(
            "desk.market.tickers",
            "desk",
            "Quotes add-any-ticker + watchlist persist",
            "market.js addTicker / removeTicker / parseSearchCoins / toCardPatch",
            notes="Offline classify/search fixtures + watchlist round-trip; no HTTP.",
        ),
        Affordance(
            "desk.news.x",
            "desk",
            "News X tab + site-filter RSS / search URLs",
            "news.js pickTab(x) / xTopicRssUrl / xSearchUrl / sourceLine",
            notes="X fallback builders offline; no live X/HTTP.",
        ),
        Affordance(
            "live.weather_forecast",
            "desk",
            "Open-Meteo forecast fetch",
            "weather-areas.ts forecastUrl",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. A saved response is replayed through read, parse, and paint as desk.weather.replay; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.news_rss",
            "desk",
            "Wikipedia / Google News fetch",
            "news.ts",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. Saved RSS and featured feeds are replayed through read, parse, and paint as desk.news.replay; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.market_quote",
            "desk",
            "CoinGecko / Yahoo live quote",
            "market.ts",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. Saved CoinGecko and Yahoo responses are replayed through read, parse, and paint as desk.market.replay; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.nft_floor",
            "desk",
            "CoinGecko NFT floor fetch",
            "market.ts nftUrl",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. A saved floor is replayed through read, parse, and paint as desk.nft.replay; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.gpu_sense",
            "desk",
            "Keeper-machine GPU probe",
            "gpu.py read_local",
            mode="live",
            fate="excluded",
            exclude_reason=(
                "Reads the keeper machine. Offline contract is card.gpu; saved probe output is replayed as desk.gpu.replay. "
                "Pass --live to probe. Linux reads nvidia-smi. Mac reads IOAccelerator. Never invents numbers."
            ),
        ),
    ]


LAUNCH_PIECES = ("ready", "missing", "unfinished", "changed")


def launch_next(pieces: str, pictures: str, script: str) -> str:
    """The plain next step check mode prints last: what to type, for the pictures first, then the pieces."""
    run = r".\desktop.ps1" if script == "desktop.ps1" else "sh desktop.sh"
    if pictures != "ready":
        return (
            "next: The pet pictures are not here yet. Install Git LFS from https://git-lfs.com, then in the computerpets "
            f"folder type git lfs install and then git lfs pull. Then type {run} and press Enter."
        )
    return {
        "missing": f"next: Type {run} and press Enter. It gets the pieces (a few minutes the first time), then the pets come on.",
        "unfinished": f"next: Type {run} and press Enter. It finishes getting the pieces, then the pets come on.",
        "changed": f"next: Type {run} and press Enter. It gets the new pieces, then the pets come on.",
    }.get(pieces, f"next: Type {run} and press Enter to turn the pets on.")
LAUNCH_PICTURES = ("ready", "missing", "lfs-pointers")
LAUNCH_PICTURE = ("desktop", "renderer", "sprites", "crow", "idle", "1.png")


def launch_pictures_state(root: Path) -> str:
    """What the start script should say about the overlay pictures: a Git without LFS leaves text pointers."""
    picture = root.joinpath(*LAUNCH_PICTURE)
    if not picture.is_file():
        return "missing"
    with picture.open("rb") as fh:
        head = fh.read(23)
    return "lfs-pointers" if head == b"version https://git-lfs" else "ready"
LAUNCH_NODE_MAJOR = 22


def _launch_check(aid: str) -> InvokeResult:
    """Run desktop.ps1 -Check / desktop.sh --check and hold it to what node -v says."""
    root = repo_root()
    if os.name == "nt":
        shell = shutil.which("powershell") or shutil.which("pwsh")
        script = "desktop.ps1"
        cmd = [shell, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(root / script), "-Check"] if shell else []
    else:
        shell = shutil.which("sh")
        script = "desktop.sh"
        cmd = [shell, str(root / script), "--check"] if shell else []
    if not cmd:
        return InvokeResult(aid, "desk", False, error=f"no shell to run {script}")
    node = shutil.which("node")
    npm = shutil.which("npm")
    version = ""
    if node:
        version = subprocess.run([node, "-v"], capture_output=True, text=True, timeout=60).stdout.strip()
    match = re.match(r"v(\d+)\.", version)
    major = int(match.group(1)) if match else 0
    stamp = root / "desktop" / "node_modules" / ".computerpets-installed"
    before = stamp.stat().st_mtime_ns if stamp.exists() else None
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120, cwd=str(root))
    after = stamp.stat().st_mtime_ns if stamp.exists() else None
    out = f"{proc.stdout or ''}{proc.stderr or ''}"
    pieces = re.search(r"^pieces: (\w+)\s*$", out, re.M)
    pictures = re.search(r"^pictures: ([\w-]+)\s*$", out, re.M)
    real_pictures = launch_pictures_state(root)
    fails: list[str] = []
    if not node:
        expect = "no node"
        if proc.returncode == 0 or "Node is not installed" not in out:
            fails.append("with no Node the start must stop with plain words")
    elif major < LAUNCH_NODE_MAJOR:
        expect = f"node {version} too old"
        if proc.returncode == 0 or "22 or newer" not in out or version not in out:
            fails.append(f"with Node {version} the start must stop and ask for 22 or newer")
    elif not npm:
        expect = "no npm"
        if proc.returncode == 0 or "npm is missing" not in out:
            fails.append("with no npm the start must stop with plain words")
    else:
        expect = "ready to start"
        if proc.returncode != 0:
            fails.append(f"{script} check exited {proc.returncode}: {out.strip()[:200]}")
        if f"ok: node {version}" not in out:
            fails.append(f"{script} check did not print ok: node {version}")
        if not pieces or pieces.group(1) not in LAUNCH_PIECES:
            fails.append(f"{script} check printed no pieces state")
        if not pictures or pictures.group(1) != real_pictures:
            fails.append(f"{script} check said pictures {pictures.group(1) if pictures else 'nothing'}, the file says {real_pictures}")
        if pieces and pictures:
            want = launch_next(pieces.group(1), pictures.group(1), script)
            lines = [ln.strip() for ln in out.splitlines() if ln.strip()]
            if not lines or lines[-1] != want:
                fails.append(f"{script} check's last line is {lines[-1] if lines else 'nothing'!r}, wanted {want!r}")
    if before != after:
        fails.append("check mode changed the install stamp")
    for word in ("npm install", "Getting the pieces"):
        if word in out:
            fails.append(f"check mode must not install ({word!r} printed)")
    state = pieces.group(1) if pieces else "none"
    seen = pictures.group(1) if pictures else "none"
    next_line = next((ln.strip() for ln in out.splitlines() if ln.startswith("next: ")), "")
    next_ok = bool(next_line) and not any("last line" in f for f in fails)
    ok = not fails
    return InvokeResult(
        aid,
        "desk",
        ok,
        detail=f"{script}: node {version or 'none'}; pieces {state}; pictures {seen}; exit {proc.returncode}",
        extras={"script": script, "node": version, "npm": bool(npm), "exit": proc.returncode, "pieces": state, "pictures": seen, "picturesReal": real_pictures, "expect": expect, "next": next_line},
        trace=[f"script={script}", f"node={version or 'none'}", f"expect={expect}", f"exit={proc.returncode}", f"pieces={state}", f"pictures={seen}", f"next={'plain' if next_ok else 'missing'}"],
        error=None if ok else "; ".join(fails),
    )


def _invoke_desk(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"desk.{local_id}" if not local_id.startswith("live.") else local_id
    if local_id == "weather":
        sky = weather_of()
        label = weather_label(sky)
        ok = sky in {"clear", "rain", "wind", "heat"} and label in {"Clear", "Rain", "Wind", "Heat"}
        return InvokeResult(
            aid, "desk", ok, detail=f"{sky}/{label}",
            extras={"sky": sky, "label": label},
            trace=[f"weather={sky}", f"label={label}"],
            error=None if ok else f"unexpected sky {sky!r}",
        )
    if local_id == "plates":
        src = _read("web/src/lib/pets/desk-plates.ts")
        js = _read("desktop/renderer/desk-plates.js")
        keys = 'PLATE_KEYS = ["weather", "news", "market"]'
        names = 'market: "Quotes"'
        ok = keys in src and names in src and keys.split(" = ")[1][:20] in js
        ok = ('["weather", "news", "market"]' in src and 'market: "Quotes"' in src
              and '["weather", "news", "market"]' in js)
        return InvokeResult(
            aid, "desk", ok, detail="weather/news/market",
            extras={"keys": ["weather", "news", "market"]},
            trace=["plates=weather,news,market"],
            error=None if ok else "desk-plates keys drifted",
        )
    if local_id == "news.urls":
        src = _read("web/src/lib/pets/news.ts")
        need = (
            'NEWS_TABS = ["popular", "topics", "x", "favorites"]',
            "export function newsUrl",
            "export function topicRssUrl",
            "export function popularRssUrl",
            'NEWS_HOST = "en.wikipedia.org"',
            'TOPIC_HOST = "news.google.com"',
        )
        missing = [n for n in need if n not in src]
        ok = not missing
        return InvokeResult(
            aid, "desk", ok, detail="news urls",
            extras={"missing": missing},
            trace=["news.urls"] + ([f"missing={missing}"] if missing else []),
            error=None if ok else f"news.ts missing {missing}",
        )
    if local_id == "market.urls":
        src = _read("web/src/lib/pets/market.ts")
        need = (
            'COINGECKO_HOST = "api.coingecko.com"',
            'YAHOO_HOST = "query1.finance.yahoo.com"',
            "export function geckoUrl",
            "export function yahooUrl",
            "export function nftUrl",
            'COIN_LABEL = "Coins"',
            'MARKET_LABEL = "Quotes"',
            'NFT_LABEL = "NFTs"',
            'geckoId: "ethereum"',
        )
        missing = [n for n in need if n not in src]
        ok = not missing
        return InvokeResult(
            aid, "desk", ok, detail="market urls",
            extras={"missing": missing},
            trace=["market.urls"] + ([f"missing={missing}"] if missing else []),
            error=None if ok else f"market.ts missing {missing}",
        )
    if local_id == "nft.address":
        src = _read("src/main/java/com/enterprisepet/nft/EthereumAddress.java")
        ok = 'Pattern.compile("^0x[0-9a-fA-F]{40}$")' in src
        sample_ok = bool(ETH_ADDR_RE.match("0x" + "a" * 40)) and not ETH_ADDR_RE.match("0x")
        ok = ok and sample_ok
        return InvokeResult(
            aid, "desk", ok, detail="ethereum address pattern",
            extras={"pattern": ETH_ADDR_RE.pattern},
            trace=["nft.address=0x+40hex"],
            error=None if ok else "EthereumAddress pattern missing or replica failed",
        )
    if local_id == "nft.catalog":
        src = _read("src/main/java/com/enterprisepet/nft/NftCatalog.java")
        ok = "class NftCatalog" in src and "listPublic" in src and "isEmpty" in src
        return InvokeResult(
            aid, "desk", ok, detail="NftCatalog",
            extras={"present": ok},
            trace=["nft.catalog=NftCatalog"],
            error=None if ok else "NftCatalog.java missing expected methods",
        )
    if local_id == "weather.resolve":
        return _run_node_smoke("weather_resolve", domain="desk", action_id=aid)
    if local_id == "news.resolve":
        return _run_node_smoke("news_resolve", domain="desk", action_id=aid)
    if local_id == "market.resolve":
        return _run_node_smoke("market_resolve", domain="desk", action_id=aid)
    if local_id == "nft.resolve":
        return _run_node_smoke("nft_resolve", domain="desk", action_id=aid)
    if local_id == "weather.replay":
        return _run_node_smoke("weather_replay", domain="desk", action_id=aid)
    if local_id == "plates.first_run":
        return _run_node_smoke("plates_first_run", domain="desk", action_id=aid)
    if local_id == "news.replay":
        return _run_node_smoke("news_replay", domain="desk", action_id=aid)
    if local_id == "market.replay":
        return _run_node_smoke("market_replay", domain="desk", action_id=aid)
    if local_id == "nft.replay":
        return _run_node_smoke("nft_replay", domain="desk", action_id=aid)
    if local_id == "gpu.replay":
        return _gpu_replay(aid)
    if local_id == "links.open":
        return _run_node_smoke("links_open", domain="desk", action_id=aid)
    if local_id == "launch_check":
        return _launch_check(aid)
    if local_id == "tray.switch":
        return _run_node_smoke("tray_on_the_desk", domain="desk", action_id=aid)
    if local_id == "quit":
        return _run_node_smoke("quit_desk", domain="desk", action_id=aid)
    if local_id == "pictures_gate":
        return _run_node_smoke("pictures_gate", domain="desk", action_id=aid)
    if local_id == "market.search":
        return _run_node_smoke("market_search", domain="desk", action_id=aid)
    if local_id == "settings.window":
        return _run_node_smoke("settings_window", domain="desk", action_id=aid)
    if local_id == "license.offline":
        return _run_node_smoke("license_offline", domain="desk", action_id=aid)
    if local_id == "tray.menu":
        return _run_node_smoke("tray_menu", domain="desk", action_id=aid)
    if local_id == "favorites.news":
        return _run_node_smoke("news_favorites", domain="desk", action_id=aid)
    if local_id == "favorites.market":
        return _run_node_smoke("market_favorites", domain="desk", action_id=aid)
    if local_id == "favorites.weather":
        return _run_node_smoke("weather_favorites", domain="desk", action_id=aid)
    if local_id == "news.topics":
        return _run_node_smoke("news_topics", domain="desk", action_id=aid)
    if local_id == "plates.style":
        return _run_node_smoke("plates_style", domain="desk", action_id=aid)
    if local_id == "plants.place":
        return _run_node_smoke("plants_place", domain="desk", action_id=aid)
    if local_id == "windows.perch":
        return _run_node_smoke("windows_perch", domain="desk", action_id=aid)
    if local_id == "presence":
        from .presence import classify_key, host_path_label, list_host_folder, record_keystroke, window_caption

        desktop = list_host_folder("Desktop")
        documents = list_host_folder(r"C:\Users\keeper\Documents")
        downloads = list_host_folder("Downloads")
        other = list_host_folder("/home/keeper/Projects")
        row = {
            "title": "homework.docx — Notepad",
            "document": "homework.docx",
            "path": r"C:\Users\keeper\Desktop\homework.docx",
            "className": "CabinetWClass",
        }
        hidden = host_path_label(row["path"], False)
        shown = host_path_label(row["path"], True)
        enum_src = _read("desktop/windows-enum.cjs")
        win_js = _read("desktop/renderer/windows.js")
        win_ts = _read("web/src/lib/pets/windows.ts")
        presence_js = _read("desktop/presence.cjs")
        presence_ts = _read("web/src/lib/pets/presence.ts")
        blotter = _read("client/computerpets_client/app.py")
        pet_js = _read("desktop/renderer/pet.js")
        room = _read("web/src/components/desk/companion-room.tsx")
        field_note = classify_key({"key": "hunter2", "target": {"tagName": "INPUT"}})
        outside = classify_key({"key": "hunter2", "target": {"tagName": "BODY"}})
        dismiss = classify_key({"key": "Escape", "target": {"tagName": "DIV"}})
        buf: list[str] = []
        logged = record_keystroke(buf, {"key": "hunter2"})
        main_js = _read("desktop/main.cjs")
        checks = {
            "desktop": desktop == {"listed": False, "names": []},
            "documents": documents["listed"] is False and documents["names"] == [],
            "downloads": downloads["names"] == [],
            "other": other["listed"] is False and other["names"] == [],
            "caption": window_caption(row) is None,
            "omit": hidden == "" and "homework" not in hidden,
            "consent": shown == row["path"],
            "enum": (
                "GetWindowText" not in enum_src
                and "GetClassName" not in enum_src
                and "StringBuilder" not in enum_src
                and "Get-ChildItem" not in enum_src
                and "cls.Replace" not in enum_src
                and 'shell ? "1" : "0"' in enum_src
                and "GetShellWindow" in enum_src
                and "FindWindowEx(IntPtr.Zero, prev, name, null)" in enum_src
            ),
            "parse": "className: p.slice" not in win_js and "className: p.slice" not in win_ts,
            "surfaces": (
                "function listHostFolder" in presence_js
                and "export function listHostFolder" in presence_ts
                and "def list_host_folder" in _read("client/computerpets_client/presence.py")
                and "list_host_folder" in blotter
                and "window_caption" in blotter
            ),
            "field": field_note == {"record": False, "field": True, "toggle": False} and "hunter2" not in str(field_note),
            "outside": outside == {"record": False, "field": False, "toggle": False} and "hunter2" not in str(outside),
            "dismiss": dismiss["toggle"] == "dismiss" and "Escape" not in str(dismiss),
            "log": logged == {"record": False, "keys": []} and buf == [],
            "hooks": (
                "globalShortcut" not in main_js
                and "SetWindowsHook" not in main_js
                and "PetPresence.classifyKey" in pet_js
                and "classifyKey(e)" in room
                and "def classify_key" in _read("client/computerpets_client/presence.py")
                and "classify_key" in blotter
                and "grabKeyboard" not in blotter
                and "keyPressEvent" not in blotter
            ),
        }
        failed = [name for name, ok in checks.items() if not ok]
        return InvokeResult(
            aid,
            "desk",
            not failed,
            detail="presence " + ",".join(checks),
            extras=checks,
            trace=[f"presence.{name}={'ok' if ok else 'fail'}" for name, ok in checks.items()],
            error=None if not failed else f"presence honesty drifted: {', '.join(failed)}",
        )
    if local_id == "market.tickers":
        return _run_node_smoke("market_tickers", domain="desk", action_id=aid)
    if local_id == "news.x":
        return _run_node_smoke("news_x", domain="desk", action_id=aid)
    return InvokeResult(aid, "desk", False, error=f"unknown desk id {local_id!r}")


def _assert_desk(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "desk invoke failed"]


# ---------------------------------------------------------------------------
# Card open / collapse hooks (no Electron)
# ---------------------------------------------------------------------------


def _card_rows() -> list[Affordance]:
    return [
        Affordance("card.blank", "card", "blankCard starts collapsed", "card.ts blankCard"),
        Affordance("card.collapse_hook", "card", "collapseKeeperCard", "pet.js collapseKeeperCard"),
        Affordance("card.open_hook", "card", "openKeeperCard", "pet.js openKeeperCard"),
        Affordance("card.colors", "card", "CARD_COLORS", "card.ts CARD_COLORS"),
        Affordance(
            "card.paint_wire",
            "card",
            "paintHud + persistCard + collapse/open wire",
            "pet.js paintHud / persistCard / collapseKeeperCard / openKeeperCard",
            notes="Source smoke via harness_smokes; full HUD paint stays gui.card_hud_paint.",
        ),
        Affordance(
            "card.notify_open",
            "card",
            "Notif deep-link opens pet card on need",
            "life.js careForNeed / alerts + pet.js openCareFromNotify",
            notes="Pure NEED_CARE map + alerts; openCareFromNotify wire smoke (no Electron session).",
        ),
        Affordance(
            "card.needs_persist",
            "card",
            "Needs save/reload + alert clear after care",
            "life.js save / load / alerts / act(feed|call)",
            notes="Vitals persist via life store; feed clears hunger alert; call clears hidden; load clears hidden by design.",
        ),
        Affordance(
            "card.speak_opts",
            "card",
            "TTS speakOpts rate/pitch/volume + voice styles",
            "card.js/card.ts speakOpts / VOICE_STYLES",
            notes=(
                "Offline: every VOICE_STYLES rate/pitch, hearth soft 0.92, volume clamp 0..100, "
                "unknown style falls back to hearth; pet.js + web companion-room/keeper-card speakOpts wires. "
                "No invented settings UI."
            ),
        ),
        Affordance(
            "card.volume_mutes",
            "card",
            "Guest volume clamp/persist + mute buses + cry volume",
            "card.js setGuest/load/save/isMuted + desk-house playVoice + pet.js hud-volume",
            notes=(
                "Offline: volume clamp 0..100 + load/save persist, MUTE_BUSES + isMuted bus map, "
                "playVoice cry volume=guest/100 and talk-mute no-op (Audio stub); "
                "hud-volume/hud-mutes + web keeper-card wires. Full HUD paint stays gui.card_hud_paint; "
                "live speakers stay live.cry_playback."
            ),
        ),
        Affordance(
            "card.gpu",
            "card",
            "Honest GPU sense contract",
            "gpu.py / gpu.js / gpu.ts",
            notes=(
                "Offline: valid, missing, malformed, stale, Linux nvidia-smi, and Mac IOAccelerator readings. "
                "Sparkline history grows only from fresh read samples and stays empty otherwise. "
                "No invented zeros. Live probe stays live.gpu_sense."
            ),
        ),
        Affordance(
            "card.house_server",
            "card",
            "House-server row hidden until a server is named; saved URL probed",
            "house-server.cjs target / keeper.js houseServerLine / pet.js readHouseServer",
            notes=(
                "Offline: no Backend URL and no license keeps the row hidden with no probe; a URL saved in "
                "Settings wins over env and license; the row reads House server · reachable/unreachable, "
                "never Java 8081 or unread. The live probe itself is unit-tested with a fake fetch."
            ),
        ),
        Affordance(
            "card.listener",
            "card",
            "Honest mind-bus listener name",
            "listener.py / listener.js / listener.ts",
            notes=(
                "Offline: House lines unless the plugin can actually be asked. "
                "Overlay needs has_key true. Desk guests stay House lines. "
                "A signed-in cloud name needs house_keys[id] true. "
                "The blotter has no bus. No key, URL, or model on the line."
            ),
        ),
        Affordance(
            "card.minds_blotter",
            "card",
            "Blotter Minds: pets talk without an AI; House lines shows no AI boxes; same words on all three doors",
            "minds.py + app.py minds_label / --check, web mind-words.ts + routes/mind.tsx, overlay settings.html + mind.js",
            notes=(
                "Offline: minds.py holds the Minds intro, the House lines note, and the plain address and key labels "
                "with their helper lines, plus Which AI, the AI model name box and its helper line, and the key box "
                "placeholder, word for word the same as web mind-words.ts and overlay settings.html. "
                "House lines (and anything unknown) shows no box; every real AI shows AI model name, AI website address, and "
                "Your key for that AI website. The blotter window shows the intro and House lines note under the "
                "listener line and --check fails if an AI box or a Base URL / API key label appears. The web /mind "
                "page and the overlay hide the boxes for House lines too."
            ),
        ),
        Affordance(
            "card.alarm",
            "card",
            "Alarm rings once while the overlay is hidden and keeps its day",
            "card.js alarmCatch / clockTick + pet.js keeper clock + main card-set/card-get",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "One-second looks through a hidden stretch ring once in the alarm minute; the ring day reaches "
                "card.json so a restart does not ring again; a computer asleep over the minute rings once, late; "
                "23:59 across midnight keeps yesterday; a past time or an off alarm stays quiet. pet.js keeps the "
                "clock running while hidden and sends a notification. Clicking that notification shows the "
                "overlay and the alarm's saved line (clock-note), not care; a care notification still opens care."
            ),
        ),
        Affordance(
            "card.timer",
            "card",
            "Timer rings on time while hidden and survives a reload",
            "card.js startTimer / stopTimer / clockTick + main card-set/card-get",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "A five-minute timer rings once, on the second it ends; a running timer saved to card.json comes "
                "back and still ends on the wall clock; stop keeps the time left. A clicked timer notification "
                "shows the overlay (clock-note), not care."
            ),
        ),
        Affordance(
            "card.first_run",
            "card",
            "A brand-new keeper: house defaults, a one-time hello, and a calm heartbeat (desktop and web)",
            "main card-get/card-set + card.js firstHintSeen + keeper.js firstHint + web first-run.ts / keeper.ts",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron with a fresh userData (no card.json): the "
                "card starts open with the house defaults, the hello shows, Got it writes firstHintSeen, and after a "
                "restart and an unrelated write it never shows again. The web half starts with empty storage: the "
                "card loads the defaults, the hello shows once (its own key), and the heartbeat reads 'House server "
                "not running (optional)' until the server answers, DOWN only after it answered and stopped."
            ),
        ),
        Affordance(
            "card.saved_lines",
            "card",
            "Saved lines trim, clip, cap, persist, and ring from the alarm",
            "card.js addLine / removeLine / lineById + main card-set/card-get",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "Blank lines are skipped, long lines clip to 140 characters, the newest 12 are kept, lines come "
                "back from card.json, a removed line stays gone, and an alarm rings its named line."
            ),
        ),
        Affordance(
            "card.music",
            "card",
            "House loop plays a real file; Radio find goes through main radio-search",
            "house-music.js MUSIC_PLUGINS / overlayPlaySrc + main.cjs radio-search",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "The house loop is a real wav in the overlay folder. radio-search holds the read with no painted "
                "line, reads only Radio Browser hosts with the house user agent, drops a station with no safe "
                "stream, and reads a dead directory as can't reach. A live stream is not played."
            ),
        ),
        Affordance(
            "card.mind",
            "card",
            "Minds mind-set seals the key; mind-get opens it",
            "main.cjs mind-set / mind-get + mind-secret.cjs",
            notes=(
                "Loads the real desktop/main.cjs under a stand-in Electron (harness_main.cjs): no window, tray icon, network, or quit. "
                "With a stand-in OS secret store the key is sealed (kept os) and mind.json holds no plain key; "
                "mind-get opens it with the plugin and voice. With no store the key is not written and not invented."
            ),
        ),
    ]


def _invoke_card(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"card.{local_id}" if not local_id.startswith("gui.") else local_id
    ts = _read("web/src/lib/pets/card.ts")
    pet = _read("desktop/renderer/pet.js")
    if local_id == "blank":
        ok = "export function blankCard" in ts and "collapsed: true" in ts
        return InvokeResult(
            aid, "card", ok, detail="collapsed:true",
            extras={"collapsed": True},
            trace=["blank.collapsed=true"],
            error=None if ok else "blankCard does not start collapsed",
        )
    if local_id == "collapse_hook":
        ok = "function collapseKeeperCard()" in pet and "card.collapsed = true" in pet
        return InvokeResult(
            aid, "card", ok, detail="collapseKeeperCard",
            extras={"hook": ok},
            trace=["collapseKeeperCard"],
            error=None if ok else "collapseKeeperCard missing",
        )
    if local_id == "open_hook":
        ok = "function openKeeperCard()" in pet and "card.collapsed = false" in pet
        return InvokeResult(
            aid, "card", ok, detail="openKeeperCard",
            extras={"hook": ok},
            trace=["openKeeperCard"],
            error=None if ok else "openKeeperCard missing",
        )
    if local_id == "colors":
        ok = all(c in ts for c in ('"ink"', '"blotter"', '"moss"', '"ember"', '"dusk"', '"frost"'))
        return InvokeResult(
            aid, "card", ok, detail="ink blotter moss ember dusk frost",
            extras={"ids": ["ink", "blotter", "moss", "ember", "dusk", "frost"]},
            trace=["colors=ink,blotter,moss,ember,dusk,frost"],
            error=None if ok else "CARD_COLORS drifted",
        )
    if local_id == "paint_wire":
        return _run_node_smoke("card_paint_wire", domain="card", action_id=aid)
    main_rows = {
        "alarm": "alarm_clock",
        "timer": "timer_clock",
        "saved_lines": "saved_lines",
        "music": "music_radio",
        "mind": "mind_get_set",
    }
    if local_id in main_rows:
        return _run_node_smoke(main_rows[local_id], domain="card", action_id=aid)
    if local_id == "first_run":
        desk = _run_node_smoke("first_run_desk", domain="card", action_id=aid)
        if not desk.ok:
            return desk
        web = _run_web_smoke("first_run", domain="card", action_id=aid)
        if not web.ok:
            return web
        return InvokeResult(
            aid,
            "card",
            True,
            detail=f"desk={desk.detail}; web={web.detail}",
            extras={"desk": desk.extras, "web": web.extras},
            trace=[*list(desk.trace), *list(web.trace)],
        )
    if local_id == "house_server":
        return _run_node_smoke("house_server_row", domain="card", action_id=aid)
    if local_id == "notify_open":
        return _run_node_smoke("notify_open", domain="card", action_id=aid)
    if local_id == "needs_persist":
        return _run_node_smoke("needs_persist", domain="card", action_id=aid)
    if local_id == "speak_opts":
        desk = _run_node_smoke("speak_opts", domain="card", action_id=aid)
        if not desk.ok:
            return desk
        web = _run_web_smoke("speak_opts", domain="card", action_id=aid, use_tsx=True)
        if not web.ok:
            return web
        return InvokeResult(
            aid,
            "card",
            True,
            detail=f"desk={desk.detail}; web={web.detail}",
            extras={"desk": desk.extras, "web": web.extras},
            trace=[*list(desk.trace), *list(web.trace)],
        )
    if local_id == "volume_mutes":
        desk = _run_node_smoke("volume_mutes", domain="card", action_id=aid)
        if not desk.ok:
            return desk
        web = _run_web_smoke("volume_mutes", domain="card", action_id=aid, use_tsx=True)
        if not web.ok:
            return web
        return InvokeResult(
            aid,
            "card",
            True,
            detail=f"desk={desk.detail}; web={web.detail}",
            extras={"desk": desk.extras, "web": web.extras},
            trace=[*list(desk.trace), *list(web.trace)],
        )
    if local_id == "gpu":
        from .gpu import (
            STALE_MS,
            UNREAD_INK,
            gpu_line,
            later_door,
            parse_sample,
            present,
            remember,
            sample_from_probe,
            senses_on,
            sparkline,
        )

        now = 1_700_000_000_000
        csv = "NVIDIA GeForce RTX 4070, 62, 14, 3200, 12288, 48.5"
        valid = sample_from_probe({"nvidiaCsv": csv}, platform="win32", now_ms=now)
        missing = sample_from_probe(
            {"nvidiaCsv": None, "engines": None, "adapterMemory": None},
            platform="win32",
            now_ms=now,
        )
        malformed = parse_sample(0)
        stale = present(valid, now + STALE_MS + 1)
        linux = sample_from_probe({"nvidiaCsv": csv}, platform="linux", now_ms=now)
        amd = sample_from_probe(
            {"amdgpuCsv": "amdgpu 1002:73BF, [N/A], 37, 2048, 8192, [N/A]"},
            platform="linux",
            now_ms=now,
        )
        darwin = sample_from_probe({"nvidiaCsv": csv}, platform="darwin", now_ms=now)
        overlay = _read("desktop/renderer/index.html")
        card = _read("web/src/components/desk/keeper-card.tsx")
        desk = _read("desktop/renderer/gpu.js")
        web = _read("web/src/lib/pets/gpu.ts")
        blotter = _read("client/computerpets_client/app.py")
        second = sample_from_probe(
            {"nvidiaCsv": "NVIDIA GeForce RTX 4070, 62, 40, 3200, 12288, 48.5"},
            platform="win32",
            now_ms=now + 1000,
        )
        history = remember(remember([], valid, now), second, now + 1000)
        trail = sparkline(history, second, now + 1000)
        later = now + 1000 + STALE_MS + 1
        stale_history = remember(history, present(second, later), later)
        checks = {
            "valid": valid["status"] == "read" and valid["tempC"] == 62 and valid["utilPercent"] == 14,
            "missing": missing["status"] == "unread" and missing["utilPercent"] is None and "0%" not in gpu_line(missing),
            "malformed": malformed["status"] == "malformed" and malformed["utilPercent"] is None and "0%" not in gpu_line(malformed),
            "stale": stale["status"] == "stale" and stale["tempC"] is None and "62" not in gpu_line(stale),
            "linux": linux["status"] == "read" and linux["tempC"] == 62 and linux["utilPercent"] == 14 and later_door("linux") is None and senses_on("linux"),
            "amdgpu": amd["status"] == "read" and amd["source"] == "amdgpu" and amd["utilPercent"] == 37 and amd["tempC"] is None and amd["powerWatts"] is None and "0%" not in gpu_line(amd),
            "darwin": darwin["status"] == "read" and darwin["source"] == "ioaccelerator" and darwin["tempC"] == 62 and darwin["utilPercent"] == 14 and later_door("darwin") is None and senses_on("darwin"),
            "history": len(history) == 2 and history[0]["utilPercent"] == 14 and history[1]["utilPercent"] == 40 and trail["path"] == "M1 11.3 L71 8.2" and trail["empty"] is False,
            "unread_spark": remember([], missing, now) == [] and sparkline([], missing, now)["path"] == "" and sparkline([], missing, now)["ink"] == UNREAD_INK,
            "stale_spark": stale_history == [] and sparkline(history, present(second, later), later)["path"] == "",
            "malformed_spark": remember([], malformed, now) == [] and sparkline([], malformed, now)["path"] == "",
            "unsupported_spark": remember([], sample_from_probe({"nvidiaCsv": csv}, platform="freebsd", now_ms=now), now) == [] and sparkline([], sample_from_probe({"nvidiaCsv": csv}, platform="freebsd", now_ms=now), now)["path"] == "",
            "surfaces": (
                'id="hud-gpu"' in overlay
                and 'data-spark="empty"' in overlay
                and "keeper-gpu" not in card
                and "gpuLine(" not in card
                and "No GPU line on the web page" in card
                and "function remember" in desk
                and "function sparkline" in desk
                and "export function sparkline" in web
                and "gpu_spark" in blotter
                and "def sparkline" in _read("client/computerpets_client/gpu.py")
            ),
        }
        failed = [name for name, ok in checks.items() if not ok]
        return InvokeResult(
            aid,
            "card",
            not failed,
            detail="gpu " + ",".join(checks),
            extras=checks,
            trace=[f"gpu.{name}={'ok' if ok else 'fail'}" for name, ok in checks.items()],
            error=None if not failed else f"gpu sense drifted: {', '.join(failed)}",
        )
    if local_id == "minds_blotter":
        from . import minds
        from .listener import PRESETS

        web_words = _read("web/src/lib/ai/mind-words.ts")
        settings = _read("desktop/renderer/settings.html")
        mind_js = _read("desktop/renderer/mind.js")
        page = _read("web/src/routes/mind.tsx")
        blotter_src = _read("client/computerpets_client/app.py")
        words = {
            "intro": minds.MINDS_INTRO,
            "which": minds.WHICH_LABEL,
            "allPets": minds.ALL_PETS_LABEL,
            "sameAsAll": minds.SAME_AS_ALL_LABEL,
            "house": minds.HOUSE_NOTE,
            "model": minds.MODEL_LABEL,
            "modelHelp": minds.MODEL_HELP,
            "address": minds.ADDRESS_LABEL,
            "addressHelp": minds.ADDRESS_HELP,
            "key": minds.KEY_LABEL,
            "keyHelp": minds.KEY_HELP,
            "keyPlaceholder": minds.KEY_PLACEHOLDER,
        }
        refusals = re.findall(
            r'return "([^"]*)";',
            mind_js[mind_js.find("function baseUrlProblem("):mind_js.find("function binding(")],
        )
        real = [row["id"] for row in PRESETS if row["kind"] != "local"]
        checks = {
            "web_same": all(f'  {k}: "{v.replace(chr(34), chr(92) + chr(34))}",' in web_words for k, v in words.items()),
            # The overlay has one AI for all pets and no per-animal box, so "Same as all pets" is web-only there.
            "overlay_same": all(v in settings for k, v in words.items() if k != "sameAsAll"),
            "house_no_boxes": minds.mind_fields("local") == [] and minds.mind_fields("nope") == [],
            "ai_three_boxes": all(
                [f["label"] for f in minds.mind_fields(pid)] == [minds.MODEL_LABEL, minds.ADDRESS_LABEL, minds.KEY_LABEL] for pid in real
            ),
            "blotter_note": (
                "self.minds_label = QLabel(blotter_minds_text())" in blotter_src
                and 'setObjectName("mindsNote")' in blotter_src
                and 'print(f"ok: minds {MINDS_INTRO} House lines, no AI boxes")' in blotter_src
            ),
            "web_hides": 'selected.kind === "local" ?' in page and "{MIND_WORDS.house}" in page and "label={MIND_WORDS.address}" in page,
            "no_jargon": (
                not re.search(r"<label[^>]*>(Base URL|API key)</label>", settings)
                and 'label="Base URL"' not in page
                and 'label="API key"' not in page
                and len(refusals) >= 5
                and all("Base URL" not in r and "API key" not in r for r in refusals)
            ),
        }
        failed = [name for name, ok in checks.items() if not ok]
        trace = [f"minds.{name}={'ok' if ok else 'fail'}" for name, ok in checks.items()]
        if not failed:
            trace += ["minds=same_words_web+overlay+blotter", "house_lines=no_ai_boxes", "blotter=talk_without_ai"]
        return InvokeResult(
            aid,
            "card",
            not failed,
            detail="minds " + ",".join(checks),
            extras=checks,
            trace=trace,
            error=None if not failed else f"minds words drifted: {', '.join(failed)}",
        )
    if local_id == "listener":
        from .listener import name_listener

        secret = "sk-live-DO-NOT-PAINT"
        guest = name_listener({"door": "desk", "plugin": "xai", "signed_in": False, "house_keys": {"xai": True}, "api_key": secret})
        signed = name_listener({"door": "desk", "plugin": "xai", "signed_in": True, "house_keys": {"xai": True}, "api_key": secret})
        no_key = name_listener({"door": "desk", "plugin": "xai", "signed_in": True, "house_keys": {"xai": False}})
        overlay = name_listener({"door": "overlay", "plugin": "openai", "has_key": True, "api_key": secret})
        overlay_bare = name_listener({"door": "overlay", "plugin": "openai", "has_key": secret})
        blotter = name_listener({"door": "blotter", "plugin": "xai", "has_key": True, "house_keys": {"xai": True}})
        ollama = name_listener({"door": "overlay", "plugin": "ollama"})
        unsafe = name_listener({"door": "overlay", "plugin": "custom", "base_url": "http://169.254.169.254/latest"})
        unknown = name_listener({"door": "overlay", "plugin": secret})
        overlay_html = _read("desktop/renderer/index.html")
        pet = _read("desktop/renderer/pet.js")
        card = _read("web/src/components/desk/keeper-card.tsx")
        read_src = _read("web/src/lib/ai/listener-read.ts")
        blotter_src = _read("client/computerpets_client/app.py")
        checks = {
            "guest": guest["id"] == "local" and secret not in guest["line"],
            "signed": signed["id"] == "xai" and signed["line"] == "Listening · xAI Grok" and secret not in signed["line"],
            "no_key": no_key["id"] == "local",
            "overlay": overlay["id"] == "openai" and secret not in str(overlay.values()),
            "string_key": overlay_bare["id"] == "local" and secret not in overlay_bare["line"],
            "blotter": blotter["line"] == "Listening · House lines",
            "ollama": ollama["line"] == "Listening · Ollama",
            "unsafe": unsafe["id"] == "local" and "169.254" not in unsafe["line"],
            "unknown": unknown["id"] == "local" and secret not in unknown["line"],
            "surfaces": (
                'id="hud-listener"' in overlay_html
                and "Listening · House lines" in overlay_html
                and "nameListener" in pet
                and "hasKey: key.length > 0" in pet
                and "keeper-listener" in card
                and "readMindListener({ data: listenerReadBody({ plugin: askedPlugin, baseUrl: askedBase }) })" in card
                and "apiKey" not in read_src.split("return nameListener", 1)[-1]
                and 'door": "blotter"' in blotter_src
                and "listener_label" in blotter_src
            ),
        }
        failed = [name for name, ok in checks.items() if not ok]
        return InvokeResult(
            aid,
            "card",
            not failed,
            detail="listener " + ",".join(checks),
            extras=checks,
            trace=[f"listener.{name}={'ok' if ok else 'fail'}" for name, ok in checks.items()],
            error=None if not failed else f"listener naming drifted: {', '.join(failed)}",
        )
    return InvokeResult(aid, "card", False, error=f"unknown card id {local_id!r}")


def _assert_card(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "card invoke failed"]




# ---------------------------------------------------------------------------
# GUI gaps + narrower driven smokes (desk/renderer harness, not a display)
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Web companion-room lockstep (guest-choice.ts / ethogram+tricks TS / demo)
# ---------------------------------------------------------------------------

_TRICKS_LIST_RE = re.compile(
    r"(?:export\s+)?const\s+TRICKS\s*=\s*\[([^\]]*)\]",
    re.S,
)
_TRICK_NAME_RE = re.compile(r'["\']([a-z0-9_]+)["\']')
_ETHOGRAM_KEY_RE = re.compile(r"^\s{2}([a-z0-9_]+):\s*\[", re.M)


def _web_smoke_script() -> Path:
    return Path(__file__).resolve().with_name("harness_web_smokes.mjs")


def _run_web_smoke(
    command: str,
    *,
    domain: str,
    action_id: str,
    extra_args: list[str] | None = None,
    use_tsx: bool = False,
) -> InvokeResult:
    """Drive web/src TypeScript modules offline via harness_web_smokes.mjs.

    Most commands use node --experimental-strip-types. Catalog-wide
    Extensionless TS imports (plaques.classroomFor, card.ts graph) need use_tsx=True
    (npx tsx) — blotter.classroom + card.speak_opts/volume_mutes; not invented; real module load.
    """
    import json
    import shutil
    import subprocess

    node = shutil.which("node")
    script = _web_smoke_script()
    if not node:
        return InvokeResult(action_id, domain, False, error="node not on PATH")
    if not script.is_file():
        return InvokeResult(action_id, domain, False, error=f"missing {script.name}")
    if use_tsx:
        npx = shutil.which("npx")
        if not npx:
            return InvokeResult(action_id, domain, False, error="npx not on PATH (needed for tsx classroom lockstep)")
        argv = [npx, "--yes", "tsx", str(script), command]
    else:
        argv = [node, "--experimental-strip-types", str(script), command]
    if extra_args:
        argv.extend(extra_args)
    try:
        proc = subprocess.run(
            argv,
            capture_output=True,
            text=True,
            cwd=str(repo_root()),
            timeout=90 if use_tsx else 45,
            check=False,
        )
    except Exception as exc:  # oracle: surface, do not crash runner
        return InvokeResult(action_id, domain, False, error=f"{type(exc).__name__}: {exc}")
    raw = (proc.stdout or "").strip().splitlines()
    line = raw[-1] if raw else ""
    try:
        payload = json.loads(line) if line else {}
    except json.JSONDecodeError:
        err = (proc.stderr or line)[:200]
        return InvokeResult(
            action_id, domain, False,
            error=f"web smoke JSON parse failed: {err}",
            detail=line[:200],
        )
    ok = bool(payload.get("ok")) and proc.returncode == 0
    trace = [str(t) for t in (payload.get("trace") or [])]
    extras = dict(payload.get("extras") or {})
    extras["smoke"] = command
    return InvokeResult(
        action_id=action_id,
        domain=domain,
        ok=ok,
        detail=str(payload.get("detail") or ""),
        extras=extras,
        trace=trace or ([f"smoke={command}"] if ok else []),
        error=None if ok else str(
            payload.get("error") or payload.get("detail") or f"web smoke {command} failed"
        ),
    )


def _tricks_list_from_text(text: str) -> list[str] | None:
    match = _TRICKS_LIST_RE.search(text)
    if not match:
        return None
    return _TRICK_NAME_RE.findall(match.group(1))


def _tricks_path_side(key: str, side: str) -> Path | None:
    """Resolve desktop *-tricks.js or web *-tricks.ts for a catalog key (alias-aware)."""
    if side == "desktop":
        folder, suffix, pattern = (
            repo_root() / "desktop" / "renderer",
            ".js",
            "*-tricks.js",
        )
    elif side == "web":
        folder, suffix, pattern = (
            repo_root() / "web" / "src" / "lib" / "pets",
            ".ts",
            "*-tricks.ts",
        )
    else:
        raise ValueError(side)
    for stem in _tricks_stem_candidates(key):
        path = folder / f"{stem}-tricks{suffix}"
        if not path.is_file() or path.name in _TRICKS_REGISTRY_NAMES:
            continue
        if _tricks_file_key(path) == key:
            return path
    if folder.is_dir():
        for path in sorted(folder.glob(pattern)):
            if path.name in _TRICKS_REGISTRY_NAMES:
                continue
            if _tricks_file_key(path) == key:
                return path
    return None


def _ethogram_ts_keys() -> set[str]:
    src = _read("web/src/lib/pets/ethogram.ts")
    return set(_ETHOGRAM_KEY_RE.findall(src))


def _web_rows() -> list[Affordance]:
    return [
        Affordance(
            "web.guest_choice",
            "web",
            "Web guest-choice Exit/Close last",
            "web/src/lib/pets/guest-choice.ts",
            notes=(
                "Drives guest-choice.ts (not only desktop choice.js / Python choice.py). "
                "GUEST_CHOICE + guestMarks lockstep with choice.js; marks end close/exit; "
                "CompanionRoom wires guestTap/guestMarks."
            ),
        ),
        Affordance(
            "web.ethogram_tricks",
            "web",
            "Web ethogram + tricks TS catalog lockstep",
            "web/src/lib/pets/ethogram.ts + *-tricks.ts",
            notes=(
                "CSRBT-style house-wide invariant: every CATALOG_KEYS guest appears in "
                "ethogram.ts; every non-Rui key has web+desktop tricks files with matching "
                "TRICKS lists (alias-aware). Rui stays the only ethogram.tricks exclusion."
            ),
        ),
        Affordance(
            "web.demo_room",
            "web",
            "Demo stage CompanionRoom smoke",
            "web/src/components/desk/demo-stage.tsx",
            notes=(
                "Pure offline check already present in demo-walk.test.mjs — CompanionRoom, "
                "persistLocal=false, demo.$slug DemoStage. No invented static-export smoke "
                "(TanStack/nitro has no pure offline export check)."
            ),
        ),
        Affordance(
            "web.load_problems",
            "web",
            "Failed loads say so; admin checks its address",
            "web/src/lib/plain-error.ts loadProblem + web/src/lib/admin/base.ts",
            notes=(
                "Real plain-error.ts loadProblem for kennel / ember / desk / sign-in (plain reason, raw text "
                "only in the log) and the routes that use it with a retry; admin/base.ts pickApiBase "
                "(env, then this site, then localhost only for a local page), isLicenseList (a 404 or a "
                "non-list is not the license service), and formatLocalWhen (local time, ISO in the tooltip)."
            ),
        ),
        Affordance(
            "web.plain_reasons",
            "web",
            "Nest, play save, admin search, and Minds test say why",
            "web/src/lib/plain-error.ts careNotSaved/mindProblem + web/src/lib/admin/base.ts",
            notes=(
                "Real plain-error.ts: loadProblem('nest') for a failed nest load, careNotSaved('play') for a "
                "play the house could not save (meters stay put, retry offered), and mindProblemKind / "
                "mindProblem for a Minds test (key rejected, rate limited, wrong address, server, refused URL, "
                "unreachable; raw text only in the log); admin/base.ts isLicenseRow / isLicenseMissing / "
                "isRevokeMiss so search and revoke only trust license-service answers."
            ),
        ),
        Affordance(
            "web.care_talk_plates",
            "web",
            "Care saves, talk, revoke, plates, and keeper sound say why",
            "web/src/lib/plain-error.ts careNotSaved/talkProblem/plateProblem/soundProblem + admin/base.ts isRevokeDone",
            notes=(
                "Real plain-error.ts: careNotSaved for feed / rest / clean / medicine (meters stay put, Try again), "
                "talkProblem (Minds reasons when a plugin was involved, house reasons otherwise; the house line "
                "still speaks), plateProblem for the forecast / headlines / price plates (no house-server words), "
                "soundProblem for music and sleep sounds (a deliberate pause says nothing); admin/base.ts "
                "isRevokeDone so a revoke only counts on the ledger's own confirmation for that jti."
            ),
        ),
        Affordance(
            "web.pets_admin_music",
            "web",
            "One care message, revoke vs list refresh, shared house music, one heartbeat poll",
            "web/src/lib/plain-error.ts roomReportsCare + admin/base.ts markRevoked + pets/house-music.ts + pets/keeper.ts",
            notes=(
                "Real web modules: roomReportsCare so /pets/$key drops its toast for feed / play / rest / clean / "
                "medicine (the room line with Try again says it); admin/base.ts markRevoked / revokedListStale so "
                "a confirmed revoke reads as done when only the list refresh failed; house-music.ts and desktop "
                "house-music.js sharedMusicShows / houseMusicToggle (a small Pause/Play on every guest but Rui, "
                "whose block is untouched); keeper.ts createHeartbeatPoll (one interval for every subscriber, "
                "DOWN when unreachable); plateProblem('floor') for the NFT floor line."
            ),
        ),
        Affordance(
            "web.pets_keys_idle",
            "web",
            "Rename and let-go say why, music pick hint, one re-read, overlay keys, screen-reader names, idle pauses",
            "web/src/lib/plain-error.ts petNotSaved + admin/base.ts rereadOnce + pets/keeper.ts everyVisible + desktop keeper.js",
            notes=(
                "Real modules: petNotSaved for a failed rename or let-go on /pets/$key (plain line, Try again); "
                "house-music.ts / house-music.js sharedMusicHint ('Pick music on Rui's card.' when the music is "
                "off or radio has no station, never on Rui's card); admin/base.ts rereadOnce (one list re-read "
                "after a stale-list revoke, on a timer or focus); desktop keeper.js tabWrap / cardKey (Tab wraps "
                "inside the open keeper card, Escape closes it after a menu); keeper.ts petArtLabel / roomLabel; "
                "keeper.ts everyVisible (a hidden page pauses, showing it resumes)."
            ),
        ),
        Affordance(
            "web.pet_keys_plates",
            "web",
            "The pet is a keyboard button, overlay plates join the Tab cycle, idle pauses, a cheaper clock, admin names",
            "web/src/lib/pets/keeper.ts petTapLabel / isTapKey / isStale + card.ts createCardTickReader + admin/base.ts",
            notes=(
                "Real modules: keeper.ts petTapLabel / isTapKey (the pet's hit area is a button; Enter or Space taps, "
                "the room's opens the sit choice with focus in it) and isStale (the news plate reads once on return "
                "only when 20 minutes old); card.ts createCardTickReader (the keeper clock parses the saved card only "
                "when its text changed); admin/base.ts ledgerCaption / focusAfterGate. Also checks the living pet, "
                "room, floor, news plate, keeper card, admin page, overlay pet.js (plates in the Tab cycle, focus "
                "kept across a repaint, alarm and mutes pressed), and desktop/README (the Keeper card item) use them."
            ),
        ),
        Affordance(
            "web.menu_keys_escape",
            "web",
            "Sit menu keys, Escape and a key to open the card, plate tabs, Drop keeps focus, one walker stop, revoke focus, idle",
            "web/src/lib/pets/keeper.ts rovingIndex / menuKey / visibleTimeline + card.ts afterDrop + admin/base.ts + p2p.ts",
            notes=(
                "Real modules: keeper.ts rovingIndex / menuKey (the sit choice is a menu: arrows, Home / End, Escape "
                "closes and focus goes back to the guest; the /meet walkers are one hello group) and visibleTimeline "
                "(the house visit runs on shown time); card.ts afterDrop and desktop keeper.js afterDrop (a keyboard "
                "Drop lands on the next saved line); keeper.js cardKey inPlate / rovingIndex (Escape on a plate steps "
                "back to the card; plate tabs take the arrow keys); admin/base.ts revokeAskFocus; p2p.ts pollDelay "
                "(the relay poll slows while hidden). Also checks the menu, room, keeper card, walkers, admin page, "
                "house visit, flyers, overlay pet.js / desk-house.js / index.html use them."
            ),
        ),
        Affordance(
            "web.plain_words",
            "web",
            "Kid-plain keeper card and plate words (web and overlay), closed plate headers, roving web plate tabs",
            "web keeper.ts heartbeatLine / heartbeatDetail / tabKey + gpu.ts + listener.ts + weather-areas.ts + news.ts, overlay keeper.js / gpu.js / listener.js",
            notes=(
                "Real modules on both surfaces: the heartbeat and the overlay house-server row read 'House server "
                "not running (optional)', 'House server running · up 2h', or 'House server stopped answering "
                "(optional). Pets still work.' with the port and profile only in the tooltip; the care, Turn off, "
                "GPU, listener, and forecast-miss lines carry no 'unread', port, path, or 'door'; closed weather and "
                "news headers say 'open to add a place' / 'open to see headlines'; index.html ships the same words; "
                "the web plate tabs drop aria-pressed, keep one Tab stop, and take the overlay's arrow / Home / End keys."
            ),
        ),
        Affordance(
            "web.consent_plain",
            "web",
            "Network consent lines in plain words (name the website, say what is sent), same gates; web GPU hidden; calm server tone",
            "web weather-areas.ts plainNetLine + news.ts + market.ts + keeper.ts heartbeatTone + admin/base.ts, overlay weather-areas.js / news.js / market.js / keeper.js, main plate-net.cjs",
            notes=(
                "Real modules on both surfaces: the forecast, place finder, locate, news, and quotes lines name "
                "Open-Meteo, Google News, Wikipedia, CoinGecko, GeckoTerminal, or Yahoo Finance, say what is sent, "
                "and say this computer's internet address goes there too, with no 'https request' / 'geocode host' / "
                "'rss feed' / 'os or browser prompt'; the web, overlay, and main plate-net gates still open only on "
                "those exact painted lines, and Radio Find (Rui's music block) keeps its older sentence; index.html "
                "ships the same words; the web card has no GPU line; 'not running (optional)' is neutral and only "
                "'stopped answering' is styled as a warning; the quotes plate and admin page carry no jti, "
                "soft-delete, mint, or key jargon."
            ),
        ),
        Affordance(
            "web.consent_types_plain",
            "web",
            "Cloud talk, voice, license, and STUN lines in plain words (name the website), same gates; warning colour passes AA; type-found bugs stay fixed",
            "web talk-net.ts + multiplayer/p2p.ts + weather-areas.ts / news.ts / market.ts, overlay mind.js / license-net.js / *-tricks.js, main license-net.cjs, blotter license_net.py",
            notes=(
                "Real modules on every surface: cloud talk and voice name xAI, OpenAI, Anthropic, Google Gemini (or "
                "'the AI website you set up') and say what is sent; the license lines name 'the license website' and "
                "'the download website' and say a scrambled code made from this computer's ID goes, never the ID; STUN "
                "is 'a website that helps computers find each other'; each says this computer's internet address goes "
                "there too; web, overlay, main, and blotter agree and the gates still open only on those exact lines; "
                "--color-warn passes WCAG AA on every dark card (even over a white window) and on light paper; the "
                "favorites, 'looking up', and 'forecast waits' words are plain; Morel's costa ends, the motet / fogbow / "
                "denspad / inkpad thank-yous are numbers, no overlay trick throws when stopped early, and web tsc is 0."
            ),
        ),
        Affordance(
            "web.loop_guard_unlock_plain",
            "web",
            "Overlay frame loop survives a throwing trick; desktop checkJs held to its baseline; unlock privacy and license gate lines in plain words",
            "overlay frame-guard.js + pet.js tick, cat-tricks.js with an injected fault, window-play.js api, *-tricks.js thank-yous, settings.html + unlock_dialog.py mark lines, main license-net.cjs gates, blotter license_net.py",
            notes=(
                "The real frame guard runs 1,200 frames with a real trick module whose step throws: the next frame is "
                "always queued first, the error is logged once with the pet key, and the pet goes back to a safe idle "
                "each time; pet.js runs tickFrame through that loop and guards the visit guest, bird, robin, plants, and "
                "called guests one by one. The desktop checkJs pass is in test-all.ps1 and test-all.sh; its line is "
                "whatever desktop/checkjs-baseline.txt holds (read from the file, and CONTRIBUTING quotes the same "
                "number); window-play's api has no duplicate keys and no thank-you repeats itself. The Settings "
                "and blotter Unlock details say 'this computer's ID', 'a code', and 'like a fingerprint for this "
                "computer' with no hash / raw id / host words, the harness pin matches, the license gates' own errors "
                "say 'Nothing was sent to <host>. This page has to name the license website first.', and ROADMAP is dated."
            ),
        ),
        Affordance(
            "web.desk_guard_plain",
            "web",
            "Web desk loop survives a throwing trick; typed trick calls; desktop checkJs held to its baseline file; house-server, admin, license, and ADR words in plain words",
            "web frame-guard.ts + living-pet.tsx loop, cat-tricks.ts with an injected fault, overlay frame-guard.js, ground-tricks.ts steps, pet.js / desk-house.js / main.cjs checkJs, settings.html + unlock_dialog.py, plain-error, admin api.ts, license-net fallbacks, news/market headers, ADR 0019/0036/0037",
            notes=(
                "The web frame guard runs 1,200 frames of the desk's loop with a real trick module whose step throws: "
                "the next frame is always queued first, the error is logged once as 'desk frame error (cat): ...', and "
                "the pet goes back to a safe idle each time; the web and overlay guards reset a pet the same way. "
                "living-pet.tsx runs its frame through guardedLoop, has no requestAnimationFrame or catch in the frame "
                "body, and has no `as never` (stepGroundTrick / stepGroundHappy / nextGroundTrickWait are typed). The "
                "desktop checkJs matches desktop/checkjs-baseline.txt and the count CONTRIBUTING quotes, pet.js keeps no state on functions, looks "
                "elements up through htmlAll / htmlOne, and types its pointer handler; Electron's own types are checked "
                "when installed. Settings and the blotter say 'House server address' and 'Asking the house server…', the "
                "admin buttons' fallbacks are whole sentences, the license lines keep no dead stand-in host name (every "
                "miss names the real host), the news and quotes headers are plain and name the right websites, ADR 0036 and 0037 "
                "titles match their index rows, 0019 has a plain-words note, and ROADMAP is dated."
            ),
        ),
        Affordance(
            "web.guest_loops_mount",
            "web",
            "Every web desk guest loop survives a throwing step; LivingPet and the guests mounted with React show the reset; music waits after a broken dance; plain README, admin, ADR, and Settings words",
            "web frame-guard.ts guest guard + robin-fly / bird-fly / called-guests / desk-plants / blotter loops, desk-mount.test.mjs (living-pet.tsx and each guest in a small DOM), overlay frame-guard.js + pet.js music, ground-tricks.ts thank-you, license-net fallbacks, client/desktop READMEs, admin api.ts, ADR 0019/0032-0035, settings.html Minds",
            notes=(
                "Each guest loop shape runs with a step that throws: the robin, the bird, and a called guest leave "
                "(their own loop stops), the plants stand upright and the carried lure stays put while their loops keep "
                "stepping, and one error across two visits is logged once. The five components run guardedLoop with a "
                "guest guard, schedule first, and stop on cleanup. web/scripts/desk-mount.test.mjs mounts the real "
                "LivingPet, RobinFlyer, BirdFlyer, CalledGuests, DeskPlants, and BlotterMarks with React into a small DOM, "
                "makes a step inside each throw, and reads the screen: the pet back on an idle frame on the floor, a "
                "broken guest hidden, every other loop still moving. Music waits eight seconds after a broken dance on "
                "the web desk and the overlay, the thank-you call is typed, the license files keep no dead stand-in host "
                "name, the READMEs say house server, the admin line is plain, ADR 0019 and 0032-0035 titles are plain and "
                "match the index, CONTRIBUTING quotes both baseline files, Settings says pets talk without an AI and "
                "hides the AI boxes for House lines, and ROADMAP is dated."
            ),
        ),
        Affordance(
            "web.minds_flight_plain",
            "web",
            "Plain Minds boxes on all three doors; Download my pet everywhere; desk_guard_plain reads the checkJs file; robin and bird leave the page after a flight; kid-plain START-HERE and ARCHITECTURE",
            "web mind-words.ts + routes/mind.tsx + plain-error.ts MIND_LINES, overlay settings.html + mind.js baseUrlProblem, client minds.py + app.py, plain-error.cjs / plain_error.py, robin-fly / bird-fly + desk-mount.test.mjs, docs START-HERE / ARCHITECTURE",
            notes=(
                "The Minds intro, the House lines note, 'AI website address' and 'Your key for that AI website' and their "
                "helper lines are the same words in web mind-words.ts, overlay settings.html, and client minds.py. The web "
                "/mind page hides the model, address, and key boxes for House lines like the overlay does. The overlay's "
                "refusal lines (run through the real mind.js) and the web MIND_LINES never say Base URL, API key, or "
                "mind's service. plain-error headers and the harness label say Download my pet. desk_guard_plain reads "
                "desktop/checkjs-baseline.txt and the count CONTRIBUTING quotes, with no number of its own. The robin and "
                "bird mount tests fly a whole flight and hide the desk mid-flight: no canvas is left on the page and no "
                "frame loop keeps running. START-HERE opens with 4-8 short lines (desktop first, no store download yet, "
                "two helper programs, browser after) with the full detail kept below, and the Step 6 Talk line is short with "
                "the full cry list folded; ARCHITECTURE 11.4 and 11.5 start "
                "with plain words and keep the technical detail."
            ),
        ),
        Affordance(
            "web.overlay_birds_plain",
            "web",
            "Overlay robin and bird never stay on the glass; Which AI / AI model name / key placeholder the same on all three doors; kid-plain /mind with builder words folded; short START-HERE detail",
            "desktop pet.js dropRobin / dropBird / resetAfterFrameError + overlay-birds.test.cjs, overlay settings.html, web mind-words.ts + catalog.ts + routes/mind.tsx, client minds.py, docs START-HERE",
            notes=(
                "Runs overlay-birds.test.cjs: the real pet.js robin and bird functions fly a whole visit, get hidden mid-flight, "
                "and hit a broken paint inside the real frame guard; each time the canvas loses its show class and the flight "
                "is gone (before, a broken frame left them frozen mid-air and failing every frame). A broken visit guest ends "
                "its visit. Which AI, AI model name with its helper line, and the key placeholder are word for word the same in "
                "mind-words.ts, settings.html, and minds.py; the overlay Minds words never say plugin key or mind.json. The web "
                "/mind top has no builder words; Plugin bus, the fourteen-plugins line, the server key name, and the Write a "
                "plugin sample sit in a closed For builders fold. AI cards use plain blurbs and tags. START-HERE's More detail "
                "and Step 6 tray lines are 18 words or fewer per sentence and keep every fact."
            ),
        ),
        Affordance(
            "web.flake_house_plain",
            "web",
            "desk-mount passes under every seed (a stopped guest loop cancels its queued frame); Use for all pets on all three doors; plain AI cards; short Unlock Details lines; START-HERE cry list one pet per line",
            "web frame-guard.ts + desktop frame-guard.js guardedLoop cancel, desk-mount.test.mjs + mount-dom.mjs seed, mind-words.ts + routes/mind.tsx, overlay settings.html, client minds.py + unlock_dialog.py, docs START-HERE + README",
            notes=(
                "Runs desk-mount.test.mjs under three COMPUTERPETS_MOUNT_SEED values; each must pass 9/9, including the test that "
                "ends robin and bird flights on every frame of a 60-frame batch. The flake: guardedLoop asks for the next frame "
                "first, so a flight that ended left one stale frame queued, and a random flight length ended on a batch edge about "
                "one run in 60. A stopped loop now cancels that frame, and all five desk guests pass cancelAnimationFrame. Use for "
                "all pets and Same as all pets match in mind-words.ts, the overlay save button, and minds.py. AI cards hold only "
                "the tag, name, and blurb; the model ids sit in For builders. Unlock Details (overlay and blotter) is one sentence "
                "of 18 words or fewer per line. The START-HERE cry fold lists 109 pets one per line. The docs README Minds line "
                "starts with the /mind intro."
            ),
        ),
        Affordance(
            "web.unlock_plain_lfs",
            "web",
            "Plain Unlock fields with one helper each on the overlay and the blotter; random ID; START-HERE cry list in room groups; the start stops with plain Git LFS words when the pictures are pointers",
            "overlay settings.html, client unlock_dialog.py, desktop.sh + desktop.ps1 pictures check, desktop/renderer/sprites-real.test.cjs, .gitattributes, docs START-HERE + README",
            notes=(
                "Where you own the game, Your Steam ID, and Steam App ID carry the same label and one true helper line on the "
                "overlay and the blotter (only Steam works here; 17 digits that start with 7656; no Steam page yet). The Pet list "
                "shows name and kind, not the catalog key. No user-facing file says random id. The START-HERE cry fold has ten "
                "room headings over 109 pets. The overlay pictures are Git LFS files; a Git without LFS copied text pointers and "
                "every pet was invisible. Both start scripts print pictures: in check mode and stop before npm install with "
                "plain Git LFS words; the Mac and Linux steps say git lfs install and git lfs pull."
            ),
        ),
        Affordance(
            "web.pictures_start_names",
            "web",
            "The overlay from npm start and the web dev server say plainly when the pet pictures are Git LFS pointers; YAML stays LF; one kind name per pet; START-HERE gives the copy size",
            "desktop renderer/pictures.js + main.cjs bootDesk, web scripts/pictures-check.mjs + vite.config.ts, .gitattributes, client species.py + web catalog.ts + PetType.java + rosters, docs START-HERE",
            notes=(
                "Started straight from npm start, the overlay reads renderer/sprites/crow/idle/1.png before it opens the glass: "
                "a Git LFS pointer or a missing file opens a small window with the same Git LFS steps as desktop.sh and "
                "desktop.ps1, and the tray keeps them (How to fix, Open git-lfs.com, Quit). The web dev server warns once with "
                "the same steps when web/public/pets (also Git LFS) holds pointers. The Python blotter draws its own pets and "
                "loads no pictures. *.yaml and *.yml are eol=lf, so a Windows checkout passes all 37 deploy checks. Every kind "
                "name matches across the overlay roster, web roster, web catalog, Python and the backend for all 221. "
                "START-HERE says the copy is about 4 GB and needs about 8 GB free."
            ),
        ),
        Affordance(
            "web.portraits_tray_minds",
            "web",
            "Web portraits that did not download show a name tile and one Git LFS note; npm run dev starts again; every pet list says Name · Kind; Test this mind says who answered; START-HERE offers the smaller copy",
            "web components/pet-portrait.tsx + lib/pets/portrait-state.ts + app-shell.tsx, lib/pets/desk-sprite-surface.ts, desktop renderer/roster-load.js choiceText + main.cjs + settings.html + pet.js, web lib/ai/test-line.ts + routes/mind.tsx, docs START-HERE",
            notes=(
                "A site portrait that is a Git LFS pointer or missing turns into a tile with the pet's initial, name and kind, "
                "and the page shows one note with the Git LFS steps (not one per picture) until Got it. The web desk read the "
                "overlay sprite surface with a default import; the dev server serves that plain script as-is, so npm run dev "
                "never started the page (no clicks, care or talk). It now imports it for its side effect and reads the global. "
                "The tray, the house window, the card Call list, Unlock and the Python blotter all say Name · Kind through one "
                "overlay formatter. Test this mind says House lines answered, and why, instead of the raw local: source. "
                "START-HERE offers git clone --depth 1 with the sizes measured on Windows."
            ),
        ),
        Affordance(
            "web.house_lines_talk",
            "web",
            "House lines answer by default for guests and fresh installs on web, overlay and blotter; /mind marks the mind In use; talk shows your words and holds the answer long enough to read, click to close; Python 3.10 floor",
            "web lib/ai/settings.ts effectiveDefault + routes/mind.tsx + lib/pets/talk-bubble.ts + components/desk/companion-room.tsx + living-pet.tsx, desktop mind-secret.cjs + renderer/mind.js + pet.js + index.html + styles.css, client listener.py + __init__.py + pyproject.toml",
            notes=(
                "A guest, or a fresh install with no pick, gets House lines on the web desk and /mind shows House lines In use; "
                "the overlay and the Python blotter already start on House lines. A signed-in keeper who picked nothing keeps "
                "the old default (xAI Grok with the house key); any pick is kept as before. A guest who picks an AI sees it "
                "marked Picked and one line saying House lines answer until sign-in. Talk shows the keeper's words back, "
                "holds the answer 4 s plus 0.3 s a word (12 s at most) on web and overlay, and a click closes it; a called "
                "guest's line waits instead of covering it. Python 3.10 is the written floor and an older one stops in one line."
            ),
        ),
        Affordance(
            "web.no_repeat_signed_in",
            "web",
            "One no-recent-repeat line picker on web, overlay and blotter (same seeded picks; a guest's line waits 60 s); signed-in keeper gets the house AI by default and keeps a pick; real bubble click check; phone desk hello first",
            "web lib/pets/line-picker.ts + living.ts + red-panda.ts + components/desk/called-guests.tsx + robin-fly.tsx, desktop renderer/line-picker.js + pet.js + life.js + index.html + main.cjs, client line_picker.py + life.py, web lib/ai/settings.ts effectiveDefault + scripts/signed-in-mind.test.mjs, components/desk/companion-room.tsx + species-plaque.tsx",
            notes=(
                "Pet lines used to be drawn with no memory, and a called guest re-told its line every time it walked back "
                "to the pet (Dee at 0.1 s and 7.6 s). One picker now remembers each speaker's last lines: not one of the "
                "last 3, and not one said in the last 60 s unless the pool is too small; a guest's one-off line stays quiet "
                "for 60 s. Web, overlay and Python pick the same lines from the same rolls; no words changed. The signed-in "
                "path is proved on the mounted /mind page with a stand-in house key and AI website. The real overlay window "
                "check clicks the talk bubble closed. On a phone the first hello comes before the species plaque."
            ),
        ),
        Affordance(
            "web.phone_layout_told_once",
            "web",
            "Phone desk panels end above the care buttons (one-line plaque when short, bubbles on top; swept 320-414 wide, short, tall, landscape); a guest tells once per visit on web and overlay; GUI harness removes its temp folder (kept on failure); click-through decision checked; route tree in generator order",
            "web lib/pets/phone-desk.ts phoneFit + components/desk/companion-room.tsx + species-plaque.tsx + living-pet.tsx + scripts/phone-desk-layout.test.mjs, web lib/pets/call-guests.ts + desktop renderer/call-guests.js, desktop gui-harness-data.cjs + gui-harness.cjs + main.cjs, web src/routeTree.gen.ts",
            notes=(
                "On small phones the hello and the species plaque ran under the care buttons, the room rail ran down over them, "
                "the panel ran under the rail, and the speech bubble drew under the panels. The panel and the rail now end a "
                "small gap above the care buttons (measured) and scroll inside; a short phone gets a one-line plaque; the "
                "bubble paints on top. A real-browser sweep (system Chrome or Edge, Vite in-process) fails on any overlap. "
                "A called guest tells its line once per visit (an approach no longer clears told) on web and overlay. The GUI "
                "harness removes its temp folder at the end of a passing run and keeps it on failure, saying so. The "
                "click-through decision is checked in the real window. npm run dev no longer rewrites the route tree."
            ),
        ),
        Affordance(
            "web.site_header_rail",
            "web",
            "Site header: one Menu (disclosure; Escape and a tap outside close it, focus back) fits 320 px to a laptop, nothing wraps; landscape phones fit the room so every care button is on screen; the rail snaps whole rows; no hydration mismatch, no code-split warnings, a titled sign-in page",
            "web components/app-shell.tsx SiteMenu + components/desk/companion-room.tsx + styles.css + lib/pets/phone-desk.ts railRows + lib/auth/use-current-user.ts useHydrated + routes/*.tsx + routes/login.tsx + scripts/phone-desk-layout.test.mjs + scripts/site-header.test.mjs",
            notes=(
                "The header scrolled its 27 places sideways at every width: on a phone Den was cut in half and Sign in "
                "wrapped, and on a laptop Log was cut. A Menu button now holds every place (aria-expanded, aria-controls, "
                "a labelled nav of links; Escape, a tap outside or tabbing out closes it and Escape gives focus back). A "
                "landscape phone kept the desk window's 520 px floor, so the last care row sat below the screen where the "
                "shell would not scroll; the room now fits the phone. The room rail's rows snap and its height is whole "
                "rows, so no label rests cut in half. The kennel, hatchery, nest and pet pages threw a hydration mismatch "
                "on every hard load; npm run dev printed 22 code-split warnings; the sign-in tab had no title."
            ),
        ),
        Affordance(
            "web.signin_return_quiet",
            "web",
            "Sign-in returns to the gated page (same-site paths only); the desk asks the optional house server only after it has answered here (Check, backoff); 44 px rail rows and room links on phones; the speech bubble stays under the header; tab titles for the desk and a pet page; signed-in rooms in the phone sweep (stand-in session); a failed sign-in says so",
            "web lib/auth/return-to.ts + lib/auth/gates.tsx + routes/login.tsx + components/app-shell.tsx + lib/pets/keeper.ts createHeartbeatPoll + components/desk/keeper-card.tsx + styles.css + lib/pets/phone-desk.ts bubbleRoom + components/desk/living-pet.tsx + lib/page-title.ts + scripts/phone-desk-layout.test.mjs + scripts/signin-return.test.mjs + scripts/quiet-heartbeat.test.mjs",
            notes=(
                "Signing in from the kennel, the hatchery, the nest or a pet page always ended on the desk; it now returns "
                "to that page, and only a same-site path is ever followed (absolute URLs, //, backslashes, schemes, control "
                "characters, their percent-encoded forms and dot segments that collapse to // all land on the desk). The desk "
                "knocked on 127.0.0.1:8081 at load and every 15 seconds for keepers who never ran the optional house server, "
                "and the browser printed each refused request; it now asks only after the server has answered on this "
                "browser (or the keeper presses Check), backs off when a known server stops, and does not ask again when a "
                "card remounts. Rail rows and the room's links are 44 px on phones; the speech bubble no longer rises over "
                "the header on a landscape phone; the desk and a pet page have tab titles; the kennel, hatchery and nest "
                "are in the phone sweep signed in (auth off, in-memory PGLite); a sign-in that failed at the provider says "
                "so on /login instead of dropping the visitor on the desk."
            ),
        ),
        Affordance(
            "web.meet_index_forget",
            "web",
            "/meet on a phone: room index, closed drawers, guest search, all 221 reachable; 44 px house links and Check; /login fits a landscape phone; the browser forgets a house server silent for three visits or three days; the stand-in session sees a seeded kennel and a pet page; a mistyped link gets ways on",
            "web lib/pets/meet-index.ts + routes/meet.tsx + components/desk/room-hero.tsx + styles.css + routes/login.tsx + components/app-shell.tsx + lib/pets/keeper.ts houseServerSeen + lib/pets/dev-seed.ts + lib/pets/dev-seed.server.ts + lib/pets/actions.ts + lib/not-found.tsx + router.tsx + scripts/phone-desk-layout.test.mjs + scripts/meet-index.test.mjs + scripts/house-server-forget.test.mjs",
            notes=(
                "/meet listed all 221 guests as tall cards, about 135,000 px on a 375 px phone; it now opens on a row of "
                "room links, a guest search and twenty closed room drawers (5,509 px), and the sweep taps every room and "
                "reaches all 221. The keeper card's Check (43x17) and The house under every room's title (65x20) were "
                "small taps on a phone. /login scrolled 45 px on a 667x375 phone and put its second button below a 568x320 "
                "screen. A browser that had once seen the house "
                "server asked it for good; it now forgets after three silent visits or three days. The stand-in session's "
                "kennel was empty; a dev-only seed (sign-in off, in-memory PGLite, the dev keeper) fills it. A mistyped link "
                "got a bare Not Found with a generic tab."
            ),
        ),
        Affordance(
            "web.kennel_first_notes",
            "web",
            "/collection shows the kennel first on a phone; 44 px line links and /login way back; /study and /log are field-note indexes; /login fits 568x320; the not-found title comes from the server; /demo stops looping on a phone",
            "web components/desk/companion-room.tsx asideFirst + routes/collection.tsx + components/pet-card.tsx + styles.css + routes/hatch.tsx + routes/nest.tsx + components/desk/species-plaque.tsx + routes/login.tsx + components/desk/field-notes.tsx + lib/pets/meet-index.ts + routes/study.tsx + routes/log.tsx + routes/__root.tsx + lib/not-found.tsx + lib/pets/windows.ts swapWindows + components/desk/demo-stage.tsx + scripts/phone-desk-layout.test.mjs + scripts/kennel-first.test.mjs",
            notes=(
                "A new keeper on a 375x667 phone had to scroll a 411 px panel to reach the kennel: the first card sat at "
                "y=682, below the fold; it now sits at 169-308 under the name. The hatchery's line link was 182x17 and "
                "/login's sign-in-off Go to the desk a bare text link; both are 44 px. /study was 10,959 px and /log 6,607 "
                "px of notes one after another; as field-note drawers with a search they are 4,370 and 3,418. /login "
                "scrolled 4 px at 568x320 (32 px with an error line). The not-found tab said ComputerPets until the page "
                "loaded. /demo on a phone looped (Maximum update depth exceeded, 13 times) and never took the phone layout."
            ),
        ),
        Affordance(
            "web.kennel_drawers",
            "web",
            "the eighteen room pages are field-note drawers; /demo docks its plates on a phone; both start checks say what to type next; 44 px missing-page links; /mind is short on a phone; /demo/<unknown> has its own tab title",
            "web components/desk/field-notes.tsx + routes/{canopy,cellar,corner,creek,far,garden,grid,hive,meadow,pond,reef,roost,sea,shore,snakes,stone,well,wood}.tsx + components/desk/desk-plates.tsx docked + components/desk/companion-room.tsx + styles.css + routes/pets.$key.tsx + routes/demo.$slug.tsx + routes/mind.tsx + desktop.ps1 + desktop.sh + app_harness.launch_next + scripts/phone-desk-layout.test.mjs + scripts/kennel-drawers.test.mjs",
            notes=(
                "The eighteen room pages listed their notes one after another: 6,221 to 6,983 px at 375x667, /grid 8,962 "
                "and /hive 11,181. As field-note drawers they are 3,276 to 3,478, /grid 4,098 and /hive 5,158, every note "
                "still in the page. On a phone /demo put its weather plate over the kicker and the guest's name; the three "
                "plates now dock in the panel with 44 px buttons. desktop.ps1 -Check and desktop.sh --check listed the "
                "pieces but not what to type; the last line now says it. /mind was 3,148 px on a phone and is 1,967. "
                "Back to kennel and See who is awake were bare text links. /demo/<unknown> said just ComputerPets in the tab."
            ),
        ),
        Affordance(
            "web.kennel_targets",
            "web",
            "/demo/<unknown> is a real 404; desktop targets are 24 px and the panel and rail fit the screen; /demo's plates start clear of the panel; /hive has one search; a phone's /demo jumps to its plates",
            "web routes/demo.$slug.tsx + styles.css + routes/catalog.tsx + lib/pets/phone-desk.ts deskFit + components/desk/companion-room.tsx + lib/pets/desk-plates.ts keepOff + desktop/renderer/desk-plates.js + components/desk/desk-plates.tsx + components/desk/field-notes.tsx more + routes/hive.tsx + scripts/phone-desk-layout.test.mjs + scripts/kennel-targets.test.mjs",
            notes=(
                "/demo/<unknown> answered 200. At 1280x800 the plaque links were 170x17 and 133x18, the rail's guests 17 to "
                "46 px wide and 18 to 23 tall, the room links 13 px tall; every one is now at least 24x24. At 1024x768, "
                "1280x720 and 1366x768 the left panel ran off the screen with the hello's Got it, and the hello sat under "
                "Feed and Play; the rail's guest drawer ran 137 to 169 px past the bottom at 1024 to 1440 wide. /demo's "
                "weather plate sat on the small label above the guest's name at every desktop size. /hive had two searches."
            ),
        ),
        Affordance(
            "web.kennel_scroll",
            "web",
            "the rail shows the current guest; /demo's second window is clear of the panel; signed in the panel is the one scroller; the speech bubble steps around the plates; a landscape phone's jump sits beside the name; no two care buttons share a word",
            "web lib/pets/phone-desk.ts railScrollFor + bubbleDodge + components/desk/companion-room.tsx + lib/pets/demo-windows.ts + components/desk/demo-window-plate.tsx + styles.css + routes/collection.tsx + routes/catalog.tsx + routes/nest.tsx + components/desk/living-pet.tsx + lib/pets/care-labels.ts + scripts/phone-desk-layout.test.mjs + scripts/kennel-scroll.test.mjs",
            notes=(
                "/demo/ember (the 20th guest in the house) opened with its row below the rail's end. /demo's drawn second "
                "window sat behind the panel's plaque and hello (82 to 430 by 246 to 522 at 1024x768). Signed in, the "
                "kennel scrolled inside a panel that scrolled too (1353 px in a 512 px box at 1280x800), and the catalog's "
                "list did the same on a phone; the one-scroller rules sat in the CSS components layer, where the list's own "
                "classes won. The speech bubble crossed the Quotes plate. A landscape phone's plates jump started at the "
                "panel's end. Five guests had two care buttons with one word (Ember, Gum, Count, Hide)."
            ),
        ),
    ]


def _invoke_web(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"web.{local_id}"
    if local_id == "guest_choice":
        return _run_web_smoke("guest_choice", domain="web", action_id=aid)
    if local_id == "demo_room":
        return _run_web_smoke("demo_room", domain="web", action_id=aid)
    if local_id == "load_problems":
        return _run_web_smoke("load_problems", domain="web", action_id=aid)
    if local_id == "plain_reasons":
        return _run_web_smoke("plain_reasons", domain="web", action_id=aid)
    if local_id == "care_talk_plates":
        return _run_web_smoke("care_talk_plates", domain="web", action_id=aid)
    if local_id == "pets_admin_music":
        return _run_web_smoke("pets_admin_music", domain="web", action_id=aid)
    if local_id == "pets_keys_idle":
        return _run_web_smoke("pets_keys_idle", domain="web", action_id=aid)
    if local_id == "pet_keys_plates":
        return _run_web_smoke("pet_keys_plates", domain="web", action_id=aid)
    if local_id == "menu_keys_escape":
        return _run_web_smoke("menu_keys_escape", domain="web", action_id=aid)
    if local_id == "plain_words":
        return _run_web_smoke("plain_words", domain="web", action_id=aid)
    if local_id == "consent_plain":
        return _run_web_smoke("consent_plain", domain="web", action_id=aid)
    if local_id == "consent_types_plain":
        return _run_web_smoke("consent_types_plain", domain="web", action_id=aid)
    if local_id == "loop_guard_unlock_plain":
        return _run_web_smoke("loop_guard_unlock_plain", domain="web", action_id=aid)
    if local_id == "desk_guard_plain":
        return _run_web_smoke("desk_guard_plain", domain="web", action_id=aid)
    if local_id == "guest_loops_mount":
        return _run_web_smoke("guest_loops_mount", domain="web", action_id=aid)
    if local_id == "minds_flight_plain":
        return _run_web_smoke("minds_flight_plain", domain="web", action_id=aid)
    if local_id == "overlay_birds_plain":
        return _run_web_smoke("overlay_birds_plain", domain="web", action_id=aid)
    if local_id == "flake_house_plain":
        return _run_web_smoke("flake_house_plain", domain="web", action_id=aid)
    if local_id == "unlock_plain_lfs":
        return _run_web_smoke("unlock_plain_lfs", domain="web", action_id=aid)
    if local_id == "pictures_start_names":
        return _run_web_smoke("pictures_start_names", domain="web", action_id=aid)
    if local_id == "portraits_tray_minds":
        return _run_web_smoke("portraits_tray_minds", domain="web", action_id=aid)
    if local_id == "house_lines_talk":
        return _run_web_smoke("house_lines_talk", domain="web", action_id=aid)
    if local_id == "no_repeat_signed_in":
        return _run_web_smoke("no_repeat_signed_in", domain="web", action_id=aid)
    if local_id == "phone_layout_told_once":
        return _run_web_smoke("phone_layout_told_once", domain="web", action_id=aid)
    if local_id == "site_header_rail":
        return _run_web_smoke("site_header_rail", domain="web", action_id=aid)
    if local_id == "signin_return_quiet":
        return _run_web_smoke("signin_return_quiet", domain="web", action_id=aid)
    if local_id == "meet_index_forget":
        return _run_web_smoke("meet_index_forget", domain="web", action_id=aid)
    if local_id == "kennel_first_notes":
        return _run_web_smoke("kennel_first_notes", domain="web", action_id=aid)
    if local_id == "kennel_drawers":
        return _run_web_smoke("kennel_drawers", domain="web", action_id=aid)
    if local_id == "kennel_targets":
        return _run_web_smoke("kennel_targets", domain="web", action_id=aid)
    if local_id == "kennel_scroll":
        return _run_web_smoke("kennel_scroll", domain="web", action_id=aid)
    if local_id == "ethogram_tricks":
        eth_keys = _ethogram_ts_keys()
        missing_eth: list[str] = []
        missing_web: list[str] = []
        missing_desk: list[str] = []
        drift: list[str] = []
        parse_fail: list[str] = []
        matched = 0
        for key in CATALOG_KEYS:
            if key not in eth_keys:
                missing_eth.append(key)
            if key in NO_TRICKS_KEYS:
                continue
            desk = _tricks_path_side(key, "desktop")
            web = _tricks_path_side(key, "web")
            if desk is None:
                missing_desk.append(key)
            if web is None:
                missing_web.append(key)
            if desk is None or web is None:
                continue
            try:
                desk_list = _tricks_list_from_text(desk.read_text(encoding="utf-8"))
                web_list = _tricks_list_from_text(web.read_text(encoding="utf-8"))
            except OSError as exc:
                parse_fail.append(f"{key}:{exc}")
                continue
            if desk_list is None or web_list is None:
                parse_fail.append(key)
                continue
            if desk_list != web_list:
                drift.append(key)
                continue
            matched += 1
        ok = not (missing_eth or missing_web or missing_desk or drift or parse_fail)
        parts = [
            f"keys={len(CATALOG_KEYS)}",
            f"ethogram_ts={len(eth_keys)}",
            f"tricks_lockstep={matched}",
            f"tricks_excluded={len(NO_TRICKS_KEYS)}",
        ]
        if missing_eth:
            parts.append(f"missing_eth={','.join(missing_eth[:12])}")
        if missing_web:
            parts.append(f"missing_web={','.join(missing_web[:12])}")
        if missing_desk:
            parts.append(f"missing_desk={','.join(missing_desk[:12])}")
        if drift:
            parts.append(f"drift={','.join(drift[:12])}")
        if parse_fail:
            parts.append(f"parse_fail={len(parse_fail)}")
        err = None
        if not ok:
            bits = []
            if missing_eth:
                bits.append(f"ethogram.ts missing keys: {', '.join(missing_eth[:12])}")
            if missing_web:
                bits.append(f"missing web tricks: {', '.join(missing_web[:12])}")
            if missing_desk:
                bits.append(f"missing desktop tricks: {', '.join(missing_desk[:12])}")
            if drift:
                bits.append(f"TRICKS drift web/desktop: {', '.join(drift[:12])}")
            if parse_fail:
                bits.append(f"tricks parse fail: {', '.join(parse_fail[:6])}")
            err = "; ".join(bits)
        return InvokeResult(
            aid, "web", ok, detail=f"lockstep={matched}",
            extras={
                "n": len(CATALOG_KEYS),
                "ethogram_ts": len(eth_keys),
                "matched": matched,
                "missing_eth": missing_eth,
                "missing_web": missing_web,
                "missing_desk": missing_desk,
                "drift": drift,
                "parse_fail": parse_fail[:32],
            },
            trace=parts,
            error=err,
        )
    return InvokeResult(aid, "web", False, error=f"unknown web id {local_id!r}")


def _assert_web(local_id: str, result: InvokeResult) -> list[str]:
    fails: list[str] = []
    if local_id == "ethogram_tricks":
        for key in result.extras.get("missing_eth") or []:
            fails.append(f"FAIL ethogram.ts missing {key}")
        for key in result.extras.get("missing_web") or []:
            fails.append(f"FAIL missing web *-tricks.ts for {key}")
        for key in result.extras.get("missing_desk") or []:
            fails.append(f"FAIL missing desktop *-tricks.js for {key}")
        for key in result.extras.get("drift") or []:
            fails.append(f"FAIL TRICKS drift web/desktop for {key}")
        for msg in result.extras.get("parse_fail") or []:
            fails.append(f"FAIL tricks parse {msg}")
        if not result.ok and not fails:
            fails.append(result.error or "web.ethogram_tricks failed")
        return fails
    if not result.ok:
        fails.append(result.error or "web invoke failed")
    return fails



def _gui_rows() -> list[Affordance]:
    return [
        Affordance(
            "gui.choice_close_exit",
            "gui",
            "Overlay choice Close/Exit",
            "choice.js guestMarks / guestPick",
            notes="Driven via desktop/renderer choice.js (same module as choice.test.cjs).",
        ),
        Affordance(
            "gui.card_hud_paint",
            "gui",
            "Keeper HUD paint / persist loop",
            "pet.js paintHud / persistCard",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs Electron overlay DOM. Default stays excluded (CI/offline green). "
                "Pass --gui on BLACKBEARD to drive collapse/open + vital paint via desktop/gui-harness.cjs. "
                "Narrower wires remain driven as card.paint_wire / collapse_hook / open_hook."
            ),
        ),
        Affordance(
            "gui.overlay_paint",
            "gui",
            "Overlay compositor / walk loop",
            "desktop/renderer/pet.js",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs Electron compositor/display. Default stays excluded. "
                "Pass --gui to boot the overlay, assert pet/HUD paint, and dismiss choice Close+Exit."
            ),
        ),
        Affordance(
            "gui.blotter_qt",
            "gui",
            "PyQt blotter GPU viewport",
            "app --check / blotter.attach_gpu_viewport",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs Qt (offscreen --check is honest software raster, not a GPU lie). "
                "Default stays excluded. Pass --gui to run computerpets_client.app --check --offscreen; "
                "same bundle splits blotter.plaque / frames_paint / scene."
            ),
        ),
        Affordance(
            "gui.gift_drag_place",
            "gui",
            "Pointer drag gift onto the wood",
            "overlay gift-dot data-hit",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs overlay gift-dot hit-targets. Default stays excluded. "
                "Pass --gui to leaveGift + click gift-dot (honest place/pick; not freehand drag). "
                "Coords alone stay driven as gift.place."
            ),
        ),
        Affordance(
            "gui.host_place",
            "gui",
            "Host pet place-at-coords on overlay",
            "pet.js PetGuiHarness.placeHostAt + pet data-hit",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs Electron overlay host pet hit-target. Default stays excluded. "
                "Pass --gui to placeHostAt coords and assert data-hit bounds (not freehand drag physics). "
                "OS window perch stays driven offline as desk.windows.perch."
            ),
        ),
        Affordance(
            "gui.bubble_click",
            "gui",
            "Click the talk bubble closed in the real overlay",
            "pet.js PetGuiHarness.talkForClick + bubble click listener",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs the real Electron overlay window. Default stays excluded. "
                "Pass --gui to open the bubble with a House lines answer, send a real mouse down/up to its middle "
                "(webContents.sendInputEvent: Chromium's own hit test), and assert it closes. "
                "The OS click-through layer (setIgnoreMouseEvents) is not part of this path."
            ),
        ),
        Affordance(
            "gui.clickthrough_hits",
            "gui",
            "Click-through decision from the hit rects the real overlay sent",
            "main.cjs guiClickThrough + Desk.cursorHits + pet.js hitRects/reportHits",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Needs the real Electron overlay window. Default stays excluded. "
                "Pass --gui: with the talk bubble open, the hit rects the renderer really sent (set-hits) must contain it, "
                "Desk.cursorHits at its middle must be true (the window takes the click), a spot Chromium says is bare "
                "must fall through, and the closed bubble's rect must be gone. A real OS cursor is not moved: Electron has "
                "no API for OS input, a native input module would change desktop/package-lock.json, and synthetic OS "
                "clicks would land on the keeper's real desktop whenever click-through works."
            ),
        ),
        Affordance(
            "gui.first_run_drive",
            "gui",
            "The desktop app's first run, driven in real Electron",
            "desktop/first-run-drive.cjs (Playwright _electron, throwaway --user-data-dir)",
            mode="gui",
            fate="excluded",
            exclude_reason=(
                "Opens real windows on the keeper's screen for about a minute. Default stays excluded. "
                "Pass --gui on BLACKBEARD to launch desktop Electron with a throwaway --user-data-dir under "
                "target/first-run-drive (removed after; it stops if userData is anything else) and walk the first run: "
                "the hello on an open keeper card that fits the screen, Got it at least 24 px, the pet on screen, the "
                "pet's line never over the open card, the care menu with no row twice and the card's trick word, Feed "
                "raising hunger, Got it kept in card.json, the card at the right edge, the House window (Minds, Unlock, "
                "close), Hide the window and tray Show, Quit, and a second start without the hello. Menus are recorded, "
                "not popped up, and input goes through Chromium (CDP), never the OS mouse or keyboard. "
                "Offline pins: desktop/renderer/first-run-fit.test.cjs and desktop/renderer/first-run-drive.test.cjs."
            ),
        ),
    ]


_gui_electron_bundle: dict[str, Any] | None = None


def _client_venv_python() -> Path | None:
    """Prefer client/.venv over bare `py` / system Python (PyQt6 lives in the venv)."""
    root = repo_root() / "client" / ".venv"
    for rel in (("Scripts", "python.exe"), ("bin", "python")):
        candidate = root.joinpath(*rel)
        if candidate.is_file():
            return candidate
    return None


_blotter_qt_bundle: dict[str, Any] | None = None


def _run_blotter_qt_bundle() -> dict[str, Any]:
    """One app --check --offscreen covers gui.blotter_qt + blotter.{plaque,frames_paint,scene}.

    Honest software-raster path when QT_QPA_PLATFORM=offscreen — not a GPU lie.
    """
    global _blotter_qt_bundle
    if _blotter_qt_bundle is not None:
        return _blotter_qt_bundle
    import os
    import subprocess
    import sys

    env = dict(os.environ)
    env.setdefault("QT_QPA_PLATFORM", "offscreen")
    # Avoid a polluted PYTHONPATH from other worktrees.
    env.pop("PYTHONPATH", None)
    python = _client_venv_python() or Path(sys.executable)
    try:
        proc = subprocess.run(
            [str(python), "-m", "computerpets_client.app", "--check", "--offscreen"],
            capture_output=True,
            text=True,
            cwd=str(repo_root() / "client"),
            timeout=60,
            check=False,
            env=env,
        )
    except Exception as exc:  # noqa: BLE001
        _blotter_qt_bundle = {
            "ok": False,
            "error": f"{type(exc).__name__}: {exc}",
            "oks": [],
            "lines": [],
            "renderer": "",
            "returncode": -1,
            "python": str(python),
        }
        return _blotter_qt_bundle
    out = (proc.stdout or "") + "\n" + (proc.stderr or "")
    lines = [ln.strip() for ln in out.splitlines() if ln.strip()]
    oks = [ln for ln in lines if ln.startswith("ok:")]
    renderer = next(
        (ln for ln in lines if "Qt" in ln and ("viewport" in ln or "raster" in ln or "OpenGL" in ln)),
        "",
    )
    ok = proc.returncode == 0 and len(oks) >= 3
    _blotter_qt_bundle = {
        "ok": ok,
        "error": None if ok else (lines[-1] if lines else f"blotter --check failed exit={proc.returncode}"),
        "oks": oks,
        "lines": lines,
        "renderer": renderer,
        "returncode": proc.returncode,
        "python": str(python),
    }
    return _blotter_qt_bundle


def _ok_line(oks: list[str], *needles: str) -> str | None:
    for ln in oks:
        low = ln.lower()
        if all(n.lower() in low for n in needles):
            return ln
    return None


def _run_blotter_qt_check() -> InvokeResult:
    """Parent Qt blotter smoke: full app --check --offscreen ok: ledger."""
    aid = "gui.blotter_qt"
    bundle = _run_blotter_qt_bundle()
    oks = list(bundle.get("oks") or [])
    renderer = str(bundle.get("renderer") or "")
    ok = bool(bundle.get("ok"))
    return InvokeResult(
        aid,
        "gui",
        ok,
        detail=oks[0] if oks else str(bundle.get("error") or f"exit={bundle.get('returncode')}"),
        extras={
            "oks": oks,
            "renderer": renderer,
            "returncode": bundle.get("returncode"),
            "python": bundle.get("python"),
            "gui_optin": True,
        },
        trace=oks[:10] + ([renderer] if renderer else []) + [f"returncode={bundle.get('returncode')}"],
        error=None if ok else str(bundle.get("error") or "blotter --check failed"),
    )


def _invoke_blotter_gui_slice(local_id: str) -> InvokeResult:
    """Split honest traces from the shared app --check bundle (opt-in --gui only)."""
    aid = f"blotter.{local_id}"
    bundle = _run_blotter_qt_bundle()
    oks = list(bundle.get("oks") or [])
    renderer = str(bundle.get("renderer") or "")
    if not bundle.get("ok"):
        return InvokeResult(
            aid,
            "blotter",
            False,
            error=str(bundle.get("error") or "blotter --check failed"),
            detail=str(bundle.get("error") or ""),
            extras={"gui_optin": True, "returncode": bundle.get("returncode")},
            trace=[f"blotter_qt.check=error", f"returncode={bundle.get('returncode')}"],
        )

    if local_id == "plaque":
        line = _ok_line(oks, "species plaque")
        if not line:
            return InvokeResult(
                aid, "blotter", False, error="missing species plaque ok: line",
                extras={"oks": oks, "gui_optin": True},
                trace=oks[:6],
            )
        return InvokeResult(
            aid, "blotter", True,
            detail=line,
            extras={"plaque": line, "gui_optin": True},
            trace=[line, "SpeciesPlaque.set_key=ok", "app --check --offscreen"],
        )

    if local_id == "frames_paint":
        painted = _ok_line(oks, "pet frames painted")
        pet_line = _ok_line(oks, "on the blotter", "living kinds") or _ok_line(oks, "on the blotter")
        if not painted:
            return InvokeResult(
                aid, "blotter", False, error="missing pet frames painted ok: line",
                extras={"oks": oks, "gui_optin": True},
                trace=oks[:8],
            )
        if "pixmap" not in painted.lower():
            return InvokeResult(
                aid, "blotter", False, error=f"frames paint line missing pixmap proof: {painted}",
                extras={"oks": oks, "gui_optin": True},
                trace=[painted],
            )
        trace = [painted]
        if pet_line and pet_line != painted:
            trace.append(pet_line)
        trace.append("frames.paint_frame/frames_for=ok")
        return InvokeResult(
            aid, "blotter", True,
            detail=painted,
            extras={"frames_paint": painted, "pet": pet_line, "gui_optin": True},
            trace=trace,
        )

    if local_id == "scene":
        scene = _ok_line(oks, "graphics scene")
        # Weather / day-part blotter lines (not the pet "living kinds" line).
        blotter_sky = [
            ln for ln in oks
            if ln.startswith("ok:") and "on the blotter" in ln and "living kinds" not in ln
        ]
        if not scene:
            return InvokeResult(
                aid, "blotter", False, error="missing graphics scene ok: line",
                extras={"oks": oks, "gui_optin": True},
                trace=oks[:8],
            )
        if "weather=" not in scene.lower() or "day=" not in scene.lower():
            return InvokeResult(
                aid, "blotter", False, error=f"scene line missing weather/day: {scene}",
                extras={"oks": oks, "gui_optin": True},
                trace=[scene],
            )
        if not renderer or "QGraphicsView" not in renderer:
            return InvokeResult(
                aid, "blotter", False, error="missing Qt/QGraphicsView renderer label",
                extras={"oks": oks, "renderer": renderer, "gui_optin": True},
                trace=[scene, renderer] if renderer else [scene],
            )
        trace = [scene]
        weather_ln = next((ln for ln in blotter_sky if "weather=" not in ln.lower()), None)
        # Prefer an explicit day-part label line (Dawn/Day/Dusk/Night).
        day_ln = next(
            (
                ln for ln in blotter_sky
                if any(p in ln.lower() for p in ("dawn on the blotter", "day on the blotter",
                                                   "dusk on the blotter", "night on the blotter"))
            ),
            None,
        )
        if weather_ln:
            trace.append(weather_ln)
        if day_ln and day_ln not in trace:
            trace.append(day_ln)
        trace.append(renderer)
        trace.append("DeskBackground/DayWash/WeatherLayer=ok")
        return InvokeResult(
            aid, "blotter", True,
            detail=scene,
            extras={
                "scene": scene,
                "weather": weather_ln,
                "day": day_ln,
                "renderer": renderer,
                "gui_optin": True,
            },
            trace=trace,
        )

    return InvokeResult(aid, "blotter", False, error=f"unknown blotter gui slice {local_id!r}")


def _run_electron_gui_bundle() -> dict[str, Any]:
    """One Electron boot covers overlay / card HUD / gift hit-target smokes."""
    global _gui_electron_bundle
    if _gui_electron_bundle is not None:
        return _gui_electron_bundle
    import json
    import os
    import shutil
    import subprocess

    node = shutil.which("node")
    script = repo_root() / "desktop" / "gui-harness.cjs"
    if not node:
        _gui_electron_bundle = {"ok": False, "error": "node not on PATH", "results": {}}
        return _gui_electron_bundle
    if not script.is_file():
        _gui_electron_bundle = {"ok": False, "error": f"missing {script}", "results": {}}
        return _gui_electron_bundle
    env = dict(os.environ)
    env.pop("PYTHONPATH", None)
    try:
        proc = subprocess.run(
            [node, str(script)],
            capture_output=True,
            text=True,
            cwd=str(repo_root()),
            timeout=90,
            check=False,
            env=env,
        )
    except Exception as exc:  # noqa: BLE001
        _gui_electron_bundle = {"ok": False, "error": f"{type(exc).__name__}: {exc}", "results": {}}
        return _gui_electron_bundle
    raw = (proc.stdout or "").strip().splitlines()
    line = raw[-1] if raw else ""
    try:
        payload = json.loads(line) if line else {}
    except json.JSONDecodeError:
        payload = {
            "ok": False,
            "error": f"bad gui-harness JSON: {(line or proc.stderr or '')[:240]}",
            "results": {},
        }
    if not isinstance(payload, dict):
        payload = {"ok": False, "error": "gui-harness payload not an object", "results": {}}
    payload.setdefault("results", {})
    _gui_electron_bundle = payload
    return _gui_electron_bundle


def _run_first_run_drive() -> InvokeResult:
    """--gui only: node desktop/first-run-drive.cjs (real Electron, throwaway user data); one JSON line back."""
    import json
    import os
    import shutil
    import subprocess

    aid = "gui.first_run_drive"
    node = shutil.which("node")
    script = repo_root() / "desktop" / "first-run-drive.cjs"
    if not node or not script.is_file():
        err = "node not on PATH" if not node else f"missing {script}"
        return InvokeResult(aid, "gui", False, error=err, detail=err, trace=[f"gui.first_run.error={err}"])
    env = dict(os.environ)
    env.pop("PYTHONPATH", None)
    env.pop("COMPUTERPETS_GUI_HARNESS", None)
    try:
        proc = subprocess.run(
            [node, str(script)], capture_output=True, text=True, encoding="utf-8", errors="replace",
            cwd=str(repo_root()), timeout=240, check=False, env=env,
        )
    except Exception as exc:  # noqa: BLE001
        err = f"{type(exc).__name__}: {exc}"
        return InvokeResult(aid, "gui", False, error=err, detail=err, trace=[f"gui.first_run.error={err}"])
    lines = (proc.stdout or "").strip().splitlines()
    try:
        payload = json.loads(lines[-1]) if lines else {}
    except json.JSONDecodeError:
        payload = {}
    if not isinstance(payload, dict) or "checks" not in payload:
        err = f"bad first-run-drive JSON: {((lines[-1] if lines else '') or proc.stderr or '')[:240]}"
        return InvokeResult(aid, "gui", False, error=err, detail=err, trace=[f"gui.first_run.error={err}"])
    checks = [c for c in payload.get("checks") or [] if isinstance(c, dict)]
    trace = [f"{'ok' if c.get('ok') else 'FAIL'} {c.get('id')}: {c.get('detail')}" for c in checks]
    failed = [c for c in checks if not c.get("ok")]
    if payload.get("skipped"):
        err = f"first-run drive skipped: {payload['skipped']}"
        return InvokeResult(aid, "gui", False, error=err, detail=err, trace=trace or [err])
    ok = bool(payload.get("ok")) and not failed and bool(checks)
    detail = f"{len(checks) - len(failed)}/{len(checks)} first-run checks in {payload.get('ms')} ms"
    return InvokeResult(
        aid, "gui", ok, detail=detail, trace=trace or [detail],
        extras={"gui_optin": True, "checks": checks},
        error=None if ok else "; ".join(f"{c.get('id')}: {c.get('detail')}" for c in failed) or detail,
    )


def _invoke_gui_optin(action_id: str) -> InvokeResult:
    """Opt-in --gui: real Electron/Qt smokes. Not part of default run_all."""
    if action_id == "gui.blotter_qt":
        return _run_blotter_qt_check()
    if action_id == "gui.first_run_drive":
        return _run_first_run_drive()
    bundle = _run_electron_gui_bundle()
    row = (bundle.get("results") or {}).get(action_id)
    if not isinstance(row, dict):
        err = bundle.get("error") or f"missing {action_id} in electron harness bundle"
        return InvokeResult(
            action_id, "gui", False, error=str(err), detail=str(err),
            trace=[f"gui.bundle.error={err}"],
        )
    ok = bool(row.get("ok"))
    trace = list(row.get("trace") or [])
    detail = str(row.get("detail") or ("ok" if ok else "failed"))
    extras = dict(row.get("extras") or {})
    extras["gui_optin"] = True
    return InvokeResult(
        action_id, "gui", ok, detail=detail, extras=extras, trace=trace or [detail],
        error=None if ok else str(row.get("error") or detail),
    )


def _invoke_gui(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"gui.{local_id}" if not local_id.startswith("gui.") else local_id
    if local_id in {"choice_close_exit", "gui.choice_close_exit"} or local_id == "choice_close_exit":
        return _run_node_smoke("choice_close_exit", domain="gui", action_id="gui.choice_close_exit")
    # Direct invoke of mode=gui rows (Buffffff --only under --gui, or programmatic).
    if aid in {"gui.overlay_paint", "gui.card_hud_paint", "gui.gift_drag_place", "gui.host_place", "gui.blotter_qt", "gui.bubble_click", "gui.clickthrough_hits", "gui.first_run_drive"}:
        return _invoke_gui_optin(aid)
    return InvokeResult(aid, "gui", False, error=f"unknown gui id {local_id!r}")


def _assert_gui(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "gui invoke failed"]


def _http_get(url: str, *, timeout: float = 10.0, label: str = "live") -> tuple[bool, str, str]:
    """Optional live fetch. Returns (ok, body_or_empty, clear_error).

    Default run_all never calls this — only --live. Failures name the plate path,
    timeout, and URL so Buffffff can tell network flake from parser drift.
    """
    import socket
    import urllib.error
    import urllib.request

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ComputerPets-app-harness/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read(200_000).decode("utf-8", errors="replace")
            return True, body, ""
    except socket.timeout:
        return False, "", f"{label}: timed out after {timeout:.0f}s fetching {url}"
    except TimeoutError:
        return False, "", f"{label}: timed out after {timeout:.0f}s fetching {url}"
    except urllib.error.HTTPError as exc:
        return False, "", f"{label}: HTTP {exc.code} from {url}: {exc.reason}"
    except urllib.error.URLError as exc:
        reason = getattr(exc, "reason", exc)
        return False, "", f"{label}: network error fetching {url}: {reason}"
    except Exception as exc:  # noqa: BLE001 — live mode surfaces network errors
        return False, "", f"{label}: {type(exc).__name__} fetching {url}: {exc}"


def _invoke_live_network(action_id: str) -> InvokeResult:
    """Opt-in --live HTTP. Not part of default run_all."""
    if action_id == "live.weather_forecast":
        url = (
            "https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.42"
            "&current=temperature_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=auto"
        )
        ok, body, err = _http_get(url, timeout=10.0, label="live.weather_forecast")
        if not ok:
            return InvokeResult(
                action_id, "desk", False, error=err, detail=err,
                trace=[f"GET {url}", "fail=network"],
            )
        has = '"current"' in body
        return InvokeResult(
            action_id, "desk", has, detail=f"bytes={len(body)}",
            extras={"bytes": len(body), "url": url},
            trace=[f"GET {url}", f"bytes={len(body)}"],
            error=None if has else f"live.weather_forecast: forecast JSON missing current from {url}",
        )
    if action_id == "live.news_rss":
        url = "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
        ok, body, err = _http_get(url, timeout=12.0, label="live.news_rss")
        if not ok:
            return InvokeResult(
                action_id, "desk", False, error=err, detail=err,
                trace=[f"GET {url}", "fail=network"],
            )
        has = "<item>" in body
        return InvokeResult(
            action_id, "desk", has, detail=f"bytes={len(body)}",
            extras={"bytes": len(body), "url": url},
            trace=[f"GET {url}", f"items={'yes' if has else 'no'}"],
            error=None if has else f"live.news_rss: RSS missing <item> from {url}",
        )
    if action_id == "live.market_quote":
        url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        ok, body, err = _http_get(url, timeout=12.0, label="live.market_quote")
        if not ok:
            return InvokeResult(
                action_id, "desk", False, error=err, detail=err,
                trace=[f"GET {url}", "fail=network"],
            )
        has = "ethereum" in body and "usd" in body
        return InvokeResult(
            action_id, "desk", has, detail=f"bytes={len(body)}",
            extras={"bytes": len(body), "url": url},
            trace=[f"GET {url}", body[:80]],
            error=None if has else f"live.market_quote: quote JSON missing ethereum/usd from {url}",
        )
    if action_id == "live.nft_floor":
        url = "https://api.coingecko.com/api/v3/nfts/bored-ape-yacht-club"
        ok, body, err = _http_get(url, timeout=12.0, label="live.nft_floor")
        if not ok:
            return InvokeResult(
                action_id, "desk", False, error=err, detail=err,
                trace=[f"GET {url}", "fail=network"],
            )
        has = "floor_price" in body or '"id"' in body
        return InvokeResult(
            action_id, "desk", has, detail=f"bytes={len(body)}",
            extras={"bytes": len(body), "url": url},
            trace=[f"GET {url}", f"bytes={len(body)}"],
            error=None if has else f"live.nft_floor: nft JSON unexpected from {url}",
        )
    if action_id == "live.gpu_sense":
        import sys

        from .gpu import METRIC_KEYS, read_local

        sample = read_local()
        metrics = [sample.get(key) for key in METRIC_KEYS]
        invented = sample["status"] != "read" and any(value is not None for value in metrics)
        if invented:
            return InvokeResult(
                action_id, "desk", False,
                error="live.gpu_sense painted a number while unread",
                detail=str(sample.get("status")),
                trace=["gpu.invented"],
            )
        if sys.platform not in {"win32", "linux", "darwin"}:
            ok = sample["status"] == "unsupported" and sample.get("reason") == "unsupported"
            return InvokeResult(
                action_id, "desk", ok,
                detail=f"status={sample['status']}",
                extras={"status": sample["status"], "platform": sys.platform},
                trace=[f"gpu.{sample['status']}", "platform=" + sys.platform],
                error=None if ok else "this platform has no GPU probe",
            )
        ok = sample["status"] in {"read", "unread", "malformed"}
        if sample["status"] == "read":
            ok = any(value is not None for value in metrics)
        return InvokeResult(
            action_id, "desk", ok,
            detail=f"status={sample['status']}",
            extras={"status": sample["status"], "platform": sys.platform},
            trace=[f"gpu.{sample['status']}"],
            error=None if ok else "GPU probe returned an unusable sample",
        )
    if action_id == "live.cry_playback":
        return InvokeResult(
            action_id, "cry", False,
            error="live.cry_playback still needs a real Electron/audio session; use cry.playback stub offline",
            detail="not HTTP",
            trace=["live.cry_playback=speakers-only"],
        )
    return InvokeResult(action_id, "?", False, error=f"no live invoker for {action_id}")



# ---------------------------------------------------------------------------
# Blotter pure surfaces (PyQt study desk) — offline, no invented verbs
# ---------------------------------------------------------------------------


def _rail_keys() -> tuple[str, ...]:
    from .species import (
        BEE_KEYS,
        CANOPY_KEYS,
        CORNER_KEYS,
        CREEK_KEYS,
        FAR_KEYS,
        FUNGI_KEYS,
        GARDEN_KEYS,
        GRID_KEYS,
        HOUSE_KEYS,
        INSECT_KEYS,
        LOG_KEYS,
        MEADOW_KEYS,
        POND_KEYS,
        REEF_KEYS,
        ROOST_KEYS,
        SEA_KEYS,
        SHORE_KEYS,
        SNAKE_KEYS,
        STONE_KEYS,
        WELL_KEYS,
        WOOD_KEYS,
    )

    return (
        HOUSE_KEYS
        + SNAKE_KEYS
        + SEA_KEYS
        + GARDEN_KEYS
        + INSECT_KEYS
        + BEE_KEYS
        + POND_KEYS
        + ROOST_KEYS
        + CORNER_KEYS
        + WOOD_KEYS
        + CANOPY_KEYS
        + STONE_KEYS
        + CREEK_KEYS
        + LOG_KEYS
        + SHORE_KEYS
        + REEF_KEYS
        + MEADOW_KEYS
        + FUNGI_KEYS
        + WELL_KEYS
        + FAR_KEYS
        + GRID_KEYS
    )


_FRAMES_ANIMS_RE = re.compile(
    r"ANIMS\s*=\s*\{([^}]+)\}",
    re.MULTILINE | re.DOTALL,
)
_FRAMES_ANIM_KEY_RE = re.compile(r'"([a-z_]+)"\s*:')


def _frames_anim_keys() -> list[str]:
    src = _read("client/computerpets_client/frames.py")
    match = _FRAMES_ANIMS_RE.search(src)
    if not match:
        return []
    return _FRAMES_ANIM_KEY_RE.findall(match.group(1))


def _blotter_rows() -> list[Affordance]:
    return [
        Affordance(
            "blotter.hours",
            "blotter",
            "House clock day parts + REST catalog",
            "hours.day_part / REST / is_resting_hour + hours.js",
            notes=(
                "Python day_part/labels + REST==CATALOG_KEYS + fixture rests + lines; "
                "three-way REST lockstep hours.py ↔ hours.js ↔ hours.ts (FAIL on any ACTIVE/REST drift). "
                "day_part/dayPart is Python+web only — no desktop hours.js peer (not invented). "
                "HIDE_LINE py+web; GIFT_LINE desktop-only. No invented rest windows."
            ),
        ),
        Affordance(
            "blotter.hive",
            "blotter",
            "Wax place + colony reading",
            "hive.is_hive_place / colony_of / comb_seats + hive.js",
            notes="Honeycomb place, sitters, brood/stores stamp; desktop hive.js lockstep.",
        ),
        Affordance(
            "blotter.guide",
            "blotter",
            "Field-guide plaques catalog-complete",
            "guide.guide_complete / plaque_for",
            notes=(
                "Every CATALOG_KEYS guest has a plaque; classroom sample den/house. "
                "Catalog-wide classroom + web lockstep is blotter.classroom. "
                "SpeciesPlaque QWidget stays mode=gui (blotter.plaque driven under --gui)."
            ),
        ),
        Affordance(
            "blotter.classroom",
            "blotter",
            "Catalog-wide classroom rooms + web lockstep",
            "guide.classroom_for + web plaques.classroomFor",
            notes=(
                "Every CATALOG_KEYS guest maps to a known classroom room/label/verb; "
                "lockstep with web classroomFor on label/verb/to (room->path). "
                "Desktop has no classroom API - not invented. Qt plaque classroom label stays --gui."
            ),
        ),
        Affordance(
            "blotter.return_memory",
            "blotter",
            "return_line thresholds + remember_visit persist",
            "hours.return_line / remember_visit + web returnLine/rememberVisit",
            notes=(
                "Deepens call-back/return lines beyond blotter.hours return_line(0). "
                "Thresholds + seen.json away-ms round-trip; web returnLine lockstep + "
                "companion-room rememberVisit wire. Desktop hours.js has no returnLine/"
                "rememberVisit peer - not invented (callLine stays in blotter.hours)."
            ),
        ),
        Affordance(
            "blotter.gait",
            "blotter",
            "Shared living-desk gait numbers",
            "gait.walk_speed / facing_after / leave_target + gait.js",
            notes="Constants + walk/facing/leave/enter; desktop gait.js lockstep.",
        ),
        Affordance(
            "blotter.play",
            "blotter",
            "Lure chase one-hop catch/arrive",
            "play.play_chase / play_claim + play.js",
            notes="Catch then arrive does not double-play; desktop play.js lockstep.",
        ),
        Affordance(
            "blotter.weather",
            "blotter",
            "House sky lines + idle moods",
            "weather.weather_line / weather_idle / civil_day_number + weather.js",
            notes=(
                "Beyond desk.weather (weather_of clock): lines/idle fixtures + civil day; "
                "desktop weather.js lockstep. Live Open-Meteo stays live.weather_forecast."
            ),
        ),
        Affordance(
            "blotter.unlock_offline",
            "blotter",
            "Unlock keeps the download sign-in sealed and speaks plain words",
            "license.session codec / token_store / plain_error (no Qt)",
            notes=(
                "The real Python license session against the contract double, an in-memory disk, and a "
                "fake codec (test-only keys, no network). Unlock seals auth.token (never plain in "
                "license.json); with no secret store the token is memory-only and a later run's Signed "
                "download says no_token before any POST; an old plain token is sealed on first read; "
                "refused / HTTP 500 / 403 / blank Steam fields each give one plain sentence ending "
                "'Pets still work without it.' Peer of desk.license.offline."
            ),
        ),
        Affordance(
            "blotter.rail",
            "blotter",
            "Species rail group coverage",
            "rail.SpeciesRail group walk via species.*_KEYS",
            notes=(
                "Offline: HOUSE…GRID group concatenation covers CATALOG_KEYS as a set "
                "(rail order ≠ catalog order by design). SpeciesRail QWidget needs Qt."
            ),
        ),
        Affordance(
            "blotter.frames",
            "blotter",
            "Procedural frame ANIMS keys",
            "frames.ANIMS (source wire; no QPainter)",
            notes=(
                "ANIMS idle/walk/sit/eat/sleep/play — real frames.py surface without importing Qt. "
                "paint_frame / frames_for need Qt (see blotter.frames_paint)."
            ),
        ),
        Affordance(
            "blotter.plaque",
            "blotter",
            "SpeciesPlaque QWidget paint",
            "plaque.SpeciesPlaque.set_key",
            fate="excluded",
            exclude_reason=(
                "Needs PyQt6 QWidget. Plaque copy is driven offline as blotter.guide (plaque_for). "
                "Pass --gui to drive this id via app --check --offscreen species-plaque ok: line "
                "(shared bundle with gui.blotter_qt)."
            ),
            mode="gui",
        ),
        Affordance(
            "blotter.frames_paint",
            "blotter",
            "QPainter paint_frame / frames_for",
            "frames.paint_frame / frames_for",
            fate="excluded",
            exclude_reason=(
                "Needs PyQt6 QPainter/QPixmap. ANIMS keys stay driven as blotter.frames. "
                "Pass --gui to drive this id via app --check --offscreen pet-frames-painted ok: line "
                "(shared bundle with gui.blotter_qt)."
            ),
            mode="gui",
        ),
        Affordance(
            "blotter.scene",
            "blotter",
            "DeskBackground / DayWash / WeatherLayer",
            "blotter.DeskBackground / DayWash / WeatherLayer / attach_gpu_viewport",
            fate="excluded",
            exclude_reason=(
                "Needs PyQt6 QGraphicsView scene. Pass --gui to drive this id via app --check "
                "--offscreen graphics-scene + weather/day-part ok: lines "
                "(shared bundle with gui.blotter_qt)."
            ),
            mode="gui",
        ),
    ]


def _invoke_blotter(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"blotter.{local_id}"
    if local_id == "hours":
        from .hours import (
            CHECK_HOUR,
            REST,
            call_line,
            day_part,
            day_part_label,
            hide_line,
            is_resting_hour,
            return_line,
            snack_line,
        )

        parts = {h: day_part(h) for h in (4, 5, 8, 17, 21)}
        expect = {4: "night", 5: "dawn", 8: "day", 17: "dusk", 21: "night"}
        if parts != expect:
            return InvokeResult(aid, "blotter", False, error=f"day_part drift {parts}")
        labels = [day_part_label(p) for p in ("dawn", "day", "dusk", "night")]
        if labels != ["Dawn", "Day", "Dusk", "Night"]:
            return InvokeResult(aid, "blotter", False, error=f"day_part_label drift {labels}")
        if set(REST) != set(CATALOG_KEYS) or len(REST) != len(CATALOG_KEYS):
            return InvokeResult(
                aid, "blotter", False,
                error=f"REST size {len(REST)} vs catalog {len(CATALOG_KEYS)}",
            )
        if CHECK_HOUR != 14 or day_part(CHECK_HOUR) != "day":
            return InvokeResult(aid, "blotter", False, error="CHECK_HOUR fixture drifted")
        if not is_resting_hour("cat", 14) or is_resting_hour("red_panda", 14):
            return InvokeResult(aid, "blotter", False, error="fixture resting hours drifted")
        # House REST for Rui is [1, 6) — desktop/web agree; blotter Python must match.
        if (
            is_resting_hour("red_panda", 0)
            or not is_resting_hour("red_panda", 2)
            or is_resting_hour("red_panda", 6)
            or is_resting_hour("red_panda", 23)
        ):
            return InvokeResult(aid, "blotter", False, error="rui rest window drifted from desk/web [1,6)")
        lock_fails, lock_extras = _hours_rest_lockstep(dict(REST))
        if lock_fails:
            return InvokeResult(
                aid, "blotter", False,
                error="; ".join(lock_fails),
                extras=lock_extras,
                detail="REST lockstep failed",
            )
        hide = hide_line("red_panda")
        snack = snack_line("red_panda")
        call = call_line("red_panda")
        if "ribbon" not in hide.lower() and "ribbon" not in hide:
            # house copy: "I went where the ribbon goes."
            if "ribbon" not in hide:
                return InvokeResult(aid, "blotter", False, error=f"hide_line drift {hide!r}")
        if "Bamboo" not in snack:
            return InvokeResult(aid, "blotter", False, error=f"snack_line drift {snack!r}")
        if "called" not in call.lower():
            return InvokeResult(aid, "blotter", False, error=f"call_line drift {call!r}")
        if return_line(0) is not None:
            return InvokeResult(aid, "blotter", False, error="return_line(0) should be None")
        smoked = _run_node_smoke("blotter_hours", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"rest={len(REST)} lockstep={lock_extras.get('rest_lockstep')} part={day_part(CHECK_HOUR)}",
            extras={
                "rest": len(REST),
                "check_hour": CHECK_HOUR,
                "day_part": day_part(CHECK_HOUR),
                "hide": hide,
                "snack": snack,
                **lock_extras,
                "day_part_peers": "python+web (no desktop hours.js dayPart)",
            },
            trace=[
                f"REST={len(REST)}",
                f"REST_lockstep={lock_extras.get('rest_lockstep')}",
                f"day_part({CHECK_HOUR})={day_part(CHECK_HOUR)}",
                "day_part_peers=python+web",
                f"hide={hide}",
                f"snack={snack}",
                *list(smoked.trace),
            ],
        )

    if local_id == "hive":
        from .hive import (
            HIVE_BROOD_CELLS,
            HIVE_PLACE,
            HIVE_SITTERS,
            HIVE_WORKER,
            colony_of,
            colony_word,
            comb_seats,
            hive_walkers,
            is_hive_place,
            sits_on_wax,
            stamp_colony,
        )

        if HIVE_PLACE != "honeycomb" or HIVE_WORKER != "honeybee":
            return InvokeResult(aid, "blotter", False, error="hive place/worker drifted")
        if HIVE_SITTERS != ("honeybee", "honey_queen", "honey_drone"):
            return InvokeResult(aid, "blotter", False, error=f"sitters drift {HIVE_SITTERS}")
        if not is_hive_place("honeycomb") or is_hive_place("honeybee"):
            return InvokeResult(aid, "blotter", False, error="is_hive_place drift")
        if not sits_on_wax("honeybee") or sits_on_wax("honeycomb"):
            return InvokeResult(aid, "blotter", False, error="sits_on_wax drift")
        seats = [s.key for s in comb_seats()]
        if seats != ["honey_queen", "honeybee", "honeybee", "honey_drone"]:
            return InvokeResult(aid, "blotter", False, error=f"comb_seats drift {seats}")
        living = colony_of(CareState(hunger=78, health=92))
        word = colony_word(living)
        stamped = stamp_colony(CareState(hunger=78, health=92, mood=74))
        if living.quiet or stamped.get("brood") != 7 or stamped.get("stores") != 78:
            return InvokeResult(aid, "blotter", False, error=f"colony stamp drift {stamped}")
        if "Brood" not in word:
            return InvokeResult(aid, "blotter", False, error=f"colony_word drift {word!r}")
        walkers = hive_walkers(["honeybee", "monarch", "honeycomb", "mason_bee"])
        if walkers != ["monarch", "mason_bee"]:
            return InvokeResult(aid, "blotter", False, error=f"hive_walkers drift {walkers}")
        smoked = _run_node_smoke("blotter_hive", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"place={HIVE_PLACE} brood={stamped['brood']}",
            extras={"place": HIVE_PLACE, "brood": stamped["brood"], "stores": stamped["stores"],
                    "cells": HIVE_BROOD_CELLS, "seats": seats},
            trace=[f"place={HIVE_PLACE}", f"brood={stamped['brood']}", f"word={word}", *list(smoked.trace)],
        )

    if local_id == "guide":
        from .guide import classroom_for, guide_complete, plaque_for

        if not guide_complete():
            return InvokeResult(aid, "blotter", False, error="guide_complete() is False")
        rui = plaque_for("red_panda")
        if rui is None or rui.name != "Rui" or "Ailurus" not in (rui.latin or ""):
            return InvokeResult(aid, "blotter", False, error=f"rui plaque drift {rui}")
        wax = plaque_for("honeycomb")
        if wax is None or "Apis" not in (wax.latin or ""):
            return InvokeResult(aid, "blotter", False, error=f"wax plaque drift {wax}")
        missing = [k for k in CATALOG_KEYS if plaque_for(k) is None]
        if missing:
            return InvokeResult(
                aid, "blotter", False,
                error=f"plaque_for missing {len(missing)}",
                extras={"missing": missing[:12]},
            )
        den = classroom_for("ball_python")
        house = classroom_for("red_panda")
        if getattr(den, "room", None) != "den" or getattr(house, "room", None) != "house":
            return InvokeResult(
                aid, "blotter", False,
                error=f"classroom drift den={den} house={house}",
            )
        return InvokeResult(
            aid, "blotter", True,
            detail=f"plaques={len(CATALOG_KEYS)} rui={rui.name}",
            extras={"n": len(CATALOG_KEYS), "rui": rui.name, "latin": rui.latin,
                    "den_room": den.room, "house_room": house.room},
            trace=[
                f"guide_complete=True",
                f"plaques={len(CATALOG_KEYS)}",
                f"rui={rui.name}/{rui.latin}",
                f"classroom.den={den.room}",
                f"classroom.house={house.room}",
            ],
        )

    if local_id == "gait":
        from .gait import (
            ACCEL_S,
            DECEL_DIST,
            HIGH_WALK,
            TURN_S,
            TURN_SNAKE_S,
            enter_sit,
            enter_spawn,
            facing_after,
            leave_target,
            overshoot_px,
            turn_hold_s,
            walk_speed,
        )

        if (ACCEL_S, DECEL_DIST, TURN_S, TURN_SNAKE_S, HIGH_WALK) != (0.4, 56.0, 0.23, 0.35, 120.0):
            return InvokeResult(aid, "blotter", False, error="gait constants drifted")
        if walk_speed(56, 1, 100.0) != 100.0:
            return InvokeResult(aid, "blotter", False, error="walk_speed full remaining drift")
        near = walk_speed(24, 1, 100.0)
        if not (30 < near < (24 / 56) * 100.0 - 1):
            return InvokeResult(aid, "blotter", False, error=f"walk_speed ease drift {near}")
        if facing_after(1, 100, 20, 0, TURN_S) != 1:
            return InvokeResult(aid, "blotter", False, error="facing_after frame0 flip")
        if facing_after(1, 100, 20, TURN_S, TURN_S) != -1:
            return InvokeResult(aid, "blotter", False, error="facing_after hold flip")
        if leave_target(80, 800) != -200 or leave_target(600, 800) != 812:
            return InvokeResult(aid, "blotter", False, error="leave_target drift")
        if enter_spawn(800, 176, 20, True) != -176 or enter_sit(800, 176, 20, 0) != 80.0:
            return InvokeResult(aid, "blotter", False, error="enter_spawn/sit drift")
        if turn_hold_s(crawl=True, walk=36) != TURN_SNAKE_S:
            return InvokeResult(aid, "blotter", False, error="turn_hold crawl drift")
        if overshoot_px(crawl=True, walk=36) != 4.0:
            return InvokeResult(aid, "blotter", False, error="overshoot crawl drift")
        smoked = _run_node_smoke("blotter_gait", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"TURN_S={TURN_S} leave={leave_target(80, 800)}",
            extras={"TURN_S": TURN_S, "ACCEL_S": ACCEL_S, "near": near},
            trace=[f"TURN_S={TURN_S}", f"walk_speed.near={near}", f"leave={leave_target(80, 800)}",
                    *list(smoked.trace)],
        )

    if local_id == "play":
        from .play import PlayChase, play_chase, play_claim

        local = play_chase(("catch", "arrive"), PlayChase(taken=False, cmd="seek", mark="lure"))
        if local.acts != ("play", "idle") or local.apply_play != 1 or local.issue_play != 1:
            return InvokeResult(aid, "blotter", False, error=f"catch/arrive drift {local}")
        if play_claim("arrive", PlayChase(taken=True, cmd="seek", mark="lure")) != "none":
            return InvokeResult(aid, "blotter", False, error="double-claim not none")
        treat = play_chase(("arrive",), PlayChase(taken=False, cmd="seek", mark="treat"))
        if treat.acts != ("snack",) or treat.apply_play != 0:
            return InvokeResult(aid, "blotter", False, error=f"treat arrive drift {treat}")
        smoked = _run_node_smoke("blotter_play", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"acts={list(local.acts)} apply={local.apply_play}",
            extras={"acts": list(local.acts), "apply_play": local.apply_play,
                    "treat": list(treat.acts)},
            trace=[f"acts={list(local.acts)}", f"apply_play={local.apply_play}",
                    f"treat={list(treat.acts)}", *list(smoked.trace)],
        )

    if local_id == "weather":
        from datetime import datetime

        from .weather import civil_day_number, weather_idle, weather_label, weather_line, weather_of

        day = civil_day_number(datetime(2026, 8, 17))
        if day != 20682:
            return InvokeResult(aid, "blotter", False, error=f"civil_day drift {day}")
        sky = weather_of(datetime(2026, 8, 17))
        if sky != "wind":
            return InvokeResult(aid, "blotter", False, error=f"weather_of fixture drift {sky}")
        if weather_label("wind") != "Wind":
            return InvokeResult(aid, "blotter", False, error="weather_label drift")
        if weather_line("goldfish", "rain") != "Proper weather. At last.":
            return InvokeResult(aid, "blotter", False, error="rain swimmer line drift")
        if weather_line("red_panda", "rain") != "The blotter is honest about rain.":
            return InvokeResult(aid, "blotter", False, error="rui rain line drift")
        if weather_idle("goldfish", "rain") != "wander" or weather_idle("red_panda", "rain") != "sit":
            return InvokeResult(aid, "blotter", False, error="weather_idle rain drift")
        if weather_idle("ball_python", "heat") != "sit":
            return InvokeResult(aid, "blotter", False, error="snake heat idle drift")
        if weather_idle("red_panda", "clear") is not None:
            return InvokeResult(aid, "blotter", False, error="clear idle should be None")
        smoked = _run_node_smoke("blotter_weather", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"day={day} sky={sky}",
            extras={"civil_day": day, "sky": sky},
            trace=[f"civil_day={day}", f"sky={sky}", "line.goldfish.rain=ok",
                    "idle.rui.rain=sit", *list(smoked.trace)],
        )

    if local_id == "rail":
        rail = _rail_keys()
        if set(rail) != set(CATALOG_KEYS):
            missing = sorted(set(CATALOG_KEYS) - set(rail))
            extra = sorted(set(rail) - set(CATALOG_KEYS))
            return InvokeResult(
                aid, "blotter", False,
                error=f"rail set drift missing={missing[:8]} extra={extra[:8]}",
                extras={"missing": missing, "extra": extra},
            )
        if len(rail) != len(CATALOG_KEYS):
            return InvokeResult(aid, "blotter", False, error="rail length drift (dupes?)")
        # rail.py must still walk those groups (source wire — no Qt import).
        rail_src = _read("client/computerpets_client/rail.py")
        for token in ("HOUSE_KEYS", "SNAKE_KEYS", "SEA_KEYS", "FUNGI_KEYS", "GRID_KEYS", "SpeciesRail"):
            if token not in rail_src:
                return InvokeResult(aid, "blotter", False, error=f"rail.py missing {token}")
        return InvokeResult(
            aid, "blotter", True,
            detail=f"rail_keys={len(rail)} catalog={len(CATALOG_KEYS)}",
            extras={"n": len(rail), "same_order": list(rail) == list(CATALOG_KEYS)},
            trace=[
                f"rail_keys={len(rail)}",
                f"catalog={len(CATALOG_KEYS)}",
                f"same_order={list(rail) == list(CATALOG_KEYS)}",
                "rail.py.SpeciesRail=wired",
            ],
        )

    if local_id == "frames":
        keys = _frames_anim_keys()
        expect = ["idle", "walk", "sit", "eat", "sleep", "play"]
        if keys != expect:
            return InvokeResult(aid, "blotter", False, error=f"ANIMS drift {keys}")
        return InvokeResult(
            aid, "blotter", True,
            detail=f"anims={','.join(keys)}",
            extras={"anims": keys},
            trace=[f"ANIMS={','.join(keys)}", "frames.py.source=ok"],
        )

    if local_id == "classroom":
        from .guide import classroom_for

        # Python room -> web plaques.classroomFor `to` path (lockstep identity).
        room_to_path = {
            "den": "/snakes",
            "tide": "/sea",
            "garden": "/garden",
            "hive": "/hive",
            "cellar": "/cellar",
            "far": "/far",
            "pond": "/pond",
            "roost": "/roost",
            "corner": "/corner",
            "wood": "/wood",
            "canopy": "/canopy",
            "stone": "/stone",
            "creek": "/creek",
            "log": "/log",
            "shore": "/shore",
            "reef": "/reef",
            "grid": "/grid",
            "meadow": "/meadow",
            "well": "/well",
            "house": "/study",
        }
        expect: dict[str, dict[str, str]] = {}
        rooms: dict[str, int] = {}
        thin: list[str] = []
        unknown_room: list[str] = []
        for key in CATALOG_KEYS:
            cls = classroom_for(key)
            room = getattr(cls, "room", None) or ""
            label = getattr(cls, "label", None) or ""
            verb = getattr(cls, "verb", None) or ""
            if not room or not label or not verb:
                thin.append(key)
                continue
            if room not in room_to_path:
                unknown_room.append(key)
                continue
            rooms[room] = rooms.get(room, 0) + 1
            expect[key] = {
                "room": room,
                "label": label,
                "verb": verb,
                "to": room_to_path[room],
            }
        if thin or unknown_room:
            return InvokeResult(
                aid, "blotter", False,
                error=(
                    f"classroom thin={len(thin)} unknown_room={len(unknown_room)}"
                ),
                extras={"thin": thin[:12], "unknown_room": unknown_room[:12]},
            )
        if set(rooms) != set(room_to_path):
            return InvokeResult(
                aid, "blotter", False,
                error=f"classroom rooms drift have={sorted(rooms)} want={sorted(room_to_path)}",
                extras={"rooms": rooms},
            )
        if sum(rooms.values()) != len(CATALOG_KEYS):
            return InvokeResult(
                aid, "blotter", False,
                error=f"classroom count {sum(rooms.values())} vs catalog {len(CATALOG_KEYS)}",
            )
        # Bee keys (not honeybee — that key is_insect first) vs insect hive label.
        bee = classroom_for("honey_queen")
        bug = classroom_for("monarch")
        if bee.room != "hive" or bug.room != "hive":
            return InvokeResult(aid, "blotter", False, error="hive room drift")
        if "Bees and comb" not in bee.label or bug.label == bee.label:
            return InvokeResult(
                aid, "blotter", False,
                error=f"hive label split drift bee={bee.label!r} bug={bug.label!r}",
            )
        import json
        import tempfile

        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", suffix=".json", delete=False
        ) as tmp:
            json.dump(expect, tmp)
            expect_path = tmp.name
        try:
            smoked = _run_web_smoke(
                "classroom_lockstep",
                domain="blotter",
                action_id=aid,
                extra_args=[expect_path],
                use_tsx=True,
            )
        finally:
            Path(expect_path).unlink(missing_ok=True)
        if not smoked.ok:
            return smoked
        # Desktop has no classroom peer — document, do not invent.
        desk_hours = _read("desktop/renderer/hours.js")
        if "classroomFor" in desk_hours or "classroom_for" in desk_hours:
            return InvokeResult(
                aid, "blotter", False,
                error="unexpected desktop classroom API — document if added",
            )
        return InvokeResult(
            aid, "blotter", True,
            detail=f"rooms={len(rooms)} keys={len(expect)} lockstep={smoked.extras.get('matched')}",
            extras={
                "rooms": rooms,
                "n": len(expect),
                "matched": smoked.extras.get("matched"),
                "desktop_classroom": False,
            },
            trace=[
                f"rooms={len(rooms)}",
                f"keys={len(expect)}",
                f"hive.bee={bee.label}",
                f"lockstep={smoked.extras.get('matched')}",
                "desktop_classroom=absent",
                *list(smoked.trace),
            ],
        )

    if local_id == "return_memory":
        import json
        import tempfile
        from pathlib import Path as _Path

        from .hours import remember_visit, return_line

        # Threshold table (hour pinned so civil clock cannot flake).
        cases = [
            (0, 14, None),
            (0.3 * 3_600_000, 14, None),
            (0.5 * 3_600_000, 14, "Back. I noticed."),
            (1 * 3_600_000, 14, "You were elsewhere. I practiced waiting."),
            (6 * 3_600_000, 14, "Hours. I sat in most of them."),
            (20 * 3_600_000, 8, "You were gone a night. I kept the blotter."),
            (20 * 3_600_000, 14, "A long absence. I counted the dust."),
        ]
        for away_ms, hour, want in cases:
            got = return_line(away_ms, hour=hour)
            if got != want:
                return InvokeResult(
                    aid, "blotter", False,
                    error=f"return_line({away_ms},{hour}) got {got!r} want {want!r}",
                )

        with tempfile.TemporaryDirectory() as tmp:
            udir = _Path(tmp)
            t0 = 1_700_000_000_000
            away0 = remember_visit("red_panda", user_data_dir=udir, now_ms=t0)
            if away0 != 0:
                return InvokeResult(
                    aid, "blotter", False,
                    error=f"first remember_visit away={away0} want 0",
                )
            seen = udir / "seen.json"
            if not seen.is_file():
                return InvokeResult(aid, "blotter", False, error="seen.json not written")
            store = json.loads(seen.read_text(encoding="utf-8"))
            if store.get("red_panda") != t0:
                return InvokeResult(aid, "blotter", False, error=f"seen stamp drift {store}")
            away = remember_visit(
                "red_panda", user_data_dir=udir, now_ms=t0 + 2 * 3_600_000
            )
            if away != 2 * 3_600_000:
                return InvokeResult(
                    aid, "blotter", False,
                    error=f"second remember_visit away={away}",
                )
            line = return_line(away, hour=14)
            if line != "You were elsewhere. I practiced waiting.":
                return InvokeResult(
                    aid, "blotter", False,
                    error=f"return after remember drift {line!r}",
                )
            # Corrupt store must not crash; away stays 0-ish default path.
            seen.write_text("{not-json", encoding="utf-8")
            away_bad = remember_visit("cat", user_data_dir=udir, now_ms=t0 + 1)
            if away_bad != 0:
                return InvokeResult(
                    aid, "blotter", False,
                    error=f"corrupt seen should yield away=0 got {away_bad}",
                )

        # Desktop hours.js: callLine yes, returnLine/rememberVisit no.
        desk_src = _read("desktop/renderer/hours.js")
        if "returnLine" in desk_src or "rememberVisit" in desk_src:
            return InvokeResult(
                aid, "blotter", False,
                error="unexpected desktop returnLine/rememberVisit — document if added",
            )
        if "callLine" not in desk_src:
            return InvokeResult(aid, "blotter", False, error="desktop callLine missing")

        smoked = _run_web_smoke("return_memory", domain="blotter", action_id=aid)
        if not smoked.ok:
            return smoked
        return InvokeResult(
            aid, "blotter", True,
            detail=f"thresholds={len(cases)} persist=ok lockstep=web",
            extras={
                "thresholds": len(cases),
                "desktop_return": False,
                "web_matched": smoked.extras.get("matched"),
            },
            trace=[
                f"thresholds={len(cases)}",
                "remember_visit.seen.json=ok",
                "return_line.after_away=ok",
                "corrupt_seen=ok",
                "desktop_return=absent",
                *list(smoked.trace),
            ],
        )

    if local_id == "unlock_offline":
        return _blotter_unlock_offline(aid)

    return InvokeResult(aid, "blotter", False, error=f"unknown blotter id {local_id!r}")


def _blotter_unlock_offline(aid: str) -> InvokeResult:
    """Drive the real license session offline: sealed token, memory-only, migration, plain words."""
    import base64
    import json as _json

    from .license.contract_double import create_contract_test_double
    from .license.errors import LicenseError
    from .license.http_client import HttpResponse, create_license_client
    from .license.license_net import bundle_honesty
    from .license.plain_error import PETS_STILL, plain_license_error
    from .license.session import create_license_session

    secret = base64.b64encode(bytes([7] * 32)).decode("ascii")  # test-only key
    signing = "test-bundle-signing-key-not-a-placeholder"
    unlock = {
        "steamId": "76561198000000000",
        "appId": "123456",
        "petType": "cat",
        "provider": "steam",
        "cdnLine": bundle_honesty("https://cdn.enterprisepet.example/bundles/cat.zip"),
    }

    class Disk:
        def __init__(self) -> None:
            self.files: dict[str, str] = {}

        def read(self, path: str) -> str:
            if path not in self.files:
                raise FileNotFoundError(path)
            return self.files[path]

        def write(self, path: str, data: str) -> None:
            self.files[path] = data

    class Codec:
        def encrypt(self, text: str) -> str:
            return "fake:" + base64.b64encode(text[::-1].encode()).decode()

        def decrypt(self, sealed: str) -> str:
            return base64.b64decode(sealed[5:]).decode()[::-1]

    def session(backend: dict[str, Any], disk: Disk, codec: Any) -> dict[str, Any]:
        return create_license_session(
            user_data_dir="/harness/license",
            env={"LICENSE_SECRET_KEY": secret, "BUNDLE_SIGNING_KEY": signing,
                 "COMPUTERPETS_BACKEND_URL": "http://127.0.0.1:8080"},
            fetch_impl=backend["fetch_impl"], hwid="harness-device", read_file=disk.read,
            write_file=disk.write, mkdir=lambda _p: None, codec=codec,
        )

    def bearer(backend: dict[str, Any]) -> str:
        posts = [c for c in backend["calls"] if c["path"].startswith("/api/download/")]
        return posts[0]["headers"]["Authorization"][len("Bearer "):] if posts else ""

    trace: list[str] = []
    # 1) With a store: sealed, never plain.
    backend, disk = create_contract_test_double(license_secret=secret, signing_key=signing), Disk()
    status = session(backend, disk, Codec())["unlock"](unlock)
    token = bearer(backend)
    stored = _json.loads(next(iter(disk.files.values())))
    if not token or token in "".join(disk.files.values()) or "token" in stored.get("auth", {}):
        return InvokeResult(aid, "blotter", False, error="download sign-in written in plain text")
    if status.get("tokenKept") != "sealed":
        return InvokeResult(aid, "blotter", False, error=f"tokenKept {status.get('tokenKept')!r} != sealed")
    trace.append("sealed=ok")
    # 2) No store: memory only, and a later run says unlock again before any POST.
    backend, disk = create_contract_test_double(license_secret=secret, signing_key=signing), Disk()
    status = session(backend, disk, None)["unlock"](unlock)
    if status.get("tokenKept") != "memory" or bearer(backend) in "".join(disk.files.values()):
        return InvokeResult(aid, "blotter", False, error="no-store unlock was not memory-only")
    backend["calls"].clear()
    try:
        session(backend, disk, None)["download"]({"cdnLine": unlock["cdnLine"]})
        return InvokeResult(aid, "blotter", False, error="later run downloaded with no sign-in")
    except LicenseError as err:
        if err.code != "no_token" or not str(err).endswith(PETS_STILL) or bearer(backend):
            return InvokeResult(aid, "blotter", False, error=f"later run: {err.code} {err}")
    trace.append("memory_only=ok")
    # 3) An older plain license.json is sealed on first read.
    path = next(iter(disk.files))
    old = _json.loads(disk.files[path])
    old["auth"] = {"token": "test.old-plain", "expiresAt": old["auth"].get("expiresAt")}
    disk.files[path] = _json.dumps(old)
    kept = session(backend, disk, Codec())["status"]().get("tokenKept")
    if kept != "sealed" or "old-plain" in disk.files[path]:
        return InvokeResult(aid, "blotter", False, error="old plain token was not sealed")
    trace.append("migrated=ok")
    # 4) Plain words: refused, HTTP 500, 403 server words, blank fields.
    def verify_with(fetch: Callable[..., Any]) -> str:
        try:
            create_license_client(fetch_impl=fetch)["verify"](
                backend_url="https://house.example", provider="steam", license_secret=secret,
                fields={"steamId": "1", "appId": "2", "hwid": "dev"},
            )
        except LicenseError as err:
            return plain_license_error(err)["message"]
        return ""

    def refused(url: str, **_: Any) -> Any:
        raise ConnectionRefusedError(111, "Connection refused")

    words = {
        "refused": verify_with(refused),
        "server": verify_with(lambda url, **_: HttpResponse(500, b'{"error":"db down"}')),
        "denied": plain_license_error(
            LicenseError("denied", "ops runbook 7"), "house.example")["message"],
    }
    try:
        session(backend, Disk(), Codec())["unlock"]({**unlock, "appId": ""})
        words["fields"] = ""
    except LicenseError as err:
        words["fields"] = plain_license_error(err)["message"]
    expect = {
        "refused": "Couldn't reach the house server at house.example.",
        "server": "The house server at house.example had a problem (error 500).",
        "denied": "The house server at house.example did not confirm that you own the game.",
        "fields": "Fill in the Steam ID and the App ID first.",
    }
    for key, start in expect.items():
        got = words[key]
        if not got.startswith(start) or not got.endswith(PETS_STILL) or "runbook" in got or "db down" in got:
            return InvokeResult(aid, "blotter", False, error=f"{key} words drift {got!r}")
        trace.append(f"{key}=plain")
    return InvokeResult(
        aid, "blotter", True,
        detail="sealed, memory-only, migrated, plain words",
        extras={"tokenKept": ["sealed", "memory", "sealed"], "words": words},
        trace=trace,
    )


def _assert_blotter(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "blotter invoke failed"]


# ---------------------------------------------------------------------------
# Registry (FlowersForever ConnectorRegistry / CSRBT HarnessRegistry)
# ---------------------------------------------------------------------------

_DOMAIN_BUILDERS: dict[str, Callable[[], list[Affordance]]] = {
    "care": _care_rows,
    "guest": _guest_rows,
    "visit": _visit_rows,
    "species": _species_rows,
    "ethogram": _ethogram_rows,
    "cry": _cry_rows,
    "gift": _gift_rows,
    "desk": _desk_rows,
    "card": _card_rows,
    "web": _web_rows,
    "blotter": _blotter_rows,
    "gui": _gui_rows,
}

_INVOKERS: dict[str, Callable[..., InvokeResult]] = {
    "care": _invoke_care,
    "guest": _invoke_guest,
    "visit": _invoke_visit,
    "species": _invoke_species,
    "ethogram": _invoke_ethogram,
    "cry": _invoke_cry,
    "gift": _invoke_gift,
    "desk": _invoke_desk,
    "card": _invoke_card,
    "web": _invoke_web,
    "blotter": _invoke_blotter,
    "gui": _invoke_gui,
}

_ASSERTERS: dict[str, Callable[[str, InvokeResult], list[str]]] = {
    "care": _assert_care,
    "guest": _assert_guest,
    "visit": _assert_visit,
    "species": _assert_species,
    "ethogram": _assert_ethogram,
    "cry": _assert_cry,
    "gift": _assert_gift,
    "desk": _assert_desk,
    "card": _assert_card,
    "web": _assert_web,
    "blotter": _assert_blotter,
    "gui": _assert_gui,
}


def domains() -> tuple[str, ...]:
    return DOMAINS


def catalog(*, domain: str | None = None) -> list[Affordance]:
    """Every real inspectable affordance, with stable ids. Optional domain filter."""
    rows: list[Affordance] = []
    wanted = (domain,) if domain else DOMAINS
    for name in wanted:
        builder = _DOMAIN_BUILDERS.get(name)
        if builder is None:
            raise KeyError(f"unknown domain {name!r}; known: {', '.join(DOMAINS)}")
        rows.extend(builder())
    return rows


def catalog_ids(*, domain: str | None = None) -> tuple[str, ...]:
    return tuple(a.id for a in catalog(domain=domain))


def gaps() -> list[Affordance]:
    """Honest excluded / hidden / sequenced rows — GUI-only and live-network holes."""
    return [a for a in catalog() if a.fate != "driven"]


def _split_id(action_id: str) -> tuple[str, str]:
    raw = action_id.strip()
    if "." in raw:
        domain, local = raw.split(".", 1)
        return domain, local
    # Bare id: unique suffix, else care (the original harness).
    matches = [a.id for a in catalog() if a.id == raw or a.id.endswith("." + raw)]
    if len(matches) == 1:
        domain, local = matches[0].split(".", 1)
        return domain, local
    care_ids = {a.id for a in care_harness.catalog()}
    if raw in care_ids:
        return "care", raw
    return "", raw


def invoke(action_id: str, **opts: Any) -> InvokeResult:
    """Run one catalogued action. Bare care ids (feed) still resolve."""
    domain, local = _split_id(action_id)
    full = f"{domain}.{local}" if domain and local else action_id
    row = next((a for a in catalog() if a.id == full or a.id == action_id), None)
    if row is not None and row.fate == "excluded":
        reason = row.exclude_reason or "not a driven surface"
        return InvokeResult(
            action_id=row.id,
            domain=row.domain,
            ok=True,
            detail=f"excluded: {reason}",
            extras={"excluded": True, "reason": reason},
            trace=[f"excluded:{reason}"],
        )
    fn = _INVOKERS.get(domain)
    if fn is None:
        return InvokeResult(
            action_id=action_id, domain=domain or "?", ok=False,
            error=f"unknown action id: {action_id!r}",
        )
    try:
        return fn(local, **opts)
    except Exception as exc:  # oracle: uncaught error is a fail, not a crash of the runner
        return InvokeResult(
            action_id=f"{domain}.{local}", domain=domain, ok=False,
            error=f"{type(exc).__name__}: {exc}",
            detail=str(exc),
        )


def assert_action(action_id: str, result: InvokeResult) -> list[str]:
    """Return assertion failure messages (empty = pass). General oracle + domain checks."""
    fails: list[str] = []
    if result.extras.get("excluded"):
        return fails
    if result.error:
        fails.append(result.error)
    if not result.ok and not result.error:
        fails.append(result.detail or "invoke failed")
    for item in result.trace:
        text = str(item)
        if "NaN" in text or "undefined" in text or "[object Object]" in text:
            fails.append(f"junk in trace: {text[:80]}")
    if result.ok and not result.trace:
        fails.append("no observable trace (dead affordance)")
    domain, local = _split_id(action_id if action_id else result.action_id)
    checker = _ASSERTERS.get(domain)
    if checker is not None and not result.extras.get("excluded"):
        fails.extend(checker(local, result))
    # de-dupe, keep order
    seen: set[str] = set()
    out: list[str] = []
    for msg in fails:
        if msg not in seen:
            seen.add(msg)
            out.append(msg)
    return out


def _seed_care(local_id: str) -> dict[str, Any]:
    from .life import MessPile

    seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=50, bond=10)
    if local_id == "call":
        seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=50, bond=10, hidden=True)
    if local_id == "medicine":
        seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=40, bond=10, sick=True)
    if local_id == "clean":
        seed = CareState(
            hunger=40, mood=50, energy=50, hygiene=40, health=50, bond=10,
            mess=[MessPile(id=1, x=0.25)],
        )
    return {"state": seed, "species": "red_panda"}


def run_domain(
    domain: str,
    *,
    only: Iterable[str] | None = None,
    live: bool = False,
    gui: bool = False,
) -> list[CaseResult]:
    """Invoke every driven affordance in a domain and assert.

    live=True promotes mode=live catalog rows (still excluded from default run_all) into
    an opt-in HTTP attempt for that run only.
    gui=True promotes mode=gui catalog rows into Electron/Qt smokes for that run only.
    """
    if domain not in DOMAINS:
        raise KeyError(f"unknown domain {domain!r}; known: {', '.join(DOMAINS)}")
    want = set(only) if only is not None else None
    out: list[CaseResult] = []
    for row in catalog(domain=domain):
        if want is not None and row.id not in want and row.id.split(".", 1)[-1] not in want:
            continue
        if row.fate == "excluded":
            if live and row.mode == "live" and row.id.startswith("live.") and row.id != "live.cry_playback":
                result = _invoke_live_network(row.id)
                fails = assert_action(row.id, result) if result.ok or result.error else [result.error or "live failed"]
                if result.error and not fails:
                    fails = [result.error]
                if not result.ok and result.error and result.error not in fails:
                    fails = [result.error]
                fate = "failed" if fails else "driven"
                out.append(
                    CaseResult(
                        action_id=row.id, domain=row.domain, passed=not fails,
                        failures=fails, detail=result.detail, fate=fate,
                    )
                )
                continue
            if gui and row.mode == "gui":
                if row.id.startswith("gui."):
                    result = _invoke_gui_optin(row.id)
                elif row.domain == "blotter" and row.id in {
                    "blotter.plaque", "blotter.frames_paint", "blotter.scene",
                }:
                    result = _invoke_blotter_gui_slice(row.id.split(".", 1)[1])
                else:
                    result = None
                if result is not None:
                    fails = assert_action(row.id, result)
                    if result.error and result.error not in fails:
                        fails = fails + [result.error] if fails else [result.error]
                    if not result.ok and not fails:
                        fails = [result.error or result.detail or "gui smoke failed"]
                    fate = "failed" if fails else "driven"
                    out.append(
                        CaseResult(
                            action_id=row.id, domain=row.domain, passed=not fails,
                            failures=fails, detail=result.detail, fate=fate,
                        )
                    )
                    continue
            out.append(
                CaseResult(
                    action_id=row.id, domain=row.domain, passed=True,
                    failures=[], detail=f"excluded: {row.exclude_reason}", fate="excluded",
                )
            )
            continue
        opts: dict[str, Any] = {}
        if row.domain == "care":
            opts = _seed_care(row.id.split(".", 1)[1])
        result = invoke(row.id, **opts)
        fails = assert_action(row.id, result)
        fate = "failed" if fails else "driven"
        if result.ok and not result.trace and not result.extras.get("excluded"):
            fate = "dead"
        out.append(
            CaseResult(
                action_id=row.id, domain=row.domain, passed=not fails,
                failures=fails, detail=result.detail, fate=fate,
            )
        )
    return out


def run_all(
    *,
    domain: str | None = None,
    only: Iterable[str] | None = None,
    live: bool = False,
    gui: bool = False,
) -> list[CaseResult]:
    """Invoke driven affordances across domains (or one domain). Excluded rows stay accounted.

    Default is offline/headless. Pass live=True (CLI --live) to attempt mode=live HTTP rows;
    gui=True (CLI --gui) for Electron/Qt smokes on a machine with a display/Qt.
    Those rows remain fate=excluded in the catalog and in default run_all.
    """
    if domain:
        return run_domain(domain, only=only, live=live, gui=gui)
    out: list[CaseResult] = []
    for name in DOMAINS:
        out.extend(run_domain(name, only=only, live=live, gui=gui))
    return out


def accounting(results: list[CaseResult], *, discovered: int | None = None) -> Accounting:
    """CSRBT ledger. UNACCOUNTED means the harness lost track of an affordance."""
    by_fate = {name: 0 for name in FATES}
    by_domain: dict[str, dict[str, int]] = {}
    seen: set[str] = set()
    for row in results:
        seen.add(row.action_id)
        by_fate[row.fate] = by_fate.get(row.fate, 0) + 1
        bucket = by_domain.setdefault(row.domain, {name: 0 for name in FATES})
        bucket[row.fate] = bucket.get(row.fate, 0) + 1
    n_discovered = discovered if discovered is not None else len(seen)
    accounted = sum(by_fate[name] for name in FATES)
    return Accounting(
        discovered=n_discovered,
        driven=by_fate["driven"],
        dead=by_fate["dead"],
        sequenced=by_fate["sequenced"],
        hidden=by_fate["hidden"],
        failed=by_fate["failed"],
        excluded=by_fate["excluded"],
        unaccounted=n_discovered - accounted,
        by_domain=by_domain,
    )


# ---------------------------------------------------------------------------
# CLI — Buffffff entrypoint
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(
        description="ComputerPets app inspect harness (Buffffff automation / troubleshooting).",
    )
    parser.add_argument("--list", action="store_true", help="Print catalog (optionally one domain) and exit")
    parser.add_argument("--domain", choices=DOMAINS, help="Restrict to one domain")
    parser.add_argument("--only", nargs="*", help="Optional action ids (care.feed or feed)")
    parser.add_argument("--gaps", action="store_true", help="Print excluded/GUI-only/live holes and exit")
    parser.add_argument(
        "--live",
        action="store_true",
        help="Opt-in: attempt mode=live HTTP rows (weather/news/market/nft). Still excluded from default catalog fate.",
    )
    parser.add_argument(
        "--gui",
        action="store_true",
        help="Opt-in: attempt mode=gui Electron/Qt smokes (overlay/card/gift/host-place/blotter). Still excluded from default catalog fate.",
    )
    args = parser.parse_args(argv)

    if args.gaps:
        rows = gaps()
        if args.domain:
            rows = [r for r in rows if r.domain == args.domain]
        for row in rows:
            print(f"{row.id:28}  {row.fate:10}  {row.exclude_reason or row.notes}")
        print(f"\n{len(rows)} gap(s)")
        return 0

    if args.list:
        rows = catalog(domain=args.domain)
        for row in rows:
            extra = f"  [{row.fate}] {row.exclude_reason}" if row.fate != "driven" else (f"  {row.notes}" if row.notes else "")
            print(f"{row.id:28}  {row.domain:10}  {row.handler:40}{extra}")
        print(f"\n{len(rows)} affordance(s)")
        return 0

    results = run_all(domain=args.domain, only=args.only, live=bool(args.live), gui=bool(args.gui))
    failed = 0
    for row in results:
        if row.fate == "excluded":
            mark = "SKIP"
        elif row.passed:
            mark = "PASS"
        else:
            mark = "FAIL"
            failed += 1
        extra = ""
        if row.failures:
            extra = f"  ({'; '.join(row.failures)})"
        elif row.detail:
            extra = f"  {row.detail}"
        print(f"{mark}  {row.action_id}{extra}")

    ledger = accounting(results, discovered=len(results))
    print()
    for name in DOMAINS if not args.domain else (args.domain,):
        bucket = ledger.by_domain.get(name) or {}
        driven = bucket.get("driven", 0)
        failed_n = bucket.get("failed", 0)
        excl = bucket.get("excluded", 0)
        total = driven + failed_n
        print(f"  {name:10}  {driven}/{total} driven  excluded={excl}")
    print(
        f"\ndiscovered={ledger.discovered}  driven={ledger.driven}  failed={ledger.failed}  "
        f"excluded={ledger.excluded}  dead={ledger.dead}  sequenced={ledger.sequenced}  "
        f"hidden={ledger.hidden}  UNACCOUNTED={ledger.unaccounted}"
    )
    if not ledger.holds():
        print("UNACCOUNTED is a harness bug: discovered != driven+dead+sequenced+hidden+failed+excluded")
        failed += 1
    driven_or_failed = ledger.driven + ledger.failed
    print(f"{ledger.driven}/{driven_or_failed} passed")
    return 1 if failed else 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
