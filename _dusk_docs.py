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
    "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. "
    "Nimbus still owns float."
)
README_NEW = (
    "Dusk rims a lamp-side stile as a lamp-edge: walk onto the stile, sit the rim, then leave. "
    "Night still owns dusk. Shard still owns facet. Nimbus still owns float."
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
    "| **Last Updated** | 2026-09-02 (Dusk rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Knot; catalog stays 220; "
    "rim is the tell; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
)
arch = once(arch, old, new, "arch")
(HERE / "docs" / "ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
print("arch updated")

rm = (HERE / "docs" / "ROADMAP.md").read_text(encoding="utf-8")
shard_line = None
for line in rm.splitlines():
    if "Shard (`silica`" in line and line.strip().startswith("- [x]"):
        shard_line = line
        break
if not shard_line:
    raise SystemExit("shard roadmap line missing")
dusk_entry = (
    "- [x] Dusk (`terminator` / `dusk`) rims a real lamp-side stile as a lamp-edge: walk onto the stile "
    "(lamp-side stile as a lamp-edge a twilight walker rims; not Night's lamp-side stile dusk run, "
    "not Penny's dock-shade flare, not Swing's lamp-arm sing, not Ghost's lamp-side glass week, "
    "not Gleam's bright pane lamp glass, not Shard's sash-gap inkstone, not Miso's top ledge; "
    "thin rim; twilight walker; one rim-bound guest; named: Dusk / terminator. The rim is the tell. "
    "Hours: Rim of a treaty. Hello: \"I kept the rim. Hello.\" Play: \"An edge. Review the country.\" / "
    "\"I win by remaining a rim.\" Temperament: rim-bound. Not dusk as kind (Night/walleye owns dusk). "
    "Not week. Not creep. Not facet. Not float. Not terminator as kind. Not ledge. Same `playFor` door. "
    "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
    "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Fifth leftover of the far den. Next leftover is Knot (`nexus`). Do not start Knot.\n"
)
if "Dusk (`terminator`" not in rm:
    rm = rm.replace(shard_line + "\n", shard_line + "\n\n" + dusk_entry, 1)
    print("roadmap entry added")
else:
    print("roadmap entry exists")

n = rm.count("Next leftover is Dusk (`terminator`). Do not start Dusk.")
rm = rm.replace(
    "Next leftover is Dusk (`terminator`). Do not start Dusk.",
    "Next leftover was Dusk (`terminator`); Dusk rims. Next leftover is Knot (`nexus`). Do not start Knot.",
)
print("roadmap next pins", n)

m = re.search(r"\*\*Last Updated:\*\* 2026-09-02 \(Phase 6 leftover: [^)]+\)", rm)
if not m:
    raise SystemExit("roadmap footer missing")
old = m.group(0)
new = (
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Dusk rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Knot; catalog stays 220; "
    "rim is the tell; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
)
rm = once(rm, old, new, "roadmap footer")
(HERE / "docs" / "ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
print("roadmap updated")