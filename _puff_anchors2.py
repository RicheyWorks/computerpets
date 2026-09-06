from pathlib import Path
import re
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name,pat in [
 ("side", r'export type .*Side.*'),
 ("holdside", r'type HoldSide[^;]+;'),
 ("side2", r'"woodwound"[^\n]{0,200}'),
 ("leave2", r'"bearded"[^\n]{0,200}'),
 ("phase", r'"teeth-off"[^\n]{0,120}'),
 ("kind", r'typeof TEETH[^\n]{0,80}'),
]:
  m=re.search(pat, ts)
  print(name, repr(m.group(0)[:220]) if m else None)
# ts pick/refit/approach/tick anchors
olds=[
('''      leave: "bearded",
      spin: "none",
    };
  }


  if (kind === WRAP) {''',"ts pick"),
('''  if (target.kind === TEETH) {
    const hold = teethPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',"ts refit"),
('''      if (target.kind === TEETH) {
        return goPhase(next, "teeth-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',"ts approach"),
('''  if (next.phase === "teeth-off") {
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




  if (next.phase === "sill-hop") {''',"ts tick"),
("export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {","ts begin"),
("  if (kind === TEETH) return w.width >= 186 && w.height >= 196;\n    return w.width >= 180 && w.height >= 70;","ts size"),
]
for s,n in olds:
  print(n, ts.count(s))
# js pick exact - check whitespace after TEETH block
idx=js.find('leave: "bearded"')
print("js around bearded:")
print(repr(js[idx:idx+120]))
