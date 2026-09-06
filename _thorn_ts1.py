from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Others walk a sill. Same map as desktop `window-play.js`.",
        "Token flats a sill pan as a sand plate: walk onto the pan, sit the flat, then leave. Cache still owns bury. Pale still owns sand. Spire still owns rock. This is the seventh shore leftover. Thorn spines a window well as a tide pool: walk into the well, sit the spines, then leave. Spine still owns bristle. Burr still owns ball. Token still owns flat. This is the eighth shore leftover. Others walk a sill. Same map as desktop `window-play.js`.",
        "ts header",
    )
    t = sub_once(
        t,
        'export const FLAT = "flat";\nexport const SILL = "sill";',
        'export const FLAT = "flat";\nexport const SPINES = "spines";\nexport const SILL = "sill";',
        "ts SPINES const",
    )
    t = sub_once(
        t,
        "  flatOn: 2.87,\n  flat: 1.73,\n  flatHold: 3.22,\n  flatOff: 2.07,\n  sillHop: 0.38,",
        "  flatOn: 2.87,\n  flat: 1.73,\n  flatHold: 3.22,\n  flatOff: 2.07,\n  spinesOn: 2.94,\n  spines: 1.80,\n  spinesHold: 3.30,\n  spinesOff: 2.14,\n  sillHop: 0.38,",
        "ts DUR",
    )
    t = sub_once(
        t,
        "typeof ROCK | typeof FLAT | typeof SILL | typeof IGNORE;",
        "typeof ROCK | typeof FLAT | typeof SPINES | typeof SILL | typeof IGNORE;",
        "ts WindowPlayKind",
    )
    t = sub_once(
        t,
        '  | "flat-on"\n  | "flat"\n  | "flat-hold"\n  | "flat-off"\n  | "sill-hop"',
        '  | "flat-on"\n  | "flat"\n  | "flat-hold"\n  | "flat-off"\n  | "spines-on"\n  | "spines"\n  | "spines-hold"\n  | "spines-off"\n  | "sill-hop"',
        "ts PlayPhase",
    )
    t = sub_once(
        t,
        '| "sidepool" | "sandplate";',
        '| "sidepool" | "sandplate" | "tidepool";',
        "ts side union",
    )
    t = sub_once(
        t,
        '| "sides" | "flats";',
        '| "sides" | "flats" | "spined";',
        "ts leave union",
    )
    t = sub_once(
        t,
        '  if (key === "sand_dollar") return FLAT;\n  return SILL;',
        '  if (key === "sand_dollar") return FLAT;\n  if (key === "sea_urchin") return SPINES;\n  return SILL;',
        "ts playFor",
    )
    t = sub_once(
        t,
        "  if (kind === FLAT) return w.width >= 190 && w.height >= 184;\n    return w.width >= 180 && w.height >= 70;",
        "  if (kind === FLAT) return w.width >= 190 && w.height >= 184;\n  if (kind === SPINES) return w.width >= 178 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;",
        "ts size gate",
    )
    t = sub_once(
        t,
        '''  if (kind === FLAT) {
    const hold = flatPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -78 : 78;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 71 : -71;
    return {
      id: best.id,
      kind,
      side: "sandplate",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "flats",
      spin: "none",
    };
  }''',
        '''  if (kind === FLAT) {
    const hold = flatPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -78 : 78;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 71 : -71;
    return {
      id: best.id,
      kind,
      side: "sandplate",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "flats",
      spin: "none",
    };
  }
  if (kind === SPINES) {
    const hold = spinesPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -80 : 80;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 73 : -73;
    return {
      id: best.id,
      kind,
      side: "tidepool",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "spined",
      spin: "none",
    };
  }''',
        "ts pickTarget",
    )
    t = sub_once(
        t,
        '''  if (target.kind === FLAT) {
    const hold = flatPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        '''  if (target.kind === FLAT) {
    const hold = flatPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === SPINES) {
    const hold = spinesPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {''',
        "ts refitTarget",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("ts part1 ok")

if __name__ == "__main__":
    patch_ts()
