from pathlib import Path
p = Path("_beacon_core.py")
t = p.read_text(encoding="utf-8")
# Find the ts tick section and replace the blank/tight matching with a version that also handles blank-body-no-gap
old = '''    old_tick_blank = (
        \'  if (next.phase === "frost-off") {\\n\'
        \'\\n\'
        \'    const u = next.t / DUR.frostOff;\\n\'
        \'\\n\'
        \'    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\\n\'
        \'\\n\'
        \'    next.x = pose.x;\\n\'
        \'\\n\'
        \'    next.lift = pose.lift;\\n\'
        \'\\n\'
        \'    next.rot = pose.rot;\\n\'
        \'\\n\'
        \'    next.anim = "walk";\\n\'
        \'\\n\'
        \'    next.facing = target.landX >= target.holdX ? 1 : -1;\\n\'
        \'\\n\'
        \'    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\\n\'
        \'\\n\'
        \'    return next;\\n\'
        \'\\n\'
        \'  }\\n\'
        \'\\n\'
        \'  if (next.phase === "sill-hop") {\'
    )
    old_tick_tight = (
        \'  if (next.phase === "frost-off") {\\n\'
        \'    const u = next.t / DUR.frostOff;\\n\'
        \'    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\\n\'
        \'    next.x = pose.x;\\n\'
        \'    next.lift = pose.lift;\\n\'
        \'    next.rot = pose.rot;\\n\'
        \'    next.anim = "walk";\\n\'
        \'    next.facing = target.landX >= target.holdX ? 1 : -1;\\n\'
        \'    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\\n\'
        \'    return next;\\n\'
        \'  }\\n\'
        \'  if (next.phase === "sill-hop") {\'
    )
    sill_anchor = \'  if (next.phase === "sill-hop") {\'
    if old_tick_blank in t:
        new_tick = old_tick_blank[: -len(sill_anchor)] + "\\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_blank, new_tick, "ts tick blank")
    elif old_tick_tight in t:
        new_tick = old_tick_tight[: -len(sill_anchor)] + "\\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_tight, new_tick, "ts tick tight")
    else:
        idx = t.find(\'if (next.phase === "frost-off")\')
        raise SystemExit("ts tick: neither blank nor tight matched\\n" + repr(t[idx:idx+500]))'''

new = '''    old_tick_blank = (
        \'  if (next.phase === "frost-off") {\\n\'
        \'\\n\'
        \'    const u = next.t / DUR.frostOff;\\n\'
        \'\\n\'
        \'    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\\n\'
        \'\\n\'
        \'    next.x = pose.x;\\n\'
        \'\\n\'
        \'    next.lift = pose.lift;\\n\'
        \'\\n\'
        \'    next.rot = pose.rot;\\n\'
        \'\\n\'
        \'    next.anim = "walk";\\n\'
        \'\\n\'
        \'    next.facing = target.landX >= target.holdX ? 1 : -1;\\n\'
        \'\\n\'
        \'    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\\n\'
        \'\\n\'
        \'    return next;\\n\'
        \'\\n\'
        \'  }\\n\'
        \'\\n\'
        \'  if (next.phase === "sill-hop") {\'
    )
    old_tick_mid = (
        \'  if (next.phase === "frost-off") {\\n\'
        \'\\n\'
        \'    const u = next.t / DUR.frostOff;\\n\'
        \'\\n\'
        \'    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\\n\'
        \'\\n\'
        \'    next.x = pose.x;\\n\'
        \'\\n\'
        \'    next.lift = pose.lift;\\n\'
        \'\\n\'
        \'    next.rot = pose.rot;\\n\'
        \'\\n\'
        \'    next.anim = "walk";\\n\'
        \'\\n\'
        \'    next.facing = target.landX >= target.holdX ? 1 : -1;\\n\'
        \'\\n\'
        \'    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\\n\'
        \'\\n\'
        \'    return next;\\n\'
        \'\\n\'
        \'  }\\n\'
        \'  if (next.phase === "sill-hop") {\'
    )
    old_tick_tight = (
        \'  if (next.phase === "frost-off") {\\n\'
        \'    const u = next.t / DUR.frostOff;\\n\'
        \'    const pose = frostOffPath(Math.min(1, u), next.from, next.to);\\n\'
        \'    next.x = pose.x;\\n\'
        \'    next.lift = pose.lift;\\n\'
        \'    next.rot = pose.rot;\\n\'
        \'    next.anim = "walk";\\n\'
        \'    next.facing = target.landX >= target.holdX ? 1 : -1;\\n\'
        \'    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\\n\'
        \'    return next;\\n\'
        \'  }\\n\'
        \'  if (next.phase === "sill-hop") {\'
    )
    sill_anchor = \'  if (next.phase === "sill-hop") {\'
    if old_tick_blank in t:
        new_tick = old_tick_blank[: -len(sill_anchor)] + "\\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_blank, new_tick, "ts tick blank")
    elif old_tick_mid in t:
        new_tick = old_tick_mid[: -len(sill_anchor)] + "\\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_mid, new_tick, "ts tick mid")
    elif old_tick_tight in t:
        new_tick = old_tick_tight[: -len(sill_anchor)] + "\\n" + TS_TICK + sill_anchor
        t = once(t, old_tick_tight, new_tick, "ts tick tight")
    else:
        idx = t.find(\'if (next.phase === "frost-off")\')
        raise SystemExit("ts tick: neither blank nor tight matched\\n" + repr(t[idx:idx+500]))'''

if old not in t:
    raise SystemExit("old tick block missing in core")
t = t.replace(old, new)
p.write_text(t, encoding="utf-8")
print("tick matcher updated")
