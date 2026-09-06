ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
# find TRUMPET related type bits
for needle in ['TRUMPET', '"trumpet"', 'trumpetrim', 'PlayKind', 'trumpeted']:
  print(needle, ts.count(needle))
# show type union around trumpet
i=ts.find('trumpet')
# find type PlayKind or similar
import re
m=re.search(r'type\s+\w*Kind\w*\s*=', ts)
print('kind type', m.group(0) if m else None, m.start() if m else None)
# find Side type
for pat in [r'type\s+Side\s*=', r'type\s+Leave\s*=', r'trumpetrim', r'TRUMPET =']:
  m=re.search(pat, ts)
  if m:
    print(pat, m.start(), repr(ts[m.start():m.start()+200].replace('\n','|')))
# exports end
i=ts.rfind('trumpet')
print('last trumpet', i, repr(ts[i:i+80]))
# DUR
i=ts.find('trumpetOn')
print('DUR', repr(ts[i-20:i+80]))
