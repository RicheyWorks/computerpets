from pathlib import Path
t = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find WindowPlayKind and warts
i = t.find("export type WindowPlayKind")
print("KIND START", i)
# find warts in that type
j = t.find('"warts"', i)
print("warts at", j, repr(t[j-120:j+40]))
print("\n--- phases ---")
print(repr(t[t.find('"warts-on"')-80:t.find('"warts-on"')+90]))
print("\n--- side mosscup ---")
print("mosscup" in t)
k = t.find("mosscup")
print(repr(t[k-40:k+40]))
