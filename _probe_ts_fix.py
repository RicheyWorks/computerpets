# restore TS from git since JS-only was written; JS stays
import subprocess
subprocess.check_call(["git","checkout","--","web/src/lib/pets/window-play.ts"])
ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
for needle in ['leave: "trumpeted"', "target.kind === TRUMPET", "trumpetOffPath", "sill-hop", "Next leftover is Rod"]:
  i=ts.find(needle)
  print(needle, i)
  if i>=0:
    print(repr(ts[max(0,i-80):i+120].replace("\n","|")))
