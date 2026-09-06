from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")

# find fungi header endings
for label, t in [("JS", js), ("TS", ts)]:
    for needle in ["fungi den. Others walk", "Flame drips", "leftover after Puff", "warm wood"]:
        i = t.find(needle)
        print(label, needle, i)
        if i>=0:
            print(" ", repr(t[i:i+180]))

# find exact pick insert point after dripped
i = js.find('leave: "dripped"')
print("\nJS pick after drip:\n", repr(js[i:i+280]))
i = ts.find('leave: "dripped"')
print("\nTS pick after drip:\n", repr(ts[i:i+280]))

# approach after drip
i = js.find('goPhase(next, "drip-on"')
print("\nJS approach drip context:\n", repr(js[i-80:i+200]))

# tick after drip-off before sill-hop
i = js.find('phase === "drip-off"')
# find end of drip-off block
j = js.find('phase === "sill-hop"', i)
print("\nJS between drip-off and sill-hop len", j-i)
print(repr(js[j-120:j+40]))

# exports
i = js.find("DRIP,\n    IGNORE")
print("\nexports", repr(js[i-40:i+80]))
i = js.find("dripOffPath,\n    pickTarget")
print("fns export", repr(js[i-40:i+80]))

# ts unions near drip
i = ts.find('"dripped"')
print("\nts leave near", repr(ts[max(0,i-80):i+60]))
i = ts.find('"warmwood"')
print("ts side near", repr(ts[max(0,i-80):i+60]))
i = ts.find('| "drip-off"')
print("ts phase near", repr(ts[max(0,i-80):i+80]))
i = ts.find('typeof DRIP')
print("ts kind near", repr(ts[max(0,i-40):i+80]))

# house/docs pins
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("\nhouse next", [l for l in house.splitlines() if "next leftover" in l or "Flame leftover" in l or "yeast" in l][:8])
for p in ["docs/ROADMAP.md","docs/ARCHITECTURE.md","README.md","desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    for line in t.splitlines():
        if "Starter" in line or "next leftover is" in line or "Flame drips" in line or "yeast" in line.lower():
            if "Last Updated" in line or "Flame drips" in line or "next leftover" in line or "Starter" in line:
                print(p, ":", line[:160])
