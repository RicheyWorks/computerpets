ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
i=ts.find('"trumpet-off"')
print("phase trumpet-off contexts:")
idx=0
while True:
  j=ts.find('"trumpet-off"', idx)
  if j<0: break
  print(j, repr(ts[j:j+80]))
  idx=j+1
print("--- pick ---")
i=ts.find('leave: "trumpeted"')
print(repr(ts[i-200:i+80]))
print("--- refit ---")
i=ts.find("if (target.kind === TRUMPET)")
print(repr(ts[i:i+160]))
print("--- approach ---")
i=ts.find('target.kind === TRUMPET')
# find goPhase trumpet-on
i=ts.find('goPhase(next, "trumpet-on"')
print(repr(ts[i-120:i+150]))
print("--- phases step ---")
i=ts.find('next.phase === "trumpet-off"')
print(repr(ts[i:i+500]))
print("--- trumpetOffPath end ---")
i=ts.find("export function trumpetOffPath")
j=ts.find("\nexport function ", i+10)
print("next export at", j, ts[j+1:j+60])
print(repr(ts[j-80:j+20]))
# WindowPlayKind TRUMPET
i=ts.find("typeof TRUMPET | typeof SILL")
print("kind", repr(ts[i:i+60]))
# side
i=ts.find('"trumpetrim"')
print("side", repr(ts[i-20:i+40]))
