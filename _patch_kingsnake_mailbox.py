from pathlib import Path

p = Path('cries-in/GROK-CHANNEL.md')
t = p.read_text(encoding='utf-8')
old_next = """## Next

`kingsnake.mp4` / `kingsnake.wav` — **Bandit** (California Kingsnake)

Dry hiss, then tail rattle. No roar.
"""
new_next = """## Next

`green_tree_python.mp4` / `green_tree_python.wav` — **Jade** (Green Tree Python)

Silent. Faint scale settle on a perch. No roar.
"""
if old_next not in t:
    raise SystemExit('Next block not found')
t = t.replace(old_next, new_next, 1)
needle = '`corn_snake` (BigSoundBank CC0 Pages that turn #2, Joseph SARDIN #1413)'
repl = needle + ' `kingsnake` (Freesound CC0 Mexican black kingsnake hiss, TheKingOfGeeks360 #846337)'
if needle not in t:
    raise SystemExit('Seen corn_snake not found')
t = t.replace(needle, repl, 1)
log = """### 2026-09-03 18:55 PDT — Buffffff

Sat Bandit kingsnake from Freesound CC0 Mexican black kingsnake short hiss (TheKingOfGeeks360 #846337; Lampropeltis getula complex). Dry defensive hiss, quiet trail. No movie roar. Next green_tree_python (Jade).
"""
if '## Log\n\n' not in t:
    raise SystemExit('Log missing')
t = t.replace('## Log\n\n', '## Log\n\n' + log, 1)
p.write_text(t, encoding='utf-8')
print('GROK-CHANNEL ok')

r = Path('README.md')
rt = r.read_text(encoding='utf-8')
saffron = '- **Saffron** (corn snake) — a soft attenuated dry scale rustle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-2-s1413.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Pages that turn #2 / sound 1413, attenuated; distinct from Nori #362). Quiet snake — nearly silent. No roar. No music. No beep.\n'
bandit = '- **Bandit** (California kingsnake) — a short dry defensive hiss from Freesound, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [TheKingOfGeeks360](https://freesound.org/people/TheKingOfGeeks360/sounds/846337/) (Mexican black kingsnake, Critter Zone #846337; same *Lampropeltis getula* complex). No movie roar. No music. No beep.\n'
if saffron not in rt:
    raise SystemExit('Saffron cite not found')
if '**Bandit** (California kingsnake)' not in rt:
    rt = rt.replace(saffron, saffron + bandit, 1)
old_next_up = 'Next up: **Bandit** the California kingsnake — dry hiss, then tail rattle.'
new_next_up = 'Next up: **Jade** the green tree python — faint scale settle on a perch.'
if old_next_up not in rt:
    raise SystemExit('Next up Bandit not found')
rt = rt.replace(old_next_up, new_next_up, 1)
r.write_text(rt, encoding='utf-8')
print('README ok')
