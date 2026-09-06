# Drop field cries here

This folder is the front door for guest voices.

The house builds cries from **real field tape** first — Wikimedia Commons, Xeno-canto, Internet Archive CC0. Grok Imagine is optional backup only.

1. Drop a dry `{key}.wav` or a short `{key}.mp4` named like the catalog key (`crow.wav`, `red_panda.mp4`).
2. Keep a `SOURCE-{key}.txt` next to it with the URL, author, and license.
3. Open PowerShell in the ComputerPets folder and run:

```powershell
cd C:\Users\730ri\projects\ComputerPets
.\scripts\sit-grok-cries.ps1
```

(That script still sits video drops. A ready `.wav` can also go straight into `desktop/renderer/sounds/` and `web/public/sounds/`.)

## Keepers already sat (with cites)

1. `red_panda` — Rui — Commons PD [Red_panda_twittering.ogg](https://commons.wikimedia.org/wiki/File:Red_panda_twittering.ogg) (Mizunoryu)
2. `cat` — Miso — early house field drop (zip)
3. `dog` — Pip — early house field drop (zip)
4. `hummingbird` — Sip — [XC109598](https://xeno-canto.org/109598) Jonathon Jongsma
5. `chickadee` — Dee — early house field drop (zip)
6. `crow` — Soot — Commons PD [American_Crow.ogg](https://commons.wikimedia.org/wiki/File:American_Crow.ogg) (G McGrane)

Full checklist: `NEED.md`. Mailbox: `GROK-CHANNEL.md`.

## Rules for a drop

- 2 to 4 seconds. No music. No narrator. No English words.
- Quiet guests stay quiet or rustle — never a cartoon beep.
- Prefer Public Domain / CC0. CC BY and CC BY-SA need a clear cite in `SOURCE-*.txt` and the root README.
