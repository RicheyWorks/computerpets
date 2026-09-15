"""App inspect harness: catalog, invoke, and assert real house surfaces.

Buffffff uses this to automate and troubleshoot the whole app — not only care.

Shape (CSRBT at house scale, FlowersForever registry dual-mode):
    * domains are plugins (care is the existing care_harness wrapped)
    * catalog / invoke / assert / run_all / run_domain
    * accounting identity: discovered == driven + dead + sequenced + hidden + failed + excluded
      UNACCOUNTED is a harness bug
    * general oracle: observable trace + no errors + no NaN/undefined junk
    * invariants that survive growth, not frozen counts
    * offline/headless by default; live network fetches are catalogued as excluded

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


# ---------------------------------------------------------------------------
# Catalog rows
# ---------------------------------------------------------------------------

# CSRBT fates. excluded is the only way an affordance escapes being driven,
# and every excluded row carries its reason.
FATES = ("driven", "dead", "sequenced", "hidden", "failed", "excluded")

DOMAINS = (
    "care",
    "guest",
    "species",
    "ethogram",
    "cry",
    "gift",
    "desk",
    "card",
)

SAMPLE_GUESTS = ("red_panda", "cat", "honey_queen", "ball_python", "crow")

ETH_ADDR_RE = re.compile(r"^0x[0-9a-fA-F]{40}$")


@dataclass(frozen=True)
class Affordance:
    """Stable catalog row for one real house function."""

    id: str
    domain: str
    label: str
    handler: str
    notes: str = ""
    mode: str = "offline"  # offline | live  (FlowersForever dual-mode)
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


def _species_rows() -> list[Affordance]:
    rows = [
        Affordance("species.catalog", "species", "Load species catalog", "species.CATALOG_KEYS / SPECIES"),
        Affordance("species.lookup", "species", "species_by_key", "species.species_by_key"),
        Affordance("species.guests_doc", "species", "GUESTS.md roster", "docs/GUESTS.md"),
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
    if not result.ok:
        fails.append(result.error or result.detail or "species invoke failed")
    return fails


# ---------------------------------------------------------------------------
# Ethogram / tricks
# ---------------------------------------------------------------------------


def _tricks_path(key: str) -> Path | None:
    renderer = repo_root() / "desktop" / "renderer"
    web = repo_root() / "web" / "src" / "lib" / "pets"
    names = (f"{key}-tricks.js", f"{key.replace('_', '-')}-tricks.js")
    ts_names = (f"{key}-tricks.ts", f"{key.replace('_', '-')}-tricks.ts")
    for name in names:
        path = renderer / name
        if path.is_file():
            return path
    for name in ts_names:
        path = web / name
        if path.is_file():
            return path
    return None


def _ethogram_rows() -> list[Affordance]:
    rows = []
    for key in SAMPLE_GUESTS:
        rows.append(
            Affordance(
                id=f"ethogram.acts.{key}",
                domain="ethogram",
                label=f"Ethogram {key}",
                handler="ethogram.acts_for",
            )
        )
        tricks = _tricks_path(key)
        if tricks is None:
            rows.append(
                Affordance(
                    id=f"ethogram.tricks.{key}",
                    domain="ethogram",
                    label=f"Tricks file {key}",
                    handler="desktop/renderer/*-tricks.js",
                    fate="excluded",
                    exclude_reason=(
                        f"No separate *-tricks.js for {key}; idle acts_for covers blotter ethogram. "
                        "Overlay ultra tricks are optional per guest."
                    ),
                )
            )
        else:
            rows.append(
                Affordance(
                    id=f"ethogram.tricks.{key}",
                    domain="ethogram",
                    label=f"Tricks file {key}",
                    handler="desktop/renderer/*-tricks.js",
                )
            )
    return rows


def _invoke_ethogram(local_id: str, **opts: Any) -> InvokeResult:
    aid = f"ethogram.{local_id}"
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
    ]
    for key in SAMPLE_GUESTS:
        rows.append(
            Affordance(
                id=f"cry.wav.{key}",
                domain="cry",
                label=f"House cry wav {key}",
                handler="desktop/renderer/sounds/{key}.wav",
                notes="Smoke where the file exists; missing wav is a fail if prefersHouseCry.",
            )
        )
    rows.append(
        Affordance(
            "live.cry_playback",
            "cry",
            "Play house cry through speakers",
            "pet.js / PetDeskHouse",
            fate="excluded",
            exclude_reason="Audio playback needs the overlay/Electron session; wav presence is driven instead.",
        )
    )
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
    return InvokeResult(aid, "cry", False, error=f"unknown cry id {local_id!r}")


def _assert_cry(local_id: str, result: InvokeResult) -> list[str]:
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
            "gui.gift_drag_place",
            "gift",
            "Drag gift on the wood",
            "overlay / blotter pointer",
            fate="excluded",
            exclude_reason="Pointer drag-place is GUI-only; leave_gift / pick_gift cover the logic.",
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
    return InvokeResult(aid, "gift", False, error=f"unknown gift id {local_id!r}")


def _assert_gift(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "gift invoke failed"]


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
            "live.weather_forecast",
            "desk",
            "Open-Meteo forecast fetch",
            "weather-areas.ts forecastUrl",
            mode="live",
            fate="excluded",
            exclude_reason="Live network; resolve APIs are driven offline instead.",
        ),
        Affordance(
            "live.news_rss",
            "desk",
            "Wikipedia / Google News fetch",
            "news.ts",
            mode="live",
            fate="excluded",
            exclude_reason="Live network flakiness; URL builders are driven offline.",
        ),
        Affordance(
            "live.market_quote",
            "desk",
            "CoinGecko / Yahoo live quote",
            "market.ts",
            mode="live",
            fate="excluded",
            exclude_reason="Live network flakiness; host + URL builders are driven offline.",
        ),
        Affordance(
            "live.nft_floor",
            "desk",
            "CoinGecko NFT floor fetch",
            "market.ts nftUrl",
            mode="live",
            fate="excluded",
            exclude_reason="Live network; marketplace list + address normalize are driven offline.",
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
            "gui.card_hud_paint",
            "card",
            "Keeper HUD paint / persist",
            "pet.js paintHud / persistCard",
            fate="excluded",
            exclude_reason="Needs Electron overlay; collapse/open function hooks are driven as source smokes.",
        ),
        Affordance(
            "gui.overlay_paint",
            "card",
            "Overlay compositor / walk loop",
            "desktop/renderer/pet.js",
            fate="excluded",
            exclude_reason="Full GUI; headless Python cannot drive the overlay paint loop.",
        ),
        Affordance(
            "gui.blotter_qt",
            "card",
            "PyQt blotter GPU viewport",
            "blotter.attach_gpu_viewport",
            fate="excluded",
            exclude_reason="Needs a display / Qt OpenGL context; offscreen path is a different honest string.",
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
    return InvokeResult(aid, "card", False, error=f"unknown card id {local_id!r}")


def _assert_card(local_id: str, result: InvokeResult) -> list[str]:
    if result.ok:
        return []
    return [result.error or result.detail or "card invoke failed"]


# ---------------------------------------------------------------------------
# Registry (FlowersForever ConnectorRegistry / CSRBT HarnessRegistry)
# ---------------------------------------------------------------------------

_DOMAIN_BUILDERS: dict[str, Callable[[], list[Affordance]]] = {
    "care": _care_rows,
    "guest": _guest_rows,
    "species": _species_rows,
    "ethogram": _ethogram_rows,
    "cry": _cry_rows,
    "gift": _gift_rows,
    "desk": _desk_rows,
    "card": _card_rows,
}

_INVOKERS: dict[str, Callable[..., InvokeResult]] = {
    "care": _invoke_care,
    "guest": _invoke_guest,
    "species": _invoke_species,
    "ethogram": _invoke_ethogram,
    "cry": _invoke_cry,
    "gift": _invoke_gift,
    "desk": _invoke_desk,
    "card": _invoke_card,
}

_ASSERTERS: dict[str, Callable[[str, InvokeResult], list[str]]] = {
    "care": _assert_care,
    "guest": _assert_guest,
    "species": _assert_species,
    "ethogram": _assert_ethogram,
    "cry": _assert_cry,
    "gift": _assert_gift,
    "desk": _assert_desk,
    "card": _assert_card,
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
    if domain in {"live", "gui"}:
        reason = "not a driven surface"
        return InvokeResult(
            action_id=action_id,
            domain=domain,
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


def run_domain(domain: str, *, only: Iterable[str] | None = None) -> list[CaseResult]:
    """Invoke every driven affordance in a domain and assert."""
    if domain not in DOMAINS:
        raise KeyError(f"unknown domain {domain!r}; known: {', '.join(DOMAINS)}")
    want = set(only) if only is not None else None
    out: list[CaseResult] = []
    for row in catalog(domain=domain):
        if want is not None and row.id not in want and row.id.split(".", 1)[-1] not in want:
            continue
        if row.fate == "excluded":
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


def run_all(*, domain: str | None = None, only: Iterable[str] | None = None) -> list[CaseResult]:
    """Invoke driven affordances across domains (or one domain). Excluded rows stay accounted."""
    if domain:
        return run_domain(domain, only=only)
    out: list[CaseResult] = []
    for name in DOMAINS:
        out.extend(run_domain(name, only=only))
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

    results = run_all(domain=args.domain, only=args.only)
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
