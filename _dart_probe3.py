from pathlib import Path
for p in ["desktop/renderer/window-play.js","web/src/lib/pets/window-play.ts"]:
    t=Path(p).read_text(encoding="utf-8")
    i=t.find("function weekLampDir")
    print("===", p, i)
    print(t[i:i+350])
    print()
# README header snippet
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    i=t.find("Spark the firefly")
    print(p, repr(t[i-80:i+220]))
# keys for Hook/Haste
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for k in ['"osprey"','"falcon"','"hawk"','"centipede"','"hook"']:
    print(k, js.count("key === "+k), [js[j-40:j+60] for j in [js.find("key === "+k)] if j>=0])
