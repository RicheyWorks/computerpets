# find honeybee in pets / leftover
import os
hits = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ('.git','node_modules','target','__pycache__')]
    for f in files:
        if f.startswith('_'): continue
        if f.endswith(('.md','.js','.ts','.cjs','.mjs','.json')):
            p = os.path.join(root,f)
            try:
                t = open(p, encoding='utf-8', errors='ignore').read()
            except: continue
            if 'honeybee' in t.lower():
                hits.append(p)
print('FILES', len(hits))
for p in hits[:40]:
    print(p)
