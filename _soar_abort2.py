from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
idx=0
n=0
while n<10:
  i=js.find("shouldAbort", idx)
  if i<0: break
  ls=js.rfind("\n",0,i)+1; le=js.find("\n",i)
  print(f"{i}: {js[ls:min(le,ls+160)]}")
  # if function, print more
  if "function shouldAbort" in js[ls:le] or "shouldAbort =" in js[ls:le]:
    print(js[i:i+600])
    print("---")
  idx=i+10
  n+=1

# check what Gate test actually does when run quickly
import subprocess, textwrap, tempfile, os
code = textwrap.dedent('''
const P = require("./desktop/renderer/window-play.js");
console.log("mantle", P.shouldAbort({ phase: "mantle" }, { asleep: true, cmd: "sleep" }));
console.log("spots", P.shouldAbort({ phase: "spots" }, { asleep: true, cmd: "sleep" }));
console.log("onearg sleep", P.shouldAbort({ asleep: true, cmd: "sleep" }));
console.log("len", P.shouldAbort.length);
''')
Path("_soar_abort_probe.js").write_text(code, encoding="utf-8")
