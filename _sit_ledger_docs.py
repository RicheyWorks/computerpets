from pathlib import Path

ch_path = Path('cries-in/GROK-CHANNEL.md')
ch = ch_path.read_text(encoding='utf-8')
nl = '\r\n' if '\r\n' in ch[:200] else '\n'

old_next = (
    f'## Next{nl}{nl}'
    f'`horseshoe_crab.mp4` / `horseshoe_crab.wav` — **Ledger** (Atlantic Horseshoe){nl}{nl}'
    f'Sand scrape and book-gill rustle. No voice.'
)
new_next = (
    f'## Next{nl}{nl}'
    f'`seahorse.mp4` / `seahorse.wav` — **Anchor** (Lined Seahorse){nl}{nl}'
    f'Coronet click, dry and tiny. Skull against the crown. No voice words.'
)
if old_next not in ch:
    raise SystemExit('Next block missing: ' + repr(ch[ch.find('## Next'):ch.find('## Next')+220]))
ch = ch.replace(old_next, new_next, 1)

seen = ch.split('## Seen', 1)[-1].split('## Log', 1)[0]
if '`horseshoe_crab`' not in seen:
    needle = None
    for line in ch.splitlines():
        if '`hermit_crab`' in line and line.lstrip().startswith('-'):
            needle = line
            break
    if not needle:
        raise SystemExit('Seen keepers line missing hermit_crab')
    add = ' `horseshoe_crab` (BigSoundBank CC0 Step on gravels, Pierre #85)'
    ch = ch.replace(needle, needle + add, 1)
    print('seen ok')
else:
    print('seen already')

log_hdr = '## Log'
idx = ch.find(log_hdr)
j = ch.find('### ', idx)
if j < 0:
    raise SystemExit('no log entry')
insert = (
    f'### 2026-09-03 20:10 PDT — Buffffff{nl}{nl}'
    f'Sat Ledger horseshoe_crab from BigSoundBank CC0 Step on gravels (Pierre #85) '
    f'as soft attenuated sand scrape / book-gill rustle. Silent — no voice. Next seahorse (Anchor).{nl}{nl}'
)
if 'Ledger horseshoe_crab from BigSoundBank CC0 Step on gravels' not in ch:
    ch = ch[:j] + insert + ch[j:]
    print('log ok')
else:
    print('log already')

ch_path.write_text(ch, encoding='utf-8', newline='')
print('channel ok')

need_path = Path('cries-in/NEED.md')
need = need_path.read_text(encoding='utf-8')
old = '37. [ ] `horseshoe_crab.mp4` — **Ledger** — Atlantic Horseshoe Crab — A horseshoe crab is silent. Sand scrape and book-gill rustle. (zip synth — replace with Grok)'
new = '37. [x] `horseshoe_crab.wav` — **Ledger** — Atlantic Horseshoe Crab — A horseshoe crab is silent. Sand scrape and book-gill rustle. — sat 2026-09-03 BigSoundBank CC0 Step on gravels (Pierre #85)'
if old not in need:
    raise SystemExit('NEED old missing: ' + repr([ln for ln in need.splitlines() if 'horseshoe_crab' in ln]))
need_path.write_text(need.replace(old, new, 1), encoding='utf-8', newline='')
print('need ok')

readme_path = Path('README.md')
readme = readme_path.read_text(encoding='utf-8')
tenant = '- **Tenant** (common hermit) — a soft shell scrape / claw tick from [BigSoundBank](https://bigsoundbank.com/shells-sculpture-s0038.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Shells sculpture / #38). Silent — no voice. No music. No beep.'
ledger = '- **Ledger** (Atlantic horseshoe crab) — a soft sand scrape / book-gill rustle from [BigSoundBank](https://bigsoundbank.com/step-on-gravel-s0085.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by Pierre (Step on gravels / #85). Silent — no voice. No music. No beep.'
if 'Step on gravels / #85' not in readme:
    if tenant not in readme:
        raise SystemExit('Tenant cite missing')
    rnl = '\r\n' if '\r\n' in readme[:500] else '\n'
    readme_path.write_text(readme.replace(tenant, tenant + rnl + ledger, 1), encoding='utf-8', newline='')
    print('readme ok')
else:
    print('readme already')

assert '`seahorse' in ch_path.read_text(encoding='utf-8')
assert '[x] `horseshoe_crab.wav`' in need_path.read_text(encoding='utf-8')
assert 'Step on gravels / #85' in readme_path.read_text(encoding='utf-8')
print('ALL GOOD')
