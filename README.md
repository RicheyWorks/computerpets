# ComputerPets

A living ecology. A natural-history house. One hundred guests walk the blotter.

Keep them so a line does not go quiet. The nest is a room. The square sits on the paper. Neglect can close a line.

```bash
git clone https://github.com/RicheyWorks/computerpets
cd computerpets
```

## How to sit with the house

The living desk in `web/` is the first path. You need **Node 22+**.

```bash
cd web
npm install
npm run dev
```

Vite listens on `0.0.0.0:8080`. Open [http://localhost:8080](http://localhost:8080) or [http://127.0.0.1:8080](http://127.0.0.1:8080).

Guests get Rui immediately. Sign in when you want to hatch, nest, and care.

The house nav is **Desk**, **Live**, and **Meet**. Then the dens: `/study`, `/snakes`, `/sea`, `/garden`, `/hive`, `/pond`, `/cellar`, `/far`. On a phone, open **Live** and Add to Home Screen.

Talk is optional. Set `XAI_API_KEY` if you want Grok. Without it, Rui still answers from local lines.

## What you can do

Walk the dens. Each room teaches its guests.

Sign in. The hatch is a room. The draw lands you with the guest. The kennel is a room. The cards stay paper. The shelf is a room. The hundred sit by den, not by rarity.

Pair two you already keep at `/nest`. The nest is a room. The square sits on the paper.

Feed them. Clean the blotter. Give medicine. Stay gone and a line can leave. The nest still keeps one.

Share one guest at `/demo/{slug}` — rui, cup, felt, comb, frill, gleam, and the rest of the house. The demo is a room. The guest is already walking.

`/admin` is for operators. It is not in the house nav.

## Also on your machine

### Desktop overlay (`desktop/`)

Windows and Mac. Pets walk without a license.

```bash
cd desktop
npm install
npm start
```

From the repo root: Windows `.\desktop.ps1`, Mac `sh desktop.sh`.

Right-click or use the tray: feed, play, rest, clean, medicine, hide, special.

More in [desktop/README.md](desktop/README.md).

### PyQt blotter (`client/`)

Python 3.11+ (3.12 recommended). Pets walk without a license. Unlock is optional and fail-closed.

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
python -m computerpets_client
```

More in [client/README.md](client/README.md).

## Unlock / backend (optional)

You do not need Java to watch the blotter or walk the dens.

The service at the repo root is only for ownership verify, license unlock, and the admin ledger. Java 21, Maven 3.9+. It needs `LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`, and `ADMIN_API_KEY`. Local run can use `RATE_LIMIT_BACKEND=memory` if Redis is not up.

The desk keeps 8080. Java sits at **http://localhost:8081**. A keeper can sit at both. They do not share a door. Operators: [docs/SETUP.md](docs/SETUP.md). The unlock wire is [docs/CLIENT-CONTRACT.md](docs/CLIENT-CONTRACT.md).

## Features

- Eighty living kinds across the house, the dens, the tide, the garden, the hive, the cellar, and the far den
- A living desk in the browser, a native overlay, and a PyQt blotter
- A nest that is a square. Neglect can close a line
- Optional ownership verify. Fail-closed. Empty allowlists stay empty

## Docs

- [Living desk](web/README.md)
- [Desktop overlay](desktop/README.md)
- [PyQt blotter](client/README.md)
- [Setup](docs/SETUP.md) — Java backend, secrets, profiles
- [Client contract](docs/CLIENT-CONTRACT.md)
- [Documentation index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [ADRs](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md)

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

Do not invent a public host, an NFT collection address, or a live Steam / Itch / Epic / Microsoft store ID. Those are not in this repo yet.
