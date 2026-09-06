from pathlib import Path
house=Path('desktop/renderer/leftover-house.test.cjs').read_text(encoding='utf-8')
for line in house.splitlines():
  if 'Nimbus leftover' in line or 'next leftover' in line or 'playFor("silica")' in line or 'playFor("nimbus")' in line or 'FLOAT' in line:
    print(line[:220])
print('---README---')
rm=Path('README.md').read_text(encoding='utf-8')
i=rm.find('Nimbus floats')
print(rm[i:i+420] if i>=0 else 'missing')
print('---DESK---')
d=Path('desktop/README.md').read_text(encoding='utf-8')
i=d.find('Nimbus floats')
print(d[i:i+420] if i>=0 else 'missing')
print('---ARCH---')
a=Path('docs/ARCHITECTURE.md').read_text(encoding='utf-8')
i=a.find('Nimbus floats')
print(a[i:i+350] if i>=0 else 'missing')
print('silica sill count cjs', Path('desktop/renderer/window-play.test.cjs').read_text(encoding='utf-8').count('playFor("silica"), "sill"'))
print('other guests', 'silica' if 'pickTarget([WIN], 80, "silica"' in Path('desktop/renderer/window-play.test.cjs').read_text(encoding='utf-8') else 'no')
