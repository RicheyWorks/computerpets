from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")
MAIL_ROADMAP = (ROOT / "_mail_roadmap.txt").read_text(encoding="utf-8")

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
    "2026-09-01 (Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
    "2026-09-01 (Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
    "architecture last updated",
)
p.write_text(t, encoding="utf-8", newline="\n")
print("patched architecture last updated")

p = ROOT / "docs" / "ROADMAP.md"
t = p.read_text(encoding="utf-8")
t = sub_all(
    t,
    "Cement is done. Fourth shore leftover done. Next leftover is Mail. Do not start Mail.",
    "Cement is done. Fourth shore leftover done. Mail is done. Fifth shore leftover done. Next leftover is Spire. Do not start Spire.",
    "roadmap next leftover",
)
t = sub_once(
    t,
    "Catalog stays 220. Fourth shore leftover. Next leftover is Mail. Do not start Mail.",
    "Catalog stays 220. Fourth shore leftover. Mail is done. Fifth shore leftover done. Next leftover is Spire. Do not start Spire.\n" + MAIL_ROADMAP,
    "roadmap Cement item + Mail item",
)
t = sub_once(
    t,
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Cement stays a sash stile as a stone rim; fourth shore leftover done; next leftover is Mail; catalog stays 220; cirri is the tell; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Dam still gnaws; Jet still owns velvet)",
    "**Last Updated:** 2026-09-01 (Phase 6 leftover: Mail plates a meeting rail as a tide rock; fifth shore leftover done; next leftover is Spire; catalog stays 220; eight is the tell; Cement still owns cirri; Cone still owns clamp; Pale still owns sand; Wave still owns signal; Lid still owns shut; Whorl still rasps; Armor still owns roll)",
    "roadmap last updated",
)
if "Next leftover is Mail." in t:
    raise SystemExit("roadmap still names Mail as next leftover")
if "Do not start Spire." not in t:
    raise SystemExit("roadmap missing Spire next leftover")
p.write_text(t, encoding="utf-8", newline="\n")
print("patched roadmap")
print("docs ok")
