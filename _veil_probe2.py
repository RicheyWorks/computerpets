from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("TS FINS const", "export const FINS" in ts, ts.count("FINS"))
print("TS finsOn", "finsOn:" in ts)
print("TS lionfish", 'key === "lionfish"' in ts)
print("TS reefledge", "reefledge" in ts)
print("TS finned", "finned" in ts)
print("JS FINS", "FINS" in js, "finsPoint" in js, "finsOn" in js)
print("JS lionfish", 'key === "lionfish"' in js)
# find all fins-related exports / consts
import re
for m in re.finditer(r".{0,40}fins.{0,60}", ts):
    s=m.group(0).replace("\n"," ")
    if "function fins" in s or "const FINS" in s or "finsOn" in s or "lionfish" in s or "FINS" in s:
        print("TS:", s[:120])
print("---JS hdr Next---")
hdr=js[:js.find("*/")+2]
print(hdr[hdr.find("Next leftover"):hdr.find("Next leftover")+80])
print("---TS hdr Next---")
hdr=ts[:ts.find("*/")+2]
print(hdr[hdr.find("Next leftover"):hdr.find("Next leftover")+80])
# count fins function bodies
print("finsPath end", ts.find("export function finsHoldPath"))
print(ts[ts.find("export function finsPath"):ts.find("export function finsHoldPath")+200])
