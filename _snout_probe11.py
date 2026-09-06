from pathlib import Path
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i = h.find('test("Snout leftover')
print(h[i:i+280])
print("next leftover is Click" in h[:i+800] or "next leftover is Click" in h)
print("Do not start Click", "Do not start Click" in h)
