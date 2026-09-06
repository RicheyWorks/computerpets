from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# dump from plaquePoint through plaqueOffPath end
start = js.find("function plaquePoint")
# find next function after plaqueOffPath that isn't plaque*
end = js.find("function plaqueOffPath")
# find end of plaqueOffPath
brace = 0
i = js.find("{", end)
for k in range(i, len(js)):
    if js[k]=='{': brace+=1
    elif js[k]=='}':
        brace-=1
        if brace==0:
            end2=k+1
            break
print(js[start:end2])
print("\n===== LEN", end2-start)
Path("_gleam_pact_plaque_block.js").write_text(js[start:end2], encoding="utf-8")
