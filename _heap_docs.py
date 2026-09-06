from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nMARKER={old[:240]!r}")
    return text.replace(old, new, 1)

p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
t = p.read_text(encoding="utf-8")
t = once(t,
    'test("Knurl leftover knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; ',
    'test("Heap leftover castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; next leftover is Comb; Knurl leftover still knobs a window stool as a wrack dish; ninth shore leftover done; ',
    "house title")
t = once(t,
    '  assert.equal(WP.playFor("lugworm"), "sill");\n  assert.equal(WP.playFor("honeybee"), "sill");',
    '  assert.equal(WP.playFor("lugworm"), "castings");\n  assert.equal(WP.CASTINGS, "castings");\n  assert.notEqual(WP.playFor("lugworm"), "heap");\n  assert.notEqual(WP.playFor("lugworm"), "band");\n  assert.notEqual(WP.playFor("lugworm"), "drink");\n  assert.notEqual(WP.playFor("lugworm"), "knobs");\n  assert.notEqual(WP.playFor("lugworm"), "sill");\n  assert.equal(WP.playFor("knobbed_whelk"), "knobs");\n  assert.equal(WP.playFor("earthworm"), "band");\n  assert.equal(WP.playFor("leech"), "drink");\n  assert.equal(WP.playFor("honeybee"), "sill");',
    "house pin")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched leftover-house.test.cjs")

# README
readme_old = "Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Other guests walk a sill."
readme_new = "Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Heap castings a window foot as wet sand: walk onto the foot, sit the castings, then leave. Cast still owns band. Latch still owns drink. Knurl still owns knobs. This is the tenth shore leftover and closes shore ten. Other guests walk a sill."
for rel in ["README.md", r"desktop\README.md"]:
    p = ROOT / rel
    t = p.read_text(encoding="utf-8")
    t = once(t, readme_old, readme_new, rel)
    p.write_text(t, encoding="utf-8", newline="\n")
    print("patched", rel)

# ARCHITECTURE last updated
p = ROOT / "docs" / "ARCHITECTURE.md"
t = p.read_text(encoding="utf-8")
old = "2026-09-01 (Knurl knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; catalog stays 220; knobs is the tell; Tenant still owns knob; Haste still owns hunt; Whorl still owns rasp; Spire still owns rock; Thorn still owns spines; Token still owns flat; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
new = "2026-09-01 (Heap castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; next leftover is Comb; catalog stays 220; castings is the tell; Cast still owns band; Latch still owns drink; Knurl still owns knobs; Thorn still owns spines; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
t = once(t, old, new, "arch last updated")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched ARCHITECTURE.md")

# ROADMAP
p = ROOT / "docs" / "ROADMAP.md"
t = p.read_text(encoding="utf-8")
t = t.replace(
    "Next leftover is Heap. Do not start Heap.",
    "Heap is done. Tenth shore leftover done. Shore ten is closed. Next leftover is Comb. Do not start Comb.",
)
HEAP_ITEM = r'''- [x] Heap (`lugworm` / `heap`) castings a real window foot as wet sand: walk onto the foot (the foot — the same furniture family Lid shuts as a leaf dish and Stripe stamps as a duff dish, not Lid's shut, not Stripe's stamp, not Hop's spring, not Prowl's leaf-litter carry, not Cast's window-stool band, not Latch's sash-drip drink, not Knurl's window-stool knobs, not Pale's window-stool sand, not Token's sill-pan flat), sit the castings (the tell — a worm of the castings; she heaps; not Cast, an earthworm who bands; not Latch, a leech who drinks; named: Heap. The castings are the tell. Hello: "I heaped. Hello." Ambient: "I sit. Then I heap. Then I sit." Play: "A heap. Review the castings." Temperament: heaping.), then leave. One window. The castings are the tell — not Cast's `band`. Not Latch's `drink`. Not Knurl's `knobs`. Not Lid's `shut`. Not Stripe's `stamp`. Not Pale's `sand`. Not Token's `flat`. playFor("lugworm") returns `castings` (not `heap`, not `band`, not `drink`, not `knobs`). Cast (`earthworm`) still owns `band`. Latch (`leech`) still owns `drink`. Knurl (`knobbed_whelk`) still owns `knobs`. Thorn (`sea_urchin`) still owns `spines`. Token (`sand_dollar`) still owns `flat`. Spire (`periwinkle`) still owns `rock`. Mail (`chiton`) still owns `eight`. Cement (`barnacle`) still owns `cirri`. Cone (`limpet`) still owns `clamp`. Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. Same `playFor` door. `/demo/heap` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth shore leftover. Shore ten closed. Next leftover is Comb. Do not start Comb.

'''
marker = "- [x] Knurl (`knobbed_whelk` / `knurl`)"
if t.count(marker) != 1:
    raise SystemExit(f"knurl roadmap item count {t.count(marker)}")
# insert Heap item immediately before Knurl item? After Knurl is more natural (newer leftover first was the leftover-house pattern). Looking at ROADMAP, Knurl is followed by blank lines then Scud. I'll insert Heap after Knurl paragraph.
# Find end of Knurl item: after "Do not start Comb." we already replaced Heap with Comb in Knurl item.
idx = t.find(marker)
if idx < 0:
    raise SystemExit("knurl item missing")
# find next "- [x]" after knurl
nxt = t.find("\n- [x]", idx + 10)
if nxt < 0:
    raise SystemExit("no next item after knurl")
t = t[:nxt] + "\n" + HEAP_ITEM + t[nxt:]
old_last = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Knurl knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; catalog stays 220; knobs is the tell; Tenant still owns knob; Haste still owns hunt; Whorl still owns rasp; Spire still owns rock; Thorn still owns spines; Token still owns flat; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
new_last = "**Last Updated:** 2026-09-01 (Phase 6 leftover: Heap castings a window foot as wet sand; tenth shore leftover done; shore ten is closed; next leftover is Comb; catalog stays 220; castings is the tell; Cast still owns band; Latch still owns drink; Knurl still owns knobs; Thorn still owns spines; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)"
if old_last not in t:
    # maybe Heap replacement already changed Next leftover is Heap in last updated? Last updated used semicolon form
    print("LAST UPDATED CURRENT:")
    i = t.find("**Last Updated:**")
    print(t[i:i+700])
    raise SystemExit("last updated marker missing")
t = t.replace(old_last, new_last, 1)
p.write_text(t, encoding="utf-8", newline="\n")
print("patched ROADMAP.md")
print("Heap is done count", t.count("Heap is done."))
print("Do not start Comb count", t.count("Do not start Comb."))
