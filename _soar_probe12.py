import json
from pathlib import Path
r=json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
# find structure
if isinstance(r, list):
  pets=r
elif isinstance(r, dict):
  pets=r.get("pets") or r.get("guests") or list(r.values())
  if pets and isinstance(pets[0] if isinstance(pets,list) else None, str):
    pets=[{"key":k,**v} if isinstance(v,dict) else {"key":k} for k,v in r.items()]
print("type", type(r), "len", len(r) if hasattr(r,"__len__") else "?")
# try find
text=Path("desktop/renderer/roster.json").read_text(encoding="utf-8")
for key in ["eagle_ray", "grouper", "giant_clam", "lionfish"]:
  i=text.find(f'"{key}"')
  print(key, i)
  if i>=0: print(text[i:i+250].replace("\n"," "))
print("catalog count hint", text.count('"key"'), text.count('"id"'))
