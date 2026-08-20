"""Species specials the living desk already knows.

Port of ``web/src/lib/pets/specials.ts`` plus the special / verb / line
from ``traits.ts``. Same two hundred ten keys, same house copy. Do not invent a
new trick.
"""

from __future__ import annotations

from dataclasses import dataclass, replace

from .hours import hide_line
from .life import CareResult, CareState, clamp, keep_hive, pick_line
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
    "water_lily": SpeciesTrait("open", "Open", "I opened. That was hello."),
    "orchid": SpeciesTrait("bloom", "Bloom", "I bloomed. You may look."),
    "saguaro": SpeciesTrait("store", "Store", "I have not moved. That is hello."),
    "venus_flytrap": SpeciesTrait("snap", "Snap", "I did not snap. That is hello."),
    "pitcher": SpeciesTrait("drown", "Drown", "I did not chase. The well was enough."),
    "sundew": SpeciesTrait("glue", "Glue", "I glittered. That was hello."),
    "honeybee": SpeciesTrait("waggle", "Waggle", "I danced. That was hello."),
    "monarch": SpeciesTrait("migrate", "Migrate", "I kept the orange. Hello."),
    "luna": SpeciesTrait("still", "Moon", "I arrived without a mouth. Hello."),
    "firefly": SpeciesTrait("flash", "Flash", "I flashed. That was hello."),
    "darner": SpeciesTrait("hawk", "Hawk", "I hawed the lamp. Hello."),
    "stick": SpeciesTrait("freeze", "Freeze", "I have not moved. That is hello."),
    "carpenter_ant": SpeciesTrait("trail", "Trail", "I laid a road. Hello."),
    "ladybird": SpeciesTrait("count", "Count", "I counted. Hello."),
    "mantis": SpeciesTrait("fold", "Fold", "I did not strike. That is hello."),
    "cicada": SpeciesTrait("emerge", "Emerge", "I emerged. You may wait."),
    "bumblebee": SpeciesTrait("thrum", "Thrum", "I thrummed. That was hello."),
    "carpenter_bee": SpeciesTrait("bore", "Bore", "I bored. Hello."),
    "mason_bee": SpeciesTrait("seal", "Seal", "I sealed a cell. Hello."),
    "leafcutter": SpeciesTrait("cut", "Cut", "I cut a circle. Hello."),
    "stingless": SpeciesTrait("pot", "Pot", "I filled a pot. Hello."),
    "sweat_bee": SpeciesTrait("shine", "Shine", "I shone. Hello."),
    "mining_bee": SpeciesTrait("dig", "Dig", "I dug. Hello."),
    "honey_drone": SpeciesTrait("hum", "Hum", "I hummed. That was hello."),
    "honey_queen": SpeciesTrait("lay", "Lay", "I stayed. That was hello."),
    "honeycomb": SpeciesTrait("hold", "Hold", "I sat. That was hello."),
    "oyster": SpeciesTrait("fruit", "Fruit", "I fruited. That was hello."),
    "fly_agaric": SpeciesTrait("warn", "Warn", "I am a warning. Hello."),
    "morel": SpeciesTrait("pit", "Pit", "I am hollow. Hello."),
    "chanterelle": SpeciesTrait("ridge", "Ridge", "The ridges fork. Hello."),
    "turkey_tail": SpeciesTrait("zone", "Zone", "I zoned. Hello."),
    "lions_mane": SpeciesTrait("tooth", "Tooth", "I grew teeth. Hello."),
    "puffball": SpeciesTrait("spore", "Puff", "I puffed. That was hello."),
    "chicken_of_woods": SpeciesTrait("shelf", "Shelf", "I shelved. Hello."),
    "yeast": SpeciesTrait("rise", "Rise", "I rose. That was hello."),
    "lichen": SpeciesTrait("share", "Share", "We are two. Hello."),
    "photovore": SpeciesTrait("drink", "Drink", "I drank. That was hello."),
    "choir": SpeciesTrait("chord", "Chord", "I sounded. That was hello."),
    "nimbus": SpeciesTrait("float", "Float", "I floated. That was hello."),
    "silica": SpeciesTrait("facet", "Facet", "I faceted. Hello."),
    "terminator": SpeciesTrait("edge", "Edge", "I kept the rim. Hello."),
    "nexus": SpeciesTrait("count", "Count", "We counted. Hello."),
    "halovore": SpeciesTrait("frost", "Frost", "I frosted. Hello."),
    "magneton": SpeciesTrait("align", "Align", "I aligned. Hello."),
    "umbral": SpeciesTrait("dim", "Dim", "I dimmed. Hello."),
    "cyst": SpeciesTrait("wake", "Wake", "I waited. That was hello."),
    "frog": SpeciesTrait("croak", "Croak", "I jumped. That was hello."),
    "toad": SpeciesTrait("puff", "Puff", "I hopped. Hello."),
    "newt": SpeciesTrait("eft", "Eft", "I kept the orange. Hello."),
    "salamander": SpeciesTrait("hide", "Hide", "I waited under the leaf. Hello."),
    "caecilian": SpeciesTrait("ring", "Ring", "I am not a worm. Hello."),
    "crayfish": SpeciesTrait("pinch", "Pinch", "I pinched. That was hello."),
    "pond_snail": SpeciesTrait("rasp", "Rasp", "I rasped. Hello."),
    "mussel": SpeciesTrait("siphon", "Siphon", "I filtered. Hello."),
    "leech": SpeciesTrait("latch", "Latch", "I latched. Hello."),
    "stickleback": SpeciesTrait("flare", "Flare", "I flared. Hello."),
    "paramecium": SpeciesTrait("cilia", "Cilia", "I rowed. That was hello."),
    "amoeba": SpeciesTrait("reach", "Reach", "I reached. Hello."),
    "euglena": SpeciesTrait("spot", "Spot", "I kept the red. Hello."),
    "volvox": SpeciesTrait("roll", "Roll", "We rolled. Hello."),
    "diatom": SpeciesTrait("pane", "Pane", "I grew the pane. Hello."),
    "kelp": SpeciesTrait("holdfast", "Holdfast", "I held. Hello."),
    "chlamydomonas": SpeciesTrait("spin", "Spin", "I spun. Hello."),
    "stentor": SpeciesTrait("trumpet", "Trumpet", "I opened. Hello."),
    "coli": SpeciesTrait("tumble", "Tumble", "I tumbled. Hello."),
    "haloarchaea": SpeciesTrait("blush", "Blush", "I blushed. Hello."),
    "crow": SpeciesTrait("caw", "Caw", "I cawed. That was hello."),
    "raven": SpeciesTrait("kronk", "Croak", "I croaked. Hello."),
    "barn_owl": SpeciesTrait("hiss", "Hiss", "I hissed. Hello."),
    "red_tail": SpeciesTrait("soar", "Soar", "I soared. Hello."),
    "chickadee": SpeciesTrait("dee", "Dee", "Dee-dee. Hello."),
    "robin": SpeciesTrait("run", "Hop", "I hopped. Hello."),
    "mallard": SpeciesTrait("dabble", "Dabble", "I dabbled. Hello."),
    "canada_goose": SpeciesTrait("honk", "Honk", "I honked. Hello."),
    "pileated": SpeciesTrait("drum", "Drum", "I drummed. Hello."),
    "hummingbird": SpeciesTrait("hover", "Hover", "I hovered. Hello."),
    "orb_weaver": SpeciesTrait("web", "Loom", "I sat the web. Hello."),
    "jumping_spider": SpeciesTrait("leap", "Leap", "I leapt. That was hello."),
    "wolf_spider": SpeciesTrait("prowl", "Prowl", "I prowled. Hello."),
    "tarantula": SpeciesTrait("flick", "Flick", "I sat the silk. Hello."),
    "widow": SpeciesTrait("hour", "Hour", "I hung. Hello."),
    "harvestman": SpeciesTrait("stem", "Stem", "I walked the stem. Hello."),
    "scorpion": SpeciesTrait("sting", "Sting", "I raised the tail. Hello."),
    "vinegaroon": SpeciesTrait("spray", "Spray", "I whipped. Hello."),
    "tick": SpeciesTrait("clasp", "Clasp", "I clasped. Hello."),
    "solifuge": SpeciesTrait("gale", "Gale", "I ran. Hello."),
    "deer": SpeciesTrait("flag", "Flag", "I flagged. That was hello."),
    "bat": SpeciesTrait("hang", "Hang", "I hung. Hello."),
    "squirrel": SpeciesTrait("cache", "Cache", "I hid a thought. Hello."),
    "otter": SpeciesTrait("slide", "Slide", "I slid. That was hello."),
    "raccoon": SpeciesTrait("rinse", "Wash", "I washed. Hello."),
    "skunk": SpeciesTrait("warn", "Warn", "I stamped. Hello."),
    "opossum": SpeciesTrait("playdead", "Play dead", "I went still. Hello."),
    "beaver": SpeciesTrait("lodge", "Lodge", "I gnawed. Hello."),
    "porcupine": SpeciesTrait("bristle", "Bristle", "I bristled. Hello."),
    "black_bear": SpeciesTrait("forage", "Forage", "I foraged. Hello."),
    "gecko": SpeciesTrait("climb", "Climb", "I climbed. Hello."),
    "anole": SpeciesTrait("dewlap", "Flash", "I flashed. Hello."),
    "skink": SpeciesTrait("dash", "Dash", "I dashed. Hello."),
    "chameleon": SpeciesTrait("shift", "Shift", "I shifted. Hello."),
    "horned_lizard": SpeciesTrait("squirt", "Squirt", "I sat the crown. Hello."),
    "alligator": SpeciesTrait("levee", "Bank", "I sat the bank. Hello."),
    "crocodile": SpeciesTrait("show", "Show", "I showed. Hello."),
    "snapper": SpeciesTrait("snap", "Snap", "I snapped. Hello."),
    "box_turtle": SpeciesTrait("shut", "Shut", "I shut. Hello."),
    "tuatara": SpeciesTrait("crest", "Still", "I kept still. Hello."),
    "bass": SpeciesTrait("lunge", "Lunge", "I lunged. Hello."),
    "brook_trout": SpeciesTrait("speck", "Speck", "I rose. Hello."),
    "catfish": SpeciesTrait("whisk", "Whisk", "I whisked. Hello."),
    "bluegill": SpeciesTrait("penny", "Penny", "I flared the flap. Hello."),
    "perch": SpeciesTrait("bar", "Bar", "I kept the bars. Hello."),
    "pike": SpeciesTrait("lance", "Lance", "I waited. Hello."),
    "walleye": SpeciesTrait("night", "Night", "I hunted dusk. Hello."),
    "paddlefish": SpeciesTrait("spoon", "Filter", "I filtered. Hello."),
    "lamprey": SpeciesTrait("round", "Disk", "I sat the disk. Hello."),
    "american_eel": SpeciesTrait("silver", "Silver", "I swam. Hello."),
    "house_centipede": SpeciesTrait("haste", "Hunt", "I hunted. Hello."),
    "millipede": SpeciesTrait("link", "Oil", "I oiled. Hello."),
    "pillbug": SpeciesTrait("armor", "Roll", "I rolled. Hello."),
    "earthworm": SpeciesTrait("cast", "Cast", "I cast. Hello."),
    "velvet_worm": SpeciesTrait("jet", "Jet", "I jetted. Hello."),
    "springtail": SpeciesTrait("hop", "Hop", "I hopped. Hello."),
    "tardigrade": SpeciesTrait("tun", "Tun", "I sat the moss. Hello."),
    "planarian": SpeciesTrait("half", "Split", "I split. Hello."),
    "nematode": SpeciesTrait("thread", "Thrash", "I thrashed. Hello."),
    "amphipod": SpeciesTrait("scud", "Scud", "I swam on my side. Hello."),
    "fiddler_crab": SpeciesTrait("wave", "Wave", "I waved. Hello."),
    "ghost_crab": SpeciesTrait("pale", "Run", "I ran. Hello."),
    "limpet": SpeciesTrait("clamp", "Clamp", "I clamped. Hello."),
    "barnacle": SpeciesTrait("cement", "Stay", "I sat the stone. Hello."),
    "chiton": SpeciesTrait("mail", "Plate", "I plated. Hello."),
    "periwinkle": SpeciesTrait("spire", "Rasp", "I rasped. Hello."),
    "sand_dollar": SpeciesTrait("token", "Bury", "I sat the sand. Hello."),
    "sea_urchin": SpeciesTrait("thorn", "Spine", "I sat the spines. Hello."),
    "knobbed_whelk": SpeciesTrait("knurl", "Hunt", "I hunted. Hello."),
    "lugworm": SpeciesTrait("heap", "Heap", "I heaped. Hello."),
    "field_cricket": SpeciesTrait("chirp", "Chirp", "I sang. Hello."),
    "katydid": SpeciesTrait("blade", "Still", "I sat the leaf. Hello."),
    "grasshopper": SpeciesTrait("vault", "Vault", "I vaulted. Hello."),
    "swallowtail": SpeciesTrait("banner", "Banner", "I kept the yellow. Hello."),
    "jewelwing": SpeciesTrait("jewel", "Jewel", "I kept the black. Hello."),
    "lacewing": SpeciesTrait("lace", "Lace", "I laced. Hello."),
    "earwig": SpeciesTrait("forceps", "Forceps", "I raised the cerci. Hello."),
    "acorn_weevil": SpeciesTrait("snout", "Snout", "I sat the acorn. Hello."),
    "click_beetle": SpeciesTrait("click", "Click", "I clicked. Hello."),
    "robber_fly": SpeciesTrait("rob", "Rob", "I hunted. Hello."),
    "sloth": SpeciesTrait("hang", "Hang", "I hung. Hello."),
    "lemur": SpeciesTrait("sun", "Sun", "I sat the sun. Hello."),
    "gibbon": SpeciesTrait("swing", "Swing", "I sang. Hello."),
    "kinkajou": SpeciesTrait("wrist", "Wrist", "I wrapped. Hello."),
    "colugo": SpeciesTrait("sail", "Sail", "I sailed. Hello."),
    "flying_squirrel": SpeciesTrait("glide", "Glide", "I glided. Hello."),
    "howler": SpeciesTrait("boom", "Boom", "I howled. Hello."),
    "tarsier": SpeciesTrait("gaze", "Gaze", "I looked. Hello."),
    "potto": SpeciesTrait("still", "Still", "I kept still. Hello."),
    "koala": SpeciesTrait("gum", "Gum", "I chewed. Hello."),
    "brain_coral": SpeciesTrait("ridge", "Ridge", "I sat the rock. Hello."),
    "anemone": SpeciesTrait("wreath", "Wreath", "I opened. Hello."),
    "clownfish": SpeciesTrait("paint", "Paint", "I sat the wreath. Hello."),
    "parrotfish": SpeciesTrait("scrape", "Scrape", "I rasped. Hello."),
    "cleaner_shrimp": SpeciesTrait("scrub", "Scrub", "I waited. Hello."),
    "sea_cucumber": SpeciesTrait("tube", "Tube", "I sat the sand. Hello."),
    "lionfish": SpeciesTrait("veil", "Veil", "I veiled. Hello."),
    "giant_clam": SpeciesTrait("gate", "Gate", "I opened. Hello."),
    "eagle_ray": SpeciesTrait("soar", "Soar", "I soared. Hello."),
    "grouper": SpeciesTrait("hide", "Hide", "I sat the hole. Hello."),
}

FALLBACK_TRAIT = TRAITS["red_panda"]

_PLAY = frozenset({"ribbon", "steal", "trade", "snap", "spore", "pinch", "dabble", "drum", "flick", "sting", "spray", "squirt", "jet"})
_WANDER = frozenset({"thump", "loop", "slither", "patrol", "chart", "rise", "pulse", "soar", "drop", "waggle", "migrate", "hawk", "trail", "emerge", "float", "edge", "align", "thrum", "bore", "shine", "hum", "eft", "flare", "cilia", "reach", "spot", "roll", "spin", "tumble", "run", "hover", "leap", "prowl", "stem", "gale", "flag", "cache", "slide", "forage", "climb", "dash", "show", "lunge", "speck", "whisk", "penny", "bar", "lance", "night", "silver", "haste", "link", "hop", "thread", "scud", "wave", "pale", "thorn", "vault", "banner", "jewel", "lace", "click", "rob", "swing", "sail", "glide"})
_TALK = frozenset({"wheek", "echo", "quote", "bug", "bill", "reborn", "mimic", "inspect", "flush", "gape", "bloom", "flash", "count", "warn", "chord", "croak", "caw", "kronk", "hiss", "dee", "honk", "dewlap", "chirp", "boom"})
_SIT = frozenset({"still", "bask", "curl", "sun", "hoard", "ritual", "coil", "drape", "hold", "nest", "ink", "cling", "hitch", "molt", "carpet", "unfurl", "gold", "open", "store", "drown", "glue", "freeze", "fold", "seal", "cut", "pot", "dig", "lay", "fruit", "pit", "ridge", "zone", "tooth", "shelf", "share", "drink", "facet", "frost", "dim", "wake", "puff", "hide", "ring", "rasp", "siphon", "latch", "pane", "holdfast", "trumpet", "blush", "web", "hour", "clasp", "hang", "rinse", "lodge", "bristle", "shift", "levee", "shut", "crest", "spoon", "round", "armor", "cast", "tun", "half", "clamp", "cement", "mail", "spire", "token", "knurl", "heap", "blade", "forceps", "snout", "wrist", "gaze", "gum", "wreath", "paint", "scrape", "scrub", "tube", "veil", "gate"})


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
    next_state = keep_hive(replace(next_state, last_line=trait.line, anim=anim), kind)
    return CareResult(next_state, trait.line, anim, cmd)
