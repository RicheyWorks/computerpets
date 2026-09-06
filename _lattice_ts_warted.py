from pathlib import Path
t = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = t.find('"warted"')
print("warted1", i, repr(t[i-80:i+40]))
j = t.find('"warted"', i+1)
print("warted2", j, repr(t[j-40:j+40]))
# mosscup in type
k = t.find('"mosscup"')
print("mosscup", k, repr(t[k-50:k+30]))
