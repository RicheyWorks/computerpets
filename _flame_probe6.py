from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('if (next.phase === "cloud-off")')
j = ts.find('if (next.phase === "sill-hop")', i)
print("between lens", j - i)
print(repr(ts[i:j]))
# Also check pick WRAP blank lines in ts
k = ts.find('leave: "clouded"')
print("pick after clouded", repr(ts[k:k+120]))
