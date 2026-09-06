from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find flip-related function defs and exports
for i,line in enumerate(js.splitlines()):
    if re.search(r'function flip|flipPath|flipHold|FLIP =|key === "hognose"|phase === "flip"', line):
        print(f"{i+1}:{line[:120]}")
print("--- snap ---")
for i,line in enumerate(js.splitlines()):
    if re.search(r'key === "snapper"|key === "venus_flytrap"|SNAP =|COUNT =', line):
        print(f"{i+1}:{line[:120]}")
# what is snapper
roster=Path("desktop/renderer/roster.json").read_text(encoding="utf-8")
for key in ["snapper","venus_flytrap","hognose"]:
    idx=roster.find('"key":"%s"'%key)
    if idx<0: idx=roster.find('"key": "%s"'%key)
    print(key, roster[idx:idx+120] if idx>=0 else "no")
