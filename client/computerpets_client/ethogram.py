"""Species-true idle acts — same map as web ``ethogram.ts`` and Electron ``ethogram.js``."""

from __future__ import annotations

import math
import random
from typing import TypedDict

from .species import SNAKE_KEYS


class IdleAct(TypedDict, total=False):
    name: str
    motion: str
    hold: float
    weight: float
    anim: str


def _a(name: str, motion: str, hold: float, weight: float, anim: str | None = None) -> IdleAct:
    act: IdleAct = {"name": name, "motion": motion, "hold": hold, "weight": weight}
    if anim:
        act["anim"] = anim
    return act


_PREEN: tuple[IdleAct, ...] = (
    _a("preen", "groom", 1.4, 3, "sit"),
    _a("hop_step", "hop", 0.5, 2, "play"),
    _a("wings", "pulse", 0.7, 1, "play"),
)

ETHOGRAM: dict[str, tuple[IdleAct, ...]] = {
    "dog": (_a("scratch", "scratch", 1.2, 3, "sit"), _a("shake", "shake", 0.7, 2), _a("yawn", "yawn", 1.1, 2), _a("circle_sit", "circle", 1.6, 2, "sit")),
    "cat": (_a("groom", "groom", 1.6, 3, "sit"), _a("scratch", "scratch", 1.1, 2, "sit"), _a("yawn", "yawn", 1.2, 2), _a("stretch", "stretch", 1.4, 2, "sit"), _a("claim", "sit_hold", 2.2, 1, "sit")),
    "fox": (_a("stretch", "stretch", 1.3, 2, "sit"), _a("yawn", "yawn", 1.1, 2), _a("pounce", "hop", 0.7, 2, "play")),
    "red_panda": (_a("groom", "groom", 1.5, 3, "sit"), _a("scratch", "scratch", 1.1, 2, "sit"), _a("steal_dart", "dart", 1.2, 2), _a("wash", "groom", 1.3, 2, "sit")),
    "rabbit": (_a("face_wash", "groom", 1.2, 3, "sit"), _a("freeze", "freeze", 1.4, 2), _a("flop", "sit_hold", 2.4, 2, "sit"), _a("binky", "hop", 0.6, 1, "play")),
    "hamster": (_a("nibble", "eat", 1.1, 3, "eat"), _a("groom", "groom", 1.2, 2, "sit"), _a("freeze", "freeze", 1.0, 2), _a("burst", "dart", 0.9, 2)),
    "guinea_pig": (_a("wheek", "talk", 0.8, 1, "talk"), _a("popcorn", "hop", 0.45, 2, "play"), _a("freeze", "freeze", 1.2, 2), _a("groom", "groom", 1.3, 3, "sit")),
    "ferret": (_a("warble", "hop", 0.7, 3, "play"), _a("tunnel", "sit_hold", 1.4, 2, "sit"), _a("dook", "talk", 0.7, 1, "talk")),
    "hedgehog": (_a("snuffle", "wiggle", 1.0, 3), _a("curl", "sit_hold", 1.8, 2, "sit"), _a("unroll", "stretch", 1.2, 2)),
    "chinchilla": (_a("dust_shake", "shake", 0.9, 3, "sit"), _a("hop", "hop", 0.55, 2, "play"), _a("groom", "groom", 1.2, 2, "sit")),
    "turtle": (_a("bask", "sit_hold", 3.2, 3, "sit"), _a("blink", "freeze", 1.6, 2)),
    "iguana": (_a("bask", "sit_hold", 3.0, 3, "sit"), _a("head_bob", "bob", 1.4, 2), _a("still", "freeze", 2.0, 2)),
    "dragon": (_a("watch", "sit_hold", 2.4, 3, "sit"), _a("huff", "pulse", 0.8, 2), _a("bask", "sit_hold", 2.8, 2, "sit")),
    "axolotl": (_a("gill", "bob", 1.4, 3), _a("still", "freeze", 2.0, 2), _a("gulp", "gulp", 0.7, 1)),
    "budgie": _PREEN,
    "parrot": _PREEN,
    "toucan": _PREEN,
    "phoenix": _PREEN,
    "penguin": (_a("preen", "groom", 1.4, 3, "sit"), _a("nod", "nod", 0.7, 2, "sit"), _a("huddle", "sit_hold", 2.0, 2, "sit")),
    "goldfish": (_a("gulp", "gulp", 0.6, 2), _a("flare", "pulse", 0.7, 2)),
    "ball_python": (_a("tongue", "tongue", 0.7, 4), _a("coil", "sit_hold", 2.8, 3, "sit"), _a("hide_head", "sit_hold", 1.6, 2, "sit"), _a("gape", "gape", 1.2, 1)),
    "corn_snake": (_a("tongue", "tongue", 0.7, 4), _a("explore", "freeze", 1.2, 2), _a("slither", "dart", 1.0, 2)),
    "kingsnake": (_a("tongue", "tongue", 0.7, 4), _a("inspect", "freeze", 1.4, 3), _a("still", "sit_hold", 1.8, 2, "sit")),
    "green_tree_python": (_a("tongue", "tongue", 0.7, 4), _a("drape", "sit_hold", 2.6, 3, "sit")),
    "hognose": (_a("tongue", "tongue", 0.7, 4), _a("flatten", "sit_hold", 1.4, 2, "sit"), _a("playdead", "sit_hold", 1.8, 1, "sit"), _a("gape", "gape", 1.1, 1)),
    "garter": (_a("tongue", "tongue", 0.7, 4), _a("patrol", "wiggle", 0.8, 2), _a("dart", "dart", 0.9, 2)),
    "boa": (_a("tongue", "tongue", 0.7, 3), _a("hold", "sit_hold", 3.0, 3, "sit")),
    "milk_snake": (_a("tongue", "tongue", 0.7, 4), _a("mimic", "freeze", 1.6, 2)),
    "rosy_boa": (_a("tongue", "tongue", 0.7, 3), _a("nest", "sit_hold", 2.6, 3, "sit")),
    "carpet_python": (_a("tongue", "tongue", 0.7, 4), _a("drape", "sit_hold", 2.2, 3, "sit")),
    "octopus": (_a("hide", "sit_hold", 2.0, 3, "sit"), _a("jet", "dart", 0.8, 2), _a("taste", "wiggle", 1.0, 2)),
    "cuttlefish": (_a("flush", "pulse", 0.9, 3), _a("hover", "bob", 1.4, 2)),
    "nautilus": (_a("rise", "bob", 1.6, 3), _a("still", "freeze", 2.0, 2)),
    "moon_jelly": (_a("pulse", "pulse", 1.2, 4), _a("drift", "bob", 1.6, 2)),
    "sea_star": (_a("cling", "sit_hold", 2.8, 4, "sit"), _a("still", "freeze", 2.2, 2)),
    "hermit_crab": (_a("inspect", "freeze", 1.2, 3), _a("shuffle", "wiggle", 0.9, 2)),
    "horseshoe_crab": (_a("plow", "wiggle", 1.0, 2), _a("still", "freeze", 2.0, 3)),
    "seahorse": (_a("hitch", "sit_hold", 2.4, 3, "sit"), _a("hover", "bob", 1.4, 2)),
    "manta": (_a("soar", "pulse", 1.4, 3), _a("glide", "bob", 1.8, 2)),
    "moray": (_a("gape", "gape", 1.2, 3), _a("hide", "sit_hold", 2.2, 3, "sit"), _a("dart", "dart", 0.8, 2)),
    "moss": (_a("lean", "lean", 1.8, 3), _a("nod", "nod", 1.0, 2, "sit"), _a("still", "freeze", 2.4, 2)),
    "maidenhair": (_a("unfurl", "unfurl", 1.8, 4, "sit"), _a("lean", "lean", 1.4, 2), _a("nod", "nod", 0.9, 1, "sit")),
    "ginkgo": (_a("lean", "lean", 1.6, 3), _a("nod", "nod", 1.0, 2, "sit"), _a("still", "freeze", 2.0, 2)),
    "oak": (_a("lean", "lean", 1.6, 3), _a("nod", "nod", 1.1, 2, "sit"), _a("still", "freeze", 2.2, 2)),
    "water_lily": (_a("open", "open", 1.8, 4, "sit"), _a("nod", "nod", 1.0, 2, "sit"), _a("lean", "lean", 1.2, 1)),
    "orchid": (_a("unfurl", "unfurl", 1.6, 2, "sit"), _a("lean", "lean", 1.4, 3), _a("nod", "nod", 0.9, 2, "sit")),
    "saguaro": (_a("still", "freeze", 2.8, 4), _a("lean", "lean", 1.6, 2), _a("nod", "nod", 1.2, 1, "sit")),
    "venus_flytrap": (_a("snap", "snap", 0.7, 2, "play"), _a("lean", "lean", 1.4, 3), _a("nod", "nod", 1.0, 2, "sit")),
    "pitcher": (_a("still", "freeze", 3.2, 5), _a("lean", "lean", 1.6, 2), _a("nod", "nod", 1.0, 1, "sit")),
    "sundew": (_a("curl", "curl", 2.0, 4, "sit"), _a("lean", "lean", 1.4, 2), _a("nod", "nod", 0.9, 1, "sit")),
    "honeybee": (_a("waggle", "waggle", 1.2, 4), _a("dart", "dart", 0.8, 2), _a("still", "freeze", 1.4, 1)),
    "monarch": (_a("flutter", "pulse", 1.0, 3), _a("migrate", "dart", 1.2, 2), _a("still", "freeze", 1.8, 2)),
    "luna": (_a("still", "freeze", 2.6, 5), _a("drift", "bob", 1.6, 2), _a("refuse", "freeze", 1.8, 1)),
    "firefly": (_a("flash", "flash", 0.8, 4), _a("lift", "hop", 0.55, 2, "play"), _a("still", "freeze", 1.6, 2)),
    "darner": (_a("hawk", "dart", 0.9, 4), _a("hover", "bob", 1.4, 2), _a("still", "freeze", 1.2, 1)),
    "stick": (_a("freeze", "freeze", 3.0, 6), _a("still", "sit_hold", 2.4, 2, "sit"), _a("walk", "wiggle", 0.8, 1)),
    "carpenter_ant": (_a("trail", "trail", 1.0, 4), _a("dart", "dart", 0.8, 2), _a("still", "freeze", 1.2, 1)),
    "ladybird": (_a("count", "nod", 1.0, 3, "sit"), _a("hunt", "dart", 0.8, 2), _a("still", "freeze", 1.6, 2)),
    "mantis": (_a("fold", "fold", 2.0, 4, "sit"), _a("strike", "snap", 0.6, 1, "play"), _a("still", "freeze", 2.0, 2)),
    "cicada": (_a("still", "sit_hold", 2.8, 5, "sit"), _a("emerge", "emerge", 1.8, 1, "sit"), _a("burst", "dart", 0.7, 2)),
    "bumblebee": (_a("thrum", "pulse", 1.2, 4), _a("hover", "bob", 1.4, 2), _a("still", "freeze", 1.6, 1)),
    "carpenter_bee": (_a("hover", "bob", 1.4, 3), _a("bore", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "mason_bee": (_a("seal", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "leafcutter": (_a("cut", "nod", 1.2, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "stingless": (_a("pot", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.4, 2)),
    "sweat_bee": (_a("shine", "pulse", 1.0, 4), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.4, 2)),
    "mining_bee": (_a("dig", "sit_hold", 1.8, 4, "sit"), _a("hover", "bob", 1.2, 2), _a("still", "freeze", 1.6, 2)),
    "honey_drone": (_a("hum", "pulse", 1.4, 4), _a("hover", "bob", 1.6, 2), _a("still", "freeze", 2.0, 3)),
    "honey_queen": (_a("lay", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 1), _a("still", "freeze", 2.0, 2)),
    "honeycomb": (_a("hold", "sit_hold", 2.8, 5, "sit"), _a("brood", "freeze", 2.4, 3, "sit"), _a("still", "freeze", 2.6, 3)),
    "oyster": (_a("lean", "lean", 1.8, 4), _a("flush", "flush", 1.2, 2), _a("still", "freeze", 2.2, 2)),
    "fly_agaric": (_a("lean", "lean", 1.6, 3), _a("flush", "flush", 1.4, 3), _a("still", "freeze", 2.0, 2)),
    "morel": (_a("lean", "lean", 1.6, 3), _a("still", "sit_hold", 2.4, 3, "sit"), _a("still_hold", "freeze", 2.0, 2)),
    "chanterelle": (_a("lean", "lean", 1.6, 3), _a("flush", "flush", 1.2, 2), _a("still", "freeze", 2.0, 2)),
    "turkey_tail": (_a("lean", "lean", 1.6, 3), _a("still", "freeze", 2.4, 3), _a("zone", "lean", 1.4, 2)),
    "lions_mane": (_a("lean", "lean", 1.6, 3), _a("still", "freeze", 2.2, 3), _a("beard", "sit_hold", 2.0, 2, "sit")),
    "puffball": (_a("puff", "puff", 0.8, 4, "play"), _a("still", "freeze", 2.0, 3), _a("lean", "lean", 1.4, 1)),
    "chicken_of_woods": (_a("lean", "lean", 1.6, 3), _a("flush", "flush", 1.2, 2), _a("still", "freeze", 2.2, 2)),
    "yeast": (_a("rise", "rise", 1.6, 5), _a("still", "freeze", 2.0, 2), _a("foam", "bob", 1.2, 1)),
    "lichen": (_a("share-still", "share", 2.8, 5, "sit"), _a("still", "freeze", 2.4, 3), _a("lean", "lean", 1.4, 1)),
    "photovore": (_a("drink-light", "drink", 1.4, 5), _a("still", "freeze", 1.8, 2), _a("hover", "bob", 1.2, 1)),
    "choir": (_a("chord-pulse", "chord", 1.6, 5), _a("still", "freeze", 2.0, 2), _a("overtone", "pulse", 1.2, 1)),
    "nimbus": (_a("float", "float", 1.8, 5), _a("still", "freeze", 2.0, 2), _a("hover", "bob", 1.4, 1)),
    "silica": (_a("facet", "facet", 2.2, 5, "sit"), _a("still", "freeze", 2.4, 3), _a("shed", "freeze", 1.6, 1)),
    "terminator": (_a("edge-walk", "edge", 1.4, 5), _a("still", "freeze", 1.8, 2), _a("rim", "trail", 1.0, 1)),
    "nexus": (_a("count-ripple", "ripple", 1.6, 5), _a("still", "freeze", 2.0, 2), _a("name", "pulse", 1.2, 1)),
    "halovore": (_a("frost", "frost", 1.8, 5, "sit"), _a("still", "freeze", 2.2, 3), _a("waste", "freeze", 1.4, 1)),
    "magneton": (_a("align", "align", 1.2, 5), _a("still", "freeze", 1.6, 2), _a("north", "stretch", 1.0, 1)),
    "umbral": (_a("dim", "dim", 2.4, 5, "sit"), _a("still", "freeze", 2.6, 3), _a("cool", "share", 1.8, 1)),
    "cyst": (_a("wake", "wake", 1.8, 4, "sit"), _a("wait", "sit_hold", 3.2, 5, "sit"), _a("still", "freeze", 2.8, 3)),
}

TONGUE_KEYS = SNAKE_KEYS
SCRATCH_KEYS = ("dog", "cat", "red_panda")


def acts_for(key: str | None) -> tuple[IdleAct, ...]:
    if not key:
        return ()
    return ETHOGRAM.get(key, ())


def pick_act(key: str | None) -> IdleAct | None:
    acts = acts_for(key)
    if not acts:
        return None
    roll = random.random() * sum(a["weight"] for a in acts)
    for act in acts:
        roll -= act["weight"]
        if roll <= 0:
            return act
    return acts[-1]


def next_act_wait(wander: float, nocturnal: bool = False, night: bool = False) -> float:
    wait = 20.0 - max(0.0, min(1.0, wander)) * 12.0
    if wander < 0.18:
        wait += 8.0
    if nocturnal and night:
        wait *= 0.7
    if nocturnal and not night:
        wait *= 1.22
    return max(8.0, wait) * (0.85 + random.random() * 0.35)


def after_settle_wait(wander: float) -> float:
    late = wander < 0.18
    return (6.0 if late else 3.0) + random.random() * (5.0 if late else 4.0)


def tongue_flick(t: float, hold: float) -> float:
    if t < 0 or t > hold:
        return 0.0
    cycle = 0.22
    n = math.floor(t / cycle)
    if n >= 3:
        return 0.0
    u = (t % cycle) / cycle
    return 1.0 - u / 0.55 if u < 0.55 else 0.0


def act_pose(motion: str | None, t: float, hold: float) -> dict[str, float]:
    u = max(0.0, min(1.0, t / hold)) if hold > 0 else 1.0
    pose = {"dx": 0.0, "dy": 0.0, "rot": 0.0, "stretch": 1.0, "squat": 1.0}
    if motion == "scratch":
        pose["dx"] = math.sin(t * 28) * 2.2
        pose["rot"] = math.sin(t * 28) * 3.2
    elif motion == "shake":
        pose["dx"] = math.sin(t * 40) * 3.4
    elif motion == "yawn":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "groom":
        pose["dy"] = math.sin(t * 10) * 3.0
        pose["stretch"] = 1.0 + math.sin(t * 10) * 0.02
    elif motion == "stretch":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["squat"] = 1.0 - math.sin(u * math.pi) * 0.05
    elif motion == "wiggle":
        pose["dx"] = math.sin(t * 16) * 2.0
    elif motion == "bob":
        pose["dy"] = math.sin(t * 8) * 4.0
    elif motion == "pulse":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.05
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "gape":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "gulp":
        pose["dy"] = math.sin(u * math.pi) * 5.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.04
    elif motion == "nod":
        pose["dy"] = -math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.04
    elif motion == "lean":
        pose["rot"] = math.sin(u * math.pi) * 8.0
        pose["dx"] = math.sin(u * math.pi) * 4.0
    elif motion == "unfurl":
        pose["stretch"] = 0.88 + math.sin(u * math.pi) * 0.16
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "snap":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.12
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 3.0
    elif motion == "open":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "curl":
        pose["rot"] = math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "waggle":
        pose["dx"] = math.sin(t * 22) * 3.2
        pose["rot"] = math.sin(t * 22) * 10.0
    elif motion == "flash":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 5.0
    elif motion == "fold":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 2.0
    elif motion == "trail":
        pose["dx"] = math.sin(t * 14) * 2.4
        pose["dy"] = math.sin(t * 28) * 1.2
    elif motion == "emerge":
        pose["stretch"] = 0.9 + math.sin(u * math.pi) * 0.18
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 4.0
    elif motion == "puff":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.14
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 6.0
    elif motion == "flush":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 2) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["rot"] = math.sin(u * math.pi) * 3.0
    elif motion == "rise":
        pose["dy"] = -math.sin(u * math.pi) * 8.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.08
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "share":
        pose["dx"] = math.sin(u * math.pi) * 1.2
        pose["rot"] = math.sin(u * math.pi) * 2.0
    elif motion == "drink":
        pose["dy"] = -math.sin(u * math.pi) * 6.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.07
        pose["squat"] = 2.0 - pose["stretch"]
    elif motion == "chord":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 3) * 0.06
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dx"] = math.sin(t * 10) * 1.4
    elif motion == "float":
        pose["dy"] = math.sin(t * 6) * 5.0
        pose["dx"] = math.sin(t * 3) * 2.0
    elif motion == "facet":
        pose["rot"] = math.sin(u * math.pi) * 4.0
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.05
    elif motion == "edge":
        pose["dx"] = math.sin(t * 12) * 3.2
        pose["dy"] = math.sin(t * 24) * 0.8
    elif motion == "ripple":
        pose["stretch"] = 1.0 + math.sin(u * math.pi * 3) * 0.05
        pose["dx"] = math.sin(u * math.pi * 2) * 2.4
    elif motion == "frost":
        pose["stretch"] = 1.0 - math.sin(u * math.pi) * 0.04
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = math.sin(u * math.pi) * 2.0
    elif motion == "align":
        pose["stretch"] = 1.0 + math.sin(u * math.pi) * 0.1
        pose["dx"] = math.sin(u * math.pi) * 6.0
    elif motion == "dim":
        pose["dy"] = math.sin(u * math.pi) * 2.0
        pose["rot"] = math.sin(u * math.pi) * 2.0
    elif motion == "wake":
        pose["stretch"] = 0.88 + math.sin(u * math.pi) * 0.2
        pose["squat"] = 2.0 - pose["stretch"]
        pose["dy"] = -math.sin(u * math.pi) * 5.0
    return pose
