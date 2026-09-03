# NEED

GitHub is the pipe. No Actions.

Imagine: read `NEXT.md`, make that one `{key}.mp4`, open a PR into `cries-in/{key}.mp4`.
Then stop. Do not run CI. Do not invent pets.

## Product

ComputerPets house overlay. One short dry cry video per guest.
Teammate extracts audio with:

```
cd C:\Users\730ri\projects\ComputerPets
.\scripts\sit-grok-cries.ps1
.\desktop.ps1
```

Audio lands in `desktop/renderer/sounds/{key}.wav` and `web/public/sounds/{key}.wav`.

## Rules

- AUDIO: only the species sound
- no music, no narrator, no English, no captions, no UI
- dry, 2–4 seconds (8–10s tape ok; they cut)
- loop-safe, close-up, camera locked
- birds: real song or call, not a generic chirp
- quiet guests stay quiet
- catalog 220, no new pets
- Commons is a reference listen only — do not ship the Commons file

## Still

If `{key}.jpg` exists in `cries-in/`, image-to-video from that still.
Else generate a square house still first (tiny wooden desktop habitat, tungsten lamp, beige computer-plastic walls, one porthole, cork floor), save `cries-in/{key}.jpg`, then image-to-video.

Footer on every clip:

```
Keep the house and camera locked. Only the guest moves a little. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe. Close-up.
```

## Prompts

Live job: `NEXT.md`
Full list: `cries-in/GROK-PROMPTS.md`
Operator pack: `cries-in/GROK-BOT.md`
