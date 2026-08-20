"""Field-guide plaques for the PyQt blotter.

Copy is ported from ``web/src/lib/pets/house-guide.ts`` and ``snake-guide.ts``.
This is not a new bestiary — the same ninety, taught here. Snakes keep the den
facts; the tide keeps the sea facts; the garden keeps the plant facts; the
hive keeps the insect facts; the cellar keeps the fungus facts; the far den
keeps the xenobiology facts; the twenty keep the study facts.
"""

from __future__ import annotations

from dataclasses import dataclass

from .species import BEE_KEYS, CATALOG_KEYS, FAR_KEYS, FUNGI_KEYS, GARDEN_KEYS, HOUSE_KEYS, INSECT_KEYS, SEA_KEYS, SNAKE_KEYS, SPECIES, is_bee, is_far, is_fungus, is_garden, is_insect, is_sea, is_snake


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

GARDEN_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "moss",
        "Hypnum cupressiforme",
        "A sheet of green scales, no flower, no true root — only rhizoids that cling. Cypress-moss: the felt of woods and walls. She carpets. She leans to the lamp. The blotter is a forest floor she agreed to.",
        "Not a flowering plant. Not a lichen — those are a fungus with an alga, a different kingdom. Felt is Hypnum cupressiforme, a moss, Plantae, and the carpet is the whole identification. She does not bloom. She does not commute.",
        "Sheet moss. I have no flower. The carpet is the tell.",
        "blotter felt",
        "patient",
    ),
    _entry(
        "maidenhair",
        "Adiantum capillus-veneris",
        "Black wiry stems, fanlets of pale green, a fiddlehead that unfurls like a sentence. Maidenhair: the Venus-hair fern of damp stone. She does not flower. The saucer is a cliff she borrowed.",
        "Not a flowering plant. Not a palm with smaller opinions. Vein is a fern — spores, not petals — Adiantum capillus-veneris, and the black stem is the tell. Sol is a lizard who basks. Vein unfurls and stays.",
        "Maidenhair fern. I unfurl. I do not flower.",
        "damp saucer",
        "shy",
    ),
    _entry(
        "ginkgo",
        "Ginkgo biloba",
        "Fan leaves with a notch, veins that do not net, gold when the desk turns autumn. A living fossil. He is not a flowering plant. The lamp is a season he wears.",
        "Not a maple with a better publicist — those have palmate leaves and flowers. Not an oak. Fan is Ginkgo biloba, the last of his line, and the fan is the whole identification. The gold is a season, not a mood.",
        "Ginkgo. I gold. The fan is the tell.",
        "lamp gold",
        "ancient",
    ),
    _entry(
        "oak",
        "Quercus alba",
        "A white oak who agreed to be a seedling: lobed leaves, pale bark starting, an acorn he may drop. A tree on a blotter. The dish is a forest he has not outgrown.",
        "Not a maple — those bleed sweet and keep a different leaf. Not Fan. Fan is a ginkgo and a living fossil; Mast is Quercus alba, the white oak of the eastern door, and the lobe is the tell. The acorn is a letter, not a toy.",
        "White oak. I drop. I agreed to be small.",
        "acorn dish",
        "steady",
    ),
    _entry(
        "water_lily",
        "Nymphaea odorata",
        "A round pad with a slit, a white bloom that opens for the lamp and closes for the night. Fragrant water lily. She floats. The ink dish is a pond she agreed to.",
        "Not a lotus — those hold the leaf above the water and keep a different center. Pad is Nymphaea odorata, the fragrant one, and the open is the tell. Coin stayed in the bowl. Pad is the floor of the dish.",
        "Fragrant water lily. I open. The pad is the floor.",
        "ink dish",
        "serene",
    ),
    _entry(
        "orchid",
        "Phalaenopsis amabilis",
        "Thick aerial roots, a spray of white moths that are flowers, a stem that will not sit in dirt like a rumor. Moth orchid. She blooms. The bark is a tree she borrowed.",
        "Not a moth. The moth is the flower's joke — Phalaenopsis, the moth-like one, amabilis. Not a lily. Pad floats; Moth hangs her roots in the air. The bloom is the tell. The dirt is optional.",
        "Moth orchid. I bloom. The roots are in the air.",
        "bark mount",
        "showy",
    ),
    _entry(
        "saguaro",
        "Carnegiea gigantea",
        "A young column of ribs and spines, green, storing rain, an arm that has not arrived. Saguaro: a cactus of the Sonoran door. He sits the tray. He is not a tree with opinions.",
        "Not a tree. Trees keep wood and a different thirst; Arm is Carnegiea gigantea, a cactus, and the store is the species. Not a succulent of the windowsill rumor with no spines. He works the night. The day is for sitting.",
        "Saguaro. I store. I am a cactus, not a tree.",
        "sand tray",
        "still",
    ),
    _entry(
        "venus_flytrap",
        "Dionaea muscipula",
        "A rosette of hinged leaves, teeth like a polite fence, two hairs that must agree. Venus flytrap: a wetland plant of poor soil. She snaps. She is not a monster. The cup is a bog.",
        "Not a monster. Not Well — Well drowns, a leaf that became a pitfall. Not Dew — Dew glues and curls. Snap is Dionaea muscipula, the Carolina door, and two hairs are the law. Three hunts. Three plants.",
        "Venus flytrap. Two hairs, then the trap. I snap. I am a plant.",
        "wetland cup",
        "watchful",
    ),
    _entry(
        "pitcher",
        "Sarracenia purpurea",
        "Short wine-purple pitchers, heavy veins, a hood that does not close, rain sitting in the well. Purple pitcher plant of northern bogs. He drowns. The leaf became a hole. The cup is a bog.",
        "Not a flytrap with a cup glued on. Snap hinges; Well is Sarracenia purpurea, a passive pitfall, and the water is the method. Not Dew. Dew glitters and curls. He does not chase. The well is enough.",
        "Purple pitcher plant. A leaf that became a well. I drown.",
        "bog cup",
        "patient",
    ),
    _entry(
        "sundew",
        "Drosera rotundifolia",
        "Round pads on thin stalks, red tentacles, a drop of glue on each hair, a curl that takes its time. Round-leaved sundew of peat and light. She glues. She is not a door.",
        "Not a flytrap. Snap slams; Dew is Drosera rotundifolia, mucilage and a slow curl. Not Well. Well is a pitfall that waits with water. Three hunts on this blotter: snap, drown, glue.",
        "Round-leaved sundew. Tentacles, then a curl. I glue.",
        "peat saucer",
        "slow",
    ),
)

INSECT_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "honeybee",
        "Apis mellifera",
        "Gold bands, a pollen basket, a waggle that points. Western honey bee. She dances. The dance is a map — direction, distance, a flower she will not waste. The wax dish is a meadow she agreed to.",
        "Not a fly. Not a wasp with a thinner waist and a worse temper. Comb is Apis mellifera, a bee, Insecta, and the waggle is the whole identification. She does not guess. She maps.",
        "Honey bee. A dance that is a map.",
        "wax dish",
        "busy",
    ),
    _entry(
        "monarch",
        "Danaus plexippus",
        "Orange panes, black veins, white spots on the rim. Monarch. She ate milkweed as a caterpillar. The orange is a warning she earned — bitter, honest, not a costume. The cup is a prairie she has not outgrown.",
        "Not a viceroy with a borrowed coat. Not Milk the snake — Coral wears a warning she does not mean. Milk the butterfly means it. Danaus plexippus, and the milkweed is the law. The orange is not a mood.",
        "Monarch. Milkweed first. The orange is a warning she earned.",
        "milkweed cup",
        "steadfast",
    ),
    _entry(
        "luna",
        "Actias luna",
        "Lime-green wings, long tails, eyespots like a polite moon. Luna moth. The adult has no mouth. One week. She does not eat. The lamp is a dusk she agreed to.",
        "Not a monarch with extra tails. Milk keeps orange and a warning; Ghost is Actias luna, pale, tailed, and finished with food. Not a luna of the rumor with a sip. She has no mouth. The week is the species.",
        "Luna moth. The adult has no mouth. One week. She does not eat.",
        "lamp dusk",
        "brief",
    ),
    _entry(
        "firefly",
        "Photinus pyralis",
        "Soft elytra, a lamp in the tail, a flash that is a sentence. Common eastern firefly. She is a beetle. The dusk is a grammar she keeps. The blotter is a meadow after dark.",
        "Not a fly. Flies keep two wings and no lamp; Spark is Photinus pyralis, a beetle, Lampyridae, and the flash is the tell. Not a glowworm of the rumor with no wings. She lifts. She speaks in light.",
        "Firefly. A language of light. Beetle, not a fly.",
        "ink dusk",
        "signaling",
    ),
    _entry(
        "darner",
        "Anax junius",
        "A green needle, a bull's-eye on the forehead, wings that do not fold flat. Common green darner. She hawks. The nymph is a different animal in the water. The lamp is a sky she agreed to.",
        "Not a damselfly — those rest with wings together and keep a thinner needle. Not the nymph. The nymph hunted in a cup; Dart is Anax junius, the adult, aerial, and the hawk is the tell. She does not commute to the pond.",
        "Green darner. The nymph is a different animal in the water.",
        "lamp air",
        "hunting",
    ),
    _entry(
        "stick",
        "Diapheromera femorata",
        "A brown twig with joints, thread legs, a freeze that works. Common walkingstick. She is furniture until she walks. The pencil tray is a forest she borrowed.",
        "Not a twig. Not a millipede — those keep many legs and a different kingdom. Twig is Diapheromera femorata, a phasmid, Insecta, and the freeze is the whole identification. She does not hurry. She is the pencil until she isn't.",
        "Walkingstick. Furniture until it walks.",
        "pencil tray",
        "still",
    ),
    _entry(
        "carpenter_ant",
        "Camponotus pennsylvanicus",
        "A black column, a heart-shaped head, a scent road she will not waste. Black carpenter ant. She nests in wood. She does not eat the house. The grain is a city she agreed to.",
        "Not a termite. Termites eat the beam; Column is Camponotus pennsylvanicus, and the nest is a room in wood already kind. Not a pavement ant with smaller opinions. The trail is the tell. She does not dine on the desk.",
        "Carpenter ant. A scent road. She does not eat the house; she nests in it.",
        "wood grain",
        "orderly",
    ),
    _entry(
        "ladybird",
        "Coccinella septempunctata",
        "Red elytra, seven black spots, a bead that hunts. Seven-spot ladybird. She eats aphids. She is a beetle. The dish is a leaf she agreed to.",
        "Not a luck charm. Not a fly with a better publicist. Seven is Coccinella septempunctata, a beetle, and the count is the species. Not Spark — Spark flashes; Seven hunts. Aphids. Seven spots. A beetle.",
        "Ladybird. Seven spots. She eats aphids. A beetle.",
        "leaf dish",
        "tidy",
    ),
    _entry(
        "mantis",
        "Tenodera sinensis",
        "A long green hinge, raptorial arms folded, a face that turns. Chinese mantis — the common desk one. She hunts. The prayer is a trap. The stem is a perch she borrowed.",
        "Not a plant. Snap, Well, and Dew hunt on the garden blotter and remain plants. Fold is Tenodera sinensis, an insect, and the fold is the tell. Not a leaf with opinions. The prayer is a trap she earned.",
        "Chinese mantis. The prayer is a trap. An insect that hunts — not a plant.",
        "blotter stem",
        "watchful",
    ),
    _entry(
        "cicada",
        "Magicicada septendecim",
        "Red eyes, a black body, a song written underground. Periodical cicada. Seventeen years in the dark. Then she emerges. Then she sings. The inkstone is a door she agreed to.",
        "Not a fly. Not a locust of the rumor — locusts are grasshoppers who travel. Brood is Magicicada septendecim, a cicada, and the wait is the species. She sits. Then a burst. Seventeen years. Then a song.",
        "Periodical cicada. Seventeen years underground, then a song.",
        "inkstone",
        "patient",
    ),
)

BEE_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "bumblebee",
        "Bombus impatiens",
        "A round furred body, a louder wing, pollen in the fur. Common eastern bumble bee. She keeps a smaller nest. The moss cup is a meadow she agreed to.",
        "Not Comb. Comb is Apis mellifera, a honey bee with a waggle and a dish of wax. Thrum is Bombus impatiens. A bumblebee is not a honey bee. The fur is the tell. The nest is small.",
        "Bumblebee. Not a honey bee. She keeps a smaller nest.",
        "moss cup",
        "steady",
    ),
    _entry(
        "carpenter_bee",
        "Xylocopa virginica",
        "A furred thorax, a bare shining abdomen, a hole in wood. Eastern carpenter bee. She nests in a gallery. The pencil tray is a beam she agreed to.",
        "Not Comb. Comb keeps honey in hex cells. Auger is Xylocopa virginica. A carpenter bee does not keep honey the honey-bee way. She drinks. She does not store. The hole is the office.",
        "Carpenter bee. She nests in wood. No honey the honey-bee way.",
        "pencil tray",
        "boring",
    ),
    _entry(
        "mason_bee",
        "Osmia lignaria",
        "A blue-black abdomen, mud on the mandibles, cells in a reed. Blue orchard mason. She works alone. The inkstone is a wall she agreed to.",
        "Not a hive bee. Not Comb with a colony. Mortar is Osmia lignaria, solitary, and the mud is the tell. One bee. One nest. No queen over workers.",
        "Mason bee. Solitary. Mud cells. Not a hive.",
        "inkstone rim",
        "solitary",
    ),
    _entry(
        "leafcutter",
        "Megachile rotundata",
        "A disc of leaf in the mandibles, pollen under the abdomen. Alfalfa leafcutter. She lines a tube. The leaf dish is a nest she agreed to.",
        "Not Comb. Comb maps a flower. Disc is Megachile rotundata. The disc is the wall. The pollen rides the abdomen, not a hind-leg basket Comb would know. Solitary.",
        "Leafcutter. A disc of leaf. A solitary cell.",
        "leaf dish",
        "precise",
    ),
    _entry(
        "stingless",
        "Melipona beecheii",
        "A small dark body, wax-and-resin pots, no sting. Maya stingless bee. She keeps a colony. The pot is the store.",
        "Not Comb's hex comb. Comb is Apis. Pot is Melipona beecheii. Pots, not comb. No sting. A different hive. Do not file her as a honey bee with the sting filed off.",
        "Stingless bee. Pots, not comb. She does not sting.",
        "wax pot",
        "gentle",
    ),
    _entry(
        "sweat_bee",
        "Agapostemon virescens",
        "A metallic green thorax, a banded abdomen, a small bright hover. Bicolored sweat bee. She is often solitary. The lamp rim is a meadow she agreed to.",
        "Not Comb. Not a honey bee that learned to shine. Sheen is Agapostemon virescens. Metallic. Often alone. No dish of wax. Sweat is a mineral she will take. Nectar is the meal.",
        "Sweat bee. Metallic. Often solitary. Not Comb.",
        "lamp rim",
        "bright",
    ),
    _entry(
        "mining_bee",
        "Andrena vicina",
        "A brown-and-cream miner, a hole in the ground, a neighbor on the bank. Neighborly mining bee. Each bee her own burrow. The sand tray is a bank she agreed to.",
        "Not a hive. Neighbors may share a bank. Each hole is hers. Bank is Andrena vicina. Not Comb. Not a colony on the blotter. The ground is the nest.",
        "Mining bee. A ground nest. Not a hive.",
        "sand tray",
        "burrowing",
    ),
    _entry(
        "honey_drone",
        "Apis mellifera",
        "Larger than Comb. Eyes that meet. No pollen basket. No sting. Western honey bee drone. He hums. The workers feed him.",
        "A drone is not a worker. He is not Comb. Comb forages and dances. Hum is the same species, a different caste. He does not work the flower. He does not keep a nest.",
        "Drone. Not a worker. No sting. No pollen basket.",
        "wax dish",
        "idle",
    ),
    _entry(
        "honey_queen",
        "Apis mellifera",
        "Longer than Comb. The abdomen is the work. She walks the comb. Western honey bee queen. She lays. The workers bring jelly.",
        "The queen is not a second Comb. Comb forages. Keep lays. One queen. Same species, a different office. She does not dance a map. She does not leave for flowers.",
        "Queen. Not a second Comb. She lays. She does not forage.",
        "wax heart",
        "laid",
    ),
    _entry(
        "honeycomb",
        "Apis mellifera nest",
        "Hex cells. Brood in some. Stores in others. Honeycomb. The nest as a place. Wax sits. The bees walk on it.",
        "Not Comb the bee. Comb is one guest. Wax is the nest. Many bees, one comb. A colony is many bees, one nest. The line can stay or go quiet if neglected. It is not a shop.",
        "Honeycomb. Many bees, one nest. The line can go quiet.",
        "wax dish",
        "shared",
    ),
)

FUNGI_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "oyster",
        "Pleurotus ostreatus",
        "Cream shelves stacked like plates, a short lateral stem, gills that run down. Oyster mushroom. She fruits on dead wood. She eats what has finished. The shelf is a log she agreed to.",
        "Not a plant. Plants keep chlorophyll and a different kingdom; Frill is Pleurotus ostreatus, a fungus, and the shelf is the tell. Not a turkey tail — those keep pores and zones. She decomposes. She does not photosynthesize.",
        "Oyster mushroom. A shelf that eats the dead wood.",
        "dead-wood shelf",
        "quiet",
    ),
    _entry(
        "fly_agaric",
        "Amanita muscaria",
        "A red cap with white warts, white gills, a skirt on the stem, a volva at the base like a cup she has not left. Fly agaric. She is mycorrhizal. She trades with roots. The cup is a moss she agreed to.",
        "Not lunch. The red is a warning, not a costume. Cap is Amanita muscaria: white gills, a skirt, a volva. Not a puffball — cut a young one and an Amanita can hide inside a pearl. A warning. Not a meal.",
        "Fly agaric. White gills, a skirt, a volva. A warning, not lunch.",
        "moss cup",
        "plain",
    ),
    _entry(
        "morel",
        "Morchella americana",
        "A tan cone of pits, a honeycomb that is a room, hollow from cap to stem. American morel. She is a lattice. The mold is a spring she agreed to.",
        "Not a false morel. Those keep a wrinkled brain and are stuffed, not hollow. Lattice is Morchella americana: cut her and she is a room. Not a recolored amanita. The pits are the species.",
        "American morel. A hollow honeycomb. Not a false morel.",
        "leaf mold",
        "seasonal",
    ),
    _entry(
        "chanterelle",
        "Cantharellus cibarius",
        "A gold vase, ridges that fork and run down the stem, an apricot she will not waste. Golden chanterelle. False gills. The rim is a moss she agreed to.",
        "Not the jack-o’-lantern. Omphalotus glows on wood and keeps true gills that do not fork; Horn is Cantharellus cibarius, and the fork is the tell. The lantern is not a guest here. Learn her on the plaque. Do not take the twin home.",
        "Golden chanterelle. False gills that fork. Not the jack-o’-lantern.",
        "moss rim",
        "fragrant",
    ),
    _entry(
        "turkey_tail",
        "Trametes versicolor",
        "Thin fans, color in zones, a white pore face if you turn her over. Turkey tail. A bracket. Not a turkey. The grain is a log she agreed to.",
        "Not a turkey. Not an oyster — Frill keeps gills; Ring is Trametes versicolor, pores not gills, and the zones are the years. Turn her over. The pore is the identification.",
        "Turkey tail. Thin, zoned, pores not gills. A bracket, not a turkey.",
        "wood grain",
        "zoned",
    ),
    _entry(
        "lions_mane",
        "Hericium erinaceus",
        "A white cascade of teeth, no cap, no gills, a beard on a wound in the wood. Lion's mane. She hangs. The wound is a door she agreed to.",
        "Not a lion. Not a puffball. Mane is Hericium erinaceus: teeth, not gills. A beard, not a shelf. She fruits from a wound. That is the whole office.",
        "Lion's mane. Teeth, not gills. A beard on a wound in the wood.",
        "wound in wood",
        "bearded",
    ),
    _entry(
        "puffball",
        "Lycoperdon perlatum",
        "A pearly globe with tiny warts, a pore at the top, a puff then a cloud. Common puffball. She sits. Then she bursts. The dish is a meadow she agreed to.",
        "Not a young Amanita. Cut a puffball and it is a room of white; cut a button Amanita and you find gills and a volva hiding. Puff is Lycoperdon perlatum. The cut is the law. Cap taught the warning. Puff teaches the check.",
        "Common puffball. A puff, then a cloud. Cut a young one.",
        "duff dish",
        "brief",
    ),
    _entry(
        "chicken_of_woods",
        "Laetiporus sulphureus",
        "Overlapping sulfur-orange shelves, a soft edge, no gills, oak underneath. Chicken of the woods. She is a bracket. The oak is a host she agreed to.",
        "Not a chicken. The name is a rumor of supper. Flame is Laetiporus sulphureus, sulfur shelves on oak, and the layer is the tell. Not Frill — Frill is cream and eats finished wood. Flame keeps the sulfur.",
        "Chicken of the woods. Sulfur shelves on oak. Not a chicken.",
        "oak shelf",
        "sulfur",
    ),
    _entry(
        "yeast",
        "Saccharomyces cerevisiae",
        "A jar, a foam, a few cells that rise. Baker's yeast. You cannot see her until the bread. The house already knows bread. The crock is a loaf she agreed to.",
        "Not a plant. Not a mushroom with a cap glued on. Starter is Saccharomyces cerevisiae, a fungus, and the rise is the species. She barely walks. She rises in place. The loaf is the identification.",
        "Baker's yeast. A fungus you cannot see until the bread.",
        "bread crock",
        "busy",
    ),
    _entry(
        "lichen",
        "Cladonia rangiferina",
        "A pale branching shrub on stone, no cap, no gills, a guest that is already a treaty. Reindeer lichen. She sits. The stone is a tundra she agreed to.",
        "Not one creature. Not a moss — Felt is a plant; Pact is a fungus and a partner, alga or cyanobacterium, two kingdoms in one guest. Ledger taught not a crab. Pact teaches not one. The share is the tell.",
        "Reindeer lichen. Not one creature. A fungus and a partner.",
        "lamp stone",
        "shared",
    ),
)

FAR_GUIDE: tuple[FieldGuide, ...] = (
    _entry(
        "photovore",
        "Lucivora sitim",
        "A mouthless body of glass and thirst, hovering at the lamp. Lamp-drinker. She drinks a wavelength. The glass is a lamp she agreed to.",
        "Not a firefly. Spark is a beetle; Gleam is Lucivora sitim, and the thirst is the tell. No mouth. No flash of courtship. Hunger is a wavelength.",
        "Lamp-drinker. Drinks lamp-light. No mouth. Hunger is a wavelength.",
        "lamp glass",
        "thirsty",
    ),
    _entry(
        "choir",
        "Harmonia plexus",
        "A body that is already a chord, overtones stacked like ribs. Chord body. She speaks in many notes. The air is a score she agreed to.",
        "Not a whale. Not a choir of people. Choir is Harmonia plexus: one animal, many notes. The overtone is the species. Do not count the room.",
        "Chord body. One animal, many notes.",
        "blotter air",
        "harmonic",
    ),
    _entry(
        "nimbus",
        "Nimbus methanei",
        "A cold-gas sack from a methane sea, trailing streamers of weather, not tentacles. Methane floater. She hovers. The bowl is a sea she agreed to breathe.",
        "Not a jellyfish. Bell is Aurelia, a moon jelly of Earth; Drift is Nimbus methanei, and the air is the water. A sack of cold. Not a bell.",
        "Methane floater. The air is the water.",
        "cold bowl",
        "vacant",
    ),
    _entry(
        "silica",
        "Silica crescit",
        "A crystal that chose to live, planes like leaves she will shed. Living crystal. She grows by faceting. The stone is a vein she agreed to.",
        "Not quartz. Not a plant. Shard is Silica crescit: a mineral with a hunger. The facet is the tell. She sheds a crystal the way a tree sheds a leaf, and is still not a tree.",
        "Living crystal. A mineral that chose to live.",
        "inkstone",
        "patient",
    ),
    _entry(
        "terminator",
        "Limitor cursor",
        "A thin walker of the twilight belt, half in lamp, half in dark. Twilight walker. Noon kills. Night starves. The rim is the country.",
        "Not a cat claiming a sun-patch. Miso keeps the ledge; Dusk is Limitor cursor, and the belt is the whole map. The rim is not a mood. It is the habitat.",
        "Twilight walker. Noon kills, night starves; the rim is the country.",
        "lamp-edge",
        "rim-bound",
    ),
    _entry(
        "nexus",
        "Nexus colonis",
        "A colony that walks as one guest, nodes counted and then named. Walking colony. Many animals. One name. The weight is a walk they agreed to.",
        "Not a siphonophore of Earth, though that is the rhyme. Knot is Nexus colonis: many animals, one name, and the count is the tell. Pact taught not one. Knot teaches many, then one.",
        "Walking colony. Many animals, one name.",
        "paperweight",
        "many",
    ),
    _entry(
        "halovore",
        "Halovora brina",
        "A salt-drinker who leaves a frost of waste on the dish. Salt-drinker. Water is optional. Brine is the blood. The dish is a sea she agreed to drink dry.",
        "Not a crab. Not Ledger — Ledger is a horseshoe with book-gills. Brine is Halovora brina, and the frost is the waste. Water is optional here.",
        "Salt-drinker. Water is optional; brine is the blood.",
        "salt dish",
        "dry",
    ),
    _entry(
        "magneton",
        "Magneton natare",
        "A needle that swims a field the way a fish swims current. Field swimmer. North is food. The line is a current she agreed to.",
        "Not a compass. Not a manta — Kite is the reef guest. Beacon is Magneton natare, and the axis is the tell. She darts along a line. She does not soar a bowl.",
        "Field swimmer. North is food.",
        "ruler line",
        "aligned",
    ),
    _entry(
        "umbral",
        "Umbralentis quietis",
        "A heat-shadow that feeds on waste warmth and the cool that follows. Heat shadow. The lamp is loud. The cool is lunch. The shadow is a meal she agreed to.",
        "Not a moth. Moth is an orchid on bark; Hush is Umbralentis quietis, and the dim is the species. She does not eat a flower. She eats the leftover heat.",
        "Heat shadow. The lamp is loud; the cool is lunch.",
        "lamp shadow",
        "quiet",
    ),
    _entry(
        "cyst",
        "Arca vagans",
        "A sealed traveler, a seed of a body, waiting for lamp and damp to agree. Traveling cyst. Most of a life is the wait. The blotter is a wait she agreed to.",
        "Not Brood the cicada, though they both wait. Arca is Arca vagans: a cyst that travels, and the seal is the tell. Brood sings after seventeen years. Arca wakes when the lamp and the damp agree.",
        "Traveling cyst. Most of a life is the wait.",
        "damp blotter",
        "waiting",
    ),
)

FIELD_GUIDE: tuple[FieldGuide, ...] = HOUSE_GUIDE + SNAKE_GUIDE + SEA_GUIDE + GARDEN_GUIDE + INSECT_GUIDE + BEE_GUIDE + FUNGI_GUIDE + FAR_GUIDE

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
    if is_garden(key):
        return Classroom(room="garden", label="All ten in the garden", verb="grow")
    if is_insect(key):
        return Classroom(room="hive", label="All ten in the hive", verb="stay")
    if is_bee(key):
        return Classroom(room="hive", label="The hive. Bees and comb.", verb="stay")
    if is_fungus(key):
        return Classroom(room="cellar", label="All ten in the cellar", verb="stay")
    if is_far(key):
        return Classroom(room="far", label="All ten in the far den", verb="stay")
    return Classroom(room="house", label="The rest of the house", verb="walk")


def house_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in HOUSE_GUIDE)


def snake_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in SNAKE_GUIDE)


def sea_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in SEA_GUIDE)


def garden_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in GARDEN_GUIDE)


def insect_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in INSECT_GUIDE)


def bee_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in BEE_GUIDE)


def fungi_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in FUNGI_GUIDE)


def far_guide_keys() -> tuple[str, ...]:
    return tuple(g.key for g in FAR_GUIDE)


def house_guide_complete() -> bool:
    return len(HOUSE_GUIDE) == len(HOUSE_KEYS) and all(k in _BY_KEY for k in HOUSE_KEYS)


def snake_guide_complete() -> bool:
    return len(SNAKE_GUIDE) == len(SNAKE_KEYS) and all(k in _BY_KEY for k in SNAKE_KEYS)


def sea_guide_complete() -> bool:
    return len(SEA_GUIDE) == len(SEA_KEYS) and all(k in _BY_KEY for k in SEA_KEYS)


def garden_guide_complete() -> bool:
    return len(GARDEN_GUIDE) == len(GARDEN_KEYS) and all(k in _BY_KEY for k in GARDEN_KEYS)


def insect_guide_complete() -> bool:
    return len(INSECT_GUIDE) == len(INSECT_KEYS) and all(k in _BY_KEY for k in INSECT_KEYS)


def bee_guide_complete() -> bool:
    return len(BEE_GUIDE) == len(BEE_KEYS) and all(k in _BY_KEY for k in BEE_KEYS)


def fungi_guide_complete() -> bool:
    return len(FUNGI_GUIDE) == len(FUNGI_KEYS) and all(k in _BY_KEY for k in FUNGI_KEYS)


def far_guide_complete() -> bool:
    return len(FAR_GUIDE) == len(FAR_KEYS) and all(k in _BY_KEY for k in FAR_KEYS)


def guide_complete() -> bool:
    return (
        house_guide_complete()
        and snake_guide_complete()
        and sea_guide_complete()
        and garden_guide_complete()
        and insect_guide_complete()
        and bee_guide_complete()
        and fungi_guide_complete()
        and far_guide_complete()
        and len(FIELD_GUIDE) == len(CATALOG_KEYS)
        and all(k in _BY_KEY for k in CATALOG_KEYS)
    )
