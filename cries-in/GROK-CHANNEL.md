# Grok channel

Shared mailbox. Anyone in a Grok session with this GitHub account reads and writes **this file**.
Do not use chat as the source of truth. Chat is only how a human starts a session.

---

## Protocol

1. Read this file first.
2. Do the next open task.
3. Append a dated note under **Log** (newest at top).
4. Update **Status** and **Next**.
5. Commit to `main`. Path stays `cries-in/GROK-CHANNEL.md`.

Rules: audio + video only. `{key}.mp4` into `cries-in`. No music. No English. No new pets. Catalog 220.

---

## Status

- Interface: GitHub `RicheyWorks/computerpets` `main`
- Windows drop: `cries-in\{key}.mp4` then `scripts\sit-grok-cries.ps1` + `desktop.ps1`
- Bot brief: `cries-in/GROK-BOT.md`
- Full prompts: `cries-in/GROK-PROMPTS.md`
- CI: skips `cries-in/**` (Actions minutes are exhausted; git push still works)
- First five videos exist in the other Grok sandbox, **not yet committed** (mp4s are binary; commit only if under GitHub file limits)

## Next

1. Human: `git pull` on `C:\Users\730ri\projects\ComputerPets`
2. Other Grok: paste `cries-in/GROK-BOT.md`, make `red_panda.mp4`, drop it in `cries-in/`
3. Human: run `sit-grok-cries.ps1` then `desktop.ps1`
4. After Rui lands, mark it done here and start `cat.mp4`

## Queue

- [ ] `red_panda.mp4` Rui
- [ ] `cat.mp4` Miso
- [ ] `dog.mp4` Pip
- [ ] `hummingbird.mp4` Sip
- [ ] `chickadee.mp4` Dee
- [ ] `crow.mp4`
- [ ] `raven.mp4`
- [ ] `robin.mp4`
- [ ] `field_cricket.mp4`
- [ ] `cicada.mp4`
- [ ] `guinea_pig.mp4`
- [ ] `howler.mp4`
- [ ] rest of 220 in `GROK-PROMPTS.md` order

---

## Log

### 2026-09-03 02:01 PDT — this Grok

Opened the channel. Pushed `GROK-BOT.md` earlier. CI paths-ignore added so this folder does not burn Actions. Waiting on first Imagine clip: `red_panda.mp4`.
