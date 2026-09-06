from pathlib import Path
p = Path("_horn_core.py")
t = p.read_text(encoding="utf-8")
old_once_js = '''    if (next.phase === "hollow-off") {
      const u = next.t / DUR.hollowOff;
      const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }



    if (next.phase === "sill-hop") {'''
new_once_js = '''    if (next.phase === "hollow-off") {
      const u = next.t / DUR.hollowOff;
      const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }




    if (next.phase === "sill-hop") {'''
print("once js old count", t.count(old_once_js))
if t.count(old_once_js) != 1:
    raise SystemExit("js old missing")
t = t.replace(old_once_js, new_once_js, 1)

old_once_ts = '''  if (next.phase === "hollow-off") {
    const u = next.t / DUR.hollowOff;
    const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }



  if (next.phase === "sill-hop") {'''
new_once_ts = '''  if (next.phase === "hollow-off") {
    const u = next.t / DUR.hollowOff;
    const pose = hollowOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }




  if (next.phase === "sill-hop") {'''
print("once ts old count", t.count(old_once_ts))
if t.count(old_once_ts) != 1:
    raise SystemExit("ts old missing")
t = t.replace(old_once_ts, new_once_ts, 1)
p.write_text(t, encoding="utf-8", newline="\n")
print("patched patcher")
