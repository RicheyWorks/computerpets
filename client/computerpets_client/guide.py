"""Field-guide plaques for the PyQt blotter.

Copy is ported from ``web/src/lib/pets/house-guide.ts`` and ``snake-guide.ts``.
This is not a new bestiary — the same forty, taught here. Snakes keep the den
facts; the tide keeps the sea facts; the twenty keep the study facts.
"""

from __future__ import annotations

from dataclasses import dataclass

from .species import CATALOG_KEYS, HOUSE_KEYS, SEA_KEYS, SNAKE_KEYS, SPECIES, is_sea, is_snake


@dataclass(frozen=True)
class FieldGuide:
    key: str
    slug: str
    name: str
    species: str
    latin: str
    tell: str
    mixup: str
    lesson: str
    habitat: str
    temperament: str


@dataclass(frozen=True)
class Classroom:
    room: str
    label: str
    verb: str


def _entry(
    key: str,
    latin: str,
    tell: str,
    mixup: str,
    lesson: str,
    habitat: str,
    temperament: str,
) -> FieldGuide:
    spec = SPECIES[key]
    return FieldGuide(
        key=key,
        slug=spec.slug,
        name=spec.name,
        species=spec.label,
        latin=latin,
        tell=tell,
        mixup=mixup,
        lesson=lesson,
        habitat=habitat,
        temperament=temperament,
    )


# Twenty who are not snakes. Same tells as /study.
HOUSE_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "red_panda",
        "Ailurus fulgens",
        "Rust from whisker to ringed tail, a cream face, and ear tufts like small commas. She climbs with a wrist-bone that works as a thumb. About the size of a house cat, and twice as serious about ribbon.",
        "Not a bear. Not a raccoon. Rui keeps her own family — Ailuridae — in the Himalaya. People file her with Miso's cousins or with the laundry-thief in a cartoon. She is neither. The tail is a scarf she earned.",
        "Red panda. I am not a bear. The tail is the tell.",
        "study rafters",
        "curious",
    ),
    _entry(
        "cat",
        "Felis catus",
        "A cream British shorthair: dense coat, round face, copper-coin eyes. The claws go away when she is done making a point. Whiskers measure the gap. She blinks when it is earned.",
        "Not a lynx — no ear tufts, no bobbed tail, no wild commission. Not a small lion. Miso is the old house cat, Felis catus, and the ledge is her whole taxonomy.",
        "House cat. The claws retract. The blink is optional.",
        "window ledge",
        "aloof",
    ),
    _entry(
        "dog",
        "Canis familiaris",
        "A cream corgi: short legs, a long earnest back, and a face that believes the cursor is a walk. Herding bones in a hearth-rug body. The chest arrives first.",
        "Not a fox. Rue has the white tail-tip and a private agenda; Pip has the whole heart and no secrets. Not a dachshund — those are hounds. She is a herding dog who was built close to the grass.",
        "Corgi. I follow. That is how you know me.",
        "hearth rug",
        "loyal",
    ),
    _entry(
        "rabbit",
        "Oryctolagus cuniculus",
        "Long ears that fill with the room, a cotton scut, and a thump that means both warning and hello. The second pair of upper teeth — peg teeth — is the quiet proof. Soft, then gone.",
        "Not a rodent. Lagomorph: two pairs of incisors, not one. Not a hare — hares are born furred and ready; Thimble was a nestling and still prefers the warren. People also file her with Clip. She is larger, quieter, and she thumps.",
        "House rabbit. I thump. Then I vanish.",
        "under-desk warren",
        "timid",
    ),
    _entry(
        "hamster",
        "Mesocricetus auratus",
        "A golden Syrian: pouches that run to the shoulders, a thread of a tail, and a night shift. One hamster to a drawer. He will cheek a paperclip and call it inventory.",
        "Not a gerbil — those keep a longer tail and a committee. Not a guinea pig. Whee is social and loud about salad; Clip is solitary, nocturnal, and managerial. Two Syrians in one nest is a diplomatic incident.",
        "Golden hamster. The cheeks are the office.",
        "drawer nest",
        "busy",
    ),
    _entry(
        "guinea_pig",
        "Cavia porcellus",
        "A loaf with a voice. No tail worth mentioning. The wheek carries when a fridge opens — or a deploy lands. She cannot make her own vitamin C. She prefers a second loaf nearby.",
        "Not a hamster. Clip works the night shift alone; Whee is a cavy from the Andes, social, and fluent in salad. Not a pig. The name is a rumor she declined. She popcorns when the news is good.",
        "Guinea pig. I wheek. That is how you know I meant you.",
        "lettuce bowl",
        "sociable",
    ),
    _entry(
        "turtle",
        "Mauremys reevesii",
        "A small pond turtle of the inkstone school: three faint keels on the carapace, webbed working feet, a head that can withdraw. He takes the long way through still water.",
        "Not a tortoise. Tortoises keep club feet and a high dry dome; Ink keeps webbing and a dish. Not a terrapin of the brackish rumor. He is a Reeves's turtle — the scholar's pond one — and he will outlive the framework.",
        "Reeves's turtle. Webbed feet. I am not a dry-land rumor.",
        "inkstone dish",
        "patient",
    ),
    _entry(
        "goldfish",
        "Carassius auratus",
        "A carp that learned to be a coin: no barbels, a split tail, metal that turns when the light does. She circles one honest thought. The memory is longer than the joke.",
        "Not a koi. Koi wear barbels and grow into a pond; Coin is Carassius, smaller, and honest about the bowl. The three-second memory is a slander. She forgot on purpose. It came back kinder.",
        "Goldfish. No barbels. I still have the thought.",
        "brass bowl",
        "serene",
    ),
    _entry(
        "budgie",
        "Melopsittacus undulatus",
        "A small Australian parrot: scalloped wings, a cere above the bill, a voice that steals the room and returns it nicer. Green, unless the house has other ideas. He fits on a finger and a lamp shade.",
        "Not a lovebird, not a cockatiel. Quill is the scarlet one with a chest for quotation; Echo is the budgerigar — a parakeet, if you must — and he repeats the error message in a better key. The cere is the tell.",
        "Budgie. I repeat it kinder. Look at the cere.",
        "lamp shade",
        "chatty",
    ),
    _entry(
        "fox",
        "Vulpes vulpes",
        "Red coat, black socks, and a white tip on the brush — that tip is the whole identification. Vertical pupils. A face that already knows why you opened the closet.",
        "Not a dog. Pip believes you; Rue has already found the bug. Not a coyote, not a small wolf, not a cat who learned to scheme. She is Vulpes vulpes. The white tip does not lie.",
        "Red fox. The tail ends white. I found you first.",
        "coat closet",
        "clever",
    ),
    _entry(
        "penguin",
        "Eudyptula minor",
        "The smallest tuxedo in the house: slate-blue, not ink-black, a white bib, wings that became flippers and declined to fly. He keeps cold tile and a brief bow.",
        "Not a puffin. Puffins fly, keep a carnival bill, and work the North Atlantic. Peck is a little penguin — Australia and New Zealand, not the ice-cap rumor. Not every penguin is Antarctic. His dress code is countershading.",
        "Little penguin. I do not fly. The bow is required.",
        "cold tile",
        "formal",
    ),
    _entry(
        "parrot",
        "Ara macao",
        "A scarlet macaw: red that means it, yellow and blue in the wings, a hooked bill that can open a nut or a subject line. Zygodactyl feet — two toes forward, two back. The stand is a stage.",
        "Not a toucan. Keel's bill is a hollow fruit-bowl; Quill's is a tool. Not a budgie with better lighting. Echo steals phrases. Quill quotes from the chest. The macaw is the large scarlet one.",
        "Scarlet macaw. The bill is a tool. I say it from the chest.",
        "hat stand",
        "theatrical",
    ),
    _entry(
        "ferret",
        "Mustela furo",
        "A tube with opinions: sable mask, short legs, a spine that treats a cable-run as a palace. Domesticated polecat. He sleeps like a comma and wakes as a heist.",
        "Not a weasel — those are the wild, smaller cousins. Not a mongoose, not an otter, not a meerkat. Wick is Mustela furo, the house polecat, and the dongle was not lost. It was relocated.",
        "Ferret. I am a tube. Your dongle is somewhere better.",
        "cable run",
        "mischief",
    ),
    _entry(
        "hedgehog",
        "Atelerix albiventris",
        "A walking pin-cushion that chooses. The quills are hollow hairs, banded, and they stay put — she does not throw them. When the room is too much, she becomes a ball with a face inside.",
        "Not a porcupine. Porcupines are rodents with long barbed quills they can leave in you. Burr is an African pygmy hedgehog, an insectivore, smaller, and the ball is the whole defense. Wait. She uncurls.",
        "Hedgehog. Quills that stay. I am not a rumor with a tail.",
        "knit basket",
        "guarded",
    ),
    _entry(
        "chinchilla",
        "Chinchilla lanigera",
        "A cloud with whiskers. The densest fur in the house — sixty hairs to a follicle. Soft enough to refuse water. She bathes in volcanic dust, not in the bowl. The Andes sent her. She likes the desk clean.",
        "Not a rabbit. Thimble thumps; Floss rolls in ash-fine dust because water ruins the coat. Not a squirrel, not a hamster in formal wear. She is Andean, nocturnal, and particular. Fetch the dust, not the tub.",
        "Chinchilla. I dust-bathe. Do not offer the tub.",
        "dust bath",
        "fastidious",
    ),
    _entry(
        "axolotl",
        "Ambystoma mexicanum",
        "A salamander that refused to grow up. External gills like pink feathers, a smile that is just the mouth, and a body that stays larval on purpose. Still water. Slow thoughts. Things grow back.",
        "Not a fish. Not a lizard. Bloom is an amphibian who kept the gills — neoteny, the house calls it patience. People file her with Coin because of the glass. The gills are the whole identification. She is from Xochimilco, and she is a salamander.",
        "Axolotl. I kept the gills. I am a salamander.",
        "glass cistern",
        "dreamy",
    ),
    _entry(
        "toucan",
        "Ramphastos sulfuratus",
        "The bill arrives first: keel-shaped, painted like a fruit stall, and lighter than it looks — keratin over air. Black body, a yellow bib, a bird that follows the architecture.",
        "Not a hornbill. Hornbills are the Old-World cousins with a casque; Keel is a keel-billed toucan of the American canopy. Not a macaw. Quill's bill crushes. Keel's bill carries fruit and makes an entrance.",
        "Keel-billed toucan. The bill is the room. I am behind it.",
        "high shelf",
        "bold",
    ),
    _entry(
        "iguana",
        "Iguana iguana",
        "A green dewlap, a row of spines like a modest saw, and a third eye on the brow that watches the sun. He is a herbivore who treats stillness as a career. The wall is the correct chair.",
        "Not a chameleon — those change on purpose and keep tong-feet. Not a bearded dragon. Not Vesper. Sol is Iguana iguana, the green one, and he will move when the light asks. People also file him with dinosaurs. He declined the extinction.",
        "Green iguana. I blinked. Minutes will not record it.",
        "south wall",
        "still",
    ),
    _entry(
        "dragon",
        "kept, not collected",
        "Wings that fold like a letter. Scales that hold heat. Small enough for the mantel, large enough that the room rearranges around the tail. She could be larger. She chooses this.",
        "Sol is the living ornament: green, still, a dewlap, no fire. Vesper is the house's own — not a Komodo, not an iguana with a story, not a dinosaur we kept. Linnaeus does not file her. The mantel does.",
        "Desk dragon. I am the province. The iguana kept the wall.",
        "mantel",
        "proud",
    ),
    _entry(
        "phoenix",
        "kept in the ash",
        "A bird of ash and return. Gold at the throat, ember at the flight feathers. She does not stay gone. The hearth keeps a place, and she comes back kinder.",
        "Not a peacock. Not Quill with better lighting. Ember is the house relic — the firebird of the old stories, not a pheasant and not a parrot who learned a trick. If she goes, she will not stay gone.",
        "Phoenix. I come back. That is the species.",
        "hearth ash",
        "unhurried",
    ),
)


# Ten house snakes. Same tells as /snakes.
SNAKE_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "ball_python",
        "Python regius",
        "A small head on a thick body. Dark chocolate broken by gold puzzle-blotches — keepers call them alien heads. When the room is too much, she becomes a bun. That is the name.",
        "Lula the boa is the usual mistake: both are heavy and kind. Nori is African and shorter, and her marks are puzzles, not saddles. She balls. The boa holds.",
        "Ball python. I become a bun. That is how you know me.",
        "inkwell coil",
        "shy",
    ),
    _entry(
        "corn_snake",
        "Pantherophis guttatus",
        "Orange thread, black-edged saddles, and a belly like a checkerboard. A spear of darker scales sits on the head. Slim. Already looking for a gap.",
        "Copperheads wear hourglasses and a copper head; Saffron wears a spear and a checked belly. Some morphs get filed with milk snakes. She is a rat snake, not a rumor.",
        "Corn snake. Look at the belly. It is a checkerboard.",
        "pencil tray",
        "curious",
    ),
    _entry(
        "kingsnake",
        "Lampropeltis californiae",
        "Black and white, banded or striped, glossy as a ruler. The bands often meet under the belly. The head is barely a head — just more snake.",
        "Not a coral snake: there is no red on him. Not a racer, though the stripes lie. People also file him with milk snakes — cousins, both kings of a sort. He eats other snakes. That is the office.",
        "California kingsnake. Black and white. No red. I am not a rumor.",
        "ruler drawer",
        "bold",
    ),
    _entry(
        "green_tree_python",
        "Morelia viridis",
        "Emerald on a branch, folded into a saddle, head in the middle of the loop. Hatchlings come yellow or red and earn the green. Heat pits along the lips.",
        "The emerald tree boa is the classic twin: same jewelry, different continent. Jade is New Guinea. The boa is Amazon. Count the lip pits if you must; better to remember who sleeps like a bracelet.",
        "Green tree python. I sit like jewelry. The green is earned.",
        "lamp arm",
        "still",
    ),
    _entry(
        "hognose",
        "Heterodon nasicus",
        "The snout turns up like a little plow. Stout, blotched, keeled. When the room is too much, he flattens, hisses, then dies on his back with the mouth open. He gets over it.",
        "A young rattlesnake is the frightened guess — blotches and theater. No rattle. The upturned nose is the whole identification. Eastern hognose is a cousin with a milder shovel.",
        "Western hognose. The nose turns up. The death is optional.",
        "eraser dish",
        "dramatic",
    ),
    _entry(
        "garter",
        "Thamnophis sirtalis",
        "Three pale lines the length of a small errand — one down the spine, one on each flank — on a dark, keeled body. Often damp. Always mid-route.",
        "Ribbon snakes are the slim cousins: longer tail, cleaner sides, less checkering between the stripes. Young watersnakes get the same glance. Stripe is the garden one.",
        "Common garter. Three lines. I was already going.",
        "moss cup",
        "busy",
    ),
    _entry(
        "boa",
        "Boa constrictor",
        "A river of muscle. Tan saddles that rust toward the tail. A dark line through the eye. Heat pits. She does not hurry a coil.",
        "Nori is the other thick friend: African, smaller, a bun when pressed. Lula is American and longer. Anacondas are the wet rumor — same family, different job.",
        "Boa constrictor. Saddles that rust. I am the river, not the bun.",
        "blotter river",
        "steady",
    ),
    _entry(
        "milk_snake",
        "Lampropeltis gentilis",
        "Red, black, and cream in clean rings. Red touches black. A small glossy head. The Pueblo animals wear the colors like stamps. She borrows a warning and means lunch.",
        "Coral snakes are the rhyme people mutter: in the United States, red against yellow is the venomous one; red against black is the costume. The rhyme fails south of the border. She is a western milksnake from the Pueblo country — not a Micrurus.",
        "Milk snake. Red touches black. I borrowed the warning.",
        "stamp box",
        "witty",
    ),
    _entry(
        "rosy_boa",
        "Lichanura trivirgata",
        "Three wide stripes — rose, rust, or sand — on a slow, heavy little body. Smooth. A tail as blunt as a second thought. No theater.",
        "Rubber boas are the other small western boa: plain brown, with a tail that pretends to be a head. Blush wears the three lines. She is not a pink ball python.",
        "Rosy boa. Three stripes and no hurry.",
        "warm corner",
        "gentle",
    ),
    _entry(
        "carpet_python",
        "Morelia spilota cheynei",
        "Yellow and black like a map that refused to be neat — jagged, high-contrast, a carpet from the tablelands. Slimmer than a boa. Often up on an edge.",
        "Other carpet pythons wear quieter rugs: coastal, inland, diamond. The jungle form is the gold-and-ink highland one from Queensland. Not a kingsnake. The yellow is a country, not a band.",
        "Jungle carpet. The yellow is a map. Follow it.",
        "map shelf",
        "keen",
    ),
)

SEA_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "octopus",
        "Octopus vulgaris",
        "Eight arms, no bones, a bag of a body that can become a cup. Skin that tastes. Pupils like slits. When the room is too much, she jets, then crawls, then is the teacup.",
        "Not a squid — those keep a pen and two long clubs. Not a cuttlefish. Sepia hovers and flushes; Cup leaves an arm on the problem and hides in crockery. The ink is a door, not a mood.",
        "Common octopus. I taste with the arms. The cup is the tell.",
        "teacup hide",
        "clever",
    ),
    _entry(
        "cuttlefish",
        "Sepia officinalis",
        "A W of arms, a fin like a ruffle around the mantle, and a skin that rewrites itself. The cuttlebone is a private buoyancy. He hovers. Then he is another weather.",
        "Not an octopus. Cup crawls and hides; Sepia stays in the water column and changes the sentence. Not a squid. The W-arms and the ripple-fin are the whole identification. The ink is a name he keeps.",
        "Common cuttlefish. I flush. The W is the greeting.",
        "lamp ripple",
        "flicker",
    ),
    _entry(
        "nautilus",
        "Nautilus pompilius",
        "A coiled shell of chambers, nacre on the inside, a hood, and a fringe of tentacles without suckers. He jets. He rises by gas. The eye is a pinhole. The fossil refused to finish.",
        "Not an ammonite — those ended. Not a snail with a better publicist. Chamber is a cephalopod who kept the shell the others abandoned. Coin is a fish in a bowl. Chamber is a room that swims.",
        "Chambered nautilus. I rise. The rooms are the tell.",
        "paperweight",
        "ancient",
    ),
    _entry(
        "moon_jelly",
        "Aurelia aurita",
        "A saucer of a bell, four horseshoe moons in the jelly, a fringe of short tentacles. She pulses. She drifts. There is no brain to argue with. Not a fish. The water is the rest of her.",
        "Not a fish — no bones, no face that plans. Not a Portuguese man o' war, which is a colony and a rumor. Bell is Aurelia, the moon one, and the four moons in the bell are the whole identification.",
        "Moon jelly. I pulse. I am not a fish.",
        "glass of water",
        "vacant",
    ),
    _entry(
        "sea_star",
        "Pisaster ochraceus",
        "Five stout arms, ochre to rust, a center that is also a mouth. Tube feet in grooves. She clings. She can evert a stomach and call it lunch. Not a fish. The star is the animal.",
        "Not a fish, though the house once said starfish and was wrong. Not a brittle star — those are long, fast, and break on purpose. Ochre is the ochre sea star of the Pacific door. She stays.",
        "Ochre sea star. I cling. I am not a fish.",
        "damp blotter",
        "still",
    ),
    _entry(
        "hermit_crab",
        "Pagurus bernhardus",
        "A soft abdomen shopping for architecture. The European common hermit: right claw larger, walking legs, a borrowed whelk or, on this desk, a stamp lid. He measures. He trades. He walks the damp floor.",
        "Not a true crab — those grow their own roof. Ledger is the other not-crab, older, and he does not shop. Tenant is Pagurus bernhardus, intertidal, and the house is a lease he carries. Coin stayed in the bowl.",
        "Common hermit. I trade the lid. The abdomen is the tenant.",
        "stamp lid",
        "fussy",
    ),
    _entry(
        "horseshoe_crab",
        "Limulus polyphemus",
        "A helmet of a carapace, book-gills, a telson that is a rudder and not a sting, and blood that runs blue. He walks the sand. He molts the whole lid. He is not a crab. He is older than the word.",
        "Not a crab. Crabs are the short-tailed cousins with a fold; Ledger is a chelicerate — kin to spiders, if you must — who kept the sea. Not Tenant. Tenant shops. Ledger is the book. The telson does not sting.",
        "Horseshoe crab. I am not a crab. The book-gills are the tell.",
        "sand tray",
        "patient",
    ),
    _entry(
        "seahorse",
        "Hippocampus erectus",
        "A horse of a head on a plated body, a tail that wraps, a crown of spines. He hovers upright. The male keeps the brood. Lined: pale rings on a brown-olive hide. The pencil is a stem.",
        "Not a pipefish with a better posture — those stay long and horizontal. Not a fish who forgot to lie down. Anchor is the lined seahorse, Hippocampus erectus, and the hitch is the whole identification. He does not gallop.",
        "Lined seahorse. I hitch. The tail is a hand.",
        "pencil hitch",
        "upright",
    ),
    _entry(
        "manta",
        "Mobula alfredi",
        "Wings that became fins, a filter of a mouth, cephalic lobes like a polite mustache. She soars. She barrels. The reef manta is the smaller vast one — spots on the belly, a kite that stayed in the water.",
        "Not a stingray. Those keep a tail with an argument; Kite's tail is a polite ribbon. Not the giant manta of the open rumor — Mobula birostris. She is alfredi, the reef one, and the bowl is a sky she agreed to.",
        "Reef manta. I soar. The wings are the tell.",
        "sky of the bowl",
        "soaring",
    ),
    _entry(
        "moray",
        "Gymnothorax funebris",
        "A green ribbon of muscle in a crevice. The gape is how she breathes — a second set of jaws waits further in. No pectoral fins. The books make a reef. She darts, then is a door again.",
        "Not an eel of the river rumor, and not a snake. Lula holds; Door hides. The yawn is a mammal story she declined. Green moray: uniform olive, a face like a hinge, and the crevice is the species.",
        "Green moray. The gape is breath. I am the door.",
        "book crevice",
        "watchful",
    ),
)

FIELD_GUIDE: tuple[FieldGuide, ...] = HOUSE_GUIDE + SNAKE_GUIDE + SEA_GUIDE

_BY_KEY: dict[str, FieldGuide] = {g.key: g for g in FIELD_GUIDE}
_BY_SLUG: dict[str, FieldGuide] = {g.slug: g for g in FIELD_GUIDE}


def plaque_for(key: str | None) -> FieldGuide | None:
    if not key:
        return None
    return _BY_KEY.get(key)


def plaque_by_slug(slug: str | None) -> FieldGuide | None:
    if not slug:
        return None
    return _BY_SLUG.get(slug)


def classroom_for(key: str) -> Classroom:
    if is_snake(key):
        return Classroom(room="den", label="All ten in the den", verb="crawl")
    if is_sea(key):
        return Classroom(room="tide", label="All ten in the tide", verb="swim")
    return Classroom(room="house", label="The rest of the house", verb="walk")


def house_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in HOUSE_GUIDE)


def snake_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in SNAKE_GUIDE)


def sea_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in SEA_GUIDE)


def house_guide_complete() -> bool:
    return len(HOUSE_GUIDE) == len(HOUSE_KEYS) and all(k in _BY_KEY for k in HOUSE_KEYS)


def snake_guide_complete() -> bool:
    return len(SNAKE_GUIDE) == len(SNAKE_KEYS) and all(k in _BY_KEY for k in SNAKE_KEYS)


def sea_guide_complete() -> bool:
    return len(SEA_GUIDE) == len(SEA_KEYS) and all(k in _BY_KEY for k in SEA_KEYS)


def guide_complete() -> bool:
    return (
        house_guide_complete()
        and snake_guide_complete()
        and sea_guide_complete()
        and len(FIELD_GUIDE) == len(CATALOG_KEYS)
        and all(k in _BY_KEY for k in CATALOG_KEYS)
    )
