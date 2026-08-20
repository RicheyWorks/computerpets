# Living desk

New keepers start at the root [README](../README.md).

Browser companion for ComputerPets. The full house of **170** living kinds is awake — Rui and the original nineteen, plus ten named snakes, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of ten wild mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a cellar of ten fungi, a well of ten leftovers, and a far den of ten guests that never evolved here. They turn before they cross the blotter, ease to a stop, and keep their own idle habits — a dog scratches, a snake flicks its tongue, a plant leans to the lamp, a bee waggles, a fungus leans or puffs, a frog hops, a crow hops, a harvestman walks a stem, a paramecium rows. The tide den at `/sea` teaches the marine guests. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps a living comb; the colony has a line. Brood, stores, a quiet if neglected. Plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The wood at `/wood` is ten wild mammals on the blotter; plaques teach. The stone at `/stone` is ten more reptiles on the blotter; plaques teach. A tuatara is not a lizard. An alligator is not a crocodile. A bat is not a bird. A porcupine is not Burr. The creek at `/creek` is ten more freshwater fish on the blotter; plaques teach. A bass is not a trout. A lamprey is not an eel. The log at `/log` is ten litter guests on the blotter; plaques teach. A millipede is not a centipede. A pillbug is not an insect. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. The nest is a room. The square sits on the paper. Neglect can close a line. The nest still keeps one. The hatch is a room. The draw lands you with the guest. The desk is the same house. You sit on the same wood. The desk keeps time. Leave and they are hungrier.

## Run

```bash
cd web
npm install
npm run dev
```

Opens the desk. Guests get Rui immediately. Signed-in keepers can hatch and care through the kennel. The kennel is a room. The cards stay paper. The shelf is a room. The hundred and seventy sit by den, not by rarity.

Optional talk voice uses `XAI_API_KEY` (Grok chat + TTS) for a signed-in keeper. A guest still hears house lines. Without a house key, Rui still answers from local lines and the browser speech synthesizer.

## Layout

```
web/
├── src/components/desk/   # living pet + study stage
├── src/lib/pets/          # catalog, care, Rui voice
├── public/sprites/        # Rui animation frames
├── public/pets/           # catalog portraits
└── public/habitat.jpg     # study
```

## Backend

Ownership, licenses, and NFT verify stay in the Java service at the repo root (`mvn spring-boot:run`). That door is **http://localhost:8081**. This folder is the living client; the desk keeps 8080.

Operators open `/admin` (not in the house nav) with `ADMIN_API_KEY` as `X-Admin-Key` against that service to look up and revoke licenses.

## Advertising demos

- `/catalog` — a room. The hundred and seventy sit by den, not by rarity.
- `/meet` — house landing
- `/snakes` — the snake den
- `/sea` — the tide den
- `/garden` — the garden den
- `/hive` — the hive den
- `/pond` — the pond den
- `/roost` — the roost den
- `/corner` — the corner
- `/wood` — the wood
- `/stone` — the stone
- `/creek` — the creek
- `/log` — the log
- `/cellar` — the cellar den
- `/well` — the well
- `/far` — the far den
- `/nest` — a room. The square sits on the paper.
- `/demo/{slug}` — a room. The guest is already walking. The extra shows the Mac sit. The mark shows the Linux sit. The sit shows the tablet sit. The sit shows the phone sit. Every species (rui, miso, pip, thimble, … ember, cup, felt, comb, frill, gleam, boot).
