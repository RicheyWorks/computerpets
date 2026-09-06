from pathlib import Path

ch_path = Path('cries-in/GROK-CHANNEL.md')
ch = ch_path.read_text(encoding='utf-8')
nl = '\r\n' if '\r\n' in ch[:200] else '\n'

old_next = (
    f'## Next{nl}{nl}'
    f'`seahorse.mp4` / `seahorse.wav` — **Anchor** (Lined Seahorse){nl}{nl}'
    f'Coronet click, dry and tiny. Skull against the crown. No voice words.'
)
new_next = (
    f'## Next{nl}{nl}'
    f'`manta.mp4` / `manta.wav` — **Kite** (Reef Manta){nl}{nl}'
    f'Slow water whoosh of fins. No voice.'
)
if old_next not in ch:
    raise SystemExit('Next block missing: ' + repr(ch[ch.find('## Next'):ch.find('## Next')+240]))
ch = ch.replace(old_next, new_next, 1)

seen = ch.split('## Seen', 1)[-1].split('## Log', 1)[0]
if '`seahorse`' not in seen:
    needle = None
    for line in ch.splitlines():
        if '`horseshoe_crab`' in line and line.lstrip().startswith('-'):
            needle = line
            break
    if not needle:
        raise SystemExit('Seen keepers line missing horseshoe_crab')
    add = ' `seahorse` (BigSoundBank CC0 Finger clashes, Joseph SARDIN #483)'
    ch = ch.replace(needle, needle + add, 1)
    print('seen ok')
else:
    print('seen already')

idx = ch.find('## Log')
j = ch.find('### ', idx)
insert = (
    f'### 2026-09-03 20:15 PDT — Buffffff{nl}{nl}'
    f'Sat Anchor seahorse from BigSoundBank CC0 Finger clashes (Joseph SARDIN #483) '
    f'as soft attenuated dry coronet click. Tiny skull-crown tick — no voice words. Next manta (Kite).{nl}{nl}'
)
if 'Anchor seahorse from BigSoundBank CC0 Finger clashes' not in ch:
    ch = ch[:j] + insert + ch[j:]
    print('log ok')
else:
    print('log already')

ch_path.write_text(ch, encoding='utf-8', newline='')
print('channel ok')

need_path = Path('cries-in/NEED.md')
need = need_path.read_text(encoding='utf-8')
old = '38. [ ] `seahorse.mp4` — **Anchor** — Lined Seahorse — A lined seahorse clicks its coronet, dry and tiny. Skull against the crown. (zip synth — replace with Grok)'
new = '38. [x] `seahorse.wav` — **Anchor** — Lined Seahorse — A lined seahorse clicks its coronet, dry and tiny. Skull against the crown. — sat 2026-09-03 BigSoundBank CC0 Finger clashes (Joseph SARDIN #483)'
if old not in need:
    raise SystemExit('NEED old missing: ' + repr([ln for ln in need.splitlines() if 'seahorse' in ln]))
need_path.write_text(need.replace(old, new, 1), encoding='utf-8', newline='')
print('need ok')

readme_path = Path('README.md')
readme = readme_path.read_text(encoding='utf-8')
ledger = '- **Ledger** (Atlantic horseshoe crab) — a soft sand scrape / book-gill rustle from [BigSoundBank](https://bigsoundbank.com/step-on-gravel-s0085.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by Pierre (Step on gravels / #85). Silent — no voice. No music. No beep.'
anchor = '- **Anchor** (lined seahorse) — a soft dry coronet click from [BigSoundBank](https://bigsoundbank.com/finger-clashes-s0483.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Finger clashes / #483). Tiny skull-crown tick — no voice words. No music. No beep.'
if 'Finger clashes / #483' not in readme:
    if ledger not in readme:
        raise SystemExit('Ledger cite missing')
    rnl = '\r\n' if '\r\n' in readme[:500] else '\n'
    readme_path.write_text(readme.replace(ledger, ledger + rnl + anchor, 1), encoding='utf-8', newline='')
    print('readme ok')
else:
    print('readme already')

assert '`manta' in ch_path.read_text(encoding='utf-8')
assert '[x] `seahorse.wav`' in need_path.read_text(encoding='utf-8')
assert 'Finger clashes / #483' in readme_path.read_text(encoding='utf-8')
print('ALL GOOD')
