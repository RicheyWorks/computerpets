# ComputerPets — PyQt blotter client

A first real PyQt6 desk: **all two hundred twenty-one living companions** from the house catalog live on a wooden blotter — the original twenty who walk, the ten snakes who crawl, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of eleven wild mammals, a canopy of ten tree mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a shore of ten strand guests, a reef of ten living-rock guests, a meadow of ten grass-and-night insects, a cellar of ten fungi, a well of ten leftovers, a far den of ten guests that never evolved here, and a grid of ten cyber dragons. The tide den at `/sea` is the classroom for the marine guests. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps bees and comb; plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The wood at `/wood` is ten wild mammals on the blotter; plaques teach. The canopy at `/canopy` is ten more mammals of the trees on the same wood; plaques teach. A sloth is not a red panda. A koala is not a bear. The stone at `/stone` is ten more reptiles on the blotter; plaques teach. A tuatara is not a lizard. An alligator is not a crocodile. A bat is not a bird. A porcupine is not Burr. The creek at `/creek` is ten more freshwater fish on the blotter; plaques teach. A bass is not a trout. A lamprey is not an eel. The log at `/log` is ten litter guests on the blotter; plaques teach. A millipede is not a centipede. A pillbug is not an insect. The shore at `/shore` is ten guests of the strand on the blotter; plaques teach. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. The reef at `/reef` is ten guests of the living rock on the same wood; plaques teach. A coral is not a plant. An anemone is not a jelly. The meadow at `/meadow` is ten insects of the grass and the night song on the blotter; plaques teach. A cricket is not a cicada. A katydid is not a grasshopper. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. The grid at `/grid` is nine cyber dragons; plaques teach. A day here keeps the same **house hours** (dawn / day / dusk / night, and each species’ rest window), the same **weather** they sit or swim in, **today’s house visitor** walking through, and snakes that go **blue and shed** (the old coat stays on the wood). The blotter can go **unkempt** and the guest **unwell**, the way the web desk already does — ink smudges, a dull wash, **Clean** and **Medicine**. **Play** and each species’ **special** (Steal ribbon, Heel, Play dead, Coil, …) teach the house the way the web desk already does. Tap a guest (or a name on the rail) and a **species plaque** teaches the house the way `/study` and `/snakes` do: a tell, one mix-up, the latin, and the house voice. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md). The Electron overlay in `desktop/` is unchanged and still implements that same contract.

This is **not** a custom GPU shader engine. Drawing uses Qt’s GPU-backed scene: `QGraphicsView` with a `QOpenGLWidget` viewport (Qt RHI / OpenGL compositing). If the platform cannot create an OpenGL surface, the scene falls back to Qt software raster and says so in the status bar.

The blotter has no mind plugin bus. Its listener line stays `Listening · House lines`. It does not read a key and it does not invent a cloud mind.

A file dropped on the blotter is ignored. The blotter does not list Desktop, Documents, or Downloads, and it does not read a window title or a document name. A host path is omitted unless the keeper has already consented. There is no such control. The blotter does not install a keyboard hook. A key outside a focused field is not logged. Typing in a field stays in that field. Weather on the blotter is the civil-day clock. It does not read machine location, it does not ask an IP place service, it does not keep a live pin to round, and it does not send a saved computer place to a forecast host. Noting a locate yes still does not read a place. A forecast refresh is not this client. It does not call a geocode host. It does not call a news host, a quote host, or a radio host. A station stream is not this client. It does not call a talk host or a voice host. A signed bundle GET names the CDN host before it leaves. Opening Unlock does not fetch it.

GPU **load** (temperature, utilization, memory, power) is a separate desktop-local sense. On Windows the blotter reads nvidia-smi or GPU performance counters. On Linux it reads the same nvidia-smi query. It keeps a sparkline of those real samples. The strip stays empty when the reading is unread, stale, malformed, or unsupported. Mac reads IOAccelerator utilization and in-use memory. Temperature and power on Mac stay unread, and a missing `ioreg` stays unread. Linux without nvidia-smi stays unread. A missing, malformed, or stale reading stays dark. This is still Qt OpenGL, not DirectX 12 or Vulkan. The overlay's compositor check is separate (ADR 0125). The overlay host pet draws on a canvas Chromium composites (ADR 0126). This blotter path is unchanged.

Pets walk without a license — same as the overlay. Unlock is fail-closed. There is no “always licensed” stub.

## Run

Python 3.11+ (3.12 recommended). On Linux, Qt also needs the usual EGL/GL
packages (`libegl1`, `libgl1`, `libxcb-cursor0`, …) — GitHub Actions installs
them in the `pyqt-client` job.

The backend URL and the license key are optional. The blotter pets walk without
them. You only need them to press **Unlock** against a running house backend.
Without `COMPUTERPETS_BACKEND_URL`, Unlock uses `http://127.0.0.1:8081`.
Without `LICENSE_SECRET_KEY`, Unlock stops with a `missing_secret` error and the
pets keep walking.

### Linux / macOS (bash)

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

python -m computerpets_client
```

Optional, only for Unlock:

```bash
export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8081
export LICENSE_SECRET_KEY=...      # same 32-byte standard Base64 key as the backend
python -m computerpets_client
```

### Windows (PowerShell)

```powershell
cd client
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"

python -m computerpets_client
```

`py -0p` lists the Pythons you have; `py -3.12 -m venv .venv` picks one. If
PowerShell will not run `Activate.ps1`, skip that line and type
`.\.venv\Scripts\python.exe` wherever the steps say `python`.

Optional, only for Unlock (these last until you close that PowerShell):

```powershell
$env:COMPUTERPETS_BACKEND_URL = "http://127.0.0.1:8081"
$env:LICENSE_SECRET_KEY = "..."    # same 32-byte standard Base64 key as the backend
python -m computerpets_client
```

`computerpets-client` is the same entry after `pip install -e .`.

### Headless smoke (CI / no display)

```bash
QT_QPA_PLATFORM=offscreen python -m computerpets_client --check
```

```powershell
python -m computerpets_client --check
```

`--check` sets `QT_QPA_PLATFORM=offscreen` by itself when the variable is not already set, so the PowerShell line needs no `$env:` step (and one would stay set for the rest of that PowerShell session, unlike the bash prefix).

`--check` opens the window (offscreen), confirms a living pet and a species plaque are on the blotter, prints the day’s weather, the day part, whether the default guest is resting at a fixture hour, who may call, the default guest’s special verb, whether they are well, the renderer line, and the living-kinds count (221), and exits.

## Meet the house

The **species rail** (house, then den, then tide, then garden, then hive, then pond, then roost, then corner, then wood, then canopy, then stone, then creek, then log, then shore, then reef, then meadow, then cellar, then well, then far, then grid) and the combo / prev-next cycle are the same two hundred twenty-one wire keys as `PetType` and the Electron overlay roster. Tap a name or cycle — they greet in their own voice. Tap the guest on the wood and they say the lesson. Snakes crawl; the tide swims (hermit and horseshoe walk the damp floor); the garden sits and leans; the hive stays — bees walk, comb sits; the pond walks or swims; the roost flies or hops; the corner walks or sits; the wood walks or hangs; the canopy hangs or glides; the stone walks or sits; the creek swims; the log walks; the shore walks; the reef walks; the meadow walks; the cellar stays; the well stays; the far den stays; the others walk. Palettes and tells come from the existing house catalog (Rui’s rust, Bandit’s black-and-white bands, Cup’s arms, Ledger’s book-gills, Felt’s carpet, Comb’s gold, Thrum’s fur, Wax’s cells, Frill’s cream shelf, Gleam’s glass, Reed’s green, Boot’s slipper, Soot’s fan, Loom’s cross, Rack’s flag). The far ten are coined xenobiology, not Earth taxa. A frog is not a toad. A crow is not a raven. A harvestman is not a spider. A paramecium is not an animal. A bat is not a bird. A porcupine is not Burr. A millipede is not a centipede. A pillbug is not an insect. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. A cricket is not a cicada. A katydid is not a grasshopper.

The **plaque** under the blotter is the classroom. Same copy as the web field guides: Coral’s red-touches-black, Nori balls vs Lula holds, Bandit no red; a moon jelly is not a fish; a horseshoe crab is not a crab; the moray’s gape is breath; moss has no flower; a saguaro is not a tree; a firefly is a beetle; a luna does not eat; a cicada waits seventeen years; a mushroom is not a plant; a lichen is not one creature; Gleam is not a firefly; Drift is not Pulse; Arca is not Brood; a frog is not a toad; a newt is not a lizard; a caecilian is not a worm; a crayfish is not an insect; a paramecium is not an animal; a euglena is not a plant; a kelp is not a garden plant; a bacterium is not a fungus; an archaeon is not a bacterium. You do not leave the window.

The clock, the sky, the caller, the shed, and the specials are ports of `web/src/lib/pets/hours.ts`, `weather.ts`, `visitor.ts`, `shed.ts`, and `specials.ts` / `traits.ts` — not a third house. Hours is the clock; weather is the sky. Both can show. Rain / wind / heat only. Today’s visitor is `todaysVisitor`. The ten snakes go blue after eight hours and leave a cream coat on the blotter. Mess, illness, clean, and medicine are the same science as `care.ts`. Play is the same ribbon chase the living desk already knows. The two hundred twenty-one verbs stay the house verbs.

Pets walk (or crawl) without a license — same as the overlay.

## Care

The verbs that already exist on the living desk and fit this cut. Treat uses the species snack the overlay already has (Bamboo, Crumbs, Pinkie, Egg, …). Play and the special are the same science as `care.ts` / `specials.ts`. The blotter keeps CareState locally. Hunger still ticks while you are gone. Fail closed.

| Button | What happens |
|--------|----------------|
| **Feed** | Hunger up, eat animation, a house line |
| **Treat** (species verb) | A snack drops on the blotter; they walk or crawl to it |
| **Hide** / **Call back** | Leaves the blotter; call brings them in |
| **Play** | A ribbon drops. They walk to it. Catch it or let them arrive. One hop. |
| **Clean** | Hygiene up; ink smudges leave the wood |
| **Medicine** | When they are unwell: health up, sick clears |
| **Steal ribbon** / **Heel** / **Play dead** … | The species special. They say the house line. |
| **Shed** (snakes) | When they are blue, the old coat stays on the wood |

## Unlock (client contract)

**Unlock…** → Steam is the first real provider shape (`steamId`, `appId`, `petType`, `hwid`):

1. `POST /api/verify/steam` signed with `LICENSE_SECRET_KEY` (`X-ComputerPets-Timestamp`, `X-ComputerPets-Nonce`, `X-ComputerPets-Signature`, 300 second skew, single-use nonce)
2. AES-256-GCM decrypt (32-byte `LICENSE_SECRET_KEY`, **no KDF**, 12-byte IV, 16-byte tag appended, standard Base64)
3. Device `hwid` on verify and, when bound, on download
4. `POST /api/download/{pet}` with Bearer JWT (the token's `jti` is single-use; a second mint is 409), then GET of the HMAC-signed URL (`petKey|owner|jti|exp`)

Bad ciphertext, an expired payload, a revoked `jti`, a hardware mismatch, or a missing backend all fail closed. The blotter pet still lives.

The first Unlock reads Linux `machine-id`, Windows `MachineGuid`, or the Mac platform UUID, hashes it, and stores the hash in `hwid.txt`. A hash already stored is reused, so an existing license stays bound. The raw id is not sent. The house receives only the hash, and only for unlock or a bound download. Opening Unlock does not read the id until you press Unlock and no hash is stored. That hash is still a device fingerprint. Unlock and a bound download name the backend host before that hash leaves. The line says this computer's network address goes with the https request to that host, as any client. A backend on this computer does not send the hash off the machine. A signed bundle GET names the CDN host before it leaves. The license hash is not on that GET. A CDN on this computer, or a local file, does not leave. Opening Unlock does not fetch it. If that named read fails, Unlock waits until you say yes before it hashes the computer name. If this computer has no name, that yes hashes a random id. A rename changes the computer-name hash. Deleting `hwid.txt` makes a random id a different mark. The blotter salt stays `windows` and the overlay salt stays `win32`. The blotter does not read a machine id for presence.

The download sign-in the house hands back at Unlock is never written in plain text. On Windows it is sealed with DPAPI (this Windows user only) and `license.json` keeps only the seal. On macOS and Linux it goes to the OS keychain when the optional `keyring` package is installed (`pip install keyring`, or `pip install .[secrets]`). With no secret store the sign-in stays in memory until the blotter closes, and a later Signed download says to unlock again. An older `license.json` with a plain sign-in is used once, then sealed or dropped. Unlock errors are one plain sentence that ends "Pets still work without it."; the raw error goes to the log.

| Variable | Required | Meaning |
|----------|----------|---------|
| `COMPUTERPETS_BACKEND_URL` | yes* | Backend origin, no trailing slash. Default `http://127.0.0.1:8081` if unset. |
| `LICENSE_SECRET_KEY` | yes | Same 32-byte standard Base64 key the backend uses. Signs `POST /api/verify` and decrypts the issued license. |
| `BUNDLE_SIGNING_KEY` | no | If set, the client also checks the CDN URL HMAC. Download still works without it — the backend already signed the URL. |
| `COMPUTERPETS_CLIENT_HOME` | no | Override the user-data directory (`license.json`, `hwid.txt`, last-seen, care). |

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
│   ├── rail.py             # study-style species rail (two hundred twenty-one keys)
│   ├── species.py          # house catalog — same keys as PetType
│   ├── guide.py            # field notes — same copy as /study, /snakes, /sea, /garden, /shore, /reef, and /meadow
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

## Care harness

Inspect and verify real care actions (Feed, Rest, Talk, Treat, Play, Special / Steal ribbon, Hide, Clean, Bath, …):

`powershell
cd client
py -m computerpets_client.care_harness
py -m computerpets_client.care_harness --list
`

See [docs/CARE-HARNESS.md](../docs/CARE-HARNESS.md). Guest options always include **Close** (dismiss menu) and **Exit** (leave pet care / unfocus).

