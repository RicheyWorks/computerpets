from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for label, blob in [("ts", ts), ("js", js)]:
    for needle in [
        'leave: "froze"',
        'side: "pencilstem"',
        'if (key === "stick") return FREEZE;',
        'const FREEZE = "freeze";',
        'export const FREEZE = "freeze";',
        'freezeOff: 2.74,',
        'if (kind === FREEZE) return w.width >= 196 && w.height >= 188;',
        'if (next.phase === "sill-hop")',
        'function beginPlay(target, petX)',
        'export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {',
        '"inkdusk" | "preyair" | "pencilstem"',
        '"glowed" | "hawked" | "froze"',
        'typeof HAWK | typeof FREEZE | typeof SILL | typeof IGNORE',
        '  | "freeze-off"\n  | "sill-hop"',
        'FREEZE,\n    IGNORE',
        'freezeOffPath,\n    pickTarget',
        'if (target.kind === FREEZE) {\n      const hold = freezePoint',
        'if (target.kind === FREEZE) {\n    const hold = freezePoint',
        'return goPhase(next, "freeze-on"',
        'if (kind === WRAP)',
    ]:
        print(label, blob.count(needle), repr(needle[:70]))
