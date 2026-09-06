from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
out = Path(r"C:\Users\730ri\projects\ComputerPets\_milk_extract.txt")
lines = []

def dump(label, text, needle, before=2, after=30):
    i = text.find(needle)
    lines.append("\n===== %s needle=%r idx=%s =====" % (label, needle[:80], i))
    if i < 0:
        return
    start = text.rfind("\n", 0, i)
    # count lines
    lineno = text.count("\n", 0, i) + 1
    chunk = text[max(0, i-400): i+1200]
    lines.append("LINE %d" % lineno)
    lines.append(chunk)

js = (ROOT / "desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = (ROOT / "web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
house = (ROOT / "desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
cjs = (ROOT / "desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")

# confirm weed not taken
for name, text in [("js", js), ("ts", ts)]:
    lines.append("%s WEED count=%d  weed string count=%d" % (name, text.count("WEED"), text.count('"weed"')))
    lines.append("%s WAGGLE count=%d" % (name, text.count("WAGGLE")))
    lines.append("%s monarch count=%d" % (name, text.count("monarch")))
    lines.append("%s honeybee count=%d" % (name, text.count("honeybee")))

dump("js playFor honeybee", js, 'if (key === "honeybee") return WAGGLE;')
dump("ts playFor honeybee", ts, 'if (key === "honeybee") return WAGGLE;')
dump("js WAGGLE const", js, 'const WAGGLE = "waggle";')
dump("ts WAGGLE const", ts, 'const WAGGLE = "waggle";')
dump("js DUR waggle", js, "waggleOn:")
dump("ts DUR waggle", ts, "waggleOn:")
dump("js size WAGGLE", js, "if (kind === WAGGLE)")
dump("js size SIP", js, "if (kind === SIP)")
dump("js size WRAP", js, "if (kind === WRAP)")
dump("js size SNIP", js, "if (kind === SNIP)")
dump("js size FORAGE", js, "if (kind === FORAGE)")
dump("js sipPoint", js, "function sipPoint")
dump("js wrapPoint", js, "function wrapPoint")
dump("js snipPoint", js, "function snipPoint")
dump("js foragePoint", js, "function foragePoint")
dump("js wagglePoint", js, "function wagglePoint")
dump("js pick WAGGLE", js, "if (kind === WAGGLE) {")
dump("js pick SIP", js, "if (kind === SIP) {")
dump("js pick WRAP", js, "if (kind === WRAP) {")
dump("js pick SNIP", js, "if (kind === SNIP) {")
dump("js pick FORAGE", js, "if (kind === FORAGE) {")
dump("js retarget WAGGLE", js, "if (target.kind === WAGGLE)")
dump("js beginPlay CASTINGS/WAGGLE", js, 'if (target.kind === WAGGLE)')
dump("js exports WAGGLE", js, "root.WAGGLE")
dump("ts exports WAGGLE", ts, "export {")

# leftover house monarch / milk / luna / ghost
for needle in ["monarch", "Milk", "luna", "ghost", "honeybee", "generic", "sill-hop"]:
    lines.append("\n===== HOUSE mentions of %r =====" % needle)
    idx = 0
    n = 0
    while True:
        i = house.find(needle, idx)
        if i < 0:
            break
        n += 1
        lineno = house.count("\n", 0, i) + 1
        lines.append("  L%d: %s" % (lineno, house[max(0,i-80):i+120].replace("\n"," | ")))
        idx = i + len(needle)
        if n > 25:
            lines.append("  ...truncated")
            break
    lines.append("  total %d" % n)

# window-play.test.cjs monarch / honeybee / Comb / generic sill
for needle in ['"monarch"', '"honeybee"', "Comb waggle", "sill-hop", "generic"]:
    lines.append("\n===== CJS mentions of %r =====" % needle)
    idx = 0
    n = 0
    while True:
        i = cjs.find(needle, idx)
        if i < 0:
            break
        n += 1
        lineno = cjs.count("\n", 0, i) + 1
        lines.append("  L%d: %s" % (lineno, cjs[max(0,i-60):i+140].replace("\n"," | ")))
        idx = i + len(needle)
        if n > 20:
            lines.append("  ...truncated")
            break
    lines.append("  total %d" % n)

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "chars", out.stat().st_size)
