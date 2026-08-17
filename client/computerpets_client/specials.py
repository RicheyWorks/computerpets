"""Species specials the living desk already knows.

Port of ``web/src/lib/pets/specials.ts`` plus the special / verb / line
from ``traits.ts``. Same fifty keys, same house copy. Do not invent a
new trick.
"""

from __future__ import annotations

from dataclasses import dataclass, replace

from .hours import hide_line
from .life import CareResult, CareState, clamp, pick_line
from .species import Species, species_by_key


@dataclass(frozen=True)
class SpeciesTrait:
    special: str
    verb: str
    line: str


# special / verb / line — same copy as web/src/lib/pets/traits.ts
TRAITS: dict[str, SpeciesTrait] = {
    "red_panda": SpeciesTrait("ribbon", "Steal ribbon", "I found a ribbon. It was not lost. It is now safer."),
    "cat": SpeciesTrait("sun", "Claim the sun", "This patch of light is reserved."),
    "dog": SpeciesTrait("follow", "Heel", "The cursor moved. I have prepared a walk."),
    "rabbit": SpeciesTrait("thump", "Thump", "Thump. That was a warning and a hello."),
    "hamster": SpeciesTrait("hoard", "Hoard", "This paperclip is now mine. Officially."),
    "guinea_pig": SpeciesTrait("wheek", "Wheek", "Wheek. Deploy celebrated."),
    "turtle": SpeciesTrait("still", "Be still", "I moved. You missed it. That is fine."),
    "goldfish": SpeciesTrait("loop", "Loop", "Around again. The view improved."),
    "budgie": SpeciesTrait("echo", "Echo", "Build failed. But musically."),
    "fox": SpeciesTrait("bug", "Find a bug", "There is a bug in the left pocket. You knew."),
    "penguin": SpeciesTrait("ritual", "Bow", "A bow. It is brief. It is required."),
    "parrot": SpeciesTrait("quote", "Quote", "Fix typo. A masterpiece."),
    "ferret": SpeciesTrait("steal", "Steal", "I put your dongle somewhere better."),
    "hedgehog": SpeciesTrait("curl", "Curl", "Waiting is a kindness I notice."),
    "chinchilla": SpeciesTrait("bath", "Dust bath", "That crumb is a scandal."),
    "axolotl": SpeciesTrait("regrow", "Regrow", "I grew a little more calm."),
    "toucan": SpeciesTrait("bill", "Inspect", "This perch has opinions about your posture."),
    "iguana": SpeciesTrait("bask", "Bask", "I blinked. Minutes will not record it."),
    "dragon": SpeciesTrait("hoard", "Keep watch", "I could be larger. I choose this."),
    "phoenix": SpeciesTrait("reborn", "Ember", "I came back softer."),
    "ball_python": SpeciesTrait("coil", "Coil", "I made a bun. I am the bun."),
    "corn_snake": SpeciesTrait("slither", "Thread", "I found a gap. I am the gap's problem."),
    "kingsnake": SpeciesTrait("inspect", "Inspect", "I am the law of this drawer."),
    "green_tree_python": SpeciesTrait("drape", "Drape", "I folded in half. That is sitting."),
    "hognose": SpeciesTrait("playdead", "Play dead", "I died. I got over it."),
    "garter": SpeciesTrait("patrol", "Patrol", "I do not lounge. I pause."),
    "boa": SpeciesTrait("hold", "Hold", "I could be tighter. I choose this."),
    "milk_snake": SpeciesTrait("mimic", "Mimic", "I am not who I look like. Hello."),
    "rosy_boa": SpeciesTrait("nest", "Nest", "I am a blush that learned to crawl."),
    "carpet_python": SpeciesTrait("chart", "Chart", "This pattern is a map. I am the country."),
    "octopus": SpeciesTrait("ink", "Ink", "I jet. Then I am a cup again."),
    "cuttlefish": SpeciesTrait("flush", "Flush", "I changed for you. Then I changed back."),
    "nautilus": SpeciesTrait("rise", "Rise", "I have been rising. You may wait."),
    "moon_jelly": SpeciesTrait("pulse", "Pulse", "I pulsed. That was hello."),
    "sea_star": SpeciesTrait("cling", "Cling", "I have not moved. That is hello."),
    "hermit_crab": SpeciesTrait("trade", "Trade", "This shell is temporary. Hello."),
    "horseshoe_crab": SpeciesTrait("molt", "Molt", "I am not a crab. Hello."),
    "seahorse": SpeciesTrait("hitch", "Hitch", "I hitched. You may look."),
    "manta": SpeciesTrait("soar", "Soar", "I saved you a length of sky."),
    "moray": SpeciesTrait("gape", "Gape", "The gape is air. Not a threat. Mostly."),
    "moss": SpeciesTrait("carpet", "Carpet", "I was already the page. Hello."),
    "maidenhair": SpeciesTrait("unfurl", "Unfurl", "I unfurled an inch. Hello."),
    "ginkgo": SpeciesTrait("gold", "Gold", "I have been gold before. Hello."),
    "oak": SpeciesTrait("drop", "Drop", "I agreed to be small."),
    "redwood": SpeciesTrait("rise", "Rise", "I rose an inch. You may look."),
    "water_lily": SpeciesTrait("open", "Open", "I opened. That was hello."),
    "duckweed": SpeciesTrait("divide", "Divide", "I divided. That was hello."),
    "venus_flytrap": SpeciesTrait("snap", "Snap", "I did not snap. That is hello."),
    "orchid": SpeciesTrait("bloom", "Bloom", "I bloomed. You may look."),
    "saguaro": SpeciesTrait("store", "Store", "I have not moved. That is hello."),
}

FALLBACK_TRAIT = TRAITS["red_panda"]

_PLAY = frozenset({"ribbon", "steal", "trade", "snap"})
_WANDER = frozenset({"thump", "loop", "slither", "patrol", "chart", "rise", "pulse", "soar", "drop", "divide"})
_TALK = frozenset({"wheek", "echo", "quote", "bug", "bill", "reborn", "mimic", "inspect", "flush", "gape", "bloom"})
_SIT = frozenset({"still", "bask", "curl", "sun", "hoard", "ritual", "coil", "drape", "hold", "nest", "ink", "cling", "hitch", "molt", "carpet", "unfurl", "gold", "open", "store"})


def trait_for(key: str) -> SpeciesTrait:
    return TRAITS.get(key, FALLBACK_TRAIT)


def apply_special(state: CareState, species: Species | None = None) -> CareResult:
    kind = species or species_by_key(None)
    trait = trait_for(kind.key)
    if state.hidden:
        return CareResult(state, hide_line(kind.key, pick_line(kind.hide)), "idle", "idle")

    next_state = replace(state, bond=clamp(state.bond + 2))
    special = trait.special
    cmd = "idle"

    if special in _PLAY:
        next_state = replace(next_state, mood=clamp(next_state.mood + 8))
        cmd = "play"
    elif special == "follow":
        next_state = replace(next_state, mood=clamp(next_state.mood + 4))
        cmd = "wander"
    elif special in _WANDER:
        cmd = "wander"
    elif special in _TALK:
        next_state = replace(next_state, mood=clamp(next_state.mood + 8))
        cmd = "talk"
    elif special in _SIT:
        next_state = replace(
            next_state,
            energy=clamp(next_state.energy + 6),
            mood=clamp(next_state.mood + 6),
        )
        cmd = "sit"
    elif special == "playdead":
        next_state = replace(next_state, energy=clamp(next_state.energy + 10))
        cmd = "sit"
    elif special == "bath":
        next_state = replace(
            next_state,
            hygiene=clamp(next_state.hygiene + 40),
            mood=clamp(next_state.mood + 12),
        )
        cmd = "sit"
    elif special == "regrow":
        next_state = replace(next_state, health=clamp(next_state.health + 12))
        cmd = "idle"

    anim = "walk" if cmd in ("play", "wander") else "sit" if cmd in ("talk", "sit") else "idle"
    next_state = replace(next_state, last_line=trait.line, anim=anim)
    return CareResult(next_state, trait.line, anim, cmd)
