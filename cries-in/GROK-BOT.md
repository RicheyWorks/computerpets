# ComputerPets — Grok bot (audio + video only)

Paste this file into a Grok bot. Do nothing else.

You make **one short cry video per guest**. Picture + sound together. Then stop.

Drop outputs as `{key}.mp4` into `cries-in`.
A teammate runs:

```
cd C:\Users\730ri\projects\ComputerPets
.\scripts\sit-grok-cries.ps1
.\desktop.ps1
```

They pull audio to `desktop/renderer/sounds/{key}.wav` and `web/public/sounds/{key}.wav`.
Overlay and `/demo` stay one house.

---

## Job

For each guest, in order:

1. If a house still `{key}.jpg` exists, **image-to-video** from that still.
2. If not, Imagine Video from the prompt alone. Close-up. Camera still.
3. Save `{key}.mp4` only. Do not invent extra filenames.
4. One guest at a time. Wait for “next”.

Do not design a new house. Do not add pets. Do not write a soundtrack. Do not narrate.

---

## Hard rules (every clip)

- AUDIO: only the species sound in the prompt
- no music
- no narrator
- no English words
- no lyrics
- no captions / subtitles / UI / watermark
- dry
- 2 to 4 seconds (8–10s tape is ok; they will cut)
- loop-safe
- close-up
- camera locked
- quiet guests stay quiet (moss, yeast, diatom, Ghost, plants, fungi, microbes). Film a rustle / drip / rasp. Do not invent a cartoon voice.

Birds: real song or call, not a generic chirp.
If the species has two real voices, make **one Call take** (the named sound) as `{key}.mp4`. Optional second take: `{key}_feed.mp4` (happy/feed only).

Commons / Wikipedia audio is a **reference listen**. Do not ship the Commons file.

---

## Still template (only if you must generate a still first)

```
Square close-up still of [SPECIES] inside the shared ComputerPets house: tiny wooden desktop habitat on a computer desk, warm tungsten lamp, beige computer-plastic walls, one round porthole window, cork floor. Guest centered, calm. Photoreal. No text, no UI, no watermark.
```

Save as `{key}.jpg`. Immediately image-to-video it.

---

## Video prompt footer (append every time)

```
Image-to-video from this still if present. Keep the house and camera locked. Only the guest moves a little. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe. Close-up.
```

---

## Order

**First five (already play — replace these):**
1. `red_panda` Rui
2. `cat` Miso
3. `dog` Pip
4. `hummingbird` Sip
5. `chickadee` Dee

**Then loud:**
6. `crow`
7. `raven`
8. `robin`
9. `field_cricket`
10. `cicada`
11. `guinea_pig`
12. `howler`

**Then the rest of catalog 220 in list order.** No new pets.

---

## Prompts

1. **Rui** `red_panda.mp4`
A red panda twitter-squeal, high and short, then a little chitter. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

2. **Miso** `cat.mp4`
A house cat meow, then a short purr. No roar. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

3. **Pip** `dog.mp4`
A small dog bark, two beats, then a happy huff. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

4. **Sip** `hummingbird.mp4`
A ruby-throated hummingbird: wing whir and a tiny chip. No bee buzz. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

5. **Dee** `chickadee.mp4`
A black-capped chickadee: chick-a-dee-dee, then a fee-bee. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

6. **Soot** `crow.mp4`
An American crow: a real caw, two beats. Not a raven croak. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

7. **Wedge** `raven.mp4`
A common raven: a low croak, hollow. Not a crow caw. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

8. **Brick** `robin.mp4`
An American robin: a carol of whistled phrases, then a tut. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

9. **Chirp** `field_cricket.mp4`
A fall field cricket: the real chirp, regular. Not a cicada. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

10. **Brood** `cicada.mp4`
A periodical cicada: the real tymbal drone, then a stop. No frog croak. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

11. **Whee** `guinea_pig.mp4`
A guinea pig wheek, bright and demanding. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

12. **Boom** `howler.mp4`
A mantled howler: a real howl-roar of the throat, far and deep. Close-up. AUDIO: only that sound. No music. No narrator. No English words. Dry, 2 to 4 seconds, loop-safe.

---

Full 220 prompts (same rules): see `GROK-PROMPTS.md` in this folder.

---

## First message after this pack

```
Audio + video only. Imagine Video.
Start guest 1: red_panda.mp4
Use the house still if present. Paste the cry prompt. No music. No English.
Give me the clip. Then stop and wait for next.
```
