from pathlib import Path
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "desktop/renderer/leftover-house.test.cjs"]:
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    # only change sill-walker probes that still use puffball as the generic guest
    n = t.count('pickTarget([WIN], 80, "puffball"')
    n2 = t.count('pickTarget([WIN], 200, "puffball"')
    # For the clone test, specifically replace the sill walker key
    old = 'const target = P.pickTarget([WIN], 80, "puffball", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++)'
    new = 'const target = P.pickTarget([WIN], 80, "chicken_of_woods", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++)'
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        print(path, "sill walker clone test", c)
    # any other playFor sill probes using puffball as subject for sill walk?
    # leave Puff-specific pickTargets alone
    p.write_text(t, encoding="utf-8", newline="\n")
    print(path, "remaining pickTarget puffball", t.count('pickTarget([WIN], 80, "puffball"'), t.count('pickTarget([WIN], 200, "puffball"'))
