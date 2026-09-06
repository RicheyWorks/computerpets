from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks=[
("js header", "This is the leftover after Ring. This is the sixth leftover of the fungi den. Others walk a sill. */"),
("js const", '  const TEETH = "teeth";\n  const SILL = "sill";'),
("js dur", "    teethOff: 2.49,\n    sillHop:"),
("js playFor", '    if (key === "lions_mane") return TEETH;\n    return SILL;'),
("js size", "    if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n    return w.width >= 180 && w.height >= 70;"),
("js export kind", "    TEETH,\n    IGNORE,"),
("js export fn", "    teethOffPath,\n    pickTarget,"),
("ts header", "This is the leftover after Ring. This is the sixth leftover of the fungi den. Others walk a sill. Same map as desktop `window-play.js`. */"),
("ts const", 'export const TEETH = "teeth";\nexport const SILL = "sill";'),
("ts dur", "  teethOff: 2.49,\n  sillHop:"),
("ts playFor", '  if (key === "lions_mane") return TEETH;\n  return SILL;'),
]
for n,s in checks:
  print(n, js.count(s) if n.startswith("js") else ts.count(s), repr(s[:60]))
# side/leave unions
import re
for label,text in [("js",js),("ts",ts)]:
  m=re.search(r'woodwound.{0,80}', text)
  print(label, "woodwound", m.group(0)[:100] if m else None)
  m=re.search(r'bearded.{0,80}', text)
  print(label, "bearded", m.group(0)[:100] if m else None)
  m=re.search(r'typeof TEETH.{0,60}', text)
  print(label, "typeof TEETH", m.group(0) if m else None)
  m=re.search(r'"teeth-off".{0,40}', text)
  print(label, "teeth-off", m.group(0) if m else None)
# pick block uniqueness
old_pick='''        leave: "bearded",
        spin: "none",
      };
    }


        if (kind === WRAP) {'''
print("js pick", js.count(old_pick))
old_refit='''    if (target.kind === TEETH) {
      const hold = teethPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {'''
print("js refit", js.count(old_refit))
old_ap='''        if (target.kind === TEETH) {
          return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {'''
print("js approach", js.count(old_ap))
print("beginPlay count", js.count("  function beginPlay(target, petX) {"))
old_tick_tail='''    if (next.phase === "teeth-off") {
      const u = next.t / DUR.teethOff;
      const pose = teethOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {'''
print("js tick", js.count(old_tick_tail))
# ts variants
print("ts typeof", ts.count('typeof TEETH | typeof SILL'))
print("ts phase", ts.count('  | "teeth-off"\n  | "sill-hop"'))
for pat in ['woodwound','bearded','typeof TEETH','"teeth-off"']:
  pass
# find side union
m=re.search(r'\| "woodwound"[^;]+;', ts)
print("side union", m.group(0)[:200] if m else "MISSING")
m=re.search(r'\| "bearded"[^;]+;', ts)
print("leave union", m.group(0)[:200] if m else "MISSING")
