from pathlib import Path
p = Path("_beacon_core.py")
t = p.read_text(encoding="utf-8")
# Show leave lines
for i,l in enumerate(t.splitlines(),1):
    if "floated" in l or "aligned" in l or "frosted" in l and "leave" in l.lower() or '"manyed"' in l or '"aligned"' in l:
        if "leave:" in l or "floated" in l or "aligned" in l:
            print(f"{i}:{l[:180]}")

# Actual TS leave union currently (from Brine on main):
# | "floated" | "faceted" | "rimmed" | "manyed" | "frosted";
# Check disk
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
idx = ts.find('| "manyed" | "frosted"')
print("ts leave snip", repr(ts[idx-40:idx+80]))

# Fix once strings in core
old = '\'| "floated" | "faceted" | "rimmed" | "frosted";\',\n        \'| "floated" | "faceted" | "rimmed" | "frosted" | "aligned";\','
# What is actually in core now?
idx2 = t.find('"floated"')
print("core leave area:\n", t[idx2-20:idx2+200])
