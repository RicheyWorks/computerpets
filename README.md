# ComputerPets

Virtual pets that live on your computer — walk your windows, eat from the keeper card, and **caw** when you Call.

<p align="center">
  <img src="docs/readme-hero.jpg" alt="Rui the red panda, Paint the clownfish, Scrape the parrotfish, Wreath the anemone, and Reed the frog — five of two hundred twenty ComputerPets" width="920">
</p>

**Start here: [How to get your first pet](docs/START-HERE.md)**

That page is a teacher. Click it. It has numbered steps. You do not need to know how to code.

## Half the house already talks for real

**116 of 220** guests already have a real Call cry. Not a cartoon beep. Real field tape — a microphone outside, cut short for the desk. Wikimedia Commons, Xeno-canto, Freesound, BigSoundBank, iNaturalist. Press **Call** and you hear the animal.

## Meet some of them

There are **220** animals in this house. These are some of them.

<p align="center">
  <img src="docs/readme-friends.jpg" alt="Rui the red panda, Lunge the bass, Speck the brook trout, Whisk the catfish, Bar the perch, Night the walleye, Lance the pike, Silver the eel, Spoon the paddlefish, Penny the bluegill, Coin the goldfish, Reed the frog, Whorl the pond snail, Eft the newt, and Dapple the salamander" width="920">
</p>

<p align="center">
  <img src="docs/readme-friends-more.jpg" alt="Pebble the toad, Pinch the crayfish, Hinge the mussel, Ink the turtle, Latch the leech, Prickle the stickleback, Ridge the brain coral, Wreath the anemone, Paint the clownfish, Scrape the parrotfish, Scrub the cleaner shrimp, Rue the fox, Slick the otter, Burr the hedgehog, and Wash the raccoon" width="920">
</p>

House names. The ones you say out loud.

**[See all 220](docs/GUESTS.md)** — every guest’s real picture, not just these groups.

## Put a pet on your real desktop

This is the first teaching point. A pet walks on top of your windows. Like a living sticker. **Rui the red panda** comes first. A keeper card sits with them: name, stage, bond, Hunger / Rest / Bond, Feed / Play / Rest. Click the name to collapse it. Voice, color, saved lines, alarm, timer, mute, and Turn off sit on the expanded card. The tray by the clock has **On the desk** — Rui, Sip, and the grid ten, no scrolling two hundred twenty names.

You do not need an account. You do not need a license. You do not need Java.

Windows 10 and Windows 11 first. Most friends are on Windows. The [start-here page](docs/START-HERE.md) shows every button.

There is no Steam, Itch, or Microsoft Store download yet. There is no live Store ID. There is no `.exe` waiting on a website. You copy the pets from [this GitHub page](https://github.com/RicheyWorks/computerpets) and turn them on yourself. That is the real way.

Today the overlay needs two free helpers — Git and Node — because the start is `.\desktop.ps1`, which runs `npm start`, which is `electron .`. You do not have to learn Node. You only install it once. Grown-ups can later build their own installer with electron-builder. We do not publish one.

A tiny preview:

1. Copy the pets onto your computer (GitHub Desktop, or `git clone https://github.com/RicheyWorks/computerpets` into a folder **you** pick).
2. Open PowerShell **in that folder** (the `computerpets` folder that has `desktop.ps1` in it).
3. Type this and press Enter:

```powershell
.\desktop.ps1
```

Or, if the computer will not run that script:

```powershell
cd desktop
npm install
npm start
```

The first time can take a few minutes. `npm install` means "get the pieces." Leave the window open. A pet should walk on your real desktop.

Git and Node are the two helpers that make that start work. Install [Git](https://git-scm.com) (or [GitHub Desktop](https://desktop.github.com) if you like pictures more than typing) and [Node](https://nodejs.org) (the big **LTS** button, version 22 or newer) once, before you type the start. The start-here page shows those buttons.

- **First click** is a sit.
- **Drag** is a carry.
- **Feed / Play / Rest** sit on the keeper card.
- **Right-click** the pet, or the little tray icon by the clock: **On the desk**, feed, play, rest, clean, medicine, hide.
- **Call** uses a species cry when the wav exists.

Clicks on empty glass pass through to your windows. The floor is the work area, above the taskbar. Pets climb real windows on Windows — **Rui** sets the quality bar; the rest follow that feel. More window tricks live in [docs/GUESTS.md](docs/GUESTS.md) and [desktop/README.md](desktop/README.md).

### Mac

Same helpers. Then in Terminal, inside the `computerpets` folder:

```bash
sh desktop.sh
```

The extra control sits in the menu bar.

### Linux

Same helpers. Then:

```bash
sh desktop.sh
```

The mark sits in the panel.

More in [desktop/README.md](desktop/README.md).

## They make real noise

**116 of 220** guests already answer **Call** with real microphone field tape — not beeps. Commons, Xeno-canto, Freesound, BigSoundBank, iNaturalist. When a guest has a cry file, Call plays that short dry cut.

These voices are in the house:

- **Rui** (red panda) — a bright twitter from Wikimedia Commons, public domain, recorded by [Mizunoryu](https://commons.wikimedia.org/wiki/File:Red_panda_twittering.ogg) (`Red_panda_twittering.ogg`).
- **Sip** (ruby-throated hummingbird) — field chips from [xeno-canto XC109598](https://xeno-canto.org/109598), recordist **Jonathon Jongsma** (Archilochus colubris, foraging calls). Credit him; see that page for the license.
- **Soot** (American crow) — a dry caw from Wikimedia Commons, public domain, recorded by [G McGrane](https://commons.wikimedia.org/wiki/File:American_Crow.ogg) (`American_Crow.ogg`, parabolic mike, 2004).
- **Wedge** (common raven) — a deep croak from Wikimedia Commons, public domain, recorded by [G. McGrane](https://commons.wikimedia.org/wiki/File:Common_Raven.ogg) (`Common_Raven.ogg`, Acadia National Park). Not a crow caw.
- **Brick** (American robin) — a short carol from Wikimedia Commons, public domain, recorded by the [National Park Service](https://commons.wikimedia.org/wiki/File:American_Robin_Yellowstone_National_Park.ogg) (`American_Robin_Yellowstone_National_Park.ogg`, Yellowstone).
- **Heart** (barn owl) — a dry hiss-scream from Wikimedia Commons, CC BY 4.0, recorded by [Victor C. Lewis](https://commons.wikimedia.org/wiki/File:Barn_Owl_(Tyto_alba)_(W_TYTO_ALBA_R1_C16).ogg) (British Library Wildlife Sounds, Cardiganshire). Not a hoot.
- **Hook** (red-tailed hawk) — a descending scream from [xeno-canto XC71575](https://xeno-canto.org/71575) via Commons, CC BY-SA 3.0, recorded by [Jonathon Jongsma](https://commons.wikimedia.org/wiki/File:Buteo_jamaicensis_-_Red-tailed_Hawk_-_XC71575.ogg) (Dordt College Prairie, IA).
- **Drum** (pileated woodpecker) — a ringing call from Wikimedia Commons, public domain, recorded by [G. McGrane](https://commons.wikimedia.org/wiki/File:Pileated_Woodpecker.ogg) (`Pileated_Woodpecker.ogg`).
- **Drake** (mallard) — a hen quack series from Wikimedia Commons, CC BY-SA 4.0, recorded by [Aubrey John Williams](https://commons.wikimedia.org/wiki/File:Mallard_(Anas_platyrhynchos)_(W1CDR0001518_BD17).ogg) (British Library Wildlife Sounds, Rye Grove, Surrey).
- **Vee** (Canada goose) — a short nasal honk from Wikimedia Commons, public domain (`Branta_canadensis.ogg`).
- **Reed** (green frog) — a banjo-pluck croak from [iNaturalist](https://www.inaturalist.org/observations/13344280), CC BY, recorded by [Stacey Lee Kerr](https://www.inaturalist.org/people/staceyleekerr).
- **Pebble** (American toad) — a high trill from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [SwampVids](https://commons.wikimedia.org/wiki/File:Anaxyrus_americanus_-_American_Toad_Vocalization.wav) (`Anaxyrus_americanus_-_American_Toad_Vocalization.wav`).
- **Chirp** (fall field cricket) — a fast dry wing-file scrape from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [Thatcher](https://commons.wikimedia.org/wiki/File:Field_cricket_Gryllus_pennsylvanicus.ogg) (`Field_cricket_Gryllus_pennsylvanicus.ogg`).
- **Brood** (periodical cicada) — a tymbal call from Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), recorded by [Peterwchen](https://commons.wikimedia.org/wiki/File:Magicicada_cassinii-call.ogg) (`Magicicada_cassinii-call.ogg`, Magicicada cassinii).
- **Whee** (guinea pig) — a feeding wheek from Wikimedia Commons, public domain (`Guinea_Pig_Feeding_Wheek.ogg`).
- **Rue** (red fox) — a short bark from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en), recorded by [Jugrü](https://commons.wikimedia.org/wiki/File:Bellender_Fuchs.ogg) (`Bellender_Fuchs.ogg`).
- **Boom** (mantled howler) — a deep roar-howl from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en), British Library / [Richard Ranft](https://commons.wikimedia.org/wiki/File:Mantled_Howler_Monkey_(Alouatta_palliata)_(W_ALOUATTA_PALLIATA_R1_C2).ogg) (Santa Rosa NP).
- **Swing** (lar gibbon) — rising whoops from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [FunkMonk](https://commons.wikimedia.org/wiki/File:Lar_Gibbon_hoots.ogg) (`Lar_Gibbon_hoots.ogg`, Copenhagen Zoo).
- **Gum** (koala) — a deep bellow from Wikimedia Commons / [PLOS ONE](https://doi.org/10.1371/journal.pone.0020329), [CC BY](https://creativecommons.org/licenses/by/2.5/), recorded by [Charlton et al.](https://commons.wikimedia.org/wiki/File:Perception-of-Male-Caller-Identity-in-Koalas-(Phascolarctos-cinereus)-Acoustic-Analysis-and-pone.0020329.s001.ogv) (male Andy, Lone Pine Koala Sanctuary).
- **Levee** (American alligator) — a low rumble bellow from Wikimedia Commons, public domain (PD-USGov-FWS), [`Alligatorbellow1.ogg`](https://commons.wikimedia.org/wiki/File:Alligatorbellow1.ogg) (United States Fish and Wildlife Service). Not a movie roar.
- **Cape** (big brown bat) — a slowed feeding-buzz click train from Wikimedia Commons, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Kaldari](https://commons.wikimedia.org/wiki/File:Bat_feeding_buzz.wav) (`Bat_feeding_buzz.wav`, Butler County PA; most likely *Eptesicus fuscus*). Not a bird.
- **Rack** (white-tailed deer) — an alarm snort/blow from [iNaturalist observation 376669369](https://www.inaturalist.org/observations/376669369), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Thomas J Nolan](https://www.inaturalist.org/people/tnolan).
- **Thimble** (rabbit) — a hind-foot thump on bare soil from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [kessir](https://freesound.org/people/kessir/sounds/386007/) (`Rabbit Thump on Soil`).
- **Clip** (hamster) — cage rustle and thin squeak from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [ondrosik](https://freesound.org/people/ondrosik/sounds/165906/) (`hamster2.wav`).
- **Ink** (turtle) — a short sulcata tortoise croak from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [TheKingOfGeeks360](https://freesound.org/people/TheKingOfGeeks360/sounds/850006/) (`Reptiles - Sulcata Tortoise; Breeding Croak from Male`).
- **Coin** (goldfish) — aquarium water tick and bubble from Wikimedia Commons, public domain, recorded by [alys](https://commons.wikimedia.org/wiki/File:Noisy_aquarium.ogg) (`Noisy_aquarium.ogg`, PDSounds). Quiet guest — never a cartoon beep.
- **Echo** (budgie) — chirps from Wikimedia Commons, public domain, recorded by [mary905](https://commons.wikimedia.org/wiki/File:Budgerigar_chirping.ogg) (`Budgerigar_chirping.ogg`, PDSounds). No words.
- **Peck** (penguin) — little penguin dusk calls from Wikimedia Commons, CC BY 3.0, recorded by [Benchill](https://commons.wikimedia.org/wiki/File:Little_Penguin_(Eudyptula_minor).ogg) (`Little_Penguin_(Eudyptula_minor).ogg`). Short nasal bray. No words.
- **Quill** (parrot) — mealy amazon calls from Wikimedia Commons / British Library, CC BY 4.0, recorded by [Richard Ranft](https://commons.wikimedia.org/wiki/File:Mealy_Amazon_(Amazona_farinosa)_(W_AMAZONA_FARINOSA_R1_C5).ogg) (`Mealy_Amazon_(Amazona_farinosa)_(W_AMAZONA_FARINOSA_R1_C5).ogg`). Harsh contact squawk. No words.
- **Wick** (ferret) — playing dook/cluck from Freesound, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [J.Zazvurek](https://freesound.org/people/J.Zazvurek/sounds/155115/) (`Ferret`, sound 155115). Soft play dook. No bark. No words.
- **Burr** (hedgehog) — juvenile huff and sniff from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [fthgurdy](https://freesound.org/people/fthgurdy/sounds/528183/) (`Angry hedgehog sniffing 1`, sound 528183). Snuffle and huff. No bark.
- **Floss** (chinchilla) — a high brief alarm squeak from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [TheKingOfGeeks360](https://freesound.org/people/TheKingOfGeeks360/sounds/860985/) (`Rodents - Chinchilla; Single`, sound 860985). Short bark. No words.
- **Bloom** (axolotl) — quiet water bubbling from Wikimedia Commons, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [A.-K. D.](https://commons.wikimedia.org/wiki/File:Toberbreedia_water_bubbling.opus) (`Toberbreedia_water_bubbling.opus`, holy well). Voiceless guest — water tick only, never a cartoon beep.
- **Keel** (toucan) — a dry croak-yelp from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [Thatcher](https://commons.wikimedia.org/wiki/File:Keel-billed_toucan.ogg) (`Keel-billed_toucan.ogg`, Roatan Butterfly Garden). Frog-like, not a songbird. No words.
- **Thrum** (bumblebee) — a low wing drone from Wikimedia Commons, public domain, recorded by [Mysid](https://commons.wikimedia.org/wiki/File:Bombus_buzz.ogg) (`Bombus_buzz.ogg`, Southern Finland). Buzz only. No words.
- **Pad** (house gecko) — a high squeak-chirp from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [Glueball](https://commons.wikimedia.org/wiki/File:HouseGeckoChirp.ogg) (`HouseGeckoChirp.ogg`). Bird-like, not a frog. No words.
- **Comb** (honeybee) — a close wing buzz from Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), recorded by [Serg Childed](https://commons.wikimedia.org/wiki/File:Buzzing_bees.ogg) (`Buzzing_bees.ogg`, bees on flowering plum). Buzz only. No words.
- **Auger** (carpenter_bee) — a deep wing drone from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [cognito perceptu](https://freesound.org/people/cognito%20perceptu/sounds/117144/) (`buzzing bee 1`, sound 117144; author notes carpenter bee in flight). Buzz only. No words.
- **Mortar** (mason_bee) — a small brief wing buzz of solitary bees from Freesound, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [dobroide](https://freesound.org/people/dobroide/sounds/161582/) (`20120714_buzz.03`, sound 161582; Echium near Puebla de Sanabria). Closest legal mason/solitary sit (no Osmia lignaria-labeled tape). Buzz only. No words.
- **Disc** (leafcutter) — a short wing buzz then a tiny leaf snip: buzz from Wikimedia Commons, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [Free Sounds Library](https://commons.wikimedia.org/wiki/File:Bee_buzzing_sound_(animal_noises).opus) (`Bee_buzzing_sound_(animal_noises).opus`); snip from [Work With Sounds / Technical Museum of Slovenia](https://commons.wikimedia.org/wiki/File:WWS_Paper-cuttingscissorsSloveniaPartisanPrintingShop.ogg) scissors, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No Megachile-labeled remixable tape found. Buzz then snip. No words.
- **Pot** (stingless) — a high thin Meliponini hive buzz from [iNaturalist observation 263773947](https://www.inaturalist.org/observations/263773947) (*Trigona spinipes*), [CC BY](https://creativecommons.org/licenses/by/4.0/), recorded by [B. Phalan](https://www.inaturalist.org/people/deboas). Closest legal Maya/Melipona stingless sit (no Melipona-labeled remixable short tape). Buzz only. No words.
- **Sheen** (sweat_bee) — a faint small wing buzz from Wikimedia Commons, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [Free Sounds Library](https://commons.wikimedia.org/wiki/File:Bee_Buzzing_Sound_-_Animal_Sounds.opus) (`Bee_Buzzing_Sound_-_Animal_Sounds.opus`). No Halictidae-labeled remixable tape. Buzz only. No words.
- **Bank** (mining_bee) — a short dry wing buzz of wild ground-nesting Andrena from Freesound, [CC BY](https://creativecommons.org/licenses/by/4.0/), recorded by [dobroide](https://freesound.org/people/dobroide/sounds/32588/) (`20070318.hive.00`, sound 32588; Andrenas nesting in the ground). Buzz only. No words.
- **Hum** (honey_drone) — a deeper Apis mellifera wing swarm among flowers from Wikimedia Commons, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), recorded by [YleArkisto](https://commons.wikimedia.org/wiki/File:263673_ylearkisto_mehilainen-tarhamehilainen-parvi-bees-honeybees-a-swarm-of-bees-buzzing-among-the-flowers-apis-mellifera.wav) (also [Freesound 263673](https://freesound.org/people/YleArkisto/sounds/263673/)). Distinct from Comb worker close-buzz. Buzz only. No words.
- **Keep** (honey_queen) — a virgin queen pipe/toot from Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), recorded by [Gerard Allan](https://commons.wikimedia.org/wiki/File:QueenBeePiping2017.wav) (`QueenBeePiping2017.wav`, Bristol UK hive). Distinct from Comb worker and Hum drone wing. Pipe only. No words.
- **Wax** (honeycomb) — a faint Apis mellifera worker wing heard through the comb from Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), recorded by [Serg Childed](https://commons.wikimedia.org/wiki/File:Buzzing_bees.ogg) (`Buzzing_bees.ogg`, lowpassed muffled cut). Quiet wax guest — not Comb's close buzz. No music. No beep.
- **Frill** (oyster mushroom) — a faint dry leaf/spore hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Rustling_leaves_(Gravity_Sound).wav) (`Rustling_leaves_(Gravity_Sound).wav`, attenuated). Quiet fungus — no voice. No music. No beep.
- **Cap** (fly agaric) — an almost-nothing soft leaves-in-wind hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Leaves_in_the_wind_(Gravity_Sound).wav) (`Leaves_in_the_wind_(Gravity_Sound).wav`, heavily attenuated). Quiet fungus — no voice. No music. No beep.
- **Lattice** (American morel) — a damp-air hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Rain_on_leaves_(Gravity_Sound).wav) (`Rain_on_leaves_(Gravity_Sound).wav`, attenuated). Quiet fungus — no voice. No music. No beep.
- **Horn** (golden chanterelle) — a soft moss hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Wind_in_forest_(Gravity_Sound).wav) (`Wind_in_forest_(Gravity_Sound).wav`, attenuated). Quiet fungus — no voice. No music. No beep.
- **Ring** (turkey tail) — a dry bracket hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Leaf_crunch_(Gravity_Sound).wav) (`Leaf_crunch_(Gravity_Sound).wav`, attenuated). Quiet fungus — no voice. No music. No beep.
- **Mane** (lion's mane) — a soft tooth hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Blade_of_grass_(Gravity_Sound).wav) (`Blade_of_grass_(Gravity_Sound).wav`, heavily attenuated). Quiet fungus — no voice. No music. No beep.
- **Puff** (common puffball) — a dry dust cough from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Leaf_crunch_3_(Gravity_Sound).wav) (`Leaf_crunch_3_(Gravity_Sound).wav`, attenuated). Quiet fungus — spore puff, no voice. No music. No beep.
- **Flame** (chicken of the woods) — a dry shelf hush from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Forest_ambience_2_(Gravity_Sound).wav) (`Forest_ambience_2_(Gravity_Sound).wav`, attenuated). Quiet fungus — no voice. No music. No beep.
- **Starter** (baker's yeast) — tiny fermentation airlock bubbles from [BigSoundBank](https://bigsoundbank.com/fermentation-airlock-1-s3560.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Fermentation airlock #1 / sound 3560, attenuated). Quiet microbe — no voice. No music. No beep.
- **Pact** (reindeer lichen) — a dry crust tick from [BigSoundBank](https://bigsoundbank.com/broken-twigs-1-s1299.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Broken twigs #1 / sound 1299, attenuated). Quiet lichen — no voice. No music. No beep.
- **Gleam** (lamp-drinker) — a thin dry light-hum tick from [Freesound](https://freesound.org/people/Rvgerxini/sounds/474312/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Rvgerxini](https://freesound.org/people/Rvgerxini/) (Fluorescent light buzzing / sound 474312, attenuated; Pixabay mirror). Quiet alien — no mouth. No music. No beep.
- **Choir** (chord body) — one dry held C-major chord from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:CMajor_Chord_in_Different_Instruments.ogg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [1RadicalOne](https://commons.wikimedia.org/wiki/User:1RadicalOne) (Grand Piano segment of CMajor Chord in Different Instruments, attenuated). Quiet alien — no words. No music bed. No beep.
- **Drift** (methane floater) — a soft cold-gas hiss from [BigSoundBank](https://bigsoundbank.com/air-leak-s1486.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Air leak / sound 1486, attenuated). Quiet alien — frost/gas hiss, no mouth. No music. No beep.
- **Shard** (living crystal) — a dry frost facet tick from [BigSoundBank](https://bigsoundbank.com/cracking-ice-1-s2205.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Cracking ice #1 / sound 2205). Quiet alien — ice facet settle, no mouth. No music. No beep.
- **Dusk** (twilight walker) — a dry rim-tone hum from [BigSoundBank](https://bigsoundbank.com/tibetan-bowl-singing-s1109.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Tibetan bowl singing / sound 1109, attenuated mid-sustain). Quiet alien — singing-bowl rim, no mouth. No music. No beep.
- **Knot** (walking colony) — many small body-clicks from [BigSoundBank](https://bigsoundbank.com/tongue-clicks-s1038.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Tongue clicks / sound 1038). Quiet alien — dry tongue-click body ticks, no mouth. No music. No beep.
- **Brine** (salt-drinker) — a frost-salt grain tick from [BigSoundBank](https://bigsoundbank.com/raw-rice-poured-into-a-saucepan-s0201.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Raw rice poured into a saucepan / sound 201; dry grain as salt stand-in). Quiet alien — salt tick, no mouth. No music. No beep.
- **Beacon** (field swimmer) — a low magnetic hum from [BigSoundBank](https://bigsoundbank.com/tansfo-electrique-s0467.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Electric transformer #3 / sound 467; small power-transformer magnetostriction hum). Quiet alien — magnetic tick, no mouth. No music. No beep.
- **Hush** (heat shadow) — a cool window-wind hush from [BigSoundBank](https://bigsoundbank.com/whistling-of-the-wind-1-s0147.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Whistling of the Wind #1 / sound 147; slight hiss through an open house window). Quiet alien — cool hush, no mouth. No music. No beep.
- **Arca** (traveling cyst) — one dry small membrane click from [BigSoundBank](https://bigsoundbank.com/bubble-wrap-breakouts-s0462.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Bubble wrap: Breakouts / sound 462; single pop). Quiet alien — dry cyst click, no mouth. No music. No beep.
- **Eft** (eastern newt) — a damp-skin water tick from [BigSoundBank](https://bigsoundbank.com/drops-of-water-1-s1384.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Drops of water #1 / sound 1384). Quiet amphibian — no voice. No music. No beep.
- **Dapple** (spotted salamander) — a leaf-mold hush from [BigSoundBank](https://bigsoundbank.com/miscanthus-sinensis-1-s1811.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Miscanthus sinensis #1 / sound 1811). Quiet amphibian — no voice. No music. No beep.
- **Slip** (Rio caecilian) — a wet silt rustle from [BigSoundBank](https://bigsoundbank.com/steps-in-the-mud-s0495.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Steps in the Mud / sound 495). Quiet amphibian — no voice. No music. No beep.
- **Pinch** (common crayfish) — dry pulsed claw/chamber clicks from [Freesound](https://freesound.org/people/felix.blume/sounds/866966/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [felix.blume](https://freesound.org/people/felix.blume/) (Crayfish clicking sound - out of water / #866966; Procambarus clarkii). Quiet crustacean — no voice. No music. No beep.
- **Whorl** (great pond snail) — a real snail radula rasp from Wikimedia Commons, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Miguel Tremblay](https://commons.wikimedia.org/wiki/User:Dirac) (`Snail_eating_a_leaf.ogg`). Quiet mollusk — no voice. No music. No beep.
- **Hinge** (eastern elliptio) — faint filter-water bubbles from [BigSoundBank](https://bigsoundbank.com/water-bubble-2-s0183.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Water Bubble #2 / sound 183, attenuated). Quiet bivalve — no voice. No music. No beep.
- **Latch** (horse leech) — a wet water-slip swirl from [BigSoundBank](https://bigsoundbank.com/swirl-in-the-water-s0192.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Swirl in the water / sound 192). Quiet annelid — no voice. No music. No beep.
- **Prickle** (three-spined stickleback) — a tiny water tick from [BigSoundBank](https://bigsoundbank.com/splash-small-1-s1529.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Splash, Small #1 / sound 1529). Quiet fish — no voice. No music. No beep.
- **Boot** (slipper paramecium) — a soft drop bubble / cilia whir from [BigSoundBank](https://bigsoundbank.com/water-bubbles-s0150.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Water bubbles / sound 150, attenuated). Quiet protist — no voice. No music. No beep.
- **Reach** (proteus amoeba) — a soft attenuated water-drop tick from [BigSoundBank](https://bigsoundbank.com/drops-of-water-2-s1385.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Drops of water #2 / sound 1385, attenuated). Quiet protist — almost nothing. No music. No beep.
- **Spot** (euglena) ? a soft attenuated water-drop / faint flagellar whir from [BigSoundBank](https://bigsoundbank.com/drops-of-water-3-s1386.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Drops of water #3 / sound 1386, attenuated). Quiet protist ? no voice. No music. No beep.
- **Orb** (golden volvox) — a soft attenuated water-chortle / soft roll from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Water_bubbles_chortling.ogg) ([Public domain](https://commons.wikimedia.org/wiki/File:Water_bubbles_chortling.ogg), recorded by stephan; `Water_bubbles_chortling.ogg`, attenuated). Quiet colony — no voice. No music. No beep.
- **Bell** (blue stentor) — a soft attenuated water-tick / cilia whir at a trumpet rim from [BigSoundBank](https://bigsoundbank.com/splash-small-2-s1530.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Splash, small #2 / sound 1530, attenuated). Quiet protist — no voice. No music. No beep.
- **Rod** (Escherichia coli) — a soft attenuated broth bubble from [BigSoundBank](https://bigsoundbank.com/fermentation-airlock-2-s3561.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Fermentation airlock #2 / sound 3561, attenuated; distinct from Starter yeast airlock #1). Quiet bacterium — no voice. No music. No beep.
- **Rose** (Halobacterium) — a soft attenuated salt-crust tick from [BigSoundBank](https://bigsoundbank.com/cracking-ice-3-s2207.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Cracking ice #3 / sound 2207, attenuated). Quiet archaeon — no voice. No music. No beep.
- **Vesper** (desk dragon) — a soft attenuated dry hiss-rumble from [BigSoundBank](https://bigsoundbank.com/pressure-cooker-s0805.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Pressure cooker / sound 805, attenuated steam start). Desk-dragon breath foley — no movie roar. No music. No beep.
- **Ember** (phoenix) — a thin rising slide-flute whistle from [BigSoundBank](https://bigsoundbank.com/ghost-on-the-flute-1-s2054.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Ghost on the Flute #1 / sound 2054). Mythical guest cry — no words. No music. No beep.
- **Nori** (ball python) — a soft attenuated dry scale rustle from [BigSoundBank](https://bigsoundbank.com/great-page-that-turns-1-s0362.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Great Page that Turns #1 / sound 362, attenuated). Quiet snake — nearly silent. No roar. No music. No beep.
- **Saffron** (corn snake) — a soft attenuated dry scale rustle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-2-s1413.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Pages that turn #2 / sound 1413, attenuated; distinct from Nori #362). Quiet snake — nearly silent. No roar. No music. No beep.
- **Bandit** (California kingsnake) — a short dry defensive hiss from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [TheKingOfGeeks360](https://freesound.org/people/TheKingOfGeeks360/sounds/846337/) (Mexican black kingsnake, Critter Zone #846337; same *Lampropeltis getula* complex). No movie roar. No music. No beep.
- **Jade** (green tree python) — a soft attenuated dry scale settle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-3-s1414.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Pages that turn #3 / sound 1414, attenuated; distinct from Nori #362 and Saffron #1413). Quiet snake — silent. No roar. No music. No beep.
- **Bluff** (western hognose) — a loud dramatic dry defensive hiss from [Freesound](https://freesound.org/people/JesterWhoo/sounds/706977/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [JesterWhoo](https://freesound.org/people/JesterWhoo/) (Angry snake hissing #706977; captive snake during enclosure clean, used as hognose bluff-hiss stand-in). No movie roar. No music. No beep.
- **Sash** (common garter) — a soft tall-grass rustle from [BigSoundBank](https://bigsoundbank.com/wind-in-tall-grass-s0908.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Wind in Tall Grass #908). Quiet snake — nearly silent. No hiss roar. No music. No beep.
- **Lula** (boa constrictor) — a dry gentle defensive hiss from [Freesound](https://freesound.org/people/xoiziox/sounds/553374/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [xoiziox](https://freesound.org/people/xoiziox/) (Snake Hiss #553374). No movie roar. No music. No beep.
- **Coral** (pueblo milk snake) — a soft dry scale / tail-substrate rustle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-1-s0493.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Pages that turn #1 #493). Quiet snake — no rattle. No movie hiss. No music. No beep.
- **Blush** (rosy boa) — a soft body rustle from [BigSoundBank](https://bigsoundbank.com/news-paper-pages-s1250.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (News paper, pages #1250). Silent snake — no roar. No music. No beep.
- **Atlas** (jungle carpet python) — a soft scale rustle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-4-s2211.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Pages that turn #4 / #2211). Quiet snake — no roar. No music. No beep.
- **Cup** (common octopus) — a soft sucker peel / water tick from [BigSoundBank](https://bigsoundbank.com/straw-suction-1-s1244.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Straw, suction #1 / #1244). Silent — no voice. No music. No beep.
- **Sepia** (common cuttlefish) — a soft fin flutter / water displacement from [BigSoundBank](https://bigsoundbank.com/rowing-slowly-s1514.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Rowing slowly / #1514). Silent — no voice. No music. No beep.
- **Chamber** (chambered nautilus) — a soft jet bubble / water tick from [BigSoundBank](https://bigsoundbank.com/bursting-bubbles-s1074.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Bubbles Burst / #1074). Silent — no voice. No music. No beep.
- **Pulse** (moon jelly) — a soft wet pulse in water from [BigSoundBank](https://bigsoundbank.com/splash-small-5-s1533.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Splash, small #5 / #1533). Silent — no voice. No music. No beep.
- **Ochre** (ochre sea star) — a soft damp tube-foot tick from [BigSoundBank](https://bigsoundbank.com/drops-of-water-4-s1387.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Drops of water #4 / #1387). Silent — no voice. No music. No beep.
- **Tenant** (common hermit) — a soft shell scrape / claw tick from [BigSoundBank](https://bigsoundbank.com/shells-sculpture-s0038.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Shells sculpture / #38). Silent — no voice. No music. No beep.
- **Ledger** (Atlantic horseshoe crab) — a soft sand scrape / book-gill rustle from [BigSoundBank](https://bigsoundbank.com/step-on-gravel-s0085.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by Pierre (Step on gravels / #85). Silent — no voice. No music. No beep.
- **Anchor** (lined seahorse) — a soft dry coronet click from [BigSoundBank](https://bigsoundbank.com/finger-clashes-s0483.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Finger clashes / #483). Tiny skull-crown tick — no voice words. No music. No beep.
- **Kite** (reef manta) — a soft slow fin whoosh through water from [BigSoundBank](https://bigsoundbank.com/water-swirls-and-flow-s0245.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by DenisChardonnet (Water: swirls and flow / #245). Silent — no voice. No music. No beep.
- **Door** (green moray) — a soft wet gulp from [BigSoundBank](https://bigsoundbank.com/straw-suction-2-s1245.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Straw, suction #2 / #1245). Nearly silent — no roar. No music. No beep.
- **Felt** (sheet moss) — a faint damp rustle from Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), recorded by [Gravity Sound](https://commons.wikimedia.org/wiki/File:Leaf_crunch_2_(Gravity_Sound).wav) (`Leaf_crunch_2_(Gravity_Sound).wav`, attenuated). Quiet plant — no voice. No music. No beep.
- **Vein** (maidenhair fern) — a soft frond rustle from [BigSoundBank](https://bigsoundbank.com/sound-1812-roseau-de-chine-2.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Miscanthus sinensis #2 / #1812). Quiet plant — no voice. No music. No beep.
- **Fan** (ginkgo) — a dry fan-leaf rustle from [BigSoundBank](https://bigsoundbank.com/miscanthus-sinensis-3-s1813.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Miscanthus sinensis #3 / #1813). Quiet plant — no voice. No music. No beep.
- **Mast** (white oak) — a dry leaf rustle from [BigSoundBank](https://bigsoundbank.com/miscanthus-sinensis-4-s1814.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Miscanthus sinensis #4 / #1814). Quiet plant — no voice. No music. No beep.
- **Miso**, **Pip**, and **Dee** (cat, dog, chickadee) — early house field drops already sat as keepers. Fresh Commons / Xeno-canto cites land here as we replace them.

- **Disk** (fragrant water lily) — a quiet pad-water tick from Wikimedia Commons, public domain, recorded by [stephan](https://commons.wikimedia.org/wiki/File:Welling_rivulet_in_the_woods.ogg) (`Welling_rivulet_in_the_woods.ogg`, PDSounds). Quiet plant — no voice. No music. No beep.
- **Moth** (moth orchid) — a soft petal/leaf rustle from [BigSoundBank](https://bigsoundbank.com/miscanthus-sinensis-5-s1815.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Miscanthus sinensis #5 / #1815). Quiet plant — no voice. No music. No beep.
- **Arm** (saguaro) — a dry spine tick from [BigSoundBank](https://bigsoundbank.com/miscanthus-sinensis-6-s1816.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Miscanthus sinensis #6 / #1816). Quiet plant — no voice. No music. No beep.
- **Snap** (venus_flytrap) — a dry lobe clap from [BigSoundBank](https://bigsoundbank.com/broken-twigs-2-s1300.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Broken twigs #2 / #1300). Quiet plant — no voice. No music. No beep.
- **Well** (purple pitcher plant) — one soft drip into the well from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [Andy Mabbett](https://commons.wikimedia.org/wiki/File:Water_drips_in_Treak_Cliff_Cavern,_Derbyshire.flac) (`Water_drips_in_Treak_Cliff_Cavern,_Derbyshire.flac`, attenuated). Quiet plant — no voice. No music. No beep.
- **Dew** (round-leaved sundew) — a tiny glue/dew tick from Wikimedia Commons, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), recorded by [ZooFari](https://commons.wikimedia.org/wiki/File:Water_drops_dripping.ogg) (`Water_drops_dripping.ogg`, attenuated). Quiet plant — no voice. No music. No beep.
- **Milk** (monarch) — soft wing flutter from [Freesound](https://freesound.org/people/FunWithSound/sounds/402781/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [FunWithSound](https://freesound.org/people/FunWithSound/) (`Butterfly Wings Fluttering 1.wav`, painted lady enclosure flutter; soft lepidopteran stand-in). Quiet butterfly — no voice. No music. No beep.
- **Ghost** (luna moth) — faint wing silk from [Freesound](https://freesound.org/people/nahmandub/sounds/131340/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [nahmandub](https://freesound.org/people/nahmandub/) (`Flying moth 2.wav`, attenuated). Quiet moth — no voice. No music. No beep.
- **Spark** (common eastern firefly) — tiny wing whir from [BigSoundBank](https://bigsoundbank.com/flying-melolonthinae-s1833.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (`Flying Melolonthinae`, attenuated chafer flight stand-in). Quiet beetle — no voice. No music. No beep.
- **Dart** (common green darner) — dry fast wing whir from [Freesound](https://freesound.org/people/jaegrover/sounds/240549/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [jaegrover](https://freesound.org/people/jaegrover/) (`Creature, Insect - Dragonfly, Caught in Net (Wing Movement).wav`, attenuated). Quiet dragonfly — no voice. No music. No beep.
- **Twig** (common walkingstick) — faint twig tick from [BigSoundBank](https://bigsoundbank.com/steps-on-the-twigs-s1301.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (`Steps on the Twigs`, attenuated). Quiet stick insect — no voice. No music. No beep.
More guests still wait. We hunt tape on the internet, cut 2–4 seconds, drop it in [`cries-in/`](cries-in/), and sit it into `desktop/renderer/sounds/` and `web/public/sounds/`. Each real tape keeps a `SOURCE-*.txt` next to the drop. The mailbox is [`cries-in/GROK-CHANNEL.md`](cries-in/GROK-CHANNEL.md). Next up: **Column** the Black Carpenter Ant — faint dry rasp. No voice.

No music beds. No English narrator. If it sounds like a phone UI, it does not ship.

## How to take care of them

Feed them when they look hungry. Play so they stay happy. Let them rest when they look tired. Clean up the mess they leave. Give **Medicine** if they get sick (the card will say Unwell when health dips — Feed and Clean help too).

The keeper card is the daily care. Open the expanded card for **Call** and the rest of care in one place. The tray **On the desk** picks Rui, Sip, and the grid ten. If you ignore them, they get hungry. They can get unwell. They can walk away until you call them back.

There are **220** animals. Rui is the first one you meet.

## Another way to visit them (browser)

After a pet already walks on the desktop, you can also open the same house in Chrome or Edge. This is optional. The desktop walk is the main quest. `/demo` stays lockstep with the overlay — same keeper card, same tray sit. Spark's room is `/demo/crackle`. Ion's room is `/demo/ion`.

```powershell
cd web
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080). Localhost means "this computer," not the internet. Rui is already there. No account.

A page like `/demo/rui` only works on your own computer. It is not a website for the whole internet.

## Grown-up notes

Unlock, Java, and secrets are **not** for meeting Rui. Pets already walk without a license. Operators: [docs/SETUP.md](docs/SETUP.md).

`desktop/` `npm start` is `electron .`. `npm run dist:win` is electron-builder (NSIS / portable) if you want to package a copy you built yourself. That is not a Microsoft Store listing. Do not invent a Store ID.

More pages: [docs/README.md](docs/README.md).

## License

Copyright (c) 2026 RicheyWorks. All rights reserved. This is a private house. See [LICENSE](LICENSE).

---

*Two hundred twenty living kinds. Keep them so a line does not go cool.*

