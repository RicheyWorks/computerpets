# ComputerPets

Virtual pets that live on your computer.

<p align="center">
  <img src="docs/readme-hero.jpg" alt="Rui the red panda, Paint the clownfish, Scrape the parrotfish, Wreath the anemone, and Reed the frog — five of two hundred ten ComputerPets" width="920">
</p>

**Start here: [How to get your first pet](docs/START-HERE.md)**

That page is a teacher. Click it. It has numbered steps. You do not need to know how to code.

## What you will do

1. Install two free helpers (Git and Node). You only do this once.
2. Copy the pets onto your computer.
3. Start them so a pet walks on your **real desktop**.
4. Later, you can also visit them in a web browser if you want.

There is no Steam, Itch, or Microsoft Store download yet. There is no `.exe` waiting on a website. You copy the pets from [this GitHub page](https://github.com/RicheyWorks/computerpets) and turn them on yourself. That is the real way.

## Put a pet on your desktop

This is the main thing. A pet walks on top of your windows. Like a living sticker. **Rui the red panda** comes first. You do not need an account. You do not need a license.

Windows first. Most friends are on Windows. The [start-here page](docs/START-HERE.md) shows every button.

A tiny preview:

1. Install [Git](https://git-scm.com) (or [GitHub Desktop](https://desktop.github.com) if you like pictures more than typing).
2. Install [Node](https://nodejs.org). Click the big **LTS** button. LTS means "the safe version." You want version 22 or newer. Node is a free helper app the pets need. You do not have to learn it. You only install it once.
3. Copy the pets. Use GitHub Desktop, or type `git clone https://github.com/RicheyWorks/computerpets` into a folder **you** pick.
4. Open PowerShell **in that folder** (the `computerpets` folder that has `desktop.ps1` in it).
5. Type this and press Enter:

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

- **First click** is a sit.
- **Drag** is a carry.
- **Right-click** the pet, or use the little tray icon by the clock: feed, play, rest, clean, medicine, hide.

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

## How to take care of them

Feed them when they look hungry. Play so they stay happy. Let them rest when they look tired. Clean up the mess they leave. Give medicine if they get sick.

If you ignore them, they get hungry. They can get unwell. They can walk away until you call them back.

There are **210** animals. Rui is the first one you meet.

## Another way to visit them (browser)

After the helpers are installed, you can also open the pets in Chrome or Edge. This is optional. The desktop walk is the main quest.

```powershell
cd web
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080). Localhost means "this computer," not the internet. Rui is already there. No account.

A page like `/demo/rui` only works on your own computer. It is not a website for the whole internet.

## Grown-up notes

Unlock, Java, and secrets are **not** for meeting Rui. Pets already walk without a license. Operators: [docs/SETUP.md](docs/SETUP.md).

More pages: [docs/README.md](docs/README.md).

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE).

---

*Two hundred ten living kinds. Keep them so a line does not go quiet.*
