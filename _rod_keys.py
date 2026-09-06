# verify keys used in tests
import json, os, re
# find catalog or pets
for root, dirs, files in os.walk('.'):
  if 'node_modules' in root or '.git' in root: continue
  for f in files:
    if f in ('pets.json','catalog.json','roster.json','guests.json'):
      print(os.path.join(root,f))
# search keys
js=open('desktop/renderer/window-play.js',encoding='utf-8').read()
for key in ['yeast','solifuge','sundew','volvox','haloarchaea','coli','starter']:
  print(key, 'playFor' if f'"{key}"' in js else 'absent', end=' ')
  i=js.find(f'key === "{key}"')
  if i>=0: print(repr(js[i:i+50]))
  else: print()
# bloom and run keys
for kind, name in [('BLOOM','bloom'),('RUN','run')]:
  i=js.find(f'return {kind}')
  # find playFor returns
print('bloom keys:')
import re
for m in re.finditer(r'if \(key === "([^"]+)"\) return BLOOM', js):
  print(' ', m.group(1))
for m in re.finditer(r'if \(key === "([^"]+)"\) return RUN', js):
  print(' run', m.group(1))
for m in re.finditer(r'if \(key === "([^"]+)"\) return FILL', js):
  print(' fill', m.group(1))
