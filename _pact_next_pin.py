from pathlib import Path
import re, json

js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract playFor mapping
m = re.search(r"function playFor\((.*?)\)\s*\{(.*?)\n  \}", js, re.S)
body = m.group(2) if m else ""
mapped = dict(re.findall(r'if \(key === "([^"]+)"\) return ([A-Z_]+);', body))
print("mapped count", len(mapped))

# catalog keys from visitor
vis = Path("desktop/renderer/visitor.js").read_text(encoding="utf-8")
keys_m = re.search(r"const CATALOG_KEYS = \[(.*?)\];", vis, re.S)
keys = re.findall(r'"([^"]+)"', keys_m.group(1))
print("catalog", len(keys))
# find lichen index
li = keys.index("lichen")
print("lichen at", li, "neighbors", keys[li-2:li+5])

# which after lichen still sill (not in mapped or mapped to SILL)
sill_after = []
for k in keys[li+1:]:
    kind = mapped.get(k, "SILL?")
    if kind in ("SILL", "SILL?") or k not in mapped:
        sill_after.append((k, kind if k in mapped else "DEFAULT"))
print("sill after lichen (first 20):", sill_after[:20])
print("total sill after", len(sill_after))

# also check unmapped overall count
unmapped = [k for k in keys if k not in mapped]
print("unmapped total", len(unmapped), unmapped[:30])

# roster names for first sill after
roster = json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
by_key = {r["key"]: r for r in roster}
for k,_ in sill_after[:8]:
    r = by_key.get(k, {})
    print("NEXT CAND", k, r.get("name"), r.get("slug"), r.get("speciesLabel"))
