from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for label, t in [("TS", ts), ("JS", js)]:
    print("====", label)
    for needle in ["MANTLE", "mantle-on", "giant_clam", "mantlePoint", "side: \"mantledish\"", "kind === MANTLE", "target.kind === MANTLE"]:
        print(needle, t.count(needle))
    # show approach context
    i = t.find('target.kind === MANTLE')
    print("approach/refit contexts:")
    start = 0
    while True:
        i = t.find("target.kind === MANTLE", start)
        if i < 0: break
        print(repr(t[i:i+220]))
        start = i+1
    i = t.find('next.phase === "mantle-on"')
    print("phase mantle-on", i, repr(t[i:i+120]) if i>=0 else None)
