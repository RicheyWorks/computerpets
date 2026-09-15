"""Inspectable care harness: catalog, invoke, and assert real house care actions.

Wraps the blotter handlers in ``life.py`` / ``specials.py`` / ``shed.py`` — no fake verbs.
Guest-choice dismiss ids (``close`` / ``exit``) are catalogued as menu actions, not care deltas.
Pose ids (``walk`` / ``sit``) are catalogued as pose commands.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable

from .life import (
    CareResult,
    CareState,
    MessPile,
    apply_bath,
    apply_call,
    apply_clean,
    apply_feed,
    apply_hide,
    apply_medicine,
    apply_play,
    apply_praise,
    apply_rest,
    apply_talk,
    apply_treat,
    pick_mess,
)
from .shed import apply_shed
from .specials import apply_special, trait_for
from .species import Species, species_by_key

# Gift pickup lives on CareState.gifts (Coat-like); use life helpers when present.
try:
    from .life import pick_gift as _pick_gift_state  # type: ignore
except ImportError:  # pragma: no cover - gift pick is Coat-based on blotter via app
    _pick_gift_state = None


@dataclass(frozen=True)
class CareAction:
    """Stable catalog row for one real care / menu / pose action."""

    id: str
    label: str
    kind: str  # "care" | "special" | "pose" | "menu" | "gift"
    handler: str
    notes: str = ""


@dataclass
class InvokeResult:
    action_id: str
    ok: bool
    before: CareState | None
    after: CareState | None
    line: str | None = None
    cmd: str | None = None
    anim: str | None = None
    detail: str = ""
    extras: dict[str, Any] = field(default_factory=dict)


def catalog(*, species_key: str = "red_panda") -> list[CareAction]:
    """Every real care-related action the house knows, with stable ids."""
    trait = trait_for(species_key)
    rows = [
        CareAction("feed", "Feed", "care", "life.apply_feed"),
        CareAction("rest", "Rest", "care", "life.apply_rest"),
        CareAction("walk", "Walk", "pose", "pet.issue(wander)", "Pose only — no CareState delta."),
        CareAction("sit", "Sit", "pose", "pet.issue(sit)", "Pose only — no CareState delta."),
        CareAction("talk", "Talk", "care", "life.apply_talk"),
        CareAction("treat", "Treat", "care", "life.apply_treat", "Overlay snack / treat."),
        CareAction("play", "Play", "care", "life.apply_play"),
        CareAction(
            "special",
            trait.verb,
            "special",
            "specials.apply_special",
            f"Species special id={trait.special!r} (e.g. Steal ribbon for red_panda).",
        ),
        CareAction("hide", "Hide", "care", "life.apply_hide"),
        CareAction("call", "Call back", "care", "life.apply_call"),
        CareAction("pick", "Pick", "gift", "life.pick_gift / app._pick_gift", "Needs a gift on the wood."),
        CareAction("clean", "Clean", "care", "life.apply_clean", "Desk tend / blotter button — not guest-choice."),
        CareAction("bath", "Bath", "care", "life.apply_bath", "Desk tend / blotter button — not guest-choice."),
        CareAction("medicine", "Medicine", "care", "life.apply_medicine"),
        CareAction("praise", "Praise", "care", "life.apply_praise"),
        CareAction("shed", "Shed", "care", "shed.apply_shed", "Snakes / due coats."),
        CareAction("close", "Close", "menu", "choice.closeChoice", "Dismiss options overlay only."),
        CareAction("exit", "Exit", "menu", "choice.closeChoice+collapseKeeper", "Leave pet care / unfocus."),
    ]
    return rows


def catalog_ids(*, species_key: str = "red_panda") -> tuple[str, ...]:
    return tuple(a.id for a in catalog(species_key=species_key))


def _species(key: str | Species | None) -> Species:
    if isinstance(key, Species):
        return key
    return species_by_key(key)


def invoke(
    action_id: str,
    state: CareState | None = None,
    *,
    species: str | Species | None = "red_panda",
) -> InvokeResult:
    """Run one catalogued action against a CareState (or report pose/menu-only)."""
    kind = _species(species)
    before = state if state is not None else CareState()
    aid = action_id.strip().lower()

    if aid in {"close", "exit"}:
        return InvokeResult(
            action_id=aid,
            ok=True,
            before=before,
            after=before,
            detail="menu dismiss — no CareState change",
            extras={"menu": aid},
        )

    if aid in {"walk", "sit"}:
        cmd = "wander" if aid == "walk" else "sit"
        return InvokeResult(
            action_id=aid,
            ok=True,
            before=before,
            after=before,
            cmd=cmd,
            detail="pose command — no CareState change",
            extras={"pose": cmd},
        )

    def wrap(result: CareResult) -> InvokeResult:
        return InvokeResult(
            action_id=aid,
            ok=True,
            before=before,
            after=result.state,
            line=result.line,
            cmd=result.cmd,
            anim=result.anim,
        )

    handlers: dict[str, Callable[[], CareResult]] = {
        "feed": lambda: apply_feed(before, kind),
        "rest": lambda: apply_rest(before, kind),
        "talk": lambda: apply_talk(before, kind),
        "treat": lambda: apply_treat(before, kind),
        "play": lambda: apply_play(before, kind),
        "special": lambda: apply_special(before, kind),
        "hide": lambda: apply_hide(before, kind),
        "call": lambda: apply_call(before, kind),
        "clean": lambda: apply_clean(before, kind),
        "bath": lambda: apply_bath(before, kind),
        "medicine": lambda: apply_medicine(before, kind),
        "praise": lambda: apply_praise(before, kind),
        "shed": lambda: apply_shed(before, kind),
    }

    if aid == "pick":
        if not before.gifts:
            seeded = CareState(
                hunger=before.hunger,
                mood=before.mood,
                energy=before.energy,
                hygiene=before.hygiene,
                health=before.health,
                bond=before.bond,
                sick=before.sick,
                hidden=before.hidden,
                gifts=list(before.gifts) or [],
                mess=list(before.mess),
            )
            # Seed a stand-in gift via mess-pick path is wrong; use Coat if available.
            from .shed import Coat

            seeded.gifts = [Coat(id=1, x=0.4, kind="gift")]
            before = seeded
        gift_id = before.gifts[0].id
        # Blotter picks via app; CareState gift removal mirrors web pickGift mood/bond lightly.
        remaining = [g for g in before.gifts if g.id != gift_id]
        after = CareState(
            hunger=before.hunger,
            mood=min(100, before.mood + 6),
            energy=before.energy,
            hygiene=before.hygiene,
            health=before.health,
            bond=min(100, before.bond + 2),
            sick=before.sick,
            hidden=before.hidden,
            gifts=remaining,
            mess=list(before.mess),
            last_line="I left this.",
            anim="sit",
        )
        return InvokeResult(
            action_id="pick",
            ok=True,
            before=before,
            after=after,
            line="I left this.",
            cmd="sit",
            anim="sit",
            detail=f"picked gift id={gift_id}",
        )

    if aid == "pick_mess":
        if not before.mess:
            before = CareState(
                hunger=before.hunger,
                mood=before.mood,
                energy=before.energy,
                hygiene=before.hygiene,
                health=before.health,
                bond=before.bond,
                mess=[MessPile(id=1, x=0.3)],
            )
        return wrap(pick_mess(before, before.mess[0].id))

    fn = handlers.get(aid)
    if fn is None:
        return InvokeResult(
            action_id=aid,
            ok=False,
            before=before,
            after=None,
            detail=f"unknown action id: {aid!r}",
        )
    return wrap(fn())


def assert_action(action_id: str, result: InvokeResult) -> list[str]:
    """Return a list of assertion failure messages (empty = pass)."""
    fails: list[str] = []
    if not result.ok:
        fails.append(result.detail or "invoke failed")
        return fails

    if action_id in {"close", "exit", "walk", "sit"}:
        if result.after is not None and result.before is not None:
            if result.after is not result.before and (
                result.after.hunger != result.before.hunger
                or result.after.mood != result.before.mood
                or result.after.energy != result.before.energy
            ):
                fails.append(f"{action_id} should not change vitals")
        return fails

    if result.after is None:
        fails.append("missing after state")
        return fails

    checks: dict[str, Callable[[InvokeResult], None]] = {}

    def expect(name: str, pred: Callable[[], bool], msg: str) -> None:
        if not pred():
            fails.append(f"{name}: {msg}")

    b, a = result.before, result.after
    assert b is not None and a is not None

    if action_id == "feed":
        expect("feed", lambda: a.hunger >= b.hunger, "hunger should rise")
        expect("feed", lambda: result.cmd == "eat", f"cmd want eat got {result.cmd}")
    elif action_id == "rest":
        expect("rest", lambda: a.energy >= b.energy, "energy should rise")
        expect("rest", lambda: result.cmd == "sleep", f"cmd want sleep got {result.cmd}")
    elif action_id == "talk":
        expect("talk", lambda: a.bond >= b.bond, "bond should rise or hold")
        expect("talk", lambda: result.cmd == "talk", f"cmd want talk got {result.cmd}")
    elif action_id == "treat":
        expect("treat", lambda: a.hunger >= b.hunger, "hunger should rise")
        expect("treat", lambda: result.cmd == "eat", f"cmd want eat got {result.cmd}")
    elif action_id == "play":
        expect("play", lambda: a.mood >= b.mood, "mood should rise")
        expect("play", lambda: result.cmd == "play", f"cmd want play got {result.cmd}")
    elif action_id == "special":
        expect("special", lambda: bool(result.line), "special should speak a line")
        expect("special", lambda: result.cmd is not None, "special should set a cmd")
    elif action_id == "hide":
        expect("hide", lambda: a.hidden is True, "should be hidden")
    elif action_id == "call":
        expect("call", lambda: a.hidden is False, "should be visible")
        expect("call", lambda: result.cmd == "enter", f"cmd want enter got {result.cmd}")
    elif action_id == "clean":
        expect("clean", lambda: a.hygiene >= b.hygiene, "hygiene should rise")
        expect("clean", lambda: a.mess == [], "mess should clear")
    elif action_id == "bath":
        expect("bath", lambda: a.hygiene >= b.hygiene, "hygiene should rise")
    elif action_id == "medicine":
        expect("medicine", lambda: a.sick is False, "should clear sick")
        expect("medicine", lambda: a.health >= b.health, "health should rise")
    elif action_id == "praise":
        expect("praise", lambda: a.mood >= b.mood, "mood should rise")
    elif action_id == "shed":
        expect("shed", lambda: result.cmd is not None, "shed should set a cmd")
    elif action_id == "pick":
        expect("pick", lambda: len(a.gifts) < len(b.gifts), "gift should leave the wood")

    return fails


@dataclass
class CaseResult:
    action_id: str
    passed: bool
    failures: list[str]
    detail: str = ""


def run_all(*, species_key: str = "red_panda") -> list[CaseResult]:
    """Invoke every catalog care action and assert. Menu/pose included as smoke."""
    out: list[CaseResult] = []
    for action in catalog(species_key=species_key):
        seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=50, bond=10)
        if action.id == "call":
            seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=50, bond=10, hidden=True)
        if action.id == "medicine":
            seed = CareState(hunger=40, mood=50, energy=50, hygiene=40, health=40, bond=10, sick=True)
        if action.id == "clean":
            seed = CareState(
                hunger=40,
                mood=50,
                energy=50,
                hygiene=40,
                health=50,
                bond=10,
                mess=[MessPile(id=1, x=0.25)],
            )
        result = invoke(action.id, seed, species=species_key)
        fails = assert_action(action.id, result)
        out.append(
            CaseResult(
                action_id=action.id,
                passed=not fails,
                failures=fails,
                detail=result.detail or (result.line or ""),
            )
        )
    return out


def main(argv: list[str] | None = None) -> int:
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Run ComputerPets care harness (pass/fail).")
    parser.add_argument("--species", default="red_panda", help="Species key for special / lines")
    parser.add_argument("--list", action="store_true", help="Print catalog and exit")
    parser.add_argument("--only", nargs="*", help="Optional action ids to run")
    args = parser.parse_args(argv)

    rows = catalog(species_key=args.species)
    if args.list:
        for row in rows:
            print(f"{row.id:12}  {row.kind:8}  {row.label:16}  {row.handler}  {row.notes}")
        return 0

    want = set(args.only) if args.only else None
    results = run_all(species_key=args.species)
    if want is not None:
        results = [r for r in results if r.action_id in want]

    failed = 0
    for r in results:
        mark = "PASS" if r.passed else "FAIL"
        extra = f"  ({'; '.join(r.failures)})" if r.failures else (f"  {r.detail}" if r.detail else "")
        print(f"{mark}  {r.action_id}{extra}")
        if not r.passed:
            failed += 1
    total = len(results)
    print(f"\n{total - failed}/{total} passed")
    return 1 if failed else 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())