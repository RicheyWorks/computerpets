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
    "Brine frosts a window stool as a salt dish: walk onto the stool, sit the frost, then leave. "
    "Knot still owns many. Tun still owns dry. Sheen still owns lick. Dusk still owns rim. Snap still owns count."
)
README_NEW = (
    "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. "
    "Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt."
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
    "| **Last Updated** | 2026-09-02 (Beacon aligns a sash parting bead as a ruler line; eighth leftover of the far den done; "
    "Brine leftover still frosts a window stool as a salt dish; seventh leftover of the far den done; "
    "Knot leftover still manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Hush; catalog stays 220; "
    "align is the tell; Brine still owns frost; Flux still owns field; Bandit still owns inspect; Anchor still owns hitch; Stem still owns stilt; Knot still owns many; Tun still owns dry; Sheen still owns lick; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust) |"
)
arch = once(arch, old, new, "arch")
(HERE / "docs" / "ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
print("arch updated")

rm = (HERE / "docs" / "ROADMAP.md").read_text(encoding="utf-8")
brine_line = None
for line in rm.splitlines():
    if "Brine (`halovore`" in line and line.strip().startswith("- [x]"):
        brine_line = line
        break
if not brine_line:
    raise SystemExit("brine roadmap line missing")
beacon_entry = (
    "- [x] Beacon (`magneton` / `beacon`) aligns a real sash parting bead as a ruler line: walk onto the bead "
    "(interior parting bead — vertical thin bead between sash and jamb / pencil-line of the frame a field swimmer aligns; "
    "not Bandit jamb-as-ruler inspect, not Anchor parting-bead pencil hitch, not Stem parting-bead blotter stilt, "
    "not Shift parting-bead aim, not Flux glass field, not Gauss orbit, not Brine salt-dish frost, not Knot paperweight many; "
    "sit the north; align as one name; field swimmer; named: Beacon / magneton. The north is the tell. "
    "Hours: Ruler of a line. Hello: \"Beacon. The north is the tell.\" / \"North is food.\" Play: \"I sat the north.\" / "
    "\"Aligned.\" Temperament catalog Aligned, kind align. Not field as kind (Flux owns field). "
    "Not north as kind. Not inspect (Bandit owns inspect). Not hitch (Anchor owns hitch). Not stilt (Stem owns stilt). "
    "Not frost (Brine owns frost). Same `playFor` door. "
    "No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. "
    "Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. "
    "Eighth leftover of the far den. Next leftover is Hush (`umbral`). Do not start Hush.\n"
)
if "Beacon (`magneton`" not in rm:
    rm = rm.replace(brine_line + "\n", brine_line + "\n\n" + beacon_entry, 1)
    print("roadmap entry added")
else:
    print("roadmap entry exists")

n = rm.count("Next leftover is Beacon (`magneton`). Do not start Beacon.")
rm = rm.replace(
    "Next leftover is Beacon (`magneton`). Do not start Beacon.",
    "Next leftover was Beacon (`magneton`); Beacon aligns. Next leftover is Hush (`umbral`). Do not start Hush.",
)
print("roadmap next pins", n)

m = re.search(r"\*\*Last Updated:\*\* 2026-09-02 \(Phase 6 leftover: [^)]+\)", rm)
if not m:
    raise SystemExit("roadmap footer missing")
old = m.group(0)
new = (
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Beacon aligns a sash parting bead as a ruler line; eighth leftover of the far den done; "
    "Brine leftover still frosts a window stool as a salt dish; seventh leftover of the far den done; "
    "Knot leftover still manys a window stool as a paperweight; sixth leftover of the far den done; "
    "Dusk leftover still rims a lamp-side stile as a lamp-edge; fifth leftover of the far den done; "
    "Shard leftover still facets a sash gap as an inkstone; fourth leftover of the far den done; "
    "Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; "
    "Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; "
    "Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; "
    "Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; "
    "meadow ten closed; hive ten closed; shore ten is closed; next leftover is Hush; catalog stays 220; "
    "align is the tell; Brine still owns frost; Flux still owns field; Bandit still owns inspect; Anchor still owns hitch; Stem still owns stilt; Knot still owns many; Tun still owns dry; Sheen still owns lick; Dusk still owns rim; Snap still owns count; Night still owns dusk; Shard still owns facet; Nimbus still owns float; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; "
    "Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; "
    "Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; "
    "Pebble still owns puff; Floss still owns dust)"
)
rm = once(rm, old, new, "roadmap footer")
(HERE / "docs" / "ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
print("roadmap updated")
