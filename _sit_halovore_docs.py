from pathlib import Path
import re
root = Path(r"C:\Users\730ri\projects\ComputerPets")

def norm(s):
    return s.replace("\r\n", "\n").replace("\r", "\n")

ch = norm((root/"cries-in"/"GROK-CHANNEL.md").read_text(encoding="utf-8"))
old_next = "## Next\n\n`halovore.mp4` / `halovore.wav` — **Brine** (Salt-drinker)\n\nQuiet alien. Frost-salt tick."
new_next = "## Next\n\n`magneton.mp4` / `magneton.wav` — **Beacon** (Field Swimmer)\n\nQuiet alien. Low magnetic hum."
if old_next not in ch:
    raise SystemExit("FAIL next: " + repr(ch[ch.find("## Next"):ch.find("## Next")+160]))
ch = ch.replace(old_next, new_next, 1)
old_seen = "`nexus` (BigSoundBank CC0 Tongue clicks, Joseph SARDIN #1038)"
new_seen = old_seen + " `halovore` (BigSoundBank CC0 Raw rice poured into a saucepan, Joseph SARDIN #201)"
if old_seen not in ch:
    i = ch.find("`nexus`")
    raise SystemExit("FAIL seen near: " + repr(ch[max(0,i-20):i+120]))
ch = ch.replace(old_seen, new_seen, 1)
log = "\n### 2026-09-03 17:17 PDT — Buffffff\n\nSat Brine halovore from BigSoundBank CC0 Raw rice poured into a saucepan (Joseph SARDIN #201) as frost-salt grain tick. Quiet alien — no mouth. Next magneton (quiet).\n"
ch = ch.replace("## Log\n", "## Log\n" + log, 1)
(root/"cries-in"/"GROK-CHANNEL.md").write_text(ch.replace("\n", "\r\n"), encoding="utf-8", newline="")
print("channel ok")

need = norm((root/"cries-in"/"NEED.md").read_text(encoding="utf-8"))
old = "87. [ ] `halovore.mp4` — **Brine** — Salt-drinker — A salt-drinker ticks frost-salt. Dry. No words. (zip synth — replace with Grok)"
new = "87. [x] `halovore.wav` — **Brine** — Salt-drinker — A salt-drinker ticks frost-salt. Dry. No words. — sat 2026-09-03 BigSoundBank CC0 Raw rice poured into a saucepan (Joseph SARDIN #201)"
if old not in need:
    i = need.find("halovore")
    raise SystemExit("FAIL need: " + repr(need[i:i+180]))
need = need.replace(old, new, 1)
(root/"cries-in"/"NEED.md").write_text(need.replace("\n", "\r\n"), encoding="utf-8", newline="")
print("need ok")

readme = norm((root/"README.md").read_text(encoding="utf-8"))
m = re.search(r"(?m)^- \*\*Knot\*\*.+$", readme)
if not m:
    raise SystemExit("no Knot")
cite = "- **Brine** (salt-drinker) — a frost-salt grain tick from [BigSoundBank](https://bigsoundbank.com/raw-rice-poured-into-a-saucepan-s0201.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Raw rice poured into a saucepan / sound 201; dry grain as salt stand-in). Quiet alien — salt tick, no mouth. No music. No beep."
if "**Brine** (salt-drinker)" not in readme:
    readme = readme.replace(m.group(0), m.group(0) + "\n" + cite, 1)
    (root/"README.md").write_text(readme.replace("\n", "\r\n"), encoding="utf-8", newline="")
    print("readme ok")
else:
    print("brine already")
print("done")
