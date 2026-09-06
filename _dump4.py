from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
# find beginPlay TEETH and stepPlay teeth phases
needles = ['kind === TEETH', 'phase === "teeth', '"teeth-on"', '"teeth-hold"', '"teeth-off"', 'DUR.teeth']
for n in needles:
  hits=[i for i,l in enumerate(lines) if n in l]
  print(n, hits[:20])
print("--- beginPlay teeth ---")
for i,l in enumerate(lines):
  if "if (kind === TEETH)" in l and i > 5000:
    # might be beginPlay
    for j in range(max(0,i-30), min(i+40,len(lines))):
      print(f"{j+1}:{lines[j]}")
    print("====")
# find all if (kind === TEETH)
print("--- all kind===TEETH ---")
for i,l in enumerate(lines):
  if "kind === TEETH" in l:
    print(i+1, l.strip()[:120])
print("--- phase teeth ---")
for i,l in enumerate(lines):
  if '"teeth' in l or "'teeth" in l:
    if any(x in l for x in ["phase", "teeth-on", "teeth-hold", "teeth-off", "case"]):
      print(i+1, l.strip()[:160])
