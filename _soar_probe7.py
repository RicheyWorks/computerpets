from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for kind in ["CHORD", "FLOAT", "THIRST", "BARREL", "MANTLE", "RAYS", "SPOT"]:
  i = js.find(f"if (kind === {kind}) return w.width")
  if i<0:
    i = js.find(f"kind === {kind}) return w.width")
  ls=js.rfind("\n",0,i)+1 if i>=0 else 0
  le=js.find("\n",i) if i>=0 else 0
  print(kind, js[ls:le] if i>=0 else "MISSING")

# approach marker after mantle
i=js.find('if (target.kind === MANTLE)')
# find goPhase mantle-on
i=js.find('goPhase(next, "mantle-on"')
print("approach context:")
print(js[i-80:i+220])

# phase insert point
i=js.find('if (next.phase === "mantle-off")')
j=js.find('if (next.phase === "sill-hop")', i)
print("between mantle-off and sill-hop chars:", j-i)
print(js[j-100:j+40])

# exports
i=js.find("mantleOffPath,")
print(js[i:i+80])
i=js.find("MANTLE,\n    SILL")
print(js[i:i+40])

# TS markers
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("TS MANTLE const", 'export const MANTLE = "mantle";\nexport const SILL' in ts)
print("TS mantleOff", "mantleOff: 3.03,\n  sillHop" in ts or "mantleOff:" in ts)
i=ts.find("mantleOff:")
print(ts[i:i+60])
print("TS giant_clam", 'if (key === "giant_clam") return MANTLE;\n  return SILL;' in ts)
