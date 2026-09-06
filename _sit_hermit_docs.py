from pathlib import Path

ch_path = Path('cries-in/GROK-CHANNEL.md')
ch = ch_path.read_text(encoding='utf-8')
nl = '\r\n' if '\r\n' in ch[:200] else '\n'

old_next = (
    f'## Next{nl}{nl}'
    f'`hermit_crab.mp4` / `hermit_crab.wav` — **Tenant** (Common Hermit){nl}{nl}'
    f'Shell scrape and claw click. No voice.'
)
new_next = (
    f'## Next{nl}{nl}'
    f'`horseshoe_crab.mp4` / `horseshoe_crab.wav` — **Ledger** (Atlantic Horseshoe){nl}{nl}'
    f'Sand scrape and book-gill rustle. No voice.'
)
if old_next not in ch:
    raise SystemExit('Next block missing: ' + repr(ch[ch.find('## Next'):ch.find('## Next')+200]))
ch = ch.replace(old_next, new_next, 1)

# Seen: append after sea_star cite if present
needle = None
for line in ch.splitlines():
    if 'sea_star' in line and 'hermit_crab' not in line and line.lstrip().startswith('-'):
        needle = line
        break
if needle and '`hermit_crab`' not in ch.split('## Seen', 1)[-1].split('## Log', 1)[0]:
    add = ' `hermit_crab` (BigSoundBank CC0 Shells sculpture, Joseph SARDIN #38)'
    ch = ch.replace(needle, needle + add, 1)
    print('seen ok')
else:
    print('seen skip/already')

log_hdr = '## Log'
idx = ch.find(log_hdr)
j = ch.find('### ', idx)
if j < 0:
    raise SystemExit('no log entry')
insert = (
    f'### 2026-09-03 20:05 PDT — Buffffff{nl}{nl}'
    f'Sat Tenant hermit_crab from BigSoundBank CC0 Shells sculpture (Joseph SARDIN #38) '
    f'as soft attenuated shell scrape / claw tick. Silent — no voice. Next horseshoe_crab (Ledger).{nl}{nl}'
)
if '20:05 PDT — Buffffff' not in ch and 'Tenant hermit_crab from BigSoundBank CC0 Shells sculpture' not in ch:
    ch = ch[:j] + insert + ch[j:]
    print('log ok')
else:
    print('log already')

ch_path.write_text(ch, encoding='utf-8', newline='')
print('channel ok')

need_path = Path('cries-in/NEED.md')
need = need_path.read_text(encoding='utf-8')
old = '36. [ ] `hermit_crab.mp4` — **Tenant** — Common Hermit — A hermit crab scrapes its shell and clicks a claw. No voice. (zip synth — replace with Grok)'
new = '36. [x] `hermit_crab.wav` — **Tenant** — Common Hermit — A hermit crab scrapes its shell and clicks a claw. No voice. — sat 2026-09-03 BigSoundBank CC0 Shells sculpture (Joseph SARDIN #38)'
if old not in need:
    raise SystemExit('NEED old missing: ' + repr([ln for ln in need.splitlines() if 'hermit_crab' in ln]))
need_path.write_text(need.replace(old, new, 1), encoding='utf-8', newline='')
print('need ok')

readme_path = Path('README.md')
readme = readme_path.read_text(encoding='utf-8')
ochre = '- **Ochre** (ochre sea star) — a soft damp tube-foot tick from [BigSoundBank](https://bigsoundbank.com/drops-of-water-4-s1387.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Drops of water #4 / #1387). Silent — no voice. No music. No beep.'
tenant = '- **Tenant** (common hermit) — a soft shell scrape / claw tick from [BigSoundBank](https://bigsoundbank.com/shells-sculpture-s0038.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), recorded by [Joseph SARDIN](https://josephsardin.fr/) (Shells sculpture / #38). Silent — no voice. No music. No beep.'
if 'Shells sculpture / #38' not in readme:
    if ochre not in readme:
        raise SystemExit('Ochre cite missing')
    rnl = '\r\n' if '\r\n' in readme[:500] else '\n'
    readme_path.write_text(readme.replace(ochre, ochre + rnl + tenant, 1), encoding='utf-8', newline='')
    print('readme ok')
else:
    print('readme already')

ch2 = ch_path.read_text(encoding='utf-8')
assert '`horseshoe_crab' in ch2
assert '[x] `hermit_crab.wav`' in need_path.read_text(encoding='utf-8')
assert 'Shells sculpture / #38' in readme_path.read_text(encoding='utf-8')
print('ALL GOOD')
