from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["function soarPoint", "function huntPoint", "function glowPoint", "function weekPoint", "function tipPoint", "function warmPoint", "function sipPoint"]:
    i = js.find(name)
    print("===", name, i)
    print(js[i:i+520] if i >= 0 else "MISSING")
    print()
markers = [
    'const GLOW = "glow";\n  const SILL = "sill";',
    'if (key === "firefly") return GLOW;\n    return SILL;',
    "glowOff: 2.65,\n    sillHop: 0.38,",
    "if (kind === GLOW) return w.width >= 189 && w.height >= 173;\n    return w.width >= 180 && w.height >= 70;",
    'leave: "glowed"',
    "    GLOW,\n    IGNORE,",
    "glowOffPath,\n    pickTarget,",
    'if (next.phase === "sill-hop") {',
    '        leave: "glowed",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {',
    '    if (target.kind === GLOW) {\n      const hold = glowPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {',
    '        if (target.kind === GLOW) {\n          return goPhase(next, "glow-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {',
]
for s in markers:
    print("COUNT", js.count(s), repr(s[:60]))
