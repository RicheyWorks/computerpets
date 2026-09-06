import pathlib
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = pathlib.Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# verify anchors
checks = [
 ("js header", "This is the leftover after Gleam. This is the second leftover of the far den. Others walk a sill. */" in js),
 ("js const", '  const CHORD = "chord";\n  const SILL = "sill";' in js),
 ("js dur", "    chordOff: 2.61,\n    sillHop:" in js),
 ("js playFor", '    if (key === "choir") return CHORD;\n    return SILL;' in js),
 ("js size", "    if (kind === CHORD) return w.width >= 192 && w.height >= 172;\n    return w.width >= 180 && w.height >= 70;" in js),
 ("js leave chorded", '        leave: "chorded",\n        spin: "none",\n      };\n    }\n\n        if (kind === WRAP) {' in js),
 ("js thirst refit bury", "    if (target.kind === CHORD) {\n      const hold = chordPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {" in js),
 ("js approach", '        if (target.kind === CHORD) {\n          return goPhase(next, "chord-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {' in js),
 ("js tick before sill", '    if (next.phase === "chord-off") {\n      const u = next.t / DUR.chordOff;\n      const pose = chordOffPath(Math.min(1, u), next.from, next.to);\n      next.x = pose.x;\n      next.lift = pose.lift;\n      next.rot = pose.rot;\n      next.anim = "walk";\n      next.facing = target.landX >= target.holdX ? 1 : -1;\n      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n      return next;\n    }\n\n    if (next.phase === "sill-hop") {' in js),
 ("js export kind", "    CHORD,\n    IGNORE," in js),
 ("js export fns", "    chordOffPath,\n    pickTarget," in js),
 ("ts header", "second leftover of the far den. Others walk a sill. Same map as desktop `window-play.js`. */" in ts),
 ("ts const", 'export const CHORD = "chord";\nexport const SILL = "sill";' in ts),
 ("ts dur", "  chordOff: 2.61,\n  sillHop:" in ts),
 ("ts kind", "typeof CHORD | typeof SILL | typeof IGNORE;" in ts),
 ("ts phase", '  | "chord-off"\n  | "sill-hop"' in ts),
 ("ts side", '| "barkstone" | "lampglass" | "blotterair";' in ts),
 ("ts leave", '| "plaqued" | "thirsted" | "chorded";' in ts),
 ("ts playFor", '  if (key === "choir") return CHORD;\n  return SILL;' in ts),
]
for name, ok in checks:
  print(("OK" if ok else "FAIL"), name)
# README sentence
for p in ["README.md","desktop/README.md"]:
  t=pathlib.Path(p).read_text(encoding="utf-8")
  print(p, "Choir chords" in t, "Nimbus floats" in t)
