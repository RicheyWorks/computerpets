# Milk leftover docs — do not commit
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

MILK_SENTENCE = (
    "Milk weeds a window-box as a milkweed cup: walk onto the box, sit the weed, then leave. "
    "Comb still owns waggle. Sip still owns sip. Fan still owns gold. "
    "This is the second leftover of the remaining hive den. "
)

README_OLD = (
    "This is the first leftover of the remaining hive den. Shore ten is closed. Other guests walk a sill"
)
README_NEW = (
    "This is the first leftover of the remaining hive den. Shore ten is closed. "
    + MILK_SENTENCE
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
    "Comb waggles a sill pan as a wax dish; first leftover of the remaining hive den done; shore ten is closed; next leftover is Milk; catalog stays 220; waggle is the tell; Hum still owns drone; Keep still owns lay; Wax still owns draw; Sip still owns sip; Heap still owns castings; Wave still owns signal; Token still owns flat"
)
ARCH_NEW = (
    "Milk weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; catalog stays 220; weed is the tell; Comb still owns waggle; Sip still owns sip; Wrist still owns wrap; Disc still owns snip; Fan still owns gold; Hum still owns drone; Keep still owns lay; Wax still owns draw; Heap still owns castings"
)
text = once(text, ARCH_OLD, ARCH_NEW, "ARCHITECTURE last-updated")
save(p, text, nl)
print("ARCHITECTURE ok")

p = ROOT / "docs" / "ROADMAP.md"
text, nl = load(p)
# global next leftover
old_next = "Next leftover is Milk. Do not start Milk."
new_next = "Milk is done. Second leftover of the remaining hive den done. Shore ten stays closed. Next leftover is Ghost. Do not start Ghost."
n = text.count(old_next)
if n < 1:
    raise SystemExit("ROADMAP missing Next leftover is Milk: %d" % n)
text = text.replace(old_next, new_next)
print("ROADMAP next leftover replacements", n)

MILK_ENTRY = """
- [x] Milk (`monarch` / `milk`) weeds a real window-box as a milkweed cup: walk onto the box (the cup — the same furniture family Sip sips as a nectar cup, Wrist wraps as a nectar cup, Disc snips as foliage, and Thrum forages as a meadow, not Sip's sip, not Wrist's wrap, not Disc's snip, not Thrum's forage, not Comb's sill-pan waggle, not Fan's lamp-side gold, not Lunge's window-box mouth, not Lance's window-box bill), sit the weed (the tell — milkweed first; the orange is a warning she earned; named: Milk. The weed is the name I keep. Hello: "I kept the orange. Hello." Play: "A lift. Then the blotter again." Temperament: steadfast.), then leave. One window. The weed is the tell — not Comb's `waggle`. Not Sip's `sip`. Not Wrist's `wrap`. Not Disc's `snip`. Not Fan's `gold`. Not Thrum's `forage`. playFor("monarch") returns `weed` (not `milk`, not `gold`, not `snip`, not `sip`, not `wrap`, not `waggle`). Comb (`honeybee`) still owns `waggle`. Sip (`hummingbird`) still owns `sip`. Wrist (`kinkajou`) still owns `wrap`. Disc (`leafcutter`) still owns `snip`. Fan (`ginkgo`) still owns `gold`. Hum (`honey_drone`) still owns `drone`. Keep (`honey_queen`) still owns `lay`. Wax (`honeycomb`) still owns `draw`. Heap (`lugworm`) still owns `castings`. Same `playFor` door. `/demo/milk` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Second leftover of the remaining hive den. Shore ten stays closed. Next leftover is Ghost. Do not start Ghost.

"""
marker = "- [x] Comb (`honeybee` / `comb`)"
if marker not in text:
    raise SystemExit("ROADMAP Comb marker missing")
if "- [x] Milk (`monarch` / `milk`)" not in text:
    # insert Milk entry before Comb (newest first, like Comb before Scud)
    text = text.replace(marker, MILK_ENTRY + marker, 1)
    print("ROADMAP Milk entry inserted")
else:
    print("ROADMAP Milk entry already present")

old_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Comb waggles a sill pan as a wax dish; first leftover of the remaining hive den done; shore ten is closed; next leftover is Milk; catalog stays 220; waggle is the tell; Hum still owns drone; Keep still owns lay; Wax still owns draw; Sip still owns sip; Heap still owns castings; Wave still owns signal; Token still owns flat)"
# after global replace, last updated may have been left as-is because it didn't contain "Next leftover is Milk. Do not start Milk."
new_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Milk weeds a window-box as a milkweed cup; second leftover of the remaining hive den done; shore ten is closed; next leftover is Ghost; catalog stays 220; weed is the tell; Comb still owns waggle; Sip still owns sip; Wrist still owns wrap; Disc still owns snip; Fan still owns gold; Hum still owns drone; Keep still owns lay; Wax still owns draw; Heap still owns castings)"
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
