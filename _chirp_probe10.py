js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# find return API near CHIRP export
i=js.rfind("CHIRP")
# find module exports block
idx=js.find("    CHIRP,")
print("CHIRP comma export", idx)
idx2=js.find("\n    CHIRP\n")
print("CHIRP alone", idx2)
# show exports around chirp
import re
m=re.search(r"return \{[\s\S]{0,200}CHIRP[\s\S]{0,200}\}", js[-5000:] if False else js)
# simpler: lines with CHIRP near end
lines=js.splitlines()
for i,l in enumerate(lines):
    if "CHIRP" in l and i>28000:
        print(i+1, l[:120])
for i,l in enumerate(lines):
    if l.strip() in ("CHIRP,","CHIRP") or "CHIRP," in l and ("playFor" in lines[max(0,i-5):i+1].__str__() or True):
        if 27800 < i < 29000:
            print("near api", i+1, l)
