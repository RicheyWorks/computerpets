from pathlib import Path
p = Path("_flame_core.py")
t = p.read_text(encoding="utf-8")
# In the once() old strings for tick, cloud-off is followed by one blank then sill-hop;
# live file has two blanks. Replace the specific marker unique to cloud-off once-blocks.
marker = 'if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n      return next;\n    }\n\n    if (next.phase === "sill-hop") {'
fixed = 'if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n      return next;\n    }\n\n\n    if (next.phase === "sill-hop") {'
print("js-style marker count", t.count(marker))
t2 = t.replace(marker, fixed)
marker2 = 'if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n  if (next.phase === "sill-hop") {'
fixed2 = 'if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n\n  if (next.phase === "sill-hop") {'
print("ts-style marker count", t2.count(marker2))
t2 = t2.replace(marker2, fixed2)
p.write_text(t2, encoding="utf-8", newline="\n")
print("updated flame_core")
