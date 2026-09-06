import json
r=json.load(open('desktop/renderer/roster.json',encoding='utf-8'))
# find rod/coli/rose
def walk(o, path=''):
  if isinstance(o, dict):
    for k,v in o.items():
      if k in ('key','slug','name','id') or (isinstance(v,str) and any(x in v.lower() for x in ('coli','rod','rose','halo'))):
        if isinstance(v,str) and any(x in str(v).lower() for x in ('coli','rod','rose','halo','archaea')):
          print(path, k, v)
      walk(v, path+'.'+k)
  elif isinstance(o, list):
    for i,v in enumerate(o[:300]):
      walk(v, path+f'[{i}]')
# try structure
if isinstance(r, list):
  for g in r:
    if isinstance(g, dict):
      blob=' '.join(str(g.get(k,'')) for k in g)
      if any(x in blob.lower() for x in ('coli','rod','rose','halo')):
        print({k:g.get(k) for k in ('key','slug','name','houseName','id') if k in g or True})
elif isinstance(r, dict):
  print(list(r.keys())[:20])
  pets=r.get('pets') or r.get('guests') or r.get('roster') or r
  if isinstance(pets, list):
    for g in pets:
      blob=' '.join(str(g.get(k,'')) for k in g)
      if any(x in blob.lower() for x in ('coli','rod','rose','halo')):
        print(g)
