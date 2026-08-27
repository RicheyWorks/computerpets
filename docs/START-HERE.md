# How to get your first pet

<p align="center">
  <img src="readme-rui.jpg" alt="Rui the red panda, the first pet you meet" width="360">
</p>

<p align="center"><em>Rui the red panda, the first pet you meet.</em></p>

Hi. This page is a teacher. You do not need to know how to code.

You are going to put a ComputerPet **on your real Windows desktop**. Not inside a game window. On top of your homework, your browser, everything. Rui the red panda walks there first.

## What that looks like

This is the picture. Hold it in your head. The rest of the page is how you get there.

- A pet walks on your **real desktop**. Homework stays homework. The pet is a living sticker on top.
- A **keeper card** sits with them. It says their name, whether they are a hatchling or grown, their bond word, and three meters: Hunger, Rest, Bond. Three buttons sit under that: **Feed**, **Play**, **Rest**. Click the name to collapse it to a small hit. Voice, color, saved lines, an alarm, a timer, mute, and **Turn off** sit on the expanded card. Turn off quits the overlay. Start again with `.\desktop.ps1`.
- Near the clock (bottom-right) a small ComputerPets tray icon sits. Right-click it. **On the desk** picks Rui, Sip, and the grid ten without scrolling two hundred twenty names: Rui, Sip, Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground.
- Clicks on empty glass pass through to your windows. Hits stay on the pet, the keeper card buttons, treats, and gifts. The floor is the Windows work area — above the taskbar, under the cursor.
- Rui can jump onto the **side** of a real window, hang on, then drop or dive back to the desk. Arc jumps onto the **top** (title-bar / ridge), holds, then hops or slides off. Other guests walk a sill or stay on the floor. The overlay reads window bounds, not pixels. Mac and Linux window play is a later door.
- The card may say `Java 8081 · DOWN · unread`. That is honest. You did not start Java. Care still works. Care is local. `/pet/feed` is not a door.

That walk is the Electron overlay. It is Chromium on your desk, not DirectX 12, not a Microsoft Store app, not a browser tab.

This page is written for **Windows 10 and Windows 11**. That is what most friends have. Mac and Linux friends get a short note near the end. Do not start there.

## The honest download

There is no Steam page. There is no Itch page. There is no Microsoft Store button. There is no live Store ID. There is no magic `.exe` sitting on a website. Anyone who says there is one is guessing.

The honest way is: copy this house from [GitHub](https://github.com/RicheyWorks/computerpets), then turn the desktop overlay on.

Today that needs two free helpers — Git (the copier) and Node (the flashlight the overlay uses). You do not have to learn them. You only install them once. The start you will type is `.\desktop.ps1`. That script runs `npm start`, which is `electron .`. Grown-ups can later build their own installer with electron-builder. We do not publish one. We do not have a Store listing.

## What you need

- A computer with **Windows 10 or Windows 11**
- The internet
- About 15 minutes the first time (the first start can feel slow — that is normal)
- A grown-up nearby if a download asks for a password

You do not need an account. You do not need money. You do not need Java. You do not need a license. You do not need to learn Node.

## The main quest

**Put Rui on your real desktop.**

You will do five jobs. The picture above is the point. The helpers are how we get there today.

1. Install Git (or GitHub Desktop)
2. Install Node
3. Copy the pets onto your computer
4. Open PowerShell in the right folder
5. Start the desktop pet

The browser comes later. It is the same house in a window. It is not the main quest.

---

## Step 1 — Install Git (the copier)

Git is a free helper. It copies the pets from the internet onto your computer. You do not have to learn Git. You only install it once.

Pick **one** path. The picture app is easier if you have never typed a command.

### Easier: GitHub Desktop

1. Open [https://desktop.github.com](https://desktop.github.com).
2. Click **Download now** (or **Download for Windows**).
3. Open the file that landed in your Downloads folder.
4. If Windows asks "Do you want to allow this app," that is a grown-up / password moment. Then click through.
5. **Next** is okay. Leave the choices as they are.
6. When it says you are done, you can close the installer.

**What you should see:** an app called GitHub Desktop. It may ask you to sign in. You can sign in, or you can click through and still copy the pets with a URL in a later step.

### Or: Git itself

1. Open [https://git-scm.com/downloads](https://git-scm.com/downloads).
2. Click **Windows**.
3. Click the **64-bit Git for Windows Setup** installer.
4. Open that file.
5. Click **Next**, **Next**, **Next**. Leave the little checkboxes as they already are. The defaults are fine.
6. Click **Finish**.

**What you should see:** the installer goes away. Git is now on the computer. You will not "open Git" like a game. It waits until you need it.

If the computer already has Git or GitHub Desktop, skip this step.

---

## Step 2 — Install Node (the helper the pets need)

Node is a free helper app the overlay needs today. You do not have to learn it. You only install it once. There is no Store installer that skips this.

1. Open [https://nodejs.org](https://nodejs.org).
2. You will see two big buttons. Click the big **LTS** button. That is the recommended one.
3. **LTS means "the safe version."** The other button is for people who like brand-new experiments. You want the safe one.
4. You want version **22 or newer**. The page may say v22 or v24. Either is fine if it is 22 or bigger.
5. Open the file that downloaded.
6. Click **Next**, **Next**, **Finish**. Leave the defaults.
7. **Close every PowerShell or Terminal window you already had open.** Node only shows up in a *new* window.

### Check that Node is really there

1. Click the Start menu (the Windows button).
2. Type `PowerShell`.
3. Click **Windows PowerShell** (or **Terminal**).
4. A blue or black window opens. That window is a place you type short orders. It is not the pets yet.
5. Type this, then press Enter:

```powershell
node -v
```

**What you should see:** a number like `v22.11.0` or `v24.19.0`. The `v` and the first number matter. **22 or bigger is good.**

Also try:

```powershell
npm -v
```

`npm` is a toolbox that came with Node. You should see a number. You do not have to learn npm either.

**If the computer says it does not know `node`:**

- The install is not finished, or
- You are still in an *old* PowerShell from before the install

Finish the Node installer. Close that PowerShell. Open a **brand new** one. Type `node -v` again.

If you see `v20` or smaller, go back to [https://nodejs.org](https://nodejs.org), click **LTS**, and install again.

---

## Step 3 — Copy the pets onto your computer

Now you copy this house: [https://github.com/RicheyWorks/computerpets](https://github.com/RicheyWorks/computerpets)

Pick **one** path. Do not use someone else's folder. Do not use a path like `C:\Users\730ri\...`. That folder belongs to another person. Use **your** home.

### Easier: GitHub Desktop

1. Open GitHub Desktop.
2. Click **File**.
3. Click **Clone repository**.
4. Click the **URL** tab.
5. Paste this:

```
https://github.com/RicheyWorks/computerpets
```

6. Pick a Local path. **Documents** is a good, boring choice. GitHub Desktop will make a `computerpets` folder there.
7. Click **Clone**.
8. Wait until it finishes.

**What you should see:** GitHub Desktop shows the ComputerPets project. Look at the path it prints under the name. That is *your* copy.

To open that folder in File Explorer: click **Repository**, then **Show in Explorer**.

### Or: PowerShell

1. Open a **new** PowerShell.
2. If you do not have a `projects` folder yet, make one:

```powershell
mkdir $HOME\projects
```

3. Then copy the pets:

```powershell
cd $HOME\projects
git clone https://github.com/RicheyWorks/computerpets
cd computerpets
```

`$HOME` means "your user folder." On Windows that is usually `C:\Users\your-name`. The pets will land in `C:\Users\your-name\projects\computerpets`.

**What you should see:** a folder named `computerpets`. Inside it you can see `desktop.ps1` and a folder named `desktop`.

**If clone fails:**

- Check the internet
- Check Git is installed: type `git --version` and press Enter. You should see a number. If Git is missing, go back to Step 1 and open a new PowerShell after the install

If it says the folder already exists, you already copied the pets. Just `cd` into that `computerpets` folder.

---

## Step 4 — Open PowerShell in the computerpets folder

This is the step people miss. The pets will not start if you are in the wrong room.

You must be in the folder that **has `desktop.ps1` sitting in it**. That folder is named `computerpets`. It is not the `desktop` folder inside it. It is not the `web` folder.

### Easy way (File Explorer)

1. Open the `computerpets` folder in File Explorer.
2. Look around. You should see `desktop.ps1`. You should also see a folder named `desktop`.
3. Click once in the address bar at the top (the place that shows the folder path).
4. Type `powershell` and press Enter.

**What you should see:** a PowerShell window. The line of text before the blinking cursor should end with `computerpets`.

### Other ways

- Windows 11: in that folder, right-click empty space → **Open in Terminal**
- Windows 10: in that folder, hold Shift and right-click empty space → **Open PowerShell window here**
- GitHub Desktop: **Repository** → **Open in Command Prompt** (or **Open in Terminal**)

### Check you are in the right folder

Type this and press Enter:

```powershell
dir desktop.ps1
```

**What you should see:** a file named `desktop.ps1`.

If it says it cannot find the file, you are in the wrong folder. Go back to File Explorer. Open the `computerpets` folder that has `desktop.ps1`. Try again.

---

## Step 5 — Turn the pets on (this is the walk)

The desktop pet lives in the `desktop/` folder. It does **not** need the web app first. You do **not** need Java. You do **not** need a license.

The helper script `desktop.ps1` does two honest jobs:

1. If the pieces are missing, it runs `npm install` (that means "get the pieces")
2. Then it runs `npm start` (that means "turn the pets on"). `npm start` is `electron .`. That is the overlay.

In the PowerShell that is already inside `computerpets`, type this and press Enter:

```powershell
.\desktop.ps1
```

**Stay in that window.** Do not close it. Do not type more things in it. The pets stay on while that window stays open.

### If Windows says it will not run scripts

Do not panic. Type these three lines, one at a time, and press Enter after each:

```powershell
cd desktop
npm install
npm start
```

That is the same start the grown-up docs already use.

### What you should see

**The first time:**

- Lots of words scroll by. Names. Numbers. Progress. That is `npm install` getting the pieces. It can take several minutes. You need the internet. Wait.
- Then more words, and a pet appears **on your real desktop**.
- Look near the clock (the bottom-right corner). A small ComputerPets tray icon should sit there.
- Look for the **keeper card** next to the pet. Name. Stage. Bond word. Hunger, Rest, Bond. Feed, Play, Rest.

**Every time after that:**

- Fewer words. The pieces are already there. The pet should walk sooner.

**Who walks first:** Rui. He is a red panda. He sits on the work area, on top of your other windows. He is not inside a browser.

Leave the PowerShell window open. If you close it, the pet usually goes away.

---

## Step 6 — Say hello

The pet is on your desk. Now you can care for it.

- **First click** on the pet is a sit. They pause.
- **Drag** the pet. That is a carry. Put them somewhere else on the screen.
- **Feed / Play / Rest** on the keeper card. Those three are the daily care. Click the card name to fold it small. **Turn off** quits the overlay.
- **Right-click** the pet for the longer care list.
- Or **right-click the tray icon** by the clock.

The tray has a line named **On the desk**. That is how you pick Rui, Sip, and the grid ten (Arc, Volt, Trace, Flux, Spark, Ion, Gauss, Relay, Fuse, Ground) without scrolling the whole house. **Companions** still has all **220**. Spark on the desk is the same Spark whose browser room is `/demo/crackle`. The firefly already owns `/demo/spark`.

Clicks on empty glass pass through. If you click "nothing," you click the window underneath. That is on purpose.

The longer care list has kid words for real jobs:

| You click | What it means |
|-----------|----------------|
| **Feed** | Give them food |
| **Play** | Play with them (they can chase a ribbon) |
| **Rest** | Let them sleep |
| **Clean** | Clean up the mess they leave |
| **Medicine** | Help them if they feel sick |
| **Hide** | They walk off the screen. **Call back** brings them in again |

If you ignore them, they get hungry. They can get unwell. They can walk away until you call them back.

You do not need Unlock. Unlock is a grown-up door. Pets already walk without a license. Leave Unlock alone.

---

## What if nothing walks

Work down this list. Do not skip.

### "node is not recognized" or "npm is not recognized"

Node is not ready in this window.

1. Finish the Node install from [https://nodejs.org](https://nodejs.org) (the **LTS** button).
2. Close this PowerShell.
3. Open a **new** PowerShell in the `computerpets` folder (Step 4).
4. Type `node -v`. You need v22 or newer.
5. Try `.\desktop.ps1` again.

### The computer cannot find `desktop.ps1`

You are in the wrong folder.

- You might be in `Documents`, or `projects`, or `desktop`, or `web`.
- Go to the folder that **contains** `desktop.ps1`.
- Check with `dir desktop.ps1`.

### The window printed errors, then stopped

Read the last few lines.

- If it talks about `npm` or `install`, the pieces did not finish downloading. Check the internet. Stay in the `computerpets` folder (or `desktop` if you used the three-line start). Run `npm install` again, then `npm start`.
- If you closed the window while words were still scrolling, open a new one and start again. The first get-the-pieces step must finish.

### A window flashed and vanished

You started the pets, then closed the PowerShell. Open PowerShell in the `computerpets` folder again. Run `.\desktop.ps1` again. **Leave it open.**

### You see words, but no pet

- Look behind other windows. Rui can sit on a second monitor.
- Look by the clock for the tray icon. Right-click it. Try **On the desk** → **Rui**, or **Call back**.
- Wait ten seconds. The first start is slower.
- If a Windows firewall box pops up, allow it on this computer.

### `git clone` failed

- Check the internet.
- Type `git --version`. If Git is missing, do Step 1, then open a new PowerShell.
- Or use GitHub Desktop and the URL path instead.

### You went looking for a Store page

There is not one yet. There is no live Microsoft Store ID. Do not download a random "ComputerPets.exe" from a stranger. Come back to this page and do Steps 1–5.

---

## Tomorrow (you do not install again)

Git and Node stay on the computer. You do not download them every day.

To see Rui again:

1. Open the `computerpets` folder.
2. Open PowerShell there (Step 4).
3. Type `.\desktop.ps1` and press Enter.
4. Leave the window open.

That is the whole next visit.

---

## Mac

Same idea. Same two helpers. This leftover is Windows first. Keep this short.

1. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads), or install [GitHub Desktop](https://desktop.github.com).
2. Install Node from [https://nodejs.org](https://nodejs.org). Click **LTS**. Version 22 or newer.
3. Close Terminal. Open a **new** Terminal. Type `node -v`.
4. Copy the pets:

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/RicheyWorks/computerpets
cd computerpets
```

5. Start the desktop pet:

```bash
sh desktop.sh
```

Or:

```bash
cd desktop
npm install
npm start
```

The extra control sits in the **menu bar** (the thin strip at the top of the screen). A click opens care. First click on the pet is a sit. Drag is a carry. Control-click tends.

---

## Linux

Same helpers. Then in a terminal, inside your `computerpets` folder:

```bash
sh desktop.sh
```

The mark sits in the **panel**. A click opens care. First click is a sit. Drag is a carry. A right-click tends.

---

## Another way to visit them (browser)

This is **not** the main quest. Do this after a pet already walks on the desktop, or if you just want to peek in a window.

The pets can also live in Chrome or Edge on **this computer**. Same house as the overlay. Same keeper card. Same Feed / Play / Rest. The `/demo` room shows the Windows tray sit the overlay already uses.

1. Open PowerShell (or Terminal) in the `computerpets` folder. Same folder as `desktop.ps1`.
2. Type these lines, one at a time:

```powershell
cd web
npm install
npm run dev
```

3. `npm install` means "get the pieces" for the browser app. It can take a minute. This is a **different** pile of pieces than the desktop pet.
4. `npm run dev` means "turn the browser pets on."
5. Leave that window open.
6. Open Chrome or Edge. Click or type this exactly:

[http://localhost:8080](http://localhost:8080)

**Localhost means "this computer," not the internet.** Your friend at their house cannot open your localhost. They have to do these steps on their own computer.

**What you should see:** Rui the red panda. No account. The keeper card. The tray sit.

Type it as `http` — not `https`. If the browser adds an extra `s` and the page will not load, delete the `s`.

If the page will not load:

- Is the `npm run dev` window still open?
- Did the words in that window mention `8080`?
- Are you on this same computer?

Once that window is running, [http://localhost:8080/demo/rui](http://localhost:8080/demo/rui) is a room where Rui is already walking. Spark's room is [http://localhost:8080/demo/crackle](http://localhost:8080/demo/crackle). **Those pages are local only.** They are not a hosted demo. They are not a public ComputerPets website. They are the same house as the overlay.

---

## You did it

If Rui is walking on your desktop, you did the main quest.

There are **220** animals in this house. You did not add any. You met the first one.

When you want the long grown-up pages, they live next door: [SETUP.md](SETUP.md) is Java and secrets. You do not need those to keep a pet. [desktop/README.md](../desktop/README.md) is the overlay in grown-up words.
