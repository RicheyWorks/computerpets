import pathlib
cjs = pathlib.Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
lines = cjs.splitlines()
for i in range(1100, 1150):
  print(f"{i+1}:{lines[i]}")
print("--- all pickTarget nimbus ---")
for i,l in enumerate(lines,1):
  if 'pickTarget' in l and 'nimbus' in l:
    print(i, l.strip()[:120])
print("--- playFor silica sill sample ---")
for i,l in enumerate(lines,1):
  if 'silica' in l and 'sill' in l:
    print(i, l.strip()[:120])
    if i > 50: break
