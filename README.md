# ComputerPets

Virtual pets that live on your computer.

<p align="center">
  <img src="docs/readme-hero.jpg" alt="Rui the red panda, Paint the clownfish, Scrape the parrotfish, Wreath the anemone, and Reed the frog — five of two hundred ten ComputerPets" width="920">
</p>

<p align="center"><strong>210 animals.</strong> They live in your browser, and they can walk on your desktop.</p>

## What it is

ComputerPets is a Tamagotchi-style companion you run on your own machine. A pet sits in the browser. The same pets can also walk on your real Windows, Mac, or Linux desktop.

There are **210** animals — red pandas, fish, frogs, and a lot more. You feed them, play with them, and let them sleep. If you ignore them they can get sick or leave.

You can try one without signing in. **Rui the red panda** shows up as soon as you open the app.

There is no public website and no store page yet. Clone the repo and run it locally.

## Try it in the browser

You need **Node 22+**.

```bash
git clone https://github.com/RicheyWorks/computerpets
cd computerpets
cd web
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) (or [http://127.0.0.1:8080](http://127.0.0.1:8080)). Rui is already there. No account required.

On a phone or tablet, open that same local page. You can Add to Home Screen if you want.

## Put them on your desktop

Pets walk on **Windows, Mac, and Linux**. You don't need a license.

From the repo root:

```powershell
# Windows
.\desktop.ps1
```

```bash
# Mac and Linux
sh desktop.sh
```

Or:

```bash
cd desktop
npm install
npm start
```

Right-click the pet, or use the tray / menu bar: feed, play, rest, clean, medicine, hide, or a species special. On a Mac that extra control sits in the menu bar. On Linux it sits in the panel.

More in [desktop/README.md](desktop/README.md).

## What you can do

- **Feed, play, rest, clean.** Give medicine if they get sick.
- **Talk** is optional. Set `XAI_API_KEY` if you want Grok. Without it, Rui still answers from lines saved in the app.
- Leave them alone too long and they can get hungry, unwell, or walk off until you call them back.

Once the browser app is running on this machine, a single pet can also walk at `/demo/rui` (and other slugs). That page is **local only** — it is not a hosted demo.

## Sign in, hatch, and nest (optional)

Sign in when you want to hatch more pets, keep a collection, or pair two you already have at `/nest`. You do not need an account just to meet Rui.

## Another desktop client (optional)

A Python window lives in `client/`. Python 3.11+ (3.12 recommended). Pets walk without a license.

```bash
cd client
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
python -m computerpets_client
```

More in [client/README.md](client/README.md).

## Unlock backend (optional, operators)

You do not need Java to keep pets in the browser or on the desktop.

The service at the repo root is only for ownership verify, license unlock, and the admin ledger. It needs **Java 21**, **Maven 3.9+**, plus `LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`, and `ADMIN_API_KEY`. Local run can use `RATE_LIMIT_BACKEND=memory` if Redis is not up.

The browser app stays on **8080**. Java sits at **http://localhost:8081**. They do not share a port. Operators: [docs/SETUP.md](docs/SETUP.md). The unlock wire is [docs/CLIENT-CONTRACT.md](docs/CLIENT-CONTRACT.md). `/admin` is for operators.

## Docs

- [Browser app](web/README.md)
- [Desktop overlay](desktop/README.md)
- [PyQt client](client/README.md)
- [Setup](docs/SETUP.md) — Java backend, secrets, profiles
- [Client contract](docs/CLIENT-CONTRACT.md)
- [Documentation index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [ADRs](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md)

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE).

---

*Two hundred ten living kinds. Keep them so a line does not go quiet.*
