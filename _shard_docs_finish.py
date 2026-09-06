# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
old = (
    '  assert.equal(WP.playFor("silica"), "facet");\n'
    '  assert.equal(WP.FACET, "facet");\n'
    '  assert.notEqual(WP.playFor("silica"), "float");\n'
    '  assert.notEqual(WP.playFor("silica"), "daub");\n'
    '  assert.notEqual(WP.playFor("silica"), "sill");\n'
)
new = (
    '  assert.equal(WP.playFor("silica"), "facet");\n'
    '  assert.equal(WP.FACET, "facet");\n'
    '  assert.notEqual(WP.playFor("silica"), "shard");\n'
    '  assert.notEqual(WP.playFor("silica"), "silica");\n'
    '  assert.notEqual(WP.playFor("silica"), "float");\n'
    '  assert.notEqual(WP.playFor("silica"), "daub");\n'
    '  assert.notEqual(WP.playFor("silica"), "teeth");\n'
    '  assert.notEqual(WP.playFor("silica"), "plane");\n'
    '  assert.notEqual(WP.playFor("silica"), "sill");\n'
)
if 'notEqual(WP.playFor("silica"), "shard")' in house:
    print("house asserts already full")
else:
    house = once(house, old, new, "house asserts")
    Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")
    print("house asserts strengthened")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
if "Shard facets a sash gap" in arch:
    print("arch already")
else:
    arch_old = "| **Last Updated** | 2026-09-02 (Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
    arch_new = "| **Last Updated** | 2026-09-02 (Shard facets a sash gap as an inkstone; fourth leftover of the far den done; Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; facet is the tell; Nimbus still owns float; Mortar still owns daub; Mane still owns teeth; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
    arch = once(arch, arch_old, arch_new, "arch")
    Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")
    print("arch updated")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
if "Shard (`silica`" not in rm:
    pact_next_old = "Next leftover was Nimbus (`nimbus`); Nimbus floats. Next leftover is Silica (`silica`). Do not start Silica."
    pact_next_new = "Next leftover was Nimbus (`nimbus`); Nimbus floats. Next leftover was Silica (`silica`); Shard facets. Next leftover is Dusk (`terminator`). Do not start Dusk."
    rm = once(rm, pact_next_old, pact_next_new, "roadmap next")
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
    rm = "".join(out)
    rm_old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
    rm_new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Shard facets a sash gap as an inkstone; fourth leftover of the far den done; Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; facet is the tell; Nimbus still owns float; Mortar still owns daub; Mane still owns teeth; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
    rm = once(rm, rm_old, rm_new, "roadmap footer")
    Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")
    print("roadmap updated")
else:
    print("roadmap already has Shard")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    if "Shard facets a sash gap as an inkstone" in text:
        print(p, "already")
        continue
    old = "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. Nimbus still owns float. Mortar still owns daub. Mane still owns teeth. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    text = once(text, old, new, p)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")
print("docs done")
