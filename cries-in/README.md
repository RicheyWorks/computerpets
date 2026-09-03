# Drop Grok cries here

This folder is the front door for guest voices.

1. Make a short Grok Imagine video. Name it like the catalog key: `red_panda.mp4`.
2. Drop the video in this folder.
3. Open PowerShell in the ComputerPets folder and run:

```powershell
cd C:\Users\730ri\projects\ComputerPets
.\scripts\sit-grok-cries.ps1
```

The sit script pulls the sound out and puts a `.wav` in both sound folders the house already uses.

## First batch

Start with these five. They still have house-synth cries until you replace them.

1. `red_panda.mp4` — Rui twitter / bleat
2. `cat.mp4` — Miso meow
3. `dog.mp4` — Pip bark
4. `hummingbird.mp4` — Sip wing whir + chip
5. `chickadee.mp4` — Dee fee-bee / chick-a-dee

Then any other `{key}.mp4` from the catalog. The full cry list lives in `GROK-PROMPTS.md` in this same folder.

## Rules for a drop

- 2 to 4 seconds is best. Longer is ok; the script keeps the first 4 seconds of sound.
- No music. No narrator. No English words.
- Quiet guests (moss, yeast, diatom, luna) should be actual quiet or rustle, not a cartoon beep.
- `.mp4`, `.mov`, and `.webm` all work. Unknown names are skipped.

The five old synth cries stay until a real drop sits in their place.