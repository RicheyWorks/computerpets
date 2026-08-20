# ComputerPets — PyQt blotter client

A first real PyQt6 desk: **all two hundred living companions** from the house catalog live on a wooden blotter — the original twenty who walk, the ten snakes who crawl, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of ten wild mammals, a canopy of ten tree mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a shore of ten strand guests, a meadow of ten grass-and-night insects, a cellar of ten fungi, a well of ten leftovers, and a far den of ten guests that never evolved here. The tide den at `/sea` is the classroom for the marine guests. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps bees and comb; plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The wood at `/wood` is ten wild mammals on the blotter; plaques teach. The canopy at `/canopy` is ten more mammals of the trees on the same wood; plaques teach. A sloth is not a red panda. A koala is not a bear. The stone at `/stone` is ten more reptiles on the blotter; plaques teach. A tuatara is not a lizard. An alligator is not a crocodile. A bat is not a bird. A porcupine is not Burr. The creek at `/creek` is ten more freshwater fish on the blotter; plaques teach. A bass is not a trout. A lamprey is not an eel. The log at `/log` is ten litter guests on the blotter; plaques teach. A millipede is not a centipede. A pillbug is not an insect. The shore at `/shore` is ten guests of the strand on the blotter; plaques teach. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. The meadow at `/meadow` is ten insects of the grass and the night song on the blotter; plaques teach. A cricket is not a cicada. A katydid is not a grasshopper. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. A day here keeps the same **house hours** (dawn / day / dusk / night, and each species’ rest window), the same **weather** they sit or swim in, **today’s house visitor** walking through, and snakes that go **blue and shed** (the old coat stays on the wood). The blotter can go **unkempt** and the guest **unwell**, the way the web desk already does — ink smudges, a dull wash, **Clean** and **Medicine**. **Play** and each species’ **special** (Steal ribbon, Heel, Play dead, Coil, …) teach the house the way the web desk already does. Tap a guest (or a name on the rail) and a **species plaque** teaches the house the way `/study` and `/snakes` do: a tell, one mix-up, the latin, and the house voice. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md). The Electron overlay in `desktop/` is unchanged and still implements that same contract.

This is **not** a custom GPU shader engine. Drawing uses Qt’s GPU-backed scene: `QGraphicsView` with a `QOpenGLWidget` viewport (Qt RHI / OpenGL compositing). If the platform cannot create an OpenGL surface, the scene falls back to Qt software raster and says so in the status bar.

Pets walk without a license — same as the overlay. Unlock is fail-closed. There is no “always licensed” stub.

## Run

Python 3.11+ (3.12 recommended). On Linux, Qt also needs the usual EGL/GL
packages (`libegl1`, `libgl1`, `libxcb-cursor0`, …) — GitHub Actions installs
them in the `pyqt-client` job.

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -e ".[dev]"

export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8081
export LICENSE_SECRET_KEY=         # same 32-byte standard Base64 key as the backend

python -m computerpets_client
```

`computerpets-client` is the same entry after `pip install -e .`.

Headless smoke (CI / no display):

```bash
QT_QPA_PLATFORM=offscreen python -m computerpets_client --check
```

`--check` opens the window (offscreen), confirms a living pet and a species plaque are on the blotter, prints the day’s weather, the day part, whether the default guest is resting at a fixture hour, who may call, the default guest’s special verb, whether they are well, the renderer line, and the two-hundred count, and exits.

## Meet the house

The **species rail** (house, then den, then tide, then garden, then hive, then pond, then roost, then corner, then wood, then canopy, then stone, then creek, then log, then shore, then meadow, then cellar, then well, then far) and the combo / prev-next cycle are the same two hundred wire keys as `PetType` and the Electron overlay roster. Tap a name or cycle — they greet in their own voice. Tap the guest on the wood and they say the lesson. Snakes crawl; the tide swims (hermit and horseshoe walk the damp floor); the garden sits and leans; the hive stays — bees walk, comb sits; the pond walks or swims; the roost flies or hops; the corner walks or sits; the wood walks or hangs; the canopy hangs or glides; the stone walks or sits; the creek swims; the log walks; the shore walks; the meadow walks; the cellar stays; the well stays; the far den stays; the others walk. Palettes and tells come from the existing house catalog (Rui’s rust, Bandit’s black-and-white bands, Cup’s arms, Ledger’s book-gills, Felt’s carpet, Comb’s gold, Thrum’s fur, Wax’s cells, Frill’s cream shelf, Gleam’s glass, Reed’s green, Boot’s slipper, Soot’s fan, Loom’s cross, Rack’s flag). The far ten are coined xenobiology, not Earth taxa. A frog is not a toad. A crow is not a raven. A harvestman is not a spider. A paramecium is not an animal. A bat is not a bird. A porcupine is not Burr. A millipede is not a centipede. A pillbug is not an insect. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. A cricket is not a cicada. A katydid is not a grasshopper.

The **plaque** under the blotter is the classroom. Same copy as the web field guides: Coral’s red-touches-black, Nori balls vs Lula holds, Bandit no red; a moon jelly is not a fish; a horseshoe crab is not a crab; the moray’s gape is breath; moss has no flower; a saguaro is not a tree; a firefly is a beetle; a luna does not eat; a cicada waits seventeen years; a mushroom is not a plant; a lichen is not one creature; Gleam is not a firefly; Drift is not Pulse; Arca is not Brood; a frog is not a toad; a newt is not a lizard; a caecilian is not a worm; a crayfish is not an insect; a paramecium is not an animal; a euglena is not a plant; a kelp is not a garden plant; a bacterium is not a fungus; an archaeon is not a bacterium. You do not leave the window.

The clock, the sky, the caller, the shed, and the specials are ports of `web/src/lib/pets/hours.ts`, `weather.ts`, `visitor.ts`, `shed.ts`, and `specials.ts` / `traits.ts` — not a third house. Hours is the clock; weather is the sky. Both can show. Rain / wind / heat only. Today’s visitor is `todaysVisitor`. The ten snakes go blue after eight hours and leave a cream coat on the blotter. Mess, illness, clean, and medicine are the same science as `care.ts`. Play and the two hundred verbs are the ones the living desk already knows.

Pets walk (or crawl) without a license — same as the overlay.

## Care

The verbs that already exist on the living desk and fit this cut. Treat uses the species snack the overlay already has (Bamboo, Crumbs, Pinkie, Egg, …). Play and the special are the same science as `care.ts` / `specials.ts`:

| Button | What happens |
|--------|----------------|
| **Feed** | Hunger up, eat animation, a house line |
| **Treat** (species verb) | A snack drops on the blotter; they walk or crawl to it |
| **Hide** / **Call back** | Leaves the blotter; call brings them in |
| **Play** | Hunger down, mood up; they wander the wood |
| **Clean** | Hygiene up; ink smudges leave the wood |
| **Medicine** | When they are unwell: health up, sick clears |
| **Steal ribbon** / **Heel** / **Play dead** … | The species special. They say the house line. |
| **Shed** (snakes) | When they are blue, the old coat stays on the wood |

## Unlock (client contract)

**Unlock…** → Steam is the first real provider shape (`steamId`, `appId`, `petType`, `hwid`):

1. `POST /api/verify/steam`
2. AES-256-GCM decrypt (32-byte `LICENSE_SECRET_KEY`, **no KDF**, 12-byte IV, 16-byte tag appended, standard Base64)
3. Device `hwid` on verify and, when bound, on download
4. `POST /api/download/{pet}` with Bearer JWT, then GET of the HMAC-signed URL (`petKey|owner|jti|exp`)

Bad ciphertext, an expired payload, a revoked `jti`, a hardware mismatch, or a missing backend all fail closed. The blotter pet still lives.

| Variable | Required | Meaning |
|----------|----------|---------|
| `COMPUTERPETS_BACKEND_URL` | yes* | Backend origin, no trailing slash. Default `http://127.0.0.1:8081` if unset. |
| `LICENSE_SECRET_KEY` | yes | Same 32-byte standard Base64 key the backend uses. Needed to decrypt the issued license locally. |
| `BUNDLE_SIGNING_KEY` | no | If set, the client also checks the CDN URL HMAC. Download still works without it — the backend already signed the URL. |
| `COMPUTERPETS_CLIENT_HOME` | no | Override the user-data directory (`license.json`, `hwid.txt`, last-seen). |

`ENTERPRISEPET_BACKEND_URL` is accepted as an alias for the backend origin.

\* If the default origin is down, unlock fails closed (unreachable backend). Do not invent a live NFT collection address. This client does not add Solana.

## Tests

```bash
cd client
source .venv/bin/activate
pytest
```

Decrypt and unlock tests do not open a window. They use a clearly named `create_contract_test_double` — the same contract the Electron tests speak, not a second wire format.

## Layout

```
client/
├── computerpets_client/
│   ├── app.py              # window + entry
│   ├── blotter.py          # wood/blotter scene + OpenGL viewport
│   ├── frames.py           # procedural frames (walk + snake crawl + tide + garden)
│   ├── life.py             # feed / treat / play / hide / clean / medicine / shed stats
│   ├── hours.py            # port of web hours.ts (dawn / day / dusk / night, REST)
│   ├── weather.py          # port of web weather.ts (clear / rain / wind / heat)
│   ├── visitor.py          # port of web visitor.ts (todaysVisitor)
│   ├── shed.py             # port of web shed.ts (blue, coat on the wood)
│   ├── specials.py         # port of web specials.ts + traits special / verb / line
│   ├── rail.py             # study-style species rail (two hundred keys)
│   ├── species.py          # house catalog — same keys as PetType
│   ├── guide.py            # field notes — same copy as /study, /snakes, /sea, /garden, /shore, and /meadow
│   ├── plaque.py           # paper card on the blotter
│   ├── license/            # port of desktop/license/ (no Qt)
│   └── unlock_dialog.py
├── tests/                  # decrypt, unlock, care, roster, plaques, hours, weather, visitor, shed, specials, mess / illness
├── pyproject.toml
└── README.md
```

The living-desk PNGs are not in this repository. Frames are painted with `QPainter` and composited by Qt — honest about that, not a fake sprite pack.

## What this is not

- A rewrite of `desktop/` (Electron overlay stays)
- A custom GLSL / compute renderer
- An NFT minting UI or a Solana provider
- A change to `/study` or `/snakes`
