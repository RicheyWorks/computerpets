from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

KNURL_ROADMAP = '''- [x] Knurl (`knobbed_whelk` / `knurl`) knobs a real window stool as a wrack dish: walk onto the stool (the dish — the same furniture family Pale sands as dry sand, Armor rolls as a bark dish, Cast bands as a soil tray, and Cache buries as an oak dish, not Pale's sand, not Armor's roll, not Cast's band, not Cache's bury, not Tenant's sash-lift knob, not Haste's sash-jamb hunt, not Spire's sash-jamb rock, not Thorn's window-well spines), sit the knobs (the tell — she knobs; a predator snail; the knobs are the tell; not Spire; not Horn; named: Knurl. The knobs are the tell. Hello: "I hunted. Hello." Ambient: "I sit. Then I hunt. Then I sit." Play: "A hunt. Review the knobs." Temperament: hunting.), then leave. One window. The knobs are the tell — not Tenant's `knob`. Not Haste's `hunt`. Not Whorl's `rasp`. Not Spire's `rock`. Not Thorn's `spines`. Not Pale's `sand`. Not Armor's `roll`. Not Cast's `band`. Not Cache's `bury`. playFor("knobbed_whelk") returns `knobs` (not `knurl`, not `knob`, not `hunt`, not `rasp`, not `rock`). Tenant (`hermit_crab`) still owns `knob`. Haste (`house_centipede`) still owns `hunt`. Whorl (`pond_snail`) still owns `rasp`. Spire (`periwinkle`) still owns `rock`. Thorn (`sea_urchin`) still owns `spines`. Token (`sand_dollar`) still owns `flat`. Mail (`chiton`) still owns `eight`. Cement (`barnacle`) still owns `cirri`. Cone (`limpet`) still owns `clamp`. Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. Same `playFor` door. `/demo/knurl` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Ninth shore leftover. Next leftover is Heap. Do not start Heap.
'''

def patch_house():
    p = ROOT / "desktop" / "renderer" / "leftover-house.test.cjs"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "Thorn leftover spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; ",
        "Knurl leftover knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; Thorn leftover still spines a window well as a tide pool; eighth shore leftover done; ",
        "house test name",
    )
    t = sub_once(
        t,
        '''  assert.equal(WP.playFor("sea_urchin"), "spines");
  assert.equal(WP.SPINES, "spines");
  assert.notEqual(WP.playFor("sea_urchin"), "thorn");
  assert.notEqual(WP.playFor("sea_urchin"), "spine");
  assert.notEqual(WP.playFor("sea_urchin"), "bristle");
  assert.notEqual(WP.playFor("sea_urchin"), "ball");
  assert.notEqual(WP.playFor("sea_urchin"), "crown");
  assert.notEqual(WP.playFor("sea_urchin"), "flat");
  assert.notEqual(WP.playFor("sea_urchin"), "sill");
  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("porcupine"), "bristle");
  assert.equal(WP.playFor("hedgehog"), "ball");
  assert.equal(WP.playFor("horned_lizard"), "crown");
  assert.equal(WP.playFor("knobbed_whelk"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        '''  assert.equal(WP.playFor("sea_urchin"), "spines");
  assert.equal(WP.SPINES, "spines");
  assert.notEqual(WP.playFor("sea_urchin"), "thorn");
  assert.notEqual(WP.playFor("sea_urchin"), "spine");
  assert.notEqual(WP.playFor("sea_urchin"), "bristle");
  assert.notEqual(WP.playFor("sea_urchin"), "ball");
  assert.notEqual(WP.playFor("sea_urchin"), "crown");
  assert.notEqual(WP.playFor("sea_urchin"), "flat");
  assert.notEqual(WP.playFor("sea_urchin"), "sill");
  assert.equal(WP.playFor("sand_dollar"), "flat");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("porcupine"), "bristle");
  assert.equal(WP.playFor("hedgehog"), "ball");
  assert.equal(WP.playFor("horned_lizard"), "crown");
  assert.equal(WP.playFor("knobbed_whelk"), "knobs");
  assert.equal(WP.KNOBS, "knobs");
  assert.notEqual(WP.playFor("knobbed_whelk"), "knurl");
  assert.notEqual(WP.playFor("knobbed_whelk"), "knob");
  assert.notEqual(WP.playFor("knobbed_whelk"), "hunt");
  assert.notEqual(WP.playFor("knobbed_whelk"), "rasp");
  assert.notEqual(WP.playFor("knobbed_whelk"), "rock");
  assert.notEqual(WP.playFor("knobbed_whelk"), "sill");
  assert.equal(WP.playFor("sea_urchin"), "spines");
  assert.equal(WP.playFor("periwinkle"), "rock");
  assert.equal(WP.playFor("hermit_crab"), "knob");
  assert.equal(WP.playFor("house_centipede"), "hunt");
  assert.equal(WP.playFor("pond_snail"), "rasp");
  assert.equal(WP.playFor("lugworm"), "sill");
  assert.equal(WP.playFor("honeybee"), "sill");
''',
        "house pins",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("house ok")

def patch_docs():
    desk = ROOT / "desktop" / "README.md"
    t = desk.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the eighth shore leftover. Other guests walk a sill.",
        "This is the eighth shore leftover. Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Other guests walk a sill.",
        "desktop readme",
    )
    desk.write_text(t, encoding="utf-8", newline="\n")
    print("patched desktop README")

    readme = ROOT / "README.md"
    t = readme.read_text(encoding="utf-8")
    n = t.count("This is the eighth shore leftover. Other guests walk a sill.")
    print("root README leftover hits", n)
    if n == 1:
        t = t.replace(
            "This is the eighth shore leftover. Other guests walk a sill.",
            "This is the eighth shore leftover. Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Other guests walk a sill.",
            1,
        )
        readme.write_text(t, encoding="utf-8", newline="\n")
        print("patched README")
    elif n == 0:
        print("README has no leftover sentence; skip")
    else:
        raise SystemExit("README leftover hits unexpected: %d" % n)

    arch = ROOT / "docs" / "ARCHITECTURE.md"
    t = arch.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Thorn spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; catalog stays 220; spines is the tell; Spine still owns bristle; Burr still owns ball; Spike still owns crown; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "2026-09-01 (Knurl knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; catalog stays 220; knobs is the tell; Tenant still owns knob; Haste still owns hunt; Whorl still owns rasp; Spire still owns rock; Thorn still owns spines; Token still owns flat; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "architecture",
    )
    arch.write_text(t, encoding="utf-8", newline="\n")
    print("patched ARCHITECTURE")

    road = ROOT / "docs" / "ROADMAP.md"
    t = road.read_text(encoding="utf-8")
    n = t.count("Next leftover is Knurl. Do not start Knurl.")
    if n < 1:
        raise SystemExit("roadmap knurl next: expected at least 1, found %d" % n)
    t = t.replace("Next leftover is Knurl. Do not start Knurl.", "Knurl is done. Ninth shore leftover done. Next leftover is Heap. Do not start Heap.")
    t = sub_once(
        t,
        "Catalog stays 220. Eighth shore leftover. Knurl is done. Ninth shore leftover done. Next leftover is Heap. Do not start Heap.\n",
        "Catalog stays 220. Eighth shore leftover. Knurl is done. Ninth shore leftover done. Next leftover is Heap. Do not start Heap.\n" + KNURL_ROADMAP,
        "roadmap knurl item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Thorn spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; catalog stays 220; spines is the tell; Spine still owns bristle; Burr still owns ball; Spike still owns crown; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Knurl knobs a window stool as a wrack dish; ninth shore leftover done; next leftover is Heap; catalog stays 220; knobs is the tell; Tenant still owns knob; Haste still owns hunt; Whorl still owns rasp; Spire still owns rock; Thorn still owns spines; Token still owns flat; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "roadmap last updated",
    )
    road.write_text(t, encoding="utf-8", newline="\n")
    print("patched ROADMAP", "knurl-next replacements", n)

if __name__ == "__main__":
    patch_house()
    patch_docs()
    print("docs+house ok")
