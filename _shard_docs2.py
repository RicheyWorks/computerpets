# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}")
    return text.replace(old, new, 1)

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
if "Shard (`silica`" not in rm:
    shard_entry = (
        "- [x] Shard (`silica` / `shard`) facets a real sash gap as an inkstone: walk into the gap (left sash gap — inkstone a living crystal facets; not Mortar's left inkstone-cell daub, not Mane's right wood-wound teeth, not Nimbus methane bowl mid pane, not Choir blotter air, not Gleam lamp glass; sharp facet; living crystal; not quartz; named: Shard. The facet is the tell. Hours: Inkstone. Hello: \"I faceted. Hello.\" Play: \"A facet. Review the edge.\" / \"I win by remaining a mineral.\" Temperament: patient. Not shard as kind. Not silica as kind. Not float. Not daub. Not teeth. Not plane. Not edge. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Fourth leftover of the far den. Next leftover is Dusk (`terminator`). Do not start Dusk.\n"
    )
    lines = rm.splitlines(True)
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if (not inserted) and line.startswith("- [x] Pact (`lichen`"):
            out.append("\n")
            out.append(shard_entry)
            out.append("\n")
            inserted = True
    if not inserted:
        raise SystemExit("Pact line missing")
    Path("docs/ROADMAP.md").write_text("".join(out), encoding="utf-8", newline="\n")
    print("Shard entry inserted")
else:
    print("Shard entry exists")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    if "Shard facets a sash gap as an inkstone" in text:
        print(p, "already")
        continue
    old = "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. Nimbus still owns float. Mortar still owns daub. Mane still owns teeth. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        i = text.find("Nimbus floats")
        print(p, "Nimbus idx", i, repr(text[i:i+200]) if i>=0 else "")
        raise SystemExit(p + " mismatch")
    text = once(text, old, new, p)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")
print("ok")
