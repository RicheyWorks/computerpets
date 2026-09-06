from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

CEMENT_ROADMAP = (
    "- [x] Cement (`barnacle` / `cement`) stays a real sash stile as a stone rim: walk onto the stile "
    "(the stile — the same furniture family Dam gnaws as a lodge cup and Jet glues as wet wood, not Dam's gnaw, "
    "not Jet's velvet, not Cone's glass-rim clamp, not Whorl's glass-rim rasp, not Pale's window-stool sand), "
    "kick the cirri (the tell — she stays; she kicks the cirri; an acorn barnacle; a crustacean; not a limpet, "
    "not Cone; not a crab; named: Cement. The stay is the tell. Hours: On the stone. Hello: \"I sat the stone. Hello.\" "
    "Ambient: \"I sit. Then I kick the cirri. Then I sit.\" Temperament: cemented.), then leave. One window. "
    "The cirri is the tell — not Cone's `clamp`. Not Dam's `gnaw`. Not Jet's `velvet`. Not Pale's `sand`. "
    "Not Wave's `signal`. Not Lid's `shut`. Not Whorl's `rasp`. playFor(\"barnacle\") returns `cirri` "
    "(not `cement`, not `clamp`, not `sand`, not `gnaw`). Cone (`limpet`) still owns `clamp`. "
    "Pale (`ghost_crab`) still owns `sand`. Wave (`fiddler_crab`) still owns `signal`. "
    "Lid (`box_turtle`) still owns `shut`. Whorl (`pond_snail`) still owns `rasp`. "
    "Dam (`beaver`) still owns `gnaw`. Jet (`velvet_worm`) still owns `velvet`. Same `playFor` door. "
    "`/demo/cement` lockstep. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. "
    "Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fourth shore leftover. Next leftover is Mail. Do not start Mail.\n"
)

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def sub_all(text, old, new, label):
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{label}: found 0")
    print(f"{label}: {n}")
    return text.replace(old, new)

p = ROOT / "docs" / "ARCHITECTURE.md"
t = p.read_text(encoding="utf-8")
t = sub_once(
    t,
    "2026-09-01 (Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
    "2026-09-01 (Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
    "architecture last updated",
)
p.write_text(t, encoding="utf-8", newline="\n")
print("patched architecture")

p = ROOT / "docs" / "ROADMAP.md"
t = p.read_text(encoding="utf-8")
t = sub_all(
    t,
    "Cone is done. Third shore leftover done. Next leftover is Cement. Do not start Cement.",
    "Cone is done. Third shore leftover done. Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.",
    "roadmap next leftover",
)
t = sub_once(
    t,
    "Catalog stays 220. Third shore leftover. Next leftover is Cement. Do not start Cement.",
    "Catalog stays 220. Third shore leftover. Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.\n" + CEMENT_ROADMAP,
    "roadmap Cone item + Cement item",
)
t = sub_once(
    t,
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cone clamps a glass rim as a rock rim; third shore leftover done; next leftover is Cement; catalog stays 220; clamp is the tell; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Tenant still owns knob)",
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
    "roadmap last updated",
)
if "Next leftover is Cement." in t:
    raise SystemExit("roadmap still names Cement as next leftover")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched roadmap")
print("docs ok")