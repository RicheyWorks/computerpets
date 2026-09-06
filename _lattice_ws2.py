from pathlib import Path
t = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = t.find('if (next.phase === "warts-off")')
j = t.find('if (next.phase === "sill-hop")', i)
print("i", i, "j", j)
print(repr(t[i:j][-100:]))
# also pick whitespace after warted
k = t.find('leave: "warted"')
print("pick after warted js")
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
k2 = js.find('leave: "warted"')
print(repr(js[k2:k2+120]))
print("ts", repr(t[k:k+120]))
