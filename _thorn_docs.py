from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

THORN_ROADMAP = '''- [x] Thorn (`sea_urchin` / `thorn`) spines a real window well as a tide pool: walk into the well (the pool — the same furniture family Scud sides as a side pool, Spike crowns as a sand tray, Beak snaps as a mud bowl, Silver goes as a bank hole, Whisk barbels as a mud run, and Coal browses as an oak denside, not Scud's side, not Spike's crown, not Beak's snap, not Silver's go, not Whisk's barbel, not Coal's browse, not Token's sill-pan flat, not Burr's ball, not Spine's jamb bristle), sit the spines (the tell — she spines; a purple sea urchin; not Burr; not Spine; not Token; named: Thorn. The spines are the tell. Hello: "I sat the spines. Hello." Ambient: "I walk. Then I spine. Then I walk." Play: "A walk. Review the spines." Temperament: spined.), then leave. One window. The spines are the tell — not Spine's `bristle`. Not Burr's `ball`. Not Spike's `crown`. Not Token's `flat`. Not Scud's `side`. Not Beak's `snap`. playFor("sea_urchin") returns `spines` (not `thorn`, not `spine`, not `bristle`, not `ball`, not `crown`, not `flat`). Spine (`porcupine`) still owns `bristle`. Burr (`hedgehog`) still owns `ball`. Spike (`horned_lizard`) still owns `crown`. Token (`sand_dollar`) still owns `flat`. Spire (`periwinkle`) still owns `rock`. Mail (`chiton`) still owns `eight`. Cement (`barnacle`) still owns `cirri`. Cone (`limpet`) still owns `clamp`. Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. Same `playFor` door. `/demo/thorn` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Eighth shore leftover. Next leftover is Knurl. Do not start Knurl.
'''

def patch_docs():
    readme = ROOT / "README.md"
    t = readme.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the seventh shore leftover. Other guests walk a sill.",
        "This is the seventh shore leftover. Thorn spines a window well as a tide pool: walk into the well, sit the spines, then leave. Spine still owns bristle. Burr still owns ball. Token still owns flat. This is the eighth shore leftover. Other guests walk a sill.",
        "readme",
    )
    readme.write_text(t, encoding="utf-8", newline="\n")
    print("patched README")

    desk = ROOT / "desktop" / "README.md"
    t = desk.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the seventh shore leftover. Other guests walk a sill.",
        "This is the seventh shore leftover. Thorn spines a window well as a tide pool: walk into the well, sit the spines, then leave. Spine still owns bristle. Burr still owns ball. Token still owns flat. This is the eighth shore leftover. Other guests walk a sill.",
        "desktop readme",
    )
    desk.write_text(t, encoding="utf-8", newline="\n")
    print("patched desktop README")

    arch = ROOT / "docs" / "ARCHITECTURE.md"
    t = arch.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "2026-09-01 (Token flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; catalog stays 220; flat is the tell; Cache still owns bury; Pale still owns sand; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Wave still owns signal; Coin still owns circle; Disk still owns open; Ochre still owns reef)",
        "2026-09-01 (Thorn spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; catalog stays 220; spines is the tell; Spine still owns bristle; Burr still owns ball; Spike still owns crown; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "architecture",
    )
    arch.write_text(t, encoding="utf-8", newline="\n")
    print("patched ARCHITECTURE")

    road = ROOT / "docs" / "ROADMAP.md"
    t = road.read_text(encoding="utf-8")
    n = t.count("Next leftover is Thorn. Do not start Thorn.")
    if n < 1:
        raise SystemExit(f"roadmap thorn next: expected at least 1, found {n}")
    t = t.replace("Next leftover is Thorn. Do not start Thorn.", "Thorn is done. Eighth shore leftover done. Next leftover is Knurl. Do not start Knurl.")
    t = sub_once(
        t,
        "Catalog stays 220. Seventh shore leftover. Thorn is done. Eighth shore leftover done. Next leftover is Knurl. Do not start Knurl.\n",
        "Catalog stays 220. Seventh shore leftover. Thorn is done. Eighth shore leftover done. Next leftover is Knurl. Do not start Knurl.\n" + THORN_ROADMAP,
        "roadmap thorn item",
    )
    t = sub_once(
        t,
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Token flats a sill pan as a sand plate; seventh shore leftover done; next leftover is Thorn; catalog stays 220; flat is the tell; Cache still owns bury; Pale still owns sand; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Wave still owns signal; Coin still owns circle; Disk still owns open; Ochre still owns reef)",
        "**Last Updated:** 2026-09-01 (Phase 6 leftover: Thorn spines a window well as a tide pool; eighth shore leftover done; next leftover is Knurl; catalog stays 220; spines is the tell; Spine still owns bristle; Burr still owns ball; Spike still owns crown; Token still owns flat; Spire still owns rock; Mail still owns eight; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal)",
        "roadmap last updated",
    )
    road.write_text(t, encoding="utf-8", newline="\n")
    print("patched ROADMAP")

if __name__ == "__main__":
    patch_docs()
    print("docs ok")
