from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks = [
 ("js leave sung+WRAP", '        leave: "sung",\n        spin: "none",\n      };\n    }\n\n\n\n        if (kind === WRAP) {'),
 ("js leave sung+WRAP alt", '        leave: "sung",\n        spin: "none",\n      };\n    }\n\n    if (kind === WRAP) {'),
 ("js song refit+BURY", "    if (target.kind === SONG) {\n      const hold = songPoint(win, sprite, work);\n      return { ...target, holdX: hold.x, holdLift: hold.lift };\n    }\n    if (target.kind === BURY) {"),
 ("js song approach+WRAP", '        if (target.kind === SONG) {\n          return goPhase(next, "song-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);\n        }\n        if (target.kind === WRAP) {'),
 ("js song-off then sill", '    if (next.phase === "song-off") {'),
 ("js beginPlay", "  function beginPlay(target, petX) {"),
 ("js DUR songOff", "    songOff: 2.34,\n    sillHop: 0.38,"),
 ("js size song", "    if (kind === SONG) return w.width >= 190 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;"),
 ("js SONG const", '  const SONG = "song";\n  const SILL = "sill";'),
 ("js api", "    EMERGE,\n    SONG,\n    IGNORE,"),
 ("js api paths", "    songOffPath,\n    pickTarget,"),
 ("ts leave sung", '      leave: "sung",\n      spin: "none",\n    };\n  }\n\n\n\n  if (kind === WRAP) {'),
 ("ts leave sung alt", '      leave: "sung",\n      spin: "none",\n    };\n  }\n\n  if (kind === WRAP) {'),
 ("ts kind union", "typeof PRAY | typeof EMERGE | typeof SONG | typeof SILL | typeof IGNORE"),
 ("ts phases", '  | "song-off"\n  | "sill-hop"'),
 ("ts side", '"greenhinge" | "soilhusk" | "grassdish"'),
 ("ts leave union", '"prayed" | "emerged" | "sung"'),
 ("ts DUR", "  songOff: 2.34,\n  sillHop: 0.38,"),
 ("ts SONG const", 'export const SONG = "song";\nexport const SILL = "sill";'),
 ("ts beginPlay", "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"),
]
for name, s in checks:
    print(f"{name}: {js.count(s) if name.startswith('js') else ts.count(s)}")
# show context around sung leave
i = js.find('leave: "sung"')
print("JS sung context:", repr(js[i-20:i+120]))
i = ts.find('leave: "sung"')
print("TS sung context:", repr(ts[i-20:i+120]))
