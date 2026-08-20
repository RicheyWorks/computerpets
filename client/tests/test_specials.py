"""Species specials match web/src/lib/pets/specials.ts and traits.ts."""

from computerpets_client.life import CareState, apply_hide
from computerpets_client.specials import TRAITS, apply_special, trait_for
from computerpets_client.species import CATALOG_KEYS, RUI, species_by_key

# special / verb / line — same copy as web/src/lib/pets/traits.ts
HOUSE_TRAITS = {
    "red_panda": ("ribbon", "Steal ribbon", "I found a ribbon. It was not lost. It is now safer."),
    "cat": ("sun", "Claim the sun", "This patch of light is reserved."),
    "dog": ("follow", "Heel", "The cursor moved. I have prepared a walk."),
    "rabbit": ("thump", "Thump", "Thump. That was a warning and a hello."),
    "hamster": ("hoard", "Hoard", "This paperclip is now mine. Officially."),
    "guinea_pig": ("wheek", "Wheek", "Wheek. Deploy celebrated."),
    "turtle": ("still", "Be still", "I moved. You missed it. That is fine."),
    "goldfish": ("loop", "Loop", "Around again. The view improved."),
    "budgie": ("echo", "Echo", "Build failed. But musically."),
    "fox": ("bug", "Find a bug", "There is a bug in the left pocket. You knew."),
    "penguin": ("ritual", "Bow", "A bow. It is brief. It is required."),
    "parrot": ("quote", "Quote", "Fix typo. A masterpiece."),
    "ferret": ("steal", "Steal", "I put your dongle somewhere better."),
    "hedgehog": ("curl", "Curl", "Waiting is a kindness I notice."),
    "chinchilla": ("bath", "Dust bath", "That crumb is a scandal."),
    "axolotl": ("regrow", "Regrow", "I grew a little more calm."),
    "toucan": ("bill", "Inspect", "This perch has opinions about your posture."),
    "iguana": ("bask", "Bask", "I blinked. Minutes will not record it."),
    "dragon": ("hoard", "Keep watch", "I could be larger. I choose this."),
    "phoenix": ("reborn", "Ember", "I came back softer."),
    "ball_python": ("coil", "Coil", "I made a bun. I am the bun."),
    "corn_snake": ("slither", "Thread", "I found a gap. I am the gap's problem."),
    "kingsnake": ("inspect", "Inspect", "I am the law of this drawer."),
    "green_tree_python": ("drape", "Drape", "I folded in half. That is sitting."),
    "hognose": ("playdead", "Play dead", "I died. I got over it."),
    "garter": ("patrol", "Patrol", "I do not lounge. I pause."),
    "boa": ("hold", "Hold", "I could be tighter. I choose this."),
    "milk_snake": ("mimic", "Mimic", "I am not who I look like. Hello."),
    "rosy_boa": ("nest", "Nest", "I am a blush that learned to crawl."),
    "carpet_python": ("chart", "Chart", "This pattern is a map. I am the country."),
    "octopus": ("ink", "Ink", "I jet. Then I am a cup again."),
    "cuttlefish": ("flush", "Flush", "I changed for you. Then I changed back."),
    "nautilus": ("rise", "Rise", "I have been rising. You may wait."),
    "moon_jelly": ("pulse", "Pulse", "I pulsed. That was hello."),
    "sea_star": ("cling", "Cling", "I have not moved. That is hello."),
    "hermit_crab": ("trade", "Trade", "This shell is temporary. Hello."),
    "horseshoe_crab": ("molt", "Molt", "I am not a crab. Hello."),
    "seahorse": ("hitch", "Hitch", "I hitched. You may look."),
    "manta": ("soar", "Soar", "I saved you a length of sky."),
    "moray": ("gape", "Gape", "The gape is air. Not a threat. Mostly."),
    "moss": ("carpet", "Carpet", "I was already the page. Hello."),
    "maidenhair": ("unfurl", "Unfurl", "I unfurled an inch. Hello."),
    "ginkgo": ("gold", "Gold", "I have been gold before. Hello."),
    "oak": ("drop", "Drop", "I agreed to be small."),
    "water_lily": ("open", "Open", "I opened. That was hello."),
    "orchid": ("bloom", "Bloom", "I bloomed. You may look."),
    "saguaro": ("store", "Store", "I have not moved. That is hello."),
    "venus_flytrap": ("snap", "Snap", "I did not snap. That is hello."),
    "pitcher": ("drown", "Drown", "I did not chase. The well was enough."),
    "sundew": ("glue", "Glue", "I glittered. That was hello."),
    "honeybee": ("waggle", "Waggle", "I danced. That was hello."),
    "monarch": ("migrate", "Migrate", "I kept the orange. Hello."),
    "luna": ("still", "Moon", "I arrived without a mouth. Hello."),
    "firefly": ("flash", "Flash", "I flashed. That was hello."),
    "darner": ("hawk", "Hawk", "I hawed the lamp. Hello."),
    "stick": ("freeze", "Freeze", "I have not moved. That is hello."),
    "carpenter_ant": ("trail", "Trail", "I laid a road. Hello."),
    "ladybird": ("count", "Count", "I counted. Hello."),
    "mantis": ("fold", "Fold", "I did not strike. That is hello."),
    "cicada": ("emerge", "Emerge", "I emerged. You may wait."),
    "bumblebee": ("thrum", "Thrum", "I thrummed. That was hello."),
    "carpenter_bee": ("bore", "Bore", "I bored. Hello."),
    "mason_bee": ("seal", "Seal", "I sealed a cell. Hello."),
    "leafcutter": ("cut", "Cut", "I cut a circle. Hello."),
    "stingless": ("pot", "Pot", "I filled a pot. Hello."),
    "sweat_bee": ("shine", "Shine", "I shone. Hello."),
    "mining_bee": ("dig", "Dig", "I dug. Hello."),
    "honey_drone": ("hum", "Hum", "I hummed. That was hello."),
    "honey_queen": ("lay", "Lay", "I stayed. That was hello."),
    "honeycomb": ("hold", "Hold", "I sat. That was hello."),
    "oyster": ("fruit", "Fruit", "I fruited. That was hello."),
    "fly_agaric": ("warn", "Warn", "I am a warning. Hello."),
    "morel": ("pit", "Pit", "I am hollow. Hello."),
    "chanterelle": ("ridge", "Ridge", "The ridges fork. Hello."),
    "turkey_tail": ("zone", "Zone", "I zoned. Hello."),
    "lions_mane": ("tooth", "Tooth", "I grew teeth. Hello."),
    "puffball": ("spore", "Puff", "I puffed. That was hello."),
    "chicken_of_woods": ("shelf", "Shelf", "I shelved. Hello."),
    "yeast": ("rise", "Rise", "I rose. That was hello."),
    "lichen": ("share", "Share", "We are two. Hello."),
    "photovore": ("drink", "Drink", "I drank. That was hello."),
    "choir": ("chord", "Chord", "I sounded. That was hello."),
    "nimbus": ("float", "Float", "I floated. That was hello."),
    "silica": ("facet", "Facet", "I faceted. Hello."),
    "terminator": ("edge", "Edge", "I kept the rim. Hello."),
    "nexus": ("count", "Count", "We counted. Hello."),
    "halovore": ("frost", "Frost", "I frosted. Hello."),
    "magneton": ("align", "Align", "I aligned. Hello."),
    "umbral": ("dim", "Dim", "I dimmed. Hello."),
    "cyst": ("wake", "Wake", "I waited. That was hello."),
    "frog": ("croak", "Croak", "I jumped. That was hello."),
    "toad": ("puff", "Puff", "I hopped. Hello."),
    "newt": ("eft", "Eft", "I kept the orange. Hello."),
    "salamander": ("hide", "Hide", "I waited under the leaf. Hello."),
    "caecilian": ("ring", "Ring", "I am not a worm. Hello."),
    "crayfish": ("pinch", "Pinch", "I pinched. That was hello."),
    "pond_snail": ("rasp", "Rasp", "I rasped. Hello."),
    "mussel": ("siphon", "Siphon", "I filtered. Hello."),
    "leech": ("latch", "Latch", "I latched. Hello."),
    "stickleback": ("flare", "Flare", "I flared. Hello."),
    "paramecium": ("cilia", "Cilia", "I rowed. That was hello."),
    "amoeba": ("reach", "Reach", "I reached. Hello."),
    "euglena": ("spot", "Spot", "I kept the red. Hello."),
    "volvox": ("roll", "Roll", "We rolled. Hello."),
    "diatom": ("pane", "Pane", "I grew the pane. Hello."),
    "kelp": ("holdfast", "Holdfast", "I held. Hello."),
    "chlamydomonas": ("spin", "Spin", "I spun. Hello."),
    "stentor": ("trumpet", "Trumpet", "I opened. Hello."),
    "coli": ("tumble", "Tumble", "I tumbled. Hello."),
    "haloarchaea": ("blush", "Blush", "I blushed. Hello."),
    "crow": ("caw", "Caw", "I cawed. That was hello."),
    "raven": ("kronk", "Croak", "I croaked. Hello."),
    "barn_owl": ("hiss", "Hiss", "I hissed. Hello."),
    "red_tail": ("soar", "Soar", "I soared. Hello."),
    "chickadee": ("dee", "Dee", "Dee-dee. Hello."),
    "robin": ("run", "Hop", "I hopped. Hello."),
    "mallard": ("dabble", "Dabble", "I dabbled. Hello."),
    "canada_goose": ("honk", "Honk", "I honked. Hello."),
    "pileated": ("drum", "Drum", "I drummed. Hello."),
    "hummingbird": ("hover", "Hover", "I hovered. Hello."),
    "orb_weaver": ("web", "Loom", "I sat the web. Hello."),
    "jumping_spider": ("leap", "Leap", "I leapt. That was hello."),
    "wolf_spider": ("prowl", "Prowl", "I prowled. Hello."),
    "tarantula": ("flick", "Flick", "I sat the silk. Hello."),
    "widow": ("hour", "Hour", "I hung. Hello."),
    "harvestman": ("stem", "Stem", "I walked the stem. Hello."),
    "scorpion": ("sting", "Sting", "I raised the tail. Hello."),
    "vinegaroon": ("spray", "Spray", "I whipped. Hello."),
    "tick": ("clasp", "Clasp", "I clasped. Hello."),
    "solifuge": ("gale", "Gale", "I ran. Hello."),
    "deer": ("flag", "Flag", "I flagged. That was hello."),
    "bat": ("hang", "Hang", "I hung. Hello."),
    "squirrel": ("cache", "Cache", "I hid a thought. Hello."),
    "otter": ("slide", "Slide", "I slid. That was hello."),
    "raccoon": ("rinse", "Wash", "I washed. Hello."),
    "skunk": ("warn", "Warn", "I stamped. Hello."),
    "opossum": ("playdead", "Play dead", "I went still. Hello."),
    "beaver": ("lodge", "Lodge", "I gnawed. Hello."),
    "porcupine": ("bristle", "Bristle", "I bristled. Hello."),
    "black_bear": ("forage", "Forage", "I foraged. Hello."),
    "gecko": ("climb", "Climb", "I climbed. Hello."),
    "anole": ("dewlap", "Flash", "I flashed. Hello."),
    "skink": ("dash", "Dash", "I dashed. Hello."),
    "chameleon": ("shift", "Shift", "I shifted. Hello."),
    "horned_lizard": ("squirt", "Squirt", "I sat the crown. Hello."),
    "alligator": ("levee", "Bank", "I sat the bank. Hello."),
    "crocodile": ("show", "Show", "I showed. Hello."),
    "snapper": ("snap", "Snap", "I snapped. Hello."),
    "box_turtle": ("shut", "Shut", "I shut. Hello."),
    "tuatara": ("crest", "Still", "I kept still. Hello."),
    "bass": ("lunge", "Lunge", "I lunged. Hello."),
    "brook_trout": ("speck", "Speck", "I rose. Hello."),
    "catfish": ("whisk", "Whisk", "I whisked. Hello."),
    "bluegill": ("penny", "Penny", "I flared the flap. Hello."),
    "perch": ("bar", "Bar", "I kept the bars. Hello."),
    "pike": ("lance", "Lance", "I waited. Hello."),
    "walleye": ("night", "Night", "I hunted dusk. Hello."),
    "paddlefish": ("spoon", "Filter", "I filtered. Hello."),
    "lamprey": ("round", "Disk", "I sat the disk. Hello."),
    "american_eel": ("silver", "Silver", "I swam. Hello."),
    "house_centipede": ("haste", "Hunt", "I hunted. Hello."),
    "millipede": ("link", "Oil", "I oiled. Hello."),
    "pillbug": ("armor", "Roll", "I rolled. Hello."),
    "earthworm": ("cast", "Cast", "I cast. Hello."),
    "velvet_worm": ("jet", "Jet", "I jetted. Hello."),
    "springtail": ("hop", "Hop", "I hopped. Hello."),
    "tardigrade": ("tun", "Tun", "I sat the moss. Hello."),
    "planarian": ("half", "Split", "I split. Hello."),
    "nematode": ("thread", "Thrash", "I thrashed. Hello."),
    "amphipod": ("scud", "Scud", "I swam on my side. Hello."),
}


def test_every_catalog_key_has_the_house_special():
    assert set(TRAITS) == set(CATALOG_KEYS)
    assert len(TRAITS) == len(CATALOG_KEYS)
    for key in CATALOG_KEYS:
        trait = trait_for(key)
        special, verb, line = HOUSE_TRAITS[key]
        assert trait.special == special
        assert trait.verb == verb
        assert trait.line == line


def test_ribbon_and_steal_play():
    before = CareState(mood=50, bond=10)
    ribbon = apply_special(before, RUI)
    assert ribbon.cmd == "play"
    assert ribbon.state.mood == 58
    assert ribbon.state.bond == 12
    assert ribbon.line == "I found a ribbon. It was not lost. It is now safer."
    steal = apply_special(before, species_by_key("ferret"))
    assert steal.cmd == "play"
    assert steal.state.mood == 58
    assert steal.line == "I put your dongle somewhere better."


def test_follow_wanders():
    result = apply_special(CareState(mood=50, bond=10), species_by_key("dog"))
    assert result.cmd == "wander"
    assert result.state.mood == 54
    assert result.state.bond == 12
    assert result.line == "The cursor moved. I have prepared a walk."


def test_wheek_talks():
    result = apply_special(CareState(mood=50, bond=10), species_by_key("guinea_pig"))
    assert result.cmd == "talk"
    assert result.state.mood == 58
    assert result.line == "Wheek. Deploy celebrated."


def test_coil_sits():
    before = CareState(energy=50, mood=50, bond=10)
    result = apply_special(before, species_by_key("ball_python"))
    assert result.cmd == "sit"
    assert result.state.energy == 56
    assert result.state.mood == 56
    assert result.state.bond == 12
    assert result.line == "I made a bun. I am the bun."


def test_playdead_sits_and_rests():
    before = CareState(energy=50, mood=50, bond=10)
    result = apply_special(before, species_by_key("hognose"))
    assert result.cmd == "sit"
    assert result.state.energy == 60
    assert result.state.mood == 50
    assert result.state.bond == 12
    assert result.line == "I died. I got over it."


def test_bath_washes():
    before = CareState(hygiene=40, mood=50, bond=10)
    result = apply_special(before, species_by_key("chinchilla"))
    assert result.cmd == "sit"
    assert result.state.hygiene == 80
    assert result.state.mood == 62
    assert result.line == "That crumb is a scandal."


def test_regrow_mends():
    before = CareState(health=70, bond=10)
    result = apply_special(before, species_by_key("axolotl"))
    assert result.cmd == "idle"
    assert result.state.health == 82
    assert result.state.bond == 12
    assert result.line == "I grew a little more calm."


def test_wander_specials_do_not_invent_mood():
    before = CareState(mood=50, bond=10)
    for key in ("rabbit", "goldfish", "corn_snake", "garter", "carpet_python"):
        result = apply_special(before, species_by_key(key))
        assert result.cmd == "wander"
        assert result.state.mood == 50
        assert result.state.bond == 12


def test_hidden_guest_does_not_special():
    hidden = apply_hide(CareState(mood=50, bond=10), RUI).state
    result = apply_special(hidden, RUI)
    assert result.state.hidden is True
    assert result.state.mood == 50
    assert result.state.bond == 10
    assert result.cmd == "idle"
