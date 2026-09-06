from pathlib import Path
for p in ["desktop/renderer/window-play.js","web/src/lib/pets/window-play.ts"]:
    t = Path(p).read_text(encoding="utf-8")
    needle = "This is the second leftover of the fungi den. Others walk a sill."
    print(p, t.count(needle), "header start", t[:80])
    print("  WARTS const", t.count('const WARTS = "warts"') + t.count('export const WARTS = "warts"'))
    print("  wartsOff: 2.55", t.count("wartsOff: 2.55"))
    print("  fly_agaric WARTS", t.count('if (key === "fly_agaric") return WARTS;'))
    print("  kind === WARTS size", t.count("if (kind === WARTS) return w.width >= 186 && w.height >= 148;"))
    print("  if (kind === WARTS)", t.count("if (kind === WARTS)"))
    print("  if (target.kind === WARTS)", t.count("if (target.kind === WARTS)"))
    print("  function wartsPoint", t.count("function wartsPoint"))
    print("  phase warts-on", t.count('"warts-on"'))
    print("  WARTS,", t.count("    WARTS,"))
    print("  wartsOffPath,", t.count("wartsOffPath,"))
