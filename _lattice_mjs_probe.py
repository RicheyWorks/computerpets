from pathlib import Path
p = Path("web/scripts/window-play.test.mjs")
t = p.read_text(encoding="utf-8")
i = t.find("Cap warts")
print("idx", i, "len", len(t), "lines", t.count("\n")+1)
print(t[i-80:i+80] if i>=0 else "NOT FOUND")
# last 30 lines
lines = t.splitlines()
print("last tests:")
for n, line in enumerate(lines[-8:], start=len(lines)-7):
    print(f"{n}:{line[:120]}")
# find test( Cap
for n, line in enumerate(lines):
    if "Cap warts" in line or "moss-cup" in line or "fly_agaric" in line and line.startswith("test("):
        print(f"TEST {n+1}:{line[:160]}")
