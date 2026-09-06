from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = t.find('if (next.phase === "warts-off")')
j = t.find('if (next.phase === "sill-hop")', i)
print("i", i, "j", j)
chunk = t[i:j]
print("LEN", len(chunk))
print(repr(chunk[-80:]))
print("--- full end ---")
print(repr(chunk))
