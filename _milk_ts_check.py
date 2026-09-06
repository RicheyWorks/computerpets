from pathlib import Path
ts = Path(r"C:\Users\730ri\projects\ComputerPets\web\src\lib\pets\window-play.ts").read_text(encoding="utf-8").replace("\r\n","\n")
markers = [
    "This is the first leftover of the remaining hive den. Shore ten is closed. Others walk a sill.",
    'export const WAGGLE = "waggle";\nexport const SILL = "sill";',
    "  waggleOff: 2.35,\n  sillHop: 0.38,",
    "typeof CASTINGS | typeof WAGGLE | typeof SILL | typeof IGNORE;",
    '  | "waggle-on"\n  | "waggle"\n  | "waggle-hold"\n  | "waggle-off"\n  | "sill-hop"',
    '| "sandplate" | "tidepool" | "wrackdish";',
    '| "flats" | "spined" | "knobbed";',
    '  if (key === "honeybee") return WAGGLE;\n  return SILL;',
    "  if (kind === WAGGLE) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;",
    'export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {',
    '  if (next.phase === "sill-hop") {',
]
for m in markers:
    print(ts.count(m), repr(m[:70]))

# WAGGLE pick block
pick = '''  if (kind === WAGGLE) {
    const hold = wagglePoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -70 : 70;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 64 : -64;
    return {
      id: best.id,
      kind,
      side: "waxdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "waggled",
      spin: "none",
    };
  }
'''
print("pick", ts.count(pick))
refit = '''  if (target.kind === WAGGLE) {
    const hold = wagglePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {'''
print("refit", ts.count(refit))
go = '''      if (target.kind === WAGGLE) {
        return goPhase(next, "waggle-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {'''
print("go", ts.count(go))
