from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
out = Path(r"C:\Users\730ri\projects\ComputerPets\_milk_extract3.txt")
lines = []
js = (ROOT / "desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = (ROOT / "web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
cjs = (ROOT / "desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
arch = (ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
house = (ROOT / "desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
roadmap = (ROOT / "docs/ROADMAP.md").read_text(encoding="utf-8")

# WIN constant
i = cjs.find("const WIN =")
lines.append("===== WIN =====")
lines.append(cjs[i:i+250])

# PlayTarget side union
i = ts.find("export type PlayTarget")
lines.append("\n===== PlayTarget =====")
# find side:
s = ts.find("side:", i)
lines.append(ts[s:s+2500])

# leave union
i = ts.find("leave:")
lines.append("\n===== leave first =====")
lines.append(ts[i:i+800])

# sip leftover test header
i = cjs.find("Sip sips a window-box")
lines.append("\n===== Sip test start LINE %d =====" % (cjs.count("\n",0,i)+1 if i>=0 else -1))
lines.append(cjs[i:i+1800] if i>=0 else "missing")

# Disc test size
i = cjs.find("Disc snips a window-box")
lines.append("\n===== Disc test start LINE %d =====" % (cjs.count("\n",0,i)+1 if i>=0 else -1))
# find tiny/ok size in that test
chunk = cjs[i:i+3500] if i>=0 else ""
for needle in ["tiny", "width:", "pickTarget", "holdLift", "side:"]:
    j = chunk.find(needle)
    if j>=0:
        lines.append("  %s @ %d: %s" % (needle, j, chunk[max(0,j-40):j+120].replace("\n"," | ")))

# Wrist test
i = cjs.find("Wrist wraps a window-box")
lines.append("\n===== Wrist test LINE %d =====" % (cjs.count("\n",0,i)+1 if i>=0 else -1))

# sipPath wrapPath snipPath foragePath goldPath at 0.5 - we'll compute later
# extract sipPath function
i = js.find("function sipPath")
lines.append("\n===== sipPath =====")
lines.append(js[i:i+700])
i = js.find("function wrapPath")
lines.append("\n===== wrapPath =====")
lines.append(js[i:i+700])
i = js.find("function snipPath")
lines.append("\n===== snipPath =====")
lines.append(js[i:i+700])
i = js.find("function foragePath")
lines.append("\n===== foragePath =====")
lines.append(js[i:i+700])
i = js.find("function goldPath")
lines.append("\n===== goldPath =====")
lines.append(js[i:i+500])
i = js.find("function mouthPath")
lines.append("\n===== mouthPath =====")
lines.append(js[i:i+500])

# ARCH overlay other guests
i = arch.find("Comb waggles a sill pan as a wax dish: walk")
lines.append("\n===== ARCH overlay Comb sentence =====")
lines.append(arch[i:i+900] if i>=0 else "MISSING walk sentence")

# ROADMAP Comb entry end (next leftover milk)
i = roadmap.find("- [x] Comb (`honeybee`")
# find next - [x] after this
j = roadmap.find("\n- [", i+10)
lines.append("\n===== ROADMAP Comb entry end / next =====")
lines.append(roadmap[j-400:j+80])

# house test title first 400
lines.append("\n===== HOUSE title first 500 =====")
lines.append(house[house.find("test("):house.find("test(")+500])

# luna playFor currently
lines.append("\n===== luna in playFor js =====")
lines.append(str(js.find('key === "luna"')))

# api WAGGLE const in return
i = js.find("\n    WAGGLE,")
lines.append("\n===== api WAGGLE const =====")
lines.append(js[i-80:i+40])

# approach kind dispatch for CASTINGS then WAGGLE
i = js.find('if (target.kind === CASTINGS)')
# find the one near waggle-on
idx = 0
n=0
lines.append("\n===== CASTINGS kind approach =====")
while True:
    i = js.find('if (target.kind === CASTINGS)', idx)
    if i<0: break
    n+=1
    lineno = js.count("\n",0,i)+1
    lines.append("L%d: %s" % (lineno, js[i:i+220].replace("\n"," | ")))
    idx = i+10
lines.append("count %d" % n)

i = js.find('if (next.phase === "waggle-on")')
lines.append("\n===== tick waggle-on LINE %d =====" % (js.count("\n",0,i)+1))
# previous 80 chars to see insertion
lines.append(js[i-200:i+100])

i = ts.find('if (next.phase === "waggle-on")')
lines.append("\n===== ts tick waggle-on LINE %d =====" % (ts.count("\n",0,i)+1))
lines.append(ts[i-120:i+80])

# ts playFor honeybee after
i = ts.find('if (key === "honeybee") return WAGGLE;')
lines.append("\n===== ts playFor around honeybee =====")
lines.append(ts[i-80:i+80])

# WindowPlayKind around WAGGLE
i = ts.find("typeof CASTINGS")
lines.append("\n===== WindowPlayKind CASTINGS.. =====")
lines.append(ts[i:i+200])

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out.stat().st_size)
