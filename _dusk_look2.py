from pathlib import Path
for name in ["web/scripts/window-play.test.mjs", "desktop/renderer/window-play.test.cjs"]:
    t = Path(name).read_text(encoding="utf-8")
    print("====", name)
    print("terminator sill", t.count('playFor("terminator"), "sill"'))
    print("nexus sill", t.count('playFor("nexus"), "sill"'))
    i = t.find('playFor("terminator"), "sill"')
    if i >= 0:
        print("context", repr(t[max(0,i-180):i+80]))
    # other guests
    for needle in ["other guests do not clone", "they walk a sill", "generic-sill"]:
        print(needle, t.find(needle))