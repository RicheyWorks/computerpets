# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD START: {old[:220]!r}")
    return text.replace(old, new, 1)

# Import patched helpers by re-executing core with fixed tick — rewrite flame_core tick section via direct apply

exec(compile(Path("_flame_core.py").read_text(encoding="utf-8").replace(
'''    if (next.phase === "cloud-off") {
      const u = next.t / DUR.cloudOff;
      const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {''',
'''    if (next.phase === "cloud-off") {
      const u = next.t / DUR.cloudOff;
      const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }


    if (next.phase === "sill-hop") {''').replace(
'''  if (next.phase === "cloud-off") {
    const u = next.t / DUR.cloudOff;
    const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {''',
'''  if (next.phase === "cloud-off") {
    const u = next.t / DUR.cloudOff;
    const pose = cloudOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


  if (next.phase === "sill-hop") {'''),
"_flame_core_fixed.py", "exec"))
