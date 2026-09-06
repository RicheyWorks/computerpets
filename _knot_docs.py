# -*- coding: utf-8 -*-
from pathlib import Path
import re

HERE = Path(r"C:\Users\730ri\projects\ComputerPets")

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d\nOLD START: %r" % (label, n, old[:240]))
    return text.replace(old, new, 1)

README_OLD = (
    "Dusk rims a lamp-side stile as a lamp-edge: walk onto the stile, sit the rim, then leave. "
    "Night still owns dusk. Shard still owns facet. Nimbus still owns float."
)
README_NEW = (
    "Knot manys a window stool as a paperweight: walk onto the stool, sit the colony, then leave. "
    "Dusk still owns rim. Snap still owns count. Night still owns dusk. Shard still owns facet. Nimbus still owns float."
)

for p in ["README.md", "desktop/README.md"]:
    text = (HERE / p).read_text(encoding="utf-8")
    text = once(text, README_OLD, README_NEW, p)
    (HERE / p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

arch = (HERE / "docs" / "ARCHITECTURE.md").read_text(encoding="utf-8")
m = re.search(r"\| \*\*Last Updated\*\* \| 2026-09-02 \([^)]+\) \|", arch)
if not m:
    raise SystemExit("arch last updated missing")
old = m.group(0)
new = (
    "| **Last Updated** | 2026-09-02 (Knot manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Brine; catalog stays 220; "
    "many is the tell; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
)
arch = once(arch, old, new, "arch")
(HERE / "docs" / "ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
print("arch updated")

rm = (HERE / "docs" / "ROADMAP.md").read_text(encoding="utf-8")
dusk_line = None
for line in rm.splitlines():
    if "Dusk (`terminator`" in line and line.strip().startswith("- [x]"):
        dusk_line = line
        break
if not dusk_line:
    raise SystemExit("dusk roadmap line missing")
knot_entry = (
    "- [x] Knot (`nexus` / `knot`) manys a real window stool as a paperweight: walk onto the stool "
    "(window stool as a paperweight a walking colony manys; not Cache oak-dish bury, "
    "not Armor bark-dish roll, not Pale dry-sand, not Snap meeting-rail wetland-cup count, "
    "not Dusk lamp-side stile lamp-edge, not Shard sash-gap inkstone; "
    "sit the colony; many as one name; walking colony; named: Knot / nexus. The many is the tell. "
    "Hours: Count of a treaty. Hello: \"We counted. Hello.\" / \"You may look. We are one guest.\" Play: \"A ripple. Review the count.\" / "
    "\"We win by remaining one name.\" Temperament: many. Not knot as kind. Not nexus as kind. Not count (Snap/venus_flytrap owns count). "
    "Not rim (Dusk owns rim). Not dusk (Night/walleye owns dusk). Not week. Not facet. Not float. Not bury. Same `playFor` door. "
    "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
    "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Sixth leftover of the far den. Next leftover is Brine (`halovore`). Do not start Brine.\n"
)
if "Knot (`nexus`" not in rm:
    rm = rm.replace(dusk_line + "\n", dusk_line + "\n\n" + knot_entry, 1)
    print("roadmap entry added")
else:
    print("roadmap entry exists")

n = rm.count("Next leftover is Knot (`nexus`). Do not start Knot.")
rm = rm.replace(
    "Next leftover is Knot (`nexus`). Do not start Knot.",
    "Next leftover was Knot (`nexus`); Knot manys. Next leftover is Brine (`halovore`). Do not start Brine.",
)
print("roadmap next pins", n)

m = re.search(r"\*\*Last Updated:\*\* 2026-09-02 \(Phase 6 leftover: [^)]+\)", rm)
if not m:
    raise SystemExit("roadmap footer missing")
old = m.group(0)
new = (
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Knot manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Brine; catalog stays 220; "
    "many is the tell; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
)
rm = once(rm, old, new, "roadmap footer")
(HERE / "docs" / "ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
print("roadmap updated")
