from pathlib import Path
t = Path(r"desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find sheen lick, tun dry, pale sand points for contrast
for name in ["lickPoint", "dryPoint", "sandPoint", "manyPoint", "digPoint"]:
    i = t.find("function %s" % name)
    if i < 0:
        print(name, "MISSING")
        continue
    print("====", name)
    print(t[i:i+700])
    print()
