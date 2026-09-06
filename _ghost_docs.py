# Ghost leftover docs — do not commit
from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(path):
    raw = path.read_bytes()
    file_nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text.lstrip("\ufeff")
    return text.replace("\r\n", "\n"), file_nl

def save(path, text, file_nl):
    path.write_bytes(text.replace("\n", file_nl).encode("utf-8"))

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d for %r" % (label, n, old[:180]))
    return text.replace(old, new, 1)

GHOST_SENTENCE = (
    "Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave. "
    "Night still owns dusk. Moth still owns mount. Milk still owns weed. "
    "This is the third leftover of the remaining hive den. "
)

README_OLD = (
    "This is the second leftover of the remaining hive den. Other guests walk a sill"
)
README_NEW = (
    "This is the second leftover of the remaining hive den. "
    + GHOST_SENTENCE
    + "Other guests walk a sill"
)

for rel in ["README.md", "desktop/README.md"]:
    p = ROOT / rel.replace("/", "\\")
    text, nl = load(p)
    text = once(text, README_OLD, README_NEW, rel)
    save(p, text, nl)
    print("docs", rel)

p = ROOT / "docs" / "ARCHITECTURE.md"
text, nl = load(p)
ARCH_OLD = (
    "Milk weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; catalog stays 220; weed is the tell; Comb still owns waggle; Sip still owns sip; Wrist still owns wrap; Disc still owns snip; Fan still owns gold; Hum still owns drone; Keep still owns lay; Wax still owns draw; Heap still owns castings"
)
ARCH_NEW = (
    "Ghost weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Spark; catalog stays 220; week is the tell; Night still owns dusk; Moth still owns mount; Milk still owns weed; Loom still owns web; Comb still owns waggle; Fan still owns gold; Pale still owns sand"
)
text = once(text, ARCH_OLD, ARCH_NEW, "ARCHITECTURE last-updated")
save(p, text, nl)
print("ARCHITECTURE ok")

p = ROOT / "docs" / "ROADMAP.md"
text, nl = load(p)
old_next = "Next leftover is Ghost. Do not start Ghost."
new_next = "Ghost is done. Third leftover of the remaining hive den done. Shore ten stays closed. Next leftover is Spark. Do not start Spark."
n = text.count(old_next)
if n < 1:
    raise SystemExit("ROADMAP missing Next leftover is Ghost: %d" % n)
text = text.replace(old_next, new_next)
print("ROADMAP next leftover replacements", n)

GHOST_ENTRY = """
- [x] Ghost (`luna` / `ghost`) weeks a real lamp-side glass as lamp dusk: walk onto the glass (the glass — the same furniture family Loom webs as a lamp web, not Loom's web, not Night's lamp-side stile dusk, not Moth's window-jamb mount, not Milk's window-box weed, not Pad's lamp-side jamb chirp, not Fan's lamp-side gold), sit the week (the tell — the adult has no mouth; one week; she does not eat; named: Ghost. I am the week that does not eat. Hello: "I arrived without a mouth. Hello." Play: "A drift. That was athletic for a week." Rest: "The dusk is the correct chair." Temperament: brief.), then leave. One window. The week is the tell — not Night's `dusk`. Not Moth's `mount`. Not Milk's `weed`. Not Loom's `web`. Not Fan's `gold`. Not Comb's `waggle`. playFor("luna") returns `week` (not `ghost`, not `dusk`, not `mount`, not `weed`). Night (`walleye`) still owns `dusk`. Moth (`orchid`) still owns `mount`. Milk (`monarch`) still owns `weed`. Loom (`orb_weaver`) still owns `web`. Comb (`honeybee`) still owns `waggle`. Fan (`ginkgo`) still owns `gold`. Pale (`ghost_crab`) still owns `sand`. Same `playFor` door. `/demo/ghost` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Third leftover of the remaining hive den. Shore ten stays closed. Next leftover is Spark. Do not start Spark.

"""
marker = "- [x] Milk (`monarch` / `milk`)"
if marker not in text:
    raise SystemExit("ROADMAP Milk marker missing")
if "- [x] Ghost (`luna` / `ghost`)" not in text:
    text = text.replace(marker, GHOST_ENTRY + marker, 1)
    print("ROADMAP Ghost entry inserted")
else:
    print("ROADMAP Ghost entry already present")

old_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Milk weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; catalog stays 220; weed is the tell; Comb still owns waggle; Sip still owns sip; Wrist still owns wrap; Disc still owns snip; Fan still owns gold; Hum still owns drone; Keep still owns lay; Wax still owns draw; Heap still owns castings)"
new_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Ghost weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; shore ten is closed; next leftover is Spark; catalog stays 220; week is the tell; Night still owns dusk; Moth still owns mount; Milk still owns weed; Loom still owns web; Comb still owns waggle; Fan still owns gold; Pale still owns sand)"
if old_lu in text:
    text = text.replace(old_lu, new_lu)
    print("ROADMAP last-updated replaced")
elif new_lu in text:
    print("ROADMAP last-updated already new")
else:
    i = text.find("**Last Updated:**")
    raise SystemExit("ROADMAP last-updated mismatch: " + repr(text[i:i+500]))
save(p, text, nl)
print("ROADMAP ok")
