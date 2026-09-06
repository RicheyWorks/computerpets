from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
out = Path(r"C:\Users\730ri\projects\ComputerPets\_milk_extract2.txt")
lines = []

def dump(label, text, needle, after=800):
    i = text.find(needle)
    lines.append("\n===== %s idx=%s LINE %s =====" % (label, i, text.count("\n", 0, i)+1 if i>=0 else "?"))
    if i < 0:
        return
    lines.append(text[i:i+after])

js = (ROOT / "desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = (ROOT / "web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
mjs = (ROOT / "web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
insects = (ROOT / "web/src/lib/pets/insects.ts").read_text(encoding="utf-8")
roadmap = (ROOT / "docs/ROADMAP.md").read_text(encoding="utf-8")
arch = (ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
readme = (ROOT / "README.md").read_text(encoding="utf-8")
deskreadme = (ROOT / "desktop/README.md").read_text(encoding="utf-8")
catalog = (ROOT / "web/src/lib/pets/catalog.ts").read_text(encoding="utf-8") if (ROOT / "web/src/lib/pets/catalog.ts").exists() else ""

# weed occurrences
for name, text in [("js", js), ("ts", ts)]:
    idx = 0
    n = 0
    lines.append("\n===== %s weed occurrences =====" % name)
    while True:
        i = text.lower().find("weed", idx)
        if i < 0: break
        n += 1
        lineno = text.count("\n", 0, i) + 1
        lines.append("  L%d: %s" % (lineno, text[max(0,i-50):i+50].replace("\n"," | ")))
        idx = i + 4
        if n > 15:
            lines.append("  truncated")
            break
    lines.append("  total %d" % n)

dump("js beginPlay WAGGLE goPhase", js, 'if (target.kind === WAGGLE)')
# find goPhase waggle-on
dump("js goPhase waggle-on", js, '"waggle-on"')
dump("ts goPhase waggle-on", ts, '"waggle-on"')
dump("js module exports", js, "root.WindowPlay")
dump("js assign WAGGLE", js, "WAGGLE,")
dump("ts WindowPlayKind WAGGLE", ts, "typeof WAGGLE")
dump("ts export const WAGGLE already", ts, "export const WAGGLE")

# find how functions are exported in js
i = js.rfind("root.")
lines.append("\n===== js last 2500 of file =====")
lines.append(js[-2500:])

i = ts.rfind("export {")
if i < 0:
    i = ts.rfind("export const WAGGLE")
lines.append("\n===== ts around WAGGLE export and end exports =====")
# find export function wagglePoint
dump("ts wagglePoint export", ts, "export function wagglePoint")
dump("js function waggleOffPath end then next", js, "function waggleOffPath")

# mjs comb test
dump("mjs Comb test", mjs, "Comb waggle")
lines.append("\n===== mjs last 80 lines =====")
mjs_lines = mjs.splitlines()
lines.append("\n".join("%d|%s" % (len(mjs_lines)-80+i+1, l) for i,l in enumerate(mjs_lines[-80:])))

# insects monarch / luna / ghost
for needle in ["monarch", "luna", "ghost", "milk", "honeybee"]:
    lines.append("\n===== insects %r =====" % needle)
    idx = 0
    n = 0
    while True:
        i = insects.lower().find(needle, idx)
        if i < 0: break
        n += 1
        lineno = insects.count("\n", 0, i) + 1
        lines.append("  L%d: %s" % (lineno, insects[max(0,i-80):i+160].replace("\n"," | ")))
        idx = i + len(needle)
        if n > 8:
            lines.append("  truncated")
            break

# catalog count 220
lines.append("\n===== catalog length hint =====")
lines.append("catalog exists=%s len=%d" % (bool(catalog), len(catalog)))
for needle in ["220", "monarch", "luna_moth", "luna", "ghost"]:
    if catalog:
        lines.append("catalog %s count=%d" % (needle, catalog.count(needle)))

# ROADMAP last updated + comb + milk
i = roadmap.find("**Last Updated:**")
lines.append("\n===== ROADMAP last updated =====")
lines.append(roadmap[i:i+900])
i = roadmap.find("- [x] Comb")
lines.append("\n===== ROADMAP Comb entry start =====")
lines.append(roadmap[i:i+600])
i = roadmap.find("Next leftover is Milk")
lines.append("\n===== ROADMAP Next leftover Milk =====")
lines.append(roadmap[max(0,i-200):i+400])

# README comb sentence
i = readme.find("Comb waggles")
lines.append("\n===== README Comb =====")
lines.append(readme[i:i+700] if i>=0 else "MISSING")
i = deskreadme.find("Comb waggles")
lines.append("\n===== desktop README Comb =====")
lines.append(deskreadme[i:i+700] if i>=0 else "MISSING")
i = arch.find("Comb waggles")
lines.append("\n===== ARCH Comb =====")
lines.append(arch[i:i+700] if i>=0 else "MISSING")
i = arch.find("**Last Updated:**")
if i < 0:
    i = arch.lower().find("last updated")
lines.append("\n===== ARCH last updated =====")
lines.append(arch[i:i+700] if i>=0 else "no last updated")

# Lance / Lunge window-box
dump("js billPoint (lance)", js, "function billPoint")
dump("js mouthPoint (lunge)", js, "function mouthPoint")
dump("js size BILL", js, "if (kind === BILL)")
dump("js size MOUTH", js, "if (kind === MOUTH)")

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out.stat().st_size)
