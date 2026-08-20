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
    "frog": (_a("hop", "hop", 0.55, 4, "play"), _a("croak", "talk", 0.8, 3, "talk"), _a("still", "freeze", 1.6, 2)),
    "toad": (_a("hop", "hop", 0.5, 3, "play"), _a("puff", "puff", 1.2, 4, "sit"), _a("still", "freeze", 1.8, 2)),
    "newt": (_a("walk", "wiggle", 1.0, 4), _a("still", "freeze", 1.6, 2), _a("dart", "dart", 0.8, 2)),
    "salamander": (_a("hide", "sit_hold", 2.2, 5, "sit"), _a("still", "freeze", 2.0, 3), _a("walk", "wiggle", 0.9, 1)),
    "caecilian": (_a("slip", "wiggle", 1.2, 5), _a("ring", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "crayfish": (_a("pinch", "snap", 0.7, 4, "play"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "pond_snail": (_a("rasp", "nod", 1.4, 5, "sit"), _a("still", "sit_hold", 2.4, 3, "sit"), _a("lean", "lean", 1.2, 1)),
    "mussel": (_a("siphon", "open", 1.8, 5, "sit"), _a("still", "sit_hold", 2.8, 4, "sit"), _a("filter", "freeze", 2.2, 2)),
    "leech": (_a("latch", "sit_hold", 1.8, 4, "sit"), _a("swim", "wiggle", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "stickleback": (_a("flare", "pulse", 1.0, 4), _a("dart", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "paramecium": (_a("cilia", "wiggle", 1.0, 5), _a("row", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "amoeba": (_a("reach", "stretch", 1.6, 5, "sit"), _a("foot", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "euglena": (_a("spot", "bob", 1.2, 4), _a("drink", "drink", 1.4, 3), _a("still", "freeze", 1.6, 2)),
    "volvox": (_a("roll", "pulse", 1.4, 5), _a("daughters", "ripple", 1.6, 2), _a("still", "freeze", 1.8, 2)),
    "diatom": (_a("glide", "sit_hold", 2.0, 4, "sit"), _a("pane", "facet", 1.8, 3, "sit"), _a("still", "freeze", 2.2, 2)),
    "kelp": (_a("sway", "lean", 1.8, 5), _a("holdfast", "sit_hold", 2.6, 3, "sit"), _a("still", "freeze", 2.4, 2)),
    "chlamydomonas": (_a("spin", "pulse", 1.0, 5), _a("oar", "dart", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "stentor": (_a("trumpet", "open", 1.6, 5, "sit"), _a("contract", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "coli": (_a("tumble", "dart", 0.7, 5), _a("run", "wiggle", 0.9, 3), _a("still", "freeze", 1.2, 2)),
    "haloarchaea": (_a("blush", "frost", 1.8, 5, "sit"), _a("still", "freeze", 2.2, 3), _a("pink", "flush", 1.4, 1)),
    "crow": (_a("caw", "talk", 0.8, 4, "talk"), _a("hop_step", "hop", 0.5, 3, "play"), _a("preen", "groom", 1.4, 2, "sit")),
    "raven": (_a("kronk", "talk", 0.9, 4, "talk"), _a("hop_step", "hop", 0.55, 3, "play"), _a("preen", "groom", 1.4, 2, "sit")),
    "barn_owl": (_a("hiss", "talk", 0.8, 3, "talk"), _a("swivel", "nod", 1.2, 3, "sit"), _a("preen", "groom", 1.6, 2, "sit")),
    "red_tail": (_a("soar", "pulse", 1.4, 4), _a("stoop", "dart", 0.8, 3), _a("still", "freeze", 1.6, 2)),
    "chickadee": (_a("dee", "talk", 0.7, 4, "talk"), _a("hop_step", "hop", 0.45, 3, "play"), _a("preen", "groom", 1.2, 2, "sit")),
    "robin": (_a("hop", "hop", 0.5, 4, "play"), _a("pull", "nod", 1.0, 3, "sit"), _a("preen", "groom", 1.3, 2, "sit")),
    "mallard": (_a("dabble", "eat", 1.2, 4, "eat"), _a("waddle", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "canada_goose": (_a("honk", "talk", 0.8, 4, "talk"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "pileated": (_a("drum", "snap", 0.7, 4, "play"), _a("hop_step", "hop", 0.5, 3, "play"), _a("preen", "groom", 1.4, 2, "sit")),
    "hummingbird": (_a("hover", "bob", 1.2, 5), _a("dart", "dart", 0.7, 3), _a("sip", "eat", 0.8, 2, "eat")),
    "orb_weaver": (_a("sit_web", "sit_hold", 2.4, 5, "sit"), _a("still", "freeze", 2.0, 3), _a("wrap", "nod", 1.2, 1)),
    "jumping_spider": (_a("leap", "hop", 0.5, 5, "play"), _a("look", "nod", 1.0, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "wolf_spider": (_a("prowl", "wiggle", 1.0, 4), _a("carry", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "tarantula": (_a("flick", "snap", 0.8, 3, "play"), _a("walk", "wiggle", 1.2, 3), _a("still", "sit_hold", 2.2, 3, "sit")),
    "widow": (_a("hang", "sit_hold", 2.4, 5, "sit"), _a("still", "freeze", 2.2, 3), _a("hour", "nod", 1.4, 1)),
    "harvestman": (_a("walk", "wiggle", 1.0, 5), _a("stem", "nod", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "scorpion": (_a("sting", "snap", 0.7, 3, "play"), _a("walk", "wiggle", 1.0, 4), _a("still", "freeze", 1.8, 2)),
    "vinegaroon": (_a("whip", "snap", 0.8, 3, "play"), _a("walk", "wiggle", 1.0, 4), _a("still", "freeze", 1.8, 2)),
    "tick": (_a("clasp", "sit_hold", 2.6, 5, "sit"), _a("still", "freeze", 2.4, 3), _a("wait", "nod", 1.8, 1)),
    "solifuge": (_a("run", "dart", 0.6, 5), _a("bite", "snap", 0.7, 3, "play"), _a("still", "freeze", 1.4, 2)),
    "deer": (_a("flag", "pulse", 0.8, 4), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "bat": (_a("hang", "sit_hold", 2.2, 5, "sit"), _a("flutter", "pulse", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "squirrel": (_a("bury", "nod", 1.2, 4, "sit"), _a("hop", "hop", 0.5, 3, "play"), _a("chatter", "talk", 0.7, 2, "talk")),
    "otter": (_a("slide", "wiggle", 1.2, 5), _a("swim", "bob", 1.4, 3), _a("groom", "groom", 1.2, 2, "sit")),
    "raccoon": (_a("rinse", "groom", 1.4, 5, "sit"), _a("rummage", "nod", 1.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "skunk": (_a("stamp", "nod", 0.8, 4, "sit"), _a("raise", "pulse", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "opossum": (_a("playdead", "sit_hold", 2.2, 5, "sit"), _a("grin", "gape", 1.0, 2), _a("walk", "wiggle", 1.0, 2)),
    "beaver": (_a("gnaw", "eat", 1.4, 5, "eat"), _a("slap", "snap", 0.7, 2, "play"), _a("sit", "sit_hold", 2.0, 3, "sit")),
    "porcupine": (_a("bristle", "puff", 1.4, 5, "sit"), _a("climb", "wiggle", 1.0, 2), _a("still", "freeze", 2.0, 3)),
    "black_bear": (_a("forage", "eat", 1.4, 4, "eat"), _a("sit", "sit_hold", 2.2, 4, "sit"), _a("huff", "pulse", 0.8, 2)),
    "gecko": (_a("climb", "wiggle", 1.0, 5), _a("chirp", "talk", 0.7, 3, "talk"), _a("cling", "sit_hold", 2.0, 2, "sit")),
    "anole": (_a("flash", "pulse", 0.8, 5), _a("brown", "nod", 1.2, 2, "sit"), _a("still", "freeze", 1.6, 2)),
    "skink": (_a("dash", "dart", 0.5, 5), _a("tail", "pulse", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "chameleon": (_a("aim", "nod", 1.6, 5, "sit"), _a("walk", "wiggle", 1.8, 3), _a("catch", "snap", 0.6, 2, "play")),
    "horned_lizard": (_a("crown", "sit_hold", 2.2, 5, "sit"), _a("squirt", "pulse", 0.8, 2), _a("still", "freeze", 2.0, 3)),
    "alligator": (_a("bask", "sit_hold", 2.4, 5, "sit"), _a("bank", "freeze", 2.0, 3), _a("close", "nod", 1.2, 2)),
    "crocodile": (_a("show", "gape", 1.2, 5), _a("sit", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "snapper": (_a("snap", "snap", 0.6, 5, "play"), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "box_turtle": (_a("shut", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "tuatara": (_a("still", "freeze", 2.6, 5), _a("crest", "sit_hold", 2.2, 3, "sit"), _a("watch", "nod", 1.6, 2)),
    "bass": (_a("lunge", "dart", 0.6, 5), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("gape", "gape", 0.8, 2)),
    "brook_trout": (_a("dart", "dart", 0.5, 5), _a("rise", "bob", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "catfish": (_a("whisk", "wiggle", 1.2, 5), _a("sit", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "bluegill": (_a("flare", "pulse", 0.8, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("dart", "dart", 0.6, 2)),
    "perch": (_a("bar", "pulse", 0.8, 4), _a("dart", "dart", 0.6, 4), _a("still", "freeze", 1.6, 2)),
    "pike": (_a("wait", "sit_hold", 2.4, 5, "sit"), _a("lance", "dart", 0.5, 3), _a("still", "freeze", 2.0, 2)),
    "walleye": (_a("hunt", "dart", 0.8, 5), _a("glow", "pulse", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "paddlefish": (_a("filter", "sit_hold", 2.4, 5, "sit"), _a("paddle", "bob", 1.6, 3), _a("still", "freeze", 2.0, 2)),
    "lamprey": (_a("disk", "sit_hold", 2.2, 5, "sit"), _a("cling", "freeze", 2.0, 3), _a("still", "freeze", 1.8, 2)),
    "american_eel": (_a("swim", "wiggle", 1.4, 5), _a("silver", "pulse", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "house_centipede": (_a("hunt", "dart", 0.5, 5), _a("walk", "wiggle", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "millipede": (_a("walk", "wiggle", 1.6, 5), _a("oil", "puff", 1.2, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "pillbug": (_a("roll", "sit_hold", 2.2, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "earthworm": (_a("cast", "nod", 1.4, 5, "sit"), _a("crawl", "wiggle", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "velvet_worm": (_a("jet", "snap", 0.7, 4, "play"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "springtail": (_a("hop", "hop", 0.5, 5, "play"), _a("still", "freeze", 1.4, 3), _a("walk", "wiggle", 0.8, 2)),
    "tardigrade": (_a("tun", "sit_hold", 2.4, 5, "sit"), _a("walk", "wiggle", 1.2, 3), _a("still", "freeze", 2.0, 2)),
    "planarian": (_a("split", "pulse", 1.2, 5), _a("glide", "wiggle", 1.4, 3), _a("still", "freeze", 1.8, 2)),
    "nematode": (_a("thrash", "wiggle", 1.0, 5), _a("still", "freeze", 1.6, 3), _a("sit", "sit_hold", 1.8, 2, "sit")),
    "amphipod": (_a("scud", "wiggle", 1.2, 5), _a("dart", "dart", 0.6, 3), _a("still", "freeze", 1.6, 2)),
    "fiddler_crab": (_a("wave", "pulse", 0.8, 5), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "ghost_crab": (_a("run", "dart", 0.5, 5), _a("walk", "wiggle", 0.8, 3), _a("still", "freeze", 1.4, 2)),
    "limpet": (_a("clamp", "sit_hold", 2.4, 5, "sit"), _a("rasp", "nod", 1.2, 3), _a("still", "freeze", 2.0, 2)),
    "barnacle": (_a("kick", "pulse", 1.0, 5), _a("still", "freeze", 2.2, 4), _a("sit", "sit_hold", 2.0, 2, "sit")),
    "chiton": (_a("graze", "wiggle", 1.2, 5), _a("plate", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "periwinkle": (_a("rasp", "nod", 1.4, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "sand_dollar": (_a("bury", "sit_hold", 2.2, 5, "sit"), _a("flat", "freeze", 2.0, 3), _a("still", "freeze", 1.8, 2)),
    "sea_urchin": (_a("walk", "wiggle", 1.2, 5), _a("spine", "pulse", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "knobbed_whelk": (_a("hunt", "wiggle", 1.2, 5), _a("sit", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "lugworm": (_a("heap", "nod", 1.4, 5, "sit"), _a("cast", "wiggle", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "field_cricket": (_a("chirp", "talk", 0.8, 5, "talk"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "katydid": (_a("still", "sit_hold", 2.4, 5, "sit"), _a("blade", "freeze", 2.0, 3), _a("walk", "wiggle", 0.9, 1)),
    "grasshopper": (_a("vault", "hop", 0.55, 5, "play"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "swallowtail": (_a("banner", "pulse", 1.0, 4), _a("flutter", "bob", 1.2, 3), _a("still", "freeze", 1.8, 2)),
    "jewelwing": (_a("jewel", "pulse", 1.2, 4), _a("hover", "bob", 1.4, 3), _a("still", "freeze", 1.6, 2)),
    "lacewing": (_a("lace", "pulse", 1.0, 4), _a("hover", "bob", 1.2, 3), _a("still", "freeze", 1.6, 2)),
    "earwig": (_a("raise", "sit_hold", 1.8, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "acorn_weevil": (_a("drill", "sit_hold", 2.0, 5, "sit"), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.8, 2)),
    "click_beetle": (_a("click", "pulse", 0.7, 5), _a("walk", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "robber_fly": (_a("hunt", "dart", 0.6, 5), _a("perch", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "sloth": (_a("hang", "sit_hold", 2.6, 5, "sit"), _a("reach", "stretch", 1.6, 3, "sit"), _a("still", "freeze", 2.2, 2)),
    "lemur": (_a("sun", "sit_hold", 2.2, 5, "sit"), _a("flag", "pulse", 0.8, 3), _a("walk", "wiggle", 1.0, 2)),
    "gibbon": (_a("swing", "pulse", 1.2, 5), _a("song", "talk", 0.8, 3, "talk"), _a("still", "freeze", 1.6, 2)),
    "kinkajou": (_a("wrap", "sit_hold", 2.0, 5, "sit"), _a("lick", "eat", 1.2, 3, "eat"), _a("still", "freeze", 1.6, 2)),
    "colugo": (_a("sail", "pulse", 1.4, 5), _a("cling", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "flying_squirrel": (_a("glide", "pulse", 1.2, 5), _a("hop", "hop", 0.5, 3, "play"), _a("still", "freeze", 1.6, 2)),
    "howler": (_a("boom", "talk", 0.9, 5, "talk"), _a("sit", "sit_hold", 2.2, 3, "sit"), _a("still", "freeze", 1.8, 2)),
    "tarsier": (_a("gaze", "nod", 1.4, 5, "sit"), _a("leap", "hop", 0.5, 3, "play"), _a("still", "freeze", 1.6, 2)),
    "potto": (_a("still", "freeze", 2.6, 5), _a("cling", "sit_hold", 2.2, 3, "sit"), _a("walk", "wiggle", 1.0, 1)),
    "koala": (_a("chew", "eat", 1.6, 5, "eat"), _a("cling", "sit_hold", 2.4, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "brain_coral": (_a("ridge", "sit_hold", 2.6, 5, "sit"), _a("polyp", "pulse", 1.4, 3), _a("still", "freeze", 2.2, 2)),
    "anemone": (_a("wreath", "pulse", 1.6, 5), _a("open", "open", 1.8, 3, "sit"), _a("still", "freeze", 2.0, 2)),
    "clownfish": (_a("dart", "dart", 0.6, 5), _a("nestle", "sit_hold", 1.8, 3, "sit"), _a("still", "freeze", 1.4, 2)),
    "parrotfish": (_a("scrape", "nod", 1.2, 5), _a("swim", "wiggle", 1.0, 3), _a("still", "freeze", 1.6, 2)),
    "cleaner_shrimp": (_a("wave", "pulse", 0.8, 5), _a("wait", "sit_hold", 2.0, 3, "sit"), _a("still", "freeze", 1.6, 2)),
    "sea_cucumber": (_a("crawl", "wiggle", 1.4, 5), _a("still", "sit_hold", 2.2, 3, "sit"), _a("freeze", "freeze", 1.8, 2)),
    "lionfish": (_a("veil", "pulse", 1.4, 5), _a("hover", "bob", 1.6, 3), _a("still", "freeze", 1.8, 2)),
    "giant_clam": (_a("open", "open", 1.8, 5, "sit"), _a("mantle", "sit_hold", 2.4, 4, "sit"), _a("still", "freeze", 2.2, 2)),
    "eagle_ray": (_a("soar", "pulse", 1.4, 5), _a("glide", "bob", 1.8, 3), _a("still", "freeze", 1.6, 2)),
    "grouper": (_a("hide", "sit_hold", 2.4, 5, "sit"), _a("gape", "gape", 1.0, 3), _a("still", "freeze", 1.8, 2)),
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
