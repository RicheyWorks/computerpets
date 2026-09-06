from pathlib import Path
p = Path("_starter_core.py")
t = p.read_text(encoding="utf-8")
# Fix TS tick once() to use actual double-spaced drip-off and unindented sill-hop
old = '''    t = once(t, \'\'\'  if (next.phase === "drip-off") {
    const u = next.t / DUR.dripOff;
    const pose = dripOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


  if (next.phase === "sill-hop") {\'\'\',
             \'\'\'  if (next.phase === "drip-off") {
    const u = next.t / DUR.dripOff;
    const pose = dripOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
\'\'\' + TS_TICK + \'\'\'
  if (next.phase === "sill-hop") {\'\'\', "ts tick")'''

# Build replacement using exact file content for OLD
tick_old = Path("_starter_ts_tick_old.txt").read_text(encoding="utf-8")
# TS_TICK is single-spaced with 2-space indent; keep that. Restore sill-hop indent.
new = (
    "    tick_old = " + repr(tick_old) + "\n"
    "    t = once(t, tick_old + 'if (next.phase === \"sill-hop\") {',\n"
    "             tick_old + TS_TICK + '  if (next.phase === \"sill-hop\") {', \"ts tick\")"
)
if old not in t:
    raise SystemExit("old tick block not found in starter_core")
t = t.replace(old, new, 1)
p.write_text(t, encoding="utf-8", newline="\n")
print("patched starter_core ts tick")
# verify syntax
compile(t, "_starter_core.py", "exec")
print("syntax ok")
