import json
r = json.load(open(r"desktop\renderer\roster.json", encoding="utf-8"))
# roster might be list or dict
print(type(r), len(r) if hasattr(r,'__len__') else r)
if isinstance(r, list):
    for g in r:
        s = str(g).lower()
        if "honeybee" in s or "honey_bee" in s or "lugworm" in s:
            print(g if isinstance(g,str) else json.dumps(g)[:400])
elif isinstance(r, dict):
    for k,v in r.items():
        blob = (str(k)+str(v)).lower()
        if "honeybee" in blob or "lugworm" in blob:
            print(k, json.dumps(v)[:400] if not isinstance(v,str) else v[:400])
