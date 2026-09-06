from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract quiet pick block
lines = js.splitlines()
# 5204-5220
print("PICK:")
print("\n".join(lines[5203:5225]))
print("REFIT:")
print("\n".join(lines[6138:6148]))
print("LAND:")
print("\n".join(lines[21140:21150]))
print("TICK quiet-on start:")
print("\n".join(lines[32392:32480]))
print("EXPORTS QUIET:")
print("\n".join(lines[32675:32690]))
print("EXPORTS quietPoint:")
print("\n".join(lines[33800:33830]))
print("DUR quiet:")
for i,l in enumerate(lines):
    if "quietOn" in l or (i>0 and "alignOff" in lines[i-1] and "quiet" in l):
        print(i+1, l)
