from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1 occurrence, found %d" % (label, n))
    return text.replace(old, new, 1)

def patch_js():
    p = ROOT / "desktop" / "renderer" / "window-play.js"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the eighth shore leftover. Others walk a sill. */",
        "This is the eighth shore leftover. Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Others walk a sill. */",
        "js header",
    )
    t = sub_once(
        t,
        '  const SPINES = "spines";\n  const SILL = "sill";',
        '  const SPINES = "spines";\n  const KNOBS = "knobs";\n  const SILL = "sill";',
        "js const",
    )
    t = sub_once(
        t,
        "    spinesOff: 2.14,\n    sillHop:",
        "    spinesOff: 2.14,\n    knobsOn: 3.01,\n    knobs: 1.87,\n    knobsHold: 3.38,\n    knobsOff: 2.21,\n    sillHop:",
        "js dur",
    )
    t = sub_once(
        t,
        '    if (key === "sea_urchin") return SPINES;\n    return SILL;',
        '    if (key === "sea_urchin") return SPINES;\n    if (key === "knobbed_whelk") return KNOBS;\n    return SILL;',
        "js playFor",
    )
    t = sub_once(
        t,
        "    if (kind === SPINES) return w.width >= 178 && w.height >= 162;",
        "    if (kind === SPINES) return w.width >= 178 && w.height >= 162;\n    if (kind === KNOBS) return w.width >= 193 && w.height >= 160;",
        "js size",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("js part1 ok")

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        "This is the eighth shore leftover. Others walk a sill. Same map",
        "This is the eighth shore leftover. Knurl knobs a window stool as a wrack dish: walk onto the stool, sit the knobs, then leave. Tenant still owns knob. Haste still owns hunt. Spire still owns rock. This is the ninth shore leftover. Others walk a sill. Same map",
        "ts header",
    )
    t = sub_once(
        t,
        'export const SPINES = "spines";\nexport const SILL = "sill";',
        'export const SPINES = "spines";\nexport const KNOBS = "knobs";\nexport const SILL = "sill";',
        "ts const",
    )
    t = sub_once(
        t,
        "  spinesOff: 2.14,\n  sillHop:",
        "  spinesOff: 2.14,\n  knobsOn: 3.01,\n  knobs: 1.87,\n  knobsHold: 3.38,\n  knobsOff: 2.21,\n  sillHop:",
        "ts dur",
    )
    t = sub_once(
        t,
        "typeof SPINES | typeof SILL | typeof IGNORE",
        "typeof SPINES | typeof KNOBS | typeof SILL | typeof IGNORE",
        "ts kind",
    )
    t = sub_once(
        t,
        '  | "spines-off"\n  | "sill-hop"',
        '  | "spines-off"\n  | "knobs-on"\n  | "knobs"\n  | "knobs-hold"\n  | "knobs-off"\n  | "sill-hop"',
        "ts phase",
    )
    t = sub_once(
        t,
        '"sandplate" | "tidepool"',
        '"sandplate" | "tidepool" | "wrackdish"',
        "ts side",
    )
    t = sub_once(
        t,
        '| "flats" | "spined"',
        '| "flats" | "spined" | "knobbed"',
        "ts leave",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("ts part1 ok")

if __name__ == "__main__":
    patch_js()
    patch_ts()
    print("part1 done")
