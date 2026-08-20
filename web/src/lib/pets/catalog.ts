export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";

export type Species = {
  key: string;
  displayName: string;
  rarity: Rarity;
  temperament: string;
  habitat: string;
  blurb: string;
};

/** Wire catalog — keys match RicheyWorks/computerpets `PetType`. */
export const SPECIES: Species[] = [
  { key: "red_panda", displayName: "Red Panda", rarity: "COMMON", temperament: "Curious", habitat: "Study rafters", blurb: "The house default. Climbs bookshelves and steals ribbon." },
  { key: "cat", displayName: "Cat", rarity: "COMMON", temperament: "Aloof", habitat: "Window ledge", blurb: "Judges your code reviews from a sun-warmed cushion." },
  { key: "dog", displayName: "Dog", rarity: "COMMON", temperament: "Loyal", habitat: "Hearth rug", blurb: "Follows the cursor. Believes every compile is a walk." },
  { key: "rabbit", displayName: "Rabbit", rarity: "COMMON", temperament: "Timid", habitat: "Under-desk warren", blurb: "Thumps when the linter fails. Soft, then gone." },
  { key: "hamster", displayName: "Hamster", rarity: "COMMON", temperament: "Busy", habitat: "Drawer nest", blurb: "Hoards paperclips. Runs the night shift." },
  { key: "guinea_pig", displayName: "Guinea Pig", rarity: "COMMON", temperament: "Sociable", habitat: "Lettuce bowl", blurb: "Wheeks at deploy time. Requires salad diplomacy." },
  { key: "turtle", displayName: "Turtle", rarity: "COMMON", temperament: "Patient", habitat: "Inkstone dish", blurb: "Older than your repo. Will outlive the framework." },
  { key: "goldfish", displayName: "Goldfish", rarity: "COMMON", temperament: "Serene", habitat: "Brass bowl", blurb: "Circles the same thought. Very honest about it." },
  { key: "budgie", displayName: "Budgie", rarity: "COMMON", temperament: "Chatty", habitat: "Lamp shade", blurb: "Repeats error messages in a nicer voice." },
  { key: "fox", displayName: "Fox", rarity: "UNCOMMON", temperament: "Clever", habitat: "Coat closet", blurb: "Finds bugs you meant to hide. Smug about it." },
  { key: "penguin", displayName: "Penguin", rarity: "UNCOMMON", temperament: "Formal", habitat: "Cold tile", blurb: "Wears the house dress code. Approves of rituals." },
  { key: "parrot", displayName: "Parrot", rarity: "UNCOMMON", temperament: "Theatrical", habitat: "Hat stand", blurb: "Quotes your commit messages back at you." },
  { key: "ferret", displayName: "Ferret", rarity: "UNCOMMON", temperament: "Mischief", habitat: "Cable run", blurb: "Steals dongles. Returns them rearranged." },
  { key: "hedgehog", displayName: "Hedgehog", rarity: "UNCOMMON", temperament: "Guarded", habitat: "Knit basket", blurb: "Uncurls only for people who wait." },
  { key: "chinchilla", displayName: "Chinchilla", rarity: "UNCOMMON", temperament: "Fastidious", habitat: "Dust bath", blurb: "Will not sit on a messy desk. Correct." },
  { key: "axolotl", displayName: "Axolotl", rarity: "RARE", temperament: "Dreamy", habitat: "Glass cistern", blurb: "Regrows patience. Stares through the glass like a monk." },
  { key: "toucan", displayName: "Toucan", rarity: "RARE", temperament: "Bold", habitat: "High shelf", blurb: "The bill arrives first. The bird follows." },
  { key: "iguana", displayName: "Iguana", rarity: "RARE", temperament: "Still", habitat: "South wall", blurb: "A living ornament. Moves once per meeting." },
  { key: "dragon", displayName: "Dragon", rarity: "LEGENDARY", temperament: "Proud", habitat: "Mantel", blurb: "Small enough for a desk. Large enough for the room." },
  { key: "phoenix", displayName: "Phoenix", rarity: "LEGENDARY", temperament: "Unhurried", habitat: "Hearth ash", blurb: "Burns down and comes back kinder. The house relic." },
  { key: "ball_python", displayName: "Ball Python", rarity: "COMMON", temperament: "Shy", habitat: "Inkwell coil", blurb: "Makes a bun of herself and guards the inkwell." },
  { key: "corn_snake", displayName: "Corn Snake", rarity: "COMMON", temperament: "Curious", habitat: "Pencil tray", blurb: "Threads the blotter like a sentence you meant to finish." },
  { key: "kingsnake", displayName: "California Kingsnake", rarity: "UNCOMMON", temperament: "Bold", habitat: "Ruler drawer", blurb: "Wears the house in bands. Inspects other snakes for sport." },
  { key: "green_tree_python", displayName: "Green Tree Python", rarity: "RARE", temperament: "Still", habitat: "Lamp arm", blurb: "Sleeps in a saddle on the lamp arm. Emerald on purpose." },
  { key: "hognose", displayName: "Western Hognose", rarity: "UNCOMMON", temperament: "Dramatic", habitat: "Eraser dish", blurb: "Plays dead when the compile fails. Then gets hungry." },
  { key: "garter", displayName: "Common Garter", rarity: "COMMON", temperament: "Busy", habitat: "Moss cup", blurb: "Patrols the moss cup. Small, striped, always on a route." },
  { key: "boa", displayName: "Boa Constrictor", rarity: "RARE", temperament: "Steady", habitat: "Blotter river", blurb: "Holds the blotter the way a river holds a stone." },
  { key: "milk_snake", displayName: "Pueblo Milk Snake", rarity: "UNCOMMON", temperament: "Witty", habitat: "Stamp box", blurb: "Wears a warning she does not mean. Then asks for an egg." },
  { key: "rosy_boa", displayName: "Rosy Boa", rarity: "UNCOMMON", temperament: "Gentle", habitat: "Warm corner", blurb: "Nests in the warm corner and refuses to hurry." },
  { key: "carpet_python", displayName: "Jungle Carpet Python", rarity: "RARE", temperament: "Keen", habitat: "Map shelf", blurb: "Yellow and black cartography. Claims the shelf as a jungle." },
  { key: "octopus", displayName: "Common Octopus", rarity: "UNCOMMON", temperament: "Clever", habitat: "Teacup hide", blurb: "Tastes the blotter with an arm, then hides in a cup." },
  { key: "cuttlefish", displayName: "Common Cuttlefish", rarity: "UNCOMMON", temperament: "Flicker", habitat: "Lamp ripple", blurb: "Chromatophores rewrite the blotter. W-arms, then a hover." },
  { key: "nautilus", displayName: "Chambered Nautilus", rarity: "RARE", temperament: "Ancient", habitat: "Paperweight", blurb: "Rises by gas and memory. Tentacle fringe, then a hover." },
  { key: "moon_jelly", displayName: "Moon Jelly", rarity: "COMMON", temperament: "Vacant", habitat: "Glass of water", blurb: "No brain. Four moons in the bell. Still a guest." },
  { key: "sea_star", displayName: "Ochre Sea Star", rarity: "COMMON", temperament: "Still", habitat: "Damp blotter", blurb: "Everts a stomach and calls it lunch. Not a fish." },
  { key: "hermit_crab", displayName: "Common Hermit", rarity: "COMMON", temperament: "Fussy", habitat: "Stamp lid", blurb: "Tries the inkwell cap, the stamp box, your thimble." },
  { key: "horseshoe_crab", displayName: "Atlantic Horseshoe Crab", rarity: "UNCOMMON", temperament: "Patient", habitat: "Sand tray", blurb: "Book-gills, a telson, blue blood. A living fossil on the sand." },
  { key: "seahorse", displayName: "Lined Seahorse", rarity: "UNCOMMON", temperament: "Upright", habitat: "Pencil hitch", blurb: "Hovers like a question mark. Tail-wraps the pencil. Broods." },
  { key: "manta", displayName: "Reef Manta", rarity: "RARE", temperament: "Soaring", habitat: "Sky of the bowl", blurb: "Filters the lamp-light. Barrels when the compile is kind." },
  { key: "moray", displayName: "Green Moray", rarity: "RARE", temperament: "Watchful", habitat: "Book crevice", blurb: "Hides in a crevice. The mouth is not a yawn." },
  { key: "moss", displayName: "Sheet Moss", rarity: "COMMON", temperament: "Patient", habitat: "Blotter felt", blurb: "Carpets the blotter. No flowers. No true roots. Still a guest." },
  { key: "maidenhair", displayName: "Maidenhair Fern", rarity: "UNCOMMON", temperament: "Shy", habitat: "Damp saucer", blurb: "Unfurls black-stemmed fans. Not a flowering plant." },
  { key: "ginkgo", displayName: "Ginkgo", rarity: "RARE", temperament: "Ancient", habitat: "Lamp gold", blurb: "Fan leaves. Gold in the autumn of the desk. Not a flowering plant." },
  { key: "oak", displayName: "White Oak", rarity: "COMMON", temperament: "Steady", habitat: "Acorn dish", blurb: "A white oak seedling. Drops an acorn when the compile is kind." },
  { key: "water_lily", displayName: "Fragrant Water Lily", rarity: "UNCOMMON", temperament: "Serene", habitat: "Ink dish", blurb: "Floats the ink dish. Opens when the lamp is kind." },
  { key: "orchid", displayName: "Moth Orchid", rarity: "RARE", temperament: "Showy", habitat: "Bark mount", blurb: "Phalaenopsis. Roots in the air. Blooms like a moth that stayed." },
  { key: "saguaro", displayName: "Saguaro", rarity: "RARE", temperament: "Still", habitat: "Sand tray", blurb: "Stores the rain. A cactus, not a tree with opinions." },
  { key: "venus_flytrap", displayName: "Venus Flytrap", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Wetland cup", blurb: "A wetland plant. Not a monster. Snaps when the hairs agree." },
  { key: "pitcher", displayName: "Purple Pitcher Plant", rarity: "UNCOMMON", temperament: "Patient", habitat: "Bog cup", blurb: "A leaf that became a well. Drowns. Not a flytrap with a cup glued on." },
  { key: "sundew", displayName: "Round-leaved Sundew", rarity: "UNCOMMON", temperament: "Slow", habitat: "Peat saucer", blurb: "Tentacles, mucilage, a slow curl. Glue. Not a flytrap." },
  { key: "honeybee", displayName: "Western Honey Bee", rarity: "COMMON", temperament: "Busy", habitat: "Wax dish", blurb: "Waggles the blotter. The dance is a map, not a mood." },
  { key: "monarch", displayName: "Monarch", rarity: "UNCOMMON", temperament: "Steadfast", habitat: "Milkweed cup", blurb: "Milkweed first. The orange is a warning she earned." },
  { key: "luna", displayName: "Luna Moth", rarity: "RARE", temperament: "Brief", habitat: "Lamp dusk", blurb: "The adult has no mouth. One week. She does not eat." },
  { key: "firefly", displayName: "Common Eastern Firefly", rarity: "UNCOMMON", temperament: "Signaling", habitat: "Ink dusk", blurb: "A beetle, not a fly. The flash is a sentence." },
  { key: "darner", displayName: "Common Green Darner", rarity: "UNCOMMON", temperament: "Hunting", habitat: "Lamp air", blurb: "The nymph is a different animal in the water. The adult hawks the lamp." },
  { key: "stick", displayName: "Common Walkingstick", rarity: "COMMON", temperament: "Still", habitat: "Pencil tray", blurb: "A stick that agreed to be an insect. Freezes first." },
  { key: "carpenter_ant", displayName: "Black Carpenter Ant", rarity: "COMMON", temperament: "Orderly", habitat: "Wood grain", blurb: "She does not eat the house. She nests in it." },
  { key: "ladybird", displayName: "Seven-spot Ladybird", rarity: "COMMON", temperament: "Tidy", habitat: "Leaf dish", blurb: "Seven spots. She eats aphids. A beetle, not a rumor." },
  { key: "mantis", displayName: "Chinese Mantis", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Blotter stem", blurb: "An insect that hunts. She is not a plant." },
  { key: "cicada", displayName: "Periodical Cicada", rarity: "RARE", temperament: "Patient", habitat: "Inkstone", blurb: "Seventeen years underground. Then she sings." },
  { key: "bumblebee", displayName: "Common Eastern Bumble Bee", rarity: "COMMON", temperament: "Steady", habitat: "Moss cup", blurb: "A bumblebee is not a honey bee. She keeps a smaller nest." },
  { key: "carpenter_bee", displayName: "Eastern Carpenter Bee", rarity: "UNCOMMON", temperament: "Boring", habitat: "Pencil tray", blurb: "She nests in wood. She does not keep honey the honey-bee way." },
  { key: "mason_bee", displayName: "Blue Orchard Mason Bee", rarity: "COMMON", temperament: "Solitary", habitat: "Inkstone rim", blurb: "Mud cells. One bee. Not a hive." },
  { key: "leafcutter", displayName: "Alfalfa Leafcutter Bee", rarity: "COMMON", temperament: "Precise", habitat: "Leaf dish", blurb: "Cuts a disc. Lines a cell. A solitary bee." },
  { key: "stingless", displayName: "Maya Stingless Bee", rarity: "UNCOMMON", temperament: "Gentle", habitat: "Wax pot", blurb: "Pots, not comb. A colony that does not sting." },
  { key: "sweat_bee", displayName: "Bicolored Sweat Bee", rarity: "COMMON", temperament: "Bright", habitat: "Lamp rim", blurb: "Metallic. Often solitary. Not Comb." },
  { key: "mining_bee", displayName: "Neighborly Mining Bee", rarity: "COMMON", temperament: "Burrowing", habitat: "Sand tray", blurb: "A ground nest. Not a hive." },
  { key: "honey_drone", displayName: "Western Honey Bee (drone)", rarity: "UNCOMMON", temperament: "Idle", habitat: "Wax dish", blurb: "A drone is not a worker. No sting. No pollen basket." },
  { key: "honey_queen", displayName: "Western Honey Bee (queen)", rarity: "RARE", temperament: "Laid", habitat: "Wax heart", blurb: "The queen is not a second Comb. She lays. She does not forage." },
  { key: "honeycomb", displayName: "Honeycomb", rarity: "UNCOMMON", temperament: "Shared", habitat: "Wax dish", blurb: "Many bees, one nest. The line can stay, or go quiet." },
  { key: "oyster", displayName: "Oyster Mushroom", rarity: "COMMON", temperament: "Quiet", habitat: "Dead-wood shelf", blurb: "A shelf that eats the dead wood. A decomposer, not a plant." },
  { key: "fly_agaric", displayName: "Fly Agaric", rarity: "UNCOMMON", temperament: "Plain", habitat: "Moss cup", blurb: "White gills, a skirt, a volva. A warning, not lunch." },
  { key: "morel", displayName: "American Morel", rarity: "RARE", temperament: "Seasonal", habitat: "Leaf mold", blurb: "A hollow honeycomb. Not a false morel." },
  { key: "chanterelle", displayName: "Golden Chanterelle", rarity: "UNCOMMON", temperament: "Fragrant", habitat: "Moss rim", blurb: "False gills that fork. Not the jack-o’-lantern." },
  { key: "turkey_tail", displayName: "Turkey Tail", rarity: "COMMON", temperament: "Zoned", habitat: "Wood grain", blurb: "Thin, zoned, pores not gills. A bracket, not a turkey." },
  { key: "lions_mane", displayName: "Lion's Mane", rarity: "UNCOMMON", temperament: "Bearded", habitat: "Wound in wood", blurb: "Teeth, not gills. A beard on a wound in the wood." },
  { key: "puffball", displayName: "Common Puffball", rarity: "COMMON", temperament: "Brief", habitat: "Duff dish", blurb: "A puff, then a cloud. Cut a young one. An Amanita can hide." },
  { key: "chicken_of_woods", displayName: "Chicken of the Woods", rarity: "UNCOMMON", temperament: "Sulfur", habitat: "Oak shelf", blurb: "Sulfur shelves on oak. Not a chicken." },
  { key: "yeast", displayName: "Baker's Yeast", rarity: "COMMON", temperament: "Busy", habitat: "Bread crock", blurb: "A fungus you cannot see until the bread. The house already knows bread." },
  { key: "lichen", displayName: "Reindeer Lichen", rarity: "RARE", temperament: "Shared", habitat: "Lamp stone", blurb: "Not one creature. A fungus and a partner. Two kingdoms in one guest." },
  { key: "photovore", displayName: "Lamp-drinker", rarity: "COMMON", temperament: "Thirsty", habitat: "Lamp glass", blurb: "Drinks lamp-light. No mouth. Hunger is a wavelength." },
  { key: "choir", displayName: "Chord Body", rarity: "UNCOMMON", temperament: "Harmonic", habitat: "Blotter air", blurb: "A body that is a chord. One animal, many notes." },
  { key: "nimbus", displayName: "Methane Floater", rarity: "COMMON", temperament: "Vacant", habitat: "Cold bowl", blurb: "A cold-gas floater from a methane sea. The air is the water." },
  { key: "silica", displayName: "Living Crystal", rarity: "UNCOMMON", temperament: "Patient", habitat: "Inkstone", blurb: "Grows by faceting. A mineral that chose to live." },
  { key: "terminator", displayName: "Twilight Walker", rarity: "RARE", temperament: "Rim-bound", habitat: "Lamp-edge", blurb: "Lives only on the twilight belt. Noon kills. Night starves." },
  { key: "nexus", displayName: "Walking Colony", rarity: "RARE", temperament: "Many", habitat: "Paperweight", blurb: "A colony that walks as one guest. Many animals, one name." },
  { key: "halovore", displayName: "Salt-drinker", rarity: "UNCOMMON", temperament: "Dry", habitat: "Salt dish", blurb: "Drinks salt. Leaves a frost of waste. Water is optional." },
  { key: "magneton", displayName: "Field Swimmer", rarity: "UNCOMMON", temperament: "Aligned", habitat: "Ruler line", blurb: "Swims magnetic fields the way a fish swims current. North is food." },
  { key: "umbral", displayName: "Heat Shadow", rarity: "UNCOMMON", temperament: "Quiet", habitat: "Lamp shadow", blurb: "Feeds on waste heat and shadow. The lamp is loud. The cool is lunch." },
  { key: "cyst", displayName: "Traveling Cyst", rarity: "LEGENDARY", temperament: "Waiting", habitat: "Damp blotter", blurb: "A traveling cyst. Most of a life is the wait." },
  { key: "frog", displayName: "Green Frog", rarity: "COMMON", temperament: "Ready", habitat: "Reed cup", blurb: "Long legs. Damp skin. A jump, then a sit. Not a toad." },
  { key: "toad", displayName: "American Toad", rarity: "COMMON", temperament: "Plain", habitat: "Leaf dish", blurb: "Warty, dry, a short hop. Parotoids. Not a frog." },
  { key: "newt", displayName: "Eastern Newt", rarity: "UNCOMMON", temperament: "Bright", habitat: "Moss saucer", blurb: "Smooth, spotted, a tail that is not a lizard's. An eft first." },
  { key: "salamander", displayName: "Spotted Salamander", rarity: "UNCOMMON", temperament: "Hidden", habitat: "Leaf mold", blurb: "Yellow coins on black. A vernal guest. Not a lizard. Not Eft." },
  { key: "caecilian", displayName: "Rio Caecilian", rarity: "RARE", temperament: "Slick", habitat: "Silt tray", blurb: "Rings, a jaw, small eyes. An amphibian. Not a worm." },
  { key: "crayfish", displayName: "Common Crayfish", rarity: "COMMON", temperament: "Armed", habitat: "Pebble tray", blurb: "Ten legs. Two claws. A crustacean. Not an insect." },
  { key: "pond_snail", displayName: "Great Pond Snail", rarity: "COMMON", temperament: "Slow", habitat: "Glass rim", blurb: "A spiral house she grew. A lung. She rasps. Not an insect." },
  { key: "mussel", displayName: "Eastern Elliptio", rarity: "UNCOMMON", temperament: "Filtering", habitat: "Silt dish", blurb: "Two valves. A foot. She filters. Not a sea guest. Not lunch." },
  { key: "leech", displayName: "Horse Leech", rarity: "UNCOMMON", temperament: "Sure", habitat: "Damp blotter", blurb: "Segments, suckers, a swim. She hunts worms. Not a worm you dig." },
  { key: "stickleback", displayName: "Three-spined Stickleback", rarity: "COMMON", temperament: "Keen", habitat: "Weed bowl", blurb: "Three spines. A nest of glue. Not Coin. A pond fish." },
  { key: "paramecium", displayName: "Slipper Paramecium", rarity: "COMMON", temperament: "Busy", habitat: "Drop glass", blurb: "A slipper. Cilia. A cell that swims. Not an animal." },
  { key: "amoeba", displayName: "Proteus Amoeba", rarity: "COMMON", temperament: "Slow", habitat: "Silt film", blurb: "She reaches, then she is that reach. Not a blob with no office." },
  { key: "euglena", displayName: "Euglena", rarity: "UNCOMMON", temperament: "Bright", habitat: "Lamp drop", blurb: "Eyespot. Mixotroph. She drinks light and also lunch. Not a plant." },
  { key: "volvox", displayName: "Golden Volvox", rarity: "UNCOMMON", temperament: "Many", habitat: "Green bowl", blurb: "A colony. Daughter spheres. She rolls. Not one creature. Not Pact." },
  { key: "diatom", displayName: "Navicula", rarity: "COMMON", temperament: "Patient", habitat: "Silica dish", blurb: "A silica house she grew. Not Gleam. Not glass from the far den." },
  { key: "kelp", displayName: "Giant Kelp", rarity: "RARE", temperament: "Anchored", habitat: "Cold hold", blurb: "Holdfast. Brown algae. Not Felt. Not a garden plant." },
  { key: "chlamydomonas", displayName: "Chlamydomonas", rarity: "COMMON", temperament: "Spinning", habitat: "Wet plate", blurb: "Two flagella. A cup of green. Not a land plant." },
  { key: "stentor", displayName: "Blue Stentor", rarity: "UNCOMMON", temperament: "Trumpet", habitat: "Trumpet rim", blurb: "A trumpet. Not a worm. Not Slip. Not Latch." },
  { key: "coli", displayName: "Escherichia coli", rarity: "COMMON", temperament: "Dividing", habitat: "Broth cup", blurb: "A rod. A bacterium. Not a fungus. Not Starter." },
  { key: "haloarchaea", displayName: "Halobacterium", rarity: "RARE", temperament: "Pink", habitat: "Salt pan", blurb: "An archaeon. Pink salt. Not a bacterium. Not Brine." },
  { key: "crow", displayName: "American Crow", rarity: "COMMON", temperament: "Keen", habitat: "Chimney ledge", blurb: "Fan tail. A caw. Not a raven. Not Quill." },
  { key: "raven", displayName: "Common Raven", rarity: "UNCOMMON", temperament: "Grave", habitat: "High rafter", blurb: "Wedge tail, a croak. Not a crow. Not Quill." },
  { key: "barn_owl", displayName: "Barn Owl", rarity: "UNCOMMON", temperament: "Still", habitat: "Beam hollow", blurb: "Heart face. A hiss, not a hoot. Not a hawk." },
  { key: "red_tail", displayName: "Red-tailed Hawk", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Lamp post", blurb: "A rusty fan. A soar. Not an owl. Not Heart." },
  { key: "chickadee", displayName: "Black-capped Chickadee", rarity: "COMMON", temperament: "Busy", habitat: "Twig cup", blurb: "Black cap. Dee-dee. Not a sparrow rumor." },
  { key: "robin", displayName: "American Robin", rarity: "COMMON", temperament: "Bright", habitat: "Nest rim", blurb: "A brick breast. A hop on the lawn. Not the European robin." },
  { key: "mallard", displayName: "Mallard", rarity: "COMMON", temperament: "Easy", habitat: "Ink dish", blurb: "Green head. A dabble. Not a goose. Not Coin." },
  { key: "canada_goose", displayName: "Canada Goose", rarity: "COMMON", temperament: "Sure", habitat: "Blotter green", blurb: "A V. A honk. Not a duck. Not Drake." },
  { key: "pileated", displayName: "Pileated Woodpecker", rarity: "RARE", temperament: "Loud", habitat: "Dead-wood post", blurb: "A rectangular hole. A red crest. Not a flicker." },
  { key: "hummingbird", displayName: "Ruby-throated Hummingbird", rarity: "UNCOMMON", temperament: "Quick", habitat: "Nectar cup", blurb: "A needle bill. A hover. Not a bee. Not Thrum." },
  { key: "orb_weaver", displayName: "European Garden Spider", rarity: "COMMON", temperament: "Still", habitat: "Lamp web", blurb: "A cross on the abdomen. A web she built. Not an insect. Not Stem." },
  { key: "jumping_spider", displayName: "Bold Jumper", rarity: "COMMON", temperament: "Keen", habitat: "Blotter edge", blurb: "Big front eyes. A leap. She stalks. Not a wolf spider." },
  { key: "wolf_spider", displayName: "Wetland Wolf Spider", rarity: "UNCOMMON", temperament: "Sure", habitat: "Leaf litter", blurb: "She carries the brood. No snare. Not Leap." },
  { key: "tarantula", displayName: "Desert Blonde", rarity: "RARE", temperament: "Quiet", habitat: "Silk burrow", blurb: "Blonde hair. A kick, not a rumor of fangs first. Not a wolf spider." },
  { key: "widow", displayName: "Southern Black Widow", rarity: "UNCOMMON", temperament: "Plain", habitat: "Dark corner", blurb: "A red hourglass. She is not every dark spider." },
  { key: "harvestman", displayName: "Common Harvestman", rarity: "COMMON", temperament: "Busy", habitat: "Blotter stem", blurb: "Two eyes. One body, not two. Not a spider. Not Loom." },
  { key: "scorpion", displayName: "Striped Bark Scorpion", rarity: "UNCOMMON", temperament: "Watchful", habitat: "Bark tray", blurb: "A metasoma, a sting. Not a spider. Not Whip." },
  { key: "vinegaroon", displayName: "Giant Vinegaroon", rarity: "RARE", temperament: "Armed", habitat: "Sand tray", blurb: "A whip. Acetic acid. No sting. Not a scorpion. Not Barb." },
  { key: "tick", displayName: "Black-legged Tick", rarity: "COMMON", temperament: "Patient", habitat: "Blotter hem", blurb: "Eight legs. A mite. Not an insect. Not Comb." },
  { key: "solifuge", displayName: "Windscorpion", rarity: "UNCOMMON", temperament: "Quick", habitat: "Dry dish", blurb: "Huge chelicerae. A run. Not a spider. Not a scorpion." },
  { key: "deer", displayName: "White-tailed Deer", rarity: "COMMON", temperament: "Flagged", habitat: "Oak edge", blurb: "A flag of a tail. She walks. Not a moose rumor." },
  { key: "bat", displayName: "Big Brown Bat", rarity: "UNCOMMON", temperament: "Hanging", habitat: "Rafter fold", blurb: "Wings of a hand. Not a bird. Not Sip. Not Peck." },
  { key: "squirrel", displayName: "Eastern Gray Squirrel", rarity: "COMMON", temperament: "Busy", habitat: "Oak dish", blurb: "She hides a thought. Not a chipmunk rumor." },
  { key: "otter", displayName: "North American River Otter", rarity: "UNCOMMON", temperament: "Sliding", habitat: "Ink dish", blurb: "A slide in water. Not Slip. Not a weasel rumor only." },
  { key: "raccoon", displayName: "Raccoon", rarity: "COMMON", temperament: "Washing", habitat: "Wash bowl", blurb: "She washes. Not Bandit the kingsnake. Not Rui." },
  { key: "skunk", displayName: "Striped Skunk", rarity: "COMMON", temperament: "Warning", habitat: "Duff dish", blurb: "A warning she wears. Not a polecat rumor. Not Wick." },
  { key: "opossum", displayName: "Virginia Opossum", rarity: "COMMON", temperament: "Still", habitat: "Rafter hem", blurb: "She plays dead. A marsupial. Not a cat. Not Vesper." },
  { key: "beaver", displayName: "North American Beaver", rarity: "UNCOMMON", temperament: "Building", habitat: "Lodge cup", blurb: "Teeth that fell. A lodge. Not a muskrat rumor." },
  { key: "porcupine", displayName: "North American Porcupine", rarity: "UNCOMMON", temperament: "Bristled", habitat: "Pine post", blurb: "Quills that can leave. Not Burr. Not Quill." },
  { key: "black_bear", displayName: "American Black Bear", rarity: "RARE", temperament: "Sure", habitat: "Oak denside", blurb: "Not a red panda. Not Rui. She is a bear." },
  { key: "gecko", displayName: "Mediterranean House Gecko", rarity: "COMMON", temperament: "Climbing", habitat: "Lamp plaster", blurb: "Toe pads. A night voice. Not a salamander. Not Dapple." },
  { key: "anole", displayName: "Green Anole", rarity: "COMMON", temperament: "Flashing", habitat: "Vine post", blurb: "A dewlap. She can go brown. Not a chameleon. Not Shift." },
  { key: "skink", displayName: "Five-lined Skink", rarity: "COMMON", temperament: "Quick", habitat: "Stone crack", blurb: "A blue tail when young. Not a snake. Not Sash." },
  { key: "chameleon", displayName: "Veiled Chameleon", rarity: "UNCOMMON", temperament: "Slow", habitat: "Branch perch", blurb: "Tong feet, independent eyes. Not Wink. Not Sol." },
  { key: "horned_lizard", displayName: "Texas Horned Lizard", rarity: "UNCOMMON", temperament: "Crowned", habitat: "Sand tray", blurb: "A crown of horns. She can squirt blood. Not a toad. Not Pebble." },
  { key: "alligator", displayName: "American Alligator", rarity: "UNCOMMON", temperament: "Banked", habitat: "Bank dish", blurb: "A U-snout. Teeth hide on the close. Not a crocodile. Not Jaw." },
  { key: "crocodile", displayName: "American Crocodile", rarity: "RARE", temperament: "Showing", habitat: "Brackish dish", blurb: "A V-snout. Fourth tooth shows. Not an alligator. Not Levee." },
  { key: "snapper", displayName: "Common Snapping Turtle", rarity: "COMMON", temperament: "Hooked", habitat: "Mud bowl", blurb: "A beak, a long tail. Not Ink. Not a tortoise." },
  { key: "box_turtle", displayName: "Eastern Box Turtle", rarity: "COMMON", temperament: "Shutting", habitat: "Leaf dish", blurb: "A hinged plastron. She shuts. Not Ink. Not Hinge the mussel." },
  { key: "tuatara", displayName: "Tuatara", rarity: "RARE", temperament: "Still", habitat: "Stone burrow", blurb: "A tuatara. A third eye. Not a lizard. Not Sol. She is her own order." },
  { key: "bass", displayName: "Largemouth Bass", rarity: "COMMON", temperament: "Lunging", habitat: "Weed edge", blurb: "A wide mouth. Not a trout. Not Speck." },
  { key: "brook_trout", displayName: "Brook Trout", rarity: "UNCOMMON", temperament: "Speckled", habitat: "Riffle cup", blurb: "A char. Worm marks on the back. Not a bass. Not a rainbow rumor." },
  { key: "catfish", displayName: "Channel Catfish", rarity: "COMMON", temperament: "Whiskered", habitat: "Mud run", blurb: "Barbels. Not a shark. Not a rumor of the sea." },
  { key: "bluegill", displayName: "Bluegill", rarity: "COMMON", temperament: "Sunning", habitat: "Dock shade", blurb: "A dark ear flap. A sunfish. Not Coin the goldfish." },
  { key: "perch", displayName: "Yellow Perch", rarity: "COMMON", temperament: "Barred", habitat: "Weed rail", blurb: "Bars down the side. Not a walleye. Not Night." },
  { key: "pike", displayName: "Northern Pike", rarity: "UNCOMMON", temperament: "Waiting", habitat: "Reed ambush", blurb: "A duckbill. Not a muskellunge rumor she has to argue." },
  { key: "walleye", displayName: "Walleye", rarity: "UNCOMMON", temperament: "Dusk", habitat: "Dusk run", blurb: "A tapetum. She hunts dusk. Not a perch. Not Bar." },
  { key: "paddlefish", displayName: "American Paddlefish", rarity: "RARE", temperament: "Filtering", habitat: "Current dish", blurb: "A paddle. Filter. Not a shark. Not Whisk." },
  { key: "lamprey", displayName: "Sea Lamprey", rarity: "UNCOMMON", temperament: "Attaching", habitat: "Stone disk", blurb: "A disk mouth. No jaws. Not an eel. Not Silver. Not a moray." },
  { key: "american_eel", displayName: "American Eel", rarity: "RARE", temperament: "Going", habitat: "Bank hole", blurb: "She goes to the Sargasso. Not a lamprey. Not Round. Not a moray of the tide." },
  { key: "house_centipede", displayName: "House Centipede", rarity: "UNCOMMON", temperament: "Hunting", habitat: "Plaster crack", blurb: "Fifteen pairs. She hunts. Not a millipede. Not Link. Not an insect." },
  { key: "millipede", displayName: "American Giant Millipede", rarity: "COMMON", temperament: "Oiled", habitat: "Damp log", blurb: "Two pairs per ring. She oils. Not a centipede. Not Haste." },
  { key: "pillbug", displayName: "Common Pillbug", rarity: "COMMON", temperament: "Rolling", habitat: "Bark dish", blurb: "Seven pairs. A crustacean. Not an insect. Not Comb. Not Pinch." },
  { key: "earthworm", displayName: "Common Earthworm", rarity: "COMMON", temperament: "Casting", habitat: "Soil tray", blurb: "A clitellum. She casts. Not a snake. Not Sash. Not Slip. Not Latch." },
  { key: "velvet_worm", displayName: "Velvet Worm", rarity: "RARE", temperament: "Velvet", habitat: "Wet wood", blurb: "Velvet. Glue from the head. An onychophoran. Not a millipede. Not Link." },
  { key: "springtail", displayName: "Orchesella Springtail", rarity: "COMMON", temperament: "Hopping", habitat: "Duff cup", blurb: "A furcula. A hexapod that is not an insect. Not a flea. Not Comb." },
  { key: "tardigrade", displayName: "Water Bear", rarity: "RARE", temperament: "Waiting", habitat: "Moss film", blurb: "A tun when dry. A water bear. Not a bear. Not Coal." },
  { key: "planarian", displayName: "Tiger Planarian", rarity: "UNCOMMON", temperament: "Splitting", habitat: "Film dish", blurb: "Eyes like commas. She splits. Not a leech. Not Latch." },
  { key: "nematode", displayName: "C. elegans", rarity: "UNCOMMON", temperament: "Threading", habitat: "Soil film", blurb: "A roundworm. Not Cast. Not an earthworm you dig." },
  { key: "amphipod", displayName: "Gammarus Scud", rarity: "COMMON", temperament: "Scudding", habitat: "Side pool", blurb: "A scud. She swims on her side. Not Pinch. Not a pillbug." },
  { key: "fiddler_crab", displayName: "Atlantic Fiddler Crab", rarity: "COMMON", temperament: "Signaling", habitat: "Marsh dish", blurb: "The big claw is a signal, not a pinch of lunch. Not Tenant. Not Pinch." },
  { key: "ghost_crab", displayName: "Atlantic Ghost Crab", rarity: "UNCOMMON", temperament: "Running", habitat: "Dry sand", blurb: "She runs the dry sand. Not Tenant. Not Ledger. Not Ghost." },
  { key: "limpet", displayName: "Common Limpet", rarity: "COMMON", temperament: "Clamping", habitat: "Rock rim", blurb: "A cone that clamps. Not Lid. Not Cement." },
  { key: "barnacle", displayName: "Acorn Barnacle", rarity: "COMMON", temperament: "Cemented", habitat: "Stone rim", blurb: "Cemented. A crustacean. Not a limpet. Not a crab." },
  { key: "chiton", displayName: "Lined Chiton", rarity: "UNCOMMON", temperament: "Plated", habitat: "Tide rock", blurb: "Eight plates. A chiton. Not a limpet. Not Armor." },
  { key: "periwinkle", displayName: "Common Periwinkle", rarity: "COMMON", temperament: "Rasping", habitat: "Rock face", blurb: "A snail of the rock. Not Chamber. Not Whorl. Not Knurl." },
  { key: "sand_dollar", displayName: "Common Sand Dollar", rarity: "COMMON", temperament: "Flat", habitat: "Sand plate", blurb: "A flat urchin. Not Coin. Not Disk. Not Ochre." },
  { key: "sea_urchin", displayName: "Purple Sea Urchin", rarity: "UNCOMMON", temperament: "Spined", habitat: "Tide pool", blurb: "Spines. Not Burr. Not Spine. Not Token." },
  { key: "knobbed_whelk", displayName: "Knobbed Whelk", rarity: "UNCOMMON", temperament: "Hunting", habitat: "Wrack dish", blurb: "A predator snail. The knobs are the tell. Not Spire. Not Horn." },
  { key: "lugworm", displayName: "Lugworm", rarity: "COMMON", temperament: "Heaping", habitat: "Wet sand", blurb: "A worm of the castings. Not Cast. Not Latch." },
  { key: "field_cricket", displayName: "Fall Field Cricket", rarity: "COMMON", temperament: "Singing", habitat: "Grass dish", blurb: "The song is the tell. Not Brood. A cricket is not a cicada." },
  { key: "katydid", displayName: "Northern True Katydid", rarity: "UNCOMMON", temperament: "Leafed", habitat: "Leaf rim", blurb: "She is not a grasshopper. The wings are leaves. Not Vault." },
  { key: "grasshopper", displayName: "Differential Grasshopper", rarity: "COMMON", temperament: "Vaulting", habitat: "Grass plate", blurb: "A jump of the grass. Not Leap. Not Hop. Not Blade." },
  { key: "swallowtail", displayName: "Eastern Tiger Swallowtail", rarity: "UNCOMMON", temperament: "Banded", habitat: "Blossom dish", blurb: "Yellow bands. Not Milk. Not Ghost. A swallowtail is not a monarch." },
  { key: "jewelwing", displayName: "Ebony Jewelwing", rarity: "UNCOMMON", temperament: "Jeweled", habitat: "Stream rim", blurb: "A damselfly. Black wings. Not Dart. A damselfly is not a darner." },
  { key: "lacewing", displayName: "Green Lacewing", rarity: "COMMON", temperament: "Laced", habitat: "Leaf dish", blurb: "Not a moth. The larva is the lion. Not Ghost." },
  { key: "earwig", displayName: "European Earwig", rarity: "COMMON", temperament: "Cerci", habitat: "Bark dish", blurb: "Cerci, not a sting. Not Fold. An earwig is not a beetle with a sting." },
  { key: "acorn_weevil", displayName: "Acorn Weevil", rarity: "UNCOMMON", temperament: "Drilling", habitat: "Acorn cup", blurb: "A drill of an acorn. Not Auger. Not Mast. A weevil is not a bee." },
  { key: "click_beetle", displayName: "Eyed Click Beetle", rarity: "UNCOMMON", temperament: "Clicking", habitat: "Bark plate", blurb: "A click, not a snap. Not Snap. Not Spark. A click beetle is not a firefly." },
  { key: "robber_fly", displayName: "Robber Fly", rarity: "UNCOMMON", temperament: "Hunting", habitat: "Grass perch", blurb: "A fly that hunts. Not a bee. Not Thrum. Not Sip." },
  { key: "sloth", displayName: "Linnaeus's Two-toed Sloth", rarity: "UNCOMMON", temperament: "Hanging", habitat: "Bough hook", blurb: "She hangs. She is not lazy. Not Rui." },
  { key: "lemur", displayName: "Ring-tailed Lemur", rarity: "COMMON", temperament: "Flagged", habitat: "Sun ledge", blurb: "The tail is a flag. Not Stripe. Not Ring." },
  { key: "gibbon", displayName: "Lar Gibbon", rarity: "UNCOMMON", temperament: "Singing", habitat: "Lamp arm", blurb: "A song and a swing. Not a monkey rumor. Not Quill." },
  { key: "kinkajou", displayName: "Kinkajou", rarity: "UNCOMMON", temperament: "Wrapping", habitat: "Nectar cup", blurb: "A prehensile tail. Nectar at night. Not Sip. Not Comb. Not Rue." },
  { key: "colugo", displayName: "Sunda Colugo", rarity: "UNCOMMON", temperament: "Sailing", habitat: "Trunk sail", blurb: "A skin that sails. Not a lemur. Not Glide. Not Cape." },
  { key: "flying_squirrel", displayName: "Southern Flying Squirrel", rarity: "COMMON", temperament: "Gliding", habitat: "Oak fold", blurb: "A skin, not a wing. Not Kite. Not a bird." },
  { key: "howler", displayName: "Mantled Howler", rarity: "UNCOMMON", temperament: "Howling", habitat: "Crown perch", blurb: "The howl is the tell. Not Vee. Not Swing." },
  { key: "tarsier", displayName: "Philippine Tarsier", rarity: "RARE", temperament: "Looking", habitat: "Branch hollow", blurb: "The eyes are the face. Not Heart." },
  { key: "potto", displayName: "Potto", rarity: "UNCOMMON", temperament: "Still", habitat: "Vine rail", blurb: "A slow cousin. Not a loris. Not Twig. Not Fold. Not Hang." },
  { key: "koala", displayName: "Koala", rarity: "UNCOMMON", temperament: "Chewing", habitat: "Gum perch", blurb: "A marsupial. Not a bear. Not Coal. Not Burr." },
  { key: "brain_coral", displayName: "Boulder Brain Coral", rarity: "UNCOMMON", temperament: "Ridged", habitat: "Boulder dish", blurb: "A coral is an animal. Not a plant. Not Fan. Not Bloom. Not Hold. Not Coral." },
  { key: "anemone", displayName: "Magnificent Sea Anemone", rarity: "UNCOMMON", temperament: "Wreathed", habitat: "Column dish", blurb: "A wreath of tentacles. Not Pulse. Not Snap." },
  { key: "clownfish", displayName: "Ocellaris Clownfish", rarity: "COMMON", temperament: "Painted", habitat: "Wreath cup", blurb: "She lives in the wreath. Not Stripe. Not Coin." },
  { key: "parrotfish", displayName: "Stoplight Parrotfish", rarity: "UNCOMMON", temperament: "Rasping", habitat: "Rock plate", blurb: "She rasps the rock. Not Quill. Not Beak." },
  { key: "cleaner_shrimp", displayName: "Pacific Cleaner Shrimp", rarity: "COMMON", temperament: "Waiting", habitat: "Station dish", blurb: "A station, not a hunt. Not Tenant. Not Pinch." },
  { key: "sea_cucumber", displayName: "Pineapple Sea Cucumber", rarity: "COMMON", temperament: "Soft", habitat: "Sand well", blurb: "Soft. Not a worm. Not Heap. Not Cast." },
  { key: "lionfish", displayName: "Red Lionfish", rarity: "UNCOMMON", temperament: "Veiled", habitat: "Reef ledge", blurb: "The fins are a veil. Not Mane. Not Fan. Not Spine. Not Spike." },
  { key: "giant_clam", displayName: "Giant Clam", rarity: "RARE", temperament: "Gated", habitat: "Mantle dish", blurb: "A door of a shell. Not Chamber. Not Cone." },
  { key: "eagle_ray", displayName: "Spotted Eagle Ray", rarity: "RARE", temperament: "Soaring", habitat: "Reef sky", blurb: "A ray of the reef. Not Kite. Not a bird." },
  { key: "grouper", displayName: "Nassau Grouper", rarity: "UNCOMMON", temperament: "Hiding", habitat: "Hole dish", blurb: "A fish of a hole. Not Door. Not Lance." },
];

export const SPECIES_BY_KEY: Record<string, Species> = Object.fromEntries(
  SPECIES.map((s) => [s.key, s]),
);

export const RARITY_WEIGHT: Record<Rarity, number> = {
  COMMON: 62,
  UNCOMMON: 28,
  RARE: 8,
  LEGENDARY: 2,
};

export const HATCH_COST: Record<Rarity, number> = {
  COMMON: 4,
  UNCOMMON: 8,
  RARE: 16,
  LEGENDARY: 32,
};

/** Shown looks. Diploid loci and dominance live in genetics.ts. */
export const TRAIT_POOLS = {
  eyes: ["amber", "ink", "frost", "ember"],
  mark: ["plain", "masked", "banded", "starred"],
  aura: ["still", "dustlit", "emberlit", "moonlit"],
} as const;

export function portraitSrc(key: string) {
  return `/pets/${key}.jpg`;
}

export function findSpecies(key: string) {
  return SPECIES_BY_KEY[key] ?? null;
}

export function rarityLabel(rarity: Rarity) {
  return rarity.charAt(0) + rarity.slice(1).toLowerCase();
}

export function pickWeightedRarity(rand: () => number = Math.random): Rarity {
  const roll = rand() * 100;
  let acc = 0;
  for (const rarity of ["COMMON", "UNCOMMON", "RARE", "LEGENDARY"] as const) {
    acc += RARITY_WEIGHT[rarity];
    if (roll < acc) return rarity;
  }
  return "COMMON";
}

export function pickSpecies(rarity: Rarity, rand: () => number = Math.random) {
  const pool = SPECIES.filter((s) => s.rarity === rarity);
  return pool[Math.floor(rand() * pool.length)] ?? SPECIES[0]!;
}

export function mintTokenId(rand: () => number = Math.random) {
  const n = Math.floor(rand() * 0xfffff)
    .toString(16)
    .padStart(5, "0");
  return `0xcp${n}`;
}

export function walletFromUserId(userId: string) {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 33 + userId.charCodeAt(i)) >>> 0;
  const hex = (h.toString(16) + "a1b2c3d4e5f60789").slice(0, 40).padEnd(40, "0");
  return `0x${hex}`;
}
