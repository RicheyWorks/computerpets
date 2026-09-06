from pathlib import Path
ts=Path('web/src/lib/pets/window-play.ts').read_text(encoding='utf-8')
# compare chord-off and float-off whitespace
for name in ['chord-off','float-off','sill-hop']:
  i=ts.find(f'if (next.phase === "{name}")')
  chunk=ts[i:i+200]
  nl=chunk.count('\n')
  print(name, 'idx', i, 'newlines in 200', nl, 'repr head', repr(chunk[:80]))
# Find exact float-off to sill-hop block for matching
i=ts.find('if (next.phase === "float-off")')
j=ts.find('if (next.phase === "sill-hop")', i)
block=ts[i:j]
print('BLOCK LEN', len(block))
print(repr(block))
