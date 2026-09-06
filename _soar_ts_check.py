from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks = [
  'export const SPOTS = "spots"',
  "spotsOn: 3.23",
  'if (key === "eagle_ray") return SPOTS',
  "if (kind === SPOTS) return w.width >= 203",
  'side: "reefsky"',
  "spotsPoint(win, sprite, work)",
  "export function spotsPoint",
  'goPhase(next, "spots-on"',
  'if (next.phase === "spots-on")',
  'if (next.phase === "spots")',
  'if (next.phase === "spots-hold")',
  'if (next.phase === "spots-off")',
  "typeof SPOTS",
  '| "reefsky"',
]
for c in checks:
  print(("OK" if c in ts else "MISSING"), c)

# approach context
i = ts.find('goPhase(next, "spots-on"')
print("approach ctx:", ts[i-200:i+120] if i>=0 else "NO")
# phase before sill-hop
i = ts.find('if (next.phase === "spots-off")')
j = ts.find('if (next.phase === "sill-hop")', i if i>=0 else 0)
print("spots-off to sill-hop", j-i if i>=0 and j>=0 else "bad")
# beginPlay after spotsOffPath
i = ts.find("export function spotsOffPath")
j = ts.find("export function beginPlay", i if i>=0 else 0)
print("spotsOff then beginPlay gap", j-i if i>=0 and j>=0 else "bad")
