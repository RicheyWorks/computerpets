# ComputerPets

Virtual pets that live on your computer — walk your windows, eat from the keeper card, and **caw** when you Call.

<p align="center">
  <img src="docs/readme-hero.jpg" alt="Rui the red panda, Paint the clownfish, Scrape the parrotfish, Wreath the anemone, and Reed the frog — five of two hundred twenty-one ComputerPets" width="920">
</p>

**Start here: [How to get your first pet](docs/START-HERE.md)**

That page is a teacher. Click it. It has numbered steps. You do not need to know how to code.

## Meet some of them

There are **221** animals in this house. These are some of them.

<p align="center">
  <img src="docs/readme-friends.jpg" alt="Rui the red panda, Lunge the bass, Speck the brook trout, Whisk the catfish, Bar the perch, Night the walleye, Lance the pike, Silver the eel, Spoon the paddlefish, Penny the bluegill, Coin the goldfish, Reed the frog, Whorl the pond snail, Eft the newt, and Dapple the salamander" width="920">
</p>

<p align="center">
  <img src="docs/readme-friends-more.jpg" alt="Pebble the toad, Pinch the crayfish, Hinge the mussel, Ink the turtle, Latch the leech, Prickle the stickleback, Ridge the brain coral, Wreath the anemone, Paint the clownfish, Scrape the parrotfish, Scrub the cleaner shrimp, Rue the fox, Slick the otter, Burr the hedgehog, and Wash the raccoon" width="920">
</p>

House names. The ones you say out loud.

**[See all 221](docs/GUESTS.md)** — every guest’s real picture, not just these groups.

## Put a pet on your real desktop

This is the first teaching point. A pet walks on top of your windows. Like a living sticker. **Rui the red panda** comes first. A keeper card sits with them: name, stage, bond, Hunger / Rest / Bond, Feed / Play / Rest. Click the name to collapse it. Voice, color, saved lines, alarm, timer, mute, and Turn off sit on the expanded card. The tray by the clock has **On the desk** — Rui, Sip, and the grid ten, no scrolling two hundred twenty-one names.

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

The first time can take a few minutes. `npm install` means "get the pieces." Leave the window open. A pet should walk on your real desktop. The keeper card starts with a short hello, just once: press **Got it** and it goes away for good.

Git and Node are the two helpers that make that start work. Install [Git](https://git-scm.com) (or [GitHub Desktop](https://desktop.github.com) if you like pictures more than typing) and [Node](https://nodejs.org) (the big **LTS** button, version 22 or newer) once, before you type the start. The start-here page shows those buttons.

- **First click** is a sit.
- **Drag** is a carry.
- **Feed / Play / Rest** sit on the keeper card.
- **Right-click** the pet, or the little tray icon by the clock: **On the desk**, feed, play, rest, clean, medicine, hide.
- **Call** uses a species cry when the wav exists.

Clicks on empty glass pass through to your windows. The floor is the work area, above the taskbar. Pets climb real windows on Windows — **Rui** sets the quality bar; the rest follow that feel. More window tricks live in [docs/GUESTS.md](docs/GUESTS.md) and [desktop/README.md](desktop/README.md).

### Mac

Same helpers, plus [Git LFS](https://git-lfs.com) for the pet pictures (`brew install git-lfs`, then `git lfs install` once, before you copy the pets). Then in Terminal, inside the `computerpets` folder:

```bash
sh desktop.sh
```

The extra control sits in the menu bar.

### Linux

Same helpers, plus Git LFS for the pet pictures (`sudo apt install git-lfs` on Ubuntu or Debian, then `git lfs install` once). Then:

```bash
sh desktop.sh
```

The mark sits in the panel.

If `sh desktop.sh` says the pet pictures did not download, or that some pets are still missing their pictures, type `git lfs pull` in the `computerpets` folder and start again. Node must be 22 or newer; the `nodejs` from `apt` is often older.

More in [desktop/README.md](desktop/README.md).

## They make real noise

**221 of 221** guests answer **Call** with a real recording — not beeps. Most guests with a voice play their own species (Jaw plays a close relative, a Nile crocodile). Quiet guests — fungi, plants, microbes, and many small animals — play a real recording of the soft sound their life makes: a rustle, a drip, a wing whir. Four — **Sol**, **Shift**, **Spike**, and **Lid** — play a real habitat recording until open-licensed tape of their own species exists. Commons, Xeno-canto, Freesound, BigSoundBank, iNaturalist, and open-access papers. Call plays a short dry cut.

A few you might know by name:

- **Rui** (red panda) — a bright twitter
- **Sip** (ruby-throated hummingbird) — field chips
- **Soot** (American crow) — a dry caw

Full recordist credits, licenses, and every guest with a cry live in **[docs/CRIES.md](docs/CRIES.md)**. No music beds. No English narrator. If it sounds like a phone UI, it does not ship.

## Life on the desk

Feed them when they look hungry. Play so they stay happy. Let them rest when they look tired. Clean up the mess they leave. Give **Medicine** if they get sick (the card will say Unwell when health dips — Feed and Clean help too).

**Drag** a pet to carry them somewhere else on the screen. Called guests can drag the same way; a short tap opens small choices like Send home or Bye. When a pet needs care, Windows can show a small toast — click it and the matching care opens on the desk.

Three dark chips — **Weather**, **News**, and **Quotes** — are desk plates. Click the header to open. Drag the header to move. Weather and News keep **Favorites**. Quotes can follow crypto and NFT lines you care about. Tap Plate color to change the paint; it sticks after restart.

The keeper card is the daily care. Open the expanded card for **Call** and the rest of care in one place. The tray **On the desk** picks Rui, Sip, and the grid ten. If you ignore them, they get hungry. They can get unwell. They can walk away until you call them back.

There are **221** animals. Rui is the first one you meet.

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

More pages: [docs/README.md](docs/README.md). Cry credits: [docs/CRIES.md](docs/CRIES.md). Guests: [docs/GUESTS.md](docs/GUESTS.md).

## License

Copyright (c) 2026 RicheyWorks. All rights reserved. This is a private house. See [LICENSE](LICENSE).

---

*Two hundred twenty-one living kinds. Keep them so a line does not go cool.*

