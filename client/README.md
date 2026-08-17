# ComputerPets — PyQt blotter client

A first real PyQt6 desk: **Rui** (red panda) lives on a wooden blotter. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md). The Electron overlay in `desktop/` is unchanged and still implements that same contract.

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

`--check` opens the window (offscreen), confirms a living pet is on the blotter, prints the renderer line, and exits.

## Care

The verbs that already exist on the Electron desk and fit this first cut:

| Button | What happens |
|--------|----------------|
| **Feed** | Hunger up, eat animation, a Rui line |
| **Bamboo** (treat) | A snack drops on the blotter; Rui walks to it |
| **Hide** / **Call back** | Walks off the blotter; call walks them in |

Miso (cat) and Pip (dog) reuse the same painter with a different silhouette — cheap extras, not a full thirty-species port.

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
| `COMPUTERPETS_CLIENT_HOME` | no | Override the user-data directory (`license.json`, `hwid.txt`). |

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
│   ├── frames.py           # procedural Rui / Miso / Pip frames
│   ├── life.py             # feed / treat / hide
│   ├── license/            # port of desktop/license/ (no Qt)
│   └── unlock_dialog.py
├── tests/                  # decrypt, hwid, signed URL, mocked unlock, care
├── pyproject.toml
└── README.md
```

The living-desk PNGs are not in this repository. Frames are painted with `QPainter` and composited by Qt — honest about that, not a fake sprite pack.

## What this is not

- A rewrite of `desktop/` (Electron overlay stays)
- A custom GLSL / compute renderer
- An NFT minting UI or a Solana provider
- A change to `/study` or `/snakes`
