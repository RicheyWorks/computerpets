from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks = [
    ('const HOLLOW = "hollow"', js),
    ('export const HOLLOW = "hollow"', ts),
    ('if (key === "morel") return HOLLOW', js),
    ('if (key === "morel") return HOLLOW', ts),
    ('if (kind === HOLLOW) return w.width >= 180 && w.height >= 200', js),
    ('if (kind === HOLLOW) return w.width >= 180 && w.height >= 200', ts),
    ('side: "leafmold"', js),
    ('side: "leafmold"', ts),
    ('function hollowPoint', js),
    ('export function hollowPoint', ts),
    ('next.phase === "hollow-on"', js),
    ('next.phase === "hollow-on"', ts),
    ('if (key === "fly_agaric") return WARTS', js),
    ('if (key === "oyster") return SHELF', js),
    ('if (key === "darner") return HAWK', js),
    ('const LEAN = "lean"', js),
    ('const COVER = "cover"', js),
    ('const KICK = "kick"', js),
    ('const HAWK = "hawk"', js),
    ('const WARTS = "warts"', js),
]
for needle, src in checks:
    print(("OK" if needle in src else "MISSING"), needle[:70])
print("js hollowOn", "hollowOn: 2.51" in js)
print("typeof HOLLOW", "typeof HOLLOW" in ts)
print("leafmold type", '| "leafmold"' in ts or '| "leafmold";' in ts)
