from pathlib import Path
js=Path('desktop/renderer/window-play.js').read_text(encoding='utf-8')
ts=Path('web/src/lib/pets/window-play.ts').read_text(encoding='utf-8')
for name,t in [('js',js),('ts',ts)]:
  for c in ['const FLOAT = "float";','export const FLOAT = "float";','if (key === "nimbus") return FLOAT;','floatOff:','Others walk a sill','FLOAT,','floatOffPath,','methanebowl','floated','"float-off"','function beginPlay','export function beginPlay']:
    print(name, repr(c), t.count(c))
print('--- durs ---')
for line in js.splitlines():
  if 'floatOn' in line or 'float:' in line or 'floatHold' in line or 'floatOff' in line:
    if 'function' not in line and '//' not in line[:8]:
      print('js', line.strip())
for line in ts.splitlines():
  if 'floatOn' in line or line.strip().startswith('float:') or 'floatHold' in line or 'floatOff' in line:
    if 'function' not in line and '//' not in line[:6]:
      print('ts', line.strip())
# pick/approach/refit snippets
i=js.find('leave: "floated"')
print('js floated context', repr(js[i-80:i+120]))
i=js.find('if (target.kind === FLOAT)')
print('js FLOAT count', js.count('if (target.kind === FLOAT)'))
i=ts.find('| "barkstone" | "lampglass" | "blotterair" | "methanebowl";')
print('ts side', i)
i=ts.find('| "plaqued" | "thirsted" | "chorded" | "floated";')
print('ts leave', i)
