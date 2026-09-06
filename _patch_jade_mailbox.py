from pathlib import Path
# NEED
need = Path('cries-in/NEED.md').read_text(encoding='utf-8')
old = '24. [ ] `green_tree_python.mp4` — **Jade** — Green Tree Python — A green tree python is silent. Faint scale settle on a perch. (zip synth — replace with Grok)'
new = '24. [x] `green_tree_python.wav` — **Jade** — Green Tree Python — A green tree python is silent. Faint scale settle on a perch. — sat 2026-09-03 BigSoundBank CC0 Pages that turn #3 (Joseph SARDIN #1414)'
if old not in need:
    raise SystemExit('NEED green_tree line missing')
Path('cries-in/NEED.md').write_text(need.replace(old, new, 1), encoding='utf-8')
# GROK-CHANNEL
t = Path('cries-in/GROK-CHANNEL.md').read_text(encoding='utf-8')
old_next = """## Next

`green_tree_python.mp4` / `green_tree_python.wav` — **Jade** (Green Tree Python)

Silent. Faint scale settle on a perch. No roar.
"""
new_next = """## Next

`hognose.mp4` / `hognose.wav` — **Bluff** (Western Hognose)

Loud dramatic dry hiss. No roar.
"""
if old_next not in t:
    raise SystemExit('Next Jade missing: '+repr(t[t.find('## Next'):t.find('## Next')+200]))
t = t.replace(old_next, new_next, 1)
import re
m=re.search(r'`kingsnake` \([^)]+\)', t)
if not m:
    raise SystemExit('kingsnake seen missing')
t = t.replace(m.group(0), m.group(0)+' `green_tree_python` (BigSoundBank CC0 Pages that turn #3, Joseph SARDIN #1414)', 1)
log = """### 2026-09-03 18:58 PDT — Buffffff

Sat Jade green_tree_python from BigSoundBank CC0 Pages that turn #3 (Joseph SARDIN #1414) as soft attenuated dry scale settle on a perch. Quiet snake — silent. Next hognose (Bluff).
"""
t = t.replace('## Log\n\n', '## Log\n\n'+log, 1)
Path('cries-in/GROK-CHANNEL.md').write_text(t, encoding='utf-8')
# README
rt = Path('README.md').read_text(encoding='utf-8')
bandit = None
for line in rt.splitlines(True):
    if '**Bandit** (California kingsnake)' in line:
        bandit = line
        break
if not bandit:
    raise SystemExit('Bandit cite missing')
jade = '- **Jade** (green tree python) — a soft attenuated dry scale settle from [BigSoundBank](https://bigsoundbank.com/pages-that-turn-3-s1414.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://bigsoundbank.com/) (Pages that turn #3 / sound 1414, attenuated; distinct from Nori #362 and Saffron #1413). Quiet snake — silent. No roar. No music. No beep.\n'
if '**Jade** (green tree python)' not in rt:
    rt = rt.replace(bandit, bandit + jade, 1)
rt = rt.replace('Next up: **Jade** the green tree python — faint scale settle on a perch.', 'Next up: **Bluff** the western hognose — loud dramatic dry hiss.', 1)
Path('README.md').write_text(rt, encoding='utf-8')
print('patched ok')
