# ComputerPets — PyQt blotter client

A first real PyQt6 desk: **all thirty living companions** from the house catalog live on a wooden blotter — the original twenty who walk, and the ten snakes who crawl. A day here keeps the same **house hours** (dawn / day / dusk / night, and each species’ rest window), the same **weather** they sit or swim in, **today’s house visitor** walking through, and snakes that go **blue and shed** (the old coat stays on the wood). Tap a guest (or a name on the rail) and a **species plaque** teaches the house the way `/study` and `/snakes` do: a tell, one mix-up, the latin, and the house voice. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md). The Electron overlay in `desktop/` is unchanged and still implements that same contract.

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

export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8080
export LICENSE_SECRET_KEY=         # same 32-byte standard Base64 key as the backend

python -m computerpets_client
```

`computerpets-client` is the same entry after `pip install -e .`.

Headless smoke (CI / no display):

```bash
QT_QPA_PLATFORM=offscreen python -m computerpets_client --check
```

`--check` opens the window (offscreen), confirms a living pet and a species plaque are on the blotter, prints the day’s weather, the day part, whether the default guest is resting at a fixture hour, who may call, the renderer line, and the thirty-kind count, and exits.

## Meet the house

The **species rail** (house, then den) and the combo / prev-next cycle are the same thirty wire keys as `PetType` and the Electron overlay roster. Tap a name or cycle — they greet in their own voice. Tap the guest on the wood and they say the lesson. Snakes crawl; the others walk. Palettes and tells come from the existing house catalog (Rui’s rust, Bandit’s black-and-white bands, Keel’s bill, Bluff’s upturned snout). No invented species.

The **plaque** under the blotter is the classroom. Same copy as the web field guides: Coral’s red-touches-black, Nori balls vs Lula holds, Bandit no red; red panda not a bear, axolotl kept its gills. You do not leave the window.

The clock, the sky, the caller, and the shed are ports of `web/src/lib/pets/hours.ts`, `weather.ts`, `visitor.ts`, and `shed.ts` — not a third house. Hours is the clock; weather is the sky. Both can show. Rain / wind / heat only. Today’s visitor is `todaysVisitor`. The ten snakes go blue after eight hours and leave a cream coat on the blotter.

Pets walk (or crawl) without a license — same as the overlay.

## Care

The verbs that already exist on the Electron desk and fit this cut. Treat uses the species snack the overlay already has (Bamboo, Crumbs, Pinkie, Egg, …):

| Button | What happens |
|--------|----------------|
| **Feed** | Hunger up, eat animation, a house line |
| **Treat** (species verb) | A snack drops on the blotter; they walk or crawl to it |
| **Hide** / **Call back** | Leaves the blotter; call brings them in |
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
| `COMPUTERPETS_BACKEND_URL` | yes* | Backend origin, no trailing slash. Default `http://127.0.0.1:8080` if unset. |
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
│   ├── frames.py           # procedural frames (walk + snake crawl)
│   ├── life.py             # feed / treat / hide / shed stats
│   ├── hours.py            # port of web hours.ts (dawn / day / dusk / night, REST)
│   ├── weather.py          # port of web weather.ts (clear / rain / wind / heat)
│   ├── visitor.py          # port of web visitor.ts (todaysVisitor)
│   ├── shed.py             # port of web shed.ts (blue, coat on the wood)
│   ├── rail.py             # study-style species rail (30 keys)
│   ├── species.py          # house catalog — same keys as PetType
│   ├── guide.py            # field notes — same copy as /study and /snakes
│   ├── plaque.py           # paper card on the blotter
│   ├── license/            # port of desktop/license/ (no Qt)
│   └── unlock_dialog.py
├── tests/                  # decrypt, unlock, care, roster, plaques, hours, weather, visitor, shed
├── pyproject.toml
└── README.md
```

The living-desk PNGs are not in this repository. Frames are painted with `QPainter` and composited by Qt — honest about that, not a fake sprite pack.

## What this is not

- A rewrite of `desktop/` (Electron overlay stays)
- A custom GLSL / compute renderer
- An NFT minting UI or a Solana provider
- A change to `/study` or `/snakes`
