"""Today's house visitor — same pick as the web desk / house floor.

Port of ``web/src/lib/pets/visitor.ts``. Identity is the civil day plus the
host key's length, walked through the living catalog minus the host. Do not
invent a new guest list.
"""

from __future__ import annotations

from datetime import datetime

from .species import CATALOG_KEYS, SPECIES, Species, species_by_key
from .weather import civil_day_number

# Walk-through timing from web/src/components/desk/house-visit.tsx
VISIT_WAIT_MS = 7500
VISIT_TALK_MS = 1600
VISIT_WANDER_MS = 5200
VISIT_LEAVE_MS = 14000
VISIT_GONE_MS = 18500

VISIT_LINES: dict[str, str] = {
    "red_panda": "I came for the ribbon. I'll put it back. Maybe.",
    "cat": "I inspected the blotter. It will do.",
    "dog": "I brought the whole tail. Then I took it home.",
    "rabbit": "A short visit. The greens here are theoretical.",
    "hamster": "I mapped the crumbs. Officially.",
    "guinea_pig": "Wheek. That is the entire review.",
    "turtle": "I arrived. I will leave in due course.",
    "goldfish": "I drifted through. That counts.",
    "budgie": "A note: your house is loud. I approve.",
    "fox": "I found this desk first. Then I left it.",
    "penguin": "A pebble of a visit.",
    "parrot": "I came to quote the furniture.",
    "ferret": "I borrowed a dongle. I'll return a better one.",
    "hedgehog": "A quiet walk-through.",
    "chinchilla": "The dust here is a scandal. I took a sample.",
    "axolotl": "I grew a little more present. Then less.",
    "toucan": "The bill approves of this blotter.",
    "iguana": "I blinked at your lamp. Then I left.",
    "dragon": "A courtesy inspection of the hoard.",
    "phoenix": "I warmed the corner. You're welcome.",
    "ball_python": "I came as a bun. I will leave as a bun.",
    "corn_snake": "I threaded through. Your gap is fine.",
    "kingsnake": "I inspected. You may keep the desk.",
    "green_tree_python": "I hung on your lamp. Briefly.",
    "hognose": "I died on your blotter. I got over it.",
    "garter": "I patrolled. The moss is adequate.",
    "boa": "I held the edge. Then I let go.",
    "milk_snake": "I was a rumor. Then I was lunch-minded.",
    "rosy_boa": "I borrowed the warm corner. I left it pink.",
    "carpet_python": "I charted your shelf. You may land.",
    "octopus": "I tasted the rim. Then I was a cup again.",
    "cuttlefish": "I flushed. Then I left the weather.",
    "nautilus": "I rose through. The house can wait.",
    "moon_jelly": "I pulsed through. That counts.",
    "sea_star": "I clung. Then I unclung. Slowly.",
    "hermit_crab": "I measured the lids. None were free.",
    "horseshoe_crab": "I walked the sand. I am not a crab.",
    "seahorse": "I hitched your pencil. Briefly.",
    "manta": "I soared the bowl. You may keep the sky.",
    "moray": "I was the door. Then I was gone.",
    "moss": "I carpeted. Then I was the page again.",
    "maidenhair": "I unfurled. Then I folded.",
    "ginkgo": "I golded. Then I left the autumn.",
    "oak": "I dropped one. Then I was small again.",
    "water_lily": "I opened. Then I closed.",
    "orchid": "I bloomed. Then I was bark again.",
    "saguaro": "I stored a visit. Then I sat.",
    "venus_flytrap": "I did not snap. Then I left the cup.",
    "pitcher": "I kept the well. Then I left the rain.",
    "sundew": "I glittered. Then I uncurled.",
    "honeybee": "I danced. Then I left the map.",
    "monarch": "I kept the orange. Then I left the cup.",
    "luna": "I drifted. I did not eat.",
    "firefly": "I flashed. Then I left the grammar.",
    "darner": "I hawed. Then I was air again.",
    "stick": "I froze. Then I was a pencil again.",
    "carpenter_ant": "I laid a road. Then I left the grain.",
    "ladybird": "I counted. Then I left the seven.",
    "mantis": "I folded. Then I left the stem.",
    "cicada": "I sat. Then I left the years.",
    "bumblebee": "I thrummed. Then I left the cup.",
    "carpenter_bee": "I bored. Then I left the hole.",
    "mason_bee": "I sealed. Then I left the stone.",
    "leafcutter": "I cut. Then I left the disc.",
    "stingless": "I potted. Then I left the wax.",
    "sweat_bee": "I shone. Then I left the rim.",
    "mining_bee": "I dug. Then I left the bank.",
    "honey_drone": "I hummed. Then I left the dish.",
    "honey_queen": "I stayed. Then I left the line.",
    "honeycomb": "I sat. Then the line went quieter.",
    "oyster": "I fruited. Then I left the wood.",
    "fly_agaric": "I warned. Then I left the cup.",
    "morel": "I sat hollow. Then I left the mold.",
    "chanterelle": "I forked. Then I left the rim.",
    "turkey_tail": "I zoned. Then I left the grain.",
    "lions_mane": "I hung teeth. Then I left the wound.",
    "puffball": "I puffed. Then I left the cloud.",
    "chicken_of_woods": "I shelved. Then I left the oak.",
    "yeast": "I rose. Then I left the crock.",
    "lichen": "We sat. Then we left the share.",
    "photovore": "I drank. Then I left the glass.",
    "choir": "I sounded. Then I left the air.",
    "nimbus": "I floated. Then I left the bowl.",
    "silica": "I faceted. Then I left the stone.",
    "terminator": "I kept the rim. Then I left the belt.",
    "nexus": "We counted. Then we left the name.",
    "halovore": "I frosted. Then I left the dish.",
    "magneton": "I aligned. Then I left the line.",
    "umbral": "I dimmed. Then I left the cool.",
    "cyst": "I waited. Then I left the seal.",
}


def todays_visitor(host_key: str, now: datetime | None = None) -> Species:
    day = civil_day_number(now)
    others = [key for key in CATALOG_KEYS if key != host_key]
    if not others:
        return species_by_key(host_key)
    pick = others[abs(day + len(host_key)) % len(others)]
    return SPECIES[pick]


def visit_line(guest_key: str) -> str:
    return VISIT_LINES.get(guest_key, "I came. I saw the lamp. I left.")


def visit_caption(host_key: str, now: datetime | None = None) -> str:
    guest = todays_visitor(host_key, now)
    return f"{guest.name} may call"
