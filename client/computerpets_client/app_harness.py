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

import re
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
            "live.cry_playback",
            "cry",
            "Play house cry through real speakers",
            "pet.js / PetDeskHouse",
            mode="live",
            fate="excluded",
            exclude_reason=(
                "Real speakers/Electron session. Stubbed playVoice path is driven as cry.playback; "
                "wav + pet.js wire remain driven offline."
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
            exclude_reason="True live network. Offline parseForecast path is driven as desk.weather.resolve; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.news_rss",
            "desk",
            "Wikipedia / Google News fetch",
            "news.ts",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. Offline parseRss path is driven as desk.news.resolve; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.market_quote",
            "desk",
            "CoinGecko / Yahoo live quote",
            "market.ts",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. Offline parseGecko/Yahoo path is driven as desk.market.resolve; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.nft_floor",
            "desk",
            "CoinGecko NFT floor fetch",
            "market.ts nftUrl",
            mode="live",
            fate="excluded",
            exclude_reason="True live network. Offline parseNftLive path is driven as desk.nft.resolve; pass --live to attempt HTTP.",
        ),
        Affordance(
            "live.gpu_sense",
            "desk",
            "Keeper-machine GPU probe",
            "gpu.py read_local",
            mode="live",
            fate="excluded",
            exclude_reason=(
                "Reads the keeper machine. Offline contract is card.gpu. "
                "Pass --live to probe. Linux reads nvidia-smi. Mac reads IOAccelerator. Never invents numbers."
            ),
        ),
    ]


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
                and "keeper-gpu" in card
                and "data-gpu" in card
                and "sparkline([], UNREAD_GPU, 0)" in card
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
    ]


def _invoke_web(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"web.{local_id}"
    if local_id == "guest_choice":
        return _run_web_smoke("guest_choice", domain="web", action_id=aid)
    if local_id == "demo_room":
        return _run_web_smoke("demo_room", domain="web", action_id=aid)
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


def _invoke_gui_optin(action_id: str) -> InvokeResult:
    """Opt-in --gui: real Electron/Qt smokes. Not part of default run_all."""
    if action_id == "gui.blotter_qt":
        return _run_blotter_qt_check()
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
    if aid in {"gui.overlay_paint", "gui.card_hud_paint", "gui.gift_drag_place", "gui.host_place", "gui.blotter_qt"}:
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

    return InvokeResult(aid, "blotter", False, error=f"unknown blotter id {local_id!r}")


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
