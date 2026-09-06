from pathlib import Path
for f in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t=Path(f).read_text(encoding="utf-8")
    print("====", f, "====")
    print("cyst sill", t.count('playFor("cyst"), "sill"'))
    print("pick cyst", t.count('80, "cyst"'))
    print("paramecium", t.count("paramecium"))
    # show cyst contexts briefly
    idx=0
    n=0
    while n<8:
        i=t.find("cyst", idx)
        if i<0: break
        line=t[max(0,t.rfind("\n",0,i)+1):t.find("\n",i)]
        if "cyst" in line:
            print(" ", line.strip()[:140])
        idx=i+1; n+=1
