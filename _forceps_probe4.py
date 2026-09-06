from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find module.exports / return object
for name in ["raisePoint","clawPoint","prayPoint","prayOnPath","prayPath","raisePath","raiseOn","clawOn","sprayOn","CERCI","netPoint"]:
    # look near the end export list
    pass
idx = t.rfind("raisePoint")
print("last raisePoint context:\n", t[idx-20:idx+80])
idx = t.rfind("clawPoint")
print("last clawPoint context:\n", t[idx-20:idx+80])
idx = t.rfind("prayPoint")
print("last prayPoint context:\n", t[idx-20:idx+80])
# DUR keys
assert "cerciOn: 2.68" in t
print("DUR ok")
