import pathlib
ts = pathlib.Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# sample around const CHORD and playFor and size and chord-off tick
for needle in ['export const CHORD = "chord";', 'if (key === "choir") return CHORD;', 'if (kind === CHORD) return w.width >= 192', 'leave: "chorded"', 'target.kind === CHORD', 'chord-on', 'phase === "chord-off"', 'typeof CHORD | typeof SILL']:
    i = ts.find(needle)
    print(needle, i)
    if i>=0:
        print(repr(ts[i:i+200]))
        print('---')
