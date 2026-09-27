# Living desk

New keepers start at the root [README](../README.md). The Windows overlay walk is [How to get your first pet](../docs/START-HERE.md). This folder is the browser door of the same house.

Browser companion for ComputerPets. The full house of **221** living kinds is awake — Rui and the original nineteen, plus ten named snakes, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of eleven wild mammals, a canopy of ten tree mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a shore of ten strand guests, a reef of ten living-rock guests, a meadow of ten grass-and-night insects, a cellar of ten fungi, a well of ten leftovers, a far den of ten guests that never evolved here, and a grid of ten cyber dragons. They turn before they cross the blotter, ease to a stop, and keep their own idle habits — a dog scratches, a snake flicks its tongue, a plant leans to the lamp, a bee waggles, a fungus leans or puffs, a frog hops, a crow hops, a harvestman walks a stem, a paramecium rows. The tide den at `/sea` teaches the marine guests. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps a living comb; the colony has a line. Brood, stores, a quiet if neglected. Plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The wood at `/wood` is eleven wild mammals on the blotter; plaques teach. The canopy at `/canopy` is ten more mammals of the trees on the same wood; plaques teach. A sloth is not a red panda. A koala is not a bear. The stone at `/stone` is ten more reptiles on the blotter; plaques teach. A tuatara is not a lizard. An alligator is not a crocodile. A bat is not a bird. A porcupine is not Burr. The creek at `/creek` is ten more freshwater fish on the blotter; plaques teach. A bass is not a trout. A lamprey is not an eel. The log at `/log` is ten litter guests on the blotter; plaques teach. A millipede is not a centipede. A pillbug is not an insect. The shore at `/shore` is ten guests of the strand on the blotter; plaques teach. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. The reef at `/reef` is ten guests of the living rock on the same wood; plaques teach. A coral is not a plant. An anemone is not a jelly. The meadow at `/meadow` is ten insects of the grass and the night song on the blotter; plaques teach. A cricket is not a cicada. A katydid is not a grasshopper. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. The grid at `/grid` is ten cyber dragons; plaques teach. Spark is `/demo/crackle`. The nest is a room. The square sits on the paper. Neglect can close a line. The nest still keeps one. The hatch is a room. The draw lands you with the guest. The desk is the same house. You sit on the same wood. The desk keeps time. Leave and they are hungrier.

## Run

```bash
cd web
npm install
npm run dev
```

Opens the desk. Guests get Rui immediately. Signed-in keepers can hatch and care through the kennel. The kennel is a room. The cards stay paper. The shelf is a room. The two hundred twenty-one sit by den, not by rarity.

Optional talk voice uses `XAI_API_KEY` (Grok chat + TTS) for a signed-in keeper. A guest still hears house lines. Without a house key, Rui still answers from local lines and the browser speech synthesizer. The keeper card says who is listening. Guests stay `Listening · House lines`. A signed-in cloud name appears only when that house env key exists. The key is not on the card. Until the read returns, the line is `Listening · not sure`.

The living desk, including `/demo`, does not list Desktop, Documents, or Downloads. A dropped file is not opened. Window glass on the overlay is rects only. This page has no host folder and no window title to read. A path is omitted unless the keeper has already consented, and this desk has no such control. Typing in a card field stays in that field. A key outside it is not logged. Escape may dismiss the guest menu. The key text is not stored. The weather control asks for a place once, then that read ends. The control says this click sends a place to the forecast host. When no typed area is saved, the first click asks in the app. Send the place is the yes that locates. Don't send does not. A live fix is rounded to a tenth of a degree before it leaves. A stored live pin in `computerpets.card.v1` is rounded to that tenth on load. A saved live pin does not open a forecast until the keeper says to use that place. That yes sticks for the pin and does not locate again. A typed city still goes to the forecast host. Look up of a typed name, and the reverse lookup after Send the place, do not leave until the open weather panel names Open-Meteo, a weather website, and says this computer's internet address goes there too. They do not run on load. A saved typed area is kept and does not start a new locate. A browser may keep an origin grant after the click; this page cannot revoke it. After the yes, that grant can answer without a new browser prompt. The page does not read a fix on load or from a forecast refresh. A missing fix does not ask an IP place service. The line says the computer did not share a place. News RSS and market quotes wait until their plate is open and the line names the website and says this computer's internet address goes there too. A closed plate and a load do not send. The twenty-minute refresh sends only while the plate stays open. Radio Find waits until the radio form shows that line for the radio host. A coin or collection look-up waits until the open quotes plate shows that line naming CoinGecko. Pressing Play on a station, or picking one, shows that this computer's network address goes with the https request to that stream host, as any client, and then the audio element opens it. A load does not. A house loop stays on this computer. Pressing Talk on a cloud mind names this computer's network address on that talk host before the request leaves. Cloud voice does the same for the voice host. A load does not. A guest stays on house lines. House lines, a loopback mind, and on-device speech stay on this computer.

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

The admin ledger (`/admin`) starts its License service field from `VITE_LICENSE_API_URL` when that is set at build time, otherwise from this site's own address. Only a page running on this computer (localhost) starts from `http://localhost:8081`. The field stays editable. An address that answers but is not the license service (a 404, or anything that is not a license list) is refused in plain words and nothing is saved.

When the web site is deployed (Vercel), set `VITE_LICENSE_API_URL` in the project environment to the license service's public address. `web/.env.example` lists it with the other build-time settings. The Java service must also allow this web site's origin for browser calls to `/api/admin/**`: set `ADMIN_ALLOWED_ORIGINS` to the web site's origin (comma-separated for more than one). See the "Admin ledger from the web site" section in `deploy/k8s/README.md`. Neither is a secret.

Operators open `/admin` (not in the house nav) and paste `ADMIN_API_KEY`. The page signs each lookup and revoke. It does not send the key.

## Advertising demos

- `/catalog` — a room. The two hundred twenty-one sit by den, not by rarity.
- `/meet` — house landing
- `/snakes` — the snake den
- `/sea` — the tide den
- `/garden` — the garden den
- `/hive` — the hive den
- `/pond` — the pond den
- `/roost` — the roost den
- `/corner` — the corner
- `/wood` — the wood
- `/canopy` — the canopy
- `/stone` — the stone
- `/creek` — the creek
- `/log` — the log
- `/shore` — the shore
- `/reef` — the reef
- `/meadow` — the meadow
- `/cellar` — the cellar den
- `/well` — the well
- `/far` — the far den
- `/nest` — a room. The square sits on the paper.
- `/demo/{slug}` — a room. The guest is already walking. Same house as the Windows overlay: keeper card, tray sit, Spark at `/demo/crackle`. The extra shows the Mac sit. The mark shows the Linux sit. The sit shows the tablet sit. The sit shows the phone sit. Every species (rui, miso, pip, thimble, … ember, cup, sepia, felt, comb, frill, gleam, boot, crackle).
