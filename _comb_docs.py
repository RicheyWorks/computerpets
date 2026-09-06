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

def must_replace(text, old, new, label):
    count = text.count(old)
    if count < 1:
        raise SystemExit("%s: found 0 for %r" % (label, old[:120]))
    return text.replace(old, new)

COMB_SENTENCE = (
    "Comb waggles a sill pan as a wax dish: walk onto the pan, dance the waggle, then leave. "
    "Hum still owns drone. Keep still owns lay. Wax still owns draw. Heap still owns castings. "
    "This is the first leftover of the remaining hive den. Shore ten is closed. "
)

# README + desktop README
for rel in ["README.md", "desktop/README.md"]:
    p = ROOT / rel.replace("/", "\\")
    text, nl = load(p)
    old = "This is the tenth shore leftover and closes shore ten. Other guests walk a sill"
    new = "This is the tenth shore leftover and closes shore ten. " + COMB_SENTENCE + "Other guests walk a sill"
    if old not in text:
        raise SystemExit("%s missing shore-close sentence" % rel)
    text = text.replace(old, new)
    save(p, text, nl)
    print("docs", rel)

# ARCHITECTURE last updated
p = ROOT / "docs" / "ARCHITECTURE.md"
text, nl = load(p)
old = "Heap castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; next leftover is Comb; catalog stays 220; castings is the tell; Cast still owns band; Latch still owns drink; Knurl still owns knobs; Thorn still owns spines; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal"
new = "Comb waggles a sill pan as a wax dish; first leftover of the remaining hive den done; shore ten is closed; next leftover is Milk; catalog stays 220; waggle is the tell; Hum still owns drone; Keep still owns lay; Wax still owns draw; Sip still owns sip; Heap still owns castings; Wave still owns signal; Token still owns flat"
if old not in text:
    raise SystemExit("ARCHITECTURE last-updated missing")
text = text.replace(old, new)
# overlay paragraph - append Comb if Heap close is present
old2 = "This is the tenth shore leftover and closes shore ten. Other guests walk a sill"
if old2 in text:
    text = text.replace(old2, "This is the tenth shore leftover and closes shore ten. " + COMB_SENTENCE + "Other guests walk a sill")
    print("ARCHITECTURE overlay sentence updated")
else:
    print("ARCHITECTURE overlay sentence not present; last-updated only")
save(p, text, nl)
print("ARCHITECTURE ok")

# ROADMAP
p = ROOT / "docs" / "ROADMAP.md"
text, nl = load(p)
text = text.replace(
    "Next leftover is Comb. Do not start Comb.",
    "Comb is done. First leftover of the remaining hive den done. Shore ten stays closed. Next leftover is Milk. Do not start Milk.",
)
old_heap_end = "Catalog stays 220. Tenth shore leftover. Shore ten closed. Comb is done. First leftover of the remaining hive den done. Shore ten stays closed. Next leftover is Milk. Do not start Milk."
# Heap entry originally ended with "Next leftover is Comb. Do not start Comb." which we already replaced globally.
# Add Comb entry after Heap entry.
COMB_ENTRY = """
- [x] Comb (`honeybee` / `comb`) waggles a real window sill pan as a wax dish: walk onto the pan (the dish — the same furniture family Wave signals as a marsh dish, Token flats as a sand plate, Spoon paddles as a current dish, Wash rinses as a wash bowl, Jaw shows as a brackish dish, and Well fills as a bog cup, not Wave's signal, not Token's flat, not Spoon's paddle, not Wash's rinse, not Jaw's show, not Well's fill, not Hum's pane drone, not Keep's pane lay, not Wax's pane draw, not Sip's window-box sip, not Heap's window-foot castings), dance the waggle (the tell — the dance is a map, not a mood; a worker; not Keep, a queen who lays; not Hum, a drone who drones; named: Comb. The dance is the name I keep. Hello: "I danced. That was hello." Play: "A waggle. Review my work." Temperament: busy.), then leave. One window. The waggle is the tell — not Hum's `drone`. Not Keep's `lay`. Not Wax's `draw`. Not Sip's `sip`. Not Heap's `castings`. Not Wave's `signal`. Not Token's `flat`. playFor("honeybee") returns `waggle` (not `comb`, not `drone`, not `lay`, not `draw`, not `sip`). Hum (`honey_drone`) still owns `drone`. Keep (`honey_queen`) still owns `lay`. Wax (`honeycomb`) still owns `draw`. Sip (`hummingbird`) still owns `sip`. Heap (`lugworm`) still owns `castings`. Wave (`fiddler_crab`) still owns `signal`. Token (`sand_dollar`) still owns `flat`. Same `playFor` door. `/demo/comb` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. First leftover of the remaining hive den. Shore ten stays closed. Next leftover is Milk. Do not start Milk.

"""
marker = "- [x] Scud (`amphipod` / `scud`)"
if marker not in text:
    raise SystemExit("ROADMAP Scud marker missing")
if "- [x] Comb (`honeybee` / `comb`)" not in text:
    text = text.replace(marker, COMB_ENTRY + marker, 1)
old_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Heap castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; next leftover is Comb; catalog stays 220; castings is the tell; Cast still owns band; Latch still owns drink; Knurl still owns knobs; Thorn still owns spines; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
new_lu = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Comb waggles a sill pan as a wax dish; first leftover of the remaining hive den done; shore ten is closed; next leftover is Milk; catalog stays 220; waggle is the tell; Hum still owns drone; Keep still owns lay; Wax still owns draw; Sip still owns sip; Heap still owns castings; Wave still owns signal; Token still owns flat)"
# Last Updated may already have Comb-is-done from global replace
if old_lu in text:
    text = text.replace(old_lu, new_lu)
else:
    # try after global Comb-is-done replace
    old_lu2 = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Heap castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; Comb is done. First leftover of the remaining hive den done. Shore ten stays closed. Next leftover is Milk. Do not start Milk.; catalog stays 220; castings is the tell; Cast still owns band; Latch still owns drink; Knurl still owns knobs; Thorn still owns spines; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
    if old_lu2 in text:
        text = text.replace(old_lu2, new_lu)
    elif new_lu in text:
        pass
    else:
        # show nearby last updated
        i = text.find("**Last Updated:**")
        raise SystemExit("ROADMAP last-updated mismatch: " + repr(text[i:i+400]))
save(p, text, nl)
print("ROADMAP ok")
